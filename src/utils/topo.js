// Lignes topographiques de fond : quelques "reliefs" faits de courbes de niveau
// fermees, a peine visibles (encre a ~7 %), derriere toute la page.
//
// Le dessin est deterministe (aucun hasard) : meme rendu a chaque visite, et
// aucune dependance a la taille de l'ecran. Le SVG a un viewBox fixe en
// preserveAspectRatio "slice" : il couvre toujours la fenetre a l'echelle
// uniforme (cercles ronds), et vector-effect garde un trait de 1 px net.
// Il est construit une fois : rien a recalculer au redimensionnement.
import { createSvgElement } from './svg.js';

const VIEW_W = 1600;
const VIEW_H = 1000;
const SAMPLES = 64; // points par courbe : assez pour un contour lisse
const TAU = Math.PI * 2;
// Tension de Catmull-Rom convertie en Bezier : 1/6 donne une courbe qui passe
// exactement par les points echantillonnes, sans boucles.
const CATMULL_FACTOR = 1 / 6;
// Les courbes exterieures se deforment un peu plus a chaque rang : un relief
// s'adoucit vers son sommet.
const RING_WOBBLE_GROWTH = 0.04;

// Chaque relief : centre (fraction du viewBox), nombre de courbes, rayon de la
// premiere et ecart entre deux courbes (unites du viewBox), harmoniques de la
// deformation (amplitude, phase) et derive du centre d'une courbe a l'autre, qui
// evite l'effet "cercles concentriques recopies a l'echelle".
// Rayons maximaux choisis pour que deux reliefs ne se chevauchent jamais :
// de vraies courbes de niveau ne se croisent pas.
const RELIEFS = [
  {
    center: [0.15, 0.25],
    rings: 7,
    r0: 40,
    step: 44,
    harmonics: [[0.12, 2, 0.4], [0.07, 3, 1.9], [0.035, 5, 0.7]],
    drift: [5, 3],
  },
  {
    center: [0.85, 0.75],
    rings: 8,
    r0: 40,
    step: 44,
    harmonics: [[0.1, 2, 2.6], [0.08, 3, 0.3], [0.04, 4, 1.2]],
    drift: [-4, -5],
  },
  {
    center: [0.55, -0.05],
    rings: 5,
    r0: 40,
    step: 44,
    harmonics: [[0.14, 2, 1.1], [0.05, 3, 2.4], [0.03, 6, 0.2]],
    drift: [3, 4],
  },
];

function ringPoints(cx, cy, radius, harmonics, growth) {
  const points = [];
  for (let i = 0; i < SAMPLES; i += 1) {
    const angle = (i / SAMPLES) * TAU;
    const wobble = harmonics.reduce(
      (sum, [amplitude, frequency, phase]) => sum + amplitude * growth * Math.sin(frequency * angle + phase),
      0,
    );
    const r = radius * (1 + wobble);
    points.push([cx + r * Math.cos(angle), cy + r * Math.sin(angle)]);
  }
  return points;
}

// Courbe fermee lissee : chaque segment est une Bezier dont les poignees sont
// deduites des points voisins (Catmull-Rom).
function closedPath(points) {
  const n = points.length;
  const fmt = (p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`;
  let d = `M ${fmt(points[0])}`;
  for (let i = 0; i < n; i += 1) {
    const p0 = points[(i - 1 + n) % n];
    const p1 = points[i];
    const p2 = points[(i + 1) % n];
    const p3 = points[(i + 2) % n];
    const c1 = [p1[0] + (p2[0] - p0[0]) * CATMULL_FACTOR, p1[1] + (p2[1] - p0[1]) * CATMULL_FACTOR];
    const c2 = [p2[0] - (p3[0] - p1[0]) * CATMULL_FACTOR, p2[1] - (p3[1] - p1[1]) * CATMULL_FACTOR];
    d += ` C ${fmt(c1)}, ${fmt(c2)}, ${fmt(p2)}`;
  }
  return `${d} Z`;
}

/** SVG decoratif des lignes topographiques (aria-hidden), a placer dans un calque fixe. */
export function createTopoSvg(className) {
  const svg = createSvgElement('svg', {
    class: className,
    viewBox: `0 0 ${VIEW_W} ${VIEW_H}`,
    preserveAspectRatio: 'xMidYMid slice',
    'aria-hidden': 'true',
    focusable: 'false',
  });

  RELIEFS.forEach(({ center, rings, r0, step, harmonics, drift }) => {
    for (let k = 0; k < rings; k += 1) {
      const cx = center[0] * VIEW_W + drift[0] * k;
      const cy = center[1] * VIEW_H + drift[1] * k;
      const growth = 1 + k * RING_WOBBLE_GROWTH;
      svg.append(
        createSvgElement('path', {
          d: closedPath(ringPoints(cx, cy, r0 + step * k, harmonics, growth)),
          'vector-effect': 'non-scaling-stroke',
        }),
      );
    }
  });
  return svg;
}
