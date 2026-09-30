#!/usr/bin/env node
// Compare two behaviour snapshots (scripts/behaviour-snapshot.js):
//   node scripts/behaviour-diff.js <before.json> <after.json>
// Exit 0 and "IDENTICAL" when every state matches: DOM, every computed style
// of every element, element boxes (sizes only in MODE=content), page width
// and page errors. A state skipped on either side (it needs a function that
// side does not have) is listed, not compared.
const fs = require('fs');
const a = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const b = JSON.parse(fs.readFileSync(process.argv[3], 'utf8'));
let bad = 0;
const skipped = [];
for (const k of Object.keys(a)) {
  const x = a[k], y = b[k];
  if (!y) { console.log(`${k}: missing in B`); bad++; continue; }
  if (x.skipped || y.skipped) { skipped.push(k); continue; }
  // A failed capture proves nothing, even when both sides failed alike.
  if (x.failed || y.failed) { console.log(`${k}: failed A=${x.failed || 'ok'} B=${y.failed || 'ok'}`); bad++; continue; }
  const probs = [];
  if (x.html !== y.html) {
    let i = 0; while (i < x.html.length && x.html[i] === y.html[i]) i++;
    probs.push(`html differs at ${i}: A…${JSON.stringify(x.html.slice(Math.max(0, i - 80), i + 120))}\n      B…${JSON.stringify(y.html.slice(Math.max(0, i - 80), i + 120))}`);
  }
  if (x.styles.length !== y.styles.length) probs.push(`element count ${x.styles.length} vs ${y.styles.length}`);
  else {
    const d = x.styles.map((s, i) => s !== y.styles[i] ? i : -1).filter((i) => i >= 0);
    if (d.length) probs.push(`${d.length} elements differ in computed style/box (first: ${x.ids[d[0]]})`);
  }
  if (x.scrollW !== y.scrollW) probs.push(`scrollWidth ${x.scrollW} vs ${y.scrollW}`);
  if (JSON.stringify(x.errors) !== JSON.stringify(y.errors)) probs.push(`page errors A=${JSON.stringify(x.errors)} B=${JSON.stringify(y.errors)}`);
  if (probs.length) { bad++; console.log(`${k}:\n  ${probs.join('\n  ')}`); }
}
for (const k of Object.keys(b)) if (!a[k]) { console.log(`${k}: missing in A`); bad++; }
if (skipped.length) console.log(`skipped (not comparable): ${skipped.join(', ')}`);
const n = Object.keys(a).length - skipped.length;
console.log(bad ? `\n${bad} state(s) differ` : `IDENTICAL: ${n} states, DOM + computed styles + boxes`);
process.exit(bad ? 1 : 0);
