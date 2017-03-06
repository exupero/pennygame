(ns pennygame.states
  (:require-macros [pennygame.macros :refer [spy]]))

(defn station [& args]
  (merge {:id (gensym "station")
          :type :processing
          :incoming []
          :pennies (repeat 4 :penny)
          :processed []
          :capacity nil
          :productivity {:type :normal}
          :penny-spacing 999999
          :under-utilized 0}
         (apply hash-map args)))

(defn scenario [& args]
  (merge {:stats-history []
          :stations []}
         (apply hash-map args)))

(def basic
  (scenario
    :name :basic
    :stations
    [(station :type :supply :die 0)
     (station :supplier 0 :die 1 :tracer-start true)
     (station :supplier 1 :die 2)
     (station :supplier 2 :die 3)
     (station :supplier 3 :die 4 :tracer-reset 0)
     (station :type :distribution :supplier 4)]))

(def efficient
  (scenario
    :name :efficient
    :stations
    [(station :type :supply :die 0 :productivity {:type :high})
     (station :supplier 0 :die 1 :productivity {:type :high} :tracer-start true)
     (station :supplier 1 :die 2 :productivity {:type :high})
     (station :supplier 2 :die 3 :bottleneck? true)
     (station :supplier 3 :die 4 :productivity {:type :high} :tracer-reset 0)
     (station :type :distribution :supplier 4)]))

(def constrained
  (scenario
    :name :constrained
    :stations
    [(station :type :supply :die 0 :productivity {:type :constrained :by-station 3 :use :capacity} :bottleneck? true)
     (station :supplier 0 :die 1 :productivity {:type :high} :tracer-start true)
     (station :supplier 1 :die 2 :productivity {:type :high})
     (station :supplier 2 :die 3 :bottleneck? true)
     (station :supplier 3 :die 4 :productivity {:type :high} :tracer-reset 0)
     (station :type :distribution :supplier 4)]))

(def fixed
  (scenario
    :name :fixed
    :stations
    [(station :type :supply :die 0 :productivity {:type :constrained :by-station 3 :use :output})
     (station :supplier 0 :die 1 :productivity {:type :high} :tracer-start true)
     (station :supplier 1 :die 2 :productivity {:type :high})
     (station :supplier 2 :die 3 :pennies (repeat 6 :penny))
     (station :supplier 3 :die 4 :productivity {:type :high} :tracer-reset 0)
     (station :type :distribution :supplier 4)]))

(def scenarios
  {:basic basic
   :efficient efficient
   :constrained constrained})
