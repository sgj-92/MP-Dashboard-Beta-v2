# Claude Design → Money Padel: implementation map

**Status:** reconciled to the **approved IA of 30 Sep 2026** (Section 0).
No production UI has changed.
- **What is approved:** the IA, which is the Keep / Simplify / Move / Merge
  / Hide / Remove review.
- **What is not yet approved:** individual phases. Each phase brief in
  Section 7 still needs its own go-ahead.
- **Where redesign work lands:** `ux/player-reset-v2`, never `main`, until
  Shaun releases it.

**Written by:** CCode, 28 Sep 2026. **Reconciled to the IA:** CCode,
30 Sep 2026. Where Section 0 and a later section disagree, Section 0 wins.

**Design source:** `docs/design/claude-mobile-v1/`. It contains three files:
- `Money_Padel_App.dc.html`, the file the brief calls "Money Padel App.dc.html". The repo copy has underscores for spaces.
- `MPTabBar.dc.html`.
- `MPStatusBar.dc.html`.

**Authority.** If this map and the Ledger disagree, the Ledger wins. The order is:
1. `PROJECT_LEDGER.md`;
2. the running app and its tests;
3. `RATING_MODEL.md`.

The design is a picture of intent. It is not a specification of rules.

---

## How to read this

The design has three parts:
- **Turn 1:** the player app, screens `1a`–`1s`, plus a "Structure & system" board.
- **Turn 2:** three Home hero options, `2a`–`2c`.
- **Turn 3:** two hero options with club photography, `3a`–`3b`.

Section 4 maps each area the brief named. Every area answers the brief's nine questions under the same nine headings:

1. **Design:** which mockup(s).
2. **Current:** the screen or component it replaces or reshapes.
3. **Consumes:** the existing data and functions it must read. It must not recompute them.
4. **Preserve:** behaviour that must survive the migration.
5. **Change:** the visual and interaction changes.
6. **Mock-only:** what the mockup assumes that must **not** reach production.
7. **Primitives:** the reusable design-system parts it uses (Section 3).
8. **Risk:** Low / Medium / High, with the reason.
9. **Phase:** from the order in Section 7.

Questions that need a decision are numbered **DQ1–DQ33** in Section 6 (DQ31–33 arose from the IA, Section 0.3). Each area points to them.

---

## 0. The approved IA (30 Sep 2026), and what it changes here

Shaun and CGPT completed the IA review on 30 Sep (Ledger, *Added since the
compaction*).

**The core rule:** each primary tab answers one obvious player question.
Secondary analysis, settings and Admin controls move deeper or into
context, rather than competing at the top level.

### 0.1 Target IA

| Tab | Primary entry points | Everything else |
|---|---|---|
| **Home** | One scroll, in this order: **compact live-data hero** → **Needs You** → **Next Game** → **Last Time Out** → light **Around the Club** | The Monthly Snapshot is largely absorbed into the hero. **Match Ideas moves out of Home** (proposed: Play › Arrange a Game, DQ32). Power Rating, Tier Rank and form stay, but simplified and demoted below the monthly story. |
| **Rankings** | **Power \| This Month** | **Power** is current club strength, with a **compact podium near the top**; filters and sorts go into one secondary control. **Kings of Tiers** is a secondary Rankings destination. **This Month** is **League · Merit · Race**, League first while Race is a trial, sharing one month and one drill-down. **More tables** holds W/L, Last 10, Monthly Performance and the monthly stories, month-end Power history, North vs South, Insights / Call-Outs and Doughnuts. Methodology sits behind a disclosure. |
| **Play** | **My Games \| Club** | Requests, Called Out, Upcoming and Needs Attention are **lifecycle states inside those lists**, not destinations. **Arrange a Game** is one entry point for Find a Game, Request a game and Add multiple games. **Played Games & Results** stays as the history destination. **Challenges** are demoted into My Games. Admin fixture management stays contextual. |
| **Players** | **Directory → Profile** | Search is the main Directory interaction, with advanced filters secondary. **Compare and H2H move into the profile** ("You vs them"). The profile leads with identity and current standing, then You vs them, then recent activity, then deeper analysis behind disclosure: journey, partnerships, rivals, full stats. |
| **Me** | A personal dashboard, **distinct from a player's public profile** | My performance, this-month standing, history, personal settings (My Player, Data & Rankings) and the gated Admin tools. The Power Rating Guide and About live here or deeper. Me replaces More; it is not a junk drawer. |

### 0.2 Decisions this settles

| DQ | Status | Now reads |
|---|---|---|
| DQ3 | **Confirmed by Shaun, 30 Sep** | Power shows **current** ratings. Month-end Power history moves to More tables. The Meaningful Month default (26 Sep) therefore governs **This Month**, not Power. |
| DQ4 | **Settled** | This Month is League · Merit · Race, League first while Race is a trial. |
| DQ18 | **Resolved** | Keep both. The podium is compact, near the top of Power. Kings of Tiers is a secondary Rankings destination. |
| DQ19 | **Resolved in direction** | The target product has a **compact, interactive, live-data hero**, not `1a`'s no-hero. It prioritises monthly competition over slow-moving Power Rating. Its visual treatment may be staged (Phase 3b). |
| DQ21 | **Settled** | H2H and Compare live in the player flow (profile "You vs them"), not as a Players destination. |
| DQ22 | **Settled** | Played Games & Results is Play's history destination. Challenges go into My Games. |

**Still open, unchanged:**
- **For Shaun:** DQ1, DQ6, DQ7, DQ8, DQ9, DQ10, DQ15, DQ26.
- **For CGPT:** DQ2, DQ5, DQ11, DQ20, DQ24, DQ29, DQ30.

These are listed in Section 6.

### 0.3 New questions the IA raises

These are presentation within agreed intent, so CGPT may lead.

- **DQ31. What the Home hero says.** Recommendation:
  - The viewer's **This Month** position, named by tier, from the League
    (DQ24). For example: "3rd in Tier B · September · 4 games · 2 days
    left".
  - Movement this month, labelled with its period (DQ2).
  - A tap opens Rankings › This Month on Home's month.
  - When the month has no games yet, the hero says so (the Meaningful Month
    note), rather than showing an empty rank.
  - The Race stays out of the hero while it is a trial.
  - **No viewer chosen:** the hero shows the club's month (leaders per
    tier) and asks who you are (DQ5).
- **DQ32. Where Match Ideas goes.**
  - **Recommendation:** Play › Arrange a Game, as the "suggested for you"
    strip above Find a Game, still gated by `canSee('findgame')` and with
    no favourite call (D4).
  - **Alternative:** Me.
- **DQ33. Where Kings of Tiers is reached.**
  - **Recommendation:** a "Kings of Tiers ›" row directly under the compact
    podium on Power, opening its own screen, and also listed in More
    tables.

### 0.4 Confirmed by Shaun, 30 Sep: Power's default

**Rankings' default month (DQ3).** The IA makes Power "current club strength"
and moves month-end Power history into More tables.
- **What CCode reads:** Power stops opening on the Meaningful Month's
  month-end view, a 26 Sep default. It shows today's ratings, which also
  agree with Tier Rank everywhere (D5).
- **What does not change:** the Meaningful Month still decides which month
  This Month opens on.
- **When it ships:** Phase 4, on `ux/player-reset-v2`.

### 0.5 What does not change

- Every rule, calculation, permission and piece of data, and the
  `sequential-v1` engine.
- The legacy `#tabrow` router: the new IA is routed on top of it.
- The view-model contract in `docs/architecture/PARALLEL_DEVELOPMENT_SPLIT.md`
  Section 3. A redesigned screen asks those functions and never
  re-derives. A fact that is missing is added on the functional side.
- Nothing is removed silently. Every current destination has a home in
  Section 5.

---

## 1. Summary

**What the design gets right, and why it fits the Ledger:**
- It fixes the audit's headline problems:
  - "Home lacks my next game / waiting on me";
  - "fixture flow is broken at both ends";
  - "Admin leaks into player surfaces";
  - "touch targets 12–30px";
  - "Games is ~23 screens long".
- It keeps the rating engine one level down.
- It never shows a player a percentage.

**What cannot be copied:**
1. **The rules it illustrates.** These are mock assumptions and conflict with the Ledger:
   - tier numbers and rating boundaries;
   - Best Month as rating gained;
   - Merit as 3 / 1;
   - "5 games in 60 days";
   - 7-day movement;
   - fuzzy name auto-accept;
   - Reliability read as attendance.
2. **Several player actions the product has made Admin-only.** Examples: recording a court booking, replacing a player, changing the plan.
3. **Data the record does not hold.** Examples: court number, "booked by", membership date, attendance, venue addresses.

**What the migration really is:**
- **One new shell:** five tabs, and the More sheet is gone.
- **One new view-model:** a single viewer-centred fixture list for Play and Home.
- **A token and primitive layer.**
- **Restyling of existing screens.** Almost every number the design shows already has one canonical function behind it (Section 4). The work is presentation and routing, not calculation.

**The biggest structural risks:**
- **Routing and tests.** Tests drive navigation through the hidden legacy `#tabrow .tab-btn`, 101 references. Keep that router; restyle on top of it.
- **More's eight destinations (six items, My Player and Admin).** They need new homes (Section 5).
- **Rankings month.** The design's Power view is "today", but Rankings opens on the Meaningful Month (DQ3).

**Recommended order** (Section 7, reconciled to the IA):
1. Tokens and primitives.
2. Shell: five tabs, Me, section entry points.
3. Play: My Games | Club, Arrange a Game, game detail, Admin sheet.
4. Home: the hero-led hierarchy.
5. Rankings: Power | This Month, More tables.
6. Players, Profile and Me.
7. The remaining screens.

---

## 2. Prototype constructs → production translation

| Prototype construct | What it is | Production translation |
|---|---|---|
| `<x-dc>` wrapper, `support.js` | Claude Design runtime | Nothing. Screens stay plain HTML strings rendered by the existing `render*` / `build*Html` functions in `app.js` / `shell.js`. |
| `dc-import` (MPTabBar, MPStatusBar) | Component include | A JS function returning HTML, as the codebase already does (e.g. `tableDrillRowHtml`, `buildLastResultCardHtml`). No web components. No build step. |
| `sc-for` / `sc-if` / `{{ }}` | Template loops, conditionals, binding | `.map(...).join('')` and ternaries inside template literals. All interpolated names go through `escapeHtml`, as the Directory and the fixture flow already do. |
| `class Component extends DCLogic` + `renderVals()` | Mock view-model | Replaced by the existing canonical functions (Section 4). The arrays `P`, `R` and `M` are **fabricated data** and must not be ported, not even as fallbacks. |
| `data-props` / `$preview` 390×N | Fixed phone canvas | Fluid layout. **375px stays the reference width**: no sideways scroll, and tables fit in 341px. Test at 375 and 390. |
| `MPStatusBar` (9:41, signal, battery) | Mock iOS status bar | **Not built.** The app already uses `apple-mobile-web-app-status-bar-style: black-translucent` and `env(safe-area-inset-top)` (`--shell-safe-top`). |
| 134×5px bar at the foot of `MPTabBar` | iOS home indicator mock | **Not built.** Use `env(safe-area-inset-bottom)` (`--shell-safe-bottom`) as padding. |
| Inline `style=""` everywhere | Prototype convenience | Classes in `app.css`, driven by tokens in `tokens.css`. No inline colours. |
| Hex colours per element | Prototype palette | Tokens (Section 3.1). |
| `Instrument Serif` / `Inter` via the design runtime | Web fonts | Decision DQ20. If adopted, self-host the WOFF2 files with `font-display: swap`. Do not add a third-party runtime request. |
| Artboard notes (`dv-note`, `dv-gsub`, `dv-next`) | Designer's rationale | Intent only. Used in this map. |

---

## 3. Design-system primitives, before any screen moves

These are built in **Phase 0**, CSS-first, so the first phase changes nothing visible. Each primitive is:
- a class family in `app.css` or a new `components.css`;
- where it takes content, a small HTML-returning helper.

Existing families are named, so they are extended rather than duplicated.

### 3.1 Colour tokens

**Principle, shared by the design and the Ledger:**
- Gold means "act here" or "this is you".
- Everything else is ivory on near-black.
- This matches `tokens.css`'s "gold discipline" rule.

| Design token | Design hex | Existing token | Proposal |
|---|---|---|---|
| Ground | `#0A0A09` | `--bg0 #0b0a08` | Same role. Keep `--bg0`. The difference is imperceptible. |
| Card | `#11110F` | `--bg1 #141210` | Same role (`--surface-1`). |
| Raised | `#181714` | `--bg2 #1c1814` | Same role (`--surface-2`). |
| Hairline | `rgba(242,238,229,.06–.07)` | `--surface-border rgba(241,233,216,.08)` / `--surface-border-soft .05` | Same role. Keep. |
| Gold | `#D5B76E` (champagne) | `--gold #d4af37` (saturated) | **DQ20.** The design gold is softer. Add `--accent` and point it at whichever is chosen, so the swap is one line. |
| Highlight ("you") | `#F0D58E` | `--gold-bright #f5d576` | Same role. |
| "You" row fill | `#1C1A14` | none (`--gold-wash` is closest) | New `--row-self`. |
| Ivory (text) | `#F2EEE5` | `--text #f1e9d8` | Same role. |
| Muted | `#969188` | `--text-dim #bcb096` | **DQ20.** The Ledger raised `--text-dim` to 8.2:1 on purpose. The design muted is about 5.9:1 on Card, which is still AA. Recommend keeping the Ledger's contrast. |
| Inactive tab | `#6B675F` | none | **About 3.4:1: fails AA for 10.5px text.** Use it for icons only; labels use `--text-dim`. CCode will do this unless CGPT objects. |
| Booked | `#8FB996` | none | New `--state-booked`. **It collides** with `--tier-b-text #9db8a8` (Tier B sage) and with positive movement, which also uses `#8FB996`. See DQ20. |
| Attention | `#E0896B` | none (`--red #b5453f` means loss) | New `--state-attention`. It must stay distinct from loss red. |
| Movement up / down | `#8FB996` / `#C98470` | `--green` / `--red` mean **win / loss** | New `--move-up` / `--move-down`, so movement is never read as a result. The Ledger rule is that negative movement renders the same as positive: same weight, only the sign and colour differ. |

**Tier identity tokens stay as they are:**
- `--tier-s/a/b/c-*` in `tokens.css`, including S.
- The design has no tier colours. It uses "Tier 1/2/3" text only.

### 3.2 Typography

| Role | Design | Existing | Proposal |
|---|---|---|---|
| Scoreboard numbers (rating, points, scores), screen titles | Instrument Serif, tabular figures | `--font-prestige` (Georgia) · `.mp-numeral`, `.mp-display-title` | Keep the roles. The face is DQ20. **Verify** that Instrument Serif has tabular figures before choosing it; if not, figures use Inter `tnum`. |
| Everything read or tapped | Inter 400/500/600, 15px body | `--font-interface` (Helvetica Neue) | Same roles, face per DQ20. |
| Caps labels | Inter 11px caps | `.mp-section-label` | Reuse. |
| Player names on public surfaces | Serif (1p header), sans in rows | Directory uses the public serif (Ledger) | Keep the Ledger's rule. Admin lists stay sans. |

**The Ledger rule that stands:** serif for major titles, player names and prestige numerals; sans for controls, labels and navigation. "Never invert this."

### 3.3 Spacing, radius, touch

- **Spacing:** keep `--space-1…6` (4/8/12/16/24/32). The design uses the same 4-pt rhythm, with 16px side gutters and 12–16px card padding.
- **Radius:** the design cards are about 14–16px (`--radius-md 14px`), pills 999px, date blocks about 10px. Add `--radius-block: 10px`.
- **Touch targets: at least 44×44px** for every tappable element. This fixes an audit headline.
  - The design's tab items are 48px tall.
  - Inline "I'm in / Can't play" buttons are about 36px tall and need padding to reach 44px.
- **Tab bar:** the design is 84px including the home indicator, so about 50px of content plus the safe area. Replace `--shell-nav-height: 64px` with `56px + var(--shell-safe-bottom)`.

### 3.4 Component primitives

| Primitive | Design reference | Existing to extend | Notes |
|---|---|---|---|
| **Card** | Every screen: Card fill, hairline, 14–16px radius | `.mp-card-standard`, `.mp-card-prestige` | Add a `self` variant (the "you" fill) and a `quiet` variant (no fill). **No bordered disclosure cards.** Shaun rejected them, and computed-style tests guard League, Summary and Directory. |
| **Section heading** | "Needs you 2", "Upcoming · Court booked", "Your September · 5–2 · 2 days left" | `.section-heading`, `.mp-section-label`, `.fx-head` | Title + count + right-aligned meta + optional chevron. Where it is collapsible, the chevron is the only control affordance (Ledger rule for tier headings). |
| **Button, primary** | "I'm in", "Confirm booking", "Request" (gold fill, dark text) | `.mp-btn-primary` (38px tall, below the 44px target); legacy `.tab-btn.active` reused as a primary button on `#reqSubmit`, `#agSubmit`, `#copySummaryBtn`, `#nsSaveResult` | Gold is for the single obvious action. Fold the legacy `.tab-btn.active` uses into this primitive. |
| **Button, secondary / quiet** | "Can't play", "Swap a player", "Change plan" | `.mp-btn-secondary` | Quiet text button for "I can't make it". The design keeps backing out quiet. |
| **Button, destructive** | "Archive or remove…" (a level deeper, behind confirmation) | `.fx-remove-arm` / `.fx-remove-confirm`, `.fx-m-danger` | Keep the two-step arm → confirm. |
| **Pill / tag** | "No court" (dashed), "Booked", "Needs a 4th", "ADMIN", "DOUBLE", "2/4" | `.fx-tag`, `.fx-tag-attn`, `.fx-tag-past`, `.tier-badge`, `.idle-tag`, `.inactive-tag` | Add state variants: `booked`, `nocourt` (dashed), `attention`, `admin`. State is conveyed by text as well as colour. |
| **Segmented control** | Power / September; My games / Club; Best Month / League / Merit; One game / Paste a list; By player / List; A–Z / Rating | `.fg-toggle` / `.fg-toggle-btn`, `.section-subnav-item`, `.sortbtn`, `.preset-btn` (scoped) | **One** primitive with ARIA `role="tablist"`. **Keep the existing selectors scoped.** A test guards that min-games presets and state toggles don't cross-fire. |
| **Count badge** | Play tab badge; "Needs you 2"; lifecycle counters in 1h | none | Gold dot with a number. Hidden at 0, never "0". |
| **Lifecycle counter / filter row** | 1h: Attention · Upcoming · Called out · Requests | none | Four tappable counters that also filter. |
| **Date block** | 1g/1a: "TUE 30 Sep" solid block (booked); dashed/italic "Proposed" (not booked) | none | The solid versus dashed contrast carries **booked vs. not booked**. Keep it in text as well. |
| **Game row** (fixture) | 1g, 1h, 1a Next game | `.fx-card`, `.fx-head`, `.fx-body`, `buildUpcomingCardHtml`, `buildPendingRequestCardHtml`, `buildMyRequestCardHtml` | Two-line collapsed form: teams / meta. Expands in place (one open at a time, as Games does). Teams are shown as "You & X v Y & Z" for the viewer. |
| **Result row** | 1a Latest result, 1n Recent matches, 1p Recent results, 1r doughnut rows | `.lr-*` (Last Time Out), `.game-card-clickable`, `.doughnut-row`, `buildMatchDetailBlock` | **Winners first on neutral cards.** Player-point-of-view rows use `setsForViewer` / `scoreForViewer`, so a defeat reads as a defeat. Draws are marked and never "def"/W/L. Colour comes via `MatchOutcome.classFor()`. |
| **Player row** | 1c (Tier Rank · avatar · name · rating · move), 1o (avatar · name · "Tier B · #3 in tier" · rating) | `.pdir-row`, `.pdir-name`, `.pdir-meta`, initials avatar tinted by tier tokens | Reuse the Directory's avatar. "You" row is lit, not boxed. |
| **Table row** | 1e Merit (P W HW FW PTS), 1d race | `.merit-table`, `.merit-count`, `.tbl-count`, `tableCountCell`, `tableDrillRowHtml`, `tableCountDrillHtml`, `wireTableCounts` | Counts stay **buttons** that inherit colour. The shared drill-down is the only drill-down. Fixed layout: the name column yields. Nine columns fit in 341px. |
| **Drill-down panel** | 1f "2 hard wins" | `.merit-drill*` | Already the D6 component. Restyle only. |
| **Sheet** (bottom sheet) | 1i booking, 1k/1l/1m request, 1s Manage, 1b "Why it moved" | `.overlay` / `.sheet` (profile), `.shell-more-sheet` | One sheet primitive: handle, title, close, scroll body, sticky action. The system Back gesture closes it (Section 7, Phase 1). |
| **Toast** | 1i "✓ Moved to Upcoming · View" | The outcome banner above the bottom nav (removal outcome) | Generalise the existing banner. Its message comes from the module's `{ ok, reason }`, never invented. |
| **Stepper** | 1j Requested · Agreed · Booked · Played | none | Orientation only. The mapping is in Section 4.12. |
| **Form dots** | 1a, 1p "Form" | `.form-dot` + `MatchOutcome.classFor()` | Keep the default outline (unclassified reads as missing) and the source guard against truth tests. |
| **Avatar (initials)** | Everywhere | Directory / Home avatar | Reuse. |
| **Bottom navigation** | `MPTabBar` | `.shell-bottom-nav`, `.shell-nav-item`, `assets/icons/*.svg` | Section 4.1. |
| **List row with chevron** | 1n "Go deeper", 1p "More on Rishi", 1c "More tables" | `.shell-more-item` | This becomes the navigation-list primitive that replaces the More sheet. |
| **Disclosure line** | Where details fold | `.lg-*` disclosures: quiet text + chevron, no border | Keep the Ledger rule: no border, radius or fill. Tests enforce it. |

---

## 4. Area-by-area map

### 4.1 App shell and bottom navigation

- **Design:**
  - `MPTabBar`; the "Structure & system" board.
  - Five tabs: **Home · Rankings · Play · Players · Me**. Each tab owns one question.
  - **More is gone.**
  - A badge on Play shows "things waiting on you".
- **Current:**
  - `shell.js` `buildShellDom()` creates `.shell-bottom-nav` with Home / Rankings / Play / Players / **More**.
  - `SECTION_SUBNAV` sub-tabs:
    - Rankings: Power, W/L, League;
    - Play: Find Game, Games, Upcoming, Requests;
    - Players: Directory, Compare.
  - `MORE_ITEMS` holds Power Rating Guide, North vs South, Insights / Call-Outs, About, Doughnuts, Data & Rankings, plus My Player and Admin / Manage.
  - Everything routes through the hidden legacy `#tabrow .tab-btn`, clicked via `legacyTabBtn(tab).click()`.
  - **Home is implemented by clicking the legacy `summary` tab** and then swapping `#summaryView` for `#homeDashboard`, so `activeTab === 'summary'` while Home shows.
  - A quirk worth fixing inside Phase 1: `TAB_TO_SECTION.summary` ends up `'rankings'`, because the sub-nav loop overwrites the initial `home` value.
- **Consumes:**
  - `canSeeTab(tab)` / `TAB_VISIBILITY_KEY` / `canSee()` / `visibleFallbackTab()`;
  - `onVisibilityChanged`;
  - `isUnlocked` / `adminRole` for Admin;
  - `getCurrentViewer()` (My Player, `localStorage`) for Me and the badge;
  - `drawFirstScreen()` and the `DATA_READY` gate;
  - `renderActiveTab()`.
- **Preserve:**
  1. **Visibility settings govern every route** (D4). This applies to:
     - the tab bar;
     - sub-navigation;
     - landings;
     - every in-app shortcut;
     - the new Me list.
     A hidden screen falls back via `visibleFallbackTab`.
  2. **Legacy tab identities are untouched.** `#tabrow` stays as the internal router, which 101 test references use.
  3. **The boot order and first-screen draw**, including a tap made during load.
  4. **Admin access.** It stays behind unlock, and non-admins get the lock screen from `renderManage`.
  5. **The build stamp** stays at the foot of Admin / Manage.
  6. **Scroll-reset behaviour** on arrival (Insights at top).
- **Change:**
  - Replace **More** with **Me** (Section 4.15).
  - New icons: the design's SVG paths at 24px, stroke 1.5, active gold.
  - Label colours per Section 3.1.
  - Tab height at least 48px.
  - A Play badge (DQ29).
  - Sub-navigation becomes each section's own segmented control or in-page list, not a global sub-bar (**IA 30 Sep**):
    - Rankings: **Power | This Month**, plus a More tables list;
    - Play: **My Games | Club**, plus **Arrange a Game**;
    - Players: the Directory only. Compare leaves the sub-bar for the profile (Phase 5); until then it stays reachable from the Directory.
  - The system **Back** closes sheets and returns from drill screens (Phase 1; the audit found Back exits the app).
- **Mock-only:**
  - the status bar;
  - the home-indicator bar;
  - the badge count "2", and the badge rule itself (DQ29);
  - the 390px width.
- **Primitives:** bottom nav, count badge, segmented control, sheet.
- **Risk: High.**
  - Every screen's entry path changes, and More's items need new homes (Section 5).
  - It is mitigated by keeping `#tabrow` as the router and mapping new tabs onto the same legacy tab values.
- **Phase:** 1.

### 4.2 Home

> **IA 30 Sep supersedes `1a`'s no-hero base.** The target order is: a compact, interactive,
> live-data hero led by **This Month** (DQ31) → Needs You → Next Game → Last Time Out →
> light Around the Club.
> - The Monthly Snapshot is absorbed into the hero.
> - Match Ideas leaves Home (DQ32).
> - Power Rating, Tier Rank and form are simplified and demoted, not removed.
>
> The rest of this section still holds for the data sources and the rules to preserve.

- **Design:**
  - `1a` is the recommended base. It has no hero. The first viewport answers, in order:
    1. "how am I doing?";
    2. "is anyone waiting on me?";
    3. "when am I playing next?".
  - Hero alternatives `2a` scoreboard, `2b` watch dial, `2c` contextual headline, `3a`/`3b` club photography: DQ19.
  - `1b` "Why it moved": Section 4.2a.
- **Current:**
  - `renderHomeDashboard()` / `buildHomeDashboard()` in `shell.js`. It has:
    - a greeting hero;
    - a Your Game card (tier badge, Tier Rank, rating, form dots, insight line);
    - Last Time Out (`buildLastResultCardHtml`);
    - the monthly snapshot + "View Full Review";
    - Club Pulse;
    - Match ideas (folded).
  - Upcoming is deliberately not read on Home today.
- **Consumes:**
  - **Rating card:** `getViewerSnapshot(name)`, which gives:
    - `rating`;
    - `tierRank`, `tierRankOf`, `overallRank`;
    - `state` / `eligible` (`playerStateOf`);
    - `recentForm`.
    Also `computeRecentFormSequence` + `MatchOutcome.classFor`.
  - **Promotion line:** `computePromotionGap(name)`, which is only a proxy (DQ1).
  - **Needs you:**
    - the For me list in the Requests view-model;
    - Needs attention fixtures that include the viewer, via `FixtureFlow.stage()`, `attention()`, `availabilityOf()`, `respond()` and `requestOrder`.
  - **Next game:** the first fixture where `FixtureFlow.stage(req) === UPCOMING` and the viewer plays, in `upcomingOrder`. It **must not** use `snap.upcomingGames`, which still means "all agreed", Called Out included.
  - **"N of your requests are waiting on others":** the My Requests list.
  - **Your \<month\>:** `homeMonth()` (Meaningful Month, re-evaluated on arrival), plus:
    - the viewer's League row (`renderSummaryLeagueTable` data / `leagueSplit`);
    - Merit (`MeritTable.build`);
    - Race (`MonthlyRace`);
    - `MeaningfulMonth.countInMonth` for the record.
  - **Latest result:** `LastResult.mostRecent` and the existing Last Time Out card, with the engine's per-player delta.
  - **Around the club:** `computeClubPulse()`, which is actionable via `data-pulse-player`.
- **Preserve:**
  - one Tier Rank (D5);
  - "Unranked" wording with the reason for Idle / Inactive players;
  - form dots via `classFor`;
  - Home's own Meaningful Month and the note;
  - "View Full Review" opening Home's month without touching League's choice;
  - Match ideas stay gated by `canSee('findgame')`, with no predictions (D4);
  - Call-Outs off hides the "All Insights" link;
  - the Club Pulse chevrons;
  - "Select a player to personalise Home" when no viewer is chosen.
- **Change** (re-ordered by the IA; see the note at the top of 4.2):
  - **The hero:** This Month position and movement, and a tap into Rankings › This Month (DQ31). The "Your \<month\>" strip and the Monthly Snapshot fold into it.
  - A compact standing line under the hero: Power Rating, Tier Rank and form. It is **demoted**, no longer a card at equal weight with the month.
  - A **Needs you** block that exists only when non-empty, with inline "I'm in / Can't play".
  - A **Next game** card with a date block.
  - A Latest result row that opens 4.2a.
  - An "Around the club" list.
  - The greeting and date move into a small header.
  - The "SAME GAME. HIGHER STANDARDS." decorative hero is replaced by the live-data hero (DQ19 resolved). The existing `.home-hero` image slot may stay as its background.
  - Match Ideas moves to Play › Arrange a Game (DQ32).
- **Mock-only:**
  - "▲12 this week" (DQ2);
  - "58 pts to Tier 1" and the progress bar (DQ1);
  - "of 5 in Tier 2" with tier numbers. The real text is "#8 of 8 in Tier A";
  - "8:00pm · PadelX Canary Wharf · **Ct 3**": court number is not recorded (DQ10);
  - "Rishi wants a game · 2h ago": request age is fine only if derived from the request's own history timestamp;
  - Best Month "4th +18" as rating gained (DQ4). Monthly positions must name their tier (DQ24);
  - "6 games booked this week" as a pulse item unless it is derived from `stage()`;
  - Pulse copy such as "Osh is now #1 in Tier 2" without a real rank-change source.
- **Primitives:** card (self), section heading, count, primary/secondary buttons, date block, game row, result row, form dots, player row.
- **Risk: Medium.**
  - The data all exists, but Needs you and Next game need the shared viewer view-model from Play (4.6).
  - Home visual acceptance from 19 Sep is still open with CGPT / Shaun.
- **Phase:** 3a (hierarchy, text-first hero), then 3b (hero visual); after Play's view-model.

#### 4.2a Latest result → "Why it moved" (`1b`)

- **Current:**
  - The Last Time Out card + "View match ›" opens the game in Play › Games (`openMatchFromHome` / `openMatchInGames`).
  - A draw falls back to the Games feed.
  - The plain-English explanation is `RatingExplainer.explain()`, and the decimals are behind "See full calculation" (`buildMatchCalcDisclosureHtml`).
- **Consumes:** `MatchFacts`, `RatingExplainer.explain` / `standingOf` / `kText`, the engine's stored `ratingDelta`, and `tierRankOf` for the "Still #3 in Tier B" footer.
- **Preserve:**
  - it calculates nothing;
  - verdicts compare **game share only**;
  - never "above expectation" just because the match was won;
  - the 80/20 small print;
  - one rendering of K;
  - winners first on the neutral score, while the viewer's own line reads the result from their side.
- **Change:** a sheet showing:
  - the header result;
  - rating before → after with the delta;
  - three plain sentences from `explain().lines`;
  - the tier footer;
  - "See full calculation ›".
- **Mock-only:**
  - **The itemised "+8 / +3 / +1" breakdown.** The engine does not decompose a movement into additive reasons, so this would be invented arithmetic.
  - The reasons "straight sets counts a little more" and "lower-rated partner, you take more credit". Neither is how sequential-v1 works.
  - "Kaz & Len are both Tier 1".
- **Risk: Low.** It reuses existing text. **Phase:** 3.

### 4.3 Rankings / Power

> **IA 30 Sep:**
> - Power is **current club strength** (DQ3).
> - The **compact podium stays near the top**.
> - **Kings of Tiers becomes a secondary destination** (DQ18, DQ33).
> - Sorts and filters fold into one secondary control.
> - W/L and month-end history move to More tables.

- **Design:**
  - `1c`: a Power list **grouped by tier**. The number on the left is Tier Rank, with overall position in small print.
  - The viewer's row is lit.
  - A footnote on eligibility and unranked count.
  - "More tables": Win/Loss, Past months, Doughnuts.
- **Current:**
  - `render()` into `#list`, with:
    - the rankings hero (`buildRankingsHero`);
    - the podium (`renderRankingsPodium`);
    - Kings of Tiers (`renderKingsOfTiersPanel`);
    - a compact filter bar;
    - sort buttons (Rating / Month Rating / Form / Avg opp. / Clutch / Upsets / A–Z);
    - the tier bar;
    - the min-games filter (default 10, display only);
    - the Include idle / inactive toggles;
    - a month select (`selectedMonth`, Rankings-only, Meaningful Month default).
  - W/L is a separate sub-tab.
- **Consumes:**
  - `currentPowerRankings()`, `tierRankOf()`, `playerStateOf()` / `PlayerState.thresholdText`;
  - the tier tokens, `tierInScope()` for month views;
  - `monthlyViews` for month-end rating and movement;
  - `computeRecentForm` for the Form sort.
- **Preserve:**
  1. Tier Rank counts **rankable players only**, and Unranked is not counted in anyone's "of M".
  2. **Tier S exists.** Manny is the only S player. There are four groups, not three.
  3. The Include idle / inactive toggles, including "positions are for this view, not official ranks".
  4. The min-games filter stays a display filter only. It never decides whether someone has a rank.
  5. `selectedMonth` stays Rankings-only. A source test enforces it.
  6. "Month-end Power Rating" wording; never "Monthly Rating".
  7. No monthly-reset language.
  8. Tier move ≠ points earned.
  9. Club-decision movement is labelled as such.
- **Change:**
  - Tier-grouped sections with a Tier Rank numeral, an initials avatar, the name, overall position in small print, the rating (serif), and movement.
  - The lit "you" row.
  - A footnote from `thresholdText` plus the live unranked count.
  - A "More tables" list at the foot.
  - The sort chips and filters fold behind one quiet control (they are not removed).
  - A compact podium near the top, and a "Kings of Tiers ›" row (DQ18 resolved, DQ33).
  - The month select leaves Power. Month-end history is reached from More tables › Past months (DQ3, confirmed 30 Sep).
- **Mock-only:**
  - "Tier 1 · 1,700 +", "Tier 2 · 1,600 – 1,699", "Under 1,600". **Tiers are club classifications (S/A/B/C) set by board decision, not rating bands**;
  - "Ranked players have 5+ games in the last 60 days". The real rule is **2+ rated matches in 30 days**;
  - "Movement = last 7 days" (DQ2);
  - "15 members", "3 members unranked": these must be counted live;
  - the mock ratings and names.
- **Primitives:** segmented control, section heading (tier), player row, list row with chevron, pill (IDLE / INACTIVE).
- **Risk: High.**
  - Rankings carries the most accepted, test-pinned behaviour.
  - Kings and the podium are kept (DQ18 resolved): the podium is made compact and Kings becomes secondary. Neither is redesigned beyond that.
  - The default month differs (DQ3).
- **Phase:** 4.

### 4.4 Monthly Rankings → "This Month"

> **IA 30 Sep:**
> - The segment is **This Month**. It shows **League · Merit · Race**, League first (DQ4 settled).
> - One shared month and one drill-down pattern.
> - **Last 10, Monthly Performance and the monthly stories move to More tables.**
> - The Information view goes behind a methodology disclosure.

- **Design:**
  - `1d`: a "September" segment beside Power.
  - A Best Month / League / Merit switch, with the question as a headline.
  - A "Leading" card.
  - A single ranked list of "Power Rating gained, min 3 games".
  - "2 days left".
- **Current:**
  - Rankings › League (`summary` tab) → `renderSummary()`.
  - A Month select (`summaryMonth`, Meaningful Month).
  - A View select: League Table / Merit Table / Monthly Race / Information.
  - League has By tier / All together / Last 10.
  - The Monthly Summary disclosure and the monthly stories (Key takeaways, Monthly Performance, and the folded Rating Movement / Ranking Movement / Moved without playing / Crossovers).
- **Consumes:**
  - `summaryMonth` (not `selectedMonth`);
  - `leagueSplit` / `tierAsOf`;
  - `MeritTable.build`;
  - `MonthlyRace` (par-based stakes, K=20, `MIN_MATCHES = 5` per tier spell, provisional below 5, "No qualifier this month");
  - `LastTen`;
  - `buildMonthlyStoriesHtml`, `monthlyViews`;
  - `MeaningfulMonth.evaluate` + `meaningfulMonthNoteHtml`.
- **Preserve:**
  - **All five monthly stories stay distinct:** Power Rating, Monthly Race, Monthly Performance, League, Merit.
  - **Every table is by tier:**
    - a split-month mover appears in each tier spell;
    - points never transfer;
    - the Race is **By tier only**.
  - The one-player tier section folds on arrival.
  - Tier headings are `.section-heading`, each collapsing independently.
  - Disclosures are text + chevron with no border.
  - The Month and View controls stay on one row, or become one row of segmented control plus month.
  - The Race drill-down shows stakes and points per match (the win-chance line is Section 5 Open Question 1).
- **Change:**
  - Month becomes a top-level segment labelled with `summaryMonth`'s month name.
  - The table choice becomes a segmented control with the question as a headline.
  - A per-tier "Leading" line.
  - "N days left" when the month is current.
- **Mock-only:**
  - **Best Month = "Power Rating gained in September, minimum 3 games".** The real Race is a race score from pre-match stakes against a tier-average par, qualifies at **5 matches per tier spell**, and ranks within tier.
  - A single cross-tier list.
  - "Kaz 6–1 +41".
  - The segment literally named "September". It must follow `summaryMonth`, which on the 1st may be the previous month.
- **Primitives:** segmented control, section heading (tier), table row, drill-down panel, disclosure line.
- **Risk: Medium–High.** The switch order is settled (DQ4). Information, the Monthly Summary and Last 10 now have homes (Section 5), but moving them touches test-pinned DOM (`#summaryContent`).
- **Phase:** 4.

### 4.5 League / Merit tables and statistic drill-down

- **Design:**
  - `1e`: Merit columns P W HW FW PTS, with points in serif.
  - `1f`: tapping "HW" opens "2 hard wins", listing the games with "Their pair 1,750 avg · yours 1,643".
- **Current:**
  - `buildLeagueTableHtml`, `buildMeritTableHtml` / `renderMeritTable`, `buildRaceTableHtml`, `buildLastTenTableHtml`.
  - The D6 shared drill-down: `tableCountCell` / `tableDrillRowHtml` / `tableCountDrillHtml` / `wireTableCounts`.
  - League rows carry `matchList`; Merit rows carry `games`.
- **Consumes:** as today. The count and its drill-down are the **same object** (`build()` carries the qualifying matches).
- **Preserve:**
  1. **Merit rule:**
     - win = 3 ± tier-step difference, where partnership strength is the **sum** of tier levels (AC = BB);
     - floored at 0 on the favourite side;
     - **draws score 0**;
     - it is not a rating.
  2. Hard and Favoured are decided by **fixture-date tiers**, not ratings. Hard, Favoured and even wins are exhaustive.
  3. **P / W / D / L stay** and are drillable (D6). Hard and Fav too.
  4. The drill heading format is "Rishi · Wins · September 2026 · Tier A · 2 games".
  5. The Hard/Fav same-day order is kept (the legacy comparator).
  6. P counts inherit colour.
  7. The table fits 375px with no sideways scroll.
- **Change:**
  - Restyle the table: short headers, tabular figures, serif points, the lit "you" row.
  - Restyle the drill-down as a sheet or inline panel with result rows.
- **Mock-only:**
  - "Hard win (beat a higher-rated pair) 3 pts · Favoured win 1 pt";
  - "Their pair 1,750 avg · yours 1,643". The qualifying gap is **tier steps on the day**, not rating averages;
  - the absence of D and L columns;
  - "6 of your 9 merit points".
- **Primitives:** table row, drill-down panel, result row, section heading.
- **Risk: Low–Medium.** The behaviour is fully test-pinned (`.merit-count` 16 refs, `.merit-drill*`, `.lg-tier-head` 26), and this is a restyle.
- **Phase:** 4.

### 4.6 Play / My Games

> **IA 30 Sep:**
> - **My Games | Club** are the only primary views. The lifecycle states are sections within them.
> - **Arrange a Game** is the single entry for Find a Game, Request a game and Add multiple games (4.8, 4.9, 4.16).
> - **Challenges go into My Games** (DQ22).
> - **Played Games & Results** stays as the history destination.

- **Design:**
  - `1g`: one list ordered by what needs doing:
    1. Needs you;
    2. Upcoming (court booked, soonest first);
    3. Called out (agreed, needs a court);
    4. Waiting on others (newest first);
    5. Archived call-outs;
    6. "Played games & results ›".
  - A Request / Find a game header.
  - A My games / Club switch.
  - Players never see "state" or "status".
- **Current:** four Play sub-tabs:
  - **Find Game** (`renderFindGame`);
  - **Games**: the result history, filters, Add result, approvals and Admin Manage (`renderGamesTab`);
  - **Upcoming**: Needs attention / Upcoming / Called Out / Archived call-outs, plus the Admin-only "Court bookings to record" (`renderUpcoming`);
  - **Requests**: Challenges / For me / My Requests / Other requests / Request a game / Admin add / Add multiple games (`renderWishlist`).
- **Consumes:**
  - `FixtureFlow`: `stage`, `baseStage`, `attention`, `availabilityOf`, `seats`, `isBooked`, `archiveInfo`, `archiveDueAt`, `requestOrder`, `upcomingOrder`, `calledOutOrder`, `archivedOrder`, `respond`, `cantPlayers`, `confirmedCount`, `summaryLine`.
  - The existing For me / My Requests / Other list split.
  - `submissionIdentity()` / `getCurrentViewer()`.
  - `gameRequestsState`.
- **Preserve:**
  1. **Lifecycle rules live in `fixtureFlow.js`.** `app.js` only draws.
  2. **The stages.** Stages are derived and never stored:
     - PROPOSED
     - CALLED_OUT
     - UPCOMING
     - ATTENTION
     - ARCHIVED
     - PLAYED
     - REMOVED
  3. **Nobody confirms another player**, except the Admin override, which is recorded as the Admin's act.
  4. **Backing out keeps the fixture** and moves it to Needs attention.
  5. **The 14-day Called Out archive** is derived from `activeSince`, with no write. Archived call-outs are read-only (no I'm in / Can't play), but can still take a result.
  6. **Orders:**
     - Called Out newest (or newly restored) first, by `activeSince` (DQ13);
     - Upcoming soonest first;
     - requests newest first.
  7. Other requests arrive folded.
  8. "Date passed" is flagged, and Admins close them.
  9. Last writer wins on the fixtures document. A known limitation: no new concurrent-write paths.
- **Change:**
  - **A new pure view-model**, for example `playView.js`:
    - `myGames(viewer, now)` returns `{needsYou, upcoming, calledOut, waitingOnOthers, archived}`;
    - `clubCounts(now)`.
    - It is built only from `FixtureFlow` and the existing list split, so Play, Home and the badge read the same thing.
  - The My games screen renders it.
  - Inline respond buttons.
  - Solid date block versus dashed "No court".
  - The Games history becomes "Played games & results ›", a sub-page, not deleted.
- **Mock-only:**
  - **"Find a replacement"** as a player action. Replacement is Admin-only (DQ7).
  - "Court is still booked" when no booking was recorded.
  - Venue names with areas ("PadelX Canary Wharf", "Rocket Padel Wimbledon"). The record holds a free-text `location`.
  - "2h ago", unless derived from history timestamps.
  - Needs you counting "Needs a 4th" for a player who is not in the game.
- **Primitives:** segmented control, section heading + count, game row, date block, pill, primary/secondary buttons, list row with chevron.
- **Risk: High.**
  - It merges four screens' entry points, and the fixture tests (`.fx-*`, `#upcomingView` and others) pin today's DOM.
  - Mitigation:
    - the view-model gets its own module tests;
    - the old tabs stay reachable until the new list is accepted.
- **Phase:** 2.

### 4.7 Club fixture views

- **Design:**
  - `1h` Club: four counters (Attention · Upcoming · Called out · Requests) that are both the lifecycle and the filter.
  - Called-out rows collapse to two lines; tapping expands the proposal.
  - Actions: "Change plan" / "I've booked a court".
  - "Archives in 13 days".
  - "Show 2 more".
  - "Archived call-outs · 3".
- **Current:**
  - The Upcoming tab: Needs attention (only when present), Upcoming, Called Out, Archived call-outs; collapsed cards.
  - "Other requests" on the Requests tab.
  - Called Out card copy: "Proposed: Tue 29 Sep · 20:00 · PadelX / 4/4 agreed · Court not booked · Called out 6d ago".
- **Consumes:** `FixtureFlow.stage` counts, `calledOutOrder`, `archiveDueAt` / `archiveInfo`, `calledOutAt`, `agreedAt`, `summaryLine`, `isBooked`.
- **Preserve:**
  - Needs attention sits at the top when present;
  - each folded card still says whether a court is booked;
  - Called Out newest (or newly restored) first;
  - archive and restore only in Manage fixture;
  - the Admin-only "Court bookings to record" review.
- **Change:**
  - A counter/filter row.
  - A two-line collapsed row.
  - "Archives in N days" from `archiveDueAt`.
  - Paging with "Show N more".
- **Mock-only:**
  - **"I've booked a court" for players** (DQ6);
  - **"Change plan" for players** (DQ8);
  - nothing on order: the design's "Newest first" already matches `calledOutOrder` (DQ13);
  - "No time proposed yet" is fine as copy for an empty `preferredTime`.
- **Primitives:** lifecycle counter row, game row, pill, disclosure line.
- **Risk: Medium.** **Phase:** 2.

### 4.8 Requests → Arrange a Game

> **IA 30 Sep:** the request sheet is reached through **Arrange a Game**, which offers:
> 1. **Find a game:** suggestions, including Match Ideas (DQ32);
> 2. **Request a game:** four slots;
> 3. **Add multiple games:** paste a list.
>
> These are one entry point, not three places.

- **Design:**
  - `1k` Request a game: a sheet with four slots, not a form.
  - "You're confirmed automatically. The other three get a request."
  - "Good fits" suggestions from Find Game logic, with no percentages.
  - "Suggest a time & place (optional)".
  - The button label says what is missing ("Add 1 more player").
  - Answering requests happens inline in `1g` / `1a`.
- **Current:**
  - `renderWishlist()`:
    - the Request a game fold;
    - For me / My Requests / Other requests;
    - Challenges;
    - Admin add straight to Upcoming (`⚡` heading);
    - Predict a Matchup → Add to Upcoming (Admin);
    - `buildMyRequestCardHtml`, `buildPendingRequestCardHtml`.
- **Consumes:**
  - `FixtureFlow.createRequest` (the requester is in), `respond`, `matchupDuplicates`, `requestOrder`;
  - `requestTeams()` (optional `teams`);
  - `buildFindGameRecommendations` / `buildCompleteMatch*` for suggestions;
  - `PlayerNames` for display.
- **Preserve:**
  - doubles only: two against two;
  - the requester is confirmed only if they play;
  - active duplicates are warned about;
  - Challenges keep their bridge into a request (`fromChallenge`);
  - Admin add asks "Court booking made", unticked by default, so the game lands in Called Out;
  - Predict a Matchup stays Admin-only;
  - the "Request Game ›" hand-off from Find Game and profiles still pre-fills.
- **Change:**
  - A sheet with four slot chips and search.
  - A suggestion strip.
  - An optional time and place.
  - A "what's missing" button label.
  - The Requests tab content is absorbed into Play (My games / Club) plus the sheet.
- **Mock-only:**
  - **"Suggest a time & place" on a plain request is open (NEXT #18, DQ9).**
  - The suggestions must be gated like Find Game (`canSee('findgame')`) and **show no favourite call** (D4).
  - The emoji `⚡` on the Admin heading goes with the redesign.
- **Primitives:** sheet, segmented control (One game / Paste a list), slot chip, player row, primary button.
- **Risk: Medium.** **Phase:** 2.

### 4.9 Bulk request parser

- **Design:**
  - `1l` Paste a list: a WhatsApp-style textarea; the button counts lines ("Read 5 games").
  - `1m` Review:
    - problems float to the top;
    - confident lines collapse to a ticked line;
    - an ambiguity picker ("Who's E? Eli / Erf");
    - "You're not playing — all 4 get asked";
    - duplicates are "skipped" with an Include toggle;
    - the send button says what is left ("Pick 'E' to send 4 requests").
- **Current:**
  - `fixtureParse.js` plus "Add multiple games" (`wireBulk`, `.fx-bulk-*`, `.fx-review-row`).
  - Line states: ready, duplicate, ambiguous, near miss, unknown, unparseable.
  - One "Create N requests" writes them with a batch id.
- **Consumes:** `FixtureParse` (sides split on `v|vs|versus|against`; partners on `& / + and ,`; "me"/"myself" = the chosen viewer), `FixtureFlow.matchupDuplicates`, `createRequest` with batch.
- **Preserve:**
  1. **Names are never guessed.**
     - Only exact directory names resolve.
     - Near misses ("Stormz" → Stormzy) are **offered, never accepted**.
     - An old name after a rename is flagged unknown.
  2. **Duplicates are warned about, not skipped.** Today's default is to include.
  3. Problems are named per line.
  4. The review font is the interface font.
- **Change:**
  - Problems-first ordering.
  - A one-line ticked row for ready lines.
  - An inline picker for ambiguous and near-miss names.
  - A live count on the button.
- **Mock-only:**
  - **`"Ant" → Ant Slicer` shown as an accepted, ticked line.** It must render as a near miss that needs a tap.
  - **Duplicates skipped by default** (DQ12).
  - The "Nicknames are fine" copy. Only real names and exact matches resolve, so the copy must say names are matched exactly.
- **Primitives:** sheet, segmented control, textarea, review row, picker chips, primary button.
- **Risk: Low–Medium.** The module is untouched, so this is presentation. **Phase:** 2.

### 4.10 Called Out

- **Design:**
  - Rows in `1g` (dashed "No court", italic "Proposed …").
  - The Club list in `1h`.
  - `1i`, the booking sheet:
    - Date / Time / Venue / Court (optional), pre-filled from the proposal;
    - "Confirming tells all four players and moves this game to Upcoming";
    - a toast: "✓ Moved to Upcoming · View".
- **Current:**
  - The Called Out section of Upcoming.
  - Court booking is recorded **only by an Admin**:
    - the "Court booking made" tick in Manage fixture;
    - the Admin-only "Court bookings to record" list.
  - `FixtureFlow.setCourtBooking` refuses non-admins.
- **Consumes:** `setCourtBooking`, `isBooked` / `bookingRecorded`, `calledOutAt` / `activeSince` / `archiveDueAt`, `adminEdit` (date / time / venue).
- **Preserve:**
  - An archived call-out is read-only for players.
  - Unticking a booking starts a new 14-day window, keeping the original `calledOutAt`.
  - Needs attention pauses nothing.
  - Restore gives 14 more days.
- **Change:**
  - The booking sheet becomes the **Admin's** booking action in Phase 2, reached from the ··· Manage sheet (4.18) and from the "Court bookings to record" list.
  - The toast confirms the stage change.
- **Mock-only:**
  - **The player-facing "I've booked a court"** (DQ6);
  - **"Confirming tells all four players"**: there is no notification system, and none is proposed;
  - **the Court number field** (DQ10).
- **Primitives:** sheet, form field, primary button, toast, pill.
- **Risk: Medium.** It depends on DQ6. **Phase:** 2.

### 4.11 Upcoming

- **Design:**
  - The Upcoming section of `1g` (date blocks, "Court booked", soonest first).
  - Home Next game (`1a`).
  - The Upcoming counter in `1h`.
  - "The only state that shows on Home as Next game."
- **Current:** the Upcoming section of `renderUpcoming()` (`buildUpcomingCardHtml`), plus the folded admin-only prediction (`matchPredictionHtml`, `wireRequestPredictions`).
- **Consumes:** `stage === UPCOMING`, `upcomingOrder`, `availabilityOf`, `canSeePredictions()`.
- **Preserve:**
  - The predicted split is **Admin-only**, folded, from `matchPredictionHtml()`, with share-of-games wording and never "chance" or "probability".
  - Past dates show "Date passed" for Admins to close.
  - D3 reconciliation at approval (a result matched to a fixture by players, partnerships and date; the Admin chooses).
- **Change:** date-block rows; "In 2 days"; the four players with their answers.
- **Mock-only:** "Court booked · all 4 in" is fine when true. Court number and "booked by" are not recorded (DQ10).
- **Primitives:** game row, date block, pill.
- **Risk: Low–Medium.** **Phase:** 2.

### 4.12 Game detail

- **Design:**
  - `1j` Game (booked). It is a full screen with:
    - a four-step bar (Requested · Agreed · Booked · Played);
    - the date and time with "in 2 days";
    - the four players with ✓ In;
    - the venue card ("Court 3 · booked by PDM on 26 Sep", Directions);
    - Add to calendar;
    - "Score entry opens here after 8:00pm on Tuesday";
    - a quiet "I can't make it — the game stays".
  - The `···` menu opens the Admin sheet (4.18).
- **Current:**
  - There is **no fixture detail screen.** Fixtures are expandable cards in lists (`.fx-card` / `.fx-body`).
  - A played game's detail is `buildMatchDetailBlock` in Play › Games (`openMatchInGames`).
- **Consumes:**
  - `FixtureFlow.stage` / `baseStage` for the stepper;
  - `availabilityOf` / `seats`;
  - `respond(req, 'cant')` for the player's own "I can't make it". `markBackedOut` / `setAvailability` are the Admin's versions and are admin-gated;
  - `linkedResultIds` / `candidatesForFixture` for Played;
  - `summaryLine`.
- **Preserve:**
  - Backing out never deletes the fixture; it goes to Needs attention.
  - A player can act only for themselves (`submissionIdentity`), with the Admin override recorded as the Admin's act.
  - Results still go through submission → Admin approval, which plans an append and shows who moves.
- **Change:**
  - A new route/sheet: fixture detail, reusing the card body.
  - **The stepper's mapping of stages:**

    | Stage | Stepper |
    |---|---|
    | PROPOSED | Requested |
    | CALLED_OUT | Agreed |
    | UPCOMING | Booked |
    | PLAYED | Played |
    | ATTENTION | "Agreed/Booked" with a Needs attention tag, **not a fifth step** |
    | ARCHIVED | Greyed at Agreed with "Archived" |
    | REMOVED | not shown to players |

  - "Add result" on the fixture pre-fills the existing result form's players and sides (DQ11).
- **Mock-only:**
  - "Court 3", "booked by PDM on 26 Sep", Directions, **Add to calendar** (DQ10);
  - "Score entry opens after 8:00pm", a time gate that does not exist (DQ11);
  - "the others can find a replacement" (DQ7);
  - Share (backlog, parked).
- **Primitives:** stepper, player row, card, sheet / route, quiet button, pill.
- **Risk: Medium.** It is a new screen, and Back must return correctly (see Phase 1). **Phase:** 2.

### 4.13 Players

> **IA 30 Sep:**
> - **Directory → Profile** is the journey, and search is the primary Directory interaction.
> - Advanced filters and sorts are secondary: one quiet control, keeping their behaviour.
> - **Compare leaves the Players sub-bar** for the profile (DQ21).

- **Design:**
  - `1o`: search first ("Search 15 members");
  - "Played with recently" avatar chips;
  - Everyone with A–Z / Rating;
  - rows of avatar, name, "Tier 2 · #3 in tier", rating;
  - no sparklines or W/L columns.
- **Current:**
  - `renderPlayersTab()` / `wirePlayersControls()`.
  - The Directory, finished 26 Sep:
    - a quiet filter line;
    - a compact sort;
    - small chips;
    - tier-tinted initials;
    - letter headings when A–Z;
    - Inactive badged;
    - `.pdir-row` / `.pdir-name` / `.pdir-meta`, with 7 tests pinning the look.
  - The Compare sub-tab (H2H).
- **Consumes:** `PLAYERS`, `tierRankOf`, `playerStateOf`, `playerFilter`, `PlayerNames`; recent partners/opponents from `matchesIncludingDraws()` for the viewer.
- **Preserve:**
  - `canSee('players')`;
  - filters, sorting, status semantics;
  - names via `escapeHtml`;
  - the Directory's accepted look, unless CGPT reopens it;
  - Compare / H2H stays reachable. It moves into the profile's "You vs them" (DQ21 settled), and the old sub-tab stays until that ships.
- **Change:**
  - The search field is first.
  - A "Played with recently" strip.
  - Row meta "Tier B · #3 in tier", or "Tier B · Idle".
- **Mock-only:**
  - "15 members" (count live: 34 players);
  - tier numbers;
  - a "#n in tier" for Idle / Inactive players. They are Unranked.
- **Primitives:** search field, player row, avatar chips, segmented control.
- **Risk: Low–Medium.** Accepted recently, so keep the changes small. **Phase:** 5.

### 4.14 Other-player profile

> **IA 30 Sep:** the order is:
> 1. identity and current standing;
> 2. **You vs them**, which absorbs Compare / H2H for the viewer and this player;
> 3. recent activity;
> 4. deeper analysis behind progressive disclosure: journey, partnerships, rivals, full stats.

- **Design:**
  - `1p` Rishi. Four answers before scrolling:
    1. who (tier, tier rank, overall);
    2. how good (rating, movement, record);
    3. how playing (form);
    4. how you compare ("You & Rishi": against 2–4, partners 3–1, last met, next game, "Request a game with Rishi").
  - Then Recent results.
  - "More on Rishi": Partnerships & rivals, Rating journey, Reliability & vs expectation, Rating calculations.
- **Current:**
  - `openSheet()` wrapped to `renderPremiumProfile()`, with:
    - the hero;
    - the facts row (Tier · Reliability · Games · Joined);
    - Player Analysis;
    - the Rating Journey (`buildJourneySection`);
    - recent form;
    - partnerships;
    - the ranking neighbours;
    - the Call-Out / "Match to Prove It" (gated by Call-Outs);
    - the monthly rating section;
    - the match log with "Why your rating moved";
    - the profile's own month control on Recent Results;
    - Admin-only tools: reassessment, historical adjustment, player tags / rename.
- **Consumes:**
  - `tierRankOf`, `playerStateOf`;
  - `computeRecentFormSequence`;
  - `matchesIncludingDraws()` for H2H;
  - `BEST_PARTNER` / `buildPartnerships`;
  - `journeyView` / `V3_JOURNEY`, `RatingExplainer`;
  - `setsForViewer` / `scoreForViewer`;
  - `profileMonth`;
  - `FixtureFlow` for "Next: …" (UPCOMING only);
  - `canSee('wishlist')` for the request button.
- **Preserve:**
  - one Tier Rank;
  - the Reliability percentage with its band, which means **rating evidence**;
  - the journey replays persisted events. It never reconstructs; tier changes are dashed annotations; club decisions are marked;
  - draws are counted in H2H and records, and shown as DRAW;
  - the profile month is independent;
  - Admin tools render only for admins;
  - the Historical Match Correction lives only in Games.
- **Change:**
  - A header with tier, tier rank and overall.
  - A rating / record / form row.
  - A "You & \<name\>" card when a viewer is set and is not this player.
  - Recent results rows.
  - The existing modules move under "More on \<name\>" as list rows. They are not deleted.
- **Mock-only:**
  - **"Against him · He leads"**: gendered copy. Use the name ("Rishi leads 4–2") (DQ17).
  - The record "64–31" without draws. It must read W–D–L when draws exist.
  - "▲ 6" movement (DQ2).
  - "Works well" as a verdict. Only the counts are facts.
  - "Tier 1 · #1 overall" tier numbers.
- **Primitives:** card, avatar, stat row, form dots, result row, list row with chevron, primary button.
- **Risk: Medium.** The profile is large, and its wrapper rebuild is fragile (Ledger: calling `renderPremiumProfile` again rebuilds after match cards were moved into it). **Phase:** 5.

### 4.15 Me

> **IA 30 Sep:** Me is a **personal dashboard, distinct from a public profile**. It covers:
> - my performance;
> - this-month standing;
> - history;
> - personal settings: My Player and Data & Rankings;
> - the gated Admin tools.
>
> The Power Rating Guide and About sit here or deeper. The public profile stays one tap away ("View my profile").

- **Design:**
  - `1n`: an identity header ("Member since 2023 · 148 games");
  - Power Rating with "▲ 52 since April";
  - Tier Rank;
  - a rating journey Apr–Sep with the line "Tier 1 starts at 1,700 · 58 to go";
  - September positions;
  - Partners & rivals;
  - Recent matches.
  - **Go deeper:**
    - Performance vs expectation;
    - Reliability ("turned up for 47 of 48");
    - All partnerships & head-to-heads;
    - Rating calculations;
    - Doughnuts;
    - Settings & notifications;
    - Admin tools (admins only).
- **Current:**
  - There is **no Me tab.** The viewer's own profile is the same `renderPremiumProfile`.
  - My Player (the viewer selector) is in More.
  - Data range, the Power Rating Guide and About are in More.
  - Admin / Manage is in More.
- **Consumes:**
  - `getCurrentViewer()`, `getViewerSnapshot()`;
  - the same profile sources as 4.14;
  - `playerJoinedLabel()`, which is the **first recorded game**, not membership;
  - `p.lifetimeMatches`;
  - the monthly sources as for Home;
  - `computeDoughnutStats`;
  - `buildViewerSelector()`, `openDataRangeSheet()`, `openPowerRatingGuide()`, `openAboutPowerRankings()`;
  - `renderManage()` behind unlock.
- **Preserve:**
  - Identity is **self-declared, not security**. The UI must not imply sign-in.
  - Every former More destination stays reachable (Section 5).
  - Visibility gating.
  - The Admin section is invisible unless unlocked.
- **Change:**
  - Me becomes a section. It lands on the viewer's dashboard; without a viewer it shows the selector.
  - Its lower list replaces the More sheet.
- **Mock-only:**
  - **"Reliability — Turned up for 47 of 48 booked games".** Attendance is not recorded, and **Reliability already means rating evidence.** Reusing the word would contradict the Power Rating Guide (DQ15).
  - "Member since 2023". The record starts in June 2026; use "First game Jun 2026" from `playerJoinedLabel`.
  - The "Tier 1 starts at 1,700" goal line (DQ1).
  - "▲52 since April": April / May are display-only history and never enter a journey.
  - **"Settings & notifications"**: there are no notifications. Settings = My Player + Data range.
  - "Toughest rival 3–5 against". `topRivalry` counts meetings, not W–L; this needs a small new helper over `matchesIncludingDraws()`, and the label must not overclaim.
- **Primitives:** card, stat row, chart container (existing journey), list row with chevron, pill (ADMIN).
- **Risk: Medium.** It is new, but built from existing pieces. **Phase:** 1 as a shell (the list replacing More), 5 for the dashboard.

### 4.16 Find a Game

> **IA 30 Sep:** Find a Game is no longer a Play destination. It is the first option
> inside **Arrange a Game** (4.8). Its entry moves in Phase 2, and its card restyle is Phase 6.

- **Design:**
  - `1q`: filter chips (Close game / New partner / Rematch / Step up).
  - Cards labelled "Evenly matched · Best fit" / "A stretch", each with a human reason ("You haven't partnered Len since July — you won 5 of 7 together") and Swap a player / Request.
  - "The prediction engine drives the ranking but never shows a percentage to players."
- **Current:** `renderFindGame()` with:
  - Player / Scope (Within my tier / Any tier) / Difficulty (Easy / Balanced / Hard);
  - Build a Match (Play with / Play against);
  - `renderBestMatchCard` / `renderAltCard` / `renderSeeAllSection`;
  - `whyLinePublic` for players;
  - percentages and the favourite call gated by `canSeePredictions()`.
- **Consumes:** `buildFindGameRecommendations`, `buildCompleteMatch*`, `canSee('findgame')`, `canSeePredictions()`, `BEST_PARTNER`, and the H2H meeting counts.
- **Preserve:**
  - **No percentage and no favourite or underdog call for players** (D4);
  - the Find a Game visibility setting (default Visible);
  - Request hands off to the request sheet, pre-filled;
  - Admins still see predictions.
- **Change:**
  - Chip filters mapped onto the existing Scope / Difficulty / Build parameters where they correspond:
    - "Close game" ≈ Balanced;
    - "Step up" ≈ Hard;
    - "New partner" and "Rematch" are new filters over existing partnership and H2H data (DQ26).
  - Reason lines.
  - A card per suggestion.
- **Mock-only:**
  - **"Evenly matched" / "A stretch" as per-card labels.** They are qualitative favourite calls (DQ26).
  - "you won 5 of 7 together": fine if from `BEST_PARTNER` / partnership data.
  - "All four played this week": fine if derived.
- **Primitives:** chip filter, card, reason line, primary / secondary buttons.
- **Risk: Medium** (D4 compliance). **Phase:** 2 for its entry inside Arrange a Game; 6 for the card restyle.

### 4.17 Doughnuts

- **Design:**
  - `1r`: reached from Rankings › More tables and from Me.
  - The month picker sits outside the By player / List switch.
  - List rows: date block, winners, a set with the 6–0 in gold, losers, and a "DOUBLE" tag.
- **Current:**
  - D7: `openDoughnutLeaderboard()` from More.
  - `doughnutMatches(month)` is the one definition.
  - By Player and Doughnut List share `doughnutMonth` (Meaningful Month default, choice kept).
  - Rows use `doughnutListRowHtml`: newest first, ties by id, winners first, shutout set picked out, draws marked.
  - Tapping a row opens the game in Play › Games.
  - Both views have an empty state.
- **Consumes:** `doughnutMatches`, `computeDoughnutStats`, `arriveAtDoughnuts`, `chooseDoughnutMonth`.
- **Preserve:**
  - the definition is unchanged;
  - winners first;
  - draws marked;
  - the shared month;
  - empty states;
  - April / May show "No doughnuts in …" (display-only history; Section 5 item 5).
- **Change:** entry points (Rankings › More tables; Me › Doughnuts; confirmed by the IA); a date-block row; a "DOUBLE" tag when both sets are 6–0.
- **Mock-only:** "2 this year" on Me. That is a new year scope, so use the viewer's all-time count or the Meaningful Month.
- **Primitives:** segmented control, month select, result row, date block, pill.
- **Risk: Low.** It shipped today and is test-pinned (`.doughnut-row`, `.doughnut-result`). **Phase:** 6.

### 4.18 Admin contextual controls

- **Design:**
  - `1s` Manage fixture, a sheet from `···` on any game:
    - Prediction "46% / 54%" (admins only);
    - Court booking › ;
    - Replace a player;
    - Record a back-out;
    - Edit result;
    - Archive or remove….
  - Players see only "Add to calendar" and "Share" in `···`.
  - "Admin power is a sheet, not a mode."
- **Current:**
  - Manage fixture in the expanded fixture card (`.fx-manage-toggle`, `.fx-m-*`).
  - The Games history `··· Manage` per card, one open at a time.
  - Admin / Manage: a ten-section accordion, collapsed by default, with the build stamp at the foot.
  - Predict a Matchup (Admin).
  - The Monthly Review, Historical Club Adjustment and Historical Match Correction tools.
  - Player tags / rename.
  - Beta diagnostics / record health.
- **Consumes:** `FixtureFlow.setCourtBooking`, `replacePlayer`, `setAvailability` / `markBackedOut`, `adminEdit`, `archiveCallOut` / `restoreCallOut`, `adminRemove`; `matchPredictionHtml()`; `isUnlocked` / `adminRole`.
- **Preserve:**
  1. Admin-only is enforced by the module (`{ok:false, reason:'not-admin'}`) and by the UI.
  2. Removal is soft, two-step and attributed.
  3. **The Historical Match Correction stays only in Games.** The sheet's "Edit result" links there and does not duplicate it.
  4. The accordion is collapsed by default, with no emoji headings.
  5. **The build stamp stays at the foot of Admin / Manage.**
  6. `isUnlocked` is a UI gate, not security, and says so.
- **Change:**
  - One Admin sheet primitive opened from `···` on the fixture detail and the list rows.
  - The same sheet also carries the booking action (4.10).
- **Mock-only:**
  - **"Win probability exists only here".** The copy must be the approved share-of-games wording, "Expected to win about N% of the games, against M%". **Never** "probability" or "chance". A test enforces this for Predict a Matchup.
  - "Share" / "Add to calendar" for players (DQ10).
  - The Predict a Matchup visual render is still awaited from Shaun (NEXT #21).
- **Primitives:** sheet, list row with chevron, destructive button, pill (ADMIN), prediction block.
- **Risk: Medium.** **Phase:** 2 (fixture sheet); 6 (Admin / Manage restyle).

---

## 5. Current features the design does not place, and where they would go

Removing More and flattening Play means every item below must be given a home **before** Phase 1 ships. None may be dropped silently. **Reconciled to the IA of 30 Sep**; rows marked *IA* are settled, and the rest are CCode proposals within it.

| Current feature | Where it is now | Proposed home |
|---|---|---|
| My Player (viewer selector) | More | Me (header "Not you? Change") |
| Data & Rankings (data range) | More | Me › Settings |
| Power Rating Guide | More | Me › Go deeper, and a link from Rankings' footnote |
| About Power Rankings | More | Me › About |
| North vs South | More | Rankings › More tables (*IA*) |
| Insights / Call-Outs | More (`callouts` tab) | Rankings › More tables, still gated by `canSee('callouts')` (*IA*) |
| Doughnuts | More | Rankings › More tables **and** Me (*IA*) |
| Admin / Manage | More | Me › Admin tools (unlocked only); the unlock form reached from Me › Settings (*IA*) |
| Win / Loss | Rankings sub-tab | Rankings › More tables (*IA*) |
| Podium | Top of Power | Stays near the top of Power, made compact (*IA*, DQ18) |
| Kings of Tiers | Power, below the podium | A secondary Rankings destination: a row under the podium and a More tables entry (*IA*, DQ18; DQ33) |
| Month-end Power history (the Power month select) | Power | Rankings › More tables › Past months (*IA*; DQ3 confirmed) |
| Monthly Summary, monthly stories, Monthly Performance | League › View | Rankings › More tables (*IA*) |
| Information view | League › View | A methodology disclosure on This Month, and the Rating Guide in Me (*IA*) |
| Last 10 | League (third table) | Rankings › More tables (*IA*). It is not month-scoped; label it so |
| Power sort options (Form, Avg opp., Clutch, Upsets) | Power sort bar | One quiet secondary control on Power (*IA*) |
| Min-games filter, Include idle / inactive | Power | The same secondary control (*IA*) |
| Compare / Head-to-Head | Players sub-tab | The profile's "You vs them" (*IA*, DQ21). The full H2H screen stays reachable from there |
| Games history, filters, Add result, approvals, Admin `··· Manage`, corrections | Play › Games | Play › **Played Games & Results** (full screen, unchanged behaviour) (*IA*, DQ22) |
| Challenges | Requests fold | A section of Play › My Games (*IA*, DQ22) |
| Find a Game | Play sub-tab | Play › **Arrange a Game** › Find a game (*IA*) |
| Request a game, Add multiple games | Requests tab | Play › **Arrange a Game** (*IA*) |
| Match ideas | Home (folded) | Play › Arrange a Game (DQ32) |
| Monthly Snapshot | Home | Absorbed into the Home hero (*IA*, DQ31) |
| Predict a Matchup | Admin | Admin tools (unchanged) |
| Admin-only Court bookings to record | Upcoming | Play › Club, admin-only section at the top |
| Build stamp | Foot of Admin / Manage | Unchanged |

---

## 6. Conflicts and questions

**Who decides:**
- **Shaun** decides product behaviour, permissions, competition rules and data.
- **CGPT** may lead on presentation choices within agreed intent.
- **CCode** handles implementation details. They are listed so no one is surprised.

In every case, the real rule is kept until someone decides otherwise.

**Needing Shaun**

- **DQ1. Promotion as a goal.** The design turns the next tier into a target:
  - a bar ("58 pts to Tier 1");
  - a journey line at "1,700";
  - a Me "58 to go".

  Tiers are board decisions, not rating thresholds. The only related figure is `computePromotionGap`, the distance to the lowest rating in the tier above, which the code itself flags as a proxy and not a rule. **Recommendation:**
  - keep today's one-line wording, reframed as "N pts below the lowest-rated Tier A player";
  - no bar and no threshold line, because either would imply automatic promotion.
- **DQ3. What Power shows by default.** *Confirmed by Shaun 30 Sep: current ratings; month-end history in More tables (Section 0.4).*
  - The design's Power is "today", so Tier Rank would agree with every other surface (D5 defines Tier Rank on today's ratings).
  - Today, Rankings opens on the Meaningful Month's month-end view.
  - **Recommendation:** Power shows current ratings, and month-end history moves to the Month segment and Past months. This reverses part of the 26 Sep default, so it is Shaun's call.
- **DQ4. Order of the monthly switch.** *Settled by the IA: League · Merit · Race.*
  - The design leads with Best Month ("the most human question").
  - The Monthly Race is an approved **trial**, and League is the established competition.
  - **Recommendation:** League · Merit · Race until the trial is confirmed. Then Race may lead.
- **DQ6. Can a participant record "Court booked"?** This is open since 27 Sep (Section 5, item 5). The design assumes yes.
  - **Recommendation:** yes for any of the four players:
    - attributed in history;
    - reversible by an Admin;
    - with the Admin-only review list kept for games nobody has marked.

  It is a permission change, which is why it is not assumed.
- **DQ7. "Find a replacement" by players.** Replacement is Admin-only today.
  - **Recommendation:** keep it Admin-only.
  - The player's Needs a 4th card says who backed out and that the Admin can replace them, with no action button.
- **DQ8. "Change plan" by players** (date, time or venue of an agreed game). Only `adminEdit` exists.
  - **Recommendation:** not in the first Play phase.
- **DQ9. Time and venue on a plain request** (NEXT #18). The design includes them as optional.
  - **Recommendation:** yes, optional. The fields already exist on the record (`preferredDate`, `preferredTime`, `location`).
- **DQ10. Venue and calendar features the record does not hold:** court number, "booked by", Directions, Add to calendar (.ics), Share (backlog, parked).
  - **Recommendation:** leave all out now. Show `location` only.
  - A court number needs a new field, which is a schema change.
  - Add to calendar is client-only and harmless, but it is a new feature.
- **DQ15. Reliability.** The design's "Reliability" is attendance.
  - **Recommendation:** never reuse the word for anything but rating evidence.
  - Attendance is not recorded. Tracking it would be new data.
- **DQ18. Podium and Kings of Tiers.** *Resolved 30 Sep: compact podium near the top of Power; Kings secondary.* The design has neither. CGPT/Shaun accepted them and said "do not redesign beyond consistency". Keep them (above the tier groups, or in More tables)?
- **DQ19. Home hero.** *Resolved in direction 30 Sep: a compact, interactive, live-data hero stays (content: DQ31).* `1a` (no hero) versus `2a`/`2b`/`2c`/`3a`/`3b`.
  - `3a`/`3b` need club photography: whose images, with what rights?
  - Today's `.home-hero` already uses an image, `assets/home/home-hero-padel.png`, so an image slot exists. The question is only whether to keep one.
  - **Recommendation:** build `1a` first. A hero is a later, separable increment.
- **DQ26. Find a Game labels.** "Evenly matched" / "A stretch" per card are qualitative favourite calls, which D4 hides from players. The existing Difficulty filter (Easy / Balanced / Hard) is already player-visible, but as a filter, not a verdict on a card.
  - **Recommendation:** filters yes, per-card verdicts no.

**For CGPT (presentation within agreed intent)**

- **DQ2. Movement indicator.** There is no 7-day movement. The real options are:
  - since the player's last game (the engine's delta);
  - this month so far (from the journey).

  **Recommendation:** Rankings and Me use "this month"; Home's Latest result uses the last game's delta. Each is labelled with its period.
- **DQ5. Me and "Needs you" rely on My Player,** which is self-declared. First-run behaviour: Me and Play › My games ask the reader to choose who they are. No sign-in is implied.
- **DQ11. Result from the fixture.**
  - **Recommendation:** "Add result" on a fixture opens the existing form pre-filled with its players and sides.
  - No time gate: the design's "opens after 8pm" does not exist, and adding one is a rule.
  - Approval is unchanged.
- **DQ20. Visual tokens:**
  - champagne `#D5B76E` versus current `#d4af37`;
  - Instrument Serif + Inter (self-hosted) versus Georgia + Helvetica;
  - the design's muted `#969188` versus the Ledger's raised `--text-dim`;
  - Booked sage colliding with Tier B sage and with positive movement.

  **Recommendation:**
  - adopt the design's gold and faces;
  - keep the Ledger's contrast levels;
  - give Booked a distinct hue.
- **DQ21. Compare / H2H.** *Settled by the IA: in the profile's "You vs them".* The profile's "You & X" covers one pair. Keep the full H2H screen reachable from Me and Players.
- **DQ22. Games history and Challenges placement.** *Settled by the IA: Played Games & Results; Challenges in My Games (Section 5).*
- **DQ24. Monthly positions outside the table** (Home "Your \<month\>", Me):
  - always name the tier, as in "3rd in Tier B";
  - show "provisional" for a Race below 5 matches;
  - for a split-month mover, show the spell they are in now.
- **DQ29. Play badge.** Proposed: the number of fixtures where the viewer must act, i.e. For me requests plus Needs attention games the viewer is in. Never shown at 0.
- **DQ30. "Around the club" items.** The design's items (doughnut news, a rank change, games booked this week) differ from Club Pulse's. Use only items with a derivable source. The IA makes this section **light**: two or three items at most.
- **DQ31. What the Home hero says.** New with the IA; see Section 0.3.
- **DQ32. Where Match Ideas goes.** New with the IA; see Section 0.3.
- **DQ33. Where Kings of Tiers is reached.** New with the IA; see Section 0.3.

**Recorded, no decision needed (the real rule is kept)**

- **DQ12.** The parser never auto-accepts a near miss, and duplicates are warned and included by default.
- **DQ13. Called Out order: no conflict.** The design says newest first, and so does the app (`calledOutOrder`, newest or newly restored first, per the `b12e837` decision). The 27 Sep Section 5 note saying "oldest first" describes the earlier `0766d7b` build and is superseded; the Ledger is corrected in place.
- **DQ14.** Merit is tier-step based, P / W / D / L stay, and the gap is tier steps, not rating averages.
- **DQ16.** "Why it moved" uses `RatingExplainer` sentences, not an itemised points breakdown.
- **DQ17.** No gendered copy ("him", "He leads"); use names.
- **DQ23.** Records show draws (W–D–L) where they exist.
- **DQ25.** The eligibility footnote comes from `PlayerState.thresholdText` (2 in 30 days).
- **DQ27.** Admin prediction wording is a share of games, never "probability".
- **DQ28.** "Edit result" in the Admin sheet links to Games' Historical Match Correction.

**Found while mapping (for CGPT to confirm)**

- **Kings / podium basis.** The Ledger has two statements: "Monthly Performance is the podium/Kings basis" (17 Sep, CGPT) and "Both rank on rating" (18 Sep, CCode copy correction).
- The code ranks both on **Power Rating**: month-end Power Rating in a month view (`computeRankingsPodiumTop3`, `computeKingsOfTiers`). Monthly Performance is not used.
- Redesigned copy follows the code unless CGPT says the 17 Sep direction was meant.

---

## 6a. Constraints from the current architecture

These facts shape how, not whether, the design can land. They come from reading `index.html`, `shell.js`, `app.js`, `app.css` and the tests on 28 Sep.

1. **Inline styles defeat a CSS-only restyle.** `app.js` and `shell.js` inject many `style=""` attributes (fonts, colours such as `#e8a5a1`, padding). They are heaviest in:
   - Head-to-Head;
   - the League and Race tables;
   - Games cards;
   - the journey rows and SVG chart (hard-coded hex);
   - `matchDeltaLineHtml`;
   - North vs South.

   Each of those screens needs its template touched, not just its CSS. This is the main reason Phase 0 alone cannot re-skin the app.
2. **Legacy CSS hard-codes `'Helvetica Neue', Arial`** in many rules rather than `var(--font-interface)`.
   - `body` is Georgia.
   - A font change (DQ20) needs those rules switched to the tokens first.
   - There are no web fonts and no `@font-face` today.
3. **The profile moves live DOM.**
   - `renderPremiumProfile` reparents `#devAreasSectionWrap` and each `#sheetMatches .match` into `#premiumProfileWrap`. They carry live write listeners, so they are moved, not rebuilt.
   - Calling it twice rebuilds the wrapper after the cards have moved.
   - Profile work (Phase 5) must keep this or replace it deliberately.
4. **Layering.**
   - The legacy profile `.overlay` sits at z-index 20, below the sticky header (40) and bottom nav (50).
   - Shell sheets are at 60, and the boot notice at 9000.
   - The design's sheets all sit above the tab bar, so the sheet primitive needs one z-scale.
   - The legacy overlay and `.boot-notice` also ignore the safe areas.
5. **Breakpoints.** There are only `max-width: 360px` and `380px` rules, and dark theme only. The design adds no breakpoints, which is consistent.
6. **All shell modals reuse `.shell-more-sheet` / `.shell-more-panel`:**
   - About;
   - Doughnuts;
   - North vs South;
   - Data range;
   - the Rating Guide;
   - the monthly breakdown;
   - the viewer selector.

   Retiring the More sheet must keep that class as the modal primitive, or migrate all seven at once.
7. **A missing asset.** `app.css` references `../rankings/rankings-hero-racket.webp`, which does not exist. It is harmless today, and Phase 4 can remove it.
8. **The fixtures document is last-writer-wins** (one JSON array). The design adds more player-side writes (inline respond on Home), which slightly raises the chance of two people overwriting each other. It is not a blocker. Per-fixture documents remain the fix if it ever bites.

---

## 7. Recommended phased migration order — reconciled to the IA (30 Sep)

**Each phase is its own brief.** A brief is approved on its own, lands on
`ux/player-reset-v2` and ships with:
- targeted tests, verified to fail against the old code;
- the full suite;
- a check at 375px and 390px, using the desktop phone preview at `/preview`
  on that branch's Vercel preview deployment;
- a Ledger update, made on `main`.

**No flags.** A phase replaces its screens outright. The old entry points
are kept until the new ones are accepted.

| Phase | Scope | Why this order | Blocked on |
|---|---|---|---|
| **0 — Foundations** | Tokens in `tokens.css`; fonts if chosen; the primitive CSS in `components.css`; a primitives reference page in `docs/design/`. **No visible change.** | Every later phase uses these. | DQ20 |
| **1 — Shell** | Five tabs (More → Me). Me as the home of the former More destinations and the viewer header. Section entry points: Rankings **Power \| This Month** with a More tables list; Play **My Games \| Club** with Arrange a Game; Players Directory. Play badge (count only). System Back. `#tabrow` stays the router. | Every other phase needs the entry points; high routing risk, so do it alone. | DQ5, DQ29 |
| **2 — Play** | `playView.js` view-model; My Games (lifecycle sections, Challenges); Club (counters); **Arrange a Game** (find / request / paste a list, Match Ideas); game detail; Admin Manage sheet; booking sheet; toast; Played Games & Results entry. | Fixes the audit's worst finding, and builds the view-model Home needs. | DQ6, DQ7, DQ8, DQ9, DQ11, DQ32 |
| **3a — Home hierarchy** | The IA order with a **plain, text-first hero**: This Month position → Needs You → Next Game → Last Time Out → light Around the Club; the demoted standing line; "Why it moved" sheet. | Depends on Phase 2's view-model. Gets the hierarchy right before the visuals. | DQ1, DQ2, DQ24, DQ30, DQ31 |
| **3b — Home hero visual** | The interactive visual treatment of the same hero data. | DQ19 allows staging. Separable and reversible. | CGPT/Shaun visual pick |
| **4 — Rankings** | Power (current, compact podium, Kings secondary, one secondary control); This Month (League · Merit · Race); More tables (W/L, Last 10, monthly stories and Monthly Performance, Past months, North vs South, Insights, Doughnuts); methodology disclosure. | The most test-pinned area; best once the primitives are proven. | DQ33 |
| **5 — Players, Profile, Me** | Directory search-first with secondary filters; profile identity → You vs them (Compare/H2H) → recent → disclosure; Me dashboard. | The profile is large and fragile; Me reuses Home's pieces. | DQ15 |
| **6 — Remaining** | Find a Game card restyle (inside Arrange a Game); Doughnuts; Played Games & Results; Insights; the H2H screen; Admin / Manage restyle. | Lowest player impact, or recently improved. | DQ26 |

### 7.1 Phase briefs, in short

Each brief is written out in full when it is approved.

- **Phase 0 — acceptance:**
  - the 39-state behaviour snapshot is **identical** (DOM and computed
    styles), because no screen changes;
  - the tokens and primitives are documented;
  - `tests/architecture.test.js` passes, and any new stylesheet is loaded
    in rank order.
- **Phase 1 — acceptance:**
  - every former More destination is reachable within two taps of Me or
    Rankings › More tables;
  - visibility settings govern every new entry point (D4);
  - Back closes a sheet and returns from a drill screen, and never exits
    the app from inside it;
  - no screen's content changes. Only its entry point does, so tests on
    screen content pass unchanged.
- **Phase 2 — acceptance:**
  - My Games shows Needs You, Upcoming, Called Out, Waiting on others and
    Archived as sections of one list;
  - Arrange a Game reaches all three modes;
  - no player sees a favourite call or a percentage (D4);
  - every lifecycle rule stays in `fixtureFlow.js`.
- **Phase 3a — acceptance:**
  - the first viewport answers "how am I doing this month?", "is anyone
    waiting on me?" and "when do I play next?", in that order;
  - Next Game is UPCOMING only;
  - the hero's position names its tier and period.
- **Phase 4 — acceptance:**
  - Power and This Month are the only two primary views;
  - every More tables item opens the same content as today;
  - League, Merit and Race keep every rule in 4.4 and 4.5.
- **Phase 5 — acceptance:**
  - search is first;
  - "You vs them" matches today's H2H counts, draws included;
  - Me is distinct from the public profile, and the profile's live-DOM
    move (6a.3) still works.
- **Phase 6 — acceptance:** these are restyles only. The behaviour
  snapshot changes only in the restyled screens.

**Test strategy, applying to every phase:**
- Keep existing ids and classes on the same logical element wherever a test uses them. Add new classes alongside rather than renaming.
- Where a screen is genuinely rebuilt, move its tests to the new hooks in the same commit. Show each changed test failing against the old code, as the Ledger requires.
- Tests that pin the *look* (the Directory, disclosures, Merit width) are updated deliberately, never deleted.
- Browser tests key on `#tabrow .tab-btn` (101 references), `#summaryContent` (64), `#gamesView` (43), `.lg-tier-head` (26) and `.fx-head` (23). These are the hooks to keep stable longest.
- **Test harness.** `tests/helpers/uiHarness.js` boots at a 430×932 viewport and itself depends on `#tabrow .tab-btn[data-tab]`, `DATA_READY`, `TAB_VIEW_ID`, `#bootNotice`, `.boot-placeholder` and `#viewerSelectorSheet`.
- **Globals the tests call directly must survive,** or be replaced with the tests in the same commit. They include:
  - `goToSection`, `openSheet` / `closeSheet`, `setCurrentViewer`;
  - `openMoreSheet` / `closeMoreSheet` (these retire in Phase 1, together with their assertions in `auditFixes` / `buildStamp` / `ui`);
  - `openInsightsFromTop`, `render`;
  - `renderSummary`, `renderGamesTab`, `renderHomeDashboard`, `renderPremiumProfile`, `renderManage`, `renderWishlist`, `renderUpcoming`, `renderH2H`, `renderPlayersTab`;
  - `computeKingsOfTiers`, `computeRankingsPodiumTop3`, `applyRankingEligibility`;
  - `getViewerSnapshot`, `tierRankOf`, `playerStateOf`;
  - `doughnutMatches`, `computeDoughnutStats`, `dataChanged`, `initials`.
- **Computed-style and layout tests will fail under restyling even when every hook is kept.** Update them deliberately, as a record of a changed look:
  - `directory.test.js`: chip heights, serif name / sans meta, a single "selected" look, and tier-tinted avatars;
  - the `ui.test.js` borderless disclosure checks for League, Merit and the Monthly Summary;
  - Games card clipping and Manage alignment;
  - no page overflow at 375px (several files);
  - the build stamp as the last child of `#manageView`, with no border or background.
- **Source-level tests pin code shapes that the redesign must not trip.** Each needs to be respected, not edited:
  - the `selectedMonth` allow-list of functions in `monthScope.test.js`;
  - the ban on form-dot truth ternaries;
  - `recomputeAll()` only inside `dataChanged` / `applyDataRangeChange` / `init`;
  - one `tierInScope`;
  - `playerJourney(name)` present;
  - no document deletes in the app.

---

## 8. What this map deliberately does not do

- It does not change any rule, calculation, permission, schema or copy in the app.
- It does not choose tokens or permission changes; those are DQs. Hero *direction* is settled by the IA (DQ19); its content and visual are DQ31 and Phase 3b.
- It does not port any `.dc.html` markup, script or mock data.
