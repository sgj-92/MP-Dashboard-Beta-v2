# Parallel development split

**Status:** COMPLETE, 30 Sep 2026 (CCode).
- **Behaviour:** unchanged, on the evidence in Section 6.
- **This document:** describes the repository as it now is. Section 2 is
  the authoritative map.

**Purpose:** two streams work in this one repository at the same time:
- **Stream A — Functional:** features, bug fixes, Firebase/data work,
  rating/ranking/fixture behaviour and competition logic.
- **Stream B — Player Experience Redesign:** the new IA, Home / Rankings /
  Play / Players / Me, the new visual system, screen layouts, reusable UI
  components and mobile interaction.

This document says where code lives so the two streams rarely need to edit
the same file. It is a **collision-avoidance convention, not an access
restriction.** There is still **one application**:
- one data model;
- one set of rating, fixture and competition rules;
- one Firebase layer.

The branches differ only in how they present it.

---

## 1. Where the conflicts came from

Edit frequency, 16–30 Sep 2026 (commits touching each file, before the
split):

| File | Lines before | Commits | After the split |
|---|---|---|---|
| `PROJECT_LEDGER.md` | ~6,700 | 131 | unchanged: shared, see Section 4 |
| `assets/js/app.js` | 10,178 | 61 | **2,215**: the functional core only |
| `assets/css/app.css` | 2,417 | 37 | **45**: colour tokens and base only |
| `tests/ui.test.js` | 4,956 | 36 | unchanged; new tests go in per-feature files |
| `index.html` | 184 | 30 | shared contract (the script and stylesheet order) |
| `assets/js/shell.js` | 2,568 | 21 | **655**: navigation and start-up only |

- **Before:** `app.js` mixed base data, Firebase persistence, permissions,
  derived domain state, the router, every screen's rendering and wiring,
  and business logic embedded in renderers (Games filtering and the player
  record, the request list split, Find a Game matchmaking).
- **`shell.js`:** carried Home, the profile, the Rankings chrome and three
  More sheets as closures.
- **`app.css`:** held every screen's styles in the order they were written.
- **Left where they were:** the standalone domain modules beside `app.js`
  (`ratingEngine.js`, `fixtureFlow.js`, `meritTable.js`, `monthlyRace.js`,
  `playerState.js` and the rest). They were already small, pure and
  tested, and they are not a conflict source.

---

## 2. The result: file → responsibility → stream

**Stream key:**
- **A** = functional.
- **B** = redesign.
- **S** = shared contract (Section 4).

Every file under `data/`, `domain/`, `features/` and `ui/`:
- loads **before** `app.js`;
- **only declares**: it never acts at load;
- keeps every global name and DOM hook it had, so tests and routing are
  unchanged.

### 2.1 JavaScript

**Core (loaded last)**

| File | Lines | Responsibility | Stream |
|---|---|---|---|
| `app.js` | 2,215 | Base data and constants; application state (every per-screen month and the club's documents); derived domain state (`buildPlayers`, partnerships, `recomputeAll`, Tier Rank, monthly stats, `playerJourney`, the viewer-side score helpers); the `#tabrow` router; `dataChanged`, record health and `init` | A (router: S) |
| `shell.js` | 655 | Sections, sub-nav, bottom nav, the More sheet, the Data & Rankings sheet, the viewer selector, the start-up hooks (it wraps `render` and `openSheet`) | B (route names: S) |

**`data/`**

| File | Responsibility | Stream |
|---|---|---|
| `firebaseData.js` | The beta Firestore connection, storage keys, every load / save | A |
| `permissions.js` | Visibility settings, `canSee` / `canSeeTab` / `visibleFallbackTab` (D4), `canSeePredictions`, admin roles | A |
| `viewerState.js` | My Player (get / set / clear) and `getViewerSnapshot` | A |

**`domain/`**

| File | Responsibility | Stream |
|---|---|---|
| `matches/gamesFilter.js` | **Pure.** `GamesFilter.apply(...)` returns the final filtered game set; `GamesFilter.record(...)` returns a player's W/D/L over exactly that set | A |

The existing calculation modules are the rest of the domain layer, left in
place:
- **ratings:** `ratingEngine`, `ratingStore`, `reassessment`,
  `clubDecision`, `replayForward`, `historicalAdjustment`, `monthlyReview`,
  `matchFacts`, `ratingExplainer`;
- **rankings / monthly:** `playerState`, `meaningfulMonth`, `monthlyViews`,
  `leagueSplit`, `meritTable`, `monthlyRace`, `lastTen`, `tierHistory`;
- **fixtures:** `fixtureFlow`, `fixtureParse`, `matchPrediction`;
- **matches / players:** `matchOutcome`, `gameType`, `playerFilter`,
  `playerNames`, `lastResult`.

All of these are stream A.

**`features/`: screens (B) with their data/actions (A) beside them**

| Area | Presentation (B) | Data and actions (A) |
|---|---|---|
| Games | `games/gamesScreen.js` | `games/gamesViewModel.js` (the contract: `filteredGames`, `playerRecord`, `getFilteredGamesViewModel`), `games/gamesAdmin.js` (approve / edit / correct), `games/gamesSubmit.js` (Add a game) |
| Rankings: Power | `rankings/powerRankingsScreen.js`, `rankings/rankingsChrome.js` | `rankings/rankingsData.js` (eligibility, podium, Kings) |
| Rankings: League / Merit / Race / Information | `rankings/leagueScreen.js` | `rankings/monthlyTablesData.js` (canonical inputs and standings tie-breaks) |
| Rankings: other | `rankings/monthlyBreakdown.js`, `rankings/ratingGuide.js`, `rankings/calloutsScreen.js`, `rankings/doughnutsScreen.js`, `rankings/northSouthScreen.js` | `rankings/doughnutsData.js` (the D7 definition), `rankings/northSouthData.js` |
| Play: fixtures | `play/fixturesScreen.js`, `play/predictionCard.js` (admin-only; gate is S) | `play/fixturesData.js` (For me / My Requests / Other, sides, the one commit path, the prediction binding) |
| Play: Find a Game / Challenges | `play/findGameScreen.js` | `play/findGameData.js` (matchmaking engine, challenge state machine) |
| Home | `home/homeScreen.js` | `home/homeData.js` (promotion gap, Club Pulse, match to make, form W/D/L) |
| Players | `players/directoryScreen.js`, `players/h2hScreen.js`, `players/profileScreen.js` | `players/profileData.js` |
| Admin | — | `admin/manageScreen.js`, `admin/clubDecisionsScreen.js`, `admin/diagnosticsScreen.js`, `admin/lockScreen.js` (all A: they write the record or its settings) |

**`ui/` (B)**

| File | Responsibility |
|---|---|
| `components/matchDetail.js` | The played-match card and "Why your rating moved" (Games, profile, H2H) |
| `components/disclosure.js` | `foldHeading`, the inline fold, the one-player-section default |
| `tables/tableDrill.js` | The one P/W/D/L/Hard/Fav drill-down (D6) |
| `components/avatar.js` | Player initials |
| `components/clipboard.js` | Copy text |

### 2.2 CSS

Load order (`index.html`):

    tokens.css -> app.css -> components.css -> shell.css -> screens/*.css

It reproduces the original cascade: every rule keeps its order within its
file, and generic rules load before the screen rules that override them.

| File | Lines | Holds | Stream |
|---|---|---|---|
| `tokens.css` | 86 | Spacing, radius, surfaces, tier and type tokens | B |
| `app.css` | 45 | Colour tokens (`:root`) and `html` / `body` defaults | B |
| `components.css` | 390 | Primitives, cards, headings, buttons, pills, form controls, stat text, disclosures, the match-detail card | B |
| `shell.css` | 311 | Header, bottom nav, sub-nav, More sheet, viewer selector, Data & Rankings sheet, boot notice | B |
| `screens/rankings.css` | 712 | Power list and chrome, League / Merit / Race and drill-downs, monthly stories, rating guide, monthly breakdown, Doughnuts | B |
| `screens/home.css` | 147 | Home | B |
| `screens/play.css` | 318 | Find a Game, Challenges, fixture cards, prediction card | B |
| `screens/players.css` | 317 | Directory and profile | B |
| `screens/games.css` | 87 | Games feed, filters, record line | B |
| `screens/admin.css` | 141 | Admin accordion, player tags, audit trail, build stamp | B |

**Rules for the CSS:**
- Class names are unchanged. A screen stylesheet that needs an image
  writes `url("../../...")`, because it sits one folder down.
- A new screen (`Me`) gets `screens/me.css` and a `features/me/` folder
  when it is built.

### 2.3 Deliberately not split

- **The router stays in `app.js` (the `#tabrow` click handler) and
  `shell.js`** rather than a new `bootstrap/router.js`.
  - 101 test references drive navigation through `#tabrow`.
  - Moving the router is a behaviour-risk change best made by the
    redesign's shell phase, which will rework navigation anyway.
- **Per-screen month state stays in `app.js`.** This covers
  `selectedMonth`, `summaryMonth`, `gamesMonth`, `h2hMonth` and
  `profileMonth`, next to the rule that governs them (Meaningful Month).
  `tests/monthScope.test.js` guards who may touch `selectedMonth`.
- **`CHALLENGE_RESTRICTIONS` stays in `app.js`** beside `TIER_ORDER_LIST`,
  which it spreads at load time.
- **No duplication:**
  - no copied `app.js`;
  - no second rating or fixture implementation;
  - no redesign data model;
  - no copied Firebase helpers.

---

## 3. What the redesign consumes: view-model boundaries

A redesigned screen replaces the HTML and CSS around data it asks for. It
never re-derives:

| Question | Ask |
|---|---|
| Which games do these filters leave? A player's W/D/L over them? | `filteredGames(filters)`, `playerRecord(games, player)`, `getFilteredGamesViewModel(filters)` |
| Tier Rank, eligibility, state | `tierRankOf`, `isRankingEligible`, `playerStateOf` |
| Who is viewing; their standing | `getCurrentViewer`, `getViewerSnapshot` |
| For me / My Requests / Other; a fixture's stage | `requestLists(viewer)`, `FixtureFlow.stage / attention / availabilityOf` |
| Change a fixture | `commitFixtureChange(() => FixtureFlow.<action>(...))` |
| League / Merit / Race inputs and order | `monthlyTablesData.js`, then `MeritTable.build` / `MonthlyRace.build` / `LastTen.build` |
| Club Pulse, match to make, promotion gap, form | `homeData.js` |
| Doughnuts | `doughnutMatches(month)`, `computeDoughnutStats(month)` |
| Predictions | `predictMatchup`, only where `canSeePredictions()` |
| Can this screen be seen? | `canSeeTab(tab)` |

If a redesigned screen needs a fact that none of these answer, the fact is
added on the functional side (a data / view-model function), and the
screen calls it.

---

## 4. Ownership boundaries

**Functional stream (A) normally owns:**
- `assets/js/data/`, `assets/js/domain/`, and every standalone calculation
  module;
- the `*Data.js` files, `gamesViewModel.js`, `gamesAdmin.js`,
  `gamesSubmit.js` and `features/admin/`;
- `app.js`'s derived state and persistence;
- permissions and state transitions;
- the module tests of business behaviour.

**Redesign stream (B) normally owns:**
- `assets/js/ui/`;
- the `*Screen.js`, `*Chrome.js`, `predictionCard.js`, `ratingGuide.js`
  and `monthlyBreakdown.js` files;
- `shell.js` presentation;
- all CSS;
- icons and assets;
- screen interaction.

**Shared contract — coordinate before changing:**
- **Route and tab names:** `#tabrow` `data-tab` values, `SECTION_SUBNAV`,
  `goToSection`.
- **The view-model functions in Section 3:** their names and return
  shapes.
- **DOM hooks the tests use:** `#summaryContent`, `#gamesView`, `.fx-head`,
  `.merit-count`, and the rest listed in the design implementation map.
  The `renderX` globals the tests call.
- **The D4 prediction gate** and the share-of-games wording.
- **`index.html`:** script and stylesheet order.
  `tests/architecture.test.js` enforces the rules.
- **`package.json`, `tests/helpers/`.**
- **`PROJECT_LEDGER.md`:** each stream adds its own handoff, edits only
  its own lines in shared sections, and never rewrites another's entry.

**Adding code:**
- **A new screen:** `features/<area>/<name>Screen.js` +
  `screens/<area>.css`.
- **A new fact:** a `*Data.js` / view-model function, or a pure
  `domain/` module when it needs no app state. Load it before `app.js` in
  `index.html`.
- **Tests:** a new file per feature (`tests/<feature>.test.js`), not
  `tests/ui.test.js`.

## 5. How the streams stay in step

- Functional work lands on `main` (via `app-features-fixes`).
- The redesign branch **merges `main`**:
  - after any significant domain or data change;
  - at least weekly while both are active.

  It resolves conflicts on the redesign branch while the work is fresh.
- Unfinished redesign work is never merged back into `main`.

## 6. How the split was verified

Each extraction was its own commit, verified by all of the following before
it was pushed:
1. **A 39-state behaviour snapshot**, identical against the pre-split
   commit.
   - It covers every screen, sheet and admin view, with fixtures seeded
     and a viewer chosen.
   - It compares the full DOM, **every computed style of every element**,
     and element boxes.
   - It ran at 390px; the CSS split was also checked at 360px, where the
     `max-width` rules apply.
2. **The full suite** (746 tests at the end of the extraction).
3. **Load-order checks:**
   - no duplicate top-level names;
   - no top-level initialiser reading a later script.
   - These are now permanent in `tests/architecture.test.js`, alongside
     the "modules only declare", "domain is pure" and stylesheet-order
     rules.
4. **For the CSS:** every one of the 827 rules accounted for exactly once,
   and a static check for equal-specificity rule pairs whose order
   changed.
   - It found seven, all under ancestors that never nest.

The source-level guards (form dots, document deletes, `tierInScope`,
`selectedMonth`, `recomputeAll`, stale copy) now scan **every** application
script (`tests/helpers/appSource.js`), so moving code cannot switch one off.

## 7. The branching point

**The redesign branch is cut from the commit that adds
`tests/architecture.test.js` and this Result section.** The Ledger records
its hash. Every structural change is in its ancestry; later commits on
`main` touch only `PROJECT_LEDGER.md`.

The redesign branch is to be created **only after Shaun confirms the
product / IA Keep / Simplify / Move / Merge / Hide / Remove review is
complete**. Its agreed name is `ux/player-reset-v2`. The earlier
`app-redesign` branch (`ec963d5`) predates this split and should not be
used.
