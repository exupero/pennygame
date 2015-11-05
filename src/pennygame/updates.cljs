(ns pennygame.updates
  (:require-macros [pennygame.macros :refer [spy]]))

(defn update-stations [f scenarios]
  (map #(update % :stations (partial map f))
       scenarios))

(defn output [scenarios counts]
  (update-stations
    (fn [{i :output-die :as station}]
      (if i
        (update station :pennies (partial drop (counts i)))
        station))
    scenarios))

(defn input [scenarios counts]
  (update-stations
    (fn [{i :input-die :as station}]
      (if i
        (update station :pennies concat (range (counts i)))
        station))
    scenarios))
