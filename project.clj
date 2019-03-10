(defproject flying-clj "0.1.0-SNAPSHOT"
  :description "FIXME: write description"
  :url "http://example.com/FIXME"
  :license {:name "EPL-2.0 OR GPL-2.0-or-later WITH Classpath-exception-2.0"
            :url "https://www.eclipse.org/legal/epl-2.0/"}
  :dependencies [[org.clojure/clojure "1.10.0"]
                 [http-kit "2.3.0"]]
  :main flying-clj.core
  :uberjar-name "flying-clj-standalone.jar" ;; for Heroku
  :profiles {:uberjar {:aot [flying-clj.core]}} ;; for Heroku
  :min-lein-version "2.9.1" ;; for Heroku
  :repl-options {:init-ns flying-clj.core})
