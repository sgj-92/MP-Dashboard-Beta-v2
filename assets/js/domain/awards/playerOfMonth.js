// ===================== PLAYER OF THE MONTH =====================
// Money Padel recommends candidates; the group chooses the winner.
//
// This is NOT a leaderboard and there is no Player of the Month score. A month
// can be won in different ways, so the recommendation looks for the strongest
// CASE of each kind -- each one a single figure the club already sees, read
// for the month alone:
//
//   Overperformer       highest average performance against expectation
//   Biggest Improver    most Power Rating gained through play
//   Strongest Results   best win rate
//   Most Consistent     beat expectation in the largest share of matches
//   Upset Specialist    most wins as the underdog
//   Most Active         most matches
//
// Whoever leads a story is a candidate; players level on it are all
// candidates (no tie-break is invented to separate them). Each story has a
// floor below which it is not a case at all (a best win rate of 40% is not
// "Strongest Results"), and upsets count only in a month that was at or above
// expectation overall. Match count only ever earns "Most Active": playing
// more does not add to any other story, so volume cannot win the month on its
// own. When the leaders overlap so much that fewer than three players are
// named, the next-best player on each story (in the order above) is added
// until there are three, and says so. Nobody is cut to keep the list at five.
//
// Candidates are listed by name: the shortlist is the strongest cases, not a
// ranking. A player must have played MIN_MATCHES matches that month to be
// considered (Shaun, 4 Oct: the same 5 as the Monthly Performance podium and
// the Monthly Race).
//
// The second half of this module is the award record. A recommendation is
// recalculated whenever it is asked for; a finalised shortlist and a confirmed
// winner are SNAPSHOTS -- names, tiers, stories and figures as they stood --
// so a confirmed award never changes when ratings, tiers, a player's status or
// these rules do.
//
// Pure: no page, no app state, no storage.

(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.PlayerOfMonth = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  // Bump when the recommendation rules change. Stored with each shortlist, so a
  // past month records which rules suggested its candidates.
  const RULES_VERSION = 'potm-1';
  const MIN_MATCHES = 5;
  const SHORTLIST_MIN = 3;

  const STATE = { SHORTLISTED: 'shortlisted', CONFIRMED: 'confirmed' };
  const SOURCE = { RECOMMENDED: 'recommended', ADMIN: 'admin' };

  const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
    'August', 'September', 'October', 'November', 'December'];
  const monthLabel = (month) => `${MONTHS[Number(month.slice(5, 7)) - 1]} ${month.slice(0, 4)}`;

  const r1 = (v) => Math.round(v * 10) / 10;
  const signed = (v) => (v > 0 ? '+' : v < 0 ? '−' : '') + Math.abs(r1(v));
  const pctOf = (n, d) => (d ? r1((100 * n) / d) : 0);

  // ---- The stories --------------------------------------------------------
  // `value` is the one figure the story is about, already on the metrics.
  // Ties are judged on the figure as people see it (one decimal place), so two
  // players shown as "+12.4pp" are level, whatever the float noise says.
  const STORIES = [
    {
      key: 'overperformer', title: 'Overperformer',
      value: (m) => m.performancePct,
      floor: (v) => v > 0,
      evidence: (m) => `${signed(m.performancePct)}pp vs expectation`,
      lead: 'No qualified player beat the rating model’s expectation by more, on average.',
      next: 'Next-best average performance against expectation among qualified players.',
    },
    {
      key: 'improver', title: 'Biggest Improver',
      value: (m) => m.ratingChangePlay,
      floor: (v) => v > 0,
      evidence: (m) => `${signed(m.ratingChangePlay)} Power Rating from play`,
      lead: 'No qualified player gained more Power Rating through play.',
      next: 'Next-biggest Power Rating gain through play among qualified players.',
    },
    {
      key: 'results', title: 'Strongest Results',
      value: (m) => m.winPct,
      floor: (v) => v > 50,
      evidence: (m) => `Won ${m.wins} of ${m.games} (${Math.round(m.winPct)}%)`,
      lead: 'No qualified player had a better win rate.',
      next: 'Next-best win rate among qualified players.',
    },
    {
      key: 'consistent', title: 'Most Consistent',
      value: (m) => (m.ratedMatches ? pctOf(m.beatExpected, m.ratedMatches) : null),
      floor: (v) => v > 50,
      evidence: (m) => `Beat expectation in ${m.beatExpected} of ${m.ratedMatches}`,
      lead: 'No qualified player beat expectation in a larger share of their matches.',
      next: 'Next-best share of matches above expectation among qualified players.',
    },
    {
      key: 'upsets', title: 'Upset Specialist',
      value: (m) => m.underdogWins,
      floor: (v) => v >= 1,
      // One good evening in a month spent below expectation is not a case:
      // the month as a whole must be at or above expectation.
      gate: (m) => typeof m.performancePct === 'number' && m.performancePct >= 0,
      evidence: (m) => `${m.underdogWins} ${m.underdogWins === 1 ? 'win' : 'wins'} as the underdog`
        + (m.biggestUpset ? ` (biggest: expected ${Math.round(m.biggestUpset.expectedPct)}%)` : ''),
      lead: 'No qualified player won more matches as the underdog.',
      next: 'Next-most wins as the underdog among qualified players.',
    },
    {
      key: 'active', title: 'Most Active',
      value: (m) => m.games,
      floor: () => true,
      evidence: (m) => `${m.games} matches`,
      lead: 'Nobody played more matches.',
      next: 'Played the next-most matches this month.',
    },
  ];
  const STORY = Object.fromEntries(STORIES.map((s) => [s.key, s]));

  const qualifies = (metrics, minMatches = MIN_MATCHES) => (metrics.games || 0) >= minMatches;

  // Players on the best figure of a story, then those on the next-best, as
  // groups. Only figures that clear the story's floor are a case.
  function placings(story, pool) {
    const scored = pool
      .filter((p) => !story.gate || story.gate(p.metrics))
      .map((p) => ({ p, v: story.value(p.metrics) }))
      .filter((x) => typeof x.v === 'number' && !Number.isNaN(x.v) && story.floor(x.v))
      .map((x) => ({ ...x, v: r1(x.v) }));
    const values = [...new Set(scored.map((x) => x.v))].sort((a, b) => b - a);
    return values.slice(0, 2).map((v) => scored.filter((x) => x.v === v).map((x) => x.p));
  }

  // One player's story card entry.
  function storyEntry(story, player, place, group) {
    return {
      key: story.key,
      title: story.title,
      place,                                    // 'lead' | 'next'
      line: place === 'lead' ? story.lead : story.next,
      evidence: story.evidence(player.metrics),
      // Level with these players on the same figure -- shown, never broken.
      sharedWith: group.filter((g) => g.playerId !== player.playerId).map((g) => g.name),
    };
  }

  function cardFor(player, stories, month) {
    const lead = stories[0] || null;
    return {
      playerId: player.playerId,
      name: player.name,
      tier: player.metrics.tier || null,
      title: lead ? lead.title : 'Admin’s choice',
      stories,
      metrics: { ...player.metrics },
      citation: lead ? citationFor(player, lead, month) : '',
    };
  }

  // The award's sentence, from the story and its figures -- the default an
  // admin can edit before confirming. Lead lines are worded so they stay true
  // when players are level ("No qualified player ... more").
  function citationFor(player, story, month) {
    const m = player.metrics;
    const won = story.key === 'results' ? '' : `; won ${m.wins} of ${m.games}`;
    // A next-best story says what it is, not that it came second.
    const line = story.place === 'next' ? '' : `${story.line} `;
    return `${monthLabel(month)}: ${story.title}. ${line}${story.evidence}${won}.`;
  }

  // The recommendation for a month.
  //
  //   players: [{ playerId, name, archived, metrics }]
  //   metrics: { games, wins, draws, losses, winPct, performancePct,
  //              ratedMatches, beatExpected, ratingStart, ratingEnd,
  //              ratingChangePlay, ratingChangeClub, underdogWins,
  //              majorUpsetWins, biggestUpset, tier }
  function recommend({ month, players, minMatches = MIN_MATCHES }) {
    const all = (players || []).filter((p) => p && p.metrics);
    const qualifiedAll = all.filter((p) => qualifies(p.metrics, minMatches));
    // Someone who has left the group is not put to the group's vote. They are
    // named, so an admin can see why and restore them first.
    const archivedQualified = qualifiedAll.filter((p) => p.archived).map((p) => p.name).sort();
    const pool = qualifiedAll.filter((p) => !p.archived);

    const picks = new Map();
    const add = (player, entry) => {
      if (!picks.has(player.playerId)) picks.set(player.playerId, { player, stories: [] });
      picks.get(player.playerId).stories.push(entry);
    };
    const groups = STORIES.map((s) => ({ story: s, places: placings(s, pool) }));
    groups.forEach(({ story, places }) => {
      (places[0] || []).forEach((p) => add(p, storyEntry(story, p, 'lead', places[0])));
    });
    // Too few distinct cases: the next-best on each story, new names only.
    for (const { story, places } of groups) {
      if (picks.size >= SHORTLIST_MIN) break;
      (places[1] || []).filter((p) => !picks.has(p.playerId))
        .forEach((p) => add(p, storyEntry(story, p, 'next', places[1])));
    }

    const candidates = [...picks.values()]
      .map(({ player, stories }) => cardFor(player, stories, month))
      .sort((a, b) => a.name.localeCompare(b.name));

    let empty = null;
    if (!candidates.length) {
      if (!all.length) empty = `No matches were played in ${monthLabel(month)}.`;
      else if (archivedQualified.length) empty = `Only ${archivedQualified.join(', ')} played ${minMatches} or more matches in ${monthLabel(month)}, and ${archivedQualified.length > 1 ? 'they are' : 'is'} archived. Restore them in Admin › Player tags to consider them.`;
      else empty = `Nobody played ${minMatches} or more matches in ${monthLabel(month)}, so there is no shortlist. A shortlist needs players with enough games to judge a month on.`;
    }
    return {
      month,
      rulesVersion: RULES_VERSION,
      minMatches,
      qualified: pool.map((p) => p.name).sort((a, b) => a.localeCompare(b)),
      archivedQualified,
      notQualified: all.length - qualifiedAll.length,
      candidates,
      empty,
    };
  }

  // A qualified player an admin adds by hand. If the recommendation already
  // has a card for them, that card is used; otherwise they carry their figures
  // and no story.
  function adminEntry(recommendation, player, month) {
    const card = recommendation.candidates.find((c) => c.playerId === player.playerId);
    return { ...(card || cardFor(player, [], month)), source: card ? SOURCE.RECOMMENDED : SOURCE.ADMIN };
  }

  // ---- The award record ---------------------------------------------------
  // One record per month:
  //   { version, month, state, rulesVersion, minMatches,
  //     recommended: [playerId],        what the app suggested at the time
  //     shortlist: [card + source],     what the group votes on (snapshots)
  //     shortlistedAt, shortlistedBy,
  //     winner: { playerId, name, tier, title, citation, metrics } | null,
  //     winnerId: playerId | null,      top-level, for queries
  //     confirmedAt, confirmedBy,
  //     votes: null,                    reserved for in-app voting
  //     log: [{ action, by, at, ... }] }

  function finaliseShortlist({ previous, month, recommendation, entries, by, at }) {
    if (previous && previous.state === STATE.CONFIRMED) throw new Error('The winner is already confirmed. Reopen the month first.');
    const list = entries || [];
    if (!list.length) throw new Error('A shortlist needs at least one player.');
    const ids = list.map((e) => e.playerId);
    if (new Set(ids).size !== ids.length) throw new Error('A player is on the shortlist twice.');
    return {
      version: 1,
      month,
      state: STATE.SHORTLISTED,
      rulesVersion: recommendation ? recommendation.rulesVersion : RULES_VERSION,
      minMatches: recommendation ? recommendation.minMatches : MIN_MATCHES,
      recommended: recommendation ? recommendation.candidates.map((c) => c.playerId) : [],
      shortlist: list.map((e) => JSON.parse(JSON.stringify(e))),
      shortlistedAt: at, shortlistedBy: by || null,
      winner: null, winnerId: null, confirmedAt: null, confirmedBy: null,
      votes: (previous && previous.votes) || null,
      log: ((previous && previous.log) || []).concat([{ action: 'shortlisted', by: by || null, at, players: ids }]),
    };
  }

  function confirmWinner(record, { playerId, citation, by, at }) {
    if (!record || record.state !== STATE.SHORTLISTED) throw new Error('Finalise the shortlist before confirming a winner.');
    const entry = record.shortlist.find((e) => e.playerId === playerId);
    if (!entry) throw new Error('The winner must be on the shortlist.');
    const text = String(citation === undefined ? entry.citation : citation).trim();
    return {
      ...record,
      state: STATE.CONFIRMED,
      winner: {
        playerId: entry.playerId, name: entry.name, tier: entry.tier, title: entry.title,
        citation: text, stories: entry.stories, metrics: entry.metrics,
      },
      winnerId: entry.playerId,
      confirmedAt: at, confirmedBy: by || null,
      log: (record.log || []).concat([{ action: 'confirmed', by: by || null, at, playerId }]),
    };
  }

  // Corrects a mistaken confirmation. The shortlist stays; the withdrawn
  // winner is kept in the log, never silently lost.
  function reopen(record, { by, at }) {
    if (!record || record.state !== STATE.CONFIRMED) throw new Error('Only a confirmed month can be reopened.');
    return {
      ...record,
      state: STATE.SHORTLISTED,
      winner: null, winnerId: null, confirmedAt: null, confirmedBy: null,
      log: (record.log || []).concat([{ action: 'reopened', by: by || null, at, previousWinner: record.winner }]),
    };
  }

  // ---- Reading the awards --------------------------------------------------
  // `records` is an object keyed by month, or a list. `nameOf(playerId)` gives
  // a player's name today (a rename shows through); without one, or when the
  // id is unknown, the name stored with the award is used.

  const list = (records) => (Array.isArray(records) ? records : Object.values(records || {}));
  const isConfirmed = (r) => !!(r && r.state === STATE.CONFIRMED && r.winner && r.winnerId);

  function award(r, nameOf) {
    const current = nameOf ? nameOf(r.winnerId) : null;
    return {
      month: r.month, year: r.month.slice(0, 4), label: monthLabel(r.month),
      playerId: r.winnerId, name: current || r.winner.name,
      title: r.winner.title, citation: r.winner.citation, tier: r.winner.tier,
    };
  }

  // Every confirmed award, newest first.
  function history(records, { nameOf } = {}) {
    return list(records).filter(isConfirmed).sort((a, b) => (a.month < b.month ? 1 : -1)).map((r) => award(r, nameOf));
  }

  // One player's awards, oldest first ("Mar 2026 · Jun 2026 · Sep 2026").
  function awardsFor(records, playerId, { nameOf } = {}) {
    return list(records).filter((r) => isConfirmed(r) && r.winnerId === playerId)
      .sort((a, b) => (a.month < b.month ? -1 : 1)).map((r) => award(r, nameOf));
  }

  // Most awards: count, then name. Equal counts share a place.
  function awardCounts(records, { nameOf } = {}) {
    const by = {};
    history(records, { nameOf }).forEach((a) => {
      (by[a.playerId] = by[a.playerId] || { playerId: a.playerId, name: a.name, months: [] }).months.unshift(a.month);
    });
    const rows = Object.values(by).map((r) => ({ ...r, count: r.months.length }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
    let place = 0;
    return rows.map((r, i) => ({ ...r, place: i && rows[i - 1].count === r.count ? place : (place = i + 1) }));
  }

  return {
    RULES_VERSION, MIN_MATCHES, SHORTLIST_MIN, STATE, SOURCE, STORIES, STORY,
    monthLabel, qualifies, recommend, adminEntry, citationFor,
    finaliseShortlist, confirmWinner, reopen, isConfirmed,
    history, awardsFor, awardCounts,
  };
});
