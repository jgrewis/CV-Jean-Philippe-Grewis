// Source unique de toutes les donnees du CV.
// Tout le contenu affiche par le site provient d'ici : aucune donnee en dur
// dans les composants. Pour mettre le CV a jour, on edite uniquement ce fichier.

export const profile = {
  name: 'Jean-Philippe Grewis',
  title: 'Chef de projet — Responsable communication',
  photo: 'assets/photo-jp.png',
  linkedin: 'https://www.linkedin.com/in/grewis/',
  tagline: '10+ ans en communication 360°, pilotage de projets et automatisation par l\'IA.',
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
    { label: 'Sites web — jgrewis.github.io', url: 'https://jgrewis.github.io/', icon: 'world' },
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
        id: 'apropos',
        title: 'À propos',
        summary:
          "Responsable communication et chef de projet depuis plus de 10 ans, expert en supports multi-formats (print, digital, événementiel), pilotage d'agences et déploiement de chartes graphiques multi-enseignes.",
      },
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
        title: 'Chef de projets communication · CDD',
        org: 'Mulhouse Alsace Agglomération (m2A) — Mulhouse',
        period: 'Oct. 2024 – Oct. 2026',
        theme: {
          background: 'assets/m2a-bg.jpg',
          accentColor: '#d92e84',
        },
        summary:
          "J'ai mené la communication des opérations Sport, Mobilité et Enfance de A à Z : stratégie, briefs et direction des graphistes, contenus web et réseaux, plans d'implantation des événements, puis suivi des résultats.",
        // Resultats contextualises (remplacent la grille de chiffres, 11/11) : chaque
        // chiffre dit de quoi il parle et pourquoi c'est une retombee de la com.
        // Source : communiques de presse officiels de m2A (liens ci-dessous).
        resultsLabel: 'Retombées de ma communication',
        results: [
          {
            title: 'Challenge Vélo m2A',
            text: 'De 893 à 1 125 participants (+26 %) et de 136 à 148 structures inscrites entre 2024 et 2026, avec 71 classes engagées en 2026.',
          },
          {
            title: 'Piscines et Plan d’eau, été 2026',
            text: '236 384 entrées, près de +17 % et un record d’affluence, une saison accompagnée par la campagne de prévention « Baigneurs, ouvrez l’œil ».',
          },
          {
            title: 'Camp d’entraînement Paris 2024',
            text: 'Plus de 135 athlètes de 31 pays accueillis sur le territoire : j’en ai porté la communication institutionnelle.',
          },
          {
            title: 'Olympiades scolaires et Semaine olympique',
            text: 'Jusqu’à 2 700 élèves aux Olympiades m2A et 1 200 élèves à la Semaine olympique et paralympique, en 2024.',
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
        linksLabel: 'Preuves des résultats · communiqués officiels de m2A',
        links: [
          { label: 'CP Challenge Vélo 2026 · © m2A', url: 'https://www.m2a.fr/wp-content/uploads/2026/06/CP-m2A-Resultats-du-Challenge-Velo-m2A-2026.pdf', icon: 'external' },
          { label: 'CP Challenge Vélo 2025 · © m2A', url: 'https://www.m2a.fr/wp-content/uploads/2025/06/CP-m2A-Resultats-du-Challenge-Velo-m2A-2025-Fete-du-Velo-m2A.pdf', icon: 'external' },
          { label: 'CP Challenge Vélo 2024 · © m2A', url: 'https://www.m2a.fr/wp-content/uploads/2024/06/CP-m2A-Resultats-du-Challenge-Velo-2024_.pdf', icon: 'external' },
          { label: 'CP Olympiades scolaires 2024 · © m2A', url: 'https://www.m2a.fr/wp-content/uploads/2024/05/CP-m2A-Olympiades-m2A.pdf', icon: 'external' },
          { label: 'CP Semaine olympique et paralympique 2024 · © m2A', url: 'https://www.m2a.fr/wp-content/uploads/2024/03/CP-m2A-Semaine-Olympique-et-Paralympique-du-02-au-09-avril-2024.pdf', icon: 'external' },
          { label: "CP Camp d'entraînement Paris 2024 · © m2A", url: 'https://www.m2a.fr/wp-content/uploads/2024/07/CP-m2A-Des-medailles-olympiques-mondiaux-et-panamericains-se-preparent-aux-Jeux-de-Paris-2024-au-Camp-dentrainement-de-PSO-m2A.pdf', icon: 'external' },
          { label: 'CP Bilan estival piscines 2026 · © m2A', url: 'https://www.m2a.fr/wp-content/uploads/2026/09/CP-m2A-Bilan-estival-Nouveau-record-daffluence-pour-les-piscines-et-le-Plan-deau-de-m2A.pdf', icon: 'external' },
          { label: 'CP Fête du Vélo 2024 · © m2A', url: 'https://www.m2a.fr/wp-content/uploads/2024/06/CP-m2A-2e-edition-de-la-Fete-du-Velo-m2A-dimanche-16-juin-2024.pdf', icon: 'external' },
          { label: 'Espace presse m2A', url: 'https://www.m2a.fr/outils/espace-presse/', icon: 'world' },
        ],
      },
      {
        id: 'gr-strategie',
        title: 'Gérant',
        org: 'GR Stratégie (SARL) — entreprise cédée en 2024',
        period: '2018 – 2024',
        theme: {
          background: 'assets/gr-strategie-bg.png',
          accentColor: '#e8453c',
        },
        summary:
          "Création et gestion d'une structure pendant 6 ans, en parallèle de mon activité salariée, jusqu'à sa cession en 2024.",
        // Chiffres isoles retires (11/11) : le resume dit deja 6 ans et la cession.
        bullets: [
          'Conception de la communication de plusieurs marques clientes, création de leurs sites internet et d\'outils sur mesure.',
          'Intégration de contenus optimisés pour le référencement naturel (SEO) sur les sites clients.',
          'Automatisation de processus métier (production, gestion client) avec n8n.',
          "Développement d'un système informatique complet de diffusion et d'administration d'écrans dynamiques en réseau.",
        ],
      },
      {
        id: 'hyper-u',
        title: 'Responsable communication multi-sites',
        org: 'Hyper U Sierentz & Super U Huningue',
        period: 'Janv. 2016 – Sept. 2024',
        theme: {
          background: 'assets/hyper-u-bg.jpg',
          accentColor: '#e3201e',
        },
        kpis: [
          { value: '20 000+', label: 'personnes, page Hyper U Sierentz' },
          { value: '40 000', label: 'catalogues diffusés' },
        ],
        bullets: [
          'Élaboration des plans de communication et plans médias annuels (affichage, presse, digital, événementiel).',
          'Conception intégrale et diffusion de catalogues promotionnels, jusqu\'à 40 000 exemplaires.',
          'Community management et stratégie réseaux sociaux : gestion de la page Hyper U Sierentz (plus de 20 000 personnes).',
          'Rédaction de contenus et conception de supports print & digital : PAO (InDesign, Illustrator, Photoshop), vidéo (Première Pro), Canva.',
          "Application de la charte graphique et de l'identité visuelle des enseignes.",
          'Coordination des prestataires et animation des partenariats (agences, imprimeurs, médias).',
          "Formation et encadrement d'apprentis.",
        ],
        media: [
          { caption: 'Catalogues promotionnels' },
          { caption: 'Supports événementiels' },
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
        tags: ['InDesign', 'Illustrator', 'Photoshop', 'Première Pro', 'Canva', 'n8n'],
      },
      {
        id: 'communication',
        title: 'Communication',
        tags: ['Plans 360°', 'Plans médias', 'Image de marque', 'Social media', 'Emailing', 'Événementiel'],
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
        title: 'BAC+5 — Manager de la stratégie et de la politique commerciale',
        org: 'ESGM Mulhouse',
        period: '2015',
        summary: 'Alternance Coopérative U Centrale Est.',
      },
      {
        id: 'bac3',
        title: 'BAC+3 — Chargé(e) de développement marketing et vente',
        org: 'ESGM Mulhouse',
        period: '2013',
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
