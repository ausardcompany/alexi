/**
 * Managed-configuration policy resolution.
 *
 * Ports the opencode fixes #55267 ("managed config has highest precedence")
 * and #55297 ("promote experimental.policies to top-level policies") into a
 * single, pure module so Alexi's config pipeline — regardless of which layer
 * (user config, project overlay, macOS MDM preferences) is loading it — can
 * route policy data through one well-defined place.
 *
 * Two problems are solved here:
 *
 *   1. **Policy source back-compat.** Upstream promoted
 *      `experimental.policies` to a top-level `policies` field. Alexi must
 *      accept BOTH shapes during the migration window: existing deployments
 *      still ship `experimental.policies` in their routing/config JSON, but
 *      new tooling will emit `policies` directly. `mergePolicies` reads
 *      either, preferring the new path when both are present on the same
 *      document, and preserves later-wins semantics across documents.
 *
 *   2. **Managed-config precedence.** On managed Macs (and in SAP enterprise
 *      deployments where IT administrators push settings via MDM), the
 *      previous behaviour sat managed config at the LOWEST priority, which
 *      meant any user config override could sidestep an administrator policy.
 *      `applyManagedPrecedence` re-orders a list of config documents so
 *      managed sources load LAST (so their settings win), while splitting
 *      their policies off into a separate FIRST-loaded list — because
 *      policy evaluation is reverse-load-order, managed policies then retain
 *      final authority.
 *
 * This module is deliberately pure and schema-agnostic: it works on
 * minimal `ConfigDocument` records (path + info bag) so it can slot into
 * whichever concrete config loader Alexi grows next. No I/O, no Effect
 * runtime, no SAP AI Core credential handling — those remain in the
 * provider layer.
 */

/**
 * One normalised policy entry. Policies are opaque records as far as this
 * module is concerned: the enforcer (`src/tool/index.ts` policy enforcer)
 * is responsible for interpreting individual fields.
 */
export type Policy = Readonly<Record<string, unknown>>;

/**
 * A single document loaded by the config pipeline. `info` is the parsed
 * JSON body; we only touch `policies` and `experimental.policies` here.
 */
export interface ConfigDocument {
  readonly path: string;
  readonly info: {
    readonly policies?: readonly Policy[];
    readonly experimental?: {
      readonly policies?: readonly Policy[];
      readonly [key: string]: unknown;
    };
    readonly [key: string]: unknown;
  };
}

/**
 * Mark whether a loaded document was managed (MDM, system directory) so
 * {@link applyManagedPrecedence} can split them out. Alexi's current
 * loaders can tag their output with this flag; existing non-managed
 * sources are simply left as `managed: false` and keep their original
 * precedence.
 */
export interface TaggedConfigDocument extends ConfigDocument {
  readonly managed?: boolean;
}

/**
 * Merge the `policies` field across a list of documents, accepting both the
 * new top-level `policies` and the legacy `experimental.policies` shape.
 *
 * Later sources win within a document — i.e. if both are set on the same
 * document, the top-level `policies` field is preferred. Across documents
 * the ordering of the input array is preserved; the caller controls
 * precedence by controlling that order.
 *
 * This is the single source of truth for the `experimental.policies` →
 * `policies` migration path. Any new code reading policies should route
 * through here instead of touching `info.experimental?.policies` directly.
 */
export function mergePolicies(documents: readonly ConfigDocument[]): readonly Policy[] {
  const out: Policy[] = [];
  for (const doc of documents) {
    // Prefer the new top-level `policies`; fall back to the legacy path.
    const policies = doc.info.policies ?? doc.info.experimental?.policies;
    if (policies && policies.length > 0) {
      out.push(...policies);
    }
  }
  return out;
}

/**
 * Reorder a list of config documents so managed documents (MDM + system
 * directory) load LAST, giving their non-policy settings final authority,
 * while splitting their policies off into a separate FIRST-loaded list.
 *
 * Why the split? Alexi's policy evaluator processes policies in
 * reverse-load order (later-loaded policies run first), so to make managed
 * policies run LAST (= final authority), they have to be loaded FIRST.
 * Non-policy settings use normal later-wins ordering, so they stay in
 * their managed-loads-last position.
 *
 * Returns:
 *   - `managedPolicies`: documents containing ONLY the policy data from
 *     managed sources, intended to be prepended to the final load order.
 *   - `managedSettings`: the managed documents stripped of their policy
 *     data, intended to be appended to the final load order.
 *   - `userDocuments`: the input documents that were NOT tagged as
 *     managed, returned in input order.
 *
 * Final composed order is therefore:
 *   `[...managedPolicies, ...userDocuments, ...managedSettings]`
 */
export function applyManagedPrecedence(documents: readonly TaggedConfigDocument[]): {
  readonly managedPolicies: readonly ConfigDocument[];
  readonly userDocuments: readonly TaggedConfigDocument[];
  readonly managedSettings: readonly ConfigDocument[];
} {
  const managed = documents.filter((d) => d.managed === true);
  const userDocuments = documents.filter((d) => d.managed !== true);

  // Pull out only the policy data from each managed document, keeping them in
  // reverse of their load order so the LAST-loaded managed source carries the
  // FINAL say (because the policy evaluator processes in reverse-load order).
  const managedPolicies: ConfigDocument[] = [];
  for (const doc of [...managed].reverse()) {
    const policies = doc.info.policies ?? doc.info.experimental?.policies;
    if (policies && policies.length > 0) {
      managedPolicies.push({
        path: doc.path,
        info: { policies },
      });
    }
  }

  // Strip the policy data off the managed-settings documents so they only
  // contribute non-policy settings when loaded LAST.
  const managedSettings: ConfigDocument[] = managed.map((doc) => {
    const {
      policies: _p1,
      experimental,
      ...rest
    } = doc.info as {
      policies?: readonly Policy[];
      experimental?: { policies?: readonly Policy[]; [key: string]: unknown };
      [key: string]: unknown;
    };
    const trimmedExperimental =
      experimental !== undefined
        ? Object.fromEntries(Object.entries(experimental).filter(([key]) => key !== 'policies'))
        : undefined;
    return {
      path: doc.path,
      info: {
        ...rest,
        ...(trimmedExperimental !== undefined && Object.keys(trimmedExperimental).length > 0
          ? { experimental: trimmedExperimental }
          : {}),
      },
    };
  });

  return { managedPolicies, userDocuments, managedSettings };
}

/**
 * Convenience: produce the final effective policy list from a tagged
 * document stream, applying both the policy-source back-compat merge AND
 * the managed-precedence reorder in one shot. Callers that just want the
 * resolved policy list (not the reordered documents) use this.
 */
export function resolvePoliciesWithPrecedence(
  documents: readonly TaggedConfigDocument[]
): readonly Policy[] {
  const { managedPolicies, userDocuments, managedSettings } = applyManagedPrecedence(documents);
  return mergePolicies([...managedPolicies, ...userDocuments, ...managedSettings]);
}
