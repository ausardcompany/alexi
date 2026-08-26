/**
 * Agent Manager Models — companion discovery-tool metadata.
 *
 * This file mirrors the upstream opencode `agent-manager-models` tool
 * (2026-08 sync). Alexi does not yet ship the model catalog UI, so the
 * tool itself is not registered — but the description and hint strings
 * are exported here so callers (and the paired `agent_manager` tool
 * description) can stay consistent with upstream wording about the new
 * `provider` field.
 *
 * When Alexi grows a model catalog surface, this stub is the intended
 * landing point: register a tool named `agent_manager_models` that
 * emits rows of `{ modelName, variants, providers }` and reuses
 * `AGENT_MANAGER_MODELS_HINT` below.
 */

export const AGENT_MANAGER_MODELS_HINT =
  'Pass a model name (or one of its providers/IDs) as the agent_manager task `model`. ' +
  'Add the task `provider` to force one of the listed providers; otherwise Agent Manager ' +
  'prefers the provider used by the current turn.';
