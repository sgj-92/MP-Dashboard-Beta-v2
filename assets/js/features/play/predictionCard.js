// ===================== PLAY: ADMIN PREDICTION CARD =====================
// The one prediction card (Admin › Predict a Matchup, and the folded prediction
// on an Upcoming game) and Predict -> Add to Upcoming. Admin-only by rule:
// every caller gates on canSeePredictions() (D4). Wording is a share of
// games, never a chance or probability.
//
// Extracted from app.js unchanged (docs/architecture/PARALLEL_DEVELOPMENT_SPLIT.md).
// Owning stream: redesign for presentation; the D4 gate and wording rules are shared contract.

// ===================== PREDICTION: THE ONE CALCULATION, THE ONE CARD =====
// Both screens that show a prediction -- Admin's Predict a Matchup and an
// agreed game in Upcoming -- go through these two functions. The calculation
// is in `matchPrediction.js`; this is the application's side of it: finding a
// player's rating, and saying the answer in the words the club agreed.

// Which Upcoming cards have their prediction open. Not persisted, and keyed by
// request id so opening one does not open the rest.
let upcomingPredictionOpen = {};

// Admin-only, and gated on `isUnlocked` at the moment the card is built -- a
// prediction is a view on how the club rates its players and is not for
// general circulation through the Upcoming list.
function upcomingPredictionHtml(req){
  if(!isUnlocked) return '';
  const [sideA, sideB] = requestTeams(req);
  const open = !!upcomingPredictionOpen[req.id];
  const pred = predictMatchup(sideA, sideB);
  if(!pred.ok) return '';
  return `<button type="button" class="lg-inline-fold request-pred-toggle" data-request-id="${escapeHtml(req.id)}"
      aria-expanded="${open}" aria-controls="pred_${escapeHtml(req.id)}">
      ${open ? 'Hide prediction' : 'Prediction available'}<span class="lg-inline-chev" aria-hidden="true">${open ? '⌄' : '›'}</span>
    </button>`
    + (open ? `<div class="lg-inline-body" id="pred_${escapeHtml(req.id)}">${
        matchPredictionHtml(pred, { foot: 'Based on current Power Ratings · Admin only · Nothing is recorded.' })
      }</div>` : '');
}

// One wiring for the prediction fold, wherever a card is drawn.
function wireRequestPredictions(box){
  box.querySelectorAll('.request-pred-toggle').forEach(btn=>{
    btn.onclick = ()=>{
      const id = btn.dataset.requestId;
      upcomingPredictionOpen[id] = !upcomingPredictionOpen[id];
      renderUpcoming();
    };
  });
}

// The prediction currently on screen in Admin, kept so it can be turned into
// an Upcoming game without naming the same four players again.
let predictionDraft = null;

// The four names themselves survive a redraw in predictScreen.js's batch,
// which is what lets "Add to Upcoming" redraw the sheet and keep the matchup
// on screen with the confirmation that it worked.

// The agreed presentation: expected winning side, expected share of games,
// and a plain sentence of why. Deliberately NOT the technical version it
// replaced -- no blend, no expected-score decimal, no reliability. If this
// card ever needs to say more, it says more in both places at once, because
// there is only one of it.
function matchPredictionHtml(pred, opts){
  const o = opts || {};
  const ratingOf = (n) => {
    const p = PLAYERS.find(x => x.name.toLowerCase() === String(n).toLowerCase());
    return p ? Math.round(p.rating) : '?';
  };
  const nameList = (team) => team.map(n => escapeHtml(n)).join(' & ');
  const ratedList = (team) => team.map(n => `${escapeHtml(n)} (${ratingOf(n)})`).join(' & ');
  const gap = Math.round(pred.gap);

  const verdict = pred.confidence === 'level'
    ? 'Too close to call'
    : `<b>${nameList(pred.favoured)}</b> ${pred.confidence === 'shade' ? 'shade it' : 'should win'}`;
  const edgeLine = pred.confidence === 'level'
    ? 'Level on current ratings.'
    : `Favoured by <b>${gap}</b> rating point${gap === 1 ? '' : 's'}.`;
  const shareLine = pred.confidence === 'level'
    ? `Expected to take about <b>${pred.shareA}%</b> of the games each.`
    : `Expected to win about <b>${pred.favouredShare}%</b> of the games, against <b>${pred.againstShare}%</b>.`;

  // Order is the order the reader asks the questions in: who wins, by how much
  // of the game, who is playing, and how strong the call is.
  return `<div class="matchup-vs" style="margin-top:8px;">
    <div style="font-size:13.5px; color:var(--text);">${verdict}</div>
    <div style="margin-top:6px; font-size:12.5px;">${shareLine}</div>
    <div style="margin-top:8px; font-size:12.5px; color:var(--text-dim);">${ratedList(pred.teamA)} vs ${ratedList(pred.teamB)}</div>
    <div style="margin-top:4px; font-size:12.5px; color:var(--text-dim);">${edgeLine}</div>
    <div style="margin-top:8px; font-size:10.5px; color:var(--text-dim);">${escapeHtml(o.foot || 'Based on current Power Ratings · Prediction only · Nothing is recorded.')}</div>
  </div>`;
}

// Turning a prediction into an agreed game. Admin-only by construction: this
// markup only ever appears inside Predict a Matchup (predictScreen.js), Admin only.
function buildPredictionToUpcomingHtml(pred){
  const names = pred.teamA.concat(pred.teamB);
  // Shown once, by whichever render follows the write, and then gone.
  const message = predictionUpcomingMessage;
  predictionUpcomingMessage = '';
  return `<div class="fg-controls" style="margin-top:8px;">
    <div class="section-sub">Add this matchup to Upcoming — the ${names.length} player${names.length===1?'':'s'} above carry straight over. Anything not settled yet can stay blank and shows as TBC.</div>
    <div class="fg-row"><label class="fg-label">Date</label><input id="predUpDate" type="date" class="fg-select" /></div>
    <div class="fg-row"><label class="fg-label">Time</label><input id="predUpTime" type="time" class="fg-select" /></div>
    <div class="fg-row"><label class="fg-label">Where</label><input id="predUpPlace" class="fg-select" placeholder="Court or venue (optional)" /></div>
    ${courtBookingCheckboxHtml('predUpBooked')}
    <div class="fg-row"><button class="preset-btn" id="predUpAdd" style="width:100%;">+ Add as an agreed game</button></div>
    <div id="predUpMessage" class="section-sub">${escapeHtml(message || '')}</div>
  </div>`;
}

let predictionUpcomingMessage = '';

function wirePredictionToUpcoming(box, after){
  const btn = box.querySelector('#predUpAdd');
  if(!btn) return;
  btn.onclick = async ()=>{
    const msg = box.querySelector('#predUpMessage');
    const pred = predictionDraft;
    if(!pred || !pred.ok){ if(msg) msg.textContent = 'Fill in the matchup first.'; return; }
    const who = requireName();
    if(!who) return;

    // Agreed by an admin, exactly as "add an agreed game" works: there is
    // nobody left to confirm it. Called Out unless the court is booked.
    const booked = !!(box.querySelector('#predUpBooked') || {}).checked;
    const req = FixtureFlow.createAgreed({
      players: pred.teamA.concat(pred.teamB),
      // The sides are the whole point of a predicted matchup, so they are
      // recorded rather than re-derived from the order of the flat list.
      teams: [pred.teamA.slice(), pred.teamB.slice()],
      by: who,
      preferredDate: (box.querySelector('#predUpDate') || {}).value || '',
      preferredTime: (box.querySelector('#predUpTime') || {}).value || '',
      location: ((box.querySelector('#predUpPlace') || {}).value || '').trim(),
      courtBookingMade: booked,
    });
    gameRequestsState.push(req);
    const ok = await saveGameRequests(gameRequestsState);
    if(!ok){
      gameRequestsState.pop();
      if(msg) msg.textContent = storageAvailable()
        ? `Save failed (${lastStorageError || 'unknown error'}) — try again.`
        : `Save failed — this page can't reach shared storage.`;
      return;
    }
    // The prediction itself is not stored. It is recomputed from these same
    // players whenever the Upcoming card asks for it, so it can never go stale
    // against a rating that has since moved.
    predictionUpcomingMessage = `Added to ${booked ? 'Upcoming' : 'Called Out'}: ${pred.teamA.join(' & ')} v ${pred.teamB.join(' & ')}.`;
    dataChanged();
    // The Predict a Matchup sheet is not a tab, so it redraws itself.
    if(after) after();
  };
}
