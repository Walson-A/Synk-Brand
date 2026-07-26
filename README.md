# @synk/brand

Source unique de vérité pour les marques de l'écosystème — logo, composant de logo animé, design tokens et composants.

- **SYNK** — le site (`Synk-Website`) et l'app (`Synk-App`). Violet, dark-only, Inter.
- **COLAB** — la brique collaboration : web, plugin VST et la section COLAB de l'app SYNK. Monochrome bleu, clair **et** sombre, IBM Plex Sans. Voir [COLAB](#colab--la-deuxième-marque).

Les deux marques sont **indépendantes** : elles ne partagent ni échelle typographique, ni rayons, ni palette. Elles cohabitent volontairement — c'est ce qui fait qu'on comprend qu'on utilise COLAB et pas SYNK.

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

## COLAB — la deuxième marque

Direction artistique validée au chantier **C11** (2026-07-26). Les deux documents de décision
font foi et se lisent avant toute implémentation :

- [`design/colab/palette.md`](design/colab/palette.md) — la couleur : monochrome 211°, deux modes.
- [`design/colab/direction.md`](design/colab/direction.md) — typo, densité, formes, icônes, élévation, états, sémantique.

### Utilisation

```js
// web — les variables, puis les classes
import '@synk/brand/colab/tokens.css';
import '@synk/brand/colab/components.css';
```
```html
<!-- mode clair par défaut ; le sombre s'active explicitement -->
<div class="colab-root" data-colab-theme="dark">…</div>
```
```js
// React Native / JS
import { light, dark, theme, ramp, radius } from '@synk/brand/colab/tokens';

theme(scheme).action;   // '#1B395A' en clair · '#ffffff' en sombre
```

La forme `{ light, dark }` est **volontairement identique** à celle de `Colors[scheme]` déjà
utilisée par `Synk-App` — rien de nouveau à apprendre côté app.

### Ce qui est figé, et ce qui ne l'est pas

| | |
|---|---|
| Teinte unique | **211°**, deux saturations : `navy` (chroma pleine, mode clair + marque) et `slate` (55 %, mode sombre — les couleurs saturées vibrent sur fond noir) |
| Couleur de marque | **`#1B395A`**, valeur fournie par l'owner, figée. Les autres étages sont calculés autour d'elle |
| Accent | **il n'y en a pas.** L'action primaire s'inverse : navy sur blanc en clair, blanc sur navy en sombre |
| Couleur sémantique | uniquement sur l'**icône** d'un état réel (échec, quota, succès). Jamais un fond, jamais du texte |
| Police | IBM Plex Sans (OFL) — ne remplace **pas** Inter côté SYNK |
| Icônes | Tabler, trait 1.75. Repli documenté : Lucide. Ne pas mélanger les deux jeux |

### Mode sombre : pourquoi pas `prefers-color-scheme`

Le CSS généré n'écoute **pas** la préférence système. Le mode clair est le défaut (D23,
light-mode-first) et le sombre s'active via `[data-colab-theme="dark"]`. C'est l'application qui
décide — elle peut lire la préférence OS en JS et poser l'attribut si elle le souhaite, mais le
package ne lui impose pas ce comportement.

### Modifier les tokens COLAB

Le système est fait pour bouger — c'est une contrainte de conception, pas un accident :

1. **Deux couches.** `ramp` (les primitives) → `light`/`dark` (les rôles, qui aliasent la rampe).
   Changer un étage de rampe re-teinte tout ce qui l'alias ; changer un rôle ne bouge que lui.
2. **Généré, jamais recopié.** `npm run build:tokens` régénère `src/colab/*` depuis
   `tokens/colab.json`. ⚠️ **Ne jamais éditer `src/colab/tokens.*` à la main** — le prochain build
   écrase. `npm run check:parity` le détecte.
3. **Surchargeable à l'exécution.** Tout est en custom properties : une variable redéfinie suffit
   à re-teinter tous les composants, sans rebuild — pratique pendant que C9 construit les écrans.

### Composants

`src/colab/components.css` est écrit à la main et ne contient **aucune valeur littérale** : tout
passe par `var(--colab-*)`. Le garde-fou refuse une couleur en dur et une variable inexistante.

Classes disponibles : `colab-root` · `colab-label` `colab-title` `colab-meta` `colab-num` ·
`colab-btn` (`--primary` `--ghost` `--icon`) · `colab-input` · `colab-icon` ·
`colab-avatar` (`--project`) `colab-avatars` `colab-tile` `colab-wordmark` ·
`colab-row` (`aria-selected`, `data-unread`) `colab-badge` · `colab-card` `colab-floating` `colab-scrim` ·
`colab-msg` (`--mine`) `colab-bubble` `colab-system` `colab-daysep` ·
`colab-file` `colab-chip` (`--square`) · `colab-play` `colab-wave` ·
`colab-notice` (`--danger` `--success`) · `colab-empty` `colab-drop` `colab-progress`.

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
│   ├── index.js              ← API publique SYNK (seul point d'entrée)
│   ├── tokens.js             ← tokens SYNK en JS      ⚠ ÉCRIT À LA MAIN
│   ├── tokens.css            ← tokens SYNK en CSS     ⚠ ÉCRIT À LA MAIN
│   ├── animation/            ← SynkLogoAnim (web + native) + logo-data.js
│   ├── logo/                 ← synk-mark.svg (master) + synk-icon.svg + PNG + app-icons
│   └── colab/
│       ├── tokens.css        ← ⚙ GÉNÉRÉ — ne pas éditer
│       ├── tokens.js         ← ⚙ GÉNÉRÉ — ne pas éditer
│       ├── tokens.d.ts       ← ⚙ GÉNÉRÉ — ne pas éditer
│       └── components.css    ← écrit à la main, 100 % piloté par tokens
├── tokens/
│   ├── tokens.json           ← SOURCE SYNK  (DTCG)
│   ├── colab.json            ← SOURCE COLAB (DTCG)
│   └── style-dictionary.config.mjs   ← deux marques, formats sur mesure
├── scripts/
│   └── check-parity.mjs      ← le garde-fou (npm test)
└── design/colab/             ← décisions de DA + maquettes de validation (C11)
```

**Deux régimes, et c'est important de ne pas les confondre :**

| | SYNK | COLAB |
|---|---|---|
| Source | `tokens/tokens.json` | `tokens/colab.json` |
| Fichiers consommés | **écrits à la main** | **générés** |
| Risque | dérive silencieuse entre source et copie | quelqu'un édite le fichier généré, ou oublie de rebuilder |
| Filet | `npm run check:parity` | `npm run check:parity` |

Pourquoi SYNK n'est pas généré : `src/tokens.js` a une forme *plate* (`color.surfaceCard`) que le
format `javascript/es6` de Style Dictionary ne produit pas. La régénérer changerait la forme
consommée par une app en production, pour zéro gain produit. On outille la dérive au lieu de la
supprimer — le problème s'était déjà produit en v0.2.0.

## Versionnage (semver) — éviter la dette
- `patch` : correction sans impact visuel. `minor` : ajout rétro-compatible. `major` : **changement cassant** (renommage d'export, valeur de token modifiée).
- Les consommateurs **épinglent** une version et font `npm update` quand ils veulent — jamais de suivi de `main` à l'aveugle.
- L'**API publique = `src/index.js`** uniquement. Tant que ces exports ne changent pas de nom, l'intérieur peut être refactoré librement.

## Modifier les tokens

**COLAB** — entièrement automatique :
1. Édite `tokens/colab.json`.
2. `npm run build:tokens` → régénère `src/colab/tokens.{css,js,d.ts}`.
3. `npm run check:parity` (ou `npm test`).
4. Commit + bump de version.

**SYNK** — la copie reste manuelle, d'où le garde-fou :
1. Édite `tokens/tokens.json` (la source).
2. `npm run build:tokens` → régénère `build/` (CSS/SCSS/JS, non publié).
3. **Reporte à la main** dans `src/tokens.js` et `src/tokens.css` — ce sont eux que les apps lisent.
4. `npm run check:parity` : échoue si une couleur existe d'un côté et pas de l'autre.
5. Commit + bump de version.

Voir `CHANGELOG.md` pour l'historique.
