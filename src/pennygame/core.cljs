(ns pennygame.core
  (:require-macros [cljs.core.async.macros :refer [go]]
                   [pennygame.macros :refer [spy]])
  (:require [cljs.core.async :as async :refer [chan >! <! put! timeout]]
            [cljs.core.match :refer-macros [match]]
            [vdom.elm :refer [foldp render!]]
            [pennygame.sizes :as sizes]
            [pennygame.states :as states]
            [pennygame.updates :as u]
            [pennygame.ui :as ui]))

(enable-console-print!)

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

(defn run-step []
  (go
    (>! actions :determine-capacity)
    (>! actions :intake)
    (>! actions :transfer-to-processed)
    (>! actions :transfer-to-next-station)
    (>! actions :space-pennies)
    (>! actions :drop-incoming)
    (>! actions :integrate)
    (>! actions :update-stats)))

(defn run-steps [steps]
  (go
    (doseq [i (range steps)]
      (>! actions :roll)
      (<! (timeout 250)))))

(defn step [{:keys [scenarios] :as model} action]
  (match action
    :no-op model
    [:size w h] (let [left 150]
                  (-> model
                    (assoc :width w :height h)
                    (update :scenarios (partial sizes/scenarios {:x left :width (- w left) :height h}))
                    (dice-positions {:x 45 :width (- left 90)})))
    :set-lengths (update model :scenarios u/lengths)
    [:run steps] (do (run-steps steps) model)
    :roll (do
            (run-step)
            (-> model
              (update :step inc)
              (update :dice u/roll
                (vec (repeatedly 5 #(->> (js/Math.random) (* 6) inc int))))))
    :determine-capacity (u/determine-capacities model)
    :intake model
    :transfer-to-processed (u/transfer-to-processed model)
    :transfer-to-next-station (u/take-supplier-processed model)
    :space-pennies (u/spacing model)
    :drop-incoming model
    :integrate (u/integrate-incoming model)
    :update-stats (u/stats-history model)))

(defonce models (foldp step states/example actions))

(def emit #(put! actions %))

(defonce setup
  (render! (async/map #(ui/ui % emit) [models]) js/document.body))

(go
  (<! (timeout 30))
  (let [size (juxt #(.-width %) #(.-height %))
        [w h] (-> js/document (.getElementById "space") .getBoundingClientRect size)]
    (put! actions [:size w h]))
  (<! (timeout 70))
  (put! actions :set-lengths))

(defn figwheel-reload []
  (put! actions :no-op))
