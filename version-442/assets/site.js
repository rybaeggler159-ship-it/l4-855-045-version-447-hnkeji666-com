(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
      return;
    }
    callback();
  }

  function setupMenu() {
    var button = document.querySelector(".menu-toggle");
    var nav = document.querySelector(".mobile-nav");
    if (!button || !nav) {
      return;
    }
    button.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      button.setAttribute("aria-expanded", open ? "true" : "false");
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
    var current = 0;
    var timer = null;

    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("active", slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("active", dotIndex === current);
      });
    }

    function restart() {
      if (timer) {
        window.clearInterval(timer);
      }
      timer = window.setInterval(function () {
        show(current + 1);
      }, 6200);
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener("click", function () {
        show(index);
        restart();
      });
    });

    if (prev) {
      prev.addEventListener("click", function () {
        show(current - 1);
        restart();
      });
    }

    if (next) {
      next.addEventListener("click", function () {
        show(current + 1);
        restart();
      });
    }

    show(0);
    restart();
  }

  function setupFilters() {
    var panels = Array.prototype.slice.call(document.querySelectorAll(".filter-panel"));
    panels.forEach(function (panel) {
      var scope = panel.parentElement || document;
      var input = panel.querySelector(".js-search");
      var buttons = Array.prototype.slice.call(panel.querySelectorAll(".filter-button"));
      var cards = Array.prototype.slice.call(scope.querySelectorAll(".movie-card"));
      var empty = panel.querySelector(".empty-state");
      var state = {
        query: "",
        year: "all",
        category: "all"
      };

      function getText(card) {
        return [
          card.getAttribute("data-title"),
          card.getAttribute("data-tags"),
          card.getAttribute("data-year"),
          card.getAttribute("data-region"),
          card.getAttribute("data-type")
        ].join(" ").toLowerCase();
      }

      function apply() {
        var visible = 0;
        cards.forEach(function (card) {
          var text = getText(card);
          var matchQuery = !state.query || text.indexOf(state.query) !== -1;
          var matchYear = state.year === "all" || card.getAttribute("data-year") === state.year;
          var matchCategory = state.category === "all" || card.getAttribute("data-category") === state.category;
          var showCard = matchQuery && matchYear && matchCategory;
          card.hidden = !showCard;
          if (showCard) {
            visible += 1;
          }
        });
        if (empty) {
          empty.hidden = visible !== 0;
        }
      }

      if (input) {
        input.addEventListener("input", function () {
          state.query = input.value.trim().toLowerCase();
          apply();
        });
      }

      buttons.forEach(function (button) {
        button.addEventListener("click", function () {
          var group = button.closest(".filter-group");
          var groupName = group ? group.getAttribute("data-filter-group") : "year";
          var value = button.getAttribute("data-filter") || "all";
          if (groupName === "category") {
            state.category = value;
          } else {
            state.year = value;
          }
          if (group) {
            Array.prototype.slice.call(group.querySelectorAll(".filter-button")).forEach(function (item) {
              item.classList.toggle("active", item === button);
            });
          }
          apply();
        });
      });
    });
  }

  ready(function () {
    setupMenu();
    setupHero();
    setupFilters();
  });
})();
