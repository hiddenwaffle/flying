(ns flying.core
  (:gen-class) ;; for uberjar
  (:require [org.httpkit.server :as hk])
  (:require [cheshire.core :as c]))

(def active-channels (atom []))

(defn broadcast [data original-channel]
  (doseq [channel @active-channels]
    (when (not (identical? channel original-channel))
      (hk/send! channel data))))

(defn verify-event [obj]
  (let [type (get obj "type")]
    (not (nil? type))))

(defn parse-raw [data]
  (try
    (c/decode data)
    (catch Exception e (println "decode error") nil)))

(defn on-receive [data channel]
  (println "Received" data)
  (let [obj (parse-raw data)]
    (when (verify-event obj)
      (broadcast data channel))))

(defn register [channel]
  (swap! active-channels conj channel)
  (println "Channels:" @active-channels))

(defn deregister [original-channel]
  (swap! active-channels
         (fn [channels] (filter
                         (fn [channel]
                           (not (identical? channel original-channel)))
                         channels))))

(defn handler [request]
  (hk/with-channel request channel
    (register channel)
    (hk/on-close channel (fn [status]
                           (deregister channel)))
    (hk/on-receive channel (fn [data]
                             (on-receive data channel)))))

(defn -main []
  (hk/run-server handler {:port (Integer/valueOf (or (System/getenv "PORT")
                                                     "3000"))})
  (println "Started"))

;; TODO: Handle lag by calculating jitter from pings and hold events for X milliseconds
