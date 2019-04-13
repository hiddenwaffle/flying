(ns flying.core
  (:gen-class) ;; for uberjar
  (:require [org.httpkit.server :as hk]))

(defn handler [request]
  (hk/with-channel request channel
    (hk/on-close channel (fn [status] (println "channel closed: " status)))
    (hk/on-receive channel (fn [data] ;; echo it back
                             (hk/send! channel (str "echoing: " data))))))

(defn -main []
  (hk/run-server handler {:port (Integer/valueOf (or (System/getenv "PORT")
                                                     "3000"))}))

;; TODO: Handle lag by calculating jitter from pings and hold events for X milliseconds
