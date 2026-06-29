// Echappement HTML partagé pour tout contenu issu de cv.js injecté via innerHTML.
export function escapeHtml(str) {
  return String(str).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}
