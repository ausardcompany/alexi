/**
 * Feature Flags
 * Channel-based defaults for experimental features
 */

function truthy(key: string): boolean {
  const value = process.env[key]?.toLowerCase();
  return value === 'true' || value === '1';
}

function falsy(key: string): boolean {
  const value = process.env[key]?.toLowerCase();
  return value === 'false' || value === '0';
}

// Determine installation channel from environment or default to 'stable'
export const InstallationChannel: string = process.env.ALEXI_CHANNEL || 'stable';

// Channels that default to the new effect-httpapi server backend
const HTTPAPI_DEFAULT_ON_CHANNELS = new Set(['dev', 'beta', 'local']);

export const Flag = {
  // Defaults to true on dev/beta/local channels for internal testing
  // Stable (prod/latest) installs stay on legacy backend until rollout complete
  // Explicit env var always wins (opt-in for stable, escape hatch for dev/beta)
  ALEXI_EXPERIMENTAL_HTTPAPI:
    truthy('ALEXI_EXPERIMENTAL_HTTPAPI') ||
    (!falsy('ALEXI_EXPERIMENTAL_HTTPAPI') && HTTPAPI_DEFAULT_ON_CHANNELS.has(InstallationChannel)),

  ALEXI_EXPERIMENTAL_WORKSPACES:
    truthy('ALEXI_EXPERIMENTAL') || truthy('ALEXI_EXPERIMENTAL_WORKSPACES'),

  ALEXI_EXPERIMENTAL_EVENT_SYSTEM:
    truthy('ALEXI_EXPERIMENTAL') || truthy('ALEXI_EXPERIMENTAL_EVENT_SYSTEM'),

  // SAP AI Core specific flags
  SAP_AI_CORE_ENABLED: truthy('SAP_AI_CORE_ENABLED'),
  SAP_AI_CORE_STRICT_MODE: truthy('SAP_AI_CORE_STRICT_MODE'),

  // Permission flags
  ALEXI_ALLOW_EVERYTHING: truthy('ALEXI_ALLOW_EVERYTHING'),
};
