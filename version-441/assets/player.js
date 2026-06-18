(function() {
  function createMoviePlayer(config) {
    const video = document.getElementById(config.videoId);
    const overlay = document.getElementById(config.overlayId);
    const button = document.getElementById(config.buttonId);
    let hls = null;
    let ready = false;

    if (!video || !config.source) {
      return;
    }

    function attach() {
      if (ready) {
        return;
      }
      ready = true;
      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90
        });
        hls.loadSource(config.source);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.MANIFEST_PARSED, function() {
          video.play().catch(function() {});
        });
        hls.on(window.Hls.Events.ERROR, function(eventName, data) {
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
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = config.source;
      }
    }

    function begin() {
      attach();
      if (overlay) {
        overlay.classList.add("is-hidden");
      }
      video.play().catch(function() {});
    }

    if (overlay) {
      overlay.addEventListener("click", begin);
    }

    if (button) {
      button.addEventListener("click", begin);
    }

    video.addEventListener("click", function() {
      if (video.paused) {
        begin();
      }
    });

    video.addEventListener("play", function() {
      if (overlay) {
        overlay.classList.add("is-hidden");
      }
    });

    window.addEventListener("pagehide", function() {
      if (hls) {
        hls.destroy();
        hls = null;
      }
    });
  }

  window.createMoviePlayer = createMoviePlayer;
})();
