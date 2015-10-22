(ns pennygame.core
  (:require-macros [cljs.core.async.macros :refer [go]]
                   [pennygame.macros :refer [spy]])
  (:require [cljs.core.async :as async :refer [chan <! put! timeout]]
            [cljs.core.match :refer-macros [match]]
            [vdom.elm :refer [foldp render!]]
            [pennygame.sizes :as sizes]
            [pennygame.ui :as ui]))

(enable-console-print!)

(defn dice-positions [model {w :width :keys [x]}]
  (let [ss (->> model :scenarios first :stations)
        hs (map :height ss)
        ys (map :y ss)
        ds (fn [d y h]
             (assoc d
               :x x
               :y (+ y h (- (/ w 2)))
               :width w
               :height w))]
    (update model :dice (partial map ds) ys hs)))

(defn step [{:keys [scenarios] :as model} action]
  (match action
    :no-op model
    [:size w h] (let [left 150]
                  (-> model
                    (assoc :width w :height h)
                    (update :scenarios (partial sizes/scenarios {:x left :width (- w left) :height h}))
                    (dice-positions {:x 45 :width (- left 90)})))
    [:roll dice] (update model :dice (partial map #(assoc %1 :value %2)) dice)))

(def initial-model
  {:dice [{:value 0
           :type :supply}
          {:value 0
           :type :processing}
          {:value 0
           :type :processing}
          {:value 0
           :type :processing}
          {:value 0
           :type :processing}]
   :scenarios [{:index 0
                :stations [{:index 0
                            :type :supply
                            :die 0}
                           {:index 1
                            :type :processing
                            :die 1}
                           {:index 2
                            :type :processing
                            :die 2}
                           {:index 3
                            :type :processing
                            :die 3}
                           {:index 4
                            :type :processing
                            :die 4}
                           {:index 5
                            :type :distribution}]}
               {:index 1
                :stations [{:index 0
                            :type :supply
                            :die 0}
                           {:index 1
                            :type :processing
                            :die 1}
                           {:index 2
                            :type :processing
                            :die 2}
                           {:index 3
                            :type :processing
                            :die 3}
                           {:index 4
                            :type :processing
                            :die 4}
                           {:index 5
                            :type :distribution}]}
               {:index 2
                :stations [{:index 0
                            :type :supply
                            :die 0}
                           {:index 1
                            :type :processing
                            :die 1}
                           {:index 2
                            :type :processing
                            :die 2}
                           {:index 3
                            :type :processing
                            :die 3}
                           {:index 4
                            :type :processing
                            :die 4}
                           {:index 5
                            :type :distribution}]}]})

(defonce actions (chan))

(defonce models (foldp step initial-model actions))

(defonce setup
  (render! (async/map #(ui/ui % actions) [models]) js/document.body))

(go
  (<! (timeout 30))
  (let [size (juxt #(.-width %) #(.-height %))
        [w h] (-> js/document
                (.getElementById "space")
                .getBoundingClientRect
                size)]
    (put! actions [:size w h])))

(defn figwheel-reload []
  (put! actions :no-op))
