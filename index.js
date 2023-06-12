(function () {
  "use strict";
  try {
    window.$localStorage = window.localStorage;
    window.$sessionStorage = window.sessionStorage;

    // Test webstorage existence.
    if (!window.localStorage || !window.sessionStorage) throw "exception";
    // Test webstorage accessibility - Needed for Safari private browsing.
    window.localStorage.setItem("storage_test", 1);
    window.localStorage.removeItem("storage_test");
  } catch (e) {
    (function () {
      function createCookie(name, value, days) {
        var expires;
        if (days) {
          var date = new Date();
          date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
          expires = "; expires=" + date.toGMTString();
        } else {
          expires = "";
        }
        document.cookie =
          encodeURIComponent(name) +
          "=" +
          encodeURIComponent(value) +
          expires +
          "; path=/";
      }

      function readCookie(name) {
        var results = document.cookie.match(
          "(^|;) ?" + encodeURIComponent(name) + "=([^;]*)(;|$)"
        );
        return results ? decodeURIComponent(results[2]) : null;
      }

      function Storage(type) {
        function setData(data) {
          data = JSON.stringify(data);
          if (type === "session") {
            createCookie(getSessionName(), data);
          } else {
            createCookie("localStorage", data, 365);
          }
        }

        function clearData() {
          if (type === "session") {
            createCookie(getSessionName(), "");
          } else {
            createCookie("localStorage", "", 365);
          }
        }

        function getData() {
          var data = readCookie(
            type === "session" ? getSessionName() : "localStorage"
          );
          return data ? JSON.parse(data) : {};
        }

        function getSessionName() {
          if (!window.name) {
            window.name = Math.random() + "-" + new Date().getTime();
          }
          return "sessionStorage-" + window.name;
        }

        // Initialize if there's already data.
        var data = getData();

        var obj = {
          POLYFILLED: true,
          length: 0,
          clear: function () {
            data = {};
            this.length = 0;
            clearData();
          },
          getItem: function (key) {
            return Object.prototype.hasOwnProperty.call(data, key)
              ? data[key]
              : null;
          },
          key: function (i) {
            var ctr = 0;
            for (var k in data) {
              if (ctr++ == i) return k;
            }
            return null;
          },
          removeItem: function (key) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
              delete data[key];
              this.length--;
              setData(data);
            }
          },
          setItem: function (key, value) {
            if (!Object.prototype.hasOwnProperty.call(data, key)) {
              this.length++;
            }
            data[key] = "" + value;
            setData(data);
          },
        };
        return obj;
      }

      var localStorage = new Storage("local");
      var sessionStorage = new Storage("session");

      window.$localStorage = localStorage;
      window.$sessionStorage = sessionStorage;

      try {
        window.localStorage = localStorage;
        window.sessionStorage = sessionStorage;
        // For Safari private browsing need to also set the proto value.
        window.localStorage.__proto__ = localStorage;
        window.sessionStorage.__proto__ = sessionStorage;
      } catch (e) {}
      try {
        Object.defineProperty(window, "localStorage", {
          value: localStorage,
        });
        Object.defineProperty(window, "sessionStorage", {
          value: sessionStorage,
        });
      } catch (e) {}
    })();
  }
})();
