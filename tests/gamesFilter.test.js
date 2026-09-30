// ===================== GAMES FILTER (domain) =====================
// domain/matches/gamesFilter.js decides which games a set of filters leaves
// and one player's W/D/L over them. It was lifted out of the Games screen so a
// redesigned screen consumes it instead of re-deriving it; these tests pin the
// rules it carried over, and that the app-level contract (filteredGames /
// playerRecord) is exactly what the screen lists.

const test = require('node:test');
const assert = require('node:assert');
const H = require('./helpers/uiHarness.js');
const GF = require('../assets/js/domain/matches/gamesFilter.js');

const maybe = H.available() ? test : test.skip;

// Tiers by player, fixed for the fixtures below; a real screen passes the
// historical classifier.
const TIER = { A1: 'A', A2: 'A', B1: 'B', B2: 'B', B3: 'B', B4: 'B', C1: 'C' };
const GameType = require('../assets/js/gameType.js');
const gameTypeOf = (m) => GameType.classify(m.winners.map((n) => TIER[n]), m.losers.map((n) => TIER[n]));
const g = (id, date, winners, losers, extra) => ({ id, date, winners, losers, ...(extra || {}) });

const GAMES = [
  g('1', '2026-08-02', ['A1', 'B1'], ['A2', 'B2']),                 // AB vs AB
  g('2', '2026-09-03', ['B1', 'B2'], ['B3', 'B4']),                 // BB vs BB
  g('3', '2026-09-05', ['B3', 'B4'], ['A1', 'B1']),                 // AB vs BB, B1 lost
  g('4', '2026-09-05', ['A1', 'B2'], ['A2', 'B1'], { isDraw: true }), // AB vs AB, draw
  g('5', '2026-09-09', ['A2', 'C1'], ['B1', 'B3']),                 // AC vs BB
];
const deps = { gameTypeOf, toId: (n) => n };

test('no filters: every game, newest first, same-day order as the Games log has always had', () => {
  const r = GF.apply(GAMES, {}, deps);
  assert.deepStrictEqual(r.games.map((m) => m.id), ['5', '4', '3', '2', '1']);
  assert.strictEqual(r.type, 'all');
});

test('month, type and players layer; the result is their intersection', () => {
  const r = GF.apply(GAMES, { month: '2026-09', type: 'match:AB vs AB', playerIds: ['B1'] }, deps);
  assert.deepStrictEqual(r.games.map((m) => m.id), ['4']);
  const month = GF.apply(GAMES, { month: '2026-09', playerIds: ['B1'] }, deps);
  assert.deepStrictEqual(month.games.map((m) => m.id).sort(), ['2', '3', '4', '5']);
});

test('type options come from what survives month and players, and a vanished type falls back first', () => {
  const r = GF.apply(GAMES, { month: '2026-08', type: 'match:BB vs BB' }, deps);
  assert.strictEqual(r.type, 'all', 'BB vs BB does not exist in August, so the filter falls back');
  assert.deepStrictEqual(r.games.map((m) => m.id), ['1'], 'and nothing is filtered away by a stale type');
  assert.deepStrictEqual(r.typeOptions.matchups.map((o) => o.label), ['AB vs AB']);
});

test('the record is from the player\'s side, draws are draws, W + D + L = P', () => {
  const r = GF.apply(GAMES, { playerIds: ['B1'] }, deps);
  const rec = GF.record(r.games, 'B1', deps.toId);
  assert.deepStrictEqual(rec, { played: 5, wins: 2, draws: 1, losses: 2, winpct: 40 });
  assert.strictEqual(rec.wins + rec.draws + rec.losses, rec.played);
});

test('a renamed player is matched by canonical id', () => {
  const toId = (n) => ({ 'Bee One': 'B1' }[n] || n);
  const renamed = GAMES.map((m) => ({ ...m, winners: m.winners.map((n) => (n === 'B1' ? 'Bee One' : n)),
    losers: m.losers.map((n) => (n === 'B1' ? 'Bee One' : n)) }));
  const r = GF.apply(renamed, { playerIds: ['B1'] }, { gameTypeOf: (m) => gameTypeOf({
    winners: m.winners.map(toId), losers: m.losers.map(toId) }), toId });
  assert.strictEqual(r.games.length, 5);
  assert.strictEqual(GF.record(r.games, 'B1', toId).played, 5);
});

test('no games: a zero record with no win rate', () => {
  assert.deepStrictEqual(GF.record([], 'B1'), { played: 0, wins: 0, draws: 0, losses: 0, winpct: null });
});

test('the module is pure: no DOM, no globals of the app, no rating or table', () => {
  const src = require('fs').readFileSync(require('path').join(__dirname, '..', 'assets', 'js', 'domain', 'matches', 'gamesFilter.js'), 'utf8')
    .replace(/^\s*\/\/.*$/gm, '');
  ['document', 'getDisplayMatches', 'gamesMonth', 'gamesPlayerIds', 'PLAYERS', 'rating', 'Merit', 'innerHTML']
    .forEach((w) => assert.ok(!src.includes(w), `gamesFilter.js must not reference ${w}`));
});

maybe('the app-level contract is what the Games screen lists and counts', async () => {
  const app = await H.open();
  try {
    const r = await app.run(() => {
      document.querySelector('#tabrow .tab-btn[data-tab="games"]').click();
      const player = PLAYERS.slice().sort((a, b) => b.total - a.total)[0].name;
      const month = '2026-09';
      gamesMonth = month; gamesType = 'all'; setGamesPlayerFilter([player]); renderGamesTab();
      const rows = [...document.querySelectorAll('#gamesView .game-card-clickable')].map((c) => c.dataset.gameid);
      const el = document.getElementById('gamesRecord');
      const games = filteredGames({ month, type: 'all', playerIds: [playerIdFor(player)] });
      const rec = playerRecord(games, player);
      const vm = getFilteredGamesViewModel();
      return { rows, ids: games.map((m) => m.id), rec,
        shown: { played: +el.dataset.played, wins: +el.dataset.wins, draws: +el.dataset.draws, losses: +el.dataset.losses },
        vmIds: vm.games.map((m) => m.id), vmRec: vm.record };
    });
    assert.ok(r.rows.length > 0);
    assert.deepStrictEqual(r.ids, r.rows, 'filteredGames() is exactly the rows listed, in order');
    assert.deepStrictEqual(r.vmIds, r.rows);
    assert.deepStrictEqual({ played: r.rec.played, wins: r.rec.wins, draws: r.rec.draws, losses: r.rec.losses }, r.shown);
    assert.deepStrictEqual(r.vmRec, r.rec);
    assert.deepStrictEqual(app.pageErrors, []);
  } finally { await app.close(); }
});
