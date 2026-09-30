#!/usr/bin/env node
// Stamp the deployed build into assets/js/buildInfo.js on hosts that do not run
// Jekyll. Vercel is the primary host (30 Sep 2026), so this is the canonical
// deployment stamp -- for production (main) and every preview deployment of a
// branch alike, each stamped with its own commit.
//
//   node scripts/stamp-build.js     # run by Vercel as the build command (vercel.json)
//
// GitHub Pages, kept only while it still exists, stamps the build itself: its Jekyll run renders
// assets/js/buildInfo.pages.js over the placeholder with the commit it is
// building (see _config.yml). Vercel runs no Jekyll, so without this it would
// serve the committed placeholder and every device would say "local build".
// This writes the same one line the Pages template produces, from the commit
// the host says it is deploying, so the foot of Admin / Manage reads the same
// on either host.
//
// The same rules as the Pages stamp:
//   - the SHA comes from the deploy itself (VERCEL_GIT_COMMIT_SHA), never from
//     a hand-kept constant and never fetched at run time;
//   - the date is when the build ran, in the club's time zone (Europe/London),
//     exactly as _config.yml sets it for Pages;
//   - no believable SHA, no stamp: the placeholder is left alone and the app
//     honestly says "local build". A deploy is never failed over its stamp.
//
// It refuses to write without a deploy SHA, so running it on a laptop can
// never plant a SHA in the committed placeholder.

const fs = require('fs');
const path = require('path');

const TARGET = path.join('assets', 'js', 'buildInfo.js');
const TIME_ZONE = 'Europe/London';

// Where each host puts the commit it is deploying. Vercel first; the generic
// name lets any other static host or CI opt in without a code change.
const SHA_VARS = ['VERCEL_GIT_COMMIT_SHA', 'MP_BUILD_SHA'];

function deploySha(env) {
  for (const name of SHA_VARS) {
    const v = String((env || {})[name] || '').trim();
    if (/^[0-9a-f]{7,40}$/i.test(v)) return { sha: v.toLowerCase(), source: name };
  }
  return null;
}

// "YYYY-MM-DD" for the club's calendar day at `now`. en-CA formats as ISO.
function clubDate(now) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: TIME_ZONE, year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(now);
}

// The line the app loads -- the same shape buildInfo.pages.js renders to.
function stampSource(sha, date) {
  return `window.MP_BUILD = { sha: "${sha}", date: "${date}" };\n`;
}

// Returns what it did, so the build log and the tests can both say so.
function run({ root, env, now }) {
  const found = deploySha(env);
  if (!found) {
    return { written: false, reason: `no deploy SHA in ${SHA_VARS.join(' or ')}; placeholder left as it is` };
  }
  const date = clubDate(now || new Date());
  fs.writeFileSync(path.join(root, TARGET), stampSource(found.sha, date));
  return { written: true, sha: found.sha, date, source: found.source };
}

if (require.main === module) {
  const r = run({ root: path.join(__dirname, '..'), env: process.env, now: new Date() });
  console.log(r.written
    ? `build stamp: ${r.sha.slice(0, 7)} · ${r.date} (from ${r.source}) -> ${TARGET}`
    : `build stamp: ${r.reason}`);
}

module.exports = { run, deploySha, clubDate, stampSource, SHA_VARS, TARGET, TIME_ZONE };
