// ===================== MATCH ATTRIBUTION =====================
// Who put a rated game on the record, for the line under each game ("Submitted
// by Tom") and the match export.
//
// The v3 match documents are rating facts only -- they have never had a field
// for the submitter -- and approving a submission removes it once the game is
// rated. So when the Games log moved onto the v3 record (17 Sep) every game
// read "Submitted by unknown". The answer comes, in order, from:
//
//   stored       the club's `moneypadel_match_attribution` document, written
//                when a submission is approved (from 6 Oct)
//   HISTORY      the 150 games of the export the v3 record was seeded from: the 16 Sep
//                export (money_padel_matches_2026-09-16.csv), whose "Submitted
//                By" column is what the Games log showed before the move
//   the journey  a game approved in the app between those two lost its
//                submitter, but the Rating Journey still says who approved it;
//                a game brought over from the old app's match export says so
//
// and otherwise the submitter is honestly not recorded.
//
// PURE: the stored map and the journey are passed in.

(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.MatchAttribution = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const STORAGE_KEY = 'moneypadel_match_attribution';
  const HISTORICAL = 'Historical record';
  const NOT_RECORDED = null;

  // Journey `source` values that say how a game reached the record.
  const SOURCE_APPROVED = 'Approved from a submission';
  const SOURCE_IMPORTED = /^production match-facts export/;

  // From the 16 Sep export: submitter -> match ids.
  const HISTORY_GROUPS = [
    [HISTORICAL, [
      '2026-06-02-1', '2026-06-02-2', '2026-06-03-1', '2026-06-04-1', '2026-06-04-2',
      '2026-06-05-1', '2026-06-07-1', '2026-06-07-2', '2026-06-07-3', '2026-06-09-1',
      '2026-06-09-2', '2026-06-09-3', '2026-06-10-1', '2026-06-14-1', '2026-06-14-2',
      '2026-06-16-1', '2026-06-16-2', '2026-06-18-1', '2026-06-21-1', '2026-06-21-2',
      '2026-06-22-1', '2026-06-22-2', '2026-06-23-1', '2026-06-24-1', '2026-06-26-1',
      '2026-06-28-1', '2026-06-29-1', '2026-06-30-1', '2026-06-30-2', '2026-06-30-3',
      '2026-06-30-4', '2026-07-02-1', '2026-07-02-2', '2026-07-02-3', '2026-07-02-4',
      '2026-07-03-1', '2026-07-03-2', '2026-07-05-1', '2026-07-05-2', '2026-07-05-3',
      '2026-07-06-1', '2026-07-07-1', '2026-07-08-1', '2026-07-08-2', '2026-07-09-1',
      '2026-07-10-1', '2026-07-11-1', '2026-07-12-1', '2026-07-12-2', '2026-07-12-3',
      '2026-07-12-4', '2026-07-13-1', '2026-07-13-2', '2026-07-13-3', '2026-07-14-1',
      '2026-07-15-1', '2026-07-15-2', '2026-07-16-1', '2026-07-16-2', '2026-07-17-1',
      '2026-07-17-2', '2026-07-17-3', '2026-07-18-1', '2026-07-18-2', '2026-07-20-1',
      '2026-07-20-2', '2026-07-21-1', '2026-07-21-2', '2026-07-22-1', '2026-07-22-2',
      '2026-07-25-1', '2026-07-25-2', '2026-07-25-3', '2026-07-27-1', '2026-07-30-1',
      '2026-07-30-2', '2026-07-30-3', '2026-08-01-1', '2026-08-02-1', '2026-08-02-2',
      '2026-08-03-1', '2026-08-04-1', '2026-08-04-2', '2026-08-05-1', '2026-08-05-2',
      '2026-08-06-1', '2026-08-08-1', '2026-08-08-2', '2026-08-09-1', '2026-08-09-2',
      '2026-08-11-1', '2026-08-11-2', '2026-08-12-1', '2026-08-14-1', '2026-08-14-2',
      '2026-08-15-1', '2026-08-15-2', '2026-08-16-1', '2026-08-16-2', '2026-08-17-1',
      '2026-08-19-1', '2026-08-19-2', '2026-08-19-3', '2026-08-19-4', '2026-08-20-1',
      '2026-08-20-2', '2026-08-21-1', '2026-08-21-2', '2026-08-23-1', '2026-08-25-1',
      '2026-08-25-2', '2026-08-25-3', '2026-08-27-1', '2026-08-27-2', '2026-08-29-1',
    ]],
    ['Shaun', [
      '2026-07-06-2', '2026-08-12-2', '2026-08-16-3', '2026-08-26-1', '2026-08-31-1',
      '2026-08-31-2', '2026-09-01-1', '2026-09-01-2', '2026-09-02-1', '2026-09-02-2',
      '2026-09-02-4', '2026-09-03-1', '2026-09-03-2', '2026-09-03-3', '2026-09-04-1',
      '2026-09-04-2', '2026-09-05-1', '2026-09-06-1', '2026-09-07-1', '2026-09-07-2',
      '2026-09-08-1', '2026-09-08-2', '2026-09-08-3', '2026-09-09-1', '2026-09-11-1',
      '2026-09-11-2', '2026-09-13-1', '2026-09-13-2', '2026-09-13-3', '2026-09-14-1',
      '2026-09-14-2', '2026-09-15-1', '2026-09-15-2',
    ]],
    [NOT_RECORDED, [
      '2026-07-20-3',
    ]],
    ['Tom', [
      '2026-09-02-3',
    ]],
  ];
  const HISTORY = {};
  HISTORY_GROUPS.forEach(([who, ids]) => ids.forEach((id) => { HISTORY[id] = who; }));

  // What one game's journey says about how it was added: { approvedBy } for a
  // game approved in the app, { imported: true } for one brought over from the
  // old app, or null. Corrections add later events; the first one that says
  // how the game arrived is the one that counts.
  function fromJourney(matchId, journey) {
    let approvedBy = null; let imported = false;
    (journey || []).forEach((e) => {
      if (!e || e.matchId !== matchId) return;
      if (e.source === SOURCE_APPROVED && e.createdBy && !approvedBy) approvedBy = e.createdBy;
      if (typeof e.source === 'string' && SOURCE_IMPORTED.test(e.source)) imported = true;
    });
    if (approvedBy) return { approvedBy };
    if (imported) return { imported: true };
    return null;
  }

  // -> { kind: 'submitted' | 'historical' | 'approved' | 'imported' | 'unknown',
  //      name, text }
  function describe(matchId, o = {}) {
    const stored = o.stored && o.stored[matchId];
    if (stored && stored.submittedBy) {
      return { kind: 'submitted', name: stored.submittedBy, text: `Submitted by ${stored.submittedBy}` };
    }
    if (Object.prototype.hasOwnProperty.call(HISTORY, matchId) && HISTORY[matchId] !== NOT_RECORDED) {
      const who = HISTORY[matchId];
      return who === HISTORICAL
        ? { kind: 'historical', name: null, text: HISTORICAL }
        : { kind: 'submitted', name: who, text: `Submitted by ${who}` };
    }
    const j = fromJourney(matchId, o.journey);
    if (j && j.approvedBy) return { kind: 'approved', name: j.approvedBy, text: `Approved by ${j.approvedBy}` };
    if (j && j.imported) return { kind: 'imported', name: null, text: 'Added from the old app' };
    return { kind: 'unknown', name: null, text: 'Submitter not recorded' };
  }

  // The entry kept when a submission is approved and rated.
  function entryFor(submission, { matchId, approvedBy, approvedAt }) {
    return {
      matchId,
      submittedBy: (submission && submission.submittedBy) || null,
      submittedAt: (submission && submission.submittedAt) || null,
      approvedBy: approvedBy || null,
      approvedAt: approvedAt || null,
    };
  }

  return { STORAGE_KEY, HISTORICAL, HISTORY, describe, fromJourney, entryFor };
});
