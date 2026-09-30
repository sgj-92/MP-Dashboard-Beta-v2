// The application's own scripts, for the source-level guards.
//
// Several tests read the app's source to forbid a shape of code (a truth-test
// form dot, a document delete, a second tierInScope, the Rankings month used
// by another screen). Those rules are about THE APPLICATION, not about two
// particular files: once a screen moves out of app.js into features/, the rule
// must follow it there, or the move silently switches the guard off.
//
// The application scripts are app.js, shell.js and everything under the
// layered folders (bootstrap/, data/, domain/, features/, ui/). The standalone
// calculation modules beside app.js are not included: they have guards of
// their own, and several legitimately contain words these guards forbid in
// screens.

const fs = require('fs');
const path = require('path');

const JS = path.join(__dirname, '..', '..', 'assets', 'js');
const LAYERS = ['bootstrap', 'data', 'domain', 'features', 'ui'];

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? walk(p) : (e.name.endsWith('.js') ? [p] : []);
  }).sort();
}

// Repo-relative-to-assets/js paths, app.js and shell.js first.
function appScriptFiles() {
  const layered = LAYERS.flatMap((d) => walk(path.join(JS, d))).map((p) => path.relative(JS, p));
  return ['app.js', 'shell.js'].concat(layered);
}

function readAppScript(rel) {
  return fs.readFileSync(path.join(JS, rel), 'utf8');
}

// Every application script, concatenated in that order.
function readAllAppSource() {
  return appScriptFiles().map(readAppScript).join('\n');
}

module.exports = { appScriptFiles, readAppScript, readAllAppSource, JS };
