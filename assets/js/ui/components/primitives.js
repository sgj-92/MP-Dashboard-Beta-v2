// ===================== UI: REDESIGN PRIMITIVES (HTML) =====================
// Player Experience Reset, Phase 0 (docs/design/CLAUDE_DESIGN_IMPLEMENTATION_MAP.md §3.4).
// Small HTML-returning helpers for the primitives in components.css, for the
// primitives that take content. Nothing calls them yet: each later phase
// adopts them as it rebuilds a screen.
//
// Presentation only. They format what they are given and decide nothing: no
// stage, count, rank or rating is worked out here -- the caller passes the
// canonical value (docs/architecture/PARALLEL_DEVELOPMENT_SPLIT.md §3).
// Every piece of text goes through escapeHtml (app.js), which exists by the
// time any of these is called.
//
// Owning stream: redesign. Loads before app.js; declarations only.

const MP_PILL_VARIANTS = ['neutral', 'booked', 'nocourt', 'attention', 'admin'];
const MP_DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MP_MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// data-* attributes from a plain object. Names are checked, values escaped:
// a helper must never become a way to inject an attribute.
function mpDataAttrs(data) {
  return Object.entries(data || {}).map(([k, v]) => {
    if (!/^[a-z][a-z0-9-]*$/.test(k)) throw new Error('mpDataAttrs: bad attribute name ' + k);
    return ` data-${k}="${escapeHtml(v)}"`;
  }).join('');
}

// A count that is never shown at 0 (DQ29): no number, no badge.
function mpCountBadgeHtml(n, label) {
  const count = Math.floor(Number(n));
  if (!(count > 0)) return '';
  const shown = count > 99 ? '99+' : String(count);
  const aria = label ? ` aria-label="${escapeHtml(count + ' ' + label)}"` : '';
  return `<span class="mp-count-badge"${aria}>${shown}</span>`;
}

// A state tag. The word is the state; the variant only repeats it in colour.
function mpPillHtml(text, variant) {
  const v = MP_PILL_VARIANTS.includes(variant) ? variant : 'neutral';
  const cls = v === 'neutral' ? 'mp-pill' : `mp-pill mp-pill-${v}`;
  return `<span class="${cls}">${escapeHtml(text)}</span>`;
}

// A calendar date ('YYYY-MM-DD', as fixtures store it) as a date block.
// Booked is solid, proposed is dashed -- and the block says which in words.
// The date is read as a calendar day, never through a time zone, so it
// cannot slip a day either side of midnight.
function mpDateBlockHtml(isoDate, opts) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(isoDate || ''));
  if (!m) return '';
  const y = +m[1], mo = +m[2], d = +m[3];
  const dt = new Date(Date.UTC(y, mo - 1, d));
  if (dt.getUTCMonth() !== mo - 1 || dt.getUTCDate() !== d) return '';
  const proposed = !!(opts && opts.proposed);
  const cls = proposed ? 'mp-date-block mp-date-block-proposed' : 'mp-date-block';
  const state = proposed ? 'Proposed' : 'Booked';
  return `<span class="${cls}">`
    + `<span class="mp-date-dow">${MP_DOW[dt.getUTCDay()]}</span>`
    + `<span class="mp-date-day">${d}</span>`
    + `<span class="mp-date-mon">${MP_MON[mo - 1]}</span>`
    + `<span class="mp-date-state">${state}</span>`
    + `</span>`;
}

// A segmented control: items [{id, label}], the selected id, and an
// accessible name for the group. Keyboard and click wiring is the caller's.
function mpSegmentedHtml(items, selectedId, groupLabel) {
  const buttons = (items || []).map((it) => {
    const on = it.id === selectedId;
    return `<button type="button" role="tab" class="mp-seg-item" data-seg="${escapeHtml(it.id)}"`
      + ` aria-selected="${on}" tabindex="${on ? 0 : -1}">${escapeHtml(it.label)}</button>`;
  }).join('');
  return `<div class="mp-seg" role="tablist" aria-label="${escapeHtml(groupLabel || '')}">${buttons}</div>`;
}

// A navigation row with a chevron: {label, meta?, data?}.
function mpListRowHtml(row) {
  const meta = row.meta != null && row.meta !== '' ? `<span class="mp-list-row-meta">${escapeHtml(row.meta)}</span>` : '';
  return `<button type="button" class="mp-list-row"${mpDataAttrs(row.data)}>`
    + `<span class="mp-list-row-label">${escapeHtml(row.label)}</span>${meta}`
    + `<span class="mp-list-row-chevron" aria-hidden="true"></span></button>`;
}

// A section heading: {title, count?, countLabel?, meta?}. The count uses the
// badge, so it too is absent at 0.
function mpSectionHeadHtml(head) {
  const meta = head.meta != null && head.meta !== '' ? `<span class="mp-section-head-meta">${escapeHtml(head.meta)}</span>` : '';
  return `<div class="mp-section-head"><h3 class="mp-section-head-title">${escapeHtml(head.title)}</h3>`
    + `${mpCountBadgeHtml(head.count, head.countLabel)}${meta}</div>`;
}

// A stepper: step labels and the index reached. Which step a fixture is at
// is the caller's to say -- the stage mapping belongs to Phase 2 and reads
// FixtureFlow, never this file.
function mpStepperHtml(steps, currentIndex) {
  const cur = Number.isInteger(currentIndex) ? currentIndex : -1;
  const lis = (steps || []).map((s, i) => {
    const cls = i < cur ? 'mp-step is-done' : i === cur ? 'mp-step is-current' : 'mp-step';
    const aria = i === cur ? ' aria-current="step"' : '';
    return `<li class="${cls}"${aria}>${escapeHtml(s)}</li>`;
  }).join('');
  return `<ol class="mp-stepper">${lis}</ol>`;
}
