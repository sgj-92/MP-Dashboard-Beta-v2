// ===================== RANKINGS: A MONTH'S STORY (DATA) =====================
// What a month said, as data: the Monthly Information review (most games,
// most wins, win percentages, doughnuts, hardest games, Player of the Month)
// and the monthly stories beside Power Rankings (performance, rating and rank
// movement, crossovers). Each used to be worked out inside the screen that
// drew it; they live here so the Information tab, the Power Rankings stories
// and the Admin Board Pack read one derivation and cannot disagree.
//
// Owning stream: functional. Loads before app.js; declarations only.

// The minimum games for the win-percentage and hardest-games lists -- one
// game at 100% is not a record.
const MONTHLY_INFORMATION_MIN_GAMES = 3;

// The Information review for a month ('YYYY-MM' or 'all'). `top` is how many
// ranked places each list keeps (ties share a place); the Information tab
// shows three. `stats` is computeMonthlySummaryStats' own output, keyed by
// name, for anything a reader wants to look up beside a list.
function monthlyInformation(month, { top = 3 } = {}){
  const stats = computeMonthlySummaryStats(month);
  const statsArr = Object.values(stats);
  const eligible = statsArr.filter(s=>s.games >= MONTHLY_INFORMATION_MIN_GAMES);
  const mostGames = topNTied(statsArr, 'games', top, true);
  const mostWins = topNTied(statsArr.filter(s=>s.games>0), 'points', top, true);
  const mostLosses = topNTied(statsArr, 'losses', top, true);
  const lowestWinPct = topNTied(eligible, 'winpct', top, false);
  const highestWinPct = topNTied(eligible, 'winpct', top, true);
  // Highest loss % proper: losses over games played. Not the same list as
  // lowest win % once there are draws (2W 2D 1L has a lower win % than
  // 3W 0D 2L but loses less), so it is its own list.
  const highestLossPct = topNTied(eligible, 'losspct', top, true);
  const doughnutMax = Math.max(0, ...statsArr.map(s=>s.doughnuts));
  const mostDoughnuts = doughnutMax > 0 ? statsArr.filter(s=>s.doughnuts===doughnutMax).map(s=>s.name) : [];
  const hardestGames = topNTied(eligible, 'hardness', top, true);
  const playerOfMonth = mostWins.length ? mostWins[0] : null;
  return {
    month, stats, statsArr, minGamesForRanked: MONTHLY_INFORMATION_MIN_GAMES,
    mostGames, mostWins, mostLosses, lowestWinPct, highestWinPct, highestLossPct,
    mostDoughnuts, doughnutMax, hardestGames, playerOfMonth,
  };
}

// The monthly stories for one month, from the monthly views: who most beat
// expectation, whose real Power Rating rose and fell furthest, whose rank
// climbed and slid, who moved without playing, and who overtook whom. Null
// for All Time or a month the views do not hold. `top` is how many of each;
// the Power Rankings stories show three.
function monthlyStories(month, { top = 3 } = {}){
  if(month === 'all' || !MONTHLY_VIEWS || !MONTHLY_VIEWS.byMonth[month]) return null;
  const perf = MonthlyViews.performanceTable(MONTHLY_VIEWS, month).slice(0,top);
  const moves = MonthlyViews.ratingMovementTable(MONTHLY_VIEWS, month);
  const risers = moves.filter(r=>r.ratingChange>0).slice(0,top);
  const fallers = moves.filter(r=>r.ratingChange<0).slice(-top).reverse();
  const all = MONTHLY_VIEWS.byMonth[month].rows.concat(MONTHLY_VIEWS.byMonth[month].inactiveRows);
  const ranked = all.filter(r=>r.rankChangeOverall !== null && r.rankChangeOverall !== 0)
    .sort((a,b)=>b.rankChangeOverall-a.rankChangeOverall);
  const climbers = ranked.filter(r=>r.rankChangeOverall>0).slice(0,top);
  const sliders = ranked.filter(r=>r.rankChangeOverall<0).slice(-top).reverse();
  const idleMovers = MONTHLY_VIEWS.byMonth[month].inactiveRows
    .filter(r=>r.rankChangeOverall !== null && r.rankChangeOverall !== 0)
    .sort((a,b)=>Math.abs(b.rankChangeOverall)-Math.abs(a.rankChangeOverall)).slice(0,top);
  const crossovers = MONTHLY_VIEWS.byMonth[month].crossovers.slice(0,top);
  return { month, perf, risers, fallers, climbers, sliders, idleMovers, crossovers };
}
