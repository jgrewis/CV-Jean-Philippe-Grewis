// Orchestrateur de la carte mentale : construit la scene, gere les etats
// (vue d'ensemble <-> branche active), la camera, les clics et le redimensionnement.
import { profile, branches } from '../data/cv.js';
import { wordPath, wordViewBox } from '../data/wordPath.js';
import { computeLayout, getViewport } from '../utils/layout.js';
import { icon } from '../utils/icons.js';
import { escapeHtml } from '../utils/escapeHtml.js';
import { Camera } from '../utils/zoom.js';
import { Connections } from './Connections.js';
import { DetailPanel } from './DetailPanel.js';
import { createCenterNode, createBranchNode, createLeafNode, setNodePos } from './Node.js';

const BRANCH_ZOOM = 1.08;

export class MindMap {
  constructor(root) {
    this.root = root;
    this.activeBranch = null;
    this.branchEls = {};
    this.leafEls = {}; // branchId -> [{ el, leaf }]
    this.layout = null;
    // Branches mises en avant (accent) placees en premier => position haute, prioritaire.
    this.branches = [...branches].sort((a, b) => (b.accent ? 1 : 0) - (a.accent ? 1 : 0));

    this._build();
    this._applyLayout();
    this._bindEvents();
    this.camera.reset();
    this.connections.setActive(null);
  }

  _build() {
    this.stage = document.createElement('div');
    this.stage.className = 'stage';

    // Inscription geante en fond : le TITRE du CV (et non le nom). Le dernier mot
    // ("Communication") est mis en avant en SVG avec un courant electrique anime
    // qui circule le long du contour de chaque lettre. Floutee/refractee par le
    // verre des bulles qui passent dessus.
    this.inscription = document.createElement('div');
    this.inscription.className = 'inscription';
    this.inscription.setAttribute('aria-hidden', 'true');
    const words = profile.title.split(' ');
    const head = words.slice(0, -1).join(' ').toUpperCase();
    // Le dernier mot du titre ("Communication") est rendu en filigrane, comme un
    // contour vectoriel sobre en fond de scene.
    this.inscription.innerHTML = `
      <span class="inscription__head">${escapeHtml(head)}</span>
      <svg class="inscription__word" viewBox="${wordViewBox}" role="presentation"
           aria-hidden="true" preserveAspectRatio="xMidYMid meet">
        <path class="elec-fill" d="${wordPath}" />
      </svg>
    `;
    this.stage.appendChild(this.inscription);

    this.connections = new Connections();
    this.stage.appendChild(this.connections.svg);

    this.centerEl = createCenterNode(profile);
    this.stage.appendChild(this.centerEl);

    this.branches.forEach((branch) => {
      const bEl = createBranchNode(branch);
      this.branchEls[branch.id] = bEl;
      this.stage.appendChild(bEl);

      this.leafEls[branch.id] = (branch.leaves || []).map((leaf) => {
        const lEl = createLeafNode(branch, leaf);
        this.stage.appendChild(lEl);
        return { el: lEl, leaf };
      });
    });

    this.root.appendChild(this.stage);

    // Habillage (hors scene, non transforme)
    this.brandTag = document.createElement('div');
    this.brandTag.className = 'brand-tag';
    this.brandTag.textContent = 'CV interactif';
    this.root.appendChild(this.brandTag);

    this.backBtn = document.createElement('button');
    this.backBtn.type = 'button';
    this.backBtn.className = 'back-btn';
    this.backBtn.innerHTML = `${icon('arrowLeft')}<span>Vue d'ensemble</span>`;
    this.root.appendChild(this.backBtn);

    this.hint = document.createElement('p');
    this.hint.className = 'hint';
    this.root.appendChild(this.hint);
    this._setHint();

    this.camera = new Camera(this.stage);
    this.panel = new DetailPanel(this.root);
  }

  _applyLayout() {
    const vp = getViewport();
    this.layout = computeLayout(this.branches, vp);
    this.connections.update(this.branches, this.layout, vp);

    this.branches.forEach((branch) => {
      const b = this.layout.branches[branch.id];
      setNodePos(this.branchEls[branch.id], b.x, b.y);

      const leafPositions = this.layout.leaves[branch.id] || [];
      this.leafEls[branch.id].forEach((entry, i) => {
        const pos = leafPositions[i];
        const isActive = this.activeBranch === branch.id;
        // Feuilles repliees sur la branche tant qu'elle n'est pas active.
        if (isActive) setNodePos(entry.el, pos.x, pos.y);
        else setNodePos(entry.el, b.x, b.y);
        entry.el._pos = pos;
      });
    });
  }

  _setHint() {
    const txt = this.activeBranch
      ? 'Cliquez sur un élément pour voir le détail'
      : 'Cliquez sur une branche pour explorer';
    this.hint.innerHTML = `${icon('hand')}<span>${txt}</span>`;
  }

  _bindEvents() {
    this.stage.addEventListener('click', (e) => {
      const node = e.target.closest('.node');
      if (!node) return;
      if (node.dataset.role === 'center') {
        // Clic sur la photo => profil LinkedIn (nouvel onglet).
        if (profile.linkedin) window.open(profile.linkedin, '_blank', 'noopener,noreferrer');
        return;
      }
      if (node.dataset.leaf) return this._openLeaf(node);
      if (node.dataset.branch) {
        // Recliquer une branche deja deployee la referme (toggle).
        if (node.dataset.branch === this.activeBranch) return this.goOverview();
        return this.enterBranch(node.dataset.branch);
      }
    });

    this.backBtn.addEventListener('click', () => this.goOverview());

    document.addEventListener('keydown', (e) => {
      // Echap referme le panneau de detail (gere par DetailPanel) ou, a defaut,
      // ramene a la vue d'ensemble depuis une branche deployee.
      if (e.key === 'Escape' && this.activeBranch && !this.panel.isOpen) this.goOverview();
    });

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => this._onResize(), 150);
    });
  }

  _openLeaf(node) {
    const branch = this.branches.find((b) => b.id === node.dataset.branch);
    const leaf = (branch.leaves || []).find((l) => l.id === node.dataset.leaf);
    if (leaf) this.panel.openLeaf(branch.label, leaf);
  }

  enterBranch(id) {
    const branch = this.branches.find((b) => b.id === id);
    if (!branch) return;

    // La branche Contact n'a pas de feuilles : ouverture directe du panneau.
    if (branch.isContact) {
      this.panel.openContact();
      return;
    }

    this.activeBranch = id;
    this.stage.classList.add('is-exploring');
    const b = this.layout.branches[id];

    // Centre de la camera = barycentre branche + feuilles.
    const leaves = this.layout.leaves[id] || [];
    const all = [b, ...leaves];
    const cx = all.reduce((s, p) => s + p.x, 0) / all.length;
    const cy = all.reduce((s, p) => s + p.y, 0) / all.length;
    this.camera.focusOn(cx, cy, BRANCH_ZOOM);

    // Visibilite des noeuds
    this.branches.forEach((other) => {
      const el = this.branchEls[other.id];
      el.classList.toggle('is-dim', other.id !== id);
      this.leafEls[other.id].forEach((entry) => {
        const show = other.id === id;
        entry.el.classList.toggle('is-hidden', !show);
        if (show) setNodePos(entry.el, entry.el._pos.x, entry.el._pos.y);
        else setNodePos(entry.el, this.layout.branches[other.id].x, this.layout.branches[other.id].y);
      });
    });

    this.connections.setActive(id);
    this.backBtn.classList.add('is-visible');
    this._setHint();
  }

  goOverview() {
    this.activeBranch = null;
    this.stage.classList.remove('is-exploring');
    this.camera.reset();

    this.branches.forEach((branch) => {
      this.branchEls[branch.id].classList.remove('is-dim');
      const b = this.layout.branches[branch.id];
      this.leafEls[branch.id].forEach((entry) => {
        entry.el.classList.add('is-hidden');
        setNodePos(entry.el, b.x, b.y);
      });
    });

    this.connections.setActive(null);
    this.backBtn.classList.remove('is-visible');
    this._setHint();
  }

  _onResize() {
    this._applyLayout();
    if (this.activeBranch) {
      const id = this.activeBranch;
      this.activeBranch = null; // force le recalcul complet de la camera/visibilite
      this.enterBranch(id);
    } else {
      this.camera.reset();
    }
  }
}
