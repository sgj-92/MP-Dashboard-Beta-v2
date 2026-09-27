// ===================== FIXTURE FLOW (D1–D3) =====================
// Shaun/CGPT's fixture decisions of 27 Sep 2026, held to account:
//
//   D1  Players never delete a shared fixture. A participant can say they
//       can't play -- for themselves only -- and the fixture needs attention.
//       Removal is admin-only and takes an explicit confirmation.
//   D2  Confirmations belong to the player selected on this device. The
//       requester starts in; nobody answers for anybody else; 4/4 moves the
//       same record into Upcoming. Never via somebody's profile.
//   D3  A recorded result never closes an Upcoming fixture by itself. The app
//       may suggest; an admin decides, and "still outstanding" is remembered.
//
// Plus: Upcoming cards fold by default and open independently, stale
// historical fixtures are never bulk-modified, and nothing here moves a rating.

const test = require('node:test');
const assert = require('node:assert');
const H = require('./helpers/uiHarness.js');
const FF = require('../assets/js/fixtureFlow.js');

const maybe = H.available() ? test : test.skip;
// The clock these fixtures were written for. Without it the Called Out
// games below, agreed mid-September, would age into the archive as the real
// calendar moves on and quietly leave the lists these tests read.
const NOW = '2026-09-20T12:00:00.000Z';
const openApp = (opts) => H.open({ now: NOW, ...(opts || {}) });
const T0 = '2026-09-20T10:00:00.000Z';
const four = ['Ann', 'Bob', 'Cat', 'Dan'];
const upcoming = (extra) => ({
  id: 'fx1', requestedBy: 'Board', requestedAt: '2026-09-15T09:00:00.000Z',
  players: four.slice(), teams: [['Ann', 'Bob'], ['Cat', 'Dan']],
  preferredDate: '2026-09-18', confirmations: Object.fromEntries(four.map((n) => [n, true])),
  status: 'confirmed', ...extra,
});
const result = (extra) => ({ id: '2026-09-18-1', date: '2026-09-18', winners: ['Ann', 'Bob'], losers: ['Cat', 'Dan'], ...extra });

// --- D2: requests and confirmations, in the module ---------------------------

test('the requester starts confirmed: a four-player request opens at 1/4', () => {
  const r = FF.createRequest({ players: four, requestedBy: 'Bob', at: T0 });
  assert.strictEqual(r.status, 'pending');
  assert.strictEqual(FF.confirmedCount(r), 1);
  assert.deepStrictEqual(r.confirmations, { Ann: false, Bob: true, Cat: false, Dan: false });
  assert.deepStrictEqual(r.history.map((h) => [h.by, h.action]), [['Bob', 'requested'], ['Bob', 'in']]);
  // Someone arranging a game they are not in is not counted as playing it.
  assert.strictEqual(FF.confirmedCount(FF.createRequest({ players: four, requestedBy: 'Shaun', at: T0 })), 0);
});

test('each participant answers only for themselves; a non-participant cannot answer at all', () => {
  const r = FF.createRequest({ players: four, requestedBy: 'Ann', at: T0 });
  assert.deepStrictEqual(FF.respond(r, 'Cat', 'in', T0), { ok: true, player: 'Cat' });
  assert.deepStrictEqual(r.confirmations, { Ann: true, Bob: false, Cat: true, Dan: false }, 'only Cat changed');
  const before = JSON.stringify(r);
  assert.deepStrictEqual(FF.respond(r, 'Zed', 'in', T0), { ok: false, reason: 'not-participant' });
  assert.deepStrictEqual(FF.respond(r, 'Zed', 'cant', T0), { ok: false, reason: 'not-participant' });
  assert.strictEqual(JSON.stringify(r), before, 'a refused answer changes nothing');
});

test('4/4 moves the SAME record on as an agreed fixture, with no copy made', () => {
  const r = FF.createRequest({ players: four, requestedBy: 'Ann', at: T0 });
  const id = r.id;
  ['Bob', 'Cat', 'Dan'].forEach((n) => FF.respond(r, n, 'in', T0));
  assert.strictEqual(r.status, 'confirmed');
  assert.strictEqual(r.id, id, 'same identity');
  assert.strictEqual(r.history[r.history.length - 1].action, 'agreed');
  assert.strictEqual(r.history[r.history.length - 1].by, 'Dan', 'the transition is attributed to whoever completed it');
  assert.strictEqual(r.agreedAt, T0);
});

// --- D1: can't play and removal, in the module --------------------------------

test("a participant's \"can't play\" is theirs alone, flags the fixture and deletes nothing", () => {
  const f = upcoming();
  assert.deepStrictEqual(FF.respond(f, 'bob', 'cant', T0), { ok: true, player: 'Bob' }, 'matched to the recorded name');
  assert.strictEqual(f.status, 'confirmed', 'still an Upcoming fixture');
  assert.deepStrictEqual(FF.cantPlayers(f), ['Bob']);
  assert.strictEqual(FF.needsAttention(f), true);
  assert.deepStrictEqual(f.confirmations, { Ann: true, Bob: false, Cat: true, Dan: true }, 'nobody else touched');
  assert.deepStrictEqual(f.history.at(-1), { at: T0, by: 'Bob', action: 'cant-play' }, 'attributed and dated');
  // And back again.
  FF.respond(f, 'Bob', 'in', T0);
  assert.strictEqual(FF.needsAttention(f), false);
});

test('removal is admin-only and needs an explicit confirmation; it keeps the history', () => {
  const f = upcoming();
  assert.deepStrictEqual(FF.adminRemove(f, { isAdmin: false, confirmed: true, by: 'Ann' }), { ok: false, reason: 'not-admin' },
    'a participant cannot remove the shared fixture');
  assert.deepStrictEqual(FF.adminRemove(f, { isAdmin: true, by: 'Shaun' }), { ok: false, reason: 'unconfirmed' });
  assert.strictEqual(f.status, 'confirmed');
  assert.deepStrictEqual(FF.adminRemove(f, { isAdmin: true, confirmed: true, by: 'Shaun', at: T0 }), { ok: true });
  assert.strictEqual(f.status, 'removed');
  assert.deepStrictEqual([f.removedBy, f.history.at(-1).action], ['Shaun', 'removed']);
});

// --- D3: candidates are evidence, never authority -------------------------------

test('matching only suggests: finding a candidate changes nothing', () => {
  const f = upcoming();
  const before = JSON.stringify(f);
  const c = FF.candidatesForResult(result(), [f]);
  assert.strictEqual(c.length, 1);
  assert.deepStrictEqual(c[0].reasons, ['Same four players', 'Same partnerships', 'Played on the scheduled date']);
  assert.strictEqual(JSON.stringify(f), before, 'the fixture is untouched by being matched');
  assert.strictEqual(f.status, 'confirmed');
});

test('only a credible candidate is offered at all', () => {
  const f = upcoming();
  assert.strictEqual(FF.candidatesForResult(result({ losers: ['Cat', 'Eve'] }), [f]).length, 0, 'different players');
  assert.strictEqual(FF.candidatesForResult(result({ date: '2026-09-10' }), [f]).length, 0, 'played before it was arranged');
  assert.strictEqual(FF.candidatesForResult(result({ date: '2026-11-30' }), [f]).length, 0, 'far outside the scheduled date');
  assert.strictEqual(FF.candidatesForResult(result(), [upcoming({ status: 'pending' })]).length, 0, 'not an Upcoming game yet');
  const swapped = FF.candidatesForResult(result({ winners: ['Ann', 'Cat'], losers: ['Bob', 'Dan'] }), [f]);
  assert.strictEqual(swapped.length, 1, 'changed partnerships are still worth asking about');
  assert.ok(swapped[0].reasons.includes('Different partnerships'));
});

test('"This was the game" links and closes that fixture, with provenance; only an admin can', () => {
  const f = upcoming();
  assert.deepStrictEqual(FF.reconcile(f, { isAdmin: false, resultId: '2026-09-18-1', by: 'Ann' }), { ok: false, reason: 'not-admin' });
  assert.deepStrictEqual(FF.reconcile(f, { isAdmin: true, resultId: '2026-09-18-1', by: 'Shaun', at: T0 }), { ok: true });
  assert.deepStrictEqual([f.status, f.playedMatchId, f.reconciledBy], ['played', '2026-09-18-1', 'Shaun']);
  assert.deepStrictEqual(f.history.at(-1), { at: T0, by: 'Shaun', action: 'played', resultId: '2026-09-18-1' });
  assert.strictEqual(FF.candidatesForResult(result({ id: 'another' }), [f]).length, 0, 'a played fixture is never offered again');
});

test('"Still outstanding" keeps the fixture and never proposes that result for it again', () => {
  const f = upcoming();
  FF.keepOutstanding(f, { isAdmin: true, resultId: '2026-09-18-1', by: 'Shaun', at: T0 });
  assert.strictEqual(f.status, 'confirmed');
  assert.deepStrictEqual(f.notResults, ['2026-09-18-1']);
  assert.strictEqual(FF.candidatesForResult(result(), [f]).length, 0, 'that result is not proposed again');
  assert.strictEqual(FF.candidatesForResult(result({ id: '2026-09-19-1', date: '2026-09-19' }), [f]).length, 1, 'but another result still can be');
});

test('a result already linked to one fixture is not offered for another', () => {
  const played = upcoming({ id: 'fxA', status: 'played', playedMatchId: '2026-09-18-1' });
  const other = upcoming({ id: 'fxB' });
  const offered = FF.candidatesForFixture(other, [result()], { linkedResultIds: FF.linkedResultIds([played, other]) });
  assert.strictEqual(offered.length, 0);
});

// --- in the app -------------------------------------------------------------

// A small club drawn from the fixture's real players, so ratings resolve.
const club = (requests, extra) => ({ moneypadel_game_requests: requests, ...(extra || {}) });

// The seed's September runs to the 18th; results are appended after it.
const SIDES = [['Shaun', 'Tom'], ['Max', 'KC']];
const P4 = SIDES.flat();
const agreed = (id, extra) => ({
  id, requestedBy: 'Board', requestedAt: '2026-09-15T09:00:00.000Z',
  players: P4.slice(), teams: SIDES.map((s) => s.slice()),
  preferredDate: '2026-09-18', preferredTime: '', location: 'Court 1',
  confirmations: Object.fromEntries(P4.map((n) => [n, true])), status: 'confirmed', ...extra,
});
const pendingReq = (id, confirmedList) => ({
  id, requestedBy: 'Shaun', requestedAt: '2026-09-15T09:00:00.000Z', players: P4.slice(), preferredDate: '',
  confirmations: Object.fromEntries(P4.map((n) => [n, confirmedList.includes(n)])), status: 'pending',
});

// Everything a page needs to do in these tests, installed once per page.
const install = (app) => app.run(() => {
  window.goUpcoming = () => { document.querySelector('#tabrow .tab-btn[data-tab="findgame"]').click(); document.querySelector('#tabrow .tab-btn[data-tab="upcoming"]').click(); };
  window.goRequests = () => { document.querySelector('#tabrow .tab-btn[data-tab="wishlist"]').click(); };
  window.cardFor = (id) => document.querySelector(`#upcomingView .fx-card[data-fixture-id="${id}"], #wishlistView .fx-card[data-fixture-id="${id}"]`);
  window.buttonsIn = (el) => [...(el ? el.querySelectorAll('button') : [])].map((b) => b.textContent.replace(/\s+/g, ' ').trim());
  window.submit = (id, winners, losers, extra) => extraMatchesState.push({
    id, date: '2026-09-18', winners, losers, sets: [[6, 3], [6, 4]], type: 'doubles', note: '',
    status: 'pending', submittedBy: 'Tester', ...(extra || {}) });
});

maybe('D1: a non-participant gets no withdraw or remove control; a participant cannot remove the fixture', async () => {
  const app = await openApp({ club: club([agreed('fxUp')]) });
  try {
    await install(app);
    const r = await app.run(() => {
      const look = (viewer) => {
        setCurrentViewer(viewer); goUpcoming(); cardFor('fxUp').querySelector('.fx-head').click();
        return buttonsIn(cardFor('fxUp'));
      };
      return { outsider: look('Rishi'), participant: look('Tom') };
    });
    assert.ok(!r.outsider.some((b) => /can.t play|remove|withdraw|cancel/i.test(b)), `outsider saw: ${r.outsider}`);
    assert.ok(r.participant.some((b) => /can.t play/i.test(b)), 'a participant can say they cannot play');
    assert.ok(!r.participant.some((b) => /remove|delete|cancel/i.test(b)), `participant saw: ${r.participant}`);
    assert.deepStrictEqual(app.pageErrors, []);
  } finally { await app.close(); }
});

maybe('D1: "I can\'t play" marks only the viewer, keeps the fixture listed and flags it', async () => {
  const app = await openApp({ club: club([agreed('fxUp')]) });
  try {
    await install(app);
    const r = await app.run(async () => {
      setCurrentViewer('Tom'); goUpcoming(); cardFor('fxUp').querySelector('.fx-head').click();
      [...cardFor('fxUp').querySelectorAll('.fx-respond')].find((b) => /can.t play/i.test(b.textContent)).click();
      await new Promise((x) => setTimeout(x, 150));
      const f = gameRequestsState.find((x) => x.id === 'fxUp');
      const stored = JSON.parse(window.__writes.filter((w) => w.id === 'moneypadel_game_requests').at(-1).doc.value);
      return {
        status: f.status, confirmations: f.confirmations, cant: Object.keys(f.cantPlay || {}),
        last: f.history.at(-1), stored: stored[0].cantPlay,
        stillListed: !!cardFor('fxUp'), folded: cardFor('fxUp').querySelector('.fx-head').textContent,
      };
    });
    assert.strictEqual(r.status, 'confirmed');
    assert.deepStrictEqual(r.cant, ['Tom']);
    assert.deepStrictEqual(r.confirmations, { Shaun: true, Tom: false, Max: true, KC: true });
    assert.deepStrictEqual([r.last.by, r.last.action], ['Tom', 'cant-play']);
    assert.ok(r.stored && r.stored.Tom, 'the reason is stored with the fixture');
    assert.strictEqual(r.stillListed, true);
    assert.match(r.folded, /Needs attention/);
    assert.deepStrictEqual(app.pageErrors, []);
  } finally { await app.close(); }
});

maybe('D1: an admin removes a fixture only after a second, explicit confirmation', async () => {
  const app = await openApp({ club: club([agreed('fxUp')]) });
  try {
    await install(app);
    const r = await app.run(async () => {
      isUnlocked = true; currentUserName = 'Shaun'; setCurrentViewer('Rishi');
      goUpcoming(); cardFor('fxUp').querySelector('.fx-head').click();
      // Removal is not a card action: it sits inside Manage fixture.
      const onCard = !!cardFor('fxUp').querySelector('.fx-remove-arm');
      cardFor('fxUp').querySelector('.fx-manage-toggle').click();
      cardFor('fxUp').querySelector('.fx-remove-arm').click();
      const armed = { onCard, status: gameRequestsState[0].status, writes: window.__writes.length, text: cardFor('fxUp').textContent };
      cardFor('fxUp').querySelector('.fx-remove-yes').click();
      await new Promise((x) => setTimeout(x, 150));
      return { armed, status: gameRequestsState[0].status, by: gameRequestsState[0].removedBy, listed: !!cardFor('fxUp') };
    });
    assert.strictEqual(r.armed.onCard, false, 'Remove is not on the card itself');
    assert.strictEqual(r.armed.status, 'confirmed', 'the first tap only asks');
    assert.strictEqual(r.armed.writes, 0, 'and writes nothing');
    assert.match(r.armed.text, /Remove this fixture for everyone\?/);
    assert.deepStrictEqual([r.status, r.by, r.listed], ['removed', 'Shaun', false]);
    assert.deepStrictEqual(app.pageErrors, []);
  } finally { await app.close(); }
});

maybe('D2: a request made in the app starts with its requester confirmed', async () => {
  const app = await openApp();
  try {
    await install(app);
    const r = await app.run(async () => {
      setCurrentViewer('Tom'); goRequests();
      requestSectionOpen.request = true; renderWishlist();
      ['Shaun', 'Tom', 'Max', 'KC'].forEach((n, i) => { document.getElementById(`reqP${i + 1}`).value = n; });
      document.getElementById('reqSubmit').click();
      await new Promise((x) => setTimeout(x, 150));
      const req = gameRequestsState.at(-1);
      return { status: req.status, confirmations: req.confirmations, count: document.querySelector('#wishlistView .fx-count').textContent };
    });
    assert.strictEqual(r.status, 'pending');
    assert.deepStrictEqual(r.confirmations, { Shaun: false, Tom: true, Max: false, KC: false });
    // Under My Requests, in the requester's words for it.
    assert.match(r.count, /^1\/4 agreed · Waiting for Shaun, Max, KC/);
    assert.deepStrictEqual(app.pageErrors, []);
  } finally { await app.close(); }
});

maybe('D2: the Pending card answers only for the selected player, and 4/4 moves the same record to Upcoming', async () => {
  const app = await openApp({ club: club([pendingReq('fxP', ['Shaun', 'Tom'])]) });
  try {
    await install(app);
    const r = await app.run(async () => {
      const buttonsFor = (viewer) => { setCurrentViewer(viewer); goRequests(); return buttonsIn(cardFor('fxP')); };
      const outsider = buttonsFor('Rishi');
      buttonsFor('Max');
      [...cardFor('fxP').querySelectorAll('.fx-respond')].find((b) => /i'm in/i.test(b.textContent)).click();
      await new Promise((x) => setTimeout(x, 150));
      const afterMax = { ...gameRequestsState[0].confirmations };
      buttonsFor('KC');
      [...cardFor('fxP').querySelectorAll('.fx-respond')].find((b) => /i'm in/i.test(b.textContent)).click();
      await new Promise((x) => setTimeout(x, 150));
      goUpcoming();
      return { outsider, afterMax, status: gameRequestsState[0].status, id: gameRequestsState[0].id,
        records: gameRequestsState.length, inUpcoming: !!cardFor('fxP') };
    });
    assert.ok(!r.outsider.some((b) => /i'm in|can.t play/i.test(b)), `a non-participant was offered: ${r.outsider}`);
    assert.deepStrictEqual(r.afterMax, { Shaun: true, Tom: true, Max: true, KC: false }, "Max's tap confirmed Max only");
    assert.deepStrictEqual([r.status, r.id, r.records, r.inUpcoming], ['confirmed', 'fxP', 1, true]);
    assert.deepStrictEqual(app.pageErrors, []);
  } finally { await app.close(); }
});

maybe("D2: another player's profile cannot be used to confirm as that player", async () => {
  const app = await openApp({ club: club([pendingReq('fxP', ['Shaun'])]) });
  try {
    const r = await app.run(async () => {
      setCurrentViewer('Rishi');
      openSheet('Tom');
      await new Promise((x) => setTimeout(x, 200));
      const sheet = document.getElementById('overlay');
      const controls = [...sheet.querySelectorAll('button')].map((b) => b.textContent.trim());
      return {
        controls,
        confirmControls: sheet.querySelectorAll('.confirm-request-btn, .fx-respond').length,
        mentionsRequests: /Game requests involving you/.test(sheet.innerHTML),
        tom: gameRequestsState[0].confirmations.Tom,
      };
    });
    assert.strictEqual(r.confirmControls, 0, `profile offered: ${r.controls}`);
    assert.strictEqual(r.mentionsRequests, false, 'the profile carries no request section at all');
    assert.strictEqual(r.tom, false);
    assert.deepStrictEqual(app.pageErrors, []);
  } finally { await app.close(); }
});

maybe('Upcoming: every fixture is folded on arrival, opens on its own, and folds again on return', async () => {
  const app = await openApp({ club: club([agreed('fx1'), agreed('fx2', { requestedAt: '2026-09-16T09:00:00.000Z' })]) });
  try {
    await install(app);
    const r = await app.run(() => {
      const open = () => [...document.querySelectorAll('#upcomingView .fx-card')].filter((c) => c.querySelector('.fx-body')).map((c) => c.dataset.fixtureId);
      goUpcoming();
      const onArrival = open();
      const head = document.querySelector('#upcomingView .fx-head');
      const target = { h: head.getBoundingClientRect().height, w: head.getBoundingClientRect().width, expanded: head.getAttribute('aria-expanded') };
      cardFor('fx2').querySelector('.fx-head').click();
      const one = open();
      cardFor('fx1').querySelector('.fx-head').click();
      const both = open();
      cardFor('fx2').querySelector('.fx-head').click();
      const firstOnly = open();
      goUpcoming();
      return { onArrival, one, both: both.sort(), firstOnly, again: open(), target,
        collapseAll: /collapse all/i.test(document.getElementById('upcomingView').textContent) };
    });
    assert.deepStrictEqual(r.onArrival, [], 'folded by default');
    assert.deepStrictEqual(r.one, ['fx2']);
    assert.deepStrictEqual(r.both, ['fx1', 'fx2']);
    assert.deepStrictEqual(r.firstOnly, ['fx1'], 'each closes on its own');
    assert.deepStrictEqual(r.again, [], 'folded again on arriving back');
    assert.ok(r.target.h >= 44, `the folded card is a generous target (${r.target.h}px)`);
    assert.strictEqual(r.target.expanded, 'false');
    assert.strictEqual(r.collapseAll, false, 'no global Collapse All');
    assert.deepStrictEqual(app.pageErrors, []);
  } finally { await app.close(); }
});

maybe('Upcoming at 375px: the folded card keeps teams, date, venue and confirmations without overflow', async () => {
  const app = await openApp({ club: club([agreed('fx1', { courtBookingMade: true })]) });
  try {
    await install(app);
    await app.page.setViewportSize({ width: 375, height: 812 });
    const r = await app.run(() => {
      goUpcoming();
      const c = cardFor('fx1');
      return { text: c.textContent.replace(/\s+/g, ' '), overflow: c.scrollWidth > c.clientWidth + 1 || document.documentElement.scrollWidth > window.innerWidth + 1 };
    });
    assert.match(r.text, /Shaun & Tom vs Max & KC/);
    assert.match(r.text, /Fri 18 Sep · Court 1 4\/4 confirmed · Court booked/);
    assert.strictEqual(r.overflow, false);
  } finally { await app.close(); }
});

// --- D3 in the app: approval asks, never assumes ---------------------------------

const approve = (app, choose) => app.run(async (choice) => {
  isUnlocked = true; currentUserName = 'Shaun';
  recomputeAll();
  await prepareApproval('sub1');
  const plan = approvalPlan && { cands: approvalPlan.fixtureCandidates.map((c) => c.id), choice: approvalPlan.fixtureChoice, matchId: approvalPlan.matchId,
    moved: approvalPlan.planned.playersMoved.map((p) => [p.playerId, p.delta]) };
  const writesBeforeRefusal = window.__writes.length;
  await commitApproval(); // without a choice
  const refused = { rated: ALL_MATCHES.some((m) => m.id === plan.matchId), writes: window.__writes.length - writesBeforeRefusal, message: approvalMessage };
  document.querySelector('#tabrow .tab-btn[data-tab="games"]').click();
  const radios = [...document.querySelectorAll('input[name="fxChoice"]')].map((x) => ({ value: x.value, checked: x.checked }));
  const disabled = !!(document.getElementById('approveConfirmBtn') || {}).disabled;
  if (choice) {
    const r = document.querySelector(`input[name="fxChoice"][value="${choice}"]`);
    r.checked = true; r.dispatchEvent(new Event('change'));
    await commitApproval();
  }
  return { plan, refused, radios, disabled,
    fixtures: gameRequestsState.map((f) => ({ id: f.id, status: f.status, playedMatchId: f.playedMatchId || null, notResults: f.notResults || [], last: (f.history || []).at(-1) || null })),
    rated: ALL_MATCHES.some((m) => m.id === plan.matchId), message: approvalMessage };
}, choose);

maybe('D3: a recorded result does not close a matching Upcoming fixture; the admin must answer first', async () => {
  const app = await openApp({ club: club([agreed('fxUp')]) });
  try {
    await install(app);
    await app.run(() => submit('sub1', ['Shaun', 'Tom'], ['Max', 'KC']));
    const r = await approve(app, null);
    assert.deepStrictEqual(r.plan.cands, ['fxUp'], 'the matching fixture is offered');
    assert.strictEqual(r.plan.choice, null, 'nothing is chosen for the admin');
    assert.deepStrictEqual(r.radios.map((x) => x.checked), [false, false], 'no option preselected');
    assert.strictEqual(r.disabled, true, 'Rate it is disabled until the admin answers');
    assert.strictEqual(r.refused.rated, false, 'and committing without an answer rates nothing');
    assert.strictEqual(r.refused.writes, 0);
    assert.deepStrictEqual(r.fixtures.map((f) => f.status), ['confirmed'], 'the fixture is untouched');
    assert.deepStrictEqual(app.pageErrors, []);
  } finally { await app.close(); }
});

maybe('D3: "This was the game" rates the result, then links and closes exactly that fixture', async () => {
  const app = await openApp({ club: club([agreed('fxUp'), agreed('fxOther', { players: ['Rishi', 'Len', 'Osh', 'Eli'], teams: [['Rishi', 'Len'], ['Osh', 'Eli']] })]) });
  try {
    await install(app);
    await app.run(() => submit('sub1', ['Shaun', 'Tom'], ['Max', 'KC'], { fixtureId: 'fxUp' }));
    const r = await approve(app, 'fxUp');
    assert.strictEqual(r.rated, true);
    const up = r.fixtures.find((f) => f.id === 'fxUp');
    assert.deepStrictEqual([up.status, up.playedMatchId], ['played', r.plan.matchId]);
    assert.deepStrictEqual([up.last.by, up.last.action, up.last.resultId], ['Shaun', 'played', r.plan.matchId], 'provenance: who and which result');
    assert.deepStrictEqual(r.fixtures.find((f) => f.id === 'fxOther').status, 'confirmed', 'no other fixture touched');
    assert.match(r.message, /marked played/);
    assert.deepStrictEqual(app.pageErrors, []);
  } finally { await app.close(); }
});

maybe('D3: "still outstanding" rates the result and keeps the fixture, which is never offered that result again', async () => {
  const app = await openApp({ club: club([agreed('fxUp')]) });
  try {
    await install(app);
    await app.run(() => submit('sub1', ['Shaun', 'Tom'], ['Max', 'KC']));
    const r = await approve(app, 'none');
    assert.strictEqual(r.rated, true, 'the result is valid regardless');
    const up = r.fixtures[0];
    assert.deepStrictEqual([up.status, up.notResults], ['confirmed', [r.plan.matchId]]);
    const reoffered = await app.run((id) => FixtureFlow.candidatesForFixture(gameRequestsState[0], getAllApprovedMatches(),
      { canon: playerIdFor, linkedResultIds: FixtureFlow.linkedResultIds(gameRequestsState) }).map((c) => c.result.id).includes(id), r.plan.matchId);
    assert.strictEqual(reoffered, false, 'not auto-matched to that result later');
    assert.deepStrictEqual(app.pageErrors, []);
  } finally { await app.close(); }
});

maybe('D3: with several plausible fixtures, none is resolved silently; the admin picks one or none', async () => {
  const repeat = agreed('fxSecond', { requestedAt: '2026-09-16T09:00:00.000Z', preferredDate: '2026-09-19' });
  const app = await openApp({ club: club([agreed('fxFirst'), repeat]) });
  try {
    await install(app);
    await app.run(() => submit('sub1', ['Shaun', 'Tom'], ['Max', 'KC']));
    const r = await approve(app, 'fxSecond');
    assert.deepStrictEqual(r.plan.cands.slice().sort(), ['fxFirst', 'fxSecond'], 'both offered');
    assert.strictEqual(r.refused.rated, false, 'no answer, no rating');
    assert.deepStrictEqual(r.radios.map((x) => x.value).sort(), ['fxFirst', 'fxSecond', 'none']);
    assert.ok(r.radios.every((x) => !x.checked), 'the likelier one is not preselected');
    const by = Object.fromEntries(r.fixtures.map((f) => [f.id, f]));
    assert.strictEqual(by.fxSecond.status, 'played');
    assert.deepStrictEqual([by.fxFirst.status, by.fxFirst.notResults], ['confirmed', [r.plan.matchId]], 'the other stays outstanding');
    assert.deepStrictEqual(app.pageErrors, []);
  } finally { await app.close(); }
});

maybe('D3: a stale fixture with a matching recorded result is left exactly as stored until an admin decides', async () => {
  // The audit's case: agreed for a date, played and recorded that day, never
  // closed. A real recorded September match -- one whose four players have no
  // other result that day, so it is the single credible candidate -- and a
  // fixture for those four on that date.
  const app = await openApp();
  let real;
  try {
    real = await app.run(() => {
      const all = getAllApprovedMatches();
      const key = (x) => x.date + '#' + [...x.winners, ...x.losers].map((n) => n.toLowerCase()).sort().join('|');
      const count = new Map();
      all.forEach((x) => count.set(key(x), (count.get(key(x)) || 0) + 1));
      const m = all.filter((x) => x.date.startsWith('2026-09') && x.winners.length === 2 && !x.isDraw && count.get(key(x)) === 1).at(-1);
      return { id: m.id, date: m.date, winners: m.winners, losers: m.losers };
    });
  } finally { await app.close(); }
  const stale = {
    id: 'fxStale', requestedBy: 'Shaun', requestedAt: `${real.date}T08:00:00.000Z`,
    players: [...real.winners, ...real.losers], teams: [real.winners, real.losers],
    preferredDate: real.date, preferredTime: '14:00', location: 'Epsom',
    confirmations: Object.fromEntries([...real.winners, ...real.losers].map((n) => [n, true])), status: 'confirmed',
  };
  const app2 = await openApp({ club: club([stale]) });
  try {
    await install(app2);
    const r = await app2.run(async () => {
      // Visit every fixture screen as an admin, the way the reconciliation is found.
      isUnlocked = true; currentUserName = 'Shaun';
      goRequests(); goUpcoming();
      cardFor('fxStale').querySelector('.fx-head').click();
      document.querySelector('#tabrow .tab-btn[data-tab="games"]').click();
      goUpcoming(); cardFor('fxStale').querySelector('.fx-head').click();
      const offered = cardFor('fxStale').querySelector('.fx-reconcile') ? cardFor('fxStale').querySelector('.fx-reconcile').textContent.replace(/\s+/g, ' ') : null;
      const untouched = { writes: window.__writes.filter((w) => w.id === 'moneypadel_game_requests').length, status: gameRequestsState[0].status };
      const yes = cardFor('fxStale').querySelectorAll('.fx-reconcile-yes');
      const clicked = yes[0].dataset.resultId;
      yes[0].click();
      await new Promise((x) => setTimeout(x, 150));
      return { offered, untouched, candidates: yes.length, clicked, after: { status: gameRequestsState[0].status, played: gameRequestsState[0].playedMatchId } };
    });
    assert.deepStrictEqual(r.untouched, { writes: 0, status: 'confirmed' }, 'loading and browsing never bulk-closes a stale fixture');
    // Made without a booking fact, so it is listed as Called Out -- and a
    // result is still only ever a question.
    assert.match(r.offered, /Does this recorded result belong to this Called Out game\?/);
    assert.match(r.offered, /This was the game/);
    assert.match(r.offered, /Called Out game is still outstanding/);
    assert.deepStrictEqual([r.candidates, r.clicked], [1, real.id]);
    assert.deepStrictEqual(r.after, { status: 'played', played: real.id }, 'only the admin decision closes it');
    assert.deepStrictEqual(app2.pageErrors, []);
  } finally { await app2.close(); }
});

maybe('D3: a past fixture with no plausible result stays in Upcoming for later manual resolution', async () => {
  const app = await openApp({ club: club([agreed('fxPast', { players: ['Rishi', 'Len', 'Osh', 'Eli'], teams: [['Rishi', 'Len'], ['Osh', 'Eli']], preferredDate: '2026-09-17', requestedAt: '2026-09-16T09:00:00.000Z' })]) });
  try {
    await install(app);
    const r = await app.run(() => {
      isUnlocked = true; currentUserName = 'Shaun';
      goUpcoming(); cardFor('fxPast').querySelector('.fx-head').click();
      return { listed: !!cardFor('fxPast'), text: cardFor('fxPast').textContent.replace(/\s+/g, ' '),
        reconcile: !!cardFor('fxPast').querySelector('.fx-reconcile'), status: gameRequestsState[0].status,
        writes: window.__writes.length };
    });
    assert.deepStrictEqual([r.listed, r.status, r.reconcile, r.writes], [true, 'confirmed', false, 0]);
    assert.match(r.text, /Date passed/);
    assert.deepStrictEqual(app.pageErrors, []);
  } finally { await app.close(); }
});

maybe('ratings are untouched by the fixture decision: the same plan with or without an Upcoming game', async () => {
  const plans = [];
  for (const requests of [[], [agreed('fxUp')]]) {
    const app = await openApp({ club: club(requests) });
    try {
      await install(app);
      plans.push(await app.run(async () => {
        isUnlocked = true; currentUserName = 'Shaun';
        submit('sub1', ['Shaun', 'Tom'], ['Max', 'KC']);
        recomputeAll();
        await prepareApproval('sub1');
        return { matchId: approvalPlan.matchId, moved: approvalPlan.planned.playersMoved, docs: approvalPlan.planned.documentsToWrite };
      }));
    } finally { await app.close(); }
  }
  assert.deepStrictEqual(plans[1], plans[0], 'an Upcoming fixture changes nothing about how a result is rated');
});
