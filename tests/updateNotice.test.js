// ===================== NEW BUILD NOTICE =====================
// Shaun, 27 Oct: "a small notification when I go on the app that it's been
// updated, with a button to refresh" -- as his Ledger app has. The app re-reads
// the deployed build stamp (assets/js/buildInfo.js) and compares it with the
// one it is running.

const test = require('node:test');
const assert = require('node:assert');
const H = require('./helpers/uiHarness.js');
const BS = require('../assets/js/buildStamp.js');

const maybe = H.available() ? test : test.skip;

test('the deployed stamp is read only in its own shape; only a different, real commit is newer', () => {
  assert.strictEqual(BS.deployedSha('window.MP_BUILD = { sha: "ABCDEF1234567", date: "2026-10-27" };\n'), 'abcdef1234567');
  assert.strictEqual(BS.deployedSha('window.MP_BUILD = { sha: null, date: null };'), null, 'the local placeholder');
  assert.strictEqual(BS.deployedSha('window.MP_BUILD = { sha: "{{ site.github.build_revision }}" };'), null, 'an unrendered template');
  assert.strictEqual(BS.deployedSha('<html>404</html>'), null);
  assert.strictEqual(BS.isNewer('abcdef1', 'abcdef1234567'), false, 'the same commit, short or long');
  assert.strictEqual(BS.isNewer('abcdef1', '1234567'), true);
  assert.strictEqual(BS.isNewer(null, '1234567'), false, 'a local build never nags');
  assert.strictEqual(BS.isNewer('abcdef1', null), false, 'a failed read never nags');
});

const STAMP = (sha) => `window.MP_BUILD = { sha: "${sha}", date: "2026-10-27" };\n`;

maybe('in the app: a newer deploy shows the bar; dismiss hides it for that build; Refresh reloads', async () => {
  const app = await H.open({ viewport: { width: 390, height: 844 } });
  try {
    let deployed = 'aaaaaaa';
    await app.page.route('**/assets/js/buildInfo.js?check=*', (route) => route.fulfill({ contentType: 'text/javascript', body: STAMP(deployed) }));
    const bar = () => app.run(() => { const b = document.getElementById('updateNotice'); return b ? { text: b.innerText.replace(/\s+/g, ' '), build: b.dataset.build } : null; });
    await app.run(() => { window.MP_BUILD = { sha: 'aaaaaaa', date: '2026-10-27' }; });

    await app.run(() => checkForNewBuild());
    assert.strictEqual(await bar(), null, 'the same build: nothing to say');

    deployed = 'bbbbbbb';
    await app.run(() => checkForNewBuild());
    const shown = await bar();
    assert.ok(shown, 'a newer deploy shows the bar');
    assert.match(shown.text, /New build available Refresh/);
    const fits = await app.run(() => { const r = document.getElementById('updateNotice').getBoundingClientRect(); const nav = document.querySelector('.shell-bottom-nav'); return r.left >= 0 && r.right <= window.innerWidth && (!nav || r.bottom <= nav.getBoundingClientRect().top); });
    assert.ok(fits, 'on screen, above the tab bar');

    await app.page.click('#updateNoticeClose');
    assert.strictEqual(await bar(), null, 'dismissed');
    await app.run(() => checkForNewBuild());
    assert.strictEqual(await bar(), null, 'stays dismissed for that build');
    deployed = 'ccccccc';
    await app.run(() => checkForNewBuild());
    assert.strictEqual((await bar()).build, 'ccccccc', 'a later build shows it again');

    // Refresh reloads the page.
    await app.run(() => { window.__beforeReload = true; });
    await Promise.all([app.page.waitForEvent('load'), app.page.click('#updateNoticeRefresh')]);
    assert.strictEqual(await app.page.evaluate(() => window.__beforeReload), undefined, 'the page was reloaded');
    assert.deepStrictEqual(app.pageErrors, []);
  } finally { await app.close(); }
});

maybe('a local build never shows the bar', async () => {
  const app = await H.open();
  try {
    await app.page.route('**/assets/js/buildInfo.js?check=*', (route) => route.fulfill({ contentType: 'text/javascript', body: STAMP('bbbbbbb') }));
    const r = await app.run(async () => { await checkForNewBuild(); return !!document.getElementById('updateNotice'); });
    assert.strictEqual(r, false);
  } finally { await app.close(); }
});
