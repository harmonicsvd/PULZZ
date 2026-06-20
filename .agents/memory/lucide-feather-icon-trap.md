---
name: lucide Feather icon trap
description: Why a video/React UI showed feathers everywhere instead of the intended icons
---

# lucide-react `Feather` is a literal icon, not a dynamic icon component

In the Pulzz pitch video, scenes imported `{ Feather } from 'lucide-react'` and rendered
`<Feather name="zap" />`, `<Feather name="pause" />`, etc., treating it like a dynamic
icon-by-name component. lucide-react's `Feather` is the **literal feather glyph** and
**ignores any `name` prop** — so every "icon" (including the player play/pause/skip and all
interaction buttons) silently rendered as a feather. This was the user-reported "feather logo
everywhere."

**Fix:** import each icon by its real name and render that component
(`Zap`, `Pause`, `Play`, `SkipBack`, `SkipForward`, `Star`, `X`, `Bell`, `Check`, `Clock`,
`ExternalLink`, `Sparkles`, `Handshake`, `User`, …). lucide-react has no name-prop dynamic
component — use named imports, or build an explicit name→component map if dynamic lookup is
needed.

**Why:** it typechecks fine (extra props are accepted) and never errors, so the bug is only
visible on screen. When a UI shows the same wrong icon everywhere, suspect a generic/static
icon component being driven by an ignored prop.
