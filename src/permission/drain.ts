/**
 * Permission Drain Utility
 * Auto-resolve pending permissions now fully covered by approved or denied rules.
 * When the user approves/denies a rule on subagent A, sibling subagent B's
 * pending permission for the same pattern resolves or rejects automatically.
 * 
 * Also handles stale permission request cleanup to prevent stuck approvals.
 */

import { matchesPattern } from './next.js';
import { ConfigProtection } from './config-paths.js';

/**
 * Permission request tracking for stale cleanup
 */
export interface PermissionRequest {
  id: string;
  createdAt: number;
  tool: string;
  params: unknown;
}

/**
 * Permission Drain Manager
 * Handles cleanup of stale permission requests
 */
export class PermissionDrain {
  private pendingRequests: Map<string, PermissionRequest> = new Map();
  private readonly STALE_THRESHOLD_MS = 5 * 60 * 1000; // 5 minutes
  private drainInterval: NodeJS.Timeout | null = null;

  addRequest(request: PermissionRequest): void {
    this.pendingRequests.set(request.id, request);
  }

  removeRequest(id: string): void {
    this.pendingRequests.delete(id);
  }

  /**
   * Drain stale requests to prevent stuck approvals
   */
  drainStale(): void {
    const now = Date.now();

    for (const [id, request] of this.pendingRequests) {
      if (now - request.createdAt > this.STALE_THRESHOLD_MS) {
        this.pendingRequests.delete(id);
        console.warn(`Drained stale permission request: ${id}`);
      }
    }
  }

  /**
   * Start periodic drain loop
   */
  startDrainLoop(): void {
    if (this.drainInterval) {
      return;
    }

    this.drainInterval = setInterval(() => {
      this.drainStale();
    }, 60 * 1000); // Run every minute
  }

  /**
   * Stop periodic drain loop
   */
  stopDrainLoop(): void {
    if (this.drainInterval) {
      clearInterval(this.drainInterval);
      this.drainInterval = null;
    }
  }

  /**
   * Get count of pending requests
   */
  getPendingCount(): number {
    return this.pendingRequests.size;
  }
}

/**
 * Auto-resolve pending permissions now fully covered by approved or denied rules.
 * When the user approves/denies a rule on subagent A, sibling subagent B's
 * pending permission for the same pattern resolves or rejects automatically.
 */
export async function drainCovered(
  pending: Record<
    string,
    {
      info: {
        id: string;
        sessionID: string;
        permission: string;
        patterns: string[];
      };
      ruleset: Array<{ permission: string; pattern: string; action: string }>;
      resolve: () => void;
      reject: (e: any) => void;
    }
  >,
  approved: Array<{ permission: string; pattern: string; action: string }>,
  evaluate: (
    permission: string,
    pattern: string,
    ruleset: Array<{ permission: string; pattern: string; action: string }>,
    approved: Array<{ permission: string; pattern: string; action: string }>
  ) => { action: string },
  events: { Replied: string },
  DeniedError: new (rules: any[]) => Error,
  exclude?: string
): Promise<void> {
  for (const [id, entry] of Object.entries(pending)) {
    // Skip the permission request that triggered this drain
    if (id === exclude) {
      continue;
    }

    // Never auto-resolve config file edit permissions
    if (ConfigProtection.isRequest(entry.info)) {
      continue;
    }

    // Evaluate all patterns in this pending request against current rules
    const actions = entry.info.patterns.map((pattern) =>
      evaluate(entry.info.permission, pattern, entry.ruleset, approved)
    );

    const denied = actions.some((r) => r.action === 'deny');
    const allowed = !denied && actions.every((r) => r.action === 'allow');

    // Only process if fully resolved (all allowed or any denied)
    if (!denied && !allowed) {
      continue;
    }

    // Remove from pending
    delete pending[id];

    if (denied) {
      // Publish rejection event
      // Note: In Alexi, we would use the bus system here
      // Bus.publish(events.Replied, {
      //   sessionID: entry.info.sessionID,
      //   requestID: entry.info.id,
      //   reply: "reject",
      // })

      // Filter rules that match this permission
      const matchingRules = approved.filter((r) =>
        matchesPattern(r.permission, entry.info.permission)
      );

      entry.reject(new DeniedError(matchingRules));
    } else {
      // Publish approval event
      // Note: In Alexi, we would use the bus system here
      // Bus.publish(events.Replied, {
      //   sessionID: entry.info.sessionID,
      //   requestID: entry.info.id,
      //   reply: "approve",
      // })

      entry.resolve();
    }
  }
}
