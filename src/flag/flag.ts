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

// Feature flags
const OPENCODE_EXPERIMENTAL_CUSTOMIZE_SKILL = unstableDefault(
  'OPENCODE_EXPERIMENTAL_CUSTOMIZE_SKILL'
);

export const Flag = {
  set,
  get,
  clear,
  dangerouslySkipPermissions,

  // Default-on for dev/beta/local; opt-in for stable. Set
  // OPENCODE_EXPERIMENTAL_CUSTOMIZE_SKILL=false to force off, =true to force on.
  OPENCODE_EXPERIMENTAL_CUSTOMIZE_SKILL,
};
