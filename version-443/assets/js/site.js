(function () {
  var menuButton = document.querySelector('[data-menu-button]');
  var mobileMenu = document.querySelector('[data-mobile-menu]');

  if (menuButton && mobileMenu) {
    menuButton.addEventListener('click', function () {
      var isOpen = mobileMenu.classList.toggle('open');
      menuButton.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
  var activeSlide = 0;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }

    activeSlide = (index + slides.length) % slides.length;

    slides.forEach(function (slide, i) {
      slide.classList.toggle('active', i === activeSlide);
    });

    dots.forEach(function (dot, i) {
      dot.classList.toggle('active', i === activeSlide);
      dot.setAttribute('aria-current', i === activeSlide ? 'true' : 'false');
    });
  }

  dots.forEach(function (dot, i) {
    dot.addEventListener('click', function () {
      showSlide(i);
    });
  });

  if (slides.length > 1) {
    showSlide(0);
    window.setInterval(function () {
      showSlide(activeSlide + 1);
    }, 5200);
  }

  var searchInput = document.querySelector('[data-search-input]');
  var regionFilter = document.querySelector('[data-filter-region]');
  var genreFilter = document.querySelector('[data-filter-genre]');
  var yearFilter = document.querySelector('[data-filter-year]');
  var resetButton = document.querySelector('[data-filter-reset]');
  var noResults = document.querySelector('[data-no-results]');
  var cards = Array.prototype.slice.call(document.querySelectorAll('[data-search-card]'));

  function normalized(value) {
    return String(value || '').trim().toLowerCase();
  }

  function cardMatches(card, query, region, genre, year) {
    var title = normalized(card.getAttribute('data-title'));
    var cardRegion = normalized(card.getAttribute('data-region'));
    var cardGenre = normalized(card.getAttribute('data-genre'));
    var cardTags = normalized(card.getAttribute('data-tags'));
    var cardYear = normalized(card.getAttribute('data-year'));
    var haystack = [title, cardRegion, cardGenre, cardTags, cardYear].join(' ');

    if (query && haystack.indexOf(query) === -1) {
      return false;
    }

    if (region && cardRegion.indexOf(region) === -1) {
      return false;
    }

    if (genre && cardGenre.indexOf(genre) === -1 && cardTags.indexOf(genre) === -1) {
      return false;
    }

    if (year && cardYear !== year) {
      return false;
    }

    return true;
  }

  function applyFilters() {
    if (!cards.length) {
      return;
    }

    var query = normalized(searchInput && searchInput.value);
    var region = normalized(regionFilter && regionFilter.value);
    var genre = normalized(genreFilter && genreFilter.value);
    var year = normalized(yearFilter && yearFilter.value);
    var visibleCount = 0;

    cards.forEach(function (card) {
      var matched = cardMatches(card, query, region, genre, year);
      card.hidden = !matched;
      if (matched) {
        visibleCount += 1;
      }
    });

    if (noResults) {
      noResults.classList.toggle('show', visibleCount === 0);
    }
  }

  [searchInput, regionFilter, genreFilter, yearFilter].forEach(function (element) {
    if (element) {
      element.addEventListener('input', applyFilters);
      element.addEventListener('change', applyFilters);
    }
  });

  if (resetButton) {
    resetButton.addEventListener('click', function () {
      if (searchInput) {
        searchInput.value = '';
      }
      if (regionFilter) {
        regionFilter.value = '';
      }
      if (genreFilter) {
        genreFilter.value = '';
      }
      if (yearFilter) {
        yearFilter.value = '';
      }
      applyFilters();
    });
  }
})();
