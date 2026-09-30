// ===================== ADMIN: MONTHLY BOARD PACK (DATA) =====================
// What each Board Pack module shows for a month, drawn from the functions the
// rest of the app already uses -- the League, Merit and Race tables, the
// Rankings pool and Kings of Tiers, the Monthly Information review and the
// monthly stories, Doughnuts, Last 10, partnerships and the tier history. No
// figure here is worked out a second way: a module selects, groups and trims
// what those functions return, and nothing more. The options a module takes
// are presentation only (how many, which tier, which half).
//
// Also: the month list, the "has the record changed since this was saved"
// basis, and the one save path (Admin only).
//
// Owning stream: functional. Loads before app.js; declarations only.

// The months a pack can be built for: every month with games, newest first.
function boardPackMonths(){
  return getAvailableMonths().slice().reverse();
}

// Which month the section opens on: the month the monthly screens open on
// (the Meaningful Month), else the newest with games.
function boardPackDefaultMonth(){
  const months = boardPackMonths();
  const m = meaningfulMonthNow().month;
  return months.includes(m) ? m : (months[0] || null);
}

// Tier sections in the club's order, limited to the one asked for.
function boardPackTiers(tierOption){
  return TIER_ORDER_LIST.filter(t => tierOption === 'all' || t === tierOption);
}

function boardPackTierAt(name, date){ return historicalTierOf(name, date); }

// module id -> (month, options) -> data. A function rather than a table so
// nothing here reads app state while the script loads.
function boardPackSources(){ return {
  overview(month){
    const approved = getAllApprovedMatches();
    const stats = Object.values(computeMonthlySummaryStats(month)).filter(s => s.games > 0);
    return {
      // The canonical match count (Home and the Meaningful Month use it):
      // each match once, draws included.
      games: MeaningfulMonth.countInMonth(approved, month),
      draws: MeaningfulMonth.countInMonth(approved.filter(m => m.isDraw), month),
      players: stats.length,
    };
  },

  // One row per player for the whole month, from the same aggregation as the
  // League (All together) and Monthly Information: games, W / D / L, points
  // at 3 / 1 / 0, and the Information review's "hardest games" measure
  // (average strength of the games played, ÷ 300). Ordered by the League's
  // own standing rule, or by games or difficulty first.
  results_table(month, o){
    const key = { points: 'points', games: 'games', difficulty: 'hardness' }[o.sort] || 'points';
    const rows = Object.values(computeMonthlySummaryStats(month)).filter(s => s.games > 0)
      .map(s => ({ ...s, tier: tierSpellLabel(s.name, month) || tierAtMonthClose(s.name, month) || '?' }));
    return { sort: o.sort, rows: sortLeagueRows(rows, key, true).slice(0, BoardPack.limit(o.top)) };
  },

  // Anyone who won, or lost, MORE than 80% of the games they played that
  // month. Draws are games played, so they count in the denominator -- the
  // same win % and loss % as Monthly Information. Exactly 80% (4 of 5) is
  // not more than 80%. `min` is the fewest games that make a percentage
  // worth reporting; 3 is Monthly Information's own rule for win %.
  over_80(month, o){
    const min = Number(o.min);
    const played = Object.values(computeMonthlySummaryStats(month)).filter(s => s.games > 0 && s.games >= min);
    const order = (k) => (a, b) => b[k] - a[k] || b.games - a.games || a.name.localeCompare(b.name);
    return {
      min,
      won: played.filter(s => s.wins / s.games > 0.8).sort(order('winpct')),
      lost: played.filter(s => s.losses / s.games > 0.8).sort(order('losspct')),
    };
  },

  information(month){
    return monthlyInformation(month);
  },

  power(month, o){
    const minGames = defaultRankingMinGames(month);
    const moves = monthlyMovementIndex(month);
    const rows = rankingPool(month, minGames)
      .filter(p => o.tier === 'all' || p.scopeTier === o.tier)
      .slice(0, BoardPack.limit(o.top))
      .map(p => ({ name: p.name, tier: p.scopeTier, rating: p.scopeRating, games: p.total,
        ratingChange: moves[p.name] ? moves[p.name].ratingChange : null,
        rankChange: moves[p.name] ? moves[p.name].rankChangeOverall : null }));
    return { minGames, rows };
  },

  kings(month){
    const minGames = defaultRankingMinGames(month);
    return { minGames, kings: kingsOfTiersFor(month, minGames) };
  },

  league(month, o){
    const rows = leagueSplitRows(month).filter(s => s.games > 0);
    return { tiers: boardPackTiers(o.tier).map(tier => ({ tier,
      rows: sortLeagueRows(rows.filter(s => s.tier === tier), 'points', true).slice(0, BoardPack.limit(o.top)) }))
      .filter(t => t.rows.length) };
  },

  merit(month, o){
    const { table, unresolved } = MeritTable.build(meritMatches(month), boardPackTierAt, { tierForRow: boardPackTierAt });
    return { unresolved: unresolved.length, tiers: boardPackTiers(o.tier).map(tier => ({ tier,
      rows: table.filter(r => r.tier === tier && r.played > 0).slice(0, BoardPack.limit(o.top)) }))
      .filter(t => t.rows.length) };
  },

  race(month, o){
    const { table, unresolved } = buildMonthlyRace(month);
    return { unresolved: unresolved.length, minMatches: MonthlyRace.MIN_MATCHES, tiers: boardPackTiers(o.tier).map(tier => ({ tier,
      rows: table.filter(r => r.tier === tier && (o.provisional === 'show' || r.qualified)).slice(0, BoardPack.limit(o.top)) }))
      .filter(t => t.rows.length) };
  },

  most_wins(month, o){
    const info = monthlyInformation(month, { top: BoardPack.limit(o.top) });
    return { groups: info.mostWins, stats: info.stats };
  },

  best_record(month, o){
    const info = monthlyInformation(month, { top: BoardPack.limit(o.top) });
    return { groups: info.highestWinPct, stats: info.stats, minGames: info.minGamesForRanked };
  },

  most_games(month, o){
    return { groups: monthlyInformation(month, { top: BoardPack.limit(o.top) }).mostGames };
  },

  rating_movers(month, o){
    const s = monthlyStories(month, { top: BoardPack.limit(o.top) });
    return { risers: s && o.show !== 'fallers' ? s.risers : [], fallers: s && o.show !== 'risers' ? s.fallers : [] };
  },

  rank_movers(month, o){
    const s = monthlyStories(month, { top: BoardPack.limit(o.top) });
    return { climbers: s && o.show !== 'sliders' ? s.climbers : [], sliders: s && o.show !== 'climbers' ? s.sliders : [] };
  },

  performance(month, o){
    const s = monthlyStories(month, { top: BoardPack.limit(o.top) });
    return { rows: s ? s.perf : [] };
  },

  form(month, o){
    // The players of the month, with the Last 10 they carried out of it.
    const played = new Set(Object.values(computeMonthlySummaryStats(month)).filter(s => s.games > 0).map(s => s.name));
    const rows = sortLastTenRows(lastTenAtMonthEnd(month).filter(r => played.has(r.name)), 'points', true);
    return { window: LastTen.WINDOW, rows: rows.slice(0, BoardPack.limit(o.top)) };
  },

  hard_wins(month, o){
    // Merit's own classification of every win, whole month per player.
    const { table } = MeritTable.build(meritMatches(month), boardPackTierAt);
    const rows = table.map(r => ({ name: r.playerId, hardWins: r.hardWins, easyWins: r.easyWins }));
    const n = BoardPack.limit(o.top);
    return {
      hard: o.show !== 'favoured' ? topNTied(rows.filter(r => r.hardWins > 0), 'hardWins', n, true) : [],
      favoured: o.show !== 'hard' ? topNTied(rows.filter(r => r.easyWins > 0), 'easyWins', n, true) : [],
    };
  },

  doughnuts(month, o){
    const rows = computeDoughnutStats(month);
    const n = BoardPack.limit(o.top);
    return {
      received: o.show !== 'given' ? topNTied(rows.filter(r => r.received > 0), 'received', n, true) : [],
      given: o.show !== 'received' ? topNTied(rows.filter(r => r.given > 0), 'given', n, true) : [],
    };
  },

  partnerships(month, o){
    // The chemistry measure the Insights screen ranks by, over this month's
    // rated games (2+ together).
    const rows = buildPartnerships(MATCHES.filter(m => m.date.slice(0,7) === month), TIER_MAP);
    return { rows: rows.slice(0, BoardPack.limit(o.top)) };
  },

  tier_moves(month){
    const changes = V3_TIER_HISTORY ? V3_TIER_HISTORY.changes : [];
    return { rows: changes.filter(c => c.effectiveDate.slice(0,7) === month)
      .map(c => ({ name: displayNameFor(c.playerId), date: c.effectiveDate, fromTier: c.fromTier, toTier: c.toTier, eventType: c.eventType })) };
  },

  crossovers(month, o){
    const s = monthlyStories(month, { top: BoardPack.limit(o.top) });
    return { rows: s ? s.crossovers : [] };
  },
}; }

// One module's data for a month, or null for a module this build does not
// know (a config written by a newer one).
function boardPackModuleData(item, month){
  const source = boardPackSources()[item.id];
  return source ? source(month, item.options || {}) : null;
}

// What the record held for a month, reduced to a fingerprint: its matches as
// recorded, the ratings at its close and its tier changes. Stored beside a
// saved pack, so that reopening it can say when a later correction, a late
// result or a club decision has changed what the month shows. The pack's
// figures are always today's; this only says whether they still match.
function boardPackBasis(month){
  const matches = getAllApprovedMatches().filter(m => m.date.slice(0,7) === month)
    .map(m => [m.id, m.date, m.winners, m.losers, m.sets, !!m.isDraw])
    .sort((a,b) => String(a[0]).localeCompare(String(b[0])));
  const closing = monthEndRatings(month);
  const ratings = Object.keys(closing).sort().map(n => [n, Math.round(closing[n]*10)/10]);
  const tiers = boardPackSources().tier_moves(month).rows;
  return {
    games: MeaningfulMonth.countInMonth(getAllApprovedMatches(), month),
    fingerprint: simpleHash(JSON.stringify({ matches, ratings, tiers })),
  };
}

// The one way a pack is saved. Admin only: the section is behind the lock,
// and so is this.
async function saveBoardPackConfig(config){
  if(!isUnlocked) return { ok: false, message: 'Only an admin can save the Board Pack.' };
  if(!config || !BoardPack.isMonth(config.month)) return { ok: false, message: 'Choose a month first.' };
  const viewer = (typeof getCurrentViewer === 'function') ? getCurrentViewer() : null;
  const by = (currentUserName && currentUserName.trim()) || (viewer && viewer.name) || (adminRole === 'board' ? 'Board' : 'Admin');
  const stored = BoardPack.forSave(config, { by, at: new Date().toISOString(), basis: boardPackBasis(config.month) });
  const ok = await saveBoardPack(stored);
  if(!ok) return { ok: false, message: storageAvailable() ? `Save failed (${lastStorageError || 'unknown error'}) — try again.` : `Save failed — this page can't reach shared storage.` };
  return { ok: true, config: stored };
}
