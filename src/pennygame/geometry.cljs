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

(defn cells [[w h] c]
  (let [rows (->> c (.sqrt js/Math) (.ceil js/Math))
        cw (/ w rows)
        ch (/ h rows)
        dim {:width cw :height ch}]
    (for [c (range rows)
          r (range rows)]
      (assoc dim :x (* r cw) :y (* c ch)))))

(def extent (juxt (partial apply min) (partial apply max)))

(defn linear [[dl dh] [rl rh]]
  (let [[dl dh] (if (= dl dh)
                  [0 1]
                  [dl dh])
        m (/ (- rh rl) (- dh dl))
        b (- rh (* m dh))]
    #(+ (* m %) b)))
