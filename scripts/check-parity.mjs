/**
 * Garde-fou de parité des tokens.
 *
 * Deux marques, deux risques différents :
 *
 *  SYNK  — src/tokens.js et src/tokens.css sont écrits À LA MAIN dans une forme
 *          plate (`color.surfaceCard`) que Style Dictionary ne produit pas. On ne
 *          les régénère donc pas : les régénérer changerait la forme consommée par
 *          une app en production pour zéro gain. Le risque est la DÉRIVE — le
 *          README dit déjà « must stay in parity », reporté à la main. Ce script
 *          la détecte.
 *
 *  COLAB — src/colab/* est GÉNÉRÉ. Le risque est l'inverse : quelqu'un édite le
 *          fichier généré, ou oublie `npm run build:tokens` après avoir touché la
 *          source. Ce script le détecte aussi.
 *
 * Run: npm run check:parity
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(join(root, p), 'utf8');

/** Toutes les couleurs littérales d'un texte, normalisées. */
const colorsIn = (text) => {
  const out = new Set();
  for (const m of text.matchAll(/#[0-9a-fA-F]{6}\b/g)) out.add(m[0].toLowerCase());
  for (const m of text.matchAll(/rgba?\(\s*[\d.]+\s*,\s*[\d.]+\s*,\s*[\d.]+\s*(?:,\s*[\d.]+\s*)?\)/g)) {
    out.add(m[0].replace(/\s+/g, '').toLowerCase());
  }
  return out;
};

/** Les $value d'un arbre DTCG, sous un chemin racine donné. */
const valuesOf = (node, keep) => {
  const out = [];
  const walk = (n, path) => {
    if (n === null || typeof n !== 'object') return;
    if ('$value' in n) {
      if (keep(path)) out.push({ path: path.join('.'), value: n.$value });
      return;
    }
    for (const [k, v] of Object.entries(n)) {
      if (k.startsWith('$')) continue;
      walk(v, [...path, k]);
    }
  };
  walk(node, []);
  return out;
};

const problems = [];
const note = (msg) => problems.push(msg);

/* ------------------------------------------------------------------ SYNK */
{
  const src = JSON.parse(read('tokens/tokens.json'));
  const declared = new Set();
  for (const { value } of valuesOf(src, () => true)) {
    if (typeof value !== 'string') continue;
    for (const c of colorsIn(value)) declared.add(c);
  }

  const consumed = new Set([
    ...colorsIn(read('src/tokens.js')),
    ...colorsIn(read('src/tokens.css')),
  ]);

  for (const c of declared) {
    if (!consumed.has(c)) note(`SYNK · ${c} est dans tokens/tokens.json mais absent de src/tokens.{js,css}`);
  }
  for (const c of consumed) {
    if (!declared.has(c)) note(`SYNK · ${c} est dans src/tokens.{js,css} mais absent de tokens/tokens.json`);
  }
}

/* ----------------------------------------------------------------- COLAB */
{
  const src = JSON.parse(read('tokens/colab.json'));
  const tokens = valuesOf(src, () => true);

  // On ignore les alias {…} : ils pointent sur une primitive déjà vérifiée.
  const declared = new Set();
  for (const { value } of tokens) {
    if (typeof value !== 'string' || value.startsWith('{')) continue;
    for (const c of colorsIn(value)) declared.add(c);
  }

  const css = read('src/colab/tokens.css');
  const js = read('src/colab/tokens.js');
  const generated = colorsIn(css);

  for (const c of declared) {
    if (!generated.has(c)) {
      note(`COLAB · ${c} est dans tokens/colab.json mais absent de src/colab/tokens.css — lance "npm run build:tokens"`);
    }
  }
  for (const c of generated) {
    if (!declared.has(c)) {
      note(`COLAB · ${c} est dans src/colab/tokens.css sans exister dans la source — le fichier généré a été édité à la main`);
    }
  }

  // Les rôles doivent exister dans les deux modes : un rôle manquant d'un côté
  // fait tomber un composant sur la valeur de l'autre mode, silencieusement.
  // Les chemins sont préfixés par la racine du fichier : `colab.light.canvas`.
  const roles = (mode) =>
    new Set(
      tokens
        .filter((t) => t.path.startsWith(`colab.${mode}.`))
        .map((t) => t.path.split('.')[2])
    );
  const [L, D] = [roles('light'), roles('dark')];
  for (const r of L) if (!D.has(r)) note(`COLAB · le rôle "${r}" existe en light mais pas en dark`);
  for (const r of D) if (!L.has(r)) note(`COLAB · le rôle "${r}" existe en dark mais pas en light`);

  for (const mode of ['light', 'dark']) {
    if (!js.includes(`export const ${mode} = {`)) note(`COLAB · src/colab/tokens.js n'exporte pas "${mode}"`);
  }

  /* components.css est écrit à la main : une var(--colab-…) inexistante ne
     produit AUCUNE erreur au navigateur, juste un style silencieusement absent.
     C'est le défaut le plus coûteux à trouver à l'œil — donc on l'automatise. */
  const components = read('src/colab/components.css');
  const defined = new Set([...css.matchAll(/^\s*(--colab-[a-z0-9-]+)\s*:/gm)].map((m) => m[1]));
  const used = new Set([...components.matchAll(/var\(\s*(--colab-[a-z0-9-]+)/g)].map((m) => m[1]));

  for (const v of used) {
    if (!defined.has(v)) note(`COLAB · components.css utilise ${v}, qui n'est défini nulle part dans tokens.css`);
  }

  // Aucune couleur littérale ne doit traîner dans les composants : ce serait une
  // valeur que changer un token ne toucherait pas.
  for (const c of colorsIn(components)) {
    note(`COLAB · components.css contient la couleur littérale ${c} — elle doit passer par un token`);
  }
}

/* ---------------------------------------------------------------- verdict */
if (problems.length) {
  console.error(`\n✗ parité des tokens : ${problems.length} problème(s)\n`);
  for (const p of problems) console.error(`  · ${p}`);
  console.error('');
  process.exit(1);
}
console.log('✓ parité des tokens : SYNK et COLAB sont cohérents');
