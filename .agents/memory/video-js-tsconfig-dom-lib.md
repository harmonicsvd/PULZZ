---
name: video-js scaffold missing DOM lib
description: video-js artifact tsconfig ships without the dom lib, so scaffold files fail typecheck until you add it
---

The `video-js` artifact scaffold's `tsconfig.json` omits the `"lib"` compiler option, so it falls back to `tsconfig.base.json`'s `["es2022"]` — no DOM. Result: scaffold files (`src/lib/video/hooks.ts`, `src/main.tsx`, parts of `src/lib/video/animations.ts`) fail typecheck with "Cannot find name 'window'/'document'" and framer-motion variant typing errors, even though the app builds and runs fine under Vite.

**Fix:** add `"lib": ["esnext", "dom", "dom.iterable"]` to the artifact's `tsconfig.json` compilerOptions — matching what every other web artifact (e.g. pulzz-landing) already has.

**Why:** Vite/esbuild don't typecheck, so the broken scaffold runs fine in the preview; only `tsc --noEmit` surfaces it. Don't waste time editing the scaffold source — it's a config gap, not a code bug.

**How to apply:** after creating a video-js artifact, if `pnpm --filter @workspace/<slug> run typecheck` errors in `lib/video/*` or `main.tsx`, add the dom lib line before touching anything else.
