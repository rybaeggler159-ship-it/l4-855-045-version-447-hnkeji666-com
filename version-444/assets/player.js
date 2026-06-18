(function () {
  window.initMoviePlayer = function (source) {
    var video = document.getElementById("movie-player");
    var trigger = document.getElementById("movie-play");
    var loaded = false;
    var hls = null;
    var shouldPlay = false;

    if (!video || !source) {
      return;
    }

    function requestPlay() {
      video.play().catch(function () {});
    }

    function attachSource() {
      if (loaded) {
        return;
      }

      loaded = true;

      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = source;
        video.addEventListener("loadedmetadata", function () {
          if (shouldPlay) {
            requestPlay();
          }
        }, { once: true });
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90
        });

        hls.loadSource(source);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
          if (shouldPlay) {
            requestPlay();
          }
        });
        hls.on(window.Hls.Events.ERROR, function (event, data) {
          if (!data || !data.fatal) {
            return;
          }
          if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
            hls.startLoad();
          } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
            hls.recoverMediaError();
          } else {
            hls.destroy();
          }
        });
        return;
      }

      video.src = source;
    }

    function startPlayer() {
      shouldPlay = true;
      attachSource();
      if (trigger) {
        trigger.classList.add("is-hidden");
      }
      requestPlay();
    }

    if (trigger) {
      trigger.addEventListener("click", startPlayer);
    }

    video.addEventListener("click", function () {
      if (!loaded) {
        startPlayer();
      }
    });

    window.addEventListener("beforeunload", function () {
      if (hls) {
        hls.destroy();
      }
    });
  };
})();
