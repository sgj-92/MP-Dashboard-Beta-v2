// ===================== MY REQUESTS, ADD MULTIPLE GAMES, ARCHIVED CALL-OUTS =====================
// Shaun/CGPT's fixture follow-up 2 of 27 Sep 2026, held to account:
//
//   - Requests splits, for the selected player, into For me (waiting on my
//     answer), My Requests (I asked, others haven't all answered) and the
//     rest. Views over the same records: a request is never copied.
//   - A pasted list of games is parsed, reviewed, and only then created --
//     each an ordinary request by the selected player. Names resolve only
//     against the directory and are never guessed.
//   - A Called Out game leaves the active list after 14 days without a court
//     booking, into Archived call-outs: not deleted, not cancelled. Only an
//     admin's Restore (or coming back from Upcoming) restarts the clock;
//     editing the date, time or venue does not.
//   - Every list has an explicit order.

const test = require('node:test');
const assert = require('node:assert');
const H = require('./helpers/uiHarness.js');
const FF = require('../assets/js/fixtureFlow.js');
const FP = require('../assets/js/fixtureParse.js');

const maybe = H.available() ? test : test.skip;
const DAY = 24 * 60 * 60 * 1000;
const T0 = '2026-09-01T10:00:00.000Z';
const plus = (iso, days) => new Date(Date.parse(iso) + days * DAY).toISOString();
const ADMIN = { isAdmin: true, by: 'Shaun' };
const four = ['Erf', 'Eli', 'Osh', 'Stormz'];

// Requested by Erf at T0, everyone in at T0: Called Out from T0.
const calledOut = (extra) => {
  const r = FF.createRequest({ players: four, requestedBy: 'Erf', at: T0, id: 'fxC', teams: [['Erf', 'Eli'], ['Osh', 'Stormz']] });
  ['Eli', 'Osh', 'Stormz'].forEach((n) => FF.respond(r, n, 'in', T0));
  return Object.assign(r, extra || {});
};
const DIR = ['Shaun', 'PDM', 'Rishi', 'Erf', 'Tom', 'Osh', 'KC', 'Len', 'Eli', 'Jords', 'Antz', 'Ant Slice', 'Max', 'Rocky', 'Stormzy'];

// --- requests: who asked, and in what order -----------------------------------

test('a request keeps who asked, when, its identity and each answer; the requester starts in', () => {
  const r = FF.createRequest({ players: ['Shaun', 'PDM', 'Rishi', 'Erf'], requestedBy: 'Shaun', at: T0, id: 'fxR',
    teams: [['Shaun', 'PDM'], ['Rishi', 'Erf']] });
  assert.deepStrictEqual([r.id, r.requestedBy, r.requestedAt, r.status], ['fxR', 'Shaun', T0, 'pending']);
  assert.deepStrictEqual(r.confirmations, { Shaun: true, PDM: false, Rishi: false, Erf: false });
  assert.deepStrictEqual(r.teams, [['Shaun', 'PDM'], ['Rishi', 'Erf']]);
  FF.respond(r, 'PDM', 'in', plus(T0, 1));
  assert.deepStrictEqual([r.requestedBy, r.requestedAt], ['Shaun', T0], 'answers never touch who asked or when');
});

test('requests sort newest first by when they were made; a pasted list keeps its written order', () => {
  const at = (id, requestedAt, batch) => ({ id, requestedAt, ...(batch ? { batch } : {}) });
  const list = [at('old', '2026-09-01T09:00:00.000Z'), at('b2', '2026-09-03T09:00:00.000Z', { id: 'x', index: 2, size: 3 }),
    at('new', '2026-09-04T09:00:00.000Z'), at('b0', '2026-09-03T09:00:00.000Z', { id: 'x', index: 0, size: 3 }),
    at('b1', '2026-09-03T09:00:00.000Z', { id: 'x', index: 1, size: 3 })];
  assert.deepStrictEqual(list.slice().sort(FF.requestOrder).map((r) => r.id), ['new', 'b0', 'b1', 'b2', 'old']);
  assert.deepStrictEqual(list.slice().reverse().sort(FF.requestOrder).map((r) => r.id), ['new', 'b0', 'b1', 'b2', 'old'], 'whatever order storage returned');
});

// --- the parser ------------------------------------------------------------------

test('the parser reads several lines and every common separator', () => {
  const rows = FP.parse([
    'Me & PDM vs Rishi & Erf',
    'Shaun/PDM v Tom/Osh',
    '',
    'Me and KC against Len and Eli',
    'Jords + Antz v Max + Rocky',
    '- Tom, Osh versus Len & Eli',
  ].join('\n'), { directory: DIR, me: 'Shaun' });
  assert.strictEqual(rows.length, 5, 'blank lines are skipped');
  const teams = rows.map((r) => FP.review(r).teams);
  assert.deepStrictEqual(teams, [
    [['Shaun', 'PDM'], ['Rishi', 'Erf']],
    [['Shaun', 'PDM'], ['Tom', 'Osh']],
    [['Shaun', 'KC'], ['Len', 'Eli']],
    [['Jords', 'Antz'], ['Max', 'Rocky']],
    [['Tom', 'Osh'], ['Len', 'Eli']],
  ]);
  assert.ok(rows.every((r) => FP.review(r).ready));
  assert.deepStrictEqual(rows.map((r) => r.lineNo), [1, 2, 4, 5, 6], 'lines are numbered as written');
});

test('"Me" is the selected player, and nobody at all when no player is selected', () => {
  const [row] = FP.parse('me & PDM vs Rishi & Erf', { directory: DIR, me: 'KC' });
  assert.deepStrictEqual(FP.review(row).teams[0], ['KC', 'PDM']);
  const [nobody] = FP.parse('Me & PDM vs Rishi & Erf', { directory: DIR, me: null });
  const v = FP.review(nobody);
  assert.strictEqual(v.ready, false);
  assert.deepStrictEqual(v.issues.map((i) => i.kind), ['no-self']);
});

test('an ambiguous name is never chosen for the person; it blocks the game until they choose', () => {
  const [row] = FP.parse('Jords + Ant v Max + Rocky', { directory: DIR, me: 'Shaun' });
  const before = FP.review(row);
  assert.strictEqual(before.ready, false);
  assert.deepStrictEqual(before.issues.map((i) => i.kind), ['ambiguous']);
  assert.match(before.issues[0].message, /"Ant" could be Antz or Ant Slice — choose one\./);
  assert.strictEqual(before.teams[0][1], null, 'no silent pick');
  const after = FP.review(row, { 0: ['Jords', 'Ant Slice'] });
  assert.strictEqual(after.ready, true);
  assert.deepStrictEqual(after.teams, [['Jords', 'Ant Slice'], ['Max', 'Rocky']]);
});

test('an unknown name is flagged, and a near miss is offered but not taken', () => {
  const [row] = FP.parse('Stormz & Bob vs Len & Eli', { directory: DIR, me: 'Shaun' });
  const v = FP.review(row);
  assert.strictEqual(v.ready, false);
  assert.deepStrictEqual(v.issues.map((i) => [i.kind, i.seat]), [['unconfirmed', [0, 0]], ['unknown', [0, 1]]]);
  assert.match(v.issues[0].message, /Did you mean Stormzy\?/);
  assert.deepStrictEqual(v.teams[0], [null, null], 'Stormzy is suggested, never assumed');
});

test('malformed games are named: no sides, a gap, the wrong number of players', () => {
  const rows = FP.parse(['PDM and me', 'Shaun & vs Tom & Osh', 'Shaun & PDM & Tom vs Osh', 'Shaun v Tom', 'A vs B vs C'].join('\n'),
    { directory: DIR, me: 'Shaun' });
  const kinds = rows.map((r) => FP.review(r).issues.map((i) => i.kind));
  assert.deepStrictEqual(kinds, [
    ['unparseable'],
    ['incomplete', 'player-count'],
    ['player-count'],
    ['player-count'],
    ['unparseable'],
  ]);
  assert.ok(rows.every((r) => !FP.review(r).ready));
});

test('the same player twice in one game is rejected', () => {
  const [row] = FP.parse('Shaun & Me vs Tom & Osh', { directory: DIR, me: 'Shaun' });
  const v = FP.review(row);
  assert.strictEqual(v.ready, false);
  assert.deepStrictEqual(v.issues.map((i) => i.kind), ['duplicate-player']);
});

test('an active fixture with the same four players is a warning, never a merge', () => {
  const pending = FF.createRequest({ players: four, requestedBy: 'Erf', at: T0, id: 'fxP' });
  const co = calledOut({ id: 'fxCO' });
  const archived = calledOut({ id: 'fxOld', archivedAt: plus(T0, 2), archivedBy: 'Shaun' });
  const removed = calledOut({ id: 'fxGone', status: 'removed' });
  const all = [pending, co, archived, removed];
  const before = JSON.stringify(all);
  const found = FF.matchupDuplicates(['Stormz', 'Osh', 'Eli', 'Erf'], all, { now: plus(T0, 5), teams: [['Erf', 'Eli'], ['Osh', 'Stormz']] });
  assert.deepStrictEqual(found.map((d) => [d.fixture.id, d.stage, d.samePartnerships]),
    [['fxP', 'proposed', true], ['fxCO', 'called-out', true]], 'archived and removed games are not active');
  assert.strictEqual(JSON.stringify(all), before, 'nothing merged or changed');
  assert.deepStrictEqual(FF.matchupDuplicates(['Erf', 'Eli', 'Osh', 'Tom'], all, { now: plus(T0, 5) }), [], 'a different four is not a duplicate');
});

// --- the archive clock -----------------------------------------------------------

test('a Called Out game archives itself 14 days after it was called out, and nothing in it changes', () => {
  const r = calledOut();
  assert.strictEqual(r.calledOutAt, T0, 'the clock start is stored explicitly');
  assert.strictEqual(r.activeSince, T0);
  const before = JSON.stringify(r);
  assert.strictEqual(FF.stage(r, plus(T0, 13.9)), FF.STAGE.CALLED_OUT);
  assert.strictEqual(FF.stage(r, plus(T0, 14)), FF.STAGE.ARCHIVED);
  assert.deepStrictEqual(FF.archiveInfo(r, plus(T0, 30)), { at: plus(T0, 14), by: null, auto: true });
  assert.strictEqual(JSON.stringify(r), before, 'archiving is read from the clock: no write, no deletion, no new status');
  assert.strictEqual(r.status, 'confirmed');
  assert.strictEqual(FF.candidatesForResult({ id: 'm1', date: '2026-09-20', winners: ['Erf', 'Eli'], losers: ['Osh', 'Stormz'] }, [r]).length, 1,
    'an archived call-out can still be matched to a result, by an admin');
});

test('an admin can archive an active call-out by hand; a player cannot', () => {
  const r = calledOut();
  const at = plus(T0, 3);
  assert.strictEqual(FF.archiveCallOut(r, { isAdmin: false, by: 'Erf', at }).reason, 'not-admin');
  assert.deepStrictEqual(FF.archiveCallOut(r, { ...ADMIN, at }), { ok: true });
  assert.strictEqual(FF.stage(r, plus(T0, 4)), FF.STAGE.ARCHIVED);
  assert.deepStrictEqual(FF.archiveInfo(r, plus(T0, 4)), { at, by: 'Shaun', auto: false });
  assert.deepStrictEqual([r.id, r.players, r.status, r.calledOutAt], ['fxC', four, 'confirmed', T0]);
  assert.deepStrictEqual(r.history.at(-1), { at, by: 'Shaun', action: 'archived' });
  assert.strictEqual(FF.archiveCallOut(r, { ...ADMIN, at: plus(T0, 5) }).reason, 'not-called-out', 'only an active call-out');
  assert.strictEqual(FF.respond(r, 'Osh', 'cant', plus(T0, 5)).reason, 'archived', 'an archived call-out is not answered');
});

test('Restore keeps everything, restarts the 14 days, and leaves the original call-out time alone', () => {
  const r = calledOut({ preferredDate: '2026-09-10', preferredTime: '20:00', location: 'PadelX' });
  const snapshot = { id: r.id, requestedBy: r.requestedBy, requestedAt: r.requestedAt, players: r.players.slice(),
    confirmations: { ...r.confirmations }, teams: JSON.parse(JSON.stringify(r.teams)), date: r.preferredDate, time: r.preferredTime, venue: r.location };
  const restoreAt = plus(T0, 20); // auto-archived at T0 + 14
  assert.strictEqual(FF.restoreCallOut(r, { isAdmin: false, at: restoreAt }).reason, 'not-admin');
  assert.strictEqual(FF.restoreCallOut(calledOut(), { ...ADMIN, at: plus(T0, 2) }).reason, 'not-archived');
  const historyBefore = r.history.length;
  assert.deepStrictEqual(FF.restoreCallOut(r, { ...ADMIN, at: restoreAt }), { ok: true });
  assert.deepStrictEqual({ id: r.id, requestedBy: r.requestedBy, requestedAt: r.requestedAt, players: r.players,
    confirmations: r.confirmations, teams: r.teams, date: r.preferredDate, time: r.preferredTime, venue: r.location }, snapshot);
  assert.strictEqual(r.calledOutAt, T0, 'history is not rewritten to make the timer work');
  assert.strictEqual(r.agreedAt, T0);
  assert.deepStrictEqual([r.activeSince, r.restoredAt], [restoreAt, restoreAt]);
  assert.strictEqual(FF.stage(r, restoreAt), FF.STAGE.CALLED_OUT);
  assert.strictEqual(FF.stage(r, plus(restoreAt, 13.9)), FF.STAGE.CALLED_OUT);
  assert.strictEqual(FF.stage(r, plus(restoreAt, 14)), FF.STAGE.ARCHIVED, 'a fresh 14 days, then archived again');
  assert.strictEqual(r.history.length, historyBefore + 1);
  assert.deepStrictEqual(r.history.at(-1), { at: restoreAt, by: 'Shaun', action: 'restored', archivedAt: plus(T0, 14), archivedBy: 'auto' });
});

test('changing the proposed date, time or venue does not restart the clock', () => {
  const r = calledOut();
  const out = FF.adminEdit(r, { date: '2026-09-30', time: '19:00', venue: 'Epsom' }, { ...ADMIN, at: plus(T0, 12) });
  assert.ok(out.ok && out.changes === 1);
  assert.deepStrictEqual([r.calledOutAt, r.activeSince], [T0, T0]);
  assert.strictEqual(FF.stage(r, plus(T0, 14)), FF.STAGE.ARCHIVED, '"Tuesday" becoming "Thursday" keeps nothing alive');
});

test('Court booking made takes a game out of Called Out and its clock, even once archived', () => {
  const r = calledOut();
  FF.setCourtBooking(r, { ...ADMIN, booked: true, at: plus(T0, 5) });
  assert.strictEqual(FF.stage(r, plus(T0, 60)), FF.STAGE.UPCOMING, 'Upcoming never ages into the archive');
  const stale = calledOut({ id: 'fxS' });
  FF.archiveCallOut(stale, { ...ADMIN, at: plus(T0, 3) });
  FF.setCourtBooking(stale, { ...ADMIN, booked: true, at: plus(T0, 20) });
  assert.strictEqual(FF.stage(stale, plus(T0, 20)), FF.STAGE.UPCOMING);
  assert.strictEqual(stale.archivedAt, undefined);
  assert.deepStrictEqual(stale.history.at(-1).fromArchive, { at: plus(T0, 3), auto: false }, 'where it came from is kept');
  // Unbooked again: it did progress, so it starts a new window. When it was
  // first called out is left as it was.
  FF.setCourtBooking(stale, { ...ADMIN, booked: false, at: plus(T0, 25) });
  assert.deepStrictEqual([stale.calledOutAt, stale.activeSince], [T0, plus(T0, 25)]);
  assert.strictEqual(FF.stage(stale, plus(T0, 26)), FF.STAGE.CALLED_OUT);
});

test('a game first booked, then unbooked, is called out from that moment', () => {
  const r = FF.createAgreed({ players: four, by: 'Shaun', at: T0, courtBookingMade: true });
  assert.strictEqual(r.calledOutAt, undefined, 'never Called Out yet');
  FF.setCourtBooking(r, { ...ADMIN, booked: false, at: plus(T0, 9) });
  assert.deepStrictEqual([r.calledOutAt, r.activeSince], [plus(T0, 9), plus(T0, 9)]);
});

test('a fixture from before the clock was stored runs from when it was made, and only as far as it is read', () => {
  const legacy = { id: 'old', requestedBy: 'Shaun', requestedAt: T0, players: four.slice(), preferredDate: '',
    confirmations: Object.fromEntries(four.map((n) => [n, true])), status: 'confirmed', courtBookingMade: false };
  assert.deepStrictEqual([FF.calledOutAt(legacy), FF.activeSince(legacy)], [T0, T0]);
  assert.strictEqual(FF.stage(legacy, plus(T0, 14)), FF.STAGE.ARCHIVED);
  assert.strictEqual(legacy.calledOutAt, undefined, 'reading writes nothing');
  FF.adminEdit(legacy, { venue: 'Epsom' }, { ...ADMIN, at: plus(T0, 3) });
  assert.strictEqual(legacy.calledOutAt, T0, 'the first write records the same start, not the moment of the edit');
});

test('orders: Called Out newest first, archived most recent first, Upcoming soonest first with TBC times last on the day', () => {
  const co = (id, activeSince) => ({ id, activeSince });
  assert.deepStrictEqual([co('a', plus(T0, 1)), co('c', plus(T0, 5)), co('b', plus(T0, 3))].sort(FF.calledOutOrder).map((r) => r.id), ['c', 'b', 'a']);
  const now = plus(T0, 40);
  const arch = (id, extra) => calledOut({ id, ...extra });
  const archived = [arch('auto14', {}), arch('byHand', { archivedAt: plus(T0, 30), archivedBy: 'Shaun' }), arch('restoredThenAuto', { activeSince: plus(T0, 20) })];
  assert.deepStrictEqual(archived.sort(FF.archivedOrder(now)).map((r) => r.id), ['restoredThenAuto', 'byHand', 'auto14'], 'archived at T0+34, T0+30, T0+14');
  const up = (id, preferredDate, preferredTime) => ({ id, preferredDate, preferredTime, requestedAt: T0 });
  const upcoming = [up('undated', '', ''), up('d2tbc', '2026-10-02', ''), up('d2late', '2026-10-02', '20:00'), up('d1', '2026-10-01', '21:00'), up('d2early', '2026-10-02', '09:30')];
  assert.deepStrictEqual(upcoming.sort(FF.upcomingOrder).map((r) => r.id), ['d1', 'd2early', 'd2late', 'd2tbc', 'undated']);
});

// --- in the app ---------------------------------------------------------------------

const NOW = '2026-09-27T12:00:00.000Z';
const P4 = ['Shaun', 'PDM', 'Rishi', 'Erf'];
const request = (id, requestedAt, confirmed, extra) => ({
  id, requestedBy: 'Shaun', requestedAt, players: P4.slice(), teams: [['Shaun', 'PDM'], ['Rishi', 'Erf']], preferredDate: '',
  confirmations: Object.fromEntries(P4.map((n) => [n, confirmed.includes(n)])), status: 'pending', courtBookingMade: false, ...extra,
});
const agreedFixture = (id, activeSince, extra) => ({
  id, requestedBy: 'Shaun', requestedAt: activeSince, agreedAt: activeSince, calledOutAt: activeSince, activeSince,
  players: ['Tom', 'Osh', 'Len', 'Eli'], teams: [['Tom', 'Osh'], ['Len', 'Eli']], preferredDate: '', preferredTime: '', location: '',
  confirmations: { Tom: true, Osh: true, Len: true, Eli: true }, status: 'confirmed', courtBookingMade: false, ...extra,
});
const open = (requests) => H.open({ now: NOW, club: { moneypadel_game_requests: requests } });
const install = (app) => app.run(() => {
  window.goRequests = () => { document.querySelector('#tabrow .tab-btn[data-tab="findgame"]').click(); document.querySelector('#tabrow .tab-btn[data-tab="wishlist"]').click(); };
  window.goUpcoming = () => { document.querySelector('#tabrow .tab-btn[data-tab="findgame"]').click(); document.querySelector('#tabrow .tab-btn[data-tab="upcoming"]').click(); };
  window.idsIn = (bodyId) => [...document.querySelectorAll(`#${bodyId} .fx-card`)].map((c) => c.dataset.fixtureId);
  window.cardFor = (id) => document.querySelector(`.fx-card[data-fixture-id="${id}"]`);
  window.settle = () => new Promise((x) => setTimeout(x, 150));
  window.writesOf = () => window.__writes.filter((w) => w.id === 'moneypadel_game_requests').length;
});

maybe('My Requests shows what I asked for, For me what waits on me, newest first, and nobody else sees mine as theirs', async () => {
  const app = await open([
    request('older', '2026-09-25T09:00:00.000Z', ['Shaun', 'PDM']),
    request('newer', '2026-09-27T09:00:00.000Z', ['Shaun', 'PDM']),
    request('mid', '2026-09-26T09:00:00.000Z', ['Shaun']),
  ]);
  try {
    await install(app);
    const r = await app.run(() => {
      const look = (viewer) => { setCurrentViewer(viewer); goRequests(); return { forMe: idsIn('reqFoldForMeBody'), mine: idsIn('reqFoldMineBody') }; };
      const shaun = look('Shaun');
      const card = cardFor('newer').textContent.replace(/\s+/g, ' ');
      return { shaun, card, rishi: look('Rishi'), pdm: look('PDM'), tom: look('Tom') };
    });
    assert.deepStrictEqual(r.shaun, { forMe: [], mine: ['newer', 'mid', 'older'] }, 'newest first');
    assert.match(r.card, /Shaun & PDM vs Rishi & Erf/);
    assert.match(r.card, /2\/4 agreed · Waiting for Rishi, Erf/);
    assert.match(r.card, /Requested today/);
    assert.deepStrictEqual(r.rishi, { forMe: ['newer', 'mid', 'older'], mine: [] }, 'a participant answers from For me, newest first');
    assert.deepStrictEqual(r.pdm, { forMe: ['mid'], mine: [] }, 'only what still waits on PDM');
    assert.deepStrictEqual(r.tom, { forMe: [], mine: [] }, 'another player never sees these as his');
    assert.deepStrictEqual(app.pageErrors, []);
  } finally { await app.close(); }
});

maybe('a request that gets its four leaves the request lists and appears once, as the same record, in Called Out', async () => {
  const app = await open([request('fxR', '2026-09-27T09:00:00.000Z', ['Shaun', 'PDM', 'Rishi'])]);
  try {
    await install(app);
    const r = await app.run(async () => {
      setCurrentViewer('Erf'); goRequests();
      const before = { forMe: idsIn('reqFoldForMeBody') };
      [...cardFor('fxR').querySelectorAll('.fx-respond')].find((b) => /i'm in/i.test(b.textContent)).click();
      await settle();
      const erf = { forMe: idsIn('reqFoldForMeBody'), mine: idsIn('reqFoldMineBody') };
      setCurrentViewer('Shaun'); goRequests();
      const shaun = { forMe: idsIn('reqFoldForMeBody'), mine: idsIn('reqFoldMineBody') };
      requestSectionOpen.others = true; goRequests();
      const others = idsIn('reqFoldOthersBody');
      goUpcoming();
      return { before, erf, shaun, others, calledOut: idsIn('upFoldCalledOutBody'), records: gameRequestsState.length,
        cards: document.querySelectorAll('.fx-card[data-fixture-id="fxR"]').length };
    });
    assert.deepStrictEqual(r.before.forMe, ['fxR']);
    assert.deepStrictEqual([r.erf, r.shaun, r.others], [{ forMe: [], mine: [] }, { forMe: [], mine: [] }, []]);
    assert.deepStrictEqual([r.calledOut, r.records, r.cards], [['fxR'], 1, 1]);
    assert.deepStrictEqual(app.pageErrors, []);
  } finally { await app.close(); }
});

maybe("a \"can't play\" on my request keeps it in My Requests, needing attention", async () => {
  const app = await open([request('fxR', '2026-09-27T09:00:00.000Z', ['Shaun'], { cantPlay: { Rishi: { at: '2026-09-27T10:00:00.000Z' } } })]);
  try {
    await install(app);
    const r = await app.run(() => { setCurrentViewer('Shaun'); goRequests(); return { mine: idsIn('reqFoldMineBody'), text: cardFor('fxR').textContent.replace(/\s+/g, ' ') }; });
    assert.deepStrictEqual(r.mine, ['fxR']);
    assert.match(r.text, /Needs attention Rishi can't play · 1\/4 agreed · Waiting for PDM, Erf/);
    assert.deepStrictEqual(app.pageErrors, []);
  } finally { await app.close(); }
});

maybe('Add multiple games: parse, review, resolve, and only then create — each an ordinary request by me', async () => {
  const app = await open([agreedFixture('fxExisting', '2026-09-25T09:00:00.000Z', {
    players: ['Shaun', 'PDM', 'Tom', 'Osh'], teams: [['Shaun', 'PDM'], ['Tom', 'Osh']], confirmations: { Shaun: true, PDM: true, Tom: true, Osh: true } })]);
  try {
    await install(app);
    const r = await app.run(async () => {
      setCurrentViewer('Shaun'); goRequests();
      requestSectionOpen.bulk = true; renderWishlist();
      document.getElementById('bulkText').value = [
        'Me & PDM vs Rishi & Erf',
        'Shaun/PDM v Tom/Osh',
        'Me and KC against Len and Eli',
        'Jords + Ant v Max + Rocky',
        'Stormz & Bob vs Len & Eli',
        'PDM and me',
      ].join('\n');
      document.getElementById('bulkText').dispatchEvent(new Event('input'));
      document.getElementById('bulkParse').click();
      const body = () => document.getElementById('reqFoldBulkBody').textContent.replace(/\s+/g, ' ');
      const reviewed = { text: body(), writes: writesOf(), records: gameRequestsState.length,
        button: document.getElementById('bulkCreate').textContent.trim() };
      // Resolve the ambiguous "Ant".
      const ant = document.querySelector('.fx-bulk-seat[data-line="4"][data-side="0"][data-seat="1"]');
      const antOptions = [...ant.querySelectorAll('optgroup[label="Could be"] option')].map((o) => o.value);
      ant.value = 'Antz'; ant.dispatchEvent(new Event('change'));
      const afterChoice = { button: document.getElementById('bulkCreate').textContent.trim(), writes: writesOf() };
      // Correct a game that was read fine but isn't what was meant: KC -> Max.
      const seatsBefore = document.querySelectorAll('.fx-bulk-seat[data-line="3"]').length;
      document.querySelector('.fx-bulk-change[data-line="3"]').click();
      const kc = document.querySelector('.fx-bulk-seat[data-line="3"][data-side="0"][data-seat="1"]');
      kc.value = 'Max'; kc.dispatchEvent(new Event('change'));
      afterChoice.seatsBefore = seatsBefore;
      document.getElementById('bulkCreate').click();
      await settle();
      const made = gameRequestsState.filter((x) => x.batch);
      return { reviewed, antOptions, afterChoice, made: made.map((x) => ({ teams: x.teams, by: x.requestedBy, status: x.status,
        in: Object.keys(x.confirmations).filter((n) => x.confirmations[n]), index: x.batch.index, size: x.batch.size })),
        records: gameRequestsState.length, mine: idsIn('reqFoldMineBody').length,
        mineOrder: idsIn('reqFoldMineBody').map((id) => gameRequestsState.find((x) => x.id === id).batch.index) };
    });
    assert.match(r.reviewed.text, /6 games found · 3 ready · 3 need fixing/);
    assert.match(r.reviewed.text, /"Ant" could be Ant Slice or Antz — choose one\./);
    assert.match(r.reviewed.text, /"Stormz" isn't a player name\. Did you mean Stormzy\?/);
    assert.match(r.reviewed.text, /"Bob" isn't in the player directory\./);
    assert.match(r.reviewed.text, /No "vs" found/);
    assert.match(r.reviewed.text, /This matchup already exists in Called Out, with the same partnerships\./);
    assert.deepStrictEqual([r.reviewed.writes, r.reviewed.records, r.reviewed.button], [0, 1, 'Create 3 requests'], 'nothing written before the review is confirmed');
    assert.deepStrictEqual(r.antOptions, ['Ant Slice', 'Antz']);
    assert.deepStrictEqual(r.afterChoice, { button: 'Create 4 requests', writes: 0, seatsBefore: 0 }, 'a ready game is shown as read until you choose to change it');
    assert.deepStrictEqual(r.made.map((x) => x.teams), [
      [['Shaun', 'PDM'], ['Rishi', 'Erf']], [['Shaun', 'PDM'], ['Tom', 'Osh']], [['Shaun', 'Max'], ['Len', 'Eli']], [['Jords', 'Antz'], ['Max', 'Rocky']]]);
    assert.ok(r.made.every((x) => x.by === 'Shaun' && x.status === 'pending' && x.size === 4));
    assert.deepStrictEqual(r.made.map((x) => x.in), [['Shaun'], ['Shaun'], ['Shaun'], []], 'the requester starts in wherever he plays');
    assert.strictEqual(r.records, 5, 'the duplicate was warned about, not merged: 1 existing + 4 new');
    assert.deepStrictEqual([r.mine, r.mineOrder], [4, [0, 1, 2, 3]], 'under My Requests, in the order written');
    assert.deepStrictEqual(app.pageErrors, []);
  } finally { await app.close(); }
});

maybe('Called Out, Archived call-outs and Upcoming each list in their own order; the archive arrives folded and nothing is written', async () => {
  const days = (n) => new Date(Date.parse(NOW) - n * DAY).toISOString();
  const booked = (id, preferredDate, preferredTime) => agreedFixture(id, days(2), { courtBookingMade: true, preferredDate, preferredTime });
  const app = await open([
    agreedFixture('co3d', days(3)), agreedFixture('co1d', days(1)), agreedFixture('co13d', days(13)),
    agreedFixture('restored', days(30), { activeSince: days(5), restoredAt: days(5) }),
    agreedFixture('arch20', days(20)), agreedFixture('arch16', days(16)),
    agreedFixture('byHand', days(4), { archivedAt: days(1), archivedBy: 'Shaun' }),
    booked('tbc', '2026-10-02', ''), booked('late', '2026-10-02', '20:00'), booked('early', '2026-10-02', '09:30'),
    booked('first', '2026-09-30', '21:00'), booked('undated', '', ''),
  ]);
  try {
    await install(app);
    const r = await app.run(() => {
      goUpcoming();
      const folded = { archivedCards: idsIn('upFoldArchivedBody').length, heading: document.getElementById('upFoldArchived').textContent.replace(/\s+/g, ' ') };
      document.getElementById('upFoldArchived').click();
      return { folded, calledOut: idsIn('upFoldCalledOutBody'), archived: idsIn('upFoldArchivedBody'), upcoming: idsIn('upFoldUpcomingBody'),
        writes: writesOf(), archivedText: cardFor('arch16').querySelector('.fx-head').textContent.replace(/\s+/g, ' '),
        restoredText: cardFor('restored').querySelector('.fx-head').textContent.replace(/\s+/g, ' ') };
    });
    assert.strictEqual(r.folded.archivedCards, 0, 'Archived call-outs arrive folded');
    assert.match(r.folded.heading, /Archived call-outs \(3\)/);
    assert.deepStrictEqual(r.calledOut, ['co1d', 'co3d', 'restored', 'co13d'], 'newest or newly restored first');
    assert.deepStrictEqual(r.archived, ['byHand', 'arch16', 'arch20'], 'most recently archived first (1, 2 and 6 days ago)');
    assert.deepStrictEqual(r.upcoming, ['first', 'early', 'late', 'tbc', 'undated'], 'soonest first; a TBC time after the timed games that day');
    assert.strictEqual(r.writes, 0, 'nothing is written to archive a stale call-out');
    assert.match(r.archivedText, /Archived 2d ago · after 14 days unbooked/);
    assert.match(r.restoredText, /Restored 5d ago/);
    assert.deepStrictEqual(app.pageErrors, []);
  } finally { await app.close(); }
});

maybe('Manage fixture archives a call-out and restores it: the same fixture, a fresh 14 days, its history kept', async () => {
  const start = '2026-09-20T09:00:00.000Z';
  const app = await open([agreedFixture('fxA', start, { preferredDate: '2026-10-01', location: 'PadelX' })]);
  try {
    await install(app);
    const r = await app.run(async () => {
      isUnlocked = true; currentUserName = 'Shaun'; setCurrentViewer('Rishi');
      goUpcoming();
      const manage = (id) => { if (!cardFor(id).querySelector('.fx-body')) cardFor(id).querySelector('.fx-head').click(); cardFor(id).querySelector('.fx-manage-toggle').click(); return cardFor(id).querySelector('.fx-manage'); };
      const firstPanel = manage('fxA');
      const offered = { archive: !!firstPanel.querySelector('.fx-archive'), restore: !!firstPanel.querySelector('.fx-restore') };
      firstPanel.querySelector('.fx-archive').click();
      await settle();
      const archived = { inArchive: (upcomingSectionOpen.archived = true, renderUpcoming(), idsIn('upFoldArchivedBody')), calledOut: idsIn('upFoldCalledOutBody'),
        stored: { archivedAt: gameRequestsState[0].archivedAt, by: gameRequestsState[0].archivedBy } };
      const panel = manage('fxA');
      const restoreOffered = !!panel.querySelector('.fx-restore');
      panel.querySelector('.fx-restore').click();
      await settle();
      const f = gameRequestsState[0];
      return { offered, archived, restoreOffered, after: { calledOut: idsIn('upFoldCalledOutBody'), archived: idsIn('upFoldArchivedBody'),
        id: f.id, records: gameRequestsState.length, calledOutAt: f.calledOutAt, activeSince: f.activeSince, restoredAt: f.restoredAt,
        details: [f.preferredDate, f.location], confirmations: f.confirmations, actions: f.history.map((h) => h.action) } };
    });
    assert.deepStrictEqual(r.offered, { archive: true, restore: false });
    assert.deepStrictEqual(r.archived.inArchive, ['fxA']);
    assert.deepStrictEqual(r.archived.calledOut, []);
    assert.strictEqual(r.archived.stored.by, 'Shaun');
    assert.strictEqual(r.restoreOffered, true);
    assert.deepStrictEqual([r.after.calledOut, r.after.archived, r.after.id, r.after.records], [['fxA'], [], 'fxA', 1]);
    assert.strictEqual(r.after.calledOutAt, start, 'the original call-out time is kept');
    assert.strictEqual(r.after.activeSince, r.after.restoredAt, 'the active window restarts at the restore');
    assert.ok(r.after.restoredAt >= '2026-09-27', `restored at the reader's now (${r.after.restoredAt})`);
    assert.deepStrictEqual(r.after.details, ['2026-10-01', 'PadelX']);
    assert.deepStrictEqual(r.after.confirmations, { Tom: true, Osh: true, Len: true, Eli: true });
    assert.deepStrictEqual(r.after.actions.slice(-2), ['archived', 'restored']);
    assert.deepStrictEqual(app.pageErrors, []);
  } finally { await app.close(); }
});

maybe('players see an archived call-out but cannot answer, archive or restore it', async () => {
  const app = await open([agreedFixture('fxOld', '2026-09-01T09:00:00.000Z'), agreedFixture('fxNow', '2026-09-26T09:00:00.000Z', { players: ['Tom', 'Osh', 'Rishi', 'Erf'], teams: [['Tom', 'Osh'], ['Rishi', 'Erf']], confirmations: { Tom: true, Osh: true, Rishi: true, Erf: true } })]);
  try {
    await install(app);
    const r = await app.run(() => {
      setCurrentViewer('Tom'); goUpcoming();
      document.getElementById('upFoldArchived').click();
      cardFor('fxOld').querySelector('.fx-head').click();
      cardFor('fxNow').querySelector('.fx-head').click();
      const buttons = (id) => [...cardFor(id).querySelectorAll('.fx-body button')].map((b) => b.textContent.replace(/\s+/g, ' ').trim());
      return { old: buttons('fxOld'), now: buttons('fxNow'), note: cardFor('fxOld').querySelector('.fx-body').textContent.replace(/\s+/g, ' ') };
    });
    assert.ok(!r.old.some((b) => /can.t play|i'm in|archive|restore|manage|remove/i.test(b)), `archived card offered: ${r.old}`);
    assert.ok(r.now.some((b) => /can.t play/i.test(b)), 'an active call-out still can be answered');
    assert.ok(!r.now.some((b) => /archive|restore|manage/i.test(b)));
    assert.match(r.note, /Not cancelled and not deleted/);
    assert.deepStrictEqual(app.pageErrors, []);
  } finally { await app.close(); }
});

maybe('nothing here moves a rating, and D3 still asks about an archived call-out', async () => {
  const plans = [];
  for (const requests of [[], [agreedFixture('fxOld', '2026-09-01T09:00:00.000Z', { players: ['Shaun', 'Tom', 'Max', 'KC'], teams: [['Shaun', 'Tom'], ['Max', 'KC']],
    confirmations: { Shaun: true, Tom: true, Max: true, KC: true } })]]) {
    const app = await open(requests);
    try {
      plans.push(await app.run(async () => {
        isUnlocked = true; currentUserName = 'Shaun';
        extraMatchesState.push({ id: 'sub1', date: '2026-09-18', winners: ['Shaun', 'Tom'], losers: ['Max', 'KC'], sets: [[6, 3], [6, 4]],
          type: 'doubles', note: '', status: 'pending', submittedBy: 'Tester' });
        recomputeAll();
        await prepareApproval('sub1');
        const plan = { matchId: approvalPlan.matchId, moved: approvalPlan.planned.playersMoved, docs: approvalPlan.planned.documentsToWrite };
        const cands = approvalPlan.fixtureCandidates.map((c) => c.id);
        renderGamesTab();
        const question = ((document.querySelector('#gamesView .fx-reconcile') || {}).textContent || '').replace(/\s+/g, ' ');
        await commitApproval();
        return { plan, cands, question, rated: ALL_MATCHES.some((m) => m.id === plan.matchId), statuses: gameRequestsState.map((f) => f.status) };
      }));
    } finally { await app.close(); }
  }
  const [none, withArchived] = plans;
  assert.deepStrictEqual(withArchived.cands, ['fxOld']);
  assert.match(withArchived.question, /Does this result belong to this archived call-out\?/);
  assert.deepStrictEqual([withArchived.rated, withArchived.statuses], [false, ['confirmed']], 'no answer, no rating, no closure');
  assert.deepStrictEqual(withArchived.plan, none.plan, 'an archived call-out changes nothing about how a result is rated');
});
