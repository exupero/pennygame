(ns pennygame.updates
  (:require-macros [pennygame.macros :refer [spy]])
  (:require [com.rpl.specter :as s]
            [pennygame.sizes :as sizes]))

(def processing? #(= :processing (:type %)))

(defn initialize-tracer [setup]
  (s/transform [:scenarios s/ALL :stations s/ALL #(:tracer-start %) :pennies s/LAST :tracer]
    (constantly true)
    setup))

(defmulti capacity (fn [_ {t :type} _] t))

(defmethod capacity :normal [roll _ _]
  roll)

(defmethod capacity :high [roll _ _]
  (case roll
    1 4
    2 4
    3 4
    4 4
    5 5
    6 6))

(defmethod capacity :constrained [roll {i :by-station} stations]
  (get-in (vec stations) [i :capacity]))

(defn stations [model f]
  (s/transform [:scenarios s/ALL :stations s/ALL] f model))

(defn roll [dice values]
  (vec (map #(assoc %1 :value %2) dice values)))

(defn roll-dice [model values]
  (update model :dice roll values))

(defn determine-base-capacities [model dice]
  (s/transform [:scenarios s/ALL :stations s/VAL s/ALL #(contains? % :die)]
    (fn [stations {:keys [die productivity pennies] :as station}]
      (let [d (get-in dice [die :value])
            c (capacity d productivity stations)]
        (assoc station :capacity c)))
    model))

(defn determine-constrained-capacities [model dice]
  (s/transform [:scenarios s/ALL :stations s/VAL s/ALL
                #(contains? % :die)
                #(= :constrained (get-in % [:productivity :type]))]
    (fn [stations {:keys [die productivity pennies] :as station}]
      (let [d (get-in dice [die :value])
            c (capacity d productivity stations)]
        (assoc station :capacity c)))
    model))

(defn determine-capacities [model]
  (let [dice (model :dice)]
    (-> model
      (determine-base-capacities dice)
      (determine-constrained-capacities dice))))

(defmulti process :type)

(defmethod process :default [{:keys [capacity pennies] :as station}]
  (assoc station
    :pennies (drop capacity pennies)
    :processed (take capacity pennies)))

(defmethod process :supply [{:keys [capacity] :as station}]
  (assoc station :processed (repeat capacity {})))

(defn new-tracer [scenario]
  (let [i (first (s/select [:stations s/ALL #(:tracer-reset %) :tracer-reset] scenario))]
    (s/transform [:stations (s/srange i (inc i)) s/ALL :processed s/LAST :tracer]
      (constantly true)
      scenario)))

(defn tracer-done? [stations]
  (->> stations
    (s/select [s/ALL #(:tracer-reset %) :processed s/ALL])
    (some :tracer)))

(defn handle-tracer [scenario]
  (if (tracer-done? (scenario :stations))
    (new-tracer scenario)
    scenario))

(defn transfer-to-processed [model]
  (->> model
    (s/transform [:scenarios s/ALL :stations s/ALL #(get % :capacity)] process)
    (s/transform [:scenarios s/ALL] handle-tracer)))

(defn spacing [model]
  (let [sp (->> model
             (s/select [:scenarios s/ALL :stations s/ALL processing?])
             (map (fn [{:keys [length incoming pennies]}]
                    (/ length
                       (+ (count incoming) (count pennies)))))
             (apply min (- sizes/penny 3.5)))]
    (s/transform [:scenarios s/ALL :stations s/ALL processing?]
      #(update % :penny-spacing min sp)
      model)))

(defn take-supplier-processed [model]
  (s/transform [:scenarios s/ALL :stations s/VAL s/ALL #(contains? % :supplier)]
    (fn [stations {:keys [supplier] :as station}]
      (assoc station :incoming (get-in (vec stations) [supplier :processed])))
    model))

(defn integrate-incoming [model]
  (s/transform [:scenarios s/ALL :stations s/ALL (s/collect-one :incoming) :pennies]
    #(concat %2 %1)
    model))

(defn stats
  [{:keys [stations]}
   {:keys [turns total-utilization total-output total-utilization]
    :or {turns 0 total-utilization [0 0]}}]
  (let [utilization (->> stations
                      (s/select [s/ALL processing?])
                      (map (juxt (comp count :processed) :capacity))
                      (apply map +))
        output (-> stations butlast last :processed count)
        wip (->> stations
              (s/select [s/ALL processing? :pennies])
              (map count)
              (reduce +))
        total-utilization (map + total-utilization utilization)]
    {:wip wip
     :turns (if (tracer-done? stations) (inc turns) turns)
     :total-output (+ total-output output)
     :total-utilization total-utilization
     :percent-utilization (apply / total-utilization)}))

(defn stats-history [model]
  (s/transform [:scenarios s/ALL s/VAL :stats-history]
    #(conj %2 (stats %1 (peek %2)))
    model))
