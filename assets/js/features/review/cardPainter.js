// ===================== MONTHLY REVIEW: PICTURES =====================
// Draws a Share Deck slide, or a Board Pack module, as a PNG ready to post in
// WhatsApp -- painted directly onto a canvas from the same data the screen
// draws, rather than photographing the page. That keeps it dependable on
// iPhone and Android alike (no library, nothing that taints a canvas) and the
// output exactly sized:
//
//   slide(...)  1080 x 1350, the deck card's own 4:5 proportions. Sizes are
//               the deck's container units (1 unit = 1% of the card width),
//               so the picture matches the card on screen.
//   sheet(...)  1080 wide, as tall as the module: a Board Pack table, list,
//               the Kings tiles or a note, from its blocks.
//
// Knows nothing about the app. Loads before app.js; declarations only.

(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.CardPainter = api;
})(typeof self !== 'undefined' ? self : this, function () {
  const W = 1080;
  const SLIDE_H = 1350;
  const U = W / 100;
  const SERIF = "Georgia, 'Iowan Old Style', serif";
  const SANS = "'Helvetica Neue', Arial, sans-serif";
  const C = {
    bg0: '#0b0a08', top: '#1b1712', bottom: '#100e0b', surface2: '#1c1814',
    text: '#f1e9d8', soft: '#d6cbb2', dim: '#bcb096',
    gold: '#d4af37', bright: '#f5d576', goldSoft: '#bd9a3a',
    hair: 'rgba(241,233,216,0.08)', rule: 'rgba(212,175,55,0.16)', border: 'rgba(212,175,55,0.24)',
  };
  const METAL = { s: '#f0dfa0', a: '#f5d576', b: '#d9cca3', c: '#c99a63' };
  const GLOW = { s: 'rgba(240,223,160,0.18)', a: 'rgba(245,213,118,0.18)', b: 'rgba(217,204,163,0.15)', c: 'rgba(201,154,99,0.17)' };
  // The crown is one image for every tier; the app shifts its metal with a
  // CSS filter, and canvas takes the same filter where the browser has it.
  const CROWN_FILTER = { b: 'saturate(0.45) brightness(1.1)', c: 'sepia(0.35) saturate(0.85) brightness(0.8) hue-rotate(-8deg)' };

  const cache = {};
  function loadImage(src) {
    if (!src) return Promise.resolve(null);
    if (!cache[src]) {
      cache[src] = new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => resolve(null);
        img.src = src;
      });
    }
    return cache[src];
  }

  function canvas(w, h) {
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    return c;
  }

  // ---- Text --------------------------------------------------------------
  function font(ctx, size, { serif, weight, spacing } = {}) {
    ctx.font = `${weight || 400} ${Math.round(size)}px ${serif ? SERIF : SANS}`;
    if ('letterSpacing' in ctx) ctx.letterSpacing = spacing ? `${(spacing * size).toFixed(1)}px` : '0px';
  }
  function wrap(ctx, text, width) {
    const out = [];
    String(text || '').split('\n').forEach((para) => {
      const words = para.split(/\s+/).filter(Boolean);
      if (!words.length) { out.push(''); return; }
      let line = '';
      words.forEach((w) => {
        const next = line ? `${line} ${w}` : w;
        if (ctx.measureText(next).width <= width || !line) line = next;
        else { out.push(line); line = w; }
      });
      out.push(line);
    });
    return out;
  }
  function fit(ctx, text, width) {
    let t = String(text || '');
    if (ctx.measureText(t).width <= width) return t;
    while (t.length > 1 && ctx.measureText(`${t}…`).width > width) t = t.slice(0, -1);
    return `${t}…`;
  }
  function textAt(ctx, text, x, y, { color, align, baseline } = {}) {
    ctx.fillStyle = color || C.text;
    ctx.textAlign = align || 'left';
    ctx.textBaseline = baseline || 'alphabetic';
    ctx.fillText(text, x, y);
  }
  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }
  function hline(ctx, x1, x2, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x1, Math.round(y), x2 - x1, 2);
  }

  // The card background: the deck's dark gradient with its gold glow.
  function background(ctx, w, h) {
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, C.top); g.addColorStop(1, C.bottom);
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    ctx.save();
    ctx.translate(w / 2, -0.08 * Math.min(h, SLIDE_H));
    ctx.scale(1, 0.58);
    const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, w * 0.95);
    glow.addColorStop(0, 'rgba(212,175,55,0.16)'); glow.addColorStop(0.7, 'rgba(212,175,55,0)');
    ctx.fillStyle = glow; ctx.fillRect(-w, -w, 2 * w, 2 * w);
    ctx.restore();
    ctx.strokeStyle = C.border; ctx.lineWidth = 3;
    roundRect(ctx, 6, 6, w - 12, h - 12, 54); ctx.stroke();
  }

  function brand(ctx, img, month, x, y, size, right) {
    if (img) ctx.drawImage(img, x, y, size, size);
    font(ctx, size * 0.48, { weight: 700, spacing: 0.14 });
    textAt(ctx, 'MONEY PADEL', x + size * 1.36, y + size * 0.68, { color: C.soft });
    font(ctx, size * 0.48, { spacing: 0.06 });
    textAt(ctx, month || '', right, y + size * 0.68, { color: C.goldSoft, align: 'right' });
  }

  // ---- Kings tiles (deck and sheet) ---------------------------------------
  function kingTile(ctx, k, x, y, w, h, o, sizes) {
    const tier = String(k.tier || '').toLowerCase();
    ctx.save();
    roundRect(ctx, x, y, w, h, 46); ctx.clip();
    ctx.fillStyle = C.surface2; ctx.fillRect(x, y, w, h);
    ctx.save(); ctx.translate(x + w / 2, y); ctx.scale(1, 0.66);
    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, w * 0.9);
    g.addColorStop(0, GLOW[tier] || 'transparent'); g.addColorStop(0.75, 'rgba(0,0,0,0)');
    ctx.fillStyle = g; ctx.fillRect(-w, 0, 2 * w, 3 * h);
    ctx.restore();
    ctx.restore();
    ctx.strokeStyle = C.hair; ctx.lineWidth = 3; roundRect(ctx, x, y, w, h, 46); ctx.stroke();

    const crownW = Math.min(w * sizes.crown, sizes.crownMax || Infinity);
    const crownH = crownW / 2;
    const metal = METAL[tier] || C.bright;
    const lines = [
      { h: crownH + sizes.gap, draw: (cy) => { if (o.crown) { ctx.save(); if ('filter' in ctx && CROWN_FILTER[tier]) ctx.filter = CROWN_FILTER[tier]; ctx.drawImage(o.crown, x + (w - crownW) / 2, cy, crownW, crownH); ctx.restore(); } } },
      { h: sizes.name * 1.15, draw: (cy) => { font(ctx, sizes.name, { serif: true }); textAt(ctx, fit(ctx, k.name || '—', w - 40), x + w / 2, cy + sizes.name * 0.9, { color: k.name ? C.text : C.dim, align: 'center' }); } },
      { h: sizes.tier * 1.6, draw: (cy) => { font(ctx, sizes.tier, { spacing: 0.1 }); textAt(ctx, `TIER ${String(k.tier).toUpperCase()}`, x + w / 2, cy + sizes.tier * 1.25, { color: metal, align: 'center' }); } },
      { h: sizes.rating * 1.25, draw: (cy) => {
        if (k.rating) { font(ctx, sizes.rating, { weight: 700 }); textAt(ctx, k.rating, x + w / 2, cy + sizes.rating * 1.05, { color: metal, align: 'center' }); }
        else { font(ctx, sizes.tier, {}); textAt(ctx, k.none || '', x + w / 2, cy + sizes.tier * 1.4, { color: C.dim, align: 'center' }); }
      } },
    ];
    const total = lines.reduce((a, l) => a + l.h, 0);
    let cy = y + (h - total) / 2;
    lines.forEach((l) => { l.draw(cy); cy += l.h; });
  }

  // ---- A deck slide, 1080 x 1350 -----------------------------------------
  function slide(s, o) {
    const cv = canvas(W, SLIDE_H);
    const ctx = cv.getContext('2d');
    background(ctx, W, SLIDE_H);
    const P = 5.5 * U, R = W - P, inner = W - 2 * P;

    if (s.kind === 'cover') {
      const markS = 17 * U;
      font(ctx, 12 * U, { serif: true });
      const title = wrap(ctx, s.title, inner);
      const h = markS + 3.8 * U + 3.4 * U * 1.2 + 2.8 * U + title.length * 12 * U * 1.05 + 2.2 * U + 3.6 * U * 1.2;
      let y = (SLIDE_H - h) / 2;
      if (o.brand) ctx.drawImage(o.brand, (W - markS) / 2, y, markS, markS);
      y += markS + 3.8 * U;
      font(ctx, 3.4 * U, { weight: 700, spacing: 0.22 }); textAt(ctx, 'MONEY PADEL', W / 2, y + 3.4 * U, { color: C.soft, align: 'center' });
      y += 3.4 * U * 1.2 + 2.8 * U;
      font(ctx, 12 * U, { serif: true });
      title.forEach((line) => { textAt(ctx, line, W / 2, y + 12 * U * 0.85, { color: C.bright, align: 'center' }); y += 12 * U * 1.05; });
      y += 2.2 * U;
      font(ctx, 3.6 * U, { spacing: 0.18 }); textAt(ctx, String(s.sub || 'Monthly Review').toUpperCase(), W / 2, y + 3.6 * U, { color: C.goldSoft, align: 'center' });
      return cv;
    }

    let y = P;
    brand(ctx, o.brand, o.month, P, y, 6.2 * U, R);
    y += 6.2 * U + 4.4 * U;
    font(ctx, 3 * U, { weight: 700, spacing: 0.16 });
    textAt(ctx, String(s.eyebrow || '').toUpperCase(), P, y + 3 * U * 0.85, { color: C.gold });
    y += 3 * U * 1.2 + 1 * U;
    font(ctx, 8 * U, { serif: true });
    wrap(ctx, s.title, inner).forEach((line) => { textAt(ctx, line, P, y + 8 * U * 0.82, { color: C.text }); y += 8 * U * 1.08; });
    y += 3.4 * U;

    // The footnote sits at the foot of the card; the body fills what is left.
    let bottom = SLIDE_H - P;
    if (s.foot) {
      font(ctx, 3 * U);
      const lines = wrap(ctx, s.foot, inner);
      let fy = bottom - lines.length * 3 * U * 1.35;
      bottom = fy - 2.2 * U;
      lines.forEach((line) => { textAt(ctx, line, P, fy + 3 * U, { color: C.dim }); fy += 3 * U * 1.35; });
    }

    if (s.kind === 'note') {
      font(ctx, 4.3 * U);
      String(s.body || '').split(/\n{2,}/).forEach((para) => {
        wrap(ctx, para, inner).forEach((line) => { if (y + 4.3 * U < bottom) textAt(ctx, line, P, y + 4.3 * U, { color: C.soft }); y += 4.3 * U * 1.5; });
        y += 2.8 * U;
      });
      return cv;
    }

    if (s.layout === 'kings' && s.groups && s.groups[0]) {
      const rows = s.groups[0].rows;
      const n = rows.length, gap = 2.8 * U, h = bottom - y;
      const cols = n === 1 ? 1 : 2, rowsN = n <= 2 ? 1 : 2;
      const tw = (inner - (cols - 1) * gap) / cols, th = (h - (rowsN - 1) * gap) / rowsN;
      const big = { crown: n === 1 ? 0.52 : 0.84, gap: 1.8 * U, name: (n === 1 ? 11 : 8.4) * U, tier: (n === 1 ? 3.6 : 3.4) * U, rating: (n === 1 ? 12 : 9.6) * U };
      const small = { crown: 0.46, crownMax: 32 * U, gap: 1.8 * U, name: 6.6 * U, tier: 3 * U, rating: 7.4 * U };
      rows.forEach((r, i) => {
        const k = { tier: r.tier || String(r.label || '').replace(/^Tier\s*/, ''), name: r.name, rating: r.value };
        if (n <= 2) return kingTile(ctx, k, P + i * (tw + gap), y, tw, th, o, big);
        if (n === 3 && i === 0) return kingTile(ctx, k, P, y, inner, th, o, Object.assign({}, small, { crown: 0.34, name: 8.4 * U, rating: 9 * U }));
        const j = n === 3 ? i - 1 : i;
        kingTile(ctx, k, P + (j % 2) * (tw + gap), y + (n === 3 ? 1 : Math.floor(j / 2)) * (th + gap), tw, th, o, small);
      });
      return cv;
    }

    if (s.stats && s.stats.length) {
      const colW = (inner - 4 * U) / 2;
      s.stats.forEach((st, i) => {
        if (i === 0) {
          font(ctx, 18 * U, { serif: true }); textAt(ctx, st.value, P, y + 18 * U * 0.8, { color: C.bright });
          y += 18 * U + 1.2 * U;
          font(ctx, 3.2 * U, { spacing: 0.08 }); textAt(ctx, String(st.label).toUpperCase(), P, y + 3.2 * U, { color: C.dim });
          y += 3.2 * U * 1.3 + 4 * U;
          return;
        }
        const col = (i - 1) % 2, x = P + col * (colW + 4 * U);
        hline(ctx, x, x + colW, y, C.rule);
        font(ctx, 10 * U, { serif: true }); textAt(ctx, st.value, x, y + 2.8 * U + 10 * U * 0.85, { color: C.text });
        font(ctx, 3.2 * U, { spacing: 0.08 }); textAt(ctx, String(st.label).toUpperCase(), x, y + 2.8 * U + 10 * U + 1.2 * U + 3.2 * U, { color: C.dim });
        if (col === 1) y += 2.8 * U * 2 + 10 * U + 1.2 * U + 3.2 * U * 1.3;
      });
      return cv;
    }

    const single = (s.groups || []).length === 1;
    (s.groups || []).forEach((g, gi) => {
      const compact = !single;
      if (gi > 0) { y += 2.8 * U; hline(ctx, P, R, y, 'rgba(212,175,55,0.14)'); y += 2.2 * U; }
      if (g.label) { font(ctx, 3 * U, { weight: 700, spacing: 0.12 }); textAt(ctx, String(g.label).toUpperCase(), P, y + 3 * U, { color: C.dim }); y += 3 * U * 1.3; }
      g.rows.forEach((r, i) => {
        const hero = single && i === 0;
        const pad = hero ? 2.5 * U : compact ? 1.1 * U : 1.7 * U;
        const nameS = (hero ? 5.8 : compact ? 4.2 : 4.6) * U, valS = (hero ? 8.8 : compact ? 5.4 : 6.2) * U;
        const rankW = r.rank ? 5.4 * U + 2.8 * U : 0;
        font(ctx, valS, { serif: true });
        const valueW = r.value ? Math.min(ctx.measureText(r.value).width, inner * 0.45) : 0;
        const nx = P + rankW, nw = inner - rankW - (valueW ? valueW + 2.8 * U : 0);
        // A sub-line wraps (up to three lines), as it does on the card.
        font(ctx, 3.2 * U);
        const subLines = r.sub ? wrap(ctx, r.sub, nw).slice(0, 3) : [];
        const labelH = r.label ? 2.9 * U * 1.2 : 0, subH = subLines.length * 3.2 * U * 1.3;
        const h = pad * 2 + labelH + nameS * 1.2 + subH;
        const mid = y + h / 2;
        if (r.rank) { font(ctx, 4.6 * U, { serif: true }); textAt(ctx, r.rank, P + 2.7 * U, mid + 4.6 * U * 0.35, { color: hero ? C.bright : C.goldSoft, align: 'center' }); }
        let ty = y + pad;
        if (r.label) { font(ctx, 2.9 * U, { weight: 700, spacing: 0.1 }); textAt(ctx, fit(ctx, String(r.label).toUpperCase(), nw), nx, ty + 2.9 * U, { color: C.goldSoft }); ty += labelH; }
        font(ctx, nameS, { weight: 600 }); textAt(ctx, fit(ctx, r.name, nw), nx, ty + nameS * 0.95, { color: C.text }); ty += nameS * 1.2;
        if (subLines.length) { font(ctx, 3.2 * U); subLines.forEach((l, k) => textAt(ctx, k === 2 ? fit(ctx, l, nw) : l, nx, ty + 3.2 * U + k * 3.2 * U * 1.3, { color: C.dim })); }
        if (r.value) { font(ctx, valS, { serif: true }); textAt(ctx, fit(ctx, r.value, inner * 0.45), R, mid + valS * 0.35, { color: hero ? C.bright : C.text, align: 'right' }); }
        y += h;
        if (i < g.rows.length - 1) hline(ctx, P, R, y - 1, 'rgba(241,233,216,0.06)');
      });
    });
    return cv;
  }

  // ---- A Board Pack module, 1080 wide ------------------------------------
  // Painted on a tall scratch canvas, then cut to the height it used.
  const MAX_H = 8000;
  function sheet(sh, o) {
    const scratch = canvas(W, MAX_H);
    const ctx = scratch.getContext('2d');
    const P = 64, R = W - P, inner = W - 2 * P;
    let y = P;
    brand(ctx, o.brand, sh.month, P, y, 56, R);
    y += 56 + 40;
    if (sh.tag) {
      font(ctx, 22, { weight: 700, spacing: 0.08 });
      const tw = ctx.measureText(sh.tag.toUpperCase()).width + 36;
      ctx.strokeStyle = 'rgba(138,109,31,1)'; ctx.lineWidth = 2; roundRect(ctx, P, y, tw, 40, 20); ctx.stroke();
      textAt(ctx, sh.tag.toUpperCase(), P + 18, y + 28, { color: C.bright });
      y += 40 + 18;
    }
    font(ctx, 58, { serif: true });
    wrap(ctx, sh.title, inner).forEach((line) => { textAt(ctx, line, P, y + 50, { color: C.text }); y += 64; });
    y += 18;

    // Tables of the same shape share their columns -- a league's tier tables
    // line up one under another.
    const columns = {};
    const cellText = (c) => (c && typeof c === 'object' ? c.text + (c.note ? ` ${c.note}` : '') : String(c));
    (sh.blocks || []).filter((b) => b.type === 'table').forEach((b) => {
      const key = b.headers.join('|');
      (columns[key] = columns[key] || { headers: b.headers, rows: [] }).rows.push(...b.rows);
    });
    Object.values(columns).forEach((col) => {
      let size = 30, widths;
      for (; size >= 20; size -= 2) {
        font(ctx, size, { weight: 700 });
        widths = col.headers.map((h, ci) => Math.max(ctx.measureText(h).width, ...col.rows.map((r) => ctx.measureText(cellText(r[ci])).width)) + 26);
        if (widths.reduce((a, w) => a + w, 0) <= inner) break;
      }
      const spare = inner - widths.reduce((a, w) => a + w, 0);
      if (widths.length > 1) widths[1] += Math.max(0, spare);
      col.size = size; col.widths = widths;
    });

    (sh.blocks || []).forEach((b) => {
      if (y > MAX_H - 400) return;
      switch (b.type) {
        case 'sub':
          y += 22; font(ctx, 26, { weight: 700, spacing: 0.06 });
          textAt(ctx, String(b.text).toUpperCase(), P, y + 26, { color: C.goldSoft }); y += 26 + 14; break;
        case 'empty':
          font(ctx, 30); wrap(ctx, b.text, inner).forEach((l) => { textAt(ctx, l, P, y + 30, { color: C.dim }); y += 42; }); y += 6; break;
        case 'foot':
          y += 14; font(ctx, 24); wrap(ctx, b.text, inner).forEach((l) => { textAt(ctx, l, P, y + 24, { color: C.dim }); y += 34; }); break;
        case 'text':
          font(ctx, 34); String(b.text || '').split(/\n/).forEach((para) => { wrap(ctx, para, inner).forEach((l) => { textAt(ctx, l, P, y + 34, { color: C.soft }); y += 51; }); }); break;
        case 'stats': {
          const cw = inner / b.items.length;
          b.items.forEach((st, i) => {
            const cx = P + cw * i + cw / 2;
            font(ctx, 76, { weight: 700 }); textAt(ctx, st.value, cx, y + 76, { color: C.text, align: 'center' });
            font(ctx, 26); textAt(ctx, st.label, cx, y + 76 + 44, { color: C.dim, align: 'center' });
          });
          y += 76 + 60; break;
        }
        case 'list':
          b.rows.forEach((r, i) => {
            const rankW = 64;
            font(ctx, 30); const vw = ctx.measureText(r.value || '').width;
            const twoLines = vw > inner * 0.55;
            const h = twoLines ? 108 : 66;
            font(ctx, 30); textAt(ctx, r.rank || '', P, y + 44, { color: C.dim });
            font(ctx, 34, { weight: 600 });
            textAt(ctx, fit(ctx, r.name, twoLines ? inner - rankW : inner - rankW - vw - 24), P + rankW, y + 44, { color: C.text });
            font(ctx, 30);
            if (twoLines) textAt(ctx, fit(ctx, r.value, inner - rankW), P + rankW, y + 88, { color: C.soft });
            else if (r.value) textAt(ctx, r.value, R, y + 44, { color: C.soft, align: 'right' });
            y += h;
            if (i < b.rows.length - 1) hline(ctx, P, R, y - 2, C.hair);
          });
          y += 6; break;
        case 'table': {
          const { size, widths } = columns[b.headers.join('|')];
          const xs = []; widths.reduce((x, w, i) => { xs[i] = x; return x + w; }, P);
          const align = (ci) => (ci >= 2 ? 'right' : 'left');
          const at = (ci) => (align(ci) === 'right' ? xs[ci] + widths[ci] - 6 : xs[ci] + (ci === 0 ? 0 : 6));
          font(ctx, Math.round(size * 0.75), { weight: 600 });
          b.headers.forEach((h, ci) => textAt(ctx, h, at(ci), y + size, { color: C.dim, align: align(ci) }));
          y += size + 18; hline(ctx, P, R, y, C.hair); y += 4;
          b.rows.forEach((r) => {
            r.forEach((c, ci) => {
              const strong = c && typeof c === 'object' && c.strong;
              const note = c && typeof c === 'object' && c.note;
              const text = c && typeof c === 'object' ? c.text : String(c);
              font(ctx, size, { weight: strong ? 700 : 400 });
              const maxW = widths[ci] - 12;
              textAt(ctx, fit(ctx, text, note ? maxW * 0.6 : maxW), at(ci), y + size * 1.45, { color: C.text, align: align(ci) });
              if (note) {
                const w = ctx.measureText(fit(ctx, text, maxW * 0.6)).width;
                font(ctx, Math.round(size * 0.75));
                textAt(ctx, fit(ctx, note, maxW - w - 10), at(ci) + (align(ci) === 'left' ? w + 10 : 0), y + size * 1.45, { color: C.dim, align: 'left' });
              }
            });
            y += Math.round(size * 2.1);
            hline(ctx, P, R, y - 2, C.hair);
          });
          y += 8; break;
        }
        case 'kings': {
          const n = b.tiles.length, gap = 24, tw = (inner - (n - 1) * gap) / n, th = 330;
          b.tiles.forEach((k, i) => kingTile(ctx, k, P + i * (tw + gap), y, tw, th, o, { crown: 0.5, crownMax: 210, gap: 14, name: n > 3 ? 36 : 44, tier: 22, rating: n > 3 ? 38 : 46 }));
          y += th + 10; break;
        }
        default: break;
      }
    });
    const h = Math.min(MAX_H, Math.ceil(y + P));
    const out = canvas(W, h);
    const octx = out.getContext('2d');
    background(octx, W, h);
    octx.drawImage(scratch, 0, 0, W, h, 0, 0, W, h);
    return out;
  }

  function toBlob(cv) {
    return new Promise((resolve) => cv.toBlob((b) => resolve(b), 'image/png'));
  }

  async function toFile(cv, name) {
    const blob = await toBlob(cv);
    return new File([blob], name, { type: 'image/png' });
  }

  // Several pictures as one PDF, a page each (features/review/pdfDoc.js).
  // JPEG inside: a deck of slides stays a few megabytes, not tens.
  async function toPdf(canvases, name, title) {
    const Pdf = (typeof PdfDoc !== 'undefined') ? PdfDoc : require('./pdfDoc.js');
    const pages = await Promise.all(canvases.map(async (cv) => {
      const blob = await new Promise((resolve) => cv.toBlob((b) => resolve(b), 'image/jpeg', 0.92));
      return { jpeg: new Uint8Array(await blob.arrayBuffer()), width: cv.width, height: cv.height };
    }));
    return new File([Pdf.build(pages, { title })], name, { type: 'application/pdf' });
  }

  // Share pictures through the phone's share sheet (WhatsApp is on it), or
  // save them where the browser cannot share files. A share sheet must be
  // opened by a tap: when preparing the pictures took that moment away, the
  // caller is told so ('ready') and offers a button that shares at once.
  async function share(files, meta) {
    const data = Object.assign({ files }, meta || {});
    if (typeof navigator !== 'undefined' && navigator.canShare && navigator.share && navigator.canShare({ files })) {
      try { await navigator.share(data); return 'shared'; }
      catch (e) {
        if (e && e.name === 'AbortError') return 'cancelled';
        if (e && e.name === 'NotAllowedError') return 'ready';
      }
    }
    await save(files);
    return 'saved';
  }

  // One file at a time, a moment apart: a browser drops downloads fired in
  // one burst past about ten (Chromium did, at eleven slides), silently.
  const SAVE_GAP = 250;
  async function save(files) {
    for (let i = 0; i < files.length; i++) {
      if (i) await new Promise((r) => setTimeout(r, SAVE_GAP));
      const a = document.createElement('a');
      a.href = URL.createObjectURL(files[i]);
      a.download = files[i].name;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 30000);
    }
  }

  return { W, SLIDE_H, loadImage, slide, sheet, toBlob, toFile, toPdf, share, save };
});
