---
name: Production demo-data backfill on startup
description: Why demo Sound DNA / lyrics analysis can be missing only in the deployed app, and the self-healing seed pattern that fixes it
---

# Production demo-data backfill

The deployed app runs against a **separate** production database from dev. Replit's
publish flow migrates the **schema** but not **data**. So data only reaches prod via
the server's own startup seeding — never via "push dev to prod" of rows.

`ensureSeeded()` (runs before `app.listen`) historically only ran the full seed when
the `artists` table was **empty**. Consequence: if prod was first seeded by an older
deploy that predated newer columns (e.g. `analysis`, `cyanite_status`,
`cyanite_analysis`), those rows stay stale forever — the empty-table guard skips them,
so the deployed Song DNA + lyrics-analysis panels render their empty states even though
dev looks fine.

**Fix / pattern:** in `ensureSeeded()`, after the empty-table check, also detect demo
rows missing the newer data (we key off demo song ids from `seedData` having
`cyaniteAnalysis IS NULL`) and re-run `runSeed()`. `runSeed()` UPSERTs the 5 demo songs
by id via `onConflictDoUpdate`, so it's idempotent, only touches the demo
artists/songs (artist-submitted songs have other ids), and never touches reactions /
moment_marks (separate tables). Once backfilled, the null check is false → no-op.

**Why:** prod stale-data incidents can't be fixed from the agent's tools — `executeSql`
against production is read-only. Startup self-healing is the only reliable remediation
for already-deployed data, and it requires the user to **re-publish** to take effect.

**How to apply:** whenever you add a new column/field that demo/seed rows should carry,
extend the backfill predicate (or trust that any one always-seeded field being null is
a good "stale row" signal, since `runSeed` restores the whole row). After publishing,
verify prod with a read query: songs 1–5 should have non-null `analysis`,
`cyanite_status`, `cyanite_analysis`, and `lrc`.
