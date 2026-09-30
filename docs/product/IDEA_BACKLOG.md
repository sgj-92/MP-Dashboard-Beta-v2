# Money Padel — product idea backlog

**A parking lot, not a queue.** Nothing here is approved or scheduled, and
nobody should build from it. Being listed here does **not** authorise
implementation. Approved decisions, current state and handoffs live in
[`PROJECT_LEDGER.md`](../../PROJECT_LEDGER.md), which wins wherever the two
differ.

Structure approved by Shaun/CGPT, 30 Sep 2026 (Ledger, *Added since the
compaction*).

---

## How to use this

**Adding an idea (anyone: Shaun, CGPT, CChat, CCode):**
1. Copy [`IDEA_TEMPLATE.md`](./IDEA_TEMPLATE.md) into Section 1 below.
2. Give it the next number, `IB-nn`.
3. Set **Status: Idea**.
4. Record where it came from and keep its uncertainty. A brainstorm stays a
   brainstorm, and "someone mentioned" is not "Shaun wants".

**Statuses:**
- **Idea:** captured, not discussed.
- **Explore:** someone is looking into it: questions, sketches, data
  checks. No production code.
- **Approved:** Shaun/CGPT decided to do it. The decision is in the
  Ledger's Decisions Log and NEXT, and the entry links to it.
- **Building:** in progress under an approved Ledger task.
- **Delivered:** shipped. The entry records the commit.
- **Parked:** deliberately set aside, with the reason.
- **Rejected:** decided against, with the reason. The entry is kept so the
  idea is not re-raised blind.

**Promotion.** An idea becomes work only by the normal route:
- a Shaun/CGPT decision recorded in the Ledger (Decisions Log + NEXT);
- then a CCode handoff.

The backlog entry is then marked Approved and links there. **CCode never
moves an entry to Approved itself.** It also never builds from this file.

**Keep this file lean.** An item that already has a home in the Ledger
(a parked question, an open decision) is **pointed to** in Section 2, not
copied. Its status is whatever the Ledger says.

---

## 1. Ideas

### IB-01 — Video Highlights & Moments

- **Status:** Idea.
- **Source:** Shaun/CGPT, 30 Sep 2026, captured with the backlog itself.
- **The idea:** short clips or "moments" from club matches, linked to the
  match and the players in them.
- **Where the video lives:** externally. Video is **never stored in
  GitHub**. Money Padel keeps only a reference and the metadata.
- **Candidate metadata:**
  - the match ID;
  - the video or storage URL;
  - a timestamp;
  - a title and description;
  - the participating player IDs;
  - the featured player IDs;
  - tags;
  - the creator.
- **Surfaces it could appear on:**
  - Match Detail;
  - Player Profile;
  - Me / My Highlights;
  - Around the Club;
  - a future season or year recap (IB-02).
- **Existing facts it would lean on:**
  - A canonical match is a document in the v3 `matches` collection. Its ID
    is the stable key to link to.
  - Players have a frozen `playerId` with a separate `displayName` (the
    21 Sep rename decision). Link by ID, never by name, so a rename cannot
    orphan a clip.
- **Not decided:**
  - the storage provider;
  - the schema;
  - the UX;
  - who may add or remove a clip (Admin-only, or any participant?);
  - moderation and deletion.
- **Open question for Shaun: consent.** Clips show identifiable people.
  Should a player be able to opt out of being featured, or have a clip of
  them removed? This is a privacy decision, not an implementation detail.
- **Constraints if it is ever explored:**
  - it must not touch ratings, results or the match record's own fields;
  - it holds metadata only, and any new collection is a schema decision.

### IB-02 — Season / year recap

- **Status:** Idea.
- **Source:** named only in passing, as a possible surface for IB-01
  (Shaun/CGPT, 30 Sep 2026). It has not been discussed on its own, so its
  scope is unknown.
- **What might feed it:** everything already derived and canonical:
  - the monthly stories;
  - the League, Merit and Race results by month;
  - rating journeys;
  - Doughnuts;
  - head-to-heads.
- **Constraints:**
  - It is a presentation of existing facts. No new calculation may be
    labelled as a rating.
  - April and May stay display-only history.

### IB-03 — Attendance / turn-up record

- **Status:** Idea.
- **Source:** the **Claude Design mock** (Me, `1n`: "Reliability — turned
  up for 47 of 48"). **Not requested by Shaun.** It is captured so the mock
  does not smuggle it in.
- **What exists:** nothing. Attendance is not recorded anywhere, so this
  would be **new data**.
- **Constraint (Ledger DQ15):** it may never be called "Reliability", which
  means rating evidence throughout the app and the Power Rating Guide.

---

## 2. Already in the Ledger — pointers only

These are **not** backlog entries. Each has a home in the Ledger, and its
status there is authoritative. They are listed so an idea hunt finds them.

| Topic | Ledger home | Ledger status |
|---|---|---|
| Sharing a suggested or requested match (native Share, Copy message) | Section 5, *Product backlog — match sharing* | Parked, not authorised. It needs a decision on where sharing appears |
| Rating-model questions: responsiveness, reliability curve, expectation symmetry, sustained winning, the optional **Prove It** volatility mechanic | Section 5, *Rating model backlog — parked during refinement* | Parked, not authorised. The engine is frozen (`sequential-v1`) |
| Live updates between devices (Firestore listeners) | NEXT #20 | Open question |
| Cache the app shell (service worker) and "Update available · Refresh" | NEXT #19 | Open question |
| Player-side court booking, "Change plan", "Find a replacement" | Section 5, *Claude Design migration*: DQ6, DQ8, DQ7 | Open, for Shaun |
| Court number, "booked by", Directions, Add to calendar, Share on a fixture | Section 5: DQ10 | Open, for Shaun (the recommendation is to leave them out) |
| Syncing Money Padel's primitives into Claude Design | Section 5, *Syncing to Claude Design is deferred* | Deferred until Phase 0 primitives exist |
| Predict a Matchup visual treatment | NEXT #21 | Awaiting a render from Shaun |

**Approved or delivered features are not here at all.** Examples are the
Monthly Race trial, the redesign phases and the fixture flow. Their home is
the Ledger and `docs/design/CLAUDE_DESIGN_IMPLEMENTATION_MAP.md`.
