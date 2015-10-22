(ns pennygame.ui
  (:require-macros [pennygame.macros :refer [spy]])
  (:require [cljs.core.async :refer [put!]]))

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

(def *size* 20)

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
    [:g {:transform (translate (+ half x)
                               (+ half (- y (/ *size* 2))))}
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

(defn spout [w]
  (let [s 3]
    [:path {:class "spout"
            :d (closed-path [[w (- *size*)]
                             [w (+ s *size*)]
                             [0 (+ s *size*)]
                             [0 s]
                             [(- w *size*) s]
                             [(- w *size*) (- *size*)]])}]))

(defmulti station :type)

(defmethod station :supply [{w :width h :height :keys [y]}]
  [:g {:class "supply"
       :transform (translate 0 y)}
   (let [bottom (- h *size*)]
     (list
       [:rect {:class "bin"
               :width w :height bottom}]
       [:g {:transform (translate 0 bottom)}
        (spout w)]))])

(defmethod station :processing [{w :width h :height :keys [y]}]
  [:g {:class "station"
       :transform (translate 0 y)}
   (let [bottom (- h *size*)]
     (list
       [:rect {:class "bin"
               :width w :height bottom}]
       [:g {:transform (translate 0 bottom)}
        (spout w)]))])

(defmethod station :distribution [{w :width h :height :keys [y]}]
  [:g {:class "supply"
       :transform (translate 0 y)}
   [:rect {:class "bin"
           :width w :height h}]])

(defn scenario [{:keys [x stations]}]
  [:g {:class "scenario" :transform (translate x 0)}
   (map station stations)])

(defn ui [{:keys [dice scenarios]} actions]
  [:main {}
   [:button {:style {:position :fixed :left 0 :top 0}
              :onclick #(put! actions [:roll [1 2 3 4 5]])}
     "Roll"]
     [:svg {:id "space" :width "100%" :height "100%"}
      (map die dice)
      (map scenario scenarios)] ])
