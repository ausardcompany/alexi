/**
 * Interactive model picker using @inquirer/prompts
 */

import { select, Separator } from '@inquirer/prompts';
import { ORCHESTRATION_MODELS } from '../../providers/sapOrchestration.js';
import { env } from '../../config/env.js';
import { c } from './colors.js';

interface ModelChoice {
  id: string;
  source: 'local' | 'remote';
}

/**
 * Group models by provider prefix.
 * Models like "anthropic--claude-4.5-sonnet" → group "Anthropic"
 * Models like "gpt-4o" → group "OpenAI"
 */
const PROVIDER_GROUPS: Record<string, string> = {
  'gpt-': 'OpenAI',
  'anthropic--': 'Anthropic',
  'gemini-': 'Google',
  'amazon--': 'Amazon',
  'mistralai--': 'Mistral',
  'meta--': 'Meta',
  'deepseek-': 'DeepSeek',
  'sap-': 'SAP',
};

/** @deprecated Use src/cli/tui/index.ts (startTui) instead. */
export function getProviderGroup(modelId: string): string {
  for (const [prefix, group] of Object.entries(PROVIDER_GROUPS)) {
    if (modelId.startsWith(prefix)) {
      return group;
    }
  }
  return 'Other';
}

/**
 * Fetch remote models from SAP proxy (if configured).
 * Returns empty array if not configured or fetch fails.
 */
async function fetchRemoteModels(): Promise<string[]> {
  const baseURL = env('SAP_PROXY_BASE_URL');
  const apiKey = env('SAP_PROXY_API_KEY');
  if (!baseURL || !apiKey) {
    return [];
  }

  try {
    const url = baseURL.replace(/\/$/, '') + '/models';
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${apiKey}` },
      signal: AbortSignal.timeout(5000),
    });
    if (res.ok) {
      const data = (await res.json()) as { data?: Array<{ id: string }> };
      return (data?.data || []).map((m) => m.id);
    }
  } catch {
    // Silently fall back to local models
  }
  return [];
}

/**
 * Build the combined, deduplicated, grouped model list.
 */
export async function getAvailableModels(): Promise<ModelChoice[]> {
  const localModels = [...ORCHESTRATION_MODELS];
  const remoteModels = await fetchRemoteModels();

  // Merge: local first, then remote-only models
  const seen = new Set<string>(localModels);
  const allModels: ModelChoice[] = localModels.map((id) => ({ id, source: 'local' as const }));

  for (const id of remoteModels) {
    if (!seen.has(id)) {
      seen.add(id);
      allModels.push({ id, source: 'remote' as const });
    }
  }

  return allModels;
}

/**
 * Group models by provider and build choices with separators.
 */
export function buildGroupedChoices(
  models: ModelChoice[],
  currentModel: string
): Array<{ name: string; value: string; description?: string } | Separator> {
  // Group by provider
  const groups = new Map<string, ModelChoice[]>();
  for (const model of models) {
    const group = getProviderGroup(model.id);
    if (!groups.has(group)) {
      groups.set(group, []);
    }
    groups.get(group)!.push(model);
  }

  // Build choices with separators for each group
  const choices: Array<{ name: string; value: string; description?: string } | Separator> = [];

  for (const [groupName, groupModels] of groups) {
    choices.push(new Separator(c('dim', `── ${groupName} ──`)));
    for (const model of groupModels) {
      const isCurrent = model.id === currentModel;
      choices.push({
        name: isCurrent ? `${model.id} ${c('green', '← current')}` : model.id,
        value: model.id,
        description: model.source === 'remote' ? '(proxy)' : undefined,
      });
    }
  }

  return choices;
}

/**
 * Show interactive model picker. Returns selected model ID or null if cancelled.
 */
export async function pickModel(currentModel: string): Promise<string | null> {
  const models = await getAvailableModels();
  const choices = buildGroupedChoices(models, currentModel);

  try {
    const selected = await select({
      message: 'Select a model',
      choices,
      pageSize: 20,
      loop: false,
    });
    return selected;
  } catch {
    // User pressed Esc or Ctrl+C — cancelled
    return null;
  }
}
