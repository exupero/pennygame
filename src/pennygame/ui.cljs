(ns pennygame.ui
  (:require-macros [pennygame.macros :refer [spy]]))

(defn pair [[x y]]
  (str x "," y))

(defn path [pts]
  (when (seq pts)
    (->> pts
      (map pair)
      (interpose "L")
      (apply str "M"))))

(defn closed-path [pts]
  (str (path pts) "Z"))

(def *size* 20)

(defn translate [x y]
  (str "translate(" x "," y ")"))

(defn spout [w]
  (let [s 3]
    [:path {:class "spout"
            :d (closed-path [[w (- *size*)]
                             [w (+ s *size*)]
                             [0 (+ s *size*)]
                             [0 s]
                             [(- w *size*) s]
                             [(- w *size*) (- *size*)]])}]))

(defmulti station :type)

(defmethod station :supply [{w :width h :height :keys [y]}]
  [:g {:class "supply"
       :transform (translate 0 y)}
   (let [bottom (- h *size*)]
     (list
       [:rect {:class "bin"
               :width w :height bottom}]
       [:g {:transform (translate 0 bottom)}
        (spout w)]))])

(defmethod station :processing [{w :width h :height :keys [y]}]
  [:g {:class "station"
       :transform (translate 0 y)}
   (let [bottom (- h *size*)]
     (list
       [:rect {:class "bin"
               :width w :height bottom}]
       [:g {:transform (translate 0 bottom)}
        (spout w)]))])

(defmethod station :distribution [{w :width h :height :keys [y]}]
  [:g {:class "supply"
       :transform (translate 0 y)}
   [:rect {:class "bin"
           :width w :height h}]])

(defn scenario [{:keys [x stations]}]
  [:g {:class "scenario" :transform (translate x 0)}
   (map station stations)])

(defn ui [{:keys [scenarios]} actions]
  [:svg {:id "space" :width "100%" :height "100%"}
   (map scenario scenarios)])
