(ns pennygame.animations
  (:require-macros [cljs.core.async.macros :refer [go]]
                   [pennygame.macros :refer [spy]])
  (:require [cljs.core.async :refer [<! timeout]]
            [vdom.hooks :refer [hook]]))

(def queue (atom {}))

(def fps 60)

(defn push! [f]
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

(defn transition
  [f {wait :delay :keys [duration easing]
      :or {wait 0 easing identity}}]
  (hook
    (fn [el]
      (push! (fn [t]
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
                   false)))))))
