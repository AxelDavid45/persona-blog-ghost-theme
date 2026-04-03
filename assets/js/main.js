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

    // =============================================
    // Reading analytics (Plausible)
    // Tracks scroll depth and reading time on posts
    // =============================================
    (function initReadingAnalytics() {
        // Only run on post pages
        if (!document.body.classList.contains('post-template')) return;

        // Check if Plausible is available
        var hasPlausible = typeof window.plausible === 'function';
        
        function trackEvent(name, props) {
            if (hasPlausible) {
                window.plausible(name, { props: props });
            }
        }

        var article = document.querySelector('.c-article');
        var articleContent = document.querySelector('.gh-content');
        if (!article || !articleContent) return;

        // Get article title for props
        var titleEl = document.querySelector('.c-article-title');
        var articleTitle = titleEl ? titleEl.textContent.trim().substring(0, 50) : 'Unknown';

        // Scroll depth tracking
        var milestones = [25, 50, 75, 100];
        var milestonesReached = {};
        
        function getScrollPercentage() {
            var articleRect = articleContent.getBoundingClientRect();
            var articleTop = articleRect.top + window.scrollY;
            var articleHeight = articleContent.offsetHeight;
            var viewportHeight = window.innerHeight;
            var scrollY = window.scrollY;
            
            // How much of the article has been scrolled past
            var scrolledPast = scrollY + viewportHeight - articleTop;
            var percentage = Math.min(100, Math.max(0, (scrolledPast / articleHeight) * 100));
            
            return Math.round(percentage);
        }

        function checkMilestones() {
            var percentage = getScrollPercentage();
            
            milestones.forEach(function (milestone) {
                if (percentage >= milestone && !milestonesReached[milestone]) {
                    milestonesReached[milestone] = true;
                    trackEvent('Scroll Depth', {
                        depth: milestone + '%',
                        title: articleTitle
                    });
                }
            });
        }

        // Debounced scroll handler
        var scrollTimeout;
        window.addEventListener('scroll', function () {
            if (scrollTimeout) return;
            scrollTimeout = setTimeout(function () {
                scrollTimeout = null;
                checkMilestones();
            }, 100);
        }, { passive: true });

        // Initial check (in case page loads scrolled)
        checkMilestones();

        // Time on page tracking
        var startTime = Date.now();
        var maxScrollDepth = 0;

        function updateMaxDepth() {
            var current = getScrollPercentage();
            if (current > maxScrollDepth) {
                maxScrollDepth = current;
            }
        }

        window.addEventListener('scroll', updateMaxDepth, { passive: true });

        // Track reading session on page unload
        function trackReadingSession() {
            var timeSpent = Math.round((Date.now() - startTime) / 1000); // seconds
            var timeCategory;
            
            if (timeSpent < 30) timeCategory = '< 30s';
            else if (timeSpent < 60) timeCategory = '30s - 1min';
            else if (timeSpent < 180) timeCategory = '1 - 3min';
            else if (timeSpent < 300) timeCategory = '3 - 5min';
            else if (timeSpent < 600) timeCategory = '5 - 10min';
            else timeCategory = '> 10min';

            // Determine engagement level
            var engagement;
            if (maxScrollDepth >= 75 && timeSpent >= 60) engagement = 'Engaged';
            else if (maxScrollDepth >= 50) engagement = 'Partial';
            else if (maxScrollDepth >= 25) engagement = 'Bounce risk';
            else engagement = 'Bounced';

            trackEvent('Reading Session', {
                time: timeCategory,
                maxDepth: Math.round(maxScrollDepth) + '%',
                engagement: engagement,
                title: articleTitle
            });
        }

        // Use visibilitychange for more reliable tracking
        document.addEventListener('visibilitychange', function () {
            if (document.visibilityState === 'hidden') {
                trackReadingSession();
            }
        });

        // Fallback for older browsers
        window.addEventListener('beforeunload', trackReadingSession);
    })();
})();
