// ===================== PREDICTION BATCH =====================
// Predict a Matchup's rules for what makes a match predictable, and for a
// batch of up to five of them (Shaun, 10 Oct).
//
//   A match is four slots: Team A's two players, Team B's two. It is predicted
//   only once all four hold a club player, no player twice. Before that there
//   is nothing to show -- no card, no percentages, no partial guess.
//
//   The prediction itself is the caller's `predict` (predictMatchup() ->
//   MatchPrediction.build, the engine's own expectation), never worked out
//   here, so a batch of five is five ordinary predictions.
//
//   A batch holds 1-5 matches. Another may be added only while every match in
//   it is complete, so the batch never fills with empty forms.
//
// PURE: player names are resolved by the caller's `canonical`.

(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.PredictionBatch = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const MAX = 5;
  const SLOTS = ['a1', 'a2', 'b1', 'b2'];
  const PROMPT = 'Select 4 players to generate a prediction';

  const empty = () => ({ a1: '', a2: '', b1: '', b2: '' });

  // match: { a1, a2, b1, b2 } as typed. o.canonical(name) -> the roster's
  // name for it, or null. o.predict(teamA, teamB) -> MatchPrediction.build.
  // -> { ok, slots: { a1: { name, state }, ... }, prediction?, prompt?, reason? }
  //    state: 'empty' | 'unknown' | 'duplicate' | 'ok'
  function evaluate(match, o) {
    const m = match || {};
    const canonical = o.canonical;
    const seen = new Set();
    const slots = {};
    SLOTS.forEach((s) => {
      const typed = String(m[s] || '').trim();
      if (!typed) { slots[s] = { name: '', state: 'empty' }; return; }
      const name = canonical(typed);
      if (!name) { slots[s] = { name: typed, state: 'unknown' }; return; }
      const key = name.toLowerCase();
      // The second time a player appears is the one in the wrong place.
      if (seen.has(key)) { slots[s] = { name, state: 'duplicate' }; return; }
      seen.add(key);
      slots[s] = { name, state: 'ok' };
    });
    const states = SLOTS.map((s) => slots[s].state);
    if (states.includes('duplicate')) {
      return { ok: false, slots, reason: 'A player can only be in a match once.' };
    }
    if (states.includes('empty')) return { ok: false, slots, prompt: PROMPT };
    const unknown = SLOTS.filter((s) => slots[s].state === 'unknown').map((s) => slots[s].name);
    if (unknown.length) return { ok: false, slots, reason: `Not a club player: ${unknown.join(', ')}.` };
    const prediction = o.predict([slots.a1.name, slots.a2.name], [slots.b1.name, slots.b2.name]);
    if (!prediction || !prediction.ok) {
      return { ok: false, slots, reason: (prediction && prediction.reason) || 'This matchup cannot be predicted.' };
    }
    return { ok: true, slots, prediction };
  }

  // Another match may be added while there is room and every match so far is
  // a prediction.
  function canAdd(evaluations) {
    return evaluations.length < MAX && evaluations.length > 0 && evaluations.every((e) => e.ok);
  }

  function add(matches) {
    return matches.length >= MAX ? matches.slice() : matches.concat([empty()]);
  }

  // Removes one; the rest close up, so they number 1..n again. A batch is
  // never emptied: removing the last leaves one empty match.
  function remove(matches, i) {
    const out = matches.filter((_, k) => k !== i);
    return out.length ? out : [empty()];
  }

  // The names already taken in a match, so a picker can leave them out.
  function taken(match, except, canonical) {
    return SLOTS.filter((s) => s !== except)
      .map((s) => canonical(String((match || {})[s] || '').trim()))
      .filter(Boolean);
  }

  return { MAX, SLOTS, PROMPT, empty, evaluate, canAdd, add, remove, taken };
});
