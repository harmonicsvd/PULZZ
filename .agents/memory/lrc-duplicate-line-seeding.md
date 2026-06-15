---
name: LRC duplicate-line seeding
description: Why seeding per-line timestamps from existing LRC must be ordered/occurrence-based, not text-keyed
---

When rehydrating an LRC editor (e.g. the artist tap-to-sync tool) so each lyric line shows its existing timestamp, match timestamps to lines by **occurrence order**, never by a `Map<text, time>` keyed on the line text.

**Why:** Repeated lines are extremely common in lyrics (choruses, refrains). A text-keyed map collapses all identical lines to the last timestamp, silently corrupting the round-trip — e.g. two "Midnight bloom, midnight bloom" lines at 00:26 and 00:48 both rendered as 00:48.

**How to apply:** Parse LRC into an ordered `{timeMs, text}[]`, build a `Map<text, number[]>` of per-text timestamp queues, then walk the draft lines in order and `shift()` from the matching text's queue. Both the listener's `parseLrc` and the artist seeder must stay order-preserving so the listener↔artist round-trip is consistent.
