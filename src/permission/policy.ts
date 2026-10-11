/**
 * Managed integration / tool / skill policy enforcement.
 *
 * Ports upstream opencode commits 613ef8ba and d016db85 (2026-10): allow
 * organisations deploying Alexi (e.g. SAP IT security) to centrally
 * disable specific tools, integrations, or skills via a configuration
 * surface. Enterprise SAP installations need this to lock down what
 * agents can do (no shell, no network egress, no custom skills, etc.)
 * without maintaining a fork.
 *
 * Semantics:
 *   - If neither `allowed` nor `denied` is set for a category, everything
 *     is permitted (open-world default — matches current Alexi behaviour).
 *   - `denied` is checked first: anything on it is rejected regardless of
 *     `allowed`.
 *   - If `allowed` is set, membership is required (closed-world).
 */

import { z } from 'zod';

const ListSchema = z
  .object({
    allowed: z.array(z.string()).optional(),
    denied: z.array(z.string()).optional(),
  })
  .optional();

export const ManagedPolicySchema = z.object({
  tools: ListSchema,
  integrations: ListSchema,
  skills: ListSchema,
});

export type ManagedPolicy = z.infer<typeof ManagedPolicySchema>;

/**
 * Enforcer wrapper so call sites can ask yes/no questions without
 * repeatedly destructuring the config. Treat as an immutable value:
 * swap the whole instance (not the backing policy) when operator
 * configuration changes mid-session.
 */
export class PolicyEnforcer {
  constructor(private readonly policy: ManagedPolicy = {}) {}

  private check(
    name: string,
    list: { allowed?: string[]; denied?: string[] } | undefined
  ): boolean {
    if (!list) {
      return true;
    }
    if (list.denied?.includes(name)) {
      return false;
    }
    if (list.allowed && !list.allowed.includes(name)) {
      return false;
    }
    return true;
  }

  isToolAllowed(name: string): boolean {
    return this.check(name, this.policy.tools);
  }

  isIntegrationAllowed(id: string): boolean {
    return this.check(id, this.policy.integrations);
  }

  isSkillAllowed(name: string): boolean {
    return this.check(name, this.policy.skills);
  }

  /** Expose the raw policy for diagnostics / `/debug config`. */
  snapshot(): ManagedPolicy {
    return this.policy;
  }
}

/** Default enforcer with no restrictions. */
export const DEFAULT_POLICY_ENFORCER = new PolicyEnforcer();
