# COLAB — direction figée : typographie, densité, formes

> Validée avec Walson le 2026-07-26 (chantier C11, porte 2).
> Couleurs : voir [`palette.md`](palette.md). Ce document couvre tout le reste.
> **Ne pas modifier sans repasser par une validation owner.**

## Les cinq décisions

| Axe | Décision |
|---|---|
| **Police** | **IBM Plex Sans** — humaniste d'ingénierie, signature identifiable, registre technique assumé |
| **Mode par défaut** | **Clair** (le sombre est de première classe, pas un repli — voir `palette.md`) |
| **Densité** | **Confortable** |
| **Rayons** | **Doux** — 8 / 11 / 14 px |
| **Étiquettes** | **Capitales espacées** — `.13em`, graisse 700 |

Le pari : le sérieux vient de la **police** et des **capitales espacées**, la respiration vient des
**rayons doux** et de la densité confortable. C'est ce qui évite les deux écueils — ni SaaS anonyme,
ni console austère.

## La police

**IBM Plex Sans**, licence **OFL** (libre, usage commercial inclus).

| Surface | Comment on la charge |
|---|---|
| Web (`apps/web`) | woff2 variable self-hostée, `font-weight: 100 900` — **jamais** de CDN Google |
| Plugin VST (webview) | même woff2, embarquée dans le bundle |
| App SYNK (Expo/RN) | `@expo-google-fonts/ibm-plex-sans` — **vérifié présent au registre npm** (v0.4.1) |

⚠️ Elle **ne remplace pas Inter côté SYNK**. Inter reste la police de l'app et du site SYNK ; IBM Plex
Sans est la police de COLAB. Les deux cohabitent — c'est voulu, c'est ce qui fait que « on comprend
que c'est COLAB que tu utilises » (D15).

Le fichier variable est déjà dans le repo : `design/colab/fonts/IBMPlexSans.woff2` (44,6 Ko).

## Les tokens de densité (« confortable »)

```
--fs-big     17px      titre de projet
--fs-title   15px      sous-titres, wordmark
--fs-body    14.5px    texte courant, messages
--fs-sm      12.5px    méta, libellés de bouton, noms de fichier
--fs-lab     11px      étiquettes, horodatages, sous-lignes

--pad-pane   18px 20px   padding d'un panneau
--pad-row    9px 10px    ligne de liste, champ de recherche
--pad-bub    10px 14px   bulle de message, carte
--pad-ctl    9px 15px    bouton, champ de saisie

--gap-thread 12px      entre messages
--gap-row    3px       entre lignes de liste
--w-rail     246px     rail des projets
--w-aside    262px     colonne de droite
--av         27px      avatar / vignette
```

## Les formes

```
--r-sm   8px    puces, avatars, boutons, champs, lignes de liste
--r-md   11px   bulles, cartes de fichier
--r-lg   14px   conteneurs, modales
```

## Les étiquettes

```css
.lab { text-transform: uppercase; letter-spacing: .13em; font-weight: 700; font-size: 11px; }
```
Concerne : « PROJETS », « AUJOURD'HUI », « PROCHAINE SESSION », « FICHIERS RÉCENTS », « MEMBRES ».
Les **boutons** suivent la même logique : capitales, `letter-spacing: .1em`, graisse 700, 12px.

Les **chiffres** portent `font-variant-numeric: tabular-nums` partout où ils s'alignent ou changent
en direct : compteurs de non-lus, tailles de fichier, horodatages, durées.

## Un point resté ouvert

**La densité de l'inbox studio.** « Confortable » affiche moins de projets à hauteur égale. Pour le
web et le plugin, aucun problème — il y a de la place. Mais l'onglet « Projets » du studio (D26) est
un outil quotidien pour quelqu'un qui a des dizaines de résas, et c'est justement la vue que le
launch-plan veut « travaillée à fond ».

Parti pris proposé, à valider en porte 4 : **on garde un seul système confortable**, et la liste de
l'inbox reçoit une **variante de ligne compacte** (`--pad-row: 6px 8px`, `--av: 22px`) — une variante
de densité de liste, pas un second thème. À trancher sur la maquette de l'app studio.

---

# Fondations des composants

> Validées avec Walson le 2026-07-26 (chantier C11, porte 3).

## Icônes

**Tabler Icons**, licence MIT. Repli documenté : **Lucide** — l'écart est mince et les deux tiennent
la contrainte React Native. Ne pas mélanger les deux jeux.

```
épaisseur de trait   1.75
tailles              14px  dans un bouton à libellé
                     16px  bouton-icône
                     18px  inline (message sémantique, méta)
                     21px  rail, navigation
```

| Surface | Paquet |
|---|---|
| Web, plugin | SVG de `design/colab/icons/tabler/` (ou `@tabler/icons` en dépendance) |
| App SYNK (Expo/RN) | `@tabler/icons-react-native` — **vérifié au registre npm** (v3.45.0) |

Les icônes héritent de `currentColor`. Elles ne portent **jamais** d'information seules : toujours
accompagnées d'un libellé ou d'un `aria-label`.

## Élévation

**Fond + filet de 1px. Aucune ombre.**

```css
.carte { background: var(--surf); border: 1px solid var(--bord); border-radius: var(--r-md); }
```

Raison : une ombre portée sur `#090d10` est invisible. Elle ne fonctionnerait donc qu'en mode clair,
et un procédé qui ne marche que dans un mode n'en est pas un. Le filet tient dans les deux et reste
cohérent avec le registre « outil de travail ».

Exception unique : les **surfaces flottantes** (menu, popover, modale) portent une ombre — parce
qu'elles doivent se détacher d'un contenu qui défile dessous, ce qu'un filet ne fait pas.

## États d'interaction

**Stratégie retenue : clarté + barre latérale.**

```
                     clair                sombre
repos                transparent          transparent
survol               #eef4fb              #141c25
sélectionné          #e3edf7              #293a4c   + barre 3px, --txt, hauteur 62 %
sélect. + survol     #d7e6f4              #32465a
focus clavier        outline 2px #1B395A, offset 2px    outline 2px #f5f7fa
désactivé            opacité 42 %, aucun événement pointeur
```

Pourquoi une barre et pas seulement la clarté — écarts de luminance **mesurés** :

| | clair | sombre |
|---|---|---|
| survol vs fond | 1,107 | 1,136 |
| sélection vs fond | 1,185 | 1,675 |
| sélection + survol vs sélection | **1,073** | 1,197 |

C'est le **mode clair** qui étouffe, contre l'intuition : sous du blanc pur il reste très peu de
place avant que les surfaces virent au gris. À 1,073, le survol d'une ligne déjà sélectionnée est
sous le seuil du perceptible. La barre apporte un signal de **forme**, monochrome, indépendant d'un
écart de luminance minuscule.

La **graisse** a été écartée pour une autre raison : elle entre en conflit avec le gras qui code
déjà les projets non lus.

## Couleurs sémantiques

**La couleur ne touche que l'icône.** Le texte reste monochrome, aucun bandeau, aucun fond teinté.

```
              clair      sombre
danger        #b42318    #ef8b84
succès        #067647    #47cd89
```

| | sur le fond | sur la carte |
|---|---|---|
| `#b42318` clair | 6,57:1 | 6,11:1 |
| `#067647` clair | 5,69:1 | 5,29:1 |
| `#ef8b84` sombre | 8,08:1 | 4,82:1 |
| `#47cd89` sombre | 9,62:1 | 5,74:1 |

⚠️ C'est **la carte qui contraint**, pas le fond — les messages d'erreur vivent sur `--surf`.
`#f97066` (la valeur usuelle) y tombe à 4,18:1 et a été écartée pour cette raison.

Réservé aux **états réels** : upload échoué, quota projet dépassé, fichier > 2 GiB, envoi confirmé.
Jamais en décoration, jamais pour catégoriser. L'information est toujours portée par le **mot** —
la couleur ne fait que l'accélérer, ce qui la rend sûre en vision des couleurs déficiente.

## Personnes, projets, fichiers

*(arbitrages pris sans validation owner — contestables à tout moment)*

**La forme encode le type**, ce qui évite d'avoir à le coder par la couleur :

- **Personne → cercle.** Photo `profiles.avatar_url` si disponible, sinon initiales sur `--chip`
  en `--mut`.
- **Projet → carré à `--r-sm` (8px).** Initiales dérivées du `displayName` calculé serveur (D27).
- **Pile de membres** : cercles superposés de −6px, anneau de 2px à la couleur du fond parent.

**Fichiers** :

- Le **type** est une pastille texte monochrome — `WAV` `ZIP` `FLP` `PDF` `IMG` — sur `--chip`.
  Pas de couleur par type : il y en a trop (D9 accepte tous les formats) et ça casserait le monochrome.
- La **version** est une pastille `V3` collée au nom. La chaîne complète s'ouvre depuis l'icône
  `git-branch` : `v3 (actuelle) → v2 → v1`, chacune avec son auteur et sa date.

**Waveform** (le moment « wow » de D10) :

```
barre        2px de large, gouttière 2px
hauteur      minimum 24 %, normalisée sur le pic du morceau
lu           --txt          non lu   --wave
```

Pas de dégradé, pas d'animation de pulsation : la tête de lecture est la frontière entre les deux
couleurs, rien d'autre.

## Logo

Deux fichiers dans `src/logo/colab/`, consommables via `@synk/brand/logo/colab/*` :

| Fichier | Usage |
|---|---|
| `colab-mark-white.png` | **Le fichier à utiliser.** Anneaux blancs, fond transparent, 500×500. Se pose sur une tuile `--colab-brand` (classe `.colab-tile`). |
| `colab-icon-source.png` | La référence owner, intacte. Ne pas l'utiliser en interface. |

⚠️ **Pourquoi le fichier source n'est pas utilisé directement.** Son fond est `#303A62`, alors que
la couleur de marque figée est `#1B395A`. Le poser tel quel mettrait **deux bleus différents** dans
l'interface. Le mark blanc a donc été extrait par inversion du compositing — `t = (pixel − fond) /
(blanc − fond)` par canal, ce qui préserve l'antialiasing des anneaux au lieu de le seuiller — et
c'est la tuile qui apporte la couleur, prise dans les tokens.

Vérifié : lisible jusqu'à 48 px ; à 24 px la forme tient mais l'entrelacement se perd.

**Reste à faire (owner)** : le master vectoriel, via claude.ai/design. Un SVG recolorable
remplacera le PNG sans rien changer d'autre — seul le fichier bouge, `.colab-tile` et les tokens
sont déjà en place. Manquent aussi les déclinaisons : favicon, app-icons, version pour fond clair.

## Reste à faire

- La densité de l'inbox studio (voir plus haut) — à trancher sur la maquette de l'app studio.

## Outillage

`_directions.src.html` est la source éditable ; `_directions.html` est **généré** par
[`build-type.ps1`](build-type.ps1), qui embarque les woff2 en data URI.

Raison : les artifacts claude.ai appliquent une CSP stricte qui bloque les hôtes externes **et** les
chemins de fichiers locaux. Une police référencée par URL y tombe silencieusement sur `system-ui` —
on jugerait une police qu'on ne voit pas. Toute maquette destinée à être publiée doit donc embarquer
ses polices.
