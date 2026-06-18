(function () {
  window.setupMoviePlayer = function (options) {
    var video = document.getElementById(options.videoId);
    var trigger = document.getElementById(options.triggerId);
    var stream = options.stream;
    var hlsInstance = null;
    var prepared = false;

    if (!video || !trigger || !stream) {
      return;
    }

    function attachStream() {
      if (prepared) {
        return;
      }
      prepared = true;
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = stream;
      } else if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hlsInstance.loadSource(stream);
        hlsInstance.attachMedia(video);
      } else {
        video.src = stream;
      }
    }

    function start() {
      attachStream();
      video.setAttribute("controls", "controls");
      trigger.classList.add("is-hidden");
      var playing = video.play();
      if (playing && typeof playing.catch === "function") {
        playing.catch(function () {
          trigger.classList.remove("is-hidden");
        });
      }
    }

    trigger.addEventListener("click", start);
    video.addEventListener("click", function () {
      if (!prepared || video.paused) {
        start();
      }
    });
    window.addEventListener("pagehide", function () {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    });
  };
})();
