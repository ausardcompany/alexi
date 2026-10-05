/**
 * MCP response validator.
 *
 * Validates MCP server responses against the JSON-RPC 2.0 envelope spec
 * and the per-method result shapes defined by the MCP protocol. Emits
 * actionable violation strings rather than throwing so callers can
 * decide between warn / disable / drop semantics on their own.
 *
 * This module complements `src/mcp/cimd.ts` (which validates CAPABILITY
 * drift against a pinned manifest). The CIMD surface here answers a
 * different question: "did this specific response conform to the wire
 * protocol?" — detecting bugs in the external server implementation
 * rather than breaking contract changes.
 *
 * Naming note
 * -----------
 * The issue references the acronym "CIMD" (Compatibility and Breakage
 * Detection). We deliberately avoid re-using that acronym here because
 * `src/mcp/cimd.ts` already owns it for the Capability Interface
 * Metadata Document surface. Call sites should import from
 * `./validator.js` by its explicit name.
 */

import { z } from 'zod';

/**
 * Result of a single response validation pass. `valid` is `true` when
 * `violations` is empty. The caller is responsible for logging and for
 * recording the violation against a breakage tracker when appropriate.
 */
export interface ValidationResult {
  valid: boolean;
  violations: string[];
}

/**
 * JSON-RPC 2.0 envelope schema. Response envelopes carry EITHER
 * `result` OR `error`, never both. `id` must be a string, number, or
 * null (null is the spec-sanctioned shape for responses to notifications
 * or for error responses that could not parse the request id).
 */
const JsonRpcEnvelopeSchema = z
  .object({
    jsonrpc: z.literal('2.0'),
    id: z.union([z.string(), z.number(), z.null()]),
    result: z.unknown().optional(),
    error: z
      .object({
        code: z.number().int(),
        message: z.string(),
        data: z.unknown().optional(),
      })
      .optional(),
  })
  .passthrough();

/**
 * Tool entry shape for `tools/list` responses. The MCP spec requires
 * `name` and `inputSchema`; `description` is optional but strongly
 * recommended. We validate these three fields and ignore any extras
 * so forward-compatible servers (e.g. ones adding `outputSchema`) do
 * not trip the validator.
 */
const ToolEntrySchema = z
  .object({
    name: z.string().min(1),
    description: z.string().optional(),
    inputSchema: z
      .object({
        type: z.string().min(1),
      })
      .passthrough(),
  })
  .passthrough();

/**
 * Resource entry shape for `resources/list` responses. The MCP spec
 * requires `uri` and `name`. We validate `uri` as a non-empty string
 * and additionally require it to look like a URI reference per RFC 3986
 * (`scheme:...`). A malformed URI is a protocol-level breakage.
 */
const ResourceEntrySchema = z
  .object({
    uri: z.string().min(1),
    name: z.string().min(1),
    description: z.string().optional(),
    mimeType: z.string().optional(),
  })
  .passthrough();

/**
 * Prompt entry shape for `prompts/list` responses. The MCP spec
 * requires `name`; `description` and `arguments` are optional.
 */
const PromptEntrySchema = z
  .object({
    name: z.string().min(1),
    description: z.string().optional(),
    arguments: z.array(z.unknown()).optional(),
  })
  .passthrough();

/**
 * Permissive RFC 3986 scheme check. We do not pull a full URI parser
 * dependency; a scheme followed by `:` is sufficient to catch the
 * typical breakage (empty string, missing scheme, non-URI free text).
 */
const URI_SCHEME_REGEX = /^[A-Za-z][A-Za-z0-9+.-]*:/;

/**
 * Validate an MCP server response for a given method, returning a
 * structured list of violations without throwing.
 *
 * The function is lenient about the exact shape of `response`:
 *
 * - If `response` LOOKS like a JSON-RPC 2.0 envelope (has `jsonrpc`
 *   and/or `id`+`result`/`error`), the envelope fields are validated
 *   and the method-specific validation runs against `response.result`.
 * - Otherwise, `response` is treated as the already-unwrapped result
 *   payload (which is what the `@modelcontextprotocol/client` SDK
 *   actually exposes to callers), and only method-specific validation
 *   runs.
 *
 * This dual-mode design means operators can wire the validator in at
 * two points: at the raw transport layer (envelope validation) OR at
 * the SDK result level (shape validation) with the same code.
 *
 * @param response raw MCP response (envelope OR unwrapped result)
 * @param method MCP method name, e.g. `'tools/list'`, `'resources/list'`
 * @param serverName human-readable server name (surfaces in violations)
 */
export function validateMcpResponse(
  response: unknown,
  method: string,
  serverName: string
): ValidationResult {
  const violations: string[] = [];
  const payload = extractPayload(response, serverName, method, violations);

  // Error responses are valid at the envelope level but carry no
  // method-specific payload to validate further; the caller is
  // responsible for deciding whether an error response counts against
  // the breakage budget. Here we treat an envelope that resolved to an
  // error as "no payload to validate" so we do not double-count.
  const envelopeHadError =
    payload === undefined && violations.length === 0 && isErrorEnvelope(response);
  if (envelopeHadError) {
    return { valid: true, violations: [] };
  }

  switch (method) {
    case 'tools/list':
      validateToolsList(payload, serverName, violations);
      break;
    case 'resources/list':
      validateResourcesList(payload, serverName, violations);
      break;
    case 'prompts/list':
      validatePromptsList(payload, serverName, violations);
      break;
    case 'completion/complete':
      validateCompletionComplete(payload, serverName, violations);
      break;
    default:
      // Unknown method: validate nothing beyond the envelope. This is
      // intentional — the validator must stay useful as new MCP methods
      // ship without requiring a schema bump here.
      break;
  }

  return { valid: violations.length === 0, violations };
}

/**
 * Pull the method-specific payload out of a response. Validates the
 * JSON-RPC envelope on the way through when `response` looks like one;
 * returns `response` unchanged for already-unwrapped result payloads.
 *
 * Returns `undefined` when the response is an error envelope — callers
 * use that signal to skip method-specific validation (there is no
 * `result` to validate).
 */
function extractPayload(
  response: unknown,
  serverName: string,
  method: string,
  violations: string[]
): unknown {
  if (response === null || typeof response !== 'object' || Array.isArray(response)) {
    // Treat primitive / array responses as "unwrapped result"; the
    // method-specific validator will complain about shape mismatches.
    return response;
  }
  const r = response as Record<string, unknown>;
  const looksLikeEnvelope = 'jsonrpc' in r || ('id' in r && ('result' in r || 'error' in r));
  if (!looksLikeEnvelope) {
    return response;
  }

  const parsed = JsonRpcEnvelopeSchema.safeParse(response);
  if (!parsed.success) {
    for (const issue of parsed.error.issues) {
      violations.push(
        `MCP server '${serverName}' returned a malformed JSON-RPC envelope for ` +
          `method '${method}' (${issue.path.join('.') || '<root>'}): ${issue.message}`
      );
    }
    // Fall through: still try to validate whatever `result` field is
    // present so a single response can surface both envelope AND
    // payload-shape issues in one pass.
    return (response as Record<string, unknown>).result;
  }

  const env = parsed.data;
  if (env.result !== undefined && env.error !== undefined) {
    violations.push(
      `MCP server '${serverName}' returned a JSON-RPC envelope with BOTH 'result' and ` +
        `'error' set for method '${method}'; the spec allows only one.`
    );
  }
  if (env.result === undefined && env.error === undefined) {
    violations.push(
      `MCP server '${serverName}' returned a JSON-RPC envelope with neither 'result' ` +
        `nor 'error' set for method '${method}'.`
    );
  }
  return env.result;
}

/**
 * True iff `response` is a JSON-RPC envelope whose `error` field is
 * populated. Used to short-circuit payload validation for error
 * responses.
 */
function isErrorEnvelope(response: unknown): boolean {
  if (response === null || typeof response !== 'object' || Array.isArray(response)) {
    return false;
  }
  const r = response as Record<string, unknown>;
  return 'error' in r && r.error !== undefined && r.error !== null;
}

/**
 * Validate the `result` payload of a `tools/list` response. Each tool
 * entry must carry `name` (non-empty) and `inputSchema` with a `type`
 * field; `description` is optional per spec.
 */
function validateToolsList(payload: unknown, serverName: string, violations: string[]): void {
  if (payload === null || typeof payload !== 'object' || Array.isArray(payload)) {
    violations.push(
      `MCP server '${serverName}' returned a non-object result for 'tools/list' ` +
        `(expected '{ tools: [...] }').`
    );
    return;
  }
  const p = payload as { tools?: unknown };
  if (!Array.isArray(p.tools)) {
    violations.push(
      `MCP server '${serverName}' returned a 'tools/list' result missing the 'tools' array.`
    );
    return;
  }
  for (let i = 0; i < p.tools.length; i++) {
    const parsed = ToolEntrySchema.safeParse(p.tools[i]);
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        violations.push(
          `MCP server '${serverName}' returned a malformed tool at tools[${i}].` +
            `${issue.path.join('.') || '<root>'}: ${issue.message}`
        );
      }
    }
  }
}

/**
 * Validate the `result` payload of a `resources/list` response. Each
 * resource entry must carry `uri` (non-empty, RFC 3986 scheme-prefixed)
 * and `name` (non-empty).
 */
function validateResourcesList(payload: unknown, serverName: string, violations: string[]): void {
  if (payload === null || typeof payload !== 'object' || Array.isArray(payload)) {
    violations.push(
      `MCP server '${serverName}' returned a non-object result for 'resources/list' ` +
        `(expected '{ resources: [...] }').`
    );
    return;
  }
  const p = payload as { resources?: unknown };
  if (!Array.isArray(p.resources)) {
    violations.push(
      `MCP server '${serverName}' returned a 'resources/list' result missing the ` +
        `'resources' array.`
    );
    return;
  }
  for (let i = 0; i < p.resources.length; i++) {
    const parsed = ResourceEntrySchema.safeParse(p.resources[i]);
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        violations.push(
          `MCP server '${serverName}' returned a malformed resource at resources[${i}].` +
            `${issue.path.join('.') || '<root>'}: ${issue.message}`
        );
      }
      continue;
    }
    const uri = parsed.data.uri;
    if (!URI_SCHEME_REGEX.test(uri)) {
      violations.push(
        `MCP server '${serverName}' returned a resource at resources[${i}] with ` +
          `malformed URI '${uri}' (expected an RFC 3986 '<scheme>:...' reference).`
      );
    }
  }
}

/**
 * Validate the `result` payload of a `prompts/list` response. Each
 * prompt entry must carry `name` (non-empty).
 */
function validatePromptsList(payload: unknown, serverName: string, violations: string[]): void {
  if (payload === null || typeof payload !== 'object' || Array.isArray(payload)) {
    violations.push(
      `MCP server '${serverName}' returned a non-object result for 'prompts/list' ` +
        `(expected '{ prompts: [...] }').`
    );
    return;
  }
  const p = payload as { prompts?: unknown };
  if (!Array.isArray(p.prompts)) {
    violations.push(
      `MCP server '${serverName}' returned a 'prompts/list' result missing the ` +
        `'prompts' array.`
    );
    return;
  }
  for (let i = 0; i < p.prompts.length; i++) {
    const parsed = PromptEntrySchema.safeParse(p.prompts[i]);
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        violations.push(
          `MCP server '${serverName}' returned a malformed prompt at prompts[${i}].` +
            `${issue.path.join('.') || '<root>'}: ${issue.message}`
        );
      }
    }
  }
}

/**
 * Validate the `result` payload of a `completion/complete` response.
 * The spec shape is `{ completion: { values: string[], total?: number,
 * hasMore?: boolean } }`.
 */
function validateCompletionComplete(
  payload: unknown,
  serverName: string,
  violations: string[]
): void {
  if (payload === null || typeof payload !== 'object' || Array.isArray(payload)) {
    violations.push(
      `MCP server '${serverName}' returned a non-object result for 'completion/complete' ` +
        `(expected '{ completion: { values: [...] } }').`
    );
    return;
  }
  const p = payload as { completion?: unknown };
  if (p.completion === null || typeof p.completion !== 'object' || Array.isArray(p.completion)) {
    violations.push(
      `MCP server '${serverName}' returned a 'completion/complete' result missing the ` +
        `'completion' object.`
    );
    return;
  }
  const c = p.completion as { values?: unknown };
  if (!Array.isArray(c.values)) {
    violations.push(
      `MCP server '${serverName}' returned a 'completion/complete' result where ` +
        `'completion.values' is not an array.`
    );
    return;
  }
  for (let i = 0; i < c.values.length; i++) {
    if (typeof c.values[i] !== 'string') {
      violations.push(
        `MCP server '${serverName}' returned a 'completion/complete' value at index ` +
          `${i} that is not a string.`
      );
    }
  }
}
