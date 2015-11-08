(ns pennygame.updates
  (:require-macros [pennygame.macros :refer [spy]])
  (:require [com.rpl.specter :as s]
            [pennygame.sizes :as sizes]))

(defmulti capacity (fn [_ {t :type} _] t))

(defmethod capacity :normal [roll _ _]
  roll)

(defmethod capacity :high [roll _ _]
  (case roll
    1 2
    2 4
    3 6
    4 4
    5 5
    6 6))

(defmethod capacity :constrained [roll {i :by-station} stations]
  (min roll (get-in (vec stations) [i :capacity])))

(defn stations [model f]
  (s/transform [:scenarios s/ALL :stations s/ALL] f model))

(defn roll [dice values]
  (vec (map #(assoc %1 :value %2) dice values)))

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
  (assoc station :processed (range capacity)))

(defn transfer-to-processed [model]
  (s/transform [:scenarios s/ALL :stations s/ALL #(get % :capacity)]
    process
    model))

(def processing? #(= :processing (:type %)))

(defn spacing [model]
  (let [sp (->> model
             (s/select [:scenarios s/ALL :stations s/ALL processing?])
             (map (fn [{:keys [length incoming pennies]}]
                    (/ length
                       (+ (count incoming) (count pennies)))))
             (apply min (- sizes/penny 3.5)))]
    (s/transform [:scenarios s/ALL :stations s/ALL processing?]
      #(assoc % :penny-spacing sp)
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

(defn stats [scenario]
  {:input (-> scenario :stations first :processed count)
   :wip (->> scenario
          (s/select [:stations s/ALL processing? :pennies])
          (map count)
          (reduce +))
   :utilization (->> scenario
                  (s/select [:stations s/ALL processing?])
                  (map (juxt (comp count :processed) :capacity))
                  (apply map +))
   :throughput (-> scenario :stations butlast last :processed count)})

(defn stats-history [model]
  (s/transform [:scenarios s/ALL s/VAL :stats-history]
    #(conj %2 (stats %1))
    model))
