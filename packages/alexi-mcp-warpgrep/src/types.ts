/**
 * Shared types for the alexi-mcp-warpgrep server.
 */

/**
 * A single code span returned by the underlying WarpGrep search.
 */
export interface CodeSpan {
  filePath: string;
  startLine: number;
  endLine: number;
  content: string;
}

/**
 * Successful WarpGrep search result. The `spans` array may be empty when
 * the query produced no matches; callers should treat an empty array as a
 * valid "no results" outcome, not an error.
 */
export interface WarpGrepResult {
  spans: CodeSpan[];
  query: string;
}

/**
 * Structured error returned by `warpgrepExecute` when the search cannot be
 * performed. Kept separate from `WarpGrepResult` so callers can pattern
 * match on the discriminated union.
 */
export interface WarpGrepError {
  error: string;
}

/**
 * Discriminated union returned by `warpgrepExecute`. Consumers should
 * narrow on `success` before accessing `data`/`error`.
 */
export type WarpGrepOutcome =
  | { success: true; data: WarpGrepResult; hint?: string }
  | { success: false; error: string };
