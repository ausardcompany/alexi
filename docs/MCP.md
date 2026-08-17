# MCP (Model Context Protocol) Configuration

Alexi speaks the [Model Context Protocol](https://modelcontextprotocol.io)
natively. This document covers configuration surface for external MCP
servers, with a focus on the `timeout` field.

For a user-facing guide to registering and shipping MCP servers, see
[`docs/mcp-servers.md`](./mcp-servers.md). This document is the
authoritative reference for the config schema itself.

## Config file locations

Alexi loads MCP server definitions from `~/.alexi/mcp-servers.json`.
On first launch, a default file is written with three disabled examples
(filesystem, github, brave-search) that operators can enable and adapt.

An example file with global and per-server timeouts is also checked into
the repository at [`mcp-servers.example.json`](../mcp-servers.example.json).

## Top-level schema

```jsonc
{
  "version": "1.0",
  "timeout": 5000, // optional global default (see "Timeout configuration")
  "servers": [
    {
      "name": "<unique-id>",
      "description": "<human-readable>",
      "transport": "stdio" | "sse" | "http",
      "command": "<executable>",
      "args": ["<arg1>", "<arg2>"],
      "env": { "VAR": "${VAR}" },
      "enabled": true,
      "autoConnect": false,
      "timeout": 8000, // optional per-server override
      "cwd": "/optional/working/dir",
      "retry": { "enabled": true, "maxAttempts": 3 }
    }
  ]
}
```

The top-level object and every server entry accept unknown fields so
future additions do not require operators to bump `version`. Fields that
matter to the runtime (`timeout`, `retry`, `transport`, etc.) are
validated at load time (see [Validation](#validation)).

## Timeout configuration

MCP tools have two distinct time budgets:

- **`startup`** - covers the stdio handshake / cold-spawn phase
  (`client.connect`). If this trips, `McpClientManager.connect` aborts
  the connection.
- **`request`** - per-tool call deadline (`client.callTool`). If this
  trips, the specific `callTool` invocation returns
  `{ success: false, error: "MCP callTool timed out after ..." }`.

Both budgets are configured via the `timeout` field, which can appear at
two levels:

1. **Per-server** (`servers[].timeout`) - highest priority.
2. **Global** (`timeout` at the top level) - applies to every server
   that does not set its own `timeout`.

Both accept the same two shapes:

- **Bare number**: applied to BOTH `startup` and `request` phases.
  Backwards-compatible with the original Alexi shape.
- **Object** `{ startup?: number; request?: number }`: independent
  budgets per phase. Missing keys fall through to the next precedence
  layer.

### Resolution order (highest to lowest priority)

For each phase (`startup` and `request` are resolved independently):

1. Per-server `servers[i].timeout` (bare number or object form)
2. Global `timeout` (bare number or object form)
3. `MCP_TOOL_TIMEOUT` environment variable (applied to BOTH phases for
   backwards-compat with pre-per-server-timeout versions of Alexi)
4. Built-in defaults:
   - `startup`: **3000ms** (3s; aggressive cap so a hung MCP server
     cannot stall session creation)
   - `request`: **60000ms** (60s)

Partial overrides are supported. If a server sets only
`timeout: { request: 10000 }` and the global config sets
`timeout: { startup: 15000 }`, the resolved values are
`startup=15000, request=10000`.

### Valid range

Both `startup` and `request` must fall within
**`[1000ms, 300000ms]`** (1s to 5min).

- Values below 1000ms cause false-positive timeouts even on healthy
  local servers (the JSON-RPC handshake alone can take a few hundred
  ms).
- Values above 300000ms almost certainly indicate a misuse of MCP.
  Long-running work should not be a synchronous tool call.

Config-load-time validation rejects out-of-range values via
`validateMcpConfig` (`src/mcp/config.ts`). Values that reach the runtime
anyway (e.g. programmatic injection via `setGlobalTimeout`) are dropped
to `undefined` with a `logger.warn` in
`McpClientManager.normalizeTimeout`, and the next precedence layer is
consulted instead.

Zero, negative, and non-finite values are always rejected.

### Examples

**Slow AI-powered server** (JVM warmup, large model load):

```jsonc
{
  "name": "slow-ai-tool",
  "command": "python",
  "args": ["ai_tool.py"],
  "enabled": true,
  "timeout": { "startup": 30000, "request": 60000 }
}
```

**Fast local server** (default budgets are fine):

```jsonc
{
  "name": "filesystem",
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-filesystem", "/tmp"],
  "enabled": true
  // no timeout field; defaults apply
}
```

**Global default for the whole fleet, one server overridden**:

```jsonc
{
  "version": "1.0",
  "timeout": { "startup": 5000, "request": 8000 },
  "servers": [
    {
      "name": "filesystem",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/tmp"],
      "enabled": true
      // inherits global startup=5000, request=8000
    },
    {
      "name": "slow-ai-tool",
      "command": "python",
      "args": ["ai_tool.py"],
      "enabled": true,
      "timeout": { "startup": 30000, "request": 60000 }
      // overrides both phases
    }
  ]
}
```

**Legacy env-var override** (still supported, applies to both phases):

```bash
MCP_TOOL_TIMEOUT=10000 alexi chat
```

## Validation

`loadMcpConfig` runs the parsed JSON through the Zod schema
`McpConfigSchema`. If validation fails, a warning is printed and the
built-in defaults are used instead. This keeps a broken config from
bricking session creation while still surfacing the problem.

The write path (`addMcpServer`) hard-fails on validation errors, so
invalid values cannot be persisted to disk from within Alexi itself.

### Common validation errors

| Error message                                                | Cause                        | Fix                           |
| ------------------------------------------------------------ | ---------------------------- | ----------------------------- |
| `timeout must be >= 1000ms`                                  | `"timeout": 500`             | Raise to at least `1000`      |
| `timeout must be <= 300000ms`                                | `"timeout": 600000`          | Lower to at most `300000`     |
| `timeout must be an integer number of milliseconds`          | `"timeout": 3.5`             | Use a whole millisecond value |
| `Expected number, received boolean` (or similar)             | Wrong type for a numeric key | Match the schema shape        |
| `Unrecognized key(s) in object: "starup"` (typo of `startup`) | Misspelt object-form key     | Correct the key name          |

## Related documents

- [`docs/mcp-servers.md`](./mcp-servers.md) - user-facing guide to
  writing and shipping MCP servers.
- [`AGENTS.md`](../AGENTS.md) - full agent-tooling contract, including
  MCP retry / connection budgets.
- [`mcp-servers.example.json`](../mcp-servers.example.json) - working
  example config with global and per-server timeouts.
