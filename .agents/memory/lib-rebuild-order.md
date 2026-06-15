---
name: Lib rebuild order
description: Correct order for typechecking after schema/lib changes to avoid "no exported member" errors
---

## Rule
After any change in a `lib/*` package (db schema, api-spec codegen, shared types), always run `pnpm run typecheck:libs` before running artifact-level typechecks.

```bash
# WRONG order — artifact sees stale lib declarations
pnpm --filter @workspace/api-server run typecheck  # → "Module has no exported member"

# CORRECT order
pnpm run typecheck:libs                            # rebuilds all lib declarations
pnpm --filter @workspace/api-server run typecheck  # now sees fresh declarations
```

**Why:** Lib packages are composite TypeScript projects that emit `.d.ts` declarations. Artifacts import these declarations, not source. If lib source changed but `tsc --build` hasn't re-emitted, artifacts see the old shape and report missing exports.

**How to apply:** Any time you edit `lib/db/src/schema/`, run `pnpm --filter @workspace/api-spec run codegen`, or touch any `lib/*` source — run `pnpm run typecheck:libs` first.
