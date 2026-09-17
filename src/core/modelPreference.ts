/**
 * Session Model Preferences
 *
 * Alexi_change (upstream kilocode `dd2f2f9a9` "default model not persistent
 * after explicit user choice" + `50f7d01ad` "preserve effort intent and
 * live session defaults"): tracks per-session model / effort choices with
 * a `source` intent field so an explicit user selection is never silently
 * overwritten by config defaults on subsequent turns.
 *
 * The bug shape upstream fixed:
 *
 *   session.model = config.defaultModel  // unconditional; overwrites user choice
 *
 * The fix: track WHY a preference was set, and refuse to downgrade a
 * `"user-explicit"` choice to a `"default"` on merges. For Alexi this is
 * particularly important because routing is JSON-driven — a config
 * reload should not silently regress a user who picked a specific SAP
 * AI Core deployment for the current session.
 */

import type { EffortLevel } from './effortLevel.js';

/**
 * Provenance of a preference value. Used to decide whether an incoming
 * update is allowed to overwrite the current value:
 *
 *   - `"user-explicit"`: the user picked this via `/model`, a CLI flag,
 *     the TUI model picker, or an equivalent explicit affordance. Only
 *     another `"user-explicit"` update may overwrite.
 *   - `"inherited"`: forwarded from a parent session (subagent handoff,
 *     resumed session). Behaves like `"user-explicit"` for the purposes
 *     of defaults — a parent's explicit choice is respected downstream.
 *   - `"default"`: derived from `routing-config.json` / `AICORE_MODEL`
 *     / the built-in default. Freely overwritten by any incoming update.
 */
export type SessionModelPreferenceSource = 'user-explicit' | 'default' | 'inherited';

export interface SessionModelPreference {
  modelID: string;
  providerID: string;
  reasoningEffort?: EffortLevel;
  source: SessionModelPreferenceSource;
}

/**
 * Reconcile the current session preference with an incoming update and
 * a config default. Returns the preference that should be persisted on
 * the session.
 *
 * Rules:
 *   1. When the current preference is `"user-explicit"` (or `"inherited"`,
 *      which we treat as explicit for override purposes) and the incoming
 *      update is NOT explicit, the current model/provider are preserved.
 *      Non-conflicting hints on the incoming payload (a fresh
 *      `reasoningEffort`) are merged in so `/effort high` still works
 *      without picking a new model.
 *   2. Otherwise fall back to the incoming values, then to the config
 *      default. This preserves the classical "config wins over nothing"
 *      behaviour for brand-new sessions.
 *
 * The function is pure: it never mutates its arguments and the return
 * value is safe to persist directly.
 */
export function resolveSessionModelPreference(
  current: SessionModelPreference | undefined,
  incoming: Partial<SessionModelPreference> | undefined,
  configDefault: SessionModelPreference
): SessionModelPreference {
  const isCurrentExplicit = current?.source === 'user-explicit' || current?.source === 'inherited';
  const isIncomingExplicit = incoming?.source === 'user-explicit';

  // Rule 1: user's explicit choice survives incoming non-explicit updates.
  if (current && isCurrentExplicit && !isIncomingExplicit) {
    return {
      modelID: current.modelID,
      providerID: current.providerID,
      // Effort intent is intentionally the ONE field an incoming
      // non-explicit update may refresh — a user typing `/effort high`
      // mid-session must not need to re-pick their model. If the
      // incoming payload omits it, keep the current value (upstream
      // kilocode `50f7d01ad` "preserve effort intent").
      reasoningEffort: incoming?.reasoningEffort ?? current.reasoningEffort,
      source: current.source,
    };
  }

  // Rule 2: incoming → default.
  return {
    modelID: incoming?.modelID ?? configDefault.modelID,
    providerID: incoming?.providerID ?? configDefault.providerID,
    reasoningEffort: incoming?.reasoningEffort ?? configDefault.reasoningEffort,
    source: incoming?.source ?? configDefault.source ?? 'default',
  };
}

/**
 * Construct a preference explicitly attributed to the user. Callers that
 * process a `/model <id>` command, a `--model` CLI flag, or a TUI
 * model-picker selection should route through this helper so the
 * `source` field is set correctly and the persistence guard above kicks
 * in on the next reconciliation.
 */
export function userExplicitPreference(
  modelID: string,
  providerID: string,
  reasoningEffort?: EffortLevel
): SessionModelPreference {
  return { modelID, providerID, reasoningEffort, source: 'user-explicit' };
}

/**
 * Construct a preference derived from configuration (routing-config,
 * `AICORE_MODEL`, built-in defaults). These preferences are freely
 * overwritten by any incoming update, matching the pre-fix behaviour
 * for brand-new sessions.
 */
export function defaultPreference(
  modelID: string,
  providerID: string,
  reasoningEffort?: EffortLevel
): SessionModelPreference {
  return { modelID, providerID, reasoningEffort, source: 'default' };
}

/**
 * Migration helper for on-disk preferences persisted before the
 * `source` field existed. To avoid silently downgrading a user's saved
 * model choice to `"default"` (which would then be overwritten on the
 * next config reload), we assume legacy entries were explicit — the
 * conservative choice.
 *
 * Callers that hydrate a session from disk should route the raw JSON
 * through this migrator before handing it to
 * {@link resolveSessionModelPreference}.
 */
export function migrateLegacyPreference(
  raw: Partial<SessionModelPreference> & { modelID: string; providerID: string }
): SessionModelPreference {
  return {
    modelID: raw.modelID,
    providerID: raw.providerID,
    reasoningEffort: raw.reasoningEffort,
    // Legacy entries had no source field — treat them as explicit user
    // choices so the persistence guard protects them.
    source: raw.source ?? 'user-explicit',
  };
}
