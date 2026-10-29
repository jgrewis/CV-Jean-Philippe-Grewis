// Fabrique d'elements SVG partagee (lignes de l'intro, lignes topographiques de
// fond, monogramme, fleches) : un seul endroit connait l'espace de noms SVG.

export const SVG_NS = 'http://www.w3.org/2000/svg';

export function createSvgElement(tag, attributes = {}) {
  const el = document.createElementNS(SVG_NS, tag);
  Object.entries(attributes).forEach(([name, value]) => el.setAttribute(name, value));
  return el;
}
