// Section #parcours : les experiences (branche "experiences" de cv.js) en grands
// blocs editoriaux. Le visuel de chaque bloc (theme.background) alterne a gauche
// et a droite, a des hauteurs decalees, avec une micro-legende en capitales.
import { getBranch } from '../../data/selectors.js';
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

function createExperience(leaf, index) {
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
      createMedia(leaf.media),
      createLinks(leaf.links, leaf.linksLabel),
    ],
  });

  // Alternance gauche / droite portee par une classe : le CSS n'a pas a
  // connaitre la position de l'element dans la liste.
  const side = index % 2 === 0 ? 'xp--media-start' : 'xp--media-end';
  const article = createEl('article', {
    className: `xp ${side}`,
    children: [createFigure(leaf), body],
  });
  if (leaf.theme?.accentColor) article.style.setProperty('--xp-accent', leaf.theme.accentColor);
  return createEl('li', { className: 'parcours__item', children: [article] });
}

export function mountParcours(section) {
  section.classList.add('section', 'parcours');
  const branch = getBranch(BRANCH_ID);
  const leaves = branch?.leaves ?? [];

  const list = createEl('ol', { className: 'parcours__list' });
  leaves.forEach((leaf, index) => list.append(createExperience(leaf, index)));

  const wrap = createEl('div', { className: 'wrap parcours__wrap' });
  wrap.append(createSectionHead(section, { eyebrow: EYEBROW, title: branch?.label ?? EYEBROW }), list);
  section.replaceChildren(wrap);
}
