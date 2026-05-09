/**
 * Tool Output Truncation Configuration
 * Allows configuring truncation limits per tool
 */

import { z } from 'zod';

export interface TruncationConfig {
  defaultLimit: number;
  toolLimits: Record<string, number>;
  contextLimit: number;
}

const DEFAULT_CONFIG: TruncationConfig = {
  defaultLimit: 10000,
  toolLimits: {
    read: 50000,
    grep: 20000,
    glob: 30000,
    bash: 15000,
    webfetch: 25000,
    codesearch: 40000,
  },
  contextLimit: 100000,
};

export const TruncationConfigSchema = z.object({
  defaultLimit: z
    .number()
    .positive()
    .optional()
    .describe('Default character limit for tool outputs'),
  toolLimits: z
    .record(z.string(), z.number().positive())
    .optional()
    .describe('Per-tool character limits'),
  contextLimit: z
    .number()
    .positive()
    .optional()
    .describe('Maximum context size before truncation'),
});

export class Truncator {
  private config: TruncationConfig;

  constructor(config?: Partial<TruncationConfig>) {
    this.config = {
      ...DEFAULT_CONFIG,
      ...config,
      toolLimits: {
        ...DEFAULT_CONFIG.toolLimits,
        ...(config?.toolLimits ?? {}),
      },
    };
  }

  /**
   * Truncate tool output based on configured limits
   */
  truncateOutput(output: string, toolName?: string): { content: string; truncated: boolean } {
    const limit = toolName
      ? this.config.toolLimits[toolName] ?? this.config.defaultLimit
      : this.config.defaultLimit;

    if (output.length <= limit) {
      return { content: output, truncated: false };
    }

    const truncated = output.slice(0, limit);
    const remaining = output.length - limit;
    return {
      content: `${truncated}\n... [${remaining} characters truncated]`,
      truncated: true,
    };
  }

  /**
   * Truncate context to prevent exceeding limits
   */
  truncateContext(context: string): { content: string; truncated: boolean } {
    if (context.length <= this.config.contextLimit) {
      return { content: context, truncated: false };
    }

    const truncated = context.slice(0, this.config.contextLimit);
    return {
      content: `${truncated}\n... [context truncated]`,
      truncated: true,
    };
  }

  /**
   * Get the configured limit for a specific tool
   */
  getToolLimit(toolName: string): number {
    return this.config.toolLimits[toolName] ?? this.config.defaultLimit;
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<TruncationConfig>): void {
    this.config = {
      ...this.config,
      ...config,
      toolLimits: {
        ...this.config.toolLimits,
        ...(config.toolLimits ?? {}),
      },
    };
  }

  /**
   * Get current configuration
   */
  getConfig(): TruncationConfig {
    return { ...this.config };
  }
}

// Global truncator instance
let globalTruncator: Truncator | null = null;

export function getTruncator(): Truncator {
  if (!globalTruncator) {
    globalTruncator = new Truncator();
  }
  return globalTruncator;
}

export function setTruncatorConfig(config: Partial<TruncationConfig>): void {
  getTruncator().updateConfig(config);
}
