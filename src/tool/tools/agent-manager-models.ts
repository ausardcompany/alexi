/**
 * Agent Manager Models Tool — model catalog discovery for subagents.
 *
 * Ports the upstream opencode `agent-manager-models` tool (2026-08 sync,
 * refactored ab143253a to depend on `Config.Service` and gate on the
 * experimental `task_model_selection` flag). Alexi adapts the Effect-
 * based upstream shape to the local `defineTool` contract.
 *
 * Behaviour
 * ---------
 * - When `experimental.task_model_selection` is `false` (the default),
 *   the tool refuses to enumerate models and returns a hint pointing at
 *   the flag. This preserves Alexi's SAP AI Core-only defaults for
 *   users who have not opted in to subagent model selection.
 * - When the flag is enabled, the tool returns a paginated list of
 *   `{ modelName, providers, ids }` rows filtered by the optional
 *   `query`. Callers pass the `modelName` (or a `provider/id` string)
 *   as the `agent_manager` task `model` field, and optionally the
 *   `provider` field to force a specific provider when the same model
 *   name is offered by more than one.
 *
 * The shared `AGENT_MANAGER_MODELS_HINT` is still exported so the
 * `agent_manager` tool description and any future TUI surface can stay
 * consistent about the `provider` field.
 */

import { z } from 'zod';
import { defineTool, type ToolResult } from '../index.js';
import { candidates } from '../model-selection.js';
import { getConfigTaskModelSelection } from '../../config/userConfig.js';

export const AGENT_MANAGER_MODELS_HINT =
  'Pass a model name (or one of its providers/IDs) as the agent_manager task `model`. ' +
  'Add the task `provider` to force one of the listed providers; otherwise Agent Manager ' +
  'prefers the provider used by the current turn.';

const MAX_LIMIT = 50;

const ParamsSchema = z.object({
  query: z
    .string()
    .nullable()
    .optional()
    .describe(
      'Optional free-form filter (matched against model name and provider/id, case-insensitive, token-based).'
    ),
  offset: z
    .number()
    .int()
    .nonnegative()
    .nullable()
    .optional()
    .describe('Pagination offset (default 0).'),
  limit: z
    .number()
    .int()
    .positive()
    .nullable()
    .optional()
    .describe(`Pagination limit (default and max ${MAX_LIMIT}).`),
});

interface ModelRow {
  modelName: string;
  ids: string[];
  providers: string[];
}

interface AgentManagerModelsResult {
  enabled: boolean;
  models?: ModelRow[];
  offset?: number;
  total?: number;
  nextOffset?: number;
  hint?: string;
  message?: string;
}

/**
 * Case-insensitive token match: every whitespace-separated token in
 * `query` must appear in AT LEAST ONE of the `haystacks`. Empty
 * queries match everything (used when no filter is supplied).
 */
function matchesQuery(haystacks: string[], query: string): boolean {
  const q = query.trim().toLowerCase();
  if (q.length === 0) {
    return true;
  }
  const tokens = q.split(/\s+/);
  const lowerHays = haystacks.map((h) => h.toLowerCase());
  return tokens.every((tok) => lowerHays.some((h) => h.includes(tok)));
}

/**
 * Collapse the flat candidate list into one row per distinct model
 * name, with the set of provider ids and provider-prefixed ids that
 * resolve to it.
 */
function aggregate(): ModelRow[] {
  const byName = new Map<string, ModelRow>();
  for (const c of candidates()) {
    const row = byName.get(c.model.name) ?? {
      modelName: c.model.name,
      ids: [],
      providers: [],
    };
    const qualifiedId = `${c.providerID}/${c.model.id}`;
    if (!row.ids.includes(qualifiedId)) {
      row.ids.push(qualifiedId);
    }
    if (!row.providers.includes(c.providerID)) {
      row.providers.push(c.providerID);
    }
    byName.set(c.model.name, row);
  }
  return [...byName.values()].sort((a, b) => a.modelName.localeCompare(b.modelName));
}

export const agentManagerModelsTool = defineTool<typeof ParamsSchema, AgentManagerModelsResult>({
  name: 'agent_manager_models',

  description: `List models available for agent_manager task subagents to select.

Requires the experimental config flag \`experimental.task_model_selection\` (default: off).
When the flag is off, this tool returns a hint pointing at the flag and no rows.
When the flag is on, returns a paginated list of \`{ modelName, providers, ids }\`.

${AGENT_MANAGER_MODELS_HINT}`,

  parameters: ParamsSchema,

  async execute(params, _context): Promise<ToolResult<AgentManagerModelsResult>> {
    // Gate on the experimental flag. Matches upstream ab143253a: the
    // tool is disabled/hidden when the operator has not opted in.
    if (!getConfigTaskModelSelection()) {
      return {
        success: true,
        data: {
          enabled: false,
          message:
            'Model catalog listing is disabled. Set experimental.task_model_selection=true in ~/.alexi/config.json to enable per-task model selection.',
        },
      };
    }

    const all = aggregate();
    const query = params.query?.trim() ?? '';
    const matches = query
      ? all.filter((row) => matchesQuery([row.modelName, ...row.providers, ...row.ids], query))
      : all;

    const offset = params.offset ?? 0;
    const requestedLimit = params.limit ?? MAX_LIMIT;
    const limit = Math.min(requestedLimit, MAX_LIMIT);
    const page = matches.slice(offset, offset + limit);
    const nextOffset = offset + page.length < matches.length ? offset + page.length : undefined;

    return {
      success: true,
      data: {
        enabled: true,
        models: page,
        offset,
        total: matches.length,
        nextOffset,
        hint: AGENT_MANAGER_MODELS_HINT,
      },
    };
  },
});
