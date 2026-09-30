# Parallel development split

**Status:** PROPOSED, 30 Sep 2026 (CCode). This document is updated to
describe the resulting repository once the extraction is complete; the
"Result" section at the end is the authoritative record.

**Purpose:** two streams will work in this one repository at the same time:
- **Stream A — Functional:** features, bug fixes, Firebase/data work,
  rating/ranking/fixture behaviour and competition logic.
- **Stream B — Player Experience Redesign:** the new IA, Home / Rankings /
  Play / Players / Me, the new visual system, screen layouts, reusable UI
  components and mobile interaction.

This document says where code lives so the two streams rarely need to edit
the same file. It is a **collision-avoidance convention, not an access
restriction.**

---

## 1. Where the conflicts come from today

### 1.1 Edit frequency, 16–30 Sep 2026 (commits touching each file)

| File | Lines | Commits | Why it conflicts |
|---|---|---|---|
| `PROJECT_LEDGER.md` | ~6,700 | 131 | every task ends by editing its top sections |
| `assets/js/app.js` | 10,178 | 61 | every screen, the data layer and the wiring in one file |
| `assets/css/app.css` | 2,417 | 37 | every screen's styles in one file |
| `tests/ui.test.js` | 4,956 | 36 | the default home for any new browser test |
| `index.html` | 184 | 30 | the script list; every new module edits it |
| `assets/js/shell.js` | 2,568 | 21 | navigation plus Home, the profile and Rankings chrome |

Everything else was edited fewer than ten times in that period. The
domain modules (`ratingEngine.js`, `fixtureFlow.js`, `meritTable.js`,
`monthlyRace.js`, `playerState.js` and the rest) are already small, pure and
well-tested: they are **not** the problem and are left where they are.

### 1.2 What `app.js` mixes

| Responsibility | Where in `app.js` (as of `fae3cba`) |
|---|---|
| Base data and constants | `BASE_MATCHES`, North vs South fixtures (lines 1–68) |
| Firebase / persistence | the STORAGE section: `db`, every `load*` / `save*` (69–332) |
| Permissions | admin lock, roles, visibility, `canSeeTab`, `canSeePredictions` (333–553) |
| Derived state (domain) | `buildPlayers`, partnerships, `tierRankOf`, `playerStateOf`, `recomputeAll`, monthly stats, meaningful month (554–1986) |
| Boot and navigation | `DATA_READY`, `drawFirstScreen`, `renderActiveTab`, the `#tabrow` click handler, `dataChanged` (1987–2215) |
| Screen rendering + event wiring | Power list, Call-Outs, Players, Find a Game, Challenges, profile sheet, Manage, H2H, fixtures (Requests / Upcoming), League / Merit / Race / Information, Games, approvals (2216–10100) |
| Mixed inside rendering | Games filtering and the player record; fixture list splitting; Find a Game recommendation scoring |

### 1.3 What `shell.js` mixes

| Responsibility | Where in `shell.js` |
|---|---|
| App navigation | sections, sub-nav, bottom nav, `goToSection`, More sheet (1–185) |
| Shell DOM plus three screen modals | `buildShellDom` (186–686) also contains About, **Doughnuts** and **North vs South** as inner closures |
| Global sheets | Data range, Rating Guide, monthly rating modal (687–1007) |
| Rankings chrome | eligibility, podium, Kings of Tiers, hero, filter bar (1008–1477) |
| Viewer identity | `getCurrentViewer`, selector, `getViewerSnapshot` (1478–1652) |
| **Home screen** | pulse, match to make, last result, `renderHomeDashboard` (1653–2173) |
| **Player profile** | `renderPremiumProfile` and its helpers (2174–2484) |
| Boot hooks | the DOMContentLoaded block (2485–2568) |

### 1.4 What `app.css` mixes

Lines 1–457 are the original app (tokens, base, legacy components). From
line 458 on, "Prestige V1" sections for the shell, primitives, Home,
profile, Play, Challenges, Doughnuts, Admin, Directory, League, Merit/Race,
the table drill-down and fixtures follow one another in the order they were
written.

---

## 2. Proposed extraction

`current responsibility → proposed module → owning stream`.
Existing domain modules stay where they are; they are listed under the
conceptual folder they belong to.

### 2.1 JavaScript

| Current responsibility | Proposed module | Stream |
|---|---|---|
| Firebase persistence (`load*` / `save*`, storage keys) | `data/firebaseData.js` | A |
| Canonical match filtering + a player's W/D/L over a set | `domain/matches/gamesFilter.js` (new, pure) | A |
| Ratings | `ratingEngine.js`, `ratingStore.js`, `reassessment.js`, `clubDecision.js`, `replayForward.js`, `historicalAdjustment.js`, `monthlyReview.js`, `matchFacts.js`, `ratingExplainer.js` (unchanged, = `domain/ratings`) | A |
| Rankings / monthly | `playerState.js`, `meaningfulMonth.js`, `monthlyViews.js`, `leagueSplit.js`, `meritTable.js`, `monthlyRace.js`, `lastTen.js`, `tierHistory.js` (unchanged, = `domain/rankings`, `domain/monthly`) | A |
| Fixtures | `fixtureFlow.js`, `fixtureParse.js`, `matchPrediction.js` (unchanged, = `domain/fixtures`) | A |
| Matches / players | `matchOutcome.js`, `gameType.js`, `playerFilter.js`, `playerNames.js`, `lastResult.js` (unchanged, = `domain/matches`, `domain/players`) | A |
| Games screen | `features/games/gamesScreen.js` | B |
| Games admin: approvals, edit, historical match correction | `features/games/gamesAdmin.js` | A |
| League / Merit / Race / Information screens | `features/rankings/leagueScreen.js` | B |
| The P/W/D/L/Hard/Fav drill-down component | `ui/tables/tableDrill.js` | B |
| Requests / Upcoming / Called Out / bulk entry screens | `features/play/fixturesScreen.js` | B |
| Find a Game + Challenges screens | `features/play/findGameScreen.js` | B |
| Players directory, Call-Outs | `features/players/directoryScreen.js` | B |
| Head to Head | `features/players/h2hScreen.js` | B |
| Profile sheet (legacy `openSheet` + premium profile) | `features/players/profileScreen.js` | B |
| Home | `features/home/homeScreen.js` | B |
| Doughnuts, North vs South, About modals | `features/rankings/doughnutsScreen.js`, `features/rankings/northSouthScreen.js` | B |
| Rankings chrome (podium, Kings, hero, filter bar) | `features/rankings/rankingsChrome.js` | B |
| Admin / Manage screens | `features/admin/manageScreen.js` | A (admin tools are functional) |
| Boot, `#tabrow` router, `dataChanged`, derived state | stays in `app.js` | A (shared contract for the router) |
| Navigation, sub-nav, bottom nav, More, sheet infrastructure | stays in `shell.js` | B (route names are shared) |

### 2.2 CSS

| Current section of `app.css` | Proposed file | Stream |
|---|---|---|
| Colour tokens (`:root`) | stays in `app.css` next to `tokens.css` (tokens stay where tests and every file reference them) | B |
| Legacy base and shared components, primitives, buttons, sheets | `components.css` | B |
| Header, bottom nav, sub-nav, More sheet | `shell.css` | B |
| Home | `screens/home.css` | B |
| Rankings, podium, Kings, League, Merit, Race, drill-down, monthly stories, doughnuts | `screens/rankings.css` | B |
| Play, Find a Game, Challenges, fixtures | `screens/play.css` | B |
| Directory, profile | `screens/players.css` | B |
| Games | `screens/games.css` | B |
| Admin / Manage | `screens/admin.css` | A/B |

The cascade must not change: files load in an order that reproduces the
original rule order wherever two rules can meet.

---

## 3. Ownership boundaries

**Functional stream (A) normally owns:**
- `assets/js/data/`, `assets/js/domain/`, every existing calculation module;
- Firebase persistence, permissions (`canSee*`, admin roles), state
  transitions (`fixtureFlow.js`, approvals, corrections, club decisions);
- `features/games/gamesAdmin.js`, `features/admin/`;
- tests of business behaviour (module tests).

**Redesign stream (B) normally owns:**
- `assets/js/ui/`, `assets/js/features/` screen renderers (except the two
  functional admin files above);
- shell presentation in `shell.js`;
- all CSS (`tokens.css`, `components.css`, `shell.css`, `screens/`);
- layout, icons and assets, design-system primitives, screen interaction.

**Shared contract — coordinate before changing:**
- route and tab names (`#tabrow` `data-tab` values, `SECTION_SUBNAV`,
  `goToSection`);
- the plain-data functions screens consume (for example
  `filteredGames` / `playerRecord`, `getViewerSnapshot`, `FixtureFlow`
  lists);
- DOM hooks the tests still rely on (`#summaryContent`, `#gamesView`,
  `.fx-head`, `.merit-count` and the rest listed in the design
  implementation map);
- `index.html` (script and stylesheet order);
- `package.json`, `tests/helpers/`;
- `PROJECT_LEDGER.md`.

## 4. How the streams stay in step

- Functional work lands on `main` (via `app-features-fixes`).
- The redesign branch merges `main` regularly: after any significant
  domain/data change, and at least weekly while both are active.
- Conflicts are resolved on the redesign branch while the work is fresh.
- Unfinished redesign work is never merged back into `main`.
- New tests go in a file per feature (`tests/<feature>.test.js`), not in
  `tests/ui.test.js`, which both streams otherwise append to.
