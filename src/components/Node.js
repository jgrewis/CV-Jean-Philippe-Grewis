// Fabriques de noeuds de la carte mentale (central, branche, feuille).
import { icon } from '../utils/icons.js';

export function setNodePos(el, x, y) {
  el.style.setProperty('--x', `${Math.round(x)}px`);
  el.style.setProperty('--y', `${Math.round(y)}px`);
}

export function createCenterNode(profile) {
  const el = document.createElement('button');
  el.type = 'button';
  el.className = 'node node--center glass glass--strong';
  el.dataset.role = 'center';
  el.setAttribute('aria-label', `${profile.name}, ${profile.title}. Ouvrir le profil LinkedIn`);
  el.innerHTML = `
    <img class="avatar" src="${profile.photo}" alt="" width="88" height="88" loading="eager" />
    <span class="name">${profile.name}</span>
  `;
  setNodePos(el, 0, 0);
  return el;
}

export function createBranchNode(branch) {
  const el = document.createElement('button');
  el.type = 'button';
  el.className = `node node--branch glass${branch.accent ? ' node--accent' : ''}`;
  el.dataset.branch = branch.id;
  el.setAttribute('aria-label', `Ouvrir la branche ${branch.label}`);
  el.innerHTML = `${icon(branch.icon)}<span>${branch.label}</span>`;
  // Flottement desynchronise : duree et decalage aleatoires => mouvement organique.
  // Durees ralenties de ~20% (7-12s -> 8.4-14.4s) pour un mouvement plus elegant.
  const dur = (8.4 + Math.random() * 6).toFixed(2);
  const delay = (-Math.random() * 8).toFixed(2);
  el.style.setProperty('--float-dur', `${dur}s`);
  el.style.setProperty('--float-delay', `${delay}s`);
  return el;
}

export function createLeafNode(branch, leaf) {
  const el = document.createElement('button');
  el.type = 'button';
  el.className = 'node node--leaf glass is-hidden';
  el.dataset.branch = branch.id;
  el.dataset.leaf = leaf.id;
  el.setAttribute('aria-label', `Voir le détail : ${leaf.title}`);
  const period = leaf.period ? `<span class="leaf-period">${leaf.period}</span>` : '';
  el.innerHTML = `<span class="leaf-label">${leaf.title}</span>${period}`;
  return el;
}
