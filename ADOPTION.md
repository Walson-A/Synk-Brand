# Adoption de `@synk/brand` — guide pour agent de code

Ce fichier contient les instructions pour faire consommer ce package par `Synk-App`
(Expo/RN) et `Synk-Website` (Next.js). À donner à Claude Code / Cursor dans le repo cible.

## Installation
Repo **public** → install depuis GitHub, version épinglée (jamais `main`) :
```bash
npm install github:Walson-A/Synk-Brand#v0.5.0
```
Imports : `@synk/brand/tokens` (JS, typé) · `@synk/brand/tokens.css` · `@synk/brand` (composant web)
· **`@synk/brand/animation/native`** (RN : `SynkLogoAnim` + `SynkSplash`, typés) · `@synk/brand/logo/*`.

> État : `Synk-App` consomme les tokens (`constants/Colors.ts`) **et** le splash animé
> (`SynkLogoAnim.native` rendu dans `app/_layout.tsx`). Reste, plus tard, la migration du site.

---

## Prompt — Agent Synk-App (Expo / React Native)
```text
CONTEXTE : repo Synk-App (Expo/RN/TS). Le package @synk/brand est la source unique de
marque. Objectif : intégrer le splash animé + finir de retirer les valeurs de marque en
dur, SANS changer le rendu.

0. npm install github:Walson-A/Synk-Brand#v0.5.0. expo install react-native-svg
   react-native-reanimated expo-linear-gradient @expo-google-fonts/inter.
1. POLICE : charger Inter 900 + 700 dans le useFonts de app/_layout.tsx
   (Inter_900Black, Inter_700Bold) — sinon le wordmark du splash tombe sur la police système.
2. SPLASH : injecter <SynkLogoAnim glow={false}/> (from '@synk/brand/animation/native')
   DANS l'overlay existant AnimatedSplashOverlay — qui a déjà <PremiumBackground/> + le fade
   piloté par auth/profil. NE PAS utiliser <SynkSplash> du package (il re-ferait le fond).
   glow={false} car PremiumBackground fournit déjà le halo. Caler l'image du splash natif
   (app.config.js splash.image) sur src/logo/splash/splash-mark.png (frame finale = transition
   sans flash), splash.backgroundColor = "#0a0a0a". Tester en BUILD RELEASE (pas Expo Go).
3. (optionnel) Remplacer les logos locaux par @synk/brand/logo/*. Ne PAS remplacer en masse
   les couleurs en dur restantes : ce sont souvent des ajustements de contraste volontaires.
LIVRABLE : PR sur branche chore/adopt-synk-brand-splash. Ne pas pousser sur main directement.
```

## Prompt — Agent Synk-Website (Next.js)
```text
CONTEXTE : repo Synk-Website (Next.js/TS). @synk/brand = source unique de marque.
Refacto iso-rendu. Respecter la distinction marketing (DA premium) vs admin (dense).

0. npm install github:Walson-A/Synk-Brand#v0.5.0 ; next.config.js : transpilePackages:
   ['@synk/brand'] ; importer @synk/brand/tokens.css une fois dans app/layout.tsx.
1. AUDIT (rapport d'abord) : src/app/globals.css (@theme), hex de marque en dur dans
   src/components/ui/ et pages, logos locaux (favicon, OG, PWA), chargement Inter. Comparer aux
   variables de @synk/brand/tokens.css. Séparer MARKETING vs ADMIN (l'admin garde sa densité en
   overrides locaux au-dessus du socle partagé — ne PAS l'aligner de force ; juste faire pointer
   accent/logo/police sur le package).
2. REFACTOR incrémental : globals.css @theme → variables du package ; logos →
   @synk/brand/logo (synk-mark.svg recolorable, app-icons) ; remplacer toute intro/loader logo
   maison par <SynkLogoAnim/> ('use client').
3. Garde-fous : interdire nouveaux hex de marque ; doc README.
LIVRABLE : PR sur branche chore/adopt-synk-brand + tableau + écarts (marketing/admin séparés).
Ne pas pousser sur main.
```

---

# COLAB — prompts de démarrage C8 / C9 / C10

La direction artistique COLAB est **figée** (chantier C11, 2026-07-26). Les trois chantiers front
n'ont **aucune décision visuelle à prendre** : ils consomment le package.

**Deux documents font foi**, à lire avant d'écrire une ligne :
[`design/colab/palette.md`](design/colab/palette.md) (la couleur) et
[`design/colab/direction.md`](design/colab/direction.md) (typo, densité, formes, icônes, élévation,
états d'interaction, sémantique, logo). Ils expliquent aussi **pourquoi** — utile quand une
contrainte réelle obligera à s'en écarter.

> ⚠️ **Prérequis owner** : pousser la branche `feat/colab-design-system` et taguer **`v0.6.0`**.
> Tant que ce n'est pas fait, épingler un SHA de la branche plutôt que `main`.

### Les règles communes aux trois

```text
1. AUCUNE valeur de marque en dur. Jamais un hex, une taille de police, un rayon.
   Web : var(--colab-*)   ·   JS/RN : theme(scheme).xxx depuis @synk/brand/colab/tokens.
   Si un token manque, on l'AJOUTE à tokens/colab.json dans Synk-Brand — on ne le
   contourne pas localement. C'est la règle qui fait tenir les 4 surfaces ensemble.

2. Mode clair par défaut, sombre via [data-colab-theme="dark"] sur un ancêtre.
   Le CSS n'écoute PAS prefers-color-scheme : c'est l'app qui décide. Elle peut lire
   la préférence système et poser l'attribut, mais ce n'est pas imposé.

3. Les deux modes sont de première classe. Rien ne se valide dans un seul mode.

4. Police IBM Plex Sans, self-hostée — JAMAIS de CDN Google.
   Le woff2 variable (100-900) est dans Synk-Brand : design/colab/fonts/IBMPlexSans.woff2.
   RN : @expo-google-fonts/ibm-plex-sans.

5. Icônes Tabler, épaisseur var(--colab-border-icon-stroke) = 1.75.
   Web : @tabler/icons (ou les SVG de design/colab/icons/tabler/). RN : @tabler/icons-react-native.
   Ne pas mélanger avec un autre jeu. Une icône ne porte jamais l'information seule :
   toujours un libellé ou un aria-label.

6. Logo : @synk/brand/logo/colab/colab-mark-white.png posé sur .colab-tile.
   ⚠️ NE JAMAIS utiliser colab-icon-source.png en interface : son fond est #303A62
   alors que la couleur de marque est #1B395A — ça mettrait deux bleus dans l'écran.

7. i18n FR + EN dès la première ligne (D25), zéro chaîne en dur. Ton FR : tutoiement,
   jargon studio assumé (drop, stems, bounce, mix). Les messages système du fil sont
   rendus côté client depuis leur type + metadata — jamais stockés traduits.

8. La couleur sémantique n'habille QUE l'icône d'un état réel (échec d'envoi, quota
   projet dépassé, fichier > 2 GiB, envoi confirmé). Jamais un fond, jamais du texte,
   jamais pour catégoriser.
```

### Sur la disposition

Le langage visuel est figé, **pas l'agencement** : c'est votre travail, avec le contexte que vous
aurez sur les vraies données et le routage. Deux repères issus du launch-plan, pas des maquettes :
le web est **desktop-first** façon Notion (rail des projets / fil / colonne contextuelle, tokens
`--colab-size-rail` et `--colab-size-aside` fournis), et l'inbox studio suit **D26** — non-lus en
tête, puis actions rapides, puis sessions à venir et fichiers récents.

Un point resté ouvert et assumé : la densité « confortable » montre moins de projets à hauteur
égale. Pour l'inbox studio (des dizaines de résas, outil quotidien), prévoir une **variante de
ligne compacte** — une densité de liste, pas un second thème. À trancher avec l'owner sur écran.

## Prompt — Agent C9 (Colab-Platform / apps/web)

```text
CONTEXTE : monorepo Colab-Platform, apps/web (SPA Vite + React + TS). Chantier C9 du
launch-plan COLAB (Colab-API/docs/launch-plan.md §10). La DA est FIGÉE — tu ne prends
aucune décision visuelle, tu consommes @synk/brand/colab.

0. Lire Synk-Brand/design/colab/palette.md et direction.md. Puis :
   npm i github:Walson-A/Synk-Brand#v0.6.0
   import '@synk/brand/colab/tokens.css'; import '@synk/brand/colab/components.css';
   Self-hoster IBMPlexSans.woff2 (variable, font-weight: 100 900). Pas de CDN.
1. Poser .colab-root en racine + la bascule de thème (data-colab-theme), clair par défaut,
   choix persisté. Les deux modes se valident ensemble.
2. Construire les écrans avec les classes existantes (colab-btn, colab-row, colab-file,
   colab-bubble, colab-wave, colab-notice, colab-empty, colab-drop…). Voir la liste
   complète dans le README de Synk-Brand. Un composant manquant s'ajoute en local ;
   un TOKEN manquant s'ajoute dans Synk-Brand et se release.
3. i18n fr + en dès le départ, règle lint anti-chaînes en dur.
4. Le "mode plugin" (C10) réutilise ces composants dans une fenêtre ~420px : ne pas
   coder de largeur en dur, prévoir la compression du rail dès maintenant.
GARDE-FOU : aucun hex de marque dans apps/web. Ajouter un lint qui le refuse.
LIVRABLE : PR sur une branche dédiée. Ne pas pousser sur main.
```

## Prompt — Agent C8 (Synk-App / section COLAB)

```text
CONTEXTE : repo Synk-App (Expo/RN/TS). Chantier C8. Les écrans COLAB portent l'identité
COLAB (D15) : on doit comprendre qu'on utilise COLAB, pas SYNK. La DA est FIGÉE.

0. Lire Synk-Brand/design/colab/palette.md et direction.md.
   npm i github:Walson-A/Synk-Brand#v0.6.0
   expo install @expo-google-fonts/ibm-plex-sans @tabler/icons-react-native
   import { theme, radius, font } from '@synk/brand/colab/tokens';
1. ⚠️ NE PAS réutiliser les tokens SYNK dans la section COLAB, et surtout pas le violet
   #6C63FF. COLAB a sa palette, sa police et ses rayons — c'est volontaire.
2. Synk-App est sombre : utiliser le thème COLAB SOMBRE (theme('dark')). C'est le MÊME
   thème que le mode sombre du web, pas une variante — il n'y a rien à réinventer.
   Soigner la transition visuelle à l'entrée dans la section (canvas COLAB #090d10 vs
   canvas SYNK #0a0a0a : très proche, la bascule doit être douce).
3. Charger IBM Plex Sans dans le useFonts de app/_layout.tsx, sinon les écrans COLAB
   tombent sur la police système sans prévenir.
4. Surfaces (D16) : côté CLIENT la section COLAB vit dans le détail de résa + une zone
   d'activité dans l'onglet Réservations. Côté STUDIO, un 5e onglet "Projets" (D26 :
   non-lus en tête + actions rapides). Écrans à déclarer dans les stacks CLIENT **et**
   STUDIO de app/_layout.tsx (4 stacks exclusifs).
5. Push deep-link /colab/project/[id] : ⚠️ ne pas mettre data.studioId dans les push
   destinées au mode artiste (auto-switch studio au tap — voir NotificationContext.tsx).
6. ⚠️ Rebuild store requis (expo-document-picker + module audio) : caler sur le workflow
   de release owner, jamais pendant une review Apple.
LIVRABLE : PR sur une branche dédiée. Ne pas pousser sur dev/main directement.
```

## Prompt — Agent C10 (Colab-Platform / apps/plugin)

```text
CONTEXTE : monorepo Colab-Platform, apps/plugin — coque VST (Cargo + webview). Chantier
C10, dépend de C9. La webview affiche essentiellement la même chose que le web, à des
détails près : même DA, mêmes composants, contrainte de place très différente.

0. Lire Synk-Brand/design/colab/palette.md et direction.md. Réutiliser les composants
   de apps/web plutôt que d'en réécrire : c'est le même design system, embarqué.
1. Fenêtre étroite (~420px) : rail compressé ou masqué, fil en pleine largeur, carte de
   fichier compacte. Aucune largeur en dur — s'appuyer sur les tokens.
2. La bascule clair/sombre existe AUSSI ici : un ingé son travaille souvent dans le noir,
   le mode sombre n'est pas optionnel. Clair reste le défaut.
3. Le geste central (D11) : "versionner mon .flp en 1 bouton" + drag & drop du bounce
   vers le projet. Utiliser .colab-drop (état data-over) et .colab-progress.
4. Embarquer IBMPlexSans.woff2 et les SVG Tabler dans le bundle : la webview n'a pas
   toujours de réseau, et un CDN est de toute façon exclu.
LIVRABLE : PR sur une branche dédiée.
```

---

## Bonnes pratiques (éviter la dette)
- **Semver + épinglage** : les consommateurs pointent une version (`#v0.5.0`), jamais `main`.
- **API publique = `src/index.js`** + les sous-chemins `exports` → refacto interne libre.
- **Tokens = source unique** (`tokens/tokens.json` → `npm run build:tokens`).
- **Web vs RN séparés** : tokens/logos cross-plateforme ; animation web (`SynkLogoAnim.jsx`)
  vs RN (`SynkLogoAnim.native.jsx`, résolu via la condition `react-native` de `./animation`,
  ou le sous-chemin explicite `./animation/native`).
- **Install GitHub direct** (repo public, pas de registre) → aucun token requis en CI/EAS.
