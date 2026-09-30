// ===================== DRAWS ARE NOT LOSSES =====================
// Money Padel has three outcomes. Screens kept writing code with two.
//
// The reported defect: the Doughnut drill-down described a recorded draw as
// "[Team] def [Team]", telling a player they had lost a game the record says
// they drew. The cause is the same everywhere it appears — on a drawn match
// `winners` and `losers` still hold the two sides, because a match has two
// sides whatever the result, but they mean nothing. The record says so
// itself: every drawn document carries `drawSideAssignmentArbitrary: true`.
// So `winners.includes(name)` answers "which side was this player filed on",
// and `won ? 'WIN' : 'LOSS'` turns that coin toss into a result.
//
// These tests use the REAL recorded draws (six of them, all September) rather
// than a fixture, and the last one checks that nothing about those records
// moved.

const test = require('node:test');
const assert = require('node:assert');
const H = require('./helpers/uiHarness.js');
const MatchOutcome = require('../assets/js/matchOutcome.js');

const skip = H.available() ? false : 'Playwright unavailable';
const maybe = H.available() ? test : test.skip;

// --- the helper, on its own ---------------------------------------------

test('a draw is read from the record, never guessed from the score', () => {
  // Scores that look drawn on a match that was won...
  assert.strictEqual(MatchOutcome.isDraw({ isDraw: false, sets: [[6, 6], [6, 6]] }), false);
  // ...and scores that look decisively won on a match that was drawn. A Money
  // Padel draw is usually an unfinished match, so its sets can look like
  // anything at all.
  assert.strictEqual(MatchOutcome.isDraw({ isDraw: true, sets: [[6, 0], [6, 1]] }), true);
  // The stored document's own field, for a caller holding a raw record.
  assert.strictEqual(MatchOutcome.isDraw({ outcome: 'DRAW' }), true);
  assert.strictEqual(MatchOutcome.isDraw({ outcome: 'A_WINS' }), false);
});

test('the side a player was filed on is not their result', () => {
  const draw = { isDraw: true, winners: ['A', 'B'], losers: ['C', 'D'] };
  // Both sides drew. Neither won. This is the whole bug in two assertions.
  assert.strictEqual(MatchOutcome.outcomeFor(draw, 'A'), 'draw');
  assert.strictEqual(MatchOutcome.outcomeFor(draw, 'C'), 'draw');
  assert.strictEqual(MatchOutcome.outcomeFor(draw, 'Nobody'), null);

  const won = { isDraw: false, winners: ['A', 'B'], losers: ['C', 'D'] };
  assert.strictEqual(MatchOutcome.outcomeFor(won, 'A'), 'win');
  assert.strictEqual(MatchOutcome.outcomeFor(won, 'C'), 'loss');
});

test('all three outcomes have their own wording, and a loss names the winner first', () => {
  const won = { isDraw: false, winners: ['A', 'B'], losers: ['C', 'D'] };
  const draw = { isDraw: true, winners: ['A', 'B'], losers: ['C', 'D'] };
  // A win and a loss are the same sentence read from two sides: the winning
  // team comes first either way, which is what stops "X def Y" being written
  // backwards for whoever lost.
  assert.strictEqual(MatchOutcome.describe(won), 'A & B def C & D');
  assert.strictEqual(MatchOutcome.describe(won, { perspective: 'C' }), 'A & B def C & D');
  // A draw is neutral, and never "def".
  assert.strictEqual(MatchOutcome.describe(draw), 'A & B drew with C & D');
  assert.strictEqual(MatchOutcome.describe(draw, { perspective: 'C' }), 'C & D drew with A & B');
  assert.ok(!/def/.test(MatchOutcome.describe(draw)));
});

test('a tally has three counters, because two cannot hold a draw', () => {
  const list = [
    { isDraw: false, winners: ['A'], losers: ['B'] },
    { isDraw: true, winners: ['A'], losers: ['B'] },
    { isDraw: false, winners: ['B'], losers: ['A'] },
  ];
  assert.deepStrictEqual(MatchOutcome.tally(list, 'A'), { wins: 1, draws: 1, losses: 1, played: 3 });
  assert.deepStrictEqual(MatchOutcome.tally(list, 'B'), { wins: 1, draws: 1, losses: 1, played: 3 });
  // The shape that caused this: losses computed as total - wins.
  const t = MatchOutcome.tally(list, 'A');
  assert.notStrictEqual(t.losses, t.played - t.wins,
    'if losses were total-minus-wins, the draw would be counted as a defeat');
});

// --- against the real record ---------------------------------------------

maybe('the record holds drawn matches, and they are marked as drawn', async () => {
  const app = await H.open();
  try {
    const r = await app.run(() => {
      const draws = getAllApprovedMatches().filter((m) => MatchOutcome.isDraw(m));
      return {
        count: draws.length,
        // Stored sides on a draw are explicitly arbitrary; that is the fact
        // every one of these screens was reading as a result.
        allArbitrary: draws.every((d) => d.isDraw === true),
        sample: draws[0] ? { id: draws[0].id, winners: draws[0].winners, losers: draws[0].losers } : null,
      };
    });
    assert.ok(r.count >= 1, 'this suite needs at least one recorded draw to be meaningful');
    assert.strictEqual(r.allArbitrary, true);
    assert.deepStrictEqual(app.pageErrors, []);
  } finally { await app.close(); }
});

maybe('the Doughnut drill-down says a drawn game was drawn', async () => {
  // The reported bug, on the game that produced it: a drawn match containing
  // a 6-0 set, which is what puts it in the doughnut list at all.
  const app = await H.open();
  try {
    const r = await app.run(() => {
      const rows = [];
      computeDoughnutStats().forEach((s) => {
        s.givenMatches.concat(s.receivedMatches).forEach((m) => {
          if (MatchOutcome.isDraw(m)) rows.push(MatchOutcome.describe(m));
        });
      });
      // Rendered, not merely computed: open the leaderboard and expand it.
      // Rankings › More tables › Doughnuts (Phase 1).
      goToSection('rankings');
      openRankingsMoreTables();
      document.querySelector('#rankingsMoreSheet [data-special="doughnuts"]').click();
      // The sheet opens on a month now; this game is found across all time.
      const sel = document.getElementById('doughnutMonthSelect');
      sel.value = 'all'; sel.dispatchEvent(new Event('change'));
      const body = document.getElementById('doughnutModalBody');
      body.querySelectorAll('.doughnut-row').forEach((x) => x.click());
      const teams = [...body.querySelectorAll('.doughnut-game-teams')].map((x) => x.textContent.trim());
      const drawIds = new Set(getAllApprovedMatches().filter((m) => m.isDraw)
        .map((m) => `${m.winners.join(' & ')} def ${m.losers.join(' & ')}`));
      return {
        computed: [...new Set(rows)],
        rendered: teams,
        drawnLines: teams.filter((t) => / drew with /.test(t)),
        // The exact old output: a drawn match written as one side beating the
        // other.
        drawsWrittenAsDefeats: teams.filter((t) => drawIds.has(t)),
      };
    });
    assert.ok(r.computed.length >= 1, 'a drawn game must reach the doughnut list for this to test anything');
    assert.ok(r.computed.every((line) => / drew with /.test(line)), `wording: ${r.computed.join(' | ')}`);
    assert.ok(r.drawnLines.length >= 1, 'the rendered drill-down must contain the drawn game');
    assert.deepStrictEqual(r.drawsWrittenAsDefeats, [],
      'a drawn game is being rendered as "def" — this is the reported bug');
    assert.deepStrictEqual(app.pageErrors, []);
  } finally { await app.close(); }
});

maybe('head-to-head counts a draw as a draw, and does not award it to anyone', async () => {
  const app = await H.open();
  try {
    const r = await app.run(() => {
      const draw = getAllApprovedMatches().filter((m) => m.isDraw)[0];
      const A = draw.winners[0];
      const B = draw.losers[0];
      selectedMonth = 'all';
      document.querySelector('#tabrow .tab-btn[data-tab="h2h"]').click();
      h2hPlayerA = A; h2hPlayerB = B;
      renderH2H();
      const text = document.getElementById('h2hView').textContent.replace(/\s+/g, ' ');
      const tally = MatchOutcome.tally(h2hOpponentMatches(A, B), A);
      return {
        A, B, tally, text,
        // The drawn meeting must be one of the meetings counted.
        meetings: (text.match(/(\d+) meetings? as opponents/) || [])[1],
        drawnLabel: (text.match(/(\d+) drawn/) || [])[1],
        saysDrew: /drew/.test(text),
        // Nobody may be told they won the drawn one: a card headed "X won"
        // for every meeting would mean the draw had been handed to a side.
        wonCards: (text.match(/\w+ won/g) || []).length,
      };
    });
    assert.ok(r.tally.draws >= 1, 'this pair must have a drawn meeting for the test to mean anything');
    assert.strictEqual(Number(r.meetings), r.tally.played,
      'a drawn meeting is still a meeting and must be counted as one');
    assert.strictEqual(Number(r.drawnLabel), r.tally.draws,
      'the scoreline must say how many were drawn rather than hiding them in one side');
    assert.strictEqual(r.saysDrew, true, 'the drawn game must be described as drawn');
    assert.strictEqual(r.wonCards, r.tally.wins + r.tally.losses,
      'exactly the decided meetings may carry a "won" card — the drawn one must not');
    assert.strictEqual(r.tally.wins + r.tally.losses + r.tally.draws, r.tally.played,
      'W + L + D accounts for every meeting');
    assert.deepStrictEqual(app.pageErrors, []);
  } finally { await app.close(); }
});

maybe("a player's own history shows a drawn game as drawn, from their side", async () => {
  const app = await H.open();
  try {
    const r = await app.run(() => {
      const draw = getAllApprovedMatches().filter((m) => m.isDraw)[0];
      const name = draw.losers[0];   // deliberately the side filed as "losers"
      selectedMonth = 'all'; matchFilter = null;
      openSheet(name);
      const cards = [...document.querySelectorAll('.pp-match-detail, #sheetMatches .match')];
      const summaries = [...document.querySelectorAll('.pp-match-result')].map((x) => x.textContent.trim());
      const drawCard = cards.find((c) => c.dataset.matchId === draw.id);
      return {
        name, drawId: draw.id,
        found: !!drawCard,
        label: drawCard ? drawCard.querySelector('.top span:last-child').textContent.trim() : null,
        summaryDraws: summaries.filter((x) => x === 'DRAW').length,
        summaryLosses: summaries.filter((x) => x === 'LOSS').length,
        // No upset tag: nobody was upset by a match nobody won.
        upset: drawCard ? /UPSET/.test(drawCard.textContent) : null,
      };
    });
    assert.strictEqual(r.found, true,
      "a drawn game must appear in the player's own match history");
    assert.strictEqual(r.label, 'DRAW',
      `the card called it ${r.label} — the player was on the side stored as "losers"`);
    assert.ok(r.summaryDraws >= 1,
      'and the collapsed summary row must say DRAW too, not fall through to LOSS');
    assert.strictEqual(r.upset, false, 'a draw is neither an upset win nor an upset loss');
    assert.deepStrictEqual(app.pageErrors, []);
  } finally { await app.close(); }
});

maybe('nothing about the drawn records was changed', async () => {
  // The fix is a display fix. The six drawn documents must come back from the
  // stub byte-for-byte as they went in, and no write may have been attempted.
  const app = await H.open();
  try {
    const r = await app.run(() => {
      const stored = Object.values(window.__data.matches).filter((m) => m.outcome === 'DRAW');
      return {
        storedDraws: stored.length,
        outcomes: stored.map((m) => m.outcome),
        arbitrary: stored.map((m) => m.drawSideAssignmentArbitrary),
        sides: stored.map((m) => [m.teamA, m.teamB]),
        writes: window.__writes.length,
      };
    });
    assert.ok(r.storedDraws >= 1);
    assert.ok(r.outcomes.every((o) => o === 'DRAW'), 'the recorded outcome is untouched');
    assert.ok(r.arbitrary.every((a) => a === true), 'and so is the arbitrary-sides flag');
    assert.strictEqual(r.writes, 0, 'reading a draw must not write anything');
    assert.deepStrictEqual(app.pageErrors, []);
  } finally { await app.close(); }
});
