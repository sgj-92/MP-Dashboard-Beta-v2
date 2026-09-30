// ===================== DESKTOP PHONE PREVIEW =====================
// preview/ frames the real app at phone widths for review on a laptop. It is
// a container only: these tests prove it loads the normal app (never itself),
// gives the app a genuine 375 / 390 / 412px viewport, points "Open full size"
// at the app, and on a phone offers a link instead of a phone inside a phone.
// It is served from '/' (Vercel, local) and from '/<repo>/' (GitHub Pages),
// with and without the trailing slash, because relative paths are where a
// page like this breaks.

const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const http = require('node:http');
const path = require('path');
const H = require('./helpers/uiHarness.js');
const P = require('../preview/preview.js');

const ROOT = path.join(__dirname, '..');
const maybe = H.available() ? test : test.skip;

test('presets: 375, 390 and 412 wide, 390 the default', () => {
  assert.deepStrictEqual(P.PRESETS.map((p) => [p.width, p.height]), [[375, 812], [390, 844], [412, 915]]);
  assert.strictEqual(P.DEFAULT_WIDTH, 390);
  assert.deepStrictEqual(P.viewport(390, false), { width: 390, height: 844 });
  assert.deepStrictEqual(P.viewport(412, true), { width: 915, height: 412 }, 'landscape swaps the sides');
  assert.deepStrictEqual(P.viewport(999, false), { width: 390, height: 844 }, 'an unknown width falls back to the default');
});

test('the app is the preview folder\'s parent, on every host, and never the preview', () => {
  const cases = {
    '/preview': '/', '/preview/': '/', '/preview/index.html': '/',
    '/MP-Dashboard-Beta-v2/preview/': '/MP-Dashboard-Beta-v2/',
    '/MP-Dashboard-Beta-v2/preview': '/MP-Dashboard-Beta-v2/',
    '/MP-Dashboard-Beta-v2/preview/index.html': '/MP-Dashboard-Beta-v2/',
  };
  Object.entries(cases).forEach(([from, to]) => {
    assert.strictEqual(P.appPath(from), to, from);
    assert.doesNotMatch(P.appPath(from), /preview/);
  });
  assert.strictEqual(P.appPath('/somewhere/else.html'), null, 'unrecognised: the page falls back to ../');
});

test('fitting scales the whole device down, never up', () => {
  const device = { width: 406, height: 860 };
  assert.strictEqual(P.fitScale(device, { width: 1800, height: 1100 }), 1);
  assert.strictEqual(P.fitScale(device, { width: 1400, height: 430 }), 0.5);
  assert.strictEqual(P.fitScale(device, { width: 203, height: 2000 }), 0.5);
});

test('the preview is not part of the app: index.html loads none of it', () => {
  const index = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  assert.doesNotMatch(index, /preview\//);
});

test('Vercel sends /preview to the folder, and the build-stamp setup is unchanged', () => {
  const cfg = JSON.parse(fs.readFileSync(path.join(ROOT, 'vercel.json'), 'utf8'));
  assert.strictEqual(cfg.buildCommand, 'node scripts/stamp-build.js');
  assert.strictEqual(cfg.framework, null);
  assert.ok((cfg.redirects || []).some((r) => r.source === '/preview' && r.destination === '/preview/'));
});

// ---------- in a browser ----------

// A static host: a folder serves its index.html with or without the trailing
// slash (as Vercel and most local servers do), optionally below a repository
// path (as GitHub Pages does).
function host(prefix) {
  const server = http.createServer((req, res) => {
    let rel = decodeURIComponent(req.url.split('?')[0]);
    if (!rel.startsWith(prefix)) { res.writeHead(404); res.end(); return; }
    rel = rel.slice(prefix.length).replace(/^\/+/, '');
    let file = path.join(ROOT, rel);
    if (!file.startsWith(ROOT) || !fs.existsSync(file)) { res.writeHead(404); res.end(); return; }
    if (fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
    if (!fs.existsSync(file)) { res.writeHead(404); res.end(); return; }
    const type = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css' }[path.extname(file)] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': type });
    fs.createReadStream(file).pipe(res);
  });
  return new Promise((resolve) => server.listen(0, '127.0.0.1', () => resolve(server)));
}

async function openPreview({ prefix = '', url = '/preview', viewport = { width: 1440, height: 1000 } } = {}) {
  let pw = null;
  for (const id of ['playwright', '/opt/node22/lib/node_modules/playwright']) {
    try { pw = require(id); break; } catch (e) { /* try the next */ }
  }
  const server = await host(prefix);
  const origin = `http://127.0.0.1:${server.address().port}`;
  // Real desktop scrollbars (headless hides them), so a scrollbar that ate
  // into the framed app's width would show.
  const browser = await pw.chromium.launch({ ignoreDefaultArgs: ['--hide-scrollbars'] });
  const page = await browser.newPage({ viewport });
  // Nothing leaves the machine; the framed app gets an empty Firestore.
  await page.route('**/*', (r) => (r.request().url().startsWith(origin) ? r.continue() : r.abort()));
  await page.addInitScript(() => {
    const empty = { async get() { return { docs: [], exists: false, data: () => undefined }; } };
    window.firebase = { initializeApp() {}, firestore() { return { collection() { return { ...empty, doc() { return { ...empty, async set() {} }; } }; }, batch() { return { set() {}, delete() {}, async commit() {} }; } }; } };
  });
  const requested = [];
  page.on('request', (r) => requested.push(new URL(r.url()).pathname));
  await page.goto(origin + prefix + url);
  await page.waitForFunction(() => document.body && document.body.dataset.width || document.body.classList.contains('is-narrow'));
  return { page, origin, requested, async close() { await browser.close(); server.close(); } };
}

async function appFrame(page) {
  await page.waitForFunction(() => {
    const f = document.getElementById('appFrame');
    try { return f && f.contentDocument && f.contentDocument.getElementById('tabrow'); } catch (e) { return false; }
  }, null, { timeout: 20000 });
  return page.frames().find((f) => f !== page.mainFrame());
}

// The seeded-empty app may be shorter than the frame; make sure it scrolls,
// which is when a desktop scrollbar would take its width.
const inner = (frame) => frame.evaluate(() => (document.body.style.minHeight = '3000px', {
  width: window.innerWidth, height: window.innerHeight,
  layoutWidth: document.documentElement.clientWidth, path: location.pathname,
  appRoot: !!document.getElementById('tabrow'),
}));

for (const [label, prefix] of [['at the root (Vercel, local)', ''], ['below a repo path (GitHub Pages)', '/MP-Dashboard-Beta-v2']]) {
  maybe(`${label}: frames the normal app at 390 by default, never itself`, async () => {
    const v = await openPreview({ prefix });
    try {
      assert.strictEqual(await v.page.evaluate(() => location.pathname), `${prefix}/preview/`, 'normalised to the folder');
      const f = await appFrame(v.page);
      const vp = await inner(f);
      assert.strictEqual(vp.path, `${prefix}/`, 'the frame holds the app route');
      assert.ok(vp.appRoot, 'and it is the app');
      assert.deepStrictEqual([vp.width, vp.height, vp.layoutWidth], [390, 844, 390], 'a genuine 390px viewport, no scrollbar taken out of it');
      assert.strictEqual(await v.page.locator('button[data-width="390"]').getAttribute('aria-pressed'), 'true');
      // The preview page was requested once: the frame never loaded it again.
      assert.strictEqual(v.requested.filter((p) => /\/preview\/(index\.html)?$/.test(p)).length, 1);
      assert.strictEqual(await v.page.locator('iframe').count(), 1);
      assert.strictEqual(await f.locator('iframe').count(), 0, 'nothing nested inside the app');
      // Open full size is the app, in a new tab.
      const open = v.page.locator('#openFull');
      assert.strictEqual(new URL(await open.evaluate((a) => a.href)).pathname, `${prefix}/`);
      assert.strictEqual(await open.getAttribute('target'), '_blank');
    } finally { await v.close(); }
  });
}

maybe('375 / 412 / rotate resize the app\'s own viewport, and nothing reloads it', async () => {
  const v = await openPreview();
  try {
    const f = await appFrame(v.page);
    await f.evaluate(() => { window.__sameDocument = true; });
    const expect = { 375: [375, 812], 412: [412, 915], 390: [390, 844] };
    for (const w of [375, 412, 390]) {
      await v.page.click(`button[data-width="${w}"]`);
      await v.page.waitForTimeout(100);
      const vp = await inner(f);
      assert.deepStrictEqual([vp.width, vp.height, vp.layoutWidth], [...expect[w], expect[w][0]], `${w}`);
      assert.strictEqual(await v.page.locator(`button[data-width="${w}"]`).getAttribute('aria-pressed'), 'true');
    }
    await v.page.click('#rotate');
    await v.page.waitForTimeout(100);
    const land = await inner(f);
    assert.deepStrictEqual([land.width, land.height], [844, 390]);
    assert.ok(await f.evaluate(() => window.__sameDocument), 'resized in place, not reloaded');
    await v.page.click('#refresh');
    await v.page.waitForFunction(() => { try { return !document.getElementById('appFrame').contentWindow.__sameDocument && document.getElementById('appFrame').contentDocument.getElementById('tabrow'); } catch (e) { return false; } });
  } finally { await v.close(); }
});

maybe('a short laptop screen scales the device, not the app\'s viewport', async () => {
  const v = await openPreview({ viewport: { width: 1280, height: 640 } });
  try {
    const f = await appFrame(v.page);
    const scale = Number(await v.page.evaluate(() => document.body.dataset.scale));
    assert.ok(scale < 1 && scale > 0.5, `scaled to ${scale}`);
    const box = await v.page.locator('#device').boundingBox();
    assert.ok(box.y >= 0 && box.y + box.height <= 640, 'the whole device is on screen');
    const vp = await inner(f);
    assert.deepStrictEqual([vp.width, vp.height, vp.layoutWidth], [390, 844, 390], 'the app still believes it is 390 wide');
    assert.match(await v.page.locator('#readout').textContent(), /^390 × 844 · shown at \d+%$/);
  } finally { await v.close(); }
});

maybe('on a phone: a link to the app, no frame', async () => {
  const v = await openPreview({ viewport: { width: 390, height: 844 } });
  try {
    await v.page.waitForTimeout(300);
    assert.strictEqual(await v.page.locator('iframe').count(), 0, 'no phone inside a phone');
    const link = v.page.locator('#openNormally');
    assert.ok(await link.isVisible());
    assert.strictEqual(await link.textContent(), 'Open Money Padel normally');
    assert.strictEqual(new URL(await link.evaluate((a) => a.href)).pathname, '/');
    assert.ok(!(await v.page.locator('#toolbar').isVisible()));
    assert.ok(!v.requested.some((p) => p === '/' || p.startsWith('/assets/')), 'the app is not loaded behind the message');
  } finally { await v.close(); }
});
