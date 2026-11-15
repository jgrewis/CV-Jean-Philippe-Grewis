// Section #evenementiel : inaugurations, événements et lancements conduits chez
// m2A, groupés par thématique (evenementiel.js). Une liste compacte : date et
// type en légende, titre, une phrase de contexte, lien vers la source publique.
import { evenementielGroups, evenementielIntro, photosCredit } from '../../data/evenementiel.js';
import { createEl, createExternalLink } from '../../utils/dom.js';
import { createSectionHead } from './sectionHead.js';

const EYEBROW = 'm2A · octobre 2024 — octobre 2026';
const TITLE = 'Événementiel';

function createLinks(links) {
  if (!links?.length) return null;
  return createEl('ul', {
    className: 'evt__links',
    children: links.map((link) =>
      createEl('li', { children: [createExternalLink(link.url, link.label, 'evt__link')] }),
    ),
  });
}

function createFigure(event) {
  if (!event.img) return null;
  // Vignette : le cadrage (4/3, object-fit) est en CSS, la place est reservee
  // avant le chargement, aucun saut de mise en page.
  return createEl('figure', {
    className: 'evt__figure',
    children: [
      createEl('img', {
        className: 'evt__img',
        attrs: { src: event.img, alt: event.alt ?? '', loading: 'lazy', decoding: 'async' },
      }),
    ],
  });
}

function createEvent(event) {
  return createEl('li', {
    className: 'evt',
    attrs: { 'data-reveal': '' },
    children: [
      createEl('p', { className: 'caption evt__date', text: `${event.date} · ${event.type}` }),
      createFigure(event),
      createEl('div', {
        className: 'evt__body',
        children: [
          createEl('p', { className: 'evt__title', text: event.title }),
          event.detail ? createEl('p', { className: 'evt__detail', text: event.detail }) : null,
          createLinks(event.links),
        ],
      }),
    ],
  });
}

function createGroup(group) {
  return createEl('div', {
    className: 'evenementiel__group',
    attrs: { 'data-reveal': '' },
    children: [
      createEl('h3', {
        className: 'evenementiel__group-title',
        text: `${group.label} · ${group.events.length}`,
      }),
      createEl('ol', { className: 'evenementiel__list', children: group.events.map(createEvent) }),
    ],
  });
}

export function mountEvenementiel(section) {
  section.classList.add('section', 'evenementiel');

  const wrap = createEl('div', { className: 'wrap evenementiel__wrap' });
  wrap.append(
    createSectionHead(section, { eyebrow: EYEBROW, title: TITLE }),
    createEl('div', {
      className: 'evenementiel__intro',
      children: [createEl('p', { className: 'evenementiel__lead', text: evenementielIntro })],
    }),
    ...evenementielGroups.map(createGroup),
    createEl('p', { className: 'caption evenementiel__credit', text: photosCredit }),
  );
  section.replaceChildren(wrap);
}
