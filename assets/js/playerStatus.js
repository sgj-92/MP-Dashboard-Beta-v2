// ===================== PLAYER STATUS =====================
// A player's standing in the GROUP -- set by an admin, never derived. One of:
//
//   active               plays with Money Padel now
//   temporarilyInactive  still a member, not playing at the moment (injury,
//                        travel, a break). Left out of game suggestions and the
//                        current ranking pool, but still in "Who are you?", the
//                        directory and every name field (Shaun, 4 Oct: option A)
//   archived             no longer plays with the group. Hidden from every live
//                        list and selector; kept in Admin and wherever their
//                        history is shown. Never deleted, always restorable.
//
// This is NOT any monthly or recent-games rule. Not meeting a month's minimum
// (League/Merit/Race qualification, Monthly Performance) or the 30-day ranking
// rule ("Idle", playerState.js) never changes a player's status -- those are
// competition facts about a period, this is a fact about the person.
//
// Where it lives: `status` on the player's v3 record (players collection,
// keyed by id, so a rename cannot lose it; replay-forward carries it over).
// A record without one falls back to the legacy Active/Inactive flag from
// Admin's player tags: Inactive there meant "has left", so it reads as
// archived (Shaun, 4 Oct); otherwise active. No migration is needed.
//
// Pure; no DOM, no app globals.

(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.PlayerStatus = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const STATUS = { ACTIVE: 'active', TEMPORARILY_INACTIVE: 'temporarilyInactive', ARCHIVED: 'archived' };
  const ALL = [STATUS.ACTIVE, STATUS.TEMPORARILY_INACTIVE, STATUS.ARCHIVED];
  const LABEL = { active: 'Active', temporarilyInactive: 'Temporarily inactive', archived: 'Archived' };

  // A stored value, if it is one of the three; otherwise null.
  function normalise(value) {
    return ALL.includes(value) ? value : null;
  }

  // The status of one player: the stored status when there is one, else the
  // legacy flag (false = left the group), else active. A missing or unknown
  // value is never read as anything but active.
  function statusOf({ stored, legacyActive } = {}) {
    const s = normalise(stored);
    if (s) return s;
    if (legacyActive === false) return STATUS.ARCHIVED;
    return STATUS.ACTIVE;
  }

  // In the live app at all: lists, selectors, "Who are you?", the directory.
  const isLive = (status) => normalise(status) !== STATUS.ARCHIVED;
  // Playing now: suggestions, matchmaking and the current ranking pool.
  const isPlaying = (status) => (normalise(status) || STATUS.ACTIVE) === STATUS.ACTIVE;

  return { STATUS, ALL, LABEL, normalise, statusOf, isLive, isPlaying };
});
