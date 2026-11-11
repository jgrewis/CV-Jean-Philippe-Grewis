// Section « De la strategie aux resultats » (#methode) : les etapes d'une
// communication menee de A a Z, chacune avec le role REEL de JP (voir ses
// precisions du 11/11) et des preuves tirees des realisations existantes.
//
// Regles de contenu (a respecter strictement) :
//   - Strategie : entierement JP.
//   - Creation : briefs et direction des graphistes ; JP n'a PAS dessine les
//     visuels m2A (ne jamais ecrire « j'ai cree ces visuels »).
//   - Digital : JP ecrit les posts, les valide avec la CM (moderation,
//     planification) ; web : JP redige les pages et choisit les images.
//   - Evenementiel : plans d'implantation et briefs prestataires (pas la logistique).
//   - Relations presse : pas un point fort ; les communiques servent de preuves.
//   - Aucun chiffre isole : chaque chiffre dit ce qu'il mesure.
//
// `proofs` : nom de fichier d'une piece de data/realisations.js (image, alt,
// dimensions et titre sont relus la-bas). `links` : preuves externes.

const CP_CHALLENGE_2026 =
  'https://www.m2a.fr/wp-content/uploads/2026/06/CP-m2A-Resultats-du-Challenge-Velo-m2A-2026.pdf';
const CP_CHALLENGE_2024 = 'https://www.m2a.fr/wp-content/uploads/2024/06/CP-m2A-Resultats-du-Challenge-Velo-2024_.pdf';
const CP_PISCINES_2026 =
  'https://www.m2a.fr/wp-content/uploads/2026/09/CP-m2A-Bilan-estival-Nouveau-record-daffluence-pour-les-piscines-et-le-Plan-deau-de-m2A.pdf';

export const methode = {
  eyebrow: 'Méthode',
  title: 'De la stratégie aux résultats',
  intro:
    'Une communication digne de ce nom se mène de bout en bout. Voici ce que je prends en charge à chaque étape, preuves à l’appui.',
  proofCredit: '© m2A',
  steps: [
    {
      id: 'strategie',
      title: 'Stratégie',
      role: 'Je définis la stratégie : objectifs, cibles, messages, calendrier, plan de communication et plan médias 360°, budget. Cette étape est entièrement la mienne.',
      proofs: ['signaletique-stickage-velocite-challenge-velo', 'print-trophee-challenge-velo'],
      proofsLabel: 'Le Challenge Vélo décliné sur tous les points de contact',
    },
    {
      id: 'creation',
      title: 'Création : brief et direction',
      role: 'Je rédige les briefs créatifs et je dirige les graphistes, en lien étroit, jusqu’à la validation de chaque support. Je maîtrise aussi la PAO (InDesign, Illustrator, Photoshop) quand il faut produire soi-même.',
      proofs: ['print-affiche-baigneurs-ouvrez-l-oeil', 'affichage-toile-terre-de-tous-les-sports', 'situation-bus-solea-plan-climat'],
      proofsLabel: 'Affiche, toile grand format, bus habillé',
    },
    {
      id: 'digital',
      title: 'Digital et web',
      role: 'J’écris les posts et je les valide avec la community manager, qui assure la modération et la planification. Pour le web, je rédige entièrement les pages et je choisis les images.',
      proofs: ['web-post-baigneurs-ouvrez-l-oeil'],
      proofsLabel: 'Post de prévention noyade',
    },
    {
      id: 'evenementiel',
      title: 'Événementiel',
      role: 'Je conçois les plans d’implantation, par exemple pour la Fête du vélo, et je rédige les briefs des prestataires.',
      proofs: ['situation-espace-vip-palais-des-sports', 'situation-haut-de-porte-evenements-sportifs'],
      proofsLabel: 'Signalétique et habillage des espaces d’accueil',
    },
    {
      id: 'resultats',
      title: 'Résultats',
      role: 'Je suis les indicateurs et j’en rends compte en bilan. Les résultats sont les retombées de la communication ; les communiqués officiels de m2A en apportent la preuve.',
      links: [
        { label: 'Résultats du Challenge Vélo 2026 · © m2A', url: CP_CHALLENGE_2026 },
        { label: 'Bilan estival des piscines 2026 · © m2A', url: CP_PISCINES_2026 },
      ],
    },
  ],
  // Etude de cas, fil rouge : besoin -> ce que j'ai concu -> resultat.
  caseStudy: {
    eyebrow: 'Étude de cas',
    title: 'Challenge Vélo m2A, 2024 – 2026',
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
        text: 'De 893 à 1 125 participants (+26 %) et de 136 à 148 structures inscrites entre 2024 et 2026, avec 71 classes engagées en 2026 : la mobilisation que la campagne devait produire.',
      },
    ],
    links: [
      { label: 'Communiqué : résultats du Challenge Vélo 2026 · © m2A', url: CP_CHALLENGE_2026 },
      { label: 'Communiqué : résultats du Challenge Vélo 2024 · © m2A', url: CP_CHALLENGE_2024 },
    ],
  },
};
