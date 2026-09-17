/**
 * Session Busy State Management
 * Centralized handling for session busy errors
 *
 * Alexi_change (upstream kilocode `88d23150b` + `e31aa5769`): the busy-state
 * transitions now follow a "clear-before-publish, write-after-publish"
 * ordering so a failed publication cannot wedge the session in a stale
 * busy state. This fixes the "stale session status blocks reload"
 * regression where a crashed / interrupted publish left the in-memory
 * tracker holding a phantom busy entry, blocking every subsequent turn.
 *
 * The transition contract is:
 *   - `markFree` (terminal transition to idle) clears the state FIRST,
 *     THEN publishes. A publish failure still leaves the session free —
 *     preferred over leaving it wedged.
 *   - `markBusy` publishes FIRST, and only persists the busy state on
 *     successful publication. If publication throws, the busy entry is
 *     rolled back so a retry can succeed.
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
 * Session busy-state transitions observed by publish callbacks.
 * Callers wire a publisher (event bus emit, WebSocket broadcast, etc.)
 * via {@link SessionBusyTracker.setPublisher} — the tracker invokes it
 * with the desired terminal state so downstream consumers see the
 * transition in the same order as the in-memory store.
 */
export type SessionBusyStatus = 'busy' | 'idle';

export interface SessionBusyStatusEvent {
  sessionId: string;
  status: SessionBusyStatus;
  operation?: string;
}

export type SessionBusyPublisher = (event: SessionBusyStatusEvent) => void | Promise<void>;

/**
 * Track busy sessions to prevent concurrent operations.
 *
 * The internal store ordering is important:
 *   - `markBusy` publishes BEFORE persisting; on publish failure the
 *     entry is rolled back so a retry can succeed. This mirrors upstream
 *     kilocode `e31aa5769` "keep busy status writes after successful
 *     publication".
 *   - `markFree` clears BEFORE publishing so a failed idle publish never
 *     leaves the session wedged in busy state (upstream `88d23150b`).
 */
class SessionBusyTracker {
  private busySessions = new Map<string, string>();
  private publisher?: SessionBusyPublisher;

  /**
   * Attach a publisher invoked on every busy/idle transition. Setting a
   * new publisher replaces the previous one; pass `undefined` to detach.
   * The publisher is optional: when unset, the tracker behaves as a
   * plain in-memory Map (backwards-compatible with older callers).
   */
  setPublisher(publisher: SessionBusyPublisher | undefined): void {
    this.publisher = publisher;
  }

  /**
   * Mark a session as busy with `operation`. Throws {@link SessionBusyError}
   * synchronously when the session is already busy — matching the
   * historical contract callers rely on.
   *
   * When a publisher is configured, the busy event is published FIRST.
   * Only on successful publication is the busy entry recorded in the
   * store. If publication throws, the tracker stays clear and the
   * caller can retry without hitting a phantom busy error.
   */
  markBusy(sessionId: string, operation: string): void {
    if (this.isBusy(sessionId)) {
      throw new SessionBusyError(sessionId, this.busySessions.get(sessionId)!);
    }

    // Publish FIRST. If the publisher throws, we intentionally do NOT
    // persist the busy entry — that avoids the "stale busy after
    // failed publish" wedge upstream kilocode `e31aa5769` fixed.
    if (this.publisher) {
      try {
        const result = this.publisher({ sessionId, status: 'busy', operation });
        // Fire-and-forget for async publishers: we don't await here to
        // preserve the synchronous contract callers depend on. A
        // rejected promise still surfaces via the unhandledRejection
        // channel, but does not roll back the local state — that would
        // require making `markBusy` async, a wider API change.
        if (result && typeof (result as Promise<void>).catch === 'function') {
          (result as Promise<void>).catch((err) => {
            // Best-effort rollback on async publisher failure. If
            // another `markBusy` already reused this sessionId slot,
            // do NOT clobber it.
            if (this.busySessions.get(sessionId) === operation) {
              this.busySessions.delete(sessionId);
            }
            // eslint-disable-next-line no-console
            console.warn(
              `Failed to publish busy event for session ${sessionId}:`,
              err instanceof Error ? err.message : String(err)
            );
          });
        }
      } catch (err) {
        // Synchronous publisher failure: leave store clear and rethrow
        // so the caller sees the failure instead of a silent wedge.
        throw err instanceof Error
          ? err
          : new Error(`Failed to publish busy event: ${String(err)}`);
      }
    }

    this.busySessions.set(sessionId, operation);
  }

  /**
   * Mark a session as free (terminal idle transition). The in-memory
   * entry is cleared BEFORE the publisher runs so a publisher failure
   * cannot leave the session wedged in busy state. Publisher errors
   * are logged and swallowed — freeing a session must never fail from
   * the caller's perspective.
   */
  markFree(sessionId: string): void {
    // Clear FIRST — even if publish fails, the session is free.
    const wasBusy = this.busySessions.delete(sessionId);
    if (!wasBusy || !this.publisher) {
      return;
    }

    try {
      const result = this.publisher({ sessionId, status: 'idle' });
      if (result && typeof (result as Promise<void>).catch === 'function') {
        (result as Promise<void>).catch((err) => {
          // eslint-disable-next-line no-console
          console.warn(
            `Failed to publish idle event for session ${sessionId}:`,
            err instanceof Error ? err.message : String(err)
          );
        });
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn(
        `Failed to publish idle event for session ${sessionId}:`,
        err instanceof Error ? err.message : String(err)
      );
    }
  }

  isBusy(sessionId: string): boolean {
    return this.busySessions.has(sessionId);
  }

  getCurrentOperation(sessionId: string): string | undefined {
    return this.busySessions.get(sessionId);
  }

  /**
   * Test-only: forcibly clear every busy entry and detach any
   * configured publisher. Not exposed on the public getter helper.
   */
  reset(): void {
    this.busySessions.clear();
    this.publisher = undefined;
  }
}

let globalTracker: SessionBusyTracker | null = null;

export function getSessionBusyTracker(): SessionBusyTracker {
  if (!globalTracker) {
    globalTracker = new SessionBusyTracker();
  }
  return globalTracker;
}

/**
 * Test-only helper to reset the process-global tracker. Production code
 * should not call this — it exists so tests that assert on transition
 * ordering can start from a clean slate.
 */
export function resetSessionBusyTracker(): void {
  globalTracker?.reset();
  globalTracker = null;
}
