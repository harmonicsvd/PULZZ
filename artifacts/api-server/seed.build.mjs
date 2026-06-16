import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { build as esbuild } from "esbuild";

globalThis.require = createRequire(import.meta.url);

const artifactDir = path.dirname(fileURLToPath(import.meta.url));

await esbuild({
  entryPoints: [path.resolve(artifactDir, "src/seed.ts")],
  platform: "node",
  bundle: true,
  format: "esm",
  outfile: path.resolve(artifactDir, "dist/seed.mjs"),
  logLevel: "info",
  external: ["*.node", "pg-native"],
  sourcemap: "linked",
  banner: {
    js: `import { createRequire as __cr } from 'node:module';
import __url from 'node:url';
import __path from 'node:path';
globalThis.require = __cr(import.meta.url);
globalThis.__filename = __url.fileURLToPath(import.meta.url);
globalThis.__dirname = __path.dirname(globalThis.__filename);`,
  },
}).catch((err) => {
  console.error(err);
  process.exit(1);
});
