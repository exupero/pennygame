(ns pennygame.statistics
  (:require-macros [pennygame.macros :refer [spy]])
  (:require [rand-cljc.core :as rng]
            [pennygame.states :as s]
            [pennygame.updates :as u]))

(defn step [rng model]
  (-> model
    (update :step inc)
    (u/roll-dice (repeatedly #(inc (rng/rand-int rng 6))))
    u/determine-capacities
    u/transfer-to-processed
    u/take-supplier-processed
    u/integrate-incoming
    u/stats-history))

(defn run [rng limit model]
  (loop [i 0 m (u/initialize-tracer model)]
    (if (< i limit)
      (recur (inc i) (step rng m))
      m)))

(defn stats [setup]
  (->> setup
    :scenarios
    (map (juxt :name :stats-history))
    (remove (comp nil? first))
    (into {})))

(defn map-vals [f m]
  (zipmap (keys m) (map f (vals m))))

(defn merge-stats-with [f & stats]
  (->> stats
    (apply concat)
    (group-by key)
    (map-vals #(map val %))
    (map-vals #(apply f %))))

(defn zip-scenarios [& series]
  (->> series
    (apply concat)
    (group-by key)
    (map-vals #(map val %))
    (map-vals #(apply map vector %))))

(defn averager [seed]
  (let [curr (atom (stats seed))
        c (atom 1)
        avg #(/ (+ (* @c %1) %2) (inc @c))
        step #(apply merge-stats-with avg %)]
    (fn [setup]
      (reset! curr
        (->> (stats setup)
          (zip-scenarios @curr)
          (map-vals #(map step %))))
      (swap! c inc)
      @curr)))
