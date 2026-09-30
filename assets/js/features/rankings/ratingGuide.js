// ===================== RANKINGS: ABOUT POWER RANKINGS =====================
// The About sheet. The Power Rating Guide follows (moved from shell.js top level).
//
// Extracted from shell.js (docs/architecture/PARALLEL_DEVELOPMENT_SPLIT.md).
// Owning stream: redesign. Loads before app.js; declarations only.
// Lifted out of shell.js's buildShellDom unchanged. It is still indented as it
// was inside that function, on purpose: its HTML is built from multi-line
// template literals, and re-indenting would change their whitespace.

  // "About Power Rankings" -- reuses the exact methodology text already
  // written for the Rankings "How this works" disclosure (copied once as a
  // static string here, since it's a fixed piece of UI copy, not business
  // logic -- reading the live #explainer element wouldn't be safe, since its
  // content changes to whichever tab was last active).
  const ABOUT_POWER_RANKINGS_TEXT = 'Ratings start from the tier each player is already known to sit in (S highest, C lowest) — the tiers are treated as real signal, not something the model has to rediscover from scratch. From there, results move you based on <b>games won within each match</b>, not just who won — a close 3-set loss barely costs anything, a 6-1 6-2 loss costs a lot. A player with few games stays close to their tier baseline since there isn\'t much evidence yet to move them; a player with a long track record can drift further from it. "Avg opp." is the average strength of everyone you\'ve played with and against. "Clutch %" compares your actual scorelines to what your tier and opponents would predict. "Upset wins/losses" count matches where the underdog won outright (or the favorite lost outright) by a meaningful ratings gap — a fast way to spot giant-killers and upset-prone favorites. Use the min-games filter below to hide anyone with too few games for these numbers to mean much. "Recent Form" sorts by wins over the last 10 games first, then by average overperformance as a tiebreaker — a faster-moving signal than the overall rating, useful for spotting who\'s trending right now.';
  function openAboutPowerRankings(){
    let modal = document.getElementById('aboutModal');
    if(!modal){
      modal = document.createElement('div');
      modal.className = 'shell-more-sheet';
      modal.id = 'aboutModal';
      modal.innerHTML = `<div class="shell-more-panel">
        <h3>About Power Rankings</h3>
        <div id="aboutModalBody" class="section-sub" style="font-size:12.5px; line-height:1.6;">${ABOUT_POWER_RANKINGS_TEXT}</div>
      </div>`;
      document.body.appendChild(modal);
      modal.addEventListener('click', (e)=>{ if(e.target === modal) modal.classList.remove('show'); });
    }
    modal.classList.add('show');
  }

// ---- Power Rating Guide ---------------------------------------------------
// The player-facing explanation of how and why a Power Rating moves.
//
// It exists because the most common reaction to a small movement is that the
// system is broken, and the honest answer -- K falls as evidence builds -- is
// not something anybody should have to infer from a chart. So the guide leads
// with the idea and keeps the arithmetic one tap away, rather than opening on
// a formula.
//
// Every number quoted here is the shipped model, read from the engine's own
// constants where one exists rather than copied into prose that could drift.
// The anchor sentence is Shaun's, verbatim.
const RATING_GUIDE_ANCHOR =
  'The rating is not designed to reward wins. It is designed to update our estimate of playing level.';

function ratingGuideConstants(){
  // Read from the engine, never transcribed. Copy in prose drifts; a constant
  // read at render time cannot describe a model the app is not running.
  const E = (typeof RatingEngine !== 'undefined') ? RatingEngine : null;
  if(!E) return null;
  return {
    kMax: E.KMAX, kMin: E.KMIN, rc: E.RC,
    gameWeight: E.GAME_SHARE_WEIGHT, resultWeight: E.MATCH_RESULT_WEIGHT,
    version: E.RATING_MODEL_VERSION,
  };
}

function buildRatingGuideHtml(){
  const c = ratingGuideConstants();
  // No silent fallback: a guide that described a model the app could not
  // confirm would be worse than no guide.
  if(!c) return `<div class="rg-section" style="color:var(--red);">The rating engine is not loaded, so this guide cannot state the model it is describing. Reload the page.</div>`;
  const kSpan = c.kMax - c.kMin;

  const q = (question, answer) => `<details class="rg-faq">
    <summary class="rg-faq-q">${question}</summary>
    <div class="rg-faq-a">${answer}</div>
  </details>`;

  const concept = (name, what) =>
    `<div class="rg-concept"><span class="rg-concept-name">${name}</span><span class="rg-concept-what">${what}</span></div>`;

  return `
  <div class="rg-anchor">${RATING_GUIDE_ANCHOR}</div>

  <div class="rg-section">
    <div class="rg-h">In short</div>
    <ul class="rg-list">
      <li>Your <b>Power Rating</b> is an estimate of the level you are playing at now. It is not a total of wins and it is not a prize.</li>
      <li>Every rated match compares <b>what was expected of you</b> beforehand with <b>how you actually played</b>, and nudges the estimate toward the truth.</li>
      <li>Winning does not guarantee a rise, and losing does not guarantee a fall. Beating a much stronger pair narrowly can be worth more than brushing aside a much weaker one.</li>
      <li>A favourite who plays roughly as expected moves <b>very little</b> — nothing new was learned.</li>
      <li>An underdog who plays materially better than expected can <b>gain rating in a loss</b>.</li>
      <li>New players, and anyone the club has just reassessed, move <b>faster</b>: there is less evidence behind their number, so each result says more.</li>
      <li>Well-established players move <b>slowly</b>, on purpose. That is the system working, not the system stuck.</li>
      <li>There is <b>one continuous Power Rating</b>. Monthly screens show where it stood at a month's end — nothing is reset, re-solved or started again.</li>
      <li>A <b>club reassessment</b> is a board decision about your level, recorded separately and always labelled as one. It is never a result on court.</li>
    </ul>
  </div>

  <div class="rg-section">
    <div class="rg-h">The five things that sound alike</div>
    ${concept('Power Rating', 'the current estimate of your playing level')}
    ${concept('Reliability', 'how much evidence stands behind that estimate — not how good you are')}
    ${concept('Monthly Performance', 'how far above or below expectation you played in one month')}
    ${concept('League Table', 'results and points — a separate record entirely')}
    ${concept('Tier', 'the club\'s own classification of you, decided by the board')}
    <div class="rg-note">Two of these move on their own and three do not. A high Reliability does not make you better, and a low one does not make you worse: it only says how confident the estimate is.</div>
  </div>

  <details class="rg-fold">
    <summary class="rg-fold-summary"><span class="rg-fold-title">The actual calculation</span><span class="rg-fold-sub">the real formula, not a simplification</span></summary>
    <div class="rg-fold-body">
      <div class="rg-formula">rating change = K × (performance score − expected score)</div>

      <div class="rg-h2">Expected score</div>
      <div class="rg-p">Comes from the four players' Power Ratings as they stood <b>before</b> the match. It is the share of the contest your pairing was expected to take, between 0 and 1. It is fixed at the moment the match is rated and never recalculated afterwards — the expectation shown on a June card is the one the engine actually used in June.</div>

      <div class="rg-h2">Performance score</div>
      <div class="rg-p">${Math.round(c.gameWeight * 100)}% the share of <b>games</b> you won, ${Math.round(c.resultWeight * 100)}% the <b>result</b> itself. Also between 0 and 1. Mostly games, deliberately: a 7-5, 5-7, 7-5 defeat is nothing like a 6-0, 6-1 defeat, and the rating should not pretend otherwise.</div>

      <div class="rg-h2">K — how far one result can move you</div>
      <div class="rg-formula">K = ${c.kMin} + ${kSpan} × (1 − reliability)</div>
      <div class="rg-formula">reliability = e ÷ (e + ${c.rc})</div>
      <div class="rg-p"><code>e</code> is your effective rated evidence — roughly, how many rated matches stand behind your number. K starts near <b>${c.kMax}</b> when there is almost no evidence and falls toward <b>${c.kMin}</b> as evidence builds. It never goes below ${c.kMin}, so nobody's rating is ever frozen.</div>
      <div class="rg-p rg-warn">Reliability is <b>evidence</b>, not skill, and not a probability that your rating is "right". A brand-new player and a long-standing one can be equally good and have completely different reliability.</div>

      <div class="rg-h2">A worked example</div>
      <div class="rg-worked">
        <div class="rg-worked-row"><span>K</span><b>16</b></div>
        <div class="rg-worked-row"><span>expected score</span><b>0.58</b></div>
        <div class="rg-worked-row"><span>performance score</span><b>0.71</b></div>
        <div class="rg-worked-row"><span>difference</span><b>+0.13</b></div>
        <div class="rg-worked-row rg-worked-total"><span>rating change</span><b>16 × 0.13 = +2.1</b></div>
      </div>

      <div class="rg-h2">Why the same performance moves two players differently</div>
      <div class="rg-p">Take two players who both beat their expectation by exactly <b>+0.20</b> in the same match.</div>
      <div class="rg-compare">
        <div class="rg-compare-col">
          <div class="rg-compare-label">Well established</div>
          <div class="rg-compare-detail">reliability 85% · K = ${c.kMin} + ${kSpan} × 0.15 = ${(c.kMin + kSpan * 0.15).toFixed(1)}</div>
          <div class="rg-compare-value">+${((c.kMin + kSpan * 0.15) * 0.20).toFixed(1)} pts</div>
        </div>
        <div class="rg-compare-col">
          <div class="rg-compare-label">Newly reassessed</div>
          <div class="rg-compare-detail">reliability 10% · K = ${c.kMin} + ${kSpan} × 0.90 = ${(c.kMin + kSpan * 0.90).toFixed(1)}</div>
          <div class="rg-compare-value">+${((c.kMin + kSpan * 0.90) * 0.20).toFixed(1)} pts</div>
        </div>
      </div>
      <div class="rg-p">Same match, same performance, same overperformance — and roughly <b>${Math.round(((c.kMin + kSpan * 0.90) / (c.kMin + kSpan * 0.15)) * 10) / 10}×</b> the movement. Neither player played better than the other. The difference is entirely how much the engine already knew about each of them.</div>

      <div class="rg-h2">Two things the formula deliberately does not do</div>
      <div class="rg-p">It does not add points for winning. It does not take the four players' movements from a common pot, either: K is worked out per player, so the four people in one match move by four different amounts and they do not cancel out.</div>
    </div>
  </details>

  <div class="rg-section">
    <div class="rg-h">Questions people actually ask</div>
    ${q('I won — why did I only get +1 or +2?', 'Because you were expected to win, and because your rating is well established. Winning a match you were favoured to win tells the engine nothing it did not already believe, so there is very little to update. A small move after an expected win is the system agreeing with you, not overlooking you.')}
    ${q('I lost — why did my rating go up?', 'Because the rating follows how you played against expectation, not who won. If you were underdogs and took far more of the contest than expected, the estimate of your level goes up even though the match went the other way. The scoreboard is a result; the rating is an estimate.')}
    ${q('Why did my partner move more than me?', 'Because K is worked out per player, from each player\'s own evidence. The two of you were expected to deliver the same thing and delivered the same thing — but if their rating is less established than yours, the same result moves them further. Nothing was taken from you and given to them.')}
    ${q('Why does a new or reassessed player move so much more than me?', 'Their number has little evidence behind it, so each result carries much more weight — K near ' + c.kMax + ' rather than near ' + c.kMin + '. It settles as they play. This is also why a player the board has just reassessed moves quickly for a while afterwards: the reassessment deliberately restarts the evidence.')}
    ${q('Why did my rating jump after a promotion or a reclassification?', 'It did not jump <i>because</i> of the promotion. A tier change on its own moves <b>zero</b> points and zero reliability — it changes who you are ranked against, not what your rating says. What can move your rating on the same day is a separate, explicit board decision recorded alongside it, and your Rating Journey shows it as its own event with its own marker, never as a result on court.')}
    ${q('Do ratings reset every month?', 'No. There is one continuous Power Rating and it never resets. A monthly screen shows where that same rating stood at the end of that month, and the month\'s movement is simply the distance it travelled. Nothing is re-solved for a month and nobody starts a month from their tier\'s baseline.')}
    ${q('My rating barely moves any more. Is it stuck?', 'No — K never falls below ' + c.kMin + ', so every result still counts. What has changed is that your rating now has a lot of evidence behind it, so it takes a run of results rather than a single one to shift it. If you genuinely change level, a sequence of matches will say so.')}
  </div>

  <div class="rg-section rg-closing">
    <div class="rg-h">Where to see this on your own matches</div>
    <div class="rg-p">Open any match on your profile. It shows the ratings each pairing carried in, what was expected of your side, what you actually delivered, your own rating change — and a plain-English <b>"Why your rating moved"</b> built from those same recorded numbers.</div>
    <div class="rg-note">Engine <b>${c.version}</b>. The formulas above are read from the running engine, not written out beside it, so this guide cannot describe a model the app is not using.</div>
  </div>`;
}

function openPowerRatingGuide(){
  let modal = document.getElementById('ratingGuideModal');
  if(!modal){
    modal = document.createElement('div');
    modal.className = 'shell-more-sheet';
    modal.id = 'ratingGuideModal';
    document.body.appendChild(modal);
    modal.addEventListener('click', (e)=>{ if(e.target === modal) modal.classList.remove('show'); });
  }
  modal.innerHTML = `<div class="shell-more-panel rg-panel">
    <h3 style="margin-bottom:4px;">Power Rating Guide</h3>
    <div class="rg-sub">How your rating moves, and why</div>
    ${buildRatingGuideHtml()}
  </div>`;
  modal.classList.add('show');
}
