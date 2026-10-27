// ===================== PLAYER OF THE MONTH =====================
// Money Padel recommends candidates; the group chooses the winner. The
// recommendation finds the strongest case of each kind among players with the
// month's minimum of matches, never ranks them, and never lets match volume
// carry a player beyond "Most Active". A finalised shortlist and a confirmed
// winner are snapshots: ratings, tiers, a player's status and these rules can
// all change without touching a confirmed award.

const test = require('node:test');
const assert = require('node:assert');
const POTM = require('../assets/js/domain/awards/playerOfMonth.js');
const Engine = require('../assets/js/ratingEngine.js');
const MonthlyRace = require('../assets/js/monthlyRace.js');
const H = require('./helpers/uiHarness.js');

const maybe = H.available() ? test : test.skip;
const NOW = '2026-10-04T12:00:00.000Z';
const MONTH = '2026-09';

// A player's month, with ordinary figures unless told otherwise.
function player(name, over = {}, extra = {}) {
  const games = over.games === undefined ? 6 : over.games;
  const wins = over.wins === undefined ? Math.floor(games / 2) : over.wins;
  return {
    playerId: name, name, archived: false, ...extra,
    metrics: {
      games, wins, draws: 0, losses: games - wins, winPct: games ? Math.round((1000 * wins) / games) / 10 : 0,
      performancePct: 0, ratedMatches: games, beatExpected: Math.floor(games / 2),
      ratingStart: 1500, ratingEnd: 1500, ratingChangePlay: 0, ratingChangeClub: 0,
      underdogWins: 0, majorUpsetWins: 0, biggestUpset: null, tier: 'B', ...over,
    },
  };
}
const names = (rec) => rec.candidates.map((c) => c.name);
const storiesOf = (rec, name) => rec.candidates.find((c) => c.name === name).stories.map((s) => s.key);

// ---------- 1. eligibility ----------

test('eligibility is the month\'s minimum of 5 matches -- the Monthly Performance podium and the Monthly Race', () => {
  assert.strictEqual(POTM.MIN_MATCHES, 5);
  assert.strictEqual(POTM.MIN_MATCHES, MonthlyRace.MIN_MATCHES, 'the same minimum as the Monthly Race');
  const journey = [0, 1, 2, 3, 4].map((i) => ({ eventType: Engine.EVENT.MATCH_UPDATE, effectiveDate: `2026-09-0${i + 1}`, playerId: 'A', actualScore: 0.6, preMatchExpectedScore: 0.5 }));
  const at = (n) => Engine.calculateMonthlyPerformance(journey.slice(0, n))[0].podiumEligible;
  assert.deepStrictEqual([at(4), at(5)], [false, true], 'and the engine\'s own podium line');

  // Four astonishing matches do not make a candidate; five ordinary ones can.
  const rec = POTM.recommend({ month: MONTH, players: [
    player('Flash', { games: 4, wins: 4, performancePct: 40, ratingChangePlay: 60, beatExpected: 4, underdogWins: 3 }),
    player('Steady', { games: 5, wins: 3, performancePct: 2, ratingChangePlay: 3 }),
  ] });
  assert.ok(!names(rec).includes('Flash'), 'one great week is not a month');
  assert.deepStrictEqual(names(rec), ['Steady']);
  assert.deepStrictEqual(rec.qualified, ['Steady']);
  assert.strictEqual(rec.notQualified, 1);
});

// ---------- 2. activity does not dominate ----------

test('the most active player is one case among several -- volume earns "Most Active" and nothing else', () => {
  const field = [
    player('Rishi', { games: 18, wins: 9, performancePct: 1.0, ratingChangePlay: 4, beatExpected: 9 }),
    player('Shaun', { games: 6, wins: 4, performancePct: 9.1, ratingChangePlay: 12, beatExpected: 4 }),
    player('KC', { games: 6, wins: 5, performancePct: 4.0, ratingChangePlay: 14, beatExpected: 5 }),
    player('Len', { games: 7, wins: 4, performancePct: 3.0, ratingChangePlay: 6, beatExpected: 4, underdogWins: 2 }),
  ];
  const rec = POTM.recommend({ month: MONTH, players: field });
  assert.ok(rec.candidates.length >= 3, 'several different cases');
  assert.deepStrictEqual(storiesOf(rec, 'Rishi'), ['active']);
  assert.ok(names(rec).includes('Shaun') && names(rec).includes('KC') && names(rec).includes('Len'));

  // Twice the matches at the same rates: still only "Most Active".
  const busier = field.map((p) => (p.name !== 'Rishi' ? p
    : player('Rishi', { games: 36, wins: 18, performancePct: 1.0, ratingChangePlay: 4, beatExpected: 18 })));
  assert.deepStrictEqual(storiesOf(POTM.recommend({ month: MONTH, players: busier }), 'Rishi'), ['active']);
});

test('the shortlist is the strongest cases, listed by name -- not a ranking -- and stops at the genuine ones', () => {
  const rec = POTM.recommend({ month: MONTH, players: [
    player('Zed', { performancePct: 9, ratingChangePlay: 10 }),
    player('Abe', { games: 12 }),
    player('Mo', { wins: 5, beatExpected: 5 }),
  ] });
  assert.deepStrictEqual(names(rec), ['Abe', 'Mo', 'Zed'], 'alphabetical, whatever each case is');
  rec.candidates.forEach((c) => assert.ok(!('rank' in c) && !('score' in c), 'no rank and no hidden score'));
  rec.candidates.forEach((c) => c.stories.forEach((s) => assert.ok(s.title && s.line, 'every reason has a label and a sentence')));
  // A story below its floor is not a case: a best win rate of 50% is not "Strongest Results".
  const flat = POTM.recommend({ month: MONTH, players: [player('A'), player('B'), player('C')] });
  flat.candidates.forEach((c) => assert.ok(!c.stories.some((s) => s.key === 'results' || s.key === 'improver' || s.key === 'overperformer')));
  // An upset in a month spent below expectation is not a case either.
  const upset = POTM.recommend({ month: MONTH, players: [player('Lucky', { underdogWins: 2, performancePct: -6 }), player('B', { games: 7 })] });
  assert.ok(!upset.candidates.some((c) => c.stories.some((s) => s.key === 'upsets')));
});

test('when one player leads almost everything, the next-best on each story makes up three -- and says so', () => {
  const rec = POTM.recommend({ month: MONTH, players: [
    player('KC', { games: 9, wins: 8, performancePct: 16.9, ratingChangePlay: 19.4, beatExpected: 8, underdogWins: 2 }),
    player('Tom', { games: 6, wins: 4, performancePct: 13.5, ratingChangePlay: 16.7, beatExpected: 4 }),
    player('Osh', { games: 7, wins: 4, performancePct: 6.3, ratingChangePlay: 8, beatExpected: 5 }),
  ] });
  assert.deepStrictEqual(names(rec), ['KC', 'Osh', 'Tom']);
  const tom = rec.candidates.find((c) => c.name === 'Tom').stories[0];
  assert.strictEqual(tom.place, 'next');
  assert.strictEqual(tom.line, 'Beat expectations by +13.5pp on average.', 'what he did, not where he came');
});

// ---------- 10, 11. empty months and ties ----------

test('no qualifying players: no shortlist, and Admin is told why', () => {
  const rec = POTM.recommend({ month: MONTH, players: [player('A', { games: 3 }), player('B', { games: 4 })] });
  assert.deepStrictEqual(rec.candidates, []);
  assert.match(rec.empty, /Nobody played 5 or more matches in September 2026/);
  assert.match(POTM.recommend({ month: MONTH, players: [] }).empty, /No matches were played in September 2026/);
  const left = POTM.recommend({ month: MONTH, players: [player('Gone', { games: 8 }, { archived: true }), player('B', { games: 2 })] });
  assert.deepStrictEqual(left.candidates, []);
  assert.deepStrictEqual(left.archivedQualified, ['Gone']);
  assert.match(left.empty, /Only Gone played 5 or more matches.*archived/);
});

test('players level on a story are both recommended; nothing is invented to separate them', () => {
  const rec = POTM.recommend({ month: MONTH, players: [
    player('Ann', { performancePct: 12.4 }),
    player('Bea', { performancePct: 12.4 }),
    player('Cal', { performancePct: 3, games: 8 }),
  ] });
  ['Ann', 'Bea'].forEach((n) => assert.ok(storiesOf(rec, n).includes('overperformer'), `${n} shares the lead`));
  const ann = rec.candidates.find((c) => c.name === 'Ann').stories.find((s) => s.key === 'overperformer');
  assert.deepStrictEqual(ann.sharedWith, ['Bea']);
  assert.strictEqual(ann.line, 'Beat expectations by +12.4pp on average.', 'about the player, and true for both');
});

// ---------- 7, 8, 9. the award record ----------

function confirmedSeptember() {
  const rec = POTM.recommend({ month: MONTH, players: [
    player('KC', { games: 6, wins: 5, performancePct: 16.9, ratingChangePlay: 19.4, beatExpected: 5, tier: 'A' }),
    player('Rishi', { games: 17 }),
    player('Tom', { performancePct: 13.5, ratingChangePlay: 16.7 }),
  ] });
  const short = POTM.finaliseShortlist({ month: MONTH, recommendation: rec, entries: rec.candidates.map((c) => ({ ...c, source: 'recommended' })), by: 'Shaun', at: '2026-10-02T10:00:00Z' });
  return { rec, short, done: POTM.confirmWinner(short, { playerId: 'KC', by: 'Shaun', at: '2026-10-03T10:00:00Z' }) };
}

test('a confirmed winner is a snapshot: its story, figures and shortlist are kept, and recommendation changes cannot touch it', () => {
  const { short, done } = confirmedSeptember();
  assert.strictEqual(short.state, 'shortlisted');
  assert.deepStrictEqual(short.recommended, ['KC', 'Rishi', 'Tom']);
  assert.strictEqual(done.state, 'confirmed');
  assert.strictEqual(done.winnerId, 'KC');
  assert.strictEqual(done.winner.tier, 'A');
  assert.strictEqual(done.winner.metrics.performancePct, 16.9);
  assert.strictEqual(done.winner.citation, 'September 2026 — Overperformer · Biggest Improver. Beat expectations by +16.9pp on average. Gained +19.4 Power Rating through play.');
  assert.strictEqual(done.rulesVersion, POTM.RULES_VERSION);
  const before = JSON.stringify(POTM.history({ [MONTH]: done }));

  // The rules change: a story's floor and wording, and its figures.
  const story = POTM.STORY.overperformer;
  const saved = { floor: story.floor, line: story.line };
  try {
    story.floor = () => false; story.line = () => 'Rewritten.';
    assert.ok(!POTM.recommend({ month: MONTH, players: [player('KC', { performancePct: 16.9 })] }).candidates[0].stories.some((s) => s.key === 'overperformer'));
    assert.strictEqual(JSON.stringify(POTM.history({ [MONTH]: done })), before, 'the award reads exactly as confirmed');
  } finally { Object.assign(story, saved); }

  // Guards: the winner comes from the shortlist; a confirmed month is reopened, not overwritten.
  assert.throws(() => POTM.confirmWinner(short, { playerId: 'Nobody' }), /on the shortlist/);
  assert.throws(() => POTM.finaliseShortlist({ previous: done, month: MONTH, entries: short.shortlist }), /already confirmed/);
  const reopened = POTM.reopen(done, { by: 'Shaun', at: '2026-10-04T00:00:00Z' });
  assert.strictEqual(reopened.state, 'shortlisted');
  assert.strictEqual(reopened.log.at(-1).previousWinner.playerId, 'KC', 'a withdrawn winner is kept in the log');
});

test('awards are queryable: history newest first, a player\'s months, and most awards with shared places', () => {
  const rec = (month, id, name) => ({ month, state: 'confirmed', winnerId: id, winner: { playerId: id, name, title: 'Overperformer', citation: 'x', tier: 'B' } });
  const records = {
    '2026-06': rec('2026-06', 'Eli', 'Eli'), '2026-07': rec('2026-07', 'Rishi', 'Rishi'),
    '2026-08': rec('2026-08', 'Shaun', 'Shaun'), '2026-09': rec('2026-09', 'Shaun', 'Shaun'),
    '2026-10': { month: '2026-10', state: 'shortlisted', winner: null, winnerId: null },
  };
  assert.deepStrictEqual(POTM.history(records).map((a) => `${a.label} ${a.name}`),
    ['September 2026 Shaun', 'August 2026 Shaun', 'July 2026 Rishi', 'June 2026 Eli'], 'only confirmed months, newest first');
  assert.deepStrictEqual(POTM.awardsFor(records, 'Shaun').map((a) => a.month), ['2026-08', '2026-09']);
  assert.deepStrictEqual(POTM.awardCounts(records).map((r) => [r.place, r.name, r.count]), [[1, 'Shaun', 2], [2, 'Eli', 1], [2, 'Rishi', 1]]);
  // A rename shows through; an unknown id keeps the stored name.
  assert.strictEqual(POTM.history(records, { nameOf: (id) => (id === 'Shaun' ? 'Shaun J' : null) })[0].name, 'Shaun J');
  assert.strictEqual(POTM.history(records, { nameOf: () => null })[3].name, 'Eli');
});

// ---------- in the app ----------

async function openApp(options = {}) {
  const app = await H.open({ now: NOW, ...options });
  await app.run(() => { isUnlocked = true; adminRole = 'owner'; currentUserName = 'Shaun'; });
  return app;
}

maybe('every figure is the month\'s own, from the record: League games, the engine\'s expectation, month-boundary ratings', async () => {
  const app = await openApp();
  try {
    const r = await app.run(() => {
      const month = '2026-09';
      const rows = potmPlayerMonths(month);
      const facts = Object.values(V3_MATCH_FACTS).filter((f) => f.date.slice(0, 7) === month);
      const league = computeMonthlySummaryStats(month);
      const bad = [];
      rows.forEach((p) => {
        const m = p.metrics;
        const row = MonthlyViews.playerMonth(MONTHLY_VIEWS, month, p.name);
        const mine = facts.map((f) => MatchFacts.forPlayer(f, p.name)).filter(Boolean);
        // 3. Overperformance: the engine's monthly performance, which is the
        // mean of this month's stored residuals -- and nothing else.
        const mean = Math.round(1000 * mine.reduce((s, x) => s + x.mine.residual, 0) / mine.length) / 10;
        if (m.performancePct !== row.performancePct || Math.abs(m.performancePct - mean) > 0.05) bad.push(`${p.name} perf ${m.performancePct} vs ${row.performancePct} / ${mean}`);
        if (m.beatExpected !== mine.filter((x) => x.mine.residual > 0).length) bad.push(`${p.name} beat`);
        if (m.ratedMatches !== mine.length) bad.push(`${p.name} rated`);
        // 4. Improvement: the month's own boundaries, club decisions taken out.
        const before = V3_JOURNEY.filter((e) => e.playerId === p.name && e.effectiveDate < month + '-01' && typeof (e.postMatchRating ?? e.newPowerRating) === 'number');
        const inMonth = V3_JOURNEY.filter((e) => e.playerId === p.name && e.effectiveDate.slice(0, 7) === month && e.eventType === 'MATCH_UPDATE');
        const start = before.length ? MonthlyViews.chronological(before).at(-1) : null;
        const startRating = start ? (start.postMatchRating ?? start.newPowerRating) : inMonth[0].preMatchRating;
        if (Math.abs(m.ratingStart - startRating) > 0.06) bad.push(`${p.name} start ${m.ratingStart} vs ${startRating}`);
        if (Math.abs(m.ratingChangePlay - (row.ratingChange - row.reassessmentChange)) > 0.06) bad.push(`${p.name} change`);
        if (m.tier !== row.tierAtMonthEnd) bad.push(`${p.name} tier`);
        // Results: the League's own month.
        const L = league[p.name];
        if (m.games !== L.games || m.wins !== L.wins || m.draws !== L.draws || m.winPct !== L.winpct) bad.push(`${p.name} results`);
      });
      // A club decision in the month moves the rating without a ball being
      // hit: it is not improvement.
      const kcRow = MONTHLY_VIEWS.byMonth[month].rows.find((x) => x.playerId === 'KC');
      const saved = { ...kcRow };
      kcRow.ratingChange += 25; kcRow.endRating += 25; kcRow.reassessmentChange += 25;
      const withDecision = potmPlayerMonths(month).find((p) => p.name === 'KC').metrics;
      Object.assign(kcRow, saved);
      return { bad, n: rows.length, kc: rows.find((p) => p.name === 'KC').metrics, withDecision };
    });
    assert.deepStrictEqual(r.bad, []);
    assert.ok(r.n > 10);
    assert.strictEqual(r.kc.games, 6);
    assert.strictEqual(r.kc.tier, 'A', 'the tier held at the month\'s close');
    assert.strictEqual(r.withDecision.ratingChangePlay, r.kc.ratingChangePlay, 'a reassessment is not form');
    assert.strictEqual(r.withDecision.ratingChangeClub, 25);
    assert.deepStrictEqual(app.pageErrors, []);
  } finally { await app.close(); }
});

maybe('a recommendation reads only the target month: a match outside it changes nothing, one inside it does', async () => {
  const app = await openApp();
  try {
    const r = await app.run(() => {
      const snap = () => JSON.stringify(potmPlayerMonths('2026-09').find((p) => p.name === 'Rishi').metrics);
      const before = snap();
      const facts = Object.values(V3_MATCH_FACTS).find((f) => f.date.slice(0, 7) === '2026-09' && f.byPlayer.Rishi);
      const shifted = (date) => ({ ...JSON.parse(JSON.stringify(facts)), matchId: 'potm-probe', date });
      V3_MATCH_FACTS['potm-probe'] = shifted('2026-10-01');
      const october = snap();
      V3_MATCH_FACTS['potm-probe'] = shifted('2026-08-31');
      const august = snap();
      V3_MATCH_FACTS['potm-probe'] = shifted('2026-09-30');
      const september = snap();
      delete V3_MATCH_FACTS['potm-probe'];
      return { before, october, august, september };
    });
    assert.strictEqual(r.october, r.before, 'October is not September');
    assert.strictEqual(r.august, r.before, 'nor is August');
    assert.notStrictEqual(r.september, r.before, 'a September match is read');
    assert.deepStrictEqual(app.pageErrors, []);
  } finally { await app.close(); }
});

maybe('Admin reviews the cases, removes one, adds another qualified player, finalises, and confirms the vote\'s winner', async () => {
  const app = await openApp();
  try {
    const r = await app.run(async () => {
      const body = () => document.querySelector('[data-acc="potm"] .admin-acc-body');
      const tick = () => new Promise((res) => setTimeout(res, 30));
      legacyTabBtn('manage').click(); renderManage();
      document.querySelector('[data-acc-toggle="potm"]').click();
      const out = { month: document.getElementById('potmMonth').value };
      out.cards = [...body().querySelectorAll('[data-potm-card]')].map((c) => c.dataset.potmCard);
      out.reasons = [...body().querySelectorAll('.potm-reason-line')].length;
      out.ranked = /#\d|\b1st\b|\b2nd\b|\branked\b(?! by)/i.test(body().innerText.replace('not ranked', ''));
      // 6. Remove one, add another qualified player.
      body().querySelector('[data-potm-remove="Rishi"]').click();
      const add = document.getElementById('potmAdd');
      out.addable = [...add.options].map((o) => o.value).filter(Boolean);
      add.value = 'Tom';
      document.getElementById('potmAddBtn').click();
      out.afterEdit = [...body().querySelectorAll('[data-potm-card]')].map((c) => c.dataset.potmCard);
      document.getElementById('potmFinalise').click(); await tick();
      const shortlisted = JSON.parse(JSON.stringify(potmRecordFor('2026-09')));
      // Everyone sees the shortlist, in no order.
      legacyTabBtn('summary').click(); summaryMonth = '2026-09'; summaryMode = 'information'; renderSummary();
      out.publicShortlist = !!document.getElementById('potmPublicShortlist')
        && [...document.querySelectorAll('#summaryContent [data-potm-card]')].map((c) => c.dataset.potmCard);
      // 7. The vote is in.
      legacyTabBtn('manage').click(); adminOpenSections.potm = true; renderManage();
      body().querySelector('[data-potm-pick="Tom"]').click();
      document.getElementById('potmConfirm').click();
      out.ask = document.getElementById('potmConfirmAsk').innerText;
      out.notYet = potmRecordFor('2026-09').state;
      document.getElementById('potmConfirmYes').click(); await tick();
      out.write = window.__writes.filter((w) => w.collection === 'playerOfTheMonth').map((w) => [w.id, w.doc.state, w.doc.winnerId]);
      out.winnerBox = document.getElementById('potmWinner') && document.getElementById('potmWinner').innerText;
      return { ...out, shortlisted };
    });
    assert.strictEqual(r.month, '2026-09', 'opens on the last finished month');
    assert.deepStrictEqual(r.cards, ['KC', 'Len', 'Rishi']);
    assert.ok(r.reasons >= 3, 'each card says why');
    assert.strictEqual(r.ranked, false, 'nothing reads as a ranking');
    assert.ok(r.addable.includes('Tom') && r.addable.includes('Rishi') && !r.addable.includes('KC'), 'qualified players not already on the list');
    assert.ok(!r.addable.includes('Antz'), 'Antz played 2: not addable');
    assert.deepStrictEqual(r.afterEdit, ['KC', 'Len', 'Tom']);
    assert.deepStrictEqual(r.shortlisted.shortlist.map((e) => [e.name, e.source]), [['KC', 'recommended'], ['Len', 'recommended'], ['Tom', 'admin']]);
    assert.deepStrictEqual(r.shortlisted.recommended, ['KC', 'Len', 'Rishi'], 'what the app suggested is kept beside what Admin chose');
    assert.deepStrictEqual(r.publicShortlist, ['KC', 'Len', 'Tom']);
    assert.match(r.ask, /Confirm Tom as September 2026 Player of the Month\?/);
    assert.strictEqual(r.notYet, 'shortlisted', 'nothing is confirmed until Admin says yes');
    assert.deepStrictEqual(r.write.at(-1), ['2026-09', 'confirmed', 'Tom']);
    assert.match(r.winnerBox, /September 2026 Player of the Month\s+Tom/i);
    assert.match(r.winnerBox, /September 2026\. 6 matches · 3 wins · 50% win rate · \+13\.5pp vs expectation\./, 'an Admin-added winner still has their month in the citation');
    assert.deepStrictEqual(app.pageErrors, []);
  } finally { await app.close(); }
});

// A September award as stored, made under older rules and naming a player
// the current rules would not suggest -- which is the point.
const STORED = {
  version: 1, month: '2026-09', state: 'confirmed', rulesVersion: 'potm-0', minMatches: 5,
  recommended: ['KC', 'Rishi', 'Jords'],
  shortlist: [
    { playerId: 'KC', name: 'KC', tier: 'A', title: 'Overperformer', stories: [], metrics: { games: 6, wins: 5, draws: 0, losses: 1, winPct: 83.3 }, citation: '', source: 'recommended' },
    { playerId: 'Jords', name: 'Jords', tier: 'B', title: 'Upset Specialist', stories: [], metrics: { games: 11, wins: 3, draws: 3, losses: 5, winPct: 27.3 }, citation: '', source: 'recommended' },
  ],
  shortlistedAt: '2026-10-01T09:00:00Z', shortlistedBy: 'Shaun',
  winner: { playerId: 'Jords', name: 'Jords', tier: 'B', title: 'Upset Specialist', citation: 'Two famous wins as the underdog.', stories: [], metrics: { games: 11, wins: 3, draws: 3, losses: 5, winPct: 27.3, performancePct: -6.1 } },
  winnerId: 'Jords', confirmedAt: '2026-10-02T09:00:00Z', confirmedBy: 'Shaun', votes: null, log: [],
};

maybe('a confirmed award persists, shows everywhere the month names one, and is never recalculated', async () => {
  const app = await openApp({ collections: { playerOfTheMonth: { '2026-09': STORED } } });
  try {
    const r = await app.run(() => {
      legacyTabBtn('summary').click(); summaryMonth = '2026-09'; summaryMode = 'information'; renderSummary();
      const info = document.getElementById('potmPublicWinner').innerText;
      const whatsapp = buildWhatsAppSummaryText('2026-09', monthlyInformation('2026-09').stats, monthlyInformation('2026-09'));
      openSheet('Jords');
      const profile = (document.getElementById('ppPotmAwards') || {}).textContent;
      closeSheet();
      return {
        info, whatsapp: whatsapp.split('\n').slice(-1)[0], profile,
        recommendedNow: potmRecommendation('2026-09').candidates.map((c) => c.name),
        history: potmHistory().map((a) => [a.month, a.name, a.citation]),
        awards: potmAwardsFor('Jords').map((a) => a.month),
        headline: potmHeadline('2026-09').text,
      };
    });
    assert.match(r.info, /Jords 🏆/);
    assert.match(r.info, /Two famous wins as the underdog\./);
    assert.strictEqual(r.whatsapp, 'Jords 🏆🏆🏆');
    assert.strictEqual(r.profile, '👑 Player of the Month · Sep 2026');
    assert.ok(!r.recommendedNow.includes('Jords'), 'today\'s rules would not suggest him...');
    assert.deepStrictEqual(r.history, [['2026-09', 'Jords', 'Two famous wins as the underdog.']], '...and the award stands as confirmed');
    assert.deepStrictEqual(r.awards, ['2026-09']);
    assert.strictEqual(r.headline, 'Jords');
    assert.deepStrictEqual(app.pageErrors, []);
  } finally { await app.close(); }
});

maybe('archiving a winner leaves the award intact; an archived player is not suggested, and Admin is told why', async () => {
  const app = await openApp({ collections: { playerOfTheMonth: { '2026-09': STORED } } });
  try {
    const r = await app.run(async () => {
      await setPlayerStatus('Jords', 'archived');
      await setPlayerStatus('KC', 'archived');
      const rec = potmRecommendation('2026-09');
      legacyTabBtn('summary').click(); summaryMonth = '2026-09'; summaryMode = 'information'; renderSummary();
      const info = document.getElementById('potmPublicWinner').innerText;
      openSheet('Jords');
      const profile = (document.getElementById('ppPotmAwards') || {}).textContent;
      closeSheet();
      const history = potmHistory().map((a) => [a.name, a.tier]);
      // A month still being decided: the archived player is named for Admin.
      potmRecordsState = {};
      legacyTabBtn('manage').click(); potmOpenMonth('2026-09'); adminOpenSections.potm = true; renderManage();
      return {
        status: PLAYERS.find((p) => p.name === 'Jords').status,
        history, info, profile,
        candidates: rec.candidates.map((c) => c.name), archivedQualified: rec.archivedQualified,
        note: (document.getElementById('potmArchivedNote') || {}).textContent || '',
        addable: [...(document.getElementById('potmAdd') || { options: [] }).options].map((o) => o.value),
        unknown: /Unknown Player/i.test(document.body.textContent),
      };
    });
    assert.strictEqual(r.status, 'archived');
    assert.deepStrictEqual(r.history, [['Jords', 'B']], 'the award, under his name and the tier he held');
    assert.match(r.info, /Jords/);
    assert.strictEqual(r.profile, '👑 Player of the Month · Sep 2026');
    assert.ok(!r.candidates.includes('KC') && !r.candidates.includes('Jords'));
    assert.deepStrictEqual(r.archivedQualified, ['Jords', 'KC']);
    assert.match(r.note, /Jords, KC played enough to qualify but are archived/);
    assert.ok(!r.addable.includes('KC'));
    assert.strictEqual(r.unknown, false);
    assert.deepStrictEqual(app.pageErrors, []);
  } finally { await app.close(); }
});

maybe('the points leader is no longer called Player of the Month anywhere', async () => {
  const app = await openApp();
  try {
    const r = await app.run(() => {
      const info = monthlyInformation('2026-09');
      legacyTabBtn('summary').click(); summaryMonth = '2026-09'; summaryMode = 'information'; renderSummary();
      const block = document.getElementById('potmPublicNone');
      return {
        leader: info.mostWins[0].names[0],
        state: info.playerOfMonth.state,
        none: block && block.textContent,
        whatsapp: buildWhatsAppSummaryText('2026-09', info.stats, info).split('\n').slice(-1)[0],
        current: potmPublicHtml('2026-10'),
      };
    });
    assert.strictEqual(r.state, 'none');
    assert.match(r.none, /Not chosen yet/);
    assert.strictEqual(r.whatsapp, 'Not chosen yet');
    assert.notStrictEqual(r.whatsapp, r.leader);
    assert.match(r.current, /Chosen by the group once the month is over/);
    assert.deepStrictEqual(app.pageErrors, []);
  } finally { await app.close(); }
});

maybe('an unfinished month can be looked at but not finalised', async () => {
  const app = await openApp({ now: '2026-09-20T12:00:00.000Z' });
  try {
    const r = await app.run(() => {
      legacyTabBtn('manage').click(); potmOpenMonth('2026-09'); adminOpenSections.potm = true; renderManage();
      return { disabled: document.getElementById('potmFinalise').disabled, text: document.querySelector('[data-acc="potm"]').innerText };
    });
    assert.strictEqual(r.disabled, true);
    assert.match(r.text, /September 2026 isn't over yet/);
    assert.deepStrictEqual(app.pageErrors, []);
  } finally { await app.close(); }
});

// ===================== Nominations: simpler words, the month's competitions =====================
// (Shaun, 4 Oct, second brief.) Each reason is about the player -- "Beat
// expectations by +7.2pp on average." -- never a comparison with the dataset;
// the month's League, Merit and Monthly Race tier winners are nominated from
// the competitions' own tables; a card shows its strongest three reasons, and
// several competition wins are told once.

const WORDING = /No qualified player|Nobody played more|Next-best|among qualified|rating model/i;

test('every reason speaks about the player, in one short sentence with its figure', () => {
  const m = player('Shaun', { games: 20, wins: 13, performancePct: 7.2, ratingChangePlay: 13.3, ratedMatches: 5, beatExpected: 4, underdogWins: 3 }).metrics;
  const lines = Object.fromEntries(POTM.STORIES.map((s) => [s.key, s.line(m, MONTH)]));
  assert.deepStrictEqual(lines, {
    overperformer: 'Beat expectations by +7.2pp on average.',
    improver: 'Gained +13.3 Power Rating through play.',
    results: 'Won 13 of 20 matches — 65%.',
    upsets: '3 wins as the underdog.',
    consistent: 'Beat expectation in 4 of 5 matches.',
    active: 'Played 20 matches in September.',
  });
  assert.strictEqual(POTM.STORY.upsets.line({ underdogWins: 1 }), '1 win as the underdog.');
  assert.strictEqual(POTM.supportLine(m), '20 matches · 13 wins · 65% win rate · +7.2pp vs expectation');
  Object.values(lines).forEach((l) => assert.doesNotMatch(l, WORDING));
});

test('a League, Merit or Monthly Race tier winner is nominated for it, and a win is a reason, not the award', () => {
  const field = (wins) => [
    player('Champ', { games: 5, wins: 2 }, {}),
    player('Busy', { games: 12 }),
    player('Sharp', { performancePct: 6, ratingChangePlay: 9, wins: 4, beatExpected: 4 }),
  ].map((p) => (p.name === 'Champ' ? { ...p, metrics: { ...p.metrics, competitionWins: wins } } : p));
  const cases = [
    ['league', 'League Winner', 'Top of Tier B in the September League.'],
    ['merit', 'Merit Winner', 'Top of Tier B in September Merit.'],
    ['race', 'Monthly Race Winner', 'Won Tier B in September’s Monthly Race.'],
  ];
  cases.forEach(([competition, title, line]) => {
    const rec = POTM.recommend({ month: MONTH, players: field([{ competition, tier: 'B', sharedWith: [] }]) });
    const champ = rec.candidates.find((c) => c.name === 'Champ');
    assert.ok(champ, `${competition}: a tier winner is a candidate on that alone`);
    assert.deepStrictEqual(champ.stories.map((s) => [s.title, s.line]), [[title, line]]);
    assert.ok(rec.candidates.length > 1, 'others are still nominated: the group decides');
  });
  // Without the win, an ordinary month is no case at all.
  assert.ok(!POTM.recommend({ month: MONTH, players: field([]) }).candidates.some((c) => c.name === 'Champ'));
  // Joint winners are both told so.
  const joint = POTM.recommend({ month: '2026-06', players: [player('Len', { games: 10 }, {})].map((p) => ({ ...p, metrics: { ...p.metrics, competitionWins: [{ competition: 'league', tier: 'A', sharedWith: ['Kaz'] }] } })) });
  assert.strictEqual(joint.candidates[0].stories[0].line, 'Joint top of Tier A in the June League.');
});

test('several wins are told once, and a card keeps to its strongest three reasons', () => {
  const star = player('Rishi', { games: 17, wins: 13, performancePct: 9, ratingChangePlay: 20, beatExpected: 12, underdogWins: 3 });
  star.metrics.competitionWins = ['race', 'league', 'merit'].map((competition) => ({ competition, tier: 'B', sharedWith: [] }));
  const rec = POTM.recommend({ month: MONTH, players: [star, player('A'), player('B')] });
  const card = rec.candidates.find((c) => c.name === 'Rishi');
  assert.strictEqual(card.stories.length, 3, 'three reasons shown');
  assert.deepStrictEqual(card.stories.map((s) => s.title), ['Triple Crown', 'Overperformer', 'Biggest Improver']);
  assert.strictEqual(card.stories[0].line, 'Won the League, Merit and the Monthly Race in Tier B in September.', 'one line, not three');
  assert.deepStrictEqual(card.alsoTitles, ['Strongest Results', 'Upset Specialist', 'Most Consistent', 'Most Active'], 'the rest by name only');
  assert.strictEqual(card.title, 'Triple Crown');
  // Two competitions are a Month Champion; a mover's wins name their tiers.
  const two = POTM.competitionStory({ competitionWins: [{ competition: 'race', tier: 'A' }, { competition: 'league', tier: 'A' }] }, MONTH);
  assert.deepStrictEqual([two.title, two.line], ['Month Champion', 'Won the League and the Monthly Race in Tier A in September.']);
  const moved = POTM.competitionStory({ competitionWins: [{ competition: 'league', tier: 'A' }, { competition: 'race', tier: 'B' }] }, MONTH);
  assert.strictEqual(moved.line, 'Won the League (Tier A) and the Monthly Race (Tier B) in September.');
});

test('the same month always gives the same nominations, in name order, with no score anywhere', () => {
  const field = () => [
    player('Zed', { performancePct: 9 }, {}), player('Abe', { games: 14 }), player('Mo', { wins: 5, beatExpected: 5 }),
  ].map((p, i) => (i === 2 ? { ...p, metrics: { ...p.metrics, competitionWins: [{ competition: 'merit', tier: 'C', sharedWith: [] }] } } : p));
  const a = POTM.recommend({ month: MONTH, players: field() });
  const b = POTM.recommend({ month: MONTH, players: field().reverse() });
  assert.deepStrictEqual(a, b, 'deterministic, whatever order players arrive in');
  assert.deepStrictEqual(a.candidates.map((c) => c.name), ['Abe', 'Mo', 'Zed']);
  const keys = JSON.stringify(a);
  assert.doesNotMatch(keys, /"(score|rank|points|weight)"/, 'no hidden score or rank on a nomination');
});

maybe('the month\'s competition winners come from the competitions\' own tables, for that month', async () => {
  const app = await openApp();
  try {
    const r = await app.run(() => {
      // The tables as the Board Pack shows them -- each module's own top row.
      const tops = (month) => {
        const src = boardPackSources();
        const first = (data, key) => Object.fromEntries(data.tiers.map((t) => [t.tier, t.rows[0][key]]));
        return {
          league: first(src.league(month, { tier: 'all', top: 1 }), 'name'),
          merit: first(src.merit(month, { tier: 'all', top: 1 }), 'playerId'),
          race: first(src.race(month, { tier: 'all', top: 1 }), 'playerId'),
        };
      };
      const sept = potmCompetitionWinners('2026-09');
      const june = potmCompetitionWinners('2026-06');
      const reasons = (month) => Object.fromEntries(potmRecommendation(month).candidates.map((c) => [c.name, c.stories.map((s) => s.key)]));
      const lines = ['2026-06', '2026-07', '2026-08', '2026-09'].flatMap((m) => potmRecommendation(m).candidates.flatMap((c) => c.stories.map((s) => s.line)));
      const shaunJune = potmPlayerMonths('2026-06').find((p) => p.name === 'Shaun').metrics.competitionWins;
      return { tops: { sept: tops('2026-09'), june: tops('2026-06') }, sept, june, septReasons: reasons('2026-09'), juneReasons: reasons('2026-06'), lines, shaunJune,
        shaunNow: PLAYERS.find((p) => p.name === 'Shaun').tier,
        lenJune: potmRecommendation('2026-06').candidates.find((c) => c.name === 'Len').stories[0].line };
    });
    // Each winner is the table's own #1 in that tier (or level with it).
    for (const month of ['sept', 'june']) {
      for (const c of ['league', 'merit', 'race']) {
        Object.entries(r.tops[month][c]).forEach(([tier, first]) => assert.ok(r[month][c][tier].includes(first), `${month} ${c} ${tier}: ${first}`));
      }
    }
    // September: Len tops Tier A's League; KC wins A's Merit and Race; Rishi all three in B.
    assert.deepStrictEqual([r.sept.league.A, r.sept.merit.A, r.sept.race.A, r.sept.league.B, r.sept.merit.B, r.sept.race.B],
      [['Len'], ['KC'], ['KC'], ['Rishi'], ['Rishi'], ['Rishi']]);
    assert.deepStrictEqual(r.sept.race.C, [], 'nobody qualified in Tier C\'s Race, so it has no winner');
    assert.deepStrictEqual(r.septReasons.Len, ['league']);
    assert.strictEqual(r.septReasons.KC[0], 'champion');
    assert.deepStrictEqual(r.septReasons.Rishi, ['triple', 'active']);
    // June is June's: a joint League top on points and goal difference, and
    // Shaun winning Tier C's Race -- the tier he held then, not today's.
    assert.deepStrictEqual(r.june.league.A.slice().sort(), ['Kaz', 'Len']);
    assert.strictEqual(r.lenJune, 'Joint top of Tier A in the June League.');
    assert.deepStrictEqual(r.june.race.B, ['Max']);
    assert.ok(r.juneReasons.Max.includes('race') && !(r.juneReasons.Rishi || []).includes('race'));
    assert.deepStrictEqual(r.shaunJune, [{ competition: 'race', tier: 'C', sharedWith: [] }]);
    assert.notStrictEqual(r.shaunNow, 'C');
    r.lines.forEach((l) => assert.doesNotMatch(l, WORDING, l));
    assert.deepStrictEqual(app.pageErrors, []);
  } finally { await app.close(); }
});

maybe('Admin\'s card carries the controls quietly; the players\' shortlist is just the nominations', async () => {
  const app = await openApp();
  try {
    const r = await app.run(async () => {
      const tick = () => new Promise((res) => setTimeout(res, 30));
      legacyTabBtn('manage').click(); adminOpenSections.potm = true; potmOpenMonth('2026-09'); renderManage();
      const add = document.getElementById('potmAdd'); add.value = 'Tom'; document.getElementById('potmAddBtn').click();
      const tomAdmin = document.querySelector('[data-potm-card="Tom"]');
      const kcAdmin = document.querySelector('[data-potm-card="KC"]');
      const admin = {
        added: !!tomAdmin.querySelector('.potm-added'), support: tomAdmin.querySelector('.potm-support').textContent,
        remove: !!kcAdmin.querySelector('[data-potm-remove]'),
        removeIsQuiet: parseFloat(getComputedStyle(kcAdmin.querySelector('.potm-remove')).fontSize) < parseFloat(getComputedStyle(kcAdmin.querySelector('.potm-reason-line')).fontSize),
        nameBig: parseFloat(getComputedStyle(kcAdmin.querySelector('.potm-name')).fontSize),
        also: (kcAdmin.querySelector('.potm-also') || {}).textContent || '',
      };
      document.getElementById('potmFinalise').click(); await tick();
      legacyTabBtn('summary').click(); summaryMonth = '2026-09'; summaryMode = 'information'; renderSummary();
      const box = document.getElementById('summaryContent');
      const cards = [...box.querySelectorAll('[data-potm-card]')];
      const tom = box.querySelector('[data-potm-card="Tom"]');
      return { admin, public: {
        names: cards.map((c) => c.dataset.potmCard),
        controls: box.querySelectorAll('[data-potm-remove], [data-potm-pick], .potm-also').length,
        text: cards.map((c) => c.innerText).join('\n'),
        tomSupport: tom.querySelector('.potm-support').textContent, tomReasons: tom.querySelectorAll('.potm-reason').length,
        intro: document.getElementById('potmPublicShortlist').textContent,
        rishi: [...box.querySelectorAll('[data-potm-card="Rishi"] .potm-reason-title')].map((e) => e.textContent),
      } };
    });
    assert.strictEqual(r.admin.added, true, 'Admin can see who was added by hand');
    assert.strictEqual(r.admin.support, '6 matches · 3 wins · 50% win rate · +13.5pp vs expectation', 'and their month, so the card is not empty');
    assert.strictEqual(r.admin.remove, true);
    assert.strictEqual(r.admin.removeIsQuiet, true, 'the control is smaller than the nomination');
    assert.ok(r.admin.nameBig >= 18, 'the name leads');
    assert.match(r.admin.also, /^Also: /, 'Admin sees the reasons not shown');
    assert.deepStrictEqual(r.public.names, ['KC', 'Len', 'Rishi', 'Tom'], 'in name order, no positions');
    assert.strictEqual(r.public.controls, 0, 'no Admin controls or extras for players');
    assert.doesNotMatch(r.public.text, /Added by Admin|Remove|qualified|recommend|No qualified|#\d/i);
    assert.strictEqual(r.public.tomSupport, '6 matches · 3 wins · 50% win rate · +13.5pp vs expectation');
    assert.strictEqual(r.public.tomReasons, 0);
    assert.match(r.public.intro, /^September's nominees, in no particular order/);
    assert.deepStrictEqual(r.public.rishi, ['Triple Crown', 'Most Active']);
    assert.deepStrictEqual(app.pageErrors, []);
  } finally { await app.close(); }
});

maybe('an award confirmed under the earlier rules reads exactly as it was confirmed', async () => {
  const OLD = JSON.parse(JSON.stringify(STORED));
  OLD.rulesVersion = 'potm-1';
  OLD.shortlist[0].stories = [{ key: 'overperformer', title: 'Overperformer', place: 'lead', line: 'No qualified player beat the rating model’s expectation by more, on average.', evidence: '+16.9pp vs expectation', sharedWith: [] }];
  const app = await openApp({ collections: { playerOfTheMonth: { '2026-09': OLD } } });
  try {
    const r = await app.run(() => {
      legacyTabBtn('manage').click(); adminOpenSections.potm = true; potmOpenMonth('2026-09'); renderManage();
      const winner = document.getElementById('potmWinner').innerText;
      const kc = document.querySelector('[data-potm-card="KC"]').innerText;
      legacyTabBtn('summary').click(); summaryMonth = '2026-09'; summaryMode = 'information'; renderSummary();
      return { winner, kc, info: document.getElementById('potmPublicWinner').innerText, history: potmHistory().map((a) => [a.name, a.title, a.citation]) };
    });
    assert.match(r.winner, /Jords/);
    assert.match(r.winner, /Two famous wins as the underdog\./);
    assert.match(r.kc, /No qualified player beat the rating model’s expectation by more, on average\. \+16\.9pp vs expectation/, 'its shortlist as it was, words and all');
    assert.deepStrictEqual(r.history, [['Jords', 'Upset Specialist', 'Two famous wins as the underdog.']]);
    assert.match(r.info, /Jords 🏆/);
    assert.deepStrictEqual(app.pageErrors, []);
  } finally { await app.close(); }
});

// ===================== Sharing the nominees =====================
// One picture of every nominee, for the group's WhatsApp: painted from the
// players' version of the cards and handed to the phone's share sheet, like
// the Match Result Card.

maybe('Admin and players can share one picture of all the nominees', async () => {
  const app = await openApp();
  try {
    const r = await app.run(async () => {
      const tick = () => new Promise((res) => setTimeout(res, 30));
      const calls = [];
      const until = async (n) => { for (let k = 0; k < 200 && calls.length < n; k++) await tick(); await tick(); };
      const real = CardPainter.share;
      CardPainter.share = async (files, meta) => { calls.push({ files: files.map((x) => ({ name: x.name, type: x.type, size: x.size })), meta }); return calls.length === 1 ? 'ready' : 'shared'; };
      try {
        legacyTabBtn('manage').click(); adminOpenSections.potm = true; potmOpenMonth('2026-09'); renderManage();
        const add = document.getElementById('potmAdd'); add.value = 'Tom'; document.getElementById('potmAddBtn').click();
        const view = potmNomineesView('2026-09', potmShareCards('2026-09'));
        const brand = await CardPainter.loadImage('assets/brand/mp-mark.svg');
        const cv = CardPainter.nominees(view, { brand });
        // Admin, before finalising: the list being drawn up.
        document.querySelector('[data-acc="potm"] [data-potm-share]').click(); await until(1);
        const label = document.querySelector('[data-acc="potm"] [data-potm-share]').textContent;
        document.querySelector('[data-acc="potm"] [data-potm-share]').click(); await until(2);
        const message = document.querySelector('[data-acc="potm"] .potm-share-msg').textContent;
        // Players, from the finalised shortlist.
        document.getElementById('potmFinalise').click(); await tick();
        isUnlocked = false;
        legacyTabBtn('summary').click(); summaryMonth = '2026-09'; summaryMode = 'information'; renderSummary();
        const publicBtn = document.querySelector('#summaryContent [data-potm-share]');
        publicBtn.click(); await until(3);
        // Nothing to share before there is a list.
        summaryMonth = '2026-08'; renderSummary();
        const noneYet = !!document.getElementById('potmPublicNone') && !document.querySelector('#summaryContent [data-potm-share]');
        return { view, size: [cv.width, cv.height], calls, label, message, publicBtn: !!publicBtn, noneYet };
      } finally { CardPainter.share = real; }
    });
    assert.deepStrictEqual(r.view.cards.map((c) => c.name), ['KC', 'Len', 'Rishi', 'Tom'], 'every nominee, in name order');
    assert.strictEqual(r.view.title, 'September nominees');
    assert.deepStrictEqual(r.view.cards[2].reasons.map((x) => x.title), ['Triple Crown', 'Most Active']);
    assert.strictEqual(r.view.cards[3].support, '6 matches · 3 wins · 50% win rate · +13.5pp vs expectation', 'an Admin-added nominee still shows their month');
    assert.doesNotMatch(JSON.stringify(r.view), /Added by Admin|Remove|admin|alsoTitles|No qualified/i, 'the players\' version only');
    assert.strictEqual(r.size[0], 1080);
    assert.ok(r.size[1] >= 1350, 'at least the 4:5 card; taller when the nominees need it');
    assert.strictEqual(r.calls.length, 3);
    assert.strictEqual(r.calls[0].files.length, 1, 'one picture with everyone on it');
    assert.strictEqual(r.calls[0].files[0].type, 'image/png');
    assert.ok(r.calls[0].files[0].size > 20000, 'a real picture');
    assert.strictEqual(r.calls[0].files[0].name, 'money-padel-player-of-the-month-2026-09-nominees.png');
    assert.strictEqual(r.calls[0].meta.text, 'Player of the Month — September nominees: KC, Len, Rishi, Tom. Cast your vote!');
    assert.strictEqual(r.label, 'Tap to share', 'a share sheet that needs a fresh tap gets one');
    assert.deepStrictEqual(r.calls[1].files, r.calls[0].files, 'the tap shares the picture already made');
    assert.strictEqual(r.message, 'Shared.');
    assert.ok(r.publicBtn, 'players can share the finalised shortlist too');
    assert.strictEqual(r.calls[2].meta.text, r.calls[0].meta.text);
    assert.ok(r.noneYet);
    assert.deepStrictEqual(app.pageErrors, []);
  } finally { await app.close(); }
});
