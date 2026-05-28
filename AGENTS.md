# AGENTS.md - Alexi

CLI orchestrator for SAP AI Core (TypeScript, ESM, Node >= 22.12). Single-package npm project, no monorepo.

## Commands that matter

```bash
npm run dev -- chat -m "test"   # tsx run of src/cli/program.ts (no build needed)
npm run build                    # tsc -p tsconfig.json -> dist/
npm run typecheck                # tsc --noEmit
npm run lint                     # eslint src/ tests/
npm run format:check             # prettier check (run before commit; CI fails on diff)
npm test                         # vitest run (single pass, NOT watch)
npm run test:coverage            # required to pass CI; CI also enforces 40% lines via jq

# Single test / pattern
npm test -- tests/orchestrator.test.ts
npm test -- -t "write tool"      # vitest uses -t / --testNamePattern, NOT --grep
```

CI order matches what you should run locally before pushing: `lint -> typecheck -> format:check -> test:coverage -> build`. `dev:watch` does not exist despite the README mentioning it.

## ESM + import rules (easy to break)

- `"type": "module"` + `module: NodeNext`. Every local import MUST end in `.js`, even from `.ts` files. Imports without `.js` will pass `tsc --noEmit` but fail at runtime and in tests.
- Tests live in both `tests/**/*.test.{ts,tsx}` and `src/**/*.test.{ts,tsx}` (see `vitest.config.ts`). Place tests near the code OR under `tests/` — both are picked up.
- TUI code is `.tsx` (Ink + React 19, `jsx: react-jsx`). vitest uses `@vitejs/plugin-react`; the test environment is `node`, not `jsdom`.

## Source layout (real, not the trimmed README version)

`src/` has ~30 top-level modules. The ones that explain how the system is wired:

- `src/cli/program.ts` — Commander entrypoint, registered as bins `alexi` and `ax`
- `src/cli/commands/` — one file per CLI subcommand (chat, agent, explain, sessions, ...)
- `src/cli/tui/` and `src/cli/interactive.ts` — Ink-based interactive REPL
- `src/core/orchestrator.ts`, `streamingOrchestrator.ts`, `router.ts`, `sessionManager.ts` — the actual chat/routing pipeline
- `src/providers/` — SAP AI Core / proxy providers; `getProviderForModel` dispatches by model id prefix
- `src/agent/` — autonomous agent loop and prompts (`src/agent/prompts/`)
- `src/tool/tools/*.ts` — built-in tool implementations registered via `src/tool/registry.ts`; new tools use `defineTool` from `src/tool/index.ts` and a Zod schema
- `src/permission/`, `src/bus/`, `src/mcp/`, `src/hooks/`, `src/plugin/`, `src/skill/` — extension/permission surfaces; touch carefully and check tests in matching `tests/` subdirs

Routing is JSON-driven: `routing-config.json` (and `routing-config.example.json`). Sessions persist to `~/.alexi/sessions/`.

## Conventions that bite

- ESLint is strict: `eqeqeq`, `curly: all`, `no-throw-literal`, `no-console: warn` (only `src/utils/logger.ts` is allowed to use `console`). Unused vars must be prefixed `_`.
- Prettier: 100 cols, single quotes, `trailingComma: es5`, LF. Format check is a separate CI job — running `npm run format` before commit avoids surprises.
- Commits: commitlint with `@commitlint/config-conventional` AND a fixed `scope-enum` (`commitlint.config.cjs`). Allowed scopes: `cli, core, providers, config, server, agent, tools, ci, deps, tests`. Other scopes fail the husky `commit-msg` hook.
- husky `pre-commit` runs `lint-staged` (eslint --fix + prettier on staged `*.ts`). Don't `git commit --no-verify` to bypass — CI will catch it anyway.
- `coverage/` thresholds in `vitest.config.ts` (15–20%) are for the local run; CI enforces a higher 40% lines threshold via jq on `coverage/coverage-summary.json`. Adding code without tests can break CI even when local tests pass.

## Environment

- Required for live SAP runs: `AICORE_SERVICE_KEY` (full JSON), `AICORE_RESOURCE_GROUP`, plus either `AICORE_DEPLOYMENT_ID`/`AICORE_MODEL` or the `SAP_PROXY_*` proxy vars (see `.env.example`). Tests mock providers — do not require real credentials.
- `dotenv` is loaded by the CLI; `.env` at repo root is the expected path.

## GitHub Actions agent fleet

- All `.github/workflows/agent*.yml`, `auto-implement.yml`, `ci-auto-fix.yml`, `daily-merge-prs.yml`, `documentation-update.yml`, and `agent-autohealing.yml` use a workflow-level `env:` block: `AGENT_MODEL`, `KILO_FLAGS`, `KILO_RETRIES`. Bump the model in **one place per workflow** — never inline `-m "sap-ai-core/..."` again.
- Same model is also pinned in `kilo.json` (gitignored — local config) and in `.specify/memory/constitution.md`. `sync-upstream.yml` uses two-stage planning + execution, both currently on the same opus model.
- Each `kilo run` invocation in the agent workflows is wrapped in a small bash retry-with-backoff loop driven by `KILO_RETRIES`. When adding a new workflow, copy the existing pattern instead of inventing a new one — `agent-autohealing.yml` and `auto-implement.yml` are the cleanest references.
- `ci-auto-fix.yml` and `documentation-update.yml` have their own pre-existing retry logic that detects transient network errors (`socket hang up`, `ECONNRESET`, `ETIMEDOUT`, `ENOTFOUND`, `fetch failed`) — keep that intact when refactoring.
- Watch for the `npm install -g @kilocode/cli` mid-pipe trap: in older versions of these workflows it was accidentally embedded into `run_check "build"` / `run_check "test"` definitions, silently turning the build verification into a CLI reinstall. Use `npm run build` / `npm run test:coverage` directly.

## Existing instruction sources to respect

- `.kilo/` and `.kilocode/rules/` — agent rules already loaded by tooling; check before adding overlapping guidance here
- `.specify/` — Spec Kit config; feature plans under `specs/NNN-*` drive the "Recent Changes" log in `.kilocode/rules/specify-rules.md`
- `kilo.json` — model + provider config for Kilo sessions in this repo
- `docs/ARCHITECTURE.md`, `docs/ROUTING.md`, `docs/PROVIDERS.md`, `docs/TESTING.md` — authoritative deep dives; prefer over re-deriving from code
- `contributing.md` — contributor workflow
- ESLint ignores `specs/` — generated/spec files there won't be linted, don't put runtime code in `specs/`

## Testing quirks

- Mock provider modules **before** importing the code under test (vitest hoists `vi.mock`, but explicit ordering keeps it readable):
  ```ts
  vi.mock('../src/providers/index.js', () => ({ getProviderForModel: vi.fn(), getDefaultModel: vi.fn() }));
  import { sendChat } from '../src/core/orchestrator.js';
  ```
- Tool tests typically create a temp `workdir` with `fs.mkdtemp` and tear it down in `afterEach` — follow the same pattern when adding tool tests so they stay parallel-safe.
- `tests/setup.ts` is intentionally empty; do not put global mocks there without a strong reason.

## Build artifacts / bins

- `npm run build` emits to `dist/` with `rootDir: src`. Bins resolve to `dist/cli/program.js`, so a fresh clone needs `npm run build` (or `npm link` after build) before `alexi`/`ax` work; `npm run dev` is the no-build path.
