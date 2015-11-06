(ns pennygame.updates
  (:require-macros [pennygame.macros :refer [spy]])
  (:require [com.rpl.specter :as s]
            [pennygame.dom :as dom]))

(defmulti produce (fn [_ {t :type} _] t))

(defmethod produce :normal [roll _ _]
  roll)

(defmethod produce :high [roll _ _]
  (case roll
    1 2
    2 4
    3 6
    4 4
    5 5
    6 6))

(defmethod produce :constrained [roll {i :by-station} stations]
  (min roll (get-in (vec stations) [i :capacity])))

(defn lengths [scenarios]
  (s/transform [s/ALL :stations s/ALL]
    (fn [{:keys [id] :as station}]
      (if-let [path (dom/penny-path id)]
        (assoc station :length (.getTotalLength path))
        station))
    scenarios))

(defn roll [dice values]
  (vec (map #(assoc %1 :value %2) dice values)))

(defn determine-base-capacities [scenarios dice]
  (s/transform [s/ALL :stations s/VAL s/ALL #(contains? % :die)]
    (fn [stations {:keys [die productivity pennies] :as station}]
      (let [d (get-in dice [die :value])
            c (produce d productivity stations)]
        (assoc station :capacity c)))
    scenarios))

(defn determine-constrained-capacities [scenarios dice]
  (s/transform [s/ALL :stations s/VAL s/ALL
                #(contains? % :die)
                #(= :constrained (get-in % [:productivity :type]))]
    (fn [stations {:keys [die productivity pennies] :as station}]
      (let [d (get-in dice [die :value])
            c (produce d productivity stations)]
        (assoc station :capacity c)))
    scenarios))

(defn determine-capacities [scenarios dice]
  (-> scenarios
    (determine-base-capacities dice)
    (determine-constrained-capacities dice)))

(defn transfer-to-processed [scenarios]
  (s/transform [s/ALL :stations s/ALL #(get % :capacity)]
    (fn [{:keys [capacity pennies] :as station}]
      (assoc station
        :pennies (drop capacity pennies)
        :processed (take capacity pennies)))
    scenarios))

(defn take-supplier-processed [scenarios]
  (s/transform [s/ALL :stations s/VAL s/ALL #(contains? % :supplier)]
    (fn [stations {:keys [supplier pennies] :as station}]
      (assoc station :pennies (concat pennies (get-in (vec stations) [supplier :processed]))))
    scenarios))

(defn stats [scenario]
  {:input (-> scenario :stations first :processed count)
   :wip (->> scenario
          (s/select [:stations s/ALL #(= :processing (:type %)) :pennies])
          (map count)
          (reduce +))
   :utilization (->> scenario
                  (s/select [:stations s/ALL #(= :processing (:type %))])
                  (map (juxt (comp count :processed) :capacity))
                  (apply map +))
   :throughput (-> scenario :stations butlast last :processed count)})

(defn stats-history [scenarios]
  (s/transform [s/ALL s/VAL :stats-history]
    #(conj %2 (stats %1))
    scenarios))
