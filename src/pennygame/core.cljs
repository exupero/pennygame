(ns pennygame.core
  (:require-macros [cljs.core.async.macros :refer [go]]
                   [pennygame.macros :refer [spy]])
  (:require [cljs.core.async :as async :refer [chan <! put! timeout]]
            [cljs.core.match :refer-macros [match]]
            [vdom.elm :refer [foldp render!]]
            [pennygame.sizes :as sizes]
            [pennygame.states :as states]
            [pennygame.settings :as settings]
            [pennygame.updates :as update]
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

(defn step [{:keys [scenarios] :as model} action]
  (match action
    :no-op model

    [:size w h]
    (let [left 150]
      (-> model
        (assoc :width w :height h)
        (update :scenarios (partial sizes/scenarios {:x left :width (- w left) :height h}))
        (dice-positions {:x 45 :width (- left 90)})))

    [:roll dice]
    (update model :dice (partial map #(assoc %1 :value %2)) dice)

    [:output counts]
    (update model :scenarios update/output counts)

    [:input counts]
    (update model :scenarios update/input counts)))

(defonce models (foldp step states/example actions))

(defonce setup
  (render! (async/map #(ui/ui % actions) [models]) js/document.body))

(go
  (<! (timeout 30))
  (let [size (juxt #(.-width %) #(.-height %))
        [w h] (-> js/document (.getElementById "space") .getBoundingClientRect size)]
    (put! actions [:size w h]))
  (<! (timeout 70))
  (put! actions :no-op))

(defn figwheel-reload []
  (put! actions :no-op))
