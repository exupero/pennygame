(ns pennygame.dom)

(defn penny-path [id]
  (.querySelector js/document (str "#" id " .penny-path")))

(defn ramp [id]
  (.querySelector js/document (str "#" id " .ramp")))
