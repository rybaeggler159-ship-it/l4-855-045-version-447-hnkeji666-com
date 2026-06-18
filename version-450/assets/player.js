(function () {
    window.initMoviePlayer = function (videoId, layerId, url) {
        var video = document.getElementById(videoId);
        var layer = document.getElementById(layerId);
        var hls = null;
        var ready = false;

        if (!video || !layer || !url) {
            return;
        }

        function attach() {
            if (ready) {
                return;
            }
            ready = true;
            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = url;
            } else if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hls.loadSource(url);
                hls.attachMedia(video);
            } else {
                video.src = url;
            }
        }

        function play() {
            attach();
            layer.classList.add('is-hidden');
            var promise = video.play();
            if (promise && typeof promise.catch === 'function') {
                promise.catch(function () {
                    layer.classList.remove('is-hidden');
                });
            }
        }

        layer.addEventListener('click', play);
        video.addEventListener('click', function () {
            if (video.paused) {
                play();
            }
        });
        video.addEventListener('play', function () {
            layer.classList.add('is-hidden');
        });
        video.addEventListener('pause', function () {
            if (!video.ended) {
                layer.classList.remove('is-hidden');
            }
        });
        window.addEventListener('beforeunload', function () {
            if (hls) {
                hls.destroy();
            }
        });
    };
})();
