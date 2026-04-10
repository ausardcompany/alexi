/**
 * Network Resilience and Resume After Sleep
 * Handles network errors, retries, and pause/resume for sessions
 */

export namespace Network {
  export interface State {
    isOnline: boolean;
    lastError?: Error;
    retryCount: number;
    maxRetries: number;
    backoffMs: number;
  }

  export const initialState: State = {
    isOnline: true,
    retryCount: 0,
    maxRetries: 5,
    backoffMs: 1000,
  };

  export class NetworkError extends Error {
    constructor(
      message: string,
      public readonly code: string,
      public readonly isRetryable: boolean = true
    ) {
      super(message);
      this.name = 'NetworkError';
    }
  }

  export const isNetworkError = (error: unknown): error is NetworkError => {
    if (error instanceof NetworkError) return true;
    if (error instanceof Error) {
      const networkCodes = ['ECONNRESET', 'ECONNREFUSED', 'ETIMEDOUT', 'ENOTFOUND', 'EAI_AGAIN'];
      return networkCodes.some((code) => error.message.includes(code));
    }
    return false;
  };

  export interface RetryOptions {
    maxRetries?: number;
    baseDelay?: number;
  }

  /**
   * Retry a function with exponential backoff
   */
  export async function withRetry<T>(
    fn: () => Promise<T>,
    options: RetryOptions = {}
  ): Promise<T> {
    const { maxRetries = 5, baseDelay = 1000 } = options;
    let lastError: Error | undefined;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));

        if (!isNetworkError(lastError) || attempt === maxRetries) {
          throw lastError;
        }

        // Exponential backoff
        const delay = baseDelay * Math.pow(2, attempt);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    throw new NetworkError(
      `Network request failed after ${maxRetries} retries: ${lastError?.message}`,
      'MAX_RETRIES_EXCEEDED',
      false
    );
  }

  /**
   * Wait for network to be restored
   */
  export async function waitForNetwork(): Promise<void> {
    const checkInterval = 5000; // 5 seconds
    const maxWaitTime = 300000; // 5 minutes
    const startTime = Date.now();

    while (Date.now() - startTime < maxWaitTime) {
      const isOnline = await checkConnectivity();
      if (isOnline) {
        return;
      }
      await new Promise((resolve) => setTimeout(resolve, checkInterval));
    }

    throw new NetworkError('Network not restored after maximum wait time', 'NETWORK_TIMEOUT', false);
  }

  /**
   * Check network connectivity
   */
  export async function checkConnectivity(): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);

      try {
        // Try to reach a reliable endpoint
        await fetch('https://api.anthropic.com/v1/models', {
          method: 'HEAD',
          signal: controller.signal,
        });
        return true;
      } finally {
        clearTimeout(timeout);
      }
    } catch {
      return false;
    }
  }

  /**
   * Handle network error with automatic retry
   */
  export async function handleNetworkError<T>(
    error: unknown,
    retryFn: () => Promise<T>,
    options: RetryOptions = {}
  ): Promise<T> {
    if (!isNetworkError(error)) {
      throw error;
    }

    // Wait for network to be restored
    await waitForNetwork();

    // Retry the operation
    return withRetry(retryFn, options);
  }
}
