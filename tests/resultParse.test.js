// ===================== ADD A GAME READS RESULTS AS PEOPLE WRITE THEM =====================
// Shaun, 27 Oct: the quick paste accepted one exact layout, so results had to
// be rewritten into it. domain/matches/resultParse.js reads the usual ways a
// result is written; every reading says how it decided, and nothing doubtful
// is passed off as certain.

const test = require('node:test');
const assert = require('node:assert');
const H = require('./helpers/uiHarness.js');
const RP = require('../assets/js/domain/matches/resultParse.js');

const maybe = H.available() ? test : test.skip;

const DIR = ['Rishi', 'Fatch', 'Tom', 'Topsy', 'Ant Slice', 'Ant Slicer', 'Antz', 'Jords', 'Max', 'KC', 'Len', 'Shaun', 'PDM'];
const O = { directory: DIR, today: '2026-10-27', me: 'Shaun' };   // a Tuesday
const read = (t) => RP.parse(t, O);
const SAME = { winners: ['Rishi', 'Fatch'], losers: ['Tom', 'Topsy'], sets: [[6, 0], [6, 2]], isDraw: false, isSingles: false };
const core = (r) => ({ winners: r.winners, losers: r.losers, sets: r.sets, isDraw: r.isDraw, isSingles: r.isSingles });

test('the same result, written eight different ways, reads the same', () => {
  [
    'Rishi & Fatch 🏆\n6-0\n6-2\nTom & Topsy',                       // the old layout still works
    'Rishi & Fatch beat Tom & Topsy 6-0 6-2',
    'Tom/Topsy lost to Rishi/Fatch 6-0, 6-2',                        // winners-first scores
    'Tom/Topsy lost to Rishi/Fatch 0-6, 2-6',                        // listed-first scores
    'Rishi and Fatch def. Tom and Topsy 6–0 6:2',                    // en dash, colon
    'Rishi Fatch v Tom Topsy 6-0 6-2',                               // no partner separators
    'Tom Topsy v Rishi Fatch 0-6 2-6',                               // winner from the sets
    '6-0 6-2 Rishi & Fatch vs Tom & Topsy',                          // scores first
    'Rishi & Fatch (W) v Tom & Topsy 6-0 6-2',
    'Tom & Topsy v Rishi & Fatch 🏆 0-6 2-6',
  ].forEach((t) => {
    const r = read(t);
    assert.ok(r.ok, `${JSON.stringify(t)}: ${r.problems.join('; ')}`);
    assert.deepStrictEqual(core(r), SAME, JSON.stringify(t));
  });
});

test('dates: WhatsApp timestamps, day/month, "yesterday", a weekday', () => {
  assert.strictEqual(read('[26/10/2026, 21:03:12] Jords: Rishi & Fatch won 6-0 6-2 vs Tom & Topsy').date, '2026-10-26');
  assert.strictEqual(read('26/10/2026, 21:03 - Jords: Rishi & Fatch beat Tom & Topsy 6-0 6-2').date, '2026-10-26');
  assert.strictEqual(read('26/10 Rishi & Fatch beat Tom & Topsy 6-0 6-2').date, '2026-10-26');
  assert.strictEqual(read('Rishi & Fatch beat Tom & Topsy 6-0 6-2 on 26th Oct').date, '2026-10-26');
  assert.strictEqual(read('Rishi & Fatch beat Tom & Topsy 6-0 6-2 yesterday').date, '2026-10-26');
  assert.strictEqual(read('Sunday: Rishi & Fatch beat Tom & Topsy 6-0 6-2').date, '2026-10-25');
  // A date is never read as a set.
  assert.deepStrictEqual(read('26/10/2026 Rishi & Fatch beat Tom & Topsy 6-0 6-2').sets, [[6, 0], [6, 2]]);
  assert.strictEqual(read('Rishi & Fatch beat Tom & Topsy 6-0 6-2').date, null);
});

test('three sets, tiebreaks, slashes, singles, "me"', () => {
  assert.deepStrictEqual(read('Rishi & Fatch v Tom & Topsy 6-4 3-6 10-8').sets, [[6, 4], [3, 6], [10, 8]]);
  assert.deepStrictEqual(read('Me & PDM beat Max & KC 7-6(5) 6-4').sets, [[7, 6], [6, 4]]);
  assert.deepStrictEqual(read('Me & PDM beat Max & KC 7-6(5) 6-4').winners, ['Shaun', 'PDM']);
  assert.deepStrictEqual(core(read('Ant Slice & Antz v Len & Jords 6/4 6/3')), { winners: ['Ant Slice', 'Antz'], losers: ['Len', 'Jords'], sets: [[6, 4], [6, 3]], isDraw: false, isSingles: false });
  assert.deepStrictEqual(core(read('Shaun v Tom 3-6 2-6')), { winners: ['Tom'], losers: ['Shaun'], sets: [[6, 3], [6, 2]], isDraw: false, isSingles: true });
});

test('draws: said in words, or sets level with no winner named', () => {
  const said = read('Rishi & Fatch drew with Tom & Topsy 6-4 4-6 (ran out of time)');
  assert.strictEqual(said.isDraw, true);
  assert.deepStrictEqual(said.sets, [[6, 4], [4, 6]]);
  const level = read('Rishi & Fatch vs Tom & Topsy\n6-4 4-6');
  assert.strictEqual(level.isDraw, true);
  assert.ok(level.notes.some((n) => /not finished/.test(n)));
});

test('names: the club\'s spelling; a guess is said; ambiguity and strangers are flagged', () => {
  const r = read('rishi fatch tom topsy 6-3 6-4');
  assert.deepStrictEqual(r.winners, ['Rishi', 'Fatch']);
  assert.ok(r.warnings.some((w) => /No "vs".*Rishi & Fatch against Tom & Topsy/.test(w)), 'an assumed split is said');
  const amb = read('Ant & Rishi v Tom & Topsy 6-3 6-3');
  assert.strictEqual(amb.ok, false, 'an ambiguous name must be picked, not guessed');
  assert.match(amb.problems.join(' '), /"Ant" could be Ant Slice or Ant Slicer or Antz/);
  const stranger = read('Rishi & Fatch beat Tom & Big Dave 6-0 6-2');
  assert.strictEqual(stranger.ok, true);
  assert.deepStrictEqual(stranger.losers, ['Tom', 'Big Dave']);
  assert.ok(stranger.warnings.some((w) => /"Big Dave" isn't a club player yet/.test(w)));
});

test('what it cannot read, it says -- and never invents a game', () => {
  assert.match(read('Rishi & Fatch 6-0 6-2').problems.join(' '), /Only one team found/);
  assert.match(read('Rishi & Fatch beat Tom & Topsy').problems.join(' '), /No set scores/);
  assert.match(read('Rishi & Fatch beat Tom & Topsy 6-0 6-2\nMax & KC beat Len & Jords 6-4 6-4').problems.join(' '), /2 results/);
  assert.match(read('Rishi & Tom beat Tom & Topsy 6-0 6-2').problems.join(' '), /Tom is on the court twice/);
  assert.match(read('').problems.join(' '), /Paste or type/);
  assert.strictEqual(read('Rishi & Fatch beat Tom & Topsy 6-0 6-2').ok, true);
});

maybe('in the app: a pasted result fills the form, says how it was read, and an Admin-added player keeps their tier', async () => {
  const app = await H.open({ viewport: { width: 390, height: 844 }, now: '2026-09-21T10:00:00.000Z' });
  try {
    const r = await app.run(async () => {
      const [a, b, c, d] = PLAYERS.filter((p) => p.active).slice(0, 4).map((p) => p.name);
      tagOverridesState.Newbie = { tier: 'C', active: true };   // added in Admin, not played yet
      document.querySelector('#tabrow .tab-btn[data-tab="games"]').click();
      const box = document.getElementById('agQuickPaste');
      box.value = `${c.toLowerCase()}/Newbie lost to ${a} and ${b} 6-3, 6-4 yesterday`;
      document.getElementById('agQuickParse').click();
      const val = (id) => document.getElementById(id).value;
      return {
        expect: [a, b, c],
        fields: [val('agA1'), val('agA2'), val('agB1'), val('agB2')],
        sets: addGameSets.map((s) => [s.w, s.l]),
        date: val('agDate'),
        read: document.getElementById('agQuickMessage').innerText,
        newTierPicker: document.querySelectorAll('.ag-new-tier').length,
      };
    });
    assert.deepStrictEqual(r.fields, [r.expect[0], r.expect[1], r.expect[2], 'Newbie']);
    assert.deepStrictEqual(r.sets, [['6', '3'], ['6', '4']]);
    assert.strictEqual(r.date, '2026-09-20');
    assert.match(r.read, new RegExp(`${r.expect[0]} & ${r.expect[1]} beat ${r.expect[2]} & Newbie · 6-3, 6-4`));
    assert.match(r.read, /Filled in below — check it, then Submit/);
    assert.strictEqual(r.newTierPicker, 0, 'a player given a tier in Admin is not asked for one again');
    assert.deepStrictEqual(app.pageErrors, []);
  } finally { await app.close(); }
});
