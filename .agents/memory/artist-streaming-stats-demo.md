---
name: Artist-overall streaming stats are intentional demo figures
description: Why the artist dashboard's "Artist overall" streaming tab shows deterministic fake numbers instead of real Songstats data
---

The artist dashboard "Streaming Stats" panel has two tabs:

- **Your songs** — real per-song Songstats data (post-release), via the existing
  `/artists/:id/songstats` aggregation. Empty/graceful states for pre-release.
- **Artist overall** — deterministic DEMO figures (artist-wide reach across
  platforms), generated client-side and clearly labelled ("Showcase demo data" /
  "Demo figures" badge). NOT from Songstats.

**Why:** The Musicathon demo artists are public-domain historical acts with no
real streaming presence, so a real artist-level Songstats lookup would be empty
for every demo artist. The user explicitly chose polished, clearly-labelled demo
figures so the showcase always looks complete, over an honest-but-empty real
integration. (Same spirit as the static "streaming presence" follower counts.)

**How to apply:** Do NOT "fix" the Artist-overall tab by wiring it to real
Songstats — the empty result is the reason it's demo data. Keep figures
deterministic (seeded by artist id) so they never flicker, and keep the demo
labelling visible. The real partner integration lives only in the "Your songs"
tab.
