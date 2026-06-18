(function() {
  const navButton = document.querySelector(".nav-toggle");
  const navMenu = document.querySelector(".nav-menu");

  if (navButton && navMenu) {
    navButton.addEventListener("click", function() {
      const opened = navMenu.classList.toggle("is-open");
      navButton.setAttribute("aria-expanded", opened ? "true" : "false");
    });
  }

  const heroSlides = Array.from(document.querySelectorAll("[data-hero-slide]"));
  const heroTargets = Array.from(document.querySelectorAll("[data-hero-target]"));
  let heroIndex = 0;
  let heroTimer = null;

  function showHero(index) {
    if (!heroSlides.length) {
      return;
    }
    heroIndex = (index + heroSlides.length) % heroSlides.length;
    heroSlides.forEach(function(slide, slideIndex) {
      slide.classList.toggle("active", slideIndex === heroIndex);
    });
    heroTargets.forEach(function(target, targetIndex) {
      target.classList.toggle("active", targetIndex === heroIndex);
    });
  }

  function startHero() {
    if (heroSlides.length < 2) {
      return;
    }
    heroTimer = window.setInterval(function() {
      showHero(heroIndex + 1);
    }, 5200);
  }

  function resetHero() {
    if (heroTimer) {
      window.clearInterval(heroTimer);
    }
    startHero();
  }

  heroTargets.forEach(function(target) {
    target.addEventListener("click", function() {
      const next = Number(target.getAttribute("data-hero-target"));
      showHero(next);
      resetHero();
    });
  });

  showHero(0);
  startHero();

  const searchRoot = document.querySelector("[data-search-page]");
  if (searchRoot) {
    const searchInput = document.getElementById("movie-search");
    const cards = Array.from(searchRoot.querySelectorAll("[data-movie-card]"));
    const filterButtons = Array.from(searchRoot.querySelectorAll("[data-filter]"));
    const clearButton = searchRoot.querySelector("[data-search-clear]");
    let activeFilter = "all";

    function getText(card) {
      return [
        card.getAttribute("data-title"),
        card.getAttribute("data-genre"),
        card.getAttribute("data-region"),
        card.getAttribute("data-year"),
        card.textContent
      ].join(" ").toLowerCase();
    }

    function applyFilter() {
      const query = searchInput ? searchInput.value.trim().toLowerCase() : "";
      cards.forEach(function(card) {
        const category = card.getAttribute("data-category") || "";
        const text = getText(card);
        const filterMatched = activeFilter === "all" || category === activeFilter || text.indexOf(activeFilter.toLowerCase()) !== -1;
        const queryMatched = !query || text.indexOf(query) !== -1;
        card.hidden = !(filterMatched && queryMatched);
      });
    }

    filterButtons.forEach(function(button) {
      button.addEventListener("click", function() {
        activeFilter = button.getAttribute("data-filter") || "all";
        filterButtons.forEach(function(item) {
          item.classList.toggle("active", item === button);
        });
        applyFilter();
      });
    });

    if (searchInput) {
      const params = new URLSearchParams(window.location.search);
      const queryValue = params.get("q");
      if (queryValue) {
        searchInput.value = queryValue;
      }
      searchInput.addEventListener("input", applyFilter);
    }

    if (clearButton && searchInput) {
      clearButton.addEventListener("click", function() {
        searchInput.value = "";
        activeFilter = "all";
        filterButtons.forEach(function(item, index) {
          item.classList.toggle("active", index === 0);
        });
        applyFilter();
        searchInput.focus();
      });
    }

    applyFilter();
  }
})();
