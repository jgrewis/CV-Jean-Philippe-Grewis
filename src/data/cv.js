// Source unique de toutes les donnees du CV.
// Tout le contenu affiche par le site provient d'ici : aucune donnee en dur
// dans les composants. Pour mettre le CV a jour, on edite uniquement ce fichier.

export const profile = {
  name: 'Jean-Philippe Grewis',
  title: 'Chef de projet, Responsable communication',
  // Accroche de profil (bloc Validé JP de la Bibliothèque CV), utilisée par le PDF.
  summary:
    "Responsable communication et chef de projet depuis plus de 10 ans, expert en supports multi-formats (print, digital, événementiel), pilotage d'agences et déploiement de chartes graphiques multi-enseignes.",
  photo: 'assets/photo-jp.png',
  linkedin: 'https://www.linkedin.com/in/grewis/',
};

export const contact = {
  phone: '07 85 46 54 97',
  email: 'grewis.jp@gmail.com',
  location: 'Burnhaupt-le-Bas, 68520',
  driving: 'Permis B & Véhiculé',
  // CV imprimable (public/), regenere par scripts/generer-pdf-og.mjs.
  pdf: { url: 'CV-Jean-Philippe-Grewis.pdf', label: 'Télécharger mon CV (PDF)', shortLabel: 'CV (PDF)' },
  links: [
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/grewis/', icon: 'linkedin' },
    { label: 'Sites web : jgrewis.github.io', url: 'https://jgrewis.github.io/', icon: 'world' },
  ],
};

// Contenu par branche (id stables, lus par src/data/selectors.js).
// Chaque feuille (leaf) peut porter : summary, bullets, kpis, tags, media, links.
export const branches = [
  {
    id: 'profil',
    label: 'Profil',
    icon: 'user',
    leaves: [
      {
        id: 'soft-skills',
        title: 'Soft skills',
        tags: [
          'Résolution de problèmes et pensée systémique',
          'Autonomie',
          'Gestion de projets multiples',
          'Encadrement et tutorat',
        ],
      },
      {
        id: 'interets',
        title: "Centres d'intérêt",
        tags: [
          'Veille tech & IA',
          'Lecture',
          'Musculation',
          'Méditation et yoga',
        ],
      },
    ],
  },
  {
    id: 'experiences',
    label: 'Expériences professionnelles',
    icon: 'briefcase',
    accent: true,
    leaves: [
      {
        id: 'm2a',
        title: 'Chargé de projet communication externe · CDD',
        org: 'Mulhouse Alsace Agglomération (m2A), Mulhouse',
        period: 'Oct. 2024 – Oct. 2026',
        theme: {
          background: 'assets/m2a-bg.jpg',
          accentColor: '#d92e84',
        },
        summary:
          "Communication des opérations Sport, Mobilité et Enfance : 18 inaugurations, événements et lancements conduits entre octobre 2024 et octobre 2026.",
        // Resultats contextualises (remplacent la grille de chiffres, 11/11) : chaque
        // chiffre dit de quoi il parle et pourquoi c'est une retombee de la com.
        // Source : communiques de presse officiels de m2A (liens ci-dessous).
        // Le Challenge Vélo n'est pas ici : ses chiffres sont dits une seule fois,
        // dans l'étude de cas (reconstruction du 15/11).
        resultsLabel: 'Résultats des opérations dont j’ai piloté la communication',
        results: [
          {
            title: 'Piscines et Plan d’eau, été 2026',
            text: '236 384 entrées, près de +17 % et un record d’affluence, une saison accompagnée par la campagne de prévention « Baigneurs, ouvrez l’œil ».',
          },
          {
            title: 'Covoiturage BlaBlaCar Daily, mars 2025',
            text: 'Près de 1 900 trajets sur BlaBlaCar Daily pendant le Printemps du covoiturage, un record pour le territoire.',
          },
        ],
        bullets: [
          "J'ai défini la stratégie et les plans de communication 360° (affichage, print, digital, web, événementiel), avec leurs budgets, en menant plusieurs projets de front.",
          "J'ai rédigé les briefs créatifs et dirigé les graphistes jusqu'à la validation de chaque support.",
          "J'ai écrit les posts des réseaux sociaux et les ai validés avec la community manager, chargée de la modération et de la planification.",
          "J'ai rédigé entièrement les pages web et sélectionné leurs images.",
          "J'ai conçu les plans d'implantation des événements, comme la Fête du vélo, et rédigé les briefs des prestataires.",
          'J’ai piloté les prestataires et agences (imprimeurs, photographes, vidéastes).',
          'J’ai suivi les résultats et rendu compte : indicateurs, tableaux de bord, bilans.',
        ],
        // Preuves des resultats : communiques de presse officiels de m2A (contenus (c) m2A).
        // Les communiques du Challenge Vélo ne sont pas ici : ils sont dits une
        // seule fois, dans l'étude de cas (reconstruction du 15/11).
        linksLabel: 'Preuves des résultats · communiqués officiels de m2A',
        links: [
          { label: 'CP Covoiturage, rentrée 2025 (bilan de mars) · © m2A', url: 'https://www.m2a.fr/wp-content/uploads/2025/08/CP-m2A-Le-covoiturage-fait-sa-rentree-dans-lAgglo.pdf', icon: 'external' },
          { label: 'CP Bilan estival piscines 2026 · © m2A', url: 'https://www.m2a.fr/wp-content/uploads/2026/09/CP-m2A-Bilan-estival-Nouveau-record-daffluence-pour-les-piscines-et-le-Plan-deau-de-m2A.pdf', icon: 'external' },
          { label: 'Espace presse m2A', url: 'https://www.m2a.fr/outils/espace-presse/', icon: 'world' },
        ],
      },
      {
        id: 'gr-strategie',
        title: 'Gérant',
        org: 'GR Stratégie (SARL), entreprise cédée en 2024',
        period: '2018 – 2024',
        theme: {
          background: 'assets/gr-strategie-bg.png',
          accentColor: '#e8453c',
        },
        summary:
          "Conception de la communication de plusieurs marques clientes, création de leurs sites internet et d'outils sur mesure, jusqu'à la cession de l'entreprise en 2024.",
        // Chiffres isoles retires (11/11) : le resume dit deja 6 ans et la cession.
        bullets: [
          'Intégration de contenus optimisés pour le référencement naturel (SEO) sur les sites clients.',
          'Automatisation de processus métier (production, gestion client) avec n8n.',
          "Développement d'un système informatique complet de diffusion et d'administration d'écrans dynamiques en réseau.",
        ],
      },
      {
        id: 'hyper-u',
        title: 'Responsable communication multi-sites',
        org: 'Hyper U Sierentz · Super U Huningue',
        period: 'Janv. 2016 – Sept. 2024',
        theme: {
          background: 'assets/hyper-u-bg.jpg',
          accentColor: '#e3201e',
        },
        // Contenu valide par JP le 11/11/2026. Chiffres non confirmes retires.
        // Pas de flashmob, concert ni dedicaces isolees. Pas d'images Facebook/presse.
        summary:
          "J'ai mené la communication commerciale de deux magasins : réseaux sociaux, catalogues et promotions, signalétique et écrans en magasin, opérations et événements.",
        resultsLabel: 'Opérations que j’ai menées',
        results: [
          {
            title: 'Ouverture du Super U Huningue, octobre 2021',
            text: "Communication de lancement, de l'annonce à l'offre du jour d'ouverture.",
          },
          {
            title: 'Salon du livre',
            text: 'Créé en 2016, cinq éditions jusqu’en 2019, jusqu’à 32 auteurs régionaux, avec des retombées dans L’Alsace et les DNA.',
          },
          {
            title: 'Noël « Hyper Shopping », 2016',
            text: 'Un chéquier monté avec les commerçants de la galerie pour faire venir du monde.',
          },
        ],
        linksLabel: 'Sources',
        links: [
          { label: 'L’Alsace, salon du livre 2016', url: 'https://www.lalsace.fr/haut-rhin/2016/09/30/un-salon-du-livre-a-l-hyper-u', icon: 'external' },
          { label: 'Facebook, salon du livre 2018', url: 'https://www.facebook.com/hyperusierentz/posts/pfbid028dJ7GE7wpGmRi2p4JZVudgVqTfXzEE4tftF42tmbRzLNjx629onLKUQuUopMiZRxl', icon: 'external' },
          { label: 'L’Alsace, ouverture Super U Huningue', url: 'https://www.lalsace.fr/economie/2021/10/15/le-super-u-de-huningue-accueille-(enfin)-ses-premiers-clients', icon: 'external' },
          { label: 'Facebook, annonce d’ouverture', url: 'https://www.facebook.com/superuhuningue/posts/pfbid02fvaxEyKoBBvCTWcMPwfuvcJdGm8kCwdstx78MTtpE7z2V1TYcNKYs5ZtovkHnBNsl', icon: 'external' },
          { label: 'Facebook, Noël Hyper Shopping', url: 'https://www.facebook.com/photo?fbid=1153185604758402&set=a.1074816353846891', icon: 'external' },
        ],
      },
      {
        id: 'systeme-u',
        title: 'Merchandiseur Grand-Est · Alternance',
        org: 'Coopérative U Centrale Est',
        period: '2014 – Déc. 2015',
        theme: {
          background: 'assets/systeme-u-bg.jpg',
          accentColor: '#1c8fa3',
        },
        bullets: [
          'Conception de concepts merchandising et de supports de communication pour les points de vente.',
          'Analyse de données produit/vente, préconisations par catégorie de magasin et déploiement terrain sur le Grand Est.',
        ],
      },
    ],
  },
  {
    id: 'competences',
    label: 'Compétences',
    icon: 'bulb',
    leaves: [
      {
        id: 'outils',
        title: 'Outils',
        tags: ['InDesign', 'Illustrator', 'Photoshop', 'Premiere Pro', 'CapCut', 'Canva', 'WordPress', 'Meta Business Suite', 'Excel et Suite Office', 'n8n'],
      },
      {
        id: 'communication',
        title: 'Communication',
        tags: ['Plans 360°', 'Plans médias', 'Image de marque', 'Social media', 'Community management', 'Rédaction de contenus', 'Relations presse', 'Emailing', 'Événementiel'],
      },
      {
        id: 'pilotage',
        title: 'Pilotage',
        tags: ['Briefs', 'Cahiers des charges', 'Gestion budgétaire', 'Coordination agences & prestataires', 'KPIs'],
      },
      {
        id: 'auto-ia',
        title: 'Automatisation & IA',
        bullets: [
          "Usage avancé de l'IA générative : conception de prompts et d'agents pour fluidifier les processus longs, fiabiliser les tâches répétitives et automatiser les opérations à faible valeur ajoutée.",
          'Automatisation de processus métier (production, gestion client) avec n8n.',
          'Sites web professionnels en HTML / CSS / JavaScript.',
          "Conception d'un système d'affichage dynamique en réseau, synchronisation en temps réel.",
        ],
        links: [{ label: 'jgrewis.github.io', url: 'https://jgrewis.github.io/', icon: 'world' }],
      },
    ],
  },
  {
    id: 'formation',
    label: 'Formations',
    icon: 'school',
    leaves: [
      {
        id: 'bac5',
        title: 'BAC+5, Manager de la stratégie et de la politique commerciale',
        org: 'ESGM Mulhouse',
        period: '2014 – 2016',
        summary: 'Alternance Coopérative U Centrale Est.',
      },
      {
        id: 'bac3',
        title: 'BAC+3, Chargé(e) de développement marketing et vente',
        org: 'ESGM Mulhouse',
        period: '2012 – 2014',
        summary: 'Alternance Super U Riedisheim.',
      },
      // Choix reversible (11/11/2026) : le Bachelor RH (Studi, en cours, fin dec. 2026)
      // est retire du site, axe communication. Pour le remettre, decommenter :
      // { id: 'bachelor-rh', title: 'Bachelor droit social, RH et paie', org: 'Studi', period: 'En cours · fin décembre 2026' },
      {
        id: 'certifications',
        title: 'Certifications',
        tags: ['Google Prompting Essentials · 2026', 'Sites web HTML/CSS & JavaScript · 2018'],
      },
    ],
  },
  {
    id: 'contact',
    label: 'Contact',
    icon: 'mail',
    isContact: true,
  },
];
