<!-- Sync Impact Report
## Constitution v1.0.0 — Initial Ratification

### Changes from template
- All [PLACEHOLDER] tokens replaced; no remaining bracket tokens.
- 7 principles defined (SAP-AI-Core-First, CLI-First, Provider Abstraction,
  Agentic Architecture, Test Discipline, Simplicity/YAGNI, Security &
  Credential Hygiene).
- Section 2: Technology Constraints added.
- Section 3: Development Workflow added.
- Governance section filled.

### Template propagation
- `plan-template.md` § Constitution Check: generic placeholder replaced with
  Alexi-specific gates (see that file).
- `spec-template.md`: no constitution-specific tokens; no change required.
- `tasks-template.md`: no constitution-specific tokens; no change required.
- `.specify/templates/commands/`: directory does not exist; no command files to
  update.

### Impact on existing artefacts
- No existing plan/spec/tasks documents found under `specs/`; no back-fill
  needed.
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

## Technology Constraints

- **Runtime**: Node.js >= 22.12.0; ES Modules (`"type": "module"`); no CommonJS
  modules.
- **Language**: TypeScript with `strict: true`; target ES2022; module NodeNext.
- **LLM API**: SAP AI Core Orchestration API exclusively; client lives in
  `src/providers/sap/`.
- **Package manager**: npm; `package-lock.json` must be committed and kept in
  sync.
- **Formatting & linting**: Prettier + ESLint as configured; CI enforces both;
  no `--no-verify` bypasses without explicit justification in the PR.
- **Dependency policy**: New runtime dependencies require justification in the
  PR description; `devDependencies` are unrestricted.

## Development Workflow

- **Branching**: All production changes target `master` directly or via short-
  lived feature branches; branch names follow `###-short-description`.
- **Commits**: Conventional Commits format, max 100-character header.
  Valid types: `feat fix docs style refactor perf test chore ci revert`.
  Valid scopes: `cli core providers config server agent tools ci deps tests`.
- **Pre-commit hooks**: eslint --fix → prettier --write → commitlint run
  automatically; never skip with `--no-verify` without team approval.
- **CI gates** (must all pass before merge):
  1. `npm run typecheck` — zero TypeScript errors.
  2. `npm run lint` — zero ESLint errors.
  3. `npm run format:check` — zero Prettier violations.
  4. `npm test` — all Vitest tests pass.
- **Versioning**: Semantic versioning (`MAJOR.MINOR.PATCH`); `sync-upstream.yml`
  bumps PATCH automatically; MINOR/MAJOR bumps are manual.
- **Release**: Merging a version-bump PR to `master` triggers `update-homebrew.yml`,
  which creates/updates the `alexi.rb` Homebrew formula automatically.

## Governance

This constitution supersedes all other development guidelines and practices for
the Alexi project.  
Amendments require: (1) a PR updating this file with an incremented semantic
version and a new `Last Amended` date, (2) a Sync Impact Report HTML comment
listing affected templates and artefacts, and (3) approval from the project
maintainer.  
All PRs and code reviews must verify compliance with the principles above.  
Violations of Principle V (Test Discipline) or Principle VII (Security &
Credential Hygiene) are blocking; all other violations may be documented in the
Complexity Tracking table and merged with maintainer approval.  
For runtime agent development guidance see `AGENTS.md`.

**Version**: 1.0.0 | **Ratified**: 2026-02-27 | **Last Amended**: 2026-03-15
