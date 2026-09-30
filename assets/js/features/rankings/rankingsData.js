// ===================== RANKINGS: ELIGIBILITY, PODIUM AND KINGS (DATA) =====================
// Who is eligible for a rank (the same rule as playerStateOf), and who sits on
// the podium and on each tier's throne for the Rankings scope (tierInScope).
// Competition facts: functional code. The drawing is rankingsChrome.js.
//
// Extracted from shell.js unchanged (docs/architecture/PARALLEL_DEVELOPMENT_SPLIT.md).
// Owning stream: functional. Loads before app.js; declarations only.

// ---- Ranking eligibility (All-Time only) ---------------------------------
// The group's own existing standard -- play at least 2 games to stay "in
// the group" -- wasn't actually enforced anywhere before; some genuinely
// inactive players just never got their manual active flag updated. This
// makes it automatic: computed fresh from real match dates every time,
// nobody has to remember to flag anyone, and returning is as simple as
// playing again. Applies only to the All-Time Power Rankings list -- a
// monthly leaderboard already has its own natural eligibility test
// (you have to have played in that month to appear in it at all).
// Kept as names because several call sites read better with them, but the rule
// itself now lives in PlayerState -- one definition, one dataset, every surface.
const RANKING_ELIGIBILITY_DAYS = (typeof PlayerState !== 'undefined') ? PlayerState.WINDOW_DAYS : 30;

const RANKING_ELIGIBILITY_MIN_MATCHES = (typeof PlayerState !== 'undefined') ? PlayerState.MIN_MATCHES : 2;

// "Does this player get a rank number right now?" An INACTIVE player does not,
// and neither does an idle one -- but for different reasons, which is why the
// callers that need to tell them apart ask playerStateOf() instead.
function isRankingEligible(name){
  const st = playerStateOf(name);
  return st ? st.rankable : false;
}

// ---- Rankings podium -----------------------------------------------------
// Podium now applies to any tier and any month (per the product change) --
// it always represents the top 3 of whatever leaderboard is currently on
// screen. Hidden only for: a non-Rating ranking mode, an active player
// search, or a non-default min-games threshold. Replicates render()'s own
// filter sequence exactly (tier -> month merge -> min-games) and the fixed
// rating sort, so the podium can never disagree with the list beneath it.
function computeRankingsPodiumTop3(){
  if(activeTab !== 'power') return null;
  if(activeSortP !== 'rating') return null;
  if(query !== '') return null;
  // The default qualifying threshold differs by scope on purpose (10 for all-time, 5 for a
  // single month, since monthly game counts are naturally lower) -- the podium should respect
  // whichever default applies to the scope currently selected, not a single hardcoded number.
  const defaultMinGames = selectedMonth === 'all' ? 10 : 5;
  if(minGames !== defaultMinGames) return null;

  // Tier is scope-relative: in a month view this is the tier held at that
  // month's close, so the podium's "Tier B · June 2026" caption is true.
  let rows = PLAYERS.filter(matchesActiveTier);
  const inMonthView = selectedMonth !== 'all';
  if(inMonthView){
    const monthly = computeMonthlyStats(selectedMonth);
    const monthlyRatings = monthEndRatings(selectedMonth);
    rows = rows.map(p => ({...p, ...(monthly[p.name] || ZERO_MONTH_STATS),
      month_rating: (p.name in monthlyRatings) ? Math.round(monthlyRatings[p.name]*10)/10 : null}));
  }
  rows = rows.filter(p => p.total >= minGames);
  if(inMonthView) rows = rows.filter(p => p.month_rating !== null && p.month_rating !== undefined);
  // All-time podium can only feature currently-eligible players -- same rule, same test, as the
  // list beneath it, so the two can never show a different "top 3". Monthly scope is untouched.
  if(!inMonthView) rows = rows.filter(p => isRankingEligible(p.name));

  const sorted = rows.slice().sort((a,b)=>{
    const av = inMonthView ? a.month_rating : a.rating;
    const bv = inMonthView ? b.month_rating : b.rating;
    return bv - av;
  });
  if(sorted.length < 3) return null;
  return sorted.slice(0,3).map(p=>({ name: p.name, rating: inMonthView ? p.month_rating : p.rating }));
}

// ---- Kings of Tiers -------------------------------------------------------
// Three kings of their own divisions (Tier A/B/C), not 1st/2nd/3rd overall --
// deliberately a separate concept from the podium above, which is the top 3
// of whichever tier/month scope is currently selected. Reuses exactly the
// same ranking data and the same gating rules as the podium (rating mode,
// no active search, min-games still at its scope's own default) so the two
// can never disagree, plus one extra rule of its own: only makes sense
// when every tier is on screen at once (activeTier === 'All'), since
// filtering to a single tier already answers "who's #1 here".
function computeKingsOfTiers(){
  if(activeTab !== 'power') return null;
  if(activeSortP !== 'rating') return null;
  if(query !== '') return null;
  if(activeTier !== 'All') return null;
  const defaultMinGames = selectedMonth === 'all' ? 10 : 5;
  if(minGames !== defaultMinGames) return null;

  const inMonthView = selectedMonth !== 'all';
  let rows = PLAYERS.slice();
  if(inMonthView){
    const monthly = computeMonthlyStats(selectedMonth);
    const monthlyRatings = monthEndRatings(selectedMonth);
    rows = rows.map(p => ({...p, ...(monthly[p.name] || ZERO_MONTH_STATS),
      month_rating: (p.name in monthlyRatings) ? Math.round(monthlyRatings[p.name]*10)/10 : null}));
  }
  rows = rows.filter(p => p.total >= minGames);
  if(inMonthView) rows = rows.filter(p => p.month_rating !== null && p.month_rating !== undefined);
  // Same All-Time eligibility rule as the podium/list -- a monthly king only
  // has to have actually played that month, an all-time king has to still
  // be an active-enough part of the group right now.
  if(!inMonthView) rows = rows.filter(p => isRankingEligible(p.name));

  // A king of a field of one is not a king. Where only one player qualifies in
  // a tier there is nothing to have won, so no crown is awarded and the card
  // says why. This applies to every tier, not just Tier S -- the principle is
  // about the size of the field, and hardcoding it to S would make it look
  // like a rule about Manny.
  const MIN_FIELD = 2;
  const kings = {};
  const fieldSize = {};
  TIER_ORDER_LIST.forEach(tier=>{
    // Historical tier, not today's. Without this, June's Tier C king vanishes
    // the moment he is promoted in July and reappears in Tier B's June board.
    const tierRows = rows.filter(p=>tierInScope(p)===tier).sort((a,b)=>{
      const av = inMonthView ? a.month_rating : a.rating;
      const bv = inMonthView ? b.month_rating : b.rating;
      return bv - av;
    });
    fieldSize[tier] = tierRows.length;
    if(tierRows.length >= MIN_FIELD){
      const p = tierRows[0];
      kings[tier] = { name: p.name, rating: Math.round(inMonthView ? p.month_rating : p.rating),
        // Carried so the panel can say why a past king sits in a tier they are
        // no longer in, rather than leaving it looking like a bug.
        currentTier: p.tier };
    }
  });
  if(!TIER_ORDER_LIST.some(t=>kings[t])) return null;
  kings._fieldSize = fieldSize;
  return kings;
}
