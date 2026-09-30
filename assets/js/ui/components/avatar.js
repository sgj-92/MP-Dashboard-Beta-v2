// ===================== UI: AVATAR INITIALS =====================
// Initials for the player avatars (Home, Directory).
//
// Extracted from shell.js unchanged (docs/architecture/PARALLEL_DEVELOPMENT_SPLIT.md).
// Owning stream: redesign. Loads before app.js; declarations only.

function initials(name){
  return name.split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2);
}
