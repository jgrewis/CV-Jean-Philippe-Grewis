// Étude de cas, fil rouge : besoin -> ce que j'ai conçu -> résultat.
//
// Une seule fois sur la page : les chiffres du Challenge Vélo ne sont dits
// nulle part ailleurs (ni dans le Parcours, ni dans les Réalisations) et les
// communiqués du Challenge Vélo ne sont listés qu'ici.
// `visuals` : visuels de data/realisations.js, par nom de fichier sans extension.

const CP_CHALLENGE_2026 =
  'https://www.m2a.fr/wp-content/uploads/2026/06/CP-m2A-Resultats-du-Challenge-Velo-m2A-2026.pdf';
const CP_CHALLENGE_2024 = 'https://www.m2a.fr/wp-content/uploads/2024/06/CP-m2A-Resultats-du-Challenge-Velo-2024_.pdf';

export const etudeDeCas = {
  eyebrow: 'Étude de cas',
  title: 'Challenge Vélo m2A, 2025 et 2026',
  blocks: [
    {
      label: 'Le besoin',
      text: 'Mobiliser davantage d’employeurs, de salariés et d’écoles de l’agglomération autour du Challenge Vélo, chaque printemps.',
    },
    {
      label: 'Ce que j’ai conçu',
      text: 'La stratégie et le plan de communication 360°, puis les briefs et la direction des graphistes pour l’affichage 4 × 3 m, les mupis, le stickage des vélos Vélocité et les trophées, ainsi que les posts et les contenus web.',
    },
    {
      label: 'Le résultat',
      text: '1 125 participants, 148 structures et 71 classes en 2026, contre 893 participants et 136 structures en 2024, l’édition qui a précédé mon arrivée (+26 % de participants).',
    },
  ],
  visuals: ['mockup-4x3-challenge-velo', 'mockup-mupi-challenge-velo', 'print-trophee-challenge-velo'],
  links: [
    { label: 'Communiqué : résultats du Challenge Vélo 2026 · © m2A', url: CP_CHALLENGE_2026 },
    { label: 'Communiqué : résultats du Challenge Vélo 2024, référence avant mon arrivée · © m2A', url: CP_CHALLENGE_2024 },
  ],
};
