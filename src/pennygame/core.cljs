(ns pennygame.core
  (:require-macros [cljs.core.async.macros :refer [go]]
                   [pennygame.macros :refer [spy]])
  (:require [cljs.core.async :as async :refer [chan >! <! put! timeout]]
            [cljs.core.match :refer-macros [match]]
            [vdom.elm :refer [foldp render!]]
            [pennygame.animations :as animations]
            [pennygame.dom :as dom]
            [pennygame.sizes :as sizes]
            [pennygame.states :as states]
            [pennygame.settings :as settings]
            [pennygame.updates :as u]
            [pennygame.ui :as ui]))

(enable-console-print!)

(def initial-model states/example)

(defn dice-positions [model {w :width :keys [x]}]
  (let [ss (->> model :scenarios first :stations (drop 1))
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
      (when (pos? n)
        (>! actions [:run n animations?])))))

(defn step [{:keys [scenarios] :as model} action]
  (match action
    :no-op model
    [:size w h] (let [left 150]
                  (-> model
                    (assoc :width w :height h)
                    (update :scenarios (partial sizes/scenarios {:x left :width (- w left) :height h}))
                    (dice-positions {:x 45 :width (- left 90)})))
    :set-lengths (u/stations model (fn [{:keys [id] :as station}]
                                     (if-let [path (dom/penny-path id)]
                                       (assoc station :length (.getTotalLength path))
                                       station)))
    [:run n animations?] (do
                           (run-steps n animations?)
                           model)
    :roll (do
            (-> model
              (update :step inc)
              (update :dice u/roll
                (vec (repeatedly 5 #(->> (js/Math.random) (* 6) inc int))))))
    :determine-capacity (u/determine-capacities model)
    [:intaking v] (u/stations model #(assoc % :intaking? v))
    :transfer-to-processed (u/transfer-to-processed model)
    :transfer-to-next-station (u/take-supplier-processed model)
    :set-spacing (u/spacing model)
    [:dropping v] (u/stations model #(assoc % :dropping? v))
    :integrate (u/integrate-incoming model)
    :update-stats (u/stats-history model)))

(defonce models (foldp step initial-model actions))
(defonce setup (render! (async/map #(ui/ui % emit) [models]) js/document.body))

(go
  (<! (timeout 30))
  (let [size (juxt #(.-width %) #(.-height %))
        [w h] (-> js/document (.getElementById "space") .getBoundingClientRect size)]
    (put! actions [:size w h]))
  (<! (timeout 100))
  (put! actions :set-lengths))

(defn figwheel-reload []
  (put! actions :no-op))
