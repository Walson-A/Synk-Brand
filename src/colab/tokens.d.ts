// GÉNÉRÉ depuis tokens/colab.json, ne pas éditer.

export interface ColabTheme {
  canvas: string;
  rail: string;
  surface: string;
  chip: string;
  border: string;
  text: string;
  textMuted: string;
  action: string;
  onAction: string;
  brand: string;
  ring: string;
  wave: string;
  wavePlayed: string;
  hover: string;
  selected: string;
  selectedHover: string;
  danger: string;
  success: string;
  scrim: string;
}

export declare const light: ColabTheme;
export declare const dark: ColabTheme;

export declare const ramp: {
  navy: Record<string, string>;
  slate: Record<string, string>;
  white: string;
};

export declare const font: {
  sans: string;
  weightRegular: number;
  weightMedium: number;
  weightSemibold: number;
  weightBold: number;
  weightExtrabold: number;
  sizeLabel: string;
  sizeSm: string;
  sizeBody: string;
  sizeTitle: string;
  sizeBig: string;
  leadingTight: number;
  leadingSnug: number;
  leadingNormal: number;
  trackingTitle: string;
  trackingBody: string;
  trackingButton: string;
  trackingLabel: string;
};

export declare const radius: {
  sm: string;
  md: string;
  lg: string;
  full: string;
};

export declare const space: {
  '1': string;
  '2': string;
  '3': string;
  '4': string;
  '5': string;
  '6': string;
  '7': string;
  '8': string;
};

export declare const size: {
  avatar: string;
  iconSm: string;
  iconMd: string;
  iconLg: string;
  iconXl: string;
  rail: string;
  aside: string;
  waveBar: string;
};

export declare const border: {
  width: string;
  iconStroke: number;
  selBar: string;
};

export declare const shadow: {
  floating: string;
  floatingDark: string;
};

export declare const motion: {
  fast: string;
  base: string;
  ease: string;
  disabledOpacity: number;
};

export declare function theme(scheme: 'light' | 'dark'): ColabTheme;
