# Pulzz — Development Guide

This guide covers the development workflow, coding standards, and contribution guidelines for Pulzz.

## Quick Start for Developers

If you're new to the project, follow this to get up and running in 10 minutes:

### 1. Clone and Install

```bash
git clone <repo-url>
cd PULZZ-Replit
pnpm install --frozen-lockfile
```

### 2. Set Up Database

```bash
export DATABASE_URL="postgres://localhost:5432/pulzz"
pnpm --filter @workspace/db run migrate
```

### 3. Seed Demo Data

```bash
pnpm --filter @workspace/api-server run seed
```

### 4. Configure Partner APIs (Optional)

For full functionality, set up environment variables for the partner integrations currently used by Pulzz:

```bash
# Create .env.local in workspace root
cat > .env.local << EOF
# Core
DATABASE_URL=postgres://localhost:5432/pulzz
VITE_API_URL=http://localhost:8080

# Partner integrations
MUSIXMATCH_API_KEY=your_key_here
CYANITE_API_KEY=your_key_here
CYANITE_WEBHOOK_SECRET=your_webhook_secret_here
SONGSTATS_API_KEY=your_key_here
EOF

# Load into shell
export $(cat .env.local | xargs)
```

See [TECHNICAL.md](./TECHNICAL.md#environment-variables) for all environment variable details.

### 5. Start Development Servers

Open 4 terminals:

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

### 5. Verify Everything Works

- Landing page: http://localhost:8083
- Artist dashboard: http://localhost:8082/dashboard
- API: http://localhost:8080/api/healthz (should return `{ status: "ok" }`)

**Done!** You can now browse demo songs and test features.

---

## Coding Standards

### TypeScript

- **Always use TypeScript** — No JavaScript files in `/src` directories
- **Strict mode enabled** — `tsconfig.json` has `"strict": true`
- **Type explicitly** — Avoid `any`; use specific types or generics

```typescript
// ❌ Bad
const getData = async (id) => {
  return fetch(`/api/songs/${id}`).then(r => r.json());
};

// ✅ Good
const getData = async (id: string): Promise<Song> => {
  const response = await fetch(`/api/songs/${id}`);
  return response.json();
};
```

### File Organization

```
src/
├── components/     React components
├── hooks/          Custom React hooks
├── pages/          Route pages (if using router)
├── lib/            Utilities and helpers
├── types/          TypeScript type definitions
└── constants/      Constants and enums
```

### Naming Conventions

- **Components**: PascalCase (`SongCard.tsx`, `DiscoverPage.tsx`)
- **Hooks**: Camel case with `use` prefix (`useAudio.ts`, `useMomentMarks.ts`)
- **Utils**: Camel case (`formatDuration.ts`, `validateAudio.ts`)
- **Types**: PascalCase (`Song.ts`, `Reaction.ts`)

### Imports

- **Relative paths** within a package
- **Absolute paths** for cross-package imports (via workspace aliases)

```typescript
// Within pulzz-artist
import { SongCard } from '../components/SongCard';
import { useAudio } from '../hooks/useAudio';

// From shared packages
import { Song, Reaction } from '@workspace/api-zod';
import { useSongsQuery } from '@workspace/api-client-react';
import { db } from '@workspace/db';
```

### React Best Practices

- **Use React Query** for server state (via generated client)
- **Use React Context** for app-level state (auth, theme, discovery state)
- **Avoid prop drilling** — lift state or use context
- **Memoize expensive components** with `React.memo` or `useMemo`

```typescript
import { useSongsQuery } from '@workspace/api-client-react';
import { SongCard } from '../components/SongCard';

export function DiscoverPage() {
  const { data: songs, isLoading } = useSongsQuery();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {songs?.map(song => (
        <SongCard key={song.id} song={song} />
      ))}
    </div>
  );
}
```

### API Development

- **Update OpenAPI spec first** (`lib/api-spec/openapi.yaml`)
- **Regenerate client** and schemas
- **Implement endpoint** in Express
- **Use generated types** for request/response validation

Example:

```typescript
// 1. Update openapi.yaml
// 2. pnpm --filter @workspace/api-spec run generate
// 3. Implement endpoint
import express from 'express';
import { SubmitSongRequest, Song } from '@workspace/api-zod';
import { db } from '@workspace/db';

router.post('/api/songs', async (req, res) => {
  const validated = SubmitSongRequest.safeParse(req.body);
  if (!validated.success) {
    return res.status(400).json({ error: validated.error });
  }

  const song = await db.insertSong(validated.data);
  res.json(song);
});
```

### Error Handling

- **Try-catch for async operations**
- **Validate input** with Zod before processing
- **Return meaningful error messages**

```typescript
try {
  const result = await submitSong(data);
  return result;
} catch (error) {
  if (error instanceof Error) {
    console.error('Failed to submit song:', error.message);
    throw new Error(`Song submission failed: ${error.message}`);
  }
  throw error;
}
```

### Comments

- **Use comments for "why"** not "what"
- **Keep comments up-to-date** with code

```typescript
// ❌ Bad — obvious from code
const songs = [];  // Initialize empty array

// ✅ Good — explains intent
// Cache songs in memory for development; in production, use Redis
const songs = [];
```

---

## Git Workflow

### Branch Naming

Use the format: `feature/description`, `bugfix/description`, or `refactor/description`

```bash
git checkout -b feature/moment-marking-ui
git checkout -b bugfix/audio-upload-timeout
```

### Commits

- **Atomic commits** — One logical change per commit
- **Clear messages** — Start with verb in present tense

```bash
git commit -m "Add moment marking UI to listener app"
git commit -m "Fix audio upload timeout on slow networks"
git commit -m "Refactor useSongsQuery hook to use caching"
```

### Pull Requests

1. Push your branch
2. Open a PR with a clear description of changes
3. Link any related issues
4. Ensure CI passes (typecheck, build)
5. Request review from team
6. Squash and merge once approved

---

## Testing

### Unit Tests (Future)

When test infrastructure is set up:

```bash
pnpm run test
```

Test files should be colocated with source:

```
src/
├── utils/
│   ├── formatDuration.ts
│   └── formatDuration.test.ts
```

### Manual Testing Checklist

Before opening a PR, test:

1. **Type Safety**
   ```bash
   pnpm run typecheck
   ```

2. **Build**
   ```bash
   pnpm run build
   ```

3. **Component/Feature**
   - In browser DevTools
   - With React Query DevTools
   - On mobile simulator (for Listener app)

4. **API Integration**
   - Test with real API server
   - Check API response in Network tab
   - Verify data flows to UI

---

## Debugging Tips

### API Server Issues

Enable detailed logging:

```bash
DEBUG=* PORT=8080 DATABASE_URL=postgres://localhost:5432/pulzz \
pnpm --filter @workspace/api-server run dev
```

### React Debugging

1. Install React Developer Tools browser extension
2. Use React DevTools Profiler to check render performance
3. Check React Query DevTools (if installed) to inspect query state

### Database Debugging

Check database directly:

```bash
psql $DATABASE_URL

-- List tables
\dt

-- Query songs
SELECT * FROM songs LIMIT 5;

-- Check reactions for a song
SELECT * FROM reactions WHERE song_id = '...';
```

### Module Resolution Issues

If imports fail with "cannot find module":

```bash
# Reinstall dependencies
pnpm install --frozen-lockfile

# Rebuild workspace
pnpm run build
```

---

## Performance Considerations

### React Query

- Queries are cached by default; use `invalidateQueries` after mutations
- Set `staleTime` to reduce refetching during development

```typescript
const { data: songs } = useSongsQuery({
  staleTime: 5 * 60 * 1000, // 5 minutes
});
```

### Expo App

- Use `React.memo` for frequently-rendered components
- Avoid inline functions in render (define outside or `useCallback`)
- Profile performance in Expo DevTools

### API Server

- Add database indices for frequently-queried fields
- Cache non-changing data (demo catalog)
- Use pagination for large result sets

---

## Security Checklist

- [ ] **No secrets in code** — Use environment variables
- [ ] **Input validation** — Use Zod for all API inputs
- [ ] **SQL injection prevention** — Use Drizzle ORM (parameterized queries)
- [ ] **CORS configured** — Restrict to known origins
- [ ] **Auth implemented** — Verify user ownership of resources
- [ ] **File upload limits** — Prevent large file abuse

---

## Troubleshooting

### "Module not found" errors

```bash
pnpm install --frozen-lockfile
pnpm run build
```

### API won't start

Check `DATABASE_URL`:

```bash
echo $DATABASE_URL
psql $DATABASE_URL -c "SELECT NOW();"  # Should work
```

### React components not hot-reloading

Restart Vite dev server:

```bash
Ctrl+C
pnpm --filter @workspace/pulzz-artist run dev
```

### Types don't match between packages

Regenerate client and schemas:

```bash
pnpm --filter @workspace/api-spec run generate
pnpm run build
```

---

## Useful Commands

```bash
# Type check all packages
pnpm run typecheck

# Build all artifacts
pnpm run build

# Build specific package
pnpm --filter @workspace/pulzz-artist run build

# Run a specific dev server
pnpm --filter @workspace/api-server run dev

# View workspace structure
pnpm list --depth=0

# Add dependency to a package
pnpm --filter @workspace/pulzz-artist add some-package

# Remove dependency
pnpm --filter @workspace/pulzz-artist remove some-package

# Run a script in all packages
pnpm -r run typecheck
```

---

## Adding New Features

### Example: Adding a New Song Field

1. **Update database schema** (`lib/db/src/schema.ts`)
   ```typescript
   songs: {
     // ... existing fields
     lyrics: text(),
   }
   ```

2. **Create migration**
   ```bash
   pnpm --filter @workspace/db run migrate:create
   ```

3. **Update OpenAPI spec** (`lib/api-spec/openapi.yaml`)
   ```yaml
   Song:
     properties:
       lyrics:
         type: string
   ```

4. **Regenerate client and types**
   ```bash
   pnpm --filter @workspace/api-spec run generate
   ```

5. **Update API endpoint** (`artifacts/api-server/src/routes/`)
   ```typescript
   router.post('/api/songs', (req, res) => {
     // Now SubmitSongRequest includes lyrics
     const validated = SubmitSongRequest.safeParse(req.body);
   });
   ```

6. **Update UI** (`artifacts/pulzz-artist/src/`)
   ```typescript
   // Form now includes lyrics input
   // Component automatically gets new type from generated client
   ```

7. **Test everything**
   ```bash
   pnpm run typecheck
   pnpm run build
   ```

---

## Code Review Checklist

When reviewing a PR, check:

- [ ] Types are correct (no `any`)
- [ ] No console.log in production code
- [ ] Database queries are indexed
- [ ] API spec updated (if adding endpoints)
- [ ] Client regenerated (if API spec changed)
- [ ] Tests pass / manual testing done
- [ ] Commit messages are clear
- [ ] No secrets committed

---

## Resources

- [Project README](./README.md) — Project overview and story
- [Technical Guide](./TECHNICAL.md) — Architecture and setup
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Docs](https://react.dev)
- [Express Docs](https://expressjs.com)
- [Drizzle ORM Docs](https://orm.drizzle.team)
- [Zod Docs](https://zod.dev)

---

**Questions?** Check the docs above or ask the team. Welcome aboard! 🎵
