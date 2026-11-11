// Section #methode : « De la strategie aux resultats ». Les etapes (data/methode.js)
// en liste ordonnee, chacune avec le role de JP et ses preuves (vignettes tirees
// de data/realisations.js, ou liens vers les communiques), puis l'etude de cas
// Challenge Velo (besoin -> ce que j'ai concu -> resultat).
import { methode } from '../../data/methode.js';
import { realisations } from '../../data/realisations.js';
import { createEl, createExternalLink } from '../../utils/dom.js';
import { createSectionHead } from './sectionHead.js';

const RATIO_DECIMALS = 4;

function findProof(name) {
  return realisations.find((proof) => proof.src.endsWith(`/${name}.webp`)) ?? null;
}

function createThumb(proof) {
  const img = createEl('img', {
    className: 'methode__img',
    attrs: { src: proof.src, alt: proof.alt ?? '', width: proof.width, height: proof.height, loading: 'lazy', decoding: 'async' },
  });
  const frame = createEl('div', { className: 'methode__frame', children: [img] });
  frame.style.setProperty('--ratio', (proof.width / proof.height).toFixed(RATIO_DECIMALS));
  return createEl('figure', {
    className: 'methode__proof',
    children: [
      frame,
      createEl('figcaption', {
        className: 'methode__proof-caption',
        children: [
          createEl('span', { text: proof.title }),
          methode.proofCredit ? createEl('span', { className: 'caption', text: methode.proofCredit }) : null,
        ],
      }),
    ],
  });
}

function createLinkList(links, className = 'methode__links') {
  if (!links?.length) return null;
  return createEl('ul', {
    className,
    children: links.map((link) => createEl('li', { children: [createExternalLink(link.url, link.label, 'xp__link')] })),
  });
}

function createStep(step, index) {
  const proofs = (step.proofs ?? []).map(findProof).filter(Boolean);
  const proofBlock = proofs.length
    ? createEl('div', {
        className: 'methode__proofs-wrap',
        children: [
          step.proofsLabel ? createEl('p', { className: 'caption', text: step.proofsLabel }) : null,
          createEl('div', { className: 'methode__proofs', children: proofs.map(createThumb) }),
        ],
      })
    : null;
  return createEl('li', {
    className: 'methode__step',
    attrs: { 'data-reveal': '' },
    children: [
      createEl('p', { className: 'methode__num keyword', text: String(index + 1).padStart(2, '0'), attrs: { 'aria-hidden': 'true' } }),
      createEl('div', {
        className: 'methode__text',
        children: [createEl('h3', { className: 'methode__title', text: step.title }), createEl('p', { className: 'methode__role', text: step.role })],
      }),
      createEl('div', { className: 'methode__evidence', children: [proofBlock, createLinkList(step.links)] }),
    ],
  });
}

function createCaseStudy(cs) {
  if (!cs) return null;
  const titleId = 'methode-cas-title';
  return createEl('article', {
    className: 'methode__case',
    attrs: { 'aria-labelledby': titleId, 'data-reveal': '' },
    children: [
      createEl('p', { className: 'caption methode__case-eyebrow', text: cs.eyebrow }),
      createEl('h3', { className: 'methode__case-title', text: cs.title, attrs: { id: titleId } }),
      createEl('ol', {
        className: 'methode__case-blocks',
        children: cs.blocks.map((block) =>
          createEl('li', {
            className: 'methode__case-block',
            children: [createEl('p', { className: 'caption', text: block.label }), createEl('p', { className: 'methode__case-text', text: block.text })],
          }),
        ),
      }),
      createLinkList(cs.links, 'methode__links methode__case-links'),
    ],
  });
}

export function mountMethode(section) {
  section.classList.add('section', 'methode');
  const wrap = createEl('div', {
    className: 'wrap methode__wrap',
    children: [
      createSectionHead(section, { eyebrow: methode.eyebrow, title: methode.title }),
      createEl('p', { className: 'methode__intro', text: methode.intro, attrs: { 'data-reveal': '', 'data-reveal-delay': 1 } }),
      createEl('ol', { className: 'methode__steps', children: methode.steps.map(createStep) }),
      createCaseStudy(methode.caseStudy),
    ],
  });
  section.replaceChildren(wrap);
}
