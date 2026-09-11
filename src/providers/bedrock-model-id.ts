/**
 * Amazon Bedrock model-id resolution helper.
 *
 * Ports opencode commit `ac1758c`:
 *   1. Treat ARN model IDs (`arn:aws:bedrock:...`) as pre-resolved and
 *      pass them through verbatim. Callers that pin a specific Bedrock
 *      inference profile by ARN must not have a cross-region prefix
 *      injected in front of it — that produces a malformed ARN and
 *      Bedrock rejects the request.
 *   2. Only `deepseek.r1` requires the `us.` cross-region prefix in
 *      us-* regions. Newer variants (e.g. `deepseek.v3.2`) are available
 *      as region-local models and MUST NOT be prefixed.
 *
 * Alexi does not ship a native Bedrock provider yet, but SAP AI Core
 * transparently proxies Anthropic-on-Bedrock and other Bedrock-backed
 * deployments (see `providers/transform.ts` comments referencing
 * `aicore-bedrock-*`). This helper is exported so any future direct
 * Bedrock integration or SAP AI Core deployment mapping code can use a
 * single, tested classifier instead of re-deriving the prefix rules.
 */

/**
 * Return the effective Bedrock model id given the caller's requested id
 * and target region. Idempotent: passing an already-resolved id yields
 * the same id back.
 *
 * @param modelID - The requested Bedrock model id (short form, cross-
 *                  region form, or ARN).
 * @param region  - AWS region (`us-east-1`, `eu-west-1`, ...). If
 *                  omitted, defaults to `us-east-1` for parity with
 *                  upstream.
 */
export function resolveBedrockModelID(modelID: string, region: string | undefined): string {
  // 1. ARN model IDs are pre-resolved — pass through unchanged. Injecting
  //    a `us.`/`eu.`/... prefix in front of an `arn:` string produces a
  //    malformed ARN that Bedrock rejects.
  if (modelID.startsWith('arn:')) {
    return modelID;
  }

  // 2. Explicit cross-region prefix already present — respect it.
  const crossRegionPrefixes = ['global.', 'us.', 'eu.', 'jp.', 'apac.', 'au.'];
  if (crossRegionPrefixes.some((p) => modelID.startsWith(p))) {
    return modelID;
  }

  const resolvedRegion = region ?? 'us-east-1';
  const regionPrefix = resolvedRegion.split('-')[0];

  if (regionPrefix === 'us') {
    // Only `deepseek.r1` requires the `us.` prefix; `deepseek.v3.2` and
    // newer variants are region-local. Match the family bases exactly
    // so we don't accidentally hit e.g. `deepseek-v3.2`.
    const requiresPrefix = [
      'nova-micro',
      'nova-lite',
      'nova-pro',
      'nova-premier',
      'nova-2',
      'claude',
      // DeepSeek: r1 needs the prefix, everything else does NOT. Match
      // `deepseek.r1` as a distinct token, and `deepseek-r1` for the
      // dashed variant some SDKs surface.
      'deepseek.r1',
      'deepseek-r1',
    ].some((item) => modelID.includes(item));

    if (requiresPrefix && !resolvedRegion.startsWith('us-gov')) {
      return `${regionPrefix}.${modelID}`;
    }
    return modelID;
  }

  // Other regions: no automatic prefixing. Callers wanting cross-region
  // inference must set the prefix explicitly (handled by the early
  // return above).
  return modelID;
}
