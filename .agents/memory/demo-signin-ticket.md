---
name: One-click demo sign-in via Clerk ticket
description: Why the public "View demo dashboard" flow uses a server-minted sign-in ticket, not password
---

The one-click demo sign-in mints a short-lived single-use Clerk **sign-in token (ticket)** server-side (`POST /api/demo-session`) and the client exchanges it via the signals API `signIn.create({ strategy: "ticket", ticket })` → `signIn.finalize()`.

**Why:** Replit-managed Clerk's enabled first-factor strategies cannot be assumed. A direct client `signIn.password()` against the demo account failed even though the user was healthy (password enabled, email verified) — the instance simply did not accept the password strategy from the client. Tickets bypass enabled-strategy config, email verification, and captcha entirely, so they are the reliable way to do programmatic/one-click sign-in.

**How to apply:** For any "sign in as a fixed account without credentials" flow (demo, impersonation, magic preview), mint a sign-in token with the Clerk Backend API (`POST /v1/sign_in_tokens { user_id, expires_in_seconds }`) and exchange it client-side with the ticket strategy. Don't try to drive password sign-in programmatically.

The shared demo principal (seeded artist id 1) is enforced **read-only** in `requireArtist`: any non-GET/HEAD/OPTIONS request resolving to the demo artist returns 403, since anyone can sign in as it. Keep that guard if you add new artist-scoped mutations.
