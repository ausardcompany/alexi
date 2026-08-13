# MCP Servers

Alexi speaks the [Model Context Protocol](https://modelcontextprotocol.io)
(MCP) natively. External MCP servers extend the built-in tool surface
without adding weight to the `alexi` CLI binary and can be versioned
independently.

## Where to register servers

Alexi loads MCP server definitions from `mcp-servers.json` in the workspace
root, and (as a fallback) from `~/.alexi/mcp-servers.json`. The schema is:

```json
{
  "mcpServers": {
    "<local-name>": {
      "command": "<executable>",
      "args": ["<arg1>", "<arg2>"],
      "env": {
        "<VAR>": "${VAR}"
      }
    }
  }
}
```

The `<local-name>` is only used to identify the connection in Alexi logs;
tool names come from the server itself.

## Bundled servers

### `alexi-mcp-warpgrep` - semantic code search

The `codebase_search` (WarpGrep) tool used to be built into `alexi`. It is
now shipped as a standalone MCP server package:
[`alexi-mcp-warpgrep`](../packages/alexi-mcp-warpgrep/README.md).

#### Why the migration

- Smaller `alexi` binary and dependency tree (`@morphllm/morphsdk` stays
  optional).
- The tool can evolve on its own release cadence.
- Consistent with the upstream Kilo MCP-first architecture direction
  (Kilo #13084).

#### Installation

```bash
npm install alexi-mcp-warpgrep @morphllm/morphsdk
```

or globally:

```bash
npm install -g alexi-mcp-warpgrep @morphllm/morphsdk
```

#### Configuration

Add the server to `mcp-servers.json`:

```json
{
  "mcpServers": {
    "alexi-warpgrep": {
      "command": "node",
      "args": ["./node_modules/alexi-mcp-warpgrep/dist/index.js"],
      "env": {
        "MORPH_API_KEY": "${MORPH_API_KEY}"
      }
    }
  }
}
```

If installed globally:

```json
{
  "mcpServers": {
    "alexi-warpgrep": {
      "command": "alexi-mcp-warpgrep",
      "env": {
        "MORPH_API_KEY": "${MORPH_API_KEY}"
      }
    }
  }
}
```

Restart your Alexi session; `codebase_search` will now be provided by the
MCP server. The tool name and parameter shape are unchanged, so no prompt
or agent updates are required.

#### Deprecation timeline

- **Now**: the built-in `codebase_search` tool is functional but emits a
  one-shot deprecation warning to the log on first use.
- **Next major release**: the built-in implementation will be removed.
  Users relying on semantic search must have `alexi-mcp-warpgrep`
  registered.

If both the built-in tool and the MCP server are available, the built-in
tool wins (it registers first). To force the MCP path early, uninstall or
disable `@morphllm/morphsdk` from the `alexi` install so the built-in
availability check returns `false`.

## Writing your own MCP server

Follow the pattern in
[`packages/alexi-mcp-warpgrep/src/index.ts`](../packages/alexi-mcp-warpgrep/src/index.ts):

1. Depend on `@modelcontextprotocol/server` and `zod`.
2. Create an `McpServer` instance with name/version.
3. Call `server.registerTool(name, { description, inputSchema }, handler)`
   for each tool.
4. `await server.connect(new StdioServerTransport())` in `main()`.
5. Ship an executable bin so `mcp-servers.json` can spawn it via
   `command`/`args`.

Prefer stdio transport for local servers; use HTTP/WebSocket only when the
server must be shared across multiple clients.
