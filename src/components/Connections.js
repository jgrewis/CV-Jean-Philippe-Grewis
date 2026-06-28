// Couche SVG des liens entre noeuds. Centre -> branches, branche -> feuilles.
// Coordonnees en pixels relatives au centre du viewport (groupe translate).

const SVG_NS = 'http://www.w3.org/2000/svg';

function curvePath(x1, y1, x2, y2) {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  // Decalage perpendiculaire leger pour une courbe organique.
  const dx = x2 - x1;
  const dy = y2 - y1;
  const cx = mx - dy * 0.12;
  const cy = my + dx * 0.12;
  return `M ${x1.toFixed(1)} ${y1.toFixed(1)} Q ${cx.toFixed(1)} ${cy.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`;
}

export class Connections {
  constructor() {
    this.svg = document.createElementNS(SVG_NS, 'svg');
    this.svg.setAttribute('class', 'connections');
    this.svg.setAttribute('aria-hidden', 'true');
    this.group = document.createElementNS(SVG_NS, 'g');
    this.svg.appendChild(this.group);
  }

  update(branches, layout, viewport) {
    this.svg.setAttribute('width', viewport.w);
    this.svg.setAttribute('height', viewport.h);
    this.group.setAttribute('transform', `translate(${viewport.w / 2}, ${viewport.h / 2})`);
    this.group.replaceChildren();

    // Plus de fils vers la bulle centrale : on ne trace que branche -> feuilles
    // (visibles uniquement quand la branche est deployee).
    branches.forEach((branch) => {
      const b = layout.branches[branch.id];
      const leaves = layout.leaves[branch.id] || [];
      leaves.forEach((leaf) => {
        this._addPath(b.x, b.y, leaf.x, leaf.y, 'leaf', branch.id);
      });
    });
  }

  _addPath(x1, y1, x2, y2, kind, branchId) {
    const path = document.createElementNS(SVG_NS, 'path');
    path.setAttribute('d', curvePath(x1, y1, x2, y2));
    path.dataset.kind = kind;
    path.dataset.branch = branchId;
    const len = Math.hypot(x2 - x1, y2 - y1) * 1.25;
    path.style.setProperty('--len', len.toFixed(0));
    if (kind === 'leaf') path.style.opacity = '0';
    this.group.appendChild(path);
  }

  // Met en avant la branche active ; null = vue d'ensemble.
  setActive(branchId) {
    this.group.querySelectorAll('path').forEach((p) => {
      const isLeaf = p.dataset.kind === 'leaf';
      const sameBranch = p.dataset.branch === branchId;
      if (branchId === null) {
        p.classList.remove('is-dim');
        p.style.opacity = isLeaf ? '0' : '';
      } else if (sameBranch) {
        p.classList.remove('is-dim');
        p.style.opacity = '';
      } else {
        p.classList.add('is-dim');
        if (isLeaf) p.style.opacity = '0';
      }
    });
  }
}
