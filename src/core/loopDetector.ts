/**
 * Loop Detector - detect repeated identical tool calls
 *
 * When an LLM gets stuck it often re-emits the exact same tool call over and
 * over — same tool name, same arguments — expecting a different result. This
 * detector fingerprints each observed tool call (name + normalized JSON
 * arguments) and reports a loop once N identical calls have been observed
 * consecutively.
 *
 * Ports the concept from Kilocode #13969 (upstream user-steering prompt).
 * Unlike the upstream implementation, this detector is provider-agnostic and
 * has no dependency on the tool execution loop — the caller drives it by
 * calling `record()` after each tool dispatch and checking `hasTripped()`.
 */
export interface LoopDetectorOptions {
  /**
   * Number of consecutive identical tool calls that trip the detector.
   * Default: 5.
   */
  limit?: number;
}

export class LoopDetector {
  private readonly limit: number;
  private lastFingerprint: string | null = null;
  private consecutive = 0;

  constructor(options?: LoopDetectorOptions) {
    this.limit = options?.limit ?? 5;
    if (!Number.isInteger(this.limit) || this.limit < 2) {
      throw new Error(`LoopDetector: limit must be an integer >= 2 (got ${this.limit})`);
    }
  }

  /**
   * Record a tool invocation. `argumentsJson` is used verbatim as part of
   * the fingerprint; callers should pass the raw arguments string emitted
   * by the model. If arguments cannot be normalised (invalid JSON), the
   * raw string is used, which is still a correct fingerprint because two
   * invocations with identical malformed JSON are still identical.
   */
  record(toolName: string, argumentsJson: string): void {
    const fingerprint = this.fingerprint(toolName, argumentsJson);
    if (fingerprint === this.lastFingerprint) {
      this.consecutive += 1;
    } else {
      this.lastFingerprint = fingerprint;
      this.consecutive = 1;
    }
  }

  /**
   * True when the detector has observed `limit` identical calls in a row.
   */
  hasTripped(): boolean {
    return this.consecutive >= this.limit;
  }

  /**
   * Clear the detector's state. Called after the user chooses to continue
   * so the same run does not re-trip on the next tool call.
   */
  reset(): void {
    this.lastFingerprint = null;
    this.consecutive = 0;
  }

  /** Current consecutive count. Exposed for logging / diagnostics. */
  getConsecutiveCount(): number {
    return this.consecutive;
  }

  /** Configured trip limit. */
  getLimit(): number {
    return this.limit;
  }

  private fingerprint(toolName: string, argumentsJson: string): string {
    // Try to parse and re-stringify with sorted keys so semantically
    // identical calls with different key ordering still fingerprint the
    // same way. Fall back to the raw string when parsing fails.
    try {
      const parsed = JSON.parse(argumentsJson) as unknown;
      return `${toolName}:${stableStringify(parsed)}`;
    } catch {
      return `${toolName}:${argumentsJson}`;
    }
  }
}

function stableStringify(value: unknown): string {
  if (value === null || typeof value !== 'object') {
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) {
    return `[${value.map((v) => stableStringify(v)).join(',')}]`;
  }
  const entries = Object.entries(value as Record<string, unknown>).sort(([a], [b]) =>
    a < b ? -1 : a > b ? 1 : 0
  );
  return `{${entries.map(([k, v]) => `${JSON.stringify(k)}:${stableStringify(v)}`).join(',')}}`;
}
