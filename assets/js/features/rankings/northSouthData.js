// ===================== NORTH VS SOUTH: SCORING =====================
// Results and the table for the Box Office Cup exhibition -- separate from
// the rating system entirely. The event and fixtures stay in app.js.
//
// Extracted from app.js unchanged (docs/architecture/PARALLEL_DEVELOPMENT_SPLIT.md).
// Owning stream: functional. Loads before app.js; declarations only.

function getNorthSouthFixtureResult(fx){
  return northSouthResultsState[fx.id] || null;
}

// Winner always gets 3. The losing side gets 1 only if they actually won a
// set -- only possible when the match went one set each and was decided by
// the match tiebreak. A draw (ran out of time, unfinished) is 1 point each.
function scoreNorthSouthFixture(fx){
  const res = getNorthSouthFixtureResult(fx);
  if(!res) return null;
  if(res.status === 'draw') return { northPts:1, southPts:1, northSets:0, southSets:0, winner:null };
  let northSets = 0, southSets = 0;
  (res.sets || []).forEach(([n,s])=>{ if(n>s) northSets++; else if(s>n) southSets++; });
  let winner = null;
  if(northSets>=2 || southSets>=2){
    winner = northSets>southSets ? 'north' : 'south';
  } else if(northSets===1 && southSets===1 && res.matchTiebreak){
    winner = res.matchTiebreak[0]>res.matchTiebreak[1] ? 'north' : 'south';
  }
  if(!winner) return null; // incomplete data (e.g. only one set logged so far) -- not decided yet
  const northPts = winner==='north' ? 3 : (northSets>=1 ? 1 : 0);
  const southPts = winner==='south' ? 3 : (southSets>=1 ? 1 : 0);
  return { northPts, southPts, northSets, southSets, winner };
}

function computeNorthSouthTable(){
  const blank = ()=>({ played:0, won:0, drawn:0, lost:0, setsFor:0, setsAgainst:0, points:0 });
  const table = { north: blank(), south: blank() };
  NORTH_SOUTH_FIXTURES.forEach(fx=>{
    const r = scoreNorthSouthFixture(fx);
    if(!r) return;
    table.north.played++; table.south.played++;
    table.north.setsFor += r.northSets; table.north.setsAgainst += r.southSets;
    table.south.setsFor += r.southSets; table.south.setsAgainst += r.northSets;
    table.north.points += r.northPts; table.south.points += r.southPts;
    if(r.winner==='north'){ table.north.won++; table.south.lost++; }
    else if(r.winner==='south'){ table.south.won++; table.north.lost++; }
    else { table.north.drawn++; table.south.drawn++; }
  });
  return table;
}
