(ns pennygame.core
  (:require-macros [cljs.core.async.macros :refer [go]]
                   [pennygame.macros :refer [spy]])
  (:require [cljs.core.async :as async :refer [chan <! put! timeout]]
            [cljs.core.match :refer-macros [match]]
            [vdom.elm :refer [foldp render!]]))

(enable-console-print!)

(defn space []
  (.getElementById js/document "space"))

(def size (juxt #(.-width %) #(.-height %)))

(defn translate [x y]
  (str "translate(" x "," y ")"))

(defn region [w h]
  [:g {:transform (str "scale(0.95) translate(" (- (/ w 2)) "," (- (/ h 2)) ")")}
   [:rect {:width w :height h}]])

(defn supply [[w h]]
  [:g {:class "supply"}
   (region w h)])

(defn station [[w h] i _]
  [:g {:class "station"
       :transform (translate 0 (* h i))}
   (region w h)])

(defn distribution [[w h]]
  [:g {:class "distribution"}
   (region w h)])

(defn scenario [[w h] i {:keys [stations]}]
  (let [eh (/ h 15)
        re (- h (* 2 eh))
        h' (/ re (count stations))]
    [:g {:class "scenario" :transform (translate (+ (* w i) (/ w 2)) 0)}
     [:g {:transform (translate 0 (- (/ eh 2) 2))}
      (supply [w eh])]
     [:g {:transform (translate 0 (+ eh (/ h' 2)))}
      (map-indexed (partial station [w h']) stations)]
     [:g {:transform (translate 0 (+ 2 (- h (/ eh 2))))}
      (distribution [w eh])]]))

(defn ui [actions {:keys [scenarios]}]
  [:svg {:id "space" :width "100%" :height "100%"}
   (when-let [s (space)]
     (let [[w h] (size (.getBoundingClientRect s))
           w (/ w (count scenarios))]
       (map-indexed (partial scenario [w h]) scenarios)))])

(defn step [model action]
  (match action
    :no-op model))

(def initial-model
  {:scenarios [{:stations [{} {} {} {}]}
               {:stations [{} {} {} {}]}
               {:stations [{} {} {} {}]}]})

(defonce actions (chan))

(defonce models (foldp step initial-model actions))

(defonce setup
  (render! (async/map #(ui actions %) [models]) js/document.body))

(go
  (<! (timeout 30))
  (put! actions :no-op))

(defn figwheel-reload []
  (put! actions :no-op))
