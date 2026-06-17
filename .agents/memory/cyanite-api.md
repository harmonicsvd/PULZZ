---
name: Cyanite GraphQL API shape
description: Cyanite music-analysis API — auth, the upload→create→enqueue→result flow, and the exact result fields. Use to avoid re-introspecting the schema.
---

# Cyanite API (music analysis)

Endpoint: `POST https://api.cyanite.ai/graphql`. Auth header: `Authorization: Bearer <CYANITE_API_KEY>` (the "Integration Access Token"). `CYANITE_WEBHOOK_SECRET` is the signing secret for verifying inbound webhook calls. Both are server-side only.

**Why:** schema introspection costs credits/time; this captures the shape once.

## Analyze a hosted audio file (our archive.org URLs)
1. `mutation { fileUploadRequest { id uploadUrl } }` — returns an upload target.
2. `PUT` the raw audio bytes to `uploadUrl` (Content-Type audio/mpeg). The `id` is the `uploadId`.
3. `libraryTrackCreate(input: { uploadId, title, externalId })` → union `LibraryTrackCreateResult` = `LibraryTrackCreateSuccess { createdLibraryTrack { id } enqueueResult } | LibraryTrackCreateError { code message }`. **create auto-enqueues** (see enqueueResult), so a separate enqueue is usually unnecessary.
   - Set `externalId` to OUR song id for traceability, but ALSO persist the returned cyanite `libraryTrack.id` ↔ our songId mapping — that's the reliable join key.
4. (optional) `libraryTrackEnqueue(input: { libraryTrackId })` → `LibraryTrackEnqueueSuccess { enqueuedLibraryTrack { id } } | LibraryTrackEnqueueError`.
5. Results: the `libraryTrack(id:ID!)` QUERY returns a union `LibraryTrackResult`, NOT a `LibraryTrack` directly — you MUST wrap fields in `... on LibraryTrack { ... }` or you get "Cannot query field X on type LibraryTrackResult". Full: `query($id:ID!){ libraryTrack(id:$id){ __typename ... on LibraryTrack { audioAnalysisV6 { __typename ... on AudioAnalysisV6Finished { result { ... } } } } } }`.

**SSRF guard (server fetches user-supplied audioUrl):** the artist submit flow lets a user supply any `audioUrl`, which the server fetches to relay to Cyanite — classic blind-SSRF surface. Guard it: http(s) only + resolve every host to a public IP (block loopback/link-local 169.254/RFC1918/CGNAT/ULA). archive.org `/download/` URLs 302-redirect to `ia*.archive.org`, so you MUST follow redirects manually and re-validate each hop — never `redirect:"error"` (breaks the seed catalog).

**Archival-audio caveat:** very old/noisy/mono public-domain recordings (our pre-1929 demo catalog) analyze to a near-empty result — `genreTags:[]`, `moodTags:[]`, all genre/mood probabilities 0, `bpmPrediction.value:0`, `valence/arousal:0`, `transformerCaption:null`, only `keyPrediction`+`energyLevel` populated. This is real model output (it's trained on modern audio), not a bug — treat `bpm<=0` as null and degrade the UI gracefully.

Other enqueue entry points exist: `spotifyTrackEnqueue(input:{spotifyTrackId})`, `youTubeTrackEnqueue`. Queries: `libraryTrack(id)`, `libraryTracks`, `spotifyTrack`, plus search ops.

## Analysis state unions
`audioAnalysisV6` / `audioAnalysisV7` each resolve to one of: `*NotStarted | *Enqueued | *Processing | *Finished { result } | *Failed | *NotAuthorized`. Always branch on `__typename`; only `*Finished` carries `result`.

## Result fields (AudioAnalysisV6Result; V7 has the same set + `advanced*`)
- `genreTags` / `moodTags` — LISTS of enums (top tags). Genre enum: ambient, blues, classical, electronicDance, folkCountry, jazz, funkSoul, latin, metal, pop, rapHipHop, reggae, rnb, rock, singerSongwriter. Mood enum: aggressive, calm, chilled, dark, energetic, epic, happy, romantic, sad, scary, sexy, ethereal, uplifting, ambiguous.
- `genre` / `mood` — OBJECTS of `Float` probabilities, one field per enum value above (full distribution; good for cosine similarity).
- `bpmPrediction { value confidence }`, `bpmRangeAdjusted: Float`.
- `keyPrediction { value(MusicalKey) confidence }`, `timeSignature: String`.
- `valence: Float`, `arousal: Float` (0–1 affect vector).
- `energyLevel`: enum variable|medium|high|low. `energyDynamics`: enum low|medium|high.
- `transformerCaption: String` (human-readable caption), `musicalEraTag: String`, `freeGenreTags: String`.

## Webhook
Configured in Cyanite dashboard → register with the secret on the URL: `https://pulzz.replit.app/api/cyanite/webhook?token=<CYANITE_WEBHOOK_SECRET>`. TEST event body = `{ "type":"TEST", "data":null }`. Real events carry a type + data; don't hard-depend on the exact data shape — extract a libraryTrack id if present, else sweep all `processing` rows and re-query Cyanite for status.

**Auth decision:** Cyanite has NO documented payload-signing/HMAC scheme, so authenticity is verified by a shared-secret token (matches `CYANITE_WEBHOOK_SECRET` via `timingSafeEqual`). The handler accepts the token from `?token=` query OR `x-cyanite-secret`/`x-webhook-secret`/`Bearer` header; when the secret env is UNSET it accepts (dev). Mismatch → 401 and NO sweep. **Why:** without this, anyone could POST the endpoint to trigger Cyanite-polling sweeps (resource abuse). The registered dashboard URL MUST include `?token=`. Caveat: URL tokens can leak via proxy/access logs — never log the full URL (we log `req.body` only); prefer a header if Cyanite ever supports one.

## Sound similarity (SoundProfile)
`toSoundProfile(cyaniteAnalysis)` (in `api-server/src/lib/soundVector.ts`) → `SoundProfile{energy,valence,arousal,topGenres,topMoods,vector}` or `null`. **Returns null when the analysis has no usable signal** (empty tags + all-zero genre/mood/valence/arousal) — an all-zero vector would cosine-match anything at "100%", which is misleading. `vector` order is deterministic: `[energy, valence, arousal, ...genre dist by sorted key, ...mood dist by sorted key]` so any two profiles from the same Cyanite model align for cosine. Exposed as nullable `soundProfile` on Song (per-song) and Artist (mean of catalog) in the API; listener Discover and artist Collaborate both layer cosine similarity on top of their existing heuristics and degrade silently when null. **Demo catalog (pre-1929) yields null everywhere — real modern uploads populate it.**

**How to apply:** server-only `lib/cyanite.ts` mirrors `lib/songstats.ts` (key-missing → graceful "unconfigured"). Mobile app NEVER calls Cyanite — it reads stored results via our `/api`.
