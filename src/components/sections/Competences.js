// Section #competences : competences, savoir-etre, formations, certifications et
// centres d'interet, en lignes editoriales (intitule a gauche, contenu a droite)
// avec de grandes etiquettes. Toutes les feuilles passent par le meme rendu :
// une feuille peut porter tags, bullets, links, summary, org et period.
import { getBranch, getLeaf, getLeaves } from '../../data/selectors.js';
import { createEl, createExternalLink } from '../../utils/dom.js';
import { createSectionHead } from './sectionHead.js';

const EYEBROW = 'Compétences & formations';
const FALLBACK_TITLE = 'Compétences';
const FORMATION_BRANCH = 'formation';

// Feuilles "diplome" (org + period) : regroupees sous un meme intitule.
const isDegree = (leaf) => Boolean(leaf.org && leaf.period);

function createLeafContent(leaf) {
  const parts = [];
  if (leaf.tags?.length) {
    parts.push(
      createEl('ul', {
        className: 'tags tags--large',
        children: leaf.tags.map((tag) => createEl('li', { className: 'tag', text: tag })),
      }),
    );
  }
  if (leaf.bullets?.length) {
    parts.push(
      createEl('ul', {
        className: 'bullets',
        children: leaf.bullets.map((item) => createEl('li', { text: item })),
      }),
    );
  }
  if (leaf.links?.length) {
    parts.push(
      createEl('p', {
        className: 'skills__links',
        children: leaf.links.map((link) => createExternalLink(link.url, link.label, 'text-link')),
      }),
    );
  }
  return parts;
}

// Une ligne : intitule (h3) a gauche, contenu a droite.
function createRow(title, content, delay = 0) {
  return createEl('li', {
    className: 'skills__row',
    attrs: { 'data-reveal': '', 'data-reveal-delay': delay },
    children: [
      createEl('h3', { className: 'skills__label', text: title }),
      createEl('div', { className: 'skills__content', children: content }),
    ],
  });
}

function createDegree(leaf) {
  return createEl('li', {
    className: 'degree',
    children: [
      createEl('p', { className: 'caption', text: leaf.period }),
      createEl('h4', { className: 'degree__title', text: leaf.title }),
      createEl('p', { className: 'degree__org', text: leaf.org }),
      leaf.summary ? createEl('p', { className: 'degree__summary', text: leaf.summary }) : null,
    ],
  });
}

function createFormationRow() {
  const branch = getBranch(FORMATION_BRANCH);
  if (!branch) return [];
  const degrees = branch.leaves.filter(isDegree);
  const others = branch.leaves.filter((leaf) => !isDegree(leaf));

  const content = [];
  if (degrees.length) {
    content.push(createEl('ol', { className: 'degrees', children: degrees.map(createDegree) }));
  }
  // Les autres feuilles (certifications) restent sous l'intitule Formations,
  // avec leur propre sous-titre.
  others.forEach((leaf) => {
    content.push(
      createEl('div', {
        className: 'skills__sub',
        children: [createEl('h4', { className: 'caption', text: leaf.title }), ...createLeafContent(leaf)],
      }),
    );
  });
  return [createRow(branch.label, content)];
}

export function mountCompetences(section) {
  section.classList.add('section', 'skills');
  const branch = getBranch('competences');

  const rows = [
    ...getLeaves('competences'),
    getLeaf('profil', 'soft-skills'),
  ]
    .filter(Boolean)
    .map((leaf) => createRow(leaf.title, createLeafContent(leaf)));

  rows.push(...createFormationRow());

  const interests = getLeaf('profil', 'interets');
  if (interests) rows.push(createRow(interests.title, createLeafContent(interests)));

  const wrap = createEl('div', { className: 'wrap skills__wrap' });
  wrap.append(
    createSectionHead(section, { eyebrow: EYEBROW, title: branch?.label ?? FALLBACK_TITLE }),
    createEl('ul', { className: 'skills__list', children: rows }),
  );
  section.replaceChildren(wrap);
}
