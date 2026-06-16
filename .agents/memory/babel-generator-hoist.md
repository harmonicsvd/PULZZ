---
name: babel-generator hoist break
description: Expo/Metro "Cannot find module '@babel/generator'" after a @babel/core override — pnpm hoist conflict
---

# Expo/Metro "Cannot find module '@babel/generator'"

`react-native-worklets`' babel plugin does an **undeclared** `require('@babel/generator')`, relying on it being hoisted into `node_modules/.pnpm/node_modules/@babel/generator`.

**The rule:** if you override/bump `@babel/core` (e.g. a security pin in `pnpm-workspace.yaml > overrides`), pin `@babel/generator` to the **same range** right next to it.

**Why:** an override can leave two `@babel/generator` versions in the tree. pnpm refuses to hoist a package when versions conflict, so it hoists *neither* → the worklets plugin's upward `require` resolution finds nothing → the Expo web/Metro bundle fails the BABEL transform with `Cannot find module '@babel/generator'` (entry.bundle returns HTTP 500, white screen).

**How to apply:**
- Keep `"@babel/generator": "^7.29.x"` aligned with `"@babel/core": "^7.29.x"` in overrides.
- After editing overrides, a plain `pnpm install` may say "Already up to date" and NOT re-link node_modules. Run `pnpm install --force` to re-materialize, then confirm `ls node_modules/.pnpm/node_modules/@babel/ | grep generator` shows it hoisted.
- Verify the fix by curling the expo entry.bundle — it should return `200 application/javascript`, not `500 application/json`.
