// ===================== PLAY VIEW (PHASE 2 VIEW-MODEL) =====================
// domain/fixtures/playView.js decides which fixtures a player sees in My Games
// and what the whole club sees in Club -- by FixtureFlow's own stages and
// orders, never a second reading of them.

const test = require('node:test');
const assert = require('node:assert');
const FF = require('../assets/js/fixtureFlow.js');
const PV = require('../assets/js/domain/fixtures/playView.js');

const T = (d) => new Date(Date.parse('2026-09-20T10:00:00Z') + d * 864e5).toISOString();
const NOW = T(8);
const ids = (list) => list.map((x) => (x.req || x).id);

function world() {
  const req = (id, players, by, d, extra) => FF.createRequest({ players, requestedBy: by, at: T(d), id, ...(extra || {}) });
  const agree = (r, d) => { r.players.forEach((n) => { if (!r.confirmations[n]) FF.respond(r, n, 'in', T(d)); }); return r; };
  const answerMe = req('answerMe', ['Rishi', 'Erf', 'PDM', 'KC'], 'Rishi', 1);
  const mineWaiting = req('mineWaiting', ['PDM', 'Tom', 'Osh', 'Eli'], 'PDM', 2);
  const askedNotPlaying = req('askedNotPlaying', ['Len', 'Kaz', 'Osh', 'KC'], 'PDM', 3);
  const saidCant = req('saidCant', ['Len', 'PDM', 'Eli', 'Tom'], 'Len', 4);
  FF.respond(saidCant, 'PDM', 'cant', T(4.1));
  const booked = agree(req('booked', ['PDM', 'Kaz', 'Tom', 'Eli'], 'Kaz', 0, { preferredDate: '2026-10-06' }), 0.2);
  FF.setCourtBooking(booked, { isAdmin: true, booked: true, by: 'Shaun', at: T(1) });
  const booked2 = agree(req('booked2', ['PDM', 'Osh', 'Len', 'KC'], 'Osh', 0, { preferredDate: '2026-10-02' }), 0.2);
  FF.setCourtBooking(booked2, { isAdmin: true, booked: true, by: 'Shaun', at: T(1) });
  const calledOut = agree(req('calledOut', ['PDM', 'Rishi', 'Len', 'Erf'], 'Rishi', 5), 5.5);
  const attention = agree(req('attention', ['Osh', 'PDM', 'Len', 'Kaz'], 'Osh', 0), 0.5);
  FF.respond(attention, 'Len', 'cant', T(2));
  const iBackedOut = agree(req('iBackedOut', ['PDM', 'KC', 'Eli', 'Erf'], 'KC', 0), 0.5);
  FF.respond(iBackedOut, 'PDM', 'cant', T(2));
  const replacement = agree(req('replacement', ['Osh', 'Stormz', 'Len', 'Kaz'], 'Osh', 0), 0.5);
  FF.replacePlayer(replacement, 'Stormz', 'PDM', { isAdmin: true, by: 'Shaun', at: T(3) });
  const archived = agree(req('archived', ['PDM', 'Tom', 'Rishi', 'Erf'], 'Tom', -20), -19);
  const elsewhere = agree(req('elsewhere', ['Rishi', 'Erf', 'Osh', 'KC'], 'Rishi', 6), 6.5);
  const removed = agree(req('removed', ['PDM', 'Tom', 'Osh', 'KC'], 'Tom', 6), 6.5);
  FF.adminRemove(removed, { isAdmin: true, confirmed: true, by: 'Shaun', at: T(7) });
  return [answerMe, mineWaiting, askedNotPlaying, saidCant, booked, booked2, calledOut, attention, iBackedOut, replacement, archived, elsewhere, removed];
}

test('My Games puts each of the player\'s fixtures in exactly one place, by FixtureFlow\'s stage', () => {
  const g = PV.myGames(world(), 'PDM', NOW);
  assert.deepStrictEqual(ids(g.needsYou).sort(), ['answerMe', 'attention', 'replacement']);
  assert.deepStrictEqual(g.needsYou.find((x) => x.req.id === 'replacement').why, 'answer', 'a replacement answers for themselves');
  assert.deepStrictEqual(g.needsYou.find((x) => x.req.id === 'attention').why, 'attention');
  assert.deepStrictEqual(ids(g.upcoming), ['booked2', 'booked'], 'soonest first');
  assert.deepStrictEqual(ids(g.calledOut), ['calledOut']);
  assert.deepStrictEqual(ids(g.waitingOnOthers).sort(), ['askedNotPlaying', 'mineWaiting'], 'including a request they made for others');
  assert.deepStrictEqual(ids(g.archived), ['archived']);
  const all = Object.values(g).flat().map((x) => (x.req || x).id);
  assert.strictEqual(new Set(all).size, all.length, 'no fixture in two places');
  for (const gone of ['saidCant', 'iBackedOut', 'elsewhere', 'removed']) assert.ok(!all.includes(gone), gone);
});

test('each list keeps FixtureFlow\'s own order', () => {
  const w = world();
  const g = PV.myGames(w, 'PDM', NOW);
  assert.deepStrictEqual(ids(g.upcoming), ids(g.upcoming.slice().sort(FF.upcomingOrder)));
  assert.deepStrictEqual(ids(g.waitingOnOthers), ids(g.waitingOnOthers.slice().sort(FF.requestOrder)));
  assert.deepStrictEqual(ids(g.needsYou), ids(g.needsYou.map((x) => x.req).sort(FF.requestOrder)));
});

test('the Play badge is My Games\' "Needs you", counted', () => {
  const w = world();
  const fs = require('fs'); const vm = require('vm'); const path = require('path');
  const ctx = vm.createContext({ FixtureFlow: FF, PlayView: PV, gameRequestsState: w });
  vm.runInContext(fs.readFileSync(path.join(__dirname, '../assets/js/features/play/fixturesData.js'), 'utf8') + '\n;this.api = { playActionCount, myGamesFor };', ctx);
  for (const who of ['PDM', 'Len', 'Kaz', 'Rishi', 'Tom', 'Nobody']) {
    assert.strictEqual(ctx.api.playActionCount(who, NOW), PV.myGames(w, who, NOW).needsYou.length, who);
  }
  assert.strictEqual(ctx.api.playActionCount('PDM', NOW), 3);
});

test('no player chosen: an empty My Games, not an error', () => {
  const g = PV.myGames(world(), null, NOW);
  assert.deepStrictEqual(Object.values(g).map((l) => l.length), [0, 0, 0, 0, 0]);
});

test('Club lists every open fixture once, by stage, and nothing played or removed', () => {
  const w = world();
  const c = PV.club(w, NOW);
  assert.deepStrictEqual(ids(c.attention).sort(), ['attention', 'iBackedOut', 'replacement']);
  assert.deepStrictEqual(ids(c.upcoming), ['booked2', 'booked']);
  assert.deepStrictEqual(ids(c.calledOut).sort(), ['calledOut', 'elsewhere']);
  assert.deepStrictEqual(ids(c.requests).sort(), ['answerMe', 'askedNotPlaying', 'mineWaiting', 'saidCant']);
  assert.deepStrictEqual(ids(c.archived), ['archived']);
  const all = Object.values(c).flat().map((r) => r.id);
  assert.strictEqual(new Set(all).size, all.length);
  assert.ok(!all.includes('removed'));
});

test('the stepper: Requested, Agreed, Booked; Needs attention stays at the step it reached', () => {
  const w = Object.fromEntries(world().map((r) => [r.id, r]));
  assert.deepStrictEqual(PV.STEPS, ['Requested', 'Agreed', 'Booked', 'Played']);
  assert.strictEqual(PV.step(w.answerMe, NOW), 0);
  assert.strictEqual(PV.step(w.calledOut, NOW), 1);
  assert.strictEqual(PV.step(w.booked, NOW), 2);
  assert.strictEqual(PV.step(w.attention, NOW), 1, 'no court: still at Agreed');
  assert.strictEqual(PV.step(w.archived, NOW), 1);
});
