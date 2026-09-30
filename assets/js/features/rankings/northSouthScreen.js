// ===================== NORTH VS SOUTH (Box Office Cup) SHEET =====================
// The exhibition table, fixtures and the admin result form. The event data
// and scoring (NORTH_SOUTH_*, computeNorthSouthTable) stay in app.js.
//
// Extracted from shell.js (docs/architecture/PARALLEL_DEVELOPMENT_SPLIT.md).
// Owning stream: redesign. Loads before app.js; declarations only.
// Lifted out of shell.js's buildShellDom unchanged. It is still indented as it
// was inside that function, on purpose: its HTML is built from multi-line
// template literals, and re-indenting would change their whitespace.

  // ==========================================================================
  // NORTH VS SOUTH (Box Office Cup) -- a one-off exhibition event, entirely
  // separate from the Money Padel rating system (see NORTH_SOUTH_EVENT /
  // NORTH_SOUTH_FIXTURES / northSouthResultsState in app.js). Rebuilt fresh
  // each open (and after every result save) since the table/fixtures change
  // as results come in.
  // ==========================================================================
  function buildNorthSouthTableHtml(){
    const t = computeNorthSouthTable();
    const row = (label, r) => `<tr style="border-top:1px solid var(--line);">
      <td style="padding:7px 4px 7px 8px; font-weight:700;">${label}</td>
      <td style="padding:7px 4px; text-align:center;">${r.played}</td>
      <td style="padding:7px 4px; text-align:center; color:var(--green);">${r.won}</td>
      <td style="padding:7px 4px; text-align:center; color:var(--text-dim);">${r.drawn}</td>
      <td style="padding:7px 4px; text-align:center; color:var(--red);">${r.lost}</td>
      <td style="padding:7px 4px; text-align:center;">${r.setsFor}-${r.setsAgainst}</td>
      <td style="padding:7px 4px 7px 8px; text-align:right; font-weight:700; color:var(--gold-bright);">${r.points}</td>
    </tr>`;
    return `<div class="callout-card" style="padding:0; overflow-x:auto;">
      <table style="width:100%; border-collapse:collapse; font-size:12px;">
        <thead><tr style="background:var(--bg2); text-align:left;">
          <th style="padding:7px 4px 7px 8px;">Team</th>
          <th style="padding:7px 4px; text-align:center;">P</th>
          <th style="padding:7px 4px; text-align:center;">W</th>
          <th style="padding:7px 4px; text-align:center;">D</th>
          <th style="padding:7px 4px; text-align:center;">L</th>
          <th style="padding:7px 4px; text-align:center;">Sets</th>
          <th style="padding:7px 4px 7px 8px; text-align:right;">Pts</th>
        </tr></thead>
        <tbody>${row('North', t.north)}${row('South', t.south)}</tbody>
      </table>
    </div>`;
  }

  function northSouthFixtureResultLine(fx){
    const r = scoreNorthSouthFixture(fx);
    if(!r) return `<span style="color:var(--text-dim);">Not played yet</span>`;
    const res = getNorthSouthFixtureResult(fx);
    if(res.status === 'draw') return `<span style="color:var(--text-dim);">Draw — unfinished on time</span>`;
    const setsText = res.sets.map(([n,s])=>`${n}-${s}`).join(', ');
    const tb = res.matchTiebreak ? ` · TB ${res.matchTiebreak[0]}-${res.matchTiebreak[1]}` : '';
    const winnerLabel = r.winner === 'north' ? 'North win' : 'South win';
    return `<span style="color:var(--gold-bright); font-weight:700;">${winnerLabel}</span> <span style="color:var(--text-dim);">(${setsText}${tb})</span>`;
  }

  function buildNorthSouthFixturesHtml(){
    if(NORTH_SOUTH_FIXTURES.length === 0){
      return `<div class="section-sub">Fixtures will appear here once the list is confirmed.</div>`;
    }
    return NORTH_SOUTH_FIXTURES.map(fx => `<div class="matchup-vs">
      <b>${fx.north.join(' & ')}</b> <span style="color:var(--text-dim);">(North)</span> &nbsp;vs&nbsp; <b>${fx.south.join(' & ')}</b> <span style="color:var(--text-dim);">(South)</span>
      <div style="margin-top:4px; font-size:11.5px;">${northSouthFixtureResultLine(fx)}</div>
    </div>`).join('');
  }

  // Admin-only (isUnlocked, same gate as the main app's Manage tab) --
  // everyone else just sees the read-only table/fixtures above. Only
  // rendered once there's at least one real fixture to pick from.
  function buildNorthSouthAdminHtml(){
    if(!isUnlocked || NORTH_SOUTH_FIXTURES.length === 0) return '';
    const options = NORTH_SOUTH_FIXTURES.map(fx=>`<option value="${fx.id}">${fx.north.join(' & ')} vs ${fx.south.join(' & ')}</option>`).join('');
    return `<div class="section-heading">⚡ Admin: add / edit result</div>
      <div class="fg-controls">
        <div class="fg-row"><label class="fg-label">Fixture</label><select id="nsFixtureSelect" class="fg-select">${options}</select></div>
        <div class="fg-row"><label class="fg-label">Set 1 (North–South)</label>
          <input id="nsSet1N" class="fg-select" style="width:48%; display:inline-block;" placeholder="N" type="number" min="0" max="9">
          <input id="nsSet1S" class="fg-select" style="width:48%; display:inline-block; margin-left:4%;" placeholder="S" type="number" min="0" max="9">
        </div>
        <div class="fg-row"><label class="fg-label">Set 2 (North–South)</label>
          <input id="nsSet2N" class="fg-select" style="width:48%; display:inline-block;" placeholder="N" type="number" min="0" max="9">
          <input id="nsSet2S" class="fg-select" style="width:48%; display:inline-block; margin-left:4%;" placeholder="S" type="number" min="0" max="9">
        </div>
        <div class="fg-row"><label class="fg-label">Match tiebreak, if one set each (North–South)</label>
          <input id="nsTbN" class="fg-select" style="width:48%; display:inline-block;" placeholder="N" type="number" min="0">
          <input id="nsTbS" class="fg-select" style="width:48%; display:inline-block; margin-left:4%;" placeholder="S" type="number" min="0">
        </div>
        <div class="fg-row"><button class="preset-btn" id="nsMarkDraw" style="width:100%;">Mark as draw (ran out of time)</button></div>
        <div class="fg-row"><button class="tab-btn active" id="nsSaveResult" style="width:100%;">Save Result</button></div>
        <div id="nsResultMessage" class="section-sub"></div>
      </div>`;
  }

  function openNorthSouth(){
    let modal = document.getElementById('northSouthModal');
    if(!modal){
      modal = document.createElement('div');
      modal.className = 'shell-more-sheet';
      modal.id = 'northSouthModal';
      document.body.appendChild(modal);
      modal.addEventListener('click', (e)=>{ if(e.target === modal) modal.classList.remove('show'); });
    }
    renderNorthSouthModal(modal);
    modal.classList.add('show');
  }

  function renderNorthSouthModal(modal){
    const ev = NORTH_SOUTH_EVENT;
    modal.innerHTML = `<div class="shell-more-panel">
      <div class="mp-section-label">${ev.subtitle}</div>
      <h3 style="margin-bottom:2px;">${ev.name}</h3>
      <div class="section-sub" style="margin-bottom:14px;">${ev.date} · ${ev.time}<br>${ev.venue} — ${ev.address}</div>

      <div class="section-heading" style="margin-top:0;">League Table</div>
      ${buildNorthSouthTableHtml()}

      <div class="section-heading">Rosters</div>
      <div class="section-sub"><b style="color:var(--text);">North:</b> ${NORTH_ROSTER.join(', ')}</div>
      <div class="section-sub"><b style="color:var(--text);">South:</b> ${SOUTH_ROSTER.length ? SOUTH_ROSTER.join(', ') : 'TBC'}</div>

      <div class="section-heading">Fixtures</div>
      ${buildNorthSouthFixturesHtml()}

      <div class="section-heading">Rules</div>
      <div class="section-sub">${ev.notes.map(n=>`• ${n}`).join('<br>')}</div>

      ${buildNorthSouthAdminHtml()}
    </div>`;

    const saveBtn = document.getElementById('nsSaveResult');
    if(saveBtn){
      saveBtn.onclick = async ()=>{
        const msg = document.getElementById('nsResultMessage');
        const fxId = document.getElementById('nsFixtureSelect').value;
        const s1n = document.getElementById('nsSet1N').value, s1s = document.getElementById('nsSet1S').value;
        const s2n = document.getElementById('nsSet2N').value, s2s = document.getElementById('nsSet2S').value;
        const tbn = document.getElementById('nsTbN').value, tbs = document.getElementById('nsTbS').value;
        const sets = [];
        if(s1n!=='' && s1s!=='') sets.push([parseInt(s1n,10), parseInt(s1s,10)]);
        if(s2n!=='' && s2s!=='') sets.push([parseInt(s2n,10), parseInt(s2s,10)]);
        if(sets.length===0){ msg.textContent = 'Enter at least one set score.'; return; }
        const matchTiebreak = (tbn!=='' && tbs!=='') ? [parseInt(tbn,10), parseInt(tbs,10)] : null;
        const prev = northSouthResultsState[fxId];
        northSouthResultsState[fxId] = { sets, matchTiebreak, status: 'completed' };
        const ok = await saveNorthSouthResults(northSouthResultsState);
        if(!ok){
          if(prev) northSouthResultsState[fxId] = prev; else delete northSouthResultsState[fxId];
          msg.textContent = storageAvailable() ? `Save failed (${lastStorageError||'unknown error'}) — try again.` : `Save failed — this page can't reach shared storage.`;
          return;
        }
        renderNorthSouthModal(modal);
      };
    }
    const drawBtn = document.getElementById('nsMarkDraw');
    if(drawBtn){
      drawBtn.onclick = async ()=>{
        const msg = document.getElementById('nsResultMessage');
        const fxId = document.getElementById('nsFixtureSelect').value;
        const prev = northSouthResultsState[fxId];
        northSouthResultsState[fxId] = { sets: [], matchTiebreak: null, status: 'draw' };
        const ok = await saveNorthSouthResults(northSouthResultsState);
        if(!ok){
          if(prev) northSouthResultsState[fxId] = prev; else delete northSouthResultsState[fxId];
          msg.textContent = storageAvailable() ? `Save failed (${lastStorageError||'unknown error'}) — try again.` : `Save failed — this page can't reach shared storage.`;
          return;
        }
        renderNorthSouthModal(modal);
      };
    }
  }
