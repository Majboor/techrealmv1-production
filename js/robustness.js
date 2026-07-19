/* ==========================================================================
   robustness.js — mobile-nav & viewport edge-case hardening (TechRealm)
   Vanilla JS, no dependencies, defensive. Cooperates with the Bringer
   template (which toggles body.show-menu) instead of replacing its handlers.
   ========================================================================== */
(function () {
  'use strict';

  var MOBILE_BREAKPOINT = 960; // matches css/responsive.css mobile-menu query
  var body = document.body;
  if (!body) return;

  function isMenuOpen() {
    return body.classList.contains('show-menu');
  }

  function closeMenu() {
    if (isMenuOpen()) {
      body.classList.remove('show-menu');
    }
  }

  // --- Preserve scroll position while the full-screen menu is open ---------
  // Pinning the body prevents the background from scrolling under the overlay
  // and stops iOS from jumping to the top when the menu opens.
  var savedScrollY = 0;

  function lockScroll() {
    savedScrollY = window.scrollY || window.pageYOffset || 0;
    body.style.top = -savedScrollY + 'px';
    body.style.position = 'fixed';
    body.style.width = '100%';
    body.style.overflow = 'hidden';
  }

  function unlockScroll() {
    body.style.position = '';
    body.style.top = '';
    body.style.width = '';
    body.style.overflow = '';
    if (savedScrollY) {
      window.scrollTo(0, savedScrollY);
      savedScrollY = 0;
    }
  }

  // Watch for the template flipping the show-menu class and react.
  var menuWasOpen = false;
  try {
    var observer = new MutationObserver(function () {
      var open = isMenuOpen();
      if (open && !menuWasOpen) {
        lockScroll();
      } else if (!open && menuWasOpen) {
        unlockScroll();
      }
      menuWasOpen = open;
    });
    observer.observe(body, { attributes: true, attributeFilter: ['class'] });
  } catch (e) {
    /* MutationObserver unsupported — non-fatal, menu still works */
  }

  // --- Escape key closes the menu ------------------------------------------
  document.addEventListener('keydown', function (e) {
    if ((e.key === 'Escape' || e.keyCode === 27) && isMenuOpen()) {
      closeMenu();
    }
  });

  // --- Close menu when a mobile-nav link is tapped (in-page anchors) --------
  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest ? e.target.closest('.bringer-mobile-nav a') : null;
    if (!a) return;
    var href = a.getAttribute('href') || '';
    // Same-page anchors don't navigate away, so close the overlay ourselves.
    if (href.charAt(0) === '#' || href.indexOf('javascript:') === 0) {
      closeMenu();
    }
  });

  // --- Auto-close the mobile menu when rotating/resizing up to desktop ------
  var resizeTimer = null;
  window.addEventListener('resize', function () {
    if (resizeTimer) clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      if (window.innerWidth > MOBILE_BREAKPOINT && isMenuOpen()) {
        closeMenu();
      }
    }, 150);
  });
})();
