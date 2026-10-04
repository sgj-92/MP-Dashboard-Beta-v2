// ===================== HOME: DATA =====================
// What Home says about the club and the viewer: the promotion-gap proxy, Club
// Pulse (top ranked, in form, promotion watch), the match to make, and a
// player's recent form as W / D / L. Functional; a redesigned Home consumes
// these.
//
// Extracted from shell.js unchanged (docs/architecture/PARALLEL_DEVELOPMENT_SPLIT.md).
// Owning stream: functional. Loads before app.js; declarations only.

// "Points off promotion": no formal admin-decided promotion threshold exists
// in the app (tier seeds are starting points for new players, not boundaries
// -- ratings drift organically by design). This uses the lowest current
// rating among players already in the tier above as a live, defensible proxy
// for "roughly what it'd take" -- flagged here and in the report back, since
// it's an interpretation, not an existing formal rule.
function computePromotionGap(name){
  const p = PLAYERS.find(x=>x.name===name);
  if(!p) return null;
  const order = ['C','B','A','S'];
  const idx = order.indexOf(p.tier);
  if(idx === -1 || idx === order.length-1) return null; // top tier or unknown
  const tierAbove = order[idx+1];
  // The tier above as the group stands now: someone who has left (archived)
  // does not set the bar.
  const aboveRatings = livePlayers().filter(x=>x.tier===tierAbove).map(x=>x.rating);
  if(!aboveRatings.length) return null;
  const boundary = Math.min(...aboveRatings);
  const gap = Math.round(boundary - p.rating);
  return { tierAbove, gap };
}

function computeClubPulse(){
  // Same rule as the Rankings list and the profile, via the one helper. This
  // carried the same stray `total>=10` that made five active players rankless
  // on their own profile, so Club Pulse could name a "top ranked" player the
  // rankings list did not have at the top.
  const eligible = PLAYERS.filter(p=>isRankingEligible(p.name));
  const topRanked = eligible.slice().sort((a,b)=>b.rating-a.rating)[0] || null;

  // Club Pulse is about who is playing now: temporarily inactive and archived
  // players are not "in form" or "on promotion watch".
  const playing = PLAYERS.filter(p => p.active);
  let inForm = null;
  playing.forEach(p=>{
    if(p.recent_form!==null && p.recent_form!==undefined && !p.recent_form_stale && p.recent_form_games>=3){
      if(!inForm || p.recent_form > inForm.recent_form) inForm = p;
    }
  });

  let promotionWatch = null, smallestGap = Infinity;
  playing.forEach(p=>{
    const g = computePromotionGap(p.name);
    if(g && g.gap > 0 && g.gap < smallestGap){ smallestGap = g.gap; promotionWatch = { ...p, gap: g.gap, tierAbove: g.tierAbove }; }
  });

  return { topRanked, inForm, promotionWatch };
}

function computeMatchToMake(viewerName){
  const viewer = PLAYERS.find(p=>p.name===viewerName);
  if(!viewer) return null;
  const partnerCandidates = generateCandidatePartners(viewer, 'any', 1);
  // Same priority the real Find a Game feature uses: proven chemistry first
  // (already sorted best-first), then the closest-rated fresh option.
  const bestPartnerCandidate = (partnerCandidates.history && partnerCandidates.history[0])
    || (partnerCandidates.fresh && partnerCandidates.fresh[0]);
  if(!bestPartnerCandidate) return null;
  const partner = PLAYERS.find(p=>p.name===bestPartnerCandidate.name);
  if(!partner) return null;
  const teamAvg = (viewer.rating + partner.rating) / 2;

  const pool = PLAYERS.filter(p => p.name!==viewer.name && p.name!==partner.name && !INACTIVE_PLAYERS.has(p.name));
  let best = null, bestGap = Infinity;
  for(let i=0;i<pool.length;i++) for(let j=i+1;j<pool.length;j++){
    const a = pool[i], b = pool[j];
    const avg = (a.rating + b.rating) / 2;
    const gap = Math.abs(avg - teamAvg);
    if(gap < bestGap){ bestGap = gap; best = [a,b]; }
  }
  if(!best) return null;

  const oppAvg = (best[0].rating + best[1].rating) / 2;
  const expected = 1 / (1 + Math.pow(10, (oppAvg - teamAvg) / 400)); // same Elo formula used elsewhere in the app
  const pct = Math.round(expected * 100);
  const desc = Math.abs(pct-50) <= 3 ? 'Almost perfectly balanced.' : (pct>50 ? 'Slight edge to your side.' : 'Slight edge to the opponents.');

  return { partner, opponents: best, pctFor: pct, pctAgainst: 100-pct, description: desc };
}

// The real per-game sequence behind the aggregate counts, oldest-to-newest,
// as the LETTERS 'W' / 'D' / 'L'. Letters rather than booleans because a
// boolean cannot hold a draw: the old version mapped every game to
// `winners.includes(name)`, which on a drawn match is whichever side the
// record happened to file the player on.
//
// Every letter is truthy, so a caller testing this for truth gets a win every
// time -- which is exactly what happened to Home's dots. Callers must go
// through MatchOutcome.classFor(), never a conditional of their own.
function computeRecentFormSequence(name, windowSize){
  windowSize = windowSize || 10;
  const own = MATCHES.filter(m => m.winners.includes(name) || m.losers.includes(name))
    .sort((a,b)=> a.date < b.date ? 1 : -1) // newest first
    .slice(0, windowSize);
  return own.reverse().map(m => MatchOutcome.letterFor(m, name));
}
