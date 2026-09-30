// ===================== RANKINGS: MONTHLY RATING BREAKDOWN =====================
// The sheet a month-view Rankings row opens: month-end Power Rating, the
// month's journey, its matches and the compare view. Presentation; the
// standings and journey it shows (getMonthlyRatingContext, computeMonthlyJourney)
// stay in app.js.
//
// Extracted from app.js and shell.js unchanged (docs/architecture/PARALLEL_DEVELOPMENT_SPLIT.md).
// Owning stream: redesign. Loads before app.js; declarations only.

const MONTHLY_RATING_METHODOLOGY_TEXT = `There is one continuous Power Rating and it never resets. Nothing is solved separately for a month: the month-end figure is simply where that one rating stood on the last day of it — not a separate score solved from that month's games, and not a fresh start from your tier's seed. Each match moves it by how much you beat or fell short of what was expected of you, weighted by how established your rating already is, and the month's figure is wherever that sequence had reached. "Points moved" is the distance travelled during the month, and rank movement is where that left you against everyone else. Monthly Performance answers a different question again: how far above or below pre-match expectation you actually played, regardless of how many rating points that happened to be worth.`;

function buildMonthlyReconciliationText(ctx){
  if(!ctx.journey) return `${ctx.name} has no recorded events in ${monthLabel(ctx.month)}.`;
  const j = ctx.journey;
  const moved = j.totalChange;
  const movedLabel = moved > 0 ? `up ${moved}` : (moved < 0 ? `down ${Math.abs(moved)}` : 'nowhere');
  const extras = [];
  if(j.tierChangeCount) extras.push(`${j.tierChangeCount} tier change${j.tierChangeCount===1?'':'s'} (which move no points)`);
  if(j.reassessmentCount) extras.push(`${j.reassessmentCount} club reassessment${j.reassessmentCount===1?'':'s'}`);
  return `${ctx.name} carried <b style="color:var(--text);">${Math.round(j.startRating)}</b> into ${monthLabel(ctx.month)} — not a tier baseline, but wherever their continuous rating had already reached. Across ${j.matchCount} rated match${j.matchCount===1?'':'es'} (${ctx.player.wins}-${ctx.player.losses})${extras.length ? ` and ${extras.join(' and ')}` : ''} it moved ${movedLabel} to <b style="color:var(--gold-bright);">${Math.round(ctx.rating)}</b>. Every step below is the move the engine recorded at the time; nothing is re-solved for the month.`;
}

function buildMonthlyRatingHeaderHtml(ctx){
  let gapLine, belowLine = '', closeMargin = false;
  if(ctx.position === 1){
    gapLine = ctx.below
      ? `${Math.round(ctx.rating - ctx.below.month_rating)} pt${Math.round(ctx.rating - ctx.below.month_rating)===1?'':'s'} ahead of #2 ${ctx.below.name}`
      : `Only qualifying player in Tier ${ctx.tier} this month`;
    closeMargin = !!ctx.below && Math.abs(ctx.rating - ctx.below.month_rating) < 10;
  } else {
    const gapAbove = Math.round(ctx.above.month_rating - ctx.rating);
    gapLine = `${gapAbove} pt${gapAbove===1?'':'s'} behind #${ctx.position-1} ${ctx.above.name}`;
    if(ctx.below){
      const gapBelow = Math.round(ctx.rating - ctx.below.month_rating);
      belowLine = `${gapBelow} pt${gapBelow===1?'':'s'} ahead of #${ctx.position+1} ${ctx.below.name}`;
    }
  }
  return `<div class="mrb-header">
    <div class="mrb-period">${monthLabel(ctx.month)} · Tier ${ctx.tier}</div>
    <div class="mrb-rankname"><span class="mrb-rank">#${ctx.position}</span> <span class="mrb-name">${ctx.name}</span></div>
    <div class="mrb-rating-row"><span class="mrb-rating">${Math.round(ctx.rating)}</span><span class="mrb-rating-label">Power Rating<br/>at month end</span></div>
    <div class="mrb-gap">${gapLine}</div>
    ${belowLine ? `<div class="mrb-gap mrb-gap-secondary">${belowLine}</div>` : ''}
    ${closeMargin ? `<div class="mrb-close-note">This is a tight one — worth checking the numbers below.</div>` : ''}
  </div>`;
}

// Who played, with the ratings they carried INTO the match, read from the
// player's own side. Context the explanation above it assumes but does not
// repeat.
function matchLineupHtml(m, name){
  const atTheTime = (n) => (m.deltas && m.deltas[n]) ? Math.round(m.deltas[n].preMatchRating) : ratingOf(n);
  const mine = m.winners.includes(name) ? m.winners : m.losers;
  const theirs = m.winners.includes(name) ? m.losers : m.winners;
  const side = (names) => names.map(n => `${n} (${atTheTime(n)})`).join(' &amp; ');
  return `<b style="color:var(--text);">${side(mine)}</b> vs ${side(theirs)} <span style="font-size:10.5px;">(ratings going in)</span>`;
}

function buildMonthlyMatchCardsHtml(ctx){
  if(!ctx.journey) return `<div class="section-sub">No match data available.</div>`;
  const matchEntries = ctx.journey.entries.filter(e=>e.kind==='match');
  if(matchEntries.length === 0) return `<div class="section-sub">No qualifying matches this month.</div>`;
  return matchEntries.map(e=>{
    const m = MATCHES.find(x=>x.id===e.matchId);
    if(!m) return '';
    const d = journeyMatchDescription(ctx.name, e.matchId);
    const resultLabel = m.isDraw ? `<span style="color:var(--text-dim);">Draw</span>`
      : (d && d.won ? `<span class="perf-pos">Win</span>` : `<span class="perf-neg">Loss</span>`);
    const deltaClass = e.delta > 0 ? 'perf-pos' : (e.delta < 0 ? 'perf-neg' : '');
    return `<div class="callout-card" style="padding:10px 12px;">
      <div style="display:flex; justify-content:space-between; align-items:baseline; gap:8px;">
        <div style="font-size:11.5px; color:var(--text-dim);">${dayLabel(m.date)}</div>
        <div style="font-size:11.5px;">${resultLabel}</div>
      </div>
      <div style="margin-top:2px; font-size:12.5px; font-weight:700;">${scoreForViewer(m, playerIsOnStoredWinningSide(m, ctx.name))}</div>
      <div style="font-size:11.5px; color:var(--text-dim);">${matchLineupHtml(m, ctx.name)}</div>
      <div style="font-size:11.5px; color:var(--text-dim);"><span class="${deltaClass}" style="font-weight:700;">${e.delta > 0 ? '+' : ''}${e.delta} pts</span> for ${ctx.name} → ${Math.round(e.rating)}</div>
      ${whyYourRatingMovedHtml(m, ctx.name)}
      ${matchDeltaLineHtml(m)}
    </div>`;
  }).join('');
}

function buildMonthlyFullCalculationHtml(ctx){
  const exact = ctx.journey ? ctx.journey.endRating : ctx.rating;
  const opened = ctx.journey ? ctx.journey.startRating : null;
  return `<div class="mrb-detail-line">Engine: <b style="color:var(--text);">sequential-v1</b>. Each match is applied once, in order, the moment it is played. Nothing is re-solved and nothing is reset at a month boundary.</div>
    <div class="mrb-detail-line">Per match: the rating moves by K × (performance score − pre-match expected score), where the performance score is 0.80 × games won + 0.20 × the result.</div>
    <div class="mrb-detail-line">K falls as evidence builds: K = 10 + 30 × (1 − reliability), and reliability = e / (e + 10) for e rated matches. A new player moves by up to 40 points a match; a well-established one by around 10.</div>
    ${opened !== null ? `<div class="mrb-detail-line">Carried into ${monthLabel(ctx.month)}: <b style="color:var(--text);">${Math.round(opened*100)/100}</b></div>` : ''}
    <div class="mrb-detail-line">Rating at month end: <b style="color:var(--text);">${Math.round(exact*100)/100}</b> (shown rounded to ${Math.round(ctx.rating)} elsewhere)</div>
    <div class="mrb-detail-line">Qualifying threshold this view uses: ${minGames}+ games this month — the same minimum currently applied to the Power Rankings list, so this can never show a player the list itself wouldn't.</div>`;
}

function buildMonthlyCompareButtonsHtml(ctx){
  const btns = [];
  if(ctx.above) btns.push(`<button class="mp-btn-secondary mrb-compare-btn" data-compare="${ctx.above.name}">Compare with #${ctx.position-1} ${ctx.above.name}</button>`);
  if(ctx.below) btns.push(`<button class="mp-btn-secondary mrb-compare-btn" data-compare="${ctx.below.name}">Compare with #${ctx.position+1} ${ctx.below.name}</button>`);
  if(btns.length === 0) return '';
  return `<div class="mrb-compare-row">${btns.join('')}</div>`;
}

function buildMonthlyRatingBreakdownHtml(name, month){
  const ctx = getMonthlyRatingContext(name, month);
  if(!ctx) return `<div class="section-sub">No qualifying month-end Power Rating for ${name} in ${monthLabel(month)}.</div>`;

  let html = buildMonthlyRatingHeaderHtml(ctx);
  html += `<div class="section-sub" style="margin-top:12px;">${buildMonthlyReconciliationText(ctx)}</div>`;

  if(ctx.journey && ctx.journey.entries.length > 1){
    html += `<div class="section-heading" style="margin-top:14px;">Rating through the month</div>
      <div class="matchup-vs" style="padding:8px;">${buildV3JourneyChartSvg(ctx.journey)}</div>`
      + buildJourneyLegendHtml(ctx.journey);
  }

  const matchCount = ctx.journey ? ctx.journey.matchCount : 0;
  html += `<div class="section-heading" style="margin-top:14px;">Matches this month (${matchCount})</div>`;
  html += buildMonthlyMatchCardsHtml(ctx);

  html += `<button class="explainer-toggle mrb-fullcalc-toggle" id="mrbFullCalcToggle" style="margin-top:10px;">View full calculation ›</button>
    <div class="section-sub" id="mrbFullCalcBody" style="display:none; margin-top:6px;">${buildMonthlyFullCalculationHtml(ctx)}</div>`;

  const compareHtml = buildMonthlyCompareButtonsHtml(ctx);
  if(compareHtml) html += `<div style="margin-top:14px;">${compareHtml}</div>`;

  html += `<button class="explainer-toggle mrb-howitworks-toggle" id="mrbHowItWorksToggle" style="margin-top:14px;">How month-end Power Rating works ›</button>
    <div class="section-sub" id="mrbHowItWorksBody" style="display:none; margin-top:6px;">${MONTHLY_RATING_METHODOLOGY_TEXT}</div>`;

  return html;
}

function buildMonthlyRatingCompareHtml(nameA, nameB, month){
  const ctxA = getMonthlyRatingContext(nameA, month);
  const ctxB = getMonthlyRatingContext(nameB, month);
  if(!ctxA || !ctxB) return `<div class="section-sub">Not enough data to compare.</div>`;
  const diff = Math.round((ctxA.rating - ctxB.rating)*10)/10;
  const leaderCtx = diff >= 0 ? ctxA : ctxB;
  const trailCtx = diff >= 0 ? ctxB : ctxA;
  const margin = Math.abs(diff);

  // Neither player is seeded at a month boundary: they each carry in whatever
  // their continuous rating had reached, and the month's results move it from
  // there. Saying where they came in is what actually explains the gap.
  const openA = ctxA.journey ? Math.round(ctxA.journey.startRating) : null;
  const openB = ctxB.journey ? Math.round(ctxB.journey.startRating) : null;
  const seedLine = (openA === null || openB === null)
    ? `Both figures are month-end points on one continuous rating, not a score solved for ${monthLabel(month)}.`
    : `${ctxA.name} carried ${openA} into ${monthLabel(month)} and ${ctxB.name} carried ${openB}. Neither is reset at the start of a month, so the gap below is that head start plus what each of them did with it.`;

  const statLine = (ctx) => `<b style="color:var(--text);">${ctx.name}</b>: ${ctx.player.wins}-${ctx.player.losses}, avg opponent ${Math.round(ctx.player.avg_match_strength)}, ${ctx.player.avg_overperf_pct>=0?'+':''}${ctx.player.avg_overperf_pct}% vs. expectation`;

  const explainer = margin < 10
    ? `A margin this small usually comes down to a handful of close games — check each player's full match list for the detail.`
    : `${leaderCtx.name}'s edge shows up mainly in ${leaderCtx.player.avg_overperf_pct > trailCtx.player.avg_overperf_pct ? 'outperforming what their results were expected to be' : 'a tougher run of opposition'} this month.`;

  return `<div class="mrb-header">
    <div class="mrb-period">${monthLabel(month)} · Tier ${ctxA.tier}</div>
    <div class="mrb-compare-title">${ctxA.name} vs ${ctxB.name}</div>
  </div>
  <div class="mrb-compare-ratings">
    <div class="mrb-compare-side"><div class="mrb-compare-name">${ctxA.name}</div><div class="mrb-compare-rating">${Math.round(ctxA.rating)}</div><div class="mrb-compare-pos">#${ctxA.position}</div></div>
    <div class="mrb-compare-vs">VS</div>
    <div class="mrb-compare-side"><div class="mrb-compare-name">${ctxB.name}</div><div class="mrb-compare-rating">${Math.round(ctxB.rating)}</div><div class="mrb-compare-pos">#${ctxB.position}</div></div>
  </div>
  <div class="section-sub" style="margin-top:10px;">${leaderCtx.name} leads by ${margin} pt${margin===1?'':'s'}. ${seedLine}</div>
  <div class="section-heading" style="margin-top:14px;">This month, side by side</div>
  <div class="matchup-vs">${statLine(ctxA)}</div>
  <div class="matchup-vs" style="margin-top:6px;">${statLine(ctxB)}</div>
  <div class="section-sub" style="margin-top:8px;">${explainer}</div>`;
}

// ---- Monthly Rating Breakdown ---------------------------------------------
// One tap-target shared by every place a monthly rating is shown -- Kings of
// Tiers, the podium, and the full ranking list -- so there is exactly one
// "why is this player's rating X this month" screen rather than several
// that could drift apart. All the actual maths lives in app.js
// (buildMonthlyRatingBreakdownHtml / buildMonthlyRatingCompareHtml, on top
// of the real computeMonthlyJourney engine); this just owns the modal shell
// and the toggle/compare wiring, same pattern as openNorthSouth above.
function openMonthlyRatingBreakdown(name, month){
  let modal = document.getElementById('monthlyRatingModal');
  if(!modal){
    modal = document.createElement('div');
    modal.className = 'shell-more-sheet';
    modal.id = 'monthlyRatingModal';
    document.body.appendChild(modal);
    modal.addEventListener('click', (e)=>{ if(e.target === modal) modal.classList.remove('show'); });
  }
  renderMonthlyRatingModal(modal, name, month);
  modal.classList.add('show');
}

function renderMonthlyRatingModal(modal, name, month){
  modal.innerHTML = `<div class="shell-more-panel">
    <h3 style="margin-bottom:10px;">Month-end Power Rating</h3>
    <div id="mrbModalBody">${buildMonthlyRatingBreakdownHtml(name, month)}</div>
  </div>`;
  const fc = document.getElementById('mrbFullCalcToggle');
  if(fc) fc.onclick = ()=>{
    const body = document.getElementById('mrbFullCalcBody');
    const open = body.style.display !== 'none';
    body.style.display = open ? 'none' : 'block';
    fc.textContent = open ? 'View full calculation ›' : 'View full calculation ⌄';
  };
  const hw = document.getElementById('mrbHowItWorksToggle');
  if(hw) hw.onclick = ()=>{
    const body = document.getElementById('mrbHowItWorksBody');
    const open = body.style.display !== 'none';
    body.style.display = open ? 'none' : 'block';
    hw.textContent = open ? 'How month-end Power Rating works ›' : 'How month-end Power Rating works ⌄';
  };
  modal.querySelectorAll('.mrb-compare-btn').forEach(btn=>{
    btn.onclick = ()=> renderMonthlyRatingCompareModal(modal, name, btn.dataset.compare, month);
  });
}

function renderMonthlyRatingCompareModal(modal, nameA, nameB, month){
  modal.innerHTML = `<div class="shell-more-panel">
    <button class="explainer-toggle mrb-back-btn" style="padding:0 0 8px;">‹ Back to ${nameA}</button>
    <div id="mrbModalBody">${buildMonthlyRatingCompareHtml(nameA, nameB, month)}</div>
  </div>`;
  modal.querySelector('.mrb-back-btn').onclick = ()=> renderMonthlyRatingModal(modal, nameA, month);
}
