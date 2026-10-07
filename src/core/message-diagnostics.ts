/**
 * Message / schema diagnostics helpers.
 *
 * Ports the kilocode upstream `packages/opencode/src/kilocode/session/
 * message-diagnostics.ts` (commits `a8fbcc356`, `d99cdbbe2`, `3b5a4de22`,
 * `6c894a552`, `1f093ffed`). The goal of this surface is to let callers
 * log structural information about a `ModelMessage[]` schema failure
 * (which path failed, which code, what kind of value was there) WITHOUT
 * ever including the raw prompt text, tool arguments, or user content —
 * those would be a privacy leak into SAP AI Core observability pipelines.
 *
 * Alexi_change: upstream uses Effect's `Schema` + its `ParseError` shape.
 * Alexi's providers already use `zod`, so this module accepts the usual
 * `ZodError`-ish shape (`.issues` or `.errors`) and defensively guards
 * against anything that pretends to be a zod error but isn't.
 *
 * Everything in here is pure — no logging side-effects — so callers can
 * decide at which level to surface the summary (debug / warn).
 */

/** Shape of a single zod-ish validation issue, trusted at ~zero bytes. */
type ZodLikeIssue = {
  path?: ReadonlyArray<unknown>;
  code?: unknown;
  message?: unknown;
};

/** Upper bound on `path` segments included in a safe path string. */
const MAX_PATH_SEGMENTS = 32;
/** Upper bound on issues included before marking the summary truncated. */
const MAX_ISSUES = 50;
/** Upper bound on how long a serialized `code` string may be before falling back. */
const MAX_CODE_LENGTH = 128;

/** Structural summary of a single issue — no user content. */
export interface SchemaFailureIssue {
  path: string;
  code: string;
  /**
   * The *kind* of the issue's `message` field, NOT the message itself —
   * including the message text would re-introduce the prompt-leak risk
   * because zod sometimes embeds the offending value into its string.
   */
  messageKind: string;
}

/** Return value of {@link summarizeSchemaFailure}. */
export interface SchemaFailureSummary {
  issues: ReadonlyArray<SchemaFailureIssue>;
  truncated: boolean;
}

/**
 * Produce a structural, prompt-free summary of a schema validation
 * failure. Never includes raw message text, tool arguments, or user
 * content, even if the originating `ZodError.issues[i].message` embeds
 * part of the offending value.
 */
export function summarizeSchemaFailure(error: unknown): SchemaFailureSummary {
  const all = extractIssues(error);
  const rawIssues = all.slice(0, MAX_ISSUES);
  const truncated = all.length > MAX_ISSUES;
  return {
    issues: rawIssues.map((issue) => ({
      path: safePath(issue.path),
      code: safeString(issue.code, 'unknown_code'),
      // Only record *kind* of message, not its content, to avoid prompt leak.
      messageKind: typeof issue.message === 'string' ? 'string' : typeof issue.message,
    })),
    truncated,
  };
}

function extractIssues(error: unknown): ZodLikeIssue[] {
  if (!error || typeof error !== 'object') {
    return [];
  }
  const anyErr = error as { issues?: unknown; errors?: unknown };
  const candidate = Array.isArray(anyErr.issues)
    ? anyErr.issues
    : Array.isArray(anyErr.errors)
      ? anyErr.errors
      : [];
  return candidate.filter((i): i is ZodLikeIssue => !!i && typeof i === 'object');
}

function safePath(pathValue: unknown): string {
  if (!Array.isArray(pathValue)) {
    return '<root>';
  }
  return pathValue
    .slice(0, MAX_PATH_SEGMENTS)
    .map((seg) => (typeof seg === 'string' || typeof seg === 'number' ? String(seg) : '?'))
    .join('.');
}

function safeString(value: unknown, fallback: string): string {
  return typeof value === 'string' && value.length < MAX_CODE_LENGTH ? value : fallback;
}

/**
 * Structural summary of a message envelope that excludes any text
 * content. Intended for `logger.debug` / telemetry when a message array
 * fails validation and you need to know *shape* (role mix, part counts,
 * part kinds) without exfiltrating the content itself.
 */
export function summarizeMessageEnvelope(message: unknown): Record<string, unknown> {
  if (!message || typeof message !== 'object') {
    return { shape: typeof message };
  }
  const m = message as Record<string, unknown>;
  const parts = Array.isArray(m.parts) ? m.parts : [];
  return {
    role: typeof m.role === 'string' ? m.role : '<missing>',
    partCount: parts.length,
    partKinds: parts.slice(0, 20).map((p) => {
      if (p && typeof p === 'object') {
        const t = (p as Record<string, unknown>).type;
        return typeof t === 'string' ? t : '?';
      }
      return typeof p;
    }),
    hasId: typeof m.id === 'string',
  };
}

/**
 * Convenience helper combining both summaries — intended for a
 * `logger.warn` call site at the point where a `ModelMessage[]` fails
 * schema validation before being sent to a provider.
 */
export function summarizeMessageArrayFailure(
  messages: unknown,
  error: unknown
): {
  schemaFailure: SchemaFailureSummary;
  messageShapes: ReadonlyArray<Record<string, unknown>>;
  truncatedMessages: boolean;
} {
  const MAX_MESSAGES = 20;
  const list = Array.isArray(messages) ? messages : [];
  const shapes = list.slice(0, MAX_MESSAGES).map(summarizeMessageEnvelope);
  return {
    schemaFailure: summarizeSchemaFailure(error),
    messageShapes: shapes,
    truncatedMessages: list.length > MAX_MESSAGES,
  };
}
