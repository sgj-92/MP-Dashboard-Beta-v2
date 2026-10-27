// ===================== A NEW PLAYER'S FIRST GAME =====================
// Shaun, 27 Oct: added Topsy in Admin › Player tags (Tier C), then could not
// approve her first game -- "These players have never been initialised, so
// they have no rating to move: Topsy… Initialise them with a starting tier
// first." Nothing in the app could: "Add a new player" only saved a tier tag,
// and the rating engine rates nobody it has no PLAYER_INITIALISED event for.
// Every player in the record entered through the seed script.
//
// Now a game that brings a new player in is planned, shown and written
// together with their entry, at the tier set in Admin, on the date of that
// first game (the seed's convention), PROVISIONAL (UNKNOWN_NEW_PLAYER).

const test = require('node:test');
const assert = require('node:assert');
const H = require('./helpers/uiHarness.js');
const RF = require('../assets/js/replayForward.js');

const maybe = H.available() ? test : test.skip;

test('a change can bring players into the record, once each', () => {
  const inputs = { matches: [], initialisations: [{ playerId: 'Ann', tier: 'B' }], events: [] };
  const match = { id: '2026-10-26-1', date: '2026-10-26', teamA: ['Ann', 'Bob'], teamB: ['Cat', 'Dan'], sets: [[6, 2]] };
  const adds = ['Bob', 'Cat', 'Dan'].map((p) => ({ playerId: p, tier: 'C' }));
  const out = RF.applyChange(inputs, { type: 'append', match, initialisations: adds });
  assert.deepStrictEqual(out.initialisations.map((i) => i.playerId), ['Ann', 'Bob', 'Cat', 'Dan']);
  assert.deepStrictEqual(RF.unseenPlayers(out), []);
  assert.throws(() => RF.applyChange(inputs, { type: 'append', match, initialisations: [{ playerId: 'Ann', tier: 'C' }] }), /already in the record/);
  assert.throws(() => RF.applyChange(inputs, { type: 'append', match, initialisations: [{ playerId: 'Bob' }] }), /starting tier/);
  // Without any, nothing changes from before.
  assert.strictEqual(RF.applyChange(inputs, { type: 'append', match }).initialisations, inputs.initialisations);
});

maybe('approving a new player\'s first game: told what to do until they are added, then they join the record with it', async () => {
  const app = await H.open({ now: '2026-09-21T10:00:00.000Z' });
  try {
    const r = await app.run(async () => {
      isUnlocked = true; adminRole = 'owner'; currentUserName = 'Shaun';
      const [a, b, c] = PLAYERS.slice(0, 3).map((p) => p.name);
      extraMatchesState.push({ id: 'sub_new', date: '2026-09-20', winners: [a, b], losers: [c, 'Topsy'], sets: [[6, 0], [6, 2]],
        type: 'doubles', note: '', status: 'pending', submittedBy: 'Jords', submittedAt: '2026-09-20T20:00:00Z' });
      recomputeAll();
      document.querySelector('#tabrow .tab-btn[data-tab="games"]').click();
      await prepareApproval('sub_new');
      const refused = { message: approvalMessage, plan: !!approvalPlan };
      // Admin › Player tags › Add a new player.
      tagOverridesState.Topsy = { tier: 'C', active: true };
      await prepareApproval('sub_new');
      renderGamesTab();
      const panel = document.getElementById('approveConfirmBtn').closest('.callout-card').innerText.replace(/\s+/g, ' ');
      await commitApproval();
      const p = PLAYERS.find((x) => x.name === 'Topsy');
      const init = window.__writes.map((w) => w.doc).filter((d) => d && d.eventType === 'PLAYER_INITIALISED');
      const stored = await readStoredRecord(RatingStore.firestoreCompatBackend(db));
      const check = ReplayForward.verifyNoOp(stored, {});
      return { refused, panel, topsy: p && { tier: p.tier, rating: p.rating, total: p.total }, init, intact: check.identical,
        pending: extraMatchesState.some((m) => m.id === 'sub_new'), others: [a, b, c] };
    });
    assert.strictEqual(r.refused.plan, false);
    assert.match(r.refused.message, /Topsy isn’t in the club yet\. Add them in More › Admin › Player tags › Add a new player/);
    assert.doesNotMatch(r.refused.message, /never been initialised/, 'the engine\'s wording is not what an admin sees');
    assert.match(r.panel, /Topsy \(new · starts Tier C at 1100\) → \d/);
    assert.match(r.panel, /Topsy joins the record here, in Tier C at 1100/);
    assert.ok(r.topsy, 'Topsy is a player once her first game is rated');
    assert.strictEqual(r.topsy.tier, 'C');
    assert.strictEqual(r.topsy.total, 1);
    assert.notStrictEqual(r.topsy.rating, 1100, 'her first game moved her from the Tier C baseline');
    assert.strictEqual(r.init.length, 1);
    assert.deepStrictEqual([r.init[0].playerId, r.init[0].newTier, r.init[0].newPowerRating, r.init[0].newClassificationStatus, r.init[0].reasonCode, r.init[0].effectiveDate, r.init[0].createdBy],
      ['Topsy', 'C', 1100, 'PROVISIONAL', 'UNKNOWN_NEW_PLAYER', '2026-09-20', 'Shaun']);
    assert.strictEqual(r.intact, true, 'the record still replays to itself, so every later edit works');
    assert.strictEqual(r.pending, false);
    assert.deepStrictEqual(app.pageErrors, []);
  } finally { await app.close(); }
});

maybe('a correction that puts a new player into a rated game brings them in the same way', async () => {
  const app = await H.open({ now: '2026-09-21T10:00:00.000Z' });
  try {
    const r = await app.run(async () => {
      isUnlocked = true; adminRole = 'owner'; currentUserName = 'Shaun';
      tagOverridesState.Newbie = { tier: 'B', active: true };
      const m = getAllApprovedMatches().filter((x) => !x.isDraw).slice(-1)[0];
      const corrected = { id: m.id, date: m.date, sourceIndex: Number(String(m.id).slice(m.date.length + 1)) || 1,
        teamA: m.winners, teamB: [m.losers[0], 'Newbie'], sets: m.sets, outcome: RatingEngine.OUTCOME.A_WINS, type: 'doubles' };
      await stageMatchCorrection({ type: 'edit', match: corrected }, 'test');
      return { staged: !!matchFixPlan, message: matchFixMessage, newPlayers: matchFixPlan && matchFixPlan.newPlayers,
        html: buildMatchFixConfirmHtml().replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ') };
    });
    assert.ok(r.staged, r.message);
    assert.deepStrictEqual(r.newPlayers.map((n) => [n.playerId, n.tier, n.rating]), [['Newbie', 'B', 1400]]);
    assert.match(r.html, /Newbie \(new · starts Tier B at 1400\)/);
    assert.deepStrictEqual(app.pageErrors, []);
  } finally { await app.close(); }
});
