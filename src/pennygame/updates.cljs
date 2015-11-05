(ns pennygame.updates
  (:require-macros [pennygame.macros :refer [spy]])
  (:require [com.rpl.specter :as s]))

(defn has-die? [k]
  #(boolean (get % k)))

(defn output [scenarios counts]
  (s/transform [s/ALL :stations s/ALL (has-die? :output-die) (s/collect-one :output-die) :pennies]
    (fn [i pennies]
      (drop (counts i) pennies))
    scenarios))

(defn input [scenarios counts]
  (s/transform [s/ALL :stations s/ALL (has-die? :input-die) (s/collect-one :input-die) :pennies]
    (fn [i pennies]
      (concat pennies (range (counts i))))
    scenarios))
