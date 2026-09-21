/**
 * Semantic-search output helper.
 *
 * This module isolates the *wording* of semantic-search results so it can
 * be exercised directly by tests without booting an indexing worker or an
 * MCP transport. The exact phrasing here is the behavioural contract with
 * the model: empty output must never look like "no such code exists"
 * when the truth is "the index was disabled/broken/still building".
 *
 * Alexi does not ship a first-party semantic-search tool at the moment —
 * the capability is delegated to `@morphllm/morphsdk` and the
 * `alexi-mcp-warpgrep` MCP server. When one of those (or a future
 * built-in) surfaces an empty result set, it should render it through
 * {@link empty} so the model receives a *reason* alongside the miss.
 *
 * Ported from upstream `packages/opencode/src/kilocode/tool/semantic-search-output.ts`
 * with the external `@kilocode/kilo-indexing` type inlined as {@link IndexingStatus}
 * so Alexi does not take on the kilo-indexing dependency.
 */

/**
 * State snapshot of a semantic-search index at query time.
 *
 * Mirrors the shape emitted by upstream kilo-indexing's `status` module.
 * Any provider (built-in tool, MCP server, plugin) that wants to reuse
 * {@link empty} / {@link reason} should map its own status onto this
 * shape.
 */
export interface IndexingStatus {
  /**
   * Coarse-grained lifecycle state. New states MUST NOT be added without
   * also handling them in {@link reason}, otherwise callers will fall
   * through to the generic "index is up to date" branch and mislead the
   * model.
   */
  state: 'Disabled' | 'Error' | 'In Progress' | 'Standby' | 'Ready';
  /** Free-form detail suitable for appending to a user-visible message. */
  message: string;
  /** 0-100 completion percentage; only meaningful when `state === 'In Progress'`. */
  percent: number;
  /** Files already indexed; only meaningful when `state === 'In Progress'`. */
  processedFiles: number;
  /** Total files to index; only meaningful when `state === 'In Progress'`. */
  totalFiles: number;
}

/** Normalise Windows-style path separators to forward slashes. */
export function normalizePath(value: string): string {
  return value.replaceAll('\\', '/');
}

/** Human-readable description of what was actually searched. */
export function scope(root: string, prefix?: string): string {
  return prefix ? `${root}/${normalizePath(prefix)}` : root;
}

/**
 * Explain an empty result set in terms of index state.
 *
 * A raw `[]` from the underlying index is indistinguishable from a
 * genuine miss when the index is disabled, unbuilt, or broken. This
 * function turns the ambiguity into a sentence the model can reason
 * about.
 */
export function reason(status?: IndexingStatus): string {
  if (!status) {
    return 'The index could not be queried, so this is not evidence that no matching code exists.';
  }
  const detail = status.message.trim();
  const suffix = detail ? ` ${detail}` : '';
  if (status.state === 'Disabled') {
    return `Codebase indexing is disabled for this project, so nothing was searched.${suffix}`;
  }
  if (status.state === 'Error') {
    return `Codebase indexing failed, so nothing was searched.${suffix}`;
  }
  if (status.state === 'In Progress') {
    return `The index is still building (${status.percent}%, ${status.processedFiles}/${status.totalFiles} files), so results are incomplete.`;
  }
  if (status.state === 'Standby') {
    return `The index is not active, so results are incomplete.${suffix}`;
  }
  return 'The index is up to date, so no semantically similar code exists in this scope.';
}

/** Full output for a search that matched nothing. */
export function empty(root: string, prefix: string | undefined, status?: IndexingStatus): string {
  return [
    'No semantically similar code found.',
    `Scope: ${scope(root, prefix)}`,
    `Reason: ${reason(status)}`,
  ].join('\n');
}
