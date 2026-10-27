// ===================== NEW BUILD NOTICE =====================
// "New build available · Refresh" -- a small bar above the tab
// bar when a newer build has been deployed than the one this device is
// running (Shaun, 27 Oct: the same as his Ledger app).
//
// How it knows: every deploy stamps its commit into assets/js/buildInfo.js
// (scripts/stamp-build.js). The running app has its own stamp in
// window.MP_BUILD. This re-reads that one small file, bypassing every cache,
// and compares (BuildStamp.isNewer). It checks shortly after start, whenever
// the app comes back to the foreground, and every ten minutes while it is
// open. A local or unstamped build never shows the bar, and a failed read is
// ignored -- it is a convenience, never an error.
//
// Refresh reloads the page, which fetches the new build. Dismissing it hides
// it for that build only: a later build shows it again.
//
// Owning stream: functional. Loads before app.js; declarations only.

const UPDATE_CHECK_EVERY_MS = 10 * 60 * 1000;
let updateNoticeDismissed = null;   // the build the reader said "not now" to
let updateCheckTimer = null;

async function checkForNewBuild(){
  const running = (window.MP_BUILD || {}).sha;
  if(!BuildStamp.shortSha(running)) return null;
  try {
    const res = await fetch(`assets/js/buildInfo.js?check=${Date.now()}`, { cache: 'no-store' });
    if(!res.ok) return null;
    const deployed = BuildStamp.deployedSha(await res.text());
    if(BuildStamp.isNewer(running, deployed)) showUpdateNotice(deployed);
    return deployed;
  } catch(e){ return null; }
}

function showUpdateNotice(deployed){
  if(updateNoticeDismissed === deployed) return;
  let bar = document.getElementById('updateNotice');
  if(!bar){
    bar = document.createElement('div');
    bar.id = 'updateNotice';
    bar.className = 'update-notice';
    bar.setAttribute('role', 'status');
    bar.innerHTML = `<span class="update-notice-text">New build available</span>
      <button type="button" class="update-notice-refresh" id="updateNoticeRefresh">Refresh</button>
      <button type="button" class="update-notice-close" id="updateNoticeClose" aria-label="Dismiss">✕</button>`;
    document.body.appendChild(bar);
    bar.querySelector('#updateNoticeRefresh').onclick = ()=> window.location.reload();
  }
  bar.dataset.build = deployed;
  bar.querySelector('#updateNoticeClose').onclick = ()=>{ updateNoticeDismissed = deployed; bar.remove(); };
}

function startUpdateChecks(){
  if(updateCheckTimer) return;
  setTimeout(checkForNewBuild, 5000);
  updateCheckTimer = setInterval(()=>{ if(document.visibilityState === 'visible') checkForNewBuild(); }, UPDATE_CHECK_EVERY_MS);
  document.addEventListener('visibilitychange', ()=>{ if(document.visibilityState === 'visible') checkForNewBuild(); });
}
