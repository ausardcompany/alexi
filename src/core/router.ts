/**
 * Intelligent LLM Router
 * Routes prompts to appropriate models based on task complexity and type
 */

import {
  loadRoutingConfig,
  findMatchingRule,
  type RoutingConfig,
} from '../config/routingConfig.js';
import { extractStatusCode } from './error-backoff.js';
import { c } from '../cli/utils/colors.js';

export interface ModelCapability {
  id: string;
  type: 'openai' | 'claude' | 'gemini';
  costTier: 'cheap' | 'medium' | 'expensive';
  strengths: string[];
  maxTokens: number;
  reasoning: boolean;
}

export interface RoutingDecision {
  modelId: string;
  reason: string;
  confidence: number;
  ruleApplied?: string;
}

// Global configuration (loaded once)
let routingConfig: RoutingConfig | null = null;

function getConfig(): RoutingConfig {
  if (!routingConfig) {
    routingConfig = loadRoutingConfig();
  }
  return routingConfig;
}

// Get model registry from config
function getModelRegistry(): ModelCapability[] {
  return getConfig().models.filter(
    (m) => (m as ModelCapability & { enabled?: boolean }).enabled !== false
  );
}

// ---------------------------------------------------------------------------
// Route auto-disable state (in-process only; NOT persisted to ~/.alexi/).
// A route accumulates consecutive permanent failures (401/403/404 or
// model_not_found / deployment_not_found). When the count reaches the
// configured threshold, the route is marked disabled for the rest of the
// session and routePrompt() filters it out of the candidate list. A single
// success outcome resets the counter. Transient failures (5xx, network)
// remain owned by ErrorBackoff and must NOT call recordRouteOutcome with
// kind === 'permanent'.
// ---------------------------------------------------------------------------

interface RouteState {
  count: number;
  disabled: boolean;
}

const routeFailureState = new Map<string, RouteState>();

function getRouteFailureThreshold(): number {
  return getConfig().preferences.routeFailureThreshold ?? 3;
}

/**
 * Classify a thrown error for the purpose of route auto-disable. Returns
 * `permanent` when the error is a 401/403/404 from the provider OR the
 * message contains `model_not_found` / `deployment_not_found` (case
 * insensitive, on word boundaries). All other errors -- including 5xx,
 * network, and unknown shapes -- are NOT classified here; callers should
 * skip recordRouteOutcome for those and let ErrorBackoff manage them.
 */
export function classifyRouteError(
  err: unknown
): { kind: 'permanent'; statusCode?: number; reason?: string } | { kind: 'unknown' } {
  const message = err instanceof Error ? err.message : String(err);
  const statusCode = extractStatusCode(message);

  if (statusCode === 401 || statusCode === 403 || statusCode === 404) {
    return { kind: 'permanent', statusCode, reason: `HTTP ${statusCode}` };
  }

  if (/\bmodel_not_found\b/i.test(message)) {
    return { kind: 'permanent', reason: 'model_not_found' };
  }
  if (/\bdeployment_not_found\b/i.test(message)) {
    return { kind: 'permanent', reason: 'deployment_not_found' };
  }

  return { kind: 'unknown' };
}

/**
 * Record the outcome of a provider call for the given route. `success` resets
 * the consecutive-failure counter. `permanent` increments it and, when the
 * threshold is reached, disables the route and prints a one-line yellow
 * warning. Transient failures should NOT be recorded here.
 */
export function recordRouteOutcome(
  modelId: string,
  outcome: { kind: 'success' } | { kind: 'permanent'; statusCode?: number; reason?: string }
): void {
  if (outcome.kind === 'success') {
    routeFailureState.set(modelId, { count: 0, disabled: false });
    return;
  }

  const prev = routeFailureState.get(modelId) ?? { count: 0, disabled: false };
  // Once disabled, do not keep growing the counter or re-emit warnings.
  if (prev.disabled) {
    return;
  }

  const nextCount = prev.count + 1;
  const threshold = getRouteFailureThreshold();
  if (nextCount >= threshold) {
    routeFailureState.set(modelId, { count: nextCount, disabled: true });
    const why = outcome.reason ? ` (${outcome.reason})` : '';
    console.warn(
      c(
        'yellow',
        `[Router] Auto-disabling '${modelId}' after ${nextCount} permanent failures${why}`
      )
    );
    return;
  }

  routeFailureState.set(modelId, { count: nextCount, disabled: false });
}

/**
 * Returns true if the route has been auto-disabled this session.
 */
export function isRouteDisabled(modelId: string): boolean {
  return routeFailureState.get(modelId)?.disabled === true;
}

/**
 * Reset all route failure state. Called by tests and by reloadConfig().
 */
export function resetRouteFailures(): void {
  routeFailureState.clear();
}

/**
 * Classify prompt to determine task type
 */
function classifyPrompt(prompt: string): {
  type: string;
  complexity: 'simple' | 'medium' | 'complex';
  requiresReasoning: boolean;
  estimatedTokens: number;
} {
  const lower = prompt.toLowerCase();
  const length = prompt.length;

  // Simple patterns
  const simplePatterns = [
    /^what is /i,
    /^define /i,
    /^translate /i,
    /^summarize in \d+ words/i,
    /yes or no/i,
    /true or false/i,
  ];

  const codingPatterns = [
    /write.*code/i,
    /function.*\(/i,
    /implement/i,
    /debug/i,
    /refactor/i,
    /class.*{/i,
    /```/,
  ];

  const reasoningPatterns = [
    /explain why/i,
    /analyze/i,
    /compare.*contrast/i,
    /step by step/i,
    /reasoning/i,
    /proof/i,
    /derive/i,
    /solve.*equation/i,
  ];

  const creativePatterns = [
    /write.*story/i,
    /write.*poem/i,
    /write.*haiku/i,
    /create.*content/i,
    /brainstorm/i,
  ];

  // Determine task type
  let type = 'general-qa';
  if (codingPatterns.some((p) => p.test(prompt))) type = 'coding';
  else if (reasoningPatterns.some((p) => p.test(prompt))) type = 'deep-reasoning';
  else if (creativePatterns.some((p) => p.test(prompt))) type = 'creative-writing';
  else if (simplePatterns.some((p) => p.test(prompt))) type = 'simple-qa';

  // Determine complexity
  let complexity: 'simple' | 'medium' | 'complex' = 'medium';

  if (length < 100 && simplePatterns.some((p) => p.test(prompt))) {
    complexity = 'simple';
  } else if (
    length > 500 ||
    reasoningPatterns.some((p) => p.test(prompt)) ||
    lower.includes('complex') ||
    lower.includes('advanced')
  ) {
    complexity = 'complex';
  }

  // Check if requires reasoning
  const requiresReasoning =
    reasoningPatterns.some((p) => p.test(prompt)) ||
    lower.includes('explain') ||
    lower.includes('why') ||
    complexity === 'complex';

  // Estimate tokens (rough approximation: ~4 chars per token)
  const estimatedTokens = Math.ceil(length / 4);

  return { type, complexity, requiresReasoning, estimatedTokens };
}

/**
 * Score model for given task
 */
function scoreModel(
  model: ModelCapability,
  taskType: string,
  complexity: string,
  requiresReasoning: boolean,
  preferCheap: boolean
): number {
  let score = 50; // Base score

  // Complexity matching
  if (complexity === 'simple' && model.costTier === 'cheap') score += 30;
  else if (complexity === 'medium' && model.costTier === 'medium') score += 20;
  else if (complexity === 'complex' && model.costTier === 'expensive') score += 25;
  else if (complexity === 'simple' && model.costTier === 'expensive') score -= 20; // Overkill

  // Task type matching
  if (model.strengths.includes(taskType)) score += 25;

  // Reasoning requirement
  if (requiresReasoning && model.reasoning) score += 20;
  if (requiresReasoning && !model.reasoning) score -= 15;

  // Cost preference
  if (preferCheap) {
    if (model.costTier === 'cheap') score += 15;
    else if (model.costTier === 'expensive') score -= 10;
  }

  return score;
}

/**
 * Route prompt to best model
 */
export function routePrompt(
  prompt: string,
  options?: {
    preferCheap?: boolean;
    forceModel?: string;
    availableModels?: string[];
  }
): RoutingDecision {
  // If model is forced, use it
  if (options?.forceModel) {
    return {
      modelId: options.forceModel,
      reason: 'User specified model',
      confidence: 1.0,
    };
  }

  const config = getConfig();
  const classification = classifyPrompt(prompt);

  // Check if any rule matches
  const matchedRule = findMatchingRule(config.rules, classification, prompt);

  if (matchedRule) {
    // Rule-based routing
    if (matchedRule.modelId) {
      return {
        modelId: matchedRule.modelId,
        reason: `Rule applied: ${matchedRule.name} - ${matchedRule.description}`,
        confidence: 1.0,
        ruleApplied: matchedRule.name,
      };
    }

    // Rule requires reasoning but doesn't specify model
    if (matchedRule.requiresReasoning) {
      classification.requiresReasoning = true;
    }
  }

  // Score-based routing (fallback or when no rule matches)
  const { type, complexity, requiresReasoning, estimatedTokens: _estimatedTokens } = classification;

  // Filter available models
  let candidates = getModelRegistry();
  if (options?.availableModels) {
    candidates = candidates.filter((m) => options.availableModels!.includes(m.id));
  }
  // Drop routes that have been auto-disabled this session.
  candidates = candidates.filter((m) => !isRouteDisabled(m.id));

  // Pathological case: every candidate has been auto-disabled. Fall back to
  // the configured fallbackModel with low confidence instead of throwing, so
  // the caller can still attempt a request (and the user can /reload).
  if (candidates.length === 0) {
    return {
      modelId: config.preferences.fallbackModel,
      reason: 'All routes auto-disabled this session; using configured fallback',
      confidence: 0.1,
      ruleApplied: matchedRule?.name,
    };
  }

  // Score each model
  const preferCheap = options?.preferCheap ?? config.preferences.preferCheapWhenPossible;
  const scored = candidates.map((model) => ({
    model,
    score: scoreModel(model, type, complexity, requiresReasoning, preferCheap),
  }));

  // Sort by score descending
  scored.sort((a, b) => b.score - a.score);

  // Select best model
  const best = scored[0];
  const confidence = Math.min(best.score / 100, 1.0);

  let reason = `Task type: ${type}, Complexity: ${complexity}`;
  if (requiresReasoning) reason += ', requires reasoning';
  if (preferCheap) reason += ', cost optimized';
  if (matchedRule && !matchedRule.modelId) {
    reason += ` (influenced by rule: ${matchedRule.name})`;
  }

  return {
    modelId: best.model.id,
    reason,
    confidence,
    ruleApplied: matchedRule?.name,
  };
}

/**
 * Get model routing statistics
 */
export async function explainRouting(prompt: string): Promise<{
  classification: ReturnType<typeof classifyPrompt>;
  candidates: Array<{ modelId: string; score: number; reason: string }>;
  selected: RoutingDecision;
  matchedRules?: Array<{ name: string; description: string; priority: number }>;
}> {
  const config = getConfig();
  const classification = classifyPrompt(prompt);

  // Find all matching rules
  const { evaluateRule: evaluateRuleFn } = await import('../config/routingConfig.js');
  const matchedRules = config.rules
    .filter((rule) => {
      return evaluateRuleFn(rule, classification, prompt.length, prompt);
    })
    .map((rule) => ({
      name: rule.name,
      description: rule.description,
      priority: rule.priority,
    }))
    .sort((a, b) => b.priority - a.priority);

  const scored = getModelRegistry().map((model) => {
    const score = scoreModel(
      model,
      classification.type,
      classification.complexity,
      classification.requiresReasoning,
      false
    );

    let reason = `${model.costTier} tier`;
    if (model.strengths.includes(classification.type)) {
      reason += `, strong at ${classification.type}`;
    }
    if (classification.requiresReasoning && model.reasoning) {
      reason += ', has reasoning';
    }

    return {
      modelId: model.id,
      score,
      reason,
    };
  });

  scored.sort((a, b) => b.score - a.score);

  const selected = routePrompt(prompt);

  return {
    classification,
    candidates: scored,
    selected,
    matchedRules: matchedRules.length > 0 ? matchedRules : undefined,
  };
}

/**
 * Reload routing configuration (useful for hot-reloading)
 */
export function reloadConfig(): void {
  routingConfig = null;
  resetRouteFailures();
}
