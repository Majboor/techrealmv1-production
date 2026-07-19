'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const { PAGES, exists, readPage, firstMatch } = require('./helpers');

test('all documented pages exist on disk', () => {
  for (const page of PAGES) {
    assert.ok(exists(page), `missing page: ${page}`);
  }
});

test('every page has a non-empty <title>', () => {
  for (const page of PAGES) {
    const html = readPage(page);
    const title = firstMatch(html, /<title>([^<]*)<\/title>/i);
    assert.ok(title !== null, `${page}: no <title> tag`);
    assert.ok(title.trim().length > 0, `${page}: empty <title>`);
  }
});

test('every page references the TechRealm brand in its title', () => {
  for (const page of PAGES) {
    const html = readPage(page);
    const title = firstMatch(html, /<title>([^<]*)<\/title>/i) || '';
    assert.match(
      title,
      /techrealm/i,
      `${page}: title "${title}" does not mention TechRealm`
    );
  }
});

test('every page declares charset and responsive viewport', () => {
  for (const page of PAGES) {
    const html = readPage(page);
    assert.match(html, /<meta[^>]+charset/i, `${page}: no charset meta`);
    assert.match(
      html,
      /<meta[^>]+name=["']viewport["'][^>]*content=["'][^"']*width=device-width/i,
      `${page}: no responsive viewport meta`
    );
  }
});

test('home page ships complete SEO / social meta', () => {
  const html = readPage('index.html');

  const desc = firstMatch(
    html,
    /<meta[^>]+name=["']description["'][^>]*content=["']([^"']*)["']/i
  );
  assert.ok(desc !== null && desc.trim().length > 0, 'missing description meta');

  // Open Graph
  assert.match(html, /property=["']og:title["']/i, 'missing og:title');
  assert.match(html, /property=["']og:description["']/i, 'missing og:description');
  assert.match(html, /property=["']og:image["']/i, 'missing og:image');

  // Twitter card
  assert.match(html, /name=["']twitter:card["']/i, 'missing twitter:card');
  assert.match(html, /name=["']twitter:title["']/i, 'missing twitter:title');
});
