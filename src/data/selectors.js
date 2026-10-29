// Acces en lecture a l'arbre de cv.js, par identifiant : les sections de la page
// ne dependent pas de la position des branches ni des feuilles dans le fichier,
// seulement de leurs id. cv.js reste la source unique du contenu.
import { branches } from './cv.js';

export function getBranch(branchId) {
  return branches.find((branch) => branch.id === branchId) ?? null;
}

export function getLeaves(branchId) {
  return getBranch(branchId)?.leaves ?? [];
}

export function getLeaf(branchId, leafId) {
  return getLeaves(branchId).find((leaf) => leaf.id === leafId) ?? null;
}
