# Hero A/B Variants

The home hero ships in two flavours so we can A/B-test messaging and layout
without maintaining a second page or a build step.

| Bucket | How to reach it | Headline | Layout / CTA |
| ------ | --------------- | -------- | ------------ |
| **A** (control) | `/` or `/?variant=a` | _"Innovation at Your Fingertips, Future in Your Hands."_ | Original layout. CTA lives only in the header ("Book a Demo"). |
| **B** (challenger) | `/?variant=b` | _"Ship the product you keep imagining — faster than you thought."_ | Adds an eyebrow pill (`Software · AI · Growth`), tighter benefit-led copy, and a **primary above-the-fold CTA** ("Start your build" → WhatsApp) with a reassurance sub-line. |

## How it works

- One tiny file drives everything: [`js/variant-ab.js`](../js/variant-ab.js).
  It is loaded in `index.html` **before** `js/st-core.js` so the swapped copy
  still gets the split-text / fade-up animations.
- The **default experience (Variant A) is never modified on disk** — Variant B
  is applied at runtime by adding a `body.tr-variant-b` class and swapping the
  hero headline, lead paragraph, and CTA. No shared markup is rewritten, which
  keeps the control pristine and merge-friendly.
- The picked bucket is remembered for the session in `localStorage`
  (`tr_hero_variant`) so internal navigation keeps a visitor in the same
  variant. An explicit `?variant=a` / `?variant=b` always wins and re-pins.
- A `gtag('event', 'ab_variant_view', {variant:'b'})` fires on Variant B so the
  existing GA4 tag can measure it.

## Query parameters

| Param | Values | Effect |
| ----- | ------ | ------ |
| `variant` | `a` \| `b` | Force a bucket and pin it for the session. |
| `abpreview` | `1` | Show a floating **Variant A / Variant B** switch (bottom-right) for internal testing. Leave it off in shared/production links. |

Example internal preview link:

```
https://techrealm.online/?variant=b&abpreview=1
```

## Editing the challenger copy

All Variant-B text lives in the `VARIANT_B` object at the top of
`js/variant-ab.js` (eyebrow, title, lead, CTA text/href, CTA sub-text). Change
the strings there — no other file needs touching.

## Testing locally

```bash
python3 -m http.server 7428    # from the repo root
# then open:
#   http://localhost:7428/index.html                 -> control (A)
#   http://localhost:7428/index.html?variant=b        -> challenger (B)
#   http://localhost:7428/index.html?variant=b&abpreview=1  -> B + switch
```

Verified end-to-end with headless Chromium: Variant A stays byte-identical to
the original hero, Variant B swaps headline + eyebrow + lead + CTA, the preview
switch appears only with `abpreview=1`, and `?variant=a` cleanly reverts.

---

### CLI/TUI alternate output modes — N/A

This repository is a **plain static marketing site** (HTML/CSS/JS, no build
step, no command-line tool). There is no CLI or TUI surface, so the alternate
output-mode part of the brief does not apply; the deliverable here is the web
A/B hero variant documented above.
