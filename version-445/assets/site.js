(function () {
  function qs(selector, root) {
    return (root || document).querySelector(selector);
  }

  function qsa(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function normalize(value) {
    return String(value || '').toLowerCase().trim();
  }

  function setupMenu() {
    var toggle = qs('[data-menu-toggle]');
    var menu = qs('[data-nav-menu]');
    var searchToggle = qs('[data-search-toggle]');
    var navSearch = qs('[data-nav-search]');

    if (toggle && menu) {
      toggle.addEventListener('click', function () {
        menu.classList.toggle('is-open');
      });
    }

    if (searchToggle && navSearch) {
      searchToggle.addEventListener('click', function () {
        navSearch.classList.toggle('is-open');
        var input = qs('input', navSearch);
        if (input) {
          input.focus();
        }
      });
    }
  }

  function setupHero() {
    var hero = qs('[data-hero]');
    if (!hero) {
      return;
    }

    var slides = qsa('[data-hero-slide]', hero);
    var dots = qsa('[data-hero-dot]', hero);
    if (!slides.length) {
      return;
    }

    var index = 0;
    var timer = null;

    function show(next) {
      index = (next + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === index);
      });
    }

    function start() {
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        window.clearInterval(timer);
        show(Number(dot.getAttribute('data-hero-dot')) || 0);
        start();
      });
    });

    start();
  }

  function setupFilters() {
    var searchInputs = qsa('[data-card-search]');
    var categoryFilter = qs('[data-category-filter]');
    var cards = qsa('[data-card]');

    if (!cards.length) {
      return;
    }

    function apply() {
      var term = normalize(searchInputs.map(function (input) {
        return input.value;
      }).filter(Boolean).join(' '));
      var selected = categoryFilter ? normalize(categoryFilter.value) : '';

      cards.forEach(function (card) {
        var haystack = normalize([
          card.getAttribute('data-title'),
          card.getAttribute('data-region'),
          card.getAttribute('data-type'),
          card.getAttribute('data-category'),
          card.textContent
        ].join(' '));
        var category = normalize(card.getAttribute('data-category'));
        var matchesTerm = !term || haystack.indexOf(term) !== -1;
        var matchesCategory = !selected || category === selected;
        card.classList.toggle('is-filter-hidden', !(matchesTerm && matchesCategory));
      });
    }

    searchInputs.forEach(function (input) {
      input.addEventListener('input', apply);
    });

    if (categoryFilter) {
      categoryFilter.addEventListener('change', apply);
    }
  }

  window.initMoviePlayer = function (sourceUrl) {
    var video = qs('[data-player-video]');
    var layer = qs('[data-player-layer]');
    var button = qs('[data-player-button]');
    var hlsInstance = null;

    if (!video || !sourceUrl) {
      return;
    }

    function load() {
      if (video.getAttribute('data-ready') === '1') {
        return;
      }

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = sourceUrl;
      } else if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({ enableWorker: true });
        hlsInstance.loadSource(sourceUrl);
        hlsInstance.attachMedia(video);
      } else {
        video.src = sourceUrl;
      }

      video.setAttribute('data-ready', '1');
    }

    function start() {
      load();
      if (layer) {
        layer.classList.add('is-hidden');
      }
      video.controls = true;
      var promise = video.play();
      if (promise && promise.catch) {
        promise.catch(function () {});
      }
    }

    if (layer) {
      layer.addEventListener('click', start);
    }

    if (button) {
      button.addEventListener('click', function (event) {
        event.stopPropagation();
        start();
      });
    }

    video.addEventListener('click', function () {
      if (video.getAttribute('data-ready') !== '1') {
        start();
      }
    });

    window.addEventListener('pagehide', function () {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    });
  };

  document.addEventListener('DOMContentLoaded', function () {
    setupMenu();
    setupHero();
    setupFilters();
  });
})();
