/**
 * Network Management with Auto-Resume Reconnects
 * Based on kilocode fix(cli): auto-resume network reconnects
 */

import { EventEmitter } from 'events';

interface NetworkState {
  connected: boolean;
  reconnecting: boolean;
  lastError?: Error;
  retryCount: number;
}

export interface NetworkManagerOptions {
  maxRetries?: number;
  baseDelayMs?: number;
  maxDelayMs?: number;
}

/**
 * NetworkManager handles automatic reconnection with exponential backoff
 * Prevents session loss during network interruptions
 */
export class NetworkManager extends EventEmitter {
  private state: NetworkState = {
    connected: true,
    reconnecting: false,
    retryCount: 0,
  };

  private readonly maxRetries: number;
  private readonly baseDelayMs: number;
  private readonly maxDelayMs: number;
  private reconnectTimer?: NodeJS.Timeout;

  constructor(options: NetworkManagerOptions = {}) {
    super();
    this.maxRetries = options.maxRetries ?? 5;
    this.baseDelayMs = options.baseDelayMs ?? 1000;
    this.maxDelayMs = options.maxDelayMs ?? 30000;
  }

  /**
   * Auto-resume network reconnects with exponential backoff
   * Ported from kilocode fix(cli): auto-resume network reconnects
   */
  async reconnect(): Promise<void> {
    if (this.state.reconnecting) {
      return;
    }

    this.state.reconnecting = true;
    this.state.connected = false;
    this.state.retryCount = 0;

    await this.attemptReconnectWithBackoff();
  }

  private async attemptReconnectWithBackoff(): Promise<void> {
    while (this.state.retryCount < this.maxRetries) {
      try {
        this.emitReconnectAttempt(this.state.retryCount + 1);

        await this.attemptConnection();

        // Success - reset state
        this.state.connected = true;
        this.state.reconnecting = false;
        this.state.retryCount = 0;
        this.state.lastError = undefined;
        this.emitReconnected();
        return;
      } catch (error) {
        this.state.lastError = error as Error;
        this.state.retryCount++;

        if (this.state.retryCount >= this.maxRetries) {
          // Max retries exceeded
          this.state.reconnecting = false;
          this.emitReconnectFailed(error as Error);
          throw new NetworkError('Max reconnection attempts exceeded', { cause: error });
        }

        // Calculate exponential backoff delay
        const delay = Math.min(
          this.baseDelayMs * Math.pow(2, this.state.retryCount - 1),
          this.maxDelayMs
        );

        // Wait before next attempt
        await new Promise((resolve) => {
          this.reconnectTimer = setTimeout(resolve, delay);
        });
      }
    }
  }

  private async attemptConnection(): Promise<void> {
    // Override this method in subclasses to implement actual connection logic
    throw new Error('attemptConnection must be implemented by subclass');
  }

  /**
   * Cancel ongoing reconnection attempts
   */
  cancelReconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = undefined;
    }
    this.state.reconnecting = false;
  }

  /**
   * Get current network state
   */
  getState(): Readonly<NetworkState> {
    return { ...this.state };
  }

  /**
   * Check if currently connected
   */
  isConnected(): boolean {
    return this.state.connected;
  }

  /**
   * Check if currently reconnecting
   */
  isReconnecting(): boolean {
    return this.state.reconnecting;
  }

  private emitReconnectAttempt(attempt: number): void {
    this.emit('reconnect:attempt', { attempt, maxRetries: this.maxRetries });
  }

  private emitReconnected(): void {
    this.emit('reconnect:success', {});
  }

  private emitReconnectFailed(error: Error): void {
    this.emit('reconnect:failed', { error });
  }
}

export class NetworkError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = 'NetworkError';
  }
}

/**
 * Classification for a suspected network-transport failure. Used by the
 * TUI/CLI to surface disconnects as a user-visible error instead of
 * silently hanging on a never-resolving fetch promise.
 *
 * Ports kilocode fix `d6bb0ef05` — silent hangs on network disconnect
 * hide SAP AI Core outages behind a spinner that never advances.
 */
export interface NetworkErrorInfo {
  /**
   * High-level bucket for the failure. `unknown` means we recognized the
   * error code family (see `OFFLINE_CODES`) but the specific code doesn't
   * map to a more precise kind.
   */
  kind: 'offline' | 'timeout' | 'dns' | 'reset' | 'unknown';
  /**
   * Human-readable message suitable for surfacing in the TUI status bar
   * or CLI stderr. Callers should NOT strip the underlying error code —
   * it's the fastest way to diagnose whether the outage is DNS, proxy,
   * or the SAP AI Core endpoint itself.
   */
  message: string;
  /**
   * Whether the caller should retry (transient) or bubble up as a hard
   * error (permanent). All entries in `OFFLINE_CODES` are transient.
   */
  retriable: boolean;
}

/**
 * Node/libuv error codes we treat as transport-level failures. Matches
 * the transient regex documented in AGENTS.md so `ErrorBackoff` and the
 * agent-workflow retry loop agree with the TUI's classification.
 */
const OFFLINE_CODES: ReadonlySet<string> = new Set([
  'ENOTFOUND',
  'EAI_AGAIN',
  'ECONNREFUSED',
  'ECONNRESET',
  'ETIMEDOUT',
  'EHOSTUNREACH',
  'ENETUNREACH',
  'EPIPE',
]);

const KIND_MAP: Readonly<Record<string, NetworkErrorInfo['kind']>> = {
  ENOTFOUND: 'dns',
  EAI_AGAIN: 'dns',
  ETIMEDOUT: 'timeout',
  ECONNREFUSED: 'offline',
  ECONNRESET: 'reset',
  EHOSTUNREACH: 'offline',
  ENETUNREACH: 'offline',
  EPIPE: 'reset',
};

/**
 * Attempt to classify an unknown thrown value as a network-transport
 * failure. Returns `undefined` when the error clearly isn't one so the
 * caller can fall through to its normal error path.
 *
 * Walks `err.code` and `err.cause.code` (Node's fetch wraps the
 * underlying `UND_ERR_SOCKET` and libuv codes inside `cause`).
 *
 * alexi_change: surface network disconnects to the TUI/CLI instead of
 * hanging forever on an unresolved SAP AI Core request.
 */
export function classifyNetworkError(err: unknown): NetworkErrorInfo | undefined {
  const code = extractErrorCode(err);
  if (!code || !OFFLINE_CODES.has(code)) {
    return undefined;
  }
  const kind = KIND_MAP[code] ?? 'unknown';
  const baseMessage =
    err instanceof Error && err.message ? err.message : `Network transport failure (${code})`;
  return {
    kind,
    message: `${baseMessage} [${code}]`,
    retriable: true,
  };
}

function extractErrorCode(err: unknown): string | undefined {
  if (!err || typeof err !== 'object') {
    return undefined;
  }
  const record = err as { code?: unknown; cause?: unknown };
  if (typeof record.code === 'string') {
    return record.code;
  }
  if (record.cause && typeof record.cause === 'object') {
    const inner = record.cause as { code?: unknown };
    if (typeof inner.code === 'string') {
      return inner.code;
    }
  }
  return undefined;
}
