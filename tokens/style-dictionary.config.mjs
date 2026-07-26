// Style Dictionary v4 — deux marques indépendantes dans une seule config.
//
//   tokens/tokens.json  → SYNK   → build/            (inchangé ; src/tokens.* reste écrit à la main)
//   tokens/colab.json   → COLAB  → src/colab/        (GÉNÉRÉ — ne jamais éditer à la main)
//
// Pourquoi deux jeux séparés plutôt qu'une base commune : les deux marques n'ont
// ni la même échelle typographique ni les mêmes rayons. Les forcer dans une base
// partagée créerait un couplage faux — toucher un token COLAB deviendrait risqué
// pour SYNK. Elles partagent une entreprise, pas une échelle.
//
// Run: npm run build:tokens

const isColab = (t) => t.path[0] === 'colab';
const isSynk = (t) => t.path[0] !== 'colab';

/** ['colab','light','canvas'] → 'canvas' · ['colab','ramp','navy','800'] → 'navy-800' */
const cssName = (path) =>
  path
    .slice(1)
    .filter((p) => p !== 'ramp' && p !== 'light' && p !== 'dark')
    .join('-')
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase();

/** ['colab','font','size','body'] → 'fontSizeBody' (pour la sortie JS) */
const jsKey = (parts) =>
  parts
    .map((p, i) => (i === 0 ? p : p.charAt(0).toUpperCase() + p.slice(1)))
    .join('');

// La source est en DTCG : Style Dictionary expose la valeur résolue sur `$value`.
// `value` reste renseigné dans les modes non-DTCG — on accepte les deux.
const val = (t) => {
  const v = t.$value ?? t.value;
  if (v === undefined) throw new Error(`token sans valeur : ${t.path.join('.')}`);
  return typeof v === 'object' ? JSON.stringify(v) : v;
};

const group = (tokens, head) => tokens.filter((t) => t.path[1] === head);
const notMode = (t) => !['light', 'dark', 'ramp'].includes(t.path[1]);

export default {
  source: ['tokens/tokens.json', 'tokens/colab.json'],

  hooks: {
    formats: {
      /* ---------- COLAB : variables CSS ---------- */
      'colab/css': ({ dictionary }) => {
        const all = dictionary.allTokens.filter(isColab);
        const line = (t, name) => `  --colab-${name ?? cssName(t.path)}: ${val(t)};`;

        const statics = all.filter(notMode).map((t) => line(t));
        const ramp = group(all, 'ramp').map((t) => line(t));
        const modeVars = (mode) => group(all, mode).map((t) => line(t)).join('\n');

        return `/**
 * COLAB — variables CSS. GÉNÉRÉ depuis tokens/colab.json, ne pas éditer.
 *   npm run build:tokens
 *
 * Le mode CLAIR est le défaut (D23 : light-mode-first). Le mode sombre s'active
 * explicitement via [data-colab-theme="dark"] — volontairement PAS via
 * prefers-color-scheme : c'est l'application qui décide, pas l'OS. Elle peut lire
 * la préférence système en JS et poser l'attribut si elle le souhaite.
 *
 * Tout est surchargeable à l'exécution : une seule custom property redéfinie
 * suffit à re-teinter tous les composants, sans rebuild.
 */

:root {
${ramp.join('\n')}

${statics.join('\n')}

${modeVars('light')}
}

[data-colab-theme='light'] {
${modeVars('light')}
}

[data-colab-theme='dark'] {
${modeVars('dark')}
}
`;
      },

      /* ---------- COLAB : objets JS (web + React Native) ---------- */
      'colab/js': ({ dictionary }) => {
        const all = dictionary.allTokens.filter(isColab);

        const modeObj = (mode) =>
          group(all, mode)
            .map((t) => `  ${t.path[2]}: ${JSON.stringify(val(t))},`)
            .join('\n');

        const rampObj = ['navy', 'slate']
          .map((fam) => {
            const rows = all
              .filter((t) => t.path[1] === 'ramp' && t.path[2] === fam)
              .map((t) => `    '${t.path[3]}': ${JSON.stringify(val(t))},`)
              .join('\n');
            return `  ${fam}: {\n${rows}\n  },`;
          })
          .join('\n');

        const white = all.find((t) => t.path.join('.') === 'colab.ramp.white');

        const flatGroup = (head) => {
          const rows = all
            .filter((t) => t.path[1] === head)
            .map((t) => {
              const key = jsKey(t.path.slice(2));
              const v = val(t);
              const num = typeof v === 'number';
              return `  ${/^[A-Za-z_$][\w$]*$/.test(key) ? key : `'${key}'`}: ${num ? v : JSON.stringify(v)},`;
            })
            .join('\n');
          return `export const ${head} = {\n${rows}\n};`;
        };

        const heads = [...new Set(all.filter(notMode).map((t) => t.path[1]))];

        return `// COLAB design tokens — GÉNÉRÉ depuis tokens/colab.json, ne pas éditer.
//   npm run build:tokens
//
// Forme { light, dark } volontairement identique à celle de Colors[scheme] déjà
// utilisée par Synk-App : rien de nouveau à apprendre pour l'agent C8.

export const light = {
${modeObj('light')}
};

export const dark = {
${modeObj('dark')}
};

/** Les primitives. Utiliser les rôles (light/dark) dans les composants ; la rampe
 *  ne sert qu'à définir de nouveaux rôles. */
export const ramp = {
${rampObj}
  white: ${JSON.stringify(val(white))},
};

${heads.map(flatGroup).join('\n\n')}

export const theme = (scheme) => (scheme === 'dark' ? dark : light);

export default { light, dark, ramp, theme, ${heads.join(', ')} };
`;
      },

      /* ---------- COLAB : types ---------- */
      'colab/dts': ({ dictionary }) => {
        const all = dictionary.allTokens.filter(isColab);
        const roles = group(all, 'light').map((t) => `  ${t.path[2]}: string;`).join('\n');
        const heads = [...new Set(all.filter(notMode).map((t) => t.path[1]))];

        const decl = (head) => {
          const rows = all
            .filter((t) => t.path[1] === head)
            .map((t) => {
              const key = jsKey(t.path.slice(2));
              const v = val(t);
              return `  ${/^[A-Za-z_$][\w$]*$/.test(key) ? key : `'${key}'`}: ${typeof v === 'number' ? 'number' : 'string'};`;
            })
            .join('\n');
          return `export declare const ${head}: {\n${rows}\n};`;
        };

        return `// GÉNÉRÉ depuis tokens/colab.json, ne pas éditer.

export interface ColabTheme {
${roles}
}

export declare const light: ColabTheme;
export declare const dark: ColabTheme;

export declare const ramp: {
  navy: Record<string, string>;
  slate: Record<string, string>;
  white: string;
};

${heads.map(decl).join('\n\n')}

export declare function theme(scheme: 'light' | 'dark'): ColabTheme;
`;
      },
    },
  },

  platforms: {
    /* ---------- SYNK : sortie historique, inchangée ---------- */
    css: {
      transformGroup: 'css',
      buildPath: 'build/',
      files: [{ destination: 'tokens.css', format: 'css/variables', filter: isSynk }],
    },
    scss: {
      transformGroup: 'scss',
      buildPath: 'build/',
      files: [{ destination: 'tokens.scss', format: 'scss/variables', filter: isSynk }],
    },
    js: {
      transformGroup: 'js',
      buildPath: 'build/',
      files: [{ destination: 'tokens.js', format: 'javascript/es6', filter: isSynk }],
    },

    /* ---------- COLAB : généré directement dans src/, c'est ce que consomment les apps ---------- */
    colab: {
      transforms: ['name/kebab'],
      buildPath: 'src/colab/',
      files: [
        { destination: 'tokens.css', format: 'colab/css', filter: isColab },
        { destination: 'tokens.js', format: 'colab/js', filter: isColab },
        { destination: 'tokens.d.ts', format: 'colab/dts', filter: isColab },
      ],
    },
  },

  log: { verbosity: 'default' },
};
