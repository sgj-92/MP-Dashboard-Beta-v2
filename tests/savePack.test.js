// ===================== SAVING A WHOLE PACK =====================
// The club Board Pack and each player's pack can be saved in one go: the
// whole report as one PDF (a contents page, then every selected module), the
// slides as one PDF, or every module as a picture. Before publishing, and
// without writing anything.

const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const H = require('./helpers/uiHarness.js');
const { inspectPdf } = require('./helpers/pdfInspect.js');

const maybe = H.available() ? test : test.skip;
const NOW = '2026-09-28T12:00:00.000Z';

async function openClub(app){
  await app.run(() => {
    isUnlocked = true; adminRole = 'owner'; currentUserName = 'Shaun';
    legacyTabBtn('manage').click(); renderManage();
    document.querySelector('[data-acc-toggle="boardpack"]').click();
  });
  await app.page.waitForSelector('#bpStatus');
  await app.page.selectOption('#bpMonth', '2026-09');
  await app.page.waitForSelector('#bpStatus');
}

// Click, wait for the message, and collect the downloads it made.
function collector(page){
  const got = [];
  page.on('download', (d) => got.push(d));
  return async (selector, message, n = 1) => {
    const before = got.length;
    await page.click(selector);
    await page.waitForFunction((m) => new RegExp(m).test(document.getElementById('bpMessage').textContent), message, { timeout: 30000 });
    for (let t = 0; t < 80 && got.length < before + n; t++) await page.waitForTimeout(100);
    return got.slice(before);
  };
}
const pdfOf = async (d) => inspectPdf(fs.readFileSync(await d.path()));
const pngWidth = async (d) => fs.readFileSync(await d.path()).readUInt32BE(16);

maybe('the club Board Pack: the whole pack as one PDF, the slides as one PDF, every module as a picture -- writing nothing', async () => {
  const app = await H.open({ now: NOW });
  try {
    await openClub(app);
    const p = app.page;
    const take = collector(p);
    assert.deepStrictEqual(await p.$$eval('.bp-save-all button', (els) => els.map((e) => e.textContent.trim())), ['Board Pack as PDF', 'Slides as PDF', 'All pictures']);
    const want = await app.run(() => ({
      titles: BoardPack.selected(boardPackDraft).map((it) => boardPackSheet(it, '2026-09').title),
      ids: BoardPack.selected(boardPackDraft).map((it) => it.id),
      cards: boardPackDeckPictures().cards.length,
    }));

    const [pack] = await take('#bpPackPdf', 'Board Pack PDF saved');
    assert.strictEqual(pack.suggestedFilename(), 'money-padel-2026-09-board-pack.pdf');
    assert.strictEqual(await p.textContent('#bpMessage'), 'Board Pack PDF saved to this device — it is in your downloads.', 'a PDF is not in your photos');
    const r = await pdfOf(pack);
    assert.strictEqual(r.offsetsOk, true);
    assert.strictEqual(r.pages.length, 1 + want.titles.length, 'a contents page, then every selected module');
    assert.strictEqual(r.declared, r.pages.length);
    r.pages.forEach(([w]) => assert.strictEqual(w, 540));
    r.images.forEach(([w]) => assert.strictEqual(w, 1080));
    assert.strictEqual(r.title, 'Money Padel — September 2026 Board Pack');

    const [slides] = await take('#bpSlidesPdf', 'Slides PDF saved');
    assert.strictEqual(slides.suggestedFilename(), 'money-padel-2026-09-review-slides.pdf');
    const s = await pdfOf(slides);
    assert.strictEqual(s.pages.length, want.cards, 'the cover, every slide players would see, the closing card');
    s.pages.forEach((pg) => assert.deepStrictEqual(pg, [540, 675]));
    s.images.forEach((im) => assert.deepStrictEqual(im, [1080, 1350]));

    const pictures = await take('#bpPackPictures', 'Board Pack pictures saved', want.ids.length);
    assert.deepStrictEqual(pictures.map((d) => d.suggestedFilename()), want.ids.map((id) => `money-padel-2026-09-board-pack-${id.replace(/_/g, '-')}.png`));
    for (const d of pictures) assert.strictEqual(await pngWidth(d), 1080);

    assert.strictEqual(await app.run(() => window.__writes.length), 0, 'saving publishes and stores nothing');
    assert.deepStrictEqual(app.pageErrors, []);
  } finally { await app.close(); }
});

maybe('the PDF goes to the phone\'s share sheet as a PDF where it can; the slides PDF leaves out Admin-only sections', async () => {
  const app = await H.open({ now: NOW });
  try {
    await openClub(app);
    const p = app.page;
    await app.run(() => {
      window.__shared = [];
      navigator.canShare = (d) => !!(d && d.files && d.files.every((f) => f instanceof File));
      navigator.share = async (d) => { window.__shared.push({ title: d.title, files: d.files.map((f) => [f.name, f.type, f.size > 1000]) }); };
    });
    await p.click('#bpPackPdf');
    await p.waitForFunction(() => window.__shared.length === 1);
    assert.deepStrictEqual(await app.run(() => window.__shared[0]), { title: 'Money Padel — September 2026', files: [['money-padel-2026-09-board-pack.pdf', 'application/pdf', true]] });
    await p.waitForFunction(() => /Board Pack PDF shared/.test(document.getElementById('bpMessage').textContent));

    // Power made Admin-only: its slides are not in the players' slides PDF.
    const counts = await app.run(() => {
      const all = boardPackDeckPictures().cards.length;
      visibilityState.power = false;
      const shown = boardPackDeckPictures().cards;
      return { all, shown: shown.length, power: shown.filter((c) => ShareDeck.SECTION[c.id] === 'power').length };
    });
    assert.ok(counts.shown < counts.all, JSON.stringify(counts));
    assert.strictEqual(counts.power, 0);
    const got = []; p.on('download', (d) => got.push(d));
    await app.run(() => { navigator.canShare = () => false; });
    await p.click('#bpSlidesPdf');
    await p.waitForFunction(() => /Slides PDF saved/.test(document.getElementById('bpMessage').textContent), null, { timeout: 30000 });
    for (let t = 0; t < 50 && !got.length; t++) await p.waitForTimeout(100);
    assert.strictEqual((await pdfOf(got[0])).pages.length, counts.shown);
    assert.deepStrictEqual(app.pageErrors, []);
  } finally { await app.close(); }
});

maybe('a player\'s pack: the pack as one PDF, the slides as one PDF, every module as a picture', async () => {
  const app = await H.open({ now: NOW, mobile: true });
  try {
    await openClub(app);
    const p = app.page;
    await p.click('#bpViewPlayers');
    await p.waitForSelector('#ppGenerate');
    const name = (await app.run(() => playerPackPlayers('2026-09')))[0];
    await p.click(`[data-pp-open="${name}"]`);
    await p.waitForSelector('#ppBack');
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const take = collector(p);
    assert.deepStrictEqual(await p.$$eval('.bp-save-all button', (els) => els.map((e) => e.textContent.trim())), ['Pack as PDF', 'Slides as PDF', 'All pictures']);
    const want = await app.run(([n]) => ({
      ids: BoardPack.PLAYER.selected(ppConfig('2026-09', n)).map((it) => it.id),
      cards: ppDeckPictures(n, '2026-09').cards.length,
    }), [name]);

    const [pack] = await take('#ppPackPdf', 'Pack PDF saved');
    assert.strictEqual(pack.suggestedFilename(), `money-padel-2026-09-${slug}-pack.pdf`);
    const r = await pdfOf(pack);
    assert.strictEqual(r.offsetsOk, true);
    assert.strictEqual(r.pages.length, 1 + want.ids.length);
    assert.strictEqual(r.title, `${name} — September 2026 Monthly Pack`);

    const [slides] = await take('#ppSlidesPdf', 'Slides PDF saved');
    assert.strictEqual(slides.suggestedFilename(), `money-padel-2026-09-${slug}-slides.pdf`);
    const s = await pdfOf(slides);
    assert.strictEqual(s.pages.length, want.cards);
    s.pages.forEach((pg) => assert.deepStrictEqual(pg, [540, 675]));

    const pictures = await take('#ppPackPictures', 'pack pictures saved', want.ids.length);
    assert.deepStrictEqual(pictures.map((d) => d.suggestedFilename()), want.ids.map((id) => `money-padel-2026-09-${slug}-${id}.png`));
    assert.strictEqual(await app.run(() => window.__writes.filter((w) => w.collection === 'playerPacks').length), 0, 'nothing published');
    assert.deepStrictEqual(app.pageErrors, []);
  } finally { await app.close(); }
});
