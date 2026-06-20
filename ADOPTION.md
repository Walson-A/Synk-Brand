# Adoption de `@synk/brand` — guide pour agent de code

Ce fichier contient les instructions pour faire consommer ce package par `Synk-App`
(Expo/RN) et `Synk-Website` (Next.js). À donner à Claude Code / Cursor dans le repo cible.

## Installation
Repo **public** → install depuis GitHub, version épinglée (jamais `main`) :
```bash
npm install github:Walson-A/Synk-Brand#v0.4.0
```
Imports : `@synk/brand/tokens` (JS, typé) · `@synk/brand/tokens.css` · `@synk/brand` (composant web)
· **`@synk/brand/animation/native`** (RN : `SynkLogoAnim` + `SynkSplash`, typés) · `@synk/brand/logo/*`.

> État : `Synk-App` consomme déjà les tokens (`constants/Colors.ts` re-pointé). Reste l'intégration
> du splash animé (ci-dessous) et, plus tard, la migration du site.

---

## Prompt — Agent Synk-App (Expo / React Native)
```text
CONTEXTE : repo Synk-App (Expo/RN/TS). Le package @synk/brand est la source unique de
marque. Objectif : intégrer le splash animé + finir de retirer les valeurs de marque en
dur, SANS changer le rendu.

0. npm install github:Walson-A/Synk-Brand#v0.4.0. expo install react-native-svg
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

0. npm install github:Walson-A/Synk-Brand#v0.4.0 ; next.config.js : transpilePackages:
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

## Bonnes pratiques (éviter la dette)
- **Semver + épinglage** : les consommateurs pointent une version (`#v0.4.0`), jamais `main`.
- **API publique = `src/index.js`** + les sous-chemins `exports` → refacto interne libre.
- **Tokens = source unique** (`tokens/tokens.json` → `npm run build:tokens`).
- **Web vs RN séparés** : tokens/logos cross-plateforme ; animation web (`SynkLogoAnim.jsx`)
  vs RN (`SynkLogoAnim.native.jsx`, résolu via la condition `react-native` de `./animation`,
  ou le sous-chemin explicite `./animation/native`).
- **Install GitHub direct** (repo public, pas de registre) → aucun token requis en CI/EAS.
