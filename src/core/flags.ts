/**
 * Core Feature Flags
 * Runtime configuration for experimental and provider-specific features
 */

export interface FeatureFlags {
  enableExperimentalTools: boolean;
  enableDebugLogging: boolean;
  /**
   * When enabled, routes Anthropic API-key authenticated models through
   * the native runtime instead of the standard provider SDK.
   * This can improve latency and reduce overhead for direct API calls.
   */
  enableNativeAnthropicRuntime: boolean;
}

export const defaultFlags: FeatureFlags = {
  enableExperimentalTools: false,
  enableDebugLogging: false,
  enableNativeAnthropicRuntime: false,
};

/**
 * Load feature flags from environment variables
 */
export function loadFeatureFlags(): FeatureFlags {
  return {
    enableExperimentalTools: process.env.ALEXI_EXPERIMENTAL_TOOLS === 'true',
    enableDebugLogging: process.env.ALEXI_DEBUG === 'true',
    enableNativeAnthropicRuntime: process.env.ALEXI_NATIVE_ANTHROPIC === 'true',
  };
}

/**
 * Checks if native runtime should be used for a given provider.
 */
export function shouldUseNativeRuntime(provider: string, flags: FeatureFlags): boolean {
  if (provider === 'anthropic' && flags.enableNativeAnthropicRuntime) {
    return true;
  }
  return false;
}

/**
 * Global flags instance
 */
let globalFlags: FeatureFlags | null = null;

/**
 * Get the global feature flags instance
 */
export function getFeatureFlags(): FeatureFlags {
  if (!globalFlags) {
    globalFlags = loadFeatureFlags();
  }
  return globalFlags;
}

/**
 * Set the global feature flags instance
 */
export function setFeatureFlags(flags: FeatureFlags): void {
  globalFlags = flags;
}

/**
 * Reset feature flags to defaults
 */
export function resetFeatureFlags(): void {
  globalFlags = { ...defaultFlags };
}
