// One source of truth for colours, spacing and type, so every screen matches.
// Colours come in a light and a dark set; useTheme() picks one based on the
// phone's appearance setting.

const light = {
  background: "#F6F5FB",
  surface: "#FFFFFF",
  text: "#1C1B29",
  textMuted: "#5F5D72",
  border: "#DDDAEA",
  placeholder: "#8C8AA0",

  primary: "#4F46E5",
  primaryPressed: "#4338CA",
  onPrimary: "#FFFFFF",
  primarySoft: "#EEF0FF",

  danger: "#C62828",
  onDanger: "#FFFFFF",

  errorBg: "#FDECEC",
  errorBorder: "#F3C1C1",
  errorText: "#9F1D1D",
  successBg: "#E8F5EA",
  successBorder: "#B9DFBF",
  successText: "#1E5E2A",
  infoBg: "#EEF0FF",
  infoBorder: "#C9CCF6",
  infoText: "#3730A3",
};

type Palette = typeof light;

const dark: Palette = {
  background: "#0F0E17",
  surface: "#1A1926",
  text: "#F2F1F8",
  textMuted: "#A9A7BE",
  border: "#34324A",
  placeholder: "#77758C",

  primary: "#818CF8",
  primaryPressed: "#6366F1",
  onPrimary: "#0F0E17",
  primarySoft: "#26244A",

  danger: "#C62828",
  onDanger: "#FFFFFF",

  errorBg: "#3A1A1F",
  errorBorder: "#6B2A33",
  errorText: "#FCA5A5",
  successBg: "#15301D",
  successBorder: "#2C5B39",
  successText: "#86EFAC",
  infoBg: "#1F1F45",
  infoBorder: "#3B3B7A",
  infoText: "#C7D2FE",
};

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 };

export const radius = { sm: 8, md: 12, lg: 16, pill: 999 };

export const fontSize = {
  small: 12,
  label: 14,
  body: 16,
  heading: 20,
  title: 28,
};

export type Theme = {
  dark: boolean;
  colors: Palette;
  spacing: typeof spacing;
  radius: typeof radius;
  fontSize: typeof fontSize;
};

export const lightTheme: Theme = {
  dark: false,
  colors: light,
  spacing,
  radius,
  fontSize,
};

export const darkTheme: Theme = {
  dark: true,
  colors: dark,
  spacing,
  radius,
  fontSize,
};
