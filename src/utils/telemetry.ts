/**
 * Telemetry Module - Track usage metrics
 * Provides a simple interface for tracking tool usage and other events
 */

interface TelemetryEvent {
  event: string;
  properties?: Record<string, unknown>;
  timestamp: number;
}

class TelemetryService {
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

// Global telemetry instance
const telemetryService = new TelemetryService();

export const Telemetry = {
  track: (event: string, properties?: Record<string, unknown>) =>
    telemetryService.track(event, properties),
  setEnabled: (enabled: boolean) => telemetryService.setEnabled(enabled),
  getEvents: () => telemetryService.getEvents(),
  clear: () => telemetryService.clear(),
};
