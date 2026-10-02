// The completed-match scorecard: one canonical card per rated match. Every
// rating figure on it is read back from what the engine recorded when it rated
// the match -- never recomputed in the browser -- so these tests hold it to the
// engine's own record, and to staying the same when later matches, ratings or
// tiers move.

const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const Engine = require('../assets/js/ratingEngine.js');
const MF = require('../assets/js/matchFacts.js');
const SC = require('../assets/js/domain/matches/matchScorecard.js');
const { buildBackfill } = require('../scripts/seed-beta.js');
const H = require('./helpers/uiHarness.js');

const ROOT = path.join(__dirname, '..');
const r1 = (v) => Math.round(v * 10) / 10;

let cached = null;
function backfill() {
  if (!cached) {
    const b = buildBackfill();
    cached = { b, facts: MF.index(b.replay.journey), events: b.replay.journey.filter((e) => e.eventType === Engine.EVENT.MATCH_UPDATE) };
  }
  return cached;
}

// The app's match shape (V3Bridge.toLegacyMatchShape): team A first, which is
// the winners on a decided match.
const appMatch = (m) => ({
  id: m.id, date: m.date, winners: m.teamA, losers: m.teamB, sets: m.sets,
  type: m.type || 'doubles', isDraw: m.outcome === Engine.OUTCOME.DRAW,
});

test('every rated match: all players, the right teams, and the engine\'s own figures', () => {
  const { b, facts, events } = backfill();
  const evOf = {};
  events.forEach((e) => { evOf[e.matchId + '|' + e.playerId] = e; });
  let draws = 0;
  b.matches.forEach((m) => {
    const vm = SC.build(appMatch(m), facts[m.id], {});
    assert.strictEqual(vm.rated, true, `${m.id} is rated`);
    assert.strictEqual(vm.date, m.date);
    assert.deepStrictEqual(vm.teams[0].names.slice().sort(), m.teamA.slice().sort(), `${m.id}: team 1`);
    assert.deepStrictEqual(vm.teams[1].names.slice().sort(), m.teamB.slice().sort(), `${m.id}: team 2`);
    assert.strictEqual(vm.scoreText, m.sets.map((s) => s.join('-')).join(', '));
    if (m.outcome === Engine.OUTCOME.DRAW) { draws++; assert.strictEqual(vm.winner, null); assert.ok(vm.isDraw); assert.ok(!vm.teams[0].won && !vm.teams[1].won, 'a draw is won by nobody'); }
    else { assert.strictEqual(vm.winner, 1); assert.ok(vm.teams[0].won && !vm.teams[1].won); }

    // Expected reconciles to the engine: the logistic on the two pairs'
    // pre-match ratings, exactly as recorded on the events.
    const preOf = (t) => t.players.reduce((s, p) => s + p.preRating, 0) / t.players.length;
    const [t1, t2] = vm.teams;
    assert.ok(Math.abs(Engine.expectedScore(preOf(t1), preOf(t2)) - t1.expected) < 1e-9, `${m.id}: expected`);
    assert.ok(Math.abs(t1.expected + t2.expected - 1) < 1e-9);
    // Actual reconciles to the engine's own definition (0.80 game share +
    // 0.20 result), from the match's own sets and outcome.
    const act = Engine.actualScores(m.sets, m.outcome);
    assert.ok(Math.abs(act.a - t1.actual) < 1e-9 && Math.abs(act.b - t2.actual) < 1e-9, `${m.id}: actual`);

    vm.teams.forEach((t) => {
      // The pp maths: the printed difference is the printed actual minus the
      // printed expected, and the engine's residual to within that rounding.
      assert.strictEqual(t.expectedPct, r1(t.expected * 100));
      assert.strictEqual(t.actualPct, r1(t.actual * 100));
      assert.strictEqual(t.vsExpectedPp, r1(t.actualPct - t.expectedPct));
      assert.ok(Math.abs(t.residualPp - (t.actual - t.expected) * 100) < 1e-9);
      assert.ok(Math.abs(t.vsExpectedPp - t.residualPp) <= 0.1 + 1e-9, `${m.id}: ${t.vsExpectedPp} vs ${t.residualPp}`);
      // Game share is context, read from the same sets the engine scored.
      assert.strictEqual(t.games + t.opponentGames, m.sets.reduce((s, x) => s + x[0] + x[1], 0));
      t.players.forEach((p) => {
        const e = evOf[m.id + '|' + p.name];
        assert.ok(e, `${m.id}: ${p.name} has an event`);
        assert.strictEqual(e.side, t.side);
        assert.strictEqual(p.movement, r1(e.ratingDelta), `${m.id}: ${p.name} movement`);
        assert.strictEqual(p.preRating, e.preMatchRating);
        assert.strictEqual(p.postRating, e.postMatchRating);
        assert.strictEqual(p.tier, e.tierAtEvent);
        assert.strictEqual(p.tierSource, 'event');
        // The movement is K x the side's difference -- the residual on the card.
        assert.ok(Math.abs(e.kUsed * t.residual - e.ratingDelta) < 1e-9);
      });
    });
  });
  assert.ok(draws > 0, 'the record has draws, and they get a scorecard too');
});

test('the tier on the card is the tier held that day, and agrees with the dated tier history', () => {
  const { b, facts } = backfill();
  let moved = 0;
  b.matches.forEach((m) => {
    const vm = SC.build(appMatch(m), facts[m.id], {});
    vm.teams.forEach((t) => t.players.forEach((p) => {
      assert.strictEqual(p.tier, b.history.tierAsOf(p.name, m.date), `${m.id}: ${p.name}`);
      if (p.tier !== b.history.currentTier(p.name)) moved++;
    }));
  });
  // A resolver that only knows today's tiers is ignored when the event
  // recorded the tier: a June card does not change when someone is promoted.
  const m = b.matches[0];
  const vm = SC.build(appMatch(m), facts[m.id], { tierOf: () => 'S' });
  vm.teams.forEach((t) => t.players.forEach((p) => assert.notStrictEqual(p.tier, 'S')));
  // The record has players whose tier has since changed, so this is a real
  // test of "on the day" rather than of a tier nobody ever left.
  assert.ok(moved > 0, 'some cards show a tier the player no longer holds');
});

test('historically stable: later matches, ratings and tier moves never change an earlier scorecard', () => {
  const { b, facts } = backfill();
  // Replay only the first 40 matches: what the club's record looked like then.
  const early = b.matches.slice(0, 40);
  const then = Engine.replay({
    matches: early,
    initialisations: b.replay.journey.filter((e) => e.eventType === Engine.EVENT.PLAYER_INITIALISED && e.effectiveDate <= early[early.length - 1].date)
      .map((e) => ({ playerId: e.playerId, tier: e.newTier, classificationStatus: e.newClassificationStatus, effectiveDate: e.effectiveDate, rating: e.newPowerRating })),
    events: [],
  });
  const thenFacts = MF.index(then.journey);
  // Only matches before any tier decision are comparable on a replay that
  // carries no decisions; those are what this pins.
  const firstDecision = b.replay.journey.filter((e) => e.eventType !== Engine.EVENT.MATCH_UPDATE && e.eventType !== Engine.EVENT.PLAYER_INITIALISED)
    .map((e) => e.effectiveDate).sort()[0] || '9999';
  const checked = early.filter((m) => m.date < firstDecision);
  assert.ok(checked.length >= 10, `enough early matches to compare (${checked.length})`);
  checked.forEach((m) => {
    const now = SC.build(appMatch(m), facts[m.id], {});
    const before = SC.build(appMatch(m), thenFacts[m.id], {});
    assert.deepStrictEqual(now, before, `${m.id}: the scorecard read the same before the later matches existed`);
  });
});

test('an unrated match gets a card that says so -- nothing is estimated', () => {
  const vm = SC.build({ id: 'x', date: '2026-10-01', winners: ['Ann', 'Bob'], losers: ['Cat', 'Dan'], sets: [[6, 4], [6, 3]], type: 'doubles', isDraw: false },
    null, { tierOf: (n) => ({ Ann: 'A', Bob: 'B', Cat: 'B', Dan: 'C' })[n] });
  assert.strictEqual(vm.rated, false);
  assert.strictEqual(vm.winner, 1);
  assert.deepStrictEqual(vm.teams.map((t) => t.players.map((p) => [p.name, p.tier, p.tierSource])),
    [[['Ann', 'A', 'history'], ['Bob', 'B', 'history']], [['Cat', 'B', 'history'], ['Dan', 'C', 'history']]]);
  vm.teams.forEach((t) => {
    ['expected', 'actual', 'residual', 'expectedPct', 'actualPct', 'vsExpectedPp', 'residualPp'].forEach((k) => assert.strictEqual(t[k], null, k));
    t.players.forEach((p) => assert.strictEqual(p.movement, null));
  });
  assert.strictEqual(vm.teams[0].games, 12);
  // An unknown tier stays unknown, and so does the game type.
  const unknown = SC.build({ id: 'y', date: '2026-10-01', winners: ['Ann', 'Zed'], losers: ['Cat', 'Dan'], sets: [[6, 4]], isDraw: false }, null,
    { tierOf: (n) => ({ Ann: 'A', Cat: 'B', Dan: 'C' })[n] });
  assert.strictEqual(unknown.teams[0].players.find((p) => p.name === 'Zed').tier, null);
  assert.strictEqual(unknown.matchup, null);
});

test('facts that do not line up with the teams are not shown against the wrong team', () => {
  const { b, facts } = backfill();
  const m = b.matches.find((x) => x.outcome !== Engine.OUTCOME.DRAW);
  const swapped = { ...appMatch(m), winners: [m.teamA[0], m.teamB[0]], losers: [m.teamA[1], m.teamB[1]] };
  // Mixed both ways round: each team holds one player from each engine side.
  const crossed = { ...appMatch(m), winners: [m.teamA[0], m.teamB[0]], losers: [m.teamB[1], m.teamA[1]] };
  [swapped, crossed].forEach((x) => {
    const vm = SC.build(x, facts[m.id], {});
    assert.strictEqual(vm.rated, false);
    vm.teams.forEach((t) => { assert.strictEqual(t.expected, null); t.players.forEach((p) => assert.strictEqual(p.movement, null)); });
  });
});

test('no parallel calculation: the module reads the record and never re-derives a rating figure', () => {
  const src = fs.readFileSync(path.join(ROOT, 'assets/js/domain/matches/matchScorecard.js'), 'utf8').replace(/^\s*\/\/.*$/gm, '');
  ['expectedScore(', 'actualScores(', 'pairRating(', 'kUsed', 'processMatch', 'document', 'window', 'V3_', 'PLAYERS']
    .forEach((w) => assert.ok(!src.includes(w), `matchScorecard.js must not reference ${w}`));
});

const skip = !H.available();

test('Games: a played match opens its scorecard, which matches the engine record', { skip }, async () => {
  const app = await H.open();
  try {
    const r = await app.run(() => {
      document.querySelector('#tabrow .tab-btn[data-tab="games"]').click();
      const out = [];
      // A decided match and a draw.
      const ids = [getAllApprovedMatches().filter((m) => !m.isDraw).slice(-1)[0].id, getAllApprovedMatches().find((m) => m.isDraw).id];
      ids.forEach((id) => {
        expandedGameId = id; renderGamesTab();
        const btn = document.querySelector(`#gamesView [data-gameid="${id}"] [data-scorecard]`);
        btn.click();
        const modal = document.getElementById('matchScorecardModal');
        const m = getAllApprovedMatches().find((x) => x.id === id);
        const f = V3_MATCH_FACTS[id];
        const teams = [...modal.querySelectorAll('.msc-team')].map((t) => ({
          names: [...t.querySelectorAll('.msc-name')].map((n) => n.textContent),
          tiers: [...t.querySelectorAll('.msc-tier')].map((n) => n.textContent),
          moves: [...t.querySelectorAll('.msc-move')].map((n) => n.textContent),
          expected: t.querySelector('[data-fig="expected"]').textContent,
          actual: t.querySelector('[data-fig="actual"]').textContent,
          pp: t.querySelector('[data-fig="pp"]').textContent,
        }));
        const sign = (v, u) => `${v > 0 ? '+' : v < 0 ? '−' : '±'}${Math.abs(v).toFixed(1)}${u}`;
        const want = [m.winners, m.losers].map((names) => {
          const side = f.byPlayer[names[0]].side;
          const s = f.sides[side];
          const e = Math.round(s.expected * 1000) / 10, a = Math.round(s.actual * 1000) / 10;
          const ordered = GameType.orderTeam(names, (n) => historicalTierOf(n, m.date));
          return { names: ordered, tiers: ordered.map((n) => historicalTierOf(n, m.date)),
            moves: ordered.map((n) => sign(f.byPlayer[n].ratingDelta, '')),
            expected: e.toFixed(1) + '%', actual: a.toFixed(1) + '%', pp: sign(Math.round((a - e) * 10) / 10, 'pp') };
        });
        out.push({ id, open: modal.classList.contains('show'), stillExpanded: expandedGameId === id,
          teams, want, score: modal.querySelector('.msc-score').textContent, wantScore: m.sets.map((s) => s.join('-')).join(', '),
          winner: modal.querySelector('.msc-winner').textContent, isDraw: m.isDraw });
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
        out[out.length - 1].closed = !modal.classList.contains('show');
      });
      return out;
    });
    r.forEach((c) => {
      assert.ok(c.open, `${c.id}: the scorecard opens`);
      assert.ok(c.stillExpanded, `${c.id}: opening it does not collapse the card behind it`);
      assert.deepStrictEqual(c.teams, c.want, `${c.id}`);
      assert.strictEqual(c.score, c.wantScore);
      assert.strictEqual(c.winner, c.isDraw ? 'Draw' : `${c.want[0].names.join(' & ')} won`);
      assert.ok(c.closed, 'Escape closes it');
    });
    assert.deepStrictEqual(app.pageErrors, []);
  } finally { await app.close(); }
});

test('approving a result offers its scorecard straight away, rated from the new record', { skip }, async () => {
  const app = await H.open();
  try {
    const r = await app.run(async () => {
      isUnlocked = true; currentUserName = 'Tester';
      extraMatchesState.push({
        id: 'usr_sc_1', date: '2026-09-18', winners: ['Shaun', 'Tom'], losers: ['Max', 'KC'],
        sets: [[6, 3], [6, 4]], type: 'doubles', note: '', status: 'pending', submittedBy: 'Tester',
      });
      recomputeAll();
      document.querySelector('#tabrow .tab-btn[data-tab="games"]').click();
      await prepareApproval('usr_sc_1');
      const matchId = approvalPlan.matchId;
      const planned = approvalPlan.planned.playersMoved.map((p) => [p.playerId, p.delta]);
      await commitApproval();
      renderGamesTab();
      const btn = document.querySelector(`#gamesView .approval-outcome [data-scorecard="${matchId}"]`);
      if (btn) btn.click();
      const vm = matchScorecardFor(matchId);
      const modal = document.getElementById('matchScorecardModal');
      return { matchId, planned, button: !!btn, open: !!modal && modal.classList.contains('show'),
        shown: modal ? modal.querySelector('.msc').dataset.match : null,
        rated: vm.rated, moves: vm.teams.flatMap((t) => t.players.map((p) => [p.name, p.movement])) };
    });
    assert.ok(r.button, 'the approval outcome carries a scorecard button');
    assert.ok(r.open);
    assert.strictEqual(r.shown, r.matchId);
    assert.strictEqual(r.rated, true, 'the new match is rated from the record written by the approval');
    const plannedOf = Object.fromEntries(r.planned);
    r.moves.forEach(([n, d]) => assert.ok(Math.abs(d - plannedOf[n]) <= 0.05 + 1e-9, `${n}: ${d} vs planned ${plannedOf[n]}`));
    assert.deepStrictEqual(app.pageErrors, []);
  } finally { await app.close(); }
});

test('in the app, a player with no rating event falls back to the dated tier history, never today\'s tier', { skip }, async () => {
  const app = await H.open();
  try {
    const r = await app.run(() => {
      // A match one of whose players has since changed tier.
      const m = getAllApprovedMatches().find((x) => x.winners.concat(x.losers)
        .some((n) => historicalTierOf(n, x.date) !== (PLAYERS.find((p) => p.name === n) || {}).tier));
      if (!m) return null;
      const keep = V3_MATCH_FACTS[m.id];
      delete V3_MATCH_FACTS[m.id];
      const vm = matchScorecardFor(m.id);
      V3_MATCH_FACTS[m.id] = keep;
      return { rated: vm.rated, tiers: vm.teams.flatMap((t) => t.players.map((p) => [p.name, p.tier])),
        want: m.winners.concat(m.losers).map((n) => [n, historicalTierOf(n, m.date)]) };
    });
    assert.ok(r, 'the record has a player whose tier has changed since a match');
    assert.strictEqual(r.rated, false);
    assert.deepStrictEqual(r.tiers.slice().sort(), r.want.slice().sort());
    assert.deepStrictEqual(app.pageErrors, []);
  } finally { await app.close(); }
});
