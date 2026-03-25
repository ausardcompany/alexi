/**
 * Error Backoff System
 * Circuit breaker and exponential backoff for handling API errors gracefully
 */

export interface BackoffConfig {
  initialDelayMs: number;
  maxDelayMs: number;
  multiplier: number;
  maxRetries: number;
}

export class ErrorBackoff {
  private consecutiveErrors = 0;
  private backoffUntil: number | null = null;
  private fatalNotified = false;

  private readonly config: BackoffConfig;

  constructor(config: Partial<BackoffConfig> = {}) {
    this.config = {
      initialDelayMs: config.initialDelayMs ?? 1000,
      maxDelayMs: config.maxDelayMs ?? 60000,
      multiplier: config.multiplier ?? 2,
      maxRetries: config.maxRetries ?? 5,
    };
  }

  recordError(statusCode?: number): void {
    this.consecutiveErrors++;

    // Check for fatal errors (4xx client errors)
    if (statusCode && statusCode >= 400 && statusCode < 500) {
      this.fatalNotified = true;
    }

    const delay = Math.min(
      this.config.initialDelayMs * Math.pow(this.config.multiplier, this.consecutiveErrors - 1),
      this.config.maxDelayMs
    );
    this.backoffUntil = Date.now() + delay;
  }

  recordSuccess(): void {
    this.consecutiveErrors = 0;
    this.backoffUntil = null;
  }

  reset(): void {
    this.consecutiveErrors = 0;
    this.backoffUntil = null;
    this.fatalNotified = false;
  }

  shouldBackoff(): boolean {
    if (this.backoffUntil === null) return false;
    return Date.now() < this.backoffUntil;
  }

  getRemainingBackoffMs(): number {
    if (this.backoffUntil === null) return 0;
    return Math.max(0, this.backoffUntil - Date.now());
  }

  isFatal(): boolean {
    return this.fatalNotified;
  }

  getConsecutiveErrors(): number {
    return this.consecutiveErrors;
  }
}

/**
 * Extract status code from error messages
 */
export function extractStatusCode(errorMessage: string): number | undefined {
  // Anchor to colon to avoid false matches, restrict to 4xx/5xx
  const match = errorMessage.match(/status:\s*([45]\d{2})\b/);
  return match ? parseInt(match[1], 10) : undefined;
}
