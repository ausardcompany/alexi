/**
 * Instruction-set diffing.
 *
 * Ports upstream commit `15adc3d` (send only changed entries in
 * instruction updates). On SAP AI Core, system/instruction updates sent
 * on every turn add up fast — resending the full instruction set on
 * each message wastes input tokens and causes spurious re-injection of
 * identical MCP / skill / reference blocks on the model side.
 *
 * This module exposes a pure {@link diffInstructions} function. The
 * call sites that previously re-emitted the whole instruction block
 * (MCP tool-list updates, skill registry refreshes, reference-doc
 * attachments) can call this to compute only the delta and forward the
 * `added` / `updated` / `removed` partitions.
 */

/**
 * One instruction entry. `id` is a stable, deterministic identifier
 * (e.g. `mcp:playwright::navigate`, `skill:code-review`,
 * `reference:AGENTS.md`); `content` is whatever body the model should
 * see for that id.
 *
 * `id` MUST be stable across turns for diffing to work — a UUID
 * regenerated per turn defeats the whole point of this module.
 */
export interface InstructionEntry {
  id: string;
  content: string;
}

/**
 * The result of {@link diffInstructions}. All three partitions are
 * independent; call sites forward only the non-empty ones (an empty
 * `added` / `removed` / `updated` means "no change in that bucket").
 */
export interface InstructionDiff {
  /** Entries present in `current` but not in `previous`. */
  added: InstructionEntry[];
  /** Ids present in `previous` but not in `current`. */
  removed: string[];
  /** Entries present in both but whose content changed. */
  updated: InstructionEntry[];
}

/**
 * Compute the delta between two instruction snapshots.
 *
 * The function is pure: both inputs are consumed by value, and the
 * output arrays are freshly allocated. Order of entries in the output
 * follows insertion order of `current` (for `added` / `updated`) and
 * `previous` (for `removed`), which keeps the diff stable across runs
 * and makes diffs easy to reason about in tests.
 *
 * A duplicate `id` in either input is NOT treated as an error — the
 * later entry wins in the lookup map, mirroring how
 * `new Map([[a,1],[a,2]]).get(a) === 2`. Callers that need
 * strict-mode behaviour should deduplicate upstream.
 */
export function diffInstructions(
  previous: readonly InstructionEntry[],
  current: readonly InstructionEntry[]
): InstructionDiff {
  const prevMap = new Map<string, string>();
  for (const e of previous) {
    prevMap.set(e.id, e.content);
  }
  const currMap = new Map<string, string>();
  for (const e of current) {
    currMap.set(e.id, e.content);
  }

  const added: InstructionEntry[] = [];
  const updated: InstructionEntry[] = [];
  const removed: string[] = [];

  for (const [id, content] of currMap) {
    if (!prevMap.has(id)) {
      added.push({ id, content });
    } else if (prevMap.get(id) !== content) {
      updated.push({ id, content });
    }
  }
  for (const id of prevMap.keys()) {
    if (!currMap.has(id)) {
      removed.push(id);
    }
  }
  return { added, removed, updated };
}

/**
 * Return true when a diff contains no changes. Call sites can use this
 * to skip the "send instruction update" step entirely when the
 * previous and current snapshots are identical.
 */
export function isEmptyDiff(diff: InstructionDiff): boolean {
  return diff.added.length === 0 && diff.removed.length === 0 && diff.updated.length === 0;
}
