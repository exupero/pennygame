(ns pennygame.states)

(defn die [& args]
  (merge {:value 0
          :type :processing}
         (apply hash-map args)))

(defn station [& args]
  (merge {:id (gensym "station")
          :type :processing
          :incoming []
          :pennies []
          :processed []
          :capacity nil
          :productivity {:type :normal}}
         (apply hash-map args)))

(defn scenario [& args]
  (merge {:stats-history []}
         (apply hash-map args)))

(def example
  {:step 0
   :dice [(die :type :supply) (die) (die) (die) (die)]
   :scenarios
   [(scenario
      :color :red
      :stations
      [(station :type :supply :die 0)
       (station :supplier 0 :die 1)
       (station :supplier 1 :die 2)
       (station :supplier 2 :die 3)
       (station :supplier 3 :die 4)
       (station :type :distribution :supplier 4)])
    (scenario
      :color :green
      :stations
      [(station :type :supply :die 0 :productivity {:type :high})
       (station :supplier 0 :die 1 :productivity {:type :high})
       (station :supplier 1 :die 2 :productivity {:type :high})
       (station :supplier 2 :die 3)
       (station :supplier 3 :die 4 :productivity {:type :high})
       (station :type :distribution :supplier 4)])
    (scenario
      :color :blue
      :stations
      [(station :type :supply :die 0 :productivity {:type :constrained :by-station 3})
       (station :supplier 0 :die 1 :productivity {:type :high})
       (station :supplier 1 :die 2 :productivity {:type :high})
       (station :supplier 2 :die 3)
       (station :supplier 3 :die 4 :productivity {:type :high})
       (station :type :distribution :supplier 4)])]})
