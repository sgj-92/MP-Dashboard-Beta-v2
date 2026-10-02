// ===================== MATCH SCORECARD =====================
// One completed match, as one canonical card: who played, in which tier ON THE
// DAY, the score, who won, what each side was expected to take, what it took,
// the difference, and how far every player's rating moved.
//
// It calculates nothing the engine did not. Every rating figure is read back
// from what the engine recorded when it rated the match (MatchFacts, built from
// the Rating Journey's MATCH_UPDATE events):
//
//   expected    the side's preMatchExpectedScore
//   actual      the side's actualScore -- the engine's own "actual", which is a
//               PERFORMANCE score (0.80 x share of games + 0.20 x the result),
//               not a share of games. The share of games is carried beside it
//               as labelled context, never in its place.
//   vs expected actual - expected, in percentage points. The engine stored the
//               difference itself (performanceResidual); it is what K
//               multiplies, so it is also why the ratings moved.
//   movement    each player's stored ratingDelta (K is per player, so the four
//               players move by four different amounts)
//   tier        each player's tierAtEvent, written on the same event
//
// Because all of it was written when the match was rated, none of it moves when
// a rating or tier moves later: a June scorecard reads the same in December.
// A match the engine has no record for (not yet rated) gets a card that says
// so -- its rating figures are absent, never estimated.
//
// PURE. Inputs are passed in; it reads nothing global, writes nothing, touches
// no DOM. The same view model feeds the on-screen sheet today and can feed a
// shared picture (CardPainter) later.

(function (root, factory) {
  const api = factory(root);
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.MatchScorecard = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function (root) {
  'use strict';

  const lib = (name, file) => {
    if (root && root[name]) return root[name];
    if (typeof require === 'function') return require(file);
    throw new Error(`MatchScorecard needs ${name}`);
  };

  // One decimal place, without float noise ("62.4", never "62.400000001").
  const r1 = (v) => Math.round(v * 10) / 10;
  const pct = (v) => (typeof v === 'number' ? r1(v * 100) : null);

  // Builds the scorecard for one match.
  //
  //   match   the app's match: { id, date, winners, losers, sets: [[a, b]],
  //           type, isDraw }. On a decided match `winners` is the side that
  //           won; on a draw the stored orientation, which is arbitrary but
  //           fixed.
  //   facts   MatchFacts.index(journey)[match.id], or null when unrated
  //   opts    { tierOf(name, date) -> tier | null }  the historical tier
  //           resolver, used only for a player the engine has no event for.
  function build(match, facts, opts) {
    if (!match) return null;
    const Engine = lib('RatingEngine', '../../ratingEngine.js');
    const GameType = lib('GameType', '../../gameType.js');
    const tierOf = (opts && opts.tierOf) || (() => null);

    const sets = (match.sets || []).map((s) => [s[0], s[1]]);
    const shares = Engine.gameShares(sets);
    const rated = !!(facts && facts.sides && facts.byPlayer);

    // Team 1 is the stored first side -- the winners on a decided match --
    // and the engine side each team was rated as is found by who was on it,
    // not assumed.
    const sideOf = (names) => {
      if (!rated) return null;
      const s = names.map((n) => facts.byPlayer[n] && facts.byPlayer[n].side);
      return s.every((x) => x && x === s[0]) ? s[0] : null;
    };

    const team = (no, names, games, opponentGames, share) => {
      const side = sideOf(names);
      const f = side ? facts.sides[side] : null;
      const tierFor = (name) => {
        const p = rated ? facts.byPlayer[name] : null;
        return (p && p.tierAtEvent) || tierOf(name, match.date) || null;
      };
      // Within a pair, the stronger tier first -- the order every match card
      // reads a partnership in. The two TEAMS are never reordered.
      const ordered = GameType.orderTeam ? GameType.orderTeam(names, tierFor) : names;
      const players = ordered.map((name) => {
        const p = rated ? facts.byPlayer[name] : null;
        const recorded = p && p.tierAtEvent ? p.tierAtEvent : null;
        const tier = recorded || tierOf(name, match.date) || null;
        return {
          name,
          tier,
          // Where the tier came from, so a test (or a curious admin) can tell
          // the event's own snapshot from the dated tier history.
          tierSource: recorded ? 'event' : (tier ? 'history' : null),
          preRating: p ? p.preMatchRating : null,
          postRating: p ? p.postMatchRating : null,
          movement: p ? p.ratingDelta : null,
        };
      });
      const expectedPct = f ? pct(f.expected) : null;
      const actualPct = f ? pct(f.actual) : null;
      return {
        no,
        side,
        names: players.map((p) => p.name),
        players,
        won: !match.isDraw && no === 1,
        games,
        opponentGames,
        gameSharePct: pct(share),
        expected: f ? f.expected : null,
        actual: f ? f.actual : null,
        residual: f ? f.residual : null,
        expectedPct,
        actualPct,
        // The difference as the card prints it: the two printed figures,
        // subtracted. It is the stored residual to within the rounding of
        // those two figures (at most 0.1pp), and it always adds up on screen.
        vsExpectedPp: f ? r1(actualPct - expectedPct) : null,
        // The engine's own residual, unrounded, in points -- what K multiplied.
        residualPp: f ? f.residual * 100 : null,
        preRating: f ? f.preRating : null,
      };
    };

    const teams = [
      team(1, match.winners || [], shares.gamesA, shares.gamesB, shares.shareA),
      team(2, match.losers || [], shares.gamesB, shares.gamesA, shares.shareB),
    ];
    // Ratings are only shown when BOTH teams map cleanly onto the engine's two
    // sides. Anything else would be pairing one team with another's numbers.
    const complete = rated && teams[0].side && teams[1].side && teams[0].side !== teams[1].side;
    if (!complete) teams.forEach((t) => {
      t.side = null; t.expected = t.actual = t.residual = null;
      t.expectedPct = t.actualPct = t.vsExpectedPp = t.residualPp = t.preRating = null;
      t.players.forEach((p) => { p.preRating = p.postRating = p.movement = null; });
    });

    const tiersOf = (t) => t.players.map((p) => p.tier);
    const classified = GameType.classify(tiersOf(teams[0]), tiersOf(teams[1]));

    return {
      matchId: match.id,
      date: match.date,
      format: match.type === 'singles' || teams[0].players.length === 1 ? 'singles' : 'doubles',
      // The game type in tier terms, from the tiers on the card; null when any
      // tier is unknown -- a guess would file the match under the wrong type.
      matchup: classified.matchup,
      category: classified.category,
      categoryLabel: classified.category ? GameType.categoryLabel(classified.category) : null,
      sets,
      scoreText: sets.map((s) => `${s[0]}-${s[1]}`).join(', '),
      isDraw: !!match.isDraw,
      winner: match.isDraw ? null : 1,
      rated: !!complete,
      teams,
    };
  }

  return { build };
});
