# Pulzz — Technical Guide

This document covers the architecture, setup, and development of Pulzz.

## Architecture Overview

Pulzz is a pnpm monorepo with shared libraries and deployable artifacts:

```
PULZZ-Replit/
├── artifacts/
│   ├── api-server/           Express API server (Node.js)
│   ├── pulzz-artist/         React + Vite web dashboard
│   ├── pulzz-landing/        React + Vite public landing page
│   └── pulzz-listener/       Expo React Native mobile app
├── lib/
│   ├── api-spec/             OpenAPI 3.0 source of truth
│   ├── api-client-react/     Generated React Query client (from OpenAPI)
│   ├── api-zod/              Generated Zod schemas (from OpenAPI)
│   ├── db/                   Drizzle ORM schema and migrations
│   └── object-storage-web/   Shared upload UI and hooks
└── scripts/
    └── (utility scripts)
```

### Design Principles

1. **Single Source of Truth** — OpenAPI spec (`lib/api-spec/openapi.yaml`) drives all generated clients, schemas, and types
2. **Type Safety** — TypeScript across all packages with strict checking
3. **Code Generation** — Orval generates React Query hooks and Zod schemas from the OpenAPI spec
4. **Shared Libraries** — Avoid duplication; database schema, API client, and validation schema are shared
5. **Monorepo Workflow** — pnpm workspaces allow parallel development and local package linking

---

## Setup

### Prerequisites

- **Node.js** 18+ (verify with `node --version`)
- **pnpm** 8+ (install with `npm install -g pnpm`)
- **PostgreSQL** 13+ (or Docker Compose for local database)
- **Git** 2.0+

### Install Dependencies

```bash
pnpm install --frozen-lockfile
```

This installs all workspace packages and respects the lockfile.

### Database Setup

#### Option 1: Local PostgreSQL

```bash
# Create database
createdb pulzz

# Set DATABASE_URL
export DATABASE_URL="postgres://username:password@localhost:5432/pulzz"

# Run migrations
pnpm --filter @workspace/db run migrate
```

#### Option 2: Docker Compose

```bash
docker compose up -d postgres

export DATABASE_URL="postgres://postgres:password@localhost:5432/pulzz"
pnpm --filter @workspace/db run migrate
```

### Environment Variables

Create a `.env.local` file in the workspace root or set them in your shell:

#### Core Database & Server

```bash
# API Server
PORT=8080
NODE_ENV=development
DATABASE_URL=postgres://user:pass@localhost:5432/pulzz

# Vite Applications
BASE_PATH=/
VITE_API_URL=http://localhost:8080
```

#### Musixmatch (Lyrics, Metadata, Genres)

```bash
# Required for song search, lyrics sync, and genre classification
MUSIXMATCH_API_KEY=your_musixmatch_api_key_here
```

**Usage:** Song metadata enrichment, synced lyrics, genre matching, artist/track search.

#### Cyanite (AI Mood, Genre, Energy Analysis)

```bash
# Required for emotional tagging and discovery matching
CYANITE_API_KEY=your_cyanite_api_key_here
CYANITE_WEBHOOK_SECRET=your_cyanite_webhook_secret_here
```

**Usage:** AI-powered mood detection, genre classification, energy levels, song similarity analysis.

#### Songstats (Post-Release Analytics)

```bash
# Optional: for tracking songs after release
SONGSTATS_API_KEY=your_songstats_api_key_here
```

**Usage:** Post-release performance tracking, streaming platform analytics, listener growth.

#### Object Storage (Replit)

```bash
PRIVATE_OBJECT_DIR=/path/to/private/storage
PUBLIC_OBJECT_SEARCH_PATHS=/path/to/public/storage
```

**Usage:** Audio uploads, artwork storage, file management.

---

## Environment Setup Example

Create `.env.local` in the workspace root:

```bash
# Server
PORT=8080
NODE_ENV=development
DATABASE_URL=postgres://postgres:password@localhost:5432/pulzz
BASE_PATH=/
VITE_API_URL=http://localhost:8080

# Partners
MUSIXMATCH_API_KEY=sk_musixmatch_1234567890abcdef
CYANITE_API_KEY=sk_cyanite_abcdef1234567890
CYANITE_WEBHOOK_SECRET=your_cyanite_webhook_secret_here
SONGSTATS_API_KEY=sk_songstats_xyz123

# Storage
PRIVATE_OBJECT_DIR=/tmp/pulzz-private
PUBLIC_OBJECT_SEARCH_PATHS=/tmp/pulzz-public
```

Then load it:

```bash
export $(cat .env.local | xargs)
```

Or use `dotenv` in Node:

```bash
npm install dotenv
# In your startup file:
require('dotenv').config({ path: '.env.local' });
```

---

## Development Commands

### Type Checking

```bash
pnpm run typecheck
```

Runs TypeScript compiler in check-only mode across all packages.

### Building

```bash
pnpm run build
```

Builds all artifacts (API, artist dashboard, landing page, listener app).

### Development Servers

#### API Server

```bash
PORT=8080 DATABASE_URL=postgres://localhost:5432/pulzz \
pnpm --filter @workspace/api-server run dev
```

Starts Express server with hot reload. Listens on `http://localhost:8080`

Health check: `GET http://localhost:8080/api/healthz`

#### Artist Dashboard

```bash
PORT=8082 BASE_PATH=/ VITE_API_URL=http://localhost:8080 \
pnpm --filter @workspace/pulzz-artist run dev
```

Starts Vite dev server on `http://localhost:8082`

#### Landing Page

```bash
PORT=8083 BASE_PATH=/ VITE_API_URL=http://localhost:8080 \
pnpm --filter @workspace/pulzz-landing run dev
```

Starts Vite dev server on `http://localhost:8083`

#### Listener App

```bash
cd artifacts/pulzz-listener
pnpm install
npx expo start
```

Follow Expo CLI prompts to run on simulator or physical device.

### Running All Services

For convenience, you can start all services in parallel:

```bash
# Terminal 1: API
PORT=8080 DATABASE_URL=postgres://localhost:5432/pulzz \
pnpm --filter @workspace/api-server run dev

# Terminal 2: Artist Dashboard
PORT=8082 BASE_PATH=/ VITE_API_URL=http://localhost:8080 \
pnpm --filter @workspace/pulzz-artist run dev

# Terminal 3: Landing Page
PORT=8083 BASE_PATH=/ VITE_API_URL=http://localhost:8080 \
pnpm --filter @workspace/pulzz-landing run dev

# Terminal 4: Listener App
cd artifacts/pulzz-listener && npx expo start
```

---

## Project Structure

### `/artifacts/api-server`

**Express API server** with PostgreSQL and Drizzle ORM.

```
src/
├── app.ts           Express app setup
├── index.ts         Server entry point
├── seed.ts          Demo data seeding
├── lib/
│   ├── auth/        Authentication middleware (if applicable)
│   └── storage/     Object storage upload handlers
└── routes/          API endpoints (/api/songs, /api/users, etc.)
```

**Key Routes:**
- `GET /api/healthz` — Server health check
- `GET /api/songs` — List songs in discovery pool
- `POST /api/songs` — Submit new song (artist)
- `GET /api/songs/:id` — Song details and analytics
- `POST /api/songs/:id/moments` — Log listener moment marks
- `POST /api/songs/:id/reactions` — Discovered/Skip reactions
- `POST /api/uploads` — Audio and artwork upload endpoint

### `/artifacts/pulzz-artist`

**React + Vite web dashboard** for artists.

```
src/
├── App.tsx          Root component
├── main.tsx         Entry point
├── pages/           Route pages (Dashboard, SubmitSong, Analytics)
├── components/      Shared UI components
├── hooks/           React hooks (useQuery, useMutation via generated client)
└── lib/             Utilities
```

**Key Pages:**
- `/dashboard` — Overview and song list
- `/submit` — Submit new song form
- `/songs/:id` — Per-song analytics and moment reviews
- `/profile` — Artist settings and profile

### `/artifacts/pulzz-landing`

**Public landing page** (React + Vite).

```
src/
├── App.tsx          Landing page content
├── main.tsx         Entry point
└── components/      Landing sections (Hero, Features, CTA)
```

### `/artifacts/pulzz-listener`

**Expo React Native app** for iOS/Android.

```
app/               Expo Router screens
components/        Reusable UI components
contexts/          React context (auth, discovery state)
hooks/             Custom hooks (useAudio, useMoments)
lib/               API client, utilities
server/            Local-first queue and offline sync
constants/         App-wide constants
```

**Key Screens:**
- `Discover` — Swipe through unreleased songs
- `Discoveries` — Songs marked as "Discovered"
- `Wall` — Artist leaderboard
- `Profile` — Listener profile and stats

### `/lib`

#### `api-spec/`

OpenAPI 3.0 specification (`openapi.yaml`) — **source of truth** for all API contracts.

Generated from this spec:
- React Query hooks (`api-client-react`)
- Zod schemas (`api-zod`)

To regenerate after spec changes:

```bash
pnpm --filter @workspace/api-spec run generate
```

#### `api-client-react/`

**Generated React Query client** from the OpenAPI spec.

Provides type-safe hooks:

```typescript
import { useSongsQuery, useSubmitSongMutation } from '@workspace/api-client-react';

// In a component:
const { data: songs } = useSongsQuery();
const { mutate: submitSong } = useSubmitSongMutation();
```

#### `api-zod/`

**Generated Zod schemas** from the OpenAPI spec.

Provides runtime validation:

```typescript
import { Song, SubmitSongRequest } from '@workspace/api-zod';

const songData = Song.parse(response.data);
const validated = SubmitSongRequest.safeParse(input);
```

#### `db/`

**Drizzle ORM** schema and database access.

```
src/
├── schema.ts       Database schema (tables, relations)
├── index.ts        Database client and query helpers
└── migrations/     SQL migration files
```

**Key Tables:**
- `users` — Listeners and artists
- `songs` — Submitted unreleased tracks
- `moments` — Listener moment marks
- `reactions` — Discovered/Skip votes

#### `object-storage-web/`

**Shared upload UI and hooks** for submitting audio and artwork.

Handles file uploads to object storage on both artist dashboard and listener app.

---

## API Endpoints

All endpoints live under `/api` and return JSON.

### Songs

```
GET    /api/songs                    List discovery pool
POST   /api/songs                    Submit new song (artist auth required)
GET    /api/songs/:id                Song details, analytics, moments
PATCH  /api/songs/:id                Update song metadata
```

### Reactions

```
POST   /api/songs/:id/reactions      React with Discovered or Skip
GET    /api/songs/:id/reactions      View aggregated reactions
```

### Moments

```
POST   /api/songs/:id/moments        Mark a moment in the track
GET    /api/songs/:id/moments        View all listener moment marks
```

### Uploads

```
POST   /api/uploads                  Upload audio or artwork file
       (Content-Type: multipart/form-data)
       Returns: { url: "object-storage://...", key: "..." }
```

### Health

```
GET    /api/healthz                  Server health check
       Returns: { status: "ok" }
```

---

## Database Schema Overview

### users

```sql
id UUID PRIMARY KEY
email VARCHAR UNIQUE
username VARCHAR UNIQUE
role ENUM ('listener', 'artist', 'admin')
profile_data JSONB  -- profile image, bio, etc.
created_at TIMESTAMP
```

### songs

```sql
id UUID PRIMARY KEY
artist_id UUID (FK -> users)
title VARCHAR
description TEXT
audio_url VARCHAR
artwork_url VARCHAR
release_date DATE
submitted_at TIMESTAMP
status ENUM ('draft', 'discovery_pool', 'released', 'archived')
```

### moments

```sql
id UUID PRIMARY KEY
song_id UUID (FK -> songs)
listener_id UUID (FK -> users)
timestamp_seconds FLOAT  -- e.g., 45.23 (beat drop at 45.23 seconds)
created_at TIMESTAMP
```

### reactions

```sql
id UUID PRIMARY KEY
song_id UUID (FK -> songs)
listener_id UUID (FK -> users)
type ENUM ('discovered', 'skip')
created_at TIMESTAMP
UNIQUE(song_id, listener_id)  -- One reaction per listener per song
```

---

## Code Generation

### Regenerating Clients and Schemas

The OpenAPI spec drives code generation. After modifying `lib/api-spec/openapi.yaml`:

```bash
pnpm --filter @workspace/api-spec run generate
```

This regenerates:
- `api-client-react/` — React Query hooks
- `api-zod/` — Zod validation schemas

### Adding New API Endpoints

1. Update `lib/api-spec/openapi.yaml` with the new endpoint
2. Run the generate command above
3. Implement the endpoint in `artifacts/api-server/src/routes/`
4. Use the generated hooks in React components

---

## Demo Seeding

The API ships with a demo catalog. To seed the database:

```bash
DATABASE_URL=postgres://localhost:5432/pulzz \
pnpm --filter @workspace/api-server run seed
```

This inserts public-domain recordings:
- Ernestine Schumann-Heink — Danny Boy
- Fisk Jubilee Quartet — Swing Low, Sweet Chariot
- Marion Harris — After You've Gone
- Sophie Tucker — Some of These Days
- Bessie Smith — St. Louis Blues

---

## Debugging

### API Server

Enable debug logging:

```bash
DEBUG=* PORT=8080 DATABASE_URL=postgres://localhost:5432/pulzz \
pnpm --filter @workspace/api-server run dev
```

### Database Queries

Enable Drizzle query logging:

```typescript
// In lib/db/src/index.ts
export const db = drizzle(client, { logger: true });
```

### React Components

Use React DevTools and browser DevTools.

Generated API hooks integrate with React Query DevTools. Install for better debugging:

```bash
pnpm add -D @tanstack/react-query-devtools
```

---

## Testing (Future)

Testing infrastructure will be added. Planned:

- **Unit tests** — Jest + vitest
- **E2E tests** — Playwright or Cypress
- **API tests** — Supertest or Vitest

To set up:

```bash
pnpm run test
```

---

## Performance Notes

1. **Code Splitting** — Vite auto-splits lazy-loaded routes in artist dashboard and landing
2. **API Response Caching** — React Query caches song data; use `invalidateQueries` on mutations
3. **Image Optimization** — Consider using Next Image or Vite's image plugin for artwork thumbnails
4. **Database Indexing** — Ensure indices on `songs.status`, `reactions.song_id`, `moments.song_id`

---

## Deployment

### Prerequisites

- Hosting (Vercel, Railway, Fly.io, etc.)
- PostgreSQL database (managed or self-hosted)
- Object storage (AWS S3, Replit storage, or similar)

### API Server

Build and start:

```bash
pnpm run build
pnpm --filter @workspace/api-server run start
```

Environment variables required:
- `DATABASE_URL`
- `PORT`
- `NODE_ENV=production`
- `PRIVATE_OBJECT_DIR` or cloud storage credentials

### Artist Dashboard & Landing

Build static assets:

```bash
pnpm --filter @workspace/pulzz-artist run build
pnpm --filter @workspace/pulzz-landing run build
```

Deploy to static hosting (Vercel, Netlify, AWS S3, etc.).

Set `VITE_API_URL` to production API endpoint.

### Listener App

Build and deploy via Expo Application Services (EAS):

```bash
cd artifacts/pulzz-listener
eas build --platform all
eas submit --platform all
```

---

## Contributing

1. Create a branch for your feature
2. Make changes in the relevant package
3. Run type checks: `pnpm run typecheck`
4. Build to verify: `pnpm run build`
5. Commit and open a PR

---

## Troubleshooting

### Database Connection Error

```
error: connect ECONNREFUSED 127.0.0.1:5432
```

Check PostgreSQL is running and `DATABASE_URL` is set correctly.

```bash
psql -U postgres -d postgres
\l  # List databases
```

### Missing API Types

If hooks are missing in `api-client-react`, regenerate:

```bash
pnpm --filter @workspace/api-spec run generate
```

### Port Already in Use

```bash
lsof -i :8080  # Check what's using port 8080
kill -9 <PID>  # Kill the process
```

### Module Not Found Errors

Ensure all dependencies are installed:

```bash
pnpm install --frozen-lockfile
```

And rebuild:

```bash
pnpm run build
```

---

## Resources

- [Express.js Docs](https://expressjs.com)
- [React Query Docs](https://tanstack.com/query/latest)
- [Drizzle ORM Docs](https://orm.drizzle.team)
- [Zod Docs](https://zod.dev)
- [OpenAPI Spec](https://spec.openapis.org/oas/v3.0.3)
- [Expo Docs](https://docs.expo.dev)
- [Vite Docs](https://vitejs.dev)

---

**Questions?** Refer to specific package READMEs or check the main [README.md](./README.md) for project overview.
