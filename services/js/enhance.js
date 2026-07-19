/* ===========================================================================
   TechRealm — UI Enhancement Layer  (enhance.js)
   Progressive, dependency-free micro-interactions layered on top of the
   Bringer base. Everything degrades gracefully: if this file fails to load the
   site is fully functional. Nothing here mutates existing behaviour — it only
   adds a scroll progress bar, a back-to-top control, button ripples and a
   lightweight reveal-on-scroll for elements the base script doesn't already
   animate. Honours prefers-reduced-motion.
   =========================================================================== */
(function () {
    "use strict";

    var reduceMotion = window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function ready(fn) {
        if (document.readyState !== "loading") { fn(); }
        else { document.addEventListener("DOMContentLoaded", fn); }
    }

    /* ---- Scroll progress + back-to-top ring -------------------------------- */
    function initScroll() {
        var bar = document.createElement("div");
        bar.id = "tr-scroll-progress";
        document.body.appendChild(bar);

        var RING = 163; // 2·π·r  (r = 26)
        var btn = document.createElement("button");
        btn.id = "tr-to-top";
        btn.type = "button";
        btn.setAttribute("aria-label", "Back to top");
        btn.style.setProperty("--tr-ring-len", RING);
        btn.innerHTML =
            '<svg class="tr-ring" viewBox="0 0 56 56" aria-hidden="true">' +
              '<circle cx="28" cy="28" r="26"></circle>' +
            '</svg>' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
              'stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" ' +
              'aria-hidden="true">' +
              '<path d="M12 19V5M5 12l7-7 7 7"/>' +
            '</svg>';
        document.body.appendChild(btn);
        var ringEl = btn.querySelector(".tr-ring circle");

        btn.addEventListener("click", function () {
            window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
        });

        var ticking = false;
        function update() {
            ticking = false;
            var doc = document.documentElement;
            var max = (doc.scrollHeight - doc.clientHeight) || 1;
            var y = window.scrollY || doc.scrollTop || 0;
            var pct = Math.min(1, Math.max(0, y / max));
            bar.style.width = (pct * 100).toFixed(2) + "%";
            if (ringEl) ringEl.style.strokeDashoffset = (RING * (1 - pct)).toFixed(1);
            btn.classList.toggle("is-visible", y > 480);
        }
        function onScroll() {
            if (!ticking) { ticking = true; requestAnimationFrame(update); }
        }
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll, { passive: true });
        update();
    }

    /* ---- Button ripple ----------------------------------------------------- */
    function initRipple() {
        if (reduceMotion) return;
        document.addEventListener("click", function (e) {
            var btn = e.target.closest ? e.target.closest(".bringer-button") : null;
            if (!btn) return;
            var rect = btn.getBoundingClientRect();
            var size = Math.max(rect.width, rect.height);
            var ripple = document.createElement("span");
            ripple.className = "tr-ripple";
            ripple.style.width = ripple.style.height = size + "px";
            ripple.style.left = (e.clientX - rect.left - size / 2) + "px";
            ripple.style.top = (e.clientY - rect.top - size / 2) + "px";
            btn.appendChild(ripple);
            setTimeout(function () { ripple.remove(); }, 640);
        }, { passive: true });
    }

    /* ---- Reveal-on-scroll for non-animated blocks -------------------------- */
    function initReveal() {
        if (reduceMotion || !("IntersectionObserver" in window)) return;
        // Only target cards that the base template doesn't already stagger.
        var targets = document.querySelectorAll(
            ".bringer-portfolio-card:not([data-stagger-appear])"
        );
        if (!targets.length) return;
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (en) {
                if (en.isIntersecting) {
                    en.target.classList.add("tr-in");
                    io.unobserve(en.target);
                }
            });
        }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
        targets.forEach(function (el, i) {
            el.classList.add("tr-reveal");
            el.style.transitionDelay = Math.min(i * 60, 300) + "ms";
            io.observe(el);
        });
    }

    ready(function () {
        try { initScroll(); } catch (e) {}
        try { initRipple(); } catch (e) {}
        try { initReveal(); } catch (e) {}
    });
})();
