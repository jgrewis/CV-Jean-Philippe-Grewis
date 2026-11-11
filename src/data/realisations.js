// Realisations (preuves de travail) affichees dans la section "Realisations".
// Origine : supports concus pour Mulhouse Alsace Agglomeration (m2A), copies sans
// recompression depuis le disque de preuves (WebP <= 1600 px, q82).
// Regles de selection fixees par JP : aucun enfant visible, aucun portrait nominatif,
// uniquement des supports deja publies, priorite aux supports concus par JP,
// 4 photos de shooting au plus (sans personne identifiable), une image par serie.
// Arbitrages JP du 29/10 : pictogrammes d'enfant acceptes (aucun enfant reel),
// signaletique publique du CSRA acceptee, programmes de patinoire, affiches non
// encore diffusees et application Compte Mobilite retires.
// La mention `credit` doit rester affichee avec la section, et `copyright` sous
// chaque legende.
// `featured: true` : piece mise en avant (8 a 12), le reste est derriere le bouton
// « Voir plus de realisations ». Choix du 11/11 : supports concus par JP, sans
// personne identifiable, un support et un theme varies. Reversible : deplacer le
// drapeau d'une entree a l'autre.
// Retiree le 11/11 : signaletique du CSRA (athlete paralympique identifiable).
// width / height : dimensions reelles des fichiers, pour reserver la place a l'affichage.

export const credit = 'Réalisations pour Mulhouse Alsace Agglomération';
export const copyright = '© m2A';

export const supports = [
  { id: 'affichage', label: 'Affichage urbain & grand format' },
  { id: 'print', label: 'Print & édition' },
  { id: 'signaletique', label: 'Signalétique & habillage' },
  { id: 'web', label: 'Web & réseaux sociaux' },
  { id: 'terrain', label: 'En situation' },
];

export const realisations = [
  {
    src: 'assets/realisations/affichage-challenge-velo-2026-4x3.webp', width: 1600, height: 1205,
    support: 'affichage', theme: 'Mobilité',
    title: 'Affiche 4 × 3 m Challenge vélo 2026',
    alt: 'Affiche grand format du Challenge vélo m2A : une femme tient un casque devant un vélo sur fond violet, dates du 4 mai au 5 juin 2026 et QR code d\'inscription.',
  },
  {
    src: 'assets/realisations/affichage-mupi-challenge-velo.webp', width: 1117, height: 1600,
    support: 'affichage', theme: 'Mobilité',
    title: 'Mupi Challenge vélo m2A « Relevez le défi »',
    alt: 'Affiche mupi verticale du Challenge vélo m2A : un homme en costume, bras croisés, pose avec son vélo ; slogan « Relevez le défi » et QR code d\'inscription.',
  },
  {
    src: 'assets/realisations/affichage-toile-terre-de-tous-les-sports.webp', width: 1600, height: 1238,
    featured: true,
    support: 'affichage', theme: 'Sport',
    title: 'Toile tendue « Terre de tous les sports », Palais des sports',
    alt: 'Toile tendue magenta et violette aux motifs de pistes concentriques, avec le slogan « Terre de tous les sports » et le logo Mulhouse Alsace Agglomération.',
  },
  {
    src: 'assets/realisations/affichage-bache-cryotherapie.webp', width: 1600, height: 496,
    support: 'affichage', theme: 'Sport',
    title: 'Bâche Cryothérapie corps entier 2026',
    alt: 'Bâche panoramique bleu glacier pour la cryothérapie corps entier du cryocentre IMSSA et de m2A : une sportive dans le froid, les températures des séances et un QR code.',
  },
  {
    src: 'assets/realisations/print-edition-terre-de-champions.webp', width: 992, height: 1403,
    featured: true,
    support: 'print', theme: 'Sport',
    title: 'Couverture « m2A Terre de champions »',
    alt: 'Couverture d\'édition « m2A Terre de champions » : silhouette d\'un sprinteur au départ, dans une lumière dorée de coucher de soleil.',
  },
  {
    src: 'assets/realisations/print-guide-des-mobilites-employeurs.webp', width: 699, height: 992,
    support: 'print', theme: 'Mobilité',
    title: 'Guide des mobilités employeurs 2026-2027',
    alt: 'Couverture du Guide des mobilités employeurs 2026-2027 : un homme à vélo devant un tram, un bus et une voiture électrique, sur fond violet.',
  },
  {
    src: 'assets/realisations/print-fiche-rando-circuit-igeltal.webp', width: 1403, height: 992,
    featured: true,
    support: 'print', theme: 'Territoire',
    title: 'Fiche randonnée « Circuit de l\'Igeltal à Brunstatt »',
    alt: 'Fiche de randonnée du Club Vosgien et de m2A : photo d\'une église fleurie en couverture, parcours de 4,8 km et étapes commentées.',
  },
  {
    src: 'assets/realisations/print-trophee-challenge-velo.webp', width: 1061, height: 1500,
    featured: true,
    support: 'print', theme: 'Mobilité',
    title: 'Trophée du Challenge vélo m2A',
    alt: 'Trophée découpé du Challenge vélo m2A aux tons bois, avec un plateau de vélo et la mention « Catégorie 250 salariés et plus ».',
  },
  {
    src: 'assets/realisations/print-diplome-olympiades-natation.webp', width: 992, height: 699,
    support: 'print', theme: 'Sport',
    title: 'Diplôme des Olympiades m2A de natation',
    alt: 'Diplôme magenta encadré de bandes aux couleurs olympiques, pour les participants aux Olympiades m2A de la piscine de l\'Illberg.',
  },
  {
    src: 'assets/realisations/print-affiche-baigneurs-ouvrez-l-oeil.webp', width: 1131, height: 1600,
    support: 'print', theme: 'Sport',
    title: 'Affiche A3 « Baigneurs, ouvrez l’œil », prévention noyade 2026',
    alt: 'Affiche de prévention sur fond d\'eau turquoise : une bouée orange au centre d\'un grand œil, pictogramme d\'un adulte tenant un enfant par la main, message « Un enfant dans l\'eau = un adulte attentif », traduit en allemand et en anglais.',
  },
  {
    src: 'assets/realisations/signaletique-habillage-bravo-a-nos-clubs.webp', width: 1600, height: 1473,
    featured: true,
    support: 'signaletique', theme: 'Sport',
    title: 'Habillage « Bravo à nos clubs », hall du Palais des sports',
    alt: 'Habillage mural du hall d\'accueil du Palais des sports : « Bravo à nos clubs » avec les logos du volley, du basket et du badminton mulhousiens.',
  },
  {
    src: 'assets/realisations/signaletique-baches-patinoire-m2a-le-mag.webp', width: 1600, height: 993,
    featured: true,
    support: 'signaletique', theme: 'Territoire',
    title: 'Bâches « m2A Le Mag », Patinoire olympique',
    alt: 'Bâche de la Patinoire olympique annonçant m2A Le Mag, « toutes les sorties et événements dans l\'agglo », en lettrage blanc sur dégradé magenta.',
  },
  {
    src: 'assets/realisations/signaletique-drapeau-base-nautique.webp', width: 484, height: 1600,
    support: 'signaletique', theme: 'Sport',
    title: 'Drapeau d\'entrée de la Base nautique m2A',
    alt: 'Drapeau vertical magenta de 4 mètres à l\'entrée de la Base nautique m2A de Reiningue, avec le logo et les réseaux sociaux.',
  },
  {
    src: 'assets/realisations/signaletique-reglementation-baignade-reiningue.webp', width: 1181, height: 984,
    support: 'signaletique', theme: 'Sport',
    title: 'Panneau de réglementation de la baignade, plan d\'eau de Reiningue',
    alt: 'Panneau d\'information du plan d\'eau de Reiningue : code couleur des drapeaux de baignade, plan illustré des zones et horaires de surveillance de 11 h à 19 h.',
  },
  {
    src: 'assets/realisations/signaletique-panneau-chantier-stade-de-l-ill.webp', width: 689, height: 984,
    support: 'signaletique', theme: 'Sport',
    title: 'Panneau de chantier « m2A investit pour le sport de demain »',
    alt: 'Panneau de chantier pour la réfection du terrain synthétique du stade de l\'Ill à Mulhouse : maître d\'ouvrage, entreprises, budget et calendrier.',
  },
  {
    src: 'assets/realisations/signaletique-panneau-transition-energetique.webp', width: 1600, height: 1600,
    featured: true,
    support: 'signaletique', theme: 'Territoire',
    title: 'Panneau « m2A s\'engage pour la transition énergétique »',
    alt: 'Panneau carré du Palais des sports présentant l\'éclairage LED financé par le Fonds vert, avec le coût du projet et la répartition entre l\'État et m2A.',
  },
  {
    src: 'assets/realisations/signaletique-panneau-piste-cyclable-bruebach.webp', width: 472, height: 591,
    support: 'signaletique', theme: 'Mobilité',
    title: 'Panneau de la liaison cyclable Bruebach – hôpital Émile-Muller',
    alt: 'Panneau de signalétique : liaison cyclable de Bruebach à l\'hôpital Émile-Muller, pictogramme voiture barrée, accès réservé aux cyclistes et aux exploitants agricoles.',
  },
  {
    src: 'assets/realisations/signaletique-stickage-velocite-challenge-velo.webp', width: 1600, height: 809,
    featured: true,
    support: 'signaletique', theme: 'Mobilité',
    title: 'Stickage des vélos Vélocité, Challenge vélo 2026',
    alt: 'Autocollant à découpe libre pour les vélos en libre-service Vélocité, aux couleurs du Challenge vélo m2A 2026, avec QR code d\'inscription.',
  },
  {
    src: 'assets/realisations/signaletique-drapeau-adn-sport.webp', width: 1600, height: 1201,
    support: 'signaletique', theme: 'Sport',
    title: 'Drapeau « #ADN Sport », stade de l\'Ill',
    alt: 'Drapeau magenta et violet associant la signature « #ADN Sport » et le logo Mulhouse Alsace Agglomération.',
  },
  {
    src: 'assets/realisations/web-instagram-covoiturage.webp', width: 1600, height: 1600,
    support: 'web', theme: 'Mobilité',
    title: 'Visuel Instagram « Covoiturez à moindre coût avec m2A »',
    alt: 'Visuel carré pour Instagram : une conductrice souriante et ses passagers, offre de covoiturage avec BlaBlaCar Daily, trajets gratuits pour les passagers en mars.',
  },
  {
    src: 'assets/realisations/web-post-baigneurs-ouvrez-l-oeil.webp', width: 1081, height: 1081,
    featured: true,
    support: 'web', theme: 'Sport',
    title: 'Post carré « Baigneurs, ouvrez l’œil », réseaux sociaux',
    alt: 'Visuel carré pour les réseaux sociaux : un grand œil dont l\'iris est une bouée rose et orange, pictogramme d\'un adulte tenant un enfant par la main, message « Un enfant dans l\'eau = un adulte attentif ».',
  },
  {
    src: 'assets/realisations/situation-bus-solea-plan-climat.webp', width: 1600, height: 1066,
    featured: true,
    support: 'terrain', theme: 'Mobilité',
    title: 'Bus Soléa habillé « m2A s\'engage pour le climat »',
    alt: 'Photo d\'un bus Soléa jaune et rouge au dépôt, habillé aux messages « m2A s\'engage pour le climat », « Plan climat » et « 100 % biogaz ».',
  },
  {
    src: 'assets/realisations/situation-facade-csra.webp', width: 1600, height: 899,
    featured: true,
    support: 'terrain', theme: 'Sport',
    title: 'Façade habillée du Centre sportif régional Alsace',
    alt: 'Photo de l\'entrée du Centre sportif régional Alsace : fronton et portes habillés en magenta, vitrophanie « #ADN Sport » sur la passerelle.',
  },
  {
    src: 'assets/realisations/situation-espace-vip-palais-des-sports.webp', width: 1600, height: 1200,
    support: 'terrain', theme: 'Sport',
    title: 'Habillage de l\'Espace VIP du Palais des sports',
    alt: 'Photo de l\'accès à l\'Espace VIP du Palais des sports, habillé de panneaux magenta « Bienvenue, Welcome, Willkommen ».',
  },
  {
    src: 'assets/realisations/situation-haut-de-porte-evenements-sportifs.webp', width: 1600, height: 1200,
    support: 'terrain', theme: 'Sport',
    title: 'Haut de porte « Tous les événements sportifs », espace loges',
    alt: 'Photo d\'un bandeau installé au-dessus d\'une porte de l\'espace loges : « Tous les événements sportifs » et l\'adresse mag.m2A.fr.',
  },
];
