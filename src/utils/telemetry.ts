/**
 * Telemetry Module - Track usage metrics
 * Provides a simple interface for tracking tool usage and other events.
 *
 * Minify-safety note: this module intentionally does NOT use
 * `obj.constructor.name === 'TelemetryService'` anywhere for class
 * detection. Minifiers rename classes to short identifiers (e.g. `t`),
 * which breaks name-based checks silently in production builds. Future
 * telemetry integrations (OpenTelemetry, Sentry, Datadog, Langfuse) should
 * follow the same discipline: use structural checks (method existence,
 * object identity, or duck-typing) instead. See
 * `isTelemetryService` below for the reference pattern and
 * `docs/ARCHITECTURE.md` (Minify-Safe Patterns) for rationale.
 */

interface TelemetryEvent {
  event: string;
  properties?: Record<string, unknown>;
  timestamp: number;
}

/**
 * Public surface of a telemetry service, expressed structurally so
 * consumers can duck-type instances that survive minification.
 */
export interface TelemetryServiceLike {
  setEnabled(enabled: boolean): void;
  track(event: string, properties?: Record<string, unknown>): void;
  getEvents(): TelemetryEvent[];
  clear(): void;
}

class TelemetryService implements TelemetryServiceLike {
  private events: TelemetryEvent[] = [];
  private enabled: boolean = false;

  /**
   * Enable or disable telemetry tracking
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  /**
   * Track an event with optional properties
   */
  track(event: string, properties?: Record<string, unknown>): void {
    if (!this.enabled) {
      return;
    }

    this.events.push({
      event,
      properties,
      timestamp: Date.now(),
    });

    // In a production system, this would send to a telemetry service
    // For now, we just store locally
  }

  /**
   * Get all tracked events (for debugging/testing)
   */
  getEvents(): TelemetryEvent[] {
    return [...this.events];
  }

  /**
   * Clear all tracked events
   */
  clear(): void {
    this.events = [];
  }
}

/**
 * Structural, minify-safe check for "is this object a telemetry service?".
 *
 * Rationale: `obj.constructor.name === 'TelemetryService'` breaks the
 * moment a bundler minifies the class name to something like `t`. Instead
 * of relying on identifier names that only exist at authoring time, this
 * helper duck-types the object against the required method surface. It is
 * exported as the canonical example for future telemetry integrations.
 *
 * Do NOT weaken this check to a single-method probe: `track` alone is too
 * generic (many event emitters expose it). Requiring the full quartet
 * distinguishes a telemetry service from unrelated shapes.
 */
export function isTelemetryService(obj: unknown): obj is TelemetryServiceLike {
  if (obj === null || typeof obj !== 'object') {
    return false;
  }
  const candidate = obj as Record<string, unknown>;
  return (
    typeof candidate.setEnabled === 'function' &&
    typeof candidate.track === 'function' &&
    typeof candidate.getEvents === 'function' &&
    typeof candidate.clear === 'function'
  );
}

// Global telemetry instance
const telemetryService = new TelemetryService();

/**
 * Reference to the singleton service, exported for identity checks
 * (`obj === telemetryInstance`) that also survive minification because
 * they compare object identity rather than class names.
 */
export const telemetryInstance: TelemetryServiceLike = telemetryService;

export const Telemetry = {
  track: (event: string, properties?: Record<string, unknown>) =>
    telemetryService.track(event, properties),
  setEnabled: (enabled: boolean) => telemetryService.setEnabled(enabled),
  getEvents: () => telemetryService.getEvents(),
  clear: () => telemetryService.clear(),
};
