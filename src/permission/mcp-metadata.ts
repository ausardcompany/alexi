/**
 * MCP-aware permission ask metadata (upstream ports).
 *
 * Two related fixes are consolidated here:
 *
 *   - kilocode `17401e3bb` — non-MCP permission asks were incorrectly
 *     receiving MCP-specific argument metadata on the ask payload,
 *     causing the UI to render irrelevant "server / tool / arguments"
 *     rows for plain tools (shell, edit, …). Fix: only attach the
 *     `mcp` metadata block when the ask actually originates from an MCP
 *     tool invocation.
 *
 *   - kilocode `390b92cf9` — pending MCP tool arguments were not being
 *     surfaced in the permission prompt, so operators had to approve an
 *     MCP call without seeing what the model was about to send.
 *     Fix: include the pending `arguments` payload on the MCP metadata
 *     block so the UI can render it before the user makes a decision.
 *
 * The `PermissionManager` in `src/permission/index.ts` publishes a
 * generic `PermissionRequested` event with an untyped `metadata` bag; the
 * helpers here define the shape of the MCP-specific slice and produce a
 * metadata object callers can drop into the event payload directly.
 */

/**
 * Ask "kind" — mirrors the `type` field on the permission ask payload.
 * Only `'mcp'` receives the MCP metadata block; everything else returns
 * an empty metadata object from {@link buildAskMetadata}.
 */
export type AskKind = 'tool' | 'mcp' | 'shell' | 'edit';

/**
 * MCP-specific metadata attached to `PermissionRequested` payloads whose
 * `type === 'mcp'`. Kept optional on the outer envelope so consumers can
 * treat the whole `metadata.mcp` slice as "present iff MCP".
 */
export interface McpAskMetadata {
  /** MCP server id the pending tool call is dispatched to. */
  server: string;
  /** MCP tool name the pending call targets on that server. */
  tool: string;
  /**
   * Pending arguments the model is about to send. Surfaced in the
   * permission prompt so the operator can review them before approval.
   * The shape is provider-specific; the UI renders it as JSON.
   */
  arguments: unknown;
}

/**
 * Envelope for permission ask metadata. Only carries the MCP block when
 * the ask is an MCP call; other ask kinds receive an empty envelope so
 * consumers do not see stale `server` / `tool` / `arguments` fields.
 */
export interface AskMetadata {
  mcp?: McpAskMetadata;
}

/**
 * Input shape for an MCP-flavoured ask. Non-MCP asks pass `undefined`
 * (or omit the argument entirely) so this helper can be called
 * unconditionally at the ask construction site.
 */
export interface McpAskInput {
  server: string;
  tool: string;
  arguments: unknown;
}

/**
 * Build the `metadata` payload attached to a `PermissionRequested`
 * event. When `kind !== 'mcp'`, returns an empty object so non-MCP asks
 * do not leak MCP-shaped fields (kilocode `17401e3bb`). When
 * `kind === 'mcp'`, embeds the pending arguments so the operator can
 * review them before approving (kilocode `390b92cf9`).
 *
 * @param kind - The ask kind. Only `'mcp'` produces an `mcp` metadata
 *   block; the input is otherwise ignored.
 * @param input - MCP-specific fields. Required when `kind === 'mcp'`;
 *   ignored for every other kind.
 */
export function buildAskMetadata(kind: AskKind, input?: McpAskInput): AskMetadata {
  if (kind !== 'mcp') {
    return {};
  }
  if (!input) {
    // Defensive — an MCP ask without input is a caller bug, but we
    // return an empty envelope rather than throwing so the permission
    // pipeline degrades gracefully (the user just sees no MCP fields).
    return {};
  }
  return {
    mcp: {
      server: input.server,
      tool: input.tool,
      arguments: input.arguments,
    },
  };
}
