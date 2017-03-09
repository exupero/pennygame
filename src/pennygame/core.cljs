(ns pennygame.core
  (:require-macros [cljs.core.async.macros :refer [go]]
                   [pennygame.macros :refer [spy]])
  (:require [cljs.core.async :as async :refer [<! timeout]]
            [clojure.string :as string]
            [rand-cljc.core :as rng]
            [vdom.core :refer [renderer]]
            [pennygame.animations :as animations]
            [pennygame.dom :as dom]
            [pennygame.sizes :as sizes]
            [pennygame.states :as states]
            [pennygame.settings :as settings]
            [pennygame.statistics :as statistics]
            [pennygame.updates :as u]
            [pennygame.ui :as ui]))

(enable-console-print!)

(defn on-visible-once [f]
  (let [event (cond
                (exists? js/document.hidden)       "visibilitychange"
                (exists? js/document.webkitHidden) "webkitvisibilitychange"
                (exists? js/document.mozHidden)    "mozvisibilitychange"
                (exists? js/document.msHidden)     "msvisibilitychange")
        cb (fn cb []
             (f)
             (.removeEventListener js/document event cb))]
    (.addEventListener js/document event cb)))

(defn dice-positions [setup {w :width :keys [x]}]
  (let [ss (->> setup :scenarios (filter :name) first :stations (drop 1))
        hs (map :height ss)
        ys (map :y ss)
        ds (fn [d y h]
             (assoc d
               :x x
               :y (+ y h (- 0 (/ w 2) sizes/penny))
               :width w
               :height w))]
    (update setup :dice (partial map ds) ys hs)))

(defonce model
  (let [seed (let [s (string/replace js/location.hash #"#" "")]
               (when-not (string/blank? s)
                 (js/parseInt s)))
        seed (or seed (rand-int 100000000))]
    (set! (.-hash js/location) seed)
    (atom {:scenarios [nil nil nil]
           :seed seed
           :rng (rng/rng seed)})))

(defmulti emit (fn [t & _] t))

(defn cruise [[bottom top] [up down] duration x]
  (let [height (- top bottom)]
    (condp > x
      up bottom
      (+ up duration) (+ bottom (* height (animations/ease-in-out (/ (- x up) duration))))
      down top
      (+ down duration) (- top (* height (animations/ease-in-out (/ (- x down) duration))))
      bottom)))

(defn run-steps [left total animations?]
  (let [progress (/ (- total left) total)
        max-speed 10
        speed (cruise [1 max-speed] [0.05 0.95] 0.05 progress)
        animate? (and animations? (< speed max-speed))]
    (go
      (emit :roll)
      (emit :determine-capacity)
      (when animate?
        (emit :intaking true)
        (<! (animations/run speed))
        (emit :intaking false))
      (emit :transfer-to-processed)
      (emit :transfer-to-next-station)
      (emit :set-spacing)
      (when animate?
        (emit :dropping true)
        (<! (animations/run speed))
        (emit :dropping false))
      (emit :integrate)
      (emit :update-stats)
      (when-not animate?
        (<! (timeout (@settings/timing :step))))
      (let [left (dec left)]
        (if (pos? left)
          (emit :run-next left total animations?)
          (emit :running false))))))

(defn initialize-setup! []
  (go
    (<! (timeout 50))
    (let [size (juxt #(.-width %) #(.-height %))
          [w h :as dim] (some-> js/document (.getElementById "space") .getBoundingClientRect size)]
      (if dim
        (do
          (emit :size w h)
          (<! (timeout 100))
          (emit :set-lengths)
          (<! (timeout 100))
          (emit :set-spacing))
        (on-visible-once initialize-setup!)))))

(defn generate-averages [rng original current]
  (let [average (statistics/averager current)
        steps (current :step)
        dt 100]
    (go
      (emit :average (statistics/stats current))
      (<! (timeout dt))
      (loop [i 0]
        (when (< i 50)
          (emit :average (average (statistics/run rng steps original)))
          (<! (timeout dt))
          (recur (inc i)))))))

(defn die [& args]
  (merge {:value 0
          :type :processing}
         (apply hash-map args)))

(defmethod emit :toggle-scenario [_ scenario-name slot]
  (initialize-setup!)
  (swap! model
         (fn [m]
           (let [scenarios (update (m :scenarios) slot #(when-not % (states/scenarios scenario-name)))
                 setup (u/initialize-tracer
                         {:step 0
                          :dice [(die :type :supply) (die) (die) (die) (die)]
                          :scenarios (map #(or % (states/scenario)) scenarios)})]
             (assoc m
                    :setup setup
                    :original-setup setup
                    :scenarios scenarios
                    :running? false)))))

(defmethod emit :size [_ width height]
  (let [left 150]
    (swap! model
           (fn [m]
             (-> m
               (assoc-in [:setup :width] width)
               (assoc-in [:setup :height] height)
               (update-in [:setup :scenarios] (partial sizes/scenarios {:x left :width (- width left) :height height}))
               (update :setup dice-positions {:x 45 :width (- left 90)}))))))

(defmethod emit :set-lengths [_]
  (swap! model update :setup u/stations
         (fn [{:keys [id] :as station}]
           (if-let [path (dom/penny-path id)]
             (assoc station :length (.getTotalLength path))
             station))))

(defmethod emit :set-spacing [_]
  (swap! model update :setup u/spacing))

(defmethod emit :roll [_]
  (swap! model
         (fn [m]
           (let [rng (m :rng)]
             (-> m
               (update-in [:setup :step] inc)
               (update :setup u/roll-dice (repeatedly #(inc (rng/rand-int rng 6)))))))))

(defmethod emit :run [_ n animations?]
  (run-steps n n animations?)
  (swap! model assoc :running? true :start-timestamp (js/Date.)))

(defmethod emit :determine-capacity [_]
  (swap! model update :setup u/determine-capacities))

(defmethod emit :intaking [_ v]
  (swap! model update :setup u/stations #(assoc % :intaking? v)))

(defmethod emit :transfer-to-processed [_]
  (swap! model update :setup u/transfer-to-processed))

(defmethod emit :transfer-to-next-station [_]
  (swap! model update :setup u/take-supplier-processed))

(defmethod emit :dropping [_ v]
  (swap! model update :setup u/stations #(assoc % :dropping? v)))

(defmethod emit :integrate [_]
  (swap! model update :setup u/integrate-incoming))

(defmethod emit :update-stats [_]
  (swap! model update :setup u/stats-history))

(defmethod emit :running [_ v]
  (println "Run time"
           (/ (- (.getTime (js/Date.))
                 (.getTime (:start-timestamp @model)))
              1000)
           "seconds")
  (swap! model
         (fn [m]
           (-> m
             (assoc :running? v)
             (dissoc :start-timestamp)))))

(defmethod emit :run-next [_ left total animations?]
  (when (@model :running?)
    (run-steps left total animations?))
  @model)

(defmethod emit :execute [_ n]
  (swap! model update :setup #(statistics/run (@model :rng) n %)))

(defmethod emit :info [_ v]
  (swap! model assoc :info? v))

(defmethod emit :graphs [_ v]
  (swap! model assoc :graphs? v))

(defmethod emit :averages [_ v]
  (if v
    (let [{:keys [rng setup original-setup]} @model]
      (generate-averages rng original-setup setup)
      @model)
    (swap! model update :setup dissoc :averages)))

(defmethod emit :average [_ avg]
  (swap! model assoc-in [:setup :averages] avg))

(defmethod emit :reset [_]
  (swap! model
         (fn [m]
           (assoc m
                  :setup (m :original-setup)
                  :rng (rng/rng (m :seed)))))
  (initialize-setup!))

(defmethod emit :generate-new [_]
  (let [seed (rand-int 100000000)]
    (set! (.-hash js/location) seed)
    (swap! model
           (fn [m]
             (assoc m
                    :setup (m :original-setup)
                    :seed seed
                    :rng (rng/rng seed))))
    (initialize-setup!)))

(defonce render!
  (let [r (renderer (.getElementById js/document "app"))]
    #(r (ui/ui @model emit))))

(defonce on-update
  (add-watch model :rerender
    (fn [_ _ _ model]
      (render! model))))

(defonce initial-model
  (do
    (emit :toggle-scenario :basic 0)
    (emit :toggle-scenario :efficient 1)
    (emit :toggle-scenario :constrained 2)
    (emit :info true)))

(render! @model)
