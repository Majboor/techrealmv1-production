/* TechRealm — accessibility progressive-enhancement.
   Keeps the mobile-menu toggler's ARIA state in sync with the actual
   open/closed state (the template toggles body.show-menu). No deps. */
(function () {
    "use strict";

    var toggler = document.querySelector(".bringer-mobile-menu-toggler");
    var nav = document.querySelector(".bringer-nav");

    // Give the nav a stable id so aria-controls resolves to a real element.
    if (nav && !nav.id) {
        nav.id = "bringer-mobile-menu";
    }

    if (!toggler) {
        return;
    }

    function sync() {
        var open = document.body.classList.contains("show-menu");
        toggler.setAttribute("aria-expanded", open ? "true" : "false");
        toggler.setAttribute(
            "aria-label",
            open ? "Close navigation menu" : "Open navigation menu"
        );
    }

    // Reflect state after the template's own click handler runs.
    toggler.addEventListener("click", function () {
        window.setTimeout(sync, 0);
    });

    // Also catch closes triggered elsewhere (overlay click, esc, resize).
    if (typeof MutationObserver !== "undefined") {
        new MutationObserver(sync).observe(document.body, {
            attributes: true,
            attributeFilter: ["class"]
        });
    }

    // Allow Escape to close the open menu for keyboard users.
    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && document.body.classList.contains("show-menu")) {
            document.body.classList.remove("show-menu");
            toggler.focus();
        }
    });

    sync();
})();
