# CV interactif — Jean-Philippe Grewis

CV web qui sort de l'ordinaire : une **carte mentale** avec un nœud central
(toi) et cinq branches (Profil, Expériences, Compétences, Formation, Contact).
Design **liquid glass** (verre dépoli) sur fond bleu marine, et **zoom moderne**
au clic qui ouvre un panneau de détail enrichi (KPIs chiffrés, visuels, liens).

Stack : **Vanilla JS + Vite**, zéro framework lourd, aucune dépendance runtime.

## Prérequis

- Node.js **20.19+** ou 22.12+ recommandé (le projet est épinglé sur Vite 6 et
  fonctionne aussi avec Node 20.11).

## Installation

```bash
npm install
```

## Lancement en développement

```bash
npm run dev
```

Ouvre l'adresse affichée (par défaut http://localhost:5173) avec rechargement à
chaud.

## Build de production

```bash
npm run build      # génère le dossier dist/
npm run preview    # sert le build localement pour vérification
```

## Structure du projet

```
siteCV/
├── index.html                # page unique, SEO + Open Graph + fallback sans JS
├── vite.config.js            # base: './' (compatible GitHub Pages)
├── public/
│   ├── favicon.svg
│   ├── og-image.png          # aperçu de partage réseaux sociaux
│   └── assets/
│       ├── photo-jp.png
│       └── realisations/     # déposer ici les visuels de réalisations
└── src/
    ├── main.js               # point d'entrée
    ├── data/cv.js            # SOURCE UNIQUE de tout le contenu du CV
    ├── styles/               # tokens, reset, base, glass, mindmap, detail, responsive
    ├── components/           # MindMap, Node, Connections, DetailPanel
    └── utils/                # layout (positions), zoom (caméra), a11y, icons
```

## Mettre le CV à jour

Tout le contenu vit dans un seul fichier : [`src/data/cv.js`](src/data/cv.js).
Profil, contact, expériences, compétences, formation — on édite uniquement ce
fichier, l'interface se met à jour automatiquement.

### Ajouter des visuels de réalisations

1. Place les images dans `public/assets/realisations/`.
2. Dans `src/data/cv.js`, renseigne le champ `media` de la feuille concernée :

```js
media: [
  { src: 'assets/realisations/catalogue.jpg', caption: 'Catalogue promotionnel' },
],
```

Sans `src`, un emplacement élégant « Visuel à venir » s'affiche.

## Déploiement

### Option A — GitHub Actions (automatique)

Le workflow [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)
construit et publie le site à chaque push sur `main`.

1. Pousse le projet sur un dépôt GitHub.
2. Dans **Settings → Pages**, choisis **Source : GitHub Actions**.
3. Chaque push sur `main` déploie automatiquement.

### Option B — manuel

```bash
npm run build
```

Puis publie le contenu du dossier `dist/` (branche `gh-pages`, Netlify, Vercel…).

> `base: './'` dans `vite.config.js` rend le site fonctionnel aussi bien à la
> racine (`jgrewis.github.io`) que dans un sous-dossier
> (`jgrewis.github.io/siteCV/`). Pour un partage social optimal, remplace
> `./og-image.png` par l'URL absolue de l'image dans les balises Open Graph.

## Accessibilité & qualité

- Navigation clavier complète (Tab, Entrée, Échap), piège de focus dans le panneau.
- `prefers-reduced-motion` respecté (animations neutralisées).
- HTML sémantique, fallback `<noscript>`, contrastes adaptés au fond sombre.
- Repli automatique si `backdrop-filter` n'est pas supporté (fond plus opaque).
- Content-Security-Policy stricte en `<meta>`, liens externes en `rel="noopener noreferrer"`.
```
