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

export interface PermissionProvenance {
  decision: 'allow' | 'deny' | 'ask';
  ruleSource: 'config' | 'session' | 'agent' | 'sandbox' | 'default';
  ruleId?: string;
  ruleDescription?: string;
  matchedPattern?: string;
  reason?: string;
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
 */
export function formatProvenanceMessage(p: PermissionProvenance): string {
  if (p.decision === 'deny') {
    return `Denied by ${p.ruleSource} rule${p.ruleId ? ` "${p.ruleId}"` : ''}${
      p.reason ? `: ${p.reason}` : ''
    }`;
  }
  if (p.decision === 'allow') {
    return `Auto-approved by ${p.ruleSource}${
      p.matchedPattern ? ` (matched ${p.matchedPattern})` : ''
    }`;
  }
  return 'Awaiting approval';
}

/**
 * Clear all recorded denials. Intended for session teardown and tests.
 */
export function clearDenialStore(): void {
  denialStore.clear();
}
