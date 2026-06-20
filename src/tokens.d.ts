// Type declarations for @synk/brand/tokens — keep in sync with tokens.js.
// Values themselves live in tokens/tokens.json (source of truth).

export declare const color: {
  violet: string; indigo: string; eclipse: string;
  surfaceCanvas: string; surfaceCard: string; surfaceRaised: string;
  surfaceOverlay: string; surfaceInset: string;
  borderSubtle: string; borderDefault: string; borderStrong: string;
  textHi: string; textMid: string; textDim: string; textOnAccent: string;
  accent: string; accentHover: string; accentPress: string;
  accentRing: string; accentWash: string;
  success: string; warning: string; danger: string; info: string;
};

export declare const gradient: {
  primary: string; spotlight: string; fog: string;
};

export declare const font: {
  sans: string;
  weight: { regular: number; medium: number; semibold: number; bold: number; extrabold: number; black: number };
  size: { cap: number; eyebrow: number; xs: number; sm: number; base: number; md: number; lg: number; xl: number; '2xl': number; display: number };
  leading: { tight: number; snug: number; normal: number };
  tracking: { tighter: string; tight: string; normal: string; wide: string; eyebrow: string };
};

export declare const space: { 1: number; 2: number; 3: number; 4: number; 5: number; 6: number; 8: number; 10: number; 16: number };

export declare const radius: { sm: number; md: number; lg: number; xl: number; '2xl': number; pill: number; full: number };

export declare const shadow: { soft: string; deep: string; xl: string; glow: string; glowStrong: string };

export declare const blur: { sm: number; md: number; lg: number };

export declare const motion: { fast: string; base: string; slow: string; ease: string; pressScale: number; disabledOpacity: number };

declare const _default: {
  color: typeof color; gradient: typeof gradient; font: typeof font;
  space: typeof space; radius: typeof radius; shadow: typeof shadow;
  blur: typeof blur; motion: typeof motion;
};
export default _default;
