# Plan — Animation d'intro du CV

Branche : `feat/animation-intro`. Référence : intro de terminal-industries.com, analysée à partir de la vidéo du 28/10/2026.

## 1. Résumé des demandes

1. Ajouter une animation d'ouverture au CV, avec la même mécanique que celle de terminal-industries.com, adaptée à l'univers du CV.
2. Garder les cinq temps de la référence : lignes de fond qui glissent en place, pictogramme seul, nom qui apparaît en glitch pixel, trait effilé qui s'étire, puis ouverture en octogone qui dévoile le site.
3. Faire une intro **sombre**, dans les couleurs du CV (`--bg-0`, lignes blanches à environ 7 %).
4. Prendre comme logo le **monogramme « JPG »**, puis faire apparaître « Jean-Philippe Grewis » en glitch.
5. Faire dévoiler la **carte mentale** par l'ouverture, son animation d'entrée actuelle se lançant au moment de l'ouverture.
6. Dessiner les lignes de fond comme des **courbes qui rappellent les branches** de la carte mentale, et non comme des routes.
7. Durée d'**environ 2,5 s**, et intro **passable** au clic ou au clavier.
8. Jouer l'intro **une fois par visite** (onglet) et la **désactiver** quand le système demande de réduire les animations.

## 2. Évaluation

| # | Nature | Ampleur | Risques |
|---|---|---|---|
| 1-2 | Nouvelle fonctionnalité, animation | Nouveau composant et nouvelle feuille de style, plus un branchement dans `main.js` | L'animation d'entrée de la carte se jouerait cachée sous l'intro si la carte est montée trop tôt |
| 3-4 | Design et identité | Monogramme en SVG fait main, sans fichier externe | Lisibilité du glitch, et police du nom pendant le glitch |
| 5 | Intégration | `main.js` et `MindMap` | Calcul des positions de la carte (layout) fait pendant que l'écran est masqué |
| 6 | Design | Tracés SVG générés | Fond trop chargé, qui détourne l'attention du nom |
| 7-8 | Utilisabilité, accessibilité | Logique du composant | Le CV inaccessible tant que l'intro tourne, focus clavier piégé sous l'intro, `sessionStorage` indisponible (navigation privée) |

## 3. Hors périmètre

- Aucune dépendance ajoutée : pas de Rive, pas de GSAP. Tout est fait en CSS et JS natif, comme le reste du projet.
- Aucun fichier repris de terminal-industries.com : seules la mécanique et la chronologie sont reproduites.
- Les modifications du contenu du CV (`cv.js`) sont une étape ultérieure.
- La mise en ligne (push sur `main`) n'aura lieu qu'après ton feu vert.

## 4. Décisions et arbitrages

**Validés par le client (« go with your recs ») :** intro sombre, monogramme JPG suivi du nom, ouverture sur la carte mentale, lignes en forme de branches, environ 2,5 s et intro passable, une fois par onglet, désactivée si les animations sont réduites.

**Tranchés seul :**
- **Chronologie cible (environ 2,5 s) :**
  - 0–0,8 s : les lignes glissent en place, en ralentissant.
  - 0,3 s : le monogramme apparaît.
  - 0,8–1,05 s : glitch, puis le nom s'écrit en commençant par la fin.
  - jusqu'à 1,6 s : l'ensemble reste affiché.
  - 1,6–1,9 s : le trait effilé s'étire avec un filet d'horizon.
  - 1,9–2,4 s : l'octogone s'ouvre, lentement puis vite.
  - 2,5 s : l'intro est retirée du DOM.
- La carte mentale est **montée au début de l'étirement du trait** (1,6 s). Son animation d'entrée se joue ainsi pendant l'ouverture.
- L'intro est un calque `position: fixed` au-dessus de `#app`. Elle est passable par clic, Entrée, Échap ou Espace. Un libellé « Passer l'intro » reste lisible par les lecteurs d'écran, et le focus est rendu à la page à la fin.
- La mémoire d'une visite passe par `sessionStorage`, encapsulé dans un try/catch : en cas d'échec, l'intro se joue.
- Les durées sont pilotées par des variables CSS, et l'enchaînement est fait par `animationend` ou un minuteur unique. On n'empile pas de `setTimeout` en cascade.

## 5. Points de risque

- **Carte montée au mauvais moment** : on la monte à 1,6 s, puis on vérifie dans le navigateur que les traits de la carte se dessinent bien pendant l'ouverture.
- **Glitch illisible ou qui clignote** : effet limité à environ 0,25 s, sans flash plein écran (sécurité pour les personnes photosensibles).
- **Performance** : animer uniquement `transform`, `opacity` et `clip-path`. Ne pas utiliser `filter: blur` en continu pendant l'ouverture.
- **Retour arrière** : tout est isolé dans `Intro.js` et `intro.css`. Le retrait tient à une ligne dans `main.js`.

## 6. Approche technique

- `src/components/Intro.js` : construit le calque, orchestre la chronologie, gère le saut, la mémoire de visite et la réduction des animations, puis appelle `onReveal()` pour monter la carte.
- `src/components/IntroLines.js` : génère les tracés SVG en forme de branches.
- `src/utils/introLogo.js` : monogramme JPG en SVG et découpe du nom pour le glitch.
- `src/styles/intro.css` : calque, trait effilé, octogone (`clip-path: polygon`). `intro-logo.css` porte le glitch, `intro-lines.css` les lignes.
- `src/main.js` : importe les styles, lance `new Intro({ onReveal: () => new MindMap(root) })`.

Ordre des tranches :
1. Squelette complet : calque, ouverture en octogone, montage de la carte, saut, réduction des animations.
2. Monogramme et glitch du nom, en parallèle des lignes de fond.
3. Recette.

## 7. Plan de délégation

| # | Tâche | Fichiers | Modèle | Raison | Dépend de |
|---|---|---|---|---|---|
| T1 | Squelette de l'intro : calque, chronologie, trait effilé, ouverture octogone, montage de la carte, saut, `sessionStorage`, réduction des animations | `Intro.js`, `intro.css`, `main.js` | opus | Touche au démarrage du site : peut casser l'existant | — |
| T2 | Monogramme JPG et glitch pixel du nom | `utils/introLogo.js`, `styles/intro-logo.css` | opus | Identité visuelle, goût | T1 |
| T3 | Lignes de fond en forme de branches, qui glissent en place | `IntroLines.js`, `styles/intro-lines.css` | sonnet | Périmètre clair, SVG génératif simple | T1 |
| T4 | Contrôle mécanique : build, console, 404 | — (lecture seule) | haiku | Mécanique | T2, T3 |
| — | Intégration, réglage fin des temps, recette navigateur | — | moi | Non délégable | T4 |

### Suivi
- **T1 faite (opus), vérifiée le 28/10.** Code relu, puis ouverture figée dans le navigateur : l'octogone chanfreiné dévoile bien la carte.
  - Écart avec le plan, validé : c'est le **calque qui est troué** (`clip-path: polygon(evenodd)`, 16 points), pas `#app` qui est découpé. La caméra, le verre et les halos du `body` restent intacts.
  - Pendant l'intro, `#app` est rendu `inert`.
  - Ajout d'un attribut cumulatif `data-reached` en plus de `data-phase`.
- **T2 (opus) et T3 (sonnet) faites et vérifiées le 28/10.** Revue du code, puis images figées : monogramme seul, mi-glitch, nom complet, trait qui raye le logo, et rendu à 375 px.
- **T4 faite par moi, pas par haiku.** Le contrôle était trop court pour être délégué : `npm run build` passe, console vide, aucun 404, saut par Échap vérifié, `#app` propre à la fin.
- **Non vérifié :**
  - la fluidité en temps réel (le panneau du navigateur limite le rafraîchissement à environ 3 images/s) ;
  - le mode `prefers-reduced-motion` (impossible à émuler ici, chemin relu dans le code) ;
  - le rejeu dans un nouvel onglet, Safari et Firefox.
- Tâches T2 et T3 lancées en parallèle. Consigne ajoutée à T2 : logo en une seule ligne, centré à 50 % de la hauteur, pour que le trait le raye.

T2 et T3 partent en parallèle : leurs fichiers sont distincts. Chacune ajoute son point d'accroche dans `Intro.js` via une fonction prévue par T1, et c'est moi qui fais l'intégration.

## 8. Checklist

**Demandes**
- [x] À la première visite, l'intro se joue sur fond sombre, puis s'ouvre sur la carte mentale en 2,5 s ± 0,3 s.
- [x] Les lignes en forme de branches glissent en place puis s'arrêtent.
- [x] Le monogramme JPG apparaît seul, puis « Jean-Philippe Grewis » s'écrit en glitch.
- [x] Le trait effilé s'étire avec le filet d'horizon, puis l'octogone s'ouvre jusqu'au plein écran.
- [ ] Les traits et les bulles de la carte s'animent pendant l'ouverture, pas avant.
- [x] Un clic, Entrée, Échap ou Espace passe l'intro immédiatement, et la carte est utilisable.
- [ ] En rechargeant dans le même onglet, l'intro ne se rejoue pas. Dans un nouvel onglet, elle se rejoue.
- [ ] Avec `prefers-reduced-motion`, aucune intro : la carte s'affiche directement.

**Référentiel**
- [x] Les règles de `2.BonnesPratiques.md` concernées sont respectées (aucune entrée de liste noire).
- [ ] Les espacements et tokens de `1.Regles.md` et `tokens.css` sont réutilisés, sans valeur en dur inutile.
- [x] La CSP de `index.html` est inchangée et respectée (aucun script en ligne).

**Usage réel**
- [ ] L'intro est correcte à 375, 768 et 1280 px : nom non tronqué, aucun scroll horizontal.
- [x] Le focus clavier n'est pas piégé sous le calque, et l'intro est retirée du DOM à la fin.
- [x] Aucune erreur en console, aucun 404, `npm run build` passe.
- [ ] L'animation reste fluide (pas de saccade visible lors de l'ouverture).
