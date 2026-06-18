(function () {
  var searchToggle = document.querySelector('[data-search-toggle]');
  var headerSearch = document.querySelector('[data-header-search]');
  if (searchToggle && headerSearch) {
    searchToggle.addEventListener('click', function () {
      headerSearch.classList.toggle('open');
      var input = headerSearch.querySelector('input');
      if (headerSearch.classList.contains('open') && input) {
        input.focus();
      }
    });
  }

  var menuToggle = document.querySelector('[data-menu-toggle]');
  var mobileNav = document.querySelector('[data-mobile-nav]');
  if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', function () {
      mobileNav.classList.toggle('open');
    });
  }

  var backTop = document.querySelector('[data-back-top]');
  if (backTop) {
    backTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  var hero = document.querySelector('[data-hero]');
  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var current = 0;
    var showSlide = function (index) {
      if (!slides.length) {
        return;
      }
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('active', i === current);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === current);
      });
    };
    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        showSlide(i);
      });
    });
    window.setInterval(function () {
      showSlide(current + 1);
    }, 5200);
  }

  var params = new URLSearchParams(window.location.search);
  var q = params.get('q');
  var panel = document.querySelector('[data-filter-panel]');
  if (panel) {
    var input = panel.querySelector('[data-filter-input]');
    var clear = panel.querySelector('[data-filter-clear]');
    var regionButtons = Array.prototype.slice.call(panel.querySelectorAll('[data-filter-region]'));
    var genreButtons = Array.prototype.slice.call(panel.querySelectorAll('[data-filter-genre]'));
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-card]'));
    var empty = document.querySelector('[data-empty-state]');
    var state = {
      text: q || '',
      region: '全部',
      genre: '全部'
    };
    if (input && q) {
      input.value = q;
    }
    var normalize = function (value) {
      return String(value || '').toLowerCase().trim();
    };
    var applyFilter = function () {
      var visible = 0;
      var text = normalize(state.text);
      cards.forEach(function (card) {
        var haystack = normalize([
          card.getAttribute('data-title'),
          card.getAttribute('data-genre'),
          card.getAttribute('data-region'),
          card.getAttribute('data-year')
        ].join(' '));
        var region = card.getAttribute('data-region') || '';
        var genre = card.getAttribute('data-genre') || '';
        var matchText = !text || haystack.indexOf(text) !== -1;
        var matchRegion = state.region === '全部' || region.indexOf(state.region) !== -1 || (state.region === '欧美' && (region.indexOf('美国') !== -1 || region.indexOf('英国') !== -1 || region.indexOf('法国') !== -1));
        var matchGenre = state.genre === '全部' || genre.indexOf(state.genre) !== -1;
        var ok = matchText && matchRegion && matchGenre;
        card.classList.toggle('hidden', !ok);
        if (ok) {
          visible += 1;
        }
      });
      if (empty) {
        empty.classList.toggle('show', visible === 0);
      }
    };
    if (input) {
      input.addEventListener('input', function () {
        state.text = input.value;
        applyFilter();
      });
    }
    regionButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        state.region = button.getAttribute('data-filter-region') || '全部';
        regionButtons.forEach(function (item) {
          item.classList.toggle('active', item === button);
        });
        applyFilter();
      });
    });
    genreButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        state.genre = button.getAttribute('data-filter-genre') || '全部';
        genreButtons.forEach(function (item) {
          item.classList.toggle('active', item === button);
        });
        applyFilter();
      });
    });
    if (clear) {
      clear.addEventListener('click', function () {
        state.text = '';
        state.region = '全部';
        state.genre = '全部';
        if (input) {
          input.value = '';
        }
        regionButtons.forEach(function (item, i) {
          item.classList.toggle('active', i === 0);
        });
        genreButtons.forEach(function (item, i) {
          item.classList.toggle('active', i === 0);
        });
        applyFilter();
      });
    }
    regionButtons.forEach(function (item, i) {
      item.classList.toggle('active', i === 0);
    });
    genreButtons.forEach(function (item, i) {
      item.classList.toggle('active', i === 0);
    });
    applyFilter();
  }

  var player = document.querySelector('[data-player]');
  if (player) {
    var video = player.querySelector('video');
    var start = player.querySelector('[data-player-start]');
    var lineButtons = Array.prototype.slice.call(document.querySelectorAll('[data-line-src]'));
    var hlsInstance = null;
    var loadedSrc = '';
    var loadVideo = function (src, autoplay) {
      if (!video || !src) {
        return;
      }
      if (hlsInstance) {
        hlsInstance.destroy();
        hlsInstance = null;
      }
      loadedSrc = src;
      if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({ enableWorker: true, lowLatencyMode: true });
        hlsInstance.loadSource(src);
        hlsInstance.attachMedia(video);
        hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, function () {
          if (autoplay) {
            video.play().catch(function () {});
          }
        });
      } else {
        video.src = src;
        if (autoplay) {
          video.play().catch(function () {});
        }
      }
      player.classList.add('is-playing');
    };
    var playDefault = function () {
      var src = video ? video.getAttribute('data-stream') : '';
      loadVideo(src, true);
    };
    if (start) {
      start.addEventListener('click', playDefault);
    }
    if (video) {
      video.addEventListener('click', function () {
        if (!loadedSrc) {
          playDefault();
        }
      });
    }
    lineButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        var src = button.getAttribute('data-line-src');
        lineButtons.forEach(function (item) {
          item.classList.toggle('active', item === button);
        });
        if (video) {
          video.setAttribute('data-stream', src || '');
        }
        loadVideo(src, true);
      });
    });
  }
})();
