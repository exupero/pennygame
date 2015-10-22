(ns pennygame.core
  (:require-macros [cljs.core.async.macros :refer [go]]
                   [pennygame.macros :refer [spy]])
  (:require [cljs.core.async :as async :refer [chan <! put! timeout]]
            [cljs.core.match :refer-macros [match]]
            [vdom.elm :refer [foldp render!]]
            [pennygame.sizes :as sizes]
            [pennygame.ui :as ui]))

(enable-console-print!)

(defn step [{:keys [scenarios] :as model} action]
  (match action
    :no-op model
    [:size w h] (-> model
                  (assoc :width w :height h)
                  (update :scenarios
                          (let [x 150]
                            (partial sizes/scenarios
                                     {:x x
                                      :width (- w x)
                                      :height h}))))))

(def initial-model
  {:scenarios [{:index 0
                :stations [{:index 0
                            :type :supply}
                           {:index 1
                            :type :processing}
                           {:index 2
                            :type :processing}
                           {:index 3
                            :type :processing}
                           {:index 4
                            :type :processing}
                           {:index 5
                            :type :distribution}]}
               {:index 1
                :stations [{:index 0
                            :type :supply}
                           {:index 1
                            :type :processing}
                           {:index 2
                            :type :processing}
                           {:index 3
                            :type :processing}
                           {:index 4
                            :type :processing}
                           {:index 5
                            :type :distribution}]}
               {:index 2
                :stations [{:index 0
                            :type :supply}
                           {:index 1
                            :type :processing}
                           {:index 2
                            :type :processing}
                           {:index 3
                            :type :processing}
                           {:index 4
                            :type :processing}
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
