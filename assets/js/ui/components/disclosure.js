// ===================== UI: DISCLOSURES =====================
// The quiet heading-with-chevron folds every screen uses (foldHeading, the
// League's inline fold) and the rule for whether a tier section arrives open.
// No border, radius or fill: the bordered dropdown was rejected (Ledger).
//
// Extracted from app.js unchanged (docs/architecture/PARALLEL_DEVELOPMENT_SPLIT.md).
// Owning stream: redesign. Loads before app.js; declarations only.

// A tier section with a single player in it is not a table, it is a sentence.
// Shaun, 22 Sep: Tier S should arrive collapsed, "as there's only one player
// there". Expressed as the reason rather than as the letter S, so it stays
// true in both directions -- if Manny is joined by somebody the section opens
// on its own, and if any other tier ever thins to one player it folds without
// anybody having to remember this conversation.
//
// A section the reader has actually touched keeps whatever they set: an
// explicit true or false in the map always wins over the default.
function tierSectionOpenByDefault(rowCount){ return rowCount > 1; }

function tierSectionOpen(state, tier, rowCount){
  return state[tier] === undefined ? tierSectionOpenByDefault(rowCount) : state[tier];
}

// A quiet inline disclosure: text and a small chevron, no card, no border, no
// background. It is a line of text you can tap, not a control competing with
// the table underneath it.
function leagueInlineFold(id, label, open, body){
  return `<button type="button" class="lg-inline-fold" id="${id}" aria-expanded="${open}" aria-controls="${id}Body">
      ${label}<span class="lg-inline-chev" aria-hidden="true">${open ? '⌄' : '›'}</span>
    </button>` + (open ? `<div class="lg-inline-body" id="${id}Body">${body}</div>` : '');
}

// A heading that happens to be tappable. Deliberately still a
// `.section-heading` -- same type, same weight, same spacing as every other
// heading on the screen; the chevron is the only thing added.
//
// `summary` is what the section says about itself while it is shut. A fold
// that hides its own state is worse than no fold: the Games filters could be
// set to one player in August and the screen would simply show fewer games
// with nothing to say why. Closed and silent is only safe when the heading
// already names everything inside it.
function foldHeading(id, label, open, opts){
  const o = opts || {};
  const tail = (!open && o.summary) ? ` <span class="fold-summary">${o.summary}</span>` : '';
  const data = o.data ? Object.entries(o.data).map(([k,v])=>` data-${k}="${escapeHtml(v)}"`).join('') : '';
  return `<button type="button" class="section-heading lg-tier-head" id="${id}"${data}
      aria-expanded="${open}" aria-controls="${o.bodyId || (id + 'Body')}">
      ${label}${tail}<span class="lg-inline-chev" aria-hidden="true">${open ? '⌄' : '›'}</span>
    </button>`;
}
