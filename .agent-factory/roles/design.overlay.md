# Design overlay -- alexi (SAP AI Core, Node/TypeScript)

## Interface layer

Commander CLI. Subcommands under `src/cli/commands/` need a single-line
`.description()`, a complete `.option()` list with `<value>` placeholders,
and an example in the long help.

## Error taxonomy specifics

Environment errors include missing `AICORE_SERVICE_KEY` and network
timeout. Diagnostics -> stderr; results -> stdout (constitution II).

## UI stack

Ink v6 + React 19, components under `src/cli/tui/`. Inputs:
`ink-text-input`; lists: `ink-select-input`; spinners: `ink-spinner`.
Markdown via `marked` + `marked-terminal`; code highlighting via
`cli-highlight`. Test environment is `node` (no DOM APIs) -- keep
components pure-render. Do not add a new TUI library or bump React/Ink
to a new major.

## Output formatting

`--output json` supported (constitution). ANSI via `chalk`; strip color
when `process.stdout.isTTY` is false or `NO_COLOR` is set. Prefer OSC-8
hyperlinks (`\x1b]8;;<url>\x1b\\<text>\x1b]8;;\x1b\\`).

## Tools

Tools registered via `defineTool` (Zod schema); `description` + schema
field descriptions live in `src/tool/tools/*.ts`.

## Paths, scope, gate, tests

- Owned: help strings in `src/cli/commands/*.ts`, `src/cli/tui/`,
  `src/cli/interactive.ts`, tool descriptions in `src/tool/tools/*.ts`,
  formatting utils in `src/utils/`.
- Scope: `cli` (e.g. `feat(cli): clarify chat command help text`).
- Help check: `npm run dev -- <cmd> --help`.
- Tests: `src/cli/**/*.test.tsx` (Ink render-to-string).
- Gate: `npm run lint && npm run typecheck && npm test`.
- Issue labels: `ux`, `dx`.
