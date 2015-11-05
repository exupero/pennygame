(ns pennygame.states)

(defn station [t & args]
  (merge {:id (gensym "station")
          :type t}
         (apply hash-map args)))

(def example
  {:dice [{:value 0 :type :supply}
          {:value 0 :type :processing}
          {:value 0 :type :processing}
          {:value 0 :type :processing}
          {:value 0 :type :processing}]
   :scenarios [{:stations [(station :supply :output-die 0)
                           (station :processing :input-die 0 :output-die 1 :pennies (vec (range 300)))
                           (station :processing :input-die 1 :output-die 2 :pennies (vec (range 100)))
                           (station :processing :input-die 2 :output-die 3 :pennies (vec (range 50)))
                           (station :processing :input-die 3 :output-die 4 :pennies [])
                           (station :distribution :input-die 4)]}
               {:stations [(station :supply :output-die 0)
                           (station :processing :input-die 0 :output-die 1 :pennies [])
                           (station :processing :input-die 1 :output-die 2 :pennies [])
                           (station :processing :input-die 2 :output-die 3 :pennies [])
                           (station :processing :input-die 3 :output-die 4 :pennies [])
                           (station :distribution :input-die 4)]}
               {:stations [(station :supply :output-die 0)
                           (station :processing :input-die 0 :output-die 1 :pennies [])
                           (station :processing :input-die 1 :output-die 2 :pennies [])
                           (station :processing :input-die 2 :output-die 3 :pennies [])
                           (station :processing :input-die 3 :output-die 4 :pennies [])
                           (station :distribution :input-die 4)]}]})
