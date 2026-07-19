// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('contact page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contact/contact.html', { waitUntil: 'domcontentloaded' });
  });

  test('renders the contact form with name, email and message fields', async ({ page }) => {
    const form = page.locator('form.bringer-contact-form');
    await expect(form).toBeAttached();
    await expect(form.locator('[name="name"]')).toBeAttached();
    await expect(form.locator('[name="email"]')).toBeAttached();
    await expect(form.locator('[name="message"]')).toBeAttached();
    await expect(form.locator('button[type="submit"], input[type="submit"]')).toBeAttached();
  });

  test('typing into a field toggles the focus label state', async ({ page }) => {
    const email = page.locator('form.bringer-contact-form [name="email"]');
    await email.click();
    await email.fill('partner@example.com');
    await expect(email).toHaveValue('partner@example.com');
  });

  test('embeds a Google Map pointing at the office', async ({ page }) => {
    const map = page.locator('iframe.bringer-google-map');
    await expect(map).toBeAttached();
    await expect(map).toHaveAttribute('src', /google\.com\/maps/);
  });
});
