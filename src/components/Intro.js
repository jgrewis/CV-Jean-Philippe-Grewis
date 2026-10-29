// Intro d'ouverture du CV : calque plein ecran clair (lignes de fond, monogramme,
// nom en glitch) puis un trait effile qui s'ouvre en octogone et devoile le haut
// de la page (#hero).
//
// Mecanique de la decoupe : le calque est AU-DESSUS de la page et c'est lui qu'on
// troue (clip-path polygon evenodd, voir intro.css). La page en dessous reste
// intacte : #app ne recoit aucun clip-path, elle est montee sous le calque a la
// phase "slit" et se voit a travers la decoupe.
//
// Pendant l'intro, le defilement du document est bloque (classe is-intro-playing
// sur <html>, voir base.css) ; il est rendu a la fin comme au saut.
//
// Chronologie pilotee par une table de phases et un minuteur unique : chaque phase
// pose data-phase (phase courante) et data-reached (phases deja atteintes) sur le
// calque ; tout le visuel est en CSS, declenche par ces attributs.
import { mountIntroLines } from './IntroLines.js';
import { mountIntroLogo } from '../utils/introLogo.js';

// Instants des phases, en ms depuis le debut de l'intro.
const LOGO_AT = 300;
const NAME_AT = 800;
const SLIT_AT = 1600;
const OPEN_AT = 1900;
const DONE_AT = 2500;

// Durees des animations CSS, transmises au calque en variables (--intro-*-dur)
// pour que JS reste l'unique source de verite des temps.
const LINES_DURATION = 800; // 0 -> 0,8 s : les lignes glissent en place
const GLITCH_DURATION = 250; // 0,8 -> 1,05 s : glitch du nom
const SLIT_DURATION = OPEN_AT - SLIT_AT; // 1,6 -> 1,9 s : le trait s'etire
const OPEN_DURATION = 500; // 1,9 -> 2,4 s : l'octogone s'ouvre

const PHASES = [
  { name: 'lines', at: 0 },
  { name: 'logo', at: LOGO_AT },
  { name: 'name', at: NAME_AT },
  { name: 'slit', at: SLIT_AT },
  { name: 'open', at: OPEN_AT },
  { name: 'done', at: DONE_AT },
];

// Phase a laquelle la page est montee : ses apparitions (reveal) se jouent ainsi
// pendant l'ouverture, et non cachees sous le calque.
const REVEAL_PHASE = 'slit';

const STORAGE_KEY = 'cv-intro-seen';
const SKIP_KEYS = new Set(['Enter', 'Escape', ' ', 'Spacebar']);
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';
const SCROLL_LOCK_CLASS = 'is-intro-playing';

function prefersReducedMotion() {
  return Boolean(window.matchMedia && window.matchMedia(REDUCED_MOTION_QUERY).matches);
}

function hasSeenIntro() {
  try {
    return window.sessionStorage.getItem(STORAGE_KEY) === '1';
  } catch {
    // sessionStorage indisponible (navigation privee, stockage bloque) :
    // on considere l'intro comme jamais vue et on la joue.
    return false;
  }
}

function markIntroSeen() {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, '1');
  } catch {
    // Ecriture impossible : sans consequence, l'intro se rejouera simplement
    // au prochain chargement de l'onglet.
  }
}

function createPart(className) {
  const el = document.createElement('div');
  el.className = className;
  // Decor pur : seul le bouton "Passer l'intro" est expose aux technologies d'assistance.
  el.setAttribute('aria-hidden', 'true');
  return el;
}

export class Intro {
  /**
   * @param {object} options
   * @param {() => void} options.onReveal  monte la page (appele une seule fois)
   * @param {HTMLElement} [options.page]   conteneur de la page, rendu inerte
   *   pendant l'intro pour que le focus clavier ne s'y perde pas sous le calque
   */
  constructor({ onReveal, page = null } = {}) {
    this._onReveal = typeof onReveal === 'function' ? onReveal : () => {};
    this._page = page;
    this._revealed = false;
    this._finished = false;
    this._timer = 0;
    this._phaseIndex = -1;
    this._startTime = 0;
    this._reached = [];
    this._cleanups = [];
    this._layer = null;

    this._onKeydown = this._onKeydown.bind(this);
    this._onClick = this._onClick.bind(this);

    if (prefersReducedMotion() || hasSeenIntro()) {
      this._finished = true;
      this._reveal();
      return;
    }

    // Marquee des le debut : un rechargement en cours d'intro ne la rejoue pas.
    markIntroSeen();
    this._build();
    this._bind();
    this._startTime = performance.now();
    this._advance();
  }

  /** Termine l'intro immediatement (saut) ; sans effet si elle est deja finie. */
  finish() {
    if (this._finished) return;
    this._finished = true;
    window.clearTimeout(this._timer);
    this._timer = 0;
    this._unbind();
    this._reveal();
    if (this._page) this._page.inert = false;
    document.documentElement.classList.remove(SCROLL_LOCK_CLASS);

    const layer = this._layer;
    this._layer = null;
    if (!layer) return;
    // Ne pas laisser le focus sur un element qui va disparaitre : il revient au document.
    if (layer.contains(document.activeElement)) document.activeElement.blur();
    layer.dataset.phase = 'done';
    this._cleanups.forEach((cleanup) => cleanup());
    this._cleanups = [];
    layer.remove();
  }

  _build() {
    const layer = document.createElement('div');
    layer.className = 'intro';

    const timings = {
      '--intro-lines-dur': LINES_DURATION,
      '--intro-glitch-dur': GLITCH_DURATION,
      '--intro-slit-dur': SLIT_DURATION,
      '--intro-open-dur': OPEN_DURATION,
    };
    Object.entries(timings).forEach(([prop, ms]) => layer.style.setProperty(prop, `${ms}ms`));

    const lines = createPart('intro__lines');
    const logo = createPart('intro__logo');
    const horizon = createPart('intro__horizon');

    const skip = document.createElement('button');
    skip.type = 'button';
    skip.className = 'intro__skip';
    skip.textContent = "Passer l'intro";

    layer.append(lines, logo, horizon, skip);

    // Points d'accroche des lignes (T3) et du logo (T2) : ils peuvent renvoyer
    // une fonction de nettoyage, appelee au retrait du calque.
    [mountIntroLines(lines), mountIntroLogo(logo)].forEach((cleanup) => {
      if (typeof cleanup === 'function') this._cleanups.push(cleanup);
    });

    // En tete du body : le bouton "Passer l'intro" est le premier arret de tabulation.
    document.body.prepend(layer);
    if (this._page) this._page.inert = true;
    // L'ouverture doit devoiler le haut de la page : pas de defilement d'ici la fin.
    document.documentElement.classList.add(SCROLL_LOCK_CLASS);
    this._layer = layer;
  }

  _bind() {
    document.addEventListener('keydown', this._onKeydown);
    // Phase de capture : un clic n'importe ou (y compris a travers la decoupe) passe l'intro.
    document.addEventListener('click', this._onClick, true);
  }

  _unbind() {
    document.removeEventListener('keydown', this._onKeydown);
    document.removeEventListener('click', this._onClick, true);
  }

  _onKeydown(e) {
    if (!SKIP_KEYS.has(e.key)) return;
    // Evite le defilement (Espace) et le double declenchement du bouton (Entree).
    e.preventDefault();
    this.finish();
  }

  _onClick() {
    this.finish();
  }

  // Minuteur unique : entre dans la phase suivante puis programme la d'apres,
  // en recalant le delai sur l'heure de depart pour ne pas cumuler de derive.
  _advance() {
    this._timer = 0;
    if (this._finished) return;
    this._phaseIndex += 1;
    const phase = PHASES[this._phaseIndex];
    if (!phase) return;

    this._enterPhase(phase.name);
    if (this._finished) return;

    const next = PHASES[this._phaseIndex + 1];
    if (!next) return;
    const delay = Math.max(0, next.at - (performance.now() - this._startTime));
    this._timer = window.setTimeout(() => this._advance(), delay);
  }

  _enterPhase(name) {
    if (name === 'done') {
      this.finish();
      return;
    }
    // Montage AVANT de lancer le trait : le cout du montage de la page tombe
    // sur l'image figee du nom, pas sur la premiere image de l'animation.
    if (name === REVEAL_PHASE) this._reveal();
    this._reached.push(name);
    this._layer.dataset.reached = this._reached.join(' ');
    this._layer.dataset.phase = name;
  }

  _reveal() {
    if (this._revealed) return;
    this._revealed = true;
    this._onReveal();
  }
}
