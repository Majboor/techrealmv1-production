'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const {
  PAGES,
  readPage,
  exists,
  extractAttrs,
  isLocalLink,
  resolveLocal,
} = require('./helpers');

test('every local href/src on every page resolves to a real file', () => {
  const broken = [];

  for (const page of PAGES) {
    const html = readPage(page);
    const refs = [...extractAttrs(html, 'href'), ...extractAttrs(html, 'src')];

    for (const ref of refs) {
      if (!isLocalLink(ref)) continue;
      const target = resolveLocal(page, ref);
      if (target === null) continue;
      if (!exists(target)) {
        broken.push(`${page} -> "${ref}" (resolved: ${target})`);
      }
    }
  }

  assert.deepEqual(broken, [], `broken local links:\n${broken.join('\n')}`);
});

test('every lazy-loaded background (data-bg-src) resolves to a real file', () => {
  const broken = [];

  for (const page of PAGES) {
    const html = readPage(page);
    for (const ref of extractAttrs(html, 'data-bg-src')) {
      if (!isLocalLink(ref)) continue;
      const target = resolveLocal(page, ref);
      if (target === null) continue;
      if (!exists(target)) {
        broken.push(`${page} -> data-bg-src="${ref}" (resolved: ${target})`);
      }
    }
  }

  assert.deepEqual(broken, [], `broken background images:\n${broken.join('\n')}`);
});

test('primary nav links point at the five real pages', () => {
  // Root-absolute nav targets used across the site's main menu.
  const navTargets = [
    '/index.html',
    '/about/about.html',
    '/services/service.html',
    '/portfolio/folio.html',
    '/contact/contact.html',
  ];

  const home = readPage('index.html');
  for (const target of navTargets) {
    assert.ok(
      home.includes(`href="${target}"`),
      `home nav missing link to ${target}`
    );
    // ...and the file it points at must exist.
    assert.ok(exists(target.slice(1)), `nav target file missing: ${target}`);
  }
});

test('every page loads the shared core stylesheets and scripts', () => {
  for (const page of PAGES) {
    const html = readPage(page);
    // Bringer core + jQuery must be present for the site to function.
    assert.match(html, /jquery(\.min)?\.js/i, `${page}: jQuery not referenced`);
    assert.match(html, /\.css/i, `${page}: no stylesheet referenced`);
  }
});
