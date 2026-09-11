/**
 * Mistake Tracker - detect consecutive tool-call failures
 *
 * Separate from the loop detector: this one counts successive tool
 * failures regardless of whether the underlying tool call is identical.
 * A rapid sequence of unrelated failures often means the model is
 * flailing (bad file paths, wrong syntax, permission errors) rather than
 * looping on a single stuck call.
 *
 * Ports the concept from Kilocode #13969 (upstream user-steering prompt).
 */
export interface MistakeTrackerOptions {
  /**
   * Number of consecutive tool failures that trip the tracker.
   * Default: 6.
   */
  limit?: number;
}

export class MistakeTracker {
  private readonly limit: number;
  private consecutive = 0;

  constructor(options?: MistakeTrackerOptions) {
    this.limit = options?.limit ?? 6;
    if (!Number.isInteger(this.limit) || this.limit < 2) {
      throw new Error(`MistakeTracker: limit must be an integer >= 2 (got ${this.limit})`);
    }
  }

  /**
   * Record a tool result. Increments the consecutive counter on failure,
   * resets to zero on success. This mirrors `ErrorBackoff.recordSuccess`.
   */
  record(success: boolean): void {
    if (success) {
      this.consecutive = 0;
    } else {
      this.consecutive += 1;
    }
  }

  /** True when the tracker has observed `limit` consecutive failures. */
  hasTripped(): boolean {
    return this.consecutive >= this.limit;
  }

  /**
   * Clear the tracker's state. Called after the user chooses to continue
   * so the same run does not re-trip immediately on the next failure.
   */
  reset(): void {
    this.consecutive = 0;
  }

  /** Current consecutive failure count. Exposed for logging / diagnostics. */
  getConsecutiveCount(): number {
    return this.consecutive;
  }

  /** Configured trip limit. */
  getLimit(): number {
    return this.limit;
  }
}
