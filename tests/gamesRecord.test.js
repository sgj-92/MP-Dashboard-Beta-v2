// ===================== GAMES: ONE PLAYER'S FILTERED RECORD =====================
// With exactly one player in the Games filter, a line above the list reads
// "5 played · 3 wins · 0 draws · 2 losses · 60% win rate" for whatever the
// filters leave on screen -- PDM in AB vs AB in September, say.
//
// The rule every test here leans on: the record is counted from the SAME list
// the rows are drawn from. So each test reads the rows actually rendered and
// checks the line against them, rather than trusting either on its own.

const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const H = require('./helpers/uiHarness.js');
const GameType = require('../assets/js/gameType.js');

const maybe = H.available() ? test : test.skip;
const ROOT = path.join(__dirname, '..');

// Runs in the page: what the record line says, and what the rows below it
// say, each read independently. The rows' results are worked out here from
// the stored match -- draw first, then which side the player was filed on --
// so the check does not simply re-run the function under test.
function readScreen() {
  const el = document.getElementById('gamesRecord');
  const ids = [...document.querySelectorAll('#gamesView .game-card-clickable')].map((c) => c.dataset.gameid);
  const byId = Object.fromEntries(getDisplayMatches().map((m) => [m.id, m]));
  const rows = ids.map((id) => byId[id]);
  const focus = gamesPlayerIds.length === 1 ? String(gamesPlayerIds[0]).toLowerCase() : null;
  const tally = { played: rows.length, wins: 0, draws: 0, losses: 0 };
  if (focus) rows.forEach((m) => {
    const onA = m.winners.some((n) => String(playerIdFor(n)).toLowerCase() === focus);
    if (m.isDraw) tally.draws++;
    else if (onA) tally.wins++;
    else tally.losses++;
  });
  return {
    present: !!el,
    empty: !!(el && el.classList.contains('gp-record-empty')),
    text: el ? el.textContent.replace(/\s+/g, ' ').trim() : null,
    shown: el ? {
      played: +el.dataset.played, wins: +el.dataset.wins,
      draws: +el.dataset.draws, losses: +el.dataset.losses,
      winpct: el.dataset.winpct === undefined ? null : +el.dataset.winpct,
    } : null,
    rows: tally,
    rowMatches: rows.map((m) => ({ id: m.id, date: m.date, isDraw: !!m.isDraw })),
  };
}

// The player the record has most to say about: the most games, with wins,
// losses and at least one draw where the fixture allows it.
function pickPlayer() {
  const approved = getDisplayMatches().filter((m) => m._status === 'approved');
  const games = {};
  approved.forEach((m) => [...m.winners, ...m.losers].forEach((n) => {
    const g = (games[n] = games[n] || { n: 0, draws: 0 });
    g.n++; if (m.isDraw) g.draws++;
  }));
  return Object.entries(games).sort((a, b) => (b[1].draws > 0) - (a[1].draws > 0) || b[1].n - a[1].n)[0][0];
}

async function onGames(app, setup) {
  return app.run(`(() => {
    document.querySelector('#tabrow .tab-btn[data-tab="games"]').click();
    gamesMonth = 'all'; gamesType = 'all'; setGamesPlayerFilter([]);
    ${setup}
    renderGamesTab();
    return (${readScreen.toString()})();
  })()`);
}

// --- the screen -------------------------------------------------------------

maybe('one selected player gets a record that reconciles to the rows below it', async () => {
  const app = await H.open();
  try {
    const player = await app.run(`(${pickPlayer.toString()})()`);
    const r = await onGames(app, `setGamesPlayerFilter([${JSON.stringify(player)}]);`);
    assert.ok(r.present, 'one selected player shows the record');
    assert.ok(r.rows.played > 0, 'the chosen player has games on screen');
    assert.deepStrictEqual(
      { played: r.shown.played, wins: r.shown.wins, draws: r.shown.draws, losses: r.shown.losses },
      r.rows, 'P / W / D / L are exactly the rows listed');
    assert.strictEqual(r.shown.wins + r.shown.draws + r.shown.losses, r.shown.played, 'W + D + L = P');
    // Wins over games played, draws included -- the League's own definition.
    const pct = Math.round(1000 * r.rows.wins / r.rows.played) / 10;
    assert.strictEqual(r.shown.winpct, pct);
    assert.ok(r.text.includes(`${pct}% win rate`), r.text);
    assert.ok(r.text.includes(`${r.rows.played} played`), r.text);
    assert.ok(r.text.includes('All time'), 'the line names the period it counts');
    assert.deepStrictEqual(app.pageErrors, []);
  } finally { await app.close(); }
});

maybe('no player, or a group of players, shows no personal record', async () => {
  const app = await H.open();
  try {
    const none = await onGames(app, '');
    assert.strictEqual(none.present, false, 'nobody selected: no record');
    assert.ok(none.rows.played > 0, 'the list itself is still there');

    const group = await onGames(app, `
      const m = getDisplayMatches().find((x) => x._status === 'approved' && x.winners.length === 2);
      setGamesPlayerFilter([m.winners[0], m.losers[0]]);`);
    assert.strictEqual(group.present, false, 'two players are a group, not a point of view');
    assert.ok(group.rows.played > 0);
  } finally { await app.close(); }
});

maybe('the month filter recomputes the record from that month alone', async () => {
  const app = await H.open();
  try {
    const player = await app.run(`(${pickPlayer.toString()})()`);
    const all = await onGames(app, `setGamesPlayerFilter([${JSON.stringify(player)}]);`);
    const months = [...new Set(all.rowMatches.map((m) => m.date.slice(0, 7)))];
    assert.ok(months.length >= 2, 'the player spans more than one month');
    let total = 0;
    for (const month of months) {
      const r = await onGames(app, `setGamesPlayerFilter([${JSON.stringify(player)}]); gamesMonth = '${month}';`);
      assert.ok(r.rowMatches.every((m) => m.date.slice(0, 7) === month), 'only that month is listed');
      assert.deepStrictEqual(
        { played: r.shown.played, wins: r.shown.wins, draws: r.shown.draws, losses: r.shown.losses }, r.rows);
      assert.ok(r.shown.played < all.shown.played, 'a month is narrower than all time');
      total += r.shown.played;
    }
    assert.strictEqual(total, all.shown.played, 'the months add back up to all time');
  } finally { await app.close(); }
});

maybe('the tier-matchup filter recomputes the record, by the tiers held on the day', async () => {
  const app = await H.open();
  try {
    const player = await app.run(`(${pickPlayer.toString()})()`);
    const r = await app.run(`(() => {
      document.querySelector('#tabrow .tab-btn[data-tab="games"]').click();
      gamesMonth = 'all'; gamesType = 'all';
      setGamesPlayerFilter([${JSON.stringify(player)}]);
      renderGamesTab();
      const listed = (${readScreen.toString()})();
      // Every matchup this player has, with the rows each one lists.
      const byType = {};
      const all = getDisplayMatches();
      listed.rowMatches.forEach((row) => {
        const t = gameTypeOf(all.find((m) => m.id === row.id));
        if (t && t.matchup) byType[t.matchup] = (byType[t.matchup] || 0) + 1;
      });
      const out = [];
      Object.keys(byType).forEach((key) => {
        gamesType = 'match:' + key;
        renderGamesTab();
        const s = (${readScreen.toString()})();
        out.push({ key, expected: byType[key], s, kept: gamesType });
      });
      return { total: listed.shown.played, out };
    })()`);
    assert.ok(r.out.length >= 2, 'the player has played more than one matchup');
    let sum = 0;
    r.out.forEach(({ key, expected, s, kept }) => {
      assert.strictEqual(kept, 'match:' + key, `${key} stays selected`);
      assert.strictEqual(s.shown.played, expected, `${key}: P is the rows of that matchup`);
      assert.deepStrictEqual(
        { played: s.shown.played, wins: s.shown.wins, draws: s.shown.draws, losses: s.shown.losses }, s.rows, key);
      assert.ok(s.text.includes(key), `the line names the matchup (${key})`);
      sum += s.shown.played;
    });
    // Matchups partition the games that have one, so they cannot overlap.
    assert.ok(sum <= r.total);
  } finally { await app.close(); }
});

maybe('player + month + matchup together describe exactly their intersection', async () => {
  const app = await H.open();
  try {
    const r = await app.run(`(() => {
      document.querySelector('#tabrow .tab-btn[data-tab="games"]').click();
      const approved = getDisplayMatches().filter((m) => m._status === 'approved');
      // The busiest (player, month, matchup) combination in the record.
      const counts = {};
      approved.forEach((m) => {
        const t = gameTypeOf(m); if (!t || !t.matchup) return;
        [...m.winners, ...m.losers].forEach((n) => {
          const k = [n, m.date.slice(0, 7), t.matchup].join('|');
          counts[k] = (counts[k] || 0) + 1;
        });
      });
      const [key, n] = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
      const [player, month, matchup] = key.split('|');
      gamesMonth = month; gamesType = 'match:' + matchup;
      setGamesPlayerFilter([player]);
      renderGamesTab();
      const s = (${readScreen.toString()})();
      // The intersection, worked out here from the record rather than the screen.
      const id = String(playerIdFor(player)).toLowerCase();
      const expected = approved.filter((m) => m.date.slice(0, 7) === month
        && (gameTypeOf(m) || {}).matchup === matchup
        && [...m.winners, ...m.losers].some((x) => String(playerIdFor(x)).toLowerCase() === id));
      return { player, month, matchup, n, s, expected: expected.length, label: monthLabel(month) };
    })()`);
    assert.ok(r.n >= 2, 'a combination worth testing exists');
    assert.strictEqual(r.s.shown.played, r.expected, 'P is the three-way intersection');
    assert.strictEqual(r.s.shown.played, r.s.rows.played, 'and it is what is listed');
    assert.deepStrictEqual(
      { played: r.s.shown.played, wins: r.s.shown.wins, draws: r.s.shown.draws, losses: r.s.shown.losses }, r.s.rows);
    assert.ok(r.s.text.startsWith(`${r.player} · ${r.matchup} · ${r.label}`.toUpperCase())
      || r.s.text.startsWith(`${r.player} · ${r.matchup} · ${r.label}`),
      `context reads player · matchup · month: ${r.s.text}`);
  } finally { await app.close(); }
});

maybe('draws count as draws, whichever side the player was filed on', async () => {
  const app = await H.open();
  try {
    const r = await app.run(`(() => {
      document.querySelector('#tabrow .tab-btn[data-tab="games"]').click();
      gamesMonth = 'all'; gamesType = 'all';
      const draw = getDisplayMatches().find((m) => m._status === 'approved' && m.isDraw);
      // One player from each stored side of the same drawn match.
      const out = [draw.winners[0], draw.losers[0]].map((p) => {
        setGamesPlayerFilter([p]); renderGamesTab();
        const s = (${readScreen.toString()})();
        return { p, s, drawsListed: s.rowMatches.filter((m) => m.isDraw).length };
      });
      return { out };
    })()`);
    r.out.forEach(({ p, s, drawsListed }) => {
      assert.ok(s.shown.draws >= 1, `${p} is credited the draw`);
      assert.strictEqual(s.shown.draws, drawsListed, `${p}: every listed draw, and only those, is a draw`);
      assert.deepStrictEqual(
        { played: s.shown.played, wins: s.shown.wins, draws: s.shown.draws, losses: s.shown.losses }, s.rows, p);
    });
  } finally { await app.close(); }
});

maybe('the stored side never decides the result: synthetic games on both sides', async () => {
  const app = await H.open();
  try {
    const r = await app.run(() => {
      const p = PLAYERS[0].name;
      const others = PLAYERS.slice(1, 4).map((x) => x.name);
      setGamesPlayerFilter([p]);
      const games = [
        { winners: [p, others[0]], losers: [others[1], others[2]] },                    // stored first, won
        { winners: [others[1], others[2]], losers: [others[0], p] },                    // stored second, lost
        { winners: [others[0], p], losers: [others[1], others[2]], isDraw: true },      // stored first, drew
        { winners: [others[1], others[2]], losers: [p, others[0]], isDraw: true },      // stored second, drew
        { winners: [others[1], others[2]], losers: [p, others[0]] },                    // stored second, lost
      ];
      return gamesFocusRecord(games);
    });
    assert.deepStrictEqual(r, { played: 5, wins: 1, draws: 2, losses: 2, winpct: 20 });
  } finally { await app.close(); }
});

maybe('nothing to count says so, and never shows 0%', async () => {
  const app = await H.open();
  try {
    const player = await app.run(`(${pickPlayer.toString()})()`);
    // A month the record has no games in at all.
    const r = await onGames(app, `setGamesPlayerFilter([${JSON.stringify(player)}]); gamesMonth = '2025-01';`);
    assert.strictEqual(r.rows.played, 0);
    assert.ok(r.present && r.empty, 'a deliberate empty state');
    assert.ok(r.text.includes('No games match these filters'), r.text);
    assert.ok(!r.text.includes('%'), 'no win rate for no games');
    assert.strictEqual(r.shown.played, 0);
  } finally { await app.close(); }
});

maybe('the record changes no classification and no table', async () => {
  const app = await H.open();
  try {
    const r = await app.run(() => {
      const snap = () => JSON.stringify({
        types: getDisplayMatches().map((m) => [m.id, gameTypeOf(m)]),
        players: PLAYERS.map((p) => [p.name, p.tier, p.rating, p.wins, p.losses, p.winpct]),
        league: computeMonthlySummaryStats('2026-09', { splitByTier: true }),
      });
      document.querySelector('#tabrow .tab-btn[data-tab="games"]').click();
      const before = snap();
      const m = getDisplayMatches().find((x) => x._status === 'approved' && gameTypeOf(x) && gameTypeOf(x).matchup);
      gamesMonth = m.date.slice(0, 7); gamesType = 'match:' + gameTypeOf(m).matchup;
      setGamesPlayerFilter([m.winners[0]]);
      renderGamesTab();
      gamesMonth = 'all'; gamesType = 'all'; setGamesPlayerFilter([]); renderGamesTab();
      return before === snap();
    });
    assert.strictEqual(r, true, 'classifications, ratings and the League are untouched by drawing the record');
  } finally { await app.close(); }
});

maybe('a match is classified by the tiers held on its date, not today\'s', async () => {
  const app = await H.open();
  try {
    const r = await app.run(() => {
      document.querySelector('#tabrow .tab-btn[data-tab="games"]').click();
      const approved = getDisplayMatches().filter((m) => m._status === 'approved');
      // A match whose matchup would read differently under current tiers.
      const nowTier = (n) => (PLAYERS.find((p) => p.name === n) || {}).tier;
      const found = approved.map((m) => {
        const then = gameTypeOf(m);
        const today = GameType.classify(m.winners.map(nowTier), m.losers.map(nowTier));
        const mover = [...m.winners, ...m.losers].find((n) => historicalTierOf(n, m.date) !== nowTier(n));
        return { m, then, today, mover };
      }).find((x) => x.then && x.then.matchup && x.mover && x.today.matchup !== x.then.matchup);
      if (!found) return null;
      gamesMonth = 'all'; gamesType = 'match:' + found.then.matchup;
      setGamesPlayerFilter([found.mover]); renderGamesTab();
      const listedThen = [...document.querySelectorAll('#gamesView .game-card-clickable')].some((c) => c.dataset.gameid === found.m.id);
      const recThen = +document.getElementById('gamesRecord').dataset.played;
      return { mover: found.mover, then: found.then.matchup, today: found.today.matchup, listedThen, recThen };
    });
    assert.ok(r, 'the fixture holds a match played before a tier change');
    assert.notStrictEqual(r.then, r.today);
    assert.ok(r.listedThen, `${r.mover}'s match is found under ${r.then}, the tiers on the day`);
    assert.ok(r.recThen >= 1, 'and counted in the record');
  } finally { await app.close(); }
});

// --- source and module guards ------------------------------------------------

test('canonical matchup notation and order are unchanged', () => {
  assert.strictEqual(GameType.matchupKey(['B', 'A'], ['A', 'B']), 'AB vs AB');
  assert.strictEqual(GameType.matchupKey(['B', 'B'], ['B', 'B']), 'BB vs BB');
  assert.strictEqual(GameType.matchupKey(['C', 'B'], ['A', 'S']), 'SA vs BC');
});

test('the record counts the listed games and reads no rating, table or race', () => {
  // The rule lives in the domain module; the screen only draws what the
  // view-model hands it.
  const domain = fs.readFileSync(path.join(ROOT, 'assets', 'js', 'domain', 'matches', 'gamesFilter.js'), 'utf8')
    .replace(/^\s*\/\/.*$/gm, '');
  const start = domain.indexOf('function record(');
  const body = domain.slice(start, domain.indexOf('\n  }\n', start));
  assert.ok(start > 0 && body.length > 0);
  ['rating', 'Merit', 'MonthlyRace', 'computeMonthly', 'getDisplayMatches', 'getAllApprovedMatches', 'MATCHES', 'GameType']
    .forEach((word) => assert.ok(!body.includes(word), `the record must not read ${word}`));
  assert.ok(body.includes('MO.outcomeFor'), 'results come from the one outcome reader');
  // ...the view-model counts the very list it returns...
  const vm = fs.readFileSync(path.join(ROOT, 'assets', 'js', 'features', 'games', 'gamesViewModel.js'), 'utf8');
  assert.ok(/GamesFilter\.record\(r\.games,/.test(vm), 'the record is counted over the returned games');
  // ...and the screen draws both from the same view-model.
  const src = fs.readFileSync(path.join(ROOT, 'assets', 'js', 'app.js'), 'utf8');
  assert.ok(/const display = gamesVm\.games;/.test(src), 'the rows are the view-model games');
  assert.ok(/gamesRecordHtml\(gamesVm\.record,/.test(src), 'the record line is the view-model record');
});
