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

## Agent factory architecture

The agent fleet has been refactored into a T-shape model. There is one shared baseline + 10 role verticals + one reusable workflow that runs them. Stop copy-pasting the `kilo run` + retry-with-backoff block into every new workflow — it lives in the factory now.

- **Baseline**: `.github/prompts/baseline-system.md` — shared system prompt for ALL agents (tone, safety, output format). Touching this file changes every agent's behaviour. Coordinate carefully.
- **Roles**: `.github/prompts/role-{consulting,product,design,architecture,engineering,quality,data,infrastructure,security,management}.md` — one vertical per file. Each declares what the role owns, what it must NOT do, inputs it reads, outputs it produces, and definition-of-done.
- **Factory**: `.github/workflows/agent-factory.yml` — reusable workflow (`workflow_call`). Inputs: `role`, `task_prompt` (inline string OR `file:<path>`), `title`, `timeout_minutes` (default 15), `commit_changes` (default true), `commit_scope` (default `agent`), `branch` (default `master`). Composes `baseline + role + task` into one combined prompt, runs `kilo run` with the shared retry budget, optionally commits and pushes, uploads prompt + log artefacts.

### Agent ↔ role mapping (reality check before changing one)

| Workflow file                                  | Role             | Trigger                  |
| ---------------------------------------------- | ---------------- | ------------------------ |
| `.github/workflows/agent1-research.yml`        | `consulting`     | cron 04:00 UTC + manual  |
| `.github/workflows/agent2-planning.yml`        | `product`        | after agent1 + cron 06:00 |
| `.github/workflows/auto-implement.yml`         | `engineering`    | cron */30, matrix of 3   |
| `.github/workflows/agent4-review.yml`          | `quality`        | pull_request             |
| `.github/workflows/agent5-release.yml`         | `infrastructure` | cron Mon 10:00 UTC       |
| `.github/workflows/agent6-prompt-optimizer.yml`| `management`     | cron Wed 08:00 UTC       |
| `.github/workflows/agent-architecture.yml`     | `architecture`   | cron Mon 05:00 + PR      |
| `.github/workflows/agent-design.yml`           | `design`         | manual / scheduled       |
| `.github/workflows/agent-data.yml`             | `data`           | manual / scheduled       |
| `.github/workflows/agent-security.yml`         | `security`       | manual / scheduled       |

`agent1-research.yml` polls these reference repos for daily commit signal: `Kilo-Org/kilocode`, `anthropics/claude-code`, `cline/cline`, `aider-ai/aider`, and `sst/opencode`. Update the list in `.github/prompts/agent1-research-system.md` (not in the workflow YAML).

### Adding a new agent (~30 lines of YAML)

1. If a new vertical is needed, write `.github/prompts/role-<name>.md` following the existing role-file shape (identity / vertical knowledge / what you own / must NOT do / inputs / outputs / DoD). Keep it under ~80 lines.
2. If only the *task* is new (existing role works), drop a markdown file under `.github/prompts/tasks/<task>.md`.
3. Create a thin caller workflow that `uses: ./.github/workflows/agent-factory.yml` with `secrets: inherit`. Set `role`, `task_prompt: 'file:.github/prompts/tasks/<task>.md'`, `title`, and any non-default `commit_changes` / `commit_scope` / `branch` / `timeout_minutes`. See `agent-architecture.yml` for the cleanest reference.
4. Commit. Done — no `kilo run`, no retries, no checkout/install boilerplate.

### Pre-/post-step pattern

Caller workflows that need per-run context (today's date, an issue body, a PR number) keep a `prepare:` job that builds the rendered prompt, exposes it via `outputs.task_prompt`, and the factory job consumes it as an inline string. Anything that runs *after* the agent (PR creation, issue comments, version tagging) goes in a `followup:` job that `needs: [prepare, <factory job>]`. Keep `commit_changes: false` for review-only roles so the factory does not push to the PR branch.

### Reminders

- Every change to `.github/prompts/baseline-system.md` affects ALL 10+ agents simultaneously. Treat it like a constitution amendment.
- The factory hardcodes `--no-verify` on its commit because lint-staged + commitlint can race with auto-pushed branches. The shared scope-enum (`cli, core, providers, config, server, agent, tools, ci, deps, tests`) still applies to anything an agent commits *itself* via tools.
- Model is set in ONE place: `env.AGENT_MODEL` inside `agent-factory.yml`. Do not re-pin it in caller workflows.

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
