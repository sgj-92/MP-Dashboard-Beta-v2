// ===================== MATCHUP CARD =====================
// Predict a Matchup's result as a card the group can read at a glance -- on
// screen and as the shared picture (CardPainter.matchup), from this one view
// model, so the two cannot say different things.
//
// It presents MatchPrediction.build's answer and calculates nothing new:
//
//   the call       from the prediction's own `confidence` (its thresholds):
//                  level -> "Too close to call", shade -> "Slight edge",
//                  clear -> "Projected favourites"
//   share of games the prediction's shareA / shareB -- the engine's expected
//                  score, which Predict a Matchup has always presented as the
//                  share of the games each side is expected to take (Shaun,
//                  21 Sep), and the card's one big number (Shaun, 4 Oct: the
//                  % of games rather than a number of games). Never a chance of
//                  winning: no win-probability model has been validated for
//                  this club.
//
// Pure: no page, no app state.

(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.MatchupCard = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const CALL = {
    level: { kicker: 'Too close to call', named: false },
    shade: { kicker: 'Slight edge', named: true },
    clear: { kicker: 'Projected favourites', named: true },
  };

  const names = (team) => team.map((p) => p.name).join(' & ');

  // pred: MatchPrediction.build(...) (ok). o.tierOf(name) -> tier or null.
  function build(pred, o = {}) {
    if (!pred || !pred.ok) return null;
    const tierOf = o.tierOf || (() => null);
    const side = (team) => team.map((n) => ({ name: n, tier: tierOf(n) || null }));
    const teamA = side(pred.teamA);
    const teamB = side(pred.teamB);
    const call = CALL[pred.confidence] || CALL.level;
    const favoured = call.named && pred.favoured
      ? (pred.aFavoured ? 'A' : 'B') : null;
    const fav = favoured === 'A' ? teamA : favoured === 'B' ? teamB : null;
    return {
      teamA, teamB,
      call: {
        kind: pred.confidence,
        kicker: call.kicker,
        // The side named, or nothing when it is too close to call.
        favoured,
        names: fav ? names(fav) : '',
        headline: fav ? `${call.kicker}: ${names(fav)}` : call.kicker,
      },
      // Whole percentages that add up to 100, as the prediction rounds them.
      share: { a: pred.shareA, b: pred.shareB },
      gap: Math.round(pred.gap),
      foot: 'Based on current Power Ratings · a prediction, not a result',
    };
  }

  // The card in words, for WhatsApp when a picture cannot be copied.
  function summaryText(card) {
    if (!card) return '';
    const lines = [`🎾 Predicted matchup: ${names(card.teamA)} vs ${names(card.teamB)}`, card.call.headline];
    lines.push(`Expected share of games: ${card.share.a}% – ${card.share.b}%`);
    lines.push('Based on current Power Ratings');
    return lines.join('\n');
  }

  return { CALL, build, summaryText };
});
