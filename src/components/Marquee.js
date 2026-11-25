// Bandeau defilant en double ligne (lot 3, 25/11/2026), facon landonorris.com :
// les directions et les clients en serif italique, les supports en grotesque,
// en sens inverses. Decoratif (aria-hidden) : son contenu est dit ailleurs.
import { createEl } from '../utils/dom.js';

const LINES = [
  { variant: 'serif', items: ['Mobilité', 'Sport', 'Enfance & Famille', 'Grande distribution', 'Collectivité'] },
  { variant: 'sans', items: ['Affichage', 'Print', 'Réseaux sociaux', 'Web', 'Événementiel', 'Vidéo'] },
];
const SEPARATOR = ' · ';

function createTrack(items) {
  return createEl('span', {
    className: 'marquee__track',
    children: items.map((item) => createEl('span', { className: 'marquee__item', text: `${item}${SEPARATOR}` })),
  });
}

/** @returns {{ element: HTMLElement, cleanup: () => void }} */
export function createMarquee() {
  const element = createEl('div', {
    className: 'marquee',
    attrs: { 'aria-hidden': 'true' },
    children: LINES.map(({ variant, items }) => {
      // Deux pistes identiques (repetees pour couvrir les grands ecrans) :
      // l'animation glisse de 50 % et boucle sans couture.
      const repeated = [...items, ...items];
      return createEl('div', {
        className: `marquee__line marquee__line--${variant}`,
        children: [createTrack(repeated), createTrack(repeated)],
      });
    }),
  });

  if (!('IntersectionObserver' in window)) return { element, cleanup: () => {} };
  const observer = new IntersectionObserver(([entry]) => {
    element.classList.toggle('is-paused', !entry.isIntersecting);
  });
  observer.observe(element);
  return { element, cleanup: () => observer.disconnect() };
}
