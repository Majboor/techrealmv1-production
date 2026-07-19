// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('primary navigation', () => {
  test('home nav links route to every real page', async ({ page }) => {
    const targets = [
      { text: 'About Us', urlPart: '/about/about.html', title: /about/i },
      { text: 'Our Services', urlPart: '/services/service.html', title: /services/i },
      { text: 'Portfolio', urlPart: '/portfolio/folio.html', title: /portfolio/i },
      { text: 'Contact', urlPart: '/contact/contact.html', title: /contact/i },
    ];

    for (const { text, urlPart, title } of targets) {
      await page.goto('/index.html', { waitUntil: 'domcontentloaded' });
      const link = page.locator(`nav.bringer-nav a:has-text("${text}")`).first();
      await expect(link).toHaveAttribute('href', new RegExp(urlPart.replace(/\//g, '\\/')));
      await link.click();
      await page.waitForURL(new RegExp(urlPart.replace(/\//g, '\\/')));
      await expect(page).toHaveTitle(title);
    }
  });

  test('the "Book a Demo" CTA opens a WhatsApp contact link', async ({ page }) => {
    await page.goto('/index.html', { waitUntil: 'domcontentloaded' });
    const cta = page.locator('a.bringer-button:has-text("Book a Demo")').first();
    await expect(cta).toBeVisible();
    await expect(cta).toHaveAttribute('href', /wa\.me/);
  });
});
