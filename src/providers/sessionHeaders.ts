/**
 * Session Headers Utilities
 * Provides session affinity, parent session tracking, and agent observability
 * headers for load-balanced deployments and multi-agent tracing.
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
  agentId?: string;
  parentAgentId?: string;
}

/**
 * Build session headers for HTTP requests
 * These headers enable better session tracking and routing for load-balanced deployments,
 * as well as agent identity tracing for multi-agent observability.
 */
export function buildSessionHeaders(
  sessionID: string,
  parentSessionID?: string,
  agentId?: string,
  parentAgentId?: string
): SessionHeaders {
  const headers: SessionHeaders = {
    'x-session-affinity': sessionID,
  };

  if (parentSessionID) {
    headers['x-parent-session-id'] = parentSessionID;
  }

  if (agentId) {
    headers['x-alexi-agent-id'] = agentId;
  }

  if (parentAgentId) {
    headers['x-alexi-parent-agent-id'] = parentAgentId;
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
    context.agentId,
    context.parentAgentId
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
