(ns pennygame.animations
  (:require-macros [cljs.core.async.macros :refer [go-loop]]
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
    (go-loop [t 0]
      (when (seq @queue)
        (doseq [[id f] @queue]
          (when-not (f t)
            (remove! id)))
        (<! (timeout dt))
        (recur (+ t dt))))))

(def linear identity)

(defn transition
  ([f duration] (transition f duration linear))
  ([f duration easing]
   (hook (fn [el]
           (push! (fn [t]
                    (if (< t duration)
                      (do
                        (f el (easing (/ t duration)))
                        true)
                      (do
                        (f el 1)
                        false))))))))
