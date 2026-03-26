(function () {
    'use strict';

    // =============================================
    // Font size controls
    // =============================================
    var FONT_MIN = 14;
    var FONT_MAX = 22;
    var FONT_STEP = 1;
    var FONT_DEFAULT = 17;

    function getFontSize() {
        var stored = localStorage.getItem('cuaderno-font-size');
        if (stored) {
            var val = parseInt(stored, 10);
            if (val >= FONT_MIN && val <= FONT_MAX) return val;
        }
        return FONT_DEFAULT;
    }

    function setFontSize(size) {
        size = Math.max(FONT_MIN, Math.min(FONT_MAX, size));
        document.documentElement.style.setProperty('--base-font-size', size + 'px');
        localStorage.setItem('cuaderno-font-size', String(size));
        return size;
    }

    // Apply stored font size immediately
    var currentFontSize = setFontSize(getFontSize());

    var fontDecrease = document.getElementById('font-decrease');
    var fontIncrease = document.getElementById('font-increase');

    if (fontDecrease) {
        fontDecrease.addEventListener('click', function () {
            currentFontSize = setFontSize(currentFontSize - FONT_STEP);
        });
    }

    if (fontIncrease) {
        fontIncrease.addEventListener('click', function () {
            currentFontSize = setFontSize(currentFontSize + FONT_STEP);
        });
    }

    // =============================================
    // Theme toggle (light/dark)
    // =============================================
    function getSystemDark() {
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    function getCurrentThemeIsDark() {
        var html = document.documentElement;
        var manual = localStorage.getItem('cuaderno-theme');
        if (manual === 'dark') return true;
        if (manual === 'light') return false;
        // No manual override — check Ghost setting + system
        if (html.classList.contains('theme-dark')) return true;
        if (html.classList.contains('theme-light')) return false;
        // theme-auto: follows system
        return getSystemDark();
    }

    function applyManualTheme(theme) {
        var html = document.documentElement;
        html.classList.remove('theme-manual-dark', 'theme-manual-light');
        if (theme === 'dark') {
            html.classList.add('theme-manual-dark');
        } else if (theme === 'light') {
            html.classList.add('theme-manual-light');
        }
    }

    // Restore manual theme on load
    var storedTheme = localStorage.getItem('cuaderno-theme');
    if (storedTheme) {
        applyManualTheme(storedTheme);
    }

    var themeToggle = document.getElementById('theme-toggle');
    function toggleTheme() {
        var isDark = getCurrentThemeIsDark();
        var newTheme = isDark ? 'light' : 'dark';
        localStorage.setItem('cuaderno-theme', newTheme);
        applyManualTheme(newTheme);
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    var themeToggleMobile = document.getElementById('theme-toggle-mobile');
    if (themeToggleMobile) {
        themeToggleMobile.addEventListener('click', toggleTheme);
    }

    var themeToggleNavbar = document.getElementById('theme-toggle-navbar');
    if (themeToggleNavbar) {
        themeToggleNavbar.addEventListener('click', toggleTheme);
    }

    // =============================================
    // Mobile menu toggle
    // =============================================
    var menuToggle = document.querySelector('.c-menu-toggle');
    var mobileMenu = document.querySelector('.c-mobile-menu');

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', function () {
            var isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', String(!isOpen));
            mobileMenu.setAttribute('aria-hidden', String(isOpen));
            menuToggle.setAttribute('aria-label', isOpen ? 'Abrir menú' : 'Cerrar menú');
            document.body.style.overflow = isOpen ? '' : 'hidden';
        });

        var mobileClose = document.querySelector('.c-mobile-close');
        if (mobileClose) {
            mobileClose.addEventListener('click', function () {
                menuToggle.setAttribute('aria-expanded', 'false');
                mobileMenu.setAttribute('aria-hidden', 'true');
                menuToggle.setAttribute('aria-label', 'Abrir menú');
                document.body.style.overflow = '';
                menuToggle.focus();
            });
        }

        // Close menu on Escape key
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
                menuToggle.setAttribute('aria-expanded', 'false');
                mobileMenu.setAttribute('aria-hidden', 'true');
                menuToggle.setAttribute('aria-label', 'Abrir menú');
                document.body.style.overflow = '';
                menuToggle.focus();
            }
        });
    }

    // Load more via pagination
    var loadMoreBtn = document.querySelector('.c-pagination .c-btn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function (e) {
            e.preventDefault();
            var url = this.getAttribute('href');
            var postList = document.querySelector('.c-post-list');
            var paginationNav = document.querySelector('.c-pagination');

            if (!url || !postList) return;

            this.textContent = 'Cargando...';
            this.style.pointerEvents = 'none';

            fetch(url)
                .then(function (response) { return response.text(); })
                .then(function (html) {
                    var parser = new DOMParser();
                    var doc = parser.parseFromString(html, 'text/html');
                    var newItems = doc.querySelectorAll('.c-post-item');
                    var newPagination = doc.querySelector('.c-pagination');

                    newItems.forEach(function (item) {
                        postList.appendChild(item);
                    });

                    if (newPagination) {
                        paginationNav.innerHTML = newPagination.innerHTML;
                    } else {
                        paginationNav.remove();
                    }
                })
                .catch(function () {
                    window.location.href = url;
                });
        });
    }
})();
