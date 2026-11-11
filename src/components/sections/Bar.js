// Barre fixe discrete : monogramme + nom a gauche (retour en haut), lien Contact
// a droite. Deux pastilles flottantes plutot qu'un bandeau plein : la page garde
// toute sa hauteur et les photos passent dessous sans etre coupees net.
import { profile, contact } from '../../data/cv.js';
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
    children: [
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
}
