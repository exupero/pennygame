(ns pennygame.sizes
  (:require-macros [pennygame.macros :refer [spy]]))

(def penny 20)

(def height
  {:supply 2
   :processing 4
   :distribution 1})

(def bin-h-
  {:supply (* 2 penny)
   :processing (* 2 penny)
   :distribution 0})

(defn heights [h ss]
  (let [in-units (map (comp height :type) ss)
        unit (/ h (reduce + in-units))]
    (map (partial * unit) in-units)))

(defn stack [f ys x]
  (conj ys (f (peek ys) x)))

(defn bin-height [{t :type} h]
  (let [bh (- h (bin-h- t))]
    (- bh (mod bh penny))))

(defn stations [{w :width h :height} ss]
  (let [hs (heights h ss)]
    (map (fn [{t :type :as s} h y bh]
           (merge s {:y y
                     :width w
                     :bin-h bh
                     :spout-y bh
                     :source-spout-y (- (* 1.5 penny))}))
         ss hs
         (reduce (partial stack +) [0] hs)
         (map bin-height ss hs))))

(defn scenario [{w :width h :height :as pos} {ss :stations :as s}]
  (-> s
    (merge pos)
    (update :stations (partial stations {:width w :height h}))))

(defn scenarios [{w :width h :height :keys [x]} ss]
  (let [c (count ss)
        w' (/ w c)]
    (map (fn [x s]
           (scenario {:x x
                      :width (- w' 30)
                      :height h}
                     s))
         (take c (iterate (partial + w') x))
         ss)))
