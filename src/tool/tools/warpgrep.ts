/**
 * WarpGrep Codebase Search Tool - REMOVED
 *
 * The built-in `codebase_search` (WarpGrep) tool has been removed from the
 * default tool registry. It relied on the proprietary Morph API and a
 * free-period proxy (`https://api.kilo.ai/api/gateway`) that is not
 * appropriate for Alexi's SAP AI Core context (data locality, licensing,
 * and free-tier bootstrapping do not apply).
 *
 * ## Migration
 *
 * Semantic codebase search is now provided by the standalone MCP server
 * `alexi-mcp-warpgrep` (see `packages/alexi-mcp-warpgrep`). Register it in
 * your `mcp-servers.json` to restore the `codebase_search` tool surface.
 * Users who want to run the SDK-backed variant directly can install
 * `@morphllm/morphsdk` and configure the MCP server to use it.
 *
 * This module retains a minimal `isWarpgrepAvailable()` shim so
 * `src/tool/tools/index.ts` can keep its "add semantic-search install hint
 * to `grep`" behaviour without importing the deleted tool implementation.
 * The `warpgrepTool` export is intentionally NOT provided here — importing
 * it will fail loudly, which is the desired signal for any leftover caller.
 */

/**
 * Check whether `@morphllm/morphsdk` can be resolved at runtime.
 *
 * Returns `true` when the package is installed and importable. Alexi no
 * longer ships a built-in tool that uses it, but the flag still drives the
 * "install @morphllm/morphsdk for semantic search" hint appended to
 * `grep`'s description so users who have the SDK installed do not see the
 * hint.
 */
export function isWarpgrepAvailable(): boolean {
  try {
    // Use import.meta.resolve to check if the package is resolvable.
    // This is a synchronous check in Node.js >= 20.
    import.meta.resolve('@morphllm/morphsdk');
    return true;
  } catch {
    return false;
  }
}

/**
 * @internal - reset the module-level deprecation flag. Kept as a no-op so
 * existing tests that call it continue to compile; the flag itself no longer
 * exists because there is no built-in tool to warn about.
 */
export function _resetWarpgrepDeprecationWarning(): void {
  // no-op: built-in tool removed
}
