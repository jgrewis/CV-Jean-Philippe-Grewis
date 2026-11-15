// Point d'entree : importe les styles, joue l'intro puis monte la page qui
// defile dans #app (montee sous le calque d'intro, a la phase "slit").
import './styles/tokens.css';
import './styles/fonts.css';
import './styles/reset.css';
import './styles/base.css';
import './styles/page.css';
import './styles/hero.css';
import './styles/sections.css';
import './styles/realisations.css';
import './styles/intro.css';
import './styles/intro-logo.css';
import './styles/intro-lines.css';

import { Intro } from './components/Intro.js';
import { mountPage } from './components/Page.js';

const root = document.getElementById('app');
if (root) {
  // Sans intro : remplacer cette ligne par `mountPage(root);`
  new Intro({ page: root, onReveal: () => mountPage(root) });
}
