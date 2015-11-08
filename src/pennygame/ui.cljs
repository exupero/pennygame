(ns pennygame.ui
  (:require-macros [pennygame.macros :refer [spy]])
  (:require [vdom.hooks :refer [hook]]
            [pennygame.settings :as settings]
            [pennygame.sizes :as s]
            [pennygame.dom :as dom]
            [pennygame.geometry :as g]
            [pennygame.animations :as a]))

(defn pair [[x y]]
  (str x "," y))

(defn curve [[x0 y0] [x1 y1] [x2 y2]]
  (let [u (let [m (- x0 x1)]
            (/ m (.abs js/Math m)))
        d (-> y1 (- y2) (/ 2) (* u))
        d' (/ d 2)
        a1 [(+ x1 d) y1]
        a2 [(- x1 d') y1]
        b2 [(- x2 d') y2]
        b1 [(+ x2 d) y2]]
    (str "L" (pair a1)
         "C" (pair a2) "," (pair b2) "," (pair b1))))

(defn path [pts]
  (when (seq pts)
    (->> pts
      (map pair)
      (interpose "L")
      (apply str "M"))))

(defn closed-path [pts]
  (str (path pts) "Z"))

(defn rounded-path [pts]
  (let [[a & pts] pts]
    (loop [s (str "M" (pair a))
           prev a
           [a b & tail] pts]
      (cond
        (and a b (seq tail))
        (recur (str s (curve prev a b)) b tail)

        a
        (str s "L" (pair a))

        :else
        s))))

(defn translate [x y]
  (str "translate(" x "," y ")"))

(defn die [{w :width h :height :keys [x y value]}]
  (let [half (/ w 2)]
    [:g {:transform (translate half half)}
     [:rect {:class "die"
             :x (- half)
             :y (- half)
             :width w
             :height w}]
     (let [s (partial * (/ w 4))]
       (for [[x y] (g/dots value)]
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
                :d (rounded-path ps)}]))))

(defn penny-xy [path i spacing]
  (g/xy (.getPointAtLength path (g/penny-d i spacing))))

(defn penny [i pos shift]
  (let [[x y] (pos i)]
    [:circle {:class "penny"
              :cx x
              :cy y
              :r (- (/ s/penny 2) 2)
              :hookShift (when (pos? shift)
                           (a/transition
                             (fn [el t]
                               (let [[x y] (pos (max -1 (- i (* t (inc shift)))))]
                                 (doto el
                                   (.setAttribute "cx" x)
                                   (.setAttribute "cy" y))))
                             (@settings/timing :intake)))}]))

(defn pennies [w h {:keys [spacing intaking] :as info}]
  (list
    (penny-path w h)
    (when-let [path (info :path)]
      (->> info
        :pennies
        (map-indexed (fn [i p]
                       (penny i #(penny-xy path % spacing) intaking)))
        reverse))))

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

(defmulti station :type)

(defmethod station :supply [{w :width :keys [bin-h spout-y]}]
  [:g {:class "supply"}
   (spout spout-y w)])

(defmethod station :processing [{w :width :keys [bin-h] :as s}]
  [:g {:class "station"}
   (pennies w bin-h
     {:pennies (s :pennies)
      :spacing (s :penny-spacing)
      :intaking (if (s :intaking?) (s :capacity) 0)
      :dropping (if (s :dropping?) (s :incoming) 0)
      :path (dom/penny-path (s :id))})
   (shelves w bin-h)
   (bin w bin-h)
   (spout (s :spout-y) w)])

(defmethod station :distribution [{w :width :keys [bin-h]}]
  [:g {:class "supply"}])

(defn scenario [{:keys [x color stations]}]
  (when x
    [:g {:class (str "scenario " (name color)) :transform (translate x 0)}
     (for [{{t :type} :productivity :keys [id y] :as s} stations]
       [:g {:id id
            :class (str "productivity-" (name t))
            :transform (translate 0 y)}
        (station s)])]))

(defn ui [{:keys [step dice scenarios]} emit]
  [:main {}
   [:div {:style {:position :fixed :left 0 :top 0}}
    [:div {} step " steps"]
    [:button {:onclick #(emit :roll)} "Roll"]
    [:button {:onclick #(emit [:run 100])} "Run"]]
   [:svg {:id "space" :width "100%" :height "100%"}
    (for [{:keys [x y] :as d} dice]
      (when x
        [:g {:transform (translate x y)}
         (die d)]))
    (map scenario scenarios)] ])
