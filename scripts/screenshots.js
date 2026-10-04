#!/usr/bin/env node
// Capture the review screenshots CGPT and Shaun asked for.
//
//   node scripts/screenshots.js
//
// They are review aids, not release documentation, so they are taken from the
// LIVE beta record rather than the seeded fixture. A screenshot of the seed
// would show ratings that no longer exist -- the three board decisions of
// 18 Sep moved most of the club -- and a review aid that shows the wrong
// numbers is worse than none.
//
// Read-only: the page is served locally and its Firestore is a stub holding a
// copy of the live documents. Nothing is written back.

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const Store = require('../assets/js/ratingStore.js');
const { PROJECT_ID } = require('./seed-beta.js');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'docs', 'screenshots');
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json',
  '.png': 'image/png', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.webmanifest': 'application/manifest+json' };

function playwright() {
  for (const id of ['playwright', '/opt/node22/lib/node_modules/playwright']) {
    try { return require(id); } catch (e) { /* next */ }
  }
  return null;
}

function serve() {
  const server = http.createServer((req, res) => {
    const rel = decodeURIComponent(req.url.split('?')[0]).replace(/^\/+/, '') || 'index.html';
    const file = path.join(ROOT, rel);
    if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); res.end(); return; }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
    fs.createReadStream(file).pipe(res);
  });
  return new Promise((r) => server.listen(0, '127.0.0.1', () => r(server)));
}

// Each shot says what a reviewer should be looking at, which is the point of a
// review aid. The captions become docs/screenshots/README.md.
const SHOTS = [
  { file: '00-home.png', title: 'Home — the lower half',
    note: 'Club Pulse cards open the player they name. Match ideas is collapsed until asked for. Last Time Out is built automatically from the player\'s own most recent rated match — result, scoreline, one deterministic line, and the rating movement the engine recorded. The monthly snapshot stays.' },
  { file: '01-rankings-all-time.png', title: 'Power Rankings — all time',
    note: 'Kings of Tiers, the podium and the ranking list. A tier is crowned only where someone qualifies at the chosen minimum games, so S and C are absent here rather than shown empty.' },
  { file: '02-rankings-month.png', title: 'Power Rankings — a single month',
    note: 'Key takeaways first, Monthly Performance open, the other three stories folded -- all four concepts kept. Club-decision movement stays labelled apart from movement earned on court, so Tom\'s July reads as a board decision rather than form.' },
  { file: '03-profile-hero.png', title: 'Player profile — reliability at a glance',
    note: 'Reliability sits in its own facts row with its band, beside tier and games played and deliberately away from rank and win rate: it measures how much evidence stands behind the rating, not how good the player is.' },
  { file: '04-profile-journey.png', title: 'Rating Journey',
    note: 'The recorded journey, not a reconstruction: the last point IS the Power Rating. Milestones show the club decision with its own marker.' },
  { file: '05-match-card.png', title: 'Match detail',
    note: 'Ratings as they were going in, the performance score against the pre-match expectation, and each player\'s own rating change. Scores read from the player in focus, so a loss looks like a loss.' },
  { file: '06-monthly-breakdown.png', title: 'Monthly Rating breakdown',
    note: 'Carried-in rating (1137 -- wherever the continuous rating had reached, never a tier baseline) and the month\'s moves as the engine recorded them, including each player\'s own change in a shared match.' },
  { file: '07-admin-review.png', title: 'Admin — Monthly Review',
    note: 'A tier change cannot be recorded until the board answers the rating question. Four explicit answers, and an answer the record makes impossible is disabled with its reason beside it rather than offered as a live button.' },
  { file: '08-admin-historical.png', title: 'Admin — Historical Club Adjustment',
    note: 'A board decision entered late. State reconstructed as at that date, and the decisions already on it labelled: what is Active, what was Superseded, and what each one actually did. Nothing earlier is deleted or rewritten.' },
  { file: '09-admin-diagnostics.png', title: 'Admin — Beta diagnostics',
    note: 'Reads the three collections directly and checks the record still hangs together. Also carries the read-strategy measurement.' },
  { file: '10-games-feed.png', title: 'Play — the results feed',
    note: 'What a player sees. Teams, result, score, badge, submission metadata — and nothing else. The correction controls exist for one person and do not appear here at all.' },
  { file: '10b-games-correction.png', title: 'Play — Manage, opened by an admin',
    note: 'Unlocked, one card at a time, behind a compact Manage affordance in the card header. Two separate actions with their own words: a removal is confirmed by a button that says Remove and replay, never by one that says correct. The blast radius is measured by replaying and shown in full before anything is written.' },
  { file: '11-full-calculation.png', title: 'The full calculation',
    note: 'The disclosure inside the monthly breakdown: sequential-v1 stated as it actually is -- applied once in order, never re-solved, never reset at a month boundary, with K falling as evidence builds. It also shows the unrounded month-end figure.' },
  { file: '16-players-directory.png', title: 'Players — the Directory as it opens',
    note: 'The list is the screen. Filters are folded behind a line that says what is on ("All tiers, all players"), so the first player sits near the top instead of below half a screen of controls. A row leads with the name in the public serif, with tier and rating as quiet metadata under it; Active is the normal state and no longer shouts on every row.' },
  { file: '16b-players-directory-filters.png', title: 'Players — the filters, opened',
    note: 'One tap. Tier chips wrap rather than running off the right edge of a phone, and choosing one leaves the panel open under the finger. Every filter, sort and navigation behaviour is the one that was already there.' },
  { file: '17-league-by-tier.png', title: 'League — the table is the screen',
    note: 'Month and View side by side rather than stacked, and the explanation reduced to a quiet tappable line under the title — no card, no border, nothing competing with the table. Each tier heading carries its own chevron. The By tier / All together choice and the split-month allocation inside the tables are untouched.' },
  { file: '17b-league-tiers-collapsed.png', title: 'League — one tier collapsed',
    note: 'Each tier collapses on its own: Tier A is folded away here and S, B and C are untouched. They are four separate competitions, so there was never a reason hiding one should hide the rest. Presentation state only — the By tier selection and every match\'s tier allocation are unchanged underneath, and entering By tier always arrives with every tier expanded.' },
  { file: '18-league-last-10.png', title: 'Last 10 — form as a league table',
    note: 'Each player\'s own most recent ten rated games, wherever they fall. Not scoped to the selected month: every row covers the same number of games rather than the same number of days, which is what makes two rows comparable. Same 3/1/0 scoring. A short sample is marked "of 10" beside the P it qualifies and is never padded.' },
  { file: '18b-league-last-10-explained.png', title: 'Last 10 — what it is measuring',
    note: 'The disclosure says the thing a reader would otherwise have to assume: that the window is per player, that it ignores the month selector, and that a row with fewer than ten games is a short sample rather than a bad one.' },
  { file: '19-admin-predict.png', title: 'Admin — Predict a Matchup',
    note: 'Admin-only by design: players agree a game in the group first, then send the four names. The card answers the questions in the order they are asked — who should win, what share of the games, who is playing and at what rating, and how big the edge is. No engine terminology: the 80/20 blend and the phrase "Expected performance score" are gone. It says share of games, never a chance of winning, because no win-probability model has been validated. Visual treatment is deliberately unchanged pending Shaun\'s render.' },
  { file: '20-admin-rename.png', title: 'Admin — renaming a player',
    note: 'A name is a label, not an identity. The confirmation names both, and says the thing that matters: the record does not move. Renaming writes one field on one document — no match, no rating journey event and no document id is touched, which is why it is safe to do twice or fifty times.' },
  { file: '21-monthly-summary-collapsed.png', title: 'Rankings — Monthly Summary folded',
    note: 'The whole summary folds as one — Key takeaways, Monthly Performance, Rating Movement, Ranking Movement, Moved without playing and Crossovers together. It defaults expanded, because unlike the League explanation this is content rather than an explanation of content. The heading keeps its own type, colour and spacing; the chevron is the only thing added, and it is not a card.' },
  { file: '22-merit-table.png', title: 'Merit Table — harder wins earn more',
    note: 'An alternative league view over the same matches, scored only on the tiers held on the day: an even matchup is worth 4 for a win, each tier-step of difference takes one off the favourite and adds one to the underdog. A pairing is the SUM of its two players, so AC and BB are equal — comparing the best player on each side would get a large share of the club\'s games wrong. It sits behind the existing View select rather than as a fourth segmented button, which would have crowded the mobile control. Not a rating: nothing here reads a Power Rating or an expectation.' },
  { file: '22b-merit-drilldown.png', title: 'Merit — the matches behind a count',
    note: 'Hard and Favoured are the two halves of the same story: wins over a stronger pairing and over a weaker one, with equal-strength wins counting toward neither. Tapping a count opens the matches it was built from — teams with the tier each player held FOR THAT FIXTURE, the score, how far apart the pairings were, and what the win was worth. The list is the table\'s own classification, not a second calculation: a screen that re-derived hard from the match would eventually disagree with the number above it.' },
  { file: '12-rating-guide-summary.png', title: 'Power Rating Guide — in short',
    note: 'Reachable from More. Leads with the idea, not the formula: the rating is not a reward for wins, it is an estimate of level. The five things that sound alike are separated explicitly.' },
  { file: '13-rating-guide-maths.png', title: 'Power Rating Guide — the actual calculation',
    note: 'One tap away. The formulas are read from the running engine rather than written out beside it, so the guide cannot describe a model the app is not using. The comparison shows why the same overperformance moves an established player ~2.9 points and a newly reassessed one 7.4.' },
  { file: '14-rating-guide-faq.png', title: 'Power Rating Guide — questions people actually ask',
    note: 'The complaints the guide exists to pre-empt, answered directly: a small move after a win, a rating rising after a loss, a partner moving further, and whether anything resets monthly.' },
  { file: '15-why-your-rating-moved.png', title: 'Why your rating moved',
    note: 'Padel language first, in the order a player thinks in: were we favoured, what were we expected to take, what did we take and did we win, so what did that earn. The decimals sit behind "See full calculation" — read from the same persisted facts, never a second calculation.' },
];

async function main() {
  const pw = playwright();
  if (!pw) { console.error('Playwright is not available.'); process.exitCode = 1; return; }

  // Iterating on captures used to cost a full read of the record every run --
  // 857 documents, a dozen times in a working session, which is how the beta's
  // daily Firestore read quota got exhausted on 19 Sep. The live record is
  // cached to disk and reused; --refresh forces a fresh read.
  const cachePath = path.join(OUT, '.live-record.json');
  const refresh = process.argv.includes('--refresh');
  let cache = {};
  if (fs.existsSync(cachePath)) {
    try { cache = JSON.parse(fs.readFileSync(cachePath, 'utf8')); } catch (e) { cache = {}; }
  }
  if (!refresh && cache.players && cache.matches && cache.journey) {
    console.log(`Using the cached live record from ${cache.readAt} (--refresh to re-read).`);
    return render(cache.players, cache.matches, cache.journey, cache.readAt);
  }

  console.log('Reading the live beta ...');
  const backend = Store.firestoreRestBackend({ projectId: PROJECT_ID });
  // Sequentially, with backoff. Three parallel reads of 857 documents is enough
  // to earn a 429, and a rate limit is a wait rather than a failure -- giving
  // up on it would leave the last capture on disk, silently stale, which is the
  // one outcome worse than not regenerating at all.
  const read = async (collection) => {
    for (let attempt = 1; ; attempt++) {
      try { return await backend.getAll(collection); } catch (e) {
        const rateLimited = /\b429\b/.test(e.message);
        if (!rateLimited || attempt >= 6) throw e;
        const waitMs = 2000 * attempt;
        console.log(`  ${collection}: rate limited, retrying in ${waitMs / 1000}s (attempt ${attempt})`);
        await new Promise((r) => setTimeout(r, waitMs));
      }
    }
  };
  // Cached per collection, and written as each one lands. The 666-event journey
  // is far the most expensive read and the one that gets rate-limited, so a
  // failure on it must not throw away the two that already succeeded -- the
  // next attempt then costs one read instead of three.
  const fetchInto = async (key, collection) => {
    if (cache[key] && !refresh) { console.log(`  ${collection}: reusing cache`); return cache[key]; }
    const got = await read(collection);
    cache[key] = got;
    cache.readAt = new Date().toISOString().slice(0, 10);
    fs.mkdirSync(OUT, { recursive: true });
    fs.writeFileSync(cachePath, JSON.stringify(cache));
    return got;
  };
  const players = await fetchInto('players', Store.COLLECTIONS.players);
  const matches = await fetchInto('matches', Store.COLLECTIONS.matches);
  const journey = await fetchInto('journey', Store.COLLECTIONS.journey);
  return render(players, matches, journey, cache.readAt);
}

async function render(players, matches, journey, readAt) {
  const pw = playwright();
  if (!pw) { console.error('Playwright is not available.'); process.exitCode = 1; return; }
  console.log(`  ${players.length} players, ${matches.length} matches, ${journey.length} journey events`);

  const server = await serve();
  const port = server.address().port;
  const browser = await pw.chromium.launch();
  const page = await browser.newPage({ viewport: { width: 430, height: 932 }, deviceScaleFactor: 2 });
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));

  await page.addInitScript(({ data }) => {
    window.firebase = { initializeApp() {}, firestore() { return { collection(n) { return {
      doc(id) { return { async get() { const v = (data[n] || {})[id]; return { exists: !!v, data: () => v }; },
        async set() {}, async delete() {} }; },
      async get() { return { docs: Object.values(data[n] || {}).map((v) => ({ data: () => v })) }; },
    }; } }; } };
  }, { data: {
    players: Object.fromEntries(players.map((d) => [d.id, d])),
    matches: Object.fromEntries(matches.map((d) => [d.id, d])),
    ratingJourney: Object.fromEntries(journey.map((d) => [d.id, d])),
  } });

  await page.goto(`http://127.0.0.1:${port}/index.html`, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => typeof V3_STATE !== 'undefined' && (V3_STATE.loaded || V3_STATE.error), null, { timeout: 20000 });
  await page.waitForTimeout(600);
  const dismiss = () => page.evaluate(() => { const el = document.getElementById('viewerSelectorSheet'); if (el) el.remove(); });
  await dismiss();

  fs.mkdirSync(OUT, { recursive: true });
  const shot = async (file, prepare, scrollTo) => {
    await page.evaluate(prepare);
    await page.waitForTimeout(700);
    await dismiss();
    if (scrollTo) { await page.evaluate(scrollTo); await page.waitForTimeout(400); }
    await page.screenshot({ path: path.join(OUT, file) });
    console.log('  ' + file);
  };

  console.log('Capturing ...');
  await shot('00-home.png',
    () => {
      if (typeof setCurrentViewer === 'function') setCurrentViewer('Ant Slice');
      goToSection('home');
      if (typeof renderHomeDashboard === 'function') renderHomeDashboard();
    },
    () => { const el = document.querySelector('.home-pulse-row'); if (el) el.scrollIntoView({ block: 'start' }); });
  await shot('01-rankings-all-time.png',
    () => { selectedMonth = 'all'; activeTier = 'All'; minGames = 10; activeTab = 'power'; activeSortP = 'rating'; goToSection('rankings'); render(); },
    () => { const el = document.getElementById('kingsOfTiersPanel'); if (el) el.scrollIntoView({ block: 'start' }); });
  await shot('02-rankings-month.png',
    () => { selectedMonth = '2026-07'; minGames = 5; render(); },
    () => { const el = document.querySelector('.monthly-stories'); if (el) el.scrollIntoView({ block: 'start' }); });
  await shot('03-profile-hero.png',
    () => { selectedMonth = 'all'; minGames = 10; render(); openSheet('Shaun'); },
    () => { const el = document.querySelector('.pp-hero'); if (el) el.scrollIntoView({ block: 'start' }); });
  await shot('04-profile-journey.png',
    // openSheet is wrapped to render the premium profile itself. Calling
    // renderPremiumProfile again rebuilds the wrapper AFTER the match cards
    // have been reparented into it, which empties Recent Results.
    () => { selectedMonth = 'all'; minGames = 10; render(); openSheet('Shaun'); },
    () => { const w = document.getElementById('premiumProfileWrap'); const el = w && [...w.querySelectorAll('.pp-section-label')].find((e) => /rating journey/i.test(e.textContent)); if (el) el.scrollIntoView({ block: 'start' }); });
  await shot('05-match-card.png', () => {}, () => {
    const host = document.getElementById('ppMatchesHost');
    const row = host && host.querySelector('.pp-match-row');
    if (!row) return;
    row.click();
    const label = [...host.parentElement.querySelectorAll('.pp-section-label')].find((e) => /recent results/i.test(e.textContent));
    (label || row).scrollIntoView({ block: 'start' });
  });
  await shot('06-monthly-breakdown.png',
    () => { closeSheet(); selectedMonth = '2026-07'; minGames = 5; render(); openMonthlyRatingBreakdown('Shaun', '2026-07'); });
  await shot('07-admin-review.png',
    () => {
      const mrb = document.getElementById('monthlyRatingModal'); if (mrb) mrb.classList.remove('show');
      closeSheet(); isUnlocked = true; currentUserName = 'Board';
      // Reach Admin the way a reviewer does -- More > Admin / Manage -- so the
      // More sheet is closed by its own handler rather than left over the shot.
      const admin = document.querySelector('#shellMoreSheet .admin-item');
      if (admin) admin.click();
      // Admin/Manage opens with every section collapsed, so open the one this
      // shot is about -- the same tap a reviewer makes.
      adminOpenSections.review = true;
      if (typeof renderManage === 'function') renderManage();
      // Open a real review and choose a tier move, which is what arms the
      // required rating question. Nothing is staged for writing: the confirm
      // step is never reached, and the stubbed Firestore cannot write anyway.
      const cands = reviewCandidates();
      reviewSubject = cands.length ? cands[0].name : 'Rishi';
      renderManage();
      const tier = document.querySelector('.review-tier');
      if (tier) tier.click();
    },
    () => { const el = [...document.querySelectorAll('.section-heading')].find((e) => /Rating — required/i.test(e.textContent)); if (el) el.scrollIntoView({ block: 'start' }); });
  await shot('08-admin-historical.png',
    () => {
      reviewSubject = null;
      adminOpenSections = { historical: true };
      renderManage();
      const p = document.getElementById('histPlayer'), d = document.getElementById('histDate');
      if (p && d) { p.value = 'Tom'; d.value = '2026-07-01'; histLoadContext(); }
    },
    () => { const el = document.querySelector('[data-acc="historical"]'); if (el) el.scrollIntoView({ block: 'start' }); });
  await shot('09-admin-diagnostics.png',
    () => { histReset(); adminOpenSections = { diagnostics: true }; renderManage(); return runBetaDiagnostics(); },
    () => { const el = document.querySelector('[data-acc="diagnostics"]'); if (el) el.scrollIntoView({ block: 'start' }); });
  // Games is a tab inside the Play section, not a section of its own, so it is
  // reached through its legacy tab button. Staging a removal PLANS the replay
  // and shows the consequence; it is never confirmed, and the stubbed
  // Firestore has no write path in any case.
  // The player-facing feed first: no admin surface anywhere on it.
  await shot('10-games-feed.png',
    () => {
      const b = document.querySelector('#tabrow .tab-btn[data-tab="games"]');
      if (b) b.click();
      selectedMonth = 'all'; isUnlocked = false; currentUserName = '';
      renderGamesTab();
    },
    () => { const el = document.querySelector('#gamesView .callout-card'); if (el) el.scrollIntoView({ block: 'start' }); });
  await shot('10b-games-correction.png',
    () => {
      selectedMonth = 'all'; isUnlocked = true; currentUserName = 'Board';
      renderGamesTab();
      const yn = document.getElementById('gamesYourName'); if (yn) yn.value = 'Board';
      const manage = document.querySelector('#gamesView [data-manage]');
      if (!manage) return null;
      manage.click();
      const del = document.querySelector('#gamesView [data-delete]');
      if (!del) return null;
      return deleteMatch(del.dataset.delete);
    },
    () => { const el = [...document.querySelectorAll('#gamesView .callout-card')].find((e) => /re-derives every rating/i.test(e.textContent)); if (el) el.scrollIntoView({ block: 'start' }); });

  // The Players Directory, as it opens: filters folded behind their summary,
  // the list itself starting near the top of the screen.
  await shot('16-players-directory.png',
    () => {
      const m = document.getElementById('monthlyRatingModal'); if (m) m.classList.remove('show');
      closeSheet();
      playersTierFilter = 'All'; playersActiveFilter = 'all'; playersSortBy = 'name';
      playersFiltersOpen = false;
      goToSection('players');
      renderPlayersTab();
    },
    // The previous scene left the page scrolled; the Directory's whole point
    // is what it looks like when it opens.
    () => window.scrollTo(0, 0));
  await shot('16b-players-directory-filters.png',
    () => { const t = document.getElementById('playersFilterToggle'); if (t) t.click(); },
    () => window.scrollTo(0, 0));

  // The League screen: the table is the screen, so both disclosures start
  // closed and Month/View sit side by side.
  //
  // Each prepare function is written out in full rather than built by a
  // helper: page.evaluate serialises the function source and sends it to the
  // browser, so a closure over anything in this file does not survive the trip.
  await shot('17-league-by-tier.png',
    () => {
      const m = document.getElementById('monthlyRatingModal'); if (m) m.classList.remove('show');
      closeSheet();
      const b = document.querySelector('#tabrow .tab-btn[data-tab="summary"]'); if (b) b.click();
      summaryMode = 'league'; summaryMonth = '2026-08';
      leagueSortKey = 'points'; leagueSortDesc = true;
      leagueExplainerOpen = false; resetLeagueTierSections();
      leagueLastTen = false; leagueGrouped = true;
      renderSummary();
    },
    () => window.scrollTo(0, 0));
  await shot('17b-league-tiers-collapsed.png',
    () => {
      // One tier collapsed, the rest left alone — the thing a single global
      // fold could not do.
      const first = document.querySelector('#summaryContent .lg-tier-head');
      if (first) first.click();
    },
    () => window.scrollTo(0, 0));
  await shot('18-league-last-10.png',
    () => {
      resetLeagueTierSections(); leagueExplainerOpen = false;
      leagueSortKey = 'points'; leagueSortDesc = true;
      leagueLastTen = true;
      renderSummaryLeagueTable();
    },
    () => window.scrollTo(0, 0));
  await shot('18b-league-last-10-explained.png',
    () => { leagueExplainerOpen = true; renderSummaryLeagueTable(); },
    () => window.scrollTo(0, 0));

  // Predict a Matchup, the Admin workflow Shaun runs when players send him a
  // four-player combination. Copy and hierarchy only for now -- the visual
  // treatment is deferred until Shaun approves a render.
  await shot('19-admin-predict.png',
    () => {
      const m = document.getElementById('monthlyRatingModal'); if (m) m.classList.remove('show');
      closeSheet();
      isUnlocked = true; currentUserName = 'Board';
      openPredictMatchup();   // the top of More, Admin only (4 Oct)
      const sorted = [...PLAYERS].sort((a, b) => b.rating - a.rating);
      const set = (id, v) => { document.getElementById(id).value = v; };
      set('predA1', sorted[3].name); set('predA2', sorted[9].name);
      set('predB1', sorted[14].name); set('predB2', sorted[16].name);
      document.getElementById('predA1').dispatchEvent(new Event('input'));
    },
    () => { const el = document.getElementById('matchupCard'); if (el) el.scrollIntoView({ block: 'start' }); });

  // Renaming a player: one field on one document, with the confirmation open.
  await shot('20-admin-rename.png',
    () => {
      const m = document.getElementById('monthlyRatingModal'); if (m) m.classList.remove('show');
      closeSheet();
      isUnlocked = true; currentUserName = 'Board';
      const more = document.querySelector('#tabrow .tab-btn[data-tab="manage"]');
      if (more) more.click();
      adminOpenSections = { players: true };
      renderManage();
      const subject = 'Shaun';
      openPlayerTags[subject] = true;
      renderPlayerTagsList();
      const input = document.querySelector(`.ptag-rename-input[data-name="${subject}"]`);
      if (!input) return;
      input.value = 'Shaun J';
      input.dispatchEvent(new Event('input'));
      document.querySelector(`.ptag-rename-ask[data-name="${subject}"]`).click();
    },
    () => { const el = document.querySelector('.ptag-rename'); if (el) el.scrollIntoView({ block: 'center' }); });

  // The Monthly Summary disclosure, collapsed — the heading keeps its type and
  // the chevron is the only addition.
  await shot('21-monthly-summary-collapsed.png',
    () => {
      const m = document.getElementById('monthlyRatingModal'); if (m) m.classList.remove('show');
      closeSheet();
      const b = document.querySelector('#tabrow .tab-btn[data-tab="power"]'); if (b) b.click();
      selectedMonth = '2026-09'; minGames = 0; activeTier = 'All'; activeSortP = 'rating';
      // Keep the visible month control in step with the month being rendered,
      // or the capture shows one month selected and another summarised.
      const sel = document.getElementById('monthSelect'); if (sel) sel.value = '2026-09';
      monthlySummaryOpen = false;
      goToSection('rankings'); render();
    },
    () => { const el = document.getElementById('monthlySummaryToggle'); if (el) el.scrollIntoView({ block: 'center' }); });

  // The Merit Table: an alternative league view, reached from the same View
  // select as the League Table rather than a fourth segmented button.
  await shot('22-merit-table.png',
    () => {
      const m = document.getElementById('monthlyRatingModal'); if (m) m.classList.remove('show');
      closeSheet();
      const b = document.querySelector('#tabrow .tab-btn[data-tab="summary"]'); if (b) b.click();
      summaryMode = 'merit'; summaryMonth = 'all';
      leagueGrouped = false; meritExplainerOpen = true;
      meritDrill = null; resetMeritTierSections();
      renderSummary();
    },
    () => window.scrollTo(0, 0));
  // …and a Hard count opened, which is the whole point of making them tappable.
  await shot('22b-merit-drilldown.png',
    () => {
      const btn = document.querySelector('#summaryContent .merit-count[data-kind="hard"]');
      if (btn) btn.click();
    },
    () => { const el = document.querySelector('.merit-drill-body'); if (el) el.scrollIntoView({ block: 'center' }); });

  const openGuide = () => {
    const m = document.getElementById('monthlyRatingModal'); if (m) m.classList.remove('show');
    closeSheet();
    const b = document.querySelector('#tabrow .tab-btn[data-tab="power"]'); if (b) b.click();
    selectedMonth = 'all'; minGames = 10; render();
    openPowerRatingGuide();
  };
  await shot('12-rating-guide-summary.png', openGuide,
    () => { const el = document.querySelector('.rg-anchor'); if (el) el.scrollIntoView({ block: 'start' }); });
  await shot('13-rating-guide-maths.png',
    () => { const f = document.querySelector('.rg-fold'); if (f) f.open = true; },
    () => { const el = document.querySelector('.rg-formula'); if (el) el.scrollIntoView({ block: 'start' }); });
  await shot('14-rating-guide-faq.png',
    () => {
      const f = document.querySelector('.rg-fold'); if (f) f.open = false;
      const faqs = [...document.querySelectorAll('.rg-faq')];
      faqs.slice(0, 2).forEach((d) => { d.open = true; });
    },
    () => { const el = [...document.querySelectorAll('.rg-h')].find((e) => /questions people/i.test(e.textContent)); if (el) el.scrollIntoView({ block: 'start' }); });
  await shot('15-why-your-rating-moved.png',
    () => {
      const g = document.getElementById('ratingGuideModal'); if (g) g.classList.remove('show');
      selectedMonth = 'all'; minGames = 10; render();
      openSheet('Shaun');
      const host = document.getElementById('ppMatchesHost');
      const row = host && host.querySelector('.pp-match-row');
      if (row) row.click();
    },
    () => {
      const d = document.querySelector('.why-moved .wm-calc'); if (d) d.open = true;
      const el = document.querySelector('.why-moved'); if (el) el.scrollIntoView({ block: 'start' });
    });

  // Back to the monthly breakdown for the calculation disclosure, which is
  // the one place the engine describes its own arithmetic.
  await shot('11-full-calculation.png',
    () => {
      matchFixReset();
      const b = document.querySelector('#tabrow .tab-btn[data-tab="power"]');
      if (b) b.click();
      selectedMonth = '2026-07'; minGames = 5; render();
      openMonthlyRatingBreakdown('Shaun', '2026-07');
      const t = document.getElementById('mrbFullCalcToggle'); if (t) t.click();
    },
    () => { const el = document.getElementById('mrbFullCalcBody'); if (el) el.scrollIntoView({ block: 'start' }); });

  const readme = ['# Review screenshots', '',
    `Captured from the **live beta record** as it stood on ${readAt}, by \`scripts/screenshots.js\`.`,
    'Review aids for CGPT and Shaun, not release documentation. Regenerate rather than edit.', '',
    'Taken from the live record on purpose: the three board decisions of 18 Sep moved most of the club,',
    'so a capture of the seeded fixture would show ratings that no longer exist.', ''];
  SHOTS.forEach((s) => { readme.push(`### ${s.title}`, '', `![${s.title}](${s.file})`, '', s.note, ''); });
  fs.writeFileSync(path.join(OUT, 'README.md'), readme.join('\n'));

  await browser.close();
  server.close();
  console.log(`\n${SHOTS.length} screenshots in docs/screenshots/. Page errors: ${errors.length}`);
  if (errors.length) { errors.slice(0, 5).forEach((e) => console.error('  ' + e)); process.exitCode = 1; }
}

if (require.main === module) main().catch((e) => { console.error(e); process.exitCode = 1; });
