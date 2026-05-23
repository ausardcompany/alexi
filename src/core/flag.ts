/**
 * Feature Flags
 * Control experimental features and channel-specific behavior
 * Based on kilocode/opencode flag patterns
 */

const HTTPAPI_DEFAULT_ON_CHANNELS = new Set(['dev', 'beta', 'local']);
const EVENT_SYSTEM_DEFAULT_ON_CHANNELS = new Set(['dev', 'beta', 'local']);

function truthy(key: string): boolean {
  const value = process.env[key];
  return value === 'true' || value === '1' || value === 'yes';
}

function falsy(key: string): boolean {
  const value = process.env[key];
  return value === 'false' || value === '0' || value === 'no';
}

function getChannel(): string {
  return process.env.ALEXI_CHANNEL || process.env.NODE_ENV || 'production';
}

export const Flag = {
  /**
   * Enable HTTP API for programmatic access
   */
  httpapi(): boolean {
    if (truthy('ALEXI_HTTPAPI')) {
      return true;
    }
    if (falsy('ALEXI_HTTPAPI')) {
      return false;
    }
    return HTTPAPI_DEFAULT_ON_CHANNELS.has(getChannel());
  },

  /**
   * Enable enhanced event system
   */
  eventSystem(): boolean {
    if (truthy('ALEXI_EVENT_SYSTEM')) {
      return true;
    }
    if (falsy('ALEXI_EVENT_SYSTEM')) {
      return false;
    }
    return EVENT_SYSTEM_DEFAULT_ON_CHANNELS.has(getChannel());
  },

  /**
   * Enable debug logging
   */
  debug(): boolean {
    return truthy('ALEXI_DEBUG') || truthy('DEBUG');
  },

  /**
   * Enable verbose logging
   */
  verbose(): boolean {
    return truthy('ALEXI_VERBOSE') || truthy('VERBOSE');
  },

  /**
   * Get current channel
   */
  channel(): string {
    return getChannel();
  },

  /**
   * Check if running in development mode
   */
  isDevelopment(): boolean {
    return getChannel() === 'dev' || getChannel() === 'development';
  },

  /**
   * Check if running in production mode
   */
  isProduction(): boolean {
    return getChannel() === 'production';
  },
};
