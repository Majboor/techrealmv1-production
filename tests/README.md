# Tests

Automated test suite for the TechRealm marketing site. No app build step — the
site is served as static files and exercised directly.

## Layout

```
tests/
├── unit/          # Fast, no-browser checks (Node's built-in test runner)
│   ├── helpers.js       # HTML/link parsing utilities
│   ├── pages.test.js    # titles, charset/viewport, SEO/social meta
│   └── links.test.js    # local link + lazy-background integrity, nav wiring
└── e2e/           # Playwright (chromium) end-to-end flows
    ├── smoke.spec.js       # every page loads, correct title, no JS errors
    ├── navigation.spec.js  # primary nav routing + Book-a-Demo CTA
    ├── contact.spec.js     # contact form fields + embedded Google Map
    └── portfolio.spec.js   # Swiper carousel renders with slides + controls
```

## Running

```bash
npm install                 # once — installs @playwright/test
npx playwright install chromium

npm run test:unit           # unit tests only (fast)
npm run test:e2e            # e2e tests (auto-starts a static server on :7119)
npm test                    # both
```

The e2e config (`playwright.config.js`) starts `python3 -m http.server 7119`
automatically via Playwright's `webServer`, so no separate server step is needed.

CI runs the same commands on every push/PR — see `.github/workflows/ci.yml`.
