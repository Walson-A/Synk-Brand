# Changelog

Toutes les modifications notables de `@synk/brand`. Format basé sur
[Keep a Changelog](https://keepachangelog.com/) · versionnage [SemVer](https://semver.org/lang/fr/).

## [0.5.1] — 2026-06-21
### Changé
- **Logos couleur régénérés en 2048px** (depuis le master, RGBA, bords nets) :
  `synk-icon-violet`, `synk-icon-grey`, `synk-icon-black`, `synk-mark-white` +
  `synk-icon-512` (export). Avant : 500px. Dégradés fidèles à l'icône iOS.
- `logo-data.js` (données du composant web `SynkLogoAnim`) régénéré en 2048px.

### Ajouté
- **`synk-icon-studio.png`** : variante STUDIOS (accent `#A855F7`), tuile dégradé
  `#B57BFF → #A855F7 → #8B3FD9` + highlight radial. Différencie studios vs artistes.

### Supprimé
- `synk-icon-violet-light.png` : variante non fondée, remplacée par `synk-icon-studio`.

## [0.5.0] — 2026-06-20
### Changé
- **`SynkLogoAnim.native`** refondu pour coller à l'animation web de marque : lueur
  de genèse → tracé des anneaux → **snap** (rebond d'échelle + flash + éclat blanc
  « sheen ») → **« SYNK » révélé lettre par lettre** (stagger 90 ms) → tagline. Glow
  simplifié en un **halo radial doux** (plus de cœur blanc, zéro filtre → rendu
  identique iOS/Android). Pace ~3,2 s. Tagline éclaircie (`#c8ccd8`) pour la lisibilité.

### Ajouté
- Export **`SYNK_SPLASH_DURATION`** (ms) : durée totale de l'anim, à utiliser comme
  durée minimale d'affichage de l'overlay (garder le splash tant que l'anim n'a pas
  joué en entier, même si l'app est prête plus tôt).

## [0.4.0] — 2026-06-20
### Ajouté
- **`SynkLogoAnim.native.jsx`** : port React Native du splash (react-native-svg +
  reanimated + expo-linear-gradient ; props portables, zéro filtre CSS). Exporté
  via la condition `react-native` de `@synk/brand/animation` + le sous-chemin
  explicite `@synk/brand/animation/native`. Types fournis (`SynkLogoAnim.native.d.ts`).
- Prop **`glow`** (`string` rgb | `false`) sur `SynkLogoAnim` : éteint le halo radial
  quand le fond fournit déjà un glow (ex. `PremiumBackground` de l'app) → pas de doublon.
- **Frames splash statiques** par résolution (`src/logo/splash/`) pour caler l'image du
  splash natif sur la frame finale du mark. App-icons régénérés (store-ready).
- **`ADOPTION.md`** : guide d'adoption (app & site).

### Corrigé
- `exports` expose désormais **`./package.json`** (évite `ERR_PACKAGE_PATH_NOT_EXPORTED`
  pour les outils qui le lisent par sous-chemin).

## [0.3.0] — 2026-06-20
### Ajouté
- **Types TypeScript** pour `@synk/brand/tokens` (`src/tokens.d.ts` + condition
  `types` dans `exports`) → le package se consomme sans erreur depuis un projet
  TS strict (l'app Expo, le site). Avant, l'import levait un TS7016
  (« pas de fichier de déclaration »).

## [0.2.0] — 2026-06-20
### Corrigé
- **Parité de la source de vérité** : `tokens/tokens.json` était incomplet face à
  `src/tokens.js` — il manquait la police (`font.family` = Inter), les dégradés,
  les ombres, le `blur`, le `motion` et le leading/tracking. Un `build:tokens`
  depuis le JSON aurait *perdu* ces tokens. Tout est remonté dans la source ;
  `build:tokens` vérifié OK.

### Ajouté
- `src/tokens.css` : échelle de tailles de police (`--size-*`), `--leading-*`,
  `--tracking-*`, `--blur-*` et `--shadow-glow-strong` (absents côté CSS jusqu'ici).

## [0.1.0] — 2026-06-19
### Ajouté
- Composant `SynkLogoAnim` : animation d'entrée du logo (le « S » se tisse depuis
  le centre, snap « clic », puis wordmark + tagline). 7 palettes, formats et
  réglages (`palette`, `background`, `showWordmark`, `showTagline`, `loop`, `markSize`).
- Design tokens SYNK en JS (`@synk/brand/tokens`) et CSS (`@synk/brand/tokens.css`) :
  couleurs, typographie, espacements, radii, ombres, motion.
- Source de vérité des tokens en DTCG (`tokens/tokens.json`) + config Style Dictionary.
- Logos : **master vectoriel** `synk-mark.svg` (monochrome, recolorable) + `synk-icon.svg` (tuile violette, dégradé diagonal fidèle à l'iOS), exports PNG renommés `synk-{mark|icon}-{contexte}`, et **pack d'icônes d'app** (`app-icons/` : iOS, Android maskable/foreground, PWA, favicons) généré depuis le master.
