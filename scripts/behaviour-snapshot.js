#!/usr/bin/env node
// ===================== BEHAVIOUR SNAPSHOT =====================
// Every screen and state of the app, captured as DOM + every computed style
// of every element + element boxes, so a change can be shown to alter
// nothing a user could see. Used to verify the parallel-development split
// and each Player Experience Reset phase (docs/design/
// CLAUDE_DESIGN_IMPLEMENTATION_MAP.md §7).
//
//   node scripts/behaviour-snapshot.js <repoRoot> <out.json>
//   node scripts/behaviour-diff.js <before.json> <after.json>
//
// Take "before" from a worktree of the base commit and "after" from the
// working tree, with the same options:
//   VW=360               viewport width (default 390)
//   ONLY=home,games      a subset of states
//   EXCLUDE_VARS=--a,--b custom properties to leave out of the style hash --
//                        for a change that ADDS tokens (they appear on every
//                        element); never for one that changes an existing one
//   MODE=content         the screens' content only: the shell's navigation
//                        chrome is left out and positions are ignored, for a
//                        change to navigation that must not touch any screen
// States that need a function the app does not have are recorded as
// skipped, so one tool serves commits on either side of a change.
// Needs Playwright (as the browser tests do). Seeded record, fixed clock;
// nothing reaches the network.
const path = require('path');
const fs = require('fs');
const root = path.resolve(process.argv[2]);
const out = process.argv[3];
const H = require(path.join(root, 'tests/helpers/uiHarness.js'));
const FF = require(path.join(root, 'assets/js/fixtureFlow.js'));

const T0 = '2026-09-20T10:00:00.000Z';
const NOW = '2026-09-28T12:00:00.000Z';
const DAY = 864e5;
const plus = (d) => new Date(Date.parse(T0) + d * DAY).toISOString();

function requests() {
  const out = [];
  // Pending, waiting on PDM (the viewer): For me.
  const p = FF.createRequest({ players: ['Rishi', 'Erf', 'PDM', 'KC'], requestedBy: 'Rishi', at: plus(1), id: 'fxPend', teams: [['Rishi', 'Erf'], ['PDM', 'KC']] });
  out.push(p);
  // PDM's own request, waiting on others: My Requests.
  const mine = FF.createRequest({ players: ['PDM', 'Tom', 'Osh', 'Eli'], requestedBy: 'PDM', at: plus(2), id: 'fxMine', teams: [['PDM', 'Tom'], ['Osh', 'Eli']] });
  FF.respond(mine, 'Tom', 'in', plus(2));
  out.push(mine);
  // Someone else's: Other requests.
  out.push(FF.createRequest({ players: ['Len', 'KC', 'Eli', 'Tom'], requestedBy: 'Len', at: plus(3), id: 'fxOther', teams: [['Len', 'KC'], ['Eli', 'Tom']] }));
  // Called Out: all four in, no court.
  const co = FF.createRequest({ players: ['PDM', 'Len', 'Osh', 'KC'], requestedBy: 'PDM', at: plus(0), id: 'fxCalled', teams: [['PDM', 'Len'], ['Osh', 'KC']] });
  ['Len', 'Osh', 'KC'].forEach((n) => FF.respond(co, n, 'in', plus(0.5)));
  co.preferredDate = '2026-10-02'; co.preferredTime = '19:00'; co.location = 'Rocket Padel';
  out.push(co);
  // Upcoming: booked.
  const up = FF.createRequest({ players: ['PDM', 'Rishi', 'Erf', 'Tom'], requestedBy: 'PDM', at: plus(0), id: 'fxUp', teams: [['PDM', 'Tom'], ['Rishi', 'Erf']] });
  ['Rishi', 'Erf', 'Tom'].forEach((n) => FF.respond(up, n, 'in', plus(0.5)));
  FF.setCourtBooking(up, true, { isAdmin: true, by: 'Shaun', at: plus(1) });
  up.preferredDate = '2026-09-30'; up.preferredTime = '20:00'; up.location = 'PadelX';
  out.push(up);
  // Needs attention: agreed then someone backed out.
  const at = FF.createRequest({ players: ['PDM', 'Osh', 'Kaz', 'Len'], requestedBy: 'PDM', at: plus(0), id: 'fxAttn', teams: [['PDM', 'Osh'], ['Kaz', 'Len']] });
  ['Osh', 'Kaz', 'Len'].forEach((n) => FF.respond(at, n, 'in', plus(0.5)));
  FF.respond(at, 'Kaz', 'cant', plus(2));
  out.push(at);
  return out;
}

// Each state: a function run in the page, then a capture.
const ALL_STATES = [
  ['home', () => { goToSection('home'); }],
  ['rankings-power', () => { goToSection('rankings'); }],
  ['rankings-power-all', () => { goToSection('rankings'); const s = document.getElementById('monthSelect'); s.value = 'all'; s.dispatchEvent(new Event('change')); }],
  ['rankings-wl', () => { legacyTabBtn('wl').click(); }],
  ['league-bytier', () => { legacyTabBtn('summary').click(); summaryMode = 'league'; leagueGrouped = true; leagueLastTen = false; renderSummary(); }],
  ['league-all', () => { legacyTabBtn('summary').click(); summaryMode = 'league'; leagueGrouped = false; leagueLastTen = false; renderSummary(); }],
  ['league-last10', () => { legacyTabBtn('summary').click(); summaryMode = 'league'; leagueLastTen = true; renderSummary(); }],
  ['league-drill', () => { legacyTabBtn('summary').click(); summaryMode = 'league'; leagueGrouped = true; leagueLastTen = false; renderSummary(); const b = document.querySelector('#summaryContent .merit-count[data-kind]'); if (b) b.click(); }],
  ['merit', () => { legacyTabBtn('summary').click(); summaryMode = 'merit'; renderSummary(); const b = document.querySelector('#summaryContent .merit-count[data-kind="hard"]'); if (b) b.click(); }],
  ['race', () => { legacyTabBtn('summary').click(); summaryMode = 'race'; renderSummary(); const b = document.querySelector('#summaryContent .race-score'); if (b) b.click(); }],
  ['information', () => { legacyTabBtn('summary').click(); summaryMode = 'information'; renderSummary(); }],
  ['players', () => { goToSection('players'); }],
  ['players-filters', () => { goToSection('players'); playersFiltersOpen = true; playersSortBy = 'rating'; renderPlayersTab(); }],
  ['profile', () => { openSheet('Rishi'); }],
  ['profile-own', () => { openSheet('PDM'); }],
  ['h2h', () => { legacyTabBtn('h2h').click(); h2hPlayerA = 'Rishi'; h2hPlayerB = 'Erf'; renderH2H(); }],
  ['callouts', () => { legacyTabBtn('callouts').click(); }],
  ['findgame', () => { legacyTabBtn('findgame').click(); }],
  ['games', () => { legacyTabBtn('games').click(); }],
  ['games-filtered', () => { legacyTabBtn('games').click(); gamesFiltersOpen = true; gamesMonth = '2026-09'; setGamesPlayerFilter(['Rishi']); renderGamesTab(); }],
  ['games-type', () => { legacyTabBtn('games').click(); gamesFiltersOpen = true; gamesMonth = 'all'; setGamesPlayerFilter(['Rishi']); const opts = [...document.querySelectorAll('#gamesTypeSelect option')].map(o=>o.value).filter(v=>v.startsWith('match:')); if (opts[0]) { gamesType = opts[0]; } renderGamesTab(); }],
  ['games-expanded', () => { legacyTabBtn('games').click(); gamesType = 'all'; gamesMonth = 'all'; setGamesPlayerFilter([]); renderGamesTab(); const c = document.querySelector('#gamesView .game-card-clickable'); if (c) c.click(); }],
  ['upcoming', () => { legacyTabBtn('upcoming').click(); document.querySelectorAll('#upcomingView .fx-head').forEach((h) => h.click()); }],
  ['requests', () => { legacyTabBtn('wishlist').click(); }],
  ['doughnuts', () => { openDoughnutLeaderboard(); }],
  ['doughnuts-list', () => { openDoughnutLeaderboard(); const l = document.getElementById('doughnutViewList'); l && l.click(); }],
  ['rating-guide', () => { openPowerRatingGuide(); }],
  ['northsouth', () => { openNorthSouth(); }],
  ['datarange', () => { openDataRangeSheet(); }],
  ['about', () => { openAboutPowerRankings(); }],
  ['monthly-breakdown', () => { openMonthlyRatingBreakdown('Rishi', '2026-09'); }],
  ['manage-locked', () => { isUnlocked = false; legacyTabBtn('manage').click(); renderManage(); }],
  ['manage-admin', () => { isUnlocked = true; adminRole = 'owner'; currentUserName = 'Shaun'; legacyTabBtn('manage').click(); renderManage(); document.querySelectorAll('[data-acc-toggle]').forEach((b) => b.click()); }],
  ['upcoming-admin', () => { isUnlocked = true; adminRole = 'owner'; legacyTabBtn('upcoming').click(); document.querySelectorAll('#upcomingView .fx-head').forEach((h) => h.click()); const m = document.querySelector('#upcomingView .fx-manage-toggle'); m && m.click(); }],
  ['requests-admin', () => { isUnlocked = true; adminRole = 'owner'; legacyTabBtn('wishlist').click(); }],
  ['games-admin', () => { isUnlocked = true; adminRole = 'owner'; legacyTabBtn('games').click(); gamesMonth = 'all'; gamesType = 'all'; setGamesPlayerFilter([]); renderGamesTab(); const b = document.querySelector('#gamesView [data-manage]'); b && b.click(); }],
  ['findgame-admin', () => { isUnlocked = true; legacyTabBtn('findgame').click(); }],
  ['home-admin', () => { isUnlocked = true; goToSection('home'); }],
];

const STATES = process.env.ONLY ? ALL_STATES.filter(([n]) => process.env.ONLY.split(',').includes(n)) : ALL_STATES;
function capture(opts) {
  // Runs in the page, so everything it needs is defined inside it.
  // The shell's navigation chrome: left out in MODE=content.
  // (Me, and Play's My Games and Club, are screens the shell draws over the
  // app -- Player Experience Reset Phases 1-2 -- as are their sheets.)
  const CHROME = '.shell-header, #sectionSubnav, .shell-bottom-nav, #shellMoreSheet, #meView, #myGamesView, #clubView, '
    + '#rankingsMoreSheet, #gameSheet, #arrangeSheet, #bookingSheet, #playToast';
  const EXCL = new Set(opts.excludeVars || []);
  const content = opts.mode === 'content';
  // DOM: the whole body, with volatile attributes left as they are (clock is fixed).
  // Script tags and comments are the page's plumbing (which files load), not
  // what a reader sees; a refactor legitimately changes them.
  const clone = document.body.cloneNode(true);
  clone.querySelectorAll('script').forEach((n) => n.remove());
  if (content) clone.querySelectorAll(CHROME).forEach((n) => n.remove());
  const walker = document.createTreeWalker(clone, NodeFilter.SHOW_COMMENT);
  const comments = []; while (walker.nextNode()) comments.push(walker.currentNode);
  comments.forEach((c) => c.remove());
  const html = clone.outerHTML.replace(/https?:\/\/127\.0\.0\.1:\d+/g, '').replace(/\n\s*\n+/g, '\n');
  // Styles: every element, every computed property, hashed per element.
  const all = [...document.body.querySelectorAll('*')].filter((el) => el.tagName !== 'SCRIPT'
    && !(content && el.closest(CHROME)));
  const h = (s) => { let x = 2166136261; for (let i = 0; i < s.length; i++) { x ^= s.charCodeAt(i); x = Math.imul(x, 16777619); } return (x >>> 0).toString(36); };
  const styles = all.map((el) => {
    const cs = getComputedStyle(el);
    // Custom properties enumerate in no fixed order, so sort.
    const props = [];
    for (let i = 0; i < cs.length; i++) if (!EXCL.has(cs[i])) props.push(cs[i]);
    props.sort();
    let s = '';
    for (const p of props) s += p + ':' + cs.getPropertyValue(p) + ';';
    // The test server's port changes every run; the path is what matters.
    s = s.replace(/https?:\/\/127\.0\.0\.1:\d+/g, '');
    const b = el.getBoundingClientRect();
    // Content mode compares size, not position: navigation above a screen
    // may legitimately move it down without changing it.
    return h(s) + '@' + (content ? [b.width, b.height] : [b.x, b.y, b.width, b.height]).map((v) => Math.round(v)).join(',');
  });
  const ids = all.map((el) => el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + (typeof el.className === 'string' && el.className ? '.' + el.className.trim().split(/\s+/).join('.') : ''));
  return { html, styles, ids, scrollW: document.documentElement.scrollWidth };
}

(async () => {
  const result = {};
  for (const [name, setup] of STATES) {
    const app = await H.open({ now: NOW, club: { moneypadel_game_requests: requests() } });
    try {
      await app.page.setViewportSize({ width: +(process.env.VW || 390), height: 844 });
      await app.run(() => { setCurrentViewer('PDM'); });
      await app.page.waitForTimeout(50);
      // Only a state's own setup may be "skipped" (it needs a function this
      // commit does not have); anything failing in the capture is a failure.
      try { await app.run(setup); } catch (e) {
        const msg = String(e && e.message || e);
        if (/is not defined|is not a function/.test(msg)) { result[name] = { skipped: msg.split('\n')[0] }; continue; }
        throw e;
      }
      await app.page.waitForTimeout(150);
      result[name] = await app.run(capture, { excludeVars: (process.env.EXCLUDE_VARS || '').split(',').filter(Boolean), mode: process.env.MODE || '' });
      result[name].errors = app.pageErrors.slice();
    } catch (e) {
      result[name] = { failed: String(e && e.message || e) };
    } finally { await app.close(); }
    process.stderr.write('.');
  }
  fs.writeFileSync(out, JSON.stringify(result));
  process.stderr.write('\n');
})();
