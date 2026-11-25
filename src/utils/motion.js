// Animations du lot 3 (25/11/2026), inspirees de landonorris.com et adaptees
// a un CV : elles accompagnent la lecture sans jamais la bloquer.
//
//   [data-count]  compteur : le chiffre monte de 0 a sa valeur quand il entre a
//                 l'ecran (1,2 s). La vraie valeur est dans le HTML des le depart.
//   [data-wipe]   revelation par bloc de couleur : un aplat accent balaie
//                 l'element puis se retire (0,7 s), sur les textes courts.
//
// Tout est coupe sous prefers-reduced-motion ou sans IntersectionObserver :
// l'etat final s'affiche directement. Effets a un coup, aucun calcul pendant
// le defilement.

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';
const READY_CLASS = 'has-motion';
const PLAY_CLASS = 'is-playing';
const DONE_CLASS = 'is-done';
const COUNT_DURATION = 1200;
const WIPE_DURATION = 700;
const ROOT_MARGIN = '0px 0px -2% 0px';
// Classe posee par Intro.js pendant l'intro : on attend sa fin pour que les
// compteurs du premier ecran soient vus.
const INTRO_CLASS = 'is-intro-playing';
const NUMBER_PATTERN = /(\d[\d\s  ]*)/;

export function canAnimate() {
  if (!('IntersectionObserver' in window)) return false;
  return !(window.matchMedia && window.matchMedia(REDUCED_MOTION_QUERY).matches);
}

// « +26 % » -> { before: '+', value: 26, after: ' %' } ; null si pas de nombre.
function parseCount(text) {
  const match = text.match(NUMBER_PATTERN);
  if (!match) return null;
  const digits = match[1].replace(/\D/g, '');
  if (!digits) return null;
  const before = text.slice(0, match.index);
  const raw = match[1];
  // L'espace qui suit le nombre (« 10 ans ») reste dans le suffixe.
  const trimmed = raw.replace(/[\s  ]+$/, '');
  return { before, value: Number(digits), after: raw.slice(trimmed.length) + text.slice(match.index + raw.length) };
}

const formatter = new Intl.NumberFormat('fr-FR');
// Intl met une espace fine insecable : on garde l'espace d'origine du site.
const format = (n) => formatter.format(n).replace(/[  ]/g, ' ');

function runCount(el) {
  const final = el.textContent;
  const parsed = parseCount(final);
  if (!parsed) return;
  const start = performance.now();
  const step = (now) => {
    const t = Math.min(1, Math.max(0, (now - start) / COUNT_DURATION));
    const eased = 1 - (1 - t) ** 3;
    el.textContent = `${parsed.before}${format(Math.round(parsed.value * eased))}${parsed.after}`;
    if (t < 1) requestAnimationFrame(step);
    else el.textContent = final;
  };
  requestAnimationFrame(step);
}

function runWipe(el) {
  el.classList.add(PLAY_CLASS);
  window.setTimeout(() => {
    el.classList.remove(PLAY_CLASS);
    el.classList.add(DONE_CLASS);
  }, WIPE_DURATION);
}

function whenIntroDone(callback) {
  const html = document.documentElement;
  if (!html.classList.contains(INTRO_CLASS)) {
    callback();
    return;
  }
  const watcher = new MutationObserver(() => {
    if (html.classList.contains(INTRO_CLASS)) return;
    watcher.disconnect();
    callback();
  });
  watcher.observe(html, { attributes: true, attributeFilter: ['class'] });
}

/**
 * @param {ParentNode} root
 * @returns {() => void} arret de l'observation
 */
export function observeMotion(root = document) {
  if (!canAnimate()) return () => {};
  document.documentElement.classList.add(READY_CLASS);
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        observer.unobserve(el);
        whenIntroDone(() => {
          if (el.hasAttribute('data-count')) runCount(el);
          if (el.hasAttribute('data-wipe')) runWipe(el);
        });
      });
    },
    { rootMargin: ROOT_MARGIN, threshold: 0 },
  );
  root.querySelectorAll('[data-count], [data-wipe]').forEach((el) => observer.observe(el));
  return () => observer.disconnect();
}
