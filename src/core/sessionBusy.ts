/**
 * Session Busy State Management
 * Centralized handling for session busy errors
 */

export class SessionBusyError extends Error {
  constructor(
    readonly sessionId: string,
    readonly operation: string
  ) {
    super(`Session ${sessionId} is busy with ${operation}`);
    this.name = 'SessionBusyError';
  }
}

export interface BusyResponse {
  status: number;
  body: {
    error: string;
    message: string;
    sessionId: string;
  };
}

export function toBusyResponse(error: SessionBusyError): BusyResponse {
  return {
    status: 409,
    body: {
      error: 'SessionBusy',
      message: error.message,
      sessionId: error.sessionId,
    },
  };
}

/**
 * Track busy sessions to prevent concurrent operations
 */
class SessionBusyTracker {
  private busySessions = new Map<string, string>();

  markBusy(sessionId: string, operation: string): void {
    if (this.isBusy(sessionId)) {
      throw new SessionBusyError(sessionId, this.busySessions.get(sessionId)!);
    }
    this.busySessions.set(sessionId, operation);
  }

  markFree(sessionId: string): void {
    this.busySessions.delete(sessionId);
  }

  isBusy(sessionId: string): boolean {
    return this.busySessions.has(sessionId);
  }

  getCurrentOperation(sessionId: string): string | undefined {
    return this.busySessions.get(sessionId);
  }
}

let globalTracker: SessionBusyTracker | null = null;

export function getSessionBusyTracker(): SessionBusyTracker {
  if (!globalTracker) {
    globalTracker = new SessionBusyTracker();
  }
  return globalTracker;
}
