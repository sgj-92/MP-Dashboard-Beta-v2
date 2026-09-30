// ===================== PLAYERS: PROFILE DATA =====================
// Facts the profile shows about a player: when they first played, their
// head-to-head record against the viewer, their Tier Rank neighbours and the
// match that would prove a call-out. Functional code; a redesigned profile
// consumes these.
//
// Extracted from shell.js unchanged (docs/architecture/PARALLEL_DEVELOPMENT_SPLIT.md).
// Owning stream: functional. Loads before app.js; declarations only.

// One relevant "prove it" matchup for this player -- same three sources
// buildCallOutSection already draws from.
function getMatchToProveIt(name){
  const relevant = [];
  WITHIN_TIER_GAMES.forEach(c=>{ if(c.a===name || c.b===name) relevant.push(c.matchup); });
  BOUNDARY_TESTS.forEach(c=>{ if(c.a===name || c.b===name) relevant.push(c.matchup); });
  CALIBRATION_GAMES.forEach(c=>{ if(c.name===name) relevant.push(c.matchup); });
  return relevant[0] || null;
}

// Direct record between two specific players as opponents -- a simple filter
// over existing match data, not a new rating calculation.
//
// Draws are counted as draws. They used to be counted as a win for whichever
// side the record filed first, because the two clauses below test side
// membership and a drawn match has both clauses true for arbitrary reasons.
function getHeadToHeadRecord(a, b){
  let aWins = 0, bWins = 0, draws = 0;
  h2hOpponentMatches(a, b).forEach(m=>{
    if(MatchOutcome.isDraw(m)) draws++;
    else if(m.winners.includes(a)) aWins++;
    else bWins++;
  });
  return { aWins, bWins, draws, total: aWins + bWins + draws };
}

function tierRankNeighbors(name){
  const target = PLAYERS.find(p=>p.name===name);
  if(!target) return { above: null, below: null };
  const pool = PLAYERS.filter(p => p.active || p.name === name).sort((a,b)=> b.rating - a.rating);
  const idx = pool.findIndex(p=>p.name===name);
  if(idx === -1) return { above: null, below: null };
  return {
    above: idx > 0 ? pool[idx-1] : null,
    below: idx < pool.length-1 ? pool[idx+1] : null,
  };
}

// Reliability is how much evidence stands behind the rating. It is NOT skill
// and must never read as a grade, so it sits in a neutral facts row beside
// tier and games played rather than anywhere near rank or win rate. It comes
// from the v3 record only: if that is missing for a player, the row says so
// instead of inventing a number.
function playerJoinedLabel(name){
  // Every game they played, so a player whose first appearance was a drawn
  // match is not dated from their second.
  const dates = matchesIncludingDraws()
    .filter(m => m.winners.includes(name) || m.losers.includes(name))
    .map(m => m.date)
    .sort();
  if(dates.length === 0) return null;
  const d = new Date(dates[0] + 'T00:00:00');
  return d.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
}
