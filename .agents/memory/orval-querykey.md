---
name: Orval queryKey requirement
description: Generated React Query hooks in this project require explicit queryKey passed via the exported get*QueryKey() helpers
---

## Rule
Always pass `queryKey` explicitly when using generated hooks from `@workspace/api-client-react`.

```ts
// WRONG — causes TS2741 "queryKey is missing"
useGetArtistSongs(1, { query: { enabled: true } })

// CORRECT
import { useGetArtistSongs, getGetArtistSongsQueryKey } from "@workspace/api-client-react";
useGetArtistSongs(1, { query: { enabled: true, queryKey: getGetArtistSongsQueryKey(1) } })
```

**Why:** Orval's generated `UseQueryOptions` type marks `queryKey` as required (not optional). The generated options factory handles the default internally, but the TypeScript interface still demands an explicit value at the call site.

**How to apply:** Every `useGet*` hook call must include `queryKey: get[HookName]QueryKey(args)` in its `query` option. The key getter functions are all exported from the same package.
