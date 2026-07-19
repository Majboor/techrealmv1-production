// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('portfolio carousel', () => {
  test('renders a Swiper slider with multiple client slides', async ({ page }) => {
    await page.goto('/portfolio/folio.html', { waitUntil: 'domcontentloaded' });

    const slider = page.locator('.swiper.bringer-slider').first();
    await expect(slider).toBeAttached();

    const slides = slider.locator('.swiper-slide');
    expect(await slides.count()).toBeGreaterThan(1);

    // Prev/next controls exist for the carousel.
    await expect(page.locator('.bringer-slider-next').first()).toBeAttached();
    await expect(page.locator('.bringer-slider-prev').first()).toBeAttached();
  });
});
