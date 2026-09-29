// ===================== BUILD STAMP =====================
// The foot of Admin / Manage says which deployed build this device is
// running, so a phone still on an old cached app can be caught at a glance.
//
// Three things make it trustworthy, and the tests are about them:
//   - the SHA comes from the build itself (GitHub Pages' Jekyll run), never
//     from a hand-maintained constant and never from asking GitHub, which
//     only knows the newest build;
//   - the date is the build's date, never today's -- an old app opened
//     tomorrow must not claim tomorrow;
//   - anything that does not look like a real stamp reads as a local build,
//     rather than as a plausible wrong answer.

const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const H = require('./helpers/uiHarness.js');
const BuildStamp = require('../assets/js/buildStamp.js');

const maybe = H.available() ? test : test.skip;
const ROOT = path.join(__dirname, '..');
const read = (rel) => fs.readFileSync(path.join(ROOT, rel), 'utf8');

const SHA = 'a4c91e27d0b3f5e8c61a2d94b7e05f3c8a1d6e2b';
const stamped = (sha, date) => `window.MP_BUILD = { sha: "${sha}", date: "${date}" };\n`;

// --- what the stamp says ------------------------------------------------------

test('a deployed build reads as its date and its short SHA', () => {
  const b = BuildStamp.describe({ sha: SHA, date: '2026-09-26' });
  assert.strictEqual(b.title, 'Money Padel Beta · 26 Sep 2026');
  assert.strictEqual(b.build, 'Build a4c91e2');
  assert.strictEqual(b.copyText, 'Money Padel Beta · 2026-09-26 · a4c91e2');
  assert.strictEqual(b.deployed, true);
});

test('the short SHA is the first seven characters of the deployed commit', () => {
  assert.strictEqual(BuildStamp.shortSha(SHA), SHA.slice(0, 7));
  assert.strictEqual(BuildStamp.shortSha('6efc096'), '6efc096');
});

test('the local placeholder reads as a local build, not a deployed one', () => {
  const b = BuildStamp.describe({ sha: null, date: null });
  assert.strictEqual(b.deployed, false);
  assert.strictEqual(b.title, 'Money Padel Beta · local build');
  assert.strictEqual(b.build, 'Build dev');
  assert.strictEqual(BuildStamp.describe(undefined).build, 'Build dev', 'no stamp loaded at all');
});

test('a stamp that is not a real SHA is never shown as one', () => {
  for (const sha of ['{{ site.github.build_revision }}', '', 'main', 'xyz1234', '123456']) {
    assert.strictEqual(BuildStamp.describe({ sha, date: '2026-09-26' }).build, 'Build dev', JSON.stringify(sha));
  }
});

test('a missing or malformed date drops the date, never the build', () => {
  for (const date of [null, '', '{{ site.time }}', '2026-13-01', '26/09/2026']) {
    const b = BuildStamp.describe({ sha: SHA, date });
    assert.strictEqual(b.title, 'Money Padel Beta', JSON.stringify(date));
    assert.strictEqual(b.build, 'Build a4c91e2');
    assert.strictEqual(b.copyText, 'Money Padel Beta · a4c91e2');
  }
});

test('the date is read as a calendar date, so no time zone moves it', () => {
  assert.strictEqual(BuildStamp.describe({ sha: SHA, date: '2027-01-01' }).title, 'Money Padel Beta · 1 Jan 2027');
  assert.strictEqual(BuildStamp.describe({ sha: SHA, date: '2026-12-31' }).title, 'Money Padel Beta · 31 Dec 2026');
});

test('the stamp never consults the clock or the network', () => {
  const src = read('assets/js/buildStamp.js').replace(/\/\/.*$/gm, '');
  assert.doesNotMatch(src, /new Date|Date\.now|fetch\(|XMLHttpRequest|api\.github/);
});

// --- where the stamp comes from -----------------------------------------------

test('nobody maintains the SHA: the committed file is a placeholder', () => {
  const src = read('assets/js/buildInfo.js').replace(/\/\/.*$/gm, '');
  assert.match(src, /sha:\s*null/);
  assert.match(src, /date:\s*null/);
  assert.doesNotMatch(src, /[0-9a-f]{7,40}/i, 'no hand-written SHA');
});

test('the Pages build renders the template over the placeholder, and only there', () => {
  const tpl = read('assets/js/buildInfo.pages.js');
  const front = /^---\n([\s\S]*?)\n---\n/.exec(tpl);
  assert.ok(front, 'Jekyll only renders a file that starts with front matter');
  assert.match(front[1], /^permalink:\s*\/assets\/js\/buildInfo\.js\s*$/m);
  assert.match(tpl, /\{\{\s*site\.github\.build_revision\s*\}\}/, 'the SHA of the commit being built');
  assert.match(tpl, /\{\{\s*site\.time \| date: '%Y-%m-%d'\s*\}\}/, 'the time of the build');

  // The placeholder must be excluded, or Jekyll copies it over the stamp.
  const config = read('_config.yml');
  assert.match(config, /^exclude:\s*\n\s+-\s+assets\/js\/buildInfo\.js\s*$/m);
});

test('the rendered template is the script the app reads', () => {
  const tpl = read('assets/js/buildInfo.pages.js')
    .replace(/^---\n[\s\S]*?\n---\n/, '')
    .replace(/\{\{\s*site\.github\.build_revision\s*\}\}/, SHA)
    .replace(/\{\{\s*site\.time[^}]*\}\}/, '2026-09-26');
  const sandbox = { window: {} };
  vm.runInNewContext(tpl, sandbox);
  assert.deepStrictEqual({ ...sandbox.window.MP_BUILD }, { sha: SHA, date: '2026-09-26' });
});

test('the stamp loads with the app, before anything that shows it', () => {
  const html = read('index.html');
  const at = (f) => html.indexOf(`<script src="assets/js/${f}"></script>`);
  assert.ok(at('buildInfo.js') > 0 && at('buildStamp.js') > at('buildInfo.js'));
  assert.ok(at('shell.js') > at('buildStamp.js'));
  assert.strictEqual(html.indexOf('buildInfo.pages.js'), -1, 'the template is never loaded as-is');
});

// --- in the app ---------------------------------------------------------------
// It lives at the foot of Admin / Manage (Shaun, 26 Sep: More was the first
// home, but Admin is where he looks). Shown locked or unlocked.

const openManage = (unlocked) => {
  isUnlocked = unlocked; currentUserName = unlocked ? 'Board' : null;
  document.querySelector('#tabrow .tab-btn[data-tab="manage"]').click();
  renderManage();
};

const readStamp = () => {
  const box = document.getElementById('manageView');
  const el = document.getElementById('buildStamp');
  if (!el) return null;
  const cs = getComputedStyle(el);
  return {
    lines: [...el.children].map((c) => c.textContent.trim()),
    isLast: box.lastElementChild === el,
    inMore: !!document.querySelector('#shellMoreSheet #buildStamp, #shellMoreSheet .build-stamp'),
    fontSize: parseFloat(cs.fontSize),
    border: cs.borderTopStyle,
    background: cs.backgroundColor,
  };
};

maybe('locally, the foot of Admin / Manage says it is a local build', async () => {
  const app = await H.open();
  try {
    await app.run(openManage, true);
    const r = await app.run(readStamp);
    assert.deepStrictEqual(r.lines, ['Money Padel Beta · local build', 'Build dev']);
    assert.deepStrictEqual(app.pageErrors, []);
  } finally { await app.close(); }
});

maybe('a deployed build shows its own date and SHA -- a week later, still its own date', async () => {
  const app = await H.open({
    files: { 'assets/js/buildInfo.js': stamped(SHA, '2026-09-26') },
    now: '2026-10-03T09:00:00',
  });
  try {
    await app.run(openManage, true);
    const r = await app.run(readStamp);
    assert.deepStrictEqual(r.lines, ['Money Padel Beta · 26 Sep 2026', 'Build a4c91e2']);
    assert.ok(r.isLast, 'the very bottom of Admin / Manage, below every section');
    assert.strictEqual(r.inMore, false, 'moved, not duplicated');
    assert.ok(r.fontSize <= 11, `quiet text, got ${r.fontSize}px`);
    assert.strictEqual(r.border, 'none', 'not a card');
    assert.strictEqual(r.background, 'rgba(0, 0, 0, 0)', 'not a card');
    assert.deepStrictEqual(app.pageErrors, []);
  } finally { await app.close(); }
});

maybe('a locked Admin screen still shows the build, under the unlock form', async () => {
  const app = await H.open({ files: { 'assets/js/buildInfo.js': stamped(SHA, '2026-09-26') } });
  try {
    await app.run(openManage, false);
    const r = await app.run(readStamp);
    assert.deepStrictEqual(r.lines, ['Money Padel Beta · 26 Sep 2026', 'Build a4c91e2']);
    assert.ok(r.isLast);
    assert.deepStrictEqual(app.pageErrors, []);
  } finally { await app.close(); }
});

maybe('tapping the stamp copies a one-line version for a bug report', async () => {
  const app = await H.open({ files: { 'assets/js/buildInfo.js': stamped(SHA, '2026-09-26') } });
  try {
    await app.page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
    await app.run(openManage, true);
    await app.page.click('#buildStamp');
    await app.page.waitForFunction(() => document.getElementById('buildStampSha').textContent === 'Copied');
    const copied = await app.run(() => navigator.clipboard.readText());
    assert.strictEqual(copied, 'Money Padel Beta · 2026-09-26 · a4c91e2');
    await app.page.waitForFunction(() => document.getElementById('buildStampSha').textContent === 'Build a4c91e2',
      null, { timeout: 4000 });
    assert.deepStrictEqual(app.pageErrors, []);
  } finally { await app.close(); }
});

// --- on Vercel ----------------------------------------------------------------
// Vercel runs no Jekyll, so the Pages template never renders there. Its build
// command (vercel.json) runs scripts/stamp-build.js, which writes the same line
// from the commit Vercel says it is deploying. Without it, every device on a
// Vercel deploy would read "local build".

const os = require('node:os');
const Stamp = require('../scripts/stamp-build.js');

// A throwaway copy of the one file the script writes, so no test can touch the
// committed placeholder.
function sandboxRoot() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'mp-stamp-'));
  fs.mkdirSync(path.join(root, 'assets', 'js'), { recursive: true });
  fs.copyFileSync(path.join(ROOT, 'assets/js/buildInfo.js'), path.join(root, Stamp.TARGET));
  return root;
}
const loadStamp = (src) => { const sb = { window: {} }; vm.runInNewContext(src, sb); return { ...sb.window.MP_BUILD }; };

test('Vercel: the deployed commit is stamped, and the app reads it as a deployed build', () => {
  const root = sandboxRoot();
  const r = Stamp.run({ root, env: { VERCEL: '1', VERCEL_GIT_COMMIT_SHA: SHA }, now: new Date('2026-09-26T10:00:00Z') });
  assert.strictEqual(r.written, true);
  const info = loadStamp(fs.readFileSync(path.join(root, Stamp.TARGET), 'utf8'));
  assert.deepStrictEqual(info, { sha: SHA, date: '2026-09-26' });
  const b = BuildStamp.describe(info);
  assert.strictEqual(b.build, 'Build a4c91e2');
  assert.strictEqual(b.title, 'Money Padel Beta · 26 Sep 2026');
});

test('Vercel writes exactly the line the Pages template renders', () => {
  const pages = read('assets/js/buildInfo.pages.js')
    .replace(/^---\n[\s\S]*?\n---\n/, '')
    .replace(/\{\{\s*site\.github\.build_revision\s*\}\}/, SHA)
    .replace(/\{\{\s*site\.time[^}]*\}\}/, '2026-09-26');
  assert.strictEqual(Stamp.stampSource(SHA, '2026-09-26'), pages, 'one format, whichever host built it');
});

test('Vercel dates the build in the club\'s time zone, as Pages does', () => {
  // 23:30 UTC on 29 Sep is 00:30 on 30 Sep in London (BST)...
  assert.strictEqual(Stamp.clubDate(new Date('2026-09-29T23:30:00Z')), '2026-09-30');
  // ...and in winter London is on UTC.
  assert.strictEqual(Stamp.clubDate(new Date('2026-12-31T23:30:00Z')), '2026-12-31');
  assert.match(read('_config.yml'), /^timezone:\s*Europe\/London\s*$/m, 'the zone Pages uses');
  assert.strictEqual(Stamp.TIME_ZONE, 'Europe/London');
});

test('no believable deploy SHA: the placeholder is left alone and reads as a local build', () => {
  for (const env of [{}, { VERCEL: '1' }, { VERCEL_GIT_COMMIT_SHA: '' }, { VERCEL_GIT_COMMIT_SHA: 'main' },
    { VERCEL_GIT_COMMIT_SHA: '$VERCEL_GIT_COMMIT_SHA' }]) {
    const root = sandboxRoot();
    const before = fs.readFileSync(path.join(root, Stamp.TARGET), 'utf8');
    const r = Stamp.run({ root, env, now: new Date('2026-09-26T10:00:00Z') });
    assert.strictEqual(r.written, false, JSON.stringify(env));
    const after = fs.readFileSync(path.join(root, Stamp.TARGET), 'utf8');
    assert.strictEqual(after, before, 'untouched');
    assert.strictEqual(BuildStamp.describe(loadStamp(after)).build, 'Build dev');
  }
});

test('another host can opt in with MP_BUILD_SHA; Vercel\'s own value wins when both are set', () => {
  assert.deepStrictEqual(Stamp.deploySha({ MP_BUILD_SHA: SHA }), { sha: SHA, source: 'MP_BUILD_SHA' });
  assert.strictEqual(Stamp.deploySha({ VERCEL_GIT_COMMIT_SHA: SHA, MP_BUILD_SHA: 'b'.repeat(40) }).source,
    'VERCEL_GIT_COMMIT_SHA');
});

test('vercel.json runs the stamp as the build and serves the site as plain static files', () => {
  const cfg = JSON.parse(read('vercel.json'));
  assert.strictEqual(cfg.buildCommand, 'node scripts/stamp-build.js');
  assert.strictEqual(cfg.framework, null, 'no framework preset: the repo root is the site, as on Pages');
  // The stamp script reads nothing but the environment and the clock --
  // never the network, never git, never GitHub.
  const src = read('scripts/stamp-build.js').replace(/\/\/.*$/gm, '');
  assert.doesNotMatch(src, /require\(['"](https?|child_process|net)['"]\)|fetch\(|api\.github|git rev-parse/);
});

test('each host ignores the other host\'s machinery', () => {
  // Pages must not publish Vercel's config...
  assert.match(read('_config.yml'), /^\s+-\s+vercel\.json\s*$/m);
  // ...and the Pages exclude of the placeholder is still the first entry.
  assert.match(read('_config.yml'), /^exclude:\s*\n\s+-\s+assets\/js\/buildInfo\.js\s*$/m);
});

test('running the script with no deploy SHA cannot dirty the committed placeholder', () => {
  const { execFileSync } = require('node:child_process');
  const before = read('assets/js/buildInfo.js');
  const env = { ...process.env };
  Stamp.SHA_VARS.forEach((k) => { delete env[k]; });
  const out = execFileSync(process.execPath, [path.join(ROOT, 'scripts/stamp-build.js')], { env, encoding: 'utf8' });
  assert.match(out, /placeholder left as it is/);
  assert.strictEqual(read('assets/js/buildInfo.js'), before);
});

maybe('a Vercel-stamped build shows in Admin / Manage like a Pages one', async () => {
  const root = sandboxRoot();
  Stamp.run({ root, env: { VERCEL_GIT_COMMIT_SHA: SHA }, now: new Date('2026-09-26T10:00:00Z') });
  const app = await H.open({ files: { 'assets/js/buildInfo.js': fs.readFileSync(path.join(root, Stamp.TARGET), 'utf8') } });
  try {
    await app.run(openManage, true);
    const r = await app.run(readStamp);
    assert.deepStrictEqual(r.lines, ['Money Padel Beta · 26 Sep 2026', 'Build a4c91e2']);
    assert.deepStrictEqual(app.pageErrors, []);
  } finally { await app.close(); }
});
