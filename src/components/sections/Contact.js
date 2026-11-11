// Pied de page #contact : le nom en tres tres grand, puis les coordonnees (cv.js,
// objet contact) en liste de definitions. Fond encre : la page se referme sur un
// aplat sombre, comme un dos de couverture.
import { profile, contact } from '../../data/cv.js';
import { createEl, createExternalLink } from '../../utils/dom.js';

const TITLE = 'Contact';
const TOP_TARGET = '#hero';
const TOP_LABEL = 'Haut de page';
// Numero francais a 10 chiffres -> format international pour le lien tel:.
const NATIONAL_LENGTH = 10;
const COUNTRY_CODE = '+33';

function toTelHref(phone) {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === NATIONAL_LENGTH && digits.startsWith('0')) return `tel:${COUNTRY_CODE}${digits.slice(1)}`;
  return `tel:${digits}`;
}

function createEntry(term, ...details) {
  return createEl('div', {
    className: 'contact__entry',
    children: [
      createEl('dt', { className: 'caption contact__term', text: term }),
      ...details.map((detail) => createEl('dd', { className: 'contact__detail', children: [detail] })),
    ],
  });
}

export function mountContact(footer) {
  footer.classList.add('contact');
  const titleId = 'contact-title';
  footer.setAttribute('aria-labelledby', titleId);

  const name = createEl('p', { className: 'contact__name', attrs: { 'data-reveal': '' } });
  // Espace entre les lignes (spans en bloc) : le texte reste "Jean-Philippe Grewis".
  profile.name.split(' ').forEach((part, index) => {
    if (index > 0) name.append(' ');
    name.append(createEl('span', { className: 'contact__name-line', text: part }));
  });

  const entries = [];
  if (contact.email) {
    entries.push(
      createEntry(
        'E-mail',
        createEl('a', { className: 'contact__link contact__link--main', text: contact.email, attrs: { href: `mailto:${contact.email}` } }),
      ),
    );
  }
  if (contact.phone) {
    entries.push(
      createEntry('Téléphone', createEl('a', { className: 'contact__link', text: contact.phone, attrs: { href: toTelHref(contact.phone) } })),
    );
  }
  if (contact.pdf) {
    entries.push(
      createEntry(
        'CV',
        createEl('a', {
          className: 'contact__link contact__link--pdf',
          text: contact.pdf.label,
          attrs: { href: contact.pdf.url, download: '', type: 'application/pdf' },
        }),
      ),
    );
  }
  if (contact.location) entries.push(createEntry('Localisation', document.createTextNode(contact.location)));
  if (contact.driving) entries.push(createEntry('Mobilité', document.createTextNode(contact.driving)));
  if (contact.links?.length) {
    entries.push(createEntry('En ligne', ...contact.links.map((link) => createExternalLink(link.url, link.label, 'contact__link'))));
  }

  const wrap = createEl('div', {
    className: 'wrap contact__wrap',
    children: [
      createEl('h2', { className: 'caption contact__title', text: TITLE, attrs: { id: titleId } }),
      name,
      createEl('dl', { className: 'contact__list', attrs: { 'data-reveal': '', 'data-reveal-delay': 1 }, children: entries }),
      createEl('div', {
        className: 'contact__bottom',
        children: [
          createEl('p', { className: 'caption', text: profile.title }),
          createEl('a', { className: 'caption contact__top', text: TOP_LABEL, attrs: { href: TOP_TARGET } }),
        ],
      }),
    ],
  });
  footer.replaceChildren(wrap);
}
