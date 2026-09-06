/**
 * GitLab AI provider reasoning-variant transform.
 *
 * Port of opencode's `packages/opencode/src/provider/transform.ts` reasoning
 * branch, added alongside the `gitlab-ai-provider` bump 6.13.0 → 6.14.0. The
 * upstream change wires reasoning-capable GitLab models (e.g. Claude routed
 * through GitLab's Duo endpoints in reasoning mode) so downstream code does
 * not drop or misroute them.
 *
 * Alexi has no live GitLab provider today — this module exists as a
 * forward-compatible transform helper so that when/if GitLab is added to
 * Alexi's router, the reasoning-variant detection is already in place and
 * mirrors upstream behaviour. The transform is intentionally SAP-safe: any
 * `sapDeploymentId` hint present on the raw model is preserved verbatim so
 * a SAP AI Core deployment routed via a GitLab-shaped id would still land
 * on the correct SAP endpoint.
 *
 * @see docs/PROVIDERS.md for the wider provider matrix
 * @see src/providers/reasoning.ts for the actual reasoning parameter emitter
 */

/**
 * Minimal structural shape for a raw GitLab AI model descriptor as returned
 * by the `gitlab-ai-provider` catalogue. Kept local so this module has no
 * runtime dependency on the package (which Alexi does not yet install).
 *
 * `capabilities` is an optional string array — upstream tags reasoning
 * variants either by suffixing `-reasoning` on the id OR by listing
 * `"reasoning"` in the capabilities array. Both are accepted here.
 */
export interface RawGitlabModel {
  id: string;
  capabilities?: readonly string[];
  /**
   * Optional SAP AI Core deployment hint. When present, the transformed
   * model retains this field so SAP-routed models can still be dispatched
   * by `getProviderForModel` downstream.
   */
  sapDeploymentId?: string;
}

/**
 * Reasoning flag block on the transformed model. Kept as an object (rather
 * than a boolean) so future upstream additions (`budget`, `effort`, etc.)
 * can extend this shape without a breaking rename.
 */
export interface GitlabReasoningFlag {
  enabled: true;
}

/**
 * Transformed GitLab model shape consumed by Alexi's router. Matches the
 * upstream opencode return type on the fields Alexi cares about.
 */
export interface GitlabModel {
  id: string;
  /**
   * Present only when the raw model advertised reasoning support (either
   * via id suffix or a `"reasoning"` capability). Absent otherwise so
   * downstream code can use a simple `model.reasoning?.enabled` check.
   */
  reasoning?: GitlabReasoningFlag;
  /** Preserved from the raw model when present — SAP AI Core routing hint. */
  sapDeploymentId?: string;
}

/**
 * Transform a raw GitLab AI model descriptor into Alexi's internal shape.
 *
 * Reasoning detection is a logical OR of two signals:
 *   1. The model id contains the substring `reasoning` (case-sensitive to
 *      match upstream — GitLab does not lowercase model ids on the wire).
 *   2. The `capabilities` array (when present) includes the exact string
 *      `"reasoning"`.
 *
 * SAP AI Core routing hints (`sapDeploymentId`) pass through untouched so
 * this transform does not accidentally break SAP-routed GitLab deployments
 * if they are ever added to `routing-config.json`.
 *
 * @param model - The raw GitLab model descriptor
 * @returns A GitlabModel with reasoning flag set when detected
 */
export function transformGitlabModel(model: RawGitlabModel): GitlabModel {
  const isReasoning =
    model.id.includes('reasoning') || (model.capabilities?.includes('reasoning') ?? false);

  const out: GitlabModel = {
    id: model.id,
  };

  if (isReasoning) {
    out.reasoning = { enabled: true };
  }

  if (model.sapDeploymentId) {
    out.sapDeploymentId = model.sapDeploymentId;
  }

  return out;
}
