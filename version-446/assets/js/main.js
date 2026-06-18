(function () {
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
    } else {
      document.addEventListener("DOMContentLoaded", fn);
    }
  }

  function normalize(value) {
    return String(value || "").trim().toLowerCase();
  }

  function setupMenu() {
    var toggle = document.querySelector("[data-menu-toggle]");
    var panel = document.querySelector("[data-mobile-panel]");
    if (!toggle || !panel) {
      return;
    }
    toggle.addEventListener("click", function () {
      panel.classList.toggle("is-open");
      toggle.textContent = panel.classList.contains("is-open") ? "×" : "☰";
    });
  }

  function setupHero() {
    var root = document.querySelector("[data-hero]");
    if (!root) {
      return;
    }
    var slides = Array.prototype.slice.call(root.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(root.querySelectorAll("[data-hero-dot]"));
    var prev = root.querySelector("[data-hero-prev]");
    var next = root.querySelector("[data-hero-next]");
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("is-active", i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("is-active", i === index);
      });
    }

    function schedule() {
      window.clearInterval(timer);
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5600);
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () {
        show(i);
        schedule();
      });
    });
    if (prev) {
      prev.addEventListener("click", function () {
        show(index - 1);
        schedule();
      });
    }
    if (next) {
      next.addEventListener("click", function () {
        show(index + 1);
        schedule();
      });
    }
    if (slides.length > 1) {
      schedule();
    }
  }

  function setupFilters() {
    var bars = Array.prototype.slice.call(document.querySelectorAll("[data-filter-bar]"));
    if (!bars.length) {
      return;
    }
    bars.forEach(function (bar) {
      var input = bar.querySelector("[data-filter-input]");
      var year = bar.querySelector("[data-filter-year]");
      var region = bar.querySelector("[data-filter-region]");
      var type = bar.querySelector("[data-filter-type]");
      var scope = bar.closest("main") || document;
      var cards = Array.prototype.slice.call(scope.querySelectorAll("[data-movie-card]"));
      var empty = scope.querySelector("[data-empty-state]");
      var params = new URLSearchParams(window.location.search);
      var q = params.get("q");
      var searchScope = bar.closest("[data-search-page]");
      if (q && input && searchScope) {
        input.value = q;
      }

      function apply() {
        var qv = normalize(input && input.value);
        var yv = normalize(year && year.value);
        var rv = normalize(region && region.value);
        var tv = normalize(type && type.value);
        var visible = 0;
        cards.forEach(function (card) {
          var text = normalize(card.getAttribute("data-search"));
          var cardYear = normalize(card.getAttribute("data-year"));
          var cardRegion = normalize(card.getAttribute("data-region"));
          var cardType = normalize(card.getAttribute("data-type"));
          var ok = true;
          if (qv && text.indexOf(qv) === -1) {
            ok = false;
          }
          if (yv && cardYear !== yv) {
            ok = false;
          }
          if (rv && cardRegion.indexOf(rv) === -1) {
            ok = false;
          }
          if (tv && cardType !== tv) {
            ok = false;
          }
          card.hidden = !ok;
          if (ok) {
            visible += 1;
          }
        });
        if (empty) {
          empty.classList.toggle("is-visible", visible === 0);
        }
      }

      [input, year, region, type].forEach(function (control) {
        if (control) {
          control.addEventListener("input", apply);
          control.addEventListener("change", apply);
        }
      });
      apply();
    });
  }

  ready(function () {
    setupMenu();
    setupHero();
    setupFilters();
  });
})();
