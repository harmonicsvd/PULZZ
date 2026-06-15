// Pulzz light theme — "creamy + light-blue + beige"
// Page backgrounds cream; deep navy text; mid blue; soft blue-grey surfaces; warm amber accent.
const palette = {
  text: "#1B2A4A",
  tint: "#3E5C99",
  background: "#F4EDE4",
  foreground: "#1B2A4A",
  card: "#FFFFFF",
  cardForeground: "#1B2A4A",
  primary: "#3E5C99",
  primaryForeground: "#FFFFFF",
  secondary: "#DCE3EE",
  secondaryForeground: "#1B2A4A",
  muted: "#DCE3EE",
  mutedForeground: "#6B7896",
  accent: "#E8956B",
  accentForeground: "#FFFFFF",
  destructive: "#D9534F",
  destructiveForeground: "#FFFFFF",
  border: "#E2DACF",
  input: "#DCE3EE",
  // Pulzz brand extras
  navy: "#1B2A4A",
  midBlue: "#3E5C99",
  blueGrey: "#DCE3EE",
  amber: "#E8956B",
  cream: "#F4EDE4",
  creamDeep: "#E5DFD5",
  discovered: "#3E5C99",
  discoveredGlow: "rgba(62, 92, 153, 0.22)",
  skip: "#E8956B",
  skipGlow: "rgba(232, 149, 107, 0.22)",
  surface: "#E5DFD5",
  surfaceElevated: "#FFFFFF",
  // Player accents
  brightBlue: "#1E7BFF",
  brightBlueDeep: "#0A4FCC",
  brightBlueGlow: "rgba(30, 123, 255, 0.45)",
};

const colors = {
  // Force the light palette in both schemes — the app is light-only by design.
  light: palette,
  dark: palette,
  radius: 16,
};

export default colors;
