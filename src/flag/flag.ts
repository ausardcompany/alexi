/**
 * Global Feature Flags
 * Provides runtime flags for controlling application behavior
 */

const flags: Record<string, boolean> = {};

/**
 * Set a flag value
 */
function set(name: string, value: boolean): void {
  flags[name] = value;
}

/**
 * Get a flag value
 */
function get(name: string): boolean {
  return flags[name] ?? false;
}

/**
 * Clear all flags
 */
function clear(): void {
  Object.keys(flags).forEach((key) => delete flags[key]);
}

/**
 * Check if dangerously-skip-permissions flag is set
 * This flag bypasses all permission checks - use with extreme caution
 */
function dangerouslySkipPermissions(): boolean {
  return get('dangerouslySkipPermissions');
}

/**
 * Helper to check if value is explicitly truthy
 */
function truthy(key: string): boolean {
  const value = process.env[key];
  return value === 'true' || value === '1';
}

/**
 * Helper to check if value is explicitly falsy
 */
function falsy(key: string): boolean {
  const value = process.env[key];
  return value === 'false' || value === '0';
}

/**
 * Helper to determine default for unstable features based on channel
 */
function unstableDefault(key: string): boolean {
  const UNSTABLE_CHANNELS = new Set(['dev', 'beta', 'local']);
  const value = process.env[key];

  // Explicit true/false overrides
  if (value === 'true' || value === '1') return true;
  if (value === 'false' || value === '0') return false;

  // Default based on installation channel
  const channel = process.env.INSTALLATION_CHANNEL ?? 'prod';
  return UNSTABLE_CHANNELS.has(channel);
}

// Channels that default to the new experimental features
const HTTPAPI_DEFAULT_ON_CHANNELS = new Set(['dev', 'beta', 'local']);
const ALEXI_EXPERIMENTAL = truthy('ALEXI_EXPERIMENTAL');

// Feature flags
const OPENCODE_EXPERIMENTAL_CUSTOMIZE_SKILL = unstableDefault(
  'OPENCODE_EXPERIMENTAL_CUSTOMIZE_SKILL'
);

// Defaults to true on dev/beta/local channels so internal users exercise the
// new effect-httpapi server backend. Stable (`prod`/`latest`) installs stay
// on the legacy backend until the rollout is complete.
const ALEXI_EXPERIMENTAL_HTTPAPI =
  truthy('ALEXI_EXPERIMENTAL_HTTPAPI') ||
  (!falsy('ALEXI_EXPERIMENTAL_HTTPAPI') &&
    HTTPAPI_DEFAULT_ON_CHANNELS.has(process.env.INSTALLATION_CHANNEL ?? 'prod'));

const ALEXI_EXPERIMENTAL_WORKSPACES = ALEXI_EXPERIMENTAL || truthy('ALEXI_EXPERIMENTAL_WORKSPACES');

const ALEXI_EXPERIMENTAL_EVENT_SYSTEM =
  ALEXI_EXPERIMENTAL || truthy('ALEXI_EXPERIMENTAL_EVENT_SYSTEM');

export const Flag = {
  set,
  get,
  clear,
  dangerouslySkipPermissions,

  // Default-on for dev/beta/local; opt-in for stable. Set
  // OPENCODE_EXPERIMENTAL_CUSTOMIZE_SKILL=false to force off, =true to force on.
  OPENCODE_EXPERIMENTAL_CUSTOMIZE_SKILL,

  // Workspace ID for multi-workspace support
  ALEXI_WORKSPACE_ID: process.env.ALEXI_WORKSPACE_ID,

  // Experimental features
  ALEXI_EXPERIMENTAL,
  ALEXI_EXPERIMENTAL_HTTPAPI,
  ALEXI_EXPERIMENTAL_WORKSPACES,
  ALEXI_EXPERIMENTAL_EVENT_SYSTEM,
};
