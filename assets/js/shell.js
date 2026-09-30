// ==========================================================================
// PRESTIGE V1 — SHELL (Phase 1)
// This file adds the new Home/Rankings/Play/Players/More navigation on top
// of the existing app, WITHOUT renaming or altering any legacy tab identity.
// Legacy tab values (summary, power, findgame, players, wl, callouts, h2h,
// games, wishlist, upcoming, manage) are untouched -- this is a mapping layer
// only, per the agreed Phase 1 contract. Load this file after app.js.
// ==========================================================================

// SINGLE-TAB sections (no subnav): Home only.
const SECTION_TAB_MAP = { home: 'summary' };

// MULTI-TAB sections: a visible segmented subnav under the header, per the IA
// correction. First entry in each list is that section's default landing tab.
const SECTION_SUBNAV = {
  rankings: [
    { tab: 'power', label: 'Power', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M6 20v-6"/><path d="M12 20V8"/><path d="M18 20v-10"/><path d="M4 20h16"/></svg>' },
    { tab: 'wl', label: 'W/L', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="8.5"/><path d="M12 3.5V12l6 3.2"/></svg>' },
    { tab: 'summary', label: 'League', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4.5" width="16" height="15" rx="1.5"/><path d="M4 9h16"/><path d="M8 4.5v-1.5"/><path d="M16 4.5v-1.5"/></svg>' },
  ],
  play: [
    { tab: 'findgame', label: 'Find Game' },
    { tab: 'games', label: 'Games' },
    { tab: 'upcoming', label: 'Upcoming' },
    { tab: 'wishlist', label: 'Requests' },
  ],
  players: [
    { tab: 'players', label: 'Directory' },
    { tab: 'h2h', label: 'Compare' },
  ],
};

const TAB_TO_SECTION = { summary: 'home' };
Object.keys(SECTION_SUBNAV).forEach(sec=>{
  SECTION_SUBNAV[sec].forEach(item=>{ TAB_TO_SECTION[item.tab] = sec; });
});

// More is now genuinely secondary only -- everything with a real home above
// (Games, Upcoming, Requests, Compare/H2H, Win/Loss) has been moved out.
const MORE_ITEMS = [
  { special: 'ratingguide', label: 'Power Rating Guide' },
  { special: 'northsouth', label: 'North vs South' },
  { tab: 'callouts', label: 'Insights / Call-Outs' },
  { special: 'about', label: 'About Power Rankings' },
  { special: 'doughnuts', label: 'Doughnuts' },
  { special: 'datarange', label: 'Data & Rankings' },
];
const MORE_ADMIN_ITEM = { tab: 'manage', label: 'Admin / Manage' };

let activeSection = 'rankings'; // matches legacy default activeTab === 'power'

function legacyTabBtn(tab){
  return document.querySelector(`#tabrow .tab-btn[data-tab="${tab}"]`);
}

function goToSection(section){
  if(section === 'more'){
    openMoreSheet();
    return; // don't change activeSection until a specific destination is chosen
  }
  const singleTab = SECTION_TAB_MAP[section];
  const subnav = SECTION_SUBNAV[section];
  // default to the first subnav item this reader may see
  const firstVisible = subnav && subnav.find(it => canSeeTab(it.tab));
  const targetTab = singleTab || (firstVisible ? firstVisible.tab : (subnav && subnav[0].tab));
  if(targetTab){
    const btn = legacyTabBtn(targetTab);
    if(btn) btn.click(); // reuses 100% of existing tab-switch logic untouched
  }
  activeSection = section;
  updateBottomNavHighlight();
  renderSectionSubnav();
  syncPlayHeadingVisibility();
  // Tapping Home always resets to the dashboard view, even if "View Full
  // Review" was open -- an implicit "back to Home" path.
  if(section === 'home'){
    arriveAtHome();
    const backBtn = document.getElementById('homeBackFromReview');
    if(backBtn) backBtn.style.display = 'none';
    const summaryEl = document.getElementById('summaryView');
    if(summaryEl) summaryEl.style.display = 'none';
    renderHomeDashboard();
    // The dashboard element is created lazily by the first render(); Home can
    // be entered before that (deep link, scripted navigation), so build it on
    // demand rather than dereferencing null.
    const dash = document.getElementById('homeDashboard') || buildHomeDashboard();
    if(dash) dash.style.display = 'block';
  } else {
    // #homeDashboard is a new element app.js's own tab-visibility system has
    // no knowledge of, so it must be hidden explicitly here -- otherwise,
    // once Home has been visited once in a session, its content (hero,
    // Your Game card) stays visible underneath every other section
    // indefinitely, since nothing else in the app would ever hide it again.
    const dash = document.getElementById('homeDashboard');
    if(dash) dash.style.display = 'none';
  }
  updateHeaderForSection();
}

// Play heading shows for the whole Play section (any of its four sub-tabs),
// never for other sections -- kept in its own function so both the primary
// nav path (goToSection) and internal legacy navigation (the #tabrow
// listener below) stay in sync with whichever is actually active.
function syncPlayHeadingVisibility(){
  const el = document.getElementById('playHeading');
  if(el) el.style.display = (activeSection === 'play') ? 'block' : 'none';
}

// The header's right-side slot becomes the player switcher on Home
// ("Shaun ▾"), reusing the same selector the first-launch flow and My
// Player entry already use -- reverts to the plain section label elsewhere.
function updateHeaderForSection(){
  const titleEl = document.getElementById('shellSectionTitle');
  if(!titleEl) return;
  if(activeSection === 'home'){
    const viewer = getCurrentViewer();
    titleEl.innerHTML = `<button id="homeViewerSwitch" class="home-viewer-switch">${viewer ? viewer.name : 'Choose player'} ▾</button>`;
    document.getElementById('homeViewerSwitch').onclick = ()=> buildViewerSelector();
  } else {
    const sectionLabels = { rankings:'Rankings', play:'Play', players:'Players', more:'More' };
    titleEl.innerHTML = sectionLabels[activeSection] || '';
  }
}

function updateBottomNavHighlight(){
  document.querySelectorAll('.shell-nav-item').forEach(el=>{
    el.classList.toggle('active', el.dataset.section === activeSection);
  });
}

// The header's small section label is redundant once a screen has its own
// editorial hero (Rankings does) -- hidden there, kept as a quiet wayfinding
// cue on screens that don't have one yet (Play/Players, still legacy views).
function syncHeaderSectionTitle(){
  const titleEl = document.getElementById('shellSectionTitle');
  if(!titleEl) return;
  titleEl.style.display = (activeTab === 'power') ? 'none' : '';
}

// Renders (or hides) the visible segmented subnav for the current section.
// Not a menu -- always on-screen for sections that have one, per the "must
// be discoverable, not hidden behind another tap" requirement.
function renderSectionSubnav(){
  const container = document.getElementById('sectionSubnav');
  // Only the screens this reader may see (canSeeTab, app.js).
  const items = (SECTION_SUBNAV[activeSection] || []).filter(it => canSeeTab(it.tab));
  if(!items.length){ container.style.display = 'none'; container.innerHTML = ''; return; }
  container.style.display = 'grid';
  // minmax(0, 1fr), not plain 1fr -- a grid track's implicit min-width is
  // "auto" (its content's own minimum size) just like a flex item, so a
  // long label (e.g. "Monthly Summary") would force its whole track wider
  // than its equal share and overflow the page instead of actually
  // shrinking to let the span-level ellipsis do its job.
  container.style.gridTemplateColumns = `repeat(${items.length}, minmax(0, 1fr))`;
  container.innerHTML = items.map(it=>
    `<button class="section-subnav-item ${it.tab===activeTab?'active':''}" data-tab="${it.tab}">${it.icon||''}<span>${it.label}</span></button>`
  ).join('');
  container.querySelectorAll('.section-subnav-item').forEach(btn=>{
    btn.onclick = ()=>{ const b = legacyTabBtn(btn.dataset.tab); if(b) b.click(); };
  });
}

// Unlocking, locking or changing a visibility setting redraws the shell's own
// navigation from the same rule, and moves a reader off a screen they may no
// longer see.
function onVisibilityChanged(){
  if(typeof renderSectionSubnav === 'function' && document.getElementById('sectionSubnav')) renderSectionSubnav();
  if(typeof activeTab !== 'undefined' && !canSeeTab(activeTab)){
    const fb = legacyTabBtn(visibleFallbackTab(activeTab));
    if(fb) fb.click();
  }
}

function openMoreSheet(){
  // More lists only what this reader may open.
  document.querySelectorAll('#shellMoreSheet .shell-more-item[data-tab]').forEach(btn=>{
    const tab = btn.dataset.tab;
    if(tab && tab !== 'manage') btn.style.display = canSeeTab(tab) ? '' : 'none';
  });
  document.getElementById('shellMoreSheet').classList.add('show');
}
function closeMoreSheet(){
  document.getElementById('shellMoreSheet').classList.remove('show');
}

function buildShellDom(){
  // Header
  const header = document.createElement('div');
  header.className = 'shell-header';
  header.innerHTML = `
    <div class="brand-mark"><img src="assets/brand/mp-mark.svg" alt="" onerror="this.replaceWith(Object.assign(document.createElement('div'),{className:'nav-icon-fallback',textContent:'MP'}))"></div>
    <div class="brand-wordmark">Money <b>Padel</b></div>
    <div class="shell-section-title" id="shellSectionTitle">Rankings</div>
  `;
  document.body.insertBefore(header, document.body.firstChild);

  // Visible section subnav mount point, right under the header.
  const subnav = document.createElement('div');
  subnav.id = 'sectionSubnav';
  subnav.className = 'section-subnav';
  subnav.style.display = 'none';
  header.parentNode.insertBefore(subnav, header.nextSibling);

  // Play heading -- deliberately compact and non-personalised, distinct from
  // Home's editorial hero. No photographic artwork; a restrained geometric
  // court-line motif gives Play its own visual signature for now.
  const playHeading = document.createElement('div');
  playHeading.id = 'playHeading';
  playHeading.className = 'play-heading';
  playHeading.style.display = 'none';
  playHeading.innerHTML = `
    <svg class="play-heading-motif" viewBox="0 0 100 40" preserveAspectRatio="none"><line x1="0" y1="20" x2="100" y2="20"/><line x1="50" y1="0" x2="50" y2="40"/><rect x="2" y="8" width="96" height="24" rx="2"/></svg>
    <div class="mp-section-label">Money Padel</div>
    <div class="mp-display-title" style="font-size:24px; margin-top:2px;">Play</div>
    <div class="play-heading-sub">Find the right game. Get it booked. Get on court.</div>
  `;
  subnav.parentNode.insertBefore(playHeading, subnav.nextSibling);

  // Bottom nav
  const nav = document.createElement('div');
  nav.className = 'shell-bottom-nav';
  const navItems = [
    { section: 'home', label: 'Home', icon: 'home' },
    { section: 'rankings', label: 'Rankings', icon: 'rankings' },
    { section: 'play', label: 'Play', icon: 'play' },
    { section: 'players', label: 'Players', icon: 'players' },
    { section: 'more', label: 'More', icon: 'more' },
  ];
  nav.innerHTML = navItems.map(it => `
    <button class="shell-nav-item" data-section="${it.section}">
      <span class="nav-icon-mount" data-icon="${it.icon}" data-fallback="${it.label[0]}"></span>
      <span>${it.label}</span>
    </button>
  `).join('');
  document.body.appendChild(nav);
  nav.querySelectorAll('.shell-nav-item').forEach(btn=>{
    btn.onclick = ()=> goToSection(btn.dataset.section);
  });

  // Icons are fetched and embedded as real inline <svg> elements, not
  // <img src="*.svg">. This matters: currentColor inside an externally
  // referenced SVG resolves within that SVG's own isolated document, not the
  // parent page's CSS -- so an <img>-based icon can never pick up the active
  // gold colour no matter what CSS is written. Inlining fixes this for the
  // current placeholders and will keep working unchanged once ChatGPT's
  // final icons land at the same file paths.
  nav.querySelectorAll('.nav-icon-mount').forEach(mount=>{
    const iconName = mount.dataset.icon;
    if(typeof fetch !== 'function'){
      mount.replaceWith(Object.assign(document.createElement('div'), { className: 'nav-icon-fallback', textContent: mount.dataset.fallback }));
      return;
    }
    fetch(`assets/icons/${iconName}.svg`)
      .then(r => { if(!r.ok) throw new Error('not found'); return r.text(); })
      .then(svgText => { mount.innerHTML = svgText; })
      .catch(()=>{
        mount.replaceWith(Object.assign(document.createElement('div'), { className: 'nav-icon-fallback', textContent: mount.dataset.fallback }));
      });
  });

  // More sheet
  const sheet = document.createElement('div');
  sheet.className = 'shell-more-sheet';
  sheet.id = 'shellMoreSheet';
  sheet.innerHTML = `<div class="shell-more-panel">
    <h3>More</h3>
    ${MORE_ITEMS.map(it => `<button class="shell-more-item" data-tab="${it.tab||''}" data-special="${it.special||''}">${it.label}<span class="chev">›</span></button>`).join('')}
    <button class="shell-more-item admin-item" data-tab="${MORE_ADMIN_ITEM.tab}">${MORE_ADMIN_ITEM.label}<span class="chev">›</span></button>
  </div>`;
  document.body.appendChild(sheet);
  sheet.addEventListener('click', (e)=>{ if(e.target === sheet) closeMoreSheet(); });
  sheet.querySelectorAll('.shell-more-item').forEach(btn=>{
    btn.onclick = ()=>{
      if(btn.dataset.special === 'ratingguide'){
        closeMoreSheet();
        openPowerRatingGuide();
        return;
      }
      if(btn.dataset.special === 'northsouth'){
        closeMoreSheet();
        openNorthSouth();
        return;
      }
      if(btn.dataset.special === 'about'){
        closeMoreSheet();
        openAboutPowerRankings();
        return;
      }
      if(btn.dataset.special === 'doughnuts'){
        closeMoreSheet();
        openDoughnutLeaderboard();
        return;
      }
      if(btn.dataset.special === 'datarange'){
        closeMoreSheet();
        openDataRangeSheet();
        return;
      }
      const b = legacyTabBtn(btn.dataset.tab);
      if(b) b.click(); // the #tabrow capture listener already updates activeSection/subnav correctly
      closeMoreSheet();
    };
  });

  // "About Power Rankings" -- reuses the exact methodology text already
  // written for the Rankings "How this works" disclosure (copied once as a
  // static string here, since it's a fixed piece of UI copy, not business
  // logic -- reading the live #explainer element wouldn't be safe, since its
  // content changes to whichever tab was last active).
  const ABOUT_POWER_RANKINGS_TEXT = 'Ratings start from the tier each player is already known to sit in (S highest, C lowest) — the tiers are treated as real signal, not something the model has to rediscover from scratch. From there, results move you based on <b>games won within each match</b>, not just who won — a close 3-set loss barely costs anything, a 6-1 6-2 loss costs a lot. A player with few games stays close to their tier baseline since there isn\'t much evidence yet to move them; a player with a long track record can drift further from it. "Avg opp." is the average strength of everyone you\'ve played with and against. "Clutch %" compares your actual scorelines to what your tier and opponents would predict. "Upset wins/losses" count matches where the underdog won outright (or the favorite lost outright) by a meaningful ratings gap — a fast way to spot giant-killers and upset-prone favorites. Use the min-games filter below to hide anyone with too few games for these numbers to mean much. "Recent Form" sorts by wins over the last 10 games first, then by average overperformance as a tiebreaker — a faster-moving signal than the overall rating, useful for spotting who\'s trending right now.';
  function openAboutPowerRankings(){
    let modal = document.getElementById('aboutModal');
    if(!modal){
      modal = document.createElement('div');
      modal.className = 'shell-more-sheet';
      modal.id = 'aboutModal';
      modal.innerHTML = `<div class="shell-more-panel">
        <h3>About Power Rankings</h3>
        <div id="aboutModalBody" class="section-sub" style="font-size:12.5px; line-height:1.6;">${ABOUT_POWER_RANKINGS_TEXT}</div>
      </div>`;
      document.body.appendChild(modal);
      modal.addEventListener('click', (e)=>{ if(e.target === modal) modal.classList.remove('show'); });
    }
    modal.classList.add('show');
  }

  // All-time leaderboard of shutout sets given and received -- rebuilt fresh
  // each time it's opened, since (unlike the static About text) this data
  // changes as new matches are added.
  let doughnutSortMode = 'total'; // 'total' | 'given' | 'received'
  // By Player or the Doughnut List -- two views of one month's doughnuts. The
  // month is shared, so switching view never changes the period.
  let doughnutView = 'player';    // 'player' | 'list'
  // The same month rule as Rankings and League: a reader's choice is kept;
  // otherwise the Meaningful Month, pinned when the sheet is opened.
  let doughnutMonth = null, doughnutMonthChoice = null, doughnutMonthDefault = null;
  function arriveAtDoughnuts(){
    if(doughnutMonthChoice !== null && (doughnutMonthChoice === 'all' || getAvailableMonths().includes(doughnutMonthChoice))){
      doughnutMonth = doughnutMonthChoice;
      return;
    }
    doughnutMonthChoice = null;
    doughnutMonthDefault = meaningfulMonthNow();
    doughnutMonth = doughnutMonthDefault.month;
  }
  function chooseDoughnutMonth(m){ doughnutMonthChoice = m; doughnutMonth = m; renderDoughnutBody(); }

  // "28 Sep" -- the list's date, the club's short form.
  function doughnutDay(iso){
    const [y, mo, d] = String(iso).split('-').map(Number);
    return `${d} ${['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][mo - 1]}`;
  }

  // One doughnut as a result: winners on the left (the card convention),
  // the score between the sides with the shutout set picked out, and a draw
  // said as a draw. Tapping it opens the game where every result opens: its
  // card in Play › Games.
  function doughnutListRowHtml(m){
    const team = (names) => names.map(n => escapeHtml(n)).join(' &amp; ');
    const score = m.sets.map(([x,y])=> m.shutoutSets.includes(`${x}-${y}`)
      ? `<b class="doughnut-set">${x}–${y}</b>` : `${x}–${y}`).join(', ');
    return `<button type="button" class="doughnut-result" data-match-id="${escapeHtml(m.id)}">
      <span class="doughnut-result-date">${doughnutDay(m.date)}</span>
      <span class="doughnut-result-line">${m.isDraw ? team(m.winners) : `<b>${team(m.winners)}</b>`} <span class="doughnut-result-score">${score}</span> ${team(m.losers)}${m.isDraw ? ' <span class="doughnut-result-draw">· Drawn</span>' : ''}</span>
      <span class="doughnut-chev">›</span>
    </button>`;
  }

  // A doughnut can be handed out in a match nobody won: the list deliberately
  // includes draws (see computeDoughnutStats), and six of them are in the
  // record. Written as "def" regardless, this told a player they had lost a
  // game the record says they drew -- which is why the outcome is now asked of
  // MatchOutcome rather than read off which side a name happens to sit on.
  function formatDoughnutMatch(m){
    const scoreStr = m.sets.map(([x,y])=> m.shutoutSets.includes(`${x}-${y}`) ? `<b>${x}-${y}</b>` : `${x}-${y}`).join(', ');
    return `<div class="doughnut-game-row">
      <span class="section-sub" style="font-size:10.5px;">${dayLabel ? dayLabel(m.date) : m.date}</span>
      <span class="doughnut-game-teams">${MatchOutcome.describe(m)}</span>
      <span class="doughnut-game-score">${scoreStr}</span>
    </div>`;
  }

  function renderDoughnutBody(){
    if(!doughnutMonth) arriveAtDoughnuts();
    const month = doughnutMonth;
    const body = document.getElementById('doughnutModalBody');
    const months = getAvailableMonths();
    // Month and view first, always: an empty month still offers the way out.
    const controls = `
      <div class="fg-controls lg-controls doughnut-controls">
        <div class="fg-row"><label class="fg-label" for="doughnutMonthSelect">Month</label>
          <select id="doughnutMonthSelect" class="fg-select">
            <option value="all"${month === 'all' ? ' selected' : ''}>All time</option>
            ${months.map(m => `<option value="${m}"${m === month ? ' selected' : ''}>${monthLabel(m)}</option>`).join('')}
          </select>
        </div>
      </div>
      ${meaningfulMonthNoteHtml(doughnutMonthDefault, month, 'doughnutMonth')}
      <div class="fg-toggle doughnut-view-toggle" style="margin:8px 0 12px;">
        <button class="fg-toggle-btn ${doughnutView === 'player' ? 'active' : ''}" id="doughnutViewPlayer" aria-pressed="${doughnutView === 'player'}">By Player</button>
        <button class="fg-toggle-btn ${doughnutView === 'list' ? 'active' : ''}" id="doughnutViewList" aria-pressed="${doughnutView === 'list'}">Doughnut List</button>
      </div>`;
    const wireControls = ()=>{
      const sel = document.getElementById('doughnutMonthSelect');
      if(sel) sel.onchange = (e)=> chooseDoughnutMonth(e.target.value);
      wireMeaningfulMonthNote('doughnutMonth', chooseDoughnutMonth);
      document.getElementById('doughnutViewPlayer').onclick = ()=>{ doughnutView = 'player'; renderDoughnutBody(); };
      document.getElementById('doughnutViewList').onclick = ()=>{ doughnutView = 'list'; renderDoughnutBody(); };
    };
    const empty = `<div class="doughnut-empty">${month === 'all' ? 'No doughnuts yet.' : `No doughnuts in ${monthLabel(month)}.`} 🍩</div>`;

    if(doughnutView === 'list'){
      const list = doughnutMatches(month);
      body.innerHTML = controls + (list.length
        ? `<div class="doughnut-list-count section-sub">${list.length} doughnut${list.length === 1 ? '' : 's'} · newest first</div>
           <div class="doughnut-list">${list.map(doughnutListRowHtml).join('')}</div>`
        : empty);
      wireControls();
      body.querySelectorAll('.doughnut-result').forEach(btn=>{
        btn.onclick = ()=>{
          document.getElementById('doughnutModal').classList.remove('show');
          openMatchInGames(btn.dataset.matchId);
        };
      });
      return;
    }

    const stats = computeDoughnutStats(month);
    const sorted = stats.slice().sort((a,b)=> b[doughnutSortMode] - a[doughnutSortMode]);
    if(sorted.length === 0){
      body.innerHTML = controls + empty;
      wireControls();
      return;
    }
    body.innerHTML = controls + `
      <div class="doughnut-sort-row">
        <button class="doughnut-sort-btn ${doughnutSortMode==='total'?'active':''}" data-sort="total">Total</button>
        <button class="doughnut-sort-btn ${doughnutSortMode==='given'?'active':''}" data-sort="given">Most Given</button>
        <button class="doughnut-sort-btn ${doughnutSortMode==='received'?'active':''}" data-sort="received">Most Received</button>
      </div>
      <div class="doughnut-header-row"><span>Player</span><span>Given</span><span>Received</span></div>
    ` + sorted.map(r => `
      <div class="doughnut-row-wrap">
        <div class="doughnut-row" data-name="${r.name}">
          <span class="doughnut-name">${r.name} <span class="doughnut-chev">›</span></span>
          <span class="doughnut-given">${r.given}</span>
          <span class="doughnut-received">${r.received}</span>
        </div>
        <div class="doughnut-detail" id="doughnutDetail-${r.name.replace(/\s+/g,'_')}" style="display:none;">
          ${r.given > 0 ? `<div class="section-sub" style="font-size:10px; margin-top:8px;">GIVEN (${r.given})</div>` + r.givenMatches.map(formatDoughnutMatch).join('') : ''}
          ${r.received > 0 ? `<div class="section-sub" style="font-size:10px; margin-top:8px;">RECEIVED (${r.received})</div>` + r.receivedMatches.map(formatDoughnutMatch).join('') : ''}
        </div>
      </div>
    `).join('');

    wireControls();
    body.querySelectorAll('.doughnut-sort-btn').forEach(btn=>{
      btn.onclick = ()=>{ doughnutSortMode = btn.dataset.sort; renderDoughnutBody(); };
    });
    body.querySelectorAll('.doughnut-row').forEach(row=>{
      row.onclick = ()=>{
        const detail = document.getElementById(`doughnutDetail-${row.dataset.name.replace(/\s+/g,'_')}`);
        const open = detail.style.display !== 'none';
        detail.style.display = open ? 'none' : 'block';
        row.querySelector('.doughnut-chev').textContent = open ? '›' : '⌄';
      };
    });
  }

  function openDoughnutLeaderboard(){
    let modal = document.getElementById('doughnutModal');
    if(!modal){
      modal = document.createElement('div');
      modal.className = 'shell-more-sheet';
      modal.id = 'doughnutModal';
      modal.innerHTML = `<div class="shell-more-panel">
        <h3>Doughnuts</h3>
        <div class="section-sub" style="font-size:11.5px; margin-bottom:12px;">Every 6-0 (or similar shutout set) -- given and received. By Player totals them; the Doughnut List shows each one. Tap a player or a result to see the games.</div>
        <div id="doughnutModalBody"></div>
      </div>`;
      document.body.appendChild(modal);
      modal.addEventListener('click', (e)=>{ if(e.target === modal) modal.classList.remove('show'); });
    }
    // Arriving: the reader's month if they chose one, else the Meaningful Month.
    arriveAtDoughnuts();
    renderDoughnutBody();
    modal.classList.add('show');
  }

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

  // Keep bottom-nav highlight (and section subnav) in sync no matter how the
  // legacy tab changes (new nav, subnav, More sheet, or internal app.js
  // navigation like "Edit this game").
  document.getElementById('tabrow').addEventListener('click', (e)=>{
    const btn = e.target.closest('.tab-btn');
    if(!btn) return;
    const tab = btn.dataset.tab;
    activeSection = TAB_TO_SECTION[tab] || 'more';
    updateBottomNavHighlight();
    const titleEl = document.getElementById('shellSectionTitle');
    if(titleEl){
      const sectionLabels = { home:'Home', rankings:'Rankings', play:'Play', players:'Players', more:'More' };
      titleEl.textContent = sectionLabels[activeSection] || '';
    }
  }, true);

  // Separate, non-capturing listener: fires AFTER the legacy tab handler has
  // already run and updated activeTab/rendered its view, so both the podium
  // check and the subnav highlight (which reads the now-current activeTab)
  // are accurate -- this is what actually removes a stale podium when
  // navigating to a tab with its own render function (Players, Games, etc.)
  // rather than the shared render() the podium hook is attached to, and what
  // correctly highlights the just-clicked subnav item rather than the
  // previous one.
  document.getElementById('tabrow').addEventListener('click', (e)=>{
    if(!e.target.closest('.tab-btn')) return;
    renderRankingsPodium();
    renderKingsOfTiersPanel();
    renderSectionSubnav();
  });
}

// ---- Data & Rankings: the app-wide Data Range setting ---------------------
// Deliberately a setting, not a filter: it lives in More, it persists, and it
// is the only place in the app where the dataset can be changed. The two
// options map onto dataRange in app.js ('verified' | 'all'), which is applied
// in exactly one place (getAllApprovedMatches) so every screen agrees.
const DATA_RANGE_OPTIONS = [
  { value: 'verified', label: 'Verified data', sub: 'June 2026 onwards', tag: 'Recommended' },
  { value: 'all', label: 'Full history', sub: 'Includes matches before June 2026', tag: '' },
];

function openDataRangeSheet(){
  let modal = document.getElementById('dataRangeModal');
  if(!modal){
    modal = document.createElement('div');
    modal.className = 'shell-more-sheet';
    modal.id = 'dataRangeModal';
    document.body.appendChild(modal);
    modal.addEventListener('click', (e)=>{ if(e.target === modal) modal.classList.remove('show'); });
  }
  renderDataRangeSheet(modal);
  modal.classList.add('show');
}

function renderDataRangeSheet(modal){
  const rows = DATA_RANGE_OPTIONS.map(opt => `
    <button class="dr-option ${dataRange === opt.value ? 'selected' : ''}" data-range="${opt.value}">
      <span class="dr-radio" aria-hidden="true"></span>
      <span class="dr-option-text">
        <span class="dr-option-label">${opt.label}</span>
        <span class="dr-option-sub">${opt.sub}${opt.tag ? ` · <b>${opt.tag}</b>` : ''}</span>
      </span>
    </button>
  `).join('');

  modal.innerHTML = `<div class="shell-more-panel">
    <h3>Data &amp; Rankings</h3>
    <div class="mp-section-label" style="margin-bottom:8px;">Data range</div>
    <div class="dr-options">${rows}</div>
    <div class="section-sub" style="margin-top:14px;">Applies everywhere — rankings, ratings, records, form and every other statistic in the app.</div>
  </div>`;

  modal.querySelectorAll('.dr-option').forEach(btn=>{
    btn.onclick = ()=>{
      const value = btn.dataset.range;
      if(value === dataRange) return;
      // Only the step into the less-reliable dataset needs explaining, and
      // only the first time -- going back to Verified never warns.
      if(value === 'all' && !hasAcknowledgedFullHistory()){
        openFullHistoryConfirm(modal);
        return;
      }
      applyDataRangeChange(value);
      renderDataRangeSheet(modal);
    };
  });
}

function openFullHistoryConfirm(parentModal){
  let modal = document.getElementById('fullHistoryConfirmModal');
  if(!modal){
    modal = document.createElement('div');
    modal.className = 'shell-more-sheet';
    modal.id = 'fullHistoryConfirmModal';
    document.body.appendChild(modal);
    modal.addEventListener('click', (e)=>{ if(e.target === modal) modal.classList.remove('show'); });
  }
  modal.innerHTML = `<div class="shell-more-panel">
    <h3>Include historical data?</h3>
    <div class="section-sub" style="font-size:12.5px;">Matches recorded before June 2026 may contain incomplete or less reliable information. Rankings and statistics may therefore differ from the verified-data view.</div>
    <div class="dr-confirm-actions">
      <button class="mp-btn-secondary" id="drConfirmCancel">Cancel</button>
      <button class="mp-btn-primary" id="drConfirmUse">Use Full History</button>
    </div>
  </div>`;
  modal.querySelector('#drConfirmCancel').onclick = ()=> modal.classList.remove('show');
  modal.querySelector('#drConfirmUse').onclick = ()=>{
    acknowledgeFullHistory();
    applyDataRangeChange('all');
    modal.classList.remove('show');
    if(parentModal) renderDataRangeSheet(parentModal);
  };
  modal.classList.add('show');
}

// Subtle, permanent cue that the less-reliable dataset is in play. Shown only
// in Full History, never in the recommended view, and taps straight through
// to the setting that controls it -- so it explains itself rather than just
// warning.
function syncFullHistoryIndicator(){
  const header = document.querySelector('.shell-header');
  if(!header) return;
  let pill = document.getElementById('fullHistoryIndicator');
  if(dataRange !== 'all'){
    if(pill) pill.remove();
    return;
  }
  if(!pill){
    pill = document.createElement('button');
    pill.id = 'fullHistoryIndicator';
    pill.className = 'full-history-pill';
    pill.textContent = 'Full History';
    pill.title = 'Viewing full history, including pre-June 2026 matches';
    pill.onclick = ()=> openDataRangeSheet();
    // Before the section title, which holds the right edge via margin-left:auto,
    // so the pill reads as a badge on the brand rather than crowding the title.
    const title = document.getElementById('shellSectionTitle');
    header.insertBefore(pill, title || null);
  }
}

// ---- Power Rating Guide ---------------------------------------------------
// The player-facing explanation of how and why a Power Rating moves.
//
// It exists because the most common reaction to a small movement is that the
// system is broken, and the honest answer -- K falls as evidence builds -- is
// not something anybody should have to infer from a chart. So the guide leads
// with the idea and keeps the arithmetic one tap away, rather than opening on
// a formula.
//
// Every number quoted here is the shipped model, read from the engine's own
// constants where one exists rather than copied into prose that could drift.
// The anchor sentence is Shaun's, verbatim.
const RATING_GUIDE_ANCHOR =
  'The rating is not designed to reward wins. It is designed to update our estimate of playing level.';

function ratingGuideConstants(){
  // Read from the engine, never transcribed. Copy in prose drifts; a constant
  // read at render time cannot describe a model the app is not running.
  const E = (typeof RatingEngine !== 'undefined') ? RatingEngine : null;
  if(!E) return null;
  return {
    kMax: E.KMAX, kMin: E.KMIN, rc: E.RC,
    gameWeight: E.GAME_SHARE_WEIGHT, resultWeight: E.MATCH_RESULT_WEIGHT,
    version: E.RATING_MODEL_VERSION,
  };
}

function buildRatingGuideHtml(){
  const c = ratingGuideConstants();
  // No silent fallback: a guide that described a model the app could not
  // confirm would be worse than no guide.
  if(!c) return `<div class="rg-section" style="color:var(--red);">The rating engine is not loaded, so this guide cannot state the model it is describing. Reload the page.</div>`;
  const kSpan = c.kMax - c.kMin;

  const q = (question, answer) => `<details class="rg-faq">
    <summary class="rg-faq-q">${question}</summary>
    <div class="rg-faq-a">${answer}</div>
  </details>`;

  const concept = (name, what) =>
    `<div class="rg-concept"><span class="rg-concept-name">${name}</span><span class="rg-concept-what">${what}</span></div>`;

  return `
  <div class="rg-anchor">${RATING_GUIDE_ANCHOR}</div>

  <div class="rg-section">
    <div class="rg-h">In short</div>
    <ul class="rg-list">
      <li>Your <b>Power Rating</b> is an estimate of the level you are playing at now. It is not a total of wins and it is not a prize.</li>
      <li>Every rated match compares <b>what was expected of you</b> beforehand with <b>how you actually played</b>, and nudges the estimate toward the truth.</li>
      <li>Winning does not guarantee a rise, and losing does not guarantee a fall. Beating a much stronger pair narrowly can be worth more than brushing aside a much weaker one.</li>
      <li>A favourite who plays roughly as expected moves <b>very little</b> — nothing new was learned.</li>
      <li>An underdog who plays materially better than expected can <b>gain rating in a loss</b>.</li>
      <li>New players, and anyone the club has just reassessed, move <b>faster</b>: there is less evidence behind their number, so each result says more.</li>
      <li>Well-established players move <b>slowly</b>, on purpose. That is the system working, not the system stuck.</li>
      <li>There is <b>one continuous Power Rating</b>. Monthly screens show where it stood at a month's end — nothing is reset, re-solved or started again.</li>
      <li>A <b>club reassessment</b> is a board decision about your level, recorded separately and always labelled as one. It is never a result on court.</li>
    </ul>
  </div>

  <div class="rg-section">
    <div class="rg-h">The five things that sound alike</div>
    ${concept('Power Rating', 'the current estimate of your playing level')}
    ${concept('Reliability', 'how much evidence stands behind that estimate — not how good you are')}
    ${concept('Monthly Performance', 'how far above or below expectation you played in one month')}
    ${concept('League Table', 'results and points — a separate record entirely')}
    ${concept('Tier', 'the club\'s own classification of you, decided by the board')}
    <div class="rg-note">Two of these move on their own and three do not. A high Reliability does not make you better, and a low one does not make you worse: it only says how confident the estimate is.</div>
  </div>

  <details class="rg-fold">
    <summary class="rg-fold-summary"><span class="rg-fold-title">The actual calculation</span><span class="rg-fold-sub">the real formula, not a simplification</span></summary>
    <div class="rg-fold-body">
      <div class="rg-formula">rating change = K × (performance score − expected score)</div>

      <div class="rg-h2">Expected score</div>
      <div class="rg-p">Comes from the four players' Power Ratings as they stood <b>before</b> the match. It is the share of the contest your pairing was expected to take, between 0 and 1. It is fixed at the moment the match is rated and never recalculated afterwards — the expectation shown on a June card is the one the engine actually used in June.</div>

      <div class="rg-h2">Performance score</div>
      <div class="rg-p">${Math.round(c.gameWeight * 100)}% the share of <b>games</b> you won, ${Math.round(c.resultWeight * 100)}% the <b>result</b> itself. Also between 0 and 1. Mostly games, deliberately: a 7-5, 5-7, 7-5 defeat is nothing like a 6-0, 6-1 defeat, and the rating should not pretend otherwise.</div>

      <div class="rg-h2">K — how far one result can move you</div>
      <div class="rg-formula">K = ${c.kMin} + ${kSpan} × (1 − reliability)</div>
      <div class="rg-formula">reliability = e ÷ (e + ${c.rc})</div>
      <div class="rg-p"><code>e</code> is your effective rated evidence — roughly, how many rated matches stand behind your number. K starts near <b>${c.kMax}</b> when there is almost no evidence and falls toward <b>${c.kMin}</b> as evidence builds. It never goes below ${c.kMin}, so nobody's rating is ever frozen.</div>
      <div class="rg-p rg-warn">Reliability is <b>evidence</b>, not skill, and not a probability that your rating is "right". A brand-new player and a long-standing one can be equally good and have completely different reliability.</div>

      <div class="rg-h2">A worked example</div>
      <div class="rg-worked">
        <div class="rg-worked-row"><span>K</span><b>16</b></div>
        <div class="rg-worked-row"><span>expected score</span><b>0.58</b></div>
        <div class="rg-worked-row"><span>performance score</span><b>0.71</b></div>
        <div class="rg-worked-row"><span>difference</span><b>+0.13</b></div>
        <div class="rg-worked-row rg-worked-total"><span>rating change</span><b>16 × 0.13 = +2.1</b></div>
      </div>

      <div class="rg-h2">Why the same performance moves two players differently</div>
      <div class="rg-p">Take two players who both beat their expectation by exactly <b>+0.20</b> in the same match.</div>
      <div class="rg-compare">
        <div class="rg-compare-col">
          <div class="rg-compare-label">Well established</div>
          <div class="rg-compare-detail">reliability 85% · K = ${c.kMin} + ${kSpan} × 0.15 = ${(c.kMin + kSpan * 0.15).toFixed(1)}</div>
          <div class="rg-compare-value">+${((c.kMin + kSpan * 0.15) * 0.20).toFixed(1)} pts</div>
        </div>
        <div class="rg-compare-col">
          <div class="rg-compare-label">Newly reassessed</div>
          <div class="rg-compare-detail">reliability 10% · K = ${c.kMin} + ${kSpan} × 0.90 = ${(c.kMin + kSpan * 0.90).toFixed(1)}</div>
          <div class="rg-compare-value">+${((c.kMin + kSpan * 0.90) * 0.20).toFixed(1)} pts</div>
        </div>
      </div>
      <div class="rg-p">Same match, same performance, same overperformance — and roughly <b>${Math.round(((c.kMin + kSpan * 0.90) / (c.kMin + kSpan * 0.15)) * 10) / 10}×</b> the movement. Neither player played better than the other. The difference is entirely how much the engine already knew about each of them.</div>

      <div class="rg-h2">Two things the formula deliberately does not do</div>
      <div class="rg-p">It does not add points for winning. It does not take the four players' movements from a common pot, either: K is worked out per player, so the four people in one match move by four different amounts and they do not cancel out.</div>
    </div>
  </details>

  <div class="rg-section">
    <div class="rg-h">Questions people actually ask</div>
    ${q('I won — why did I only get +1 or +2?', 'Because you were expected to win, and because your rating is well established. Winning a match you were favoured to win tells the engine nothing it did not already believe, so there is very little to update. A small move after an expected win is the system agreeing with you, not overlooking you.')}
    ${q('I lost — why did my rating go up?', 'Because the rating follows how you played against expectation, not who won. If you were underdogs and took far more of the contest than expected, the estimate of your level goes up even though the match went the other way. The scoreboard is a result; the rating is an estimate.')}
    ${q('Why did my partner move more than me?', 'Because K is worked out per player, from each player\'s own evidence. The two of you were expected to deliver the same thing and delivered the same thing — but if their rating is less established than yours, the same result moves them further. Nothing was taken from you and given to them.')}
    ${q('Why does a new or reassessed player move so much more than me?', 'Their number has little evidence behind it, so each result carries much more weight — K near ' + c.kMax + ' rather than near ' + c.kMin + '. It settles as they play. This is also why a player the board has just reassessed moves quickly for a while afterwards: the reassessment deliberately restarts the evidence.')}
    ${q('Why did my rating jump after a promotion or a reclassification?', 'It did not jump <i>because</i> of the promotion. A tier change on its own moves <b>zero</b> points and zero reliability — it changes who you are ranked against, not what your rating says. What can move your rating on the same day is a separate, explicit board decision recorded alongside it, and your Rating Journey shows it as its own event with its own marker, never as a result on court.')}
    ${q('Do ratings reset every month?', 'No. There is one continuous Power Rating and it never resets. A monthly screen shows where that same rating stood at the end of that month, and the month\'s movement is simply the distance it travelled. Nothing is re-solved for a month and nobody starts a month from their tier\'s baseline.')}
    ${q('My rating barely moves any more. Is it stuck?', 'No — K never falls below ' + c.kMin + ', so every result still counts. What has changed is that your rating now has a lot of evidence behind it, so it takes a run of results rather than a single one to shift it. If you genuinely change level, a sequence of matches will say so.')}
  </div>

  <div class="rg-section rg-closing">
    <div class="rg-h">Where to see this on your own matches</div>
    <div class="rg-p">Open any match on your profile. It shows the ratings each pairing carried in, what was expected of your side, what you actually delivered, your own rating change — and a plain-English <b>"Why your rating moved"</b> built from those same recorded numbers.</div>
    <div class="rg-note">Engine <b>${c.version}</b>. The formulas above are read from the running engine, not written out beside it, so this guide cannot describe a model the app is not using.</div>
  </div>`;
}

function openPowerRatingGuide(){
  let modal = document.getElementById('ratingGuideModal');
  if(!modal){
    modal = document.createElement('div');
    modal.className = 'shell-more-sheet';
    modal.id = 'ratingGuideModal';
    document.body.appendChild(modal);
    modal.addEventListener('click', (e)=>{ if(e.target === modal) modal.classList.remove('show'); });
  }
  modal.innerHTML = `<div class="shell-more-panel rg-panel">
    <h3 style="margin-bottom:4px;">Power Rating Guide</h3>
    <div class="rg-sub">How your rating moves, and why</div>
    ${buildRatingGuideHtml()}
  </div>`;
  modal.classList.add('show');
}


// ---- Ranking eligibility (All-Time only) ---------------------------------
// The group's own existing standard -- play at least 2 games to stay "in
// the group" -- wasn't actually enforced anywhere before; some genuinely
// inactive players just never got their manual active flag updated. This
// makes it automatic: computed fresh from real match dates every time,
// nobody has to remember to flag anyone, and returning is as simple as
// playing again. Applies only to the All-Time Power Rankings list -- a
// monthly leaderboard already has its own natural eligibility test
// (you have to have played in that month to appear in it at all).
// Kept as names because several call sites read better with them, but the rule
// itself now lives in PlayerState -- one definition, one dataset, every surface.
const RANKING_ELIGIBILITY_DAYS = (typeof PlayerState !== 'undefined') ? PlayerState.WINDOW_DAYS : 30;
const RANKING_ELIGIBILITY_MIN_MATCHES = (typeof PlayerState !== 'undefined') ? PlayerState.MIN_MATCHES : 2;

// "Does this player get a rank number right now?" An INACTIVE player does not,
// and neither does an idle one -- but for different reasons, which is why the
// callers that need to tell them apart ask playerStateOf() instead.
function isRankingEligible(name){
  const st = playerStateOf(name);
  return st ? st.rankable : false;
}

// Badges the rendered rows with their real state, and numbers the list
// sequentially over whatever pool is currently visible.
//
// This used to split the list into sections and dash out everyone below the
// divider. That answered "who else exists" when the question being asked is
// "where would they sit" -- so an Idle player whose rating belongs 5th now
// appears 5th, with an IDLE badge, and the positions beneath shift accordingly.
//
// The number is a FILTERED-VIEW position, not an official rank. Turning a
// toggle on changes nothing about eligibility, participation, stored ratings or
// history; it changes which pool is being looked at.
function applyRankingEligibility(){
  const oldDivider = document.getElementById('eligibilityDivider');
  if(oldDivider) oldDivider.remove();
  const oldInactive = document.getElementById('inactiveDivider');
  if(oldInactive) oldInactive.remove();

  if(activeTab !== 'power' || selectedMonth !== 'all') return; // month views have their own natural test

  const list = document.getElementById('list');
  if(!list) return;
  const rows = [...list.children].filter(el => el.classList.contains('row'));
  if(rows.length === 0) return;

  rows.forEach((row, i)=>{
    const nameEl = row.querySelector('.nm');
    const name = row.dataset.player || (nameEl ? nameEl.textContent.trim() : null);
    const rankEl = row.querySelector('.rank');
    if(rankEl) rankEl.textContent = i + 1;

    const st = name ? playerStateOf(name) : null;
    if(!st || st.ranking === 'RANKED'){ row.classList.remove('ineligible-row'); return; }

    // Still in the list and still numbered -- but the badge says what they
    // actually are, so a filtered-view position is never mistaken for a rank
    // they hold officially.
    row.classList.add('ineligible-row');
    const tagClass = st.participation === 'INACTIVE' ? 'inactive-tag' : 'idle-tag';
    // Placed in .meta, not .nm -- .nm truncates long names with an ellipsis,
    // which could hide an appended tag entirely for anyone with a longer name.
    const metaEl = row.querySelector('.meta');
    if(metaEl && !metaEl.querySelector('.' + tagClass)){
      metaEl.insertAdjacentHTML('afterbegin', `<span class="${tagClass}">${st.label}</span> · `);
    }
  });

  // One line saying what is being looked at, so a shifted position is never a
  // surprise. Only when the pool has been widened.
  const extra = rows.filter(row=>{
    const nameEl = row.querySelector('.nm');
    const name = row.dataset.player || (nameEl ? nameEl.textContent.trim() : null);
    const st = name ? playerStateOf(name) : null;
    return st && st.ranking !== 'RANKED';
  }).length;
  if(extra > 0){
    const note = document.createElement('div');
    note.id = 'eligibilityDivider';
    note.className = 'eligibility-divider';
    const parts = [];
    if(includeIdle) parts.push('idle');
    if(includeInactive) parts.push('inactive');
    note.textContent = `Including ${parts.join(' and ')} players — positions here are for this view, not official ranks`;
    list.insertBefore(note, list.firstChild);
  }
}

// ---- Rankings podium -----------------------------------------------------
// Podium now applies to any tier and any month (per the product change) --
// it always represents the top 3 of whatever leaderboard is currently on
// screen. Hidden only for: a non-Rating ranking mode, an active player
// search, or a non-default min-games threshold. Replicates render()'s own
// filter sequence exactly (tier -> month merge -> min-games) and the fixed
// rating sort, so the podium can never disagree with the list beneath it.
function computeRankingsPodiumTop3(){
  if(activeTab !== 'power') return null;
  if(activeSortP !== 'rating') return null;
  if(query !== '') return null;
  // The default qualifying threshold differs by scope on purpose (10 for all-time, 5 for a
  // single month, since monthly game counts are naturally lower) -- the podium should respect
  // whichever default applies to the scope currently selected, not a single hardcoded number.
  const defaultMinGames = selectedMonth === 'all' ? 10 : 5;
  if(minGames !== defaultMinGames) return null;

  // Tier is scope-relative: in a month view this is the tier held at that
  // month's close, so the podium's "Tier B · June 2026" caption is true.
  let rows = PLAYERS.filter(matchesActiveTier);
  const inMonthView = selectedMonth !== 'all';
  if(inMonthView){
    const monthly = computeMonthlyStats(selectedMonth);
    const monthlyRatings = monthEndRatings(selectedMonth);
    rows = rows.map(p => ({...p, ...(monthly[p.name] || ZERO_MONTH_STATS),
      month_rating: (p.name in monthlyRatings) ? Math.round(monthlyRatings[p.name]*10)/10 : null}));
  }
  rows = rows.filter(p => p.total >= minGames);
  if(inMonthView) rows = rows.filter(p => p.month_rating !== null && p.month_rating !== undefined);
  // All-time podium can only feature currently-eligible players -- same rule, same test, as the
  // list beneath it, so the two can never show a different "top 3". Monthly scope is untouched.
  if(!inMonthView) rows = rows.filter(p => isRankingEligible(p.name));

  const sorted = rows.slice().sort((a,b)=>{
    const av = inMonthView ? a.month_rating : a.rating;
    const bv = inMonthView ? b.month_rating : b.rating;
    return bv - av;
  });
  if(sorted.length < 3) return null;
  return sorted.slice(0,3).map(p=>({ name: p.name, rating: inMonthView ? p.month_rating : p.rating }));
}

function renderRankingsPodium(){
  const existing = document.getElementById('rankingsPodium');
  if(existing) existing.remove();

  const top3 = computeRankingsPodiumTop3();
  if(!top3) return;

  const list = document.getElementById('list');
  if(!list) return;

  const scopeLabel = `${activeTier === 'All' ? 'All Tiers' : 'Tier ' + activeTier} · ${selectedMonth === 'all' ? 'All Time' : monthLabel(selectedMonth)}`;

  const order = [top3[1], top3[0], top3[2]]; // visual order: 2nd, 1st, 3rd
  const slotClass = ['second','first','third'];
  const pedestalAsset = { second: 'silver', first: 'gold', third: 'bronze' };
  const podium = document.createElement('div');
  podium.className = 'rankings-podium';
  podium.id = 'rankingsPodium';
  podium.innerHTML = `
    <div class="podium-row">
      ${order.map((p,i)=> `
        <div class="podium-slot ${slotClass[i]}" data-player="${p.name}">
          ${slotClass[i]==='first' ? `
            <div class="crown-laurel-wrap">
              <img class="crown-laurel-img" src="assets/rankings/podium-crown-laurel.png" alt="" onerror="this.style.display='none'">
              <div class="rank-num gold">1</div>
            </div>
          ` : `<div class="rank-num">${slotClass[i]==='second'?'2':'3'}</div>`}
          <div class="p-name">${p.name}</div>
          <div class="p-rating">${Math.round(p.rating)}</div>
          <img class="p-pedestal" src="assets/rankings/podium-${pedestalAsset[slotClass[i]]}.png" alt="" onerror="this.style.background='var(--surface-2)'; this.style.border='1px solid var(--surface-border)';">
        </div>
      `).join('')}
    </div>
    <div class="podium-caption">Money Padel · ${scopeLabel}</div>
  `;
  // Insert before the column header (if built) rather than before #list directly,
  // so the order is always: podium, then "# Player Rating Δ", then the rows.
  const colHeader = document.getElementById('rankingsColumnHeader');
  (colHeader || list).parentNode.insertBefore(podium, colHeader || list);
  podium.querySelectorAll('.podium-slot').forEach(el=>{
    el.onclick = ()=>{
      if(selectedMonth!=='all') openMonthlyRatingBreakdown(el.dataset.player, selectedMonth);
      else openSheet(el.dataset.player);
    };
  });
}

// ---- Kings of Tiers -------------------------------------------------------
// Three kings of their own divisions (Tier A/B/C), not 1st/2nd/3rd overall --
// deliberately a separate concept from the podium above, which is the top 3
// of whichever tier/month scope is currently selected. Reuses exactly the
// same ranking data and the same gating rules as the podium (rating mode,
// no active search, min-games still at its scope's own default) so the two
// can never disagree, plus one extra rule of its own: only makes sense
// when every tier is on screen at once (activeTier === 'All'), since
// filtering to a single tier already answers "who's #1 here".
function computeKingsOfTiers(){
  if(activeTab !== 'power') return null;
  if(activeSortP !== 'rating') return null;
  if(query !== '') return null;
  if(activeTier !== 'All') return null;
  const defaultMinGames = selectedMonth === 'all' ? 10 : 5;
  if(minGames !== defaultMinGames) return null;

  const inMonthView = selectedMonth !== 'all';
  let rows = PLAYERS.slice();
  if(inMonthView){
    const monthly = computeMonthlyStats(selectedMonth);
    const monthlyRatings = monthEndRatings(selectedMonth);
    rows = rows.map(p => ({...p, ...(monthly[p.name] || ZERO_MONTH_STATS),
      month_rating: (p.name in monthlyRatings) ? Math.round(monthlyRatings[p.name]*10)/10 : null}));
  }
  rows = rows.filter(p => p.total >= minGames);
  if(inMonthView) rows = rows.filter(p => p.month_rating !== null && p.month_rating !== undefined);
  // Same All-Time eligibility rule as the podium/list -- a monthly king only
  // has to have actually played that month, an all-time king has to still
  // be an active-enough part of the group right now.
  if(!inMonthView) rows = rows.filter(p => isRankingEligible(p.name));

  // A king of a field of one is not a king. Where only one player qualifies in
  // a tier there is nothing to have won, so no crown is awarded and the card
  // says why. This applies to every tier, not just Tier S -- the principle is
  // about the size of the field, and hardcoding it to S would make it look
  // like a rule about Manny.
  const MIN_FIELD = 2;
  const kings = {};
  const fieldSize = {};
  TIER_ORDER_LIST.forEach(tier=>{
    // Historical tier, not today's. Without this, June's Tier C king vanishes
    // the moment he is promoted in July and reappears in Tier B's June board.
    const tierRows = rows.filter(p=>tierInScope(p)===tier).sort((a,b)=>{
      const av = inMonthView ? a.month_rating : a.rating;
      const bv = inMonthView ? b.month_rating : b.rating;
      return bv - av;
    });
    fieldSize[tier] = tierRows.length;
    if(tierRows.length >= MIN_FIELD){
      const p = tierRows[0];
      kings[tier] = { name: p.name, rating: Math.round(inMonthView ? p.month_rating : p.rating),
        // Carried so the panel can say why a past king sits in a tier they are
        // no longer in, rather than leaving it looking like a bug.
        currentTier: p.tier };
    }
  });
  if(!TIER_ORDER_LIST.some(t=>kings[t])) return null;
  kings._fieldSize = fieldSize;
  return kings;
}

function renderKingsOfTiersPanel(){
  const existing = document.getElementById('kingsOfTiersPanel');
  if(existing) existing.remove();

  const kings = computeKingsOfTiers();
  if(!kings) return;

  const list = document.getElementById('list');
  if(!list) return;

  const periodLabel = selectedMonth === 'all' ? 'All Time' : monthLabel(selectedMonth);
  const tierNames = Object.fromEntries(TIER_ORDER_LIST.map(t=>[t, 'Tier ' + t]));
  // A king of Tier C in June who is Tier B today is not a mistake, and the
  // panel says so rather than leaving the reader to assume it is one.
  const movedSince = TIER_ORDER_LIST
    .filter(t => kings[t] && kings[t].currentTier && kings[t].currentTier !== t)
    .map(t => `${kings[t].name} is Tier ${kings[t].currentTier} now.`);

  const panel = document.createElement('div');
  panel.className = 'kings-panel';
  panel.id = 'kingsOfTiersPanel';
  panel.innerHTML = `
    <div class="kings-panel-header">
      <span class="kings-panel-title">Kings of Tiers</span>
      <span class="kings-panel-period">${periodLabel}</span>
    </div>
    <div class="kings-row">
      ${TIER_ORDER_LIST.filter(tier=>kings[tier] || (kings._fieldSize||{})[tier]).map(tier=>{
        const k = kings[tier];
        const field = (kings._fieldSize || {})[tier] || 0;
        return `<div class="kings-card kings-tier-${tier.toLowerCase()}" ${k ? `data-player="${k.name}"` : ''}>
          <div class="kings-crown-wrap"><img class="kings-crown" src="assets/rankings/podium-crown-laurel.png" alt="" onerror="this.style.display='none'"></div>
          ${k ? `
            <div class="kings-name">${k.name}</div>
            <div class="kings-tier-label">${tierNames[tier]}</div>
            <div class="kings-rating">${k.rating}</div>
          ` : `
            <div class="kings-name kings-name-empty">—</div>
            <div class="kings-tier-label">${tierNames[tier]}</div>
            <div class="kings-rating" style="font-size:10px; font-weight:400; color:var(--text-dim);">${field === 1 ? 'only one qualified' : 'nobody qualified'}</div>
          `}
        </div>`;
      }).join('')}
    </div>
    ${movedSince.length ? `<div class="kings-panel-note">Tiers as they stood in ${periodLabel}. ${movedSince.join(' ')}</div>` : ''}
  `;

  // Above the podium (if any), otherwise straight before the column
  // header/list -- an honours-board glance first, the fuller top-3 board
  // beneath it.
  const anchor = document.getElementById('rankingsPodium') || document.getElementById('rankingsColumnHeader') || list;
  anchor.parentNode.insertBefore(panel, anchor);
  panel.querySelectorAll('.kings-card[data-player]').forEach(el=>{
    el.onclick = ()=>{
      if(selectedMonth!=='all') openMonthlyRatingBreakdown(el.dataset.player, selectedMonth);
      else openSheet(el.dataset.player);
    };
  });
}

// ---- Phase 1B: Rankings hero, compact filter bar, secondary Filters sheet --
// Reparents existing (already-wired) legacy controls into new compact/secondary
// containers rather than duplicating them, so every existing event listener
// keeps working untouched -- only where each control physically lives changes.

function buildRankingsHero(){
  const hero = document.createElement('div');
  hero.id = 'rankingsHero';
  hero.style.cssText = 'display:none; padding: var(--space-4) var(--space-4) 0;';
  hero.innerHTML = `
    <div class="mp-section-label">Money Padel · Results Only</div>
    <div class="mp-display-title" style="font-size:28px; margin-top:4px;">Power Rankings</div>
    <div style="font-family:var(--font-interface); font-size:12px; color:var(--text-dim); margin-top:4px; line-height:1.4; max-width:32ch;">A tier-anchored rating. Scoreline counts, not just who won.</div>
  `;
  const controls = document.querySelector('.controls');
  controls.parentNode.insertBefore(hero, controls);
  return hero;
}

function buildCompactFiltersBar(){
  const monthFilterRow = document.getElementById('monthFilterRow');
  const tierbar = document.getElementById('tierbar');
  const searchWrap = document.getElementById('searchWrap');
  const minGamesRow = document.getElementById('minGamesRow');
  const monthSelectEl = document.getElementById('monthSelect');

  // Tier becomes a real compact dropdown -- built fresh, but every option's
  // onchange just triggers a .click() on the real, already-wired legacy
  // button for that value. No logic duplicated. The pill strip itself is
  // retired for good (see #tierbar{display:none!important} in app.css).
  const tierSelect = document.createElement('select');
  tierSelect.id = 'tierSelectCompact';
  [...tierbar.querySelectorAll('.tierbtn')].forEach(btn=>{
    const opt = document.createElement('option');
    opt.value = btn.dataset.tier;
    // Label-only change: the compact select reads "All tiers", independent
    // of the legacy button's own "All players" text -- app.js untouched.
    opt.textContent = btn.dataset.tier === 'All' ? 'All tiers' : btn.textContent;
    tierSelect.appendChild(opt);
  });
  tierSelect.value = activeTier;
  tierSelect.onchange = ()=>{
    const btn = tierbar.querySelector(`.tierbtn[data-tier="${tierSelect.value}"]`);
    if(btn) btn.click();
  };

  // One clean row: Month | Tier | Filter icon, each an icon+bordered control
  // per the approved reference. Month's own "Month:" label wrapper is left
  // behind -- only the raw select moves into the toolbar.
  const toolbar = document.createElement('div');
  toolbar.id = 'rankingsToolbar';
  toolbar.className = 'rankings-toolbar';

  const monthWrap = document.createElement('div');
  monthWrap.className = 'toolbar-control';
  monthWrap.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="5" width="17" height="15" rx="2"/><line x1="3.5" y1="9.5" x2="20.5" y2="9.5"/><line x1="8" y1="3" x2="8" y2="7"/><line x1="16" y1="3" x2="16" y2="7"/></svg>';
  monthWrap.appendChild(monthSelectEl);

  const tierWrap = document.createElement('div');
  tierWrap.className = 'toolbar-control';
  tierWrap.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3.5 3.5 8 12 12.5 20.5 8Z"/><path d="M3.5 12.5 12 17 20.5 12.5"/><path d="M3.5 17 12 21.5 20.5 17"/></svg>';
  tierWrap.appendChild(tierSelect);

  toolbar.appendChild(monthWrap);
  toolbar.appendChild(tierWrap);
  const filtersBtn = document.createElement('button');
  filtersBtn.className = 'filter-btn';
  filtersBtn.id = 'openFiltersBtn';
  filtersBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" width="17" height="17"><line x1="4" y1="7" x2="20" y2="7"/><circle cx="9" cy="7" r="2" fill="var(--surface-1)"/><line x1="4" y1="14" x2="20" y2="14"/><circle cx="15" cy="14" r="2" fill="var(--surface-1)"/><line x1="4" y1="21" x2="20" y2="21"/><circle cx="11" cy="21" r="2" fill="var(--surface-1)"/></svg><span class="filter-dot"></span>`;
  toolbar.appendChild(filtersBtn);
  document.querySelector('.controls').insertBefore(toolbar, document.getElementById('tabrow').nextSibling);
  monthFilterRow.style.display = 'none'; // now empty (its select moved out) -- keep it inert, not visible

  // Everything secondary lives in Filters: Data quality, search, min games
  // (moved fully off the main screen, per the correction), and the three
  // less-frequently-used sort modes.
  const sortbarPower = document.getElementById('sortbarPower');
  const secondarySortWrap = document.createElement('div');
  secondarySortWrap.id = 'secondarySortWrap';
  secondarySortWrap.className = 'fg-row';
  ['month_rating', 'avg_match_strength', 'name'].forEach(key=>{
    const btn = sortbarPower.querySelector(`[data-sortp="${key}"]`);
    if(btn) secondarySortWrap.appendChild(btn);
  });

  const sheet = document.createElement('div');
  sheet.className = 'shell-more-sheet';
  sheet.id = 'shellFiltersSheet';
  const panel = document.createElement('div');
  panel.className = 'shell-more-panel';
  panel.innerHTML = `<h3>Filters</h3>`;
  panel.appendChild(searchWrap);
  panel.appendChild(minGamesRow);
  const secondarySortLabel = document.createElement('div');
  secondarySortLabel.className = 'section-sub';
  secondarySortLabel.style.cssText = 'margin-top:12px;';
  secondarySortLabel.textContent = 'More ways to sort';
  panel.appendChild(secondarySortLabel);
  panel.appendChild(secondarySortWrap);
  sheet.appendChild(panel);
  document.body.appendChild(sheet);
  sheet.addEventListener('click', (e)=>{ if(e.target === sheet) sheet.classList.remove('show'); });

  filtersBtn.onclick = ()=> sheet.classList.add('show');

  // Gold dot on the Filter icon whenever any non-default filter is active --
  // the only visible cue needed now that Min Games/Search aren't shown
  // permanently on screen. Data Range is deliberately NOT counted here: it's
  // an app-wide setting in More, not a Rankings filter, and it has its own
  // global indicator.
  const searchInputEl = document.getElementById('search');
  const minGamesInputEl = document.getElementById('minGamesInput');
  function updateFilterDot(){
    const nonDefault = minGames !== 10 || (searchInputEl.value.trim() !== '');
    filtersBtn.classList.toggle('has-filters', nonDefault);
  }
  minGamesInputEl.addEventListener('input', ()=> setTimeout(updateFilterDot, 0));
  document.querySelectorAll('.minGamesPresets .preset-btn').forEach(b=> b.addEventListener('click', ()=> setTimeout(updateFilterDot, 0)));
  searchInputEl.addEventListener('input', updateFilterDot);

  // Screen isolation: the toolbar belongs to Rankings (both Power Rankings
  // and Win/Loss share Month/Tier filtering) and must never persist onto
  // Play/Players/Games/etc. Controlled directly here rather than fighting
  // app.js's own per-element visibility toggling, which is what caused the
  // tier pill strip to keep reappearing before.
  function syncToolbarVisibility(){
    toolbar.style.display = (activeTab === 'power' || activeTab === 'wl') ? 'grid' : 'none';
    // .controls itself is never hidden by app.js -- it only ever hides its
    // individual children, since nothing previously sat directly beneath it
    // that would make its own padding visible as a gap. Home's edge-to-edge
    // hero now sits right there, so the container needs explicit hiding too.
    const controlsEl = document.querySelector('.controls');
    if(controlsEl) controlsEl.style.display = (activeTab === 'power' || activeTab === 'wl') ? 'flex' : 'none';
  }
  document.getElementById('tabrow').addEventListener('click', ()=> setTimeout(syncToolbarVisibility, 0));
  syncToolbarVisibility();
}

// Static column-header row for the ranking table ("# PLAYER  RATING  Δ"),
// per the approved reference. Visibility follows the same rule as the
// toolbar/segmented switcher -- Power Rankings only.
function buildRankingsColumnHeader(){
  const header = document.createElement('div');
  header.id = 'rankingsColumnHeader';
  header.className = 'rankings-col-header';
  header.innerHTML = `<span>#</span><span>Player</span><span class="col-right">Rating</span><span class="col-right">Δ</span>`;
  const list = document.getElementById('list');
  list.parentNode.insertBefore(header, list);
  function sync(){ header.style.display = (activeTab === 'power') ? 'grid' : 'none'; }
  document.getElementById('tabrow').addEventListener('click', ()=> setTimeout(sync, 0));
  sync();
}

function buildCollapsibleExplainer(){
  const explainer = document.getElementById('explainer');
  const wrapper = document.createElement('div');
  wrapper.id = 'explainerWrapper';
  explainer.parentNode.insertBefore(wrapper, explainer);
  const toggle = document.createElement('button');
  toggle.id = 'explainerToggle';
  toggle.className = 'explainer-toggle';
  toggle.textContent = 'How this works ›';
  wrapper.appendChild(toggle);
  wrapper.appendChild(explainer);
  explainer.style.display = 'none';
  toggle.onclick = ()=>{
    const isOpen = explainer.style.display !== 'none';
    explainer.style.display = isOpen ? 'none' : 'block';
    toggle.textContent = isOpen ? 'How this works ›' : 'How this works ⌄';
  };
}

// ==========================================================================
// VIEWER FOUNDATION -- lightweight player selection, no accounts/auth.
// Personalisation only. See privacy note on getCurrentViewer() below.
// ==========================================================================


// ---- First-launch / switchable player selector ---------------------------
function buildViewerSelector(){
  const overlay = document.createElement('div');
  overlay.className = 'shell-more-sheet';
  overlay.id = 'viewerSelectorSheet';
  const panel = document.createElement('div');
  panel.className = 'shell-more-panel viewer-selector-panel';
  panel.innerHTML = `
    <div class="mp-section-label" style="text-align:center;">Welcome to Money Padel</div>
    <div class="mp-display-title viewer-selector-title">Who are you?</div>
    <div class="viewer-selector-sub">Choose your player to personalise your experience.</div>
    <input type="text" id="viewerSearchInput" class="viewer-search" placeholder="Search players…">
    <div id="viewerPlayerList" class="viewer-player-list"></div>
  `;
  overlay.appendChild(panel);
  document.body.appendChild(overlay);

  function renderList(filter){
    const listEl = document.getElementById('viewerPlayerList');
    // Real player data only -- never a second hard-coded list.
    const names = PLAYERS.map(p=>p.name).sort((a,b)=>a.localeCompare(b));
    const filtered = filter ? names.filter(n=>n.toLowerCase().includes(filter.toLowerCase())) : names;
    listEl.innerHTML = filtered.map(n=>`<button class="viewer-player-btn" data-name="${n}">${n}</button>`).join('');
    listEl.querySelectorAll('.viewer-player-btn').forEach(btn=>{
      btn.onclick = ()=>{
        setCurrentViewer(btn.dataset.name);
        overlay.classList.remove('show');
        setTimeout(()=> overlay.remove(), 250);
        updateMyPlayerLabel();
      };
    });
  }
  renderList('');
  document.getElementById('viewerSearchInput').addEventListener('input', (e)=> renderList(e.target.value));
  overlay.classList.add('show');
}

// ---- "My Player" entry in More -------------------------------------------
function updateMyPlayerLabel(){
  const label = document.getElementById('myPlayerLabel');
  if(!label) return;
  const viewer = getCurrentViewer();
  label.textContent = viewer ? viewer.name : 'Choose player';
}

function buildMyPlayerMoreItem(){
  const sheet = document.getElementById('shellMoreSheet');
  if(!sheet) return;
  const panel = sheet.querySelector('.shell-more-panel');
  const adminItem = panel.querySelector('.admin-item');
  const item = document.createElement('button');
  item.className = 'shell-more-item';
  item.innerHTML = `My Player<span class="my-player-value"><span id="myPlayerLabel"></span> <span class="chev">›</span></span>`;
  item.onclick = ()=>{ closeMoreSheet(); buildViewerSelector(); };
  panel.insertBefore(item, adminItem);
  updateMyPlayerLabel();
}


// ==========================================================================
// PERSONALISED HOME -- replaces the plain monthly Summary as the Home
// landing. The legacy Summary/Stats Review is fully preserved and reachable
// via "View Full Review" -- nothing deleted, just no longer the default.
// Reuses existing calculations only (ranking, eligibility, recent form,
// partnerships, H2H, monthly stats, matchmaking) -- no parallel logic.
// ==========================================================================


// Insights, from the top. The tab keeps its own scroll position, which is right
// when you return to it and wrong when you arrive at it from somewhere else.
function openInsightsFromTop(){
  const btn = legacyTabBtn('callouts');
  if(btn) btn.click();
  const view = document.getElementById('calloutsView');
  if(view && view.scrollTop !== undefined) view.scrollTop = 0;
  try { window.scrollTo({ top: 0, behavior: 'auto' }); } catch(e){ window.scrollTo(0, 0); }
}


// The Games feed, with that one match expanded. Works for every rated match,
// draws included.
function openMatchInGames(matchId){
  const btn = legacyTabBtn('games');
  if(btn) btn.click();
  if(typeof expandedGameId !== 'undefined') expandedGameId = matchId;
  if(typeof gamesMonth !== 'undefined') gamesMonth = 'all';
  if(typeof gamesType !== 'undefined') gamesType = 'all';
  if(typeof gamesPlayerIds !== 'undefined') gamesPlayerIds = [];
  if(typeof renderGamesTab === 'function') renderGamesTab();
  const card = document.querySelector(`#gamesView [data-gameid="${matchId}"]`);
  if(card) card.scrollIntoView({ block: 'center' });
}


// ==========================================================================
// PLAYER PROFILE -- premium dossier redesign
// Reuses every existing calculation (PLAYERS fields, BEST_PARTNER, H2H,
// WITHIN_TIER_GAMES/BOUNDARY_TESTS/CALIBRATION_GAMES, playerJourney,
// buildJourneyBodyHtml, computeRecentForm) -- no parallel rating/stat logic.
// Strategy: let the legacy openSheet() run fully first (unchanged), which
// still does all data prep AND wires every interactive element (match
// edit/delete, dev-area add/delete). Then physically restructure the DOM --
// reparenting the still-live dev-areas block and match cards rather than
// rebuilding their innerHTML, which would destroy those event listeners.
// ==========================================================================


document.addEventListener('DOMContentLoaded', ()=>{
  buildShellDom();
  const hero = buildRankingsHero();
  buildCompactFiltersBar();
  buildRankingsColumnHeader();
  buildCollapsibleExplainer();
  syncFullHistoryIndicator();

  // Wrap the legacy render() so the podium (and ranking eligibility split)
  // are (re)computed on every Power Rating re-render, without touching
  // render() itself.
  let viewerInitDone = false;
  const _originalRender = window.render;
  window.render = function(){
    _originalRender.apply(this, arguments);
    // render() declines to draw anything before the record has arrived (see
    // DATA_READY in app.js), and everything below reads PLAYERS. A sort button
    // pressed during those few hundred milliseconds would otherwise run the
    // one-time set-up here -- the viewer, the Home dashboard -- against an
    // empty club, which is the case the comment below was written to avoid and
    // could not actually prevent.
    if(typeof DATA_READY !== 'undefined' && !DATA_READY) return;
    applyRankingEligibility();
    renderRankingsPodium();
    renderKingsOfTiersPanel();
    hero.style.display = (activeTab === 'power') ? 'block' : 'none';
    syncHeaderSectionTitle();
    // Viewer foundation init happens here, on the first real render, rather
    // than directly in DOMContentLoaded: app.js's init() is async and loads
    // Firestore data before calling recomputeAll(), so PLAYERS is not
    // reliably populated yet at DOMContentLoaded time. The first render()
    // call only ever happens after that data is loaded and PLAYERS is set,
    // which is what buildViewerSelector's real player list depends on.
    if(!viewerInitDone){
      viewerInitDone = true;
      buildMyPlayerMoreItem();
      buildHomeDashboard();
      // Wrap openSheet once PLAYERS/etc are guaranteed ready -- every internal
      // call site in app.js (after edit/delete/confirm) goes through this
      // same global function, so they all pick up the premium restructuring
      // automatically without touching those call sites.
      const _originalOpenSheet = window.openSheet;
      window.openSheet = function(name, matchFilter){
        _originalOpenSheet.apply(this, arguments);
        renderPremiumProfile(name, matchFilter);
      };
      if(!getCurrentViewer()) buildViewerSelector();
      // If Home is already the active section by the time data is ready (or
      // becomes active later), keep the dashboard in sync with the viewer.
      document.addEventListener('viewerchanged', ()=>{
        updateMyPlayerLabel();
        updateHeaderForSection(); // the header's "Osh ▾" label lives outside
                                   // #homeDashboard, so re-rendering the
                                   // dashboard alone never touches it -- this
                                   // is what was actually going stale.
        if(activeSection === 'home') renderHomeDashboard();
      });
      if(activeSection === 'home') renderHomeDashboard();
    }
  };
  // The hero also needs to hide immediately when leaving Rankings via a tab
  // that doesn't call render() at all (Players, Games, etc.).
  document.getElementById('tabrow').addEventListener('click', ()=>{
    hero.style.display = (activeTab === 'power') ? 'block' : 'none';
    syncHeaderSectionTitle();
    syncPlayHeadingVisibility();
    // Same fix as goToSection: internal navigation (e.g. "Edit this game"
    // jumping tabs) can also move away from Home without ever going through
    // goToSection, so this needs covering here too.
    if(activeSection !== 'home'){
      const dash = document.getElementById('homeDashboard');
      if(dash) dash.style.display = 'none';
    }
  });

  updateBottomNavHighlight();
  renderSectionSubnav();

  // The shell exists. If the record is already here, this is the half that
  // finished second and the first screen is drawn now; if it is not, init()
  // draws it when it arrives. See drawFirstScreen() in app.js.
  SHELL_READY = true;
  drawFirstScreen();
});
