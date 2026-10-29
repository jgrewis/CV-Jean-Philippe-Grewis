// Monogramme "JPG" pixel, partage entre l'intro (introLogo.js) et la barre fixe
// de la page : une seule definition des glyphes.
//
// Dessine sur une grille de 22 x 10 unites : futs de 2 unites, lettres separees
// de 2 unites. Les coins exterieurs des courbes sont "arrondis" par une marche
// d'une unite (une demi-epaisseur), comme un pixel retire : c'est ce qui donne le
// caractere pixel sans perdre la lisibilite. Traces orthogonaux d'un seul tenant
// (pas de rectangles juxtaposes) : aucune couture d'anticrenelage.
import { createSvgElement } from './svg.js';

export const GLYPHS_VIEWBOX = '0 0 22 10';
const GLYPH_PATHS = [
  // J : fut a droite, crochet en bas, ergot a gauche.
  'M3 0H5V9H4V10H1V9H0V6H2V8H3Z',
  // P : fut + panse de 6 x 6, contre-forme de 2 x 2 (evenodd).
  'M7 0H12V1H13V5H12V6H9V10H7Z M9 2V4H11V2Z',
  // G : barre haute, fut gauche, barre basse, fut droit et eperon a mi-hauteur.
  'M16 0H22V2H17V8H20V6H19V4H22V9H21V10H16V9H15V1H16Z',
];

export function appendGlyphs(parent) {
  GLYPH_PATHS.forEach((d) => {
    parent.append(createSvgElement('path', { d, fill: 'currentColor', 'fill-rule': 'evenodd' }));
  });
}

/** SVG du monogramme nu, decoratif (aria-hidden) : le nom accessible est porte ailleurs. */
export function createMonogramSvg(className) {
  const svg = createSvgElement('svg', {
    viewBox: GLYPHS_VIEWBOX,
    class: className,
    focusable: 'false',
    'aria-hidden': 'true',
  });
  appendGlyphs(svg);
  return svg;
}
