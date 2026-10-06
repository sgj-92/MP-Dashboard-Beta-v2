// ===================== EDITING A GAME KEEPS YOUR PLACE =====================
// Editing a game on the Games tab used to throw the reader to the bottom of
// the tab: the edit form was appended after the whole list and scrolled to
// (scrollIntoView, smooth), and when Save or Cancel redrew the list without it
// the page stayed at its old offset, clamped to the new, shorter bottom. These
// pin the fix at phone width: the form opens inside the game's own card, the
// card keeps its place on screen, and closing the editor -- Cancel, Save, or a
// confirmed correction -- returns the reader to where they opened it, however
// far down the form they scrolled to reach its buttons.

const test = require('node:test');
const assert = require('node:assert');
const H = require('./helpers/uiHarness.js');

const maybe = H.available() ? test : test.skip;
const PHONE = { width: 390, height: 844 };

async function openGames(extra) {
  const app = await H.open({ viewport: PHONE, ...(extra || {}) });
  await app.run(() => {
    isUnlocked = true; adminRole = 'owner'; currentUserName = 'Shaun';
    document.querySelector('#tabrow .tab-btn[data-tab="games"]').click();
    selectedMonth = 'all'; renderGamesTab();
    const yn = document.getElementById('gamesYourName'); if (yn) yn.value = 'Shaun';
  });
  return app;
}

// Where things are on screen: the page offset, the game's card and the form.
const where = (app, id) => app.run((id) => {
  const card = [...document.querySelectorAll('#gamesView [data-game-card]')].find((e) => e.dataset.gameCard === id);
  const form = document.getElementById('editFormAnchor');
  return {
    y: Math.round(window.scrollY),
    card: card ? Math.round(card.getBoundingClientRect().top) : null,
    form: form ? Math.round(form.getBoundingClientRect().top) : null,
    formInCard: !!(form && card && card.contains(form)),
    vh: window.innerHeight,
  };
}, id);

// Scrolls so the game's card sits `at` pixels from the top of the screen.
const putCardAt = (app, id, at) => app.run(([id, at]) => {
  const card = [...document.querySelectorAll('#gamesView [data-game-card]')].find((e) => e.dataset.gameCard === id);
  window.scrollTo(0, card.getBoundingClientRect().top + window.scrollY - at);
}, [id, at]);

const ratedGameId = (app, n) => app.run((n) => {
  const cards = [...document.querySelectorAll('#gamesView [data-game-card]')].filter((e) => e.querySelector('[data-manage]'));
  return cards[n].dataset.gameCard;
}, n);

// One set score nudged, staying a valid win for Team A.
async function nudgeFirstSet(page) {
  const a = page.locator('#edSets .ed-set-input[data-idx="0"][data-side="0"]');
  const b = page.locator('#edSets .ed-set-input[data-idx="0"][data-side="1"]');
  const [x, y] = [Number(await a.inputValue()), Number(await b.inputValue())];
  if (y > 0) { await b.fill(String(y - 1)); return [x, y - 1]; }
  await a.fill(String(x + 1)); return [x + 1, y];
}

maybe('the edit form opens inside the game card, and the card does not move', async () => {
  const app = await openGames();
  try {
    const id = await ratedGameId(app, 12);
    await putCardAt(app, id, 150);
    await app.page.click(`[data-manage="${id}"]`);
    const before = await where(app, id);
    assert.strictEqual(before.card, 150);
    await app.page.click(`#gamesView [data-edit="${id}"]`);
    const open = await where(app, id);
    assert.ok(open.formInCard, 'the form must open inside the game being edited, not after the list');
    assert.strictEqual(open.card, before.card, 'opening the editor moved the game on screen');
    assert.strictEqual(open.y, before.y, 'opening the editor scrolled the page');
    assert.ok(open.form > open.card && open.form < open.vh, `the form must start on screen, at ${open.form}`);
    // Nothing is appended after the list any more.
    const last = await app.run(() => {
      const cards = document.querySelectorAll('#gamesView [data-game-card]');
      return cards[cards.length - 1].dataset.gameCard;
    });
    assert.notStrictEqual(last, null);
    assert.strictEqual(await app.run(() => document.querySelectorAll('#editFormAnchor').length), 1);
    assert.deepStrictEqual(app.pageErrors, []);
  } finally { await app.close(); }
});

maybe('a game low on the screen is brought up so the form is usable, never to the bottom of the tab', async () => {
  const app = await openGames();
  try {
    const id = await ratedGameId(app, 12);
    await putCardAt(app, id, 600);
    await app.page.click(`[data-manage="${id}"]`);
    await app.page.click(`#gamesView [data-edit="${id}"]`);
    const open = await where(app, id);
    assert.ok(open.formInCard);
    assert.ok(open.card >= 0 && open.card <= 200, `the game should sit near the top, under the header, at ${open.card}`);
    assert.ok(open.form < open.vh * 0.6, `the form should start in reach, at ${open.form}`);
    const bottom = await app.run(() => document.documentElement.scrollHeight - window.innerHeight);
    assert.ok(open.y < bottom - 200, 'opening the editor went to the bottom of the tab');
  } finally { await app.close(); }
});

maybe('Cancel returns exactly to where the editor was opened, even after scrolling down to the buttons', async () => {
  const app = await openGames();
  try {
    const id = await ratedGameId(app, 12);
    for (const at of [150, 600]) {
      await app.run(() => { managingGameId = null; editingMatchId = null; renderGamesTab(); });
      await putCardAt(app, id, at);
      await app.page.click(`[data-manage="${id}"]`);
      const start = await where(app, id);
      await app.page.click(`#gamesView [data-edit="${id}"]`);
      await app.page.evaluate(() => window.scrollBy(0, 300));     // down to Save / Cancel
      await app.page.click('#edCancel');
      const back = await where(app, id);
      assert.strictEqual(back.form, null, 'Cancel must close the editor');
      assert.strictEqual(back.card, start.card, `card started at ${start.card}, came back at ${back.card}`);
      assert.strictEqual(back.y, start.y);
    }
    assert.strictEqual(await app.run(() => window.__writes.length), 0, 'Cancel wrote something');
    assert.deepStrictEqual(app.pageErrors, []);
  } finally { await app.close(); }
});

maybe('Close on the card being edited closes the editor and returns, as Cancel does', async () => {
  const app = await openGames();
  try {
    const id = await ratedGameId(app, 12);
    await putCardAt(app, id, 300);
    await app.page.click(`[data-manage="${id}"]`);
    const start = await where(app, id);
    await app.page.click(`#gamesView [data-edit="${id}"]`);
    await app.page.click(`[data-manage="${id}"]`);
    const back = await where(app, id);
    assert.strictEqual(back.form, null, 'Close must close the editor');
    assert.strictEqual(await app.run(() => editingMatchId), null);
    assert.strictEqual(back.card, start.card);
    assert.deepStrictEqual(app.pageErrors, []);
  } finally { await app.close(); }
});

maybe('Save that is refused keeps the editor open and the game where it is', async () => {
  const app = await openGames();
  try {
    const id = await ratedGameId(app, 8);
    await putCardAt(app, id, 200);
    await app.page.click(`[data-manage="${id}"]`);
    await app.page.click(`#gamesView [data-edit="${id}"]`);
    await app.page.fill('#edB1', '');
    await app.page.click('#edSubmit');
    const at = await where(app, id);
    const msg = await app.run(() => document.getElementById('edMessage').textContent);
    assert.match(msg, /Fill in all fields/);
    assert.ok(at.formInCard, 'a refusal must leave the form open');
    assert.ok(at.card !== null && at.form < at.vh, 'the message must be on screen');
  } finally { await app.close(); }
});

maybe('a rated correction is confirmed in the same card and returns the reader to where they started', async () => {
  const app = await openGames();
  try {
    const id = await ratedGameId(app, 10);
    await putCardAt(app, id, 180);
    await app.page.click(`[data-manage="${id}"]`);
    const start = await where(app, id);
    await app.page.click(`#gamesView [data-edit="${id}"]`);
    const sets = await nudgeFirstSet(app.page);
    await app.page.click('#edSubmit');
    await app.page.waitForSelector('#matchFixCommitBtn');
    const staged = await app.run((id) => {
      const card = [...document.querySelectorAll('#gamesView [data-game-card]')].find((e) => e.dataset.gameCard === id);
      return { inCard: !!(card && card.querySelector('#matchFixCommitBtn')), writes: window.__writes.length };
    }, id);
    assert.ok(staged.inCard, 'the confirmation must sit in the game being corrected');
    assert.strictEqual(staged.writes, 0, 'staging wrote something');
    await app.page.click('#matchFixCommitBtn');
    await app.page.waitForFunction(() => !matchFixBusy && !matchFixPlan && !editingMatchId);
    const back = await where(app, id);
    const fixed = await app.run((id) => findMatchById(id).sets[0], id);
    assert.deepStrictEqual(fixed, sets, 'the correction was not applied');
    assert.strictEqual(back.form, null);
    assert.strictEqual(back.card, start.card, `card started at ${start.card}, came back at ${back.card}`);
    assert.deepStrictEqual(app.pageErrors, []);
  } finally { await app.close(); }
});

maybe('saving a pending submission updates it and keeps the reader in place', async () => {
  const app = await openGames();
  try {
    const id = 'subEdit1';
    await app.run((id) => {
      extraMatchesState.push({ id, date: '2026-09-18', winners: ['Shaun', 'Tom'], losers: ['Max', 'KC'], sets: [[6, 3], [6, 4]],
        type: 'doubles', note: '', status: 'pending', submittedBy: 'Tester', submittedAt: '2026-09-18T10:00:00.000Z' });
      recomputeAll(); renderGamesTab();
    }, id);
    await putCardAt(app, id, 220);
    const start = await where(app, id);
    await app.page.click(`#gamesView [data-edit="${id}"]`);
    const open = await where(app, id);
    assert.ok(open.formInCard, 'the form must open inside the submission');
    assert.strictEqual(open.card, start.card);
    await app.page.fill('#edSets .ed-set-input[data-idx="1"][data-side="1"]', '2');
    await app.page.click('#edSubmit');
    await app.page.waitForFunction(() => !editingMatchId);
    const back = await where(app, id);
    const r = await app.run((id) => ({
      sets: extraMatchesState.find((m) => m.id === id).sets,
      shown: [...document.querySelectorAll('#gamesView [data-game-card]')].find((e) => e.dataset.gameCard === id).textContent,
    }), id);
    assert.deepStrictEqual(r.sets, [[6, 3], [6, 2]]);
    assert.match(r.shown, /6-3, 6-2/, 'the card must show the saved score');
    assert.strictEqual(back.form, null);
    assert.strictEqual(back.card, start.card, `card started at ${start.card}, came back at ${back.card}`);
    assert.deepStrictEqual(app.pageErrors, []);
  } finally { await app.close(); }
});

maybe('editing from a profile lands on the game with its form open', async () => {
  const app = await openGames();
  try {
    const id = await ratedGameId(app, 15);
    await app.run(() => { document.querySelector('#tabrow .tab-btn[data-tab="players"]').click(); window.scrollTo(0, 0); });
    await app.run((id) => navigateToGamesTabForEdit(id), id);
    const at = await where(app, id);
    assert.ok(at.formInCard);
    assert.ok(at.card >= 0 && at.card <= 200, `the game should be at the top of the screen, at ${at.card}`);
    assert.ok(at.form < at.vh);
    assert.deepStrictEqual(app.pageErrors, []);
  } finally { await app.close(); }
});
