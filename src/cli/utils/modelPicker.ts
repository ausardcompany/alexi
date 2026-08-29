/**
 * Interactive model picker using @inquirer/prompts
 */

import { select, Separator } from '@inquirer/prompts';
import { ORCHESTRATION_MODELS } from '../../providers/sapOrchestration.js';
import {
  getCatalogEntries,
  getCatalogStatus,
  type CatalogEntry,
} from '../../providers/modelCatalog.js';
import { env } from '../../config/env.js';
import { c } from './colors.js';

interface ModelChoice {
  id: string;
  source: 'local' | 'remote' | 'live';
  live?: boolean;
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
 * Build the combined, deduplicated, grouped model list.
 *
 * Prefers the live SAP AI Core catalog (populated at startup by
 * refreshModelCatalog). Falls back to ORCHESTRATION_MODELS when the
 * catalog has not loaded yet or credentials are missing.
 */
export async function getAvailableModels(): Promise<ModelChoice[]> {
  const catalogReady = getCatalogStatus() === 'ready';

  if (catalogReady) {
    // Use the live catalog entries — richer data (live flag, deploymentId)
    const entries: readonly CatalogEntry[] = getCatalogEntries();
    return entries.map((e) => ({
      id: e.id,
      source: e.live ? 'live' : 'local',
      live: e.live,
    }));
  }

  // Catalog not yet loaded — use static list (same as before dynamic catalog)
  const localModels = [...ORCHESTRATION_MODELS];

  // Also try proxy fallback if configured
  const remoteModels = await fetchRemoteModelsProxy();
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
 * Fetch remote models from SAP proxy (if configured).
 * Returns empty array if not configured or fetch fails.
 * @internal used as fallback when live catalog is unavailable
 */
async function fetchRemoteModelsProxy(): Promise<string[]> {
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
 * Group models by provider and build choices with separators.
 *
 * Live models (confirmed RUNNING in SAP AI Core) get a ● indicator.
 * Static-only models (not yet deployed) get a dimmed ○ indicator.
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
      const liveIndicator = model.source === 'live' ? c('green', '●') : c('dim', '○');
      const currentLabel = isCurrent ? ` ${c('green', '← current')}` : '';
      const sourceLabel =
        model.source === 'remote' ? '(proxy)' : model.source === 'live' ? '(live)' : undefined;
      choices.push({
        name: `${liveIndicator} ${model.id}${currentLabel}`,
        value: model.id,
        description: sourceLabel,
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
