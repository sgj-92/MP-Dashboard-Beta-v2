// ===================== UI: CLIPBOARD =====================
// Copy text, with the legacy fallback for browsers without the async API.
//
// Extracted from app.js unchanged (docs/architecture/PARALLEL_DEVELOPMENT_SPLIT.md).
// Owning stream: redesign. Loads before app.js; declarations only.

function copyText(text){
  if(navigator.clipboard && navigator.clipboard.writeText){
    return navigator.clipboard.writeText(text).then(()=>true, ()=>legacyCopy(text));
  }
  return Promise.resolve(legacyCopy(text));
}

// Older iOS standalone web apps have no async clipboard.
function legacyCopy(text){
  try {
    const ta = document.createElement('textarea');
    ta.value = text; ta.setAttribute('readonly', '');
    ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    const ok = document.execCommand('copy');
    ta.remove();
    return ok;
  } catch(e){ return false; }
}
