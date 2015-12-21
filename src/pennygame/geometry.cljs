(ns pennygame.geometry
  (:require-macros [pennygame.macros :refer [spy]])
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

(defn combinations [n coll]
  (if (= 1 n)
    (map list coll)
    (lazy-seq
      (when-let [[head & tail] (seq coll)]
        (concat (for [x (combinations (dec n) tail)]
                  (cons head x))
                (combinations n tail))))))

(def abs #(.abs js/Math %))

(defn separate [t xs]
  (let [shift #(let [[a b] (sort %)
                     dx (/ (- t (- b a)) 2)]
                 {a (- a dx)
                  b (+ b dx)})]
    (loop [xs xs]
      (let [tc (->> xs
                 (combinations 2)
                 (map #(vector (abs (apply - %)) %))
                 (filter #(< 0 (first %) t))
                 (apply min-key first)
                 second)]
        (if tc
          (recur (replace (shift tc) xs))
          xs)))))

(defn merge-interval [a b]
  (concat a (drop (count a) b)))

(defn graph-scales
  [data
   {w :width h :height}
   {rng :range domain :domain}]
  (let [data (apply concat data)
        domain (merge-interval domain (extent (map first data)))
        rng (merge-interval rng (extent (map second data)))]
    [(linear domain [0 w]) (linear rng [h 0])]))
