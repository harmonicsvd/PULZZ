---
name: Brand asset generation (icon/splash/favicon)
description: How to produce Pulzz app icon/splash/favicon from the wordmark without paid image generation.
---

# Generating Pulzz brand raster assets

Produce the listener app `icon.png` / `splash.png` / `favicon.png` by rendering the
Pulzz wordmark (navy "Pul" `#1B2A4A` + coral "zz" `#FF5C49` on cream `#F4EDE4`) to PNG
with `@resvg/resvg-js` (already installed) using the bundled Inter ExtraBold font at
`node_modules/@expo-google-fonts/inter/800ExtraBold/Inter_800ExtraBold.ttf`.

**Why:** The user is out of credits and has repeatedly declined paid AI image
generation. Brand consistency (the wordmark, never a separate logo mark) is a hard
requirement. resvg + the already-bundled brand font gives crisp, on-brand assets for free.

**How to apply:**
- Run the generation script from inside `artifacts/pulzz-listener` (not `/tmp`) so
  `require("@resvg/resvg-js")` resolves; pass the ttf via `font.fontFiles` with
  `loadSystemFonts:false`.
- For the app icon, keep the wordmark inside the centre ~60% of the square — Android
  adaptive icons crop to a ~66% safe zone, so edge-to-edge text gets clipped.
- splash uses `resizeMode:"contain"` on a cream background, so give the wordmark margin.
- `@resvg/resvg-js` is NOT importable from arbitrary cwd; `sharp` is not installed but
  ImageMagick `convert` and resvg are.
