// Barre fixe discrete : monogramme + nom a gauche (retour en haut), lien Contact
// a droite. Deux pastilles flottantes plutot qu'un bandeau plein : la page garde
// toute sa hauteur et les photos passent dessous sans etre coupees net.
import { profile } from '../../data/cv.js';
import { createEl } from '../../utils/dom.js';
import { createMonogramSvg } from '../../utils/monogram.js';

const HOME_TARGET = '#hero';
const CONTACT_TARGET = '#contact';
const CONTACT_LABEL = 'Contact';

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
    children: [createEl('a', { className: 'bar__chip bar__link', text: CONTACT_LABEL, attrs: { href: CONTACT_TARGET } })],
  });

  header.replaceChildren(home, nav);
}
