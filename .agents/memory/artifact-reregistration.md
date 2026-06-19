---
name: Artifact re-registration after dir deletion
description: How to recover platform artifact registration after an artifacts/<slug>/ dir was deleted, and which root files are tool-protected during a full repo import
---

# Artifact re-registration & protected files during a full repo import

## Deleting an artifact dir deregisters it at the platform level
Removing `artifacts/<slug>/` (e.g. during a wholesale repo replace) fires a platform
"Removed artifact" event and drops it from `listArtifacts()` — even after you copy the
directory (and its `.replit-artifact/artifact.toml`) back. The files alone do not re-register it.

**Why:** registration is platform state driven through the artifact tooling, not re-derived
from the toml on disk.

**How to apply (re-register WITHOUT losing code):** `createArtifact` refuses an existing slug,
so don't use it. Instead, for each artifact: copy its existing `artifact.toml` to a sibling
temp file (`artifact.edit.toml`) and call
`verifyAndReplaceArtifactToml({ tempFilePath, artifactTomlPath })` (both absolute paths).
A `{success:true}` re-registers it; confirm with `listArtifacts()`. Delete the temp files after.

## Some root files are guarded against raw rm/cp
During a full import via plain `cp`/`rm`:
- `.gitignore` — any `rm`/overwrite is blocked as a "destructive git operation" (matches *git*).
- `.replit` / `.replitignore` — direct edit/cp blocked; "owned by a different tool or skill".

**How to apply:** `diff` these against the import source first — for a same-project import they
are often byte-identical, so no change is needed and you can skip them. If they genuinely differ,
use the proper tooling (workflows/artifacts skills) rather than editing `.replit` by hand.
Preserve `.git`, `.local`, `.cache`, `.config`, and root `node_modules` (gitignored Replit dirs),
then run `pnpm install` to reconcile. `rsync` is NOT installed — use a `cp`/`rm` loop.
