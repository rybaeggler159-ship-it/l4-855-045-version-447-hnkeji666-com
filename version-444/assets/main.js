(function () {
  var menuButton = document.querySelector("[data-menu-toggle]");
  var menu = document.querySelector("[data-main-nav]");

  if (menuButton && menu) {
    menuButton.addEventListener("click", function () {
      menu.classList.toggle("is-open");
    });
  }

  var hero = document.querySelector("[data-hero]");

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
    var index = 0;

    function showSlide(nextIndex) {
      if (!slides.length) {
        return;
      }

      index = (nextIndex + slides.length) % slides.length;

      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === index);
      });

      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === index);
      });
    }

    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener("click", function () {
        showSlide(dotIndex);
      });
    });

    setInterval(function () {
      showSlide(index + 1);
    }, 5200);
  }

  function normalize(value) {
    return (value || "").toString().trim().toLowerCase();
  }

  document.querySelectorAll("[data-filter-root]").forEach(function (root) {
    var input = root.querySelector("[data-filter-input]");
    var status = root.querySelector("[data-filter-status]");
    var grid = document.querySelector("[data-filter-grid]");
    var buttons = Array.prototype.slice.call(root.querySelectorAll("[data-category-filter]"));
    var activeCategory = "all";

    if (!grid) {
      return;
    }

    var cards = Array.prototype.slice.call(grid.querySelectorAll("[data-movie-card]"));

    function applyFilter() {
      var query = normalize(input ? input.value : "");
      var visible = 0;

      cards.forEach(function (card) {
        var haystack = normalize([
          card.getAttribute("data-title"),
          card.getAttribute("data-genre"),
          card.getAttribute("data-region"),
          card.getAttribute("data-year")
        ].join(" "));
        var category = card.getAttribute("data-category") || "";
        var matchText = !query || haystack.indexOf(query) !== -1;
        var matchCategory = activeCategory === "all" || category === activeCategory;
        var visibleCard = matchText && matchCategory;

        card.classList.toggle("is-hidden", !visibleCard);
        if (visibleCard) {
          visible += 1;
        }
      });

      if (status) {
        status.textContent = visible ? "已筛选出相关影片" : "没有找到匹配影片";
      }
    }

    if (input) {
      var params = new URLSearchParams(window.location.search);
      var q = params.get("q");
      if (q) {
        input.value = q;
      }
      input.addEventListener("input", applyFilter);
    }

    buttons.forEach(function (button) {
      button.addEventListener("click", function () {
        activeCategory = button.getAttribute("data-category-filter") || "all";
        buttons.forEach(function (item) {
          item.classList.toggle("is-active", item === button);
        });
        applyFilter();
      });
    });

    applyFilter();
  });
})();
