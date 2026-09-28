# docs/design

Design material for the Player Experience Reset (Phase 2). **Nothing in this
folder is production code, and nothing here is approved for implementation**
until a phase is approved in [`PROJECT_LEDGER.md`](../../PROJECT_LEDGER.md).

| Path | What it is |
|---|---|
| [`claude-mobile-v1/`](./claude-mobile-v1/) | Claude Design canvas files: `Money_Padel_App.dc.html` (the player-app exploration, screens `1a`–`1s`, heroes `2a`–`3b`), `MPTabBar.dc.html` and `MPStatusBar.dc.html`. Reference only. They need the design tool's runtime and will not render as normal pages. Their numbers and rules are illustrative, not the club's. |
| [`CLAUDE_DESIGN_IMPLEMENTATION_MAP.md`](./CLAUDE_DESIGN_IMPLEMENTATION_MAP.md) | How that design maps onto the existing app: area by area, the functions each screen must consume, what to preserve, the mock-only assumptions to keep out, primitives, risk and a phased order. |

**Where decisions live:**
- **Open questions (DQ1–DQ30):** Ledger Section 5, *OPEN 28 Sep — Claude
  Design migration*.
- **The baton:** Ledger Sections 4 and 8 (item 15k).

**Authority** if anything here disagrees:
1. the Ledger;
2. the running app and its tests;
3. `RATING_MODEL.md`.
