// ===================== ASKING FOR A GAME: ONE PATH =====================
// submitGameRequest (features/play/fixturesData.js) is the one way to ask for
// a game -- Play › Requests' form and the redesign's Arrange a Game both call
// it. It checks the four names, saves, and says what happened. DQ9 (Shaun,
// 30 Sep): a plain request may carry an optional time and venue.

const test = require('node:test');
const assert = require('node:assert');
const H = require('./helpers/uiHarness.js');

const maybe = H.available() ? test : test.skip;
const open = () => H.open({ now: '2026-09-28T12:00:00.000Z' });

maybe('a request saves with the optional time and venue, and the requester is in', async () => {
  const app = await open();
  try {
    const r = await app.run(async () => {
      setCurrentViewer('PDM');
      const res = await submitGameRequest({ names: ['PDM', 'Rishi', ' Erf ', 'KC'], requestedBy: 'PDM', date: '2026-10-06', time: '20:00', venue: ' Rocket Padel ' });
      const saved = window.__writes.filter((w) => w.collection === 'moneypadel' && w.id === 'moneypadel_game_requests').at(-1);
      const stored = JSON.parse(saved.doc.value).find((x) => x.id === res.req.id);
      return { ok: res.ok, players: stored.players, date: stored.preferredDate, time: stored.preferredTime, venue: stored.location,
        requester: stored.confirmations.PDM, others: ['Rishi', 'Erf', 'KC'].map((n) => stored.confirmations[n]) };
    });
    assert.deepStrictEqual(r, { ok: true, players: ['PDM', 'Rishi', 'Erf', 'KC'], date: '2026-10-06', time: '20:00', venue: 'Rocket Padel',
      requester: true, others: [false, false, false] });
    assert.deepStrictEqual(app.pageErrors, []);
  } finally { await app.close(); }
});

maybe('it refuses, and saves nothing, for the same reasons the form always did', async () => {
  const app = await open();
  try {
    const r = await app.run(async () => {
      const before = gameRequestsState.length;
      const writes = window.__writes.length;
      const out = [];
      out.push((await submitGameRequest({ names: ['PDM', 'Rishi', 'Erf', 'KC'], requestedBy: null })).message);
      out.push((await submitGameRequest({ names: ['PDM', 'Rishi', 'Erf', ''], requestedBy: 'PDM' })).message);
      out.push((await submitGameRequest({ names: ['PDM', 'Rishi', 'rishi', 'KC'], requestedBy: 'PDM' })).message);
      out.push((await submitGameRequest({ names: ['PDM', 'Rishi', 'Zed', 'KC'], requestedBy: 'PDM' })).message);
      return { out, added: gameRequestsState.length - before, wrote: window.__writes.length - writes };
    });
    assert.deepStrictEqual(r.out, [
      'Choose who you are first.',
      'Enter all four players.',
      'The same name appears more than once.',
      "Unrecognized name: Zed. Add them via Manage first if they're new.",
    ]);
    assert.deepStrictEqual([r.added, r.wrote], [0, 0]);
  } finally { await app.close(); }
});
