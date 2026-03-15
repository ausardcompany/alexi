# Implementation Plan: Documentation Workflow Redesign

**Branch**: `004-doc-workflow` | **Date**: 2026-03-15 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/004-doc-workflow/spec.md`

## Summary

Redesign the GitHub Actions documentation-update workflow to fix 12 identified structural issues (case mismatches, truncated diffs, duplicate prompt instructions, overly aggressive `.md` filtering, unreliable commit/push step, stale templates, etc.). The approach: rewrite the workflow YAML, update all templates to reflect the actual project structure, eliminate prompt redundancy, fix the changed-files analysis, and make the commit/push step handle all edge cases. No changes to application source code (`src/`) — this feature is entirely in `.github/` and `docs/`.

## Technical Context

**Language/Version**: YAML (GitHub Actions workflow) + Bash (shell steps) + Markdown (templates)
**Primary Dependencies**: GitHub Actions (`actions/checkout@v4`, `actions/setup-node@v4`, `actions/upload-artifact@v4`, `actions/github-script@v7`), Node.js 22, Alexi CLI (`node dist/cli/program.js agent`)
**Storage**: Git repository (docs committed to `docs/` directory and repository root)
**Testing**: Manual workflow dispatch on a test PR; verify file changes, PR comments, and artifact uploads. No Vitest tests needed (no `src/` changes). Optionally: shellcheck for bash steps.
**Target Platform**: GitHub Actions runner (ubuntu-latest)
**Project Type**: CI/CD pipeline (GitHub Actions workflow + prompt templates)
**Performance Goals**: Workflow completes in <10 minutes for a typical PR
**Constraints**: Single LLM API call budget (SAP AI Core); `--max-iterations 30` agent loop; `maxTokens` >= 32768 for high effort
**Scale/Scope**: 8-10 managed documentation files, 16 template files, 1 workflow YAML (~685 lines)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Verify compliance with [Alexi Constitution](../../.specify/memory/constitution.md) before proceeding.

| # | Gate | Status |
|---|------|--------|
| 1 | **SAP AI Core-First** — All LLM calls route through SAP AI Core Orchestration; no direct provider API calls outside `src/providers/`. | [x] N/A — No new LLM calls added. Existing agent invocation already routes through SAP AI Core via the CLI. |
| 2 | **CLI-First** — Feature is reachable from the CLI; `--print`/`--file` non-interactive modes unaffected; stdout/stderr contract preserved. | [x] N/A — No CLI changes. The workflow invokes the existing `agent` CLI command. |
| 3 | **Provider Abstraction** — Changes confined to `src/providers/` + `src/config/` for any provider-level work; no provider SDK imports outside `src/providers/`. | [x] N/A — No provider changes. |
| 4 | **Agentic Architecture** — Agent specialisation declared in `src/agent/prompts/`; tool results flow through event bus; MCP hot-pluggable. | [x] N/A — No agent architecture changes. The workflow uses the existing agent command. |
| 5 | **Test Discipline (BLOCKING)** — New public functions/classes have unit tests; bug fixes have regression tests; `npm test` green; no real network/filesystem calls in tests. | [x] PASS — No new `src/` code. Existing tests unaffected. `npm test` must remain green. |
| 6 | **Simplicity / YAGNI** — No unjustified abstractions; complexity violations documented in Complexity Tracking table below. | [x] PASS — Direct fixes to existing workflow; no new abstractions. Template cleanup reduces complexity. |
| 7 | **Security & Credential Hygiene (BLOCKING)** — No credentials committed; secrets via env vars only; no `console.log` in non-CLI modules. | [x] PASS — Secrets (`AICORE_SERVICE_KEY`, `AICORE_RESOURCE_GROUP`) remain in GitHub Actions secrets, referenced via `${{ secrets.* }}`. No credentials in committed files. |

## Project Structure

### Documentation (this feature)

```text
specs/004-doc-workflow/
├── plan.md              # This file
├── spec.md              # Feature specification (8 user stories, 16 FRs)
├── research.md          # Phase 0: analysis of all 12 issues with resolution decisions
├── data-model.md        # Phase 1: file inventory, scope trigger mapping, template inventory
├── quickstart.md        # Phase 1: step-by-step guide to test the redesigned workflow
└── contracts/           # Phase 1: new template contents, workflow step pseudocode
```

### Source Code (repository root)

```text
.github/
├── workflows/
│   └── documentation-update.yml   # PRIMARY: rewritten workflow (~700 lines)
├── templates/
│   ├── 01-header.md               # MODIFIED: updated project structure, CLI commands
│   ├── 02-changed-files-header.md # UNCHANGED
│   ├── 03-commits-header.md       # UNCHANGED
│   ├── 04-diff-header.md          # MODIFIED: remove head -100 truncation instruction
│   ├── 05-scope-header.md         # UNCHANGED
│   ├── 06-requirements.md         # MODIFIED: deduplicate Mermaid requirement
│   ├── 07-conditional/            # MODIFIED: update file path references, add missing templates
│   │   ├── architecture-api.md
│   │   ├── automation.md
│   │   ├── changelog-contributing.md
│   │   ├── configuration.md
│   │   ├── providers.md
│   │   ├── routing.md
│   │   └── testing.md
│   ├── 08-footer.md               # MODIFIED: remove duplicate Mermaid requirement
│   └── README.md                  # MODIFIED: update to reflect changes
docs/
├── architecture.md                # RENAMED or KEPT: resolve casing (decision in research.md)
├── API.md
├── AUTOMATION.md
├── CONTRIBUTING.md
├── TESTING.md
├── ROUTING.md                     # NEW: created when routing scope triggers
├── PROVIDERS.md                   # NEW: created when providers scope triggers
├── CONFIGURATION.md               # NEW: created when config scope triggers
├── permission-system.md           # UNMANAGED: not touched by workflow
├── migration-guide-permission-prompts.md  # UNMANAGED
└── permission-prompt-quick-ref.md         # UNMANAGED
```

**Structure Decision**: This feature modifies only CI/CD files (`.github/`) and documentation (`docs/`). No `src/` or `tests/` changes. The project follows the existing single-project structure.

## Complexity Tracking

> No constitution violations. All changes are direct fixes to existing workflow infrastructure.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|--------------------------------------|
| — | — | — |
