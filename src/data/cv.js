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
  links: [
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/grewis/', icon: 'linkedin' },
    { label: 'Sites web — jgrewis.github.io', url: 'https://jgrewis.github.io/', icon: 'world' },
  ],
};

// Arbre de la carte mentale : 5 branches principales autour du noeud central.
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
          'Montage de PC sur mesure',
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
        period: "Oct. 2024 – Aujourd'hui",
        theme: {
          background: 'assets/m2a-bg.jpg',
          accentColor: '#d92e84',
        },
        kpis: [
          { value: '360°', label: 'plans médias' },
          { value: '1000+', label: 'visiteurs / événement' },
        ],
        bullets: [
          'Élaboration de plans de communication et plans médias 360° (print, digital, affichage, web, événementiel).',
          'Gestion de budgets et pilotage de nombreux projets simultanés.',
          'Rédaction des briefs créatifs et cahiers des charges à destination des agences et prestataires.',
          "Organisation d'événements de la dizaine d'invités à plusieurs milliers de visiteurs.",
          'Reporting régulier : suivi des indicateurs de performance (KPIs) et tableaux de bord.',
          'Pilotage de prestataires et agences de communication (agences, photographes, vidéastes).',
        ],
      },
      {
        id: 'gr-strategie',
        title: 'Gérant — Entrepreneur',
        org: 'GR Stratégie (SARL, activité propre, vendue en 2025)',
        period: '2018 – 2025',
        theme: {
          background: 'assets/gr-strategie-bg.png',
          accentColor: '#e8453c',
        },
        summary:
          "Création et gestion intégrale d'une structure commerciale pendant 7 ans, en parallèle de mon activité salariée.",
        kpis: [
          { value: '7 ans', label: "d'activité" },
          { value: '2025', label: 'structure cédée' },
        ],
        bullets: [
          'Contact B2B et prospection.',
          'Négociation commerciale.',
          'Automatisation de processus avancés (n8n).',
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
          { value: '+30%', label: 'ventes (réseaux sociaux)' },
          { value: '40 000', label: 'catalogues diffusés' },
        ],
        bullets: [
          'Élaboration des plans de communication et plans médias annuels (affichage, presse, digital, événementiel).',
          'Création et diffusion de catalogues promotionnels, jusqu\'à 40 000 exemplaires.',
          'Community management et stratégie réseaux sociaux : impact mesuré sur les ventes jusqu\'à +30 %.',
          'Rédaction de contenus et conception de supports print & digital : PAO (InDesign, Illustrator, Photoshop), vidéo (Première Pro), Canva.',
          "Définition et application de la charte graphique et de l'identité visuelle des enseignes.",
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
        title: 'Responsable marchandising Grand-Est',
        org: 'Système U Centrale Est',
        period: 'Sept. 2013 – Déc. 2015',
        theme: {
          background: 'assets/systeme-u-bg.jpg',
          accentColor: '#1c8fa3',
        },
        kpis: [{ value: 'Grand Est', label: 'déploiement régional' }],
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
    label: 'Formation',
    icon: 'school',
    leaves: [
      {
        id: 'bac5',
        title: 'BAC+5 — Manager stratégie commerciale',
        org: 'ESGM Mulhouse · Marketing',
        period: '2014 – 2016',
        summary: 'Alternance Système U Centrale Est.',
      },
      {
        id: 'bac3',
        title: 'BAC+3 — Développement marketing',
        org: 'ESGM Mulhouse',
        period: '2012 – 2014',
        summary: 'Alternance Super U Riedisheim.',
      },
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
