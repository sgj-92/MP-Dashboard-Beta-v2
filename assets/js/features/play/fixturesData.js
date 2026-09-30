// ===================== PLAY: FIXTURE DATA AND ACTIONS =====================
// The functional half of Requests / Upcoming: which requests are For me, Mine
// or Other for a viewer; a request's two sides; who is acting; the one path
// every fixture change is committed through (rules in fixtureFlow.js, saved,
// rolled back on refusal, then one refresh); and the prediction binding.
// A redesigned Play screen calls these; it never re-derives them.
//
// Extracted from app.js unchanged (docs/architecture/PARALLEL_DEVELOPMENT_SPLIT.md).
// Owning stream: functional. Loads before app.js; declarations only.

// What a refused change says, in the club's words.
const FIXTURE_REFUSALS = {
  'not-participant': 'Only the players in this game can answer for it.',
  'not-admin': 'Only an admin can change a fixture.',
  'closed': 'This fixture is no longer open.',
  'missing-player': 'Every seat needs a player.',
  'duplicate-player': 'The same player is in two seats.',
  'already-playing': 'That player is already in this game.',
  'archived': 'This call-out is archived — an admin can restore it.',
  'not-agreed': 'A court can be booked once all four players are in.',
  'backed-out': 'You have backed out of this game.',
  'not-called-out': 'Only an active Called Out game can be archived.',
  'not-archived': 'This game is not archived.',
};

function fixtureActor(){
  const v = (typeof getCurrentViewer === 'function') ? getCurrentViewer() : null;
  return v ? v.name : null;
}

function fixtureAdminName(){
  return (currentUserName && currentUserName.trim()) || fixtureActor() || 'Admin';
}

// Apply one fixture change and store it. The change is made through
// FixtureFlow, which refuses anything the actor may not do; a failed save
// puts every fixture back as it was.
async function commitFixtureChange(change){
  const before = JSON.stringify(gameRequestsState);
  const result = change();
  if(!result || !result.ok){
    gameRequestsState = JSON.parse(before);
    fixtureFlashMessage = (result && FIXTURE_REFUSALS[result.reason]) || '';
    dataChanged();
    return result;
  }
  const ok = await saveGameRequests(gameRequestsState);
  if(!ok){
    gameRequestsState = JSON.parse(before);
    fixtureFlashMessage = storageAvailable() ? `Save failed (${lastStorageError || 'unknown error'}) — try again.` : `Save failed — this page can't reach shared storage.`;
  } else {
    fixtureFlashMessage = '';
  }
  dataChanged();
  return Object.assign({}, result, { saved: ok });
}

// How an Upcoming game's players divide into sides.
//
// `players` is a flat list of four and has been since the wishlist was
// written, with everything downstream -- confirmations, the card, relevance --
// built on that shape. Splitting it 0,1 vs 2,3 is the convention the Add
// result bridge has always used, so it stays the fallback. `teams` is an
// optional, additive field for a game whose sides are actually known, which is
// every game created from a prediction: the whole point of predicting Manny &
// Del against Kaz & Erf is that those are the pairs. It also makes a singles
// game expressible, which the flat split silently could not -- two names would
// have gone in as a single partnership.
function requestTeams(req){
  if(req && Array.isArray(req.teams) && req.teams.length === 2
     && (req.teams[0] || []).length && (req.teams[1] || []).length){
    return [req.teams[0].slice(), req.teams[1].slice()];
  }
  const p = (req && req.players) || [];
  return [p.slice(0, 2).filter(Boolean), p.slice(2, 4).filter(Boolean)];
}

function predictMatchup(teamA, teamB){
  const ratingOf = (n) => {
    const p = PLAYERS.find(x => x.name.toLowerCase() === String(n).toLowerCase());
    return p ? p.rating : null;
  };
  return MatchPrediction.build(teamA, teamB, ratingOf);
}

// The outstanding requests, split three ways for the selected player -- views
// over the same records, never copies. Each request appears in one list only.
//   For me       I'm in it and haven't answered.
//   My Requests  I asked for it, and it isn't agreed yet.
//   Others       everything else still outstanding.
// All newest first, by when the request was made.
function requestLists(viewerName){
  const pending = gameRequestsState.filter(r => r.status === 'pending').sort(FixtureFlow.requestOrder);
  const isMe = (n) => !!viewerName && !!n && String(n).toLowerCase() === viewerName.toLowerCase();
  const forMe = [], mine = [], others = [];
  pending.forEach(r => {
    const me = viewerName ? FixtureFlow.participantName(r, viewerName) : null;
    if(me && !(r.confirmations || {})[me] && !(r.cantPlay || {})[me]) forMe.push(r);
    else if(isMe(r.requestedBy)) mine.push(r);
    else others.push(r);
  });
  return { forMe, mine, others };
}

// Play's two lists, from the club's fixtures (domain/fixtures/playView.js):
// what the selected player sees in My Games, and the whole club's in Club.
function myGamesFor(viewerName, now){ return PlayView.myGames(gameRequestsState, viewerName, now); }
function clubFixtures(now){ return PlayView.club(gameRequestsState, now); }

// How many things the selected player must act on in Play -- the Play badge
// (DQ29, Shaun/CGPT 30 Sep): requests waiting on their answer, plus agreed
// games in Needs attention that they are in. A game they themselves have
// backed out of is not counted: nothing is left for them to do on it (an
// Admin replaces them). It is My Games' "Needs you", counted -- one
// definition, so the badge and the list cannot disagree. No viewer, no count.
function playActionCount(viewerName, now){
  if(!viewerName) return 0;
  return myGamesFor(viewerName, now).needsYou.length;
}
