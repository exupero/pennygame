(ns pennygame.core
  (:require-macros [cljs.core.async.macros :refer [go]]
                   [pennygame.macros :refer [spy]])
  (:require [cljs.core.async :as async :refer [chan >! <! put! timeout alts!]]
            [cljs.core.match :refer-macros [match]]
            [vdom.elm :refer [foldp render!]]
            [pennygame.animations :as animations]
            [pennygame.dom :as dom]
            [pennygame.sizes :as sizes]
            [pennygame.states :as states]
            [pennygame.settings :as settings]
            [pennygame.statistics :as statistics]
            [pennygame.updates :as u]
            [pennygame.ui :as ui]))

(enable-console-print!)

(defn dice-positions [model {w :width :keys [x]}]
  (let [ss (->> model :scenarios (filter :color) first :stations (drop 1))
        hs (map :height ss)
        ys (map :y ss)
        ds (fn [d y h]
             (assoc d
               :x x
               :y (+ y h (- 0 (/ w 2) sizes/penny))
               :width w
               :height w))]
    (update model :dice (partial map ds) ys hs)))

(defonce actions (chan))
(def emit #(put! actions %))

(defn run-steps [n animations?]
  (go
    (>! actions :roll)
    (>! actions :determine-capacity)
    (when animations?
      (>! actions [:intaking true])
      (<! (animations/run))
      (>! actions [:intaking false]))
    (>! actions :transfer-to-processed)
    (>! actions :transfer-to-next-station)
    (>! actions :set-spacing)
    (when animations?
      (>! actions [:dropping true])
      (<! (animations/run))
      (>! actions [:dropping false]))
    (>! actions :integrate)
    (>! actions :update-stats)
    (when-not animations?
      (<! (timeout (@settings/timing :step))))
    (let [n (dec n)]
      (if (pos? n)
        (>! actions [:run-next n animations?])
        (>! actions [:running false])))))

(defn initialize-setup []
  (go
    (<! (timeout 50))
    (let [size (juxt #(.-width %) #(.-height %))
          [w h] (-> js/document (.getElementById "space") .getBoundingClientRect size)]
      (put! actions [:size w h]))
    (<! (timeout 100))
    (put! actions :set-lengths)
    (<! (timeout 100))
    (put! actions :set-spacing)))

(defn generate-averages [original current]
  (let [average (statistics/averager current)
        steps (current :step)
        dt 100]
    (go
      (>! actions [:average (statistics/stats current)])
      (<! (timeout dt))
      (loop [i 0]
        (when (< i 50)
          (>! actions [:average (average (statistics/run steps original))])
          (<! (timeout dt))
          (recur (inc i)))))))

(defn step [{:keys [scenarios] :as model} action]
  (match action
    :no-op model
    [:size w h] (let [left 150]
                  (-> model
                    (assoc-in [:setup :width] w)
                    (assoc-in [:setup :height] h)
                    (update-in [:setup :scenarios] (partial sizes/scenarios {:x left :width (- w left) :height h}))
                    (update :setup dice-positions {:x 45 :width (- left 90)})))
    :set-lengths (update model :setup u/stations (fn [{:keys [id] :as station}]
                                                   (if-let [path (dom/penny-path id)]
                                                     (assoc station :length (.getTotalLength path))
                                                     station)))
    [:setup s] (do
                 (initialize-setup)
                 (let [setup (-> states/setups s u/initialize-tracer)]
                   (assoc model
                          :setup setup
                          :original-setup setup
                          :running? false)))
    [:running v] (assoc model :running? v)
    [:run n animations?] (do
                           (run-steps n animations?)
                           (assoc model :running? true))
    [:run-next n animations?] (do
                                (when (model :running?)
                                  (run-steps n animations?))
                                model)
    [:execute n] (update model :setup #(statistics/run n %))
    :roll (-> model
            (update-in [:setup :step] inc)
            (update :setup u/roll-dice (repeatedly #(->> (js/Math.random) (* 6) inc int))))
    :determine-capacity (update model :setup u/determine-capacities)
    [:intaking v] (update model :setup u/stations #(assoc % :intaking? v))
    :transfer-to-processed (update model :setup u/transfer-to-processed)
    :transfer-to-next-station (update model :setup u/take-supplier-processed)
    :set-spacing (update model :setup u/spacing)
    [:dropping v] (update model :setup u/stations #(assoc % :dropping? v))
    :integrate (update model :setup u/integrate-incoming)
    :update-stats (update model :setup u/stats-history)
    [:info v] (assoc model :info? v)
    [:graphs v] (assoc model :graphs? v)
    [:averages v] (if v
                    (do
                      (generate-averages (model :original-setup) (model :setup))
                      model)
                    (update model :setup dissoc :averages))
    [:average avg] (assoc-in model [:setup :averages] avg)))

(defonce models (foldp step {} actions))
(defonce setup (render! (async/map #(ui/ui % emit) [models]) js/document.body))
(defonce initial-model
  (go
    (>! actions [:setup :basic])))

(defn figwheel-reload []
  (put! actions :no-op))
