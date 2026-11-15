// Evenementiel : inaugurations, evenements et lancements conduits par JP chez
// Mulhouse Alsace Agglomération (m2A), d'octobre 2024 à octobre 2026, en
// organisation, événementiel et communication.
//
// Origine : publications et dossiers de presse de m2A (recherche du 15/11/2026,
// fichier cv-audit/evenementiel-m2a-2024-2026.md). Chaque entree renvoie vers sa
// source publique (dossier de presse, communiqué, article m2A le mag, post).
// Non repris ici : la vidéo CSRA (déjà dans Réalisations), l'inauguration du
// Lerchenberg du 22/09/2024 (avant son arrivée à m2A), 3 inaugurations dont
// les dates ne sont pas confirmées (périscolaire Wittelsheim, terrain du stade
// de l'Ill, « Horizon Afrique ») et, à sa demande le 15/11/2026, les Portes
// Ouvertes m2A 2025 et 2026, le festival Décodage, l'appli MemoFamille, les
// festivals Groaaar, Crapod'Esch et Kicks Tour, et le périscolaire Mélusine
// (pas de lui).
// Images : quand une photo conforme existe (lieu ou équipement, aucune personne
// identifiable), l'entrée porte `img` (chemin local) et `alt` ; sinon elle reste
// en texte seul.
// `type` : Inauguration, Événement, Lancement, Campagne, Opération.

export const evenementielIntro =
  'Inaugurations, événements et lancements conduits chez Mulhouse Alsace Agglomération : organisation, événementiel et communication.';

// Photos des événements : vignettes issues des sources publiques de chaque
// événement (dossiers de presse et communiqués m2A, articles m2A le mag).
export const photosCredit = 'Photos : © m2A';

export const evenementielGroups = [
  {
    id: 'mobilite',
    label: 'Mobilité',
    events: [
      {
        date: '26 avril 2025',
        type: 'Inauguration',
        title: 'Deux nouvelles voies vertes de Wittenheim',
    img: 'assets/evenementiel/voies-vertes-wittenheim.webp',
    alt: 'Voie verte nouvellement aménagée à Wittenheim, avec son panneau piétons et vélos, le long de la route.',
        detail:
          'Voie verte rue du Dr Albert Schweitzer (300 m, portée par m2A) et rue de Soultz (1,3 km, Ville de Wittenheim).',
        links: [
          {
            label: 'Dossier de presse · © m2A',
            url: 'https://www.m2a.fr/wp-content/uploads/2025/04/DP-m2A-Inauguration-des-deux-nouvelles-voies-vertes-de-Wittenheim.pdf',
          },
        ],
      },
      {
        date: '4 juillet 2025',
        type: 'Inauguration',
        title: 'Voie verte Bollwiller – Feldkirch et extension du parking de la gare SNCF',
    img: 'assets/evenementiel/voie-verte-bollwiller-feldkirch.webp',
    alt: 'Voie verte entre Bollwiller et Feldkirch, empruntée par un cycliste vu de dos, le long de la voie ferrée.',
        detail:
          '750 m de voie verte dont 500 m en peinture photoluminescente, et 49 places de stationnement supplémentaires.',
        links: [
          {
            label: 'Dossier de presse · © m2A',
            url: 'https://www.m2a.fr/wp-content/uploads/2025/07/DP-m2A-Inauguration-de-la-voie-verte-reliant-Bollwiller-et-Feldkirch-et-de-lextention-du-parking-de-la-gare-SNCF-de-Bollwiller.pdf',
          },
        ],
      },
      {
        date: '7 février 2026',
        type: 'Inauguration',
        title: 'Passerelle André Erbland, Brunstatt-Didenheim',
    img: 'assets/evenementiel/passerelle-erbland.webp',
    alt: 'Passerelle métallique André Erbland enjambant l’Ill à Brunstatt-Didenheim.',
        detail:
          'Passerelle de 40,32 m sur l’Ill ; m2A financeur et pilote de la voie verte attenante.',
        links: [
          {
            label: 'Dossier de presse · © m2A',
            url: 'https://www.m2a.fr/wp-content/uploads/2026/02/DP-m2A-Inauguration-de-la-passerelle-Andre-Erbland-a-Brunstatt-Didenheim.pdf',
          },
        ],
      },
      {
        date: '2 avril 2025',
        type: 'Inauguration',
        title: 'Nouveau service VéloCité',
    img: 'assets/evenementiel/velocite.webp',
    alt: 'Vélos à assistance électrique VéloCité alignés à une station.',
        detail:
          'Extension intercommunale du vélo en libre-service : 64 stations, 640 vélos à assistance électrique, 8 communes.',
        links: [
          {
            label: 'Dossier de presse · © m2A',
            url: 'https://www.m2a.fr/wp-content/uploads/2025/04/DP-m2A-Inauguration-du-nouveau-service-VeloCite.pdf',
          },
        ],
      },
      {
        date: '5 mai – 6 juin 2025',
        type: 'Événement',
        title: 'Challenge Vélo m2A 2025 (5e édition)',
        detail:
          'Près de 150 000 km parcourus ; soirée de remise des prix le 19 juin aux Sheds, à Kingersheim.',
        links: [
          {
            label: 'Communiqué de résultats · © m2A',
            url: 'https://www.m2a.fr/wp-content/uploads/2025/06/CP-m2A-Resultats-du-Challenge-Velo-m2A-2025-Fete-du-Velo-m2A.pdf',
          },
          {
            label: 'Article m2A le mag',
            url: 'https://mag.mulhouse-alsace.fr/challenge-velo-m2a-clap-de-fin-pour-ledition-2025/',
          },
        ],
      },
      {
        date: '29 juin 2025',
        type: 'Événement',
        title: '3e Fête du Vélo m2A',
        detail: 'Village Vélo et animations ludiques et sportives, Espace Tival, Kingersheim.',
        links: [
          {
            label: 'Article m2A le mag',
            url: 'https://mag.mulhouse-alsace.fr/en-route-pour-la-fete-du-velo-m2a-2025/',
          },
        ],
      },
      {
        date: '4 mai – 5 juin 2026',
        type: 'Événement',
        title: 'Challenge Vélo m2A 2026 (6e édition)',
    img: 'assets/evenementiel/challenge-velo-2026.webp',
    alt: 'Trophées en bois du Challenge Vélo m2A, gravés du logo de l’événement.',
        detail:
          '160 427 km parcourus, un record ; soirée de remise des prix le 25 juin à la Maison du Territoire, à Sausheim.',
        links: [
          {
            label: 'Communiqué de résultats · © m2A',
            url: 'https://www.m2a.fr/wp-content/uploads/2026/06/CP-m2A-Resultats-du-Challenge-Velo-m2A-2026.pdf',
          },
          {
            label: 'Article m2A le mag',
            url: 'https://mag.mulhouse-alsace.fr/challenge-velo-m2a-2026-bravo-a-lensemble-des-participants/',
          },
        ],
      },
      {
        date: 'Mars 2025',
        type: 'Lancement',
        title: 'Six bornes de recharge pour véhicules électriques à Riedisheim',
        detail:
          'Mise en service des 3 premières bornes, dans un déploiement de 338 points de recharge sur l’agglomération.',
        links: [
          {
            label: 'Communiqué · © m2A',
            url: 'https://www.m2a.fr/wp-content/uploads/2025/04/CP-m2A-m2A-deploie-six-bornes-de-recharge-pour-vehicules-electriques-a-Riedisheim.pdf',
          },
        ],
      },
      {
        date: 'Rentrée 2026',
        type: 'Lancement',
        title: '« m2A Mobilités », plateforme numérique des déplacements',
    img: 'assets/evenementiel/m2a-mobilites.webp',
    alt: 'Tramway jaune Soléa en circulation dans le centre de Mulhouse.',
        detail:
          'Plateforme des déplacements et paiement sans contact sur toutes les lignes bus, tramway et tram-train.',
        links: [
          {
            label: 'Article m2A le mag',
            url: 'https://mag.mulhouse-alsace.fr/mobilites-m2a-innove-et-facilite-tous-vos-deplacements/',
          },
        ],
      },
      {
        date: '12 mars 2026',
        type: 'Lancement',
        title: 'Covoiturage « BlaBlaCar Daily » soutenu par m2A',
        detail: 'Lancement du covoiturage du quotidien sur l’agglomération.',
        links: [
          {
            label: 'Article m2A le mag',
            url: 'https://mag.mulhouse-alsace.fr/covoiturage-simplifiez-vos-trajets-avec-blablacar-daily/',
          },
        ],
      },
      {
        date: '13 février 2025',
        type: 'Campagne',
        title: '« Soléa : tous mobilisés pour la sécurité ! »',
    img: 'assets/evenementiel/campagne-solea-securite.webp',
    alt: 'Bus Soléa jaune « 100 % biogaz » stationné au dépôt.',
        detail: 'Campagne d’affichage interactive mensuelle sur le réseau Soléa.',
        links: [
          {
            label: 'Article m2A le mag',
            url: 'https://mag.mulhouse-alsace.fr/solea-tous-mobilises-pour-la-securite/',
          },
        ],
      },
    ],
  },
  {
    id: 'solea',
    label: 'Soléa',
    events: [
      {
        date: '12 septembre 2026',
        type: 'Événement',
        title: '20 ans du tram de Mulhouse',
    img: 'assets/evenementiel/20-ans-tram.webp',
    alt: 'Rame de tramway Soléa habillée aux couleurs des 20 ans du tram, avec l’inscription "20 ans du tram" sur la vitre.',
        detail:
          'Fête d’anniversaire, Square de la Bourse : bus vintage, musiciens, jeux en famille, exposition photos.',
        links: [
          {
            label: 'Post Facebook m2A',
            url: 'https://www.facebook.com/Mulhouse.Alsace.Agglomeration/posts/pfbid0jdHppkv54iBN1aqtLDc5SxP3PUrGMNpdSbNXDvdGS9FzKTc3TrLhTY1mVWbe1bvsl',
          },
        ],
      },
      {
        date: '4 juillet – 26 septembre 2026',
        type: 'Opération',
        title: 'Réseau Soléa gratuit tous les samedis de l’été',
    img: 'assets/evenementiel/solea-gratuit-ete-2026.webp',
    alt: 'Rame de tramway Soléa aux couleurs de l’offre d’été, avec l’inscription "Tous les samedis de l’été gratuits".',
        detail: 'Bus, tram, transport à la demande et parkings-relais offerts chaque samedi.',
        links: [
          {
            label: 'Article m2A le mag',
            url: 'https://mag.mulhouse-alsace.fr/profitez-gratuitement-du-reseau-solea-tous-les-samedis-ete-2026/',
          },
        ],
      },
      {
        date: 'Septembre 2025 et septembre 2026',
        type: 'Opération',
        title: '« Osons Soléa dans l’agglo ! »',
    img: 'assets/evenementiel/osons-solea.webp',
    alt: 'Rampe d’accès déployée à la porte d’un bus jaune Soléa.',
        detail:
          'Opération inclusive : des personnes en situation de handicap découvrent lieux culturels et sportifs en empruntant le réseau Soléa ; plus de 200 personnes en 2026.',
        links: [
          {
            label: 'Article m2A le mag (2026)',
            url: 'https://mag.mulhouse-alsace.fr/osons-solea-dans-lagglo-lacces-aux-mobilites-et-a-la-culture-pour-tous/',
          },
        ],
      },
    ],
  },
  {
    id: 'sport',
    label: 'Sport',
    events: [
      {
        date: 'Juin 2025',
        type: 'Événement',
        title: 'Olympiades scolaires m2A 2025 (3e édition)',
        detail:
          'Plus de 1 770 élèves accueillis dans les équipements aquatiques de l’agglomération, autour du savoir-nager, avec l’Éducation nationale.',
        links: [
          {
            label: 'Article m2A le mag',
            url: 'https://mag.mulhouse-alsace.fr/olympiades-scolaires-m2a-2025-un-temps-fort-autour-du-savoir-nager/',
          },
          {
            label: 'Communiqué · © m2A',
            url: 'https://www.m2a.fr/wp-content/uploads/2025/05/CP-m2A-Olympiades-m2A-2025.pdf',
          },
        ],
      },
      {
        date: 'Avril – juin 2026',
        type: 'Événement',
        title: 'Olympiades scolaires m2A 2026 (4e édition)',
        detail:
          'Plus de 1 600 élèves dans 5 équipements aquatiques : piscines de l’Illberg, des Jonquilles, bassin de la Doller, Aquarhin, Île Napoléon.',
        links: [
          {
            label: 'Communiqué · © m2A',
            url: 'https://www.m2a.fr/wp-content/uploads/2026/04/CP-m2A-Olympiades-scolaires-m2A-2026.pdf',
          },
        ],
      },
      {
        date: 'Été 2025 et été 2026',
        type: 'Événement',
        title: 'Bilan estival des piscines et du plan d’eau',
    img: 'assets/evenementiel/bilan-estival-piscines.webp',
    alt: 'Le Plan d’eau de l’agglomération un jour d’été, avec sa plage, ses parasols et ses baigneurs au loin sous un ciel bleu.',
        detail: 'Nouveau record d’affluence à l’été 2026 pour les piscines et le plan d’eau de l’agglomération.',
        links: [
          {
            label: 'Communiqué 2026 · © m2A',
            url: 'https://www.m2a.fr/wp-content/uploads/2026/09/CP-m2A-Bilan-estival-Nouveau-record-daffluence-pour-les-piscines-et-le-Plan-deau-de-m2A.pdf',
          },
        ],
      },
      {
        date: '1er – 2 novembre 2024',
        type: 'Événement',
        title: '« Pack Sport Clubs & m2A », week-end sport élite',
    img: 'assets/evenementiel/pack-sport-clubs.webp',
    alt: 'Match de volley au Palais des Sports de Mulhouse, les joueuses en action au filet devant des tribunes pleines.',
        detail:
          'Pass unique pour assister aux matchs des clubs élites de l’agglomération sur un même week-end.',
        links: [
          {
            label: 'Article m2A le mag',
            url: 'https://mag.mulhouse-alsace.fr/pack-sport-clubs-m2a/',
          },
        ],
      },
      {
        date: '30 mars 2025',
        type: 'Événement',
        title: 'Match de gala ASPTT Mulhouse Rixheim (« Les Loups »)',
        detail: 'Retour du handball au Palais des Sports, face à Tremblay.',
        links: [
          {
            label: 'Article m2A le mag',
            url: 'https://mag.mulhouse-alsace.fr/les-loups-de-lasptt-mulhouse-rixheim-au-palais-des-sports/',
          },
        ],
      },
      {
        date: '13 décembre 2024',
        type: 'Événement',
        title: 'Match de gala MBA vs Le Havre',
        detail:
          '100e anniversaire du 1er titre de champion du Mulhouse Basket Agglomération, Palais des Sports « Gilbert Buttazzoni ».',
        links: [
          {
            label: 'Article m2A le mag',
            url: 'https://mag.mulhouse-alsace.fr/match-gala-mulhouse-basket-agglomeration-palais-des-sports-mulhouse/',
          },
        ],
      },
    ],
  },
  {
    id: 'enfance-famille',
    label: 'Enfance & famille',
    events: [
      {
        date: '21 mars 2025',
        type: 'Inauguration',
        title: 'Groupe scolaire et périscolaire Simone Veil, Mulhouse',
    img: 'assets/evenementiel/groupe-scolaire-simone-veil.webp',
    alt: 'Cour intérieure du groupe scolaire Simone-Veil à Mulhouse, bâtiment en bois et aire de jeux vide.',
        detail: 'Périscolaire géré par m2A (555 m², 134 enfants), dans le cadre du Plan écoles.',
        links: [
          {
            label: 'Communiqué Ville de Mulhouse · © m2A',
            url: 'https://www.m2a.fr/wp-content/uploads/2025/03/Ville-de-Mulhouse-CP-Inauguration-du-groupe-scolaire-Simone-Veil.pdf',
          },
        ],
      },
      {
        date: '25 avril 2025',
        type: 'Inauguration',
        title: 'Multi-Accueil « La Grande Ourse », Illzach',
    img: 'assets/evenementiel/multi-accueil-grande-ourse.webp',
    alt: 'Façade colorée du multi-accueil La Grande Ourse à Illzach et sa cour extérieure vide.',
        detail: 'Crèche neuve de ~700 m², 50 places, maîtrise d’ouvrage m2A.',
        links: [
          {
            label: 'Dossier de presse · © m2A',
            url: 'https://www.m2a.fr/wp-content/uploads/2025/04/DP-m2A-Inauguration-du-Multi-Accueil-La-Grande-Ourse-a-Illzach.pdf',
          },
        ],
      },
      {
        date: '24 juin 2025',
        type: 'Inauguration',
        title: 'Périscolaire Lyautey, Riedisheim',
    img: 'assets/evenementiel/periscolaire-lyautey.webp',
    alt: 'Salle d’activités vide du périscolaire Lyautey à Riedisheim, tables et chaises près des grandes baies vitrées.',
        detail:
          'Nouveau bâtiment de ~800 m², 112 places le midi et 56 le soir, co-maîtrise d’ouvrage m2A–Riedisheim.',
        links: [
          {
            label: 'Dossier de presse · © m2A',
            url: 'https://www.m2a.fr/wp-content/uploads/2025/06/DP-m2A-Inauguration-du-periscolaire-Lyautey-a-Riedisheim.pdf',
          },
        ],
      },

      {
        date: '28 janvier – 8 février 2026',
        type: 'Événement',
        title: 'Festival Momix 2026 (35e édition)',
    img: 'assets/evenementiel/festival-momix-2026.webp',
    alt: 'Sculptures en bois du spectacle La Cité du peuple de bois, installées sur une pelouse, pour le festival Momix 2026.',
        detail: 'Spectacle jeune public, à Kingersheim et dans les communes de l’agglomération.',
        links: [
          {
            label: 'Article m2A le mag',
            url: 'https://mag.mulhouse-alsace.fr/festival-momix-2026-un-voyage-artistique-culturel/',
          },
        ],
      },





    ],
  },
];
