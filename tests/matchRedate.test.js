// ===================== CHANGING A GAME'S DATE =====================
// Shaun, 27 Oct: correcting a rated game's date was refused ("delete this game
// and add it again on the correct date"). Now the date is just changed: the
// game moves to the new date under a new identifier (an identifier carries
// its date), every rating from the earlier of the two dates is re-derived in
// one replay, and what refers to the game by identifier follows it.

const test = require('node:test');
const assert = require('node:assert');
const H = require('./helpers/uiHarness.js');
const RF = require('../assets/js/replayForward.js');

const maybe = H.available() ? test : test.skip;

test('a redate takes the game out under its old identifier and puts it back under the new one', () => {
  const m = (id, date) => ({ id, date, teamA: ['A', 'B'], teamB: ['C', 'D'], sets: [[6, 2]] });
  const inputs = { matches: [m('2026-10-26-1', '2026-10-26'), m('2026-10-27-1', '2026-10-27')], initialisations: [], events: [] };
  const out = RF.applyChange(inputs, { type: 'redate', matchId: '2026-10-27-1', match: m('2026-10-26-2', '2026-10-26') });
  assert.deepStrictEqual(out.matches.map((x) => x.id).sort(), ['2026-10-26-1', '2026-10-26-2']);
  assert.throws(() => RF.applyChange(inputs, { type: 'redate', matchId: 'nope', match: m('2026-10-26-2', '2026-10-26') }), /not in the record/);
  assert.throws(() => RF.applyChange(inputs, { type: 'redate', matchId: '2026-10-27-1', match: m('2026-10-26-1', '2026-10-26') }), /already in the record/);
  assert.throws(() => RF.applyChange(inputs, { type: 'redate', matchId: '2026-10-27-1', match: m('2026-10-27-1', '2026-10-27') }), /new identifier/);
});

maybe('in the app: change the date in Edit game, confirm, and the game moves -- record intact, references carried', async () => {
  const app = await H.open({ viewport: { width: 390, height: 844 }, now: '2026-09-21T10:00:00.000Z' });
  try {
    const r = await app.run(async () => {
      isUnlocked = true; adminRole = 'owner'; currentUserName = 'Shaun';
      document.querySelector('#tabrow .tab-btn[data-tab="games"]').click();
      selectedMonth = 'all';
      // The latest decided game, moved back a day.
      const m = getAllApprovedMatches().filter((x) => !x.isDraw).slice(-1)[0];
      const d = new Date(`${m.date}T12:00:00Z`); d.setUTCDate(d.getUTCDate() - 1);
      const newDate = d.toISOString().slice(0, 10);
      // Things that point at the game by identifier.
      matchAttributionState = { [m.id]: { matchId: m.id, submittedBy: 'Jords' } };
      gameRequestsState.push({ id: 'fx-test', status: 'played', players: m.winners.concat(m.losers), playedMatchId: m.id, history: [] });
      openGameEditor(m.id);
      document.getElementById('edDate').value = newDate;
      await new Promise((res) => { document.getElementById('edSubmit').click(); setTimeout(res, 50); });
      for (let k = 0; k < 100 && !matchFixPlan && !/fail|refus/i.test(matchFixMessage); k++) await new Promise((res) => setTimeout(res, 20));
      const panel = (document.getElementById('matchFixCommitBtn') || {}).closest ? document.getElementById('matchFixCommitBtn').closest('.callout-card').innerText.replace(/\s+/g, ' ') : matchFixMessage;
      const change = matchFixPlan && matchFixPlan.change;
      await commitMatchCorrection();
      const stored = await readStoredRecord(RatingStore.firestoreCompatBackend(db));
      return {
        oldId: m.id, newDate, panel, change: change && { type: change.type, from: change.matchId, to: change.match.id },
        oldGone: !getAllApprovedMatches().some((x) => x.id === m.id),
        moved: getAllApprovedMatches().find((x) => x.id === (change && change.match.id)),
        intact: ReplayForward.verifyNoOp(stored, {}).identical,
        attribution: Object.keys(matchAttributionState), submitter: Object.values(matchAttributionState)[0].submittedBy,
        fixture: gameRequestsState.find((x) => x.id === 'fx-test').playedMatchId,
        reconcile: PLAYERS.every((p) => p.lifetimeMatches === undefined || p.total === p.lifetimeMatches),
      };
    });
    assert.ok(r.change, `the date change was staged, not refused: ${r.panel}`);
    assert.strictEqual(r.change.type, 'redate');
    assert.ok(r.change.to.startsWith(r.newDate + '-'), r.change.to);
    assert.match(r.panel, /Confirm new date/);
    assert.match(r.panel, new RegExp(`It becomes ${r.change.to} \\(was ${r.oldId}\\)`));
    assert.strictEqual(r.oldGone, true);
    assert.ok(r.moved, 'the game is in the record on its new date');
    assert.strictEqual(r.moved.date, r.newDate);
    assert.strictEqual(r.intact, true, 'the record still replays to itself');
    assert.deepStrictEqual(r.attribution, [r.change.to]);
    assert.strictEqual(r.submitter, 'Jords');
    assert.strictEqual(r.fixture, r.change.to);
    assert.strictEqual(r.reconcile, true);
    assert.deepStrictEqual(app.pageErrors, []);
  } finally { await app.close(); }
});
