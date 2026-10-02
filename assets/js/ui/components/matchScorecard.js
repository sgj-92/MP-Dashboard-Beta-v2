// ===================== UI: MATCH SCORECARD =====================
// The completed-match scorecard: one canonical card per rated match, opened
// from anywhere a played match is listed. The figures come from MatchScorecard
// (domain/matches/matchScorecard.js), which reads back what the engine recorded
// when it rated the match -- this file only finds the match and draws it.
//
// Opening it from another surface takes one line: put scorecardButtonHtml(id)
// in that surface's markup. A single delegated listener (initMatchScorecard,
// called once by the shell) opens the sheet for any [data-scorecard] control,
// so Games, the approval confirmation, and later Recent Results, the profile
// history or Rankings need no wiring of their own.
//
// Owning stream: functional (presentation of recorded facts).

// The scorecard view model for one match id, from the app's own match list and
// the engine's recorded facts. Null when the id is not a played match.
function matchScorecardFor(matchId){
  if(typeof MatchScorecard === 'undefined') return null;
  const m = getAllApprovedMatches().find(x => x.id === matchId);
  if(!m) return null;
  return MatchScorecard.build(m, (V3_MATCH_FACTS || {})[matchId] || null, { tierOf: historicalTierOf });
}

function scorecardButtonHtml(matchId, label){
  return `<button type="button" class="scorecard-open" data-scorecard="${escapeHtml(matchId)}">${escapeHtml(label || 'Match scorecard')}</button>`;
}

// "+62.4%", "−4.3pp" -- a real minus sign, so a negative never reads as a dash.
function scorecardSigned(v, unit){
  if(typeof v !== 'number') return '—';
  const s = v > 0 ? '+' : (v < 0 ? '−' : '±');
  return `${s}${Math.abs(v).toFixed(1)}${unit}`;
}

function matchScorecardHtml(vm){
  if(!vm) return `<div class="msc-empty">That match is not in the record.</div>`;
  const fmt1 = (v) => (typeof v === 'number' ? `${v.toFixed(1)}%` : '—');
  const toneOf = (v) => (typeof v !== 'number' || v === 0 ? '' : (v > 0 ? ' msc-pos' : ' msc-neg'));
  const result = vm.isDraw ? 'Draw' : `${vm.teams[0].names.map(escapeHtml).join(' & ')} won`;
  const context = [vm.format === 'singles' ? 'Singles' : 'Doubles', vm.matchup, vm.categoryLabel].filter(Boolean).map(escapeHtml).join(' · ');

  const teamHtml = (t) => {
    const players = t.players.map(p => `<div class="msc-player">
        <span class="msc-name">${escapeHtml(p.name)}</span>
        <span class="msc-tier" title="Tier on the day">${p.tier ? escapeHtml(p.tier) : '—'}</span>
        <span class="msc-move${toneOf(p.movement)}" title="Rating movement from this match">${typeof p.movement === 'number' ? scorecardSigned(p.movement, '') : '—'}</span>
      </div>`).join('');
    const tag = vm.isDraw ? 'Draw' : (t.won ? 'Won' : 'Lost');
    return `<div class="msc-team${t.won ? ' msc-won' : ''}" data-team="${t.no}">
      <div class="msc-team-head"><span>Team ${t.no}</span><span class="msc-result">${tag}</span></div>
      ${players}
      <div class="msc-figs">
        <div class="msc-fig"><span>Expected</span><b data-fig="expected">${fmt1(t.expectedPct)}</b></div>
        <div class="msc-fig"><span>Actual</span><b data-fig="actual">${fmt1(t.actualPct)}</b></div>
        <div class="msc-fig"><span>vs expected</span><b data-fig="pp" class="${toneOf(t.vsExpectedPp).trim()}">${scorecardSigned(t.vsExpectedPp, 'pp')}</b></div>
      </div>
      <div class="msc-games">Games ${t.games}–${t.opponentGames}${typeof t.gameSharePct === 'number' ? ` (${t.gameSharePct.toFixed(1)}% of games)` : ''}</div>
    </div>`;
  };

  const note = vm.rated
    ? `Expected and Actual are the rating engine's performance scores, recorded when this match was rated: 80% share of games won plus 20% the result (win 1, draw ½, loss 0). The difference, times each player's own K, is how far their rating moved. Tiers are the tiers held on the day.`
    : `This match has no rating record yet, so there is no expectation or movement to show. Nothing here is estimated.`;

  return `<div class="msc" data-match="${escapeHtml(vm.matchId)}">
    <div class="msc-head">
      <div class="msc-date">${escapeHtml(dayLabel(vm.date))}</div>
      <div class="msc-context">${context}</div>
      <div class="msc-score">${escapeHtml(vm.scoreText)}</div>
      <div class="msc-winner">${result}</div>
    </div>
    <div class="msc-teams">${vm.teams.map(teamHtml).join('')}</div>
    <div class="msc-note">${note}</div>
  </div>`;
}

function openMatchScorecard(matchId){
  let modal = document.getElementById('matchScorecardModal');
  if(!modal){
    modal = document.createElement('div');
    modal.className = 'shell-more-sheet';
    modal.id = 'matchScorecardModal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-label', 'Match scorecard');
    document.body.appendChild(modal);
    modal.addEventListener('click', (e)=>{
      if(e.target === modal || (e.target.closest && e.target.closest('[data-scorecard-close]'))) modal.classList.remove('show');
    });
  }
  modal.innerHTML = `<div class="shell-more-panel msc-panel">
    <div class="msc-title-row"><h3>Match scorecard</h3><button type="button" class="msc-close" data-scorecard-close aria-label="Close">✕</button></div>
    ${matchScorecardHtml(matchScorecardFor(matchId))}
  </div>`;
  modal.classList.add('show');
}

// One listener for every scorecard control in the app, wherever it is drawn.
function initMatchScorecard(){
  document.addEventListener('click', (e)=>{
    const btn = e.target.closest && e.target.closest('[data-scorecard]');
    if(!btn) return;
    e.preventDefault();
    openMatchScorecard(btn.dataset.scorecard);
  });
}
