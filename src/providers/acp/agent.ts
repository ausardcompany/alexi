/**
 * Agent Communication Protocol (ACP) Support
 * Provides configuration and invocation for ACP-compatible agents
 */

import { z } from 'zod';

export const acpConfigOptionsSchema = z.object({
  timeout: z.number().optional().default(30000),
  retryAttempts: z.number().optional().default(3),
  retryDelay: z.number().optional().default(1000),
  headers: z.record(z.string()).optional(),
  metadata: z.record(z.unknown()).optional(),
});

export type ACPConfigOptions = z.infer<typeof acpConfigOptionsSchema>;

export interface ACPAgentConfig {
  endpoint: string;
  apiKey?: string;
  configOptions?: ACPConfigOptions;
}

export function createACPAgent(config: ACPAgentConfig) {
  const options = acpConfigOptionsSchema.parse(config.configOptions ?? {});

  return {
    name: 'acp-agent',
    endpoint: config.endpoint,
    options,
    async invoke(message: string, context?: Record<string, unknown>) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), options.timeout);

      try {
        const response = await fetch(config.endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(config.apiKey && { Authorization: `Bearer ${config.apiKey}` }),
            ...options.headers,
          },
          body: JSON.stringify({ message, context, metadata: options.metadata }),
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`ACP agent request failed: ${response.statusText}`);
        }

        return await response.json();
      } finally {
        clearTimeout(timeoutId);
      }
    },
  };
}
