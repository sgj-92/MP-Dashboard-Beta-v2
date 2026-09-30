// ===================== PLAY BADGE COUNT (DQ29) =====================
// The Play tab's badge counts only what the selected player must genuinely act
// on: requests waiting on their answer, and agreed games in Needs attention
// that they are in -- not one they have backed out of themselves. The count
// is a fact on the functional side (features/play/fixturesData.js); the
// redesign's badge only draws it.

const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const FF = require('../assets/js/fixtureFlow.js');

const T0 = '2026-09-20T10:00:00.000Z';
const NOW = '2026-09-28T12:00:00.000Z';
const at = (d) => new Date(Date.parse(T0) + d * 864e5).toISOString();

function load(requests) {
  const ctx = vm.createContext({ FixtureFlow: FF, PlayView: require('../assets/js/domain/fixtures/playView.js'), gameRequestsState: requests });
  vm.runInContext(fs.readFileSync(path.join(__dirname, '../assets/js/features/play/fixturesData.js'), 'utf8')
    + '\n;this.api = { playActionCount, requestLists };', ctx);
  return ctx.api;
}

// Everyone in, so the game is agreed.
function agreed(players, id, teams) {
  const r = FF.createRequest({ players, requestedBy: players[0], at: at(0), id, teams });
  players.slice(1).forEach((n) => FF.respond(r, n, 'in', at(0.5)));
  return r;
}

test('a request waiting on my answer counts; my own request (I am already in) does not', () => {
  const waiting = FF.createRequest({ players: ['Rishi', 'Erf', 'PDM', 'KC'], requestedBy: 'Rishi', at: at(1), id: 'r1' });
  const mine = FF.createRequest({ players: ['PDM', 'Tom', 'Osh', 'Eli'], requestedBy: 'PDM', at: at(2), id: 'r2' });
  const { playActionCount } = load([waiting, mine]);
  assert.strictEqual(playActionCount('PDM', NOW), 1);
  assert.strictEqual(playActionCount('Tom', NOW), 1, 'Tom has not answered PDM\'s request');
  assert.strictEqual(playActionCount('Rishi', NOW), 0, 'the requester is already in');
});

test('an answered request stops counting, whichever way it was answered', () => {
  const a = FF.createRequest({ players: ['Rishi', 'Erf', 'PDM', 'KC'], requestedBy: 'Rishi', at: at(1), id: 'a' });
  const b = FF.createRequest({ players: ['Len', 'Erf', 'PDM', 'KC'], requestedBy: 'Len', at: at(1), id: 'b' });
  FF.respond(a, 'PDM', 'in', at(1.1));
  FF.respond(b, 'PDM', 'cant', at(1.1));
  assert.strictEqual(load([a, b]).playActionCount('PDM', NOW), 0);
});

test('a Needs attention game I am in counts -- unless I am the one who backed out', () => {
  const other = agreed(['Rishi', 'Osh', 'PDM', 'Len'], 'g1');
  FF.respond(other, 'Len', 'cant', at(2));
  const mine = agreed(['PDM', 'Kaz', 'Tom', 'Eli'], 'g2');
  FF.respond(mine, 'PDM', 'cant', at(2));
  const { playActionCount } = load([other, mine]);
  assert.strictEqual(FF.stage(other, NOW), FF.STAGE.ATTENTION);
  assert.strictEqual(FF.stage(mine, NOW), FF.STAGE.ATTENTION);
  assert.strictEqual(playActionCount('PDM', NOW), 1, 'Len backed out of g1; PDM backed out of g2 himself');
  assert.strictEqual(playActionCount('Len', NOW), 0);
  assert.strictEqual(playActionCount('Kaz', NOW), 1);
});

test('games that need nothing from me do not count: agreed, booked, or someone else\'s', () => {
  const calledOut = agreed(['PDM', 'Kaz', 'Tom', 'Eli'], 'c1');
  const booked = agreed(['PDM', 'Osh', 'Len', 'KC'], 'b1');
  assert.ok(FF.setCourtBooking(booked, { isAdmin: true, booked: true, by: 'Shaun', at: at(1) }).ok);
  assert.strictEqual(FF.stage(booked, NOW), FF.STAGE.UPCOMING);
  assert.strictEqual(FF.stage(calledOut, NOW), FF.STAGE.CALLED_OUT);
  const elsewhere = agreed(['Rishi', 'Erf', 'Osh', 'KC'], 'e1');
  FF.respond(elsewhere, 'KC', 'cant', at(2));
  const { playActionCount } = load([calledOut, booked, elsewhere]);
  assert.strictEqual(playActionCount('PDM', NOW), 0);
});

test('no viewer, no count', () => {
  const r = FF.createRequest({ players: ['Rishi', 'Erf', 'PDM', 'KC'], requestedBy: 'Rishi', at: at(1), id: 'r' });
  const { playActionCount } = load([r]);
  assert.strictEqual(playActionCount(null, NOW), 0);
  assert.strictEqual(playActionCount('', NOW), 0);
});

test('the badge adds exactly the For me list the Requests screen shows', () => {
  const reqs = ['Rishi', 'Len', 'Osh'].map((by, i) => FF.createRequest({ players: [by, 'PDM', 'KC', 'Eli'].filter((v, j, a) => a.indexOf(v) === j), requestedBy: by, at: at(i), id: 'q' + i }));
  const { playActionCount, requestLists } = load(reqs);
  assert.strictEqual(playActionCount('PDM', NOW), requestLists('PDM').forMe.length);
  assert.strictEqual(playActionCount('PDM', NOW), 3);
});
