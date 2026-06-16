---
name: Expo web testing target
description: Why automated browser tests of the Expo listener must hit the Expo dev domain, not the shared proxy path
---

# Testing the Expo web app

When running automated browser tests (or curl-driven checks) against the Expo
listener web build **in development**, navigate to the Expo dev domain directly
(`$REPLIT_EXPO_DEV_DOMAIN`), NOT the shared-proxy path (e.g. `/pulzz-listener/`).

**Why:** In dev, Metro serves `index.html` through the proxy fine (you get the
correct `<title>`), but the bundle is referenced at an **absolute** path
(`/node_modules/.pnpm/.../expo-router/entry.bundle`) with no path prefix. That
request does not route back to the Expo service through the shared proxy, so the
bundle never loads and the page renders blank (`#root` empty at `readyState
complete`). Hitting the Expo domain directly resolves the bundle on the same
origin and the app mounts normally.

**How to apply:** For `runTest`, pass the full `https://<REPLIT_EXPO_DEV_DOMAIN>`
base URL in every navigation step. A blank-screen test failure with a correct
document title is this issue, not a real regression. Note: `process.env` is not
available in the code_execution sandbox — read `REPLIT_EXPO_DEV_DOMAIN` via bash
first. The published build is unaffected (serve.js strips BASE_PATH and serves a
static export), so judges using the deployed `/pulzz-listener/` link are fine.
