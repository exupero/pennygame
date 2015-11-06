(ns pennygame.states)

(defn die [& args]
  (merge {:value 0
          :type :processing}
         (apply hash-map args)))

(defn station [& args]
  (merge {:id (gensym "station")
          :type :processing
          :pennies []
          :processed []
          :capacity nil
          :productivity {:type :normal}}
         (apply hash-map args)))

(defn scenario [& args]
  (merge {:stats-history []}
         (apply hash-map args)))

(def example
  {:dice [(die :type :supply) (die) (die) (die) (die)]
   :scenarios
   [(scenario
      :stations
      [(station :type :supply :die 0 :pennies (range))
       (station :supplier 0 :die 1)
       (station :supplier 1 :die 2)
       (station :supplier 2 :die 3)
       (station :supplier 3 :die 4)
       (station :type :distribution :supplier 4)])
    (scenario
      :stations
      [(station :type :supply :die 0 :pennies (range) :productivity {:type :high})
       (station :supplier 0 :die 1 :productivity {:type :high})
       (station :supplier 1 :die 2 :productivity {:type :high})
       (station :supplier 2 :die 3)
       (station :supplier 3 :die 4 :productivity {:type :high})
       (station :type :distribution :supplier 4)])
    (scenario
      :stations
      [(station :type :supply :die 0 :pennies (range) :productivity {:type :constrained :by-station 3})
       (station :supplier 0 :die 1 :productivity {:type :high})
       (station :supplier 1 :die 2 :productivity {:type :high})
       (station :supplier 2 :die 3)
       (station :supplier 3 :die 4 :productivity {:type :high})
       (station :type :distribution :supplier 4)])]})
