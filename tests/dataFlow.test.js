// ===================== DATA FLOW =====================
// How the app gets its data onto the screen, and keeps it there.
//
// Two defects lived here for a long time, and neither was a calculation
// mistake -- every module was right and the wiring was wrong, which is why
// only a test that drives the browser can catch either.
//
//   1. A screen tapped while the record was still arriving was drawn once,
//      from nothing, and never drawn again. It stayed blank until the reader
//      navigated away and came back. Start-up ended by redrawing the rankings
//      list, which is one screen out of eleven.
//
//   2. A mutation rebuilt everything derived and then redrew whichever screen
//      its own button happened to live on. Removing one rated match moved four
//      players' ratings and changed nothing on the League Table, the Merit
//      Table, the Players Directory, Call-Outs or Head-to-Head.
//
// And one cost: fourteen independent reads taken one at a time, measured at
// 3.8s to first content on a phone, of which 16ms was computation.

const test = require('node:test');
const assert = require('node:assert');
const harness = require('./helpers/uiHarness.js');

const maybe = harness.available() ? test : test.skip;

// Long enough that a tap lands inside the loading window on any machine,
// short enough not to slow the suite down.
const LATENCY = 300;

maybe('a screen tapped while the record is still arriving is drawn when it lands', async () => {
  // The Players Directory, chosen because it is entirely derived: if it is
  // drawn before PLAYERS exists, it renders an empty list and stops.
  const app = await harness.open({ readLatency: LATENCY, tapDuringBoot: 'players' });
  try {
    const seen = await app.run(() => ({
      tapped: !!window.__tappedAt,
      tab: activeTab,
      rows: document.querySelectorAll('#playersView .pdir-row').length,
      blank: app => null,
      html: document.getElementById('playersView').innerHTML.length,
      placeholders: document.querySelectorAll('.boot-placeholder').length,
      notice: !!document.getElementById('bootNotice'),
    }));
    assert.strictEqual(seen.tapped, true, 'the test did not manage to tap during the load');
    assert.strictEqual(seen.tab, 'players', 'the tap should have selected the Players tab');
    assert.ok(seen.rows > 20, `the directory should hold the club, not ${seen.rows} rows`);
    assert.strictEqual(seen.placeholders, 0, 'the loading placeholder should be gone');
    assert.strictEqual(seen.notice, false, 'the loading notice should be gone');
    assert.deepStrictEqual(app.pageErrors, []);
  } finally { await app.close(); }
});

maybe('the same is true of the League Table, which nothing else would redraw', async () => {
  const app = await harness.open({ readLatency: LATENCY, tapDuringBoot: 'summary' });
  try {
    const seen = await app.run(() => ({
      tab: activeTab,
      rows: document.querySelectorAll('#summaryContent tr').length,
      text: document.getElementById('summaryContent').textContent.trim().length,
    }));
    assert.strictEqual(seen.tab, 'summary');
    assert.ok(seen.rows > 5, `the League Table should have rows, not ${seen.rows}`);
    assert.ok(seen.text > 200, 'the League Table should have content');
    assert.deepStrictEqual(app.pageErrors, []);
  } finally { await app.close(); }
});

maybe('during the load the reader is told so, not shown an empty club', async () => {
  const app = await harness.open({ readLatency: LATENCY, tapDuringBoot: 'players' });
  try {
    // Sampled inside the loading window, at the instant of the tap.
    const atTap = await app.run(() => window.__atTap);
    assert.strictEqual(atTap.ready, false, 'the record should not have arrived yet');
    assert.strictEqual(atTap.players, 0, 'there should be no players yet');
    assert.strictEqual(atTap.notice, true, 'the loading notice should be up');
    assert.strictEqual(atTap.placeholder, true, 'the screen should say it is loading');
    // The precise thing that used to happen: a directory drawn from an empty
    // club, which reads as a club with no members rather than as a wait.
    assert.ok(!/No players/i.test(atTap.text), `the screen claimed an empty club: "${atTap.text}"`);
    assert.strictEqual(await app.run(() => DATA_READY), true, 'and the record arrives');
  } finally { await app.close(); }
});

maybe("start-up's reads all go out together", async () => {
  const app = await harness.open({ readLatency: LATENCY });
  try {
    const reads = await app.run(() => window.__reads.slice());
    assert.ok(reads.length >= 12, `expected start-up to read the record, saw ${reads.length} reads`);
    const first = Math.min(...reads.map(r => r.started));
    const last = Math.max(...reads.map(r => r.ended));
    // Fourteen reads in series at this latency would take 14 x LATENCY. In one
    // round trip they take a little over one. The threshold is deliberately
    // generous: the point is the order of magnitude, not the exact figure.
    assert.ok(last - first < LATENCY * 4,
      `start-up took ${last - first}ms over ${reads.length} reads at ${LATENCY}ms each — they are being taken in series`);
  } finally { await app.close(); }
});

maybe('a change to the record redraws whatever screen is in front of the reader', async () => {
  const app = await harness.open();
  try {
    const result = await app.run(() => {
      const out = {};
      ['summary', 'players', 'callouts', 'h2h', 'games'].forEach(tab => {
        document.querySelector(`#tabrow .tab-btn[data-tab="${tab}"]`).click();
        const id = TAB_VIEW_ID[tab];
        const box = document.getElementById(id);
        const before = box.innerHTML;
        // Whatever is on screen is thrown away. Only a genuine redraw of the
        // ACTIVE screen can bring it back -- which is the whole claim.
        box.innerHTML = '';
        dataChanged();
        out[tab] = { restored: box.innerHTML.length, matched: box.innerHTML === before };
      });
      return out;
    });
    Object.entries(result).forEach(([tab, r]) => {
      assert.ok(r.restored > 100, `${tab} was not redrawn by dataChanged() (${r.restored} chars)`);
    });
    assert.deepStrictEqual(app.pageErrors, []);
  } finally { await app.close(); }
});

maybe('a submitted result appears on the screen it was submitted from', async () => {
  // The acceptance test in its plainest form, driven through the real form.
  // Before this change the submission was saved, everything derived was
  // rebuilt, and the screen was not redrawn -- so the game the reader had just
  // entered was not in the list in front of them until they navigated away and
  // came back. Reproduced in a browser against the old code; this is the guard
  // against it returning.
  const app = await harness.open();
  try {
    const out = await app.run(async () => {
      document.querySelector('#tabrow .tab-btn[data-tab="games"]').click();
      const view = document.getElementById('gamesView');
      const names = PLAYERS.slice(0, 4).map(p => p.name);
      const set = (id, v) => { document.getElementById(id).value = v; };
      // Who the submission is recorded against. The Games tab no longer carries
      // a name field: identity comes from the chosen player, falling back to
      // this. See submissionIdentity().
      currentUserName = 'Tester';
      // A date nothing else in the record carries, so its presence on screen
      // can only come from this submission.
      set('agDate', '2026-12-31');
      set('agA1', names[0]); set('agA2', names[1]);
      set('agB1', names[2]); set('agB2', names[3]);
      const vals = [6, 3, 6, 4];
      document.querySelectorAll('#agSets input').forEach((el, i) => {
        if (i < 4) { el.value = vals[i]; el.dispatchEvent(new Event('input', { bubbles: true })); }
      });
      const before = view.innerHTML;
      await submitNewGame();
      await new Promise(r => setTimeout(r, 200));
      return {
        saved: extraMatchesState.length,
        wasThereBefore: before.includes('2026-12-31'),
        onScreenNow: document.getElementById('gamesView').innerHTML.includes('2026-12-31'),
        message: (document.getElementById('agMessage') || {}).textContent || '',
        // The form belongs to the same screen, so redrawing it must not leave
        // the reader's entry sitting in the fields.
        fieldsCleared: !document.getElementById('agA1').value,
      };
    });
    assert.strictEqual(out.saved, 1, 'the submission should have been stored');
    assert.strictEqual(out.wasThereBefore, false, 'the test date must be unique to this submission');
    assert.strictEqual(out.onScreenNow, true,
      'the submitted game is not on the screen it was submitted from');
    assert.match(out.message, /Submitted/, 'the confirmation must survive the redraw');
    assert.strictEqual(out.fieldsCleared, true, 'the form should be empty again');
    assert.deepStrictEqual(app.pageErrors, []);
  } finally { await app.close(); }
});

// A source-level guard, and deliberately so. The two browser tests above prove
// the mechanism works; this one proves nothing can quietly go around it. Every
// previous version of this bug was written by somebody adding a button and
// calling recomputeAll() next to it, which is the natural thing to do and
// leaves every other screen holding the old numbers.
test('nothing recomputes the record without redrawing the screen', () => {
  const fs = require('node:fs');
  const path = require('node:path');
  // Every application script, each walked on its own for its enclosing function.
  const { appScriptFiles, readAppScript } = require('./helpers/appSource.js');
  const callers = [];
  appScriptFiles().forEach((file) => {
    const lines = readAppScript(file).split('\n');
    lines.forEach((line, i) => {
      if (!/(^|[^\w.])recomputeAll\(\)/.test(line)) return;
      if (/^\s*(\/\/|\*)/.test(line)) return;      // a comment about it, not a call
      callers.push({ file, line: i + 1, text: line.trim(), fn: nearestFunction(lines, i + 1) });
    });
  });
  // Exactly three: the definition's own body, the one refresh path, and the
  // two places that own the whole screen anyway (start-up and the app-wide
  // Data Range change, which already redraws the active tab itself).
  const allowed = ['return PerfTrace.time(', 'function recomputeAll'];
  const unexpected = callers.filter(c =>
    !allowed.some(a => c.text.startsWith(a))
    && !/dataChanged|applyDataRangeChange|init/.test(c.fn));
  assert.deepStrictEqual(unexpected, [],
    'recomputeAll() is called outside dataChanged(): that screen will show the old numbers.\n'
    + unexpected.map(c => `  ${c.file}:${c.line}  ${c.text}`).join('\n'));
});

// Walks back to the nearest enclosing `function name(` line. Crude, and enough
// for a file that declares every function at the top level.
function nearestFunction(lines, lineNo) {
  for (let i = lineNo - 1; i >= 0; i--) {
    const m = /^(?:async )?function (\w+)/.exec(lines[i]);
    if (m) return m[1];
  }
  return '';
}
