(ns pennygame.states)

(defn die [& args]
  (merge {:value 0
          :type :processing}
         (apply hash-map args)))

(defn station [& args]
  (merge {:id (gensym "station")
          :type :processing
          :incoming []
          :pennies (repeat 4 {})
          :processed []
          :capacity nil
          :productivity {:type :normal}
          :penny-spacing 999999}
         (apply hash-map args)))

(defn scenario [& args]
  (merge {:stats-history []
          :stations []}
         (apply hash-map args)))

(def dice [(die :type :supply) (die) (die) (die) (die)])

(def basic
  (scenario
    :color :red
    :stations
    [(station :type :supply :die 0)
     (station :supplier 0 :die 1 :tracer-start true)
     (station :supplier 1 :die 2)
     (station :supplier 2 :die 3)
     (station :supplier 3 :die 4 :tracer-reset 0)
     (station :type :distribution :supplier 4)]))

(def efficient
  (scenario
    :color :green
    :stations
    [(station :type :supply :die 0 :productivity {:type :high})
     (station :supplier 0 :die 1 :productivity {:type :high} :tracer-start true)
     (station :supplier 1 :die 2 :productivity {:type :high})
     (station :supplier 2 :die 3)
     (station :supplier 3 :die 4 :productivity {:type :high} :tracer-reset 0)
     (station :type :distribution :supplier 4)]))

(def constrained
  (scenario
    :color :blue
    :stations
    [(station :type :supply :die 0 :productivity {:type :constrained :by-station 3})
     (station :supplier 0 :die 1 :productivity {:type :high} :tracer-start true)
     (station :supplier 1 :die 2 :productivity {:type :high})
     (station :supplier 2 :die 3)
     (station :supplier 3 :die 4 :productivity {:type :high} :tracer-reset 0)
     (station :type :distribution :supplier 4)]))

(def setups
  {:basic {:step 0 :dice dice :scenarios [basic (scenario) (scenario)]}
   :efficient {:step 0 :dice dice :scenarios [(scenario) efficient (scenario)]}
   :constrained {:step 0 :dice dice :scenarios [(scenario) (scenario) constrained]}
   :basic+efficient {:step 0 :dice dice :scenarios [basic efficient (scenario)]}
   :all {:step 0 :dice dice :scenarios [basic efficient constrained]}})
