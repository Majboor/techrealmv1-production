/*!
 * TechRealm — Quick Connect dock
 * A self-contained floating action button that expands into one-tap
 * WhatsApp / Call / Email actions. No dependencies, injects its own
 * styles, keyboard-accessible, and honours prefers-reduced-motion.
 *
 * Drop-in: <script src="/js/tr-quick-connect.js" defer></script>
 */
(function () {
  "use strict";

  if (window.__trQuickConnect) return; // guard against double-load
  window.__trQuickConnect = true;

  // Real TechRealm contact channels (kept in one place).
  var ACTIONS = [
    {
      key: "whatsapp",
      label: "Chat on WhatsApp",
      href: "https://wa.me/923461115757?text=Hi%20TechRealm%2C%20I%27d%20like%20to%20talk%20about%20a%20project.",
      color: "#25D366",
      icon:
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M17.47 14.38c-.29-.15-1.7-.84-1.96-.93-.26-.1-.45-.15-.64.14-.19.29-.74.93-.9 1.12-.17.19-.33.21-.62.07-.29-.15-1.22-.45-2.33-1.44-.86-.77-1.44-1.72-1.61-2-.17-.29-.02-.45.13-.59.13-.13.29-.34.44-.51.15-.17.19-.29.29-.48.1-.19.05-.36-.02-.51-.07-.14-.64-1.55-.88-2.12-.23-.55-.47-.48-.64-.49h-.55c-.19 0-.5.07-.76.36-.26.29-1 .98-1 2.38s1.02 2.76 1.17 2.95c.14.19 2.01 3.06 4.86 4.29.68.29 1.21.47 1.62.6.68.22 1.3.19 1.79.11.55-.08 1.7-.69 1.94-1.37.24-.67.24-1.24.17-1.36-.07-.12-.26-.19-.55-.34zM12 2a10 10 0 0 0-8.6 15.06L2 22l5.05-1.32A10 10 0 1 0 12 2z"/></svg>'
    },
    {
      key: "call",
      label: "Call us",
      href: "tel:+19176409656",
      color: "#4E77FD",
      icon:
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M6.62 10.79a15.53 15.53 0 0 0 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1C10.61 21 3 13.39 3 4c0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.24.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>'
    },
    {
      key: "email",
      label: "Email us",
      href: "mailto:Info@techrealm.online?subject=Project%20enquiry",
      color: "#E0524F",
      icon:
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z"/></svg>'
    }
  ];

  var CSS =
    '.trqc{position:fixed;right:22px;bottom:22px;z-index:9990;display:flex;flex-direction:column-reverse;align-items:flex-end;gap:14px;font-family:inherit}' +
    '.trqc *{box-sizing:border-box}' +
    '.trqc-toggle{width:60px;height:60px;border:0;border-radius:50%;cursor:pointer;color:#fff;' +
      'background:linear-gradient(135deg,#4E77FD,#3355e0);box-shadow:0 10px 26px rgba(78,119,253,.42),0 2px 8px rgba(7,9,13,.5);' +
      'display:flex;align-items:center;justify-content:center;position:relative;' +
      'transition:transform .28s cubic-bezier(.34,1.56,.64,1),box-shadow .28s}' +
    '.trqc-toggle:hover{transform:scale(1.06)}' +
    '.trqc-toggle:focus-visible{outline:3px solid #fff;outline-offset:3px}' +
    '.trqc-toggle svg{width:26px;height:26px;transition:transform .3s cubic-bezier(.34,1.56,.64,1)}' +
    '.trqc[data-open="true"] .trqc-toggle{transform:rotate(90deg)}' +
    '.trqc[data-open="true"] .trqc-toggle .trqc-ic-chat{opacity:0;transform:scale(.4)}' +
    '.trqc[data-open="true"] .trqc-toggle .trqc-ic-close{opacity:1;transform:rotate(0) scale(1)}' +
    '.trqc-ic{position:absolute;transition:opacity .25s,transform .3s}' +
    '.trqc-ic-close{opacity:0;transform:rotate(-90deg) scale(.4)}' +
    '.trqc-toggle::after{content:"";position:absolute;inset:0;border-radius:50%;' +
      'box-shadow:0 0 0 0 rgba(78,119,253,.55);animation:trqc-pulse 2.4s infinite}' +
    '@keyframes trqc-pulse{0%{box-shadow:0 0 0 0 rgba(78,119,253,.5)}70%{box-shadow:0 0 0 16px rgba(78,119,253,0)}100%{box-shadow:0 0 0 0 rgba(78,119,253,0)}}' +
    '.trqc[data-open="true"] .trqc-toggle::after{animation:none}' +
    '.trqc-menu{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:12px;align-items:flex-end}' +
    '.trqc-item{opacity:0;transform:translateY(12px) scale(.85);pointer-events:none;' +
      'transition:opacity .25s ease,transform .3s cubic-bezier(.34,1.56,.64,1)}' +
    '.trqc[data-open="true"] .trqc-item{opacity:1;transform:none;pointer-events:auto}' +
    '.trqc[data-open="true"] .trqc-item:nth-child(1){transition-delay:.03s}' +
    '.trqc[data-open="true"] .trqc-item:nth-child(2){transition-delay:.08s}' +
    '.trqc[data-open="true"] .trqc-item:nth-child(3){transition-delay:.13s}' +
    '.trqc-link{display:flex;align-items:center;gap:10px;text-decoration:none;' +
      'background:#1A1D24;color:#fff;padding:9px 14px 9px 9px;border-radius:40px;' +
      'box-shadow:0 8px 20px rgba(7,9,13,.45);border:1px solid rgba(255,255,255,.08);' +
      'transition:transform .2s,box-shadow .2s}' +
    '.trqc-link:hover{transform:translateX(-4px);box-shadow:0 10px 26px rgba(7,9,13,.6)}' +
    '.trqc-link:focus-visible{outline:2px solid #4E77FD;outline-offset:2px}' +
    '.trqc-badge{width:38px;height:38px;border-radius:50%;flex:0 0 auto;display:flex;' +
      'align-items:center;justify-content:center;color:#fff}' +
    '.trqc-badge svg{width:20px;height:20px}' +
    '.trqc-text{font-size:14px;font-weight:600;white-space:nowrap;letter-spacing:.2px;padding-right:4px}' +
    '@media (max-width:600px){.trqc{right:16px;bottom:16px}.trqc-toggle{width:54px;height:54px}}' +
    '@media (prefers-reduced-motion:reduce){.trqc *{transition-duration:.01ms!important;animation:none!important}}';

  function injectStyles() {
    var s = document.createElement("style");
    s.id = "trqc-styles";
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  function build() {
    var root = document.createElement("div");
    root.className = "trqc";
    root.setAttribute("data-open", "false");

    var menu = document.createElement("ul");
    menu.className = "trqc-menu";
    menu.id = "trqc-menu";

    ACTIONS.forEach(function (a) {
      var li = document.createElement("li");
      li.className = "trqc-item";
      var link = document.createElement("a");
      link.className = "trqc-link";
      link.href = a.href;
      link.setAttribute("aria-label", a.label);
      if (a.key === "whatsapp") {
        link.target = "_blank";
        link.rel = "noopener";
      }
      link.innerHTML =
        '<span class="trqc-badge" style="background:' + a.color + '">' + a.icon + "</span>" +
        '<span class="trqc-text">' + a.label + "</span>";
      li.appendChild(link);
      menu.appendChild(li);
    });

    var toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "trqc-toggle";
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-controls", "trqc-menu");
    toggle.setAttribute("aria-label", "Open quick contact menu");
    toggle.innerHTML =
      '<span class="trqc-ic trqc-ic-chat" aria-hidden="true"><svg viewBox="0 0 24 24"><path fill="currentColor" d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM7 9h10v2H7V9zm6 5H7v-2h6v2zm4-6H7V6h10v2z"/></svg></span>' +
      '<span class="trqc-ic trqc-ic-close" aria-hidden="true"><svg viewBox="0 0 24 24"><path fill="currentColor" d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg></span>';

    root.appendChild(menu);
    root.appendChild(toggle);

    function setOpen(open) {
      root.setAttribute("data-open", open ? "true" : "false");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close quick contact menu" : "Open quick contact menu");
    }

    toggle.addEventListener("click", function () {
      setOpen(root.getAttribute("data-open") !== "true");
    });

    // Close on outside click
    document.addEventListener("click", function (e) {
      if (!root.contains(e.target)) setOpen(false);
    });

    // Close on Escape, keep focus on toggle
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && root.getAttribute("data-open") === "true") {
        setOpen(false);
        toggle.focus();
      }
    });

    // Collapse after choosing an action
    menu.addEventListener("click", function () {
      setOpen(false);
    });

    document.body.appendChild(root);
  }

  function init() {
    injectStyles();
    build();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
