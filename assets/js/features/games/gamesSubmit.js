// ===================== GAMES: SUBMITTING A RESULT =====================
// Add a game: the WhatsApp quick paste, the set rows, new-player detection and
// the submission itself (pending until an admin approves it). A write path,
// so functional code; the form's markup is in gamesScreen.js.
//
// Extracted from app.js unchanged (docs/architecture/PARALLEL_DEVELOPMENT_SPLIT.md).
// Owning stream: functional. Loads before app.js; declarations only.

// ===================== MANAGE TAB =====================
let addGameSets = [{w:'', l:''}, {w:'', l:''}];

function parseQuickEntryText(text){
  const rawLines = text.split('\n').map(l=>l.trim()).filter(l=>l.length>0);
  if(rawLines.length < 3){
    return { error: 'Needs a winning team line, at least one set score, and a losing team line.' };
  }

  const scoreRe = /(\d+)\s*-\s*(\d+)/;
  const teamLines = [];
  const setLines = [];
  rawLines.forEach(line=>{
    if(!line.includes('&') && !/[a-zA-Z]{3,}/.test(line.replace(/🏆/g,'')) && scoreRe.test(line)){
      setLines.push(line);
    } else {
      teamLines.push(line);
    }
  });

  if(teamLines.length !== 2){
    return { error: `Expected exactly 2 team lines but found ${teamLines.length}. Make sure each set score is on its own line, like "6-4".` };
  }
  if(setLines.length === 0){
    return { error: 'No set scores found — each set should be on its own line, like "6-4".' };
  }

  const [line1, line2] = teamLines;
  const line1HasTrophy = line1.includes('🏆');
  const line2HasTrophy = line2.includes('🏆');
  if(line1HasTrophy && line2HasTrophy){
    return { error: 'Both teams have 🏆 — put it next to at most one team, or remove it from both if this was a draw.' };
  }
  const isDraw = !line1HasTrophy && !line2HasTrophy;

  const cleanTeam = (line) => line.replace(/🏆/g,'').trim().split('&').map(n=>n.trim()).filter(n=>n.length>0);
  const team1 = cleanTeam(line1);
  const team2 = cleanTeam(line2);

  if(team1.length !== team2.length || (team1.length!==1 && team1.length!==2)){
    return { error: 'Each team needs the same number of players — 1 for singles, 2 for doubles.' };
  }

  const sets = [];
  setLines.forEach(line=>{
    const m = line.match(scoreRe);
    if(m) sets.push([parseInt(m[1],10), parseInt(m[2],10)]);
  });
  if(sets.length === 0){
    return { error: 'Could not read any set scores.' };
  }

  if(isDraw){
    return { winners: team1, losers: team2, sets, isSingles: team1.length === 1, isDraw: true };
  }

  const winnerIsTeam1 = line1HasTrophy;
  const orientedSets = winnerIsTeam1 ? sets : sets.map(([a,b])=>[b,a]);
  return {
    winners: winnerIsTeam1 ? team1 : team2,
    losers: winnerIsTeam1 ? team2 : team1,
    sets: orientedSets,
    isSingles: team1.length === 1,
  };
}

function renderAddGameSets(){
  const box = document.getElementById('agSets');
  box.innerHTML = addGameSets.map((s,i)=>`
    <div style="display:flex; gap:8px; align-items:center; margin-bottom:6px;">
      <input type="number" min="0" max="30" value="${s.w}" data-idx="${i}" data-side="w" class="ag-set-input fg-select" style="width:70px;" placeholder="A" />
      <span style="color:var(--text-dim);">–</span>
      <input type="number" min="0" max="30" value="${s.l}" data-idx="${i}" data-side="l" class="ag-set-input fg-select" style="width:70px;" placeholder="B" />
      ${addGameSets.length>1 ? `<button class="preset-btn" data-remove="${i}" style="margin-left:auto;">Remove</button>` : ''}
    </div>
  `).join('');
  box.querySelectorAll('.ag-set-input').forEach(inp=>{
    inp.addEventListener('input', e=>{
      const idx = parseInt(e.target.dataset.idx), side = e.target.dataset.side;
      addGameSets[idx][side] = e.target.value;
    });
  });
  box.querySelectorAll('[data-remove]').forEach(btn=>{
    btn.onclick = ()=>{ addGameSets.splice(parseInt(btn.dataset.remove),1); renderAddGameSets(); };
  });
}

function checkForNewPlayers(){
  const names = ['agA1','agA2','agB1','agB2'].map(id=>document.getElementById(id).value.trim()).filter(n=>n);
  const known = new Set(PLAYERS.map(p=>p.name.toLowerCase()));
  const newNames = names.filter(n=>!known.has(n.toLowerCase()));
  const row = document.getElementById('agNewPlayerRow');
  const box = document.getElementById('agNewPlayerTiers');
  if(newNames.length===0){ row.style.display='none'; box.innerHTML=''; return; }
  row.style.display = 'block';
  box.innerHTML = newNames.map(n=>`
    <div style="display:flex; align-items:center; gap:8px; margin-bottom:6px;">
      <span style="font-size:13px; flex:1;">${n}</span>
      <select class="fg-select ag-new-tier" data-name="${n}" style="width:120px;">
        <option value="S">Tier S</option><option value="A">Tier A</option>
        <option value="B" selected>Tier B</option><option value="C">Tier C</option>
      </select>
    </div>
  `).join('');
}

async function submitNewGame(){
  const msg = document.getElementById('agMessage');
  const submitter = submissionIdentity();
  if(!submitter){
    msg.textContent = 'Choose who you are first — every submission is recorded against someone.';
    return;
  }
  // Kept in step so a device that has chosen a player also has the typed
  // fallback populated, and so nothing downstream that still reads
  // currentUserName sees a different person from the one on screen.
  if(currentUserName !== submitter){ currentUserName = submitter; await saveMyName(submitter); }

  const date = document.getElementById('agDate').value;
  const isSingles = document.querySelector('#agTypeToggle .fg-toggle-btn.active').dataset.type === 'singles';
  const isDraw = document.querySelector('#agOutcomeToggle .fg-toggle-btn.active').dataset.outcome === 'draw';
  const a1 = document.getElementById('agA1').value.trim();
  const a2 = document.getElementById('agA2').value.trim();
  const b1 = document.getElementById('agB1').value.trim();
  const b2 = document.getElementById('agB2').value.trim();

  if(!date || !a1 || !b1 || (!isSingles && (!a2 || !b2))){
    msg.textContent = 'Fill in the date and all player names.'; return;
  }
  const winners = isSingles ? [a1] : [a1,a2];
  const losers = isSingles ? [b1] : [b1,b2];
  if(new Set([...winners,...losers].map(n=>n.toLowerCase())).size !== winners.length+losers.length){
    msg.textContent = 'The same name appears twice — check your entries.'; return;
  }

  const sets = [];
  for(const s of addGameSets){
    const w = parseInt(s.w), l = parseInt(s.l);
    if(isNaN(w) || isNaN(l)) continue;
    sets.push([w,l]);
  }
  if(sets.length===0){ msg.textContent = 'Enter at least one set score.'; return; }
  if(!isDraw){
    const setsWon = sets.filter(s=>s[0]>s[1]).length, setsLost = sets.filter(s=>s[1]>s[0]).length;
    if(setsWon < setsLost){
      msg.textContent = 'Team A\'s scores should be the winning side — swap the teams, check your set scores, or mark this as not finished / a draw.'; return;
    }
  }

  // register any new players with chosen tiers
  document.querySelectorAll('.ag-new-tier').forEach(sel=>{
    const name = sel.dataset.name;
    tagOverridesState[name] = {...(tagOverridesState[name]||{}), tier: sel.value, active:true};
  });
  if(document.querySelectorAll('.ag-new-tier').length>0){
    await saveTagOverrides(tagOverridesState);
  }

  const id = 'sub_' + Date.now() + '_' + Math.random().toString(36).slice(2,8);
  const newMatch = {id, date, winners, losers, sets, type: isSingles?'singles':'doubles', note:'', isDraw,
                     status:'pending', submittedBy: submitter, submittedAt: new Date().toISOString()};
  // Submitted from an Upcoming card: the player has SAID which fixture this
  // was. That is a proposal, not a link -- an admin confirms it when
  // approving, and the fixture stays in Upcoming until then (D3).
  if(linkedRequestId) newMatch.fixtureId = linkedRequestId;
  extraMatchesState.push(newMatch);
  const ok = await saveExtraMatches(extraMatchesState);
  if(!ok){ msg.textContent = storageAvailable() ? `Save failed (${lastStorageError || 'unknown error'}) — try again.` : `Save failed — this page can't reach shared storage. Open the actual published/shared claude.ai link, not a downloaded file.`;; extraMatchesState.pop(); return; }

  let linkedNote = '';
  if(linkedRequestId){
    linkedNote = ' The game stays listed until an admin confirms this was it.';
    linkedRequestId = null;
  }

  const confirmation = isDraw
    ? `Submitted as a draw. ${winners.join(' & ')} vs ${losers.join(' & ')} — waiting for approval, won't affect any rating.${linkedNote}`
    : `Submitted. ${winners.join(' & ')} def ${losers.join(' & ')} — waiting for approval in the Games tab.${linkedNote}`;

  // The form is part of the Games screen, so redrawing that screen empties it
  // -- which is what the six lines of by-hand field clearing here used to be
  // for. The set rows are module state and have to be reset BEFORE the redraw
  // rather than after it, or the screen is rebuilt around the old ones.
  addGameSets = [{w:'',l:''},{w:'',l:''}];
  dataChanged();
  // Into the freshly drawn screen, not the one that has just been replaced.
  const freshMsg = document.getElementById('agMessage');
  if(freshMsg) freshMsg.textContent = confirmation;
}
