// ===================== FORM DOTS =====================
// A run of form is drawn in three places — Home's dots, the profile's
// letters, the League table's Last 10 column — and each one used to decide
// for itself what a result looked like.
//
// The regression this file exists for: `computeRecentFormSequence` returned
// booleans, Home rendered them with `won ? 'w' : 'l'`, and when the sequence
// started returning the letters 'W' / 'D' / 'L' instead, every one of those
// strings was truthy. Ten dots came out green beside a record that correctly
// read 4W–6L. Nothing threw, the aggregate was right, and no test noticed,
// because no test had ever looked at an individual dot.
//
// So these look at individual dots.

const test = require('node:test');
const assert = require('node:assert');
const H = require('./helpers/uiHarness.js');
const MatchOutcome = require('../assets/js/matchOutcome.js');

const skip = H.available() ? false : 'Playwright unavailable';
const maybe = H.available() ? test : test.skip;

// --- the shared classifier ------------------------------------------------

test('a result maps to exactly one visual state', () => {
  assert.strictEqual(MatchOutcome.classFor('W'), 'w');
  assert.strictEqual(MatchOutcome.classFor('L'), 'l');
  assert.strictEqual(MatchOutcome.classFor('D'), 'd');
  // The words this module already deals in, so a caller holding an outcome
  // rather than a letter does not have to convert first.
  assert.strictEqual(MatchOutcome.classFor('win'), 'w');
  assert.strictEqual(MatchOutcome.classFor('loss'), 'l');
  assert.strictEqual(MatchOutcome.classFor('draw'), 'd');
  assert.strictEqual(MatchOutcome.classFor('w'), 'w');
});

test('anything it does not recognise is unstyled, never a win', () => {
  // The precise bug: a truthy value that is not a win. Under the old
  // `x ? 'w' : 'l'` every one of these rendered green.
  ['L', 'D', true, 'X', 1, {}].forEach((v) => {
    assert.notStrictEqual(MatchOutcome.classFor(v), 'w',
      `${JSON.stringify(v)} must not be drawn as a win`);
  });
  [null, undefined, '', 'X', true, false].forEach((v) => {
    assert.strictEqual(MatchOutcome.classFor(v), '',
      `${JSON.stringify(v)} is not a result and must carry no state`);
  });
});

// --- Home's dots ----------------------------------------------------------

maybe('every Home form dot matches its own game, not the aggregate', async () => {
  const app = await H.open();
  try {
    const r = await app.run(() => {
      // Somebody with a mixed run, which is the only kind that can catch this:
      // an all-wins player looks identical whether the bug is present or not.
      const mixed = PLAYERS.map((p) => {
        const seq = computeRecentFormSequence(p.name, 10);
        return { name: p.name, seq, wins: seq.filter((x) => x === 'W').length };
      }).filter((p) => p.seq.length >= 6 && p.wins > 0 && p.wins < p.seq.length)
        .sort((a, b) => b.seq.length - a.seq.length)[0];

      setCurrentViewer(mixed.name);
      goToSection('home');
      renderHomeDashboard();
      const dots = [...document.querySelectorAll('#homeDashboard .home-form-dots .form-dot')]
        .map((d) => d.className.replace('form-dot', '').trim());
      const aggregate = computeRecentForm(mixed.name, 10);
      return {
        name: mixed.name,
        seq: mixed.seq,
        dots,
        record: (document.querySelector('#homeDashboard .home-form-record') || {}).textContent || '',
        aggregate: { wins: aggregate.wins, losses: aggregate.losses, games: aggregate.games },
      };
    });

    assert.ok(r.seq.length >= 6, `needed a player with a real run, got ${r.seq.length}`);
    assert.strictEqual(r.dots.length, r.seq.length, 'one dot per game');

    // Per dot, in order. This is the assertion that was missing.
    r.seq.forEach((result, i) => {
      assert.strictEqual(r.dots[i], MatchOutcome.classFor(result),
        `dot ${i + 1} of ${r.name}'s run is "${r.dots[i]}" but that game was a ${result}`
        + ` — sequence ${r.seq.join('')}, dots ${r.dots.join('')}`);
    });

    // And the shape of the failure, stated directly: the dots must not all
    // agree when the games did not.
    assert.ok(new Set(r.dots).size > 1,
      `every dot rendered the same state (${r.dots[0]}) for a mixed run ${r.seq.join('')}`);

    // The dots and the text beside them must tell the same story.
    assert.strictEqual(r.dots.filter((c) => c === 'w').length, r.aggregate.wins,
      `${r.record} beside ${r.dots.filter((c) => c === 'w').length} green dots`);
    assert.strictEqual(r.dots.filter((c) => c === 'l').length, r.aggregate.losses);
    assert.deepStrictEqual(app.pageErrors, []);
  } finally { await app.close(); }
});

maybe('a strictly alternating run alternates on screen, draws included', async () => {
  // The run the brief asks for, forced rather than found, so the order is
  // unambiguous and a draw is covered even though the rated set holds none.
  const app = await H.open();
  try {
    const r = await app.run(() => {
      const wanted = ['W', 'L', 'W', 'L', 'D', 'W', 'L', 'W', 'L', 'W'];
      const real = computeRecentFormSequence;
      window.computeRecentFormSequence = () => wanted.slice();
      try {
        setCurrentViewer(PLAYERS.find((p) => p.total >= 10).name);
        goToSection('home');
        renderHomeDashboard();
        const dots = [...document.querySelectorAll('#homeDashboard .home-form-dots .form-dot')]
          .map((d) => d.className.replace('form-dot', '').trim());
        return { wanted, dots };
      } finally { window.computeRecentFormSequence = real; }
    });
    assert.deepStrictEqual(r.dots, ['w', 'l', 'w', 'l', 'd', 'w', 'l', 'w', 'l', 'w'],
      `W-L-W-L-D… must render as itself, got ${r.dots.join('-')}`);
    assert.deepStrictEqual(app.pageErrors, []);
  } finally { await app.close(); }
});

// --- the other two renderers of the same idea -----------------------------

maybe("the profile's form letters carry the same states", async () => {
  const app = await H.open();
  try {
    const r = await app.run(() => {
      const mixed = PLAYERS.map((p) => ({ name: p.name, seq: computeRecentFormSequence(p.name, 10) }))
        .filter((p) => p.seq.length >= 6 && new Set(p.seq).size > 1)[0];
      selectedMonth = 'all'; matchFilter = null;
      openSheet(mixed.name);
      const letters = [...document.querySelectorAll('.pp-form-letter')]
        .map((el) => ({ text: el.textContent.trim(), cls: el.className.replace('pp-form-letter', '').trim() }));
      closeSheet();
      return { name: mixed.name, seq: mixed.seq, letters };
    });
    assert.strictEqual(r.letters.length, r.seq.length, 'one letter per game');
    r.seq.forEach((result, i) => {
      assert.strictEqual(r.letters[i].text, result, `letter ${i + 1} should read ${result}`);
      assert.strictEqual(r.letters[i].cls, MatchOutcome.classFor(result),
        `letter ${i + 1} is styled "${r.letters[i].cls}" for a ${result}`);
    });
    assert.deepStrictEqual(app.pageErrors, []);
  } finally { await app.close(); }
});

maybe("the League table's Last 10 column colours each result on its own", async () => {
  const app = await H.open();
  try {
    const r = await app.run(() => {
      // Colour is inline here rather than a class, so the assertion reads the
      // rendered style — which is what a reader actually sees.
      const runs = [
        { run: ['W', 'L', 'W', 'L', 'D'], label: 'mixed' },
        { run: ['L', 'L', 'L', 'L', 'L'], label: 'all losses' },
      ].map(({ run, label }) => {
        const host = document.createElement('div');
        host.innerHTML = lastTenRunHtml(run);
        return {
          label, run,
          cells: [...host.querySelectorAll('span')].map((s) => ({ text: s.textContent, colour: s.style.color })),
        };
      });
      return { runs };
    });
    const mixed = r.runs[0];
    const losses = r.runs[1];
    assert.strictEqual(mixed.cells.length, 5);
    mixed.cells.forEach((c, i) => {
      assert.strictEqual(c.text, mixed.run[i]);
      assert.ok(c.colour, `cell ${i + 1} has no colour at all`);
    });
    // Three results, three different colours; and a run of losses must not
    // come out looking like a run of wins.
    assert.strictEqual(new Set(mixed.cells.map((c) => c.colour)).size, 3,
      'W, L and D must be visually distinct');
    assert.strictEqual(new Set(losses.cells.map((c) => c.colour)).size, 1);
    assert.notStrictEqual(losses.cells[0].colour, mixed.cells[0].colour,
      'five losses must not be drawn in the winning colour');
    assert.deepStrictEqual(app.pageErrors, []);
  } finally { await app.close(); }
});

// A source-level guard. The browser tests prove the three renderers are right
// today; this one stops a fourth being written the way the first one was.
test('nothing decides what a result looks like on its own', () => {
  const fs = require('node:fs');
  const path = require('node:path');
  const offenders = [];
  const { appScriptFiles, readAppScript } = require('./helpers/appSource.js');
  appScriptFiles().forEach((file) => {
    const src = readAppScript(file);
    src.split('\n').forEach((line, i) => {
      if (/^\s*(\/\/|\*)/.test(line)) return;
      // `something ? 'w' : 'l'` and friends — deciding a form state from a
      // truth test rather than from the result.
      if (/\?\s*'w'\s*:\s*'l'|\?\s*"w"\s*:\s*"l"|\?\s*'W'\s*:\s*'L'|\?\s*"W"\s*:\s*"L"/.test(line)) {
        offenders.push(`${file}:${i + 1}  ${line.trim()}`);
      }
    });
  });
  assert.deepStrictEqual(offenders, [],
    'a form state is being derived from a truth test; use MatchOutcome.classFor()\n' + offenders.join('\n'));
});
