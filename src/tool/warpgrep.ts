// WarpGrep built-in tool has been removed.
//
// This file previously held stale configuration comments for the deprecated
// built-in `codebase_search` (WarpGrep) tool. The tool is now provided by the
// standalone MCP server `packages/alexi-mcp-warpgrep`. Users who need
// semantic codebase search should install and register that MCP server via
// `mcp-servers.json` — Alexi's built-in tool surface intentionally no longer
// depends on the proprietary Morph API or its free-period proxy.
//
// This module is kept as an empty placeholder to preserve import paths in
// downstream tooling. It will be removed in a future major release.
export {};
