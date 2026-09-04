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
  /**
   * Session-scoped request correlation header. Ports the opencode
   * `X-Interaction-Id: <sessionID>` pattern (upstream feature #47215):
   * useful for SAP AI Core telemetry / distributed-tracing so a request
   * captured in server logs can be traced back to the originating Alexi
   * session. Purely additive and non-breaking — servers that do not
   * consume it simply ignore the header.
   */
  'X-Interaction-Id'?: string;
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
 *
 * Also attaches the `X-Interaction-Id` correlation header (opencode
 * #47215): downstream services that already understand the
 * `X-Interaction-Id` convention can join their request logs to Alexi's
 * session id without any extra plumbing.
 */
export function buildSessionHeaders(
  sessionID: string,
  parentSessionID?: string,
  agentId?: string,
  parentAgentId?: string
): SessionHeaders {
  const headers: SessionHeaders = {
    'x-session-affinity': sessionID,
    // Correlation header — always emitted alongside `x-session-affinity`
    // because the two carry the same value but different semantics
    // (affinity is a routing hint; interaction id is a trace correlation
    // key). Keeping both means SAP AI Core deployments that only look
    // at one of them still get useful signal.
    'X-Interaction-Id': sessionID,
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
