// Fabrique d'elements HTML : tout le contenu de cv.js passe par textContent,
// jamais par innerHTML, ce qui ferme la porte a toute injection.

/**
 * @param {string} tag
 * @param {object} [options]
 * @param {string} [options.className]
 * @param {string} [options.text]   pose en textContent
 * @param {object} [options.attrs]  attributs (valeurs converties en chaine)
 * @param {Node[]} [options.children]
 */
export function createEl(tag, { className, text, attrs, children } = {}) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (text !== undefined && text !== null) el.textContent = text;
  if (attrs) Object.entries(attrs).forEach(([name, value]) => el.setAttribute(name, String(value)));
  if (children) el.append(...children.filter(Boolean));
  return el;
}

// Lien externe : rel durci (pas d'acces a window.opener, pas de referent complet).
// Ouverture dans le meme onglet : un nouvel onglet impose devrait etre annonce.
export function createExternalLink(url, label, className) {
  return createEl('a', {
    className,
    text: label,
    attrs: { href: url, rel: 'noopener noreferrer' },
  });
}
