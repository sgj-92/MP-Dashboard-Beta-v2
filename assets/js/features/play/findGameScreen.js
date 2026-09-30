// ===================== PLAY: FIND A GAME AND CHALLENGE SCREENS =====================
// Play › Find Game: the match brief, Build a Match, the best / alternative /
// see-all cards and the hand-off to Request a game; and the Challenge cards
// and form on Requests. Presentation and wiring; the engine and the
// challenge rules are in findGameData.js.
// Owning stream: redesign. Loads before app.js; declarations only.
//
// Extracted from app.js unchanged (docs/architecture/PARALLEL_DEVELOPMENT_SPLIT.md).

let fgPlayer = null;

// True once the user has deliberately picked someone other than the
// app-wide selected player to find a game on their behalf -- while true,
// a global player switch (viewerchanged) leaves fgPlayer alone rather than
// stomping that deliberate choice. Cleared again the moment they pick the
// viewer's own name back, which is what lets a global switch resume
// syncing -- see syncFindGamePlayerToViewer below.
let fgPlayerIsOverride = false;

let fgScope = 'tier';

let fgDiff = 'easy';

// Build a Match -- optional constraints layered on top of the same engine.
// '' means "Anyone" (no constraint), matching the select's placeholder option.
let fgPlayWith = '';

let fgPlayAgainst = '';

let fgBuildMatchOpen = false;

// Populated fresh on every call (player/constraint selections change what's
// valid to offer in the *other* two selects) -- cheap, ~40 players.
function populateBuildMatchSelects(){
  const withSel = document.getElementById('fgPlayWithSelect');
  const againstSel = document.getElementById('fgPlayAgainstSelect');
  if(!withSel || !againstSel) return;
  const names = [...PLAYERS].map(p=>p.name).sort((a,b)=>a.localeCompare(b));

  // Validation: the selected player can't appear in either list, and Play
  // With / Play Against can't offer each other's current value -- never
  // silently drop a constraint, just don't let an impossible one be picked.
  const withOptions = names.filter(n=>n!==fgPlayer && n!==fgPlayAgainst);
  const againstOptions = names.filter(n=>n!==fgPlayer && n!==fgPlayWith);
  if(fgPlayWith && !withOptions.includes(fgPlayWith)) fgPlayWith = '';
  if(fgPlayAgainst && !againstOptions.includes(fgPlayAgainst)) fgPlayAgainst = '';

  withSel.innerHTML = `<option value="">Anyone</option>` + withOptions.map(n=>`<option value="${n}" ${n===fgPlayWith?'selected':''}>${n}</option>`).join('');
  againstSel.innerHTML = `<option value="">Anyone</option>` + againstOptions.map(n=>`<option value="${n}" ${n===fgPlayAgainst?'selected':''}>${n}</option>`).join('');
}

function initFindGame(){
  const sel = document.getElementById('fgPlayerSelect');
  if(sel.options.length === 0){
    const sorted = [...PLAYERS].sort((a,b)=>a.name.localeCompare(b.name));
    sorted.forEach(p=>{
      const opt = document.createElement('option');
      opt.value = p.name;
      opt.textContent = `${p.name} (Tier ${p.tier})`;
      sel.appendChild(opt);
    });
    // Initialise from the app-wide selected player (the same identity Home
    // and Player Profile use) rather than an arbitrary default -- falls
    // back to the alphabetically-first player only if nobody's selected one.
    const viewer = getCurrentViewer();
    fgPlayer = (viewer && PLAYERS.find(p=>p.name===viewer.name)) ? viewer.name : sorted[0].name;
    sel.addEventListener('change', e=>{
      fgPlayer = e.target.value;
      const v = getCurrentViewer();
      // Picking the viewer's own name back "resets" -- future global player
      // switches resume syncing here again.
      fgPlayerIsOverride = !v || fgPlayer !== v.name;
      populateBuildMatchSelects(); renderFindGameResults();
    });

    document.getElementById('buildMatchToggle').onclick = ()=>{
      fgBuildMatchOpen = !fgBuildMatchOpen;
      const panel = document.getElementById('buildMatchPanel');
      panel.hidden = !fgBuildMatchOpen;
      document.getElementById('buildMatchToggle').textContent = fgBuildMatchOpen ? 'Build a Match ‹' : 'Build a Match ›';
    };
    document.getElementById('fgPlayWithSelect').addEventListener('change', e=>{ fgPlayWith = e.target.value; populateBuildMatchSelects(); renderFindGameResults(); });
    document.getElementById('fgPlayAgainstSelect').addEventListener('change', e=>{ fgPlayAgainst = e.target.value; populateBuildMatchSelects(); renderFindGameResults(); });
  }
  // Always reflects current fgPlayer, however it was last set (deliberate
  // pick, or a sync from a global player switch that happened while this
  // tab wasn't even open) -- see syncFindGamePlayerToViewer.
  sel.value = fgPlayer;
  populateBuildMatchSelects();
  document.querySelectorAll('#fgScopeToggle .fg-toggle-btn').forEach(b=>{
    b.onclick = ()=>{ fgScope = b.dataset.scope; document.querySelectorAll('#fgScopeToggle .fg-toggle-btn').forEach(x=>x.classList.remove('active')); b.classList.add('active'); renderFindGameResults(); };
  });
  document.querySelectorAll('#fgDiffToggle .fg-toggle-btn').forEach(b=>{
    b.onclick = ()=>{ fgDiff = b.dataset.diff; document.querySelectorAll('#fgDiffToggle .fg-toggle-btn').forEach(x=>x.classList.remove('active')); b.classList.add('active'); renderFindGameResults(); };
  });
}

// Keeps Find Game's Player field aligned with the app-wide selected player
// on a global switch (Home's player picker), unless the user has
// deliberately chosen someone else here to find a game on their behalf
// (fgPlayerIsOverride -- cleared again if they pick the viewer's own name
// back). Safe to call even when Find Game isn't the active tab/isn't
// mounted yet; initFindGame() re-applies fgPlayer to the select next time
// it actually renders.
function syncFindGamePlayerToViewer(){
  if(fgPlayerIsOverride) return;
  const viewer = getCurrentViewer();
  if(!viewer || !PLAYERS.find(p=>p.name===viewer.name) || fgPlayer === viewer.name) return;
  fgPlayer = viewer.name;
  const sel = document.getElementById('fgPlayerSelect');
  if(sel && sel.options.length){ sel.value = fgPlayer; populateBuildMatchSelects(); }
  if(activeTab === 'findgame') renderFindGameResults();
}

function pmInitials(name){
  return name.split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2);
}

function renderMatchTeams(m){
  return `<div class="pm-teams">
    <div class="pm-team pm-team-a">
      <div class="pm-team-player"><span class="pm-avatar">${pmInitials(m.player.name)}</span><span class="pm-name">${m.player.name}</span></div>
      <div class="pm-team-player"><span class="pm-avatar">${pmInitials(m.partner.name)}</span><span class="pm-name">${m.partner.name}</span></div>
    </div>
    <div class="pm-vs">VS</div>
    <div class="pm-team pm-team-b">
      <div class="pm-team-player"><span class="pm-avatar">${pmInitials(m.opponents[0].name)}</span><span class="pm-name">${m.opponents[0].name}</span></div>
      <div class="pm-team-player"><span class="pm-avatar">${pmInitials(m.opponents[1].name)}</span><span class="pm-name">${m.opponents[1].name}</span></div>
    </div>
  </div>`;
}

function renderBestMatchCard(m, label){
  const tierNote = m.tiers[0]===m.tiers[1] ? `Tier ${m.tiers[0]}` : `Tier ${m.tiers[0]} &amp; Tier ${m.tiers[1]}`;
  const partnershipLine = m.partnership
    ? `${m.player.name} &amp; ${m.partner.name}: ${m.partnership.games} games together, ${m.partnership.wins}-${m.partnership.losses} (${m.partnership.winpct}%)`
    : `${m.player.name} and ${m.partner.name} haven't built up a partnership record together yet.`;
  return `<div class="pm-best mp-card-prestige">
    <div class="pm-best-label">${label || 'Best Match'}</div>
    ${canSeePredictions() ? `<div class="pm-best-pct">${m.pctFor}% – ${m.pctAgainst}%</div>
    <div class="pm-best-balance">${m.balanceDesc}</div>` : ''}
    ${renderMatchTeams(m)}
    <div class="pm-why">${canSeePredictions() ? m.whyLine : m.whyLinePublic}</div>
    <div class="pm-actions">
      <button class="mp-btn-primary" id="pmRequestBtn">Request Game ›</button>
      <button class="mp-btn-secondary" id="pmDetailBtn">View Full Breakdown</button>
    </div>
    <div class="pm-detail" id="pmDetail" hidden>
      <div class="pm-detail-line"><b>${m.player.name} &amp; ${m.partner.name}</b> — avg rating ${m.teamRating}</div>
      <div class="pm-detail-line"><b>${m.opponents[0].name} &amp; ${m.opponents[1].name}</b> (${tierNote}) — avg rating ${m.oppRating}</div>
      <div class="pm-detail-line">${partnershipLine}</div>
      <div class="pm-detail-line">You've played ${m.opponents[0].name} ${m.playedOpp[0]}x and ${m.opponents[1].name} ${m.playedOpp[1]}x.</div>
    </div>
  </div>`;
}

function renderAltCard(alt, idx){
  const m = alt.match;
  return `<div class="pm-alt-card">
    <div class="pm-alt-tag">${alt.tag}</div>
    <div class="pm-alt-tagline">${alt.tagline}</div>
    <div class="pm-alt-teams">
      <span><b>${m.player.name} &amp; ${m.partner.name}</b></span>
      <span class="pm-alt-vs">vs</span>
      <span><b>${m.opponents[0].name} &amp; ${m.opponents[1].name}</b></span>
    </div>
    ${canSeePredictions() ? `<div class="pm-alt-pct">${m.pctFor}% – ${m.pctAgainst}% · ${m.balanceDesc.toLowerCase()}</div>` : ''}
    <button class="pm-alt-cta-btn" data-alt-idx="${idx}">Request this instead ›</button>
  </div>`;
}

function renderSeeAllSection(matches){
  const rows = matches.map(m=>`<div class="pm-all-row">
      <span><b>${m.player.name} &amp; ${m.partner.name}</b> vs <b>${m.opponents[0].name} &amp; ${m.opponents[1].name}</b></span>
      ${canSeePredictions() ? `<span class="pm-all-pct">${m.pctFor}%–${m.pctAgainst}%</span>` : ''}
    </div>`).join('');
  return `<button class="pm-seeall-btn" id="pmSeeAllBtn">See all recommendations ›</button>
    <div class="pm-all-list" id="pmAllList" hidden>${rows}</div>`;
}

// Navigates to the Requests tab (legacy "wishlist") and pre-fills the four
// players from a recommendation card. Reuses the existing request form and
// its existing submit/validation logic entirely untouched -- this only fills
// fields, the user still reviews and taps "Request this game" themselves,
// same as every other cross-tab prefill in this app (see
// navigateToGamesTabForResult above).
function navigateToWishlistForMatch(m){
  const names = [m.player.name, m.partner.name, m.opponents[0].name, m.opponents[1].name];
  const wishlistTabBtn = document.querySelector('#tabrow .tab-btn[data-tab="wishlist"]');
  if(wishlistTabBtn) wishlistTabBtn.click();
  const p1 = document.getElementById('reqP1');
  if(p1){
    p1.value = names[0];
    document.getElementById('reqP2').value = names[1];
    document.getElementById('reqP3').value = names[2];
    document.getElementById('reqP4').value = names[3];
    const anchor = document.getElementById('reqSubmit');
    if(anchor){ try { anchor.scrollIntoView({ behavior: 'smooth', block: 'center' }); } catch(e){ /* non-critical */ } }
  }
}

// Never a generic "no results" when a Build a Match constraint is active --
// names the specific constraint so the user knows it was honored, not
// silently dropped, per the impossible-combination requirement.
function buildConstraintEmptyMessage(scope, playWith, playAgainst){
  const scopeNote = scope==='tier' ? 'within your tier' : 'across any tier';
  if(playWith && playAgainst) return `No valid match ${scopeNote} with ${playWith} as your partner and ${playAgainst} on the other side — try "Any tier" or a different pairing.`;
  if(playAgainst) return `No opponent pairing ${scopeNote} has ${playAgainst} on the other side — try "Any tier".`;
  if(playWith) return `No opponent pairing ${scopeNote} works with ${playWith} as your partner — try "Any tier".`;
  return `Not enough other players in this scope to suggest a full match — try "Any tier".`;
}

function renderFindGameResults(){
  const player = PLAYERS.find(p=>p.name===fgPlayer);
  if(!player) return;
  const box = document.getElementById('fgResults');
  const recs = buildFindGameRecommendations(player, fgScope, fgDiff, fgPlayWith, fgPlayAgainst);

  if(!recs){
    box.innerHTML = `<div class="section-sub" style="margin-top:6px;">${buildConstraintEmptyMessage(fgScope, fgPlayWith, fgPlayAgainst)}</div>`;
    return;
  }

  const constrained = fgPlayWith || fgPlayAgainst;
  let html = renderBestMatchCard(recs.best, constrained ? 'Your Match' : 'Best Match');
  if(recs.alternatives.length){
    html += `<div class="pm-alt-heading">Alternatives</div>`;
    recs.alternatives.forEach((alt,i)=>{ html += renderAltCard(alt, i); });
  }
  html += renderSeeAllSection(recs.all);
  box.innerHTML = html;

  document.getElementById('pmRequestBtn').onclick = ()=> navigateToWishlistForMatch(recs.best);

  const detailBtn = document.getElementById('pmDetailBtn');
  const detailBox = document.getElementById('pmDetail');
  detailBtn.onclick = ()=>{
    const willShow = detailBox.hidden;
    detailBox.hidden = !willShow;
    detailBtn.textContent = willShow ? 'Hide Breakdown' : 'View Full Breakdown';
  };

  box.querySelectorAll('.pm-alt-cta-btn').forEach(btn=>{
    btn.onclick = ()=>{
      const idx = parseInt(btn.dataset.altIdx, 10);
      navigateToWishlistForMatch(recs.alternatives[idx].match);
    };
  });

  const seeAllBtn = document.getElementById('pmSeeAllBtn');
  const allList = document.getElementById('pmAllList');
  seeAllBtn.onclick = ()=>{
    const willShow = allList.hidden;
    allList.hidden = !willShow;
    seeAllBtn.textContent = willShow ? 'Hide full list ‹' : 'See all recommendations ›';
  };
}

function renderFindGame(){
  initFindGame();
  renderFindGameResults();
}

function challengeRestrictionLabel(r){ return r==='any' ? 'Any player' : `Tier ${r}`; }

// Mid-sentence form -- "Tier B" keeps its capital, "any player" doesn't
// stay capitalized just because it happens to start the standalone label.
function challengeRestrictionLabelInline(r){ return r==='any' ? 'any player' : `Tier ${r}`; }

let chlCreateOpen = false;

function renderChallengeCreateForm(){
  const names = allPlayerNames();
  const nameOptions = (selected) => `<option value="">Choose player</option>` + names.map(n=>`<option value="${n}" ${n===selected?'selected':''}>${n}</option>`).join('');
  const restrictionOptions = CHALLENGE_RESTRICTIONS.map(r=>`<option value="${r}">${challengeRestrictionLabel(r)}</option>`).join('');
  // Challenger defaults to the app-wide selected player -- same identity
  // Find Game and Home use -- since that's who's most likely creating this.
  const viewer = getCurrentViewer();
  const defaultChallenger = (viewer && names.includes(viewer.name)) ? viewer.name : '';
  return `<div class="chl-create-card">
    <div class="chl-create-title">Create Challenge</div>
    <div class="fg-row"><label class="fg-label">Challenger</label><select id="chlChallenger" class="fg-select">${nameOptions(defaultChallenger)}</select></div>
    <div class="fg-row"><label class="fg-label">Challenging</label><select id="chlChallenged" class="fg-select">${nameOptions('')}</select></div>
    <div class="fg-row"><label class="fg-label">Who picks first</label>
      <div class="fg-toggle" id="chlFirstPickerToggle">
        <button class="fg-toggle-btn active" data-picker="challenger">Challenger</button>
        <button class="fg-toggle-btn" data-picker="challenged">Challenged</button>
      </div>
    </div>
    <div class="chl-picker-row fg-row">
      <div><label class="fg-label">First pick restriction</label><select id="chlFirstRestriction" class="fg-select">${restrictionOptions}</select></div>
      <div><label class="fg-label">Second pick restriction</label><select id="chlSecondRestriction" class="fg-select">${restrictionOptions}</select></div>
    </div>
    <div id="chlCreateMessage" class="section-sub"></div>
    <div class="fg-row"><button class="mp-btn-primary" id="chlCreateSubmit" style="width:100%;">Send Challenge</button></div>
  </div>`;
}

function renderChallengeCard(ch, viewer){
  const viewerName = viewer ? viewer.name : null;
  const firstAnchor = challengeFirstAnchor(ch);
  const secondAnchor = challengeSecondAnchor(ch);

  if(ch.state === 'declined' || ch.state === 'cancelled'){
    const label = ch.state === 'declined' ? 'Declined' : 'Cancelled';
    return `<div class="chl-card chl-muted">
      <div class="chl-tag">Challenge</div>
      <div class="chl-matchup-line">${ch.challenger} vs ${ch.challenged}</div>
      <div class="chl-status-row"><span class="chl-status-badge chl-${ch.state}">${label}</span></div>
    </div>`;
  }

  if(ch.state === 'waiting_first_pick' || ch.state === 'waiting_second_pick'){
    const isFirst = ch.state === 'waiting_first_pick';
    const activePicker = isFirst ? firstAnchor : secondAnchor;
    const restriction = isFirst ? ch.firstRestriction : ch.secondRestriction;
    const isViewersTurn = viewerName === activePicker;
    const canDecline = viewerName === ch.challenged;
    const canCancel = viewerName === ch.createdBy;

    const priorPickLine = !isFirst
      ? `<div class="chl-restriction-line">${firstAnchor} chose <b style="color:var(--text);">${ch.firstPartner}</b>.</div>` : '';

    // The challenged player can decline any time before the match is ready
    // -- regardless of whose turn it is, including their own -- so this is
    // built once and dropped into whichever actions row actually renders.
    const cancelBtn = canCancel ? `<button class="mp-btn-secondary chl-cancel-btn" data-challenge-id="${ch.id}">Cancel Challenge</button>` : '';
    const declineBtn = canDecline ? `<button class="mp-btn-secondary chl-decline-btn" data-challenge-id="${ch.id}">Decline</button>` : '';

    let pickPanel = '';
    if(isViewersTurn){
      const pool = challengeCandidatePool(ch, restriction, isFirst ? [] : [ch.firstPartner]).sort((a,b)=>a.name.localeCompare(b.name));
      if(pool.length === 0){
        pickPanel = `<div class="chl-pick-panel">
          <div class="chl-pick-empty">No eligible ${challengeRestrictionLabelInline(restriction)} left to pick — this challenge can't be completed as set up.</div>
          ${(cancelBtn || declineBtn) ? `<div class="chl-actions">${cancelBtn}${declineBtn}</div>` : ''}
        </div>`;
      } else {
        pickPanel = `<div class="chl-pick-panel">
          <select class="fg-select chl-partner-select" id="chlPartnerSelect-${ch.id}">${pool.map(p=>`<option value="${p.name}">${p.name} (Tier ${p.tier})</option>`).join('')}</select>
          <div class="chl-actions">
            <button class="mp-btn-primary chl-choose-btn" data-challenge-id="${ch.id}">Choose Partner</button>
            ${cancelBtn}${declineBtn}
          </div>
        </div>`;
      }
    } else if(cancelBtn || declineBtn){
      pickPanel = `<div class="chl-actions">${cancelBtn}${declineBtn}</div>`;
    }

    const badge = isViewersTurn
      ? `<span class="chl-status-badge chl-your-turn">Your turn</span>`
      : `<span class="chl-status-badge">Waiting for ${activePicker}</span>`;

    return `<div class="chl-card">
      <div class="chl-tag">Challenge</div>
      <div class="chl-matchup-line">${ch.challenger} vs ${ch.challenged}</div>
      <div class="chl-restriction-line">${activePicker} picks ${isFirst?'first':'second'} — partner must be ${challengeRestrictionLabelInline(restriction)}.</div>
      ${priorPickLine}
      <div class="chl-status-row">${badge}</div>
      ${pickPanel}
    </div>`;
  }

  // 'ready' (mid-bridge / bridge failed) or 'confirmed' -- show the finished
  // match with the same card language as Build a Match, plus the real
  // confirmation state of the request it was bridged into.
  const mv = challengeToMatchView(ch);
  if(!mv){
    return `<div class="chl-card"><div class="chl-tag">Challenge</div><div class="chl-matchup-line">${ch.challenger} vs ${ch.challenged}</div><div class="chl-restriction-line">Match ready, but a chosen player is no longer available to display.</div></div>`;
  }
  const linkedReq = ch.linkedRequestId ? gameRequestsState.find(r=>r.id===ch.linkedRequestId) : null;
  return `<div class="chl-card">
    <div class="chl-tag">Challenge · Match ready</div>
    ${renderMatchTeams(mv)}
    ${canSeePredictions() ? `<div class="pm-best-pct" style="margin-top:8px;">${mv.pctFor}% – ${mv.pctAgainst}%</div>
    <div class="pm-best-balance">${mv.balanceDesc}</div>` : ''}
    ${linkedReq
      ? fmtRequestConfirmations(linkedReq)
      : `<div class="chl-restriction-line chl-ready">Couldn't finalize this into a request.</div><div class="chl-actions"><button class="mp-btn-primary chl-retry-bridge-btn" data-challenge-id="${ch.id}">Retry</button></div>`}
  </div>`;
}

// Higher = more relevant to this viewer: their own turn first, then any
// challenge they're actually part of, then everything else -- so the
// global player context decides what surfaces first here too, not just
// who can act on a given card.
function challengeRelevanceScore(ch, viewer){
  if(!viewer) return 0;
  const name = viewer.name;
  const isYourTurn = (ch.state==='waiting_first_pick' && challengeFirstAnchor(ch)===name)
    || (ch.state==='waiting_second_pick' && challengeSecondAnchor(ch)===name);
  if(isYourTurn) return 2;
  if(ch.challenger===name || ch.challenged===name) return 1;
  return 0;
}

function renderChallengesSection(){
  const viewer = getCurrentViewer();
  const active = challengesState.filter(c => c.state!=='confirmed').slice().sort((a,b)=>
    challengeRelevanceScore(b, viewer) - challengeRelevanceScore(a, viewer) || (a.createdAt < b.createdAt ? 1 : -1));

  // The heading is the fold above this (see renderWishlist); repeating it here
  // would give the section two.
  let html = `<div class="section-sub">Call someone out — one side picks a partner first, then the other responds.</div>`;
  html += chlCreateOpen ? renderChallengeCreateForm() : `<button class="chl-create-toggle" id="chlOpenCreate">+ Create Challenge</button>`;

  if(active.length === 0){
    html += `<div class="section-sub">No open challenges right now.</div>`;
  } else {
    active.forEach(ch=>{ html += renderChallengeCard(ch, viewer); });
  }
  return html;
}

// Wires everything renderChallengesSection() just put into `box` -- called
// from renderWishlist() right after it sets box.innerHTML, alongside that
// function's own wiring for the legacy request form.
function wireChallengeControls(box, flashMessage, adminFlashMessage){
  const openBtn = document.getElementById('chlOpenCreate');
  if(openBtn) openBtn.onclick = ()=>{ chlCreateOpen = true; renderWishlist(flashMessage, adminFlashMessage); };

  const firstPickerToggle = document.getElementById('chlFirstPickerToggle');
  if(firstPickerToggle){
    firstPickerToggle.querySelectorAll('.fg-toggle-btn').forEach(b=>{
      b.onclick = ()=>{ firstPickerToggle.querySelectorAll('.fg-toggle-btn').forEach(x=>x.classList.remove('active')); b.classList.add('active'); };
    });
  }

  const chlSubmit = document.getElementById('chlCreateSubmit');
  if(chlSubmit){
    chlSubmit.onclick = async ()=>{
      const msg = document.getElementById('chlCreateMessage');
      const challenger = document.getElementById('chlChallenger').value;
      const challenged = document.getElementById('chlChallenged').value;
      if(!challenger || !challenged){ msg.textContent = 'Choose both players.'; return; }
      if(challenger === challenged){ msg.textContent = 'Challenger and challenged must be different players.'; return; }
      const firstPickerBtn = document.querySelector('#chlFirstPickerToggle .fg-toggle-btn.active');
      const firstPicker = firstPickerBtn ? firstPickerBtn.dataset.picker : 'challenger';
      const firstRestriction = document.getElementById('chlFirstRestriction').value;
      const secondRestriction = document.getElementById('chlSecondRestriction').value;
      // createdBy is compared against getCurrentViewer() (see canCancel below),
      // so it must be recorded from that same identity source -- currentUserName
      // is a separate, free-text field (the legacy request form's "Requested
      // by") and comparing one against the other would silently break Cancel.
      const viewerNow = getCurrentViewer();
      const createdBy = (viewerNow ? viewerNow.name : currentUserName) || challenger;
      const ch = createChallenge(challenger, challenged, firstPicker, firstRestriction, secondRestriction, createdBy);
      challengesState.push(ch);
      const ok = await saveChallenges(challengesState);
      if(!ok){
        challengesState.pop();
        msg.textContent = storageAvailable() ? `Save failed (${lastStorageError || 'unknown error'}) — try again.` : `Save failed — this page can't reach shared storage.`;
        return;
      }
      chlCreateOpen = false;
      renderWishlist('Challenge sent!');
    };
  }

  box.querySelectorAll('.chl-choose-btn').forEach(btn=>{
    btn.onclick = async ()=>{
      const ch = challengesState.find(c=>c.id===btn.dataset.challengeId);
      if(!ch) return;
      const sel = document.getElementById('chlPartnerSelect-'+ch.id);
      const partnerName = sel ? sel.value : '';
      if(!partnerName) return;
      if(ch.state === 'waiting_first_pick') await makeFirstPick(ch, partnerName);
      else await makeSecondPick(ch, partnerName);
      renderWishlist(flashMessage, adminFlashMessage);
    };
  });
  box.querySelectorAll('.chl-decline-btn').forEach(btn=>{
    btn.onclick = async ()=>{
      const ch = challengesState.find(c=>c.id===btn.dataset.challengeId);
      if(!ch) return;
      await declineChallenge(ch);
      renderWishlist(flashMessage, adminFlashMessage);
    };
  });
  box.querySelectorAll('.chl-cancel-btn').forEach(btn=>{
    btn.onclick = async ()=>{
      const ch = challengesState.find(c=>c.id===btn.dataset.challengeId);
      if(!ch) return;
      await cancelChallenge(ch);
      renderWishlist(flashMessage, adminFlashMessage);
    };
  });
  box.querySelectorAll('.chl-retry-bridge-btn').forEach(btn=>{
    btn.onclick = async ()=>{
      const ch = challengesState.find(c=>c.id===btn.dataset.challengeId);
      if(!ch) return;
      await bridgeChallengeToRequest(ch);
      renderWishlist(flashMessage, adminFlashMessage);
    };
  });
}
