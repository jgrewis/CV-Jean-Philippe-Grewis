// Section #manifeste : la phrase d'accroche (profile.tagline) en tres grandes
// capitales, puis le resume "A propos" en chapo. Quelques mots-cles, listes dans
// data/manifeste.js, passent en serif italique couleur accent.
import { profile } from '../../data/cv.js';
import { getLeaf } from '../../data/selectors.js';
import { MANIFESTO_KEYWORDS } from '../../data/manifeste.js';
import { createEl } from '../../utils/dom.js';
import { createSectionHead } from './sectionHead.js';

const FALLBACK_TITLE = 'À propos';

// Ajoute text a parent en enveloppant dans <em> la premiere occurrence de chaque
// mot-cle encore disponible. pending est consomme au fil des appels : un mot-cle
// deja mis en valeur dans l'accroche ne l'est pas une seconde fois dans le chapo.
function appendWithKeywords(parent, text, pending) {
  let rest = text;
  while (rest) {
    let match = null;
    pending.forEach((keyword) => {
      const index = rest.indexOf(keyword);
      if (index === -1) return;
      if (!match || index < match.index) match = { keyword, index };
    });
    if (!match) {
      parent.append(rest);
      return;
    }
    if (match.index > 0) parent.append(rest.slice(0, match.index));
    parent.append(createEl('em', { className: 'keyword', text: match.keyword }));
    pending.delete(match.keyword);
    rest = rest.slice(match.index + match.keyword.length);
  }
}

export function mountManifesto(section) {
  section.classList.add('section', 'manifesto');
  const about = getLeaf('profil', 'apropos');
  const pending = new Set(MANIFESTO_KEYWORDS);

  const statement = createEl('p', { className: 'manifesto__statement', attrs: { 'data-reveal': '' } });
  appendWithKeywords(statement, profile.tagline, pending);

  const wrap = createEl('div', { className: 'wrap manifesto__wrap' });
  wrap.append(
    createSectionHead(section, { title: about?.title ?? FALLBACK_TITLE, className: 'caption manifesto__title' }),
    statement,
  );

  if (about?.summary) {
    const lead = createEl('p', { className: 'manifesto__lead', attrs: { 'data-reveal': '', 'data-reveal-delay': 1 } });
    appendWithKeywords(lead, about.summary, pending);
    wrap.append(lead);
  }

  section.replaceChildren(wrap);
}
