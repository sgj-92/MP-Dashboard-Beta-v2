// ===================== PLAY VIEW =====================
// Which fixtures a player sees where, for Play's two lists -- My Games and
// Club (Player Experience Reset, Phase 2; docs/design/
// CLAUDE_DESIGN_IMPLEMENTATION_MAP.md §4.6-4.7). Pure: it takes the fixtures
// and reads them only through FixtureFlow, so every stage, order and rule is
// the lifecycle module's own. The Play badge counts `needsYou` from here, so
// the badge and the list can never disagree.
//
//   myGames(requests, viewer, now) -> {
//     needsYou:        [{ req, why: 'answer' | 'attention' }]   waiting on this player
//     upcoming:        court booked, soonest first
//     calledOut:       agreed, no court yet, newest first
//     waitingOnOthers: requests they are in (or made) that others must answer
//     archived:        their call-outs that ran out of time
//   }
//   club(requests, now) -> { attention, upcoming, calledOut, requests, archived }
//
// A player who has backed out of a game, or said they can't play a request,
// has nothing left to do on it, so it is not theirs to act on.

(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory(require('../../fixtureFlow.js'));
  else root.PlayView = factory(root.FixtureFlow);
})(typeof self !== 'undefined' ? self : this, function (FF) {
  const S = FF.STAGE;
  const same = (a, b) => !!a && !!b && String(a).toLowerCase() === String(b).toLowerCase();

  function myGames(requests, viewer, now) {
    const at = now || new Date().toISOString();
    const out = { needsYou: [], upcoming: [], calledOut: [], waitingOnOthers: [], archived: [] };
    if (!viewer) return out;
    (requests || []).forEach((r) => {
      if (!FF.isOpen(r)) return;
      const me = FF.participantName(r, viewer);
      const answered = !!me && !!(r.confirmations || {})[me];
      const cant = !!me && !!(r.cantPlay || {})[me];
      if (r.status === FF.STATUS.PENDING) {
        if (me && !answered && !cant) out.needsYou.push({ req: r, why: 'answer' });
        else if ((me && answered) || same(r.requestedBy, viewer)) out.waitingOnOthers.push(r);
        return;
      }
      if (!me || cant) return;
      const st = FF.stage(r, at);
      // An agreed game they have not confirmed (a replacement): theirs to answer.
      if (!answered) out.needsYou.push({ req: r, why: 'answer' });
      else if (st === S.ATTENTION) out.needsYou.push({ req: r, why: 'attention' });
      else if (st === S.UPCOMING) out.upcoming.push(r);
      else if (st === S.CALLED_OUT) out.calledOut.push(r);
      else if (st === S.ARCHIVED) out.archived.push(r);
    });
    out.needsYou.sort((a, b) => FF.requestOrder(a.req, b.req));
    out.upcoming.sort(FF.upcomingOrder);
    out.calledOut.sort(FF.calledOutOrder);
    out.waitingOnOthers.sort(FF.requestOrder);
    out.archived.sort(FF.archivedOrder(at));
    return out;
  }

  function club(requests, now) {
    const at = now || new Date().toISOString();
    const open = (requests || []).filter(FF.isOpen);
    const agreed = open.filter(FF.isAgreed);
    const byStage = (st) => agreed.filter((r) => FF.stage(r, at) === st);
    return {
      attention: byStage(S.ATTENTION).sort(FF.requestOrder),
      upcoming: byStage(S.UPCOMING).sort(FF.upcomingOrder),
      calledOut: byStage(S.CALLED_OUT).sort(FF.calledOutOrder),
      requests: open.filter((r) => r.status === FF.STATUS.PENDING).sort(FF.requestOrder),
      archived: byStage(S.ARCHIVED).sort(FF.archivedOrder(at)),
    };
  }

  // Where a fixture is on the four-step way to a game (the detail stepper):
  // Requested 0 · Agreed 1 · Booked 2 · Played 3. Needs attention stays at the
  // step it reached; it is a state, not a fifth step.
  const STEPS = ['Requested', 'Agreed', 'Booked', 'Played'];
  function step(req, now) {
    const st = FF.stage(req, now);
    if (st === S.PLAYED) return 3;
    if (st === S.UPCOMING) return 2;
    if (st === S.ATTENTION) return FF.isBooked(req) ? 2 : 1;
    if (st === S.CALLED_OUT || st === S.ARCHIVED) return 1;
    if (st === S.PROPOSED) return 0;
    return -1;
  }

  return { myGames, club, STEPS, step };
});
