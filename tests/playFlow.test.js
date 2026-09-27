// ===================== PLAY / UPCOMING / PREDICTION =====================
// The lifecycle a game actually has:
//
//   prediction  ->  Upcoming  ->  Add result  ->  a rated historical game
//
// and the three things that must stay true all the way along it: the players
// are carried, not retyped; the prediction is one calculation shown in two
// places; and no step leaves a second copy of the same game behind.

const test = require('node:test');
const assert = require('node:assert');
const H = require('./helpers/uiHarness.js');
const MatchPrediction = require('../assets/js/matchPrediction.js');

const skip = H.available() ? false : 'Playwright unavailable';
const maybe = H.available() ? test : test.skip;

// --- the calculation, on its own ----------------------------------------

test('a prediction is a share of games, and the two sides account for all of it', () => {
  const r = MatchPrediction.build(['A', 'B'], ['C', 'D'], (n) => ({ A: 1500, B: 1500, C: 1400, D: 1400 }[n]));
  assert.strictEqual(r.ok, true);
  assert.strictEqual(r.shareA + r.shareB, 100);
  assert.ok(r.shareA > 50, 'the stronger pair takes the larger share');
  assert.deepStrictEqual(r.favoured, ['A', 'B']);
});

test('a side is the mean of its players, so two names beat one of the same strength', () => {
  const ratings = { Strong: 1800, Weak: 1200, Mid: 1500 };
  const r = MatchPrediction.build(['Strong', 'Weak'], ['Mid'], (n) => ratings[n]);
  // 1500 vs 1500 -- level, which a "best player on each side" rule would have
  // called a mismatch.
  assert.strictEqual(r.confidence, 'level');
  assert.strictEqual(r.favoured, null);
  assert.strictEqual(r.shareA, 50);
});

test('the call scales with the gap, and only a level matchup names nobody', () => {
  const at = (gap) => MatchPrediction.build(['A'], ['B'], (n) => (n === 'A' ? 1400 + gap : 1400)).confidence;
  assert.strictEqual(at(0), 'level');
  assert.strictEqual(at(5), 'shade');
  assert.strictEqual(at(100), 'clear');
});

test('a matchup that cannot be predicted says so rather than guessing', () => {
  assert.strictEqual(MatchPrediction.build(['A'], ['Ghost'], (n) => ({ A: 1400 }[n])).ok, false);
  assert.strictEqual(MatchPrediction.build(['A'], ['A'], () => 1400).ok, false);
  assert.strictEqual(MatchPrediction.build([], ['A'], () => 1400).ok, false);
});

// --- the screens --------------------------------------------------------

maybe('the Games filters arrive shut and say what they are set to', async () => {
  const app = await H.open();
  try {
    const r = await app.run(() => {
      document.querySelector('#tabrow .tab-btn[data-tab="games"]').click();
      const head = () => document.getElementById('gamesFiltersToggle');
      const shut = {
        open: gamesFiltersOpen,
        summary: head().textContent.replace(/\s+/g, ' ').trim(),
        selects: document.querySelectorAll('#gamesView select').length,
      };
      // Change a filter, then shut the panel again: the summary must follow.
      head().click();
      setGamesPlayerFilter([PLAYERS[0].name]);
      gamesType = 'all';
      renderGamesTab();
      const opened = {
        selects: document.querySelectorAll('#gamesView select').length,
        playerFields: document.querySelectorAll('#gamesView .gp-field').length,
      };
      document.getElementById('gamesFiltersToggle').click();
      return {
        shut, opened,
        changedSummary: document.getElementById('gamesFiltersToggle').textContent.replace(/\s+/g, ' ').trim(),
        who: PLAYERS[0].name,
      };
    });
    assert.strictEqual(r.shut.open, false, 'the filters must arrive collapsed');
    assert.match(r.shut.summary, /All time/);
    assert.match(r.shut.summary, /All players/);
    assert.match(r.shut.summary, /All game types/);
    assert.strictEqual(r.shut.selects, 0, 'a shut panel should not be occupying the screen');
    assert.strictEqual(r.opened.selects, 2, 'opening it gives Month and Game type back');
    assert.strictEqual(r.opened.playerFields, 4, 'and four player fields');
    assert.match(r.changedSummary, new RegExp(r.who),
      'a changed filter must show on the shut heading — a silent filter is worse than none');
    assert.deepStrictEqual(app.pageErrors, []);
  } finally { await app.close(); }
});

maybe('the Games tab no longer carries a name card, and says who is adding inside the form', async () => {
  const app = await H.open();
  try {
    const r = await app.run(() => {
      setCurrentViewer(PLAYERS[0].name);
      document.querySelector('#tabrow .tab-btn[data-tab="games"]').click();
      addGameExpanded = true;
      renderGamesTab();
      return {
        oldCard: !!document.getElementById('gamesYourName'),
        identity: submissionIdentity(),
        line: (document.querySelector('#addGameBody .identity-line') || {}).textContent || '',
        who: PLAYERS[0].name,
      };
    });
    assert.strictEqual(r.oldCard, false, 'the read-only Your name card should be gone');
    assert.strictEqual(r.identity, r.who, 'identity comes from the chosen player');
    assert.match(r.line.replace(/\s+/g, ' '), new RegExp(`Adding as ${r.who}`));
    assert.deepStrictEqual(app.pageErrors, []);
  } finally { await app.close(); }
});

maybe('a submission is attributed to the chosen player, with no name field to fill in', async () => {
  const app = await H.open();
  try {
    const out = await app.run(async () => {
      setCurrentViewer(PLAYERS[0].name);
      currentUserName = '';   // nothing typed anywhere: the viewer is the only identity
      document.querySelector('#tabrow .tab-btn[data-tab="games"]').click();
      addGameExpanded = true; renderGamesTab();
      const names = PLAYERS.slice(0, 4).map(p => p.name);
      const set = (id, v) => { document.getElementById(id).value = v; };
      set('agDate', '2026-12-30');
      set('agA1', names[0]); set('agA2', names[1]); set('agB1', names[2]); set('agB2', names[3]);
      [6, 3, 6, 4].forEach((v, i) => {
        const el = document.querySelectorAll('#agSets input')[i];
        el.value = v; el.dispatchEvent(new Event('input', { bubbles: true }));
      });
      await submitNewGame();
      await new Promise(r => setTimeout(r, 200));
      const saved = extraMatchesState[extraMatchesState.length - 1];
      return { submittedBy: saved && saved.submittedBy, expected: PLAYERS[0].name };
    });
    assert.strictEqual(out.submittedBy, out.expected,
      'attribution must be the real chosen player, not blank and not free text');
    assert.deepStrictEqual(app.pageErrors, []);
  } finally { await app.close(); }
});

maybe('Requests and Upcoming open on their lists, not on their forms', async () => {
  const app = await H.open();
  try {
    const r = await app.run(() => {
      document.querySelector('#tabrow .tab-btn[data-tab="wishlist"]').click();
      const req = {
        open: { ...requestSectionOpen },
        folds: document.querySelectorAll('#wishlistView .lg-tier-head').length,
        formVisible: !!document.getElementById('reqP1'),
      };
      document.querySelector('#tabrow .tab-btn[data-tab="upcoming"]').click();
      return { req, upcomingFolds: document.querySelectorAll('#upcomingView .lg-tier-head').length };
    });
    assert.strictEqual(r.req.open.request, false, 'the request form should arrive folded away');
    assert.strictEqual(r.req.formVisible, false);
    assert.strictEqual(r.req.open.pending, true, 'the list of requests is the content, so it opens');
    assert.ok(r.req.folds >= 3, `Requests should be sectioned, saw ${r.req.folds} folds`);
    assert.ok(r.upcomingFolds >= 1, 'Upcoming should be sectioned too');
    assert.deepStrictEqual(app.pageErrors, []);
  } finally { await app.close(); }
});

maybe('a prediction becomes an Upcoming game without naming anyone twice', async () => {
  const app = await H.open();
  try {
    const r = await app.run(async () => {
      isUnlocked = true; currentUserName = 'Board';
      document.querySelector('#tabrow .tab-btn[data-tab="manage"]').click();
      adminOpenSections.predict = true; renderManage();
      const names = PLAYERS.slice(0, 4).map(p => p.name);
      const set = (id, v) => {
        const el = document.getElementById(id);
        el.value = v; el.dispatchEvent(new Event('input', { bubbles: true }));
      };
      set('predA1', names[0]); set('predA2', names[1]);
      set('predB1', names[2]); set('predB2', names[3]);
      const card = document.getElementById('predResult').textContent;

      document.getElementById('predUpPlace').value = 'Court 2';
      document.getElementById('predUpAdd').click();
      await new Promise(x => setTimeout(x, 250));

      const req = gameRequestsState[gameRequestsState.length - 1];
      return {
        names, card: card.replace(/\s+/g, ' '),
        requests: gameRequestsState.length,
        req,
        // The panel must survive the redraw that follows the write.
        stillFilled: document.getElementById('predA1').value,
        confirmation: (document.getElementById('predUpMessage') || {}).textContent || '',
      };
    });
    assert.strictEqual(r.requests, 1, 'exactly one Upcoming game, not two');
    assert.deepStrictEqual(r.req.players, r.names, 'the four players carry straight over');
    assert.deepStrictEqual(r.req.teams, [r.names.slice(0, 2), r.names.slice(2, 4)],
      'and so do the sides — a predicted matchup is about who partners whom');
    assert.strictEqual(r.req.status, 'confirmed');
    assert.strictEqual(r.req.preferredDate, '', 'an unknown date is allowed through, not blocked');
    assert.strictEqual(r.req.location, 'Court 2');
    assert.strictEqual(r.stillFilled, r.names[0], 'the prediction must survive its own redraw');
    assert.match(r.confirmation, /Added to Called Out/, 'no court booking was ticked, so it is Called Out');
    assert.strictEqual(r.req.courtBookingMade, false);
    // The agreed presentation, not the technical one it replaced.
    assert.match(r.card, /Expected to win about \d+% of the games/);
    assert.ok(!/expected score|blend|reliability/i.test(r.card),
      `the card has reverted to technical wording: ${r.card}`);
    assert.deepStrictEqual(app.pageErrors, []);
  } finally { await app.close(); }
});

maybe('an Upcoming game shows the same prediction, and only to an admin', async () => {
  const app = await H.open();
  try {
    const r = await app.run(async () => {
      const names = PLAYERS.slice(0, 4).map(p => p.name);
      gameRequestsState = [{
        id: 'req_test', requestedBy: 'Board', requestedAt: new Date().toISOString(),
        players: names, teams: [names.slice(0, 2), names.slice(2, 4)],
        preferredDate: '', preferredTime: '', location: '',
        confirmations: Object.fromEntries(names.map(n => [n, true])), status: 'confirmed',
      }];
      document.querySelector('#tabrow .tab-btn[data-tab="upcoming"]').click();

      // Upcoming fixtures are folded by default (27 Sep); the detail, and an
      // admin's prediction, are inside the opened card.
      isUnlocked = false; upcomingOpen = new Set(['req_test']); renderUpcoming();
      const asPlayer = {
        toggle: !!document.querySelector('.request-pred-toggle'),
        text: document.getElementById('upcomingView').textContent.replace(/\s+/g, ' '),
      };

      isUnlocked = true; renderUpcoming();
      document.querySelector('.request-pred-toggle').click();
      const onCard = document.getElementById('upcomingView').textContent.replace(/\s+/g, ' ');

      // The same matchup, straight from the module.
      const direct = predictMatchup(names.slice(0, 2), names.slice(2, 4));
      return { asPlayer, onCard, share: direct.favouredShare, tbc: asPlayer.text };
    });
    assert.strictEqual(r.asPlayer.toggle, false,
      'a normal player must not be offered the prediction');
    assert.ok(!/Expected to win about/.test(r.asPlayer.text),
      'and must not be shown it either');
    assert.match(r.onCard, /Expected to win about/, 'an admin gets it on the card');
    assert.match(r.onCard, new RegExp(`${r.share}%`),
      'and it is the same number the canonical calculation gives');
    assert.match(r.tbc, /Date TBC/, 'an unscheduled game says so rather than showing nothing');
    assert.deepStrictEqual(app.pageErrors, []);
  } finally { await app.close(); }
});

// Superseded in part by D3 (Shaun/CGPT, 27 Sep 2026): submitting a result from
// an Upcoming card no longer deletes the fixture. The player's choice of
// fixture travels with the submission as a proposal, and the fixture stays in
// Upcoming until an admin confirms the link when approving. Still one record
// each -- the fixture is never copied -- which is what this test protects.
maybe('Add result carries the agreed sides and proposes the fixture without closing it', async () => {
  const app = await H.open();
  try {
    const out = await app.run(async () => {
      setCurrentViewer(PLAYERS[0].name);
      const names = PLAYERS.slice(0, 4).map(p => p.name);
      gameRequestsState = [{
        id: 'req_life', requestedBy: 'Board', requestedAt: new Date().toISOString(),
        players: names, teams: [names.slice(0, 2), names.slice(2, 4)],
        preferredDate: '2026-12-29', preferredTime: '', location: 'Court 1',
        confirmations: Object.fromEntries(names.map(n => [n, true])), status: 'confirmed',
      }];
      document.querySelector('#tabrow .tab-btn[data-tab="upcoming"]').click();
      document.querySelector('.fx-head').click();
      document.querySelector('.request-addresult-btn').click();

      const prefilled = {
        tab: activeTab, linked: linkedRequestId,
        a1: document.getElementById('agA1').value, a2: document.getElementById('agA2').value,
        b1: document.getElementById('agB1').value, b2: document.getElementById('agB2').value,
        date: document.getElementById('agDate').value,
      };

      [6, 3, 6, 4].forEach((v, i) => {
        const el = document.querySelectorAll('#agSets input')[i];
        el.value = v; el.dispatchEvent(new Event('input', { bubbles: true }));
      });
      await submitNewGame();
      await new Promise(x => setTimeout(x, 250));

      document.querySelector('#tabrow .tab-btn[data-tab="upcoming"]').click();
      document.querySelector('.fx-head').click();
      const card = document.getElementById('upcomingView').textContent.replace(/\s+/g, ' ');
      return {
        prefilled, names,
        upcomingLeft: gameRequestsState.length,
        fixture: gameRequestsState[0] && { status: gameRequestsState[0].status, id: gameRequestsState[0].id },
        submissions: extraMatchesState.length,
        submitted: extraMatchesState[extraMatchesState.length - 1],
        card, addResultStillOffered: !!document.querySelector('.request-addresult-btn'),
      };
    });
    assert.strictEqual(out.prefilled.tab, 'games');
    assert.deepStrictEqual(
      [out.prefilled.a1, out.prefilled.a2, out.prefilled.b1, out.prefilled.b2], out.names,
      'the agreed sides carry into the form in the right order');
    assert.strictEqual(out.prefilled.date, '2026-12-29', 'and the agreed date with them');
    assert.strictEqual(out.submissions, 1, 'one submission');
    assert.strictEqual(out.upcomingLeft, 1, 'the fixture is still the one record it was');
    assert.deepStrictEqual(out.fixture, { status: 'confirmed', id: 'req_life' },
      'and it stays in Upcoming: a submission does not close a fixture');
    assert.strictEqual(out.submitted.fixtureId, 'req_life', 'the submission names the fixture it came from');
    assert.match(out.card, /Result submitted/, 'the card says a result is waiting for approval');
    assert.strictEqual(out.addResultStillOffered, false, 'and does not invite a second submission');
    assert.deepStrictEqual(app.pageErrors, []);
  } finally { await app.close(); }
});

maybe('creating an Upcoming game updates the screen without navigating away', async () => {
  const app = await H.open();
  try {
    const r = await app.run(async () => {
      isUnlocked = true; currentUserName = 'Board';
      // Sitting on Requests, where the admin add-straight-to-Upcoming form is.
      document.querySelector('#tabrow .tab-btn[data-tab="wishlist"]').click();
      requestSectionOpen.adminAdd = true; renderWishlist();
      const names = PLAYERS.slice(0, 4).map(p => p.name);
      ['adminReqP1', 'adminReqP2', 'adminReqP3', 'adminReqP4'].forEach((id, i) => {
        document.getElementById(id).value = names[i];
      });
      const before = document.getElementById('wishlistView').innerHTML;
      document.getElementById('adminReqSubmit').click();
      await new Promise(x => setTimeout(x, 250));
      return {
        changed: document.getElementById('wishlistView').innerHTML !== before,
        message: document.getElementById('wishlistView').textContent.includes('Added to Called Out'),
        stored: gameRequestsState.length,
      };
    });
    assert.strictEqual(r.stored, 1);
    assert.strictEqual(r.changed, true, 'the visible screen must react to the write');
    assert.strictEqual(r.message, true);
    assert.deepStrictEqual(app.pageErrors, []);
  } finally { await app.close(); }
});
