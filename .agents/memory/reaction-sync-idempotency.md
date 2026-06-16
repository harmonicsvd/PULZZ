---
name: Reaction sync idempotency & listener offline outbox
description: How the listener→artist discovery loop syncs and why scoring must be transition-based
---

# Discovery loop sync (listener → artist)

The listener app is local-first but DOES sync reactions and moment marks to the
API (`/api/reactions`, `/api/moment-marks`), gated on a backend `listenerId`
created during onboarding (`saveProfile`) and backfilled on launch if a profile
exists without one.

## Reaction scoring must be transition-based

`POST /reactions` upserts the reaction row by `(songId, listenerId)`, but listener
`points`/`discoveryCount` must only change on a **state transition**: +1/+100 when
moving to `discovered` from not-discovered, -1/-100 when moving away (clamped at 0
via `GREATEST`).

**Why:** the client retries/replays unsent events from a local outbox, so the same
`discovered` can be POSTed more than once. If scoring incremented on every POST,
offline retries would inflate metrics. Counts derived by aggregating the reactions
table (e.g. `discoveredCount`) are naturally idempotent; only the denormalized
listener score needed the guard.

**How to apply:** any new scoring/denormalized counter driven by a reaction POST
must key off the before/after state, never the raw request.

## Offline outbox

Failed (or pre-identity) reaction/moment sends are queued in AsyncStorage
(`pulzz_pending_reactions`, `pulzz_pending_moments`) and flushed on launch and once
the backend `listenerId` is established. Moment-mark inserts are NOT server-side
idempotent, so the outbox only enqueues on actual failure (not blind re-send) to
keep duplicate risk to the rare server-succeeded-but-response-lost edge.
