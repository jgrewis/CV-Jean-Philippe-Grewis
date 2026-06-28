// Point d'entree : importe les styles et monte la carte mentale dans #app.
import './styles/tokens.css';
import './styles/reset.css';
import './styles/base.css';
import './styles/glass.css';
import './styles/mindmap.css';
import './styles/detail.css';
import './styles/responsive.css';

import { MindMap } from './components/MindMap.js';

const root = document.getElementById('app');
if (root) {
  new MindMap(root);
}
