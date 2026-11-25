// Barre fixe discrete : monogramme + nom a gauche (retour en haut), lien Contact
// a droite. Deux pastilles flottantes plutot qu'un bandeau plein : la page garde
// toute sa hauteur et les photos passent dessous sans etre coupees net.
import { profile, contact } from '../../data/cv.js';
import { createEl } from '../../utils/dom.js';
import { createMonogramSvg } from '../../utils/monogram.js';

const HOME_TARGET = '#hero';
const CONTACT_TARGET = '#contact';
const CONTACT_LABEL = 'Contact';
// Ancres vers les sections (lot 1, 25/11/2026), visibles a partir de 64em.
// La section traversant le milieu de l'ecran est marquee aria-current.
const ANCHORS = [
  { href: '#parcours', label: 'Parcours' },
  { href: '#realisations', label: 'Réalisations' },
  { href: '#competences', label: 'Compétences' },
];

export function mountBar(header) {
  header.classList.add('bar');

  const home = createEl('a', {
    className: 'bar__chip bar__home',
    attrs: { href: HOME_TARGET },
    children: [
      createMonogramSvg('bar__mono'),
      createEl('span', { className: 'bar__name', text: profile.name }),
    ],
  });

  const nav = createEl('nav', {
    className: 'bar__nav',
    attrs: { 'aria-label': 'Navigation principale' },
    children: [
      ...ANCHORS.map(({ href, label }) =>
        createEl('a', { className: 'bar__chip bar__link bar__anchor', text: label, attrs: { href } }),
      ),
      contact.pdf
        ? createEl('a', {
            className: 'bar__chip bar__link bar__link--pdf',
            attrs: { href: contact.pdf.url, download: '', type: 'application/pdf', 'aria-label': contact.pdf.label },
            children: [
              createEl('span', { className: 'bar__pdf-long', text: contact.pdf.label }),
              createEl('span', { className: 'bar__pdf-short', text: contact.pdf.shortLabel, attrs: { 'aria-hidden': 'true' } }),
            ],
          })
        : null,
      createEl('a', { className: 'bar__chip bar__link', text: CONTACT_LABEL, attrs: { href: CONTACT_TARGET } }),
    ],
  });

  header.replaceChildren(home, nav);
  return watchActive(nav);
}

function watchActive(nav) {
  if (!('IntersectionObserver' in window)) return undefined;
  const links = [...nav.querySelectorAll('.bar__anchor')];
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((link) =>
          link.setAttribute('aria-current', link.getAttribute('href') === `#${entry.target.id}` ? 'true' : 'false'),
        );
      });
    },
    { rootMargin: '-50% 0px -50% 0px' },
  );
  // Les sections sont creees avant le montage de la barre (Page.js).
  ANCHORS.forEach(({ href }) => {
    const target = document.querySelector(href);
    if (target) observer.observe(target);
  });
  return () => observer.disconnect();
}
