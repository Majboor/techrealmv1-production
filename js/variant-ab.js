/*
 * TechRealm — Hero A/B Variant Toggle
 * ------------------------------------
 * Ships a second landing hero (Variant B) behind a `?variant=b` query toggle
 * with NO change to the default (Variant A) experience.
 *
 *   Default / ?variant=a   -> original hero (control)
 *   ?variant=b             -> alternate headline, layout & CTA (challenger)
 *
 * The choice sticks for the session via localStorage so internal navigation
 * keeps the visitor in the same bucket. A small floating switch (added only
 * when ?abpreview=1 is present) lets the team flip variants while testing.
 *
 * This file is intentionally self-contained: it runs BEFORE js/st-core.js so
 * the split-text / fade animations pick up the swapped copy, and it only
 * touches the hero — no shared markup is rewritten on disk.
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'tr_hero_variant';

  function resolveVariant() {
    var params = new URLSearchParams(window.location.search);
    var q = (params.get('variant') || '').toLowerCase();
    if (q === 'a' || q === 'b') {
      try { localStorage.setItem(STORAGE_KEY, q); } catch (e) {}
      return q;
    }
    try {
      var stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'a' || stored === 'b') return stored;
    } catch (e) {}
    return 'a';
  }

  // Variant-B copy. Kept as data so it is trivial to iterate on messaging.
  var VARIANT_B = {
    eyebrow: 'Software · AI · Growth',
    title: 'Ship the product you keep imagining — faster than you thought.',
    lead: 'TechRealm designs, builds, and ships web, mobile, and AI products for teams who are done waiting. Concept to launch, one senior crew.',
    ctaText: 'Start your build',
    ctaHref: 'https://wa.me/17136322262?text=Hi%20TechRealm%2C%20I%27d%20like%20to%20talk%20about%20a%20project.',
    ctaSubText: 'Book a free 20-min scoping call'
  };

  function injectStyles() {
    if (document.getElementById('tr-variant-b-styles')) return;
    var css = [
      /* Centered, conversion-focused layout for the challenger */
      'body.tr-variant-b .bringer-hero-type01 .bringer-page-title{',
      '  max-width:14ch;',
      '}',
      'body.tr-variant-b .tr-vb-eyebrow{',
      '  display:inline-block;letter-spacing:.14em;text-transform:uppercase;',
      '  font-size:13px;font-weight:600;opacity:.7;margin-bottom:22px;',
      '  padding:7px 16px;border:1px solid rgba(78,119,253,.45);border-radius:999px;',
      '  color:rgb(78,119,253);',
      '}',
      'body.tr-variant-b .tr-vb-cta-wrap{',
      '  display:flex;align-items:center;flex-wrap:wrap;gap:14px 22px;',
      '  margin-top:8px;',
      '}',
      'body.tr-variant-b .tr-vb-cta-sub{opacity:.7;font-size:15px;margin:0;}',
      /* Floating preview switch (only shown with ?abpreview=1) */
      '.tr-ab-switch{position:fixed;bottom:20px;right:20px;z-index:9999;',
      '  display:flex;gap:6px;padding:6px;border-radius:999px;',
      '  background:rgba(20,20,28,.82);backdrop-filter:blur(8px);',
      '  box-shadow:0 8px 30px rgba(0,0,0,.35);font-family:Inter,sans-serif;}',
      '.tr-ab-switch a{padding:7px 15px;border-radius:999px;font-size:13px;',
      '  font-weight:600;color:#fff;text-decoration:none;opacity:.65;transition:.2s;}',
      '.tr-ab-switch a.is-active{background:rgb(78,119,253);opacity:1;}',
      '.tr-ab-switch a:hover{opacity:1;}'
    ].join('\n');
    var style = document.createElement('style');
    style.id = 'tr-variant-b-styles';
    style.textContent = css;
    document.head.appendChild(style);
  }

  function applyVariantB() {
    document.body.classList.add('tr-variant-b');

    var hero = document.querySelector('.bringer-hero-type01');
    if (!hero) return;

    // Swap the headline copy (st-core re-splits it into animated chars later).
    var title = hero.querySelector('.bringer-page-title');
    if (title) title.textContent = VARIANT_B.title;

    // Add an eyebrow above the title.
    if (title && !hero.querySelector('.tr-vb-eyebrow')) {
      var eyebrow = document.createElement('span');
      eyebrow.className = 'tr-vb-eyebrow';
      eyebrow.setAttribute('data-appear', 'fade-up');
      eyebrow.textContent = VARIANT_B.eyebrow;
      title.parentNode.insertBefore(eyebrow, title);
    }

    // Swap the supporting large-text line.
    var lead = hero.querySelector('.bringer-large-text');
    if (lead) lead.textContent = VARIANT_B.lead;

    // Add a primary CTA button + subtext into the info line (challenger has a
    // real above-the-fold call to action; control relies on the header button).
    var leadCol = lead ? lead.closest('.stg-col-6') : null;
    if (leadCol && !leadCol.querySelector('.tr-vb-cta-wrap')) {
      var wrap = document.createElement('div');
      wrap.className = 'tr-vb-cta-wrap stg-top-gap';
      wrap.setAttribute('data-appear', 'fade-up');
      wrap.setAttribute('data-delay', '500');

      var btn = document.createElement('a');
      btn.className = 'bringer-button';
      btn.href = VARIANT_B.ctaHref;
      btn.textContent = VARIANT_B.ctaText;

      var sub = document.createElement('p');
      sub.className = 'tr-vb-cta-sub';
      sub.textContent = VARIANT_B.ctaSubText;

      wrap.appendChild(btn);
      wrap.appendChild(sub);
      leadCol.appendChild(wrap);
    }

    // Analytics hook (gtag is present on the page).
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'ab_variant_view', { variant: 'b' });
    }
  }

  function buildSwitch(current) {
    var params = new URLSearchParams(window.location.search);
    if (params.get('abpreview') !== '1') return;

    function href(v) {
      var p = new URLSearchParams(window.location.search);
      p.set('variant', v);
      return window.location.pathname + '?' + p.toString();
    }

    var box = document.createElement('div');
    box.className = 'tr-ab-switch';
    ['a', 'b'].forEach(function (v) {
      var a = document.createElement('a');
      a.href = href(v);
      a.textContent = 'Variant ' + v.toUpperCase();
      if (v === current) a.className = 'is-active';
      box.appendChild(a);
    });
    document.body.appendChild(box);
  }

  var variant = resolveVariant();
  injectStyles();
  if (variant === 'b') applyVariantB();

  // The switch needs <body>; DOM is already parsed (script is at end of body),
  // but guard anyway for safety.
  if (document.body) {
    buildSwitch(variant);
  } else {
    document.addEventListener('DOMContentLoaded', function () { buildSwitch(variant); });
  }
})();
