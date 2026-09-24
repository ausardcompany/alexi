/**
 * Agent Manager Models Tool — model catalog discovery for subagents.
 *
 * Ports the upstream opencode `agent-manager-models` tool. In the 2026-09
 * sync (upstream `50e520adf` et al.), the experimental
 * `task_model_selection` flag was removed and the tool always advertises
 * the model catalog. Alexi mirrors that: this tool no longer gates on any
 * config flag and always returns paginated `{ modelName, providers, ids }`
 * rows.
 *
 * The shared `AGENT_MANAGER_MODELS_HINT` is still exported so the
 * `agent_manager` tool description and any future TUI surface can stay
 * consistent about the `provider` field.
 *
 * SAP note: if a SAP AI Core deployment needs to restrict which models
 * subagents can select (for example an operator allow-list), add the
 * filter inside `candidates()` / provider registration rather than
 * reintroducing the removed gate.
 */

import { z } from 'zod';
import { defineTool, type ToolResult } from '../index.js';
import { candidates } from '../model-selection.js';

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

Returns a paginated list of \`{ modelName, providers, ids }\`. Use this tool
before choosing the model, provider, or variant for the task subagent tool.
You may choose these settings to suit the subagent task without creating an
Agent Manager session.

${AGENT_MANAGER_MODELS_HINT}`,

  parameters: ParamsSchema,

  async execute(params, _context): Promise<ToolResult<AgentManagerModelsResult>> {
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
