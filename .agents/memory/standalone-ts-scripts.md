---
name: Running standalone TS scripts that import @workspace/db
description: Why a plain `node script.ts` fails for seeds/CLIs importing workspace libs, and the esbuild-bundle pattern that works
---

A standalone script (e.g. a DB seed) that imports `@workspace/db` cannot be run with plain `node script.ts`, even on Node 24 with native TS type-stripping. Two independent blockers:

1. Workspace packages are NOT hoisted to the repo-root `node_modules`. They only resolve from inside a package that declares the dependency (e.g. `artifacts/api-server`). A root-located script gets `ERR_MODULE_NOT_FOUND` for `@workspace/db`. Node resolves modules relative to the *file's* location, not cwd, so placing the script under `artifacts/api-server/` is necessary but not sufficient.
2. `lib/db` source uses extensionless directory imports (`./schema`), which Node ESM rejects with `ERR_UNSUPPORTED_DIR_IMPORT`. `lib/*` packages are `emitDeclarationOnly` (no JS output) — the server only works because esbuild bundles them from source.

**Pattern that works:** bundle the script with esbuild just like the server (`artifacts/api-server/build.mjs`), then run the bundle. The seed uses `artifacts/api-server/seed.build.mjs` (esbuild → `dist/seed.mjs`) wired to the `seed` npm script. Externalize `*.node` and `pg-native`; add the `createRequire`/`__dirname` banner so CJS-only deps bundled into ESM keep working.

**Why:** keeps a reproducible, committed seed runnable without adding `tsx` and without fighting Node's ESM resolver over drizzle's source layout.
