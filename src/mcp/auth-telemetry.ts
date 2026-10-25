/**
 * MCP sign-in telemetry pairing.
 *
 * Ports upstream kilocode commits `7e789bbee`, `df98111b3`, `60f1ad7f1`,
 * and `df43b6526` ("MCP sign-in telemetry hardening"). Every
 * `sign_in_start` event MUST be paired with exactly one terminal
 * `sign_in_complete` event (`success | failure | interrupt | displaced`)
 * so dashboards computing success rates aren't biased by orphaned
 * `start` events from aborted flows.
 *
 * Problem the upstream fix addresses:
 *   - Operator starts a sign-in flow for server A, cancels the browser
 *     tab, retries → the first flow was never closed, so the second
 *     start event has a duplicate `flowId` or the metrics show "N
 *     starts, N-k completes" permanently.
 *   - Operator starts a sign-in for the SAME server while another
 *     flow is in-flight → the older flow is "displaced" and must be
 *     closed as such so success-rate math stays sane.
 *
 * SAP AI Core note: SAP AI Core uses `AICORE_SERVICE_KEY`
 * client-credentials auth and never emits sign-in events. This
 * telemetry surface is only exercised by third-party OAuth-protected
 * MCP servers; everything in this module is a pure state machine with
 * no cost when sign-in is unused.
 *
 * This module is deliberately transport-agnostic: callers inject an
 * {@link EmitFn} to forward events to whatever metrics sink Alexi is
 * configured against (OpenTelemetry, Langfuse, local JSON log, …).
 * No I/O is performed inside the tracker.
 */

/** Terminal outcomes for a sign-in flow. */
export type SignInOutcome = 'success' | 'failure' | 'interrupt' | 'displaced';

/** Shape of the event payload forwarded to the metrics sink. */
export interface SignInEvent {
  /** Event kind: lifecycle start, or one of the terminal outcomes. */
  kind: 'start' | 'complete';
  /** Flow id — unique per start, re-used by the matching complete. */
  flowId: string;
  /** Server id the sign-in flow is attributed to. */
  serverId: string;
  /** Outcome bucket — only set for `kind === 'complete'`. */
  outcome?: SignInOutcome;
  /** Wall-clock duration from start to complete, in ms. */
  durationMs?: number;
  /** Optional free-form error context when `outcome !== 'success'`. */
  error?: string;
}

/** Function signature callers use to forward events to a sink. */
export type EmitFn = (event: SignInEvent) => void;

interface InflightFlow {
  flowId: string;
  serverId: string;
  startedAt: number;
}

/**
 * Pairs `sign_in_start` events with exactly one terminal
 * `sign_in_complete` event per flow.
 *
 * Invariants:
 *   - At most one in-flight flow per `serverId`. A new start for the
 *     same server auto-closes the previous one as `'displaced'`.
 *   - `complete(flowId, ...)` is idempotent: a second call for the
 *     same flow is a silent no-op (so caller cleanup code can be
 *     dumb without risk of double-counting).
 *   - A tracker shutdown closes every outstanding flow as
 *     `'interrupt'` so operators see the flow timed out instead of
 *     the dashboard silently losing events.
 */
export class McpAuthTelemetry {
  private readonly inflight = new Map<string, InflightFlow>();
  private readonly emit: EmitFn;
  private readonly now: () => number;

  constructor(emit: EmitFn, now: () => number = Date.now) {
    this.emit = emit;
    this.now = now;
  }

  /**
   * Begin a sign-in flow. If a flow for the same `serverId` is already
   * in-flight, close it as `'displaced'` first so metrics stay paired.
   */
  start(flowId: string, serverId: string): void {
    // Displace any existing flow for the same server.
    for (const [existingFlowId, meta] of this.inflight) {
      if (meta.serverId === serverId) {
        this.complete(existingFlowId, 'displaced');
      }
    }
    this.inflight.set(flowId, { flowId, serverId, startedAt: this.now() });
    this.emit({ kind: 'start', flowId, serverId });
  }

  /**
   * Terminate a sign-in flow with the given `outcome`. Silent no-op
   * when the flow is unknown (already completed, or never started).
   */
  complete(flowId: string, outcome: SignInOutcome, error?: string): void {
    const meta = this.inflight.get(flowId);
    if (!meta) {
      return;
    }
    this.inflight.delete(flowId);
    this.emit({
      kind: 'complete',
      flowId: meta.flowId,
      serverId: meta.serverId,
      outcome,
      durationMs: this.now() - meta.startedAt,
      ...(error ? { error } : {}),
    });
  }

  /**
   * Return the number of in-flight flows. Primarily useful for tests
   * and shutdown diagnostics; dashboards should rely on the event
   * stream, not this gauge.
   */
  inflightCount(): number {
    return this.inflight.size;
  }

  /**
   * Close every outstanding flow as `'interrupt'`. Call this from
   * Alexi's shutdown path (SIGINT / server stop) so a hung sign-in
   * flow is reflected in the metrics instead of leaking across runs.
   */
  shutdown(): void {
    // Snapshot keys first so complete()'s mutation doesn't invalidate
    // the iterator.
    const flows = Array.from(this.inflight.keys());
    for (const flowId of flows) {
      this.complete(flowId, 'interrupt');
    }
  }
}
