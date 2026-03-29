/**
 * Permission Drain Utility
 * Auto-resolve pending permissions now fully covered by approved or denied rules.
 * When the user approves/denies a rule on subagent A, sibling subagent B's
 * pending permission for the same pattern resolves or rejects automatically.
 * Enhanced with config file protection.
 */

import { matchesPattern } from './next.js';
import { ConfigProtection } from './config-paths.js';

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
