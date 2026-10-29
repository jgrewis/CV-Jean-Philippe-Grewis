// Section #realisations : les preuves de travail (data/realisations.js), une
// rangee par support, photos disseminees a gauche et a droite d'une grille
// editoriale de 12 colonnes, chacune sous une micro-legende en capitales.
//
// Contrat (pose par Page.js)
// --------------------------
//   export function mountRealisations(section) -> (() => void) | void
//   - section : <section id="realisations" data-tone="alt"> vide, deja inseree
//     dans <main>. Le titre porte id="realisations-title" (createSectionHead).
//   - La mention `credit` reste visible (droits : PLAN-visage-et-realisations.md §5).
//   - Les legendes portent data-reveal : Page.js les observe juste apres le montage.
//   - Retour : nettoyage des observateurs, ecouteurs et du requestAnimationFrame en attente.
//
// Mise en page
// ------------
//   La largeur de chaque image (en colonnes) decoule de son ratio : un panoramique
//   s'etale, un portrait reste etroit, ce qui evite des images demesurement hautes.
//   Deux images partagent une rangee si elles tiennent avec une colonne d'air,
//   sinon l'image est seule, alternativement a gauche et a droite. Les positions
//   sont calculees ici et passees au CSS en variables : sous 48em le CSS les
//   ignore et tout passe sur une colonne.
//
// Mouvement (coupe si prefers-reduced-motion ou sans IntersectionObserver)
// ---------
//   - Devoilement de l'image par clip-path a l'entree, puis passage du noir et
//     blanc a la couleur quand elle est bien visible (effet a un coup).
//   - Profondeur : chaque preuve glisse un peu plus ou moins vite que la page.
//     Un seul requestAnimationFrame par evenement scroll, limite aux preuves
//     visibles ; toutes les lectures de position, puis toutes les ecritures.
import { credit, supports, realisations } from '../data/realisations.js';
import { createEl } from '../utils/dom.js';
import { createSectionHead } from './sections/sectionHead.js';

const TITLE = 'Réalisations';
const EYEBROW = 'Preuves de travail';
const INTRO =
  'Une sélection de supports publiés, de l’affiche de 4 × 3 m au post pour les réseaux sociaux, classés par support.';
const META_SEPARATOR = ' · ';

// ---------- Grille ----------

const GRID_COLUMNS = 12;
const MIN_SPAN = 3;
const MAX_SPAN = 10; // meme un panoramique garde de l'air sur les cotes
const MIN_AIR_COLUMNS = 1; // ecart minimal entre deux images d'une meme rangee
// Largeur de base selon le ratio largeur / hauteur (premier palier atteint).
const SPAN_BY_RATIO = [
  { minRatio: 2.2, span: 10 }, // panoramique (bache 1600 x 496)
  { minRatio: 1.6, span: 7 }, // paysage allonge
  { minRatio: 1.15, span: 6 }, // paysage
  { minRatio: 0.85, span: 5 }, // carre
  { minRatio: 0.6, span: 4 }, // portrait
  { minRatio: 0, span: 3 }, // tres haut (drapeaux, kakemonos)
];
// Petit ecart d'une colonne, en cycle : deux images de meme ratio n'ont pas
// exactement la meme largeur, la grille parait composee et non mecanique.
const SPAN_NUDGES = [0, 1, -1, 0];
// Retrait (en colonnes) des images seules sur leur rangee, en cycle.
const SINGLE_INSETS = [0, 1, 2];

// ---------- Mouvement ----------

// Facteur de profondeur par preuve, en cycle : negatif = l'image passe devant
// (plus vite que la page), positif = derriere (plus lentement). |facteur| <= 1.
const DEPTH_FACTORS = [0.9, 0.35, -0.5, 0.65, 1, -0.3, 0.5];
// Amplitude maximale du glissement, en part de l'ecart entre deux rangees. Deux
// preuves voisines se rapprochent au pire de 2 x 0.4 = 80 % de cet ecart : il
// reste toujours de l'air, aucun chevauchement possible.
const PARALLAX_GAP_SHARE = 0.4;
// Part de l'image visible a partir de laquelle elle passe en couleur.
const COLOR_RATIO = 0.5;
// Devoilement un peu avant que l'image n'atteigne le bas de l'ecran (comme reveal.js).
const ENTER_MARGIN = '0px 0px -10% 0px';
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';
const MOTION_CLASS = 'realisations--motion';
const ENTERED_CLASS = 'is-entered';
const COLORED_CLASS = 'is-colored';
const RATIO_DECIMALS = 4;

// ---------- Mise en page (calcul pur) ----------

function spanFor(ratio, index) {
  const tier = SPAN_BY_RATIO.find(({ minRatio }) => ratio >= minRatio) ?? SPAN_BY_RATIO.at(-1);
  const nudged = tier.span + SPAN_NUDGES[index % SPAN_NUDGES.length];
  return Math.min(MAX_SPAN, Math.max(MIN_SPAN, nudged));
}

/**
 * Place les preuves d'un support sur la grille de 12 colonnes.
 * @returns {{ row: number, colStart: number, span: number, end: boolean, drop: boolean }[]}
 *   une position par preuve, dans l'ordre des donnees (= ordre de lecture).
 */
function layoutGroup(items) {
  const spans = items.map((item, index) => spanFor(item.width / item.height, index));
  const places = [];
  let row = 1;
  let singles = 0;
  let index = 0;

  while (index < spans.length) {
    const spanA = spans[index];
    const spanB = spans[index + 1];
    const isPair = spanB !== undefined && spanA + spanB + MIN_AIR_COLUMNS <= GRID_COLUMNS;
    const even = row % 2 === 0;

    if (isPair) {
      // L'eventuelle colonne libre en trop passe a l'exterieur d'une des deux
      // images (a tour de role) ; l'autre image de la rangee descend d'un cran.
      const outer = GRID_COLUMNS - spanA - spanB >= MIN_AIR_COLUMNS + 1 ? 1 : 0;
      places.push(
        { row, colStart: 1 + (even ? outer : 0), span: spanA, end: false, drop: !even },
        { row, colStart: GRID_COLUMNS + 1 - spanB - (even ? 0 : outer), span: spanB, end: true, drop: even },
      );
      index += 2;
    } else {
      const end = singles % 2 === 1;
      const inset = Math.min(SINGLE_INSETS[singles % SINGLE_INSETS.length], GRID_COLUMNS - spanA);
      const colStart = end ? GRID_COLUMNS + 1 - spanA - inset : 1 + inset;
      places.push({ row, colStart, span: spanA, end, drop: false });
      singles += 1;
      index += 1;
    }
    row += 1;
  }
  return places;
}

// ---------- Construction ----------

function formatCount(count) {
  return `${count} ${count > 1 ? 'pièces' : 'pièce'}`;
}

function createIntro() {
  return createEl('div', {
    className: 'realisations__intro',
    attrs: { 'data-reveal': '', 'data-reveal-delay': 1 },
    children: [
      createEl('p', { className: 'realisations__lead', text: INTRO }),
      createEl('p', { className: 'caption realisations__credit', text: credit }),
    ],
  });
}

function createFigure(proof, supportLabel) {
  const meta = [supportLabel, proof.theme].filter(Boolean).join(META_SEPARATOR);
  const caption = createEl('figcaption', {
    className: 'realisations__caption',
    attrs: { 'data-reveal': '' },
    children: [
      createEl('p', { className: 'caption realisations__meta', text: meta }),
      createEl('p', { className: 'realisations__title', text: proof.title }),
    ],
  });

  // width / height reels : la place est reservee avant le chargement (aucun saut
  // de mise en page) ; src relatif tel quel, resolu par rapport a la page.
  const img = createEl('img', {
    className: 'realisations__img',
    attrs: {
      src: proof.src,
      alt: proof.alt ?? '',
      width: proof.width,
      height: proof.height,
      loading: 'lazy',
      decoding: 'async',
    },
  });
  const frame = createEl('div', { className: 'realisations__frame', children: [img] });
  // Ratio et largeur reelle pour le CSS : le cadre ne depasse ni la taille du
  // fichier (pas d'agrandissement flou) ni une hauteur d'ecran raisonnable.
  frame.style.setProperty('--ratio', (proof.width / proof.height).toFixed(RATIO_DECIMALS));
  frame.style.setProperty('--natural-w', `${proof.width}px`);

  return { figure: createEl('figure', { className: 'realisations__figure', children: [caption, frame] }), frame };
}

function createItem(proof, place, supportLabel) {
  const { figure, frame } = createFigure(proof, supportLabel);
  const modifiers = [place.end ? 'realisations__item--end' : '', place.drop ? 'realisations__item--drop' : '']
    .filter(Boolean)
    .join(' ');
  const item = createEl('li', {
    className: modifiers ? `realisations__item ${modifiers}` : 'realisations__item',
    children: [figure],
  });
  item.style.setProperty('--row', String(place.row));
  item.style.setProperty('--col-start', String(place.colStart));
  item.style.setProperty('--col-span', String(place.span));
  return { item, frame };
}

function createGroup(support, proofs, collected) {
  const titleId = `realisations-${support.id}`;
  const head = createEl('header', {
    className: 'realisations__group-head',
    attrs: { 'data-reveal': '' },
    children: [
      createEl('h3', { className: 'realisations__group-title', text: support.label, attrs: { id: titleId } }),
      createEl('p', { className: 'keyword realisations__count', text: formatCount(proofs.length) }),
    ],
  });

  const grid = createEl('ul', { className: 'realisations__grid', attrs: { 'aria-labelledby': titleId } });
  const places = layoutGroup(proofs);
  proofs.forEach((proof, index) => {
    const { item, frame } = createItem(proof, places[index], support.label);
    grid.append(item);
    collected.push({ item, frame, depth: DEPTH_FACTORS[collected.length % DEPTH_FACTORS.length] });
  });

  return { element: createEl('div', { className: 'realisations__group', children: [head, grid] }), grid };
}

// ---------- Mouvement ----------

function canAnimate() {
  if (!('IntersectionObserver' in window)) return false;
  return !window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

/**
 * Devoilement, noir et blanc vers couleur et profondeur.
 * @param {HTMLElement} section
 * @param {HTMLElement} grid  une grille de reference pour lire l'ecart entre rangees
 * @param {{ item: HTMLElement, frame: HTMLElement, depth: number }[]} entries
 * @returns {() => void}
 */
function startMotion(section, grid, entries) {
  const reducedMotion = window.matchMedia(REDUCED_MOTION_QUERY);
  const depthOf = new Map(entries.map(({ item, depth }) => [item, depth]));
  const shifts = new Map(); // glissement courant, retire des mesures pour retrouver la position de mise en page
  const visible = new Set();
  let maxShift = 0;
  let gapDirty = true;
  let frameId = 0;
  let stopped = false;

  const update = () => {
    frameId = 0;
    // Lectures d'abord (ecart, hauteur d'ecran, positions)...
    if (gapDirty) {
      maxShift = (Number.parseFloat(getComputedStyle(grid).rowGap) || 0) * PARALLAX_GAP_SHARE;
      gapDirty = false;
    }
    const half = window.innerHeight / 2;
    const next = [...visible].map((item) => {
      const rect = item.getBoundingClientRect();
      const center = rect.top - (shifts.get(item) ?? 0) + rect.height / 2;
      // -1 quand la preuve entre par le bas, 0 au milieu de l'ecran, 1 quand elle sort par le haut.
      const progress = clamp((half - center) / (half + rect.height / 2), -1, 1);
      return [item, progress * depthOf.get(item) * maxShift];
    });
    // ... puis toutes les ecritures : aucun recalcul de mise en page force.
    next.forEach(([item, shift]) => {
      shifts.set(item, shift);
      item.style.transform = `translate3d(0, ${shift.toFixed(1)}px, 0)`;
    });
  };

  const schedule = () => {
    if (frameId) return;
    frameId = requestAnimationFrame(update);
  };

  const onResize = () => {
    gapDirty = true;
    schedule();
  };

  const visibility = new IntersectionObserver((records) => {
    records.forEach(({ target, isIntersecting }) => {
      if (isIntersecting) visible.add(target);
      else visible.delete(target);
    });
    schedule();
  });

  const reveal = new IntersectionObserver(
    (records) => {
      records.forEach(({ target, isIntersecting, intersectionRatio }) => {
        // Un defilement rapide peut faire traverser une petite image sans que le
        // seuil de couleur soit jamais signale : a sa sortie, elle passe quand
        // meme en couleur, pour ne jamais rester grise au retour.
        const leftAfterEntering = !isIntersecting && target.classList.contains(ENTERED_CLASS);
        if (!isIntersecting && !leftAfterEntering) return;
        target.classList.add(ENTERED_CLASS);
        if (isIntersecting && intersectionRatio < COLOR_RATIO) return;
        target.classList.add(COLORED_CLASS);
        reveal.unobserve(target);
      });
    },
    { rootMargin: ENTER_MARGIN, threshold: [0, COLOR_RATIO] },
  );

  const stop = () => {
    if (stopped) return;
    stopped = true;
    if (frameId) cancelAnimationFrame(frameId);
    window.removeEventListener('scroll', schedule);
    window.removeEventListener('resize', onResize);
    reducedMotion.removeEventListener('change', onPreferenceChange);
    visibility.disconnect();
    reveal.disconnect();
    visible.clear();
  };

  // Si l'utilisateur active la reduction des animations en cours de visite :
  // tout s'arrete et les images s'affichent en couleur, a leur place.
  function onPreferenceChange() {
    if (!reducedMotion.matches) return;
    stop();
    section.classList.remove(MOTION_CLASS);
    entries.forEach(({ item }) => item.style.removeProperty('transform'));
  }

  section.classList.add(MOTION_CLASS);
  entries.forEach(({ item, frame }) => {
    visibility.observe(item);
    reveal.observe(frame);
  });
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', onResize, { passive: true });
  reducedMotion.addEventListener('change', onPreferenceChange);

  return stop;
}

// ---------- Montage ----------

export function mountRealisations(section) {
  section.classList.add('section', 'realisations');

  const entries = [];
  const groups = supports
    .map((support) => ({ support, proofs: realisations.filter((proof) => proof.support === support.id) }))
    .filter(({ proofs }) => proofs.length > 0)
    .map(({ support, proofs }) => createGroup(support, proofs, entries));

  const wrap = createEl('div', {
    className: 'wrap realisations__wrap',
    children: [
      createEl('div', {
        className: 'realisations__head',
        children: [createSectionHead(section, { eyebrow: EYEBROW, title: TITLE }), createIntro()],
      }),
      createEl('div', { className: 'realisations__groups', children: groups.map(({ element }) => element) }),
    ],
  });
  section.replaceChildren(wrap);

  if (!groups.length || !canAnimate()) return undefined;
  return startMotion(section, groups[0].grid, entries);
}
