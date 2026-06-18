(function () {
    function normalize(value) {
        return (value || '').toString().toLowerCase().replace(/\s+/g, ' ').trim();
    }

    function initMobileMenu() {
        var button = document.querySelector('.js-menu-toggle');
        var panel = document.querySelector('.js-mobile-panel');
        if (!button || !panel) {
            return;
        }
        button.addEventListener('click', function () {
            panel.classList.toggle('is-open');
        });
    }

    function initHero() {
        var carousel = document.querySelector('.js-hero-carousel');
        if (!carousel) {
            return;
        }
        var slides = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-dot]'));
        var prev = carousel.querySelector('.js-hero-prev');
        var next = carousel.querySelector('.js-hero-next');
        var index = 0;
        var timer = null;

        function show(target) {
            if (!slides.length) {
                return;
            }
            index = (target + slides.length) % slides.length;
            slides.forEach(function (slide, i) {
                slide.classList.toggle('is-active', i === index);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle('is-active', i === index);
            });
        }

        function start() {
            stop();
            timer = window.setInterval(function () {
                show(index + 1);
            }, 5600);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }

        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                show(parseInt(dot.getAttribute('data-hero-dot'), 10) || 0);
                start();
            });
        });

        if (prev) {
            prev.addEventListener('click', function () {
                show(index - 1);
                start();
            });
        }

        if (next) {
            next.addEventListener('click', function () {
                show(index + 1);
                start();
            });
        }

        carousel.addEventListener('mouseenter', stop);
        carousel.addEventListener('mouseleave', start);
        show(0);
        start();
    }

    function initFilters() {
        var input = document.querySelector('.js-search-input');
        var year = document.querySelector('.js-year-filter');
        var region = document.querySelector('.js-region-filter');
        var scope = document.querySelector('.js-filter-scope');
        var empty = document.querySelector('.js-empty-state');
        if (!scope || (!input && !year && !region)) {
            return;
        }
        var cards = Array.prototype.slice.call(scope.querySelectorAll('.movie-card'));

        function apply() {
            var q = normalize(input ? input.value : '');
            var y = normalize(year ? year.value : '');
            var r = normalize(region ? region.value : '');
            var visible = 0;
            cards.forEach(function (card) {
                var data = normalize(card.getAttribute('data-title'));
                var cardYear = normalize(card.getAttribute('data-year'));
                var cardRegion = normalize(card.getAttribute('data-region'));
                var match = true;
                if (q && data.indexOf(q) === -1) {
                    match = false;
                }
                if (y && cardYear !== y) {
                    match = false;
                }
                if (r && cardRegion !== r) {
                    match = false;
                }
                card.style.display = match ? '' : 'none';
                if (match) {
                    visible += 1;
                }
            });
            if (empty) {
                empty.classList.toggle('is-visible', visible === 0);
            }
        }

        if (input) {
            input.addEventListener('input', apply);
        }
        if (year) {
            year.addEventListener('change', apply);
        }
        if (region) {
            region.addEventListener('change', apply);
        }
        apply();
    }

    function attachVideo(video, source) {
        if (!video || video.dataset.ready === 'true') {
            return;
        }
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = source;
        } else if (window.Hls && window.Hls.isSupported()) {
            var hls = new window.Hls({
                enableWorker: true,
                lowLatencyMode: true
            });
            hls.loadSource(source);
            hls.attachMedia(video);
            video._hls = hls;
        } else {
            video.src = source;
        }
        video.dataset.ready = 'true';
    }

    function initPlayer(containerId, source) {
        var container = document.getElementById(containerId);
        if (!container) {
            return;
        }
        var video = container.querySelector('video');
        var overlay = container.querySelector('.play-cover');
        if (!video || !source) {
            return;
        }

        function start() {
            attachVideo(video, source);
            if (overlay) {
                overlay.classList.add('is-hidden');
            }
            video.controls = true;
            var promise = video.play();
            if (promise && typeof promise.catch === 'function') {
                promise.catch(function () {
                    if (overlay) {
                        overlay.classList.remove('is-hidden');
                    }
                });
            }
        }

        if (overlay) {
            overlay.addEventListener('click', start);
        }
        video.addEventListener('click', function () {
            if (video.paused) {
                start();
            }
        });
        video.addEventListener('play', function () {
            if (overlay) {
                overlay.classList.add('is-hidden');
            }
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        initMobileMenu();
        initHero();
        initFilters();
    });

    window.MovieSite = {
        initPlayer: initPlayer
    };
})();
