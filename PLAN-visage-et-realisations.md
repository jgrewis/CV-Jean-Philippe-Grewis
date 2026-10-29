# Plan : refonte du CV sur le modèle de landonorris.com

Branche : `feat/scroll-realisations`.

Références :
- landonorris.com, analysé le 28/10/2026 ;
- les preuves m2A, dans `/Volumes/Samsung_T5/m2A-preuves-CV-web`.

> Version 2 du plan, du 29/10. Elle remplace la version 1, qui gardait la carte mentale et le thème sombre.

## 1. Résumé des demandes

1. **Refondre entièrement le design** pour se rapprocher de landonorris.com. On **supprime la carte mentale**.
2. Passer sur un **thème clair**.
3. Placer en tête de page un **visage plein écran** avec une animation « qui passe dessus » : un appareil photo, puis d'autres accessoires, se révèlent sous le pointeur. Les visuels HD de JP seront **générés par IA**, avec ChatGPT, par JP lui-même.
4. Ajouter une **section réalisations au défilement**, animée, avec une **sélection faite par Claude** dans le dossier m2A.
5. **Droits** : JP n'a pas d'accord écrit de m2A. On n'utilise donc **que des supports déjà publiés et sans enfants**, avec la mention « Réalisations pour Mulhouse Alsace Agglomération ».
6. **Pas de recompression** des images, mais un **chargement différé**.

## 2. Évaluation

| # | Nature | Ampleur | Risques |
|---|---|---|---|
| 1-2 | Refonte complète | Nouvelle page qui défile. Suppression de la carte, du verre, du panneau de détail et de la caméra | Perte de l'existant : réversible, c'est sur une branche et dans l'historique git. Tout le contenu de `cv.js` doit rester présent. |
| 3 | Fonctionnalité, design | Visage avec masque en canvas 2D | Images HD pas encore disponibles. Mobile. Accessibilité d'un effet piloté au pointeur. |
| 4-5 | Contenu, fonctionnalité | Sélection, données, section | Droits (voir §5). Poids sans recompression. |
| — | Intro existante | Elle passe en clair | Le monogramme et les lignes sont en blanc : il faut inverser les couleurs. |

## 3. Hors périmètre

- **Générer les photos** : JP le fait dans ChatGPT. Claude fournit les consignes et les prompts (§9) et pose des images provisoires.
- La vidéo, et les PDF consultables (on n'utilise que leur aperçu).
- La boutique, le calendrier et les autres rubriques propres à un pilote de F1.
- Le texte de `cv.js` : il est conservé tel quel. Sa réécriture est une étape suivante.
- Toute reprise des **fichiers, polices ou couleurs** de landonorris.com : on reprend des mécaniques, pas une identité.

## 4. Décisions et arbitrages

**Tranchés par JP le 29/10 :** abandon de la carte mentale, thème clair, visuels par IA, droits limités aux supports publiés sans enfants avec la mention, sélection confiée à Claude, chargement différé sans recompression. **On garde l'intro, passée en clair.** Plan v2 validé.

**Décisions prises seul (à corriger si besoin) :**
- **Déroulé de la page**, calqué sur les mécaniques de la référence :
  1. **Intro**, la même mécanique, passée en clair : fond `#EDEBE6`, monogramme et nom à l'encre, lignes en encre à environ 8 %. C'est plus proche de terminal-industries d'origine.
  2. **Visage** plein écran : l'accessoire se révèle sous le pointeur. Une petite mention « Passez la souris » (ou « Touchez » sur mobile) et un bouton « Voir l'appareil photo » au clavier.
  3. **Manifeste** : un grand texte qui mélange une police sans-serif et des mots-clés en serif italique colorés, construit à partir de `profile.tagline` et du résumé « À propos ».
  4. **Parcours** : les 4 expériences en grands blocs qui apparaissent au défilement, avec les chiffres clés (`kpis`) et la photo de fond de chaque entreprise déjà présente dans `public/assets`.
  5. **Réalisations** : une rangée par support, photos disséminées à gauche et à droite avec une légende (support · thème), un léger effet de profondeur, un passage de noir et blanc à couleur à l'entrée dans l'écran, et la mention m2A.
  6. **Compétences et formations** : listes en grandes étiquettes.
  7. **Contact** : un grand pied de page avec le nom en très gros, l'e-mail, le téléphone, LinkedIn et le hub.
- **Charte claire :**
  - fond `#EDEBE6` (blanc cassé chaud), encre `#141414` ;
  - **un accent violet `#5B3DF5`**, dans la continuité du violet actuel, et pas le vert fluo de la référence ;
  - **lignes de fond topographiques**, discrètes, en encre à environ 6 %.
- **Typographie** : deux polices **libres** (licence OFL), **auto-hébergées** en woff2 et limitées aux caractères latins, sans Google Fonts, pour respecter la CSP et le RGPD.
  - une grotesque large pour les titres (par exemple Inter Tight ou Archivo) ;
  - une serif italique pour les mots-clés (par exemple Instrument Serif).
  - Choix final en T1, poids total inférieur à 120 Ko.
- **Effet visage** en canvas 2D, sans WebGL ni dépendance. Des taches douces sont peintes aux positions du pointeur et s'effacent en environ 1,2 s. Ce masque découpe l'image « accessoirisée » posée sur le portrait.
  - La liste des accessoires est extensible (`src/data/hero.js`). Un accessoire différent est tiré à chaque visite, ou ils s'enchaînent.
- **Défilement** : natif, avec `IntersectionObserver` et des variables CSS, sans GSAP ni Lenis. Effet de profondeur en `transform` uniquement, coupé si les animations sont réduites.
- **Images** : on utilise les WebP du disque **tels quels** (1600 px au maximum, déjà en q82), avec `loading="lazy"`, `decoding="async"`, `width` et `height` renseignés, et les vignettes de 240 px en aperçu flou.
- **Suppression** de la carte mentale et de son outillage, devenus du code mort : `MindMap`, `Node`, `Connections`, `DetailPanel`, `zoom`, `layout`, `wordPath`, `glass.css`, `mindmap.css`, `detail.css`.
  - `cv.js` reste la **source unique** du contenu.
  - On conserve `a11y`, `escapeHtml` et `icons` s'ils servent encore.

## 5. Points de risque

- **Droits, à signaler sans bloquer** : sans accord écrit, publier ces supports reste un risque, même limité à des contenus déjà publics. La mention m2A ne vaut pas autorisation.
  - Les **photos de shooting** relèvent en plus du **droit d'auteur du photographe**. La sélection privilégie donc les **supports conçus par JP** (affiches, bâches, bus habillés, magazines, web, réseaux sociaux) et ne prend que **peu de photos de shooting**, sans personne identifiable.
- **Poids sans recompression** : environ 30 images d'à peu près 150 Ko, soit 4 à 5 Mo, toutes en chargement différé. Le premier écran reste léger : on mesure le poids réel.
- **Photos IA** : il faut deux images **parfaitement superposables**. Le procédé est donné au §9. Si ChatGPT décale le cadrage, le contour de l'effet se verra. Repli : un accessoire dessiné en SVG sur un seul portrait.
- **Retour arrière** : tout reste sur la branche. `main` et le site en ligne ne changent pas sans le feu vert de JP.

## 6. Approche technique

| Fichier | Contenu |
|---|---|
| `index.html` | Squelette sémantique des sections, et `<noscript>` avec le contenu essentiel |
| `src/styles/tokens.css` | Réécrit pour la charte claire : couleurs, typo, espacements sur l'échelle de 8 pt de `1.Regles.md` |
| `src/styles/base.css`, `reset.css` | Adaptés à une page qui défile |
| `public/fonts/` + `src/styles/fonts.css` | Polices auto-hébergées |
| `src/components/Page.js` | Monte les sections. Une animation d'apparition commune passe par un seul `IntersectionObserver` partagé |
| `src/components/Hero.js`, `src/data/hero.js`, `src/styles/hero.css` | Le visage |
| `src/components/sections/*.js` + `src/styles/sections.css` | Manifeste, Parcours, Compétences, Contact |
| `src/components/Realisations.js`, `src/data/realisations.js`, `src/styles/realisations.css` | Les réalisations |
| `public/assets/realisations/` | Copies des WebP sélectionnés, non recompressés |
| Intro (`intro*.css`, `introLogo.js`) | Couleurs passées en clair, via les tokens |

**Tranches**, par risque décroissant :
1. **T1** : nouvelle fondation (charte, polices, page qui défile, sections avec le contenu de `cv.js`, intro en clair, suppression de la carte). Le site est utilisable dès cette tranche, sans effets.
2. **T2** : sélection et copie des preuves, puis **planche validée par JP**. En parallèle de T1.
3. **T3** : réalisations et animations au défilement. **T4** : visage avec images provisoires. Les deux en parallèle.
4. **T5** : contrôles, puis recette.

## 7. Plan de délégation

| # | Tâche | Fichiers | Modèle | Raison | Dépend de |
|---|---|---|---|---|---|
| T1 | Fondation : charte claire, polices, page qui défile, sections avec le contenu, intro en clair, suppression de la carte | `index.html`, `main.js`, `tokens.css`, `base.css`, `reset.css`, `fonts.css`, `Page.js`, `sections/*`, `sections.css`, intro, suppressions | opus | Refonte transverse, design et identité | — |
| T2 | Sélection d'environ 30 preuves (règles des droits), copie, `realisations.js`, planche de validation | `src/data/realisations.js`, `public/assets/realisations/` | opus | Jugement visuel et droits | — (parallèle à T1) |
| T3 | Réalisations : rangées par support, photos disséminées, noir et blanc vers couleur, effet de profondeur, chargement différé | `Realisations.js`, `realisations.css` | opus | Design et performance | T1, T2 validée |
| T4 | Visage : masque canvas, accessoires, repli clavier et animations réduites, images provisoires | `Hero.js`, `hero.css`, `src/data/hero.js` | opus | Effet délicat, accessibilité | T1 |
| T5 | Contrôles : build, console, 404, poids | — (lecture seule) | haiku | Mécanique | T3, T4 |
| — | Intégration, recette navigateur, mesures | — | moi | Non délégable | T5 |

### Suivi
- **T2 (opus) faite.** 26 preuves sélectionnées. Planche contrôlée, puis arbitrages de JP appliqués par moi le 29/10 :
  - ajoutés : « Baigneurs » (A3 et post) et signalétique du CSRA ;
  - retirés : programme de la patinoire, « Je passe en mode vélo » (non publiée) et application Compte Mobilité ;
  - au final, 26 preuves pour 2,5 Mo.
- **T1 (opus) faite et vérifiée.**
  - Build OK, polices 67 Ko, console vide, sections rendues à 1280 px.
  - Écart validé : pendant l'intro, la page prend la teinte alternée, sinon l'octogone serait invisible sur fond clair.
  - Le contact est dans un `<footer>`, pas dans une section.
- **T3 et T4 (opus) faites**, après une coupure due à la limite d'usage et une reprise. Code relu.
- **Intégration (moi) :**
  - débordement corrigé à 320 px : titre « PROFESSIONNELLES » plafonné en vw, avec césure ;
  - réalisations resserrées de 16 à 13,9 écrans (images à 60svh au maximum, écarts réduits), aucun chevauchement.
- **T5 faite par moi**, tâche trop courte pour la déléguer : build OK, aucun 404, console vide, un seul h1, premier écran d'environ 200 Ko.
- **Recette navigateur :** l'effet appareil photo se révèle sous le pointeur, pied de page complet, aucun défilement horizontal à 320, 375 et 1280 px.

## 8. Checklist

**Demandes**
- [x] La carte mentale a disparu, le site est une page claire qui défile.
- [x] L'intro est passée en clair et s'ouvre sur le visage.
- [x] Le visage s'affiche en plein écran. L'accessoire se révèle sous le pointeur ou le doigt, et s'efface en environ 1,2 s.
- [x] Le bouton « Voir l'appareil photo » révèle l'accessoire au clavier, sans animation.
- [x] Ordre des sections : manifeste, parcours, réalisations, compétences et formations, contact. Tout le contenu de `cv.js` est présent.
- [x] Les réalisations sont regroupées par support, avec légende, apparition animée et effet de profondeur, et la mention m2A.
- [x] Le visuel est inspiré des mécaniques de la référence, sans reprise de sa charte ni de ses fichiers.

**Droits et contenu**
- [x] Aucun enfant ni portrait nominatif, uniquement des supports publiés, peu de photos de shooting. Vérifié sur la planche.
- [x] La planche de sélection est validée par JP avant l'intégration.

**Référentiel**
- [x] Bonnes pratiques : `textContent`, aucun `innerHTML` alimenté par des données, observateurs et écouteurs nettoyés, aucun code mort de la carte.
- [ ] Tokens et échelle d'espacement de 8 pt (`1.Regles.md`). Texte courant à 65 caractères de large au maximum, interligne de 1,5 au minimum.
- [x] Contrastes AA sur fond clair : texte 4.5:1, accent violet vérifié.
- [x] La CSP est inchangée et respectée (polices en `'self'`).

**Usage réel**
- [ ] Rendu à 375, 768 et 1280 px, sans défilement horizontal.
- [ ] Images en chargement différé avec dimensions réservées (aucun saut de mise en page). Premier écran sous 1 Mo.
- [ ] Les animations réduites coupent l'effet de profondeur et le masque animé.
- [x] Aucune erreur en console, aucun 404, `npm run build` passe.
- [ ] Navigation clavier complète : focus visible, ordre logique, lien d'évitement.

**Avant la mise en ligne, hors développement**
- [ ] Visuels HD générés par JP et intégrés.
- [ ] Feu vert de JP sur la publication, risque sur les droits accepté.

## 9. Visuels du visage à générer avec ChatGPT

Pour que l'effet fonctionne, les deux images doivent être **identiques au pixel près**, sauf l'accessoire.

1. **Portrait de base.** Envoyer 2 ou 3 vraies photos nettes de toi, puis demander :
   > « Crée un portrait photo réaliste de cet homme, cadré buste, de face, regard caméra, expression neutre et assurée, éclairage studio doux, fond uni gris très clair (#EDEBE6), vêtement sobre sombre. Format portrait 4:5, haute définition. Garde fidèlement son visage. »
2. **Version avec l'appareil photo.** Dans la **même conversation**, avec l'**outil de modification d'image**, et non une nouvelle génération :
   > « Modifie uniquement cette image : il tient un appareil photo reflex noir devant son œil droit, en position de prise de vue. Ne change rien d'autre : même cadrage, même pose, même éclairage, même fond, même taille. »
3. Recommencer l'étape 2 pour d'autres accessoires (casque audio, micro, badge presse…), **toujours à partir du portrait de base**.
4. M'envoyer les fichiers PNG en **2000 px au minimum**. Je vérifie la superposition et je recale si besoin.
