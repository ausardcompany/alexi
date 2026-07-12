# Project facts -- alexi (SAP AI Core CLI orchestrator)

Injected after the engine baseline into every role's composed prompt. This is
the authoritative source for anything stack-specific about THIS project.

## Repository facts

- Single-package npm project, no monorepo. Root `package.json` is the only one.
- Node `>= 22.12.0`, `"type": "module"`, TypeScript 5.9, `module: NodeNext`.
- Two CLI bins: `alexi` and `ax`, both resolving to `dist/cli/program.js`.
- Source under `src/`, build output under `dist/` with `rootDir: src`.
- `npm run dev -- <args>` runs through `tsx` (no build step needed).
- `npm run build` emits `dist/`. A fresh clone needs build before bins work.
- TUI code uses Ink + React 19, files are `.tsx` with `jsx: react-jsx`.
- Tests live in BOTH `tests/**/*.test.{ts,tsx}` and `src/**/*.test.{ts,tsx}`.
- Sessions persist to `~/.alexi/sessions/`. Routing config:
  `routing-config.json` with `routing-config.example.json` as template.

## Quality gates (CI order)

Run these locally in this exact order before pushing:

```bash
npm run lint
npm run typecheck
npm run format:check
npm run test:coverage
npm run build
```

- `lint` must produce 0 errors. Warnings are informational.
- `typecheck` is strict; do not silence with `@ts-ignore` or `as any`.
- `format:check` is a separate CI job. If it fails, run `npm run format`.
- CI enforces 40% line coverage via jq on `coverage/coverage-summary.json`.
  Local `vitest.config.ts` thresholds (15-20%) are looser; adding code without
  tests can still break CI.
- `build` must succeed even if you only touched non-TS files.

## ESM gotchas

- Every local import MUST end in `.js`, even from `.ts` and `.tsx` files.
  Example: `import { sendChat } from '../core/orchestrator.js';`
- vitest uses `@vitejs/plugin-react`. Test environment is `node`, NOT `jsdom`.
- `vi.mock(...)` is hoisted; place provider mocks ABOVE imports.
- New tools use `defineTool` from `src/tool/index.ts` with a Zod schema and
  must be registered via `src/tool/registry.ts`.

## Commit conventions

- Allowed types: `feat, fix, docs, style, refactor, perf, test, chore, ci, revert`.
- Allowed scopes: `cli, core, providers, config, server, agent, tools, ci, deps, tests`.
  Other scopes fail the husky `commit-msg` hook.
- Subject max 100 chars, body line max 300 chars.
- Sign agent commits with the `[alexi-bot]` suffix so Daily Merge can identify
  automated commits.

## Project-specific prohibitions

- Do not edit auto-generated files: `coverage/`, `dist/`, `.kilo/plans/*`,
  `package-lock.json` (except via `npm` commands).
- Do not pin major dependency bumps; Dependabot ignore rules gate major
  upgrades for marked, react, ink, vitest, eslint, typescript.
- Do not require live SAP AI Core credentials in tests; mock providers via
  `vi.mock('../src/providers/index.js', ...)`.
- Do not run `npm install -g @kilocode/cli` inside `run_check` blocks.
