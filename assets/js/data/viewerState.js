// ===================== DATA: WHO IS VIEWING =====================
// The player this device has chosen as "My Player" (self-declared, stored on
// the device, not security), and the snapshot of that player's standing that
// Home and the profile read: rank, state, form, partners, requests, month.
// Every surface that personalises reads these; none decides it for itself.
//
// Extracted from shell.js unchanged (docs/architecture/PARALLEL_DEVELOPMENT_SPLIT.md).
// Owning stream: functional. The viewer selector UI stays in shell.js.
// Loads before app.js; declarations only.

// Player name is the identifier used throughout, since the existing data
// model has no separate player ID -- name is already the de facto stable
// key for tags, admin overrides, and every profile lookup in the app, so
// this stays consistent with that rather than inventing a new ID scheme.
const VIEWER_STORAGE_KEY = 'moneypadel_current_viewer';

// Returns the current viewer's full live player object (same shape as any
// entry in PLAYERS), or null if none is set / the saved name no longer
// exists in current player data (auto-clears a stale selection).
//
// PRIVACY/SECURITY BOUNDARY: this is presentation personalisation only.
// Selecting "Shaun" does not prove the user is Shaun -- nothing here is
// checked against, or should ever be checked against, for admin/password
// or any other sensitive gate. Existing admin auth stays fully separate.
function getCurrentViewer(){
  let savedName;
  try { savedName = localStorage.getItem(VIEWER_STORAGE_KEY); }
  catch(e){ return null; } // localStorage can be unavailable/restricted (e.g. private browsing) -- degrade gracefully
  if(!savedName) return null;
  const player = PLAYERS.find(p => p.name === savedName);
  // Gone from the data, or archived since this device chose them: the choice
  // is cleared, so "Who are you?" is asked again rather than personalising
  // the app for someone who has left the group.
  const live = player && (typeof PlayerStatus === 'undefined' || PlayerStatus.isLive(player.status));
  if(!live){ try{ localStorage.removeItem(VIEWER_STORAGE_KEY); }catch(e){} return null; }
  return player;
}

function setCurrentViewer(playerName){
  try { localStorage.setItem(VIEWER_STORAGE_KEY, playerName); } catch(e){ /* selection just won't persist this session */ }
  document.dispatchEvent(new CustomEvent('viewerchanged', { detail: { name: playerName } }));
}

function clearCurrentViewer(){
  try { localStorage.removeItem(VIEWER_STORAGE_KEY); } catch(e){}
  document.dispatchEvent(new CustomEvent('viewerchanged', { detail: { name: null } }));
}

// ---- Data-layer snapshot for the future personalised Home ----------------
// Pulls together existing, already-computed data for one player -- reuses
// PLAYERS, computeRecentForm, BEST_PARTNER, H2H, BOUNDARY_TESTS and
// gameRequestsState exactly as they already exist. No parallel ranking,
// form, partnership or matchmaking logic is created here.
function getViewerSnapshot(name){
  const p = PLAYERS.find(x=>x.name===name);
  if(!p) return null;

  // Overall / tier rank -- the SAME rule as the live Rankings list, via the one
  // helper. It used to add `x.total>=10` on top, which is the rankings list's
  // default min-games *display filter*, not an eligibility rule. That extra
  // condition is why five genuinely active players -- Ant Slice among them,
  // with eight rated matches in the last thirty days -- saw "#– in Tier A ·
  // #– Overall" on their own profile. A display filter must never decide
  // whether somebody has a rank.
  // Both now come from the one Tier Rank definition (tierRankOf, app.js).
  const tr = tierRankOf(name);
  const overallRank = tr.overallRank || 0;
  const tierRank = tr.rank || 0;
  const state = playerStateOf(name);

  const form = computeRecentForm(name, 10);
  const bestPartner = BEST_PARTNER[name] || null;
  // H2H is a flat "sorted-pair -> meeting count" structure (see h2hCount()
  // in app.js), not a per-player breakdown -- this finds whichever opponent
  // this player has met most often. A richer win/loss-per-rival breakdown
  // would need a small new helper over MATCHES (the H2H tab computes that
  // inline, per-pair, rather than as a reusable function) -- flagged in the
  // report back rather than built speculatively here.
  let topRivalry = null, maxMeetings = 0;
  Object.entries(H2H).forEach(([key, count])=>{
    const [a,b] = key.split('|');
    if((a===name || b===name) && count > maxMeetings){
      maxMeetings = count;
      topRivalry = { opponent: a===name ? b : a, meetings: count };
    }
  });
  const boundaryMatchups = BOUNDARY_TESTS.filter(c => c.a===name || c.b===name);

  const involvedGames = gameRequestsState.filter(g => g.players && g.players.includes(name));
  const upcoming = involvedGames.filter(g => g.status === 'confirmed');
  const pending = involvedGames.filter(g => g.status === 'pending');

  // Home's month is the Meaningful Month, pinned when Home is arrived at. It
  // used to be "the latest month with any match at all" -- pending
  // submissions included -- which on the 1st crowned a Player of the Month
  // off one game, and all month long headed the card with a different month
  // from the League review its own "View Full Review" opened.
  const currentMonth = (typeof homeMonth === 'function') ? homeMonth() : null;
  const monthStats = currentMonth ? (computeMonthlyStats(currentMonth)[name] || null) : null;
  const monthRating = currentMonth ? (monthEndRatings(currentMonth)[name] ?? null) : null;

  return {
    name: p.name, tier: p.tier, rating: p.rating,
    overallRank: overallRank > 0 ? overallRank : null,
    tierRank: tierRank > 0 ? tierRank : null,
    tierRankOf: tr.of,
    eligible: isRankingEligible(name),
    // The full state, so a surface can say WHY there is no rank rather than
    // printing a dash and leaving it looking like missing data.
    state,
    total: p.total, wins: p.wins, losses: p.losses, winpct: p.winpct,
    recentForm: form,
    bestPartner,
    topRivalry,
    boundaryMatchups,
    upcomingGames: upcoming,
    pendingRequests: pending,
    currentMonth, monthStats, monthRating,
  };
}
