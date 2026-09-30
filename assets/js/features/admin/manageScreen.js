// ===================== ADMIN: MANAGE =====================
// Admin / Manage: the accordion (collapsed by default), visibility settings,
// passwords, exports, player tags and renaming, and the build stamp at the
// foot. Admin tools change the record and its settings: functional code.
//
// Extracted from app.js unchanged (docs/architecture/PARALLEL_DEVELOPMENT_SPLIT.md).
// Owning stream: functional (the build stamp's look is shared with the redesign).
// Loads before app.js; declarations only.

// Which admin sections are open right now. Deliberately NOT persisted: Shaun's
// rule is that the screen opens collapsed every time, so arriving at
// Admin/Manage always shows the same short list of what is available rather
// than wherever the last session happened to leave it.
let adminOpenSections = {};

function resetAdminSections(){ adminOpenSections = {}; }

// One component for every admin section. The whole header row is the tap
// target -- a chevron-sized hit area on a phone is a miss waiting to happen.
function adminSection(key, title, bodyHtml){
  const open = !!adminOpenSections[key];
  return `<div class="admin-acc${open ? ' is-open' : ''}" data-acc="${key}">
    <button type="button" class="admin-acc-head" data-acc-toggle="${key}" aria-expanded="${open}">
      <span class="admin-acc-title">${title}</span>
      <span class="admin-acc-chev" aria-hidden="true">▾</span>
    </button>
    ${open ? `<div class="admin-acc-body">${bodyHtml}</div>` : ''}
  </div>`;
}

// ---- Build stamp, the last thing on Admin / Manage -----------------------
// Which deployed build this device is actually running. A debugging aid, so
// it is deliberately quiet and not a card. Shown locked or unlocked: a build
// SHA is not sensitive, and a locked phone is still worth diagnosing. See
// buildStamp.js for where the SHA and date come from and why they are never
// fetched.
function buildStampHtml(){
  const b = BuildStamp.describe(window.MP_BUILD);
  return `<button type="button" class="build-stamp" id="buildStamp" data-copy="${escapeHtml(b.copyText)}" aria-label="${escapeHtml(b.copyText)}. Tap to copy.">
    <span class="build-stamp-title">${escapeHtml(b.title)}</span>
    <span class="build-stamp-sha" id="buildStampSha">${escapeHtml(b.build)}</span>
  </button>`;
}

function wireBuildStamp(){
  const btn = document.getElementById('buildStamp');
  if(!btn) return;
  const line = document.getElementById('buildStampSha');
  const original = line.textContent;
  let timer = null;
  const say = (text)=>{
    line.textContent = text;
    clearTimeout(timer);
    timer = setTimeout(()=>{ line.textContent = original; }, 1600);
  };
  btn.onclick = ()=>{
    copyText(btn.dataset.copy).then(ok => say(ok ? 'Copied' : original));
  };
}

function renderManage(){
  const box = document.getElementById('manageView');
  if(!isUnlocked){
    box.innerHTML = buildLockScreenHtml() + buildStampHtml();
    wireLockScreen(renderManage);
    wireBuildStamp();
    return;
  }
  let html = '';

  html += adminSection('predict', 'Predict a matchup',
    `<div class="section-sub">Pick up to two names per side and see what the current ratings expect — no game needs to exist yet. Leave a second name blank for singles.</div>`
    + `<div class="fg-controls">
    <div class="fg-row"><label class="fg-label">Team A</label>
      <input id="predA1" list="playerNamesList" class="fg-select" placeholder="Player name" style="margin-bottom:6px;" value="${predDraftName('teamA',0)}" />
      <input id="predA2" list="playerNamesList" class="fg-select" placeholder="Partner (optional)" value="${predDraftName('teamA',1)}" />
    </div>
    <div class="fg-row"><label class="fg-label">Team B</label>
      <input id="predB1" list="playerNamesList" class="fg-select" placeholder="Player name" style="margin-bottom:6px;" value="${predDraftName('teamB',0)}" />
      <input id="predB2" list="playerNamesList" class="fg-select" placeholder="Partner (optional)" value="${predDraftName('teamB',1)}" />
    </div>
    <div id="predResult"></div>
  </div>`);

  html += adminSection('players', 'Player tags',
    `<div class="section-sub">Toggle who's currently active — inactive players are skipped by every suggestion engine but keep their full history. You can also add someone who hasn't played yet.</div>`
    + `<div class="section-heading" style="margin-top:0;">Add a new player</div>`
    + `<div class="fg-controls">
    <div class="fg-row">
      <input id="npName" class="fg-select" placeholder="Name" style="margin-bottom:6px;" />
      <select id="npTier" class="fg-select">
        <option value="S">Tier S</option><option value="A">Tier A</option>
        <option value="B" selected>Tier B</option><option value="C">Tier C</option>
      </select>
    </div>
    <div class="fg-row"><button class="preset-btn" id="npAdd">+ Add player</button></div>
    <div id="npMessage" class="section-sub"></div>
  </div>`
    + `<div class="section-heading">Existing players</div>`
    + `<div class="section-sub" style="font-size:10.5px;">Tap a player to change their tier, the tier they started at, or whether they are active.</div>`
    + `<div class="fg-controls" style="padding-top:2px; padding-bottom:2px;"><div id="playerTagsList"></div></div>`);

  html += adminSection('visibility', 'Visible to everyone',
    `<div class="section-sub">Switch off anything you'd rather keep admin-only. You always see everything; these toggles only affect people who haven't unlocked. Matchmaking suggestions are hidden by default since they'd otherwise show everyone's ideal opponents to the whole group.</div>`
    + `<div class="fg-controls">` + Object.keys(VISIBILITY_DEFAULTS).map(key=>`
    <div class="alpha-row">
      <div class="alpha-name" style="font-size:13px;">${VISIBILITY_LABELS[key]}</div>
      <button class="preset-btn vis-toggle ${visibilityState[key]!==false?'active':''}" data-vis="${key}" style="width:100px;">${visibilityState[key]!==false?'Visible':'Admin only'}</button>
    </div>`).join('') + `<div id="visMessage" class="section-sub"></div></div>`);

  html += adminSection('review', 'Admin monthly review', buildReviewSectionHtml());
  html += adminSection('historical', 'Historical club adjustment', buildHistoricalAdjustmentHtml());
  html += adminSection('diagnostics', 'Beta diagnostics', buildDiagnosticsSectionHtml());

  html += adminSection('lock', 'Admin lock',
    `<div class="fg-controls">
    <div class="fg-row"><button class="preset-btn" id="lockNowBtn" style="width:100%;">Lock admin area</button></div>
  </div>`);

  html += adminSection('ownerpw', 'Your password',
    `<div class="section-sub">${ownerPasswordHash ? 'Change your own password. This never touches the board password.' : 'Not set yet — this shouldn\'t normally happen once one exists, but you can set it here if needed.'}</div>`
    + `<div class="fg-controls">
    <div class="fg-row"><input id="cpOwnerCurrent" type="password" class="fg-select" placeholder="${ownerPasswordHash ? 'Current password' : '(leave blank — not set yet)'}" style="margin-bottom:6px;" /></div>
    <div class="fg-row"><input id="cpOwnerNew" type="password" class="fg-select" placeholder="New password" /></div>
    <div class="fg-row"><button class="preset-btn" id="cpOwnerSubmit">Update your password</button></div>
    <div id="cpOwnerMessage" class="section-sub"></div>
  </div>`);

  html += adminSection('boardpw', 'Board password',
    `<div class="section-sub">${boardPasswordHash ? 'A second, independent password — whoever knows it can change it themselves without touching yours.' : 'Not set up yet. Set one here to give the board their own password, separate from yours.'}</div>`
    + `<div class="fg-controls">
    <div class="fg-row"><input id="cpBoardCurrent" type="password" class="fg-select" placeholder="${boardPasswordHash ? 'Current board password' : '(leave blank — not set yet)'}" style="margin-bottom:6px;" /></div>
    <div class="fg-row"><input id="cpBoardNew" type="password" class="fg-select" placeholder="New board password" /></div>
    <div class="fg-row"><button class="preset-btn" id="cpBoardSubmit">${boardPasswordHash ? 'Update board password' : 'Set board password'}</button></div>
    <div id="cpBoardMessage" class="section-sub"></div>
  </div>`);

  html += adminSection('export', 'Export data',
    `<div class="section-sub">Downloads a .csv file to your device — opens straight in Excel, Google Sheets, or Numbers.</div>`
    + `<div class="fg-controls">
    <div class="fg-row"><button class="preset-btn" id="exportMatchesBtn" style="width:100%;">Export all matches</button></div>
    <div class="fg-row"><button class="preset-btn" id="exportPlayersBtn" style="width:100%;">Export player stats</button></div>
    <div id="exportMessage" class="section-sub"></div>
  </div>`);

  html += buildStampHtml();

  box.innerHTML = html;
  wireBuildStamp();

  // The whole header row toggles. Re-rendering rather than toggling a class
  // keeps one source of truth for what is open, and the sections that build
  // their own DOM (the review, the player list) are rebuilt with it.
  box.querySelectorAll('[data-acc-toggle]').forEach(el=>{
    el.onclick = ()=>{
      const key = el.dataset.accToggle;
      adminOpenSections[key] = !adminOpenSections[key];
      renderManage();
      // Keep the section the finger is on in view: collapsing something above
      // it otherwise leaves the reader somewhere else entirely.
      const head = box.querySelector(`[data-acc-toggle="${key}"]`);
      if(head && adminOpenSections[key]) head.scrollIntoView({ block:'nearest' });
    };
  });

  wireReviewSection();
  wireHistoricalAdjustment();

  const today = new Date().toISOString().slice(0,10);

  function renderPrediction(){
    const resultBox = document.getElementById('predResult');
    if(!resultBox) return;
    const val = (id) => (document.getElementById(id) || {}).value || '';
    const teamA = [val('predA1').trim(), val('predA2').trim()].filter(Boolean);
    const teamB = [val('predB1').trim(), val('predB2').trim()].filter(Boolean);

    if(!teamA.length || !teamB.length){ resultBox.innerHTML = ''; predictionDraft = null; return; }

    const pred = predictMatchup(teamA, teamB);
    if(!pred.ok){
      predictionDraft = null;
      resultBox.innerHTML = `<div class="section-sub" style="color:var(--red);">${escapeHtml(pred.reason)}</div>`;
      return;
    }
    // Kept so "Add to Upcoming" carries these four players straight through
    // rather than asking the admin to name them a second time.
    predictionDraft = pred;
    resultBox.innerHTML = matchPredictionHtml(pred) + buildPredictionToUpcomingHtml(pred);
    wirePredictionToUpcoming(resultBox);
  }
  // Every wiring below has to tolerate its section being collapsed: the
  // markup for a closed accordion is not in the DOM at all. Before the
  // accordion every one of these elements always existed, so none of them
  // checked.
  const on = (id, fn) => { const el = document.getElementById(id); if(el) fn(el); };

  ['predA1','predA2','predB1','predB2'].forEach(id=>{
    on(id, (el)=> el.addEventListener('input', renderPrediction));
  });
  // The panel may have just been rebuilt around an existing draft -- after
  // adding the matchup to Upcoming, for instance. Draw what it already holds.
  if(predictionDraft) renderPrediction();

  on('npAdd', (btn)=>{ btn.onclick = async ()=>{
    const name = document.getElementById('npName').value.trim();
    const tier = document.getElementById('npTier').value;
    const msg = document.getElementById('npMessage');
    if(!name){ msg.textContent = 'Enter a name first.'; return; }
    if(PLAYERS.some(p=>p.name.toLowerCase()===name.toLowerCase())){
      msg.textContent = `${name} already exists.`; return;
    }
    tagOverridesState[name] = {...(tagOverridesState[name]||{}), tier, active:true};
    const ok = await saveTagOverrides(tagOverridesState);
    if(!ok){ msg.textContent = storageAvailable() ? `Save failed (${lastStorageError || 'unknown error'}) — try again.` : `Save failed — this page can't reach shared storage. Open the actual published/shared claude.ai link, not a downloaded file.`;; return; }
    msg.textContent = `${name} added to Tier ${tier}. They'll appear once they've played a game.`;
    document.getElementById('npName').value = '';
  }; });

  document.querySelectorAll('.vis-toggle').forEach(btn=>{
    btn.onclick = async ()=>{
      const key = btn.dataset.vis;
      visibilityState[key] = !(visibilityState[key] !== false);
      const ok = await saveVisibility(visibilityState);
      const msg = document.getElementById('visMessage');
      if(!ok){
        visibilityState[key] = !visibilityState[key]; // revert
        if(msg) msg.textContent = 'Save failed — try again.';
        return;
      }
      if(msg) msg.textContent = '';
      applyTabVisibility();
      renderManage();
    };
  });

  on('lockNowBtn', (btn)=>{ btn.onclick = async ()=>{
    isUnlocked = false;
    adminRole = null;
    await saveMyUnlocked(false);
    applyTabVisibility();
    renderManage();
  }; });

  on('cpOwnerSubmit', (btn)=>{ btn.onclick = async ()=>{
    const cur = document.getElementById('cpOwnerCurrent').value;
    const next = document.getElementById('cpOwnerNew').value;
    const msg = document.getElementById('cpOwnerMessage');
    if(ownerPasswordHash && simpleHash(cur) !== ownerPasswordHash){ msg.textContent = 'Current password is incorrect.'; return; }
    if(!next || next.length<4){ msg.textContent = 'New password needs at least 4 characters.'; return; }
    const ok = await savePasswordHash(STORAGE_KEY_ADMIN_PW_OWNER, simpleHash(next));
    if(!ok){ msg.textContent = storageAvailable() ? `Save failed (${lastStorageError || 'unknown error'}) — try again.` : `Save failed — this page can't reach shared storage. Open the actual published/shared claude.ai link, not a downloaded file.`; return; }
    ownerPasswordHash = simpleHash(next);
    msg.textContent = 'Your password has been updated.';
    document.getElementById('cpOwnerCurrent').value=''; document.getElementById('cpOwnerNew').value='';
  }; });

  on('cpBoardSubmit', (btn)=>{ btn.onclick = async ()=>{
    const cur = document.getElementById('cpBoardCurrent').value;
    const next = document.getElementById('cpBoardNew').value;
    const msg = document.getElementById('cpBoardMessage');
    if(boardPasswordHash && simpleHash(cur) !== boardPasswordHash){ msg.textContent = 'Current board password is incorrect.'; return; }
    if(!next || next.length<4){ msg.textContent = 'New password needs at least 4 characters.'; return; }
    const ok = await savePasswordHash(STORAGE_KEY_ADMIN_PW_BOARD, simpleHash(next));
    if(!ok){ msg.textContent = storageAvailable() ? `Save failed (${lastStorageError || 'unknown error'}) — try again.` : `Save failed — this page can't reach shared storage. Open the actual published/shared claude.ai link, not a downloaded file.`; return; }
    boardPasswordHash = simpleHash(next);
    msg.textContent = 'Board password has been updated.';
    document.getElementById('cpBoardCurrent').value=''; document.getElementById('cpBoardNew').value='';
  }; });

  on('exportMatchesBtn', (btn)=>{ btn.onclick = ()=>{
    try { exportMatchesCsv(); document.getElementById('exportMessage').textContent = 'Downloaded.'; }
    catch(e){ document.getElementById('exportMessage').textContent = 'Export failed: ' + (e.message||e); }
  }; });
  on('exportPlayersBtn', (btn)=>{ btn.onclick = ()=>{
    try { exportPlayersCsv(); document.getElementById('exportMessage').textContent = 'Downloaded.'; }
    catch(e){ document.getElementById('exportMessage').textContent = 'Export failed: ' + (e.message||e); }
  }; });

  // Only built when its section is open; everything else in Admin/Manage is
  // plain markup, but the player list builds its own DOM.
  if(document.getElementById('playerTagsList')) renderPlayerTagsList();
}

function csvEscape(val){
  const s = (val === null || val === undefined) ? '' : String(val);
  if(/[",\n]/.test(s)) return '"' + s.replace(/"/g,'""') + '"';
  return s;
}

function downloadCsv(filename, headers, rows){
  const lines = [headers.map(csvEscape).join(',')];
  rows.forEach(r => lines.push(r.map(csvEscape).join(',')));
  const csvContent = lines.join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(()=>URL.revokeObjectURL(url), 1000);
}

function exportMatchesCsv(){
  const headers = ['Date','Type','Team A','Team B','Score','Winner','Draw','Team A Rating Going In','Team B Rating Going In','Expected Performance Score (Team A)','Actual Performance Score (Team A)','Game Share % (Team A)','Performance vs Expectation (pts)','Verified','Status','Submitted By'];
  const displayMatches = getDisplayMatches();
  const rows = displayMatches.map(m=>{
    const enrichedIdx = m.isDraw ? -1 : idToIdxGlobalForExport(m.id);
    const enriched = enrichedIdx >= 0 ? MATCHES[enrichedIdx] : null;
    return [
      m.date, m.type || 'doubles',
      m.winners.join(' & '), m.losers.join(' & '),
      m.sets.map(s=>s.join('-')).join(', '),
      m.isDraw ? '' : m.winners.join(' & '),
      m.isDraw ? 'Yes' : 'No',
      enriched ? enriched.team_w_rating : '',
      enriched ? enriched.team_l_rating : '',
      enriched ? enriched.expected_score : '',
      enriched ? enriched.actual_score : '',
      enriched ? Math.round(enriched.game_share_winner*1000)/10 : '',
      enriched ? Math.round(enriched.performance_residual*1000)/10 : '',
      m.verified === false ? 'No (pre-June, single-sourced)' : 'Yes',
      m._status || 'approved',
      m.submittedBy || (m.id.startsWith('base_') ? 'Historical record' : ''),
    ];
  });
  downloadCsv(`money_padel_matches_${new Date().toISOString().slice(0,10)}.csv`, headers, rows);
}

function idToIdxGlobalForExport(id){
  for(let i=0;i<ALL_MATCHES.length;i++){ if(ALL_MATCHES[i].id === id) return i; }
  return -1;
}

function exportPlayersCsv(){
  const headers = ['Name','Tier','Active','Rating','Games','Wins','Losses','Win %','Avg Opponent','Clutch %','Upset Wins','Upset Losses','Recent Form % (last 10)','Recent Form W-L'];
  const rows = PLAYERS.map(p=>[
    p.name, p.tier, INACTIVE_PLAYERS.has(p.name) ? 'No' : 'Yes',
    Math.round(p.rating*10)/10, p.total, p.wins, p.losses,
    p.total ? Math.round(1000*p.wins/p.total)/10 : 0,
    Math.round(p.avg_match_strength), p.avg_overperf_pct,
    p.upset_wins, p.upset_losses,
    p.recent_form !== null && p.recent_form !== undefined ? p.recent_form : '',
    (p.recent_form_wins !== undefined) ? `${p.recent_form_wins}-${p.recent_form_losses}` : '',
  ]);
  downloadCsv(`money_padel_players_${new Date().toISOString().slice(0,10)}.csv`, headers, rows);
}

// Which player rows are expanded. Like the admin sections, this is not
// persisted -- the list is meant to read as a roster, and it should look the
// same every time it is opened.
let openPlayerTags = {};

// Rename state. Nothing here is persisted: a half-typed name should not
// survive a reload, and the confirmation should never be pre-armed.
let renameDraft = {};        // display name -> what is being typed

let renameConfirm = null;    // the plan awaiting a yes

let renameBusy = false;

let renameMessage = null;

let renameMessageFor = null; // the playerId the message belongs to

let renameOk = false;

// Element ids have to be usable in a selector, and a player name is free text.
function escapeAttrId(value){
  return String(value).replace(/[^A-Za-z0-9_-]/g, '_');
}

// Renaming writes ONE field on ONE document. It does not touch a match, a
// journey event, or any document id -- which is what makes it safe to do
// twice, or fifty times. See assets/js/playerNames.js.
async function commitRename(displayName){
  const player = PLAYERS.find(p => p.name === displayName);
  const docs = (V3_STATE && V3_STATE.rawPlayerDocs) || [];
  const plan = PlayerNames.planRename(renameDraft[displayName], {
    playerId: player ? player.playerId : displayName, docs,
  });
  renameMessageFor = player ? player.playerId : displayName;
  if(!plan.ok){
    renameOk = false; renameMessage = plan.reason; renameConfirm = null;
    renderPlayerTagsList();
    return;
  }
  if(!db){
    renameOk = false; renameMessage = 'No database connection.';
    renderPlayerTagsList();
    return;
  }
  renameBusy = true; renderPlayerTagsList();
  try {
    const stored = docs.find(d => d.id === plan.playerId);
    // set() with the whole document rather than a partial update, because the
    // compat backend offers set and the document is small -- and writing it
    // whole means the stored shape cannot be half-updated.
    await db.collection(RatingStore.COLLECTIONS.players).doc(plan.playerId)
      .set({ ...stored, ...plan.update });
    renameOk = true;
    renameMessage = `${plan.from} is now ${plan.to}. Nothing else changed.`;
    renameConfirm = null;
    delete renameDraft[displayName];
    // Re-read so every screen picks up the new label from the record rather
    // than from an assumption about what was just written.
    await loadV3State();
    dataChanged();
  } catch(e){
    renameOk = false;
    renameMessage = 'Could not rename: ' + (e && e.message ? e.message : String(e));
  } finally {
    renameBusy = false;
    renderPlayerTagsList();
  }
}

function renderPlayerTagsList(){
  const box = document.getElementById('playerTagsList');
  if(!box) return;
  const rows = [...PLAYERS].sort((a,b)=>a.name.localeCompare(b.name));
  box.innerHTML = rows.map(p=>{
    const startingTier = STARTING_TIER_MAP[p.name] || '';
    const open = !!openPlayerTags[p.name];
    // What the row says without being opened: what they are now, and where
    // they started if that differs. Enough to find the one you came for.
    const summary = `Tier ${p.tier}`
      + (startingTier && startingTier !== p.tier ? ` · started at ${startingTier}` : '');
    return `
    <div class="ptag-row${open ? ' is-open' : ''}" data-row="${p.name}">
      <button type="button" class="ptag-summary" data-ptag-toggle="${p.name}" aria-expanded="${open}">
        <span style="min-width:0;">
          <span class="ptag-name">${p.name}</span>
          <span class="ptag-meta">${summary}</span>
        </span>
        <span class="ptag-right">
          <span class="ptag-state${p.active ? ' is-active' : ''}">${p.active ? 'Active' : 'Inactive'}</span>
          <span class="ptag-chev" aria-hidden="true">▾</span>
        </span>
      </button>
      ${open ? `<div class="ptag-controls">
        <select class="fg-select ptag-tier" data-name="${p.name}" aria-label="Current tier for ${p.name}">
          ${['S','A','B','C'].map(t=>`<option value="${t}" ${t===p.tier?'selected':''}>Tier ${t}</option>`).join('')}
        </select>
        <button class="preset-btn ptag-active ${p.active?'active':''}" data-name="${p.name}">${p.active?'Active':'Inactive'}</button>
        <select class="fg-select ptag-starting" data-name="${p.name}" title="Only affects how their rating was seeded at their first match" aria-label="Starting tier for ${p.name}">
          <option value="" ${startingTier===''?'selected':''}>Started: same as now</option>
          ${['S','A','B','C'].map(t=>`<option value="${t}" ${t===startingTier?'selected':''}>Started at Tier ${t}</option>`).join('')}
        </select>
      </div>
      <div class="ptag-rename">
        <label class="fg-label" for="ptagRename-${escapeAttrId(p.name)}">Name</label>
        <input class="fg-select ptag-rename-input" id="ptagRename-${escapeAttrId(p.name)}"
          data-name="${escapeHtml(p.name)}" value="${escapeHtml(renameDraft[p.name] !== undefined ? renameDraft[p.name] : p.name)}"
          placeholder="${escapeHtml(p.name)}" />
        ${renameConfirm && renameConfirm.playerId === p.playerId
          ? `<div class="ptag-rename-confirm">
               <div>Rename <b>${escapeHtml(renameConfirm.from)}</b> to <b>${escapeHtml(renameConfirm.to)}</b>?</div>
               <div class="ptag-rename-note">Their record does not move. Every match, rating, tier change and statistic stays exactly where it is — only what they are called changes.</div>
               <div class="cc-meta-row">
                 <button class="preset-btn ptag-rename-go" data-name="${escapeHtml(p.name)}">${renameBusy ? 'Renaming…' : 'Rename'}</button>
                 <button class="preset-btn ptag-rename-cancel" data-name="${escapeHtml(p.name)}">Cancel</button>
               </div>
             </div>`
          : `<button class="preset-btn ptag-rename-ask" data-name="${escapeHtml(p.name)}">Rename…</button>`}
        ${renameMessage && renameMessageFor === p.playerId
          ? `<div class="ptag-rename-note${renameOk ? '' : ' is-bad'}">${escapeHtml(renameMessage)}</div>` : ''}
        ${p.previousDisplayNames && p.previousDisplayNames.length
          ? `<div class="ptag-rename-note">Previously ${p.previousDisplayNames.map(n=>escapeHtml(n)).join(', ')}.</div>` : ''}
      </div>` : ''}
    </div>
  `;}).join('');

  box.querySelectorAll('.ptag-rename-input').forEach(inp=>{
    inp.addEventListener('input', ()=>{ renameDraft[inp.dataset.name] = inp.value; });
  });
  box.querySelectorAll('.ptag-rename-ask').forEach(btn=>{
    btn.onclick = ()=>{
      const n = btn.dataset.name;
      const player = PLAYERS.find(p => p.name === n);
      const docs = (V3_STATE && V3_STATE.rawPlayerDocs) || [];
      const plan = PlayerNames.planRename(renameDraft[n] !== undefined ? renameDraft[n] : n, {
        playerId: player ? player.playerId : n, docs,
      });
      renameMessageFor = player ? player.playerId : n;
      // Everything is checked BEFORE the confirmation, so the confirmation
      // only ever asks about a rename that would actually work.
      if(!plan.ok){ renameOk = false; renameMessage = plan.reason; renameConfirm = null; }
      else { renameOk = true; renameMessage = null; renameConfirm = plan; }
      renderPlayerTagsList();
    };
  });
  box.querySelectorAll('.ptag-rename-cancel').forEach(btn=>{
    btn.onclick = ()=>{ renameConfirm = null; renameMessage = null; renderPlayerTagsList(); };
  });
  box.querySelectorAll('.ptag-rename-go').forEach(btn=>{
    btn.onclick = ()=>{ if(!renameBusy) commitRename(btn.dataset.name); };
  });

  box.querySelectorAll('[data-ptag-toggle]').forEach(el=>{
    el.onclick = ()=>{
      const n = el.dataset.ptagToggle;
      openPlayerTags[n] = !openPlayerTags[n];
      renderPlayerTagsList();
    };
  });

  box.querySelectorAll('.ptag-tier').forEach(sel=>{
    sel.addEventListener('change', async e=>{
      const name = e.target.dataset.name;
      tagOverridesState[name] = {...(tagOverridesState[name]||{}), tier: e.target.value};
      await saveTagOverrides(tagOverridesState);
      dataChanged({ redraw: renderPlayerTagsList });
    });
  });
  box.querySelectorAll('.ptag-starting').forEach(sel=>{
    sel.addEventListener('change', async e=>{
      const name = e.target.dataset.name;
      const val = e.target.value;
      const cur = {...(tagOverridesState[name]||{})};
      if(val) cur.startingTier = val; else delete cur.startingTier;
      tagOverridesState[name] = cur;
      await saveTagOverrides(tagOverridesState);
      dataChanged({ redraw: renderPlayerTagsList });
    });
  });
  box.querySelectorAll('.ptag-active').forEach(btn=>{
    btn.addEventListener('click', async e=>{
      const name = e.target.dataset.name;
      const cur = PLAYERS.find(p=>p.name===name);
      const newActive = !(cur ? cur.active : true);
      tagOverridesState[name] = {...(tagOverridesState[name]||{}), active: newActive};
      const ok = await saveTagOverrides(tagOverridesState);
      if(!ok) return;
      dataChanged({ redraw: renderPlayerTagsList });
    });
  });
}
