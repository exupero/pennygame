(ns pennygame.sizes
  (:require-macros [pennygame.macros :refer [spy]]))

(def height
  {:supply 1
   :processing 3
   :distribution 1})

(def height-adjust
  {:supply 20
   :processing 20
   :distribution -1})

(defn heights [h ss]
  (let [in-units (map (comp height :type) ss)
        unit (/ h (reduce + in-units))]
    (map (partial * unit) in-units)))

(defn stack [f ys x]
  (conj ys (f (peek ys) x)))

(defn station [pos s]
  (merge s pos))

(defn stations [{w :width h :height} ss]
  (let [hs (heights h ss)
        ys (reduce (partial stack +) [] (cons 0 hs))]
    (map (fn [h y {t :type :as s}]
           (station {:y y
                     :width w
                     :height (- h (height-adjust t))}
                    s))
         hs ys ss)))

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
