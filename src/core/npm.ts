/**
 * npm-package entrypoint resolution shim (upstream port).
 *
 * Ports opencode `ba341c6`: under the Node runtime,
 * `import.meta.resolve(name, parent)` requires the
 * `--experimental-import-meta-resolve` flag (unlike Bun, where it is
 * always available), and `import()` of a bare package *directory* fails
 * with `ERR_UNSUPPORTED_DIR_IMPORT`. CommonJS `require.resolve()` does
 * the right thing: it picks the `require` / `default` export target
 * declared in the package's `exports` map, producing a file URL that
 * `import()` accepts.
 *
 * The Bun path keeps `import.meta.resolve(name, dir)` because Bun
 * implements the two-argument form as a stable feature.
 *
 * Callers use this helper when loading a plugin / MCP-server / skill
 * package installed in a specific project directory:
 *
 *   const entry = resolvePackageEntrypoint('some-plugin', pluginDir);
 *   if (entry) {
 *     const mod = await import(entry);
 *   }
 *
 * Returns `undefined` when resolution fails (missing package, broken
 * exports map, invalid parent) so callers can fall back to graceful
 * degradation instead of crashing on startup.
 */

import { createRequire } from 'module';
import * as path from 'path';
import { pathToFileURL } from 'url';

declare const Bun: unknown;

/**
 * Resolve the runtime entrypoint (as a file URL string) for the npm
 * package `name` installed in / near `dir`. Returns `undefined` on any
 * resolution failure.
 *
 * @param name - Bare package specifier (e.g. `@morphllm/morphsdk`).
 * @param dir - Directory to anchor resolution to. Typically the project
 *   root or a plugin install directory; the underlying resolver walks
 *   up from `dir/package.json` looking for a matching `node_modules`.
 */
export function resolvePackageEntrypoint(name: string, dir: string): string | undefined {
  try {
    // Node only honors the parent argument behind
    // --experimental-import-meta-resolve, and import() of the bare
    // package directory fails with ERR_UNSUPPORTED_DIR_IMPORT. `require`
    // resolution picks the "require" / "default" export target, which
    // import() then loads fine.
    if (typeof Bun !== 'undefined') {
      return import.meta.resolve(name, dir);
    }
    return pathToFileURL(createRequire(path.join(dir, 'package.json')).resolve(name)).href;
  } catch {
    return undefined;
  }
}
