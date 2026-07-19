'use strict';

const fs = require('fs');
const path = require('path');

// Repo root is two levels up from tests/unit/
const ROOT = path.resolve(__dirname, '..', '..');

// The five real, user-authored pages the README documents.
const PAGES = [
  'index.html',
  'about/about.html',
  'services/service.html',
  'portfolio/folio.html',
  'contact/contact.html',
];

function readPage(relPath) {
  return fs.readFileSync(path.join(ROOT, relPath), 'utf8');
}

function exists(relPath) {
  return fs.existsSync(path.join(ROOT, relPath));
}

// Extract every value of a given attribute from an HTML string. A negative
// lookbehind ensures we match the real attribute (e.g. `src`) and not a
// longer data-* attribute that merely ends with the same letters
// (e.g. `data-bg-src`).
function extractAttrs(html, attr) {
  const re = new RegExp(`(?<![\\w-])${attr}\\s*=\\s*"([^"]*)"`, 'gi');
  const out = [];
  let m;
  while ((m = re.exec(html)) !== null) {
    out.push(m[1]);
  }
  return out;
}

// Return the first capture of a regex, or null.
function firstMatch(html, re) {
  const m = html.match(re);
  return m ? m[1] : null;
}

// A link is "local" (should resolve to a file on disk) when it is not an
// external URL, mailto/tel/wa scheme, in-page anchor, protocol-relative URL,
// or empty/JS placeholder.
function isLocalLink(href) {
  if (!href) return false;
  const h = href.trim();
  if (h === '' || h === '#' || h === './') return false;
  if (h.startsWith('#')) return false;
  if (h.startsWith('//')) return false;
  if (/^[a-z][a-z0-9+.-]*:/i.test(h)) return false; // http:, https:, mailto:, tel:, data:, javascript:
  return true;
}

// Resolve a local link (from a page at pageRelPath) to a repo-relative path,
// dropping any query string / hash fragment.
function resolveLocal(pageRelPath, href) {
  let clean = href.split('#')[0].split('?')[0];
  if (clean === '') return null;
  let target;
  if (clean.startsWith('/')) {
    // Root-absolute: relative to repo root (the web root).
    target = clean.slice(1);
  } else {
    const pageDir = path.dirname(pageRelPath);
    target = path.normalize(path.join(pageDir, clean));
  }
  // A trailing-slash / directory link maps to its index.html.
  if (target === '' || target.endsWith('/')) {
    target = path.join(target, 'index.html');
  }
  return target;
}

module.exports = {
  ROOT,
  PAGES,
  readPage,
  exists,
  extractAttrs,
  firstMatch,
  isLocalLink,
  resolveLocal,
};
