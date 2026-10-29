# CV interactif — Jean-Philippe Grewis

CV web en **page éditoriale claire qui défile** : intro animée (monogramme,
glitch, ouverture en octogone), visage en plein écran, manifeste, parcours,
réalisations, compétences et formations, puis grand pied de page Contact.
Polices libres auto-hébergées (Inter Tight, Instrument Serif via Fontsource).

Stack : **Vanilla JS + Vite**, zéro framework, aucune bibliothèque JavaScript à l’exécution (seules dépendances : deux paquets de polices Fontsource).

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
    ├── data/manifeste.js     # mots-clés mis en avant dans le manifeste
    ├── styles/               # tokens (charte), fonts, reset, base, page, sections, hero, realisations, intro*
    ├── components/           # Page, Hero, Realisations, Intro, sections/ (Bar, Manifesto, Parcours, Competences, Contact)
    └── utils/                # reveal (apparitions), tone (teinte du fond), topo (lignes de fond), dom, svg, monogram
```

## Mettre le CV à jour

Tout le contenu vit dans un seul fichier : [`src/data/cv.js`](src/data/cv.js).
Profil, contact, expériences, compétences, formation — on édite uniquement ce
fichier, l'interface se met à jour automatiquement.

### Ajouter des visuels de réalisations

La section « Réalisations » lit [`src/data/realisations.js`](src/data/realisations.js),
pas `cv.js`.

1. Dépose l'image dans `public/assets/realisations/` (WebP de 1600 px de large
   au plus, nom en minuscules sans accents, préfixé par le support :
   `print-…`, `web-…`).
2. Relève ses dimensions réelles en pixels (`sips -g pixelWidth -g pixelHeight fichier.webp`
   sur Mac).
3. Ajoute une entrée dans le tableau `realisations` :

```js
{
  src: 'assets/realisations/print-catalogue-2026.webp', width: 1131, height: 1600,
  support: 'print', theme: 'Sport',
  title: 'Catalogue des activités sportives 2026',
  alt: 'Ce que montre l’image, en une ou deux phrases, pour qui ne la voit pas.',
},
```

- `src` : chemin relatif, sans `/` au début (le site peut vivre dans un sous-dossier).
- `width` / `height` : dimensions **réelles** du fichier. Elles réservent la place
  avant le chargement et fixent la largeur de l'image dans la grille (un portrait
  reste étroit, un panoramique s'étale).
- `support` : l'`id` d'une entrée de `supports` (une rangée par support, dans
  l'ordre de ce tableau). Pour une nouvelle rangée, ajoute d'abord le support.
- `theme`, `title` : la micro-légende « SUPPORT · THÈME » et le titre affichés
  au-dessus de l'image.
- `alt` : obligatoire, décrit l'image.

L'ordre des entrées est l'ordre d'affichage dans la rangée ; la disposition
gauche / droite se recalcule seule. La mention `credit` reste affichée : ne
publier que des supports déjà diffusés (voir `PLAN-visage-et-realisations.md` §5).

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
