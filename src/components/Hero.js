// Section #hero : le visage interactif. Le portrait s'affiche en grand ; la ou
// passe le pointeur (souris, stylet ou doigt), un calque accessoire parfaitement
// superpose (appareil photo...) se revele par taches douces qui s'effacent seules
// en ~1,2 s. Un bouton revele le calque entier : c'est le moyen d'acces au
// clavier, et le seul quand les animations sont reduites.
//
// Contrat (pose par Page.js)
// --------------------------
//   export function mountHero(section) -> () => void
//   - section : <section id="hero"> vide, deja inseree dans <main> (mesurable),
//     montee a la phase "slit" de l'intro (l'octogone s'ouvre sur elle).
//   - Porte le SEUL <h1> de la page (profile.name, id="hero-title") et
//     aria-labelledby="hero-title" sur la section. Hauteur 100svh (hero.css).
//   - Contenu : src/data/cv.js (profile) et src/data/hero.js, via textContent.
//   - Renvoie la fonction de nettoyage (ecouteurs, observateurs, rAF, minuteur).
//
// Technique du masque
// -------------------
//   Un seul <canvas> visible, pose sur le portrait. A chaque image : on l'efface,
//   on y peint les taches encore vivantes (sprite radial, opacite decroissante
//   avec l'age), puis on y dessine le calque accessoire en "source-in" : seul ce
//   qui recouvre une tache subsiste. Les taches sont une LISTE horodatee, pas un
//   masque qu'on estompe : chaque tache disparait exactement au bout de
//   FADE_DURATION (pas de traces fantomes dues a l'arrondi des alphas 8 bits), et
//   la boucle sait sans lire un seul pixel quand tout est efface : liste vide.
//   Un canvas comme mask-image CSS aurait exige element() (Firefox seul) ou un
//   toDataURL par image : trop couteux.
import { profile } from '../data/cv.js';
import { portrait, accessories, effect, pitch } from '../data/hero.js';
import { createEl } from '../utils/dom.js';
import { createSvgElement } from '../utils/svg.js';

const NEXT_SECTION = '#manifeste';

// ---------- Reglages de l'effet ----------
const SPOT_RADIUS_RATIO = 0.16; // rayon d'une tache, en part de la largeur du portrait
const SPOT_STEP_RATIO = 0.3; // pas d'interpolation entre deux positions, en part du rayon
const SPOT_SOLID_STOP = 0.45; // jusqu'ou la tache reste presque opaque avant son bord doux
const SPOT_SOLID_ALPHA = 0.85;
const FADE_DURATION = 1200; // ms : duree de vie d'une tache
const MAX_SPOTS = 600; // garde-fou memoire si le pointeur s'agite tres vite
const MAX_DPR = 2; // au-dela, le cout en pixels croit sans gain visible
const RESIZE_DEBOUNCE = 150; // ms
// Largeur a laquelle un calque SVG est rasterise pour le canvas : assez grande
// pour rester net une fois reduit, quelle que soit la taille d'affichage.
const SVG_RASTER_WIDTH = 1600;

const HOVER_NONE_QUERY = '(hover: none)';
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';
const HINT_POINTER = 'Passez la souris sur le portrait';
const HINT_TOUCH = 'Touchez le portrait';

const SHOWN_CLASS = 'is-shown';
const DISMISSED_CLASS = 'is-dismissed';

// ---------- Donnees ----------

// "Jean-Philippe Grewis" -> ["Jean-Philippe", "Grewis"] : une ligne par mot du
// nom de famille, le prenom compose restant d'un seul tenant.
function splitName(name) {
  const cut = name.lastIndexOf(' ');
  if (cut === -1) return [name];
  return [name.slice(0, cut), name.slice(cut + 1)];
}

// Un accessoire par visite, tire au hasard (voir l'en-tete de data/hero.js).
export function pickAccessory(list, random = Math.random) {
  if (list.length === 0) return null;
  return list[Math.floor(random() * list.length)] ?? list[0];
}

function matches(query) {
  return Boolean(window.matchMedia && window.matchMedia(query).matches);
}

// ---------- Calque accessoire ----------

// Un SVG servi comme image (canvas) ne voit pas les variables CSS de la page :
// on lit donc les tokens une fois et on ecrit des couleurs resolues, ce qui garde
// tokens.css comme source unique de la charte.
function readPalette() {
  const styles = getComputedStyle(document.documentElement);
  const token = (name) => styles.getPropertyValue(name).trim() || 'currentColor';
  return { ink: token('--color-ink'), paper: token('--color-bg'), accent: token('--color-accent') };
}

function toneStyles({ ink, paper, accent }) {
  return {
    paper: { fill: paper, stroke: ink },
    ink: { fill: 'none', stroke: ink },
    accent: { fill: 'none', stroke: accent },
    'accent-solid': { fill: accent, stroke: 'none' },
    glass: { fill: ink, stroke: ink },
    highlight: { fill: 'none', stroke: paper },
  };
}

// Dessin au trait dans le repere du portrait : un <svg> de viewBox "0 0 W H"
// (dimensions du portrait) contenant le dessin a sa place relative. Il se pose
// donc sur le portrait exactement comme le ferait une image alignee au pixel.
function buildAccessorySvg(accessory, palette) {
  const { width, height } = accessory;
  const { box, viewBox, strokeWidth, shapes } = accessory.svg;
  const [, , viewWidth, viewHeight] = viewBox;
  const drawWidth = box.width * width;
  const tones = toneStyles(palette);

  const root = createSvgElement('svg', {
    viewBox: `0 0 ${width} ${height}`,
    preserveAspectRatio: 'none',
    'aria-hidden': 'true',
    focusable: 'false',
  });
  const drawing = createSvgElement('svg', {
    x: String(box.x * width),
    y: String(box.y * height),
    width: String(drawWidth),
    height: String((drawWidth * viewHeight) / viewWidth),
    viewBox: viewBox.join(' '),
    overflow: 'visible',
    'stroke-width': String(strokeWidth),
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
  });
  shapes.forEach(({ tag, tone, attrs }) => {
    const colors = tones[tone] ?? tones.ink;
    const values = Object.fromEntries(Object.entries(attrs).map(([key, value]) => [key, String(value)]));
    drawing.append(createSvgElement(tag, { ...colors, ...values }));
  });
  root.append(drawing);
  return root;
}

async function loadImage(src) {
  const image = new Image();
  image.decoding = 'async';
  image.src = src;
  await image.decode();
  return image;
}

// Copie du SVG en image (data: autorise par la CSP, img-src 'self' data:) :
// drawImage ne sait pas dessiner un element <svg> du DOM.
function rasterizeSvg(svg, accessory) {
  const copy = svg.cloneNode(true);
  copy.setAttribute('width', String(SVG_RASTER_WIDTH));
  copy.setAttribute('height', String(Math.round((SVG_RASTER_WIDTH * accessory.height) / accessory.width)));
  copy.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  const markup = new XMLSerializer().serializeToString(copy);
  return loadImage(`data:image/svg+xml;charset=utf-8,${encodeURIComponent(markup)}`);
}

// Renvoie l'element pose dans le DOM (revele en entier par le bouton, et seul
// moyen d'affichage sans canvas) et une fonction qui fournit la source a dessiner
// dans le canvas. Le calque est decoratif : le bouton porte l'information.
function createAccessoryLayer(accessory) {
  if (accessory.src) {
    const img = createEl('img', {
      className: 'hero__accessory',
      attrs: {
        src: accessory.src,
        alt: '',
        'aria-hidden': 'true',
        width: accessory.width,
        height: accessory.height,
        decoding: 'async',
        // Cache tant qu'on ne le revele pas : il ne doit pas concurrencer le
        // portrait (element LCP) au chargement.
        fetchpriority: 'low',
      },
    });
    return { element: img, loadSource: () => img.decode().then(() => img) };
  }
  const svg = buildAccessorySvg(accessory, readPalette());
  svg.classList.add('hero__accessory');
  return { element: svg, loadSource: () => rasterizeSvg(svg, accessory) };
}

// ---------- Trainee (canvas) ----------

function createSpotSprite(radius) {
  const size = Math.max(1, Math.ceil(radius * 2));
  const sprite = document.createElement('canvas');
  sprite.width = size;
  sprite.height = size;
  const ctx = sprite.getContext('2d');
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, 'rgba(0, 0, 0, 1)');
  gradient.addColorStop(SPOT_SOLID_STOP, `rgba(0, 0, 0, ${SPOT_SOLID_ALPHA})`);
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  return sprite;
}

// Opacite d'une tache selon son age (0 -> 1) : elle tient d'abord, puis
// s'evanouit ; l'oeil percoit ainsi une trainee nette qui se dissout.
function spotAlpha(progress) {
  return 1 - progress * progress;
}

/**
 * Moteur de la trainee. La boucle rAF ne tourne que s'il reste des taches, que
 * le hero est a l'ecran et que l'onglet est visible.
 * @returns {null | object} null si le canvas 2D est indisponible
 */
function createTrail(canvas) {
  const ctx = canvas.getContext ? canvas.getContext('2d') : null;
  if (!ctx) return null;

  const spots = [];
  const layer = document.createElement('canvas');
  const layerCtx = layer.getContext('2d');
  let source = null;
  let sprite = null;
  let dpr = 1;
  let cssWidth = 0;
  let radius = 0;
  let rafId = 0;
  let active = true; // a l'ecran et onglet visible

  function clear() {
    spots.length = 0;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  function stop() {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = 0;
  }

  function drawLayer() {
    layerCtx.clearRect(0, 0, layer.width, layer.height);
    if (source) layerCtx.drawImage(source, 0, 0, layer.width, layer.height);
  }

  function render(now) {
    const firstAlive = spots.findIndex((spot) => now - spot.time < FADE_DURATION);
    spots.splice(0, firstAlive === -1 ? spots.length : firstAlive);

    ctx.globalCompositeOperation = 'source-over';
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (spots.length === 0) return;

    const size = sprite.width;
    spots.forEach((spot) => {
      const progress = Math.max(0, now - spot.time) / FADE_DURATION;
      ctx.globalAlpha = spotAlpha(progress);
      ctx.drawImage(sprite, spot.x * dpr - size / 2, spot.y * dpr - size / 2);
    });
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-in';
    ctx.drawImage(layer, 0, 0);
    ctx.globalCompositeOperation = 'source-over';
  }

  function tick(now) {
    rafId = 0;
    render(now);
    if (spots.length > 0) rafId = requestAnimationFrame(tick);
  }

  function start() {
    if (rafId || !active || !source) return;
    rafId = requestAnimationFrame(tick);
  }

  return {
    get ready() {
      return Boolean(source);
    },
    /** Recale le canvas sur la taille affichee du portrait (px CSS). */
    resize(width, height) {
      stop();
      dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      cssWidth = width;
      radius = width * SPOT_RADIUS_RATIO;
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      layer.width = canvas.width;
      layer.height = canvas.height;
      sprite = createSpotSprite(radius * dpr);
      drawLayer();
      // Les taches en cours sont en px CSS de l'ancienne taille : on repart a neuf.
      clear();
    },
    setSource(image) {
      source = image;
      drawLayer();
    },
    /** Ajoute des taches de (from) a (to), en px CSS relatifs au canvas. */
    paint(from, to, time) {
      if (!source || cssWidth === 0) return;
      const step = radius * SPOT_STEP_RATIO;
      const dx = from ? to.x - from.x : 0;
      const dy = from ? to.y - from.y : 0;
      const count = from ? Math.max(1, Math.ceil(Math.hypot(dx, dy) / step)) : 1;
      for (let i = 1; i <= count; i += 1) {
        const ratio = from ? i / count : 1;
        spots.push({ x: to.x - dx * (1 - ratio), y: to.y - dy * (1 - ratio), time });
      }
      if (spots.length > MAX_SPOTS) spots.splice(0, spots.length - MAX_SPOTS);
      start();
    },
    /** Hors ecran ou onglet masque : on suspend et on efface (la trainee serait finie au retour). */
    setActive(next) {
      active = next;
      if (active) return;
      stop();
      clear();
    },
    clear() {
      stop();
      clear();
    },
    destroy() {
      stop();
      spots.length = 0;
      source = null;
    },
  };
}

// ---------- Montage ----------

function createName() {
  const name = createEl('h1', { className: 'hero__name', attrs: { id: 'hero-title' } });
  splitName(profile.name).forEach((part, index) => {
    // Espace entre les lignes : sans ce noeud texte le nom accessible serait
    // "Jean-PhilippeGrewis" (et, sur une ligne, les mots seraient colles).
    if (index > 0) name.append(' ');
    name.append(
      createEl('span', {
        className: 'hero__line',
        text: part,
        attrs: { 'data-reveal': '', 'data-reveal-delay': index + 1 },
      }),
    );
  });
  return name;
}

function createPortraitImage() {
  return createEl('img', {
    className: 'hero__portrait',
    attrs: {
      src: portrait.src,
      alt: portrait.alt,
      width: portrait.width,
      height: portrait.height,
      decoding: 'async',
      // Element LCP : jamais differe, charge en priorite.
      fetchpriority: 'high',
    },
  });
}

// Accroche + phrase de positionnement sous le nom (data/hero.js, objet pitch) :
// ce qu'un recruteur doit lire en 10 secondes (poste vise, disponibilite, role).
// Les chiffres (kpis) restent possibles mais ne sont plus utilises.
function createPitch() {
  if (!pitch?.text && !pitch?.statement && !pitch?.kpis?.length) return null;
  const kpis = pitch.kpis?.length
    ? createEl('ul', {
        className: 'hero__kpis',
        children: pitch.kpis.map(({ value, label }) =>
          createEl('li', {
            className: 'hero__kpi',
            children: [
              createEl('span', { className: 'hero__kpi-value', text: value }),
              createEl('span', { className: 'hero__kpi-label caption', text: label }),
            ],
          }),
        ),
      })
    : null;
  return createEl('div', {
    className: 'hero__pitch',
    attrs: { 'data-reveal': '', 'data-reveal-delay': 1 },
    children: [
      pitch.text ? createEl('p', { className: 'hero__tagline', text: pitch.text }) : null,
      pitch.statement ? createEl('p', { className: 'hero__statement', text: pitch.statement }) : null,
      kpis,
    ],
  });
}

export function mountHero(section) {
  section.classList.add('hero');
  section.setAttribute('aria-labelledby', 'hero-title');

  // Effet au pointeur coupe par l'interrupteur de data/hero.js : on passe alors
  // par le meme chemin que "aucun accessoire" (portrait seul, rien a charger).
  const accessory = effect.enabled ? pickAccessory(accessories) : null;
  const reducedMotion = window.matchMedia ? window.matchMedia(REDUCED_MOTION_QUERY) : null;

  const frame = createEl('div', { className: 'hero__frame', children: [createPortraitImage()] });
  frame.style.setProperty('--hero-ratio', String(portrait.width / portrait.height));
  if (portrait.maxDisplayWidth) frame.style.setProperty('--hero-max', `${portrait.maxDisplayWidth}px`);

  const stage = createEl('div', { className: 'hero__stage', attrs: { 'data-reveal': 'fade' }, children: [frame] });
  // L'accroche (pitch) reprend deja l'intitule du poste : on n'affiche pas les deux.
  const title = pitch?.text ? null : createEl('p', { className: 'hero__title caption', text: profile.title });
  const pitchBlock = createPitch();
  const cue = createEl('a', { className: 'hero__cue caption', text: 'Défiler', attrs: { href: NEXT_SECTION } });

  if (!accessory) {
    section.replaceChildren(...[createName(), title, stage, cue, pitchBlock].filter(Boolean));
    return () => {};
  }

  const layer = createAccessoryLayer(accessory);
  frame.append(layer.element);

  const canvas = createEl('canvas', { className: 'hero__trail', attrs: { 'aria-hidden': 'true' } });
  const trail = createTrail(canvas);
  if (trail) frame.append(canvas);

  // Consigne visuelle seulement : le bouton porte l'information pour les
  // technologies d'assistance, inutile de leur dire de "toucher" le portrait.
  const hint = createEl('p', {
    className: 'hero__hint caption',
    text: matches(HOVER_NONE_QUERY) ? HINT_TOUCH : HINT_POINTER,
    attrs: { 'aria-hidden': 'true' },
  });
  const toggle = createEl('button', {
    className: 'hero__toggle',
    attrs: { type: 'button', 'aria-pressed': 'false' },
    children: [
      createEl('span', { className: 'hero__toggle-mark', attrs: { 'aria-hidden': 'true' } }),
      createEl('span', { text: accessory.label }),
    ],
  });
  const controls = createEl('div', {
    className: 'hero__controls',
    attrs: { 'data-reveal': 'fade', 'data-reveal-delay': 3 },
    children: [hint, toggle],
  });

  section.replaceChildren(...[createName(), title, stage, controls, cue, pitchBlock].filter(Boolean));

  // ---------- Etat ----------
  let pinned = false;
  let last = null; // derniere position du pointeur, pour interpoler
  let resizeTimer = 0;

  const motionAllowed = () => !(reducedMotion && reducedMotion.matches);
  const effectOn = () => Boolean(trail && trail.ready) && motionAllowed() && !pinned;

  function dismissHint() {
    hint.classList.add(DISMISSED_CLASS);
  }

  function syncHint() {
    // La consigne n'apparait que si l'effet peut vraiment repondre au pointeur.
    hint.hidden = !(trail && trail.ready && motionAllowed());
  }
  syncHint();

  function setPinned(next) {
    pinned = next;
    toggle.setAttribute('aria-pressed', String(next));
    layer.element.classList.toggle(SHOWN_CLASS, next);
    if (trail) trail.clear();
    dismissHint();
  }

  // ---------- Pointeur ----------
  function onPointer(event) {
    if (!effectOn()) return;
    const rect = frame.getBoundingClientRect();
    const point = { x: event.clientX - rect.left, y: event.clientY - rect.top };
    const from = event.type === 'pointerdown' ? null : last;
    trail.paint(from, point, performance.now());
    last = point;
    dismissHint();
  }

  function onPointerEnd(event) {
    // La souris continue de survoler apres un clic : seule la fin d'un contact
    // (doigt, stylet) ou la sortie de la zone coupe l'interpolation.
    if (event.type === 'pointerup' && event.pointerType === 'mouse') return;
    last = null;
  }

  function onToggle() {
    setPinned(!pinned);
  }

  // ---------- Taille, visibilite, preferences ----------
  function measure() {
    if (!trail) return;
    const rect = frame.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    trail.resize(rect.width, rect.height);
    last = null;
  }

  function scheduleMeasure() {
    clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(measure, RESIZE_DEBOUNCE);
  }

  let inView = true;
  function syncActive() {
    if (trail) trail.setActive(inView && document.visibilityState === 'visible');
  }

  function onMotionChange() {
    if (!motionAllowed() && trail) trail.clear();
    syncHint();
  }

  const cleanups = [];
  const listen = (target, type, handler, options) => {
    target.addEventListener(type, handler, options);
    cleanups.push(() => target.removeEventListener(type, handler, options));
  };

  let disposed = false;
  listen(toggle, 'click', onToggle);

  if (trail) {
    measure();
    layer
      .loadSource()
      .then((image) => {
        if (disposed) return;
        trail.setSource(image);
        syncHint();
      })
      .catch(() => {
        // Calque illisible (fichier absent, SVG refuse) : l'effet au pointeur est
        // abandonne et sa consigne masquee ; le portrait et le bouton restent.
        canvas.remove();
        hint.hidden = true;
      });

    const passive = { passive: true };
    listen(frame, 'pointermove', onPointer, passive);
    listen(frame, 'pointerdown', onPointer, passive);
    ['pointerup', 'pointercancel', 'pointerleave'].forEach((type) => listen(frame, type, onPointerEnd, passive));
    listen(document, 'visibilitychange', syncActive);
    if (reducedMotion && reducedMotion.addEventListener) listen(reducedMotion, 'change', onMotionChange);

    if ('ResizeObserver' in window) {
      const resizeObserver = new ResizeObserver(scheduleMeasure);
      resizeObserver.observe(frame);
      cleanups.push(() => resizeObserver.disconnect());
    } else {
      listen(window, 'resize', scheduleMeasure, passive);
    }

    if ('IntersectionObserver' in window) {
      const viewObserver = new IntersectionObserver((entries) => {
        inView = entries[entries.length - 1].isIntersecting;
        syncActive();
      });
      viewObserver.observe(section);
      cleanups.push(() => viewObserver.disconnect());
    }
  }

  return () => {
    disposed = true;
    clearTimeout(resizeTimer);
    cleanups.forEach((cleanup) => cleanup());
    if (trail) trail.destroy();
  };
}
