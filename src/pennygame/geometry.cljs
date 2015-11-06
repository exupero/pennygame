(ns pennygame.geometry
  (:require [pennygame.sizes :as s]))

(defn dots [n]
  (condp = n
    0 []
    1 [[0 0]]
    2 [[-1 -1] [1 1]]
    3 [[-1 -1] [0 0] [1 1]]
    4 [[-1 -1] [-1 1] [1 -1] [1 1]]
    5 [[-1 -1] [-1 1] [0 0] [1 -1] [1 1]]
    6 [[-1 -1] [-1 0] [-1 1] [1 -1] [1 0] [1 1]]))

(def xy (juxt #(.-x %) #(.-y %)))

(defn penny-d [n spacing]
  (-> spacing (* n) (+ s/penny)))

(defn spacing [len c default]
  (if (< (penny-d c default) len)
    default
    (/ len c)))
