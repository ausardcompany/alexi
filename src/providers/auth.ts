/**
 * Provider Authentication Error Types
 * Typed errors for better error handling and user feedback
 */

export class AuthError extends Error {
  constructor(
    message: string,
    readonly provider: string,
    readonly cause?: unknown
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

export class InvalidCredentialsError extends AuthError {
  constructor(provider: string, cause?: unknown) {
    super(`Invalid credentials for provider: ${provider}`, provider, cause);
    this.name = 'InvalidCredentialsError';
  }
}

export class TokenExpiredError extends AuthError {
  constructor(provider: string, cause?: unknown) {
    super(`Authentication token expired for provider: ${provider}`, provider, cause);
    this.name = 'TokenExpiredError';
  }
}

export class MissingCredentialsError extends AuthError {
  constructor(provider: string, readonly missingFields: string[]) {
    super(
      `Missing credentials for provider ${provider}: ${missingFields.join(', ')}`,
      provider
    );
    this.name = 'MissingCredentialsError';
  }
}

export class NetworkError extends AuthError {
  constructor(provider: string, cause?: unknown) {
    super(`Network error while authenticating with provider: ${provider}`, provider, cause);
    this.name = 'NetworkError';
  }
}

export class RateLimitError extends AuthError {
  constructor(
    provider: string,
    readonly retryAfter?: number,
    cause?: unknown
  ) {
    const retryMsg = retryAfter ? ` Retry after ${retryAfter} seconds.` : '';
    super(`Rate limit exceeded for provider: ${provider}.${retryMsg}`, provider, cause);
    this.name = 'RateLimitError';
  }
}

/**
 * Parse error response and return appropriate typed error
 */
export function parseAuthError(error: unknown, provider: string): AuthError {
  if (error instanceof AuthError) {
    return error;
  }

  const message = error instanceof Error ? error.message : String(error);
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes('invalid') && lowerMessage.includes('credential')) {
    return new InvalidCredentialsError(provider, error);
  }

  if (lowerMessage.includes('expired') || lowerMessage.includes('token')) {
    return new TokenExpiredError(provider, error);
  }

  if (lowerMessage.includes('rate limit') || lowerMessage.includes('too many requests')) {
    return new RateLimitError(provider, undefined, error);
  }

  if (
    lowerMessage.includes('network') ||
    lowerMessage.includes('connection') ||
    lowerMessage.includes('timeout')
  ) {
    return new NetworkError(provider, error);
  }

  return new AuthError(message, provider, error);
}
