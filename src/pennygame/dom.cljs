(ns pennygame.dom)

(defn penny-path [id]
  (.querySelector js/document (str "#" id " .penny-path")))
