# Musicathon 2026 Idea Tracker

Working direction for adapting the pre-release music discovery platform into a Musicathon 2026 project.

## Core Idea

Build a pre-release music discovery experience where listeners hear unreleased or early-stage songs, react emotionally during playback, and help artists understand which moments connect before the song enters the wider streaming race.

The project should make Musixmatch central, not decorative. Lyrics, metadata, song identity, emotional context, and discovery should all connect back to the Musixmatch API.

## Current Product Shape

1. Artist or demo dataset provides songs with metadata, lyrics, story/context, and audio.
2. Listener completes a short onboarding flow around genre, mood, instruments/sounds, and discovery personality.
3. Listener enters a weekly pool feed of songs submitted before release.
4. Listener chooses a song from the pool and opens the listening experience.
5. While listening, listener can tap "Mark this moment".
6. After the song, listener chooses "Discovered" or "Skip".
7. Artist/project view shows moment marks, discovered/skip ratio, and simple insight summaries.

## Musicathon Partner Fit

### Musixmatch

Core API layer. Use for lyrics, music metadata, search, matching context, and proof that the project is built around Musixmatch.

### Cyanite

Potential mood, genre, energy, and similarity tagging. Strong fit for matching and emotional discovery.

### LALAL.AI

Potential stem separation or vocal/instrument isolation. Useful if we want moment-level or lyric/audio analysis.

### Songstats

Potential post-release analytics and artist traction context. Useful for closing the loop after discovery.

### ElevenLabs

Optional voice layer. Could create artist voice notes, narrated song stories, multilingual intros, or an AI discovery host.

### Replit

Build/deploy support. Useful for fast demo hosting during the hackathon.

### n8n

Optional automation layer. Could connect APIs quickly if direct integration becomes too slow.

## First Build Goal

Build the listener loop first:

1. Listener onboarding
2. Song discovery queue
3. Audio player
4. Mark-this-moment interaction
5. Discovered/Skip reaction
6. Store and display reaction data

This proves the core experience before building artist upload, full matching, or advanced analytics.

## Current Design Focus

The immediate product focus is listener onboarding. See `Onboarding_Design_Tracker.md` for the current onboarding decisions, UI direction, data inputs, and open questions.

Current onboarding decision: do not ask for language during onboarding. Language should live as a main-feed filter so discovery does not become language-biased too early.

Next product focus: weekly pool feed. After onboarding, the listener should see songs currently in the release-week discovery pool. Songs enter the pool roughly one week before release and leave after release. The feed should show a list of available songs with title, artist, tags, short story, release timing, match reason, and a `Listen` action. A bottom menu can exist as placeholder navigation for now.

## MVP Scope

### Must Have

- Small curated song/demo dataset
- Listener onboarding
- Basic matching or queue generation
- Full audio playback
- Moment mark button with timestamp capture
- Discovered/Skip reaction screen
- Simple artist insight dashboard
- Clear Musixmatch API usage

### Nice To Have

- Lyrics-synced listening view
- AI-generated emotional tags from lyrics/story
- Cyanite mood/genre enrichment
- LALAL.AI stem-derived insight
- Songstats post-release context
- ElevenLabs narrated artist stories

### Defer

- Full artist upload UI
- Payments/subscriptions
- Complex multi-objective optimization
- Collaborative filtering
- Production-scale moderation
- Fine-tuned model

## Immediate Next Steps

1. Decide exact hackathon demo story.
2. Choose a name for the prototype.
3. Decide which APIs are mandatory for the first demo.
4. Create technical MVP plan.
5. Scaffold the app.
6. Build listener loop with fake data.
7. Add Musixmatch integration.
8. Add one or two partner integrations only if they strengthen the demo.

## Build Log

- 2026-06-13: Created Next.js app in `musicathon-listener` using TypeScript, Tailwind, ESLint, App Router, and `src/` directory.

## Open Questions

- Are we using real unreleased artist songs, sample/demo tracks, or public tracks for the hackathon prototype?
- Can we access the Musixmatch API key before kickoff, or do we need to mock the integration first?
- Should the demo focus more on listeners discovering songs or artists receiving insight?
- Which partner integration gives the strongest judging value for the least implementation risk?
- What should the prototype be called for Musicathon?
