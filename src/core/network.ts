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
