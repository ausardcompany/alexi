/**
 * PromptQueue — append-only queue for user prompts that arrive while a
 * long-running agent goal is in flight.
 *
 * Mirrors kilocode upstream fix (`5665631ab fix(cli): keep a session goal
 * running when a message arrives` + `60bb54b0f fix(cli): harden goal
 * preemption handling and test`): a new inbound prompt must NOT cancel
 * an active goal. Instead the prompt is queued and drained after the
 * current turn finishes. Explicit user-initiated interrupts (Ctrl+C /
 * `/stop`) stay a separate path via `interrupt()`.
 *
 * The queue is intentionally minimal — Alexi's interactive REPL and
 * headless session drivers wire their own concrete goal/turn types on
 * top; this module only owns the enqueue-vs-preempt policy so it can
 * be unit tested in isolation and reused across drivers.
 */
export interface QueuedPrompt {
  /** Free-form user text (whatever `sendChat` would accept). */
  text: string;
  /** Wall-clock timestamp of when the prompt was enqueued. */
  enqueuedAt: number;
  /**
   * Free-form metadata; the caller decides the shape. Kept as
   * `Record<string, unknown>` (not `unknown`) so common tags like
   * `{ source: 'stdin' }` don't require awkward casts on read.
   */
  metadata?: Record<string, unknown>;
}

export interface ActiveGoalHandle {
  /** Stable id — used for structured logging so multiple in-flight
   * goals across driver instances can be told apart. */
  id: string;
  /**
   * Explicit cancel path. Only invoked by `interrupt()` (Ctrl+C /
   * `/stop` / abort), NEVER by `enqueue()`. Callers pass a reason
   * string so logs can distinguish user-initiated cancels from
   * error-driven ones.
   */
  cancel: (reason: string) => void;
}

/**
 * Optional structured logger. Defaults to `console.debug` when omitted
 * so unit tests can silence it by passing a no-op. Kept off the
 * `utils/logger` import path so this module has zero dependency on
 * the rest of the repo — the enqueue policy is pure.
 */
export type QueueLogger = (
  event: string,
  fields?: Record<string, unknown>
) => void;

export interface PromptQueueOptions {
  logger?: QueueLogger;
  /**
   * Called when a new prompt is enqueued while a goal is active. Purely
   * informational — the queue itself never triggers drain; the driver
   * decides when to call `drain()` (typically once the active goal
   * settles).
   */
  onQueuedBehindGoal?: (prompt: QueuedPrompt, goalId: string) => void;
}

export class PromptQueue {
  private readonly queue: QueuedPrompt[] = [];
  private activeGoal: ActiveGoalHandle | null = null;
  private readonly log: QueueLogger;
  private readonly onQueuedBehindGoal?: (prompt: QueuedPrompt, goalId: string) => void;

  constructor(options: PromptQueueOptions = {}) {
    this.log =
      options.logger ??
      ((_event: string, _fields?: Record<string, unknown>) => {
        /* silent default — the CLI attaches its own logger */
      });
    this.onQueuedBehindGoal = options.onQueuedBehindGoal;
  }

  /**
   * Register a goal as active. Callers should invoke `finish()` when
   * the goal settles (success, cancel, or error) so the queue knows
   * the next `enqueue()` should be drained immediately again.
   */
  startGoal(handle: ActiveGoalHandle): void {
    this.activeGoal = handle;
    this.log('prompt-queue.goal-started', { goalId: handle.id });
  }

  /**
   * Mark the active goal as finished. Idempotent — safe to call in
   * `finally` blocks even if `startGoal` was not called.
   */
  finishGoal(): void {
    if (!this.activeGoal) {
      return;
    }
    const goalId = this.activeGoal.id;
    this.activeGoal = null;
    this.log('prompt-queue.goal-finished', { goalId });
  }

  /**
   * Whether a goal is currently in flight.
   */
  hasActiveGoal(): boolean {
    return this.activeGoal !== null;
  }

  /**
   * Enqueue a user prompt.
   *
   * **CRITICAL**: this method never cancels an active goal. That was the
   * upstream bug (kilocode `5665631ab`) — a new inbound prompt would
   * preempt the goal mid-turn, throwing away partial work. The correct
   * behaviour is to append and wait; the driver drains the queue after
   * the active goal completes.
   */
  enqueue(prompt: QueuedPrompt): void {
    this.queue.push(prompt);
    if (this.activeGoal) {
      this.log('prompt-queue.queued-behind-goal', {
        goalId: this.activeGoal.id,
        queueSize: this.queue.length,
      });
      this.onQueuedBehindGoal?.(prompt, this.activeGoal.id);
    } else {
      this.log('prompt-queue.enqueued', { queueSize: this.queue.length });
    }
  }

  /**
   * Explicit user-initiated interrupt. This IS the code path that cancels
   * the active goal — Ctrl+C, `/stop`, abort signals. Separate from
   * `enqueue()` on purpose so a message-arrival can never masquerade as
   * an interrupt.
   */
  interrupt(reason: string): void {
    if (!this.activeGoal) {
      return;
    }
    const goalId = this.activeGoal.id;
    this.log('prompt-queue.interrupt', { goalId, reason });
    // Snapshot the handle before nulling so a slow cancel implementation
    // cannot race with `finishGoal()`.
    const handle = this.activeGoal;
    this.activeGoal = null;
    handle.cancel(reason);
  }

  /**
   * Drain the queue. Returns all queued prompts in enqueue order and
   * clears the internal buffer. Typically called by the driver once
   * `finishGoal()` has been invoked so drained prompts are picked up
   * on the next turn.
   */
  drain(): QueuedPrompt[] {
    if (this.queue.length === 0) {
      return [];
    }
    const drained = this.queue.splice(0, this.queue.length);
    this.log('prompt-queue.drained', { count: drained.length });
    return drained;
  }

  /**
   * Number of queued prompts (does not include any in-flight goal).
   * Useful for status-bar / prompt indicators.
   */
  size(): number {
    return this.queue.length;
  }
}
