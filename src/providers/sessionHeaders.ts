/**
 * Session Headers Utilities
 * Provides session affinity and parent session tracking for load-balanced deployments
 */

export interface SessionHeaders {
  'x-session-affinity'?: string;
  'x-parent-session-id'?: string;
  'x-alexi-agent-id'?: string;
  'x-alexi-parent-agent-id'?: string;
}

export interface SessionContext {
  sessionID: string;
  parentSessionID?: string;
  agentID?: string;
  parentAgentID?: string;
}

/**
 * Build session headers for HTTP requests
 * These headers enable better session tracking and routing for load-balanced deployments
 */
export function buildSessionHeaders(
  sessionID: string,
  parentSessionID?: string,
  agentID?: string,
  parentAgentID?: string
): SessionHeaders {
  const headers: SessionHeaders = {
    'x-session-affinity': sessionID,
  };

  if (parentSessionID) {
    headers['x-parent-session-id'] = parentSessionID;
  }

  if (agentID) {
    headers['x-alexi-agent-id'] = agentID;
  }

  if (parentAgentID) {
    headers['x-alexi-parent-agent-id'] = parentAgentID;
  }

  return headers;
}

/**
 * Build session headers from context object
 */
export function buildSessionHeadersFromContext(context: SessionContext): SessionHeaders {
  return buildSessionHeaders(
    context.sessionID,
    context.parentSessionID,
    context.agentID,
    context.parentAgentID
  );
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
