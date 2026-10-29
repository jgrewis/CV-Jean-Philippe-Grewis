// Apparition au defilement, commune a toute la page (sections, et plus tard
// realisations T3 et visage T4) : UN SEUL IntersectionObserver partage.
//
// API
// ---
//   observeReveal(root = document) -> () => void
//     Observe root (s'il porte data-reveal) et tous ses descendants [data-reveal].
//     Peut etre rappele a tout moment pour du contenu ajoute plus tard : un element
//     deja observe ou deja revele est ignore. Renvoie une fonction qui cesse
//     d'observer ces elements (a appeler si le composant est demonte).
//   disconnectReveal() -> void
//     Coupe l'observateur partage (demontage complet de la page).
//
// Balisage
// --------
//   data-reveal              montee + fondu (par defaut)
//   data-reveal="fade"       fondu seul, sans translation
//   data-reveal-delay="n"    rang dans une cascade : retard de n x --reveal-stagger
//
// Effet
// -----
//   Quand l'element entre a l'ecran (10 % au-dessus du bas de la fenetre), la classe
//   .is-revealed est posee puis l'element n'est plus observe (effet a un coup).
//   L'etat cache n'existe que sous html.has-reveal, pose ici : sans JS, sans
//   IntersectionObserver ou avec prefers-reduced-motion, tout est visible d'emblee.
//   Le CSS (page.css) n'anime que transform et opacity : ne pas poser data-reveal sur
//   un element dont on anime deja le transform, l'envelopper plutot.

const REVEALED_CLASS = 'is-revealed';
const READY_CLASS = 'has-reveal';
const SELECTOR = '[data-reveal]';
// Declenche un peu avant que l'element n'atteigne le bas de l'ecran : le mouvement
// est deja en cours quand l'oeil y arrive.
const ROOT_MARGIN = '0px 0px -10% 0px';
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

let observer = null;
const observed = new WeakSet();

function canAnimate() {
  if (!('IntersectionObserver' in window)) return false;
  return !(window.matchMedia && window.matchMedia(REDUCED_MOTION_QUERY).matches);
}

function show(el) {
  el.classList.add(REVEALED_CLASS);
}

function getObserver() {
  if (observer) return observer;
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        show(entry.target);
        observer.unobserve(entry.target);
        observed.delete(entry.target);
      });
    },
    { rootMargin: ROOT_MARGIN, threshold: 0 },
  );
  return observer;
}

function collectTargets(root) {
  const targets = [...root.querySelectorAll(SELECTOR)];
  if (root instanceof Element && root.matches(SELECTOR)) targets.unshift(root);
  return targets.filter((el) => !el.classList.contains(REVEALED_CLASS) && !observed.has(el));
}

function applyDelay(el) {
  const rank = Number.parseInt(el.dataset.revealDelay ?? '', 10);
  if (Number.isFinite(rank) && rank > 0) el.style.setProperty('--reveal-index', String(rank));
}

export function observeReveal(root = document) {
  const targets = collectTargets(root);
  if (!canAnimate()) {
    targets.forEach(show);
    return () => {};
  }

  // Pose dans la meme tache que l'insertion des elements : aucun flash avant le
  // premier rendu, puisque le navigateur n'a pas encore peint.
  document.documentElement.classList.add(READY_CLASS);
  const io = getObserver();
  targets.forEach((el) => {
    applyDelay(el);
    observed.add(el);
    io.observe(el);
  });

  return () => {
    targets.forEach((el) => {
      if (!observed.has(el)) return;
      io.unobserve(el);
      observed.delete(el);
    });
  };
}

export function disconnectReveal() {
  if (!observer) return;
  observer.disconnect();
  observer = null;
}
