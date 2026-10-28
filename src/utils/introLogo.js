// Logo de l'intro (tache T2) : monogramme "JPG" seul a 0,3 s, puis glitch pixel
// qui fait apparaitre "Jean-Philippe Grewis" entre 0,8 et 1,05 s.
//
// Contrat avec Intro.js :
// - mountIntroLogo(container) est appele une fois, a la construction du calque,
//   AVANT son insertion dans le DOM.
// - container = div.intro__logo, position absolue plein ecran, contenu centre
//   (grille, place-items: center), aria-hidden, pointer-events: none.
// - Le visuel se declenche en CSS (styles/intro-logo.css) sur les attributs du calque :
//     .intro[data-phase="logo"]     0,3 s : monogramme seul
//     .intro[data-phase="name"]     0,8 s : glitch puis nom (duree var(--intro-glitch-dur), 250ms)
//     .intro[data-phase="slit"]     1,6 s : le trait passe par-dessus le logo
//     .intro[data-reached~="name"]  "depuis la phase name" (cumulatif, pour l'etat tenu)
//   Avant 0,3 s (data-phase="lines") le logo doit etre invisible.
// - Retour facultatif : une fonction de nettoyage, appelee juste avant le retrait du calque.
//   Rien a nettoyer ici (ni ecouteur ni minuteur : tout est en CSS), donc pas de retour.
// - Pas d'innerHTML : le SVG est construit avec createElementNS et le nom en textContent.
//
// Structure produite (lockup sur UNE ligne, centre a 50 % de la hauteur pour que
// le trait de la phase slit le raye en son milieu) :
//   .intro__lockup            ecrasement vers la ligne a la phase slit
//     .intro__track           rangee monogramme + nom ; decalee tant que le nom est
//                             cache, pour que le monogramme seul soit au centre
//       .intro__monogram      boite de taille fixe, trois calques superposes :
//         --bare              JPG nu (affiche seul, puis se defait)
//         --ghost             copie fantome qui se decale pendant le glitch
//         --framed            JPG dans un cadre octogonal (etat final)
//       .intro__name          une span par lettre, revelees de droite a gauche

const SVG_NS = 'http://www.w3.org/2000/svg';
const FULL_NAME = 'Jean-Philippe Grewis';

// Monogramme dessine sur une grille de 22 x 10 unites : futs de 2 unites, lettres
// separees de 2 unites. Les coins exterieurs des courbes sont "arrondis" par une
// marche d'une unite (une demi-epaisseur), comme un pixel retire : c'est ce qui
// donne le caractere pixel sans perdre la lisibilite. Traces orthogonaux d'un seul
// tenant (pas de rectangles juxtaposes) : aucune couture d'anticrenelage.
const GLYPHS_VIEWBOX = '0 0 22 10';
const GLYPH_PATHS = [
  // J : fut a droite, crochet en bas, ergot a gauche.
  'M3 0H5V9H4V10H1V9H0V6H2V8H3Z',
  // P : fut + panse de 6 x 6, contre-forme de 2 x 2 (evenodd).
  'M7 0H12V1H13V5H12V6H9V10H7Z M9 2V4H11V2Z',
  // G : barre haute, fut gauche, barre basse, fut droit et eperon a mi-hauteur.
  'M16 0H22V2H17V8H20V6H19V4H22V9H21V10H16V9H15V1H16Z',
];

// Version encadree : memes lettres, centrees dans un cadre de 30 x 18 unites
// (3 unites d'air tout autour). Le cadre a des chanfreins a 45 degres : c'est un
// octogone, le meme motif que l'ouverture qui devoile la page.
const FRAMED_VIEWBOX = '0 0 30 18';
const FRAMED_GLYPHS_OFFSET = 'translate(4 4)';
const FRAME_PATH = 'M3.5 0.5H26.5L29.5 3.5V14.5L26.5 17.5H3.5L0.5 14.5V3.5Z';
const FRAME_STROKE = '1';

// Revelation du nom par la fin. Le glitch dure 15 images (250 ms a 60 i/s) ; les
// delais sont arrondis a l'image pour que les lettres surgissent par paquets (les
// dernieres lettres en fragments, puis presque tout le mot, puis le debut), comme
// dans la reference, et non en balayage regulier.
const GLITCH_FRAMES = 15;
const CHAR_DELAY_START = 0.08; // fraction du glitch : la 1re lettre (la derniere du nom) part ici
const CHAR_DELAY_SPAN = 0.52; // la lettre la plus a gauche part a START + SPAN
const CHAR_DELAY_CURVE = 1.3; // > 1 : les lettres de droite se suivent de pres
// Petit desordre deterministe (en images) : sans lui, l'ordre strict droite -> gauche
// se lit comme un simple volet ; avec, on lit un signal qui se recompose.
const CHAR_JITTER_FRAMES = [0, 1, -1, 0, 1, -1, 0];

function createSvg(viewBox, className) {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('viewBox', viewBox);
  svg.setAttribute('class', className);
  svg.setAttribute('focusable', 'false');
  return svg;
}

function appendGlyphs(parent) {
  GLYPH_PATHS.forEach((d) => {
    const path = document.createElementNS(SVG_NS, 'path');
    path.setAttribute('d', d);
    path.setAttribute('fill', 'currentColor');
    path.setAttribute('fill-rule', 'evenodd');
    parent.append(path);
  });
}

function createLayer(modifier) {
  const layer = document.createElement('span');
  layer.className = `intro__mono-layer intro__mono-layer--${modifier}`;
  return layer;
}

function createBareLayer(modifier) {
  const layer = createLayer(modifier);
  const svg = createSvg(GLYPHS_VIEWBOX, 'intro__mono-svg intro__mono-svg--bare');
  appendGlyphs(svg);
  layer.append(svg);
  return layer;
}

function createFramedLayer() {
  const layer = createLayer('framed');
  const svg = createSvg(FRAMED_VIEWBOX, 'intro__mono-svg');

  const frame = document.createElementNS(SVG_NS, 'path');
  frame.setAttribute('d', FRAME_PATH);
  frame.setAttribute('fill', 'none');
  frame.setAttribute('stroke', 'currentColor');
  frame.setAttribute('stroke-width', FRAME_STROKE);

  const glyphs = document.createElementNS(SVG_NS, 'g');
  glyphs.setAttribute('transform', FRAMED_GLYPHS_OFFSET);
  appendGlyphs(glyphs);

  svg.append(frame, glyphs);
  layer.append(svg);
  return layer;
}

function createMonogram() {
  const monogram = document.createElement('span');
  monogram.className = 'intro__monogram';
  monogram.append(createBareLayer('bare'), createBareLayer('ghost'), createFramedLayer());
  return monogram;
}

// Delai d'une lettre, en fraction de la duree du glitch (lu par le CSS dans
// --intro-char-delay). reverseIndex = 0 pour la derniere lettre du nom.
function charDelay(reverseIndex, count) {
  const progress = count > 1 ? reverseIndex / (count - 1) : 0;
  const raw = CHAR_DELAY_START + CHAR_DELAY_SPAN * progress ** CHAR_DELAY_CURVE;
  const jitter = CHAR_JITTER_FRAMES[reverseIndex % CHAR_JITTER_FRAMES.length];
  const frame = Math.max(1, Math.round(raw * GLITCH_FRAMES) + jitter);
  return frame / GLITCH_FRAMES;
}

function createName() {
  const name = document.createElement('span');
  name.className = 'intro__name';

  const chars = [...FULL_NAME];
  chars.forEach((char, index) => {
    const span = document.createElement('span');
    span.className = 'intro__char';
    span.textContent = char;
    const reverseIndex = chars.length - 1 - index;
    span.style.setProperty('--intro-char-delay', charDelay(reverseIndex, chars.length).toFixed(3));
    // Sens du decalage alterne : les tranches partent tantot a gauche, tantot a
    // droite, ce qui casse l'effet de bloc qui glisse d'un seul tenant.
    span.style.setProperty('--intro-char-flip', index % 2 === 0 ? '1' : '-1');
    name.append(span);
  });
  return name;
}

export function mountIntroLogo(container) {
  const lockup = document.createElement('div');
  lockup.className = 'intro__lockup';

  const track = document.createElement('div');
  track.className = 'intro__track';
  track.append(createMonogram(), createName());

  lockup.append(track);
  container.append(lockup);
}
