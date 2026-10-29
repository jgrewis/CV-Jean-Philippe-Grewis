// Monte la page qui defile dans #app : calque de fond (teinte + lignes
// topographiques), barre fixe, <main> et ses sections, pied de page Contact.
//
// Chaque section est creee VIDE ici (id, data-tone), inseree dans le DOM, puis
// confiee a son module de montage : un module peut donc mesurer sa section. Les
// modules recoivent l'element et renvoient eventuellement une fonction de
// nettoyage. Les apparitions [data-reveal] sont ensuite enregistrees aupres de
// l'observateur partage (utils/reveal.js).
import { createEl } from '../utils/dom.js';
import { observeReveal, disconnectReveal } from '../utils/reveal.js';
import { watchTones } from '../utils/tone.js';
import { createTopoSvg } from '../utils/topo.js';
import { mountHero } from './Hero.js';
import { mountRealisations } from './Realisations.js';
import { mountBar } from './sections/Bar.js';
import { mountManifesto } from './sections/Manifesto.js';
import { mountParcours } from './sections/Parcours.js';
import { mountCompetences } from './sections/Competences.js';
import { mountContact } from './sections/Contact.js';

const MAIN_ID = 'contenu'; // cible du lien d'evitement (index.html)

// Ordre de la page (PLAN §4). tone : teinte du fond quand la section traverse
// le milieu de l'ecran ; l'alternance donne le rythme "fond qui change".
const SECTIONS = [
  { id: 'hero', tone: 'base', mount: mountHero },
  { id: 'manifeste', tone: 'alt', mount: mountManifesto },
  { id: 'parcours', tone: 'base', mount: mountParcours },
  { id: 'realisations', tone: 'alt', mount: mountRealisations },
  { id: 'competences', tone: 'base', mount: mountCompetences },
];

function createBackdrop() {
  return createEl('div', {
    className: 'backdrop',
    attrs: { 'aria-hidden': 'true' },
    children: [createEl('div', { className: 'backdrop__tone' }), createTopoSvg('backdrop__topo')],
  });
}

function run(mount, element, cleanups) {
  const cleanup = mount(element);
  if (typeof cleanup === 'function') cleanups.push(cleanup);
}

/**
 * @param {HTMLElement} root  conteneur #app
 * @returns {() => void} demontage complet (observateurs, ecouteurs des sections)
 */
export function mountPage(root) {
  const cleanups = [];

  const bar = createEl('header', { className: 'page__bar' });
  const main = createEl('main', { className: 'page__main', attrs: { id: MAIN_ID, tabindex: '-1' } });
  const sections = SECTIONS.map(({ id, tone }) => createEl('section', { attrs: { id, 'data-tone': tone } }));
  main.append(...sections);
  const footer = createEl('footer', { attrs: { id: 'contact' } });

  root.replaceChildren(createBackdrop(), bar, main, footer);

  run(mountBar, bar, cleanups);
  SECTIONS.forEach(({ mount }, index) => run(mount, sections[index], cleanups));
  run(mountContact, footer, cleanups);

  cleanups.push(observeReveal(root), watchTones(sections), disconnectReveal);

  return () => {
    cleanups.forEach((cleanup) => cleanup());
    root.replaceChildren();
  };
}
