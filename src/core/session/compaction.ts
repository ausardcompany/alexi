/**
 * Compaction thresholds, buffer handling, and loop-guard helpers.
 *
 * Ports upstream fixes:
 *   - kilocode `ccf958a1d` — compaction fires at the configured threshold
 *     (not 0.9×threshold) and halts repeated compaction attempts.
 *   - opencode `33726e8`  — a configured `buffer` that would starve the
 *     model of context is ignored instead of yielding a negative budget.
 *   - opencode `f523f77`  — config field renamed `precompute_compaction` →
 *     `background_compaction`; old field kept as a deprecated alias.
 *
 * These helpers are pure and dependency-free so the compaction manager
 * (`src/compaction/index.ts`) and the per-session prompt builder
 * (`src/core/session/prompt.ts`) can both use them without introducing
 * cycles.
 */

/**
 * Minimal shape of a usage record consumed by {@link shouldCompact}. Only
 * `ratio` (used / contextWindow) and `tokens` (absolute used tokens) are
 * required — callers that already track richer usage can pass their own
 * records so long as these two fields are present.
 */
export interface Usage {
  /** Used tokens as a fraction of the context window, 0..1. */
  ratio: number;
  /** Absolute used tokens. */
  tokens: number;
}

/**
 * Decide whether to run compaction based on the configured threshold.
 *
 * Fix 1 (kilocode `ccf958a1d`): previously the trigger was `ratio >=
 * threshold * 0.9`, which fired well before the configured threshold.
 * The correct trigger is `ratio >= threshold`.
 *
 * Fix 2 (loop guard): if we have already compacted this session and the
 * token count has NOT meaningfully decreased, do not try again — the
 * summariser is spinning in place and will just burn budget. Callers
 * persist `lastCompactionAtTokens` on the session after each successful
 * compaction run.
 */
export function shouldCompact(
  usage: Usage,
  threshold: number,
  lastCompactionAtTokens?: number
): boolean {
  // Only compact once the configured threshold is actually reached.
  if (usage.ratio < threshold) {
    return false;
  }
  // Prevent compaction loops: if we already compacted and the token count
  // hasn't meaningfully decreased, don't try again.
  if (lastCompactionAtTokens !== undefined && usage.tokens >= lastCompactionAtTokens) {
    return false;
  }
  return true;
}

/**
 * Return the effective compaction budget — the number of tokens the model
 * is allowed to use before compaction kicks in.
 *
 * Fix (opencode `33726e8`): a user-configured `buffer` larger than the
 * remaining context would otherwise produce a zero or negative budget and
 * starve the model. In that case, the buffer is silently ignored and the
 * caller gets the full remaining window.
 */
export function effectiveCompactionBudget(
  contextWindow: number,
  buffer: number,
  used: number
): number {
  const remaining = contextWindow - used;
  // If the configured buffer would leave the model no room, ignore it.
  if (buffer >= remaining) {
    return remaining;
  }
  return remaining - buffer;
}

/**
 * Normalised compaction configuration surface shared by the schema loader
 * (`src/config/compactionConfig.ts`) and the compaction manager. The
 * canonical field is `background_compaction`; `precompute_compaction` is
 * accepted as a deprecated alias (opencode `f523f77`).
 */
export interface SessionCompactionConfig {
  /** Compaction trigger as a fraction of the context window, 0..1. */
  threshold?: number;
  /** Reserve this many tokens for the next model reply before compacting. */
  buffer?: number;
  /** Run compaction eagerly in the background (new canonical name). */
  background_compaction?: boolean;
  /** @deprecated use background_compaction */
  precompute_compaction?: boolean;
}

/**
 * Resolve the canonical `background_compaction` flag, honouring the
 * deprecated `precompute_compaction` alias when the canonical field is
 * absent.
 */
export function resolveBackgroundCompaction(cfg: SessionCompactionConfig): boolean {
  if (cfg.background_compaction !== undefined) {
    return cfg.background_compaction;
  }
  if (cfg.precompute_compaction !== undefined) {
    return cfg.precompute_compaction;
  }
  return false;
}
