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
  rec.candidates.forEach((c) => c.stories.forEach((s) => assert.ok(s.line && s.evidence, 'every reason says why, in words and figures')));
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
  assert.match(tom.line, /^Next-best average performance against expectation/);
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
  assert.match(ann.line, /^No qualified player/, 'worded so it stays true when level');
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
  assert.match(done.winner.citation, /^September 2026: Overperformer\. .*\+16\.9pp vs expectation; won 5 of 6\.$/);
  assert.strictEqual(done.rulesVersion, POTM.RULES_VERSION);
  const before = JSON.stringify(POTM.history({ [MONTH]: done }));

  // The rules change: a story's floor and wording, and its figures.
  const story = POTM.STORY.overperformer;
  const saved = { floor: story.floor, lead: story.lead };
  try {
    story.floor = () => false; story.lead = 'Rewritten.';
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
      out.reasons = [...body().querySelectorAll('.potm-story-line')].length;
      out.ranked = /#\d|\b1st\b|\b2nd\b|\branked\b(?! by)/i.test(body().innerText.replace('not ranked', ''));
      // 6. Remove one, add another qualified player.
      body().querySelector('[data-potm-remove="Rishi"]').click();
      const add = document.getElementById('potmAdd');
      out.addable = [...add.options].map((o) => o.value).filter(Boolean);
      add.value = 'Len';
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
    assert.deepStrictEqual(r.cards, ['KC', 'Rishi', 'Tom']);
    assert.ok(r.reasons >= 3, 'each card says why');
    assert.strictEqual(r.ranked, false, 'nothing reads as a ranking');
    assert.ok(r.addable.includes('Len') && r.addable.includes('Rishi') && !r.addable.includes('KC'), 'qualified players not already on the list');
    assert.ok(!r.addable.includes('Antz'), 'Antz played 2: not addable');
    assert.deepStrictEqual(r.afterEdit, ['KC', 'Len', 'Tom']);
    assert.deepStrictEqual(r.shortlisted.shortlist.map((e) => [e.name, e.source]), [['KC', 'recommended'], ['Len', 'admin'], ['Tom', 'recommended']]);
    assert.deepStrictEqual(r.shortlisted.recommended, ['KC', 'Rishi', 'Tom'], 'what the app suggested is kept beside what Admin chose');
    assert.deepStrictEqual(r.publicShortlist, ['KC', 'Len', 'Tom']);
    assert.match(r.ask, /Confirm Tom as September 2026 Player of the Month\?/);
    assert.strictEqual(r.notYet, 'shortlisted', 'nothing is confirmed until Admin says yes');
    assert.deepStrictEqual(r.write.at(-1), ['2026-09', 'confirmed', 'Tom']);
    assert.match(r.winnerBox, /September 2026 Player of the Month\s+Tom/i);
    assert.match(r.winnerBox, /September 2026: Overperformer\. \+13\.5pp vs expectation; won 3 of 6\./, 'a next-best case is not described as second');
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
