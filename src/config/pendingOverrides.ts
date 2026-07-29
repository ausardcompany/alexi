/**
 * Pending Model-Capability Override Accumulator
 *
 * Preserves custom model metadata (pricing, context window, prompt-cache
 * support, cost tier, strengths, reasoning flag) across model-id changes in
 * routing-config.json.
 *
 * Background:
 *   Upstream Cline PR #12628 fixed a bug where changing the OpenAI
 *   Compatible model id committed the NEW id without carrying the custom
 *   overrides forward. The old id was dropped, the new id was unknown to
 *   the catalog, and it resolved to safe defaults (inputPrice/outputPrice
 *   0, supportsPromptCache false) — silently billing paid traffic as free.
 *
 *   Alexi supports the same pattern via routing-config.json custom model
 *   entries. When an interactive editor changes a model id we MUST
 *   recommit the previously-displayed metadata under the new id, and any
 *   edits made while a commit is in flight must target the pending
 *   (new) id rather than the stale (old) id being read back from disk.
 *
 * This module is deliberately state-only. It has no I/O of its own; the
 * caller (an interactive settings command, a plan/act mode editor, etc.)
 * decides when to persist via {@link saveRoutingConfig}.
 */

import type { ModelCapability } from '../core/router.js';

/**
 * Subset of {@link ModelCapability} that can be overridden per-model. `id`
 * is intentionally excluded because it is the primary key being changed.
 */
export type ModelOverride = Omit<Partial<ModelCapability>, 'id'>;

/**
 * Optional multi-mode scoping. Left as a bare string union rather than an
 * enum so future modes (`plan`, `act`, `test`, ...) can be added without
 * churning every call site.
 */
export type OverrideMode = string;

const DEFAULT_MODE: OverrideMode = 'default';

/**
 * Accumulator for pending-but-uncommitted model-capability overrides.
 *
 * Semantics:
 *   - {@link stage} records overrides to be applied to a specific model id.
 *   - {@link renameModelId} recommits any staged overrides from the old id
 *     to the new id (upstream's core fix) and marks the new id as the
 *     in-flight commit target so subsequent edits during commit land on
 *     the new id, not the stale old id.
 *   - {@link stageWhileCommitting} is the round-trip-race-safe variant
 *     used by interactive editors: if a rename is in flight, edits are
 *     routed to the pending id automatically.
 *   - {@link drain} returns and clears the pending map so the caller can
 *     merge it into `RoutingConfig.models` and persist.
 */
export class PendingOverridesStore {
  private readonly modes = new Map<OverrideMode, Map<string, ModelOverride>>();
  /** Per-mode in-flight rename target: oldId -> newId. */
  private readonly committing = new Map<OverrideMode, { oldId: string; newId: string }>();

  private bucket(mode: OverrideMode): Map<string, ModelOverride> {
    let m = this.modes.get(mode);
    if (!m) {
      m = new Map();
      this.modes.set(mode, m);
    }
    return m;
  }

  /**
   * Stage overrides under an explicit model id. Merges with any existing
   * staged overrides for that id (last-write-wins per field).
   */
  stage(modelId: string, overrides: ModelOverride, mode: OverrideMode = DEFAULT_MODE): void {
    if (!modelId) {
      throw new Error('PendingOverridesStore.stage: modelId is required');
    }
    const b = this.bucket(mode);
    const prev = b.get(modelId) ?? {};
    b.set(modelId, { ...prev, ...overrides });
  }

  /**
   * Stage overrides while a rename might be in flight. If a rename target
   * is active for {@link modelId} (i.e. {@link renameModelId} was called
   * with oldId === modelId), the edit is applied to the new id instead.
   *
   * This is the race-safe entry point for interactive editors. Callers
   * that are certain no rename is in flight can use {@link stage}
   * directly.
   */
  stageWhileCommitting(
    modelId: string,
    overrides: ModelOverride,
    mode: OverrideMode = DEFAULT_MODE
  ): string {
    const inflight = this.committing.get(mode);
    const targetId = inflight && inflight.oldId === modelId ? inflight.newId : modelId;
    this.stage(targetId, overrides, mode);
    return targetId;
  }

  /**
   * Recommit staged overrides from {@link oldId} to {@link newId}.
   *
   * This is the core fix for issue #1175: previously-displayed metadata
   * (pricing, maxTokens, costTier, strengths, reasoning, cache support)
   * MUST be carried forward when the primary key changes. Without this
   * step the new id resolves to catalog defaults and silently loses
   * custom pricing.
   *
   * Also marks {@link newId} as the in-flight rename target so
   * concurrent edits via {@link stageWhileCommitting} land on the new
   * id, not the stale old one being read back from disk.
   *
   * If {@link oldId} === {@link newId} this is a no-op.
   */
  renameModelId(oldId: string, newId: string, mode: OverrideMode = DEFAULT_MODE): void {
    if (!oldId || !newId) {
      throw new Error('PendingOverridesStore.renameModelId: oldId and newId are required');
    }
    if (oldId === newId) {
      return;
    }
    const b = this.bucket(mode);
    const carried = b.get(oldId);
    if (carried) {
      // Merge with any overrides already staged directly on newId; the
      // carried-over values win because they represent the user's most
      // recent displayed metadata.
      const existing = b.get(newId) ?? {};
      b.set(newId, { ...existing, ...carried });
      b.delete(oldId);
    }
    this.committing.set(mode, { oldId, newId });
  }

  /**
   * Mark a rename as complete. Clears the in-flight state for {@link mode}
   * so subsequent edits target the model id directly.
   */
  finishCommit(mode: OverrideMode = DEFAULT_MODE): void {
    this.committing.delete(mode);
  }

  /**
   * Return the currently in-flight rename target for {@link mode}, if any.
   * Primarily useful for tests and for editor UIs that want to reflect
   * commit state.
   */
  getCommitting(mode: OverrideMode = DEFAULT_MODE): { oldId: string; newId: string } | null {
    return this.committing.get(mode) ?? null;
  }

  /**
   * Read staged overrides for a given model id without draining them.
   */
  get(modelId: string, mode: OverrideMode = DEFAULT_MODE): ModelOverride | undefined {
    return this.modes.get(mode)?.get(modelId);
  }

  /**
   * Return and clear the staged overrides for {@link mode}. Callers pass
   * the returned map to {@link applyPendingOverrides} to merge into the
   * routing-config models array before persisting.
   */
  drain(mode: OverrideMode = DEFAULT_MODE): Map<string, ModelOverride> {
    const b = this.modes.get(mode);
    if (!b) {
      return new Map();
    }
    this.modes.delete(mode);
    this.committing.delete(mode);
    return b;
  }

  /**
   * Discard all staged state. Primarily used by tests.
   */
  clear(): void {
    this.modes.clear();
    this.committing.clear();
  }
}

/**
 * Merge a pending-overrides map into an array of {@link ModelCapability}.
 *
 * - Overrides for an existing id patch that entry (last-write-wins per
 *   field).
 * - Overrides for an unknown id are appended IF they carry enough
 *   information to build a full ModelCapability (id + type + costTier +
 *   strengths + maxTokens + reasoning). Otherwise they are skipped and
 *   surfaced via the returned `unresolved` list so the caller can decide
 *   whether to warn the user or drop them.
 *
 * The input array is not mutated.
 */
export function applyPendingOverrides(
  models: ModelCapability[],
  pending: Map<string, ModelOverride>
): { models: ModelCapability[]; unresolved: string[] } {
  const byId = new Map(models.map((m) => [m.id, m] as const));
  const unresolved: string[] = [];

  for (const [id, override] of pending) {
    const existing = byId.get(id);
    if (existing) {
      byId.set(id, { ...existing, ...override, id });
      continue;
    }

    if (isCompleteModelCapability(id, override)) {
      byId.set(id, { ...(override as ModelCapability), id });
    } else {
      unresolved.push(id);
    }
  }

  return { models: Array.from(byId.values()), unresolved };
}

function isCompleteModelCapability(id: string, override: ModelOverride): boolean {
  return (
    !!id &&
    typeof override.type === 'string' &&
    typeof override.costTier === 'string' &&
    Array.isArray(override.strengths) &&
    typeof override.maxTokens === 'number' &&
    typeof override.reasoning === 'boolean'
  );
}
