// ===================== PLAYER FORM =====================
// One player's results, the one way: their most recent games, their record,
// and their win rate, from the full list of rated games INCLUDING draws.
//
// Why it exists (Shaun, 15 Oct -- Jams). The profile's form and its "3–7 · Last
// 10" were built from MATCHES, the set the rating's win/loss figures are drawn
// from, which deliberately leaves draws out. So a draw was not mislabelled --
// it was skipped, and an older decided game slid into the ten in its place.
// Recent Results, a few lines further down the same profile, read the full
// list and showed the draws. The two could not agree.
//
// So every surface that describes a player's recent games -- the profile's
// form and record, Home's form, the profile's Win Rate, and anything later
// (Rating Review flags) -- asks this module, and every result is decided by
// MatchOutcome, the same classification Recent Results uses. A draw is a draw:
// never a win, never a loss, never dropped.
//
//   order     newest first by date; games on one date by the record's own
//             sequence (the id's trailing number, YYYY-MM-DD-N), so "the last
//             ten" is one fixed set and matches the order Recent Results lists
//   window    a player's latest `window` games (10); fewer if they have fewer
//   run       those games' letters, OLDEST to newest -- the form strip reads
//             left to right and ends on the latest game, as it always has
//   win rate  wins / games played, draws included, to 0.1 -- the League's and
//             the Games log's definition (gamesFilter.js)
//   vs exp.   the mean of the player's own residual over the same games: the
//             stored residual is the first-listed side's, so it is negated for
//             the other side, draws exactly as decided games
//
// PURE: the matches are passed in; MatchOutcome is the page's or require()'d.

(function (root, factory) {
  const api = factory(root);
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.PlayerForm = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function (root) {
  'use strict';

  const WINDOW = 10;
  const MO = () => (root && root.MatchOutcome) || require('../../matchOutcome.js');

  // The record's order within a date: the id's trailing sequence number.
  function seqOf(m) {
    if (typeof m.sourceIndex === 'number') return m.sourceIndex;
    const tail = /-(\d+)$/.exec(String(m.id || ''));
    return tail ? Number(tail[1]) : 0;
  }

  function newestFirst(matches) {
    return (matches || []).slice().sort((a, b) => {
      if (a.date !== b.date) return a.date < b.date ? 1 : -1;
      return seqOf(b) - seqOf(a);
    });
  }

  // Every game the player was in, newest first.
  function gamesOf(matches, name) {
    const outcome = MO().outcomeFor;
    return newestFirst((matches || []).filter((m) => outcome(m, name) !== null));
  }

  function tally(games, name) {
    const t = MO().tally(games, name);
    return { played: t.played, wins: t.wins, draws: t.draws, losses: t.losses,
      winpct: t.played ? Math.round(1000 * t.wins / t.played) / 10 : 0 };
  }

  // A player's whole record.
  function record(matches, name) { return tally(gamesOf(matches, name), name); }

  // A player's latest `window` games. Null if they have none.
  function recent(matches, name, window) {
    const games = gamesOf(matches, name).slice(0, window || WINDOW);
    if (!games.length) return null;
    const letters = games.map((m) => MO().letterFor(m, name));
    const residuals = games.map((m) => {
      const r = Number(m.performance_residual);
      if (!isFinite(r)) return null;
      return (m.winners || []).includes(name) ? r : -r;
    }).filter((r) => r !== null);
    const avg = residuals.length ? residuals.reduce((s, x) => s + x, 0) / residuals.length : 0;
    return {
      ...tally(games, name),
      games,                                   // newest first
      results: letters,                        // newest first
      run: letters.slice().reverse(),          // oldest -> newest, as drawn
      avgPct: Math.round(avg * 1000) / 10,
      lastGameDate: games[0].date,
    };
  }

  // "1W · 3D · 6L" -- every outcome named, so it adds up to the strip above it.
  function recordText(r) {
    return r ? `${r.wins}W · ${r.draws}D · ${r.losses}L` : '';
  }

  // The same, where a table cell has no room: "1W-3D-6L", or "4W-6L" when
  // there were no draws (so a record without draws reads as it always has).
  function recordShort(r) {
    if (!r) return '';
    return r.draws ? `${r.wins}W-${r.draws}D-${r.losses}L` : `${r.wins}W-${r.losses}L`;
  }

  return { WINDOW, seqOf, newestFirst, gamesOf, record, recent, recordText, recordShort };
});
