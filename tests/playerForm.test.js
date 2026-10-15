// ===================== PLAYER FORM: DRAWS COUNT =====================
// Shaun, 15 Oct (Jams): the profile's form read "W W L W L L L L L L" and
// "3–7 · Last 10" while Recent Results, on the same profile, showed three
// draws in those games. The form was built from MATCHES -- the rating's
// win/loss set, which leaves draws out -- so each draw was skipped and an
// older game slid into the ten. The Win Rate came from the same set (3–7, 30%).
//
// Now one module (domain/matches/playerForm.js) answers every surface, from
// the full list of rated games, with MatchOutcome deciding each result.

const test = require('node:test');
const assert = require('node:assert');
const H = require('./helpers/uiHarness.js');
const PF = require('../assets/js/domain/matches/playerForm.js');
const MO = require('../assets/js/matchOutcome.js');

const maybe = H.available() ? test : test.skip;

// Jams's own sequence, as stored on 15 Oct (oldest first): 13 games -- three
// wins, three draws, seven losses -- with two games on 8 Oct.
let n = 0;
const g = (date, result, seq) => {
  n++;
  const me = ['Jams', 'P' + n], them = ['Q' + n, 'R' + n];
  const m = { id: `${date}-${seq || 1}`, date, sets: [[6, 4]], performance_residual: 0.1 };
  if (result === 'W') return { ...m, winners: me, losers: them };
  if (result === 'L') return { ...m, winners: them, losers: me };
  return { ...m, winners: n % 2 ? me : them, losers: n % 2 ? them : me, isDraw: true };
};
const JAMS = [
  g('2026-07-13', 'W'), g('2026-08-02', 'W'), g('2026-08-04', 'L'), g('2026-08-05', 'W'),
  g('2026-08-19', 'L'), g('2026-09-14', 'D'), g('2026-09-16', 'L', 1), g('2026-09-16', 'L', 2),
  g('2026-09-23', 'L'), g('2026-10-07', 'D'), g('2026-10-08', 'L', 1), g('2026-10-08', 'D', 2),
  g('2026-10-12', 'L'),
];
// The old reading: decided games only, newest ten.
const decidedOnly = JAMS.filter((m) => !m.isDraw);

test('Jams: the last ten are his last ten games, draws included -- 1W 3D 6L, not 3–7', () => {
  const r = PF.recent(JAMS, 'Jams');
  assert.strictEqual(r.played, 10);
  assert.deepStrictEqual([r.wins, r.draws, r.losses], [1, 3, 6]);
  // Newest first, as Recent Results lists them; same-date games by sequence.
  assert.deepStrictEqual(r.results.join(' '), 'L D L D L L L D L W');
  // The strip is drawn oldest -> newest, ending on the latest game.
  assert.deepStrictEqual(r.run.join(' '), 'W L D L L L D L D L');
  assert.strictEqual(r.games[r.games.length - 1].date, '2026-08-05', 'no older game is pulled in');
  assert.strictEqual(PF.recordText(r), '1W · 3D · 6L');
  // What the old reading made of it.
  const old = PF.recent(decidedOnly, 'Jams');
  assert.deepStrictEqual([old.wins, old.losses, old.played], [3, 7, 10], 'the bug, reproduced: draws skipped');
});

test('Jams: the whole record and win rate count the draws -- 3W 3D 7L, 23.1% -- not 3–7, 30%', () => {
  const rec = PF.record(JAMS, 'Jams');
  assert.deepStrictEqual(rec, { played: 13, wins: 3, draws: 3, losses: 7, winpct: 23.1 });
  assert.strictEqual(PF.record(decidedOnly, 'Jams').winpct, 30, 'the old 30% was 3 of 10 decided games');
});

test('every result is MatchOutcome\'s: a draw is a draw whichever side it was filed on', () => {
  JAMS.forEach((m) => {
    const r = PF.recent([m], 'Jams');
    assert.strictEqual(r.results[0], MO.letterFor(m, 'Jams'));
  });
  const filedAsWinner = { id: '2026-10-01-1', date: '2026-10-01', winners: ['Jams', 'X'], losers: ['Y', 'Z'], isDraw: true, sets: [[6, 6]] };
  const filedAsLoser = { ...filedAsWinner, winners: ['Y', 'Z'], losers: ['Jams', 'X'] };
  assert.deepStrictEqual(PF.recent([filedAsWinner], 'Jams').results, ['D']);
  assert.deepStrictEqual(PF.recent([filedAsLoser], 'Jams').results, ['D']);
});

test('same-date games keep the record\'s order, so the strip and Recent Results agree', () => {
  const day = ['2026-10-08-3', '2026-10-08-1', '2026-10-08-2'].map((id) => ({ id, date: '2026-10-08', winners: ['A'], losers: ['B'], sets: [] }));
  assert.deepStrictEqual(PF.newestFirst(day).map((m) => m.id), ['2026-10-08-3', '2026-10-08-2', '2026-10-08-1']);
  // Stable whatever order they arrive in.
  assert.deepStrictEqual(PF.newestFirst(day.slice().reverse()).map((m) => m.id), ['2026-10-08-3', '2026-10-08-2', '2026-10-08-1']);
});

test('a player with no draws reads exactly as before; fewer than ten games are shown as they are', () => {
  const r = PF.recent(decidedOnly, 'Jams');
  assert.strictEqual(PF.recordShort(r), '3W-7L', 'no draws: the familiar W-L');
  assert.strictEqual(PF.recordShort(PF.recent(JAMS, 'Jams')), '1W-3D-6L');
  const short = PF.recent(JAMS.slice(0, 4), 'Jams');
  assert.strictEqual(short.played, 4);
  assert.strictEqual(PF.recent([], 'Jams'), null);
  assert.deepStrictEqual(PF.record([], 'Jams'), { played: 0, wins: 0, draws: 0, losses: 0, winpct: 0 });
});

test('vs expectation over the same ten: the stored residual is the first-listed side\'s, negated for the other', () => {
  const ms = [
    { id: 'a-1', date: '2026-10-01', winners: ['Jams'], losers: ['B'], performance_residual: 0.2 },
    { id: 'a-2', date: '2026-10-02', winners: ['B'], losers: ['Jams'], performance_residual: 0.1 },
    { id: 'a-3', date: '2026-10-03', winners: ['B'], losers: ['Jams'], isDraw: true, performance_residual: 0.05 },
  ];
  // (+0.2 - 0.1 - 0.05) / 3 = 0.0167 -> 1.7%
  assert.strictEqual(PF.recent(ms, 'Jams').avgPct, 1.7);
});

// ---- In the app ------------------------------------------------------------------

async function profileOf(app, name) {
  return app.run((name) => {
    openSheet(name);
    const p = PLAYERS.find((x) => x.name === name);
    const letters = [...document.querySelectorAll('.pp-form-letter')];
    const css = (cls) => { const el = letters.find((e) => e.classList.contains(cls)); return el ? getComputedStyle(el).backgroundColor : null; };
    return {
      form: letters.map((e) => e.textContent),
      classes: letters.map((e) => e.className.replace('pp-form-letter', '').trim()),
      record: document.querySelector('.pp-form-record').textContent,
      hero: document.querySelector('.pp-hero-sub').textContent,
      recent: [...document.querySelectorAll('#ppMatchesHost .pp-match-result')].map((e) => e.textContent[0]),
      colours: { w: css('w'), d: css('d'), l: css('l') },
      p: { wins: p.wins, draws: p.draws, losses: p.losses },
    };
  }, name);
}

maybe('profile: the form strip, its record, Recent Results and the Win Rate all agree -- with draws', async () => {
  const app = await H.open({ viewport: { width: 390, height: 844 } });
  try {
    const withDraws = await app.run(() => PLAYERS.filter((p) => p.draws >= 2 && p.wins + p.draws + p.losses >= 10).map((p) => p.name));
    assert.ok(withDraws.length, 'the fixture has a player with several draws');
    for (const name of withDraws) {
      const r = await profileOf(app, name);
      assert.deepStrictEqual(r.form, r.recent.slice(0, 10).reverse(), `${name}: the strip is Recent Results' first ten, oldest to newest`);
      const c = (l) => r.form.filter((x) => x === l).length;
      assert.strictEqual(r.record, `${c('W')}W · ${c('D')}D · ${c('L')}L · Last ${r.form.length}`);
      assert.deepStrictEqual(r.classes, r.form.map((l) => l.toLowerCase()), 'each letter wears its own outcome');
      const played = r.p.wins + r.p.draws + r.p.losses;
      assert.strictEqual(played, r.recent.length, 'the record adds up to the games listed');
      assert.ok(r.hero.includes(`${r.p.wins}W · ${r.p.draws}D · ${r.p.losses}L · ${Math.round(1000 * r.p.wins / played) / 10}% Win Rate`), `${name}: ${r.hero}`);
    }
    // A draw has its own colour, neither the win's nor the loss's.
    const any = await profileOf(app, withDraws[0]);
    if (any.colours.d) {
      assert.notStrictEqual(any.colours.d, any.colours.w);
      assert.notStrictEqual(any.colours.d, any.colours.l);
    }
    assert.deepStrictEqual(app.pageErrors, []);
  } finally { await app.close(); }
});

maybe('profile: players without draws, and with fewer than ten games, still reconcile', async () => {
  const app = await H.open();
  try {
    const names = await app.run(() => [
      PLAYERS.find((p) => !p.draws && p.wins + p.losses >= 10),
      PLAYERS.find((p) => p.draws === 1),
      PLAYERS.find((p) => p.wins + p.draws + p.losses < 10 && p.wins + p.draws + p.losses >= 1),
    ].filter(Boolean).map((p) => p.name));
    assert.strictEqual(names.length, 3);
    for (const name of names) {
      const r = await profileOf(app, name);
      assert.deepStrictEqual(r.form, r.recent.slice(0, 10).reverse(), name);
      assert.strictEqual(r.form.length, Math.min(10, r.recent.length), `${name}: never padded`);
    }
    const noDraws = await profileOf(app, names[0]);
    assert.ok(!noDraws.form.includes('D'));
    assert.match(noDraws.record, / · 0D · /);
    assert.deepStrictEqual(app.pageErrors, []);
  } finally { await app.close(); }
});

maybe('Home\'s form dots are the same ten games, draws in their own colour', async () => {
  const app = await H.open();
  try {
    const r = await app.run(() => {
      const p = PLAYERS.find((x) => x.draws >= 1 && x.wins + x.draws + x.losses >= 3);
      const seq = computeRecentFormSequence(p.name, 10);
      const form = computeRecentForm(p.name, 10);
      return { seq, form: { w: form.wins, d: form.draws, l: form.losses, games: form.games }, run: form.run,
        dot: (() => { const el = document.createElement('span'); el.className = 'form-dot d'; document.body.appendChild(el);
          const c = getComputedStyle(el).backgroundColor; el.remove(); return c; })() };
    });
    assert.deepStrictEqual(r.seq, r.run);
    assert.strictEqual(r.form.w + r.form.d + r.form.l, r.form.games);
    assert.ok(r.seq.includes('D'), 'the draw is in the strip');
    assert.notStrictEqual(r.dot, 'rgba(0, 0, 0, 0)');
    assert.deepStrictEqual(app.pageErrors, []);
  } finally { await app.close(); }
});
