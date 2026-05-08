<!-- Sync Impact Report
## Constitution v2.0.0 — Autonomous Development Pipeline

### Changes from v1.0.0
- Added Principle VIII: Autonomous Development (SDD pipeline)
- Added Section: Autonomous Agent Pipeline
- Updated Governance for autonomous agent compliance
- Updated Technology Constraints for spec-kit integration

### Template propagation
- `.specify/` templates: spec-kit SDD templates now active
- `.kilocode/workflows/speckit.*.md`: slash commands installed
- `.github/workflows/agent*.yml`: 5-agent pipeline + autohealing

### Impact on existing artefacts
- All existing principles (I–VII) remain unchanged
- New principle VIII governs autonomous agent behavior only
-->

# Alexi Constitution

## Core Principles

### I. SAP AI Core-First
All LLM calls MUST route through the SAP AI Core Orchestration API.
Direct calls to provider APIs (Anthropic, OpenAI, etc.) that bypass SAP AI
Core are forbidden in production code.
Every new model or deployment requires a corresponding SAP AI Core deployment
configuration; no hard-coded model strings outside `src/config/`.

### II. CLI-First
Alexi is a CLI tool. Every capability must be reachable from the command line.
The interactive REPL is the primary UX surface; non-interactive (`--print`,
`--file`) modes are first-class and must not regress.
Text output follows the convention: results → stdout, diagnostics/errors →
stderr. JSON output mode (`--output json`) must be maintained for scripting.

### III. Provider Abstraction
LLM provider logic lives exclusively in `src/providers/`.
The rest of the codebase imports only the provider interface, never concrete
provider SDKs.
Adding or changing a provider requires no changes outside `src/providers/` and
`src/config/`.

### IV. Agentic Architecture
Agent specialisation (coding, planning, general) is declared in
`src/agent/prompts/` and selected by the router in `src/core/router.ts`.
Tool execution uses the event bus (`src/bus/`) for observability; direct
tool-result side-channels are forbidden.
MCP integration (`src/mcp/`) must remain hot-pluggable: disabling MCP must not
break non-MCP flows.

### V. Test Discipline
Every new public function or exported class requires at least one unit test.
Bug fixes require a regression test that fails before the fix and passes after.
Tests run in isolation (temp dirs, mocked providers); real network calls and
real filesystem side-effects outside temp dirs are forbidden in tests.
`npm test` must remain green on every commit pushed to `master`.

### VI. Simplicity / YAGNI
Prefer the simplest implementation that satisfies the current requirement.
Abstractions must be justified by at least two concrete use-cases present in
the codebase.
Complexity violations (e.g., extra layers, premature generalisation) must be
documented in the plan's Complexity Tracking table before merging.

### VII. Security & Credential Hygiene
No credentials, tokens, or SAP AI Core deployment IDs may be committed to the
repository.
All secrets are read from environment variables (see `src/config/env.ts`).
`console.log` in non-CLI modules is forbidden; use the logger utilities in
`src/utils/` to avoid accidental credential leakage in logs.

### VIII. Autonomous Development (SDD)
The project uses Spec-Driven Development via a 5-agent autonomous pipeline.
Agents operate without human intervention following this chain:

1. **Specify** — identify what to build from upstream trends
2. **Plan + Tasks** — break spec into implementable tasks and GitHub issues
3. **Implement** — pick issue, write code, pass all checks
4. **Review** — verify quality, fix issues, approve PR
5. **Release** — bump version, changelog, tag, publish

Agent rules:
- Agents MUST NOT modify `.github/workflows/` files
- Agents MUST NOT change `package.json` version (except Agent 5)
- Agents MUST NOT add `eslint-disable` or `@ts-ignore`
- Agents MUST NOT skip CI checks or add `continue-on-error` as a fix
- All agent commits include `[alexi-bot]` or `[autohealing]` suffix
- Maximum 3 autohealing retries per day per branch
- Escalation to human via `autohealing-escalation` label if unfixable

## Technology Constraints

- **Runtime**: Node.js >= 22.12.0; ES Modules (`"type": "module"`); no CommonJS.
- **Language**: TypeScript with `strict: true`; target ES2022; module NodeNext.
- **LLM API**: SAP AI Core Orchestration API exclusively; model:
  `sap-ai-core/anthropic--claude-4.6-opus` with `--variant max`.
- **Package manager**: npm; `package-lock.json` must be committed and in sync.
- **Formatting & linting**: Prettier + ESLint as configured; CI enforces both.
- **Dependency policy**: New runtime deps require justification; devDeps are free.
- **SDD Toolkit**: spec-kit (`specify` CLI); specs live in `.specify/`.
- **Agent CLI**: Kilo Code CLI (`kilo`); workflows in `.kilocode/workflows/`.

## Development Workflow

- **Branching**: `master` is the default. Feature branches: `auto/NNN-description`.
- **Commits**: Conventional Commits, max 100-char header.
  Types: `feat fix docs style refactor perf test chore ci revert`.
  Scopes: `cli core providers config server agent tools ci deps tests`.
- **Pre-commit hooks**: eslint-fix → prettier → commitlint (never skip).
- **CI gates** (all must pass before merge):
  1. `npm run typecheck` — zero TypeScript errors
  2. `npm run lint` — zero ESLint errors
  3. `npm run format:check` — zero Prettier violations
  4. `npm test` — all Vitest tests pass
- **SDD Flow**: specify → plan → tasks → implement → review → release
- **Versioning**: SemVer; PATCH auto, MINOR on `feat`, MAJOR manual only.

## Autonomous Agent Pipeline

| Agent | Schedule | Command | Output |
|-------|----------|---------|--------|
| 1: Specify | Daily 04:00 UTC | `speckit.specify` | `.specify/specs/` |
| 2: Plan | Daily 06:00 UTC | `speckit.plan` → `speckit.tasks` → `speckit.taskstoissues` | GitHub issues |
| 3: Implement | Every 2h | `speckit.implement` | PR with code |
| 4: Review | On PR | `local-review` | Review comment |
| 5: Release | Weekly Mon | direct prompt | Tag + Release |
| Autohealing | On failure | direct prompt | Fix commit |

All agents run: `kilo run --auto -m "sap-ai-core/anthropic--claude-4.6-opus" --variant max`

## Governance

This constitution supersedes all other development guidelines for Alexi.

Amendments require:
1. A PR updating this file with incremented version and new `Last Amended` date
2. A Sync Impact Report (HTML comment) listing affected templates/artefacts
3. Approval from the project maintainer

Compliance rules:
- All PRs must verify compliance with principles I–VIII
- Violations of V (Tests) or VII (Security) are **blocking**
- Violations of VIII (Agent rules) trigger autohealing escalation
- All other violations may be documented and merged with maintainer approval
- For runtime agent guidance see `AGENTS.md`

**Version**: 2.0.0 | **Ratified**: 2026-02-27 | **Last Amended**: 2026-05-08
