(function () {
    var menuButton = document.querySelector('.menu-toggle');
    var mobilePanel = document.querySelector('.mobile-panel');

    if (menuButton && mobilePanel) {
        menuButton.addEventListener('click', function () {
            var open = mobilePanel.classList.toggle('is-open');
            menuButton.setAttribute('aria-expanded', open ? 'true' : 'false');
        });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
    var current = 0;
    var timer = null;

    function showSlide(index) {
        if (!slides.length) {
            return;
        }
        current = (index + slides.length) % slides.length;
        slides.forEach(function (slide, position) {
            slide.classList.toggle('is-active', position === current);
        });
        dots.forEach(function (dot, position) {
            dot.classList.toggle('is-active', position === current);
        });
    }

    function startHero() {
        if (slides.length < 2) {
            return;
        }
        window.clearInterval(timer);
        timer = window.setInterval(function () {
            showSlide(current + 1);
        }, 5200);
    }

    var next = document.querySelector('[data-hero-next]');
    var prev = document.querySelector('[data-hero-prev]');

    if (next) {
        next.addEventListener('click', function () {
            showSlide(current + 1);
            startHero();
        });
    }

    if (prev) {
        prev.addEventListener('click', function () {
            showSlide(current - 1);
            startHero();
        });
    }

    dots.forEach(function (dot) {
        dot.addEventListener('click', function () {
            showSlide(Number(dot.getAttribute('data-hero-dot')) || 0);
            startHero();
        });
    });

    startHero();

    function normalize(value) {
        return (value || '').toString().trim().toLowerCase();
    }

    function getQueryValue() {
        try {
            return new URLSearchParams(window.location.search).get('q') || '';
        } catch (error) {
            return '';
        }
    }

    var localForms = Array.prototype.slice.call(document.querySelectorAll('.local-search'));
    var cards = Array.prototype.slice.call(document.querySelectorAll('.searchable-grid .movie-card'));
    var filterButtons = Array.prototype.slice.call(document.querySelectorAll('[data-filter]'));
    var activeFilter = 'all';

    function applyFilter(value) {
        var term = normalize(value);
        cards.forEach(function (card) {
            var search = normalize(card.getAttribute('data-search'));
            var category = card.getAttribute('data-category') || '';
            var categoryMatch = activeFilter === 'all' || category === activeFilter;
            var textMatch = !term || search.indexOf(term) !== -1;
            card.classList.toggle('is-hidden-by-filter', !(categoryMatch && textMatch));
        });
    }

    localForms.forEach(function (form) {
        var input = form.querySelector('input[type="search"]');
        if (!input) {
            return;
        }
        var initial = getQueryValue();
        if (initial) {
            input.value = initial;
        }
        input.addEventListener('input', function () {
            applyFilter(input.value);
        });
        form.addEventListener('submit', function (event) {
            event.preventDefault();
            applyFilter(input.value);
        });
        applyFilter(input.value);
    });

    filterButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            activeFilter = button.getAttribute('data-filter') || 'all';
            filterButtons.forEach(function (item) {
                item.classList.toggle('active', item === button);
            });
            var form = document.querySelector('.local-search');
            var input = form ? form.querySelector('input[type="search"]') : null;
            applyFilter(input ? input.value : '');
        });
    });
})();
