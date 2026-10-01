// ===================== PLAYER MONTHLY PACK: THE MODEL =====================
// domain/playerPack/playerMonth.js -- one player's month from their side.

const test = require('node:test');
const assert = require('node:assert');
const PM = require('../assets/js/domain/playerPack/playerMonth.js');

// Tiers by date: Tom is B until 15 Sep, then A.
const TIERS = { Shaun: 'B', Rishi: 'B', Kaz: 'A', Len: 'A', Eli: 'A', Jords: 'B', Fee: 'C', PDM: 'B' };
const tierOf = (n, d) => (n === 'Tom' ? (d >= '2026-09-15' ? 'A' : 'B') : TIERS[n] || null);
const M = (id, date, winners, losers, sets, isDraw) => ({ id, date, winners, losers, sets, isDraw: !!isDraw, sourceIndex: 1 });

const MATCHES = [
  M('m1', '2026-09-02', ['Shaun', 'Rishi'], ['Kaz', 'Jords'], [[6, 3], [6, 4]]),      // W  BB vs AB
  M('m2', '2026-09-05', ['Kaz', 'Len'], ['Shaun', 'Rishi'], [[6, 2], [6, 1]]),        // L  BB vs AA
  M('m3', '2026-09-08', ['Shaun', 'Tom'], ['Rishi', 'Jords'], [[6, 4], [3, 6], [6, 4]]), // W  BB vs BB (Tom still B)
  M('m4', '2026-09-20', ['Rishi', 'Jords'], ['Shaun', 'Tom'], [[6, 4], [7, 5]]),      // L  AB vs BB (partner Tom now A)
  M('m5', '2026-09-22', ['Shaun', 'Rishi'], ['Tom', 'Eli'], [[5, 5]], true),          // D  BB vs AA
  M('m6', '2026-09-25', ['Shaun', 'Rishi'], ['Kaz', 'Jords'], [[6, 4], [6, 4]]),      // W  BB vs AB
  M('x1', '2026-09-26', ['Kaz', 'Len'], ['Eli', 'Jords'], [[6, 0], [6, 0]]),          // not Shaun's
  M('x2', '2026-08-30', ['Shaun', 'Rishi'], ['Kaz', 'Len'], [[6, 0], [6, 0]]),        // August
];
const FACTS = { m1: { ratingDelta: 6.2, residual: 0.11 }, m2: { ratingDelta: -4.1, residual: -0.05 }, m3: { ratingDelta: 2.0, residual: 0.03 },
  m4: { ratingDelta: -7.5, residual: -0.12 }, m5: { ratingDelta: 1.1, residual: 0.02 }, m6: { ratingDelta: 3.3, residual: 0.08 } };
const MERIT = { m1: { kind: 'hard', steps: 1, points: 4 }, m3: { kind: 'even', steps: 0, points: 3 }, m6: { kind: 'hard', steps: 1, points: 4 } };
const model = (player = 'Shaun') => PM.build({ player, month: '2026-09', matches: MATCHES, tierOf, factsOf: (id) => FACTS[id] || null, meritOf: (id) => MERIT[id] || null });

test('a team is labelled by its tiers, strongest first, whoever is named first', () => {
  assert.strictEqual(PM.teamLabel(['B', 'A']), 'AB');
  assert.strictEqual(PM.teamLabel(['A', 'B']), 'AB');
  assert.strictEqual(PM.teamLabel(['C', 'S']), 'SC');
  assert.strictEqual(PM.teamLabel(['B', null]), 'B?');
  assert.strictEqual(PM.teamLabel(['B']), 'B');
});

test('the matchup is from the chosen player\'s side: BB vs AB for one, AB vs BB for the other', () => {
  const m1 = MATCHES[0];
  assert.strictEqual(PM.side(m1, 'Shaun', tierOf).label, 'BB vs AB');
  assert.strictEqual(PM.side(m1, 'Kaz', tierOf).label, 'AB vs BB');
  assert.strictEqual(PM.side(m1, 'Jords', tierOf).label, 'AB vs BB');
  assert.deepStrictEqual([PM.side(m1, 'Kaz', tierOf).result, PM.side(m1, 'Kaz', tierOf).gf, PM.side(m1, 'Kaz', tierOf).ga], ['L', 7, 12]);
  assert.strictEqual(PM.side(m1, 'Fee', tierOf), null);
});

test('a mid-month tier change: each match uses the tier on its own date', () => {
  const g = model();
  assert.strictEqual(g.matches.find((m) => m.id === 'm3').label, 'BB vs BB', 'Tom was B on 8 Sep');
  assert.strictEqual(g.matches.find((m) => m.id === 'm4').label, 'AB vs BB', 'Tom was A on 20 Sep, playing with Shaun');
  assert.strictEqual(PM.side(MATCHES[3], 'Tom', tierOf).label, 'AB vs BB');
  assert.strictEqual(PM.side(MATCHES[3], 'Rishi', tierOf).label, 'BB vs AB');
  assert.strictEqual(PM.side(MATCHES[2], 'Tom', tierOf).label, 'BB vs BB');
});

test('only this player, only this month; the record reconciles', () => {
  const g = model();
  assert.deepStrictEqual(g.matches.map((m) => m.id), ['m1', 'm2', 'm3', 'm4', 'm5', 'm6']);
  assert.deepStrictEqual([g.record.played, g.record.wins, g.record.draws, g.record.losses], [6, 3, 1, 2]);
  assert.strictEqual(g.record.wins + g.record.draws + g.record.losses, g.record.played);
  assert.strictEqual(g.record.winpct, 50);
  assert.deepStrictEqual([g.record.gf, g.record.ga, g.record.gd], [12 + 3 + 15 + 9 + 5 + 12, 7 + 12 + 14 + 13 + 5 + 8, (12 + 3 + 15 + 9 + 5 + 12) - (7 + 12 + 14 + 13 + 5 + 8)]);
  // Every breakdown adds back up to the record.
  const sumOf = (list) => list.reduce((s, t) => s + t.played, 0);
  assert.strictEqual(sumOf(g.matchupTypes), g.record.played);
  assert.strictEqual(sumOf(g.partners), g.record.played, 'doubles: one partner a match');
  assert.strictEqual(sumOf(g.opponents), g.record.played * 2, 'two opponents a match');
});

test('matchup types, partners and opponents, with W-D-L and sample counts', () => {
  const g = model();
  const t = Object.fromEntries(g.matchupTypes.map((x) => [x.label, [x.played, x.wins, x.draws, x.losses]]));
  assert.deepStrictEqual(t, { 'BB vs AB': [2, 2, 0, 0], 'BB vs AA': [2, 0, 1, 1], 'BB vs BB': [1, 1, 0, 0], 'AB vs BB': [1, 0, 0, 1] });
  const p = Object.fromEntries(g.partners.map((x) => [x.name, [x.played, x.wins, x.draws, x.losses]]));
  assert.deepStrictEqual(p, { Rishi: [4, 2, 1, 1], Tom: [2, 1, 0, 1] });
  const o = Object.fromEntries(g.opponents.map((x) => [x.name, [x.played, x.wins, x.draws, x.losses]]));
  assert.deepStrictEqual(o.Kaz, [3, 2, 0, 1]);
  assert.deepStrictEqual(o.Jords, [4, 3, 0, 1]);
  assert.deepStrictEqual(o.Rishi, [2, 1, 0, 1]);
  assert.strictEqual(g.partners[0].name, 'Rishi', 'most-played first');
});

test('best results come from Merit\'s classification and the stored match facts', () => {
  const b = PM.bestResults(model());
  assert.strictEqual(b.hardestWin.id, 'm1', 'the first of two equally hard wins');
  assert.strictEqual(b.bestVsExpectation.id, 'm1');
  assert.strictEqual(b.biggestGain.id, 'm1');
  assert.strictEqual(b.bestShare.id, 'm1');
  assert.strictEqual(b.winRun, null, 'no run of two');
  const below = PM.bestResults(PM.build({ player: 'Shaun', month: '2026-09', matches: MATCHES, tierOf, factsOf: (id) => (FACTS[id] ? { ratingDelta: -1, residual: -Math.abs(FACTS[id].residual) } : null), meritOf: () => null }));
  assert.deepStrictEqual([below.bestVsExpectation, below.biggestGain, below.hardestWin], [null, null, null], 'nothing is called above expectation, a gain or a hard win when it was not');
});

test('weaker results need a sample: nothing is called weak on one match', () => {
  const g = model();
  const w2 = PM.weakerResults(g, { min: 2 });
  assert.strictEqual(w2.matchup.label, 'BB vs AA');
  assert.strictEqual(w2.biggestDrop.id, 'm4');
  assert.strictEqual(w2.opponent, null, 'no opponent with more losses than wins over 2+');
  const w3 = PM.weakerResults(g, { min: 3 });
  assert.strictEqual(w3.matchup, null, 'no matchup type has 3 matches');
});

test('targets: transparent rules with their reasons and samples, never a prediction', () => {
  const g = model();
  const all = PM.targets(g, { max: 10, currentTier: 'B', minRival: 2 });
  assert.deepStrictEqual(all.map((t) => t.kind), ['rematch', 'rematch', 'partner', 'evidence', 'evidence', 'tier']);
  assert.deepStrictEqual(all.filter((t) => t.kind === 'rematch').map((t) => [t.subject, t.sample, t.reason]), [
    ['Kaz', 3, '2W 0D 1L against Kaz this month, level on games over 3 matches.'],
    ['Rishi', 2, '1W 0D 1L against Rishi this month, 3 games between you over 2 matches.'],
  ]);
  assert.deepStrictEqual(all.find((t) => t.kind === 'partner'), { kind: 'partner', title: 'Another match with Rishi', subject: 'Rishi', sample: 4, reason: '2W 1D 1L together over 4 matches this month.' });
  const tier = all.find((t) => t.kind === 'tier');
  assert.strictEqual(tier.reason, '1 of 6 matches this month were all-Tier B.');
  assert.strictEqual(all.find((t) => t.kind === 'evidence').reason, 'Only 1 match in BB vs BB this month (1W 0D 0L).');
  all.forEach((t) => {
    assert.ok(t.reason && t.sample >= 1, t.title);
    assert.ok(!/beat|likely|favourite|favorite|probab|chance|should win|underdog|odds/i.test(t.title + ' ' + t.reason), `no prediction language: ${t.title} — ${t.reason}`);
  });
  assert.strictEqual(PM.targets(g, { max: 3, currentTier: 'B' }).length, 3, 'capped');
  assert.deepStrictEqual(PM.targets(g, { minRival: 5, max: 10 }).map((t) => t.kind), ['partner', 'evidence', 'evidence'], 'a higher rivalry minimum, and no tier rule without a tier');
});
