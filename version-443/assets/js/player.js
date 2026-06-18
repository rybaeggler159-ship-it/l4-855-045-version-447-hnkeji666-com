(function () {
  var players = Array.prototype.slice.call(document.querySelectorAll('[data-player]'));

  function attachSource(video, source) {
    if (!video || !source) {
      return null;
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      if (video.src !== source) {
        video.src = source;
      }
      return null;
    }

    if (window.Hls && window.Hls.isSupported()) {
      if (video.__hlsInstance) {
        return video.__hlsInstance;
      }

      var hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90
      });
      hls.loadSource(source);
      hls.attachMedia(video);
      video.__hlsInstance = hls;
      return hls;
    }

    if (video.src !== source) {
      video.src = source;
    }

    return null;
  }

  players.forEach(function (player) {
    var video = player.querySelector('video');
    var button = player.querySelector('[data-play-button]');
    var source = player.getAttribute('data-source');

    function startPlayback() {
      attachSource(video, source);

      if (button) {
        button.hidden = true;
      }

      var playPromise = video.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(function () {
          if (button) {
            button.hidden = false;
          }
        });
      }
    }

    if (button) {
      button.addEventListener('click', startPlayback);
    }

    if (video) {
      video.addEventListener('click', function () {
        if (video.paused) {
          startPlayback();
        }
      });

      video.addEventListener('play', function () {
        if (button) {
          button.hidden = true;
        }
      });
    }
  });
})();
