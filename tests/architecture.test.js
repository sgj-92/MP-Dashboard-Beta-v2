// ===================== ARCHITECTURE: THE PARALLEL-DEVELOPMENT SPLIT =====================
// The application is split so the functional and redesign streams rarely edit
// the same file (docs/architecture/PARALLEL_DEVELOPMENT_SPLIT.md). The split
// rests on a few load-order rules that nothing else enforces -- break one and
// the app throws on load, or quietly renders without a stylesheet. These tests
// are those rules.

const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const { appScriptFiles } = require('./helpers/appSource.js');

const ROOT = path.join(__dirname, '..');
const JS = path.join(ROOT, 'assets', 'js');
const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const scripts = [...html.matchAll(/<script src="assets\/js\/([^"]+)"><\/script>/g)].map((m) => m[1]);
const LAYERED = appScriptFiles().filter((f) => f !== 'app.js' && f !== 'shell.js');
const read = (rel) => fs.readFileSync(path.join(JS, rel), 'utf8');
const DECL = /^(?:async function|function|let|const|var|class)\s+([A-Za-z0-9_$]+)/gm;

test('every layered module is loaded, and before app.js and shell.js', () => {
  const at = (f) => scripts.indexOf(f);
  assert.ok(at('app.js') > 0 && at('shell.js') > at('app.js'));
  LAYERED.forEach((f) => {
    assert.ok(at(f) >= 0, `${f} is not loaded by index.html`);
    assert.ok(at(f) < at('app.js'), `${f} must load before app.js (it only declares; app.js boots)`);
  });
});

test('no two scripts declare the same top-level name', () => {
  // Classic scripts share one global scope: a second `let x` throws, and the
  // whole of the second script never runs.
  const seen = {};
  const dupes = [];
  scripts.forEach((f) => {
    for (const m of read(f).matchAll(DECL)) {
      if (seen[m[1]] && seen[m[1]] !== f) dupes.push(`${m[1]}: ${seen[m[1]]} and ${f}`);
      else seen[m[1]] = f;
    }
  });
  assert.deepStrictEqual(dupes, []);
});

test('nothing reads a later script\'s declaration while loading', () => {
  // A top-level initializer runs as its script loads. If it names a binding a
  // LATER script declares, that binding does not exist yet and the script
  // throws. (It is how CHALLENGE_RESTRICTIONS, built from TIER_ORDER_LIST,
  // came to stay in app.js.) Function values are exempt: they run later.
  const declaredIn = {};
  scripts.forEach((f, i) => { for (const m of read(f).matchAll(DECL)) if (!(m[1] in declaredIn)) declaredIn[m[1]] = i; });
  const forward = [];
  scripts.forEach((f, i) => {
    const lines = read(f).split('\n');
    lines.forEach((l, k) => {
      const m = /^(?:let|const|var)\s+[A-Za-z0-9_$]+\s*=(.*)$/.exec(l);
      if (!m) return;
      const init = [m[1]].concat(lines.slice(k + 1, k + 30)).join('\n')
        .replace(/\/\/.*$/gm, '').split(/;\s*\n/)[0]
        .replace(/'[^'\n]*'|"[^"\n]*"|`[^`]*`/g, '');
      if (/^\s*(\(|function|async)/.test(init) || /=>/.test(init.split('\n')[0])) return;
      for (const id of new Set(init.match(/[A-Za-z_$][\w$]*/g) || [])) {
        if (declaredIn[id] !== undefined && declaredIn[id] > i) forward.push(`${f}:${k + 1} uses ${id} from ${scripts[declaredIn[id]]}`);
      }
    });
  });
  assert.deepStrictEqual(forward, []);
});

test('layered modules only declare; they do not act while loading', () => {
  // app.js boots and shell.js builds the DOM; a module that wired an event or
  // touched the page at load would depend on running after them. The one
  // exception is the Firestore connection, which needs only the SDK in <head>.
  const acting = [];
  LAYERED.forEach((f) => {
    read(f).split('\n').forEach((l, k) => {
      if (/^(document|window)\.|^[A-Za-z_$][\w$]*\s*\(|^(if|for|while)\b/.test(l)) acting.push(`${f}:${k + 1}  ${l.trim()}`);
      if (/^try\b/.test(l) && f !== 'data/firebaseData.js') acting.push(`${f}:${k + 1}  ${l.trim()}`);
    });
  });
  assert.deepStrictEqual(acting, []);
});

test('domain modules are pure: no page, no app state', () => {
  const domain = LAYERED.filter((f) => f.startsWith('domain/'));
  assert.ok(domain.length > 0);
  domain.forEach((f) => {
    const src = read(f).replace(/^\s*\/\/.*$/gm, '');
    ['document.', 'innerHTML', 'getDisplayMatches', 'PLAYERS', 'gamesMonth', 'selectedMonth', 'localStorage', 'firebase']
      .forEach((w) => assert.ok(!src.includes(w), `${f} must not reference ${w}`));
  });
});

test('stylesheets load in the documented cascade order, and every one is loaded', () => {
  const sheets = [...html.matchAll(/<link rel="stylesheet" href="assets\/css\/([^"]+)">/g)].map((m) => m[1]);
  const onDisk = fs.readdirSync(path.join(ROOT, 'assets', 'css'), { recursive: true })
    .filter((f) => f.endsWith('.css')).map((f) => f.split(path.sep).join('/')).sort();
  assert.deepStrictEqual(sheets.slice().sort(), onDisk, 'every stylesheet on disk is loaded, and nothing else');
  const rank = (f) => f === 'tokens.css' ? 0 : f === 'app.css' ? 1 : f === 'components.css' ? 2 : f === 'shell.css' ? 3 : f.startsWith('screens/') ? 4 : 9;
  assert.deepStrictEqual(sheets.map(rank), sheets.map(rank).slice().sort((a, b) => a - b),
    'tokens -> base -> components -> shell -> screens');
  // Screen stylesheets live one folder down: an image path written for
  // assets/css/ would break silently.
  sheets.filter((f) => f.startsWith('screens/')).forEach((f) => {
    const css = fs.readFileSync(path.join(ROOT, 'assets', 'css', f), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
    for (const m of css.matchAll(/url\(\s*["']?([^"')]+)/g)) {
      assert.ok(!m[1].startsWith('../') || m[1].startsWith('../../'), `${f}: ${m[1]} resolves outside assets/`);
    }
  });
});
