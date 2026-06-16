// Pulzz listener typography — Inter, the shared modern font used across the
// artist app and landing page. Each weight is a distinct family name because
// custom fonts in React Native / react-native-web do not synthesize weights;
// the family must be selected explicitly (fontWeight alone is ignored).
export const FONT = {
  regular: "Inter_400Regular",
  medium: "Inter_500Medium",
  semibold: "Inter_600SemiBold",
  bold: "Inter_700Bold",
  extrabold: "Inter_800ExtraBold",
} as const;

const WEIGHT_TO_FAMILY: Record<string, string> = {
  "100": FONT.regular,
  "200": FONT.regular,
  "300": FONT.regular,
  "400": FONT.regular,
  normal: FONT.regular,
  "500": FONT.medium,
  "600": FONT.semibold,
  "700": FONT.bold,
  bold: FONT.bold,
  "800": FONT.extrabold,
  "900": FONT.extrabold,
};

// Map a React Native fontWeight to the matching Inter family name.
export function fontFor(weight?: string | number): string {
  return WEIGHT_TO_FAMILY[String(weight ?? "400")] ?? FONT.regular;
}
