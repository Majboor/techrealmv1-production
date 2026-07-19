// @ts-check
const { test, expect } = require('@playwright/test');

// The five real pages and a brand fragment expected in each <title>.
const PAGES = [
  { path: '/index.html', label: 'Home' },
  { path: '/about/about.html', label: 'About Us' },
  { path: '/services/service.html', label: 'Our Services' },
  { path: '/portfolio/folio.html', label: 'Portfolio' },
  { path: '/contact/contact.html', label: 'Contact' },
];

test.describe('page smoke tests', () => {
  for (const { path, label } of PAGES) {
    test(`${label} (${path}) loads with a TechRealm title and no fatal errors`, async ({ page }) => {
      const errors = [];
      page.on('pageerror', (err) => errors.push(err.message));

      const response = await page.goto(path, { waitUntil: 'domcontentloaded' });
      expect(response, `no response for ${path}`).toBeTruthy();
      expect(response.status(), `bad status for ${path}`).toBeLessThan(400);

      await expect(page).toHaveTitle(/techrealm/i);

      // The primary nav should be present on every page.
      await expect(page.locator('nav.bringer-nav')).toBeAttached();

      // No uncaught JS exceptions on load.
      expect(errors, `page errors on ${path}:\n${errors.join('\n')}`).toEqual([]);
    });
  }
});
