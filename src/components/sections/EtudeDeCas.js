// Section #etude-de-cas : l'étude de cas Challenge Vélo, seule sur la page.
// Besoin -> ce que j'ai conçu -> résultat, avec les visuels (mockups 4 × 3 m
// et mupi, trophée) et les communiqués officiels en preuve. Les chiffres du
// Challenge Vélo ne sont dits nulle part ailleurs sur la page.
import { etudeDeCas } from '../../data/etude-de-cas.js';
import { realisations } from '../../data/realisations.js';
import { createEl, createExternalLink } from '../../utils/dom.js';
import { createSectionHead } from './sectionHead.js';

function findVisual(name) {
  return realisations.find((proof) => proof.src.endsWith(`/${name}.webp`)) ?? null;
}

function createVisual(name) {
  const proof = findVisual(name);
  if (!proof) return null;
  return createEl('figure', {
    className: 'etude__visual',
    children: [
      createEl('div', {
        className: 'etude__frame',
        children: [
          createEl('img', {
            className: 'etude__img',
            attrs: {
              src: proof.src,
              alt: proof.alt ?? '',
              width: proof.width,
              height: proof.height,
              loading: 'lazy',
              decoding: 'async',
            },
          }),
        ],
      }),
      createEl('figcaption', { className: 'etude__visual-caption', text: proof.title }),
    ],
  });
}

function createLinkList(links) {
  if (!links?.length) return null;
  return createEl('ul', {
    className: 'etude__links',
    children: links.map((link) =>
      createEl('li', { children: [createExternalLink(link.url, link.label, 'xp__link')] }),
    ),
  });
}

export function mountEtudeDeCas(section) {
  section.classList.add('section', 'etude');
  const cs = etudeDeCas;
  const visuals = (cs.visuals ?? []).map(createVisual).filter(Boolean);

  const wrap = createEl('div', { className: 'wrap etude__wrap' });
  wrap.append(
    createSectionHead(section, { eyebrow: cs.eyebrow, title: cs.title }),
    createEl('article', {
      className: 'etude__case',
      attrs: { 'data-reveal': '' },
      children: [
        cs.highlight
          ? createEl('p', {
              className: 'etude__highlight',
              children: [
                createEl('span', { className: 'etude__highlight-value', text: cs.highlight.value }),
                createEl('span', { className: 'etude__highlight-label', text: cs.highlight.label }),
              ],
            })
          : null,
        createEl('ol', {
          className: 'etude__case-blocks',
          children: cs.blocks.map((block) =>
            createEl('li', {
              className: 'etude__case-block',
              children: [
                createEl('p', { className: 'caption', text: block.label }),
                createEl('p', { className: 'etude__case-text', text: block.text }),
              ],
            }),
          ),
        }),
        visuals.length ? createEl('ul', { className: 'etude__visuals', children: visuals }) : null,
        createLinkList(cs.links),
      ],
    }),
  );
  section.replaceChildren(wrap);
}
