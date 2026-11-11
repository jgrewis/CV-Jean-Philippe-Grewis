// Configuration du visage interactif (#hero) : source unique, lue par
// src/components/Hero.js. Aucune valeur de ce fichier n'est ecrite en dur ailleurs.
//
// Principe
// --------
//   Le portrait de base est affiche. Sous le pointeur (ou le doigt), un calque
//   "accessoire" parfaitement superpose se revele par taches douces qui
//   s'effacent seules. Le bouton (libelle `label`) revele le calque entier.
//
// Un calque accessoire est SOIT :
//   - `src` : une image de MEMES dimensions que le portrait, alignee au pixel
//     (cas final : meme photo, avec l'accessoire en plus) ;
//   - `svg` : un dessin au trait (repli provisoire), place en coordonnees
//     RELATIVES au portrait : `box.x` et `box.width` en fraction de la largeur,
//     `box.y` en fraction de la hauteur ; la hauteur du dessin decoule de son
//     viewBox. Chaque forme porte un `tone` que Hero.js traduit en couleurs de
//     la charte (tokens.css) : paper (aplat papier, trait encre), ink (trait
//     encre), accent (trait violet), accent-solid (aplat violet), glass (aplat
//     encre : la lentille), highlight (trait papier : reflet sur la lentille).
//   Si les deux sont presents, `src` l'emporte.
//
// Choix de l'accessoire : UN PAR VISITE, tire au hasard au montage de la page
// (Hero.js, pickAccessory). Avec un seul accessoire, c'est toujours lui. On a
// prefere le tirage a l'enchainement : l'effet reste une surprise a chaque visite
// et il n'y a aucun minuteur qui tourne en tache de fond.
//
// Brancher les images ChatGPT (voir PLAN-visage-et-realisations.md §9)
// ---------------------------------------------------------------------
//   1. Deposer dans public/assets/hero/ :
//        portrait.webp        (portrait seul)
//        appareil-photo.webp  (meme image + appareil photo, meme cadrage, memes dimensions)
//      Puis, pour chaque accessoire suivant : casque-audio.webp, micro.webp...
//   2. `portrait` : src 'assets/hero/portrait.webp', width/height = dimensions
//      reelles du fichier, retirer `maxDisplayWidth` (l'image HD peut occuper
//      toute la hauteur disponible).
//   3. Accessoire : renseigner `src: 'assets/hero/appareil-photo.webp'` avec les
//      MEMES width/height que le portrait, et supprimer la cle `svg`.
//   4. Supprimer public/assets/hero/portrait-provisoire.webp.
//   Si les deux images ne se superposent pas exactement, le contour de la tache
//   laisse voir un decalage : les recaler avant de les deposer.

// Interrupteur de l'effet au pointeur (calque accessoire + consigne + bouton).
// Desactive tant que le portrait HD et les visuels IA superposables (PLAN §9)
// ne sont pas livres : le dessin SVG provisoire n'est ni monte ni charge.
// Pour reactiver : passer `enabled` a true (rien d'autre a toucher).
export const effect = {
  enabled: false,
};

// Accroche et chiffres cles affiches sous le nom, dans le premier ecran.
// Chiffres m2A valides (communiques de presse officiels, voir cv.js).
export const pitch = {
  text: 'Chef de projet communication · Disponible · Mulhouse / Colmar',
  kpis: [
    { value: '1 125', label: 'participants au Challenge Vélo m2A 2026' },
    { value: '160 427 km', label: 'parcourus au Challenge Vélo 2026' },
    { value: '236 384', label: 'entrées dans les piscines m2A, été 2026' },
  ],
};

export const portrait = {
  // Provisoire : la photo actuelle du CV (246 x 245, detouree en rond), en WebP
  // sans perte. Remplacee par le portrait HD genere avec ChatGPT.
  src: 'assets/hero/portrait-provisoire.webp',
  width: 246,
  height: 245,
  alt: 'Portrait de Jean-Philippe Grewis, souriant, lunettes et polo sombre.',
  // Largeur d'affichage maximale en px CSS. Photo provisoire de 246 px : on reste
  // sous sa taille reelle pour qu'elle reste nette (320 avant, visiblement flou).
  // A remonter (ou supprimer) avec le portrait HD.
  maxDisplayWidth: 200,
};

export const accessories = [
  {
    id: 'appareil-photo',
    label: "Voir l'appareil photo",
    width: 246,
    height: 245,
    // Repli provisoire : reflex vu de face, tenu devant l'oeil droit de JP (a
    // gauche a l'ecran, oeil vers x = 0.41, y = 0.38 du portrait). Le viseur
    // (le prisme) est a hauteur de l'oeil, l'objectif juste en dessous.
    svg: {
      box: { x: 0.179, y: 0.306, width: 0.455 },
      viewBox: [0, 0, 120, 80],
      strokeWidth: 2.2,
      shapes: [
        // Boitier, puis prisme du viseur par-dessus
        { tag: 'rect', tone: 'paper', attrs: { x: 4, y: 22, width: 112, height: 50, rx: 8 } },
        { tag: 'path', tone: 'paper', attrs: { d: 'M40 22 L47 8 H73 L80 22 Z' } },
        // Poignee (a gauche a l'ecran) et sabot flash
        { tag: 'path', tone: 'ink', attrs: { d: 'M26 26 V68' } },
        { tag: 'path', tone: 'ink', attrs: { d: 'M53 8 V4 H67 V8' } },
        // Declencheur et molette, en accent
        { tag: 'rect', tone: 'accent-solid', attrs: { x: 10, y: 16, width: 12, height: 6, rx: 2 } },
        { tag: 'rect', tone: 'paper', attrs: { x: 92, y: 17, width: 14, height: 5, rx: 2 } },
        // Voyant d'autofocus
        { tag: 'circle', tone: 'accent-solid', attrs: { cx: 100, cy: 32, r: 3 } },
        // Objectif : bague exterieure, bague de mise au point, lentille
        { tag: 'circle', tone: 'paper', attrs: { cx: 60, cy: 50, r: 27 } },
        { tag: 'circle', tone: 'accent', attrs: { cx: 60, cy: 50, r: 21, 'stroke-width': 3 } },
        { tag: 'circle', tone: 'glass', attrs: { cx: 60, cy: 50, r: 13 } },
        { tag: 'path', tone: 'highlight', attrs: { d: 'M53 45 A8 8 0 0 1 60 41' } },
      ],
    },
  },
];
