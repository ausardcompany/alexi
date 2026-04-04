/**
 * Session Headers Utilities
 * Provides session affinity and parent session tracking for load-balanced deployments
 */

export interface SessionHeaders {
  'x-session-affinity'?: string;
  'x-parent-session-id'?: string;
}

export interface SessionContext {
  sessionID: string;
  parentSessionID?: string;
}

/**
 * Build session headers for HTTP requests
 * These headers enable better session tracking and routing for load-balanced deployments
 */
export function buildSessionHeaders(sessionID: string, parentSessionID?: string): SessionHeaders {
  const headers: SessionHeaders = {
    'x-session-affinity': sessionID,
  };

  if (parentSessionID) {
    headers['x-parent-session-id'] = parentSessionID;
  }

  return headers;
}

/**
 * Build session headers from context object
 */
export function buildSessionHeadersFromContext(context: SessionContext): SessionHeaders {
  return buildSessionHeaders(context.sessionID, context.parentSessionID);
}

/**
 * Merge session headers with existing headers
 */
export function mergeSessionHeaders(
  existingHeaders: Record<string, string>,
  sessionContext?: SessionContext
): Record<string, string> {
  if (!sessionContext) {
    return existingHeaders;
  }

  const sessionHeaders = buildSessionHeadersFromContext(sessionContext);
  return {
    ...existingHeaders,
    ...sessionHeaders,
  };
}
