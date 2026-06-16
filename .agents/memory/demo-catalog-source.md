---
name: Demo catalog source of truth
description: Why the demo songs are public-domain recordings, not AI-generated tracks
---

# Demo catalog must stay free public-domain recordings

The demo songs are intentionally real public-domain recordings hosted on
archive.org, each with canonical lyrics + occurrence-ordered LRC and a
`license.type="Public Domain"`.

**Why:** A prior effort replaced them with AI-generated "modern" original tracks
(audio/art/lyrics generated in-house). The user disliked those and explicitly
asked for FREE, real songs with their own real lyrics only. We reverted to the
public-domain catalog. There is also a hard credit constraint — no paid AI
audio/image generation anywhere in this project.

**How to apply:** Do NOT re-introduce AI-generated songs or paid generation for
the demo catalog. Keep the listener demo data and the server seed in sync. The
seed UPSERTs by id in place so reactions/moment marks that FK to song_id stay
valid — never delete/reinsert. The public-domain catalog is preserved in git
history if a clean rebuild is ever needed.
