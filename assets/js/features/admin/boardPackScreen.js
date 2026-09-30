// ===================== ADMIN: MONTHLY BOARD PACK (SCREEN) =====================
// Admin / Manage › Monthly Board Pack: choose a month, choose and order the
// modules, set how each is shown, add written commentary, preview, save. The
// figures come from boardPackData.js; the choice is domain/boardPack/
// boardPackConfig.js. Monthly Information stays the players' month story --
// this is the admin's own report and replaces nothing.
//
// The current Admin visual system, compact. Owning stream: functional.
// Loads before app.js; declarations only.

// Which month is open, the pack being edited for it, and what is stored for
// each month once read (null: nothing saved yet). Not persisted: like the
// rest of Admin / Manage it opens fresh.
let boardPackMonth = null;
let boardPackDraft = null;
let boardPackStored = {};
let boardPackLoading = null;
let boardPackPreviewOpen = false;
// Which preview: the Board Pack report ('pack') or the players' Share Deck
// ('deck').
let boardPackPreviewMode = 'pack';
// The published review of each month once read (null: never published).
let boardPackPublished = {};
let boardPackPublishConfirm = false;
let boardPackMessage = '';
let boardPackNoteSeq = 0;

// ---- Drawing the modules ---------------------------------------------------

function bpNames(names){ return names.map(n => escapeHtml(n)).join(' / '); }
function bpSigned(n){ return `${n > 0 ? '+' : ''}${n}`; }
function bpEmpty(text){ return `<div class="bp-empty">${escapeHtml(text)}</div>`; }
function bpSub(text){ return `<div class="bp-subhead">${escapeHtml(text)}</div>`; }

// Tie-grouped places: "1. A / B — value".
function bpGroupsHtml(groups, fmt, emptyText){
  if(!groups || !groups.length) return bpEmpty(emptyText || 'Not enough data.');
  return `<ol class="bp-list">${groups.map(g => `<li><span class="bp-rank">${g.rank}</span><span class="bp-name">${bpNames(g.names)}</span><span class="bp-val">${fmt(g)}</span></li>`).join('')}</ol>`;
}

// Plain lines: [{ rank?, name, value }].
function bpLinesHtml(lines, emptyText){
  if(!lines.length) return bpEmpty(emptyText || 'Nothing this month.');
  return `<ol class="bp-list">${lines.map((l, i) => `<li><span class="bp-rank">${l.rank === undefined ? i + 1 : l.rank}</span><span class="bp-name">${l.name}</span><span class="bp-val">${l.value}</span></li>`).join('')}</ol>`;
}

function bpTableHtml(headers, rows){
  return `<table class="bp-table"><thead><tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr></thead>
    <tbody>${rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
}

function bpTiersHtml(tiers, tableFor, emptyText){
  if(!tiers.length) return bpEmpty(emptyText || 'No games recorded.');
  return tiers.map(t => bpSub(`Tier ${t.tier}`) + tableFor(t.rows)).join('');
}

function bpRatingMoveLine(r){
  return { name: escapeHtml(r.playerId), value: `${Math.round(r.startRating)} → ${Math.round(r.endRating)} · ${bpSigned(r.ratingChange)} pts`
    + (r.reassessmentChange ? ` (${bpSigned(r.reassessmentChange)} by club decision)` : '') };
}

function bpRankMoveLine(r){
  return { name: escapeHtml(r.playerId) + (r.played ? '' : ' (no games)'),
    value: `#${r.startRankOverall} → #${r.endRankOverall} · ${r.rankChangeOverall > 0 ? '▲' : '▼'}${Math.abs(r.rankChangeOverall)}` };
}

// module id -> (data, month) -> html
function boardPackRenderers(){ return {
  overview: (d) => `<div class="bp-stats">
    <div class="bp-stat"><div class="bp-stat-num">${d.games}</div><div class="bp-stat-label">Games</div></div>
    <div class="bp-stat"><div class="bp-stat-num">${d.players}</div><div class="bp-stat-label">Players active</div></div>
    <div class="bp-stat"><div class="bp-stat-num">${d.draws}</div><div class="bp-stat-label">Draws</div></div>
  </div>`,

  results_table: (d) => (d.rows.length
    ? bpTableHtml(['#', 'Player', 'Tier', 'P', 'W', 'D', 'L', 'Pts', 'Diff'], d.rows.map((r, i) => [i + 1, escapeHtml(r.name), escapeHtml(r.tier),
      r.games, r.wins, r.draws, r.losses, `<b>${r.points}</b>`, Number(r.hardness).toFixed(1)]))
    : bpEmpty('No games recorded.'))
    + `<div class="bp-foot">Points: 3 for a win, 1 for a draw, 0 for a loss. Diff (difficulty) is the average strength of the games played ÷ 300 — the Monthly Information “hardest games” measure; higher is harder. Ordered by ${d.sort === 'games' ? 'games played' : d.sort === 'difficulty' ? 'difficulty' : 'points, then game difference'}.</div>`,

  over_80: (d) => {
    const line = (s, pct, what) => ({ rank: '•', name: escapeHtml(s.name), value: `${what} ${s[pct]}% · ${s.wins}W ${s.draws}D ${s.losses}L of ${s.games}` });
    return bpSub('Won more than 80%') + bpLinesHtml(d.won.map(s => line(s, 'winpct', 'won')), 'Nobody.')
      + bpSub('Lost more than 80%') + bpLinesHtml(d.lost.map(s => line(s, 'losspct', 'lost')), 'Nobody.')
      + `<div class="bp-foot">${d.min > 1 ? `Players with ${d.min}+ games that month. ` : 'Every player who played that month. '}Draws count as games played. Exactly 80% (for example 4 of 5) is not more than 80%.</div>`;
  },

  information: (d) => {
    if(!d.statsArr.length) return bpEmpty('No games recorded.');
    const s = (g) => d.stats[g.names[0]];
    return bpSub('Most games played') + bpGroupsHtml(d.mostGames, g => `${g.value} game${g.value===1?'':'s'}`)
      + bpSub('Most wins & highest points') + bpGroupsHtml(d.mostWins, g => `${s(g).wins} win${s(g).wins===1?'':'s'}${s(g).draws ? ` · ${s(g).draws} draw${s(g).draws===1?'':'s'}` : ''} — ${g.value} pts`)
      + bpSub('Most losses') + bpGroupsHtml(d.mostLosses, g => `${g.value} loss${g.value===1?'':'es'}`)
      + bpSub('Lowest win % (highest loss %)') + bpGroupsHtml(d.lowestWinPct, g => `${s(g).losspct}% loser`)
      + bpSub('Highest win %') + bpGroupsHtml(d.highestWinPct, g => `${g.value}% wins`)
      + bpSub('Most doughnuts received') + (d.mostDoughnuts.length ? bpLinesHtml([{ rank: 1, name: bpNames(d.mostDoughnuts), value: `x${d.doughnutMax}` }]) : bpEmpty('Nobody got doughnut’d this month.'))
      + bpSub('Hardest games played (avg opponent strength)') + bpGroupsHtml(d.hardestGames, g => `${g.value}`)
      + bpSub('Player of the Month') + (d.playerOfMonth ? bpLinesHtml([{ rank: '👑', name: bpNames(d.playerOfMonth.names), value: '' }]) : bpEmpty('Not enough data.'));
  },

  power: (d) => (d.rows.length
    ? bpTableHtml(['#', 'Player', 'Tier', 'Rating', 'Month'], d.rows.map((r, i) => [i + 1, escapeHtml(r.name), r.tier || '–', Math.round(r.rating),
      r.ratingChange === null ? '–' : `${bpSigned(r.ratingChange)} pts${r.rankChange ? ` · ${r.rankChange > 0 ? '▲' : '▼'}${Math.abs(r.rankChange)}` : ''}`]))
    : bpEmpty('Nobody qualified.'))
    + `<div class="bp-foot">Month-end Power Rating and the tier held at the month's close; ${d.minGames}+ games in the month (the Rankings month default).</div>`,

  kings: (d) => {
    if(!d.kings) return bpEmpty('No tier had a field of two or more.');
    return bpLinesHtml(TIER_ORDER_LIST.filter(t => d.kings[t] || d.kings._fieldSize[t]).map(t => d.kings[t]
      ? { rank: t, name: escapeHtml(d.kings[t].name), value: `${d.kings[t].rating}` }
      : { rank: t, name: 'No crown', value: `field of ${d.kings._fieldSize[t]}` }))
      + `<div class="bp-foot">${d.minGames}+ games in the month; a tier needs two qualifiers to crown a king.</div>`;
  },

  league: (d) => bpTiersHtml(d.tiers, rows => bpTableHtml(['#', 'Player', 'P', 'W', 'D', 'L', 'GD', 'Pts'],
    rows.map((r, i) => [i + 1, escapeHtml(r.name), r.games, r.wins, r.draws, r.losses, bpSigned(r.gd), `<b>${r.points}</b>`]))),

  merit: (d) => bpTiersHtml(d.tiers, rows => bpTableHtml(['#', 'Player', 'P', 'W', 'Hard', 'Fav', 'Pts'],
    rows.map((r, i) => [i + 1, escapeHtml(r.playerId), r.played, r.wins, r.hardWins, r.easyWins, `<b>${r.merit}</b>`])))
    + (d.unresolved ? `<div class="bp-foot">${d.unresolved} match${d.unresolved===1?'':'es'} could not be scored: a player's tier on that date is unknown.</div>` : ''),

  race: (d) => bpTiersHtml(d.tiers, rows => bpTableHtml(['#', 'Player', 'P', 'W', 'D', 'L', 'Score'],
    rows.map((r, i) => [r.qualified ? i + 1 : '–', escapeHtml(r.playerId) + (r.qualified ? '' : ' <span class="bp-dim">(provisional)</span>'), r.played, r.wins, r.draws, r.losses, `<b>${bpSigned(r.score)}</b>`])), 'No qualifier this month.')
    + `<div class="bp-foot">Qualifying: ${d.minMatches}+ matches in the tier.</div>`
    + (d.unresolved ? `<div class="bp-foot">${d.unresolved} match${d.unresolved===1?'':'es'} could not be scored.</div>` : ''),

  most_wins: (d) => bpGroupsHtml(d.groups, g => { const s = d.stats[g.names[0]];
    return `${s.wins} win${s.wins===1?'':'s'}${s.draws ? ` · ${s.draws} draw${s.draws===1?'':'s'}` : ''} — ${g.value} pts`; }),

  best_record: (d) => bpGroupsHtml(d.groups, g => { const s = d.stats[g.names[0]];
    return `${g.value}% · ${s.wins}-${s.losses}${s.draws ? `-${s.draws}` : ''}`; }, `Nobody played ${d.minGames}+ games.`),

  most_games: (d) => bpGroupsHtml(d.groups, g => `${g.value} game${g.value===1?'':'s'}`),

  rating_movers: (d) => (d.risers.length || d.fallers.length ? '' : bpEmpty('No rating movement recorded.'))
    + (d.risers.length ? bpSub('Risers') + bpLinesHtml(d.risers.map(bpRatingMoveLine)) : '')
    + (d.fallers.length ? bpSub('Fallers') + bpLinesHtml(d.fallers.map(bpRatingMoveLine)) : ''),

  rank_movers: (d) => (d.climbers.length || d.sliders.length ? '' : bpEmpty('No rank movement recorded.'))
    + (d.climbers.length ? bpSub('Climbers') + bpLinesHtml(d.climbers.map(bpRankMoveLine)) : '')
    + (d.sliders.length ? bpSub('Sliders') + bpLinesHtml(d.sliders.map(bpRankMoveLine)) : ''),

  performance: (d) => bpLinesHtml(d.rows.map(r => ({ name: escapeHtml(r.playerId),
    value: `${bpSigned(r.performancePct)}% vs expectation · ${r.matches} games` })), 'Nobody played enough games.'),

  form: (d) => (d.rows.length
    ? bpTableHtml(['#', 'Player', 'Games', 'W-D-L', 'Pts'], d.rows.map((r, i) => [i + 1, escapeHtml(r.name), r.games + (r.short ? ` <span class="bp-dim">of ${d.window}</span>` : ''), `${r.wins}-${r.draws}-${r.losses}`, `<b>${r.points}</b>`]))
    : bpEmpty('No games this month.'))
    + `<div class="bp-foot">Each player's last ${d.window} rated games as they stood at the month's close.</div>`,

  hard_wins: (d) => (d.hard.length || d.favoured.length ? '' : bpEmpty('No wins recorded.'))
    + (d.hard.length ? bpSub('Hard wins (beat a stronger pairing)') + bpGroupsHtml(d.hard, g => `${g.value} win${g.value===1?'':'s'}`) : '')
    + (d.favoured.length ? bpSub('Favoured wins (beat a weaker pairing)') + bpGroupsHtml(d.favoured, g => `${g.value} win${g.value===1?'':'s'}`) : ''),

  doughnuts: (d) => (d.received.length || d.given.length ? '' : bpEmpty('No doughnuts this month.'))
    + (d.received.length ? bpSub('Received') + bpGroupsHtml(d.received, g => `x${g.value}`) : '')
    + (d.given.length ? bpSub('Given') + bpGroupsHtml(d.given, g => `x${g.value}`) : ''),

  partnerships: (d) => bpLinesHtml(d.rows.map(p => ({ name: `${escapeHtml(p.pair[0])} &amp; ${escapeHtml(p.pair[1])}`,
    value: `${p.wins}-${p.losses} (${p.winpct}%) · ${bpSigned(p.avg_overperf)}% chemistry` })), 'No pair played twice together.'),

  tier_moves: (d) => bpLinesHtml(d.rows.map(c => ({ rank: '•', name: escapeHtml(c.name),
    value: `${c.fromTier} → ${c.toTier} · ${escapeHtml(dayLabel(c.date))}` })), 'No tier changes this month.'),

  crossovers: (d) => bpLinesHtml(d.rows.map(c => ({ rank: '•', name: `${escapeHtml(c.overtook)} passed ${escapeHtml(c.overtaken)}`, value: '' })), 'Nobody changed places.'),
}; }

function boardPackNoteHtml(note){
  const body = escapeHtml(note.body).replace(/\n/g, '<br>');
  return `<section class="bp-module bp-note" data-note="${escapeHtml(note.id)}">
    <div class="bp-note-tag">Admin commentary</div>
    ${note.title ? `<div class="bp-module-title">${escapeHtml(note.title)}</div>` : ''}
    <div class="bp-note-body">${body || '<span class="bp-dim">(empty)</span>'}</div>
  </section>`;
}

// The whole pack for a config: its selected modules and notes, in order.
function boardPackHtml(config){
  const month = config.month;
  const renderers = boardPackRenderers();
  const parts = BoardPack.selected(config).map(it => {
    if(it.kind === 'note') return boardPackNoteHtml(it);
    const html = renderers[it.id](boardPackModuleData(it, month), month);
    return `<section class="bp-module" data-module="${it.id}"><div class="bp-module-title">${escapeHtml(BoardPack.BY_ID[it.id].title)}</div>${html}</section>`;
  });
  return `<div class="bp-pack">
    <div class="bp-pack-head">Money Padel · ${escapeHtml(monthLabel(month))} Board Pack</div>
    ${parts.length ? parts.join('') : bpEmpty('Nothing selected yet.')}
  </div>`;
}

// ---- The Admin section -----------------------------------------------------

// The stored config for the open month, or the month's default.
function boardPackBaseline(month){
  return boardPackStored[month] || BoardPack.defaultConfig(month);
}

function boardPackOpenMonth(month){
  boardPackMonth = month;
  boardPackDraft = null;
  boardPackMessage = '';
  boardPackPublishConfirm = false;
  if(boardPackStored[month] !== undefined) boardPackDraft = boardPackBaseline(month);
}

// Read the month's pack once, then draw again.
async function boardPackEnsureLoaded(){
  const month = boardPackMonth;
  if(!month || boardPackStored[month] !== undefined || boardPackLoading === month) return;
  boardPackLoading = month;
  const [raw, published] = await Promise.all([loadBoardPack(month), loadPublishedReview(month)]);
  boardPackPublished[month] = published && published.deck ? published : null;
  boardPackStored[month] = raw ? BoardPack.normalise(raw, month) : null;
  boardPackLoading = null;
  if(boardPackMonth === month){
    boardPackDraft = boardPackBaseline(month);
    if(adminOpenSections.boardpack) renderManage();
  }
}

function boardPackStatusText(){
  const stored = boardPackStored[boardPackMonth];
  const saved = stored
    ? `Saved ${stored.updatedAt ? new Date(stored.updatedAt).toLocaleString('en-GB', { day:'numeric', month:'short', hour:'2-digit', minute:'2-digit' }) : ''}${stored.updatedBy ? ` by ${stored.updatedBy}` : ''}.`
    : `Not saved yet for ${monthLabel(boardPackMonth)} — showing the default selection.`;
  const dirty = boardPackDraft && !BoardPack.sameChoice(boardPackDraft, boardPackBaseline(boardPackMonth));
  return saved + (dirty ? ' Unsaved changes.' : '');
}

function boardPackWhen(iso){
  return iso ? new Date(iso).toLocaleString('en-GB', { day:'numeric', month:'short', hour:'2-digit', minute:'2-digit' }) : '';
}

// Draft -> Preview -> Publish. What the review link shows changes only here,
// on an explicit Publish; editing the pack never touches it.
function boardPackPublishHtml(liveDeck){
  const month = boardPackMonth;
  const pub = boardPackPublished[month];
  const label = monthLabel(month);
  let state;
  if(!pub){
    state = `<b>Draft.</b> The ${escapeHtml(label)} review is not published: its link shows nothing until you publish.`;
  } else {
    const same = ShareDeck.sameDeck(pub.deck, liveDeck);
    state = `<b>Published</b> · revision ${pub.revision} · ${escapeHtml(boardPackWhen(pub.publishedAt))}${pub.publishedBy ? ` by ${escapeHtml(pub.publishedBy)}` : ''}. `
      + (same ? 'The review link shows exactly this pack.'
              : '<span class="bp-publish-differs">This pack now differs from what players see. The link keeps showing the published review until you republish.</span>');
  }
  let html = `<div class="bp-publish" id="bpPublishBlock">
    <div class="section-heading" style="margin-top:14px;">Players' Monthly Review</div>
    <div class="section-sub" id="bpPublishState">${state}</div>`;
  if(boardPackPublishConfirm){
    html += `<div class="bp-confirm" role="group" aria-label="Confirm publishing">
      <div class="section-sub">${pub ? 'Republish' : 'Publish'} the ${escapeHtml(label)} review? Anyone with the link can open it, without unlocking. What it shows is fixed until you publish again.</div>
      <div class="fg-row bp-actions">
        <button type="button" class="preset-btn active" id="bpPublishConfirm">${pub ? 'Republish now' : 'Publish now'}</button>
        <button type="button" class="preset-btn" id="bpPublishCancel">Cancel</button>
      </div>
    </div>`;
  } else {
    html += `<div class="fg-row bp-actions"><button type="button" class="preset-btn" id="bpPublish">${pub ? 'Republish review' : 'Publish review'}</button></div>`;
  }
  if(pub){
    const url = boardPackReviewUrl(month);
    html += `<div class="bp-share-row">
      <a class="preset-btn" id="bpOpenReview" href="${escapeHtml(url)}" target="_blank" rel="noopener">Open review</a>
      ${typeof navigator !== 'undefined' && navigator.share ? `<button type="button" class="preset-btn" id="bpShare">Share</button>` : ''}
      <button type="button" class="preset-btn" id="bpCopyLink">Copy link</button>
      <button type="button" class="preset-btn" id="bpCopySummary">Copy summary</button>
    </div>
    <div class="section-sub bp-review-url">${escapeHtml(url)}</div>`;
  }
  return html + `</div>`;
}

// The players' view of the draft: exactly what Publish would store.
function boardPackDeckPreviewHtml(liveDeck){
  const shown = ShareDeck.visibleSlides(liveDeck, boardPackPlayerCanSee);
  const hidden = liveDeck.slides.filter(sl => !shown.includes(sl));
  const pub = boardPackPublished[boardPackMonth];
  const when = !pub ? 'will see when you publish' : ShareDeck.sameDeck(pub.deck, liveDeck) ? 'see on the review link' : 'will see once you republish';
  return `<div class="section-sub bp-deck-note">What players ${when}: one card per selected module, in the pack's order. Empty modules are left out.${hidden.length ? ` Left out because the section is Admin only: ${hidden.map(sl => escapeHtml(sl.title)).join(', ')}.` : ''}</div>
    <div class="bp-deck-frame" id="bpDeckFrame">${DeckView.html(liveDeck, shown, { brandSrc: 'assets/brand/mp-mark.svg', appLink: '' })}</div>`;
}

function boardPackOptionsHtml(it, index){
  const def = BoardPack.BY_ID[it.id];
  const keys = Object.keys(def.options);
  if(!keys.length) return '';
  return `<div class="bp-opts">${keys.map(k => {
    const o = def.options[k];
    return `<label class="bp-opt"><span>${escapeHtml(o.label)}</span><select class="fg-select" data-bp-opt="${index}" data-key="${k}">
      ${o.values.map(v => `<option value="${v}" ${it.options[k] === v ? 'selected' : ''}>${escapeHtml((o.labels && o.labels[v]) || v)}</option>`).join('')}
    </select></label>`;
  }).join('')}</div>`;
}

function boardPackItemHtml(it, index, count){
  const moves = `<span class="bp-move">
    <button type="button" class="preset-btn bp-move-btn" data-bp-move="${index}" data-delta="-1" aria-label="Move up" ${index === 0 ? 'disabled' : ''}>↑</button>
    <button type="button" class="preset-btn bp-move-btn" data-bp-move="${index}" data-delta="1" aria-label="Move down" ${index === count - 1 ? 'disabled' : ''}>↓</button>
  </span>`;
  if(it.kind === 'note'){
    return `<div class="bp-item bp-item-note" data-bp-item="${index}">
      <div class="bp-item-row"><span class="bp-note-tag">Admin commentary</span>${moves}</div>
      <input class="fg-select" data-bp-note-title="${index}" maxlength="${BoardPack.NOTE_TITLE_MAX}" placeholder="Title" value="${escapeHtml(it.title)}" />
      <textarea class="fg-select bp-note-input" data-bp-note-body="${index}" maxlength="${BoardPack.NOTE_BODY_MAX}" rows="3" placeholder="Your commentary">${escapeHtml(it.body)}</textarea>
      <button type="button" class="preset-btn bp-remove" data-bp-remove="${index}">Remove commentary</button>
    </div>`;
  }
  const def = BoardPack.BY_ID[it.id];
  if(!def){
    return `<div class="bp-item is-unknown" data-bp-item="${index}"><div class="bp-item-row"><span class="bp-dim">${escapeHtml(it.id)} — not available in this version</span>${moves}</div></div>`;
  }
  return `<div class="bp-item${it.enabled ? ' is-on' : ''}" data-bp-item="${index}" data-bp-module="${it.id}">
    <div class="bp-item-row">
      <label class="bp-check"><input type="checkbox" data-bp-toggle="${index}" ${it.enabled ? 'checked' : ''} /> <span>${escapeHtml(def.title)}</span></label>
      ${moves}
    </div>
    ${it.enabled ? boardPackOptionsHtml(it, index) : ''}
  </div>`;
}

function buildBoardPackSectionHtml(){
  if(!boardPackMonth) boardPackOpenMonth(boardPackDefaultMonth());
  const months = boardPackMonths();
  let html = `<div class="section-sub">A month-end report for the board, compiled from the club's own statistics. The figures are drawn from the record every time; only your selection, order and commentary are saved. Publishing turns the same pack into the players' Monthly Review — a swipeable link for WhatsApp, fixed as published. Monthly Information stays the players' month review in the app.</div>`;
  if(!boardPackMonth){
    return html + `<div class="section-sub">No months with games yet.</div>`;
  }
  html += `<div class="fg-controls">
    <div class="fg-row"><label class="fg-label" for="bpMonth">Month</label>
      <select id="bpMonth" class="fg-select">${months.map(m => `<option value="${m}" ${m === boardPackMonth ? 'selected' : ''}>${monthLabel(m)}</option>`).join('')}</select>
    </div>`;
  if(!boardPackDraft){
    return html + `<div class="section-sub" id="bpLoading">Loading ${escapeHtml(monthLabel(boardPackMonth))}…</div></div>`;
  }
  const stored = boardPackStored[boardPackMonth];
  html += `<div class="section-sub" id="bpStatus">${escapeHtml(boardPackStatusText())}</div>`;
  if(stored && stored.basis){
    const now = boardPackBasis(boardPackMonth);
    if(now.fingerprint !== stored.basis.fingerprint){
      html += `<div class="bp-warn" id="bpDrift">The record for ${escapeHtml(monthLabel(boardPackMonth))} has changed since this pack was saved (${stored.basis.games} game${stored.basis.games===1?'':'s'} then, ${now.games} now, or a later correction or club decision). The figures shown are today's.</div>`;
    }
  }
  const items = boardPackDraft.items;
  html += `<div class="bp-items">${items.map((it, i) => boardPackItemHtml(it, i, items.length)).join('')}</div>
    <div class="fg-row"><button type="button" class="preset-btn" id="bpAddNote">+ Add commentary</button></div>
    <div class="fg-row bp-actions">
      <button type="button" class="preset-btn" id="bpSave">Save pack</button>
      <button type="button" class="preset-btn${boardPackPreviewOpen ? ' active' : ''}" id="bpPreviewBtn" aria-expanded="${boardPackPreviewOpen}">${boardPackPreviewOpen ? 'Hide preview' : 'Preview'}</button>
    </div>
    <div id="bpMessage" class="section-sub">${escapeHtml(boardPackMessage)}</div>`;
  // Built once per drawing: the publish state compares it with what is
  // published, and the Share Deck preview draws it.
  const liveDeck = (boardPackPublished[boardPackMonth] || (boardPackPreviewOpen && boardPackPreviewMode === 'deck')) ? boardPackDeck(boardPackDraft) : null;
  html += boardPackPublishHtml(liveDeck) + `</div>`;
  if(boardPackPreviewOpen){
    html += `<div class="fg-toggle bp-preview-mode" role="group" aria-label="Preview" style="margin:12px 0 4px;">
      <button type="button" class="fg-toggle-btn ${boardPackPreviewMode === 'pack' ? 'active' : ''}" id="bpModePack" aria-pressed="${boardPackPreviewMode === 'pack'}">Board Pack</button>
      <button type="button" class="fg-toggle-btn ${boardPackPreviewMode === 'deck' ? 'active' : ''}" id="bpModeDeck" aria-pressed="${boardPackPreviewMode === 'deck'}">Share Deck</button>
    </div>`;
    html += `<div id="bpPreview" data-mode="${boardPackPreviewMode}">${boardPackPreviewMode === 'deck' ? boardPackDeckPreviewHtml(liveDeck) : boardPackHtml(boardPackDraft)}</div>`;
  }
  return html;
}

function wireBoardPackSection(){
  const box = document.getElementById('manageView');
  if(!box || !adminOpenSections.boardpack) return;
  if(!boardPackDraft){ boardPackEnsureLoaded(); }
  const monthSel = document.getElementById('bpMonth');
  if(monthSel) monthSel.onchange = () => { boardPackOpenMonth(monthSel.value); renderManage(); };
  if(!boardPackDraft) return;

  const change = (next) => { boardPackDraft = next; boardPackMessage = ''; renderManage(); };
  const index = (el, attr) => Number(el.getAttribute(attr));
  box.querySelectorAll('[data-bp-toggle]').forEach(el => {
    el.onchange = () => change(BoardPack.setEnabled(boardPackDraft, index(el, 'data-bp-toggle'), el.checked));
  });
  box.querySelectorAll('[data-bp-move]').forEach(el => {
    el.onclick = () => change(BoardPack.move(boardPackDraft, index(el, 'data-bp-move'), Number(el.dataset.delta)));
  });
  box.querySelectorAll('[data-bp-opt]').forEach(el => {
    el.onchange = () => change(BoardPack.setOption(boardPackDraft, index(el, 'data-bp-opt'), el.dataset.key, el.value));
  });
  box.querySelectorAll('[data-bp-remove]').forEach(el => {
    el.onclick = () => change(BoardPack.removeNote(boardPackDraft, index(el, 'data-bp-remove')));
  });
  // Typing edits the pack without redrawing it, so the field keeps its focus;
  // the preview catches up when the field is left.
  const status = () => { const s = document.getElementById('bpStatus'); if(s) s.textContent = boardPackStatusText(); };
  box.querySelectorAll('[data-bp-note-title]').forEach(el => {
    el.oninput = () => { boardPackDraft = BoardPack.updateNote(boardPackDraft, index(el, 'data-bp-note-title'), { title: el.value }); status(); };
    el.onchange = () => { if(boardPackPreviewOpen) renderManage(); };
  });
  box.querySelectorAll('[data-bp-note-body]').forEach(el => {
    el.oninput = () => { boardPackDraft = BoardPack.updateNote(boardPackDraft, index(el, 'data-bp-note-body'), { body: el.value }); status(); };
    el.onchange = () => { if(boardPackPreviewOpen) renderManage(); };
  });
  const add = document.getElementById('bpAddNote');
  if(add) add.onclick = () => change(BoardPack.addNote(boardPackDraft, { id: `note-${Date.now().toString(36)}-${++boardPackNoteSeq}`, title: '', body: '' }));
  const preview = document.getElementById('bpPreviewBtn');
  if(preview) preview.onclick = () => { boardPackPreviewOpen = !boardPackPreviewOpen; renderManage(); };
  const modePack = document.getElementById('bpModePack');
  if(modePack) modePack.onclick = () => { boardPackPreviewMode = 'pack'; renderManage(); };
  const modeDeck = document.getElementById('bpModeDeck');
  if(modeDeck) modeDeck.onclick = () => { boardPackPreviewMode = 'deck'; renderManage(); };
  const frame = document.getElementById('bpDeckFrame');
  if(frame) DeckView.mount(frame);

  const month = boardPackMonth;
  const say = (text) => { boardPackMessage = text; const m = document.getElementById('bpMessage'); if(m) m.textContent = text; };
  const publish = document.getElementById('bpPublish');
  if(publish) publish.onclick = () => { boardPackPublishConfirm = true; renderManage(); };
  const cancel = document.getElementById('bpPublishCancel');
  if(cancel) cancel.onclick = () => { boardPackPublishConfirm = false; renderManage(); };
  const confirm = document.getElementById('bpPublishConfirm');
  if(confirm) confirm.onclick = async () => {
    confirm.disabled = true;
    const res = await publishBoardPackReview(boardPackDraft);
    boardPackPublishConfirm = false;
    if(res.config){
      boardPackStored[month] = BoardPack.normalise(res.config, month);
      if(boardPackMonth === month) boardPackDraft = boardPackStored[month];
    }
    if(res.ok) boardPackPublished[month] = res.publication;
    boardPackMessage = res.ok ? `Published — revision ${res.publication.revision}.` : res.message;
    renderManage();
  };
  const pub = boardPackPublished[month];
  const share = document.getElementById('bpShare');
  if(share && pub) share.onclick = () => {
    navigator.share({ title: `Money Padel — ${pub.deck.title}`, text: boardPackReviewSummary(pub) }).catch(() => {});
  };
  const copyLink = document.getElementById('bpCopyLink');
  if(copyLink && pub) copyLink.onclick = () => copyText(boardPackReviewUrl(month)).then(ok => say(ok ? 'Link copied.' : 'Could not copy — the link is shown below.'));
  const copySummary = document.getElementById('bpCopySummary');
  if(copySummary && pub) copySummary.onclick = () => copyText(boardPackReviewSummary(pub)).then(ok => say(ok ? 'Summary copied — paste it into WhatsApp.' : 'Could not copy the summary.'));
  const save = document.getElementById('bpSave');
  if(save) save.onclick = async () => {
    const month = boardPackMonth;
    const res = await saveBoardPackConfig(boardPackDraft);
    if(res.ok){
      boardPackStored[month] = BoardPack.normalise(res.config, month);
      if(boardPackMonth === month) boardPackDraft = boardPackStored[month];
      boardPackMessage = 'Saved.';
    } else {
      boardPackMessage = res.message;
    }
    renderManage();
  };
}
