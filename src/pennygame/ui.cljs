(ns pennygame.ui
  (:require-macros [pennygame.macros :refer [spy]])
  (:require [clojure.string :as string]
            [vdom.hooks :refer [hook]]
            [com.rpl.specter :as sp]
            [pennygame.settings :as settings]
            [pennygame.sizes :as s]
            [pennygame.dom :as dom]
            [pennygame.geometry :as g]
            [pennygame.animations :as a]
            [pennygame.statistics :as statistics]))

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

(defn rotate [x]
  (str "rotate(" x ")"))

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

(defn penny [[x y] t transition]
  [:g {:transform (translate x y)
       :hookTransition (when transition (hook transition))}
   [:circle {:class "penny fill"
             :r (- (/ s/penny 2) 2)}]
   (when (= t :tracer)
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
              (fn [i p]
                (let [[x y] (penny-xy path (+ c i) spacing)
                      dy (- y spout-y)]
                  (penny [x spout-y] p
                         (a/tween
                           (fn [el t]
                             (.setAttribute el "transform" (translate x (+ spout-y (* t dy)))))
                           {:duration (@settings/timing :drop)
                            :delay (* i 50)
                            :easing a/ease-in})))))
            (info :dropping)))
        (reverse
          (map-indexed
            (fn [i p]
              (let [pos #(penny-xy path % spacing)]
                (penny (pos i) p
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

(defn spout
  ([y w info?] (spout y w "" info?))
  ([y w label info?]
   (let [sp 3
         top (- s/penny)
         bottom (+ sp s/penny)
         entrance-left (- w s/penny)]
     [:g {:class "spout"
          :transform (translate 0 y)}
      [:path {:d (closed-path [[w top]
                               [w bottom]
                               [0 bottom]
                               [0 sp]
                               [entrance-left sp]
                               [entrance-left top]])}]
      (when info?
        [:text {:class "infotext fill"
                :transform (translate (/ w 2) bottom)
                :dy -5} label])])))

(defmulti station (fn [a _ _] (:type a)))

(defmethod station :supply [{w :width :keys [bin-h spout-y stats] :or {stats {}}} info?]
  (let [in (stats :total-input 0)]
    (spout (+ 10 spout-y) w (if (zero? in) "In" in) info?)))

(defmethod station :processing [{w :width :keys [bin-h] :as s} info?]
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
    (spout (s :spout-y) w #_(str "Under-utilized: " (s :under-utilized)) info?)))

(defmethod station :distribution
  [{w :width :keys [id bin-h source-spout-y stats incoming dropping?]
    :or {stats {}}}
   info?]
  (let [truck-w (* bin-h 967 (/ 265))]
    (list
      (let [ramp (dom/ramp id)]
        (when (and ramp dropping?)
          (map-indexed
            (fn [i p]
              (penny [(/ s/penny 2) source-spout-y] p
                     (a/path ramp
                             (fn [el [x y]]
                               (.setAttribute el "transform" (translate x y)))
                             {:duration (@settings/timing :drop)
                              :delay (* i 50)
                              :easing a/ease-in})))
            incoming)))
      [:path {:class "ramp"
              :d (str "M" (pair [(/ s/penny 2) source-spout-y])
                      "C" (pair [(/ s/penny 2) (/ bin-h 2)])
                      "," (pair [(/ s/penny 2) (/ bin-h 2)])
                      "," (pair [(+ (/ w 2) truck-w) (/ bin-h 2)]))}]
      [:image {:xlink:href js/truckSrc
               :x (+ (/ w 2) (/ truck-w 2))
               :width truck-w
               :height bin-h}]
      (when info?
        (let [out (stats :total-output 0)
              delivery (stats :delivery 0)]
          [:g {}
           [:text {:class "infotext fill"
                   :dy 24
                   :text-anchor "start"}
            (if (zero? delivery) "Days" delivery)]
           [:text {:class "infotext fill"
                   :dx w
                   :dy 24
                   :text-anchor "end"}
            (if (zero? out) "Out" out)]])))))

(defn scenario [{nm :name w :width h :height :keys [x stations stats-history]} info?]
  (let [stats (when (seq stats-history)
                (peek stats-history))]
    (when (and x nm)
      [:g {:class (str "scenario " (name nm))
           :transform (translate x 0)}
       (for [{{t :type} :productivity :keys [id y bottleneck?] :as s} (reverse stations)]
         [:g {:id id
              :class (str (name t) " productivity-" (name t) " " (when bottleneck? "bottleneck"))
              :transform (translate 0 y)}
          (if (seq stats-history)
            (station (assoc s :stats stats) info?)
            (station s info?))])
       (when info?
         (let [wip (:wip stats 0)]
           [:text {:class "infotext fill"
                   :x (/ w 2)
                   :y (/ h 2)
                   :dy 26
                   :text-anchor "middle"}
            (if (zero? wip) "WIP" wip)]))])))

(defn graph-labels [stats coord formatter cls]
  (when (seq stats)
    (let [ys (->> stats
               (map #(-> % :data last coord second))
               (g/separate 18))]
      (for [[{:keys [data]} y] (map vector stats ys)
            :let [[x] (coord (last data))]
            :when x]
        [:text {:class (str "label " cls)
                :transform (translate x y)
                :dy 7}
         (-> data last second formatter)]))))

(defn graph
  [{w :width h :height :keys [x y]}
   stats
   {f :accessor
    rng :range
    :keys [title formatter]
    :or {formatter identity}}]
  (let [hp 30
        wp 50
        ih (- h (* 2 hp))
        stats (for [[k xs] stats]
                {:scenario k
                 :data (map-indexed #(vector %1 (f %2)) xs)})
        [sx sy] (g/graph-scales
                  (map :data stats)
                  {:width (- w (* 2 wp)) :height ih}
                  {:domain [] :range rng})
        coord #(vector (sx (first %)) (sy (second %)))]
    [:g {:class "graph"
         :transform (translate x y)}
     [:rect {:width w :height h}]
     [:text {:class "title"
             :x (/ w 2)
             :y (/ h 2)
             :dy 10}
      title]
     [:g {:transform (translate wp hp)}
      (for [{:keys [scenario data]} stats]
        [:path {:class "stroke outline"
                :d (path (map coord data))}])
      (for [{:keys [scenario data]} stats]
        [:path {:class (str "history stroke " (name scenario))
                :d (path (map coord data))}])
      (graph-labels stats coord formatter "history")
      [:line {:class "axis"
              :transform (translate 0 ih)
              :x2 (- w (* 2 wp))}]
      [:line {:class "axis"
              :y2 ih}]]]))

(defn graphs [dim stats]
  (let [[one two three four] (g/cells dim 4)]
    [:g {:id "graphs"}
     (graph one stats
            {:title "Total Input"
             :accessor :total-input
             :formatter js/Math.round})
     (graph two stats
            {:title "Total Output"
             :accessor :total-output
             :formatter js/Math.round})
     (graph three stats
            {:title "Work in Progress"
             :accessor :wip
             :range [0]
             :formatter js/Math.round})
     (graph four stats
            {:title "Days to Delivery"
             :accessor :delivery
             :formatter js/Math.round})
     ]))

(defn controls [{{:keys [step averages]} :setup :keys [info? graphs? running?]} emit]
  [:div {:id "controls"}
    [:section {:className "slidden"}
     [:button {:onclick #(emit :run 1 true)} "Roll"]
     [:button {:onclick #(emit :run 200 true)} "Run"]
     [:button {:onclick #(emit :run 200 false)} "Run Fast"]
     [:button {:onclick #(emit :execute 200)} "Run Instantly"]
     [:button {:onclick #(emit :info (not info?))}
      (if info? "Hide info" "Show info")]
     [:button {:onclick #(emit :graphs (not graphs?))}
      (if graphs? "Hide graphs" "Show graphs")]
     (when graphs?
       [:button {:disabled (or (zero? step) running?)
                 :onclick #(emit :averages (not averages))}
        (if averages "Hide averages" "Average")])]
    [:section {:className "slidden"}
     [:button {:onclick #(emit :toggle-scenario :basic 0)} "Basic"]
     [:button {:onclick #(emit :toggle-scenario :efficient 1)} "Efficient"]
     [:button {:onclick #(emit :toggle-scenario :constrained 2)} "Constrained"]
     [:hr {}]
     [:button {:onclick #(emit :reset)} "Reset"]
     [:button {:onclick #(emit :generate-new)} "Generate New"]]])

(defn ui [{{:keys [width height step dice scenarios averages] :as setup} :setup :keys [info? graphs?] :as model} emit]
  [:main {}
   [:div {:style {:position :fixed :left "5px" :top "5px"}}
    [:div {:id "days"} [:span {} step] " days"]]
   (controls model emit)
   [:svg {:id "space" :width "100%" :height "99%"}
    [:defs {}
     [:pattern {:id "caution"
                :x 0 :y 0
                :width 30 :height 30
                :patternUnits "userSpaceOnUse"}
      [:rect {:width 30 :height 30 :fill "#777"}]
      [:line {:x1 -10 :y1 10 :x2 10 :y2 -10 :stroke "yellow" :stroke-width 10}]
      [:line {:x1 0 :y1 30 :x2 30 :y2 0 :stroke "yellow" :stroke-width 10}]
      [:line {:x1 20 :y1 40 :x2 40 :y2 20 :stroke "yellow" :stroke-width 10}]]]
    (for [{:keys [x y] :as d} dice]
      (when x
        [:g {:transform (translate x y)}
         (die d)]))
    (map #(scenario % info?) scenarios)
    (when (and width height graphs?)
      (graphs [width height] (or averages (statistics/stats setup))))]])
