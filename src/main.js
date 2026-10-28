// Point d'entree : importe les styles, joue l'intro puis monte la carte mentale dans #app.
import './styles/tokens.css';
import './styles/reset.css';
import './styles/base.css';
import './styles/glass.css';
import './styles/mindmap.css';
import './styles/detail.css';
import './styles/intro.css';
import './styles/intro-logo.css';
import './styles/intro-lines.css';
import './styles/responsive.css';

import { MindMap } from './components/MindMap.js';
import { Intro } from './components/Intro.js';

const root = document.getElementById('app');
if (root) {
  // Sans intro : remplacer cette ligne par `new MindMap(root);`
  new Intro({ page: root, onReveal: () => new MindMap(root) });
}
