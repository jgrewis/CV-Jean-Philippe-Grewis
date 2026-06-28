// Calcul des positions radiales des noeuds, relatives au centre de la scene.
// Coordonnees en pixels : x vers la droite, y vers le bas. Angle -90deg = haut.

const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
const toRad = (deg) => (deg * Math.PI) / 180;

export function getViewport() {
  return { w: window.innerWidth, h: window.innerHeight };
}

export function computeLayout(branches, viewport = getViewport()) {
  // La vue d'ensemble doit occuper ~70% de la plus petite dimension de l'ecran
  // sur grand ecran, tout en restant compacte et lisible sur mobile (clamp).
  const limiting = Math.min(viewport.w, viewport.h);
  const BRANCH_NODE_OUTER = 80; // demi-largeur de la plus grosse bulle (accent ~146) + marge de flottement
  const targetRadius = limiting * 0.35; // moitie des 70% vises => diametre de l'anneau ~= 70% de l'ecran
  const branchRadius = clamp(targetRadius - BRANCH_NODE_OUTER, 132, 460);
  const leafRadius = clamp(branchRadius * 1.2, 190, 380);

  const startAngle = -90; // premiere branche en haut
  const step = 360 / branches.length;

  const layout = { branches: {}, leaves: {} };

  branches.forEach((branch, i) => {
    const angle = startAngle + i * step;
    const bx = branchRadius * Math.cos(toRad(angle));
    const by = branchRadius * Math.sin(toRad(angle));
    layout.branches[branch.id] = { x: bx, y: by, angle };

    const leaves = branch.leaves || [];
    const n = leaves.length;
    if (n === 0) return;

    // Eventail oriente vers l'exterieur (direction = angle de la branche),
    // garde sur le cote exterieur (spread <= 150 deg) pour eviter le repli
    // vers le centre et les chevauchements.
    const spread = Math.min(150, n * 42);
    const first = angle - spread / 2;
    const gap = n > 1 ? spread / (n - 1) : 0;

    layout.leaves[branch.id] = leaves.map((leaf, j) => {
      const la = n > 1 ? first + j * gap : angle;
      return {
        id: leaf.id,
        x: bx + leafRadius * Math.cos(toRad(la)),
        y: by + leafRadius * Math.sin(toRad(la)),
      };
    });
  });

  return layout;
}
