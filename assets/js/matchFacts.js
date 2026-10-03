// ===================== MATCH FACTS (read back, never recomputed) ============
// What the engine actually did in one match, indexed by match id.
//
// The application used to derive a match's expectation from TODAY's ratings:
// a logistic on the current numbers, presented as "expected ~32% of games" on a
// card about a match played in June. That is a recomputed historical
// expectation, which the project forbids outright, and it drifts every time
// anybody plays: the same past match quietly reported a different expectation
// week to week.
//
// Everything here was written at the time the match was rated and is read back
// verbatim. Two things follow that the old display could not express:
//
//   * K is per-player, so the four players in one match move by four different
//     amounts. There is no single "rating impact" for a match.
//   * A draw is rated. It is not a win or a loss for anybody, but it moves
//     ratings like any other result.

(function (root, factory) {
  const api = factory(typeof require === 'function' ? require('./ratingEngine.js') : root.RatingEngine);
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.MatchFacts = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function (Engine) {
  'use strict';

  function round(v, dp) {
    const f = Math.pow(10, dp);
    return Math.round(v * f) / f;
  }

  // One side's view of the match. `expected` and `actual` are the engine's own
  // performance scores (0.80 x game share + 0.20 x the result), NOT a share of
  // games -- a different quantity that must never borrow game-share wording.
  function buildSide(events) {
    const players = events.map((e) => ({
      playerId: e.playerId,
      preMatchRating: e.preMatchRating,
      postMatchRating: e.postMatchRating,
      ratingDelta: round(e.ratingDelta, 1),
      kUsed: e.kUsed,
      previousReliability: e.previousReliability,
      newReliability: e.newReliability,
      // The tier the player was rated in, written on the same event.
      tierAtEvent: e.tierAtEvent || null,
    })).sort((a, b) => (a.playerId < b.playerId ? -1 : 1));
    const first = events[0];
    return {
      players,
      names: players.map((p) => p.playerId),
      // The rating the pairing actually carried into the match.
      preRating: round(players.reduce((s, p) => s + p.preMatchRating, 0) / players.length, 1),
      expected: first.preMatchExpectedScore,
      actual: first.actualScore,
      residual: first.performanceResidual,
    };
  }

  function index(events) {
    const byMatch = {};
    (events || []).filter((e) => e.eventType === Engine.EVENT.MATCH_UPDATE).forEach((e) => {
      const m = byMatch[e.matchId] || (byMatch[e.matchId] = { matchId: e.matchId, date: e.effectiveDate, _A: [], _B: [] });
      m['_' + e.side].push(e);
    });
    Object.values(byMatch).forEach((m) => {
      m.sides = { A: buildSide(m._A), B: buildSide(m._B) };
      m.byPlayer = {};
      ['A', 'B'].forEach((s) => {
        m.sides[s].players.forEach((p) => { m.byPlayer[p.playerId] = { ...p, side: s }; });
      });
      delete m._A; delete m._B;
    });
    return byMatch;
  }

  // The side a named player was on, and the side they were against. Callers ask
  // by player rather than by "winners"/"losers" so a draw -- which has neither
  // -- needs no special case.
  function forPlayer(facts, playerId) {
    if (!facts) return null;
    const me = facts.byPlayer[playerId];
    if (!me) return null;
    const other = me.side === 'A' ? 'B' : 'A';
    return { me, mine: facts.sides[me.side], theirs: facts.sides[other] };
  }

  return { index, forPlayer };
});
