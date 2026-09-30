// ===================== INSIGHTS / CALL-OUTS =====================
// The Insights screen: partnership chemistry (behind its visibility setting),
// within-tier games, boundary tests and calibration games.
// Owning stream: redesign. Loads before app.js; declarations only.
//
// Extracted from app.js unchanged (docs/architecture/PARALLEL_DEVELOPMENT_SPLIT.md).

function renderCallouts(){
  const box = document.getElementById('calloutsView');
  let html = '';

  if(canSee('chemistry')){
    html += `<div class="section-heading">🤝 Best chemistry partnerships</div>`;
    html += `<div class="section-sub">Ranked by how much a pairing overperforms what the matchup alone would predict, not just their win rate — this is what "they barely lose together" actually looks like in the numbers. Minimum 2 games together; small samples are flagged.</div>`;
    const topPartnerships = PARTNERSHIPS.filter(p=>p.games>=2).sort((a,b)=> b.avg_overperf - a.avg_overperf).slice(0,8);
    topPartnerships.forEach(p=>{
      const perfClass = p.avg_overperf > 3 ? 'perf-pos' : (p.avg_overperf < -3 ? 'perf-neg' : '');
      const smallSample = p.games < 3 ? ` <span style="color:var(--text-dim); font-size:10px;">(small sample)</span>` : '';
      html += `<div class="callout-card">
        <div class="cc-title">${p.pair[0]} (Tier ${p.tier_a}) &amp; ${p.pair[1]} (Tier ${p.tier_b})${smallSample}</div>
        <div class="cc-detail">${p.games} games together · ${p.wins}-${p.losses} (${p.winpct}%) · <span class="${perfClass}">${p.avg_overperf>=0?'+':''}${p.avg_overperf}% chemistry</span></div>
      </div>`;
    });
  }

  html += `<div class="section-heading">🏆 Within-tier rank clarifiers</div>`;
  html += `<div class="section-sub">Near-ties inside the same tier, from S down to C — a mix of unsettled fresh matchups and razor-thin margins even after plenty of meetings, since both are worth knowing about.</div>`;
  const tierOrderDisplay = ["S","A","B","C"];
  tierOrderDisplay.forEach(t=>{
    const games = WITHIN_TIER_GAMES.filter(c=>c.tier===t);
    if(games.length === 0) return;
    html += `<div style="font-family:'Helvetica Neue',Arial,sans-serif; font-size:11.5px; color:var(--gold-soft); font-weight:700; margin:8px 0 4px;">TIER ${t}</div>`;
    games.forEach(c=>{
      const m = c.matchup;
      let wingNote = '';
      if(!m.pure_tier){
        wingNote = `<br/><span style="color:var(--text-dim); font-size:10.5px;">wingmen pulled partly from Tier ${m.tiers_involved.filter(x=>x!==t).join(', ')} — no other Tier ${t} player available to fill both sides</span>`;
      } else if(m.has_light_wingman){
        wingNote = `<br/><span style="color:var(--text-dim); font-size:10.5px;">stays all Tier ${t} — one wingman has fewer than 4 games, so treat the balance as a bit more provisional</span>`;
      }
      html += `<div class="callout-card">
        <div class="cc-title">${c.a} (${Math.round(c.rating_a)}, ${c.games_a}g) vs ${c.b} (${Math.round(c.rating_b)}, ${c.games_b}g)</div>
        <div class="cc-detail">Just ${c.gap} rating points apart · played each other ${c.played_before}x so far</div>
        <div class="matchup-vs"><b>${m.team1[0]} &amp; ${m.team1[1]}</b> (${Math.round(m.team1_rating)}) &nbsp;vs&nbsp; <b>${m.team2[0]} &amp; ${m.team2[1]}</b> (${Math.round(m.team2_rating)})<br/><span style="color:var(--text-dim); font-size:11px;">teams balanced within ${m.team_gap} pts</span>${wingNote}</div>
      </div>`;
    });
  });

  html += `<div class="section-heading">🎯 Boundary tests</div>`;
  html += `<div class="section-sub">Close ratings straddling a tier line — these games carry the most weight for deciding if the line is in the right place. A wingman is added to each side to keep the two teams balanced.</div>`;
  if(BOUNDARY_TESTS.length === 0){
    html += `<div class="section-sub">No close cross-tier pairings with enough of a track record yet.</div>`;
  } else {
    BOUNDARY_TESTS.forEach(c=>{
      const m = c.matchup;
      html += `<div class="callout-card">
        <div class="cc-title">${c.a} (Tier ${c.tier_a}, ${Math.round(c.rating_a)}) vs ${c.b} (Tier ${c.tier_b}, ${Math.round(c.rating_b)})</div>
        <div class="cc-detail">Only ${c.gap} rating points apart despite sitting in different tiers · played each other ${c.played_before}x so far</div>
        <div class="matchup-vs"><b>${m.team1[0]} &amp; ${m.team1[1]}</b> (${Math.round(m.team1_rating)}) &nbsp;vs&nbsp; <b>${m.team2[0]} &amp; ${m.team2[1]}</b> (${Math.round(m.team2_rating)})<br/><span style="color:var(--text-dim); font-size:11px;">teams balanced within ${m.team_gap} pts</span></div>
      </div>`;
    });
  }

  html += `<div class="section-heading">📋 Players worth calling out</div>`;
  html += `<div class="section-sub">Low-sample players, matched against the closest-rated opponent with a real track record who they haven't already played much — the fastest way to firm up an uncertain number.</div>`;
  CALIBRATION_GAMES.forEach(c=>{
    const b = c.best_anchor;
    const m = c.matchup;
    html += `<div class="callout-card">
      <div class="cc-title">${c.name} (Tier ${c.tier}, ${Math.round(c.rating)}, ${c.games}g) → ${b.opponent} (Tier ${b.tier}, ${Math.round(b.rating)}, ${b.games}g)</div>
      <div class="cc-detail">${c.games} game${c.games===1?'':'s'} on record for ${c.name} · ${b.gap} point gap · played before: ${b.played_before}x</div>
      <div class="matchup-vs"><b>${m.team1[0]} &amp; ${m.team1[1]}</b> (${Math.round(m.team1_rating)}) &nbsp;vs&nbsp; <b>${m.team2[0]} &amp; ${m.team2[1]}</b> (${Math.round(m.team2_rating)})<br/><span style="color:var(--text-dim); font-size:11px;">teams balanced within ${m.team_gap} pts</span></div>
    </div>`;
  });

  box.innerHTML = html;
}
