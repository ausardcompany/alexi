/**
 * Environment Configuration for SAP AI Core Orchestration
 *
 * Required environment variables:
 * - AICORE_SERVICE_KEY: JSON service key for SAP AI Core (handled by SDK automatically)
 *
 * Optional environment variables:
 * - AICORE_RESOURCE_GROUP: SAP AI Core resource group (default: undefined)
 * - AICORE_MODEL: Default model to use (default: gpt-4o)
 */

import dotenv from 'dotenv';

dotenv.config({ quiet: true });

export function env(key: string): string | undefined {
  const v = process.env[key];
  if (typeof v !== 'string') return undefined;
  const t = v.trim();
  return t.length ? t : undefined;
}
