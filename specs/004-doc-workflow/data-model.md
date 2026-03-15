# Data Model: Documentation Workflow Redesign

**Branch**: `004-doc-workflow` | **Date**: 2026-03-15

This feature has no runtime data models (no TypeScript types, no database schemas). The "data model" is the **file inventory**, **scope trigger mapping**, and **template inventory** that govern the workflow's behavior.

## Managed Documentation Files

The canonical list of files the workflow manages. Each file has:
- **Path**: Exact on-disk path (case-sensitive)
- **Scope Triggers**: Which source code patterns cause this file to be included in the update scope
- **Conditional Template**: Which `.github/templates/07-conditional/` file provides instructions for this document
- **Always Updated**: Whether this file is updated on every run regardless of scope

| # | Path | Scope Triggers | Conditional Template | Always |
|---|------|---------------|---------------------|--------|
| 1 | `docs/ARCHITECTURE.md` | `src/cli/**`, `src/core/**` | `architecture-api.md` | No |
| 2 | `docs/API.md` | `src/cli/**`, `src/core/**` | `architecture-api.md` | No |
| 3 | `docs/ROUTING.md` | `src/core/router.ts`, `src/config/routing*` | `routing.md` | No |
| 4 | `docs/PROVIDERS.md` | `src/providers/**` | `providers.md` | No |
| 5 | `docs/CONFIGURATION.md` | `src/config/**`, `package.json`, `tsconfig.json`, `.env.example` | `configuration.md` | No |
| 6 | `docs/TESTING.md` | `tests/**`, `*.test.ts`, `*.spec.ts` | `testing.md` | No |
| 7 | `docs/AUTOMATION.md` | `.github/workflows/**`, `scripts/**` | `automation.md` | No |
| 8 | `docs/CONTRIBUTING.md` | — | `changelog-contributing.md` | Yes |
| 9 | `CHANGELOG.md` | — | `changelog-contributing.md` | Yes |

## Unmanaged Documentation Files

Files in `docs/` that the workflow MUST NOT touch:

| Path | Reason |
|------|--------|
| `docs/permission-system.md` | Manual documentation for permission system |
| `docs/migration-guide-permission-prompts.md` | Migration guide — hand-written |
| `docs/permission-prompt-quick-ref.md` | Quick reference — hand-written |

## Scope Trigger Mapping

The workflow analyzes changed files and sets boolean flags. This mapping defines which file patterns set which flags:

| Flag | File Patterns | Docs Triggered |
|------|--------------|----------------|
| `cli_changed` | `src/cli/**` | ARCHITECTURE, API |
| `core_changed` | `src/core/**` | ARCHITECTURE, API |
| `routing_changed` | `src/core/router.ts`, `src/config/routing*` | ROUTING |
| `providers_changed` | `src/providers/**` | PROVIDERS |
| `config_changed` | `package.json`, `tsconfig.json`, `.env.example`, `src/config/**` | CONFIGURATION |
| `tests_changed` | `tests/**`, `**/*.test.ts`, `**/*.spec.ts` | TESTING |
| `workflows_changed` | `.github/workflows/**` | AUTOMATION |
| `scripts_changed` | `scripts/**` | AUTOMATION |

**Change from current**: The `routing_changed` flag now checks `src/core/router.ts` (actual path) instead of `src/(router|routing)/` (non-existent directories).

## Template Assembly Order

Templates are concatenated in this order to produce the final agent prompt:

```
01-header.md                    # Project context (always)
02-changed-files-header.md      # Section header (always)
  + analysis.md                 # Dynamic: changed files analysis output
03-commits-header.md            # Section header (always)
  + commits.md                  # Dynamic: commit messages
04-diff-header.md               # Section header (always)
  + diff.md                     # Dynamic: diff summary
05-scope-header.md              # Section header (always)
  + scope.md                    # Dynamic: documentation scope
06-requirements.md              # General requirements (always)
07-conditional/*                # Conditional sections (per scope flags)
08-footer.md                    # Quality requirements + output format (always)
```

## Agent Invocation Parameters

| Parameter | Value | Rationale |
|-----------|-------|-----------|
| `--message-file` | `kilo-prompt.md` | Assembled prompt from templates |
| `--system` | Role-only prompt | Simplified; no duplicate instructions |
| `--auto-route` | (flag) | Let the agent pick the best model |
| `--effort` | `high` | Ensures `maxTokens >= 32768` to prevent truncation |
| `--max-iterations` | `30` | Sufficient for 8-10 doc files |
| `--tools` | `read,write,edit,glob,grep` | File operation tools only |
| `--workdir` | `$(pwd)` | Repository root |
| `--no-auto-commits` | (flag) | Workflow handles git commit/push |
| `--verbose` | (flag) | Full output for debugging |

## Commit Metadata

| Field | Value |
|-------|-------|
| Author | `github-actions[bot] <github-actions[bot]@users.noreply.github.com>` |
| Message | `docs: auto-generate documentation [skip ci] [alexi-bot]` |
| Detection Tag | `[alexi-bot]` — used by workflow to find previous doc commits |
