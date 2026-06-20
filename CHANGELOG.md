# Changelog

Toutes les modifications notables de `@synk/brand`. Format basé sur
[Keep a Changelog](https://keepachangelog.com/) · versionnage [SemVer](https://semver.org/lang/fr/).

## [0.1.0] — 2026-06-19
### Ajouté
- Composant `SynkLogoAnim` : animation d'entrée du logo (le « S » se tisse depuis
  le centre, snap « clic », puis wordmark + tagline). 7 palettes, formats et
  réglages (`palette`, `background`, `showWordmark`, `showTagline`, `loop`, `markSize`).
- Design tokens SYNK en JS (`@synk/brand/tokens`) et CSS (`@synk/brand/tokens.css`) :
  couleurs, typographie, espacements, radii, ombres, motion.
- Source de vérité des tokens en DTCG (`tokens/tokens.json`) + config Style Dictionary.
- Logos : **master vectoriel** `synk-mark.svg` (monochrome, recolorable) + `synk-icon.svg` (tuile violette, dégradé diagonal fidèle à l'iOS), exports PNG renommés `synk-{mark|icon}-{contexte}`, et **pack d'icônes d'app** (`app-icons/` : iOS, Android maskable/foreground, PWA, favicons) généré depuis le master.
