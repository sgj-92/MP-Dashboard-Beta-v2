// ===================== FIXTURE FLOW =====================
// One fixture, one record, from request to result:
//
//   pending (request) --all four in--> confirmed (agreed) --admin links a result--> played
//                                            |
//                                            +--admin removes (confirmed step)--> removed
//
// An agreed fixture is shown in one of three stages, derived -- never stored:
//
//   Called Out       all in, court not booked
//   Upcoming         all in, court booked (`courtBookingMade === true`)
//   Needs attention  someone has backed out, or a replacement has not answered
//
// Court booking is its own fact, set only by an admin. A date, time or venue
// is a proposal, and never makes a fixture Upcoming by itself.
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

  // Stored status. `confirmed` is the agreed fixture, whichever stage it is
  // shown in; the name predates Called Out and is kept so stored records need
  // no migration.
  const STATUS = { PENDING: 'pending', AGREED: 'confirmed', PLAYED: 'played', REMOVED: 'removed' };

  // Where a fixture is shown. Derived from the record by `stage`.
  const STAGE = {
    PROPOSED: 'proposed', CALLED_OUT: 'called-out', UPCOMING: 'upcoming',
    ATTENTION: 'attention', PLAYED: 'played', REMOVED: 'removed',
  };

  // How far a result can sit from a fixture's date and still be worth asking
  // about. Wide on purpose: this only decides whether a human is ASKED.
  const WINDOW = { EARLIEST_DAYS: -14, LATEST_DAYS: 30, UNDATED_DAYS: 45 };

  const DAY = 24 * 60 * 60 * 1000;
  const dayOf = (iso) => String(iso || '').slice(0, 10);
  const daysBetween = (from, to) => Math.round((Date.parse(to + 'T00:00:00Z') - Date.parse(from + 'T00:00:00Z')) / DAY);
  const same = (a, b) => String(a).toLowerCase() === String(b).toLowerCase();

  function isOpen(req) { return !!req && (req.status === STATUS.PENDING || req.status === STATUS.AGREED); }
  // Agreed by all four at some point, and not yet played or removed -- Called
  // Out, Upcoming or Needs attention.
  function isAgreed(req) { return !!req && req.status === STATUS.AGREED; }

  // The participant's name as the fixture records it, or null.
  function participantName(req, name) {
    if (!req || !name) return null;
    return (req.players || []).find((p) => same(p, name)) || null;
  }

  function record(req, entry) {
    if (!Array.isArray(req.history)) req.history = [];
    req.history.push(entry);
  }

  function allIn(req) {
    return !!(req.players && req.players.length) && req.players.every((n) => req.confirmations && req.confirmations[n]);
  }

  // A request everyone has now accepted becomes an agreed fixture. The same
  // record moves on; nothing is copied.
  function settle(req, by, when) {
    if (req.status === STATUS.PENDING && allIn(req)) {
      req.status = STATUS.AGREED;
      req.agreedAt = when;
      record(req, { at: when, by, action: 'agreed' });
    }
  }

  // The court booking, as recorded. `undefined` on fixtures made before it
  // was recorded: unknown, and treated as not booked until an admin says.
  function isBooked(req) { return !!req && req.courtBookingMade === true; }
  function bookingRecorded(req) { return !!req && typeof req.courtBookingMade === 'boolean'; }

  function stage(req) {
    if (!req) return null;
    if (req.status === STATUS.REMOVED) return STAGE.REMOVED;
    if (req.status === STATUS.PLAYED) return STAGE.PLAYED;
    if (req.status !== STATUS.AGREED) return STAGE.PROPOSED;
    if (cantPlayers(req).length || !allIn(req)) return STAGE.ATTENTION;
    return isBooked(req) ? STAGE.UPCOMING : STAGE.CALLED_OUT;
  }

  // Why an agreed fixture needs attention: who backed out, and who has been
  // brought in and not yet answered.
  function attention(req) {
    if (!isAgreed(req)) return { backedOut: [], waiting: [] };
    const c = req.cantPlay || {};
    return {
      backedOut: req.players.filter((n) => c[n]),
      waiting: req.players.filter((n) => !c[n] && !(req.confirmations || {})[n]),
    };
  }

  // When the four agreed. Fixtures from before this was stored fall back to
  // when they were made, which for an admin-added game is the same moment.
  function agreedAt(req) {
    if (req.agreedAt) return req.agreedAt;
    const h = (req.history || []).find((e) => e.action === 'agreed' || e.action === 'upcoming' || e.action === 'added-to-upcoming');
    return (h && h.at) || req.requestedAt || null;
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
      courtBookingMade: false,
      status: STATUS.PENDING,
      history: [{ at: when, by: requestedBy, action: 'requested' }],
    };
    if (requester) record(req, { at: when, by: requester, action: 'in' });
    settle(req, requestedBy, when);
    return req;
  }

  // A game an admin records as already agreed -- in WhatsApp, on a call -- so
  // nobody is left to confirm it. Called Out unless the admin also says the
  // court is booked.
  function createAgreed({ players, teams, by, at, id, preferredDate, preferredTime, location, courtBookingMade }) {
    const when = at || new Date().toISOString();
    const confirmations = {};
    (players || []).forEach((n) => { confirmations[n] = true; });
    const req = {
      id: id || ('req_' + Date.parse(when) + '_' + Math.random().toString(36).slice(2, 8)),
      requestedBy: by, requestedAt: when,
      players: (players || []).slice(),
      preferredDate: preferredDate || '', preferredTime: preferredTime || '', location: location || '',
      confirmations,
      courtBookingMade: courtBookingMade === true,
      status: STATUS.AGREED, agreedAt: when,
      history: [{ at: when, by, action: 'added-agreed', courtBookingMade: courtBookingMade === true }],
    };
    if (Array.isArray(teams) && teams.length === 2) req.teams = [teams[0].slice(), teams[1].slice()];
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
      settle(req, me, when);
    } else {
      req.cantPlay[me] = { at: when, by: me, wasIn: !!req.confirmations[me] };
      req.confirmations[me] = false;
      record(req, { at: when, by: me, action: 'cant-play' });
    }
    return { ok: true, player: me };
  }

  // ---- admin maintenance --------------------------------------------------
  // Every change below edits the fixture in place and writes it to history.
  // None of them creates a replacement fixture.

  function adminGate(req, isAdmin) {
    if (!isAdmin) return 'not-admin';
    if (!isOpen(req)) return 'closed';
    return null;
  }

  // Court booking made: the one thing that moves a healthy fixture between
  // Called Out and Upcoming. Date, time and venue are left exactly as they are.
  function setCourtBooking(req, { isAdmin, booked, by, at }) {
    const refused = adminGate(req, isAdmin);
    if (refused) return { ok: false, reason: refused };
    if (typeof booked !== 'boolean') return { ok: false, reason: 'bad-booking' };
    if (req.courtBookingMade === booked) return { ok: true, changed: false };
    const when = at || new Date().toISOString();
    const was = req.courtBookingMade;
    req.courtBookingMade = booked;
    record(req, { at: when, by: by || 'admin', action: booked ? 'court-booked' : 'court-not-booked', ...(was === undefined ? { firstRecorded: true } : {}) });
    return { ok: true, changed: true };
  }

  // An admin records where a player stands: in, not answered yet, or backed
  // out. Backing out keeps the fixture, its booking and everyone else's
  // answers; the fixture needs attention until it is put right.
  function setAvailability(req, player, state, { isAdmin, by, at }) {
    const refused = adminGate(req, isAdmin);
    if (refused) return { ok: false, reason: refused };
    const me = participantName(req, player);
    if (!me) return { ok: false, reason: 'not-participant' };
    if (!['in', 'waiting', 'out'].includes(state)) return { ok: false, reason: 'bad-state' };
    const when = at || new Date().toISOString();
    const who = by || 'admin';
    if (!req.confirmations) req.confirmations = {};
    if (!req.cantPlay) req.cantPlay = {};
    const now = availabilityOf(req, me);
    if (now === state) return { ok: true, changed: false };
    if (state === 'out') {
      req.cantPlay[me] = { at: when, by: who, wasIn: !!req.confirmations[me] };
      req.confirmations[me] = false;
      record(req, { at: when, by: who, action: 'backed-out', player: me });
    } else if (state === 'in') {
      req.confirmations[me] = true;
      delete req.cantPlay[me];
      record(req, { at: when, by: who, action: 'marked-in', player: me });
      settle(req, who, when);
    } else {
      req.confirmations[me] = false;
      delete req.cantPlay[me];
      record(req, { at: when, by: who, action: 'marked-waiting', player: me });
    }
    return { ok: true, changed: true };
  }

  function markBackedOut(req, player, opts) { return setAvailability(req, player, 'out', opts); }

  function availabilityOf(req, name) {
    if ((req.cantPlay || {})[name]) return 'out';
    return (req.confirmations || {})[name] ? 'in' : 'waiting';
  }

  // Someone new takes a player's place, in the same seat on the same side.
  // They start unanswered -- they do not inherit anyone's "in" -- and the
  // player they replace is kept in `formerPlayers` with what they had said.
  function replacePlayer(req, out, incoming, { isAdmin, by, at, canon }) {
    const refused = adminGate(req, isAdmin);
    if (refused) return { ok: false, reason: refused };
    const c = canon || ((n) => String(n).toLowerCase());
    const leaving = participantName(req, out);
    const joining = String(incoming || '').trim();
    if (!leaving) return { ok: false, reason: 'not-participant' };
    if (!joining) return { ok: false, reason: 'no-player' };
    if (req.players.some((n) => c(n) === c(joining))) return { ok: false, reason: 'already-playing' };
    const when = at || new Date().toISOString();
    const who = by || 'admin';
    const cant = (req.cantPlay || {})[leaving];
    if (!Array.isArray(req.formerPlayers)) req.formerPlayers = [];
    req.formerPlayers.push({
      name: leaving, replacedBy: joining, at: when, by: who,
      hadConfirmed: !!((req.confirmations || {})[leaving] || (cant && cant.wasIn)),
      backedOutAt: cant ? cant.at : null,
    });
    req.players = req.players.map((n) => (n === leaving ? joining : n));
    if (Array.isArray(req.teams)) req.teams = req.teams.map((t) => t.map((n) => (n === leaving ? joining : n)));
    if (!req.confirmations) req.confirmations = {};
    delete req.confirmations[leaving];
    req.confirmations[joining] = false;
    if (req.cantPlay) delete req.cantPlay[leaving];
    record(req, { at: when, by: who, action: 'replaced', player: leaving, replacement: joining });
    return { ok: true };
  }

  // The fixture's sides, as a flat list of seats: side A then side B.
  function seats(req) {
    const t = req.teams;
    if (Array.isArray(t) && t.length === 2 && (t[0] || []).length && (t[1] || []).length) return [...t[0], ...t[1]];
    return req.players.slice();
  }
  function sidesOf(list, sideSize) { return [list.slice(0, sideSize), list.slice(sideSize)]; }

  // Manage fixture: one admin save, applied to the fixture in place.
  //   edit.seats         the players, side A then side B
  //   edit.date / time / venue
  //   edit.availability  { name: 'in' | 'waiting' | 'out' } for the players after the edit
  //   edit.courtBookingMade  true / false (omit to leave as it is)
  // Everything is checked before anything is changed, so a refused save
  // leaves the fixture exactly as it was.
  function adminEdit(req, edit, { isAdmin, by, at, canon }) {
    const refused = adminGate(req, isAdmin);
    if (refused) return { ok: false, reason: refused };
    const c = canon || ((n) => String(n).toLowerCase());
    const e = edit || {};
    const before = seats(req);
    const after = Array.isArray(e.seats) ? e.seats.map((n) => String(n || '').trim()) : before.slice();
    if (after.length !== before.length) return { ok: false, reason: 'bad-seats' };
    if (after.some((n) => !n)) return { ok: false, reason: 'missing-player' };
    if (new Set(after.map(c)).size !== after.length) return { ok: false, reason: 'duplicate-player' };
    if (e.courtBookingMade !== undefined && typeof e.courtBookingMade !== 'boolean') return { ok: false, reason: 'bad-booking' };
    const states = e.availability || {};
    if (Object.values(states).some((v) => !['in', 'waiting', 'out'].includes(v))) return { ok: false, reason: 'bad-state' };

    const when = at || new Date().toISOString();
    const who = by || 'admin';
    const opts = { isAdmin, by: who, at: when, canon: c };
    let changes = 0;

    // Who leaves and who joins, paired seat by seat where possible.
    const stays = (n) => after.some((m) => c(m) === c(n));
    const isNew = (n) => !before.some((m) => c(m) === c(n));
    const leaving = before.filter((n) => !stays(n));
    const joining = after.filter(isNew);
    const pairs = [];
    before.forEach((n, i) => {
      if (!stays(n) && isNew(after[i])) pairs.push([n, after[i]]);
    });
    const restOut = leaving.filter((n) => !pairs.some((p) => p[0] === n));
    const restIn = joining.filter((n) => !pairs.some((p) => p[1] === n));
    restOut.forEach((n, i) => pairs.push([n, restIn[i]]));
    for (const [o, n] of pairs) {
      const r = replacePlayer(req, o, n, opts);
      if (!r.ok) return r;
      changes++;
    }

    // Sides: recorded when they differ from what the fixture showed.
    const nowSeats = seats(req);
    const size = Math.floor(after.length / 2);
    const key = (list) => sidesOf(list, size).map((s) => s.map(c).sort().join('+')).join(' v ');
    if (key(nowSeats) !== key(after)) {
      const from = sidesOf(nowSeats, size);
      req.teams = sidesOf(after, size);
      record(req, { at: when, by: who, action: 'sides-changed', from, to: req.teams });
      changes++;
    }
    // Keep `players` in seat order too, so nothing reading the flat list
    // disagrees with the sides.
    req.players = after.slice();

    const details = [['date', 'preferredDate'], ['time', 'preferredTime'], ['venue', 'location']];
    const detailChange = {};
    details.forEach(([k, field]) => {
      if (e[k] === undefined) return;
      const v = String(e[k] || '').trim();
      if (v !== (req[field] || '')) { detailChange[k] = { from: req[field] || '', to: v }; req[field] = v; }
    });
    if (Object.keys(detailChange).length) {
      record(req, { at: when, by: who, action: 'details-changed', changes: detailChange });
      changes++;
    }

    for (const name of Object.keys(states)) {
      const me = participantName(req, name);
      if (!me) continue;
      const r = setAvailability(req, me, states[name], opts);
      if (r.changed) changes++;
    }

    if (e.courtBookingMade !== undefined) {
      const r = setCourtBooking(req, { isAdmin, booked: e.courtBookingMade, by: who, at: when });
      if (r.changed) changes++;
    }
    return { ok: true, changes };
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
    if (!isAgreed(req)) return { ok: false, reason: 'not-agreed' };
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
    if (!isAgreed(req) || req.playedMatchId) return null;
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
    STATUS, STAGE, WINDOW,
    isOpen, isAgreed, participantName,
    isBooked, bookingRecorded, stage, attention, agreedAt, availabilityOf, seats,
    createRequest, createAgreed, respond, cantPlayers, needsAttention, confirmedCount,
    setCourtBooking, setAvailability, markBackedOut, replacePlayer, adminEdit,
    adminRemove, reconcile, keepOutstanding,
    evaluate, candidatesForResult, candidatesForFixture, linkedResultIds, summaryLine,
  };
});
