// @synk/brand — public API (single entry point).
// Keep this file as the ONLY public surface: refactor internals freely as long
// as these named exports stay stable. Breaking a name = a major version bump.

// Design tokens (colors, type, spacing, radii, shadows, motion) — cross-platform.
export * from './tokens.js';

// Shared logo image data (white-on-transparent, base64 PNG).
export { default as SYNK_LOGO } from './animation/logo-data.js';

// Animated logo component (web / React-DOM). For React Native, see README.
export { SynkLogoAnim } from './animation/SynkLogoAnim.jsx';
