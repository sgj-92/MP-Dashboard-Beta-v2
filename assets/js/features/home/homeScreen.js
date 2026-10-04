// ===================== HOME: SCREEN =====================
// The player's clubhouse lobby (Phase 3a; Ledger IA 30 Sep, DQ31). In order,
// it answers: how am I doing this month? does anything need me? when am I
// playing next? what happened last time? what's going on around the club?
//
//   hero            this month's League position, named by tier and month,
//                   over the club photograph; tap opens Rankings › This Month
//                   on Home's month. Power Rating, Tier Rank and form are one
//                   demoted line beneath it.
//   Needs you       only when something is waiting on the viewer: a count
//                   that opens to two-line summaries, each opening the game
//   Next game       the next booked game (Upcoming only)
//   Last time out   the viewer's latest rated match
//   Around the club a light rail of Club Pulse cards, and the month's review
//
// Presentation and wiring only. Every fact is read from its owner: the League
// table (leagueStandingOf), My Games (myGamesVisible), the engine's recorded
// match facts, Club Pulse and the viewer snapshot. Match Ideas lives in Play ›
// Arrange a Game (DQ32); the month's club recap is behind its review link.
//
// Owning stream: redesign. The shell still routes to it (goToSection('home')).
// Loads before app.js; declarations only.

function buildHomeDashboard(){
  const dash = document.createElement('div');
  dash.id = 'homeDashboard';
  dash.style.display = 'none';
  const legacySummary = document.getElementById('summaryView');
  if(!legacySummary || !legacySummary.parentNode) return null;
  legacySummary.parentNode.insertBefore(dash, legacySummary);
  return dash;
}

const homeOrdinal = (n) => n + (n % 100 >= 11 && n % 100 <= 13 ? 'th' : ({ 1: 'st', 2: 'nd', 3: 'rd' }[n % 10] || 'th'));
const homeSigned = (v) => (v > 0 ? '+' : v < 0 ? '−' : '±') + Math.abs(v);

// ---- Hero: this month -------------------------------------------------------

// The month's story, as one tappable block. A position only when the viewer
// has a row in that month's League; otherwise it says, in words, why not --
// never a dash or a "0th".
function homeMonthBlockHtml(viewer, month, story){
  const mName = month ? MeaningfulMonth.monthLabel(month).split(' ')[0] : 'month';
  const sp = story.spell;
  let headline, line;
  if(sp && sp.tier && sp.tier !== '?'){
    headline = `${homeOrdinal(sp.position)} in Tier ${escapeHtml(sp.tier)}`;
    const record = `${sp.wins}W${sp.draws ? ` ${sp.draws}D` : ''} ${sp.losses}L`;
    const bits = [`${sp.games} ${sp.games === 1 ? 'game' : 'games'}`, record, `${sp.points} pts`];
    if(story.tiersPlayed > 1) bits.push('since moving tier');
    line = bits.join(' · ');
  } else if(sp){
    headline = `${sp.games} ${sp.games === 1 ? 'game' : 'games'} in ${escapeHtml(mName)}`;
    line = `${sp.wins}W${sp.draws ? ` ${sp.draws}D` : ''} ${sp.losses}L · ${sp.points} pts`;
  } else {
    // Nothing on the table: say so in words. Home's month can be last month
    // (the Meaningful Month), in which case the next game counts towards this
    // one, and the line says that rather than "yet".
    const now = new Date();
    const current = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const isCurrent = month === current;
    headline = isCurrent ? 'No games yet this month' : `No games in ${escapeHtml(mName)}`;
    line = isCurrent
      ? `Your first game puts you on the Tier ${escapeHtml(viewer.tier)} table`
      : `Your next game counts towards ${MeaningfulMonth.monthLabel(current).split(' ')[0]}`;
  }
  const note = meaningfulMonthNoteHtml(homeMonthDefault, month, 'homeMonth', false);
  return `<button type="button" class="home-month${sp ? '' : ' home-month-empty'}" id="homeMonthBtn" aria-label="${escapeHtml(`${headline.replace(/<[^>]+>/g, '')}, ${line}. Open This Month in Rankings`)}">
    <span class="home-month-label">Your ${escapeHtml(mName)}</span>
    <span class="home-month-headline">${headline}</span>
    <span class="home-month-line">${escapeHtml(line)}</span>
    <span class="home-month-chev" aria-hidden="true"></span>
  </button>${note}`;
}

// Power Rating, Tier Rank and form: one demoted line (DQ31), with the gap to
// the tier above beneath it (DQ1). The Power movement says its period (DQ2).
function homeStandingHtml(viewer, snap, month, story){
  const mName = month ? MeaningfulMonth.monthLabel(month).split(' ')[0] : '';
  const rank = snap.eligible
    ? `<span class="home-standing-item">#${snap.tierRank || '–'}${snap.tierRankOf ? ` of ${snap.tierRankOf}` : ''} in Tier ${escapeHtml(viewer.tier)}</span>`
    : `<span class="home-standing-item">Tier ${escapeHtml(viewer.tier)} · <span class="${snap.state && snap.state.participation === 'INACTIVE' ? 'inactive-tag' : 'idle-tag'}">${snap.state ? escapeHtml(snap.state.label) : 'Idle'}</span></span>`;
  const move = story.power !== null && story.power !== 0
    ? ` <span class="home-standing-move ${story.power > 0 ? 'is-up' : 'is-down'}">${homeSigned(story.power)} in ${escapeHtml(mName)}</span>` : '';
  const dots = snap.recentForm
    ? `<span class="home-form-dots" aria-hidden="true">${computeRecentFormSequence(viewer.name, 10).map(r => `<span class="form-dot ${MatchOutcome.classFor(r)}" title="${r || ''}"></span>`).join('')}</span><span class="home-form-record">${snap.recentForm.wins}W – ${snap.recentForm.losses}L</span>`
    : `<span class="home-form-record">No recent games</span>`;
  const gap = computePromotionGap(viewer.name);
  return `<button type="button" class="home-standing" id="homeViewProfileBtn" aria-label="Your profile">
    <span class="home-standing-row">
      <span class="home-standing-item"><span class="home-standing-label">Power</span> <b class="home-standing-num">${Math.round(viewer.rating)}</b>${move}</span>
      ${rank}
      <span class="home-standing-item home-standing-form">${dots}</span>
    </span>
    ${gap && gap.gap > 0 ? `<span class="home-standing-gap">${gap.gap} pts below the lowest-rated Tier ${escapeHtml(gap.tierAbove)} player</span>` : ''}
  </button>`;
}

function homeHeroHtml(viewer, snap, month){
  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? 'Good morning' : (hour < 18 ? 'Good afternoon' : 'Good evening');
  const dateLabel = now.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
  if(!viewer){
    // No viewer: the club's month, and the way to say who you are (DQ5, DQ31).
    const mName = month ? monthLabel(month) : 'This month';
    const games = month ? MeaningfulMonth.countInMonth(getAllApprovedMatches(), month) : 0;
    return `<section class="home-hero home-block home-block-hero">
      <div class="home-hello"><span class="home-hello-date">${escapeHtml(dateLabel)}</span><span class="home-hello-greeting">${greeting}</span></div>
      <div class="home-month home-month-static">
        <span class="home-month-label">${escapeHtml(mName)} at Money Padel</span>
        <span class="home-month-headline">${games} ${games === 1 ? 'game' : 'games'} played</span>
        <span class="home-month-line">Select a player to personalise Home.</span>
      </div>
      <button type="button" class="mp-btn-primary mp-btn-touch mp-btn-accent home-choose" id="homeChooseBtn">Who are you?</button>
    </section>`;
  }
  const story = homeMonthStory(viewer.name, month);
  return `<section class="home-hero home-block home-block-hero">
    <div class="home-hello"><span class="home-hello-date">${escapeHtml(dateLabel)}</span><span class="home-hello-greeting">${greeting}, <span class="home-greeting-name">${escapeHtml(viewer.name)}</span></span></div>
    ${homeMonthBlockHtml(viewer, month, story)}
    ${homeStandingHtml(viewer, snap, month, story)}
  </section>`;
}

// ---- Needs you / Next game ---------------------------------------------------
//
// Progressive disclosure (Shaun, 3 Oct): Home says THAT something needs the
// viewer, and lets them look; the game sheet is where they act. So Needs you
// is a disclosure -- its count is the signal, shut by default each time Home
// is arrived at -- and each item is a two-line summary that opens the game,
// with no answer buttons here.

let homeNeedsOpen = false;      // reset on arrival at Home (arriveAtHome)
const HOME_NEEDS_SHOWN = 3;

// "Wed 7 Oct", from the fixture's own calendar date; "Date TBC" without one.
function homeGameDateText(req){
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(req.preferredDate || ''));
  if(!m) return 'Date TBC';
  const dt = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
  if(dt.getUTCMonth() !== +m[2] - 1) return 'Date TBC';
  return `${MP_DOW[dt.getUTCDay()]} ${+m[3]} ${MP_MON[+m[2] - 1]}`;
}

// One line of context: when, who asked and how long ago, how many are in --
// or, for an agreed game that needs attention, what it is waiting on.
function homeNeedMetaText(x, viewerName){
  const req = x.req;
  const bits = [homeGameDateText(req)];
  if(req.preferredTime) bits.push(req.preferredTime);
  if(req.status === FixtureFlow.STATUS.PENDING){
    const by = req.requestedBy && viewerName && req.requestedBy.toLowerCase() === viewerName.toLowerCase() ? 'you' : req.requestedBy;
    if(by) bits.push(`asked by ${by}`);
    if(req.requestedAt) bits.push(fmtRelative(req.requestedAt));
    bits.push(`${FixtureFlow.confirmedCount(req)}/${req.players.length} in`);
  } else if(x.why === 'attention'){
    const why = fixtureAttentionText(req);
    if(why) bits.push(why);
  } else {
    bits.push('your answer needed');
  }
  return bits.filter(Boolean).join(' · ');
}

function homeGameRowHtml(req, teams, meta, dateBlock){
  return `<button type="button" class="home-game-row${dateBlock ? ' has-date' : ''}" data-fixture-id="${escapeHtml(req.id)}">
    ${dateBlock || ''}
    <span class="home-game-row-main">
      <span class="home-game-row-teams">${escapeHtml(teams)}</span>
      <span class="home-game-row-meta">${meta}</span>
    </span>
    <span class="mp-list-row-chevron" aria-hidden="true"></span>
  </button>`;
}

function homeNeedsYouHtml(g, viewer, now){
  if(!g || !g.needsYou.length) return '';
  const n = g.needsYou.length;
  const shown = g.needsYou.slice(0, HOME_NEEDS_SHOWN);
  const more = n - shown.length;
  const list = homeNeedsOpen ? `<div class="home-needs-list" id="homeNeedsList">
      ${shown.map(x => homeGameRowHtml(x.req, playTeamsText(x.req, viewer.name), escapeHtml(homeNeedMetaText(x, viewer.name)))).join('')}
      ${more > 0 ? mpListRowHtml({ label: `${more} more in My Games`, data: { home: 'mygames' } }) : ''}
    </div>` : '';
  return `<section class="home-section home-block home-block-needs" id="homeNeedsYou">
    <button type="button" class="mp-section-head home-needs-head" id="homeNeedsToggle" aria-expanded="${homeNeedsOpen}" aria-controls="homeNeedsList"
      aria-label="Needs you: ${n} ${n === 1 ? 'game is' : 'games are'} waiting on you. ${homeNeedsOpen ? 'Hide' : 'Show'}">
      <span class="mp-section-head-title">Needs you</span>${mpCountBadgeHtml(n, 'waiting on you')}
    </button>
    ${list}
  </section>`;
}

// "Today", "Tomorrow", "In 3 days" -- from the fixture's own calendar date.
function homeWhenText(isoDate, now){
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(isoDate || ''));
  if(!m) return '';
  const day = Date.UTC(+m[1], +m[2] - 1, +m[3]);
  const t = new Date(now);
  const today = Date.UTC(t.getFullYear(), t.getMonth(), t.getDate());
  const d = Math.round((day - today) / 86400000);
  return d === 0 ? 'Today' : d === 1 ? 'Tomorrow' : d > 1 ? `In ${d} days` : '';
}

// The next booked game (Upcoming only): its date as a block when it has one,
// "Date TBC" in words when it does not. With none, one quiet line -- and, if
// they have games agreed without a court, it says so.
function homeNextGameHtml(g, viewer, now){
  if(!g || !g.canAgreed) return '';
  const next = g.upcoming[0] || null;
  const waiting = g.canReq ? g.waitingOnOthers.length : 0;
  const rows = [];
  if(!next){
    const agreed = g.calledOut.length;
    rows.push(mpListRowHtml({ label: 'Nothing booked yet', meta: agreed ? `${agreed} agreed, no court` : 'My Games', data: { home: 'mygames' } }));
  }
  if(waiting) rows.push(mpListRowHtml({ label: `${waiting} of your ${waiting === 1 ? 'requests is' : 'requests are'} waiting on others`, data: { home: 'mygames' } }));
  let nextRow = '';
  if(next){
    const block = next.preferredDate ? mpDateBlockHtml(next.preferredDate) : '';
    const meta = [block ? '' : 'Date TBC', next.preferredTime, next.location].filter(Boolean).map(escapeHtml).join(' · ');
    // A date block already says Booked; without one, the words say it.
    const booked = block ? '' : `<span class="home-booked">Court booked</span>`;
    nextRow = `<div class="home-panel">${homeGameRowHtml(next, playTeamsText(next, viewer.name), [meta, booked].filter(Boolean).join(' · '), block)}</div>`;
  }
  return `<section class="home-section home-block home-block-next" id="homeNextGame">
    ${mpSectionHeadHtml({ title: 'Next game', meta: next ? homeWhenText(next.preferredDate, now) : '' })}
    ${nextRow}
    ${rows.length ? `<div class="shell-list">${rows.join('')}</div>` : ''}
  </section>`;
}

// ---- Last time out ------------------------------------------------------------

// The player's most recent RATED match, described from what was recorded.
// Everything here -- the result, the scoreline, the expectation, the share of
// games and the rating movement -- is read back; nothing is recomputed, and the
// commentary is chosen deterministically from those same facts. The result is
// the centre of the card: the two sides and their sets, then how it went.
function buildLastResultCardHtml(name){
  const empty = (msg) => `<div class="home-lastresult home-lastresult-empty"><div class="section-sub">${msg}</div></div>`;
  if(typeof LastResult === 'undefined') return empty('No recent result to show.');

  // The rated set, indexed by the engine's own record of each match.
  const rated = Object.values(V3_MATCH_FACTS || {})
    .filter(f => f.byPlayer && f.byPlayer[name])
    .map(f => ({ id: f.matchId, date: f.date, players: Object.keys(f.byPlayer), facts: f }));
  const recent = LastResult.mostRecent(rated, name);
  if(!recent) return empty(`No rated matches recorded for ${escapeHtml(name)} yet.`);
  const facts = recent.facts;

  const m = getDisplayMatches().find(x => x.id === facts.matchId);
  if(!m) return empty('That match could not be read.');

  const view = MatchFacts.forPlayer(facts, name);
  const onStoredWinningSide = m.winners.includes(name);
  // The viewer's side reads "You & partner", as Play's rows do.
  const mineStored = onStoredWinningSide ? m.winners : m.losers;
  const mine = [name, ...mineStored.filter(n => n !== name)];
  const theirs = onStoredWinningSide ? m.losers : m.winners;
  const result = m.isDraw ? 'draw' : (onStoredWinningSide ? 'win' : 'loss');
  // getDisplayMatches() hands back stored matches, not enriched ones, so the
  // game counts are summed from the sets here rather than read off fields that
  // only exist after enrichMatches(). Sets are stored winner-first.
  const sets = Array.isArray(m.sets) ? m.sets : [];
  const winnerGames = sets.reduce((t, set) => t + set[0], 0);
  const loserGames = sets.reduce((t, set) => t + set[1], 0);
  const myGames = onStoredWinningSide ? winnerGames : loserGames;
  const total = winnerGames + loserGames;

  const commentary = LastResult.commentaryFor({
    result,
    gameShare: total ? myGames / total : null,
    expected: view ? view.mine.expected : null,
    actual: view ? view.mine.actual : null,
    ratingGap: view ? (view.mine.preRating - view.theirs.preRating) : null,
  });

  const delta = view ? view.me.ratingDelta : null;
  const tier = historicalTierOf(name, m.date);
  // Sets from the viewer's side: their games first, as their own card reads.
  const mySets = setsForViewer(m, onStoredWinningSide);
  const wonSet = (s) => s[0] > s[1];
  const side = (names, own) => `<div class="lr-side${own ? ' lr-side-own' : ''}${(own ? result === 'win' : result === 'loss') ? ' lr-side-won' : ''}">
      <span class="lr-names">${names.map(n => escapeHtml(n === name ? 'You' : n)).join(' &amp; ')}</span>
      ${mySets.map(s => { const g = own ? s[0] : s[1]; const took = own ? wonSet(s) : s[1] > s[0]; return `<span class="lr-set${took ? ' lr-set-won' : ''}">${g}</span>`; }).join('')}
    </div>`;
  const word = result === 'win' ? 'Won' : result === 'loss' ? 'Lost' : 'Drawn · not finished';
  const dateText = new Date(m.date + 'T00:00:00').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });

  return `<div class="home-lastresult" data-match-id="${escapeHtml(m.id)}">
    <div class="lr-context">${escapeHtml(dateText)}${tier ? ` · Tier ${escapeHtml(tier)}` : ''}</div>
    <div class="lr-score" style="--lr-sets:${mySets.length}">
      ${side(mine, true)}
      ${side(theirs, false)}
    </div>
    <div class="lr-foot">
      <span class="lr-result">${word}${delta === null ? '' : ` · Power Rating <span class="lr-delta ${delta > 0 ? 'is-up' : delta < 0 ? 'is-down' : ''}">${homeSigned(delta)}</span>`}</span>
      <button type="button" class="lr-view" data-match-id="${escapeHtml(m.id)}" data-player="${escapeHtml(name)}">View match</button>
    </div>
    ${commentary ? `<div class="lr-note">${commentary}</div>` : ''}
  </div>`;
}

// ---- Around the club ------------------------------------------------------------

// Club Pulse as a light rail: two or three derivable items (DQ30), each a way
// in to that player. A card with nothing to say is left out, not shown empty.
function homePulseCardHtml(title, player, sub, subClass){
  if(!player) return '';
  return `<button type="button" class="home-pulse-card home-pulse-clickable" data-pulse-player="${escapeHtml(player.name)}">
    <span class="home-pulse-title">${escapeHtml(title)}</span>
    <span class="home-pulse-name">${escapeHtml(player.name)}</span>
    <span class="home-pulse-sub ${subClass || ''}">${escapeHtml(sub)}</span>
  </button>`;
}

function homeAroundClubHtml(month){
  const pulse = computeClubPulse();
  const cards = [
    homePulseCardHtml('#1 Ranked', pulse.topRanked, pulse.topRanked ? `Power ${Math.round(pulse.topRanked.rating)}` : ''),
    homePulseCardHtml('In form', pulse.inForm, pulse.inForm ? `+${pulse.inForm.recent_form}% form` : '', 'is-up'),
    homePulseCardHtml('Promotion watch', pulse.promotionWatch, pulse.promotionWatch ? `Tier ${pulse.promotionWatch.tier} · ${pulse.promotionWatch.gap} pts off ${pulse.promotionWatch.tierAbove}` : ''),
  ].filter(Boolean);
  const games = month ? MeaningfulMonth.countInMonth(getAllApprovedMatches(), month) : 0;
  const head = `<div class="mp-section-head home-club-head"><h3 class="mp-section-head-title">Around the club</h3>${canSee('callouts') ? `<button type="button" class="home-head-link" id="homeAllInsightsBtn">All insights</button>` : ''}</div>`;
  return `<section class="home-section home-block home-block-club">
    ${head}
    ${cards.length ? `<div class="home-club-rail" role="list">${cards.map(c => `<div role="listitem" class="home-club-item">${c}</div>`).join('')}</div>` : ''}
    <div class="shell-list home-club-review">
      <button type="button" class="mp-list-row" id="homeFullReviewBtn"><span class="mp-list-row-label">${escapeHtml(month ? monthLabel(month) : 'This month')} review</span><span class="mp-list-row-meta">${games} ${games === 1 ? 'game' : 'games'}</span><span class="mp-list-row-chevron" aria-hidden="true"></span></button>
    </div>
  </section>`;
}

// ---- The page -------------------------------------------------------------------

function renderHomeDashboard(){
  const dash = document.getElementById('homeDashboard') || buildHomeDashboard();
  if(!dash) return;
  const viewer = getCurrentViewer();
  // Home's month is the Meaningful Month, pinned when Home is arrived at.
  const month = homeMonth();

  if(!viewer){
    dash.innerHTML = homeHeroHtml(null, null, month) + homeAroundClubHtml(month);
    wireHomeDashboard(dash, null);
    return;
  }

  const snap = getViewerSnapshot(viewer.name);
  const now = new Date().toISOString();
  const g = myGamesVisible(viewer.name, now);

  dash.innerHTML = `
    ${homeHeroHtml(viewer, snap, month)}
    ${homeNeedsYouHtml(g, viewer, now)}
    ${homeNextGameHtml(g, viewer, now)}
    <section class="home-section home-block home-block-last">
      <div class="mp-section-head"><h3 class="mp-section-head-title">Last time out</h3><button type="button" class="home-head-link" id="homeAllResultsBtn">All results</button></div>
      ${buildLastResultCardHtml(viewer.name)}
    </section>
    ${homeAroundClubHtml(month)}
  `;
  wireHomeDashboard(dash, viewer);
}

function wireHomeDashboard(dash, viewer){
  const on = (id, fn) => { const el = document.getElementById(id); if(el) el.onclick = fn; };
  on('homeMonthBtn', ()=> openHomeMonthInRankings());
  on('homeChooseBtn', ()=> buildViewerSelector());
  if(viewer) on('homeViewProfileBtn', ()=> openSheet(viewer.name));
  // Insights is a long page. Arriving from Home used to inherit wherever the
  // tab had been left, which dropped the reader into the middle of it.
  on('homeAllInsightsBtn', ()=> openInsightsFromTop());
  on('homeFullReviewBtn', ()=> showFullMonthlyReview());
  if(viewer) on('homeAllResultsBtn', ()=> openSheet(viewer.name));

  dash.querySelectorAll('[data-pulse-player]').forEach(el=>{
    el.onclick = ()=> openSheet(el.dataset.pulsePlayer);
  });
  dash.querySelectorAll('.lr-view').forEach(el=>{
    el.onclick = ()=> openMatchFromHome(el.dataset.player, el.dataset.matchId);
  });
  dash.querySelectorAll('[data-home="mygames"]').forEach(el=>{
    el.onclick = ()=> goToSection('play');
  });
  // Needs you opens and shuts from its whole heading row.
  // A keyboard user keeps their place on the redrawn heading; a tap does not
  // leave a focus ring behind.
  on('homeNeedsToggle', (e)=>{
    homeNeedsOpen = !homeNeedsOpen; renderHomeDashboard();
    const t = document.getElementById('homeNeedsToggle');
    if(t && e && e.detail === 0) t.focus();
  });
  // A summary opens the game itself; the answer is given there, through the
  // same sheet and fixture controls as My Games.
  dash.querySelectorAll('.home-game-row').forEach(el=>{
    el.onclick = ()=> openGameSheet(el.dataset.fixtureId);
  });
}

// The hero's month, in Rankings › This Month (DQ31): the League, on Home's
// month. A hand-off like View Full Review's -- the reader's own month choice
// for This Month is left as it was, so This Month opens on Home's month
// without Home having chosen it for them.
function openHomeMonthInRankings(){
  const month = homeMonth();
  goToSection('rankings');
  const b = legacyTabBtn('summary');
  if(b) b.click();
  if(summaryMonth !== month || summaryMode !== 'league'){
    summaryMonth = month;
    summaryMode = 'league';
    renderSummary();
  }
  renderSectionSubnav();
}

// "View match" opens the player's own profile at that match, so the card they
// land on is written from their side.
//
// One exception, and it is a real one: a DRAW is rated but is deliberately
// absent from MATCHES, which is what the profile's match log is built from. So
// the profile cannot show a draw, and the most recent result genuinely can be
// one. Rather than leave the button dead on those matches, it falls back to the
// Games feed, which does show draws. The fallback is checked, not assumed.
function openMatchFromHome(name, matchId){
  // A profile opens on All time by construction now (see `profileMonth` in
  // app.js), so the result being asked for is always in it. This used to
  // widen the Rankings month around the call and restore it -- a workaround
  // for the profile borrowing a month that was never its own.
  openSheet(name);
  setTimeout(()=>{
    const host = document.getElementById('ppMatchesHost');
    const detail = host
      ? [...host.querySelectorAll('.pp-match-detail')].find(el => el.dataset.matchId === matchId)
      : null;
    if(detail){
      const row = detail.previousElementSibling;
      if(row && row.classList.contains('pp-match-row')) row.click();
      detail.scrollIntoView({ block: 'start' });
      return;
    }
    closeSheet();
    openMatchInGames(matchId);
  }, 0);
}

// "View Full Review" -- shows the fully preserved legacy Summary view in
// place of the dashboard, without leaving Home / changing activeTab.
function showFullMonthlyReview(){
  // The review of the month the card is about. It used to unhide whatever the
  // League screen had last drawn -- on its own default, which for most of
  // every month was a different month from the one named above the button.
  // This is an explicit hand-off, not a shared variable: the League screen's
  // own choice, if the reader made one, is left exactly as it was.
  summaryMonth = homeMonth();
  document.getElementById('homeDashboard').style.display = 'none';
  document.getElementById('summaryView').style.display = 'block';
  renderSummary();
  let backBtn = document.getElementById('homeBackFromReview');
  if(!backBtn){
    backBtn = document.createElement('button');
    backBtn.id = 'homeBackFromReview';
    backBtn.className = 'explainer-toggle';
    backBtn.textContent = '‹ Back to Home';
    backBtn.style.cssText = 'padding:12px 16px; font-weight:600;';
    backBtn.onclick = ()=>{
      document.getElementById('summaryView').style.display = 'none';
      backBtn.style.display = 'none';
      document.getElementById('homeDashboard').style.display = 'block';
    };
    document.getElementById('summaryView').parentNode.insertBefore(backBtn, document.getElementById('summaryView'));
  }
  backBtn.style.display = 'block';
}
