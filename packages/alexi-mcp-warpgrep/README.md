# alexi-mcp-warpgrep

Standalone [Model Context Protocol](https://modelcontextprotocol.io) server
exposing [WarpGrep](https://morphllm.com/) semantic code search as a
`codebase_search` tool.

This package replaces the built-in `codebase_search` tool that used to ship
inside the Alexi CLI. Bundling it as an MCP server keeps the Alexi core
lean and lets you version / distribute semantic search independently.

## Requirements

- Node.js `>= 22.12.0`
- `@morphllm/morphsdk` installed (optional peer dependency)
- Optional: `MORPH_API_KEY` environment variable. During the Kilo free
  period the server falls back to the `api.kilo.ai` proxy when no key is
  set.

## Installation

```bash
npm install alexi-mcp-warpgrep @morphllm/morphsdk
```

You can also install globally so the `alexi-mcp-warpgrep` bin is on `$PATH`:

```bash
npm install -g alexi-mcp-warpgrep @morphllm/morphsdk
```

## Configuration

Add the server to your `mcp-servers.json` (Alexi looks up this file from the
current workspace and from `~/.alexi/`):

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

If the server is installed globally, replace the `command` and `args` with:

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

## Tool: `codebase_search`

| Field | Type | Description |
| ----- | ---- | ----------- |
| `query` | `string` | Natural-language description of the code you are looking for. |

Returns a JSON payload with `spans` (each `{ filePath, startLine, endLine, content }`) and the original `query`. Empty result sets return a plain text hint so LLM clients can distinguish "no matches" from "error".

## Migrating from the built-in tool

The built-in `codebase_search` tool inside `alexi` is deprecated and now
emits a warning when invoked. It will be removed in a future major release.
To switch:

1. Install this package plus `@morphllm/morphsdk`.
2. Register the server in `mcp-servers.json` as shown above.
3. Restart your Alexi session.

The tool name is identical (`codebase_search`), so no prompt changes are
required.

## Development

```bash
npm install
npm run typecheck
npm run test
npm run build
```

## License

MIT
