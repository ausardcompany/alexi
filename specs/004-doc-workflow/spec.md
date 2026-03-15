# Feature Specification: Documentation Workflow Redesign

**Feature Branch**: `004-doc-workflow`
**Created**: 2026-03-15
**Status**: Draft
**Input**: User description: "Redesign the GitHub Actions documentation-update workflow from scratch — fix all 12 identified structural issues, adopt Docs-as-Code principles, and produce a reliable pipeline that generates/updates documentation on every PR."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - PR Author Gets Accurate Docs on Every PR (Priority: P1)

A developer opens a PR against `master`. The documentation workflow runs automatically, reads the actual source code (not just a truncated diff), generates or updates the relevant documentation files, commits them to the PR branch, and posts a summary comment on the PR.

**Why this priority**: This is the core value proposition — automated, accurate documentation that stays in sync with code. Without this working reliably, the entire workflow is useless.

**Independent Test**: Open a test PR that modifies `src/core/orchestrator.ts`. Verify: (1) workflow triggers, (2) `docs/architecture.md` is updated with content reflecting the actual code, (3) changes are committed and pushed to the PR branch, (4) a summary comment appears on the PR.

**Acceptance Scenarios**:

1. **Given** a PR with changes to `src/cli/commands/*.ts`, **When** the workflow runs, **Then** `docs/API.md` is updated with current CLI commands and options, committed to the PR branch, and a summary comment is posted.
2. **Given** a PR with changes only to `tests/`, **When** the workflow runs, **Then** `docs/TESTING.md` is updated and no other doc files are modified.
3. **Given** a PR with no source code changes (docs-only), **When** the workflow runs, **Then** the workflow posts a "skipped — no code changes" comment and exits cleanly.

---

### User Story 2 - Case-Correct and Complete File Management (Priority: P1)

All documentation file references in the workflow, templates, and scope logic use consistent casing that matches the files on disk. No duplicate files are created on case-sensitive filesystems (Linux CI). All expected doc files are accounted for in the workflow scope.

**Why this priority**: The case mismatch (`architecture.md` vs `ARCHITECTURE.md`) and missing files (`ROUTING.md`, `PROVIDERS.md`, `CONFIGURATION.md`) are root causes of silent failures. Fixing this is a prerequisite for US1.

**Independent Test**: Run the workflow on Ubuntu CI. Verify that `ls -la docs/` shows exactly the expected files with correct casing, no duplicates.

**Acceptance Scenarios**:

1. **Given** the workflow references `docs/ARCHITECTURE.md`, **When** the file on disk is `docs/architecture.md`, **Then** the workflow uses the correct on-disk filename (either rename the file or update all references — one canonical name).
2. **Given** the scope includes `docs/ROUTING.md`, **When** routing code changes, **Then** the file is created if it doesn't exist, or updated if it does.
3. **Given** existing unmanaged docs (`permission-system.md`, etc.), **When** the workflow runs `git add docs/`, **Then** it does NOT stage unmanaged files — only explicitly scoped files are staged.

---

### User Story 3 - Agent Reads Full Source Code, Not Truncated Diffs (Priority: P1)

The LLM agent receives accurate, complete context about the codebase — not `head -100` truncated diffs. The agent uses its `read`, `glob`, and `grep` tools to examine actual source files rather than relying solely on the diff preview in the prompt.

**Why this priority**: Truncated diffs mean the agent writes documentation based on incomplete information, producing inaccurate docs. The agent must be instructed to read source files directly.

**Independent Test**: Trigger the workflow on a PR with 500+ lines of diff. Verify that the assembled prompt does NOT truncate the diff to 100 lines, and that the agent's tool call log shows `read` calls to actual source files (not just docs).

**Acceptance Scenarios**:

1. **Given** a PR with a large diff (>100 lines), **When** the prompt is assembled, **Then** the diff section either includes the full diff or explicitly instructs the agent to use `read`/`grep` tools to examine source files.
2. **Given** the system prompt, **When** the agent starts, **Then** the prompt instructs the agent to read source code files before writing documentation (not just rely on the embedded diff).

---

### User Story 4 - Clean Prompt Assembly Without Redundancy (Priority: P2)

The assembled prompt has no duplicate instructions (e.g., the "3 Mermaid diagrams" requirement appears once, not three times). The system prompt and the message prompt do not contain conflicting instructions. The template content reflects the actual project structure.

**Why this priority**: Redundant/conflicting prompts waste tokens and confuse the LLM, leading to inconsistent output. Cleaning this up improves generation quality.

**Independent Test**: Assemble the prompt and grep for duplicate phrases. Verify that key instructions appear exactly once. Verify the project structure tree in `01-header.md` matches the actual `src/` layout.

**Acceptance Scenarios**:

1. **Given** the assembled prompt, **When** searched for "Mermaid", **Then** the diagram requirement appears in exactly one location.
2. **Given** the system prompt and message prompt, **When** both are provided to the agent, **Then** there are no contradictory instructions between them.
3. **Given** `01-header.md`, **When** it references project directories, **Then** the listed directories match the actual `src/` structure (e.g., `src/core/` not `src/router/`, includes `src/agent/`, `src/tool/`, `src/mcp/`, etc.).

---

### User Story 5 - Reliable Commit and Push (Priority: P2)

The workflow's commit/push step handles all edge cases: unstaged changes, already-committed-but-unpushed changes (from auto-commit manager), no changes, and branch protection. The step never silently fails.

**Why this priority**: The commit step was Root Cause #2 — changes were generated but never pushed. This must be bulletproof.

**Independent Test**: Simulate three scenarios: (a) agent produces unstaged changes, (b) agent's auto-commit manager has already committed changes, (c) agent produces no changes. Verify correct behavior in each case.

**Acceptance Scenarios**:

1. **Given** the agent writes files but doesn't commit them, **When** the commit step runs, **Then** files are staged, committed with `[skip ci]`, and pushed.
2. **Given** the agent's auto-commit manager has already committed changes locally, **When** the commit step runs, **Then** the existing commit is detected and pushed (not duplicated).
3. **Given** the agent produces no file changes, **When** the commit step runs, **Then** it logs "no changes" and exits 0 (not an error).

---

### User Story 6 - Correct .md File Filtering in Changed Files Analysis (Priority: P2)

The changed files analysis step correctly distinguishes between documentation files (which should be excluded from "code changes" detection) and important `.md` files like `AGENTS.md`, `README.md`, or template files (which represent meaningful changes that should trigger doc updates).

**Why this priority**: The current `grep -v '.*\.md$'` filter removes ALL markdown files, hiding changes to `AGENTS.md`, `.github/templates/*.md`, and other non-doc markdown files from the analysis.

**Independent Test**: Open a PR that modifies only `AGENTS.md`. Verify that the workflow detects code-relevant changes (not "no code changes") and triggers a documentation update.

**Acceptance Scenarios**:

1. **Given** a PR that only modifies `AGENTS.md`, **When** changed files are analyzed, **Then** the workflow does NOT skip with "no code changes."
2. **Given** a PR that modifies `docs/architecture.md` and nothing else, **When** changed files are analyzed, **Then** the workflow correctly identifies this as "docs-only" and skips regeneration.
3. **Given** a PR that modifies `.github/templates/01-header.md`, **When** changed files are analyzed, **Then** the workflow detects this as a meaningful change.

---

### User Story 7 - Force Full Regeneration (Priority: P3)

A maintainer can trigger the workflow manually via `workflow_dispatch`, providing a PR number and optionally forcing full documentation regeneration regardless of what files changed.

**Why this priority**: This is a recovery mechanism. Lower priority because the normal flow (US1) should work reliably; manual triggering is a fallback.

**Independent Test**: Trigger the workflow manually with `force_full_regeneration: true` and a valid PR number. Verify all doc files are regenerated.

**Acceptance Scenarios**:

1. **Given** a manual workflow dispatch with `force_full_regeneration: true`, **When** the workflow runs, **Then** ALL documentation files are regenerated (not just those matching changed modules).

---

### User Story 8 - Post-Generation Validation (Priority: P3)

After the agent generates documentation, the workflow validates the output: Markdown lint check, Mermaid syntax validation, broken link detection. Validation failures are reported in the PR comment but do NOT block the commit.

**Why this priority**: Validation catches common LLM output issues (broken Mermaid, invalid markdown) without blocking the workflow. Nice-to-have but not critical for MVP.

**Independent Test**: Generate docs with an intentionally broken Mermaid diagram. Verify the PR comment includes a warning about the broken diagram but the docs are still committed.

**Acceptance Scenarios**:

1. **Given** generated docs with a broken Mermaid diagram, **When** validation runs, **Then** a warning is included in the PR comment listing the broken diagram(s).
2. **Given** generated docs with all valid content, **When** validation runs, **Then** the PR comment says "all validations passed."

---

### Edge Cases

- What happens when the PR branch has merge conflicts with `master`?
- How does the workflow handle SAP AI Core API rate limits or timeouts?
- What happens when the agent exhausts `--max-iterations` without finishing all docs?
- How does the workflow behave when `docs/` directory doesn't exist yet?
- What happens if the agent's `write` tool call is truncated due to insufficient `maxTokens`?
- How does the workflow handle concurrent runs on the same PR (e.g., rapid pushes)?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Workflow MUST trigger on `pull_request` events (opened, synchronize, reopened) to `master` branch.
- **FR-002**: Workflow MUST support `workflow_dispatch` with `pr_number` and `force_full_regeneration` inputs.
- **FR-003**: Workflow MUST use a single canonical casing for each documentation file (resolve `architecture.md` vs `ARCHITECTURE.md` mismatch).
- **FR-004**: Workflow MUST create documentation files that don't yet exist when their scope is triggered (e.g., `docs/ROUTING.md` on first routing change).
- **FR-005**: Workflow MUST NOT stage unmanaged documentation files — only explicitly scoped files are added to git.
- **FR-006**: Workflow MUST pass `--effort high` (or equivalent `maxTokens >= 32768`) to the agent to prevent tool call truncation.
- **FR-007**: Workflow MUST include `--no-auto-commits` flag on the agent invocation.
- **FR-008**: Changed files analysis MUST NOT filter out non-doc `.md` files like `AGENTS.md` or template files.
- **FR-009**: Diff preview MUST NOT be truncated with `head -100`; either include full diff or instruct agent to read source directly.
- **FR-010**: System prompt and message prompt MUST NOT contain duplicate or conflicting instructions.
- **FR-011**: Template `01-header.md` MUST reflect the actual project structure (current `src/` layout with `core/`, `agent/`, `tool/`, `mcp/`, etc.).
- **FR-012**: Template `01-header.md` MUST include all current CLI commands (including `agent`).
- **FR-013**: Commit step MUST handle three cases: (a) unstaged changes, (b) already-committed local changes, (c) no changes.
- **FR-014**: Commit step MUST use `[skip ci]` in the commit message to prevent infinite workflow loops.
- **FR-015**: Workflow MUST post a PR comment with generation status (success, failure, or skipped).
- **FR-016**: Workflow MUST upload prompt and output logs as artifacts for debugging.

### Key Entities *(include if feature involves data)*

- **Documentation File**: A markdown file in `docs/` or repository root, managed by the workflow. Has a canonical path, scope trigger conditions, and conditional template.
- **Scope Trigger**: A mapping from changed-file patterns (e.g., `src/cli/**`) to documentation files that should be updated.
- **Template**: A markdown fragment in `.github/templates/` that contributes to the assembled agent prompt. Ordered (01-08) with conditional inclusion (07-conditional/).
- **Agent Invocation**: The CLI command that runs the LLM agent with specific flags (`--effort`, `--no-auto-commits`, `--tools`, `--max-iterations`).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The workflow produces non-empty file changes on 95%+ of PRs with source code modifications (measured over 10 consecutive PR runs).
- **SC-002**: Zero case-mismatch file duplicates on Ubuntu CI (case-sensitive filesystem).
- **SC-003**: The assembled prompt contains zero duplicate instruction phrases (verified by automated grep).
- **SC-004**: The `01-header.md` project structure matches the actual `src/` directory layout (verified by diff).
- **SC-005**: The commit step correctly handles all three edge cases (unstaged, pre-committed, no-changes) without error.
- **SC-006**: `npm test` passes; no regressions in CLI agent command or effort level handling.
- **SC-007**: Workflow execution time remains under 10 minutes for a typical PR.
