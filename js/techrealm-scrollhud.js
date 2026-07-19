/**
 * TechRealm Scroll HUD
 * Injects a scroll-progress bar and a circular back-to-top button (with progress ring).
 * Zero dependencies, self-initializing, safe to include on any page once.
 * Author: TechRealm
 */
(function () {
    "use strict";

    if (window.__trScrollHud) return; // guard against double-inclusion
    window.__trScrollHud = true;

    var RING_RADIUS = 23;
    var RING_CIRC = 2 * Math.PI * RING_RADIUS;

    function build() {
        if (document.querySelector(".tr-scroll-progress")) return;

        // Progress bar
        var bar = document.createElement("div");
        bar.className = "tr-scroll-progress";
        bar.setAttribute("role", "progressbar");
        bar.setAttribute("aria-label", "Page scroll progress");
        bar.setAttribute("aria-hidden", "true");

        // Back-to-top button with SVG progress ring
        var btn = document.createElement("button");
        btn.className = "tr-backtotop";
        btn.type = "button";
        btn.setAttribute("aria-label", "Back to top");
        btn.innerHTML =
            '<svg class="tr-ring" viewBox="0 0 52 52" aria-hidden="true">' +
            '<circle class="tr-ring-track" cx="26" cy="26" r="' + RING_RADIUS + '"></circle>' +
            '<circle class="tr-ring-fill" cx="26" cy="26" r="' + RING_RADIUS + '" ' +
            'stroke-dasharray="' + RING_CIRC + '" stroke-dashoffset="' + RING_CIRC + '"></circle>' +
            "</svg>" +
            '<svg class="tr-arrow" viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
            '<path d="M12 19V5M12 5l-6 6M12 5l6 6" stroke="currentColor" ' +
            'stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

        document.body.appendChild(bar);
        document.body.appendChild(btn);

        var ringFill = btn.querySelector(".tr-ring-fill");
        var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        function update() {
            var doc = document.documentElement;
            var scrollTop = window.pageYOffset || doc.scrollTop || 0;
            var max = (doc.scrollHeight - doc.clientHeight) || 1;
            var ratio = Math.min(1, Math.max(0, scrollTop / max));

            bar.style.transform = "scaleX(" + ratio + ")";
            bar.setAttribute("aria-valuenow", Math.round(ratio * 100));
            ringFill.style.strokeDashoffset = String(RING_CIRC * (1 - ratio));

            if (scrollTop > 400) {
                btn.classList.add("is-visible");
            } else {
                btn.classList.remove("is-visible");
            }
        }

        // rAF-throttled scroll handler
        var ticking = false;
        function onScroll() {
            if (ticking) return;
            ticking = true;
            window.requestAnimationFrame(function () {
                update();
                ticking = false;
            });
        }

        btn.addEventListener("click", function () {
            window.scrollTo({ top: 0, behavior: prefersReduced ? "auto" : "smooth" });
        });

        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", update, { passive: true });
        update();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", build);
    } else {
        build();
    }
})();
