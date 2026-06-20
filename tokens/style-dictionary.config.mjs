// Style Dictionary v4 config — regenerates token outputs from tokens.json.
// Run: npm run build:tokens  → writes build/ (CSS, SCSS, JS).
// tokens.json is the source of truth; commit it, regenerate the rest.
export default {
  source: ['tokens/tokens.json'],
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: 'build/',
      files: [{ destination: 'tokens.css', format: 'css/variables' }],
    },
    scss: {
      transformGroup: 'scss',
      buildPath: 'build/',
      files: [{ destination: 'tokens.scss', format: 'scss/variables' }],
    },
    js: {
      transformGroup: 'js',
      buildPath: 'build/',
      files: [{ destination: 'tokens.js', format: 'javascript/es6' }],
    },
  },
};
