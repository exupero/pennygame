(ns pennygame.statistics
  (:require [pennygame.states :as s]
            [pennygame.updates :as u]))

(defn step [model]
  (-> model
    (update :step inc)
    (u/roll-dice (repeatedly #(->> (js/Math.random) (* 6) inc int)))
    u/determine-capacities
    u/transfer-to-processed
    u/take-supplier-processed
    u/integrate-incoming
    u/stats-history))

(defn run [limit model]
  (loop [i 0 m (u/initialize-tracer model)]
    (if (< i limit)
      (recur (inc i) (step m))
      m)))

(defn prune-stats [stats]
  (select-keys stats [:wip :total-output :turns :percent-utilization]))

(defn stats [model]
  (->> model
    :scenarios
    (map (comp #(map prune-stats %) :stats-history))
    (zipmap [:basic :efficient :constrained :fixed])))

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
