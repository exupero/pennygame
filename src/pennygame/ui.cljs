(ns pennygame.ui
  (:require-macros [pennygame.macros :refer [spy]])
  (:require [cljs.core.async :refer [put!]]
            [pennygame.sizes :as s]))

(defn pair [[x y]]
  (str x "," y))

(defn path [pts]
  (when (seq pts)
    (->> pts
      (map pair)
      (interpose "L")
      (apply str "M"))))

(defn closed-path [pts]
  (str (path pts) "Z"))

(defn translate [x y]
  (str "translate(" x "," y ")"))

(defn dots [n]
  (condp = n
    0 []
    1 [[0 0]]
    2 [[-1 -1] [1 1]]
    3 [[-1 -1] [0 0] [1 1]]
    4 [[-1 -1] [-1 1] [1 -1] [1 1]]
    5 [[-1 -1] [-1 1] [0 0] [1 -1] [1 1]]
    6 [[-1 -1] [-1 0] [-1 1] [1 -1] [1 0] [1 1]]))

(defn die [{w :width h :height :keys [x y value]}]
  (let [half (/ w 2)]
    [:g {:transform (translate half half)}
     [:rect {:class "die"
             :x (- half)
             :y (- half)
             :width w
             :height w}]
     (let [s (partial * (/ w 4))]
       (for [[x y] (dots value)]
         [:circle {:cx (s x)
                   :cy (s y)
                   :r (/ w 10)}]))]))

(defn penny-path [w h]
  (let [half (/ s/penny 2)
        left half
        right (- w half)]
    (loop [ps []
           opens-left true
           y (- h half)]
      (if (pos? y)
        (recur (concat ps (if opens-left
                            [[right y] [left y]]
                            [[left y] [right y]]))
               (not opens-left)
               (- y s/penny))
        [:path {:class "penny-path"
                :d (path ps)}]))))

(defn shelves [w h]
  (loop [ss []
         opens-left true
         y (- h s/penny)]
    (if (pos? y)
      (recur (conj ss [:line {:class "shelf"
                              :transform (translate 0 y)
                              :x1 (if opens-left s/penny 0)
                              :x2 (if opens-left w (- w s/penny))}])
             (not opens-left)
             (- y s/penny))
      [:g {} (apply list ss)])))

(defn bin [w h]
  [:rect {:class "bin" :width w :height h}])

(defn spout [y w]
  (let [sp 3
        top (- s/penny)
        bottom (+ sp s/penny)
        entrance-left (- w s/penny)]
    [:path {:class "spout"
            :transform (translate 0 y)
            :d (closed-path [[w top]
                             [w bottom]
                             [0 bottom]
                             [0 sp]
                             [entrance-left sp]
                             [entrance-left top]])}]))

(defn penny [bottom {:keys [x y]}]
  [:circle {:class "penny"
            :cx x
            :cy y
            :r (- (/ s/penny 2) 2)}])

(defmulti station :type)

(defmethod station :supply [{w :width :keys [bin-h spout-y]}]
  [:g {:class "supply"}
   (shelves w bin-h)
   (bin w bin-h)
   (spout spout-y w)])

(defmethod station :processing [{w :width :keys [bin-h spout-y]}]
  [:g {:class "station"}
   (penny-path w bin-h)
   (shelves w bin-h)
   (bin w bin-h)
   (spout spout-y w)])

(defmethod station :distribution [{w :width :keys [bin-h]}]
  [:g {:class "supply"}
   (bin w bin-h)])

(defn scenario [{:keys [x stations]}]
  [:g {:class "scenario" :transform (translate x 0)}
   (for [{:keys [y] :as s} stations]
     [:g {:transform (translate 0 y)}
      (station s)])])

(defn ui [{:keys [dice scenarios]} actions]
  [:main {}
   [:button {:style {:position :fixed :left 0 :top 0}
              :onclick (fn [] (put! actions [:roll (repeatedly 5 #(->> (js/Math.random) (* 6) inc int))]))}
     "Roll"]
     [:svg {:id "space" :width "100%" :height "100%"}
      (for [{:keys [x y] :as d} dice]
        [:g {:transform (translate x y)}
         (die d)])
      (map scenario scenarios)] ])
