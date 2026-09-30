// ===================== UI: SYSTEM BACK =====================
// Player Experience Reset, Phase 1. The audit found that the phone's Back
// gesture left the app from anywhere inside it. Now every open sheet and
// every move between screens is a history entry (same URL, no hash), so Back:
//   - closes the sheet on top (profile, guide, Data & Rankings, More tables,
//     the player chooser ...), one at a time;
//   - otherwise returns to the previous screen, Home's Full Review included;
//   - leaves the app only from the first screen, as any app does.
//
// Sheets are recognised by what they already are -- a .shell-more-sheet or
// the profile #overlay carrying .show -- so no opener had to change. A sheet
// closed by its own button or backdrop takes its history entry with it.
//
// Owning stream: redesign. Loads before app.js; declarations only. The shell
// calls shellHistoryInstall() once it has built itself.

const SHELL_SHEET_SELECTOR = '.shell-more-sheet, #overlay';
const shellSheetStack = [];       // ids of the open sheets, in opening order
let shellHistoryRestoring = false; // applying a Back: record nothing
let shellHistoryPendingBack = 0;   // our own history.back() calls in flight
const shellHistoryQueue = [];      // pushes waiting for those to land
let shellNavQueued = false;

function shellNavState(){
  const summary = document.getElementById('summaryView');
  const review = activeSection === 'home' && !!summary && summary.style.display === 'block';
  return { section: activeSection, tab: activeTab, review };
}
const shellSameNav = (a, b) => !!a && !!b && a.section === b.section && a.tab === b.tab && a.review === b.review;

function shellPush(state){
  if(shellHistoryPendingBack){ shellHistoryQueue.push(state); return; }
  history.pushState(state, '');
}

// A screen changed: one entry per settled navigation, however it happened.
// Deferred to the end of the task so a navigation that clicks a legacy tab
// on the way (Home does) records where it ended, not where it passed.
function shellNavChanged(){
  if(shellHistoryRestoring || shellNavQueued) return;
  shellNavQueued = true;
  queueMicrotask(shellFlushNav);
}
// Also run first thing whenever the sheet observer fires: a screen that drew
// itself (Me does) queues the observer ahead of this, and the screen's entry
// must still go in before the entry of a sheet opened on top of it.
function shellFlushNav(){
  if(!shellNavQueued) return;
  shellNavQueued = false;
  if(shellHistoryRestoring) return;
  const nav = shellNavState();
  const top = history.state && history.state.mpNav;
  if(shellSameNav(nav, top) && !(history.state.mpSheet)) return;
  shellPush({ mpNav: nav, mpDepth: shellSheetStack.length });
}

function shellSheetOpened(id){
  if(shellHistoryRestoring || shellSheetStack.includes(id)) return;
  shellSheetStack.push(id);
  shellPush({ mpNav: shellNavState(), mpSheet: id, mpDepth: shellSheetStack.length });
}

function shellSheetClosed(id){
  const i = shellSheetStack.lastIndexOf(id);
  if(i < 0) return;
  shellSheetStack.splice(i, 1);
  // Closed by its own control: take its entry back off, so the next Back
  // does something rather than nothing. Pushes made meanwhile (a row in the
  // sheet opening something else) wait for that to land.
  if(!shellHistoryRestoring && history.state && history.state.mpSheet === id){
    shellHistoryPendingBack++;
    history.back();
  }
}

function shellCloseSheet(id){
  const el = document.getElementById(id);
  if(!el) return;
  if(id === 'overlay' && typeof closeSheet === 'function') closeSheet();
  else el.classList.remove('show');
}

function shellRestoreNav(nav){
  if(!nav || shellSameNav(nav, shellNavState())) return;
  if(nav.section === 'home' || nav.section === 'me') goToSection(nav.section);
  else {
    const b = legacyTabBtn(nav.tab);
    if(b) b.click();
  }
}

function onShellPopState(e){
  const state = e.state || {};
  if(shellHistoryPendingBack){
    // Our own back() from a sheet closed by its button: nothing to undo.
    shellHistoryPendingBack--;
    if(!shellHistoryPendingBack) shellHistoryQueue.splice(0).forEach(s => history.pushState(s, ''));
    return;
  }
  shellHistoryRestoring = true;
  try {
    const depth = state.mpDepth || 0;
    while(shellSheetStack.length > depth) shellCloseSheet(shellSheetStack.pop());
    if(state.mpNav) shellRestoreNav(state.mpNav);
  } finally {
    // Class changes reach the observer as a microtask; stay in restoring
    // mode until they have been seen.
    queueMicrotask(() => queueMicrotask(() => { shellHistoryRestoring = false; }));
  }
}

function shellHistoryInstall(){
  if(!window.history || typeof history.pushState !== 'function') return;
  history.replaceState({ mpNav: shellNavState(), mpDepth: 0, mpBase: true }, '');
  const isOpen = (el) => el.classList.contains('show');
  new MutationObserver((records) => {
    shellFlushNav();
    records.forEach((r) => {
      if(r.type === 'attributes'){
        const el = r.target;
        if(!el.id || !el.matches(SHELL_SHEET_SELECTOR)) return;
        const was = /(^|\s)show(\s|$)/.test(r.oldValue || '');
        if(!was && isOpen(el)) shellSheetOpened(el.id);
        else if(was && !isOpen(el)) shellSheetClosed(el.id);
      } else {
        r.removedNodes.forEach((n) => {
          if(n.nodeType === 1 && n.id && n.matches(SHELL_SHEET_SELECTOR)) shellSheetClosed(n.id);
        });
      }
    });
  }).observe(document.body, { subtree: true, attributes: true, attributeFilter: ['class'], attributeOldValue: true, childList: true });
  window.addEventListener('popstate', onShellPopState);
}
