(ns pennygame.ui
  (:require-macros [pennygame.macros :refer [spy]])
  (:require [clojure.string :as string]
            [vdom.hooks :refer [hook]]
            [com.rpl.specter :as sp]
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

(defn penny [[x y] tracer transition]
  [:g {:transform (translate x y)
       :hookTransition (when transition (hook transition))}
   [:circle {:class "penny"
             :r (- (/ s/penny 2) 2)}]
   (when tracer
     [:circle {:class "tracer"
               :r (/ s/penny 5)}])])

(defn update-attribute! [el attr f & args]
  (.setAttribute el attr (apply f (.getAttribute el attr) args)))

(defn pennies [w h {ps :pennies :keys [spacing intaking spout-y] :as info}]
  (list
    (penny-path w h)
    (when-let [path (info :path)]
      (list
        (reverse
          (map-indexed
            (let [c (count ps)]
              (fn [i {:keys [tracer]}]
                (let [[x y] (penny-xy path (+ c i) spacing)
                      dy (- y spout-y)]
                  (penny [x spout-y] tracer
                         (a/tween
                           (fn [el t]
                             (.setAttribute el "transform" (translate x (+ spout-y (* t dy)))))
                           {:duration (@settings/timing :drop)
                            :delay (* i 50)
                            :easing a/ease-in})))))
            (info :dropping)))
        (reverse
          (map-indexed
            (fn [i {:keys [tracer]}]
              (let [pos #(penny-xy path % spacing)]
                (penny (pos i) tracer
                       (when (pos? intaking)
                         (a/tween
                           (fn [el t]
                             (let [spot (max -1 (- i (* t intaking)))
                                   [x y] (pos spot)]
                               (.setAttribute el "transform" (translate x y))
                               (if (= -1 spot)
                                 (.setAttribute el "transform" "scale(0)"))))
                           {:duration (@settings/timing :intake)})))))
            ps))))))

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
  (spout spout-y w))

(defmethod station :processing [{w :width :keys [bin-h] :as s}]
  (list
    (shelves w bin-h)
    (bin w bin-h)
    (pennies w bin-h
      {:pennies (s :pennies)
       :spacing (s :penny-spacing)
       :intaking (if (s :intaking?) (s :capacity) 0)
       :dropping (when (s :dropping?) (s :incoming))
       :path (dom/penny-path (s :id))
       :spout-y (s :source-spout-y)})
    (spout (s :spout-y) w)))

(defmethod station :distribution [{w :width :keys [id bin-h source-spout-y] :as s}]
  (list
    (let [ramp (dom/ramp id)]
      (when (and ramp (s :dropping?))
        (map-indexed
          (fn [i {:keys [tracer]}]
            (penny [(/ s/penny 2) source-spout-y] tracer
                   (a/path ramp
                     (fn [el [x y]]
                       (.setAttribute el "transform" (translate x y)))
                     {:duration (@settings/timing :drop)
                      :delay (* i 50)
                      :easing a/ease-in})))
          (s :incoming))))
    [:path {:class "ramp"
            :d (str "M" (pair [(/ s/penny 2) source-spout-y])
                    "C" (pair [(/ s/penny 2) (/ bin-h 2)])
                    "," (pair [(/ s/penny 2) (/ bin-h 2)])
                    "," (pair [(/ w 2) (/ bin-h 2)]))}]
    [:image {:xlink:href js/truckSrc
             :width w
             :height bin-h}]))

(defn scenario [{:keys [x color stations]}]
  (when (and x color)
    [:g {:class (str "scenario " (name color)) :transform (translate x 0)}
     (for [{{t :type} :productivity :keys [id y] :as s} (reverse stations)]
       [:g {:id id
            :class (str (name t) " productivity-" (name t))
            :transform (translate 0 y)}
        (station s)])]))

(defn graph-labels [stats formatter cls]
  (when (seq stats)
    (let [ys (->> stats
               (map #(-> % :coords last second))
               (g/separate 10))]
      (for [[{:keys [coords data]} y] (map vector stats ys)
            :let [[x] (last coords)]
            :when x]
        [:text {:class (str "label " cls)
                :transform (translate x y)
                :dy 4}
         (-> data last second formatter)]))))

(defn graph
  [{w :width h :height :keys [x y]}
   scenarios
   averages
   {f :accessor
    rng :range
    :keys [title formatter]
    :or {formatter identity}}]
  (let [p 30
        ih (- h (* 2 p))
        stats (for [{:keys [color stats-history]} scenarios
                    :when color]
                {:color color
                 :data (map-indexed #(vector %1 (f %2)) stats-history)})
        data (mapcat :data stats)
        rng (concat rng (drop (count rng) (g/extent (map second data))))
        sx (g/linear (g/extent (map first data)) [0 (- w (* 2 p))])
        sy (g/linear rng [ih 0])
        coord #(vector (sx %1) (sy %2))
        stats (map (fn [d]
                     (assoc d :coords (map #(apply coord %) (d :data))))
                   stats)
        avg-stats (for [[k xs] averages
                        :let [data (map-indexed #(vector %1 (f %2)) xs)]]
                    {:color (k {:basic :red
                                :efficient :green
                                :constrained :blue
                                :fixed :purple})
                     :data data
                     :coords (map #(apply coord %) data)})]
    [:g {:class (str "graph " (when averages "averaging"))
         :transform (translate x y)}
     [:rect {:width w :height h}]
     [:text {:class "title"
             :x (/ w 2)
             :y (/ h 2)
             :dy 10}
      title]
     [:g {:transform (translate p p)}
      (for [{:keys [color coords]} avg-stats]
        [:path {:class (str "average " (name color))
                :d (path coords)}])
      (for [{:keys [color coords]} stats]
        [:path {:class "history stroke"
                :d (path coords)}])
      (for [{:keys [color coords]} stats]
        [:path {:class (str "history " (name color))
                :d (path coords)}])
      (graph-labels stats formatter "history")
      (graph-labels avg-stats formatter "average")
      [:line {:class "axis"
              :transform (translate 0 ih)
              :x2 (- w (* 2 p))}]
      [:line {:class "axis"
              :y2 ih}]]]))

(defn graphs [dim scenarios averages]
  (let [[one two three four] (g/cells dim 4)]
    [:g {:id "graphs"}
     (graph one scenarios averages
            {:title "Work in Progress"
             :accessor :wip
             :range [0]
             :formatter #(.round js/Math %)})
     (graph two scenarios averages
            {:title "Total Output"
             :accessor :total-output
             :formatter #(.round js/Math %)})
     (graph three scenarios averages
            {:title "Inventory Turns"
             :accessor :turns
             :formatter #(.round js/Math %)})
     (graph four scenarios averages
            {:title "Utilization"
             :accessor :percent-utilization
             :range [0 1]
             :formatter #(str (.round js/Math (* 100 %)) "%")})]))

(defn ui [{:keys [width height step dice scenarios averages graphs?]} emit]
  [:main {}
   [:div {:style {:position :fixed :left "5px" :top "5px"}}
    [:div {} step " steps"]]
   [:div {:id "controls"}
    [:section {:className "slidden"}
     [:button {:onclick #(emit [:run 1 true])} "Roll"]
     [:button {:onclick #(emit [:run 100 true])} "Run"]
     [:button {:onclick #(emit [:run 100 false])} "Run Fast"]
     [:button {:onclick #(emit [:graphs (not graphs?)])}
      (if graphs? "Hide graphs" "Show graphs")]
     [:button {:onclick #(emit [:averages (not averages)])}
      (if averages "Hide averages" "Average")]]
    [:section {:className "slidden"}
     [:button {:onclick #(emit [:set-up :basic])} "Basic"]
     [:button {:onclick #(emit [:set-up :efficient])} "Efficient"]
     [:button {:onclick #(emit [:set-up :basic+efficient])} "Basic & Efficient"]
     [:button {:onclick #(emit [:set-up :constrained])} "Constrained"]
     [:button {:onclick #(emit [:set-up :basic+efficient+constrained])} "Basic, Efficient, & Constrained"]
     [:button {:onclick #(emit [:set-up :basic+efficient+constrained+fixed])} "Basic, Efficient, Constrained, & Fixed"]
     ]]
   [:svg {:id "space" :width "100%" :height "100%"}
    (for [{:keys [x y] :as d} dice]
      (when x
        [:g {:transform (translate x y)}
         (die d)]))
    (map scenario scenarios)
    (when (and width height graphs?)
      (graphs [width height] scenarios averages))]])
