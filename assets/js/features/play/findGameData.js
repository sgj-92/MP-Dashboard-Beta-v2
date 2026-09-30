// ===================== PLAY: MATCHMAKING AND CHALLENGES =====================
// The Find a Game engine -- candidate pairs and partners, complete matches,
// the Fresh / Proven / Tougher alternatives -- and the Challenge state
// machine (create, first and second pick, decline, cancel, bridge into a
// request). Decisions about who plays whom, so functional code: a redesigned
// Find a Game draws what these return. Predicted splits stay Admin-only (D4).
// Owning stream: functional. Loads before app.js; declarations only.
//
// Extracted from app.js unchanged (docs/architecture/PARALLEL_DEVELOPMENT_SPLIT.md).

function generateCandidatePairs(player, scope, diff, topN){
  const pool = PLAYERS.filter(p => p.name !== player.name && !INACTIVE_PLAYERS.has(p.name) && (scope==='any' || p.tier === player.tier));
  let target;
  if(scope === 'tier'){
    const tierRatings = PLAYERS.filter(p=>p.tier===player.tier && !INACTIVE_PLAYERS.has(p.name)).map(p=>p.rating);
    const tierMin = Math.min(...tierRatings), tierMax = Math.max(...tierRatings);
    target = diff==='easy' ? tierMin : (diff==='hard' ? tierMax : player.rating);
  } else {
    target = diff==='easy' ? player.rating - 150 : (diff==='hard' ? player.rating + 150 : player.rating);
  }

  const results = [];
  for(let i=0; i<pool.length; i++){
    for(let j=i+1; j<pool.length; j++){
      const p = pool[i], q = pool[j];
      const avg = (p.rating + q.rating) / 2;
      const gap = Math.abs(avg - target);
      const h2h_p = h2hCount(player.name, p.name);
      const h2h_q = h2hCount(player.name, q.name);
      results.push({ pair: [p.name, q.name], tiers: [p.tier, q.tier], avg: Math.round(avg*10)/10,
                      gap: Math.round(gap*10)/10, played_p: h2h_p, played_q: h2h_q });
    }
  }
  results.sort((a,b)=> a.gap - b.gap || (a.played_p+a.played_q) - (b.played_p+b.played_q));
  return results.slice(0, topN);
}

function generateCandidatePartners(player, scope, topN){
  const pool = PLAYERS.filter(p => p.name !== player.name && !INACTIVE_PLAYERS.has(p.name) && (scope==='any' || p.tier === player.tier));
  const poolNames = new Set(pool.map(p=>p.name));

  // known chemistry first
  const history = PARTNERSHIPS
    .filter(pt => pt.pair.includes(player.name) && poolNames.has(pt.pair[0]===player.name ? pt.pair[1] : pt.pair[0]))
    .map(pt => {
      const partnerName = pt.pair[0]===player.name ? pt.pair[1] : pt.pair[0];
      return { name: partnerName, source: 'history', games: pt.games, wins: pt.wins, losses: pt.losses,
               winpct: pt.winpct, chemistry: pt.avg_overperf };
    })
    .sort((a,b)=> b.chemistry - a.chemistry);

  const usedNames = new Set(history.map(h=>h.name));
  const fresh = pool
    .filter(p => !usedNames.has(p.name))
    .map(p => ({ name: p.name, source: 'fresh', tier: p.tier, rating: p.rating,
                 gap: Math.round(Math.abs(p.rating - player.rating)*10)/10,
                 played: h2hCount(player.name, p.name) }))
    .sort((a,b)=> a.gap - b.gap);

  return { history: history.slice(0, 2), fresh: fresh.slice(0, topN) };
}

function suggestPartnerForTarget(player, targetTeamAvg, scope, excludeNames){
  const excluded = new Set([player.name, ...(excludeNames || [])]);
  const pool = PLAYERS.filter(p => !excluded.has(p.name) && !INACTIVE_PLAYERS.has(p.name) && (scope==='any' || p.tier === player.tier));
  const idealPartnerRating = 2*targetTeamAvg - player.rating;

  let closest = null;
  pool.forEach(p=>{
    const gap = Math.abs(p.rating - idealPartnerRating);
    if(closest===null || gap < closest.gap) closest = {name:p.name, rating:p.rating, tier:p.tier, gap: Math.round(gap*10)/10};
  });

  const poolNames = new Set(pool.map(p=>p.name));
  const chemMatches = PARTNERSHIPS
    .filter(pt => pt.pair.includes(player.name) && pt.games>=2 && pt.avg_overperf > 3)
    .map(pt => pt.pair[0]===player.name ? pt.pair[1] : pt.pair[0])
    .filter(n => poolNames.has(n));

  return { closest, chemistryPartner: chemMatches.length ? chemMatches[0] : null };
}

// ===== Complete-match recommendations (Play / Find Game) =====
// Assembles the same two building blocks the legacy "Suggested opponents &
// who to bring" list already used -- generateCandidatePairs (opponent-pair
// ranking, scope/difficulty aware) and suggestPartnerForTarget (the partner
// who'd make that specific pair an even match, with a proven-chemistry flag)
// -- into single four-player recommendations instead of two separate lists.
// The predicted split reuses the same Elo expected-score formula already
// used for every other predicted outcome in the app (see enrichMatches /
// computeElo). No new matchmaking math, just a different presentation.
function lookupPartnership(a, b){
  return PARTNERSHIPS.find(pt => pt.pair.includes(a) && pt.pair.includes(b)) || null;
}

function eloExpectedShare(ratingFor, ratingAgainst){
  return 1/(1+Math.pow(10,(ratingAgainst-ratingFor)/400));
}

function buildCompleteMatch(player, oppCandidate, scope){
  const ps = suggestPartnerForTarget(player, oppCandidate.avg, scope, oppCandidate.pair);
  if(!ps.closest) return null;
  const partner = PLAYERS.find(p=>p.name===ps.closest.name);
  return buildCompleteMatchWithPartner(player, partner, oppCandidate);
}

// Same scoring/description logic as buildCompleteMatch, but for a partner
// that's already fixed (Build a Match's "Play with", or a completed
// Challenge) instead of one the engine chooses via suggestPartnerForTarget.
function buildCompleteMatchWithPartner(player, partner, oppCandidate){
  const opponents = [PLAYERS.find(p=>p.name===oppCandidate.pair[0]), PLAYERS.find(p=>p.name===oppCandidate.pair[1])];
  if(!partner || !opponents[0] || !opponents[1]) return null;

  const teamRating = (player.rating + partner.rating) / 2;
  const oppRating = oppCandidate.avg;
  const pct = Math.round(eloExpectedShare(teamRating, oppRating) * 100);
  const partnership = lookupPartnership(player.name, partner.name);
  const exposure = (partnership ? partnership.games : 0) + oppCandidate.played_p + oppCandidate.played_q;

  const veryEven = Math.abs(pct-50) <= 3;
  const balanceDesc = veryEven ? 'Almost perfectly balanced'
    : (pct > 50 ? `A slight edge to ${player.name}'s side` : 'A slight edge to the opponents');
  const partnerClause = partnership
    ? `a partnership with real chemistry (${partnership.wins}-${partnership.losses} together, ${partnership.avg_overperf>=0?'+':''}${partnership.avg_overperf}% overperformance)`
    : 'a fresh partnership combination';
  const whyLine = `${veryEven ? 'Very even ratings' : balanceDesc} with ${partnerClause}.`;
  // The same reason without the favourite call, for players (canSeePredictions).
  const ratingGap = Math.round(Math.abs(teamRating - oppRating));
  const whyLinePublic = `${veryEven ? 'Very even ratings' : `Team ratings ${ratingGap} points apart`} with ${partnerClause}.`;

  return {
    player, partner, opponents, tiers: oppCandidate.tiers,
    teamRating: Math.round(teamRating*10)/10, oppRating,
    pctFor: pct, pctAgainst: 100-pct,
    balanceDesc, whyLine, whyLinePublic, partnership, exposure,
    gap: oppCandidate.gap, playedOpp: [oppCandidate.played_p, oppCandidate.played_q],
  };
}

// Operates on any already-built matches array (plain Find Game or a
// constrained Build a Match run) -- purely a labeling pass over whatever
// candidates were produced, so Build a Match gets the same Fresh/Proven/
// Tougher treatment for free instead of a second, parallel implementation.
function categorizeAlternatives(matches, diff){
  const best = matches[0];
  const rest = matches.slice(1);
  const used = new Set();
  const alternatives = [];

  // Fresh Matchup -- the remaining option you (and your assembled team) have
  // the least shared history with, only labeled when that's genuinely low.
  const freshest = rest.filter(m=>!used.has(m)).sort((a,b)=>a.exposure-b.exposure)[0];
  if(freshest && freshest.exposure <= 2){
    alternatives.push({ tag:'Fresh Matchup', tagline:"A combination you haven't played much.", match: freshest });
    used.add(freshest);
  }

  // Proven Chemistry -- only when a remaining option's assembled partner
  // actually has a real (2+ game) partnership record.
  const proven = rest.filter(m=>!used.has(m) && m.partnership).sort((a,b)=>b.partnership.avg_overperf-a.partnership.avg_overperf)[0];
  if(proven){
    alternatives.push({ tag:'Proven Chemistry', tagline:'A partnership with a strong track record.', match: proven });
    used.add(proven);
  }

  // Tougher Test -- a genuinely stronger opponent pair than BEST MATCH,
  // only offered once you've already chosen Balanced or Hard.
  if(diff !== 'easy'){
    const tougher = rest.filter(m=>!used.has(m) && m.oppRating > best.oppRating).sort((a,b)=>b.oppRating-a.oppRating)[0];
    if(tougher){
      alternatives.push({ tag:'Tougher Test', tagline:'A stronger pair, if you want the harder test.', match: tougher });
      used.add(tougher);
    }
  }

  return alternatives.slice(0,3);
}

// A candidate pool large enough to cover every possible pair among the
// group (~40 players -> at most C(40,2)=780) -- used whenever a Build a
// Match constraint needs to filter the *full* ranked candidate list rather
// than just the first few, so a valid combination further down the gap-
// ranking is never missed just because it wasn't in the usual top 10.
const FG_ALL_CANDIDATES = 999;

// Build a Match: 'playWith'/'playAgainst' are optional player names (empty
// string = no constraint = identical output to plain Find Game). This is a
// filtering layer in front of the same generateCandidatePairs ranking, not
// a new matchmaking algorithm -- see the report note on where the
// difficulty *target* still anchors when a partner is fixed.
function buildFindGameRecommendations(player, scope, diff, playWith, playAgainst){
  playWith = playWith || '';
  playAgainst = playAgainst || '';

  let candidates = generateCandidatePairs(player, scope, diff, FG_ALL_CANDIDATES);
  if(playAgainst) candidates = candidates.filter(c => c.pair.includes(playAgainst));
  if(playWith) candidates = candidates.filter(c => !c.pair.includes(playWith));
  candidates = candidates.slice(0, 10);

  let matches;
  if(playWith){
    const partner = PLAYERS.find(p=>p.name===playWith);
    matches = candidates.map(c => buildCompleteMatchWithPartner(player, partner, c)).filter(Boolean);
  } else {
    matches = candidates.map(c => buildCompleteMatch(player, c, scope)).filter(Boolean);
  }
  if(matches.length === 0) return null;

  return { best: matches[0], alternatives: categorizeAlternatives(matches, diff), all: matches };
}

// ===== Challenge (sequential turn-based match construction) =====
// A small state machine, not a pile of booleans:
//   waiting_first_pick -> waiting_second_pick -> ready -> confirmed
//                      \_______________________/
//                       -> declined / cancelled (either waiting_* state)
// "draft" (the creation form, before Send Challenge) is local UI state only
// -- nothing is persisted until a challenge is actually sent.
//
// Stored under its own Firestore-backed key (challengesState /
// STORAGE_KEY_CHALLENGES, see above) rather than folded into
// gameRequestsState -- that store's shape (a fixed 4 named players +
// per-player confirmations) has no room for "only 2 of 4 players are known
// yet" or turn order without turning every request-reading function
// polymorphic. Once both picks are in, bridgeChallengeToRequest() hands off
// to that exact existing mechanism instead of inventing a parallel one.
//
// IDENTITY NOTE: there is no real login. getCurrentViewer() (presentation
// identity only, per its own doc comment in shell.js) decides which action
// buttons to *show* a given browser -- it is never treated as proof of who
// is actually acting, and nothing here touches the real admin/password
// boundary (isUnlocked). Anyone could open devtools and click a hidden
// button; this is the same trust model the rest of the app already uses
// for e.g. match edits and dev-area notes.
// CHALLENGE_RESTRICTIONS is declared in app.js beside TIER_ORDER_LIST, which it
// is built from at load time.

function challengeFirstAnchor(ch){ return ch.firstPicker==='challenger' ? ch.challenger : ch.challenged; }

function challengeSecondAnchor(ch){ return ch.firstPicker==='challenger' ? ch.challenged : ch.challenger; }

// Who a given pick may choose from: both anchors and (for the second pick)
// the already-chosen first partner are always excluded -- no duplicate
// player can ever reach the final four -- filtered by that pick's tier
// restriction and by the same inactive-player rule every other matchmaking
// path in this app already uses.
function challengeCandidatePool(ch, restriction, extraExclude){
  const excluded = new Set([ch.challenger, ch.challenged, ...(extraExclude || [])]);
  return PLAYERS.filter(p => !excluded.has(p.name) && !INACTIVE_PLAYERS.has(p.name) && (restriction==='any' || p.tier===restriction));
}

function challengeFinalPlayers(ch){
  if(ch.state!=='ready' && ch.state!=='confirmed') return null;
  const partnerOf = {};
  partnerOf[challengeFirstAnchor(ch)] = ch.firstPartner;
  partnerOf[challengeSecondAnchor(ch)] = ch.secondPartner;
  return [ch.challenger, partnerOf[ch.challenger], ch.challenged, partnerOf[ch.challenged]];
}

// Recomputes the finished match's display live from current PLAYERS data --
// reuses buildCompleteMatchWithPartner exactly as Build a Match does (see
// above), so a completed Challenge renders with the identical card language
// and the identical Elo expected-score formula. Nothing here is persisted.
function challengeToMatchView(ch){
  const players = challengeFinalPlayers(ch);
  if(!players || players.some(p=>!p)) return null;
  const challenger = PLAYERS.find(p=>p.name===ch.challenger);
  const challenged = PLAYERS.find(p=>p.name===ch.challenged);
  const firstAnchor = challengeFirstAnchor(ch);
  const challengerPartner = PLAYERS.find(p=>p.name === (firstAnchor===ch.challenger ? ch.firstPartner : ch.secondPartner));
  const challengedPartner = PLAYERS.find(p=>p.name === (firstAnchor===ch.challenged ? ch.firstPartner : ch.secondPartner));
  if(!challenger || !challenged || !challengerPartner || !challengedPartner) return null;
  return buildCompleteMatchWithPartner(challenger, challengerPartner, {
    pair: [challenged.name, challengedPartner.name],
    tiers: [challenged.tier, challengedPartner.tier],
    avg: (challenged.rating + challengedPartner.rating) / 2,
    played_p: h2hCount(challenger.name, challenged.name),
    played_q: h2hCount(challenger.name, challengedPartner.name),
    gap: 0,
  });
}

function createChallenge(challenger, challenged, firstPicker, firstRestriction, secondRestriction, createdBy){
  return {
    id: 'chl_' + Date.now() + '_' + Math.random().toString(36).slice(2,8),
    createdAt: new Date().toISOString(), createdBy,
    challenger, challenged, firstPicker, firstRestriction, secondRestriction,
    firstPartner: null, secondPartner: null,
    state: 'waiting_first_pick', linkedRequestId: null, respondedAt: null,
  };
}

async function makeFirstPick(ch, partnerName){
  if(ch.state !== 'waiting_first_pick') return false;
  if(!challengeCandidatePool(ch, ch.firstRestriction, []).find(p=>p.name===partnerName)) return false; // enforced, not just displayed
  const prevState = ch.state;
  ch.firstPartner = partnerName;
  ch.state = 'waiting_second_pick';
  const ok = await saveChallenges(challengesState);
  if(!ok){ ch.firstPartner = null; ch.state = prevState; }
  return ok;
}

async function makeSecondPick(ch, partnerName){
  if(ch.state !== 'waiting_second_pick') return false;
  if(!challengeCandidatePool(ch, ch.secondRestriction, [ch.firstPartner]).find(p=>p.name===partnerName)) return false;
  const prevState = ch.state;
  ch.secondPartner = partnerName;
  ch.state = 'ready';
  const ok = await saveChallenges(challengesState);
  if(!ok){ ch.secondPartner = null; ch.state = prevState; return false; }
  await bridgeChallengeToRequest(ch);
  return true;
}

// Once both picks are in, the challenge hands off entirely to the existing
// request/confirmation mechanics: the two anchors are auto-confirmed (they
// each made a deliberate, active choice to get here), but the two drafted
// partners still confirm themselves under Play > Requests, same as any
// ordinary request -- nobody is silently committed to a match they
// didn't agree to. Safe to retry: only pushes a request once linkedRequestId
// is actually set.
async function bridgeChallengeToRequest(ch){
  if(ch.linkedRequestId) return true;
  const players = challengeFinalPlayers(ch);
  if(!players || players.some(p=>!p)) return false;
  const confirmations = {};
  players.forEach(n=> confirmations[n] = false);
  confirmations[ch.challenger] = true;
  confirmations[ch.challenged] = true;
  const req = {
    id: 'req_' + Date.now() + '_' + Math.random().toString(36).slice(2,8),
    requestedBy: ch.createdBy || ch.challenger,
    requestedAt: new Date().toISOString(),
    players, preferredDate: '',
    confirmations,
    courtBookingMade: false,
    status: Object.values(confirmations).every(v=>v) ? 'confirmed' : 'pending',
    history: [{ at: new Date().toISOString(), by: ch.createdBy || ch.challenger, action: 'requested', fromChallenge: ch.id }],
  };
  if(req.status === 'confirmed') req.agreedAt = req.requestedAt;
  gameRequestsState.push(req);
  const ok = await saveGameRequests(gameRequestsState);
  if(!ok){ gameRequestsState.pop(); return false; }
  ch.state = 'confirmed';
  ch.linkedRequestId = req.id;
  return await saveChallenges(challengesState);
}

async function declineChallenge(ch){
  if(ch.state!=='waiting_first_pick' && ch.state!=='waiting_second_pick') return false;
  const prevState = ch.state;
  ch.state = 'declined';
  ch.respondedAt = new Date().toISOString();
  const ok = await saveChallenges(challengesState);
  if(!ok) ch.state = prevState;
  return ok;
}

async function cancelChallenge(ch){
  if(ch.state!=='waiting_first_pick' && ch.state!=='waiting_second_pick') return false;
  const prevState = ch.state;
  ch.state = 'cancelled';
  ch.respondedAt = new Date().toISOString();
  const ok = await saveChallenges(challengesState);
  if(!ok) ch.state = prevState;
  return ok;
}
