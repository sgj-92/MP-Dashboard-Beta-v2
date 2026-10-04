// The Ranked / Idle / Inactive state model.
//
// The rule these protect: participation and ranking are separate dimensions and
// neither may be derived from the other. A player who has not played lately is
// Idle, which says nothing about them; a player who has left the club is
// Inactive, which is a club fact an admin sets.

const test = require('node:test');
const assert = require('node:assert');
const P = require('../assets/js/playerState.js');

const ASOF = '2026-09-19T00:00:00Z';
const m = (date, ...players) => ({ date, players });

test('the threshold is 2 matches in 30 days, and is not changed by this work', () => {
  assert.strictEqual(P.MIN_MATCHES, 2);
  assert.strictEqual(P.WINDOW_DAYS, 30);
  assert.strictEqual(P.thresholdText(), '2+ matches in the last 30 days');
});

test('an active player at or above the threshold is Ranked', () => {
  const rated = [m('2026-09-17', 'A', 'B'), m('2026-09-01', 'A', 'C')];
  const s = P.stateOf({ ratedMatches: rated, name: 'A', asOf: ASOF, active: true });
  assert.strictEqual(s.participation, 'ACTIVE');
  assert.strictEqual(s.ranking, 'RANKED');
  assert.strictEqual(s.rankable, true);
  assert.strictEqual(s.label, 'Ranked');
});

test('an active player below the threshold is Idle, never Inactive', () => {
  const rated = [m('2026-09-17', 'A', 'B'), m('2026-06-01', 'A', 'C')];
  const s = P.stateOf({ ratedMatches: rated, name: 'A', asOf: ASOF, active: true });
  assert.strictEqual(s.participation, 'ACTIVE', 'still a Money Padel player');
  assert.strictEqual(s.ranking, 'IDLE');
  assert.strictEqual(s.rankable, false);
  assert.strictEqual(s.label, 'Idle');
  assert.notStrictEqual(s.label, 'Inactive');
});

test('an inactive player has no ranking state, however much they have played', () => {
  const rated = [m('2026-09-17', 'A', 'B'), m('2026-09-16', 'A', 'B'), m('2026-09-15', 'A', 'B')];
  const s = P.stateOf({ ratedMatches: rated, name: 'A', asOf: ASOF, active: false });
  assert.strictEqual(s.participation, 'INACTIVE');
  assert.strictEqual(s.ranking, null, 'Inactive is not a kind of Idle');
  assert.strictEqual(s.rankable, false);
  assert.strictEqual(s.label, 'Temporarily inactive');
  assert.strictEqual(s.recentMatches, 3, 'their record is still counted, just not ranked');
});

test('a missing active flag means active, never inactive', () => {
  const rated = [m('2026-09-17', 'A', 'B'), m('2026-09-16', 'A', 'B')];
  assert.strictEqual(P.stateOf({ ratedMatches: rated, name: 'A', asOf: ASOF }).participation, 'ACTIVE');
  assert.strictEqual(P.stateOf({ ratedMatches: rated, name: 'A', asOf: ASOF, active: undefined }).ranking, 'RANKED');
});

test('the window is a rolling 30 days, inclusive at the boundary', () => {
  const onBoundary = '2026-08-20';            // exactly 30 days before 2026-09-19
  const justOutside = '2026-08-19';
  assert.strictEqual(P.recentCount([m(onBoundary, 'A')], 'A', ASOF), 1);
  assert.strictEqual(P.recentCount([m(justOutside, 'A')], 'A', ASOF), 0);
});

// A draw is rated: it moves every player in it. Counting only decided games
// made eligibility depend on whether recent matches happened to finish.
test('draws count towards eligibility', () => {
  // The rated set carries players, not a result -- which is the point: the
  // caller cannot accidentally filter draws out.
  const rated = [m('2026-09-17', 'A', 'B'), m('2026-09-14', 'A', 'C')];
  assert.strictEqual(P.stateOf({ ratedMatches: rated, name: 'A', asOf: ASOF }).ranking, 'RANKED');
});

test('statesOf answers for many players at once, honouring each flag', () => {
  const rated = [m('2026-09-17', 'A', 'B'), m('2026-09-16', 'A', 'B'), m('2026-01-01', 'C')];
  const out = P.statesOf({
    ratedMatches: rated, names: ['A', 'B', 'C'], asOf: ASOF,
    activeOf: (n) => n !== 'B',
  });
  assert.strictEqual(out.A.label, 'Ranked');
  assert.strictEqual(out.B.label, 'Temporarily inactive', 'B played enough but is away');
  assert.strictEqual(out.C.label, 'Idle');
});
