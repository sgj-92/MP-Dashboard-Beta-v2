// ===================== PLAYERS: HEAD TO HEAD =====================
// Players › Compare: two players' meetings as opponents and as partners, all
// time or one month (its month, h2hMonth, stays in app.js).
// Owning stream: redesign. Loads before app.js; declarations only.
//
// Extracted from app.js unchanged (docs/architecture/PARALLEL_DEVELOPMENT_SPLIT.md).

let h2hPlayerA = null;

let h2hPlayerB = null;

function renderH2H(){
  const box = document.getElementById('h2hView');
  const names = [...PLAYERS].map(p=>p.name).sort((a,b)=>a.localeCompare(b));
  if(!h2hPlayerA) h2hPlayerA = names[0];
  if(!h2hPlayerB) h2hPlayerB = names.find(n=>n!==h2hPlayerA) || names[0];

  let html = `<div class="fg-controls">
    <div class="fg-row"><label class="fg-label">Player A</label>
      <select id="h2hSelectA" class="fg-select"></select>
    </div>
    <div class="fg-row"><label class="fg-label">Player B</label>
      <select id="h2hSelectB" class="fg-select"></select>
    </div>
    <div class="fg-row"><label class="fg-label">Month</label>
      <select id="h2hMonthSelect" class="fg-select"></select>
    </div>
  </div>`;

  if(h2hPlayerA === h2hPlayerB){
    html += `<div class="section-sub">Pick two different players to compare.</div>`;
    box.innerHTML = html;
    populateMonthSelect(document.getElementById('h2hMonthSelect'), h2hMonth);
    document.getElementById('h2hMonthSelect').addEventListener('change', e=>{ h2hMonth = e.target.value; renderH2H(); });
    wireH2HSelects(names);
    return;
  }

  const monthActive = h2hMonth !== 'all';

  if(monthActive){
    const monthlyRatings = monthEndRatings(h2hMonth);
    const monthlyStatsAll = computeMonthlyStats(h2hMonth);
    const aHas = h2hPlayerA in monthlyRatings, bHas = h2hPlayerB in monthlyRatings;
    const aOverall = PLAYERS.find(p=>p.name===h2hPlayerA).rating;
    const bOverall = PLAYERS.find(p=>p.name===h2hPlayerB).rating;
    const aMonth = aHas ? Math.round(monthlyRatings[h2hPlayerA]) : null;
    const bMonth = bHas ? Math.round(monthlyRatings[h2hPlayerB]) : null;
    const aAhead = aHas && bHas && aMonth > bMonth;
    const bAhead = aHas && bHas && bMonth > aMonth;
    const aStats = monthlyStatsAll[h2hPlayerA];
    const bStats = monthlyStatsAll[h2hPlayerB];
    const aWL = aStats ? `<span style="color:var(--green);">${aStats.wins}W</span>-<span style="color:var(--red);">${aStats.losses}L</span>` : '0W-0L';
    const bWL = bStats ? `<span style="color:var(--green);">${bStats.wins}W</span>-<span style="color:var(--red);">${bStats.losses}L</span>` : '0W-0L';

    html += `<div class="section-heading" style="margin-top:6px;">📊 Power Rating — ${monthLabel(h2hMonth)}</div>`;
    html += `<div class="matchup-vs" style="padding:12px;">
      <div style="display:flex; justify-content:space-around; text-align:center;">
        <div>
          <div style="font-weight:700; margin-bottom:2px;">${h2hPlayerA}</div>
          <div style="font-size:24px; font-weight:700; color:${aAhead?'var(--gold-bright)':'var(--text)'};">${aMonth !== null ? aMonth : '–'}</div>
          <div style="font-size:11px; margin-top:2px;">${aWL}</div>
          <div style="font-size:10px; color:var(--text-dim);">overall: ${Math.round(aOverall)}</div>
        </div>
        <div style="align-self:center; color:var(--text-dim); font-size:13px;">vs</div>
        <div>
          <div style="font-weight:700; margin-bottom:2px;">${h2hPlayerB}</div>
          <div style="font-size:24px; font-weight:700; color:${bAhead?'var(--gold-bright)':'var(--text)'};">${bMonth !== null ? bMonth : '–'}</div>
          <div style="font-size:11px; margin-top:2px;">${bWL}</div>
          <div style="font-size:10px; color:var(--text-dim);">overall: ${Math.round(bOverall)}</div>
        </div>
      </div>
    </div>`;

    html += `<div class="section-sub" style="padding:4px 2px;">The rating below is the continuous Power Rating, shown from where each player carried it into ${monthLabel(h2hMonth)}. It is not reset at the start of the month and not re-solved for the month: these are the moves the engine actually recorded, in order.</div>`;

    [h2hPlayerA, h2hPlayerB].forEach(pname=>{
      const monthJourney = computeMonthlyJourney(pname, h2hMonth);
      const monthEntries = monthJourney ? monthJourney.entries.filter(e=>e.kind==='match') : [];
      const startPoint = monthJourney ? Math.round(monthJourney.startRating) : null;
      html += `<div class="section-sub" style="font-weight:700; color:var(--text); margin-top:8px;">${pname}'s games this month${startPoint!==null ? ` — carried in at ${startPoint}` : ''}</div>`;
      if(monthEntries.length === 0){
        html += `<div class="section-sub">No games for ${pname} in ${monthLabel(h2hMonth)}.</div>`;
      } else {
        monthEntries.forEach(e=>{
          const m = MATCHES.find(x=>x.id===e.matchId);
          if(!m) return;
          const d = journeyMatchDescription(pname, e.matchId);
          const teamLabel = d && d.partner ? `${pname} &amp; ${d.partner}` : pname;
          const deltaClass = e.delta > 0 ? 'perf-pos' : (e.delta < 0 ? 'perf-neg' : '');
          const deltaLabel = e.delta > 0 ? `+${e.delta}` : `${e.delta}`;
          const isExpanded = expandedGameId === m.id;
          const detailContent = isExpanded ? buildMatchDetailBlock(m, true) : '';
          html += `<div class="callout-card" style="padding:8px 12px;">
            <div class="game-card-clickable h2h-month-game" data-gameid="${m.id}" style="cursor:pointer;">
              <div style="display:flex; justify-content:space-between; font-size:11.5px;">
                <span><b>${teamLabel}</b> vs ${d ? d.opponents : ''}</span>
                <span style="color:${m.isDraw?'var(--text-dim)':(d && d.won?'var(--green)':'var(--red)')};">${m.isDraw?'DRAW':(d && d.won?'WIN':'LOSS')}</span>
              </div>
              <div style="margin-top:2px; color:var(--text-dim); font-size:11px;">${e.date} · ${m.score}</div>
              <div style="margin-top:4px;"><span class="${deltaClass}" style="font-weight:700;">${deltaLabel} pts</span> <span style="color:var(--text-dim); font-size:11px;">→ ${Math.round(e.rating)}</span></div>
              ${!isExpanded ? `<div style="margin-top:2px; color:var(--text-dim); font-size:10px;">tap for this game's full breakdown</div>` : ''}
              ${detailContent}
            </div>
          </div>`;
        });
      }
    });
  }

  // Both lists come from the shared selectors, which include drawn games.
  // They were built here from `MATCHES` -- the RATED set -- so a drawn meeting
  // was not a meeting at all: two players who had drawn once and never
  // otherwise met were told they had never played each other.
  const inMonth = (m) => !monthActive || m.date.slice(0,7) === h2hMonth;
  const opponentMatches = h2hOpponentMatches(h2hPlayerA, h2hPlayerB)
    .filter(inMonth).sort((a,b)=> a.date < b.date ? 1 : -1);
  const teammateMatches = h2hTeammateMatches(h2hPlayerA, h2hPlayerB)
    .filter(inMonth).sort((a,b)=> a.date < b.date ? 1 : -1);

  const headToHead = MatchOutcome.tally(opponentMatches, h2hPlayerA);
  const aWins = headToHead.wins;
  const bWins = headToHead.losses;   // A's losses as opponents ARE B's wins
  const h2hDraws = headToHead.draws;

  html += `<div class="section-heading" style="margin-top:6px;">⚔️ As opponents${monthActive ? ` (${monthLabel(h2hMonth)})` : ''}</div>`;
  if(opponentMatches.length === 0){
    html += `<div class="section-sub">${h2hPlayerA} and ${h2hPlayerB} ${monthActive ? `didn't play each other in ${monthLabel(h2hMonth)}` : 'have never played against each other'}.</div>`;
  } else {
    html += `<div class="matchup-vs" style="text-align:center; font-size:16px; padding:12px;">
      <b style="color:${aWins>bWins?'var(--gold-bright)':'var(--text)'};">${h2hPlayerA} ${aWins}</b>
      <span style="color:var(--text-dim); margin:0 6px;">–</span>${h2hDraws ? `<span style="color:var(--text-dim); font-size:13px;">${h2hDraws} drawn</span><span style="color:var(--text-dim); margin:0 6px;">–</span>` : ''}
      <b style="color:${bWins>aWins?'var(--gold-bright)':'var(--text)'};">${bWins} ${h2hPlayerB}</b>
      <div style="font-size:11px; color:var(--text-dim); margin-top:4px;">${opponentMatches.length} meeting${opponentMatches.length===1?'':'s'} as opponents</div>
    </div>`;
    opponentMatches.forEach(m=>{
      const sidesA = MatchOutcome.sidesFor(m, h2hPlayerA);
      const drew = sidesA.outcome === MatchOutcome.DRAW;
      const aWon = sidesA.outcome === MatchOutcome.WIN;
      const aPartner = sidesA.mine.filter(n=>n!==h2hPlayerA)[0];
      const bPartner = sidesA.theirs.filter(n=>n!==h2hPlayerB)[0];
      const adminButtons = isUnlocked
        ? `<div class="section-sub" style="margin-top:8px; font-size:10.5px;">To correct or remove this game, open it in the Games tab.</div>`
        : '';
      // "X won" is not a thing that happened in a drawn match, and saying it
      // of whichever side the record filed first is how this screen used to
      // hand one player a win and the other a loss out of a coin toss.
      const title = drew
        ? `${h2hPlayerA} and ${h2hPlayerB} drew`
        : `${aWon ? h2hPlayerA : h2hPlayerB} won`;
      const titleColour = drew ? 'var(--text-dim)' : (aWon ? 'var(--green)' : 'var(--red)');
      html += `<div class="callout-card">
        <div class="cc-title" style="color:${titleColour};">${escapeHtml(title)}</div>
        <div class="cc-detail">${m.date} · ${aPartner?`${h2hPlayerA} &amp; ${aPartner}`:h2hPlayerA} vs ${bPartner?`${h2hPlayerB} &amp; ${bPartner}`:h2hPlayerB}<br/>${m.score}</div>
        ${adminButtons}
      </div>`;
    });
  }

  html += `<div class="section-heading">🤝 As teammates${monthActive ? ` (${monthLabel(h2hMonth)})` : ''}</div>`;
  if(teammateMatches.length === 0){
    html += `<div class="section-sub">${h2hPlayerA} and ${h2hPlayerB} ${monthActive ? `didn't play together in ${monthLabel(h2hMonth)}` : 'have never partnered together'}.</div>`;
  } else {
    // `losses = total - wins` is the shape that cannot hold a draw, and it
    // filed every drawn game as a defeat for the pair.
    const together = MatchOutcome.tally(teammateMatches, h2hPlayerA);
    const partnership = PARTNERSHIPS.find(p=> p.pair.includes(h2hPlayerA) && p.pair.includes(h2hPlayerB));
    html += `<div class="matchup-vs" style="padding:10px;">
      <b>${together.wins}-${together.losses}${together.draws ? `-${together.draws}` : ''}</b> together${together.draws ? ` <span style="color:var(--text-dim); font-size:11px;">(W-L-D)</span>` : ''}${partnership ? ` · <span class="${partnership.avg_overperf>3?'perf-pos':(partnership.avg_overperf<-3?'perf-neg':'')}">${partnership.avg_overperf>=0?'+':''}${partnership.avg_overperf}% chemistry</span>` : ''}
    </div>`;
    teammateMatches.forEach(m=>{
      const sides = MatchOutcome.sidesFor(m, h2hPlayerA);
      const oppTeam = sides.theirs;
      const adminButtons = isUnlocked
        ? `<div class="section-sub" style="margin-top:8px; font-size:10.5px;">To correct or remove this game, open it in the Games tab.</div>`
        : '';
      html += `<div class="callout-card">
        <div class="cc-title" style="color:${sides.outcome===MatchOutcome.DRAW?'var(--text-dim)':(sides.outcome===MatchOutcome.WIN?'var(--green)':'var(--red)')};">${sides.outcome===MatchOutcome.DRAW?'DRAW':(sides.outcome===MatchOutcome.WIN?'WIN':'LOSS')}</div>
        <div class="cc-detail">${m.date} · vs ${oppTeam.join(' &amp; ')}<br/>${m.score}</div>
        ${adminButtons}
      </div>`;
    });
  }

  box.innerHTML = html;

  box.querySelectorAll('.h2h-edit-btn').forEach(btn=>{
    btn.onclick = ()=> navigateToGamesTabForEdit(btn.dataset.matchId);
  });
  box.querySelectorAll('.h2h-delete-btn').forEach(btn=>{
    btn.onclick = async ()=>{
      const id = btn.dataset.matchId;
      if(armedDeleteId === id){ await deleteMatch(id); renderH2H(); }
      else { armedDeleteId = id; renderH2H(); }
    };
  });
  box.querySelectorAll('.h2h-month-game').forEach(el=>{
    el.onclick = (ev)=>{
      if(ev.target.closest && ev.target.closest('details')) return; // see the note in renderGamesTab
      const id = el.dataset.gameid;
      expandedGameId = (expandedGameId === id) ? null : id;
      renderH2H();
    };
  });
  wireH2HSelects(names);

  populateMonthSelect(document.getElementById('h2hMonthSelect'), h2hMonth);
  document.getElementById('h2hMonthSelect').addEventListener('change', e=>{
    h2hMonth = e.target.value;
    renderH2H();
  });
}

function wireH2HSelects(names){
  const selA = document.getElementById('h2hSelectA');
  const selB = document.getElementById('h2hSelectB');
  selA.innerHTML = names.map(n=>`<option value="${n}" ${n===h2hPlayerA?'selected':''}>${n}</option>`).join('');
  selB.innerHTML = names.map(n=>`<option value="${n}" ${n===h2hPlayerB?'selected':''}>${n}</option>`).join('');
  selA.addEventListener('change', e=>{ h2hPlayerA = e.target.value; renderH2H(); });
  selB.addEventListener('change', e=>{ h2hPlayerB = e.target.value; renderH2H(); });
}
