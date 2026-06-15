---
name: Listener app is intentionally light-only
description: Why constants/colors.ts has identical light and dark palettes in the Expo listener app
---

The Pulzz Expo listener app uses ONE light palette ("creamy + light-blue + beige") applied to BOTH the `light` and `dark` keys in `constants/colors.ts`.

**Why:** The approved design language is light-only. `useColors()` picks the key matching the device color scheme, so forcing both keys to the same palette guarantees the light theme always renders regardless of the user's OS dark-mode setting. This is deliberate — do NOT "fix" the duplicate palettes by reintroducing a separate dark theme.

**How to apply:** When adjusting listener colors, edit the single `palette` object. Brand tokens (navy `#1B2A4A`, midBlue `#3E5C99`, blueGrey `#DCE3EE`, amber `#E8956B`, cream `#F4EDE4`) live alongside the standard token names so existing screens inherit changes through tokens. The root `_layout.tsx` pins `<StatusBar style="dark" />` to match the light background.
