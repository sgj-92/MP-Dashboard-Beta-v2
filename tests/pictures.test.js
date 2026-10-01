// ===================== BOARD PACK AND SHARE DECK AS PICTURES =====================
// Every Board Pack module, and every Share Deck slide, can be shared as a PNG
// -- straight from the Admin preview, before anything is published. Pictures
// are painted from the same data the screen draws (CardPainter), sized for
// WhatsApp: slides 1080 x 1350, modules 1080 wide.

const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const H = require('./helpers/uiHarness.js');

const maybe = H.available() ? test : test.skip;
const NOW = '2026-09-28T12:00:00.000Z';

function png(file){
  const b = fs.readFileSync(file);
  assert.strictEqual(b.slice(1, 4).toString(), 'PNG');
  return { width: b.readUInt32BE(16), height: b.readUInt32BE(20) };
}

async function openPreview(app, mode){
  await app.run((m) => {
    isUnlocked = true; adminRole = 'owner'; currentUserName = 'Shaun';
    legacyTabBtn('manage').click(); renderManage();
    document.querySelector('[data-acc-toggle="boardpack"]').click();
  }, mode);
  await app.page.waitForSelector('#bpStatus');
  await app.page.click('#bpPreviewBtn');
  if (mode === 'deck') { await app.page.click('#bpModeDeck'); await app.page.waitForSelector('#bpDeckFrame .deck-slide'); }
}

const collect = (page) => { const got = []; page.on('download', (d) => got.push(d)); return got; };

maybe('the painter: slides are 1080 x 1350, modules 1080 wide and as tall as they need, real pictures, and the crown is drawn', async () => {
  const app = await H.open({ now: NOW });
  try {
    const r = await app.run(async () => {
      const images = await boardPackImages();
      let c = BoardPack.defaultConfig('2026-09');
      c.items.forEach((_, i) => { c = BoardPack.setEnabled(c, i, true); });
      const deck = boardPackDeck(c);
      const colours = (cv, x, y, w, h) => { const d = cv.getContext('2d').getImageData(x, y, w, h).data; const s = new Set(); for (let i = 0; i < d.length; i += 4) s.add(`${d[i] >> 4},${d[i + 1] >> 4},${d[i + 2] >> 4}`); return s.size; };
      const slides = [{ id: 'cover', kind: 'cover', title: 'September 2026' }].concat(deck.slides).map((s) => {
        const cv = CardPainter.slide(s, Object.assign({ month: 'September 2026' }, images));
        return { id: s.id, w: cv.width, h: cv.height, url: cv.toDataURL('image/png').length, body: colours(cv, 60, 420, 960, 600) };
      });
      const sheet = (id) => CardPainter.sheet(boardPackSheet(c.items.find((it) => it.id === id), '2026-09'), images);
      const league = sheet('league'), overview = sheet('overview');
      const kingsWith = CardPainter.slide(deck.slides.find((s) => s.id === 'kings'), Object.assign({ month: 'September 2026' }, images));
      const kingsWithout = CardPainter.slide(deck.slides.find((s) => s.id === 'kings'), { month: 'September 2026', brand: images.brand, crown: null });
      return {
        images: [!!images.brand, !!images.crown], slides,
        league: [league.width, league.height], overview: [overview.width, overview.height],
        crown: kingsWith.toDataURL() !== kingsWithout.toDataURL(),
      };
    });
    assert.deepStrictEqual(r.images, [true, true]);
    assert.ok(r.slides.length > 15);
    r.slides.forEach((s) => {
      assert.deepStrictEqual([s.w, s.h], [1080, 1350], s.id);
      assert.ok(s.url > 20000, `${s.id} encodes (the canvas is not tainted) and is a real picture`);
      assert.ok(s.body > 8, `${s.id} has something drawn on it (${s.body} colours)`);
    });
    assert.strictEqual(r.league[0], 1080);
    assert.ok(r.league[1] > r.overview[1] && r.overview[1] >= 400, `a long table is a tall picture (${r.league[1]} vs ${r.overview[1]})`);
    assert.strictEqual(r.crown, true, 'the Kings card carries the laurel crown');
    assert.deepStrictEqual(app.pageErrors, []);
  } finally { await app.close(); }
});

maybe('every Board Pack module has Share image; with no share sheet the picture is saved, named for the month and module', async () => {
  const app = await H.open({ now: NOW });
  try {
    await openPreview(app, 'pack');
    const p = app.page;
    const r = await app.run(() => ({
      sections: [...document.querySelectorAll('#bpPreview .bp-module')].map((s) => s.dataset.module || 'note'),
      buttons: [...document.querySelectorAll('#bpPreview [data-bp-share-item]')].map((b) => b.dataset.bpShareItem),
    }));
    assert.deepStrictEqual(r.buttons, r.sections, 'one button per module');
    const [dl] = await Promise.all([p.waitForEvent('download'), p.click('[data-bp-share-item="league"]')]);
    assert.strictEqual(dl.suggestedFilename(), 'money-padel-2026-09-board-pack-league.png');
    const size = png(await dl.path());
    assert.strictEqual(size.width, 1080);
    assert.ok(size.height > 1500, `the whole league is in it (${size.height}px)`);
    await p.waitForFunction(() => /saved to this device/.test(document.getElementById('bpMessage').textContent));
    assert.deepStrictEqual(app.pageErrors, []);
  } finally { await app.close(); }
});

maybe('the Share Deck can be shared before publishing: this slide, every slide, and the summary', async () => {
  const app = await H.open({ now: NOW });
  try {
    await openPreview(app, 'deck');
    const p = app.page;
    assert.match(await p.textContent('#bpPublishState'), /^Draft\./, 'nothing is published');
    const expected = await app.run(() => boardPackDeckPictures().cards.map((c) => c.id));
    assert.deepStrictEqual(expected.slice(0, 1).concat(expected.slice(-1)), ['cover', 'end']);
    assert.deepStrictEqual(expected.slice(1, -1), await app.run(() => ShareDeck.visibleSlides(boardPackDeck(boardPackDraft), boardPackPlayerCanSee).map((s) => s.id)));

    const got = collect(p);
    await p.click('#bpShareSlides');
    await p.waitForFunction(() => /slide pictures saved/.test(document.getElementById('bpMessage').textContent));
    await p.waitForTimeout(300);
    assert.deepStrictEqual(got.map((d) => d.suggestedFilename()), expected.map((id, i) => `money-padel-2026-09-review-${String(i + 1).padStart(2, '0')}-${id.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.png`));
    for (const d of got) assert.deepStrictEqual(png(await d.path()), { width: 1080, height: 1350 }, d.suggestedFilename());

    // This slide: wherever the preview has been swiped to.
    const settle = (i) => p.waitForFunction((k) => { const t = document.querySelector('#bpDeckFrame [data-deck-track]');
      return document.querySelector('#bpDeckFrame [data-deck]').dataset.index === String(k) && Math.abs(t.scrollLeft - k * t.clientWidth) < 2; }, i);
    await p.click('#bpDeckFrame [data-deck-next]'); await settle(1);
    await p.click('#bpDeckFrame [data-deck-next]'); await settle(2);
    const before = got.length;
    await p.click('#bpShareSlide');
    for (let t = 0; t < 100 && got.length === before; t++) await p.waitForTimeout(100);
    assert.strictEqual(got.length, before + 1, 'one picture');
    assert.strictEqual(got.at(-1).suggestedFilename(), `money-padel-2026-09-review-03-${expected[2].toLowerCase().replace(/[^a-z0-9]+/g, '-')}.png`);

    // The summary, before publishing: the slides' headlines, no link yet.
    await p.context().grantPermissions(['clipboard-read', 'clipboard-write']);
    await p.click('#bpCopyDeckSummary');
    await p.waitForFunction(() => /Summary copied/.test(document.getElementById('bpMessage').textContent));
    const text = await p.evaluate(() => navigator.clipboard.readText());
    assert.strictEqual(text, await app.run(() => ShareDeck.summaryText(boardPackDeck(boardPackDraft), { canSee: boardPackPlayerCanSee })));
    assert.match(text, /^\*Money Padel — September 2026\*\n/);
    assert.ok(!/review:/.test(text), 'no link until it is published');
    assert.strictEqual(await app.run(() => window.__writes.filter((w) => /review_/.test(w.id)).length), 0, 'sharing published nothing');
    // Pictures go to players: a section the club made Admin only stays out.
    const hidden = await app.run(() => { visibilityState.power = false; const ids = boardPackDeckPictures().cards.map((c) => c.id); visibilityState.power = true; return ids; });
    assert.ok(expected.includes('kings') && !hidden.includes('kings') && !hidden.includes('power'), JSON.stringify(hidden));
    assert.deepStrictEqual(app.pageErrors, []);
  } finally { await app.close(); }
});

maybe('with a share sheet the pictures go straight to it; if the moment has passed, one tap shares them', async () => {
  const app = await H.open({ now: NOW });
  try {
    await openPreview(app, 'pack');
    const p = app.page;
    await app.run(() => {
      window.__shared = [];
      window.__refuseFirst = true;
      navigator.canShare = (d) => !!(d && d.files && d.files.every((f) => f instanceof File));
      navigator.share = async (d) => {
        if (window.__refuseFirst) { window.__refuseFirst = false; const e = new Error('no gesture'); e.name = 'NotAllowedError'; throw e; }
        window.__shared.push({ title: d.title, files: d.files.map((f) => [f.name, f.type, f.size > 1000]) });
      };
    });
    // The share sheet refuses (the tap was used up preparing the picture):
    // the picture is kept ready behind a Share button.
    await p.click('[data-bp-share-item="kings"]');
    await p.waitForSelector('#bpShareReady');
    assert.match(await p.textContent('#bpShareReady'), /Kings of Tiers picture ready/);
    await p.click('#bpShareNow');
    await p.waitForFunction(() => window.__shared.length === 1);
    assert.deepStrictEqual(await app.run(() => window.__shared[0]), { title: 'Money Padel — September 2026', files: [['money-padel-2026-09-board-pack-kings.png', 'image/png', true]] });
    await p.waitForFunction(() => !document.getElementById('bpShareReady'));

    // And straight through when it does not.
    await p.click('[data-bp-share-item="overview"]');
    await p.waitForFunction(() => window.__shared.length === 2);
    assert.strictEqual(await app.run(() => window.__shared[1].files[0][0]), 'money-padel-2026-09-board-pack-overview.png');
    await p.waitForFunction(() => /picture shared/.test(document.getElementById('bpMessage').textContent));
    assert.deepStrictEqual(app.pageErrors, []);
  } finally { await app.close(); }
});

maybe('saving many pictures to the device loses none: a long deck is handed over one at a time', async () => {
  const app = await H.open({ now: NOW });
  try {
    const p = app.page;
    const got = []; p.on('download', (d) => got.push(d.suggestedFilename()));
    await app.run(async () => {
      const files = await Promise.all(Array.from({ length: 14 }, (_, i) => {
        const cv = document.createElement('canvas'); cv.width = 4; cv.height = 4;
        return CardPainter.toFile(cv, `slide-${String(i + 1).padStart(2, '0')}.png`);
      }));
      await CardPainter.save(files);
    });
    for (let t = 0; t < 50 && got.length < 14; t++) await p.waitForTimeout(100);
    assert.deepStrictEqual(got, Array.from({ length: 14 }, (_, i) => `slide-${String(i + 1).padStart(2, '0')}.png`));
  } finally { await app.close(); }
});
