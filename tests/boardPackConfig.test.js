// ===================== BOARD PACK: THE STORED CHOICE =====================
// domain/boardPack/boardPackConfig.js: what an admin's month-end Board Pack
// stores -- which modules, in what order, shown how, and their commentary --
// and nothing else. Figures are never stored.

const test = require('node:test');
const assert = require('node:assert');
const BP = require('../assets/js/domain/boardPack/boardPackConfig.js');

const M = '2026-08';
const ids = (c) => c.items.map((it) => it.id);
const at = (c, id) => c.items.findIndex((it) => it.id === id);

test('one document per month, and only a real month', () => {
  assert.strictEqual(BP.storageKey('2026-08'), 'moneypadel_board_pack_2026-08');
  for (const bad of ['all', '2026-13', '2026-8', '', null, undefined]) assert.throws(() => BP.storageKey(bad), String(bad));
});

test('a month with nothing saved starts from the catalogue, every module present once', () => {
  const c = BP.defaultConfig(M);
  assert.deepStrictEqual(ids(c), BP.MODULES.map((m) => m.id));
  assert.deepStrictEqual(c.items.filter((it) => it.enabled).map((it) => it.id), BP.MODULES.filter((m) => m.on).map((m) => m.id));
  assert.deepStrictEqual(c.items[at(c, 'power')].options, { tier: 'all', top: '10' });
  assert.deepStrictEqual([c.updatedAt, c.updatedBy, c.basis], [null, null, null]);
  // No figure anywhere in what would be stored: every option is one of the
  // module's own presentation choices.
  c.items.forEach((it) => Object.entries(it.options).forEach(([k, v]) => assert.ok(BP.BY_ID[it.id].options[k].values.includes(v), `${it.id}.${k}`)));
});

test('the monthly results table and the over-80% list are in every new month\'s pack', () => {
  const c = BP.defaultConfig(M);
  const on = BP.selected(c).map((it) => it.id);
  assert.ok(on.includes('results_table') && on.includes('over_80'));
  assert.deepStrictEqual(c.items[at(c, 'results_table')].options, { sort: 'points', top: 'all' });
  assert.deepStrictEqual(c.items[at(c, 'over_80')].options, { min: '3' });
  assert.deepStrictEqual(BP.BY_ID.results_table.options.sort.values, ['points', 'games', 'difficulty']);
  assert.deepStrictEqual(BP.BY_ID.over_80.options.min.values, ['3', '1', '5']);
});

test('select and deselect keep the module\'s place and options', () => {
  let c = BP.defaultConfig(M);
  const i = at(c, 'league');
  c = BP.setOption(c, i, 'top', '5');
  c = BP.setEnabled(c, i, false);
  assert.strictEqual(c.items[i].enabled, false);
  assert.ok(!BP.selected(c).some((it) => it.id === 'league'));
  c = BP.setEnabled(c, i, true);
  assert.deepStrictEqual([at(c, 'league'), c.items[i].options.top], [i, '5']);
  assert.ok(BP.selected(c).some((it) => it.id === 'league'));
});

test('move up and down, and never past either end', () => {
  let c = BP.defaultConfig(M);
  const first = c.items[0].id, second = c.items[1].id;
  assert.strictEqual(BP.move(c, 0, -1), c, 'the first cannot go up');
  assert.strictEqual(BP.move(c, c.items.length - 1, 1), c, 'the last cannot go down');
  c = BP.move(c, 1, -1);
  assert.deepStrictEqual([c.items[0].id, c.items[1].id], [second, first]);
  c = BP.move(c, 0, 1);
  assert.deepStrictEqual([c.items[0].id, c.items[1].id], [first, second]);
});

test('options are presentation only, and only the ones a module offers', () => {
  let c = BP.defaultConfig(M);
  const i = at(c, 'rating_movers');
  c = BP.setOption(c, i, 'show', 'fallers');
  assert.strictEqual(c.items[i].options.show, 'fallers');
  assert.strictEqual(BP.setOption(c, i, 'show', 'everyone'), c, 'an unknown value is refused');
  assert.strictEqual(BP.setOption(c, i, 'tier', 'A'), c, 'an option the module does not have is refused');
  assert.strictEqual(BP.setOption(c, at(c, 'overview'), 'top', '3'), c);
  assert.strictEqual(BP.limit('all'), Infinity);
  assert.strictEqual(BP.limit('5'), 5);
});

test('commentary: added, edited, moved and removed like any section, and marked as a note', () => {
  let c = BP.defaultConfig(M);
  c = BP.addNote(c, { id: 'n1', title: 'Chair’s note', body: 'A strong month.\nMore courts in October.' });
  const i = c.items.length - 1;
  assert.deepStrictEqual(c.items[i], { kind: 'note', id: 'n1', title: 'Chair’s note', body: 'A strong month.\nMore courts in October.' });
  c = BP.move(c, i, -(i));
  assert.strictEqual(c.items[0].id, 'n1');
  c = BP.updateNote(c, 0, { body: 'Edited' });
  assert.deepStrictEqual([c.items[0].title, c.items[0].body], ['Chair’s note', 'Edited']);
  assert.strictEqual(BP.selected(c)[0].kind, 'note');
  assert.strictEqual(BP.removeNote(c, at(c, 'league')), c, 'a module is switched off, not removed');
  assert.strictEqual(BP.setEnabled(c, 0, false), c, 'a note is not switched off, it is removed');
  c = BP.removeNote(c, 0);
  assert.ok(!c.items.some((it) => it.kind === 'note'));
  const long = BP.addNote(c, { id: 'n2', title: 'x'.repeat(500), body: 'y'.repeat(9000) }).items.at(-1);
  assert.deepStrictEqual([long.title.length, long.body.length], [BP.NOTE_TITLE_MAX, BP.NOTE_BODY_MAX]);
});

test('what is stored reads back as the same pack', () => {
  let c = BP.defaultConfig(M);
  c = BP.setEnabled(c, at(c, 'overview'), false);
  c = BP.move(c, at(c, 'merit'), -3);
  c = BP.setOption(c, at(c, 'race'), 'provisional', 'show');
  c = BP.addNote(c, { id: 'n1', title: 'T', body: 'B' });
  const saved = BP.forSave(c, { by: 'Shaun', at: '2026-09-30T12:00:00.000Z', basis: { games: 28, fingerprint: 'abc' } });
  const back = BP.normalise(JSON.parse(JSON.stringify(saved)), M);
  assert.deepStrictEqual(back, saved);
  assert.ok(BP.sameChoice(back, c));
  assert.deepStrictEqual([back.updatedBy, back.updatedAt, back.basis], ['Shaun', '2026-09-30T12:00:00.000Z', { games: 28, fingerprint: 'abc' }]);
});

test('reading defensively: wrong month, junk, duplicates, bad options', () => {
  assert.deepStrictEqual(BP.normalise(null, M), BP.defaultConfig(M));
  assert.deepStrictEqual(BP.normalise({ month: '2026-07', items: [] }, M), BP.defaultConfig(M), 'another month’s pack is not this one');
  const c = BP.normalise({ month: M, items: [
    { kind: 'module', id: 'league', enabled: true, options: { top: '7', tier: 'B', colour: 'red' } },
    { kind: 'module', id: 'league', enabled: false },
    null, { kind: 'module' }, { kind: 'banana', id: 'x' },
  ] }, M);
  assert.strictEqual(c.items[0].id, 'league');
  assert.deepStrictEqual(c.items[0].options, { tier: 'B', top: 'all' });
  assert.strictEqual(c.items.filter((it) => it.id === 'league').length, 1);
  assert.strictEqual(c.items.length, BP.MODULES.length);
});

test('extensible: a module added later arrives off, at the end; one this build does not know is kept', () => {
  const stored = BP.defaultConfig(M);
  stored.items = stored.items.filter((it) => it.id !== 'crossovers');
  stored.items.unshift({ kind: 'module', id: 'moment_of_the_month', enabled: true, options: { clip: 'x' } });
  const c = BP.normalise(stored, M);
  assert.deepStrictEqual(c.items.at(-1), { kind: 'module', id: 'crossovers', enabled: false, options: { top: '5' } });
  assert.deepStrictEqual(c.items[0], { kind: 'module', id: 'moment_of_the_month', enabled: true, options: { clip: 'x' } });
  assert.ok(!BP.selected(c).some((it) => it.id === 'moment_of_the_month'), 'but it is not drawn');
});
