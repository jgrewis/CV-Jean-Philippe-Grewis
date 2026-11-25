// Section #parcours : les experiences (branche "experiences" de cv.js) en grands
// blocs d'une seule colonne : banniere plein ecran de l'entreprise, puis texte
// aligne a gauche. L'experience m2A porte aussi les inaugurations, evenements
// et lancements conduits (data/evenementiel.js) en galerie de grandes cartes :
// photo en grand, date et titre dessous — plus de liste compacte a vignettes.
import { getBranch } from '../../data/selectors.js';
import { evenementielGroups, photosCredit } from '../../data/evenementiel.js';
import { createEl, createExternalLink } from '../../utils/dom.js';
import { createSectionHead } from './sectionHead.js';

const BRANCH_ID = 'experiences';
const EYEBROW = 'Parcours';
const MEDIA_LABEL = 'Supports réalisés';
const LINKS_LABEL = 'Preuves · communiqués de presse officiels';
const CREDIT_MARK = '© m2A';

function createFigure(leaf) {
  const background = leaf.theme?.background;
  if (!background) return null;
  // Image d'ambiance de l'entreprise : decorative (alt vide), la legende nomme
  // l'entreprise. Recadree en CSS (aspect-ratio + object-fit) : la place est
  // reservee avant le chargement, aucun saut de mise en page.
  const img = createEl('img', {
    className: 'xp__img',
    attrs: { src: background, alt: '', loading: 'lazy', decoding: 'async' },
  });
  const caption = leaf.org ? createEl('figcaption', { className: 'caption xp__caption', text: leaf.org }) : null;
  return createEl('figure', {
    className: 'xp__figure',
    attrs: { 'data-reveal': '' },
    children: [createEl('div', { className: 'xp__frame', children: [img] }), caption],
  });
}

function createKpis(kpis) {
  if (!kpis?.length) return null;
  const list = createEl('ul', { className: 'xp__kpis' });
  kpis.forEach(({ value, label }) => {
    list.append(
      createEl('li', {
        className: 'xp__kpi',
        children: [
          createEl('span', { className: 'xp__kpi-value', text: value }),
          createEl('span', { className: 'xp__kpi-label caption', text: label }),
        ],
      }),
    );
  });
  return list;
}

function createList(items, className) {
  if (!items?.length) return null;
  return createEl('ul', {
    className,
    children: items.map((item) => createEl('li', { text: item })),
  });
}

function createMedia(media) {
  if (!media?.length) return null;
  return createEl('div', {
    className: 'xp__media',
    children: [
      createEl('p', { className: 'caption', text: MEDIA_LABEL }),
      createList(media.map((item) => item.caption).filter(Boolean), 'tags'),
    ],
  });
}

// Opérations menées chez m2A, en galerie : photo en grand, date et titre
// dessous. Ni détail ni lien par événement : les sources sont dans le fichier
// de recherche (cv-audit/evenementiel-m2a-2024-2026.md).
function createEventItem(event) {
  const thumb = event.img
    ? createEl('figure', {
        className: 'xp__event-thumb',
        children: [
          createEl('img', {
            className: 'xp__event-img',
            attrs: { src: event.img, alt: event.alt ?? '', loading: 'lazy', decoding: 'async' },
          }),
        ],
      })
    : null;
  return createEl('li', {
    className: event.img ? 'xp__event' : 'xp__event xp__event--text',
    children: [
      thumb,
      createEl('div', {
        className: 'xp__event-body',
        children: [
          createEl('p', { className: 'caption xp__event-date', text: `${event.date} · ${event.type}` }),
          createEl('p', { className: 'xp__event-title', text: event.title }),
        ],
      }),
    ],
  });
}

function createEvents() {
  return createEl('div', {
    className: 'xp__events',
    children: [
      createEl('p', { className: 'caption', text: 'Opérations menées · octobre 2024 à octobre 2026' }),
      ...evenementielGroups.map((group) =>
        createEl('div', {
          className: 'xp__events-group',
          children: [
            createEl('h4', { className: 'xp__events-group-title', text: `${group.label} · ${group.events.length}` }),
            createEl('ol', { className: 'xp__events-list', children: group.events.map(createEventItem) }),
          ],
        }),
      ),
      createEl('p', { className: 'caption', text: photosCredit }),
    ],
  });
}

// Liens de preuve (cv.js, champ links) : communiques officiels. La mention
// « © m2A » est garantie a l'affichage, meme si un libelle l'omet.
// Resultats contextualises (cv.js, champ results) : un titre (l'operation) et
// une phrase (le chiffre, ce qu'il mesure, le lien avec la communication).
function createResults(leaf) {
  if (!leaf.results?.length) return null;
  return createEl('div', {
    className: 'xp__results',
    children: [
      leaf.resultsLabel ? createEl('p', { className: 'caption', text: leaf.resultsLabel }) : null,
      createEl('ul', {
        className: 'xp__result-list',
        children: leaf.results.map(({ title, text }) =>
          createEl('li', {
            className: 'xp__result',
            children: [createEl('p', { className: 'xp__result-title', text: title }), createEl('p', { className: 'xp__result-text', text })],
          }),
        ),
      }),
    ],
  });
}

function createLinks(links, label = LINKS_LABEL) {
  if (!links?.length) return null;
  const items = links.map((link) => {
    const label = link.label.includes(CREDIT_MARK) || !/m2a\.fr.*\.pdf$/i.test(link.url) ? link.label : `${link.label} · ${CREDIT_MARK}`;
    return createEl('li', { children: [createExternalLink(link.url, label, 'xp__link')] });
  });
  return createEl('div', {
    className: 'xp__links',
    children: [createEl('p', { className: 'caption', text: label }), createEl('ul', { className: 'xp__link-list', children: items })],
  });
}

function createExperience(leaf) {
  const body = createEl('div', {
    className: 'xp__body',
    attrs: { 'data-reveal': '', 'data-reveal-delay': 1 },
    children: [
      leaf.period ? createEl('p', { className: 'caption xp__period', text: leaf.period }) : null,
      createEl('h3', { className: 'xp__title', text: leaf.title }),
      leaf.summary ? createEl('p', { className: 'xp__summary', text: leaf.summary }) : null,
      createKpis(leaf.kpis),
      createResults(leaf),
      createList(leaf.bullets, 'bullets xp__bullets'),
      leaf.id === 'm2a' ? createEvents() : null,
      createMedia(leaf.media),
      createLinks(leaf.links, leaf.linksLabel),
    ],
  });

  const article = createEl('article', {
    className: 'xp',
    children: [createFigure(leaf), body],
  });
  if (leaf.theme?.accentColor) article.style.setProperty('--xp-accent', leaf.theme.accentColor);
  return createEl('li', { className: 'parcours__item', children: [article] });
}

export function mountParcours(section, { ids, except, eyebrow = EYEBROW, title } = {}) {
  section.classList.add('section', 'parcours');
  const branch = getBranch(BRANCH_ID);
  let leaves = branch?.leaves ?? [];
  // Decoupage (15/11) : m2A se monte seul en tete de page, les autres
  // experiences forment une seconde section apres les visuels m2A.
  if (ids) leaves = leaves.filter((leaf) => ids.includes(leaf.id));
  if (except) leaves = leaves.filter((leaf) => !except.includes(leaf.id));

  const list = createEl('ol', { className: 'parcours__list' });
  leaves.forEach((leaf) => list.append(createExperience(leaf)));

  const wrap = createEl('div', { className: 'wrap parcours__wrap' });
  wrap.append(createSectionHead(section, { eyebrow, title: title ?? branch?.label ?? EYEBROW }), list);
  section.replaceChildren(wrap);
}
