// @ts-check
// Mobile responsiveness: the hamburger menu (README: "the layout gracefully
// collapses to a mobile hamburger menu"). Self-contained — emulates a Pixel 5
// via test.use, so it runs under the default chromium project with no extra
// config.
const { test, expect, devices } = require('@playwright/test');

test.use({ ...devices['Pixel 5'] });

test.describe('mobile hamburger menu', () => {
  test('toggles the off-canvas menu open and closed', async ({ page }) => {
    await page.goto('/index.html');

    const toggler = page.locator('.bringer-mobile-menu-toggler').first();
    await expect(toggler).toBeVisible();

    const body = page.locator('body');
    await expect(body).not.toHaveClass(/show-menu/);

    await toggler.click();
    await expect(body).toHaveClass(/show-menu/);

    await toggler.click();
    await expect(body).not.toHaveClass(/show-menu/);
  });

  test('an opened menu link navigates to a core page', async ({ page }) => {
    await page.goto('/index.html');
    await page.locator('.bringer-mobile-menu-toggler').first().click();
    await expect(page.locator('body')).toHaveClass(/show-menu/);

    const link = page
      .locator('.bringer-mobile-menu a[href="/services/service.html"]')
      .first();
    await expect(link).toBeVisible();
    await link.click();
    await expect(page).toHaveURL(/\/services\/service\.html$/);
  });
});
