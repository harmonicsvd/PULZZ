---
name: Listener font rollout
description: Why the Expo listener app needs an explicit fontFamily on every text style, and which font it uses.
---

# Listener font application

The Expo listener (`artifacts/pulzz-listener`) historically **loaded** a Google Font but **never applied it** — every text style fell back to the system font, so the chosen font had no visible effect.

**Rule:** in React Native / react-native-web, custom (non-system) fonts do **not** synthesize weights — `fontWeight` alone is ignored. Each text style must set an explicit `fontFamily`. Use the `fontFor(weight)` helper in `constants/fonts.ts`, which maps a weight to the right Inter family (`Inter_400Regular` … `Inter_800ExtraBold`). Marker for "this is a text style": the style object has a `fontSize`.

**Font choice:** the listener uses **Inter** (the shared Pulzz brand font, same as the artist app + landing). A distinct display font (e.g. Clash Display) was deliberately **not** bundled.
**Why:** credit budget was nearly exhausted and bundling a custom non-Google font into Expo carries extra risk; Inter is already proven across the other artifacts and keeps branding consistent.
**How to apply:** when adding any new `<Text>`/`<TextInput>` style, add `fontFamily: fontFor("<weight>")`. Don't touch styles that already declare a `fontFamily` (e.g. the monospace `monoFont` in `ErrorFallback.tsx`).
