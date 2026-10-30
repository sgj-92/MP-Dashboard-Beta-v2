const test = require('node:test');
const assert = require('node:assert');
const Merit = require('../assets/js/meritTable.js');
const TierHistory = require('../assets/js/tierHistory.js');

// A fixed tier map, so these tests are about the scoring and nothing else.
const TIERS = { Sam: 'S', Sal: 'S', Ana: 'A', Amy: 'A', Aly: 'A', Abe: 'A',
  Ben: 'B', Bob: 'B', Bea: 'B', Cal: 'C', Cat: 'C' };
const flat = (name) => TIERS[name] || null;

const match = (winners, losers, extra) => Object.assign(
  { id: 'm1', date: '2026-09-10', winners, losers, isDraw: false }, extra || {});
const pointsFor = (winners, losers, extra) => Merit.scoreMatch(match(winners, losers, extra), flat).points;

// ---- the table of values the brief specifies -------------------------------

test('AA vs AA → 3', () => {
  assert.strictEqual(pointsFor(['Ana', 'Amy'], ['Aly', 'Abe']).Ana, 3);
});

test('AB vs AB → 3', () => {
  const p = pointsFor(['Ana', 'Ben'], ['Amy', 'Bob']);
  assert.strictEqual(p.Ana, 3);
  assert.strictEqual(p.Ben, 3, 'both teammates score alike');
  assert.strictEqual(p.Amy, 0);
});

test('AC vs BB → 3, because a pairing is a sum and not its best player', () => {
  const p = pointsFor(['Ana', 'Cal'], ['Ben', 'Bob']);
  assert.strictEqual(p.Ana, 3, 'A+C equals B+B');
  assert.strictEqual(p.Cal, 3);
  assert.strictEqual(p.Ben, 0);
  assert.strictEqual(pointsFor(['Ben', 'Bob'], ['Ana', 'Cal']).Ben, 3, 'and the other way round');
});

test('an even win is worth exactly a standard League win', () => {
  // The point of the 3-point baseline: the two tables share it, and Merit
  // departs from League points only because of fixture difficulty.
  const LEAGUE_WIN = 3;
  assert.strictEqual(Merit.BASELINE, LEAGUE_WIN);
  assert.strictEqual(pointsFor(['Ana', 'Ben'], ['Amy', 'Bob']).Ana, LEAGUE_WIN);
});

test('one tier-step: AB beats BB → 2, BB beats AB → 4', () => {
  assert.strictEqual(pointsFor(['Ana', 'Ben'], ['Bob', 'Bea']).Ana, 2);
  assert.strictEqual(pointsFor(['Bob', 'Bea'], ['Ana', 'Ben']).Bob, 4);
});

test('two tier-steps: AA beats BB → 1, BB beats AA → 5', () => {
  assert.strictEqual(pointsFor(['Ana', 'Amy'], ['Ben', 'Bob']).Ana, 1);
  assert.strictEqual(pointsFor(['Ben', 'Bob'], ['Ana', 'Amy']).Ben, 5);
});

test('three tier-steps: AA beats BC → 0, BC beats AA → 6', () => {
  assert.strictEqual(pointsFor(['Ana', 'Amy'], ['Ben', 'Cal']).Ana, 0,
    'beating a much weaker pairing can be worth nothing');
  assert.strictEqual(pointsFor(['Ben', 'Cal'], ['Ana', 'Amy']).Ben, 6);
});

test('a win is floored at nothing and never goes negative', () => {
  // Four steps: SS (8) over CC (2) is six steps; SA (7) over BB (4) is three.
  // SS over BB is four.
  const fourStep = pointsFor(['Sam', 'Sal'], ['Ben', 'Bob']);
  assert.strictEqual(fourStep.Sam, 0, 'a four-step favourite win is 0, not -1');
  const sixStep = pointsFor(['Sam', 'Sal'], ['Cal', 'Cat']);
  assert.strictEqual(sixStep.Sam, 0, 'and a six-step one is still 0, not -3');
  assert.strictEqual(Merit.MIN_WIN_POINTS, 0);
  // The underdog side is deliberately NOT capped.
  assert.strictEqual(pointsFor(['Cal', 'Cat'], ['Sam', 'Sal']).Cal, 9, 'six steps the other way is 3 + 6');
});

test('a draw is worth nothing, whatever the matchup', () => {
  // These ended early through injury or time, not as competitive draws.
  const even = Merit.scoreMatch(match(['Ana', 'Amy'], ['Ben', 'Bob'], { isDraw: true }), flat);
  assert.deepStrictEqual(even.points, { Ana: 0, Amy: 0, Ben: 0, Bob: 0 });
  assert.strictEqual(even.steps, 2, 'even though this one was a two-step mismatch');
  assert.strictEqual(Merit.DRAW_POINTS, 0);
});

test('a loss is worth nothing', () => {
  const p = pointsFor(['Ana', 'Amy'], ['Ben', 'Bob']);
  assert.strictEqual(p.Ben, 0);
  assert.strictEqual(p.Bob, 0);
});

test('points are always whole numbers', () => {
  [[['Ana', 'Amy'], ['Ben', 'Bob']], [['Ben', 'Cal'], ['Ana', 'Amy']], [['Ana', 'Cal'], ['Ben', 'Bob']]]
    .forEach(([w, l]) => Object.values(pointsFor(w, l))
      .forEach((v) => assert.strictEqual(v, Math.trunc(v), `${v} must be an integer`)));
});

// ---- invariants ------------------------------------------------------------

test('both winning teammates always receive the same points', () => {
  [[['Ana', 'Cal'], ['Ben', 'Bob']], [['Ben', 'Bob'], ['Ana', 'Amy']], [['Ana', 'Ben'], ['Bob', 'Cat']]]
    .forEach(([w, l]) => {
      const p = pointsFor(w, l);
      assert.strictEqual(p[w[0]], p[w[1]], `${w.join(' & ')} must score alike`);
    });
});

test('reversing the sides or the players changes nothing', () => {
  const base = pointsFor(['Ana', 'Ben'], ['Bob', 'Cal']);
  const playersSwapped = pointsFor(['Ben', 'Ana'], ['Cal', 'Bob']);
  assert.deepStrictEqual(playersSwapped, base, 'player order within a partnership is irrelevant');
  // The same fixture with the result the other way round is the mirror value.
  const otherWay = pointsFor(['Bob', 'Cal'], ['Ana', 'Ben']);
  assert.strictEqual(base.Ana + otherWay.Bob, Merit.BASELINE * 2,
    'favourite win and underdog win are symmetric about the baseline');
  assert.strictEqual(Merit.BASELINE, 3, 'and the baseline is a standard League win');
});

test('it is the sum of the pairing, never its best player', () => {
  // Both sides contain an A, but the sums differ by one step.
  const p = pointsFor(['Ana', 'Ben'], ['Amy', 'Cal']);
  assert.strictEqual(p.Ana, 2, 'AB over AC is a one-step favourite win');
  // Both sides contain a C, and the sums are equal.
  assert.strictEqual(pointsFor(['Ana', 'Cal'], ['Ben', 'Bob']).Ana, 3);
});

test('an unknown tier is reported rather than guessed', () => {
  const s = Merit.scoreMatch(match(['Ana', 'Ghost'], ['Ben', 'Bob']), flat);
  assert.strictEqual(s.unresolved, true);
  assert.deepStrictEqual(s.winnerTiers, ['A', null]);
  const built = Merit.build([match(['Ana', 'Ghost'], ['Ben', 'Bob'])], flat);
  assert.strictEqual(built.table.length, 0, 'nobody is credited from a match that cannot be scored');
  assert.strictEqual(built.unresolved.length, 1);
});

test('strength is a plain sum, and a missing tier poisons it', () => {
  assert.strictEqual(Merit.strengthOf(['A', 'C']), 4);
  assert.strictEqual(Merit.strengthOf(['B', 'B']), 4);
  assert.strictEqual(Merit.strengthOf(['S', 'S']), 8);
  assert.strictEqual(Merit.strengthOf(['A', null]), null);
  assert.strictEqual(Merit.strengthOf([]), null);
});

// ---- historical tiers ------------------------------------------------------

// Rishi's real September: B until the 20th, A from the 20th.
const history = () => TierHistory.create({
  currentTiers: { Rishi: 'A', Ana: 'A', Amy: 'A', Ben: 'B', Bob: 'B' },
  changes: [{ playerId: 'Rishi', effectiveDate: '2026-09-20', fromTier: 'B', toTier: 'A',
    eventType: 'PROMOTION', reasonCode: null }],
});

test('a match uses the tier the player held on the day, not today\'s', () => {
  const tierAt = history().tierAsOf;
  // Before the change Rishi is a B, so Rishi & Ben (BB) beating Ana & Amy (AA)
  // is a two-step underdog win.
  const before = Merit.scoreMatch(
    { id: 'a', date: '2026-09-13', winners: ['Rishi', 'Ben'], losers: ['Ana', 'Amy'], isDraw: false }, tierAt);
  assert.strictEqual(before.winnerTiers[0], 'B');
  assert.strictEqual(before.points.Rishi, 5, 'BB over AA is worth 5');

  // The same fixture after the change is AB over AA — one step, favourite the
  // other way, so an underdog win worth 5.
  const after = Merit.scoreMatch(
    { id: 'b', date: '2026-09-21', winners: ['Rishi', 'Ben'], losers: ['Ana', 'Amy'], isDraw: false }, tierAt);
  assert.strictEqual(after.winnerTiers[0], 'A');
  assert.strictEqual(after.points.Rishi, 4, 'AB over AA is worth 4');
});

test('a reassessment changes Merit only from its effective date', () => {
  const tierAt = history().tierAsOf;
  const onTheDay = Merit.scoreMatch(
    { id: 'c', date: '2026-09-20', winners: ['Rishi', 'Ben'], losers: ['Ana', 'Amy'], isDraw: false }, tierAt);
  assert.strictEqual(onTheDay.winnerTiers[0], 'A', 'the effective date itself counts as the new tier');
  const dayBefore = Merit.scoreMatch(
    { id: 'd', date: '2026-09-19', winners: ['Rishi', 'Ben'], losers: ['Ana', 'Amy'], isDraw: false }, tierAt);
  assert.strictEqual(dayBefore.winnerTiers[0], 'B', 'the day before does not');
});

test('a mid-month mover appears in both tier sections, holding only what each earned', () => {
  const tierAt = history().tierAsOf;
  const matches = [
    { id: '1', date: '2026-09-13', winners: ['Rishi', 'Ben'], losers: ['Ana', 'Amy'], isDraw: false }, // as a B: 5
    { id: '2', date: '2026-09-21', winners: ['Rishi', 'Ben'], losers: ['Ana', 'Amy'], isDraw: false }, // as an A: 4
  ];
  const { table } = Merit.build(matches, tierAt, { tierForRow: tierAt });
  const rishiRows = table.filter((r) => r.playerId === 'Rishi');
  assert.strictEqual(rishiRows.length, 2, 'one row per tier occupied');
  const byTier = Object.fromEntries(rishiRows.map((r) => [r.tier, r]));
  assert.strictEqual(byTier.B.merit, 5);
  assert.strictEqual(byTier.A.merit, 4);
  assert.strictEqual(byTier.B.played, 1);
  assert.strictEqual(byTier.A.played, 1);

  // All together is one row for the whole period.
  const whole = Merit.build(matches, tierAt).table.find((r) => r.playerId === 'Rishi');
  assert.strictEqual(whole.merit, 9, 'and the two segments sum to the whole');
  assert.strictEqual(whole.played, 2);
});

// ---- the table -------------------------------------------------------------

test('a table totals merit and counts how it was earned', () => {
  const matches = [
    { id: '1', date: '2026-09-01', winners: ['Ben', 'Bob'], losers: ['Ana', 'Amy'], isDraw: false }, // hard, 5
    { id: '2', date: '2026-09-02', winners: ['Ben', 'Bob'], losers: ['Cal', 'Cat'], isDraw: false }, // easy, 1
    { id: '3', date: '2026-09-03', winners: ['Ben', 'Bob'], losers: ['Ana', 'Cal'], isDraw: false }, // even, 3
    { id: '4', date: '2026-09-04', winners: ['Ben', 'Bob'], losers: ['Ana', 'Amy'], isDraw: true },  // draw, 0
  ];
  const row = Merit.build(matches, flat).table.find((r) => r.playerId === 'Ben');
  assert.strictEqual(row.merit, 5 + 1 + 3 + 0);
  assert.strictEqual(row.played, 4);
  assert.strictEqual(row.wins, 3);
  assert.strictEqual(row.draws, 1);
  assert.deepStrictEqual([row.hardWins, row.evenWins, row.easyWins], [1, 1, 1]);
  assert.strictEqual(row.bestWin, 5);
  // A draw is still a game played, it just pays nothing.
  assert.strictEqual(row.played, 4);
});

test('the table ranks on merit, then on how hard the wins were', () => {
  const matches = [
    { id: '1', date: '2026-09-01', winners: ['Ben', 'Bob'], losers: ['Ana', 'Amy'], isDraw: false },  // Ben 5
    { id: '2', date: '2026-09-02', winners: ['Cal', 'Cat'], losers: ['Ana', 'Ben'], isDraw: false },  // Cal 6
  ];
  const table = Merit.build(matches, flat).table;
  assert.strictEqual(table[0].playerId, 'Cal', '6 outranks 5');
  assert.strictEqual(table[0].merit, 6);
});

test('the audit reports the shape of the history rather than clipping it', () => {
  const matches = [
    { id: '1', date: '2026-09-01', winners: ['Ana', 'Amy'], losers: ['Ben', 'Cal'], isDraw: false }, // 3 steps
    { id: '2', date: '2026-09-02', winners: ['Ana', 'Ben'], losers: ['Amy', 'Bob'], isDraw: false }, // 0 steps
  ];
  const a = Merit.audit(matches, flat);
  assert.strictEqual(a.decided, 2);
  assert.strictEqual(a.maxSteps, 3);
  assert.deepStrictEqual(a.stepHistogram, { 0: 1, 3: 1 });
  assert.deepStrictEqual(a.extremes, [], 'nothing here falls outside 0..6');
});

test('nothing in this module reads a rating', () => {
  const src = require('node:fs').readFileSync(require.resolve('../assets/js/meritTable.js'), 'utf8');
  const code = src.split('\n').filter((l) => !l.trim().startsWith('//')).join('\n');
  [/\brating\b/i, /\bexpected/i, /reliability/i, /ratingJourney/i, /TIER_SEED/].forEach((re) => {
    assert.ok(!re.test(code), `Merit must not reference ${re} — it is not a rating system`);
  });
});

// ---- hard / favoured, and the matches behind them --------------------------

test('a win is hard, favoured, or neither — never two of them', () => {
  const matches = [
    { id: '1', date: '2026-09-01', winners: ['Ben', 'Bob'], losers: ['Ana', 'Amy'], isDraw: false }, // hard
    { id: '2', date: '2026-09-02', winners: ['Ben', 'Bob'], losers: ['Cal', 'Cat'], isDraw: false }, // favoured
    { id: '3', date: '2026-09-03', winners: ['Ben', 'Bob'], losers: ['Ana', 'Cal'], isDraw: false }, // even
    { id: '4', date: '2026-09-04', winners: ['Ana', 'Amy'], losers: ['Ben', 'Bob'], isDraw: false }, // a loss
    { id: '5', date: '2026-09-05', winners: ['Ben', 'Bob'], losers: ['Ana', 'Amy'], isDraw: true },  // a draw
  ];
  const row = Merit.build(matches, flat).table.find((r) => r.playerId === 'Ben');
  assert.strictEqual(row.hardWins, 1);
  assert.strictEqual(row.easyWins, 1, 'favoured');
  assert.strictEqual(row.evenWins, 1);
  assert.strictEqual(row.hardWins + row.evenWins + row.easyWins, row.wins,
    'every win falls into exactly one of the three');
  // Each of the three has its own list, so each column opens what it counts.
  assert.strictEqual(row.hard.length + row.favoured.length, row.wins - row.evenWins);
  assert.strictEqual(row.even.length, row.evenWins);
  assert.ok(row.even.every((d) => d.kind === 'even' && d.points === Merit.BASELINE));
});

test('the counts and the matches behind them are the same thing', () => {
  const matches = [
    { id: '1', date: '2026-09-01', winners: ['Ben', 'Bob'], losers: ['Ana', 'Amy'], isDraw: false },
    { id: '2', date: '2026-09-02', winners: ['Ben', 'Bob'], losers: ['Cal', 'Cat'], isDraw: false },
    { id: '3', date: '2026-09-03', winners: ['Ben', 'Bob'], losers: ['Ana', 'Cal'], isDraw: false },
  ];
  const row = Merit.build(matches, flat).table.find((r) => r.playerId === 'Ben');
  assert.strictEqual(row.hard.length, row.hardWins, 'a count is the length of its own list');
  assert.strictEqual(row.favoured.length, row.easyWins);
  // Every listed match is a win of the kind it was filed under…
  row.hard.forEach((d) => {
    assert.strictEqual(d.kind, 'hard');
    assert.ok(d.winners.includes('Ben'), 'and one this player actually won');
    assert.ok(d.points > Merit.BASELINE, 'a hard win pays above the baseline');
  });
  row.favoured.forEach((d) => {
    assert.strictEqual(d.kind, 'favoured');
    assert.ok(d.winners.includes('Ben'));
    assert.ok(d.points < Merit.BASELINE, 'a favoured win pays below it');
  });
  // …and the two lists together account for the merit that is not even wins.
  const listed = [...row.hard, ...row.favoured].reduce((a, d) => a + d.points, 0);
  assert.strictEqual(listed + row.evenWins * Merit.BASELINE, row.merit);
});

test('each listed match carries what is needed to check it', () => {
  const matches = [{ id: 'm9', date: '2026-09-01', type: 'doubles',
    winners: ['Ben', 'Bob'], losers: ['Ana', 'Amy'], isDraw: false, sets: [[6, 4], [3, 6], [7, 5]] }];
  const d = Merit.build(matches, flat).table.find((r) => r.playerId === 'Ben').hard[0];
  assert.strictEqual(d.id, 'm9');
  assert.strictEqual(d.date, '2026-09-01');
  assert.deepStrictEqual(d.winners, ['Ben', 'Bob']);
  assert.deepStrictEqual(d.losers, ['Ana', 'Amy']);
  assert.deepStrictEqual(d.winnerTiers, ['B', 'B'], 'the tiers used for THIS fixture');
  assert.deepStrictEqual(d.loserTiers, ['A', 'A']);
  assert.strictEqual(d.steps, 2);
  assert.strictEqual(d.points, 5);
  assert.deepStrictEqual(d.sets, [[6, 4], [3, 6], [7, 5]], 'the score rides along untouched');
});

test('a listed match shows the tier held on its own date, not the latest', () => {
  const tierAt = history().tierAsOf;   // Rishi: B until 2026-09-20, A after
  const matches = [
    { id: 'before', date: '2026-09-13', winners: ['Rishi', 'Ben'], losers: ['Ana', 'Amy'], isDraw: false },
    { id: 'after', date: '2026-09-21', winners: ['Rishi', 'Ben'], losers: ['Ana', 'Amy'], isDraw: false },
  ];
  const row = Merit.build(matches, tierAt).table.find((r) => r.playerId === 'Rishi');
  const byId = Object.fromEntries(row.hard.map((d) => [d.id, d]));
  assert.strictEqual(byId.before.winnerTiers[0], 'B', 'as a B on the 13th');
  assert.strictEqual(byId.after.winnerTiers[0], 'A', 'and an A on the 21st');
  assert.strictEqual(byId.before.steps, 2);
  assert.strictEqual(byId.after.steps, 1, 'the same fixture is a different gap once he is an A');
  assert.strictEqual(byId.before.points, 5);
  assert.strictEqual(byId.after.points, 4);
});

test('a split row lists only the matches that row earned', () => {
  const tierAt = history().tierAsOf;
  const matches = [
    { id: 'asB', date: '2026-09-13', winners: ['Rishi', 'Ben'], losers: ['Ana', 'Amy'], isDraw: false },
    { id: 'asA', date: '2026-09-21', winners: ['Rishi', 'Ben'], losers: ['Ana', 'Amy'], isDraw: false },
  ];
  const rows = Merit.build(matches, tierAt, { tierForRow: tierAt }).table.filter((r) => r.playerId === 'Rishi');
  const byTier = Object.fromEntries(rows.map((r) => [r.tier, r]));
  assert.deepStrictEqual(byTier.B.hard.map((d) => d.id), ['asB']);
  assert.deepStrictEqual(byTier.A.hard.map((d) => d.id), ['asA']);
});
