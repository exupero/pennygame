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
        [:text {:transform (translate (/ w 2) bottom)
                :dy -5} label])])))

(defmulti station :type)

(defmethod station :supply
  [{w :width :keys [bin-h spout-y stats]
    :or {stats {}}}
   info?]
  (spout spout-y w (str "Total Input: " (stats :total-input 0)) info?))

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
    (spout (s :spout-y) w (str "Under-utilized: " (s :under-utilized)) info?)))

(defmethod station :distribution
  [{w :width :keys [id bin-h source-spout-y stats incoming dropping?]
    :or {stats {}}}
   info?]
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
                    "," (pair [(/ w 2) (/ bin-h 2)]))}]
    [:image {:xlink:href js/truckSrc
             :width w
             :height bin-h}]
    (when info?
      [:text {:dx (/ w 2)
              :dy -4
              :text-anchor "middle"}
       (str "Total Output: " (stats :total-output 0))])))

(defn scenario [{:keys [x color stations stats-history]} info?]
  (when (and x color)
    [:g {:class (str "scenario " (name color)) :transform (translate x 0)}
     (for [{{t :type} :productivity :keys [id y] :as s} (reverse stations)]
       [:g {:id id
            :class (str (name t) " productivity-" (name t))
            :transform (translate 0 y)}
        (if (seq stats-history)
          (station (assoc s :stats (peek stats-history)) info?)
          (station s info?))])]))

(defn graph-labels [stats coord formatter cls]
  (when (seq stats)
    (let [ys (->> stats
               (map #(-> % :data last coord second))
               (g/separate 10))]
      (for [[{:keys [data]} y] (map vector stats ys)
            :let [[x] (coord (last data))]
            :when x]
        [:text {:class (str "label " cls)
                :transform (translate x y)
                :dy 4}
         (-> data last second formatter)]))))

(def scenario-name->color
  {:basic :red
   :efficient :green
   :constrained :blue
   :fixed :purple})

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
        avg-stats (for [[k xs] averages
                        :let [data (map-indexed #(vector %1 (f %2)) xs)]]
                    {:color (scenario-name->color k)
                     :data data})
        [sx sy] (g/graph-scales
                  (concat (map :data stats) (map :data avg-stats))
                  {:width (- w (* 2 p)) :height ih}
                  {:domain [] :range rng})
        coord #(vector (sx (first %)) (sy (second %)))]
    [:g {:class (str "graph " (when averages "averaging"))
         :transform (translate x y)}
     [:rect {:width w :height h}]
     [:text {:class "title"
             :x (/ w 2)
             :y (/ h 2)
             :dy 10}
      title]
     [:g {:transform (translate p p)}
      (for [{:keys [color data]} avg-stats]
        [:path {:class (str "average stroke " (name color))
                :d (path (map coord data))}])
      (for [{:keys [color data]} stats]
        [:path {:class (str "history stroke " (name color))
                :d (path (map coord data))}])
      (graph-labels stats coord formatter "history")
      (graph-labels avg-stats coord formatter "average")
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

(defn controls [{{:keys [step averages]} :setup :keys [info? graphs? running?]} emit]
  [:div {:id "controls"}
    [:section {:className "slidden"}
     [:button {:onclick #(emit [:run 1 true])} "Roll"]
     [:button {:onclick #(emit [:run 100 true])} "Run"]
     [:button {:onclick #(emit [:run 100 false])} "Run Fast"]
     [:button {:onclick #(emit [:execute 100])} "Run Instantly"]
     [:button {:onclick #(emit [:info (not info?)])}
      (if info? "Hide info" "Show info")]
     [:button {:onclick #(emit [:graphs (not graphs?)])}
      (if graphs? "Hide graphs" "Show graphs")]
     (when graphs?
       [:button {:disabled (or (zero? step) running?)
                 :onclick #(emit [:averages (not averages)])}
        (if averages "Hide averages" "Average")])]
    [:section {:className "slidden"}
     [:button {:onclick #(emit [:setup :basic])} "Basic"]
     [:button {:onclick #(emit [:setup :efficient])} "Efficient"]
     [:button {:onclick #(emit [:setup :basic+efficient])} "Basic & Efficient"]
     [:button {:onclick #(emit [:setup :constrained])} "Constrained"]
     [:button {:onclick #(emit [:setup :basic+efficient+constrained])} "Basic, Efficient, & Constrained"]
     [:button {:onclick #(emit [:setup :basic+efficient+constrained+fixed])} "Basic, Efficient, Constrained, & Fixed"]]])

(defn ui [{{:keys [width height step dice scenarios averages]} :setup :keys [info? graphs?] :as model} emit]
  [:main {}
   [:div {:style {:position :fixed :left "5px" :top "5px"}}
    [:div {} step " steps"]]
   (controls model emit)
   [:svg {:id "space" :width "100%" :height "100%"}
    (for [{:keys [x y] :as d} dice]
      (when x
        [:g {:transform (translate x y)}
         (die d)]))
    (map #(scenario % info?) scenarios)
    (when (and width height graphs?)
      (graphs [width height] scenarios averages))]])
