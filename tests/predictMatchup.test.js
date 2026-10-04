// ===================== PREDICT A MATCHUP: MORE MENU + MATCHUP CARD =====================
// Shaun, 4 Oct: Predict a Matchup is one of his most-used tools and he was
// screenshotting it for the group. It now sits first in More (Admin only),
// answers with a share-ready Matchup Card -- the teams, the call, expected
// games won -- and shares or copies that card as a picture. The prediction is
// still MatchPrediction.build, untouched; North vs South leaves More for
// Admin / Manage.

const test = require('node:test');
const assert = require('node:assert');
const MatchupCard = require('../assets/js/domain/predictions/matchupCard.js');
const MatchPrediction = require('../assets/js/matchPrediction.js');
const Engine = require('../assets/js/ratingEngine.js');
const H = require('./helpers/uiHarness.js');

const maybe = H.available() ? test : test.skip;
const ratings = { A1: 1500, A2: 1480, B1: 1400, B2: 1390, C1: 1450, C2: 1450.4, D1: 1450, D2: 1450 };
const predict = (a, b) => MatchPrediction.build(a, b, (n) => ratings[n]);

// ---------- the card, as data ----------

test('the card presents the prediction as it is: the call, and expected games from its own share', () => {
  const pred = predict(['A1', 'A2'], ['B1', 'B2']);
  const before = JSON.stringify(pred);
  const card = MatchupCard.build(pred, { tierOf: () => 'B', typicalGames: 25 });
  assert.strictEqual(JSON.stringify(pred), before, 'the prediction is read, never changed');
  assert.strictEqual(pred.shareA, Math.round(Engine.expectedScore(1490, 1395) * 100), 'and it is still the engine\'s own expectation');
  assert.deepStrictEqual(card.teamA.map((p) => [p.name, p.tier]), [['A1', 'B'], ['A2', 'B']]);
  assert.deepStrictEqual(card.call, { kind: 'clear', kicker: 'Projected favourites', favoured: 'A', names: 'A1 & A2', headline: 'Projected favourites: A1 & A2' });
  assert.deepStrictEqual(card.share, { a: pred.shareA, b: pred.shareB });
  assert.deepStrictEqual(card.games, { a: Math.round(pred.shareA / 100 * 25 * 10) / 10, b: Math.round((25 - Math.round(pred.shareA / 100 * 25 * 10) / 10) * 10) / 10, total: 25 });
  assert.strictEqual(Math.round((card.games.a + card.games.b) * 10) / 10, 25, 'the two sides add up to the match');
  assert.strictEqual(card.gamesNote, 'In a typical 25-game match');
  assert.doesNotMatch(JSON.stringify(card), /chance|probab|odds|likel/i, 'a share of games, never a chance of winning');
});

test('the call follows the prediction\'s own thresholds; a level matchup names nobody', () => {
  const nearLevel = MatchupCard.build(predict(['C1', 'C2'], ['D1', 'D2']), { typicalGames: 20 });
  const level = MatchupCard.build(MatchPrediction.build(['D1'], ['D2'], (n) => ratings[n]), { typicalGames: 20 });
  assert.strictEqual(predict(['C1', 'C2'], ['D1', 'D2']).confidence, 'level', 'a 0.2-point gap is level');
  assert.deepStrictEqual([level.call.kicker, level.call.names, level.call.favoured], ['Too close to call', '', null]);
  assert.strictEqual(nearLevel.call.kicker, 'Too close to call');
  const edge = MatchupCard.build(MatchPrediction.build(['X'], ['Y'], (n) => ({ X: 1410, Y: 1400 })[n]), { typicalGames: 20 });
  assert.strictEqual(edge.call.headline, 'Slight edge: X');
  assert.deepStrictEqual(MatchupCard.expectedGames(50, 25), { a: 12.5, b: 12.5, total: 25 });
  assert.strictEqual(MatchupCard.build(predict(['A1'], ['B1']), {}).games, null, 'no record of matches, no games line');
  assert.strictEqual(MatchupCard.summaryText(MatchupCard.build(predict(['A1', 'A2'], ['B1', 'B2']), { typicalGames: 25 })).split('\n')[0],
    '🎾 Predicted matchup: A1 & A2 vs B1 & B2');
});

// ---------- in the app ----------

const moreItems = () => [...document.querySelectorAll('#shellMoreSheet .shell-more-item')]
  .filter((b) => b.style.display !== 'none').map((b) => b.textContent.replace('›', '').replace('Choose player', '').trim());

maybe('More: Predict a Matchup first for an admin and absent for everyone else; Doughnuts next; no North vs South', async () => {
  const app = await H.open();
  try {
    const r = await app.run((fn) => {
      const items = new Function('return ' + fn)();
      isUnlocked = false;
      openMoreSheet(); const player = items(); closeMoreSheet();
      openPredictMatchup();
      const lockedOpen = !!document.querySelector('#predictModal.show');
      isUnlocked = true; adminRole = 'owner';
      openMoreSheet(); const admin = items();
      document.querySelector('#shellMoreSheet .shell-more-item[data-special="predict"]').click();
      const opened = !!document.querySelector('#predictModal.show') && !!document.getElementById('predA1');
      document.getElementById('predictModal').classList.remove('show');
      // Locked again: the item goes, and the tool will not open.
      isUnlocked = false;
      openMoreSheet(); const relocked = items(); closeMoreSheet();
      openPredictMatchup();
      return { player, admin, lockedOpen, opened, relocked, reopened: !!document.querySelector('#predictModal.show') };
    }, moreItems.toString());
    assert.deepStrictEqual(r.admin, ['Predict a Matchup', 'Doughnuts', 'Power Rating Guide', 'Insights / Call-Outs',
      'About Power Rankings', 'Data & Rankings', 'My Player', 'Admin / Manage']);
    assert.deepStrictEqual(r.player, ['Doughnuts', 'Power Rating Guide', 'Insights / Call-Outs',
      'About Power Rankings', 'Data & Rankings', 'My Player', 'Admin / Manage']);
    assert.strictEqual(r.lockedOpen, false, 'a player cannot open it by any route');
    assert.strictEqual(r.opened, true, 'an admin opens it from the top of More');
    assert.deepStrictEqual(r.relocked, r.player);
    assert.strictEqual(r.reopened, false);
    assert.deepStrictEqual(app.pageErrors, []);
  } finally { await app.close(); }
});

maybe('North vs South lives in Admin / Manage, behind the lock; Admin / Manage still works', async () => {
  const app = await H.open();
  try {
    const r = await app.run(() => {
      legacyTabBtn('manage').click(); renderManage();
      const locked = { ns: !!document.getElementById('openNorthSouthBtn'), text: document.getElementById('manageView').innerText };
      isUnlocked = true; adminRole = 'owner'; currentUserName = 'Shaun';
      renderManage();
      const sections = [...document.querySelectorAll('[data-acc-toggle]')].map((b) => b.textContent.replace('▾', '').trim());
      document.querySelector('[data-acc-toggle="northsouth"]').click();
      document.getElementById('openNorthSouthBtn').click();
      const ns = !!document.querySelector('#northSouthModal.show');
      document.getElementById('northSouthModal').classList.remove('show');
      document.querySelector('[data-acc-toggle="players"]').click();
      return { locked, sections, ns, players: document.querySelectorAll('.ptag-row').length, predict: !!document.getElementById('predA1') };
    });
    assert.strictEqual(r.locked.ns, false, 'nothing of it behind the lock screen');
    assert.doesNotMatch(r.locked.text, /North vs South|Predict a matchup/i);
    assert.ok(r.sections.includes('North vs South'));
    assert.ok(!r.sections.some((s) => /Predict/i.test(s)), 'Predict a Matchup has moved to More');
    assert.ok(r.sections.includes('Player tags') && r.sections.includes('Player of the Month'));
    assert.strictEqual(r.ns, true, 'it opens from Admin');
    assert.ok(r.players > 10, 'the rest of Admin / Manage works as before');
    assert.strictEqual(r.predict, false);
    assert.deepStrictEqual(app.pageErrors, []);
  } finally { await app.close(); }
});

maybe('two teams make a share-ready Matchup Card, on screen and as one picture', async () => {
  const app = await H.open({ viewport: { width: 390, height: 844 } });
  try {
    const r = await app.run(async () => {
      isUnlocked = true; adminRole = 'owner';
      openPredictMatchup();
      const set = (id, v) => { document.getElementById(id).value = v; };
      set('predA1', 'Rishi'); set('predA2', 'Erf'); set('predB1', 'KC'); set('predB2', 'Len');
      document.getElementById('predA1').dispatchEvent(new Event('input'));
      const card = document.getElementById('matchupCard');
      const pred = predictMatchup(['Rishi', 'Erf'], ['KC', 'Len']);
      const view = matchupCardFor(pred);
      const cv = CardPainter.matchup(view, {});
      return {
        teams: [...card.querySelectorAll('.mu-team')].map((t) => [...t.querySelectorAll('.mu-name')].map((e) => e.textContent)),
        call: card.querySelector('.mu-call').innerText.replace(/\s+/g, ' ').trim(),
        games: [...card.querySelectorAll('.mu-games-num')].map((e) => Number(e.textContent)),
        note: card.querySelector('.mu-games-note').textContent,
        share: [pred.shareA, pred.shareB], typical: typicalMatchGames(),
        medianByHand: (() => { const t = getAllApprovedMatches().filter((m) => !m.isDraw).map((m) => m.sets.reduce((s, x) => s + x[0] + x[1], 0)).sort((a, b) => a - b); return t.length % 2 ? t[(t.length - 1) / 2] : Math.round((t[t.length / 2 - 1] + t[t.length / 2]) / 2); })(),
        size: [cv.width, cv.height],
        // The median of decided matches -- not the mean, and never a draw.
        skewed: (() => {
          const real = getAllApprovedMatches;
          const m = (sets, isDraw) => ({ sets, isDraw: !!isDraw });
          getAllApprovedMatches = () => [m([[6, 0], [6, 0]]), m([[6, 1], [6, 0]]), m([[7, 6], [6, 7], [10, 8]]), m([[6, 6]], true), m([[6, 6], [6, 6], [6, 6], [6, 6]], true)];
          try { return typicalMatchGames(); } finally { getAllApprovedMatches = real; }
        })(),
        actions: [...document.querySelectorAll('.mu-actions button')].map((b) => b.textContent),
        upcoming: !!document.getElementById('predUpAdd'),
        width: document.querySelector('#predictModal .shell-more-panel').scrollWidth <= 390,
        text: card.innerText,
      };
    });
    assert.deepStrictEqual(r.teams, [['Rishi', 'Erf'], ['KC', 'Len']]);
    assert.match(r.call, /^PROJECTED FAVOURITES KC & Len$/i);
    assert.strictEqual(r.typical, r.medianByHand, 'the club\'s median decided match, in games');
    assert.deepStrictEqual(r.games, [Math.round(r.share[0] / 100 * r.typical * 10) / 10, Math.round((r.typical - Math.round(r.share[0] / 100 * r.typical * 10) / 10) * 10) / 10]);
    assert.strictEqual(r.note, `In a typical ${r.typical}-game match`);
    assert.strictEqual(r.skewed, 13, '12, 13 and 44 games: the typical match is 13, not the mean of 23');
    assert.deepStrictEqual(r.size, [1080, 1350]);
    assert.deepStrictEqual(r.actions, ['Share matchup', 'Copy image']);
    assert.strictEqual(r.upcoming, true, 'Add to Upcoming is still there');
    assert.ok(r.width, 'nothing runs off a phone');
    assert.doesNotMatch(r.text, /chance|probab|performance score|0\.80/i);
    assert.deepStrictEqual(app.pageErrors, []);
  } finally { await app.close(); }
});

maybe('Share matchup hands one picture to the share sheet; Copy image copies it, or the card as text where pictures cannot be copied', async () => {
  const app = await H.open();
  try {
    const r = await app.run(async () => {
      const until = async (f) => { for (let k = 0; k < 200 && !f(); k++) await new Promise((res) => setTimeout(res, 20)); };
      isUnlocked = true; adminRole = 'owner';
      openPredictMatchup();
      const set = (id, v) => { document.getElementById(id).value = v; };
      set('predA1', 'Rishi'); set('predA2', 'Erf'); set('predB1', 'KC'); set('predB2', 'Len');
      document.getElementById('predA1').dispatchEvent(new Event('input'));
      document.getElementById('predUpPlace').value = 'Court 2';   // typed below: must survive a share
      const calls = [];
      const realShare = CardPainter.share;
      CardPainter.share = async (files, meta) => { calls.push({ files: files.map((f) => ({ name: f.name, type: f.type, size: f.size })), meta }); return calls.length === 1 ? 'ready' : 'shared'; };
      const out = {};
      try {
        document.getElementById('predShare').click(); await until(() => calls.length === 1); await until(() => document.getElementById('predShare').textContent === 'Tap to share');
        out.label = document.getElementById('predShare').textContent;
        document.getElementById('predShare').click(); await until(() => calls.length === 2); await until(() => /Shared/.test(document.getElementById('predShareMessage').textContent));
        out.shared = document.getElementById('predShareMessage').textContent;
        out.place = document.getElementById('predUpPlace').value;
        // Copy image, where the clipboard takes pictures.
        const written = [];
        const realClip = navigator.clipboard;
        Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { write: async (items) => { for (const it of items) written.push({ types: it.types, blob: await it.getType('image/png') }); }, writeText: async () => {} } });
        document.getElementById('predCopy').click(); await until(() => /Image copied/.test(document.getElementById('predShareMessage').textContent));
        out.copied = written.map((w) => ({ types: w.types, type: w.blob.type, size: w.blob.size }));
        out.copyMsg = document.getElementById('predShareMessage').textContent;
        // …and where it does not: the card as text.
        const texts = [];
        const realItem = window.ClipboardItem;
        window.ClipboardItem = undefined;
        Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async (t) => { texts.push(t); } } });
        document.getElementById('predCopy').click(); await until(() => texts.length);
        await until(() => /copied as text/.test(document.getElementById('predShareMessage').textContent));
        out.text = texts[0]; out.textMsg = document.getElementById('predShareMessage').textContent;
        window.ClipboardItem = realItem;
        Object.defineProperty(navigator, 'clipboard', { configurable: true, value: realClip });
      } finally { CardPainter.share = realShare; }
      out.calls = calls;
      return out;
    });
    assert.strictEqual(r.calls.length, 2);
    assert.strictEqual(r.calls[0].files.length, 1);
    assert.strictEqual(r.calls[0].files[0].type, 'image/png');
    assert.ok(r.calls[0].files[0].size > 20000, 'a real picture');
    assert.strictEqual(r.calls[0].files[0].name, 'money-padel-matchup-Rishi-Erf-vs-KC-Len.png');
    assert.match(r.calls[0].meta.text, /^🎾 Predicted matchup: Rishi & Erf vs KC & Len\nProjected favourites: KC & Len\nExpected games: /);
    assert.strictEqual(r.label, 'Tap to share', 'a share sheet that needs a fresh tap gets one');
    assert.deepStrictEqual(r.calls[1].files, r.calls[0].files, 'the tap shares the picture already made');
    assert.strictEqual(r.shared, 'Shared.');
    assert.strictEqual(r.place, 'Court 2', 'sharing does not wipe what was typed below');
    assert.strictEqual(r.copied.length, 1);
    assert.deepStrictEqual(r.copied[0].types, ['image/png']);
    assert.ok(r.copied[0].size > 20000);
    assert.match(r.copyMsg, /Image copied/);
    assert.match(r.text, /^🎾 Predicted matchup: Rishi & Erf vs KC & Len/);
    assert.match(r.textMsg, /copied as text/);
    assert.deepStrictEqual(app.pageErrors, []);
  } finally { await app.close(); }
});
