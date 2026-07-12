# Architecture overlay -- alexi (SAP AI Core, Node/TypeScript)

## Module map (current)

`src/cli/` (Commander + Ink) -> `src/core/` (orchestrator, router,
sessionManager, costTracker) -> `src/agent/` and `src/providers/` ->
`src/tool/` -> `src/bus/`, `src/permission/`, `src/mcp/`, `src/hooks/`,
`src/plugin/`, `src/skill/`. Lower layers must not import upward.

## Interface / boundary specifics

- Provider abstraction (constitution III): concrete SDK calls live only
  in `src/providers/*.ts`; `getProviderForModel` dispatches by model id
  prefix. `src/core/` must not couple to a specific provider SDK.
- Tool registry: tools declared with `defineTool` in `src/tool/index.ts`
  (Zod schema each), registered via `src/tool/registry.ts`. New tools go
  under `src/tool/tools/` and do NOT import from `src/cli/` or `src/agent/`.
- Extension surfaces: `src/mcp/`, `src/plugin/`, `src/skill/`, `src/hooks/`
  -- each must be hot-pluggable (constitution IV).
- Tool execution communicates through `src/bus/`; direct side channels
  are forbidden (constitution IV).

## Module system constraints

ESM, `module: NodeNext`. Every local import ends in `.js`. Top-level
await allowed. No circular imports. Do not add a CommonJS-only transitive
into the ESM bundle without verifying it loads.

## Driving config

`routing-config.json` (JSON-driven brain). Schema changes need a migration
path and a `docs/ROUTING.md` update.

## Docs and scopes

- Docs owned: `docs/ARCHITECTURE.md`, `docs/PROVIDERS.md`, `docs/ROUTING.md`.
- ADR scope: `docs(core)` or `docs(config)`.
- File moves: `refactor(<scope>)` per commitlint.
- Principles doc: `.specify/memory/constitution.md`.
- Gate: `npm run typecheck && npm run lint && npm run build`.
