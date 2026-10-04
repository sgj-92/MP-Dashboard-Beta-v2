// ===================== PREDICT A MATCHUP =====================
// Admin's matchup tool, opened from the top of More (Admin only -- Shaun,
// 21 Sep and 4 Oct: players agree a game first, then send him the four names;
// exposing predictions would let people dodge or cherry-pick games).
//
// Pick the sides and the answer is a Matchup Card that is already share-ready:
// the two teams, the call ("Projected favourites: …" / "Slight edge: …" /
// "Too close to call"), and the expected games each side takes in a typical
// match. Share matchup sends the same card as a picture (CardPainter.matchup)
// to the phone's share sheet; Copy image puts it on the clipboard where the
// browser allows, and copies the card as text where it does not. The screen
// adds a little more than the picture: each player's rating and the rating
// edge. "Add to Upcoming" is unchanged (predictionCard.js).
//
// The prediction is predictMatchup() -> MatchPrediction.build, untouched; the
// card is MatchupCard.build. Nothing is recorded.
//
// Owning stream: functional (the card look is the redesign's to restyle).
// Loads before app.js; declarations only.

let predictShare = { key: null, ready: null, message: '' };

// The club's typical match, in games: the median total of every decided
// approved match. A draw ended early, so it is no guide to a match's length.
function typicalMatchGames(){
  const totals = getAllApprovedMatches().filter(m => !m.isDraw)
    .map(m => (m.sets || []).reduce((s, x) => s + (Number(x[0]) || 0) + (Number(x[1]) || 0), 0))
    .filter(t => t > 0).sort((a, b) => a - b);
  if(!totals.length) return null;
  const mid = Math.floor(totals.length / 2);
  return totals.length % 2 ? totals[mid] : Math.round((totals[mid - 1] + totals[mid]) / 2);
}

function matchupCardFor(pred){
  return MatchupCard.build(pred, {
    tierOf: (n) => { const p = PLAYERS.find(x => x.name.toLowerCase() === String(n).toLowerCase()); return p ? p.tier : null; },
    typicalGames: typicalMatchGames(),
  });
}

// The card on screen. `detail` adds what the picture leaves out.
function matchupCardHtml(card, { detail = false } = {}){
  const ratingOf = (n) => { const p = PLAYERS.find(x => x.name.toLowerCase() === String(n).toLowerCase()); return p ? Math.round(p.rating) : null; };
  const team = (players, side) => `<div class="mu-team${card.call.favoured === side ? ' is-favoured' : ''}">${players.map(p =>
    `<span class="mu-player"><span class="mu-name">${escapeHtml(p.name)}</span>${p.tier ? `<span class="mu-tier">${escapeHtml(p.tier)}</span>` : ''}${detail && ratingOf(p.name) !== null ? `<span class="mu-rating">${ratingOf(p.name)}</span>` : ''}</span>`).join('<span class="mu-amp">&amp;</span>')}</div>`;
  const label = (players) => players.map(p => escapeHtml(p.name)).join(' & ');
  return `<div class="mu-card" id="matchupCard" data-call="${card.call.kind}">
    <div class="mu-eyebrow">Predicted matchup</div>
    ${team(card.teamA, 'A')}
    <div class="mu-vs">vs</div>
    ${team(card.teamB, 'B')}
    <div class="mu-call">
      <div class="mu-call-kicker">${escapeHtml(card.call.kicker)}</div>
      ${card.call.names ? `<div class="mu-call-names">${escapeHtml(card.call.names)}</div>` : ''}
    </div>
    ${card.games ? `<div class="mu-games">
      <div class="mu-games-label">Expected games won</div>
      <div class="mu-games-row">
        <div class="mu-games-side"><div class="mu-games-num">${card.games.a}</div><div class="mu-games-who">${label(card.teamA)}</div></div>
        <div class="mu-games-dash">–</div>
        <div class="mu-games-side"><div class="mu-games-num">${card.games.b}</div><div class="mu-games-who">${label(card.teamB)}</div></div>
      </div>
      <div class="mu-games-note">${escapeHtml(card.gamesNote)}</div>
    </div>` : ''}
    ${detail ? `<div class="mu-detail">${card.share.a}% – ${card.share.b}% of the games${card.call.kind === 'level' ? ' · level on current ratings' : ` · favoured by ${card.gap} rating point${card.gap === 1 ? '' : 's'}`}</div>` : ''}
    <div class="mu-foot">${escapeHtml(card.foot)}</div>
  </div>`;
}

function predictShareKey(pred){ return pred ? pred.teamA.join('&') + '|' + pred.teamB.join('&') : null; }

function predictActionsHtml(pred){
  const mine = predictShare.key === predictShareKey(pred);
  return `<div id="predActions"><div class="mu-actions">
    <button type="button" class="mu-action mu-action-primary" id="predShare">${mine && predictShare.ready ? 'Tap to share' : 'Share matchup'}</button>
    <button type="button" class="mu-action" id="predCopy">Copy image</button>
  </div>
  <div class="mu-message" id="predShareMessage">${mine ? escapeHtml(predictShare.message) : ''}</div></div>`;
}

// Only the buttons and their message are redrawn after a share or a copy, so
// anything typed into "Add to Upcoming" below stays put.
function renderPredictActions(){
  const el = document.getElementById('predActions');
  if(!el || !predictionDraft || !predictionDraft.ok) return;
  el.outerHTML = predictActionsHtml(predictionDraft);
  wirePredictActions();
}
function wirePredictActions(){
  const share = document.getElementById('predShare');
  const copy = document.getElementById('predCopy');
  if(share) share.onclick = () => sharePredictedMatchup(renderPredictActions);
  if(copy) copy.onclick = () => copyPredictedMatchup(renderPredictActions);
}

async function predictPicture(pred){
  const card = matchupCardFor(pred);
  const brand = await CardPainter.loadImage('assets/brand/mp-mark.svg');
  const cv = CardPainter.matchup(card, { brand });
  const slug = (team) => team.join('-').replace(/[^A-Za-z0-9-]+/g, '');
  return { card, cv, name: `money-padel-matchup-${slug(pred.teamA)}-vs-${slug(pred.teamB)}.png` };
}

// Share matchup: the picture through the share sheet (WhatsApp is on it), or
// saved where a browser cannot share files -- the Match Result Card's path.
async function sharePredictedMatchup(redraw){
  const pred = predictionDraft;
  if(!pred || !pred.ok || !canSeePredictions()) return;
  const key = predictShareKey(pred);
  if(predictShare.key !== key) predictShare = { key, ready: null, message: '' };
  const say = (m) => { predictShare.message = m; if(redraw) redraw(); };
  try {
    let pending = predictShare.ready;
    if(!pending){
      const { card, cv, name } = await predictPicture(pred);
      pending = { files: [await CardPainter.toFile(cv, name)], meta: { title: 'Predicted matchup', text: MatchupCard.summaryText(card) } };
    }
    const outcome = await CardPainter.share(pending.files, pending.meta);
    predictShare.ready = outcome === 'ready' ? pending : null;
    say(outcome === 'shared' ? 'Shared.' : outcome === 'saved' ? 'Saved to this device — post it from your photos.' : '');
  } catch(e){
    predictShare.ready = null;
    say('Could not make the picture: ' + (e && e.message ? e.message : String(e)));
  }
}

// Copy image: the picture onto the clipboard, ready to paste into WhatsApp
// (Chrome, Edge, Safari and Android Chrome allow it). The clipboard is asked
// for straight away, with the picture still being painted, so Safari still
// counts it as part of the tap. Where images cannot be copied, the card is
// copied as text instead, and the message says so.
async function copyPredictedMatchup(redraw){
  const pred = predictionDraft;
  if(!pred || !pred.ok || !canSeePredictions()) return;
  const key = predictShareKey(pred);
  if(predictShare.key !== key) predictShare = { key, ready: null, message: '' };
  const say = (m) => { predictShare.message = m; if(redraw) redraw(); };
  const picture = predictPicture(pred);
  const canCopyImage = typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.write
    && typeof ClipboardItem !== 'undefined';
  if(canCopyImage){
    try {
      const blob = picture.then(p => CardPainter.toBlob(p.cv));
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
      say('Image copied — paste it into WhatsApp.');
      return;
    } catch(e){ /* falls through to text */ }
  }
  const { card } = await picture;
  const ok = await copyText(MatchupCard.summaryText(card));
  say(ok ? 'This browser can’t copy pictures, so the matchup was copied as text. Use Share matchup for the picture.' : 'Could not copy — use Share matchup instead.');
}

function renderPredictBody(){
  const body = document.getElementById('predictModalBody');
  if(!body) return;
  if(!canSeePredictions()){ body.innerHTML = ''; return; }
  body.innerHTML = `<div class="section-sub" style="font-size:11.5px; margin-bottom:10px;">Pick the sides. The card is ready to share with the group. Admin only — nothing is recorded.</div>
    <div class="fg-controls mu-form">
      <div class="fg-row"><label class="fg-label">Team A</label>
        <input id="predA1" list="playerNamesList" class="fg-select" placeholder="Player name" style="margin-bottom:6px;" value="${predDraftName('teamA',0)}" />
        <input id="predA2" list="playerNamesList" class="fg-select" placeholder="Partner (optional)" value="${predDraftName('teamA',1)}" />
      </div>
      <div class="fg-row"><label class="fg-label">Team B</label>
        <input id="predB1" list="playerNamesList" class="fg-select" placeholder="Player name" style="margin-bottom:6px;" value="${predDraftName('teamB',0)}" />
        <input id="predB2" list="playerNamesList" class="fg-select" placeholder="Partner (optional)" value="${predDraftName('teamB',1)}" />
      </div>
    </div>
    <div id="predResult"></div>`;
  ['predA1','predA2','predB1','predB2'].forEach(id => body.querySelector('#' + id).addEventListener('input', renderPredictResult));
  renderPredictResult();
}

function renderPredictResult(){
  const box = document.getElementById('predResult');
  if(!box) return;
  const val = (id) => (document.getElementById(id) || {}).value || '';
  const teamA = [val('predA1').trim(), val('predA2').trim()].filter(Boolean);
  const teamB = [val('predB1').trim(), val('predB2').trim()].filter(Boolean);
  if(!teamA.length || !teamB.length){ box.innerHTML = ''; predictionDraft = null; return; }
  const pred = predictMatchup(teamA, teamB);
  if(!pred.ok){
    predictionDraft = null;
    box.innerHTML = `<div class="section-sub" style="color:var(--red);">${escapeHtml(pred.reason)}</div>`;
    return;
  }
  // Kept so Share, Copy and "Add to Upcoming" carry these four players
  // straight through rather than asking for them again.
  predictionDraft = pred;
  box.innerHTML = matchupCardHtml(matchupCardFor(pred), { detail: true }) + predictActionsHtml(pred) + buildPredictionToUpcomingHtml(pred);
  wirePredictActions();
  wirePredictionToUpcoming(box, renderPredictResult);
}

function openPredictMatchup(){
  // Admin only, whatever route asked.
  if(!canSeePredictions()) return;
  let modal = document.getElementById('predictModal');
  if(!modal){
    modal = document.createElement('div');
    modal.className = 'shell-more-sheet';
    modal.id = 'predictModal';
    modal.innerHTML = `<div class="shell-more-panel mu-panel">
      <div class="msc-title-row"><h3>Predict a Matchup</h3><button type="button" class="msc-close" data-predict-close aria-label="Close">✕</button></div>
      <div id="predictModalBody"></div>
    </div>`;
    document.body.appendChild(modal);
    modal.addEventListener('click', (e) => {
      if(e.target === modal || (e.target.closest && e.target.closest('[data-predict-close]'))) modal.classList.remove('show');
    });
  }
  renderPredictBody();
  modal.classList.add('show');
}
