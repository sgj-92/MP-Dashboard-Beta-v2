// ===================== UI: MATCH DETAIL =====================
// The expanded card for one played match -- ratings going in, the favoured
// line, expected vs won, each player's movement, "Why your rating moved" and
// "See full calculation". Shared by Games, the player profile and Head to
// Head, so it is one component rather than three copies. It reads the
// engine's recorded facts (MatchFacts, RatingExplainer); it calculates
// nothing.
//
// Extracted from app.js unchanged (docs/architecture/PARALLEL_DEVELOPMENT_SPLIT.md).
// Owning stream: redesign (presentation of facts owned by the functional stream).

// The rating each player in this match actually moved by, read back from the
// engine. There is deliberately no single per-match figure and no month-scoped
// variant: K is per-player, so the four players move by four different amounts,
// and the rating is continuous, so a match moved it by exactly one amount
// whichever month filter happens to be on screen.
// "Why your rating moved", in the order a player actually thinks in: were we
// favoured, what were we expected to take, what did we take and did we win, and
// so what did that earn or cost. Everything in it is read back from the facts
// the engine recorded at the time -- there is no second calculation path, and
// the movement quoted is the stored movement.
//
// The decimals live behind "See full calculation". "Performance score 0.20
// against 0.18 expected" is exactly right and tells a normal player nothing.
//
// Only rendered where the app knows whose card this is; a neutral match card
// has no "you" to address.
function whyYourRatingMovedHtml(m, name){
  if(typeof RatingExplainer === 'undefined') return '';
  const facts = V3_MATCH_FACTS[m.id];
  if(!facts) return '';
  const view = MatchFacts.forPlayer(facts, name);
  if(!view) return '';

  // The real game counts for this player's side, from the match record.
  const onStoredWinningSide = playerIsOnStoredWinningSide(m, name);
  const games = (typeof m.games_winner === 'number' && typeof m.games_loser === 'number')
    ? { mine: onStoredWinningSide ? m.games_winner : m.games_loser,
        theirs: onStoredWinningSide ? m.games_loser : m.games_winner }
    : null;
  const result = m.isDraw ? 'draw' : (m.winners.includes(name) ? 'win' : 'loss');

  const e = RatingExplainer.explain(view, result, games);
  if(!e) return '';
  return `<div class="why-moved">
    <div class="why-moved-head">Why ${name}'s rating moved</div>
    <div class="why-moved-body">${e.lines.join(' ')}</div>
    <div class="why-moved-note">${e.blendNote}</div>
    ${buildMatchCalcDisclosureHtml(m, name)}
  </div>`;
}

// The exact persisted figures, one level down. This is where the raw decimals
// belong: in front of anyone who asks, in front of nobody who does not.
//
// One builder for every card, so the profile, the monthly breakdown and the
// Games feed can never drift into saying different things about one match.
// `focusPlayer` narrows the per-player rows to that player; without it every
// player's own K, reliability and movement is listed, because K is per player
// and a neutral card has no single "you".
//
// It reads V3_MATCH_FACTS -- what the engine recorded when the match was rated.
// There is no second calculation here; the rows are the same numbers that
// produced the movement shown on the card.
function buildMatchCalcDisclosureHtml(m, focusPlayer){
  const facts = V3_MATCH_FACTS[m.id];
  if(!facts) return '';
  const side = focusPlayer ? MatchFacts.forPlayer(facts, focusPlayer) : null;
  if(focusPlayer && !side) return '';

  // Neutral cards describe the stored first-named side, which for a decided
  // match is the winners.
  const view = side || { mine: facts.sides.A, theirs: facts.sides.B };
  const label = focusPlayer ? `${focusPlayer}'s side` : (m.isDraw ? 'the first-named pair' : 'the winners');

  const onStoredWinningSide = focusPlayer ? playerIsOnStoredWinningSide(m, focusPlayer) : true;
  const gamesMine = onStoredWinningSide ? m.games_winner : m.games_loser;
  const gamesTheirs = onStoredWinningSide ? m.games_loser : m.games_winner;
  const total = gamesMine + gamesTheirs;

  // The 20% component, as the engine scores it: 1 / 0.5 / 0.
  const resultScore = m.isDraw ? 0.5 : (onStoredWinningSide ? 1 : 0);
  const resultWord = m.isDraw ? 'draw' : (onStoredWinningSide ? 'won' : 'lost');

  const rows = [
    ['Pre-match expected score', view.mine.expected.toFixed(2)],
    ['Share of games won', total ? `${gamesMine} of ${total} (${Math.round((gamesMine/total)*100)}%)` : '—'],
    ['Match result contribution', `${resultScore.toFixed(2)} (${resultWord})`],
    ['Blended performance score', `${view.mine.actual.toFixed(2)}  =  0.80 × ${total ? (gamesMine/total).toFixed(2) : '—'} + 0.20 × ${resultScore.toFixed(2)}`],
    ['Difference', `${view.mine.residual > 0 ? '+' : ''}${view.mine.residual.toFixed(2)}`],
  ];

  const people = focusPlayer ? [facts.byPlayer[focusPlayer]]
    : Object.values(facts.byPlayer).sort((a,b)=> a.playerId < b.playerId ? -1 : 1);
  const perPlayer = people.filter(Boolean).map(p=>{
    const k = (typeof RatingExplainer !== 'undefined') ? RatingExplainer.kText(p.kUsed) : String(Math.round(p.kUsed*10)/10);
    const rel = `${Math.round(p.previousReliability*100)}% → ${Math.round(p.newReliability*100)}%`;
    const move = `${p.ratingDelta > 0 ? '+' : ''}${p.ratingDelta}`;
    return `<div class="wm-calc-row"><span>${p.playerId}</span><b>K ${k} · reliability ${rel} · ${move}</b></div>`;
  }).join('');

  // For one named player, close the loop: K times the difference IS the
  // movement above. Four of these on a neutral card would be noise.
  const focus = focusPlayer ? facts.byPlayer[focusPlayer] : null;
  const arithmetic = focus
    ? `<div class="wm-calc-sum">${(typeof RatingExplainer !== 'undefined') ? RatingExplainer.kText(focus.kUsed) : Math.round(focus.kUsed)} × (${view.mine.actual.toFixed(2)} − ${view.mine.expected.toFixed(2)}) = ${focus.ratingDelta > 0 ? '+' : ''}${focus.ratingDelta}</div>`
    : '';

  return `<details class="wm-calc">
    <summary class="wm-calc-summary">See full calculation</summary>
    <div class="wm-calc-body">
      <div class="wm-calc-label">For ${label}</div>
      ${rows.map(([k,v])=>`<div class="wm-calc-row"><span>${k}</span><b>${v}</b></div>`).join('')}
      <div class="wm-calc-label">Each player's own weighting and movement</div>
      ${perPlayer}
      ${arithmetic}
      <div class="wm-calc-note">Every figure here was recorded when the match was rated and is read back, never recomputed. K is worked out per player from that player's own evidence, which is why the four movements differ.</div>
    </div>
  </details>`;
}

function matchDeltaLineHtml(m){
  if(!m.deltas) return '';
  const side = (names) => names.map(n=>{
    const d = m.deltas[n];
    if(!d) return `${n} —`;
    const cls = d.ratingDelta > 0 ? 'perf-pos' : (d.ratingDelta < 0 ? 'perf-neg' : '');
    const lbl = d.ratingDelta > 0 ? `+${d.ratingDelta}` : `${d.ratingDelta}`;
    return `${n} <span class="${cls}" style="font-weight:700;">${lbl}</span>`;
  }).join(' &nbsp;·&nbsp; ');
  return `<div style="margin-top:6px;">
    <div style="font-size:10px; color:var(--gold-soft); text-transform:uppercase; letter-spacing:.03em; margin-bottom:2px;">Rating change, per player</div>
    <div>${side(m.winners)}</div>
    <div>${side(m.losers)}</div>
    <div style="font-size:10.5px; margin-top:3px;">Each player moves by their own amount: the less established a rating is, the further one result moves it.</div>
  </div>`;
}

// A draw counts as a win for nobody -- it is kept out of every record -- but it
// IS rated: the engine scores the result 0.5 for both sides and moves every
// player. The card used to say it "doesn't affect any rating", which was simply
// untrue; one recorded draw moved a player by more than 10 points.
function buildDrawDetailBlock(m){
  const facts = V3_MATCH_FACTS[m.id];
  if(!facts) return `<div style="margin-top:8px; padding-top:8px; border-top:1px solid var(--line); font-size:11.5px; color:var(--text-dim);">Recorded as unfinished / a draw. No rating was computed from it.</div>`;
  const line = (names) => names.map(n=>{
    const d = facts.byPlayer[n];
    if(!d) return `${n} —`;
    const cls = d.ratingDelta > 0 ? 'perf-pos' : (d.ratingDelta < 0 ? 'perf-neg' : '');
    return `${n} (${Math.round(d.preMatchRating)}) <span class="${cls}" style="font-weight:700;">${d.ratingDelta > 0 ? '+' : ''}${d.ratingDelta}</span>`;
  }).join(' &nbsp;·&nbsp; ');
  return `<div style="margin-top:8px; padding-top:8px; border-top:1px solid var(--line); font-size:11.5px; color:var(--text-dim); line-height:1.6;">
    <div>Recorded as unfinished / a draw. It counts as a win or a loss for nobody and stays out of every record — but it is rated: the result scores 0.5 for both sides, and how far that beat each side's expectation still moves the ratings.</div>
    <div style="margin-top:6px;">
      <div style="font-size:10px; color:var(--gold-soft); text-transform:uppercase; letter-spacing:.03em; margin-bottom:2px;">Rating change, per player</div>
      <div>${line(m.winners)}</div>
      <div>${line(m.losers)}</div>
    </div>
  </div>`;
}

function buildMatchDetailBlock(m, contextHasMonthFigure){
  const gap = Math.abs(m.team_w_rating - m.team_l_rating);
  const isClose = gap < 15;
  const winnerFavored = m.team_w_rating > m.team_l_rating;
  const sideLabel = m.isDraw ? 'first-named pair' : 'winners';
  const favLabel = isClose
    ? `evenly matched going in (${Math.round(gap)} pt gap)`
    : (winnerFavored ? `${sideLabel} favoured by ${Math.round(gap)} pts going in` : `${sideLabel} were underdogs by ${Math.round(gap)} pts going in`);

  // Ratings AND tiers as they were at the time, not as they are now. The
  // pairing shown beside a June match is the pairing that played it.
  const atTheTimeRating = (n) => (m.deltas && m.deltas[n]) ? Math.round(m.deltas[n].preMatchRating) : ratingOf(n);
  const winnersWithRatings = namesWithHistoricalTier(m.winners, m.date, atTheTimeRating);
  const losersWithRatings = namesWithHistoricalTier(m.losers, m.date, atTheTimeRating);

  // One line, not four. The expectation, what was actually taken, and how the
  // match ended -- everything else that used to sit here was explaining the
  // model rather than the match, and belongs in the disclosure.
  const expectedPct = Math.round(m.expected_score*100);
  const actualPct = Math.round(m.game_share_winner*100);
  const total = m.games_winner + m.games_loser;
  const resultWord = m.isDraw ? 'not finished' : 'won match';

  return `<div style="margin-top:8px; padding-top:8px; border-top:1px solid var(--line); font-size:11.5px; color:var(--text-dim); line-height:1.6;">
    <div><b style="color:var(--text);">${winnersWithRatings}</b> vs ${losersWithRatings} <span style="font-size:10.5px;">(ratings going in)</span></div>
    <div style="margin-top:4px;">${favLabel}</div>
    <div>Expected ${expectedPct}% of games · won ${m.games_winner}/${total} (${actualPct}%) · ${resultWord}</div>
    ${matchDeltaLineHtml(m)}
    ${buildMatchCalcDisclosureHtml(m)}
  </div>`;
}
