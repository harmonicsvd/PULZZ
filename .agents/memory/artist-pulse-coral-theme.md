---
name: Artist app Pulse Coral theme
description: Brand/theme constraints for the Pulzz artist web dashboard
---

The Pulzz artist dashboard (`artifacts/pulzz-artist`) uses a light-only "Pulse Coral" identity: cream backgrounds, deep navy text (#1B2A4A), signature Pulse Coral (#FF5C49) for primary actions/logo/active states/highlights, Clash Display (Fontshare) for wordmark + h1-h3 via a `font-display` theme token, Inter for body. Charts use coral/amber/green/blue.

**Rule:** white text on the coral primary button is intentional (~3:1 contrast). It is the brand-mandated CTA color and matches the listener app — do NOT darken the coral or swap to navy text to chase strict WCAG AA normal-text contrast.
**Why:** the brand spec explicitly requires #FF5C49 with white for primary actions; cross-app consistency outweighs the AA normal-text guideline for this signature element. Body/muted text was darkened separately to pass AA.
**How to apply:** keep `--primary: 6 100% 64%` + `--primary-foreground: 0 0% 100%`. Both `:root` and `.dark` hold identical light values on purpose (app never renders dark).

## Artist app cannot import @workspace/db types
The pulzz-artist Vite app has no project reference to @workspace/db, so importing types like `ArtistLinks` from it fails with TS2307. Define local string-literal types in `src/lib/artist-meta.ts` instead.
