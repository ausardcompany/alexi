/**
 * Provider Errors
 * Standard error types for provider configuration and usage
 */

export class ProviderError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'ProviderError';
  }
}
