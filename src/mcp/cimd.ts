/**
 * MCP Capability Interface Metadata (CIMD) validation.
 *
 * Provides upfront capability negotiation for MCP servers: given an
 * expected capability manifest pinned in `mcp-servers.json` and the
 * actual manifest observed on the wire at connect time, detect breaking
 * changes (removed tools, changed input schemas, incompatible protocol
 * versions) BEFORE the first tool call fires.
 *
 * Rationale (issue #1877)
 * -----------------------
 * MCP servers can introduce breaking API changes (removed tools,
 * changed schemas) that today only surface as runtime errors deep in a
 * session. CIMD moves the failure to connect time, where an operator
 * has actionable context (they just changed a server, or the server
 * just published a new version).
 *
 * The runtime effect of a mismatch is controlled by the per-server
 * `cimdEnabled` flag (see {@link McpServerConfig.cimdEnabled}):
 *
 *   - `cimdEnabled === true`  → mismatches ABORT the connect attempt
 *     (`throw new McpCapabilityMismatchError(...)`).
 *   - `cimdEnabled` is `false` or absent → mismatches are logged as
 *     warnings and the connection proceeds. This is the backward-
 *     compatible default; operators must opt in.
 *
 * Naming note
 * -----------
 * A separate module (`src/mcp/client-metadata.ts`) uses the acronym
 * CIMD for OAuth-related "Client ID Metadata Documents". That surface
 * is only relevant when the caller's OAuth `client_id` resolves to a
 * URL; it is unrelated to capability validation and does not conflict
 * with anything exported from this file.
 */

import { z } from 'zod';
import type { McpServerConfig } from './config.js';

/**
 * Shape of a single tool inside a {@link CapabilityManifest}. Kept
 * intentionally narrow so a manifest can be authored by hand in
 * `mcp-servers.json` without pulling in the full JSON Schema surface.
 *
 * `inputSchema` is stored as `unknown` and compared structurally
 * (deep-equal) — capturing the JSON Schema in a permissive shape lets
 * us detect any change without teaching the validator every possible
 * schema keyword.
 */
export const CapabilityToolSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  inputSchema: z.unknown().optional(),
});

export type CapabilityTool = z.infer<typeof CapabilityToolSchema>;

/**
 * Zod schema for a {@link CapabilityManifest}. Exposed so callers can
 * validate a manifest pulled off the wire or read from disk before
 * handing it to {@link validateCapabilities}.
 *
 * `protocolVersion` is optional so a partial manifest that pins only
 * the toolset is legal — many operators care about "this list of tools
 * with these schemas must exist" but not the underlying protocol
 * version.
 */
export const CapabilityManifestSchema = z.object({
  protocolVersion: z.string().min(1).optional(),
  tools: z.array(CapabilityToolSchema).optional(),
});

export type CapabilityManifest = z.infer<typeof CapabilityManifestSchema>;

/**
 * Category of a single capability mismatch. Kept as a string union so
 * downstream callers (log lines, error messages, telemetry) can switch
 * on it without introducing a runtime enum.
 */
export type CapabilityMismatchKind =
  | 'protocol_version_incompatible'
  | 'tool_removed'
  | 'tool_schema_changed'
  | 'tool_description_changed';

/**
 * A single mismatch surfaced by {@link validateCapabilities}. Every
 * entry carries a `kind` (for programmatic routing) and a human-
 * readable `message` (for logs and error text).
 */
export interface CapabilityMismatch {
  kind: CapabilityMismatchKind;
  /** Tool name that changed. Absent for protocol-version mismatches. */
  toolName?: string;
  /** Human-readable summary. */
  message: string;
}

/**
 * Result of a capability validation pass. `valid` is `true` when there
 * are zero mismatches. `warnings` collects non-fatal observations that
 * do NOT count as mismatches (e.g. actual manifest exposes MORE tools
 * than expected — an additive change is not a breaking one).
 */
export interface ValidationResult {
  valid: boolean;
  mismatches: CapabilityMismatch[];
  warnings: string[];
}

/**
 * Deep structural equality for JSON-like values. Used to compare tool
 * input schemas without a heavy dependency. Handles objects, arrays,
 * primitives, and `undefined`. Property order in objects is ignored.
 *
 * Not a general-purpose deep-equal — deliberately narrow to the JSON
 * shape produced by MCP `tools/list` responses.
 */
function deepEqualJson(a: unknown, b: unknown): boolean {
  if (a === b) {
    return true;
  }
  if (a === null || b === null || typeof a !== typeof b) {
    return false;
  }
  if (typeof a !== 'object') {
    return false;
  }
  if (Array.isArray(a)) {
    if (!Array.isArray(b) || a.length !== b.length) {
      return false;
    }
    for (let i = 0; i < a.length; i++) {
      if (!deepEqualJson(a[i], b[i])) {
        return false;
      }
    }
    return true;
  }
  if (Array.isArray(b)) {
    return false;
  }
  const aObj = a as Record<string, unknown>;
  const bObj = b as Record<string, unknown>;
  const aKeys = Object.keys(aObj);
  const bKeys = Object.keys(bObj);
  if (aKeys.length !== bKeys.length) {
    return false;
  }
  for (const key of aKeys) {
    if (!Object.prototype.hasOwnProperty.call(bObj, key)) {
      return false;
    }
    if (!deepEqualJson(aObj[key], bObj[key])) {
      return false;
    }
  }
  return true;
}

/**
 * Compare two protocol version strings and decide whether `actual` is
 * compatible with `expected`.
 *
 * MCP protocol versions today use ISO-date strings (e.g. `2024-11-05`)
 * or semver-like triplets. Rather than parse either format, we treat
 * ANY difference as incompatible — CIMD is opt-in, and the operator
 * pinning a protocol version wants to be told about ANY drift.
 * Operators who only care about a minor bump should simply omit
 * `protocolVersion` from their expected manifest.
 */
function isProtocolCompatible(expected: string, actual: string): boolean {
  return expected === actual;
}

/**
 * Validate the ACTUAL manifest observed at connect time against the
 * EXPECTED manifest stored on the server config.
 *
 * The expected manifest is read from {@link McpServerConfig.expectedCapabilities};
 * when it is absent, validation is a no-op that always returns
 * `{ valid: true, mismatches: [], warnings: [] }`. This keeps CIMD
 * strictly additive — a server without an expected manifest never
 * fails validation, even when `cimdEnabled` is `true`.
 *
 * Detected mismatch categories (see {@link CapabilityMismatchKind}):
 *
 *   - `protocol_version_incompatible`: `expected.protocolVersion` is
 *     set AND differs from `actual.protocolVersion`.
 *   - `tool_removed`: a tool named in the expected manifest is missing
 *     from the actual manifest.
 *   - `tool_schema_changed`: a tool present in both manifests has a
 *     structurally different `inputSchema`.
 *   - `tool_description_changed`: purely informational — collected as
 *     a mismatch of a low-severity kind so operators pinning
 *     description-level exactness still get a signal.
 *
 * Additive changes (actual has MORE tools than expected) are recorded
 * as warnings, not mismatches, so a server that adds new tools does
 * not fail validation.
 */
export function validateCapabilities(
  server: McpServerConfig,
  manifest: CapabilityManifest
): ValidationResult {
  const expected = server.expectedCapabilities;
  const result: ValidationResult = { valid: true, mismatches: [], warnings: [] };

  if (!expected) {
    return result;
  }

  if (
    typeof expected.protocolVersion === 'string' &&
    typeof manifest.protocolVersion === 'string' &&
    !isProtocolCompatible(expected.protocolVersion, manifest.protocolVersion)
  ) {
    result.mismatches.push({
      kind: 'protocol_version_incompatible',
      message:
        `MCP server '${server.name}' reports protocol version ` +
        `'${manifest.protocolVersion}' but the expected version is ` +
        `'${expected.protocolVersion}'. Update 'expectedCapabilities.protocolVersion' ` +
        `in mcp-servers.json to acknowledge the change.`,
    });
  }

  const expectedTools = expected.tools ?? [];
  const actualTools = manifest.tools ?? [];
  const actualByName = new Map(actualTools.map((tool) => [tool.name, tool]));
  const expectedByName = new Map(expectedTools.map((tool) => [tool.name, tool]));

  for (const expectedTool of expectedTools) {
    const actualTool = actualByName.get(expectedTool.name);
    if (!actualTool) {
      result.mismatches.push({
        kind: 'tool_removed',
        toolName: expectedTool.name,
        message:
          `MCP server '${server.name}' no longer exposes tool ` +
          `'${expectedTool.name}'. Remove it from ` +
          `'expectedCapabilities.tools' in mcp-servers.json or downgrade the server.`,
      });
      continue;
    }

    if (
      expectedTool.inputSchema !== undefined &&
      !deepEqualJson(expectedTool.inputSchema, actualTool.inputSchema)
    ) {
      result.mismatches.push({
        kind: 'tool_schema_changed',
        toolName: expectedTool.name,
        message:
          `MCP server '${server.name}' changed the input schema for tool ` +
          `'${expectedTool.name}'. Callers relying on the previous shape ` +
          `will fail at call time; refresh ` +
          `'expectedCapabilities.tools[].inputSchema' in mcp-servers.json ` +
          `after verifying the new contract.`,
      });
    }

    if (
      typeof expectedTool.description === 'string' &&
      typeof actualTool.description === 'string' &&
      expectedTool.description !== actualTool.description
    ) {
      result.mismatches.push({
        kind: 'tool_description_changed',
        toolName: expectedTool.name,
        message:
          `MCP server '${server.name}' changed the description of tool ` +
          `'${expectedTool.name}'.`,
      });
    }
  }

  for (const actualTool of actualTools) {
    if (!expectedByName.has(actualTool.name)) {
      result.warnings.push(
        `MCP server '${server.name}' exposes new tool '${actualTool.name}' ` +
          `not listed in expectedCapabilities (additive change, not a breaking one).`
      );
    }
  }

  result.valid = result.mismatches.length === 0;
  return result;
}

/**
 * Error thrown when {@link validateCapabilities} finds a mismatch on a
 * server with `cimdEnabled === true`. Carries the full mismatch list so
 * callers (or a UI) can surface every problem in one pass instead of
 * repeated fail-fast cycles.
 */
export class McpCapabilityMismatchError extends Error {
  override readonly name = 'McpCapabilityMismatchError';
  readonly serverName: string;
  readonly mismatches: CapabilityMismatch[];

  constructor(serverName: string, mismatches: CapabilityMismatch[]) {
    const summary = mismatches.map((m) => `- ${m.message}`).join('\n');
    super(
      `MCP server '${serverName}' failed capability validation (cimdEnabled=true):\n` +
        `${summary}\n` +
        `Set 'cimdEnabled: false' in mcp-servers.json to downgrade this to a warning, ` +
        `or update 'expectedCapabilities' to match the server's current contract.`
    );
    this.serverName = serverName;
    this.mismatches = mismatches;
  }
}

/**
 * Build a {@link CapabilityManifest} from a raw MCP `tools/list`
 * response and (optionally) a protocol-version string. Trims the tool
 * shape down to the fields CIMD tracks — anything else the SDK returns
 * is ignored.
 *
 * Exposed as a helper so the MCP client can produce a manifest without
 * duplicating the tool-mapping logic, and so tests can construct
 * fixtures compactly.
 */
export function buildManifestFromTools(
  tools: ReadonlyArray<{ name: string; description?: string; inputSchema?: unknown }>,
  protocolVersion?: string
): CapabilityManifest {
  const manifest: CapabilityManifest = {
    tools: tools.map((tool) => ({
      name: tool.name,
      description: tool.description,
      inputSchema: tool.inputSchema,
    })),
  };
  if (protocolVersion !== undefined) {
    manifest.protocolVersion = protocolVersion;
  }
  return manifest;
}
