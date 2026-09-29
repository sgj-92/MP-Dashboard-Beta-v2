// ===================== BUILD INFO (local placeholder) =====================
// This is NOT the file a deployed device runs.
//
// Every host replaces it at deploy time with the commit being deployed:
//   - GitHub Pages: Jekyll renders assets/js/buildInfo.pages.js to this path,
//     and _config.yml excludes this placeholder so it can never overwrite the
//     stamped copy;
//   - Vercel: vercel.json's build command, scripts/stamp-build.js, rewrites
//     this file in the build's own checkout from VERCEL_GIT_COMMIT_SHA.
// Locally (tests, screenshots, opening index.html from disk) there is no
// build, so Admin / Manage says so rather than inventing one.
//
// Never write a SHA or a date in here by hand: the point of the stamp is that
// nobody maintains it.
window.MP_BUILD = { sha: null, date: null };
