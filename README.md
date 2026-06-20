# @synk/brand

Source unique de vérité pour la marque **SYNK** — logo, composant de logo animé, et design tokens — partagée par le **site** (`Synk-Website`) et l'**app** (`Synk-App`).

> Règle d'or : **une source par élément, paramétrable.** On n'duplique pas ; on
> ajoute un réglage. Une correction se propage partout via `npm update`.

## Installation

Repo privé → installe directement depuis GitHub (ou via GitHub Packages npm) :

```bash
npm install github:Walson-A/Synk-Brand        # ou: npm i @synk/brand (si publié)
```

`react` est une *peer dependency* (optionnelle — seulement pour le composant animé).

## Utilisation

### Tokens (couleurs, typo, espacements) — web + React Native
```js
import { color, font, space, radius, shadow } from '@synk/brand/tokens';

button.style.background = color.violet;   // '#6C63FF'
```

### Tokens en CSS (site Next.js)
```js
// app/layout.tsx — une seule fois
import '@synk/brand/tokens.css';
```
```css
.card { background: var(--surface-card); border: 1px solid var(--border-default); }
```

### Logo animé (web / React-DOM)
```jsx
'use client';
import { SynkLogoAnim } from '@synk/brand';

<div style={{ width: 300, height: 300 }}>
  <SynkLogoAnim palette="violet" markSize={150} showWordmark loop={false} />
</div>
```

| prop          | valeurs                                                          | défaut       |
|---------------|------------------------------------------------------------------|--------------|
| `palette`     | white-dark · violet · gradient · dark-light · mono · rose · gris | white-dark   |
| `background`  | auto · transparent · dark · violet · light                       | auto         |
| `showWordmark`| bool                                                             | true         |
| `showTagline` | bool (« Réservez votre studio »)                                 | false        |
| `loop`        | bool                                                             | false        |
| `markSize`    | 48–480 (px)                                                      | 300          |

### Logos
**Master vectoriel (à privilégier)** — scalable, recolorable :
- `synk-mark.svg` — le mark seul, monochrome (`currentColor`), fond transparent. Recolore-le en CSS : `color: var(--synk-violet)`.
- `synk-icon.svg` — l'icône d'app complète (mark blanc sur tuile violette, **dégradé diagonal** `#6C63FF` → `#553AC5` : lumière en haut-droite, plus sombre en bas-gauche — fidèle à l'icône iOS).

**PNG** (export ; pour stores / favicon / là où le SVG n'est pas accepté) :
- `synk-mark-white.png` — mark blanc, transparent
- `synk-icon-violet.png` · `synk-icon-violet-light.png` · `synk-icon-grey.png` · `synk-icon-black.png` — mark blanc sur tuile (par contexte de fond)
- `synk-icon-512.png` — export 512×512

> Convention : un seul axe — `synk-{mark|icon}-{contexte}`. `mark` = glyphe seul (transparent) ; `icon` = glyphe sur une tuile. Les variantes de couleur de fond se dérivent idéalement du SVG `currentColor` plutôt que de multiplier les PNG.

### Pack d'icônes d'app (`src/logo/app-icons/`)
Généré depuis le master — remplace les anciens exports :
- `ios-1024.png` (full-bleed, iOS applique son propre masque) · `apple-touch-180.png`
- `android-maskable-512.png` (zone de sécurité 66%) · `android-foreground-432.png` (transparent, pour l'icône adaptive)
- `pwa-512.png` · `pwa-192.png` · `favicon-48/32/16.png`

```html
<!-- web -->
<link rel="icon" href="/synk/favicon-32.png" sizes="32x32">
<link rel="apple-touch-icon" href="/synk/apple-touch-180.png">
```
```js
// app.config.js (Expo) :  icon: './assets/synk/ios-1024.png',
//   android.adaptiveIcon.foregroundImage: './assets/synk/android-foreground-432.png'
```

> Aperçu de tout le kit : ouvre `_brand-sheet.html`.

## ⚠️ React Native (app Expo)
Le composant `SynkLogoAnim` utilise SVG/DOM **web**. Pour l'app RN :
- **Tokens + logos** : utilisables tels quels (`import { color } from '@synk/brand/tokens'`).
- **Animation** : nécessite une version `react-native-svg` (à ajouter dans `src/animation/SynkLogoAnim.native.jsx`) ou un affichage en WebView. À faire quand l'app en aura besoin.

## Tokens : app/marketing = canonique, admin = surcouche locale
Deux jeux de valeurs coexistent dans le code :
- **App + marketing** (ce package, d'après le Design Bible) : canvas `#0a0a0a`, carte `#171717`, radii 8/12/16/24, status `#10b981`/`#ef4444`, texte `#ededed`.
- **Admin web** (`Synk-Website/globals.css`) : variante plus dense — canvas `#0A0B0D`, carte `#101114`, radii 4/6/8/12, status plus vifs, texte `#F2F3F5`.

**Parti pris** : l'admin est interne et utilisé par peu de monde → on ne le promeut PAS en thème partagé (éviter la sur-abstraction = dette). Ce package porte **un seul jeu canonique** : les valeurs **app/marketing** (la vraie identité publique). L'admin **partage le socle** (violet, logo, police, status) mais garde sa **densité propre** (radii serrés, surfaces légèrement différentes) en **overrides locaux** dans `Synk-Website`. À surveiller : la couleur d'accent, le logo et la police doivent rester alignés sur ce package des deux côtés.

## Structure
```
Synk-Brand/
├── src/
│   ├── index.js              ← API publique (seul point d'entrée)
│   ├── tokens.js             ← tokens en JS (cross-plateforme)
│   ├── tokens.css            ← tokens en CSS custom properties
│   ├── animation/
│   │   ├── SynkLogoAnim.jsx  ← composant (web)
│   │   └── logo-data.js      ← images logo (base64)
│   └── logo/                 ← synk-mark.svg (master) + synk-icon.svg + PNG d'export
├── tokens/
│   ├── tokens.json           ← SOURCE de vérité (DTCG)
│   └── style-dictionary.config.mjs
└── .github/workflows/release.yml
```

## Versionnage (semver) — éviter la dette
- `patch` : correction sans impact visuel. `minor` : ajout rétro-compatible. `major` : **changement cassant** (renommage d'export, valeur de token modifiée).
- Les consommateurs **épinglent** une version et font `npm update` quand ils veulent — jamais de suivi de `main` à l'aveugle.
- L'**API publique = `src/index.js`** uniquement. Tant que ces exports ne changent pas de nom, l'intérieur peut être refactoré librement.

## Modifier les tokens
1. Édite `tokens/tokens.json` (la source).
2. `npm run build:tokens` → régénère `build/` (CSS/SCSS/JS).
3. Reporte dans `src/tokens.js` / `src/tokens.css` (ou branche-les sur `build/`).
4. Commit + bump de version.

Voir `CHANGELOG.md` pour l'historique.
