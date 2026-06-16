---
name: Orval pattern → regex mangling
description: Orval generates a broken RegExp from OpenAPI string `pattern`, so don't rely on it as the only validation
---
An OpenAPI `pattern: "^https?://"` on a string property is emitted by Orval/Zod codegen as
`new RegExp('^https?:\/')` — the trailing `//` is collapsed/escaped away. It still rejects
non-http(s) schemes (the `^https?:` prefix survives) so it's adequate as a coarse guard, but the
regex is NOT the pattern you wrote.

**Why:** Used for artist collaboration link validation (block `javascript:`/`data:` hrefs). The
backend Zod regex happened to still reject bad schemes, but the pattern was silently altered.

**How to apply:** When you need precise string validation from an OpenAPI `pattern`, verify the
generated regex in `lib/api-zod/src/generated/api.ts`. For anything security-relevant (URLs rendered
as `href`), add an explicit client-side guard (e.g. `^https?:\/\//i` test) in addition to the
generated schema — never trust the codegen regex alone.
