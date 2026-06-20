// SYNK design tokens — JS/TS-friendly, cross-platform (web + React Native).
// Source of truth: tokens/tokens.json (Style Dictionary). When you edit the
// JSON, run `npm run build:tokens` to regenerate the CSS/SCSS outputs; keep this
// file in sync (or generate it via Style Dictionary's js export).

export const color = {
  // Brand
  violet: '#6C63FF',
  indigo: '#8B5CF6',
  eclipse: '#0a0a0a',
  // Surfaces (lighter = higher elevation)
  surfaceCanvas: '#0a0a0a',
  surfaceCard: '#171717',
  surfaceRaised: '#1f1f1f',
  surfaceOverlay: '#262626',
  surfaceInset: '#121212',
  // Borders (translucent white hairlines)
  borderSubtle: 'rgba(255,255,255,0.06)',
  borderDefault: 'rgba(255,255,255,0.10)',
  borderStrong: 'rgba(255,255,255,0.16)',
  // Text
  textHi: '#ededed',
  textMid: '#a3a3a3',
  textDim: 'rgba(255,255,255,0.40)',
  textOnAccent: '#ffffff',
  // Accent states
  accent: '#6C63FF',
  accentHover: '#7d75ff',
  accentPress: '#5b52e6',
  accentRing: 'rgba(108,99,255,0.45)',
  accentWash: 'rgba(108,99,255,0.10)',
  // Status
  success: '#10b981',
  warning: '#fbbf24',
  danger: '#ef4444',
  info: '#60a5fa',
};

export const gradient = {
  primary: 'linear-gradient(90deg, #6C63FF 0%, #8B5CF6 100%)',
  spotlight: 'linear-gradient(to bottom left, rgba(108,99,255,0.25), rgba(108,99,255,0.10), transparent)',
  fog: 'linear-gradient(to top, #0a0a0a 0%, rgba(10,10,10,0.5) 45%, transparent 100%)',
};

export const font = {
  sans: "'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
  weight: { regular: 400, medium: 500, semibold: 600, bold: 700, extrabold: 800, black: 900 },
  // px scale: 10 · 11 · 12 · 14 · 16 · 17 · 19 · 24 · 32 · 44
  size: { cap: 10, eyebrow: 11, xs: 12, sm: 14, base: 16, md: 17, lg: 19, xl: 24, '2xl': 32, display: 44 },
  leading: { tight: 1.1, snug: 1.25, normal: 1.5 },
  tracking: { tighter: '-0.03em', tight: '-0.02em', normal: '0', wide: '0.05em', eyebrow: '0.08em' },
};

export const space = { 1: 4, 2: 8, 3: 12, 4: 16, 5: 20, 6: 24, 8: 32, 10: 40, 16: 64 };

export const radius = { sm: 8, md: 12, lg: 16, xl: 24, '2xl': 32, pill: 100, full: 9999 };

export const shadow = {
  soft: '0px 4px 14px 0px rgba(0,0,0,0.25)',
  deep: '0px 10px 25px -5px rgba(0,0,0,0.5)',
  xl: '0px 25px 50px -12px rgba(0,0,0,0.7)',
  glow: '0px 0px 15px rgba(108,99,255,0.4)',
  glowStrong: '0px 0px 30px rgba(108,99,255,0.5)',
};

export const blur = { sm: 12, md: 20, lg: 40 };

export const motion = {
  fast: '150ms',
  base: '300ms',
  slow: '520ms',
  ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
  pressScale: 0.95,
  disabledOpacity: 0.5,
};

export default { color, gradient, font, space, radius, shadow, blur, motion };
