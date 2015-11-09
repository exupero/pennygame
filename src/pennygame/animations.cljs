(ns pennygame.animations
  (:require-macros [cljs.core.async.macros :refer [go]]
                   [pennygame.macros :refer [spy]])
  (:require [cljs.core.async :refer [<! timeout]]
            [pennygame.geometry :as g]))

(def queue (atom {}))

(def fps 30)

(defn enqueue! [f]
  (swap! queue assoc (gensym "animation") f))

(defn remove! [id]
  (swap! queue dissoc id))

(defn run []
  (let [dt (/ 1000 fps)]
    (go
      (<! (timeout 0))
      (loop [t 0]
        (when (seq @queue)
          (doseq [[id f] @queue]
            (when-not (f t)
              (remove! id)))
          (<! (timeout dt))
          (recur (+ t dt)))))))

(defn ease-in [x]
  (* x x))

(defn tweener [el f {wait :delay :keys [duration easing]
                     :or {wait 0 easing identity}}]
  (fn [t]
    (cond
      (<= t wait)
      true

      (< t (+ wait duration))
      (do
        (f el (easing (/ (- t wait) duration)))
        true)

      :else
      (do
        (f el 1)
        false))))

(defn tween [f opts]
  (fn [el]
    (enqueue! (tweener el f opts))))

(defn transition [props opts]
  (fn [el]
    (let [ks (map name (keys props))
          ts (zipmap
               ks
               (map (fn [[a b]]
                      (let [d (- b a)]
                        #(+ a (* d %))))
                    (vals props)))
          f (fn [_ t]
              (doseq [[k df] (seq ts)]
                (.setAttribute el k (df t))))]
      (enqueue! (tweener el f opts)))))

(defn path [p [xa ya] opts]
  (fn [el]
    (let [len (.getTotalLength p)
          xa (name xa)
          ya (name ya)
          f (fn [_ t]
              (let [[x y] (g/xy (.getPointAtLength p (* t len)))]
                (doto el
                  (.setAttribute xa x)
                  (.setAttribute ya y))))]
      (enqueue! (tweener el f opts)))))
