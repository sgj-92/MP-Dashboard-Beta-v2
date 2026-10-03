// ===================== DATA: PERMISSIONS =====================
// Who may see and do what: the visibility settings and the one map from screen
// to setting (canSee / canSeeTab / visibleFallbackTab, D4), predictions
// Admin-only (canSeePredictions), and the admin roles. isUnlocked is a UI gate,
// not security. The state they read (visibilityState, isUnlocked, adminRole)
// is declared in app.js.
//
// Extracted from app.js unchanged (docs/architecture/PARALLEL_DEVELOPMENT_SPLIT.md).
// Owning stream: functional. Loads before app.js; declarations only.

// Sections an admin can hide from non-admin viewers. Admins always see everything.
const VISIBILITY_DEFAULTS = {
  // Find a Game is a player feature (Shaun, 28 Sep: D4). Its predictions are
  // not -- see canSeePredictions -- so the tab itself defaults to visible.
  findgame: true,       // Find a Game — matchmaking
  difficulty: false,    // Easy/Balanced/Hard suggestions on player profiles
  callouts: true,       // Call-Outs tab
  chemistry: true,      // Partnership chemistry rankings
  power: true,          // Power Rating tab
  games: true,          // Games (chronological log)
  players: true,        // Players A–Z
  wishlist: true,        // Game requests / wishlist
  upcoming: true,        // Confirmed upcoming games
};

const VISIBILITY_LABELS = {
  findgame: 'Find a Game tab (matchmaking)',
  difficulty: 'Easy / Balanced / Hard suggestions on profiles',
  callouts: 'Call-Outs tab',
  chemistry: 'Partnership chemistry rankings',
  power: 'Power Rating tab',
  games: 'Games tab (match log)',
  players: 'Players tab',
  wishlist: 'Wishlist tab (game requests)',
  upcoming: 'Upcoming tab (confirmed games)',
};

// Tier S sections. With one Tier S player a whole tier section is mostly
// empty screen, so the club can hide it from the tier-grouped views -- League
// and Merit by tier, the Monthly Race, Kings of Tiers and the Board Pack's
// tier modules. A layout choice, not a permission: it applies to Admins too,
// and it hides only the SECTION -- the player stays in Power Rankings, the
// month's results table, Monthly Information and their profile, and no
// calculation changes. Stored beside the visibility settings; shown unless
// switched off.
function tierSSectionsShown(){
  return !visibilityState || visibilityState.tierSSections !== false;
}

// The tiers a tier-grouped view lists, in the club's order.
function groupedTiers(){
  return TIER_ORDER_LIST.filter(t => t !== 'S' || tierSSectionsShown());
}

// Admins see everything; everyone else only sees what's switched on.
function canSee(section){
  if(isUnlocked) return true;
  return visibilityState[section] !== false;
}

// Which setting governs each screen. The one map: the tab guard, the shell's
// sub-navigation, the More sheet and every in-app shortcut read it, so a
// screen switched to Admin only is hidden by every route to it, not just by
// the legacy tab row nobody sees any more (audit D4).
const TAB_VISIBILITY_KEY = {
  power: 'power', callouts: 'callouts', findgame: 'findgame', games: 'games',
  players: 'players', wishlist: 'wishlist', upcoming: 'upcoming',
  // 'wl', 'summary', 'h2h' and 'manage' have no setting (manage is lock-gated).
};

function canSeeTab(tab){
  const key = TAB_VISIBILITY_KEY[tab];
  return !key || canSee(key);
}

// Where to go instead of a hidden screen: the first visible screen in the same
// section of the shell, else Win/Loss, which has no setting.
function visibleFallbackTab(tab){
  const sec = (typeof TAB_TO_SECTION !== 'undefined') ? TAB_TO_SECTION[tab] : null;
  const same = (sec && typeof SECTION_SUBNAV !== 'undefined' && SECTION_SUBNAV[sec])
    ? SECTION_SUBNAV[sec].map(i => i.tab).filter(t => t !== tab && canSeeTab(t)) : [];
  return same[0] || 'wl';
}

// Predictions -- a win percentage, or a favourite / underdog call, for a game
// that has not been played -- are Admin-only, always, wherever they would
// appear (Shaun, 21 Sep; restated 28 Sep, D4). A fixed rule, not a setting:
// players could use them to dodge agreed games or cherry-pick easy ones.
// Recorded matches keep their own expectation, which explains a rating
// already moved and is not a prediction.
function canSeePredictions(){ return !!isUnlocked; }

function simpleHash(str){
  let hash = 0;
  for(let i=0;i<str.length;i++){
    hash = ((hash<<5)-hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return (hash>>>0).toString(16);
}

function isOwnerAdmin(){ return isUnlocked && adminRole === 'owner'; }
