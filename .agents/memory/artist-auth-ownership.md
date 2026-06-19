---
name: Artist auth + ownership scoping
description: How the Pulzz artist dashboard authenticates artists and scopes data to the owner
---

The artist web app uses Clerk (cookie-based, the default auth skill). The signed-in
artist is resolved server-side via `GET /artists/me`.

**JIT provisioning rule:** `requireArtist` middleware looks up the artist by Clerk
`userId` (stored in a nullable unique `clerk_user_id` column on `artists`); if none
exists it inserts a new artist, with an email `onConflictDoUpdate` fallback so a
Clerk user whose email matches a seeded artist links to that existing row instead of
creating a duplicate. **Why:** the 5 seeded artists have no clerkUserId — without the
email fallback, signing in as a seeded artist would orphan their songs under a new id.

**Ownership rule:** every artist-scoped route requires auth and rejects records the
requester doesn't own — `requireSongOwnership()` (404 unknown song, 403 not-owner)
on all `PUT /songs/:id/*` + `POST /songs/:id/analyze`; explicit `id === req.artist.id`
checks on `/artists/:id` dashboard/songs/PUT and on `/wall?artistId=`. `POST /songs`
ignores any client `artistId` and forces `req.artist.id`.

**What stays public** (the listener/landing apps call these with no session): `GET /songs`,
`GET /songs/:id`, reactions + moment-mark endpoints, `GET /artists` (list, needed by the
Collaborate page) and `GET /artists/:id` (profile). Do not lock these down.

**Frontend:** `CurrentArtistProvider` fetches `/artists/me` once and exposes
`useCurrentArtist()`; pages read `artist.id` instead of the old hardcoded `ARTIST_ID=1`.
Route `/artists/me` must be registered before `/artists/:id` in Express or `:id` swallows it.

**Web transport is cookie-based** — never add `getToken()` / `Authorization: Bearer` /
`setAuthTokenGetter` to browser calls. A 401 in the web app means a session/cookie/
middleware-ordering problem, not missing token auth.
