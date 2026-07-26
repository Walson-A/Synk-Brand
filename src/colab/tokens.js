// COLAB design tokens — GÉNÉRÉ depuis tokens/colab.json, ne pas éditer.
//   npm run build:tokens
//
// Forme { light, dark } volontairement identique à celle de Colors[scheme] déjà
// utilisée par Synk-App : rien de nouveau à apprendre pour l'agent C8.

export const light = {
  canvas: "#ffffff",
  rail: "#f3f7fc",
  surface: "#f3f7fc",
  chip: "#e3edf7",
  border: "#c6d8eb",
  text: "#091420",
  textMuted: "#527294",
  action: "#1B395A",
  onAction: "#ffffff",
  brand: "#1B395A",
  ring: "#1B395A",
  wave: "#9db9d7",
  wavePlayed: "#091420",
  hover: "#eef4fb",
  selected: "#e3edf7",
  selectedHover: "#d7e6f4",
  danger: "#b42318",
  success: "#067647",
  scrim: "rgba(9,20,32,0.42)",
};

export const dark = {
  canvas: "#090d10",
  rail: "#05080a",
  surface: "#293a4c",
  chip: "#304254",
  border: "#2f3d4c",
  text: "#f5f7fa",
  textMuted: "#aabaca",
  action: "#ffffff",
  onAction: "#0e141b",
  brand: "#1B395A",
  ring: "#f5f7fa",
  wave: "#527294",
  wavePlayed: "#f5f7fa",
  hover: "#141c25",
  selected: "#293a4c",
  selectedHover: "#32465a",
  danger: "#ef8b84",
  success: "#47cd89",
  scrim: "rgba(0,0,0,0.58)",
};

/** Les primitives. Utiliser les rôles (light/dark) dans les composants ; la rampe
 *  ne sert qu'à définir de nouveaux rôles. */
export const ramp = {
  navy: {
    '50': "#f3f7fc",
    '100': "#e3edf7",
    '200': "#c6d8eb",
    '300': "#9db9d7",
    '400': "#6592c3",
    '500': "#3771ae",
    '600': "#1f5a98",
    '700': "#1c4878",
    '800': "#1B395A",
    '900': "#102338",
    '950': "#091420",
    'ink': "#070d13",
  },
  slate: {
    '50': "#f5f7fa",
    '100': "#e8edf3",
    '200': "#cfd8e3",
    '300': "#aabaca",
    '400': "#7a93ae",
    '500': "#527294",
    '600': "#3a5b7d",
    '700': "#314963",
    '800': "#293a4c",
    '900': "#19232f",
    '950': "#0e141b",
    'ink': "#090d10",
  },
  white: "#ffffff",
};

export const font = {
  sans: "'IBM Plex Sans', system-ui, -apple-system, sans-serif",
  weightRegular: 400,
  weightMedium: 500,
  weightSemibold: 600,
  weightBold: 700,
  weightExtrabold: 800,
  sizeLabel: "11px",
  sizeSm: "12.5px",
  sizeBody: "14.5px",
  sizeTitle: "15px",
  sizeBig: "17px",
  leadingTight: 1.15,
  leadingSnug: 1.35,
  leadingNormal: 1.5,
  trackingTitle: "-0.012em",
  trackingBody: "0",
  trackingButton: "0.1em",
  trackingLabel: "0.13em",
};

export const radius = {
  sm: "8px",
  md: "11px",
  lg: "14px",
  full: "999px",
};

export const space = {
  '1': "4px",
  '2': "8px",
  '3': "10px",
  '4': "12px",
  '5': "14px",
  '6': "18px",
  '7': "20px",
  '8': "24px",
};

export const size = {
  avatar: "27px",
  iconSm: "14px",
  iconMd: "16px",
  iconLg: "18px",
  iconXl: "21px",
  rail: "246px",
  aside: "262px",
  waveBar: "2px",
};

export const border = {
  width: "1px",
  iconStroke: 1.75,
  selBar: "3px",
};

export const shadow = {
  floating: "0 8px 24px -6px rgba(9,20,32,0.18)",
  floatingDark: "0 8px 24px -6px rgba(0,0,0,0.72)",
};

export const motion = {
  fast: "120ms",
  base: "200ms",
  ease: "cubic-bezier(0.2, 0, 0, 1)",
  disabledOpacity: 0.42,
};

export const theme = (scheme) => (scheme === 'dark' ? dark : light);

export default { light, dark, ramp, theme, font, radius, space, size, border, shadow, motion };
