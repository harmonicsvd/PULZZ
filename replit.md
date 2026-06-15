# Pulzz

Pre-release music discovery platform for Musicathon 2026 (June 15–21). Listeners discover unreleased songs before release day, mark moments, and react Discovered/Skip. Artists submit songs and track real-time discovery stats.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080, proxied at `/api`)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run typecheck:libs` — rebuild lib declarations (run this first if you see "no exported member" errors)
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5 (port 8080, routes under `/api`)
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec at `lib/api-spec/openapi.yaml`)
- Build: esbuild (CJS bundle)
- Artist dashboard: React + Vite + Tailwind + shadcn/ui
- Listener app: Expo (React Native)

## Where things live

- `lib/api-spec/openapi.yaml` — source of truth for all API contracts
- `lib/api-client-react/src/generated/api.ts` — generated React Query hooks
- `lib/api-zod/src/generated/api.ts` — generated Zod schemas
- `lib/db/src/schema/` — Drizzle table definitions (artists, listeners, songs, reactions, moment_marks)
- `artifacts/api-server/src/routes/` — Express route handlers
- `artifacts/pulzz-artist/src/pages/` — artist dashboard pages (dashboard, songs, song-detail, submit-song, wall)
- `artifacts/pulzz-listener/app/` — Expo screens (_layout, onboarding, tabs, listen/[id])
- `artifacts/pulzz-listener/data/songs.ts` — 5 demo songs (local AsyncStorage only for now)

## Architecture decisions

- Listener app uses AsyncStorage only (no backend for first build) — demo songs in `data/songs.ts` with SoundHelix MP3 URLs
- Generated hooks require explicit `queryKey` via the exported `get*QueryKey()` helpers — always pass it in the `query` option
- Artist dashboard is hardcoded to artistId=1 for MVP (Luna Voss)
- All routes prefixed with `/api` — services must handle their full base path
- After any schema change in `lib/*`: run `pnpm run typecheck:libs` before artifact typechecks or you'll get "no exported member" errors

## Product

**Listener App (Expo mobile):** 3-step onboarding, 4 tabs (Discover, Discoveries, Wall, Profile), audio player with moment marking, Discovered/Skip reactions, points system. Demo mode with 5 seeded songs.

**Artist Dashboard (React web):** Overview stats, Discovery Pool song list, per-song analytics (reactions, top moments, lyrics), song submission form, Discovery Wall leaderboard.

**API Server (Express):** Songs, reactions, moment marks, wall, artists, listeners endpoints. Seeded with 5 artists + 5 songs.

## Demo Data

- Artist 1: Luna Voss (Indie Pop) — Midnight Bloom
- Artist 2: NXVUS (Electronic) — Electric Reverie  
- Artist 3: The Veil (Alternative) — Chasing Echoes
- Artist 4: Aisha Kaine (R&B) — Golden Hours
- Artist 5: Valo (Synth-pop) — Neon Prayer

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- After any lib schema change, always run `pnpm run typecheck:libs` before `pnpm --filter ... run typecheck`
- Generated hooks need explicit `queryKey` — use the `get*QueryKey()` exports from `@workspace/api-client-react`
- Do NOT run `pnpm dev` at the workspace root — use `restart_workflow` instead
- Listener app's audio uses `expo-av` — requires Expo Go or a development build to test audio

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
- Brand: bg `#0A0A0F`, primary `#7B61FF` (electric purple), accent `#FF3C6E` (hot pink), dark-only theme
