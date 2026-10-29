// En-tete commun des sections : micro-legende facultative + titre. Donne aussi son
// nom accessible a la section (aria-labelledby), pour que chaque region soit
// annoncee par son titre.
import { createEl } from '../../utils/dom.js';

/**
 * @param {HTMLElement} section  la section (doit porter un id)
 * @param {object} options
 * @param {string} options.title
 * @param {string} [options.eyebrow]  micro-legende en capitales au-dessus du titre
 * @param {string} [options.tag]      niveau du titre ('h2' par defaut)
 * @param {string} [options.className] classe du titre (.section-title par defaut)
 */
export function createSectionHead(section, { title, eyebrow, tag = 'h2', className = 'section-title' }) {
  const id = `${section.id}-title`;
  const heading = createEl(tag, { className, text: title, attrs: { id } });
  section.setAttribute('aria-labelledby', id);

  const head = createEl('header', { className: 'section-head', attrs: { 'data-reveal': '' } });
  if (eyebrow) head.append(createEl('p', { className: 'caption', text: eyebrow }));
  head.append(heading);
  return head;
}
