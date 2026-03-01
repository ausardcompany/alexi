/**
 * Routing Configuration Loader
 * Loads and validates routing rules from JSON configuration
 */

import fs from 'fs';
import path from 'path';
import type { ModelCapability } from '../core/router.js';

export interface RoutingRule {
  name: string;
  description: string;
  condition: {
    minLength?: number;
    maxLength?: number;
    taskTypes?: string[];
    maxComplexity?: 'simple' | 'medium' | 'complex';
    keywords?: string[];
  };
  modelId?: string;
  requiresReasoning?: boolean;
  priority: number;
}

export interface RoutingPreferences {
  defaultCostTier: 'cheap' | 'medium' | 'expensive';
  preferCheapWhenPossible: boolean;
  maxCostPerRequest: number | null;
  fallbackModel: string;
}

export interface RoutingConfig {
  models: ModelCapability[];
  rules: RoutingRule[];
  preferences: RoutingPreferences;
}

/**
 * Default configuration
 */
const DEFAULT_CONFIG: RoutingConfig = {
  models: [
    {
      id: 'gpt-4o-mini',
      type: 'openai',
      costTier: 'cheap',
      strengths: ['simple-qa', 'classification', 'extraction', 'summarization'],
      maxTokens: 16000,
      reasoning: false
    },
    {
      id: 'gpt-4o',
      type: 'openai',
      costTier: 'medium',
      strengths: ['coding', 'analysis', 'creative-writing', 'complex-qa', 'vision'],
      maxTokens: 128000,
      reasoning: false
    },
    {
      id: 'claude-3.5-sonnet',
      type: 'claude',
      costTier: 'medium',
      strengths: ['coding', 'analysis', 'long-context', 'technical-writing'],
      maxTokens: 200000,
      reasoning: false
    },
    {
      id: 'gpt-4.1',
      type: 'openai',
      costTier: 'expensive',
      strengths: ['deep-reasoning', 'complex-math', 'research', 'advanced-coding'],
      maxTokens: 128000,
      reasoning: true
    },
    {
      id: 'claude-4-sonnet',
      type: 'claude',
      costTier: 'expensive',
      strengths: ['deep-reasoning', 'complex-analysis', 'long-context', 'research'],
      maxTokens: 200000,
      reasoning: true
    }
  ],
  rules: [],
  preferences: {
    defaultCostTier: 'medium',
    preferCheapWhenPossible: false,
    maxCostPerRequest: null,
    fallbackModel: 'gpt-4o'
  }
};

/**
 * Load routing configuration from file or use defaults
 */
export function loadRoutingConfig(configPath?: string): RoutingConfig {
  // Use provided path or default locations
  const searchPaths = configPath
    ? [configPath]
    : [
        path.join(process.cwd(), 'routing-config.json'),
        path.join(process.cwd(), 'config', 'routing.json'),
        path.join(process.env.HOME || '~', '.alexi', 'routing-config.json')
      ];

  // Try to find and load config file
  for (const filePath of searchPaths) {
    try {
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf-8');
        const config = JSON.parse(content) as RoutingConfig;
        
        // Validate required fields
        if (!config.models || !Array.isArray(config.models)) {
          console.warn(`Invalid config at ${filePath}: missing or invalid 'models' array`);
          continue;
        }
        
        // Merge with defaults for missing fields
        return {
          models: config.models,
          rules: config.rules || [],
          preferences: { ...DEFAULT_CONFIG.preferences, ...config.preferences }
        };
      }
    } catch (error) {
      console.warn(`Failed to load routing config from ${filePath}:`, error);
    }
  }

  // Return default config if no file found
  console.log('No routing config found, using defaults');
  return DEFAULT_CONFIG;
}

/**
 * Evaluate if a rule matches a prompt classification
 */
export function evaluateRule(
  rule: RoutingRule,
  classification: {
    type: string;
    complexity: 'simple' | 'medium' | 'complex';
    requiresReasoning: boolean;
    estimatedTokens: number;
  },
  promptLength: number,
  prompt: string
): boolean {
  const { condition } = rule;

  // Check length constraints
  if (condition.minLength && promptLength < condition.minLength) return false;
  if (condition.maxLength && promptLength > condition.maxLength) return false;

  // Check task types
  if (condition.taskTypes && !condition.taskTypes.includes(classification.type)) return false;

  // Check complexity
  if (condition.maxComplexity) {
    const complexityOrder = { simple: 0, medium: 1, complex: 2 };
    if (complexityOrder[classification.complexity] > complexityOrder[condition.maxComplexity]) {
      return false;
    }
  }

  // Check keywords
  if (condition.keywords && condition.keywords.length > 0) {
    const lower = prompt.toLowerCase();
    const hasKeyword = condition.keywords.some(kw => lower.includes(kw.toLowerCase()));
    if (!hasKeyword) return false;
  }

  return true;
}

/**
 * Find matching rule with highest priority
 */
export function findMatchingRule(
  rules: RoutingRule[],
  classification: {
    type: string;
    complexity: 'simple' | 'medium' | 'complex';
    requiresReasoning: boolean;
    estimatedTokens: number;
  },
  prompt: string
): RoutingRule | null {
  // Filter matching rules
  const matching = rules.filter(rule => 
    evaluateRule(rule, classification, prompt.length, prompt)
  );

  if (matching.length === 0) return null;

  // Sort by priority (descending)
  matching.sort((a, b) => b.priority - a.priority);

  return matching[0];
}
