/**
 * Sound Effects System
 * Terminal bell-based audio feedback for Alexi CLI
 * Features: configurable sound events, EventBus integration, persistent config
 */

import type { BusEvent } from '../bus/index.js';
import { CONFIG_DIR, CONFIG_FILE, loadFullConfig, saveFullConfig } from '../config/userConfig.js';

// ============ Type Definitions ============

export type SoundEvent =
  | 'session_start'
  | 'session_end'
  | 'prompt_submit'
  | 'response_complete'
  | 'error'
  | 'permission_request'
  | 'tool_complete'
  | 'warning';

export interface SoundConfig {
  enabled: boolean;
  events: Partial<Record<SoundEvent, boolean>>;
}

// ============ Constants ============

const DEFAULT_CONFIG: SoundConfig = {
  enabled: false, // Disabled by default
  events: {
    session_start: false,
    session_end: true,
    prompt_submit: false,
    response_complete: true,
    error: true,
    permission_request: true,
    tool_complete: false,
    warning: false,
  },
};

// ============ Helper Functions ============

/**
 * Load sound config from disk
 */
function loadSoundConfig(): SoundConfig {
  const fullConfig = loadFullConfig();
  const soundConfig = fullConfig.sounds as Partial<SoundConfig> | undefined;

  if (!soundConfig) {
    return { ...DEFAULT_CONFIG };
  }

  // Merge with defaults to ensure all fields exist
  return {
    enabled:
      typeof soundConfig.enabled === 'boolean' ? soundConfig.enabled : DEFAULT_CONFIG.enabled,
    events: {
      ...DEFAULT_CONFIG.events,
      ...(soundConfig.events || {}),
    },
  };
}

/**
 * Save sound config to disk
 */
function saveSoundConfig(soundConfig: SoundConfig): void {
  const fullConfig = loadFullConfig();
  fullConfig.sounds = soundConfig;
  saveFullConfig(fullConfig);
}

// ============ SoundManager Class ============

export class SoundManager {
  private config: SoundConfig;

  constructor() {
    this.config = loadSoundConfig();
  }

  /**
   * Play terminal bell for a specific event if enabled
   */
  play(event: SoundEvent): void {
    if (!this.config.enabled) {
      return;
    }

    const eventEnabled = this.config.events[event];
    if (eventEnabled === true) {
      this.bell();
    }
  }

  /**
   * Force play terminal bell regardless of config
   */
  playBell(): void {
    this.bell();
  }

  /**
   * Enable sounds globally
   */
  enable(): void {
    this.config.enabled = true;
    saveSoundConfig(this.config);
  }

  /**
   * Disable sounds globally
   */
  disable(): void {
    this.config.enabled = false;
    saveSoundConfig(this.config);
  }

  /**
   * Check if sounds are enabled globally
   */
  isEnabled(): boolean {
    return this.config.enabled;
  }

  /**
   * Toggle specific event sound on/off
   */
  setEvent(event: SoundEvent, enabled: boolean): void {
    this.config.events[event] = enabled;
    saveSoundConfig(this.config);
  }

  /**
   * Get current sound configuration
   */
  getConfig(): SoundConfig {
    return { ...this.config, events: { ...this.config.events } };
  }

  /**
   * Update configuration with partial config
   */
  configure(config: Partial<SoundConfig>): void {
    if (typeof config.enabled === 'boolean') {
      this.config.enabled = config.enabled;
    }

    if (config.events) {
      this.config.events = {
        ...this.config.events,
        ...config.events,
      };
    }

    saveSoundConfig(this.config);
  }

  /**
   * Reload config from disk
   */
  reload(): void {
    this.config = loadSoundConfig();
  }

  /**
   * Reset config to defaults
   */
  reset(): void {
    this.config = { ...DEFAULT_CONFIG, events: { ...DEFAULT_CONFIG.events } };
    saveSoundConfig(this.config);
  }

  /**
   * Play terminal bell sound
   */
  private bell(): void {
    process.stdout.write('\x07');
  }
}

// ============ Singleton ============

let soundManagerInstance: SoundManager | null = null;

/**
 * Get the singleton SoundManager instance
 */
export function getSoundManager(): SoundManager {
  if (!soundManagerInstance) {
    soundManagerInstance = new SoundManager();
  }
  return soundManagerInstance;
}

/**
 * Reset the SoundManager singleton (mainly for testing)
 */
export function resetSoundManager(): void {
  soundManagerInstance = null;
}

// ============ EventBus Integration ============

/**
 * EventBus interface for type-safe event subscription
 * Compatible with BusEvent from ../bus/index.js
 */
interface EventBusLike {
  subscribe(handler: (payload: unknown) => void | Promise<void>): () => void;
  readonly name: string;
}

/**
 * Map of EventBus event names to SoundEvent types
 */
const EVENT_MAP: Record<string, SoundEvent> = {
  'session.created': 'session_start',
  'session.ended': 'session_end',
  'message.sent': 'prompt_submit',
  'message.received': 'response_complete',
  'tool.execution.completed': 'tool_complete',
  'error.occurred': 'error',
  'permission.requested': 'permission_request',
};

/**
 * Connect SoundManager to EventBus events
 * Maps EventBus events to SoundEvents and plays sounds accordingly
 *
 * @param events - Object containing BusEvent instances to subscribe to
 * @returns Cleanup function to unsubscribe from all events
 */
export function connectSoundToEventBus(events: Record<string, EventBusLike>): () => void {
  const soundManager = getSoundManager();
  const unsubscribers: (() => void)[] = [];

  for (const [_key, event] of Object.entries(events)) {
    const soundEvent = EVENT_MAP[event.name];

    if (soundEvent) {
      const unsubscribe = event.subscribe(() => {
        soundManager.play(soundEvent);
      });
      unsubscribers.push(unsubscribe);
    }
  }

  // Return cleanup function
  return () => {
    for (const unsub of unsubscribers) {
      unsub();
    }
  };
}

/**
 * Connect to specific BusEvent instances from the bus module
 * This is a convenience function that takes the pre-defined events
 */
export function connectToBusEvents(busEvents: {
  SessionCreated?: BusEvent<unknown>;
  SessionEnded?: BusEvent<unknown>;
  MessageSent?: BusEvent<unknown>;
  MessageReceived?: BusEvent<unknown>;
  ToolExecutionCompleted?: BusEvent<unknown>;
  ErrorOccurred?: BusEvent<unknown>;
  PermissionRequested?: BusEvent<unknown>;
}): () => void {
  const soundManager = getSoundManager();
  const unsubscribers: (() => void)[] = [];

  if (busEvents.SessionCreated) {
    unsubscribers.push(
      busEvents.SessionCreated.subscribe(() => soundManager.play('session_start'))
    );
  }

  if (busEvents.SessionEnded) {
    unsubscribers.push(busEvents.SessionEnded.subscribe(() => soundManager.play('session_end')));
  }

  if (busEvents.MessageSent) {
    unsubscribers.push(busEvents.MessageSent.subscribe(() => soundManager.play('prompt_submit')));
  }

  if (busEvents.MessageReceived) {
    unsubscribers.push(
      busEvents.MessageReceived.subscribe(() => soundManager.play('response_complete'))
    );
  }

  if (busEvents.ToolExecutionCompleted) {
    unsubscribers.push(
      busEvents.ToolExecutionCompleted.subscribe(() => soundManager.play('tool_complete'))
    );
  }

  if (busEvents.ErrorOccurred) {
    unsubscribers.push(busEvents.ErrorOccurred.subscribe(() => soundManager.play('error')));
  }

  if (busEvents.PermissionRequested) {
    unsubscribers.push(
      busEvents.PermissionRequested.subscribe(() => soundManager.play('permission_request'))
    );
  }

  // Return cleanup function
  return () => {
    for (const unsub of unsubscribers) {
      unsub();
    }
  };
}

// ============ Exports ============

export { CONFIG_DIR, CONFIG_FILE, DEFAULT_CONFIG };
