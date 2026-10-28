// Lignes de fond de l'intro (tache T3) : grandes courbes qui rappellent les
// branches de la carte mentale. Elles partent des bords et des coins de l'ecran,
// vont vers le centre sans l'atteindre, et glissent en place pendant
// --intro-lines-dur (voir styles/intro-lines.css pour l'animation).
//
// Contrat avec Intro.js : mountIntroLines(container) est appele AVANT l'insertion
// du calque dans le DOM, donc aucune mesure d'element n'est possible. On s'appuie
// sur la taille de la fenetre (window.innerWidth/innerHeight), disponible a tout
// instant : le viewBox du SVG est en pixels ecran (echelle 1:1), si bien que les
// cercles restent ronds et que le trait de 1 px reste net, sans etirement ni
// recadrage "slice" qui pousserait des traces dans la zone du logo en portrait.

const SVG_NS = 'http://www.w3.org/2000/svg';

// Les points des courbes sont exprimes en fractions de l'ecran (0 = bord gauche /
// haut, 1 = bord droit / bas), puis convertis en pixels. Les departs depassent
// des bords (valeurs < 0 ou > 1) : le glissement de l'ensemble ne laisse ainsi
// jamais apparaitre le debut d'un trace au milieu de l'ecran.
//
// Zone centrale libre (logo + nom) : x de 0.30 a 0.70, y de 0.35 a 0.65.
// Aucune extremite interieure n'y entre ; chaque courbe finit au-dessus ou
// au-dessous, jamais a la hauteur du nom (qui occupe presque toute la largeur
// en portrait).
//   from = depart (hors ecran), c1 / c2 = poignees de Bezier, to = extremite interieure
//   node = true : petit cercle fin a l'extremite, pour evoquer un noeud de carte
const CURVES = [
  // Coin haut-gauche, descend puis se recourbe vers le centre
  { from: [-0.1, 0.1], c1: [0.14, 0.06], c2: [0.2, 0.3], to: [0.33, 0.27], node: true },
  // Bord haut, a droite : une branche qui plonge et revient vers le centre
  { from: [0.76, -0.1], c1: [0.74, 0.14], c2: [0.62, 0.16], to: [0.58, 0.25], node: false },
  // Bord droit, en haut
  { from: [1.1, 0.19], c1: [0.94, 0.2], c2: [0.9, 0.33], to: [0.84, 0.24], node: false },
  // Bord gauche, en bas : grande courbe en S
  { from: [-0.1, 0.8], c1: [0.14, 0.82], c2: [0.18, 0.62], to: [0.28, 0.72], node: true },
  // Coin bas-droit
  { from: [1.1, 0.88], c1: [0.88, 0.9], c2: [0.82, 0.7], to: [0.7, 0.75], node: false },
  // Bord bas, a gauche du centre
  { from: [0.34, 1.1], c1: [0.34, 0.92], c2: [0.46, 0.88], to: [0.5, 0.8], node: false },
];

const NODE_RADIUS = 3.5;
// Echantillons pour estimer la longueur d'une courbe : assez pour une precision
// de l'ordre du pixel, ce qui suffit pour le dessin progressif (dasharray).
const LENGTH_SAMPLES = 24;
// Marge sur la longueur estimee, pour que le trait soit entierement masque
// au depart du dessin malgre l'approximation.
const LENGTH_MARGIN = 1.05;

function createSvgElement(tag, attributes) {
  const el = document.createElementNS(SVG_NS, tag);
  Object.entries(attributes).forEach(([name, value]) => el.setAttribute(name, value));
  return el;
}

function toPixels(point, width, height) {
  return [point[0] * width, point[1] * height];
}

function bezierPoint(p0, p1, p2, p3, t) {
  const u = 1 - t;
  const a = u * u * u;
  const b = 3 * u * u * t;
  const c = 3 * u * t * t;
  const d = t * t * t;
  return [
    a * p0[0] + b * p1[0] + c * p2[0] + d * p3[0],
    a * p0[1] + b * p1[1] + c * p2[1] + d * p3[1],
  ];
}

// getTotalLength() n'est pas fiable sur un SVG hors du DOM : on estime la
// longueur en sommant des segments le long de la courbe.
function estimateLength(p0, p1, p2, p3) {
  let length = 0;
  let previous = p0;
  for (let i = 1; i <= LENGTH_SAMPLES; i += 1) {
    const point = bezierPoint(p0, p1, p2, p3, i / LENGTH_SAMPLES);
    length += Math.hypot(point[0] - previous[0], point[1] - previous[1]);
    previous = point;
  }
  return length * LENGTH_MARGIN;
}

function drawCurves(svg, width, height) {
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  svg.replaceChildren();

  CURVES.forEach((curve) => {
    const p0 = toPixels(curve.from, width, height);
    const p1 = toPixels(curve.c1, width, height);
    const p2 = toPixels(curve.c2, width, height);
    const p3 = toPixels(curve.to, width, height);
    const coords = [p0, p1, p2, p3].map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`);

    const path = createSvgElement('path', {
      class: 'intro__line',
      d: `M ${coords[0]} C ${coords[1]}, ${coords[2]}, ${coords[3]}`,
      'vector-effect': 'non-scaling-stroke',
    });
    path.style.setProperty('--len', estimateLength(p0, p1, p2, p3).toFixed(0));
    svg.appendChild(path);

    if (curve.node) {
      svg.appendChild(
        createSvgElement('circle', {
          class: 'intro__node',
          cx: p3[0].toFixed(1),
          cy: p3[1].toFixed(1),
          r: NODE_RADIUS,
          'vector-effect': 'non-scaling-stroke',
        }),
      );
    }
  });
}

export function mountIntroLines(container) {
  const svg = createSvgElement('svg', {
    class: 'intro__lines-svg',
    'aria-hidden': 'true',
    focusable: 'false',
  });
  container.appendChild(svg);

  const render = () => drawCurves(svg, window.innerWidth, window.innerHeight);
  render();

  // Si la fenetre change de taille pendant l'intro (rotation d'un mobile), on
  // retrace les courbes : le viewBox suit l'ecran. Les animations CSS sont portees
  // par les classes, elles ne repartent pas.
  window.addEventListener('resize', render);
  return () => window.removeEventListener('resize', render);
}
