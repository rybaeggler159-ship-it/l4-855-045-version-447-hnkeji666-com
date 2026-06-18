(function () {
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
    } else {
      document.addEventListener("DOMContentLoaded", fn);
    }
  }

  ready(function () {
    var players = Array.prototype.slice.call(document.querySelectorAll(".movie-player"));
    players.forEach(function (player) {
      var video = player.querySelector("video");
      var trigger = player.querySelector(".play-trigger");
      var url = player.getAttribute("data-play-url");
      var hls = null;

      function prepare() {
        if (!video || !url || video.getAttribute("data-ready") === "1") {
          return;
        }
        video.setAttribute("data-ready", "1");
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = url;
        } else if (window.Hls && window.Hls.isSupported()) {
          hls = new window.Hls({ enableWorker: true });
          hls.loadSource(url);
          hls.attachMedia(video);
          hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
            var replay = video.play();
            if (replay && replay.catch) {
              replay.catch(function () {});
            }
          });
        } else {
          video.src = url;
        }
      }

      function start(event) {
        if (event) {
          event.preventDefault();
        }
        prepare();
        player.classList.add("is-playing");
        video.controls = true;
        var promise = video.play();
        if (promise && promise.catch) {
          promise.catch(function () {});
        }
      }

      if (trigger) {
        trigger.addEventListener("click", start);
      }
      if (video) {
        video.addEventListener("click", function () {
          if (video.getAttribute("data-ready") !== "1") {
            start();
          }
        });
      }
      window.addEventListener("pagehide", function () {
        if (hls) {
          hls.destroy();
        }
      });
    });
  });
})();
