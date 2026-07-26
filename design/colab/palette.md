# COLAB — palette figée

> Validée avec Walson le 2026-07-26 (chantier C11, porte 1).
> Source des maquettes et, plus tard, de `tokens/brands/colab.json`.
> **Ne pas modifier sans repasser par une validation owner.**

## Le principe

**Monochrome.** Une seule teinte — **211°** — plus du blanc. Aucune couleur d'accent.
La hiérarchie est portée par la clarté, la graisse et le blanc, jamais par une deuxième couleur.

**L'action primaire s'inverse** au lieu de prendre une couleur : navy plein + texte blanc en clair,
blanc plein + texte navy en sombre. Elle est ainsi la zone de contraste maximal de l'écran, donc la
plus visible, sans introduire une seule teinte supplémentaire.

**Chroma pleine en clair, ardoise en sombre.** Les deux modes n'utilisent pas la même saturation :
les couleurs très saturées vibrent et bavent sur fond sombre. Le mode sombre tourne donc à **55 % du
chroma** du mode clair. Ce n'est pas une incohérence — c'est la règle.

`#1B395A` reste la **couleur de marque** dans les deux modes (tuile du logo, marketing).

## Les deux rampes

Générées en `hsl(211, S × sat, L)` — `sat = 1` en clair, `sat = 0.55` en sombre.
Le `800` de la rampe pleine est **figé sur la valeur owner**, pas calculé.

| | 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950 | ink |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **navy** (clair) | `#f3f7fc` | `#e3edf7` | `#c6d8eb` | `#9db9d7` | `#6592c3` | `#3771ae` | `#1f5a98` | `#1c4878` | **`#1B395A`** | `#102338` | `#091420` | `#070d13` |
| **ardoise** (sombre) | `#f5f7fa` | `#e8edf3` | `#cfd8e3` | `#aabaca` | `#7a93ae` | `#527294` | `#3a5b7d` | `#314963` | `#293a4c` | `#19232f` | `#0e141b` | `#090d10` |

Lightness par étage : 97 · 93 · 85 · 73 · 58 · 45 · 36 · 29 · 23 · 14 · 8 · 5.
Saturation par étage : 60 · 55 · 48 · 42 · 44 · 52 · 66 · 62 · 54 · 56 · 55 · 48 (× `sat`).

## Les rôles

### Mode clair — par défaut

| Rôle | Valeur | Contraste |
|---|---|---|
| Fond | `#ffffff` | — |
| Surface (carte, champ) | `#f3f7fc` navy-50 | 1,08:1 |
| Survol, puce | `#e3edf7` navy-100 | — |
| Bordure | `#c6d8eb` navy-200 | 1,46:1 — visible |
| Texte courant | `#091420` navy-950 | **18,54:1** |
| Texte secondaire | `#527294` ardoise-500 | **5,01:1** |
| Action primaire | `#1B395A` | **11,80:1** |
| Libellé sur l'action | `#ffffff` | **11,80:1** |

Le `600` (`#1f5a98`) **ne sert à rien en clair** : il a été écarté avec la direction « action navy ».
Le texte secondaire emprunte volontairement à la rampe ardoise — moins chromatique, il ne se lit pas
comme un lien.

### Mode sombre

| Rôle | Valeur | Contraste sur le fond |
|---|---|---|
| Fond | `#090d10` ardoise-ink | — |
| Rail latéral | `#05080a` | — |
| Carte, surface | `#293a4c` ardoise-800 | 1,68:1 — se détache |
| Puce | `#304254` | — |
| Bordure | `#2f3d4c` | — |
| Texte courant | `#f5f7fa` ardoise-50 | **18,17:1** (10,85:1 sur carte) |
| Texte secondaire | `#aabaca` ardoise-300 | **9,83:1** (5,87:1 sur carte) |
| Action primaire | `#ffffff` | **19,50:1** |
| Libellé sur l'action | `#0e141b` ardoise-950 | **18,51:1** |

Repère : chez SYNK, carte/canvas vaut 1,10:1. COLAB est nettement plus étagé.

## Ce qui a été écarté, et pourquoi

- **Le navy en canvas** (`#1B395A` comme fond) : tout ce qu'on pose dessus doit monter en clair,
  l'écran pâlit et la carte flotte au lieu de se détacher.
- **Un accent bleu clair en sombre** (type `#65B1EC`) : rejeté par l'owner, et mesuré deux fois moins
  contrasté que le bouton blanc (5,82:1 contre 11,80:1).
- **L'ardoise appliquée aussi en clair** : elle ferait perdre `#1B395A` au profit de `#293a4c`.
- **Le `600` comme couleur interactive** : proposé, écarté — l'écran clair ne contient aucune valeur
  lumineuse, c'est le parti pris.

## Les seules couleurs hors rampe

Sémantiques, rares, et uniquement sur un **état réel** — jamais en décoration :
succès (upload terminé) et erreur (échec d'envoi, quota projet dépassé, fichier > 2 GiB).
Valeurs à définir au chantier des tokens, dérivées de la famille SYNK pour rester cohérentes.

## Reste ouvert

- Typographie, densité, rayons, style des boutons — **porte 2**, aucun de ces choix n'est arrêté.
- Le master du logo, à refaire proprement en fin de chantier (claude.ai/design, par l'owner).
  Référence actuelle : `Colab-Platform/colab.PNG`.
