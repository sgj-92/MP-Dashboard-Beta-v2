// ===================== FIXTURE FLOW =====================
// One fixture, one record, from request to result:
//
//   pending (request) --all four in--> confirmed (Upcoming) --admin links a result--> played
//                                            |
//                                            +--admin removes (confirmed step)--> removed
//
// with "can't play" as an exception a participant raises on themselves, which
// flags the fixture as needing attention rather than deleting it.
//
// The record is the same object throughout -- it is never copied into a new
// one when it changes state -- and every change is written to its `history`,
// so a fixture can always say who did what to it, and when.
//
// Decisions this module exists to hold (Shaun/CGPT, 27 Sep 2026, D1-D3):
//   - Players never delete a shared fixture. A participant may say they can't
//     play, for themselves only. Removal is an admin act, and only with an
//     explicit confirmation.
//   - Confirmations belong to the player responding. The requester starts
//     confirmed; nobody responds on anyone else's behalf.
//   - A recorded result NEVER closes a fixture by itself. The same four
//     players are a signal, not proof: repeat games, rescheduling and swapped
//     partnerships all look alike. Matching only ever produces candidates; an
//     admin decides, and a "still outstanding" decision is remembered so the
//     same result is not proposed for that fixture again.
//
// Pure: no storage, no screen. The app supplies who is acting and whether they
// are an admin; this module decides what that actor may do.
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.FixtureFlow = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const STATUS = { PENDING: 'pending', UPCOMING: 'confirmed', PLAYED: 'played', REMOVED: 'removed' };

  // How far a result can sit from a fixture's date and still be worth asking
  // about. Wide on purpose: this only decides whether a human is ASKED.
  const WINDOW = { EARLIEST_DAYS: -14, LATEST_DAYS: 30, UNDATED_DAYS: 45 };

  const DAY = 24 * 60 * 60 * 1000;
  const dayOf = (iso) => String(iso || '').slice(0, 10);
  const daysBetween = (from, to) => Math.round((Date.parse(to + 'T00:00:00Z') - Date.parse(from + 'T00:00:00Z')) / DAY);
  const same = (a, b) => String(a).toLowerCase() === String(b).toLowerCase();

  function isOpen(req) { return !!req && (req.status === STATUS.PENDING || req.status === STATUS.UPCOMING); }
  function isUpcoming(req) { return !!req && req.status === STATUS.UPCOMING; }

  // The participant's name as the fixture records it, or null.
  function participantName(req, name) {
    if (!req || !name) return null;
    return (req.players || []).find((p) => same(p, name)) || null;
  }

  function record(req, entry) {
    if (!Array.isArray(req.history)) req.history = [];
    req.history.push(entry);
  }

  // A new request. The requester is in by making it -- when they are one of
  // the players -- so a four-player request starts 1/4.
  function createRequest({ players, requestedBy, at, id, preferredDate }) {
    const when = at || new Date().toISOString();
    const confirmations = {};
    (players || []).forEach((n) => { confirmations[n] = false; });
    const requester = participantName({ players }, requestedBy);
    if (requester) confirmations[requester] = true;
    const req = {
      id: id || ('req_' + Date.parse(when) + '_' + Math.random().toString(36).slice(2, 8)),
      requestedBy, requestedAt: when,
      players: (players || []).slice(), preferredDate: preferredDate || '',
      confirmations,
      status: STATUS.PENDING,
      history: [{ at: when, by: requestedBy, action: 'requested' }],
    };
    if (requester) record(req, { at: when, by: requester, action: 'in' });
    if (req.players.length && req.players.every((n) => req.confirmations[n])) {
      req.status = STATUS.UPCOMING;
      record(req, { at: when, by: requestedBy, action: 'upcoming' });
    }
    return req;
  }

  // The acting player responds for themselves: 'in' or 'cant'. There is no
  // parameter for "on behalf of" -- the actor IS the player responding.
  function respond(req, actor, response, at) {
    const when = at || new Date().toISOString();
    if (!isOpen(req)) return { ok: false, reason: 'closed' };
    const me = participantName(req, actor);
    if (!me) return { ok: false, reason: 'not-participant' };
    if (response !== 'in' && response !== 'cant') return { ok: false, reason: 'bad-response' };
    if (!req.confirmations) req.confirmations = {};
    if (!req.cantPlay) req.cantPlay = {};
    if (response === 'in') {
      req.confirmations[me] = true;
      delete req.cantPlay[me];
      record(req, { at: when, by: me, action: 'in' });
      if (req.status === STATUS.PENDING && req.players.every((n) => req.confirmations[n])) {
        // The same record moves on. Nothing is copied.
        req.status = STATUS.UPCOMING;
        record(req, { at: when, by: me, action: 'upcoming' });
      }
    } else {
      req.confirmations[me] = false;
      req.cantPlay[me] = { at: when };
      record(req, { at: when, by: me, action: 'cant-play' });
    }
    return { ok: true, player: me };
  }

  // Who has said they can't play, in the order the fixture lists its players.
  function cantPlayers(req) {
    const c = (req && req.cantPlay) || {};
    return (req && req.players || []).filter((n) => c[n]);
  }
  function needsAttention(req) { return isOpen(req) && cantPlayers(req).length > 0; }
  function confirmedCount(req) { return (req.players || []).filter((n) => req.confirmations && req.confirmations[n]).length; }

  // Removal: an admin, and only once they have confirmed. Kept as a state
  // rather than erased, so the fixture's history survives it.
  function adminRemove(req, { isAdmin, confirmed, by, at, reason }) {
    if (!isAdmin) return { ok: false, reason: 'not-admin' };
    if (confirmed !== true) return { ok: false, reason: 'unconfirmed' };
    if (!isOpen(req)) return { ok: false, reason: 'closed' };
    const when = at || new Date().toISOString();
    req.status = STATUS.REMOVED;
    req.removedBy = by || 'admin';
    req.removedAt = when;
    record(req, { at: when, by: req.removedBy, action: 'removed', reason: reason || null });
    return { ok: true };
  }

  // "This was the game": the one way a fixture becomes played.
  function reconcile(req, { isAdmin, resultId, by, at }) {
    if (!isAdmin) return { ok: false, reason: 'not-admin' };
    if (!resultId) return { ok: false, reason: 'no-result' };
    if (!isUpcoming(req)) return { ok: false, reason: 'not-upcoming' };
    const when = at || new Date().toISOString();
    req.status = STATUS.PLAYED;
    req.playedMatchId = resultId;
    req.reconciledBy = by || 'admin';
    req.reconciledAt = when;
    record(req, { at: when, by: req.reconciledBy, action: 'played', resultId });
    return { ok: true };
  }

  // "Upcoming game is still outstanding": the fixture stays, and remembers that
  // this result is not it, so it is never proposed again.
  function keepOutstanding(req, { isAdmin, resultId, by, at }) {
    if (!isAdmin) return { ok: false, reason: 'not-admin' };
    if (!resultId) return { ok: false, reason: 'no-result' };
    const when = at || new Date().toISOString();
    if (!Array.isArray(req.notResults)) req.notResults = [];
    if (!req.notResults.includes(resultId)) req.notResults.push(resultId);
    record(req, { at: when, by: by || 'admin', action: 'not-this-result', resultId });
    return { ok: true };
  }

  // ---- candidates: evidence, never authority -----------------------------

  const setKey = (names, canon) => names.map(canon).sort().join('|');

  function samePartnerships(teams, sides, canon) {
    const pair = (t) => t.map(canon).sort().join('+');
    const a = teams.map(pair).sort().join(' v ');
    const b = sides.map(pair).sort().join(' v ');
    return a === b;
  }

  // Why this fixture might be this result -- or null if it is not credible
  // enough to ask anyone about.
  function evaluate(req, result, opts) {
    const o = opts || {};
    const canon = o.canon || ((n) => String(n).toLowerCase());
    if (!isUpcoming(req) || req.playedMatchId) return null;
    if (result.id && (req.notResults || []).includes(result.id)) return null;
    const resultPlayers = [...(result.winners || []), ...(result.losers || [])];
    if (!resultPlayers.length || setKey(req.players || [], canon) !== setKey(resultPlayers, canon)) return null;

    const arranged = dayOf(req.requestedAt);
    if (arranged && result.date < arranged) return null; // a game cannot fulfil a fixture arranged after it
    let dayDiff = null;
    if (req.preferredDate) {
      dayDiff = daysBetween(req.preferredDate, result.date);
      if (dayDiff < WINDOW.EARLIEST_DAYS || dayDiff > WINDOW.LATEST_DAYS) return null;
    } else if (arranged && daysBetween(arranged, result.date) > WINDOW.UNDATED_DAYS) {
      return null;
    }

    const reasons = ['Same four players'];
    let score = 50;
    let partnershipsMatch = null;
    if (Array.isArray(req.teams) && req.teams.length === 2 && req.teams[0].length && req.teams[1].length) {
      partnershipsMatch = samePartnerships(req.teams, [result.winners || [], result.losers || []], canon);
      if (partnershipsMatch) { score += 30; reasons.push('Same partnerships'); }
      else { score -= 10; reasons.push('Different partnerships'); }
    }
    if (dayDiff === 0) { score += 20; reasons.push('Played on the scheduled date'); }
    else if (dayDiff !== null) {
      if (Math.abs(dayDiff) <= 3) score += 10;
      reasons.push(`Played ${Math.abs(dayDiff)} day${Math.abs(dayDiff) === 1 ? '' : 's'} ${dayDiff > 0 ? 'after' : 'before'} the scheduled date`);
    } else {
      reasons.push('No scheduled date');
    }
    if (o.proposedFixtureId && o.proposedFixtureId === req.id) {
      score += 40;
      reasons.unshift('The result was submitted from this Upcoming game');
    }
    return { score, reasons, partnershipsMatch, dayDiff };
  }

  // Outstanding fixtures that might be this result, most likely first.
  function candidatesForResult(result, requests, opts) {
    return (requests || [])
      .map((req) => { const e = evaluate(req, result, opts); return e ? { fixture: req, ...e } : null; })
      .filter(Boolean)
      .sort((a, b) => b.score - a.score);
  }

  // Recorded results that might be this fixture. A result already linked to
  // another fixture has fulfilled that one and is not offered again.
  function candidatesForFixture(req, results, opts) {
    const taken = (opts && opts.linkedResultIds) || new Set();
    return (results || [])
      .filter((r) => !taken.has(r.id))
      .map((r) => { const e = evaluate(req, r, opts); return e ? { result: r, ...e } : null; })
      .filter(Boolean)
      .sort((a, b) => b.score - a.score);
  }

  function linkedResultIds(requests) {
    return new Set((requests || []).filter((r) => r.playedMatchId).map((r) => r.playedMatchId));
  }

  // The fixture in one line of plain text -- what a collapsed card says, and
  // what a future "share Upcoming" would send.
  function summaryLine(req, teamsOf) {
    const [a, b] = teamsOf ? teamsOf(req) : [req.players.slice(0, 2), req.players.slice(2, 4)];
    const title = (a.length && b.length) ? `${a.join(' & ')} vs ${b.join(' & ')}` : req.players.join(', ');
    const when = [req.preferredDate || 'Date TBC', req.preferredTime || null, req.location || 'Venue TBC'].filter(Boolean).join(' · ');
    return { title, when, confirmed: `${confirmedCount(req)}/${req.players.length} confirmed` };
  }

  return {
    STATUS, WINDOW,
    isOpen, isUpcoming, participantName,
    createRequest, respond, cantPlayers, needsAttention, confirmedCount,
    adminRemove, reconcile, keepOutstanding,
    evaluate, candidatesForResult, candidatesForFixture, linkedResultIds, summaryLine,
  };
});
