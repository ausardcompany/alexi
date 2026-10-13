/**
 * Glob tool entry point — re-exports the actual tool implementation
 * from `./tools/glob.ts` and the shared allowlist resolver from
 * `./glob-ignored.ts`.
 *
 * Kept as a thin façade so upstream ports targeting
 * `src/tool/glob.ts` (opencode / kilocode layout) land cleanly.
 */

export { globTool, GLOB_SEARCH_TIMEOUT_MS, extendGlobPattern } from './tools/glob.js';
export { resolveAllowlist, type IgnoredAllowlist } from './glob-ignored.js';
