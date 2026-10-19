/**
 * Permission Provenance (upstream opencode v1.17.13 parity)
 *
 * Records *why* a tool call was auto-approved or denied so the UI can
 * explain the decision to the user, and so enterprise audits can trace
 * which rule / rule-source made the call.
 *
 * Aligns with upstream `packages/opencode/src/kilocode/permission/provenance.ts`.
 * Critical for SAP AI Core enterprise compliance auditing where every
 * permission decision needs a paper trail.
 */

import type { PermissionRule } from './index.js';

/**
 * One entry in a provenance edit trail. Records *what* changed about the
 * underlying `PermissionRule` and *when*, so an audit reviewer can
 * reconstruct the rule's history after the fact.
 *
 * `timestamp` is a Unix epoch (ms) so it compares cheaply and sorts in
 * natural order; `formatProvenanceMessage` converts it to a human-readable
 * ISO string for display.
 *
 * `changes` carries ONLY the delta applied in this edit — not the full
 * post-edit rule — to keep the audit record compact and to make it
 * obvious which field was touched. A rule rename shows as
 * `{ name: 'new-name' }`, a scope adjustment as `{ paths: [...] }`, etc.
 *
 * `reason` is an optional free-text explanation supplied by the user
 * (e.g. "typo fix", "narrowed scope after security review"). Omitting
 * it is fine; the timestamp alone is still auditable.
 */
export interface PermissionEditRecord {
  timestamp: number;
  changes: Partial<PermissionRule>;
  reason?: string;
}

export interface PermissionProvenance {
  decision: 'allow' | 'deny' | 'ask';
  ruleSource: 'config' | 'session' | 'agent' | 'sandbox' | 'default';
  ruleId?: string;
  ruleDescription?: string;
  matchedPattern?: string;
  reason?: string;
  /**
   * Unix epoch (ms) of the most recent edit to the underlying rule.
   * Mirrors `editHistory[editHistory.length - 1].timestamp` when
   * `editHistory` is present; included as a top-level field so consumers
   * that only care about "has this rule been modified since creation?"
   * do not need to walk the full history array.
   */
  editedAt?: number;
  /**
   * Chronological trail of edits applied to the underlying rule. Each
   * entry records a delta against the pre-edit rule plus optional
   * operator rationale. Entries are append-only and ordered oldest-first;
   * see {@link appendEditHistory} for the canonical mutation path.
   */
  editHistory?: PermissionEditRecord[];
}

const denialStore = new Map<string, PermissionProvenance>();

/**
 * Record the provenance of a permission denial keyed by tool-call id.
 * The store is process-local and unbounded; callers that live inside a
 * long-running server should call {@link clearDenialStore} on session
 * teardown to avoid slow growth.
 */
export function recordDenial(toolCallId: string, provenance: PermissionProvenance): void {
  denialStore.set(toolCallId, provenance);
}

/**
 * Retrieve the recorded provenance for a tool-call id, if any.
 */
export function getDenialProvenance(toolCallId: string): PermissionProvenance | undefined {
  return denialStore.get(toolCallId);
}

/**
 * Format a provenance record into a single human-readable line. Used by
 * the TUI to render "why was this denied?" alongside the denied call.
 *
 * When `editHistory` is present the line is augmented with the edit count
 * and the ISO timestamp of the most recent edit, so audit reviewers can
 * see at a glance that the rule has been modified since it was created.
 */
export function formatProvenanceMessage(p: PermissionProvenance): string {
  const editSuffix = buildEditSuffix(p);
  if (p.decision === 'deny') {
    return `Denied by ${p.ruleSource} rule${p.ruleId ? ` "${p.ruleId}"` : ''}${
      p.reason ? `: ${p.reason}` : ''
    }${editSuffix}`;
  }
  if (p.decision === 'allow') {
    return `Auto-approved by ${p.ruleSource}${
      p.matchedPattern ? ` (matched ${p.matchedPattern})` : ''
    }${editSuffix}`;
  }
  return `Awaiting approval${editSuffix}`;
}

/**
 * Build the "(edited N time(s), last YYYY-...)" suffix appended to a
 * provenance line. Returns an empty string when the rule has never been
 * edited so the common un-edited path renders exactly as before.
 */
function buildEditSuffix(p: PermissionProvenance): string {
  const history = p.editHistory;
  if (!history || history.length === 0) {
    return '';
  }
  const count = history.length;
  const latest = p.editedAt ?? history[history.length - 1].timestamp;
  const noun = count === 1 ? 'time' : 'times';
  return ` (edited ${count} ${noun}, last ${new Date(latest).toISOString()})`;
}

/**
 * Append an edit record to a provenance's audit trail and refresh the
 * top-level `editedAt` pointer. Returns a NEW `PermissionProvenance`
 * object so callers can treat provenance records as immutable snapshots
 * (the input is not mutated).
 *
 * This is the canonical mutation path used by `src/permission/editor.ts`
 * — centralising the push + `editedAt` sync here guarantees the two
 * fields never drift out of agreement under concurrent edits.
 *
 * `timestamp` defaults to `Date.now()`; it is overridable for tests and
 * for callers that need to carry a replayed timestamp from an external
 * audit log.
 */
export function appendEditHistory(
  provenance: PermissionProvenance,
  changes: Partial<PermissionRule>,
  reason?: string,
  timestamp: number = Date.now()
): PermissionProvenance {
  const record: PermissionEditRecord = reason
    ? { timestamp, changes, reason }
    : { timestamp, changes };
  const existing = provenance.editHistory ?? [];
  return {
    ...provenance,
    editedAt: timestamp,
    editHistory: [...existing, record],
  };
}

/**
 * Clear all recorded denials. Intended for session teardown and tests.
 */
export function clearDenialStore(): void {
  denialStore.clear();
}
