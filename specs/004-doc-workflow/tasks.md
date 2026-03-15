# Tasks: Documentation Workflow Redesign

**Input**: Design documents from `/specs/004-doc-workflow/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/

**Tests**: No automated tests required — this feature modifies only CI/CD files (`.github/`) and documentation (`docs/`). Verification is via manual workflow dispatch (see quickstart.md).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **CI/CD**: `.github/workflows/`, `.github/templates/`
- **Documentation**: `docs/`, `CHANGELOG.md` (root)
- **No `src/` or `tests/` changes** in this feature

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Resolve file-level prerequisites that all other changes depend on

- [ ] T001 Rename `docs/architecture.md` to `docs/ARCHITECTURE.md` via `git mv` for case consistency (Issue 1 — research.md)
- [ ] T002 [P] Create seed file `docs/ROUTING.md` with placeholder heading and auto-generation notice (Issue 2 — research.md)
- [ ] T003 [P] Create seed file `docs/PROVIDERS.md` with placeholder heading and auto-generation notice (Issue 2 — research.md)
- [ ] T004 [P] Create seed file `docs/CONFIGURATION.md` with placeholder heading and auto-generation notice (Issue 2 — research.md)

**Checkpoint**: All 9 managed documentation files exist on disk with correct casing. `ls docs/` shows: `API.md`, `ARCHITECTURE.md`, `AUTOMATION.md`, `CONFIGURATION.md`, `CONTRIBUTING.md`, `PROVIDERS.md`, `ROUTING.md`, `TESTING.md` (plus 3 unmanaged files).

---

## Phase 2: Foundational (Template Updates)

**Purpose**: Update all prompt templates to reflect the actual project — MUST complete before workflow changes reference them

**CRITICAL**: No workflow rewrite (Phase 3+) should begin until templates are accurate

- [ ] T005 Rewrite `.github/templates/01-header.md` with actual project structure (30 `src/` directories), SAP AI Core-only description, all 16 CLI commands, and "Read Source Code Before Writing" instruction — use content from `contracts/01-header-template.md`
- [ ] T006 [P] Edit `.github/templates/04-diff-header.md` — add note: "This is a preview. If the diff is truncated, use the `read` and `grep` tools to examine actual source files for complete context." (contracts/template-changes.md § 04-diff-header)
- [ ] T007 [P] Edit `.github/templates/06-requirements.md` — add items 7 ("Read existing documentation files before updating") and 8 ("Write files to the EXACT paths listed in the Documentation Scope section"), clarify CHANGELOG path as "repository root, NOT docs/" (contracts/template-changes.md § 06-requirements)
- [ ] T008 [P] Edit `.github/templates/08-footer.md` — remove duplicate Mermaid diagrams line from Quality Requirements, add accuracy requirement ("Verify all referenced file paths, function names, and types against actual source code"), update Output Format to reference `write`/`edit` tools explicitly (contracts/template-changes.md § 08-footer)
- [ ] T009 [P] Edit `.github/templates/07-conditional/architecture-api.md` — add `docs/` prefix to file references, expand scope to include tool system (`src/tool/`), agent system (`src/agent/`), event bus (`src/bus/`), and agent mode CLI docs (contracts/template-changes.md § architecture-api)
- [ ] T010 [P] Edit `.github/templates/07-conditional/routing.md` — fix directory reference from `src/router/` to `src/core/router.ts`, add `src/config/routingConfig.ts` reference (contracts/template-changes.md § routing)
- [ ] T011 [P] Edit `.github/templates/07-conditional/providers.md` — replace multi-provider list with SAP AI Core Orchestration only (`src/providers/sapOrchestration.ts`), add env var documentation (`AICORE_SERVICE_KEY`, `AICORE_RESOURCE_GROUP`) (contracts/template-changes.md § providers)
- [ ] T012 [P] Edit `.github/templates/07-conditional/automation.md` — add documentation for the documentation-update workflow itself (triggers, scope analysis, template assembly, agent invocation, validation) (contracts/template-changes.md § automation)
- [ ] T013 [P] Edit `.github/templates/07-conditional/changelog-contributing.md` — clarify CHANGELOG path as "repository ROOT — not docs/", update CONTRIBUTING section to reference Vitest and current coding standards (contracts/template-changes.md § changelog-contributing)
- [ ] T014 Update `.github/templates/README.md` to reflect template changes made in T005-T013

**Checkpoint**: All templates are accurate. Assembling the prompt from templates produces content that matches the actual project structure.

---

## Phase 3: User Story 2 — Case-Correct and Complete File Management (Priority: P1)

**Goal**: All file references in the workflow use canonical casing; no duplicates on case-sensitive FS; unmanaged files are never staged.

**Independent Test**: Run `git mv` rename (T001), then verify `ls docs/` on Linux shows exactly the expected files. Verify the workflow scope step references `docs/ARCHITECTURE.md` (uppercase).

**Note**: US2 is implemented before US1 because it fixes prerequisites (file casing, seed files) that US1 depends on. Setup phase (T001-T004) handles the file-level changes; this phase handles the workflow-level changes.

### Implementation for User Story 2

- [ ] T015 [US2] In `.github/workflows/documentation-update.yml` "Determine documentation scope" step: verify all `DOCS_TO_UPDATE` entries use uppercase file paths (`docs/ARCHITECTURE.md`, not `docs/architecture.md`)
- [ ] T016 [US2] In `.github/workflows/documentation-update.yml` "Commit and push" step: replace `git add docs/ CHANGELOG.md || true` with explicit file staging loop: `for f in $DOCS_TO_UPDATE; do [ -f "$f" ] && git add "$f"; done` (Issue 3 + Issue 12 — research.md)
- [ ] T017 [US2] In `.github/workflows/documentation-update.yml` "Commit and push" step: also add `[ -f README.md ] && git add README.md` separately (README is always a candidate for staging)

**Checkpoint**: Workflow only stages explicitly scoped files. No unmanaged `permission-*.md` files are ever staged.

---

## Phase 4: User Story 6 — Correct .md File Filtering (Priority: P2)

**Goal**: Changed files analysis distinguishes doc-only `.md` files from meaningful `.md` files like `AGENTS.md`.

**Independent Test**: Simulate a PR that modifies only `AGENTS.md`. Verify `has_code_changes=true` (not skipped).

### Implementation for User Story 6

- [ ] T018 [US6] In `.github/workflows/documentation-update.yml` "Analyze changed files" step: replace `grep -v -E '^(docs/|CHANGELOG\.md$|README\.md$|.*\.md$)'` with `grep -v -E '^(docs/|CHANGELOG\.md$)'` so that `AGENTS.md`, `.github/templates/*.md`, `README.md` etc. are NOT filtered out (Issue 8 — research.md)

**Checkpoint**: `AGENTS.md`-only PR triggers doc update. `docs/TESTING.md`-only PR is correctly skipped.

---

## Phase 5: User Story 3 — Agent Reads Full Source Code (Priority: P1)

**Goal**: The agent receives non-truncated context and is instructed to read source files directly.

**Independent Test**: Trigger workflow on a PR with >100 lines of diff. Check `kilo-prompt.md` artifact: diff section is not truncated to 100 lines. Check `bot-output.log`: agent makes `read` tool calls to source files.

### Implementation for User Story 3

- [ ] T019 [US3] In `.github/workflows/documentation-update.yml` "Generate code diff summary" step: replace all `head -100` with `head -500` for TypeScript, JSON, and YAML diff previews
- [ ] T020 [US3] In the same step: after each `head -500`, add overflow detection: if original diff exceeds 500 lines, append a note: `"... [truncated, $TOTAL_LINES lines total] Use read/grep tools to examine source files for full context."` (Issue 7 — research.md)

**Checkpoint**: Prompt artifact shows diff previews up to 500 lines with overflow notes when applicable.

---

## Phase 6: User Story 4 — Clean Prompt Assembly (Priority: P2)

**Goal**: No duplicate instructions, no conflicting prompts, accurate project structure in templates.

**Independent Test**: Assemble the prompt and `grep -c 'Mermaid'` — should return 1, not 3. Verify no contradictions between system prompt and message prompt.

**Note**: Template updates (Phase 2) already handle most of this. This phase addresses the inline system prompt in the workflow itself.

### Implementation for User Story 4

- [ ] T021 [US4] In `.github/workflows/documentation-update.yml` "Run documentation generation" step: replace the multi-line `system-prompt.txt` heredoc with a role-only system prompt: `"You are a technical documentation writer for the Alexi project. Read source code files using the provided tools before writing documentation. Write to the exact file paths specified in the Documentation Scope section."` (Issue 5 + Issue 6 — research.md)

**Checkpoint**: Assembled prompt + system prompt contain zero duplicate instructions. `grep -c 'Mermaid' kilo-prompt.md` returns 1.

---

## Phase 7: User Story 5 — Reliable Commit and Push (Priority: P2)

**Goal**: Commit step handles all three edge cases without error.

**Independent Test**: (a) Agent writes files but doesn't commit → staged + committed + pushed. (b) Auto-commit manager pre-committed → detected + pushed. (c) No changes → clean exit 0.

### Implementation for User Story 5

- [ ] T022 [US5] In `.github/workflows/documentation-update.yml` "Commit and push" step: rewrite to use three-case handling per `contracts/workflow-steps.md` Step 9 — explicit file staging, commit if staged changes exist, then compare LOCAL_HEAD vs REMOTE_HEAD and push if diverged
- [ ] T023 [US5] In the same step: update commit message from `"docs: auto-generate documentation [skip ci]"` to `"docs: auto-generate documentation [skip ci] [alexi-bot]"` (Issue 11 — research.md)
- [ ] T024 [US5] In `.github/workflows/documentation-update.yml` "Analyze changed files" step: update the `LAST_DOC_COMMIT` grep from `"docs: auto-generate documentation \\[skip ci\\]"` to grep for `"\\[alexi-bot\\]"` tag instead (Issue 11 — research.md)

**Checkpoint**: Commit step handles all three cases. `[alexi-bot]` tag is used for both writing and detecting doc commits.

---

## Phase 8: User Story 7 — Force Full Regeneration (Priority: P3)

**Goal**: Manual `workflow_dispatch` with `force_full_regeneration: true` regenerates ALL docs.

**Independent Test**: Trigger workflow manually with force flag. Verify all 9 doc files appear in scope.

### Implementation for User Story 7

- [ ] T025 [US7] In `.github/workflows/documentation-update.yml`: move the "Determine force regeneration" step (`id: force_flag`) BEFORE the "Check if documentation update needed" step (`id: check_needed`) so the force flag is available when `check_needed` evaluates it (Additional Research — research.md)

**Checkpoint**: Manual dispatch with `force_full_regeneration: true` correctly triggers full doc regeneration.

---

## Phase 9: User Story 1 — PR Author Gets Accurate Docs (Priority: P1)

**Goal**: End-to-end: workflow triggers on PR, agent generates accurate docs, commits and pushes, posts PR comment.

**Independent Test**: Open a test PR that modifies `src/core/orchestrator.ts`. Verify `docs/ARCHITECTURE.md` is updated, committed, pushed, and summary comment posted.

**Note**: This phase is last among the implementation phases because it's the integration test of all prior phases. All individual fixes (US2-US7) must be in place for this to work end-to-end.

### Implementation for User Story 1

- [ ] T026 [US1] In `.github/workflows/documentation-update.yml` "Run documentation generation" step: add `--effort high` flag to the agent invocation command (FR-006 — spec.md)
- [ ] T027 [US1] In the same step: add `--no-auto-commits` flag to the agent invocation command (FR-007 — spec.md)
- [ ] T028 [US1] Verify the workflow "Post success comment" step includes scope summary and file list in the PR comment (FR-015 — spec.md)
- [ ] T029 [US1] Verify the workflow "Upload artifacts" step includes `validation.log` in addition to existing artifacts (FR-016 — spec.md)

**Checkpoint**: Full end-to-end workflow runs successfully on a test PR. Docs are generated, committed, pushed, and PR comment posted.

---

## Phase 10: User Story 8 — Post-Generation Validation (Priority: P3)

**Goal**: Markdown lint validation runs after doc generation; warnings in PR comment but don't block commit.

**Independent Test**: Generate docs with a broken Mermaid diagram. PR comment includes warning.

### Implementation for User Story 8

- [ ] T030 [US8] Add a new "Validate generated docs" step in `.github/workflows/documentation-update.yml` after the "Run documentation generation" step and before the "Commit and push" step — run `npx --yes markdownlint-cli2 $DOCS_TO_UPDATE 2>&1 | tee validation.log || true` with `continue-on-error: true` (Issue 10 — research.md)
- [ ] T031 [US8] Set step output `report` from `validation.log` content for use in PR comment
- [ ] T032 [US8] Update the "Post success comment" step to include validation report (if non-empty) in the PR comment body
- [ ] T033 [US8] Add `validation.log` to the "Upload artifacts" step's path list

**Checkpoint**: Validation step runs, captures lint output, includes warnings in PR comment, does not block commit/push.

---

## Phase 11: Polish & Cross-Cutting Concerns

**Purpose**: Final integration verification and cleanup

- [ ] T034 Verify all 16 template files are consistent (no stale references to `src/router/`, `src/session/`, `src/providers/openai/`, etc.)
- [ ] T035 Verify `npm test` still passes (no regressions from doc/template changes — should be zero since no `src/` changes)
- [ ] T036 Run `quickstart.md` verification checklist: push branch, create test PR, verify all 12 checklist items pass
- [ ] T037 Run manual `workflow_dispatch` with `force_full_regeneration: true` on the test PR to verify force regeneration works end-to-end

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Can start in parallel with Phase 1 (templates are independent of doc files)
- **US2 (Phase 3)**: Depends on Setup (T001-T004) for file casing; depends on Foundational (T005-T014) for template accuracy
- **US6 (Phase 4)**: Depends on Phase 3 (same workflow file, different step)
- **US3 (Phase 5)**: Can start after Phase 2 (independent workflow step)
- **US4 (Phase 6)**: Depends on Phase 2 (templates must be updated first to verify no duplicates)
- **US5 (Phase 7)**: Depends on Phase 3 (US2 changes the commit step; US5 rewrites it further)
- **US7 (Phase 8)**: Independent (different workflow step) but logical to do after US5
- **US1 (Phase 9)**: Depends on ALL prior phases (integration test)
- **US8 (Phase 10)**: Depends on Phase 7 (adds a step between agent and commit)
- **Polish (Phase 11)**: Depends on all phases

### User Story Dependencies

- **US2 (P1)**: Foundation + Setup → can start first among user stories
- **US6 (P2)**: Foundation → independent of other user stories
- **US3 (P1)**: Foundation → independent of other user stories
- **US4 (P2)**: Foundation → independent of other user stories
- **US5 (P2)**: After US2 (same workflow section)
- **US7 (P3)**: After US5 (same workflow file, step ordering matters)
- **US1 (P1)**: After all fixes (integration test of everything)
- **US8 (P3)**: After US5 (adds step before commit)

### Within Each User Story

Since this feature modifies a single workflow file, most tasks within a story are sequential (same file). Parallelism is limited to the template updates in Phase 2.

### Parallel Opportunities

- **Phase 1**: T002, T003, T004 can run in parallel (different files)
- **Phase 2**: T006-T013 can ALL run in parallel (different template files)
- **Phase 3-9**: Mostly sequential (same workflow YAML file)
- **Phase 10**: T030-T033 are sequential (same file, building on each other)

---

## Parallel Example: Phase 2 (Templates)

```
# Launch all template updates together (different files):
Task: "Rewrite .github/templates/01-header.md"           # T005
Task: "Edit .github/templates/04-diff-header.md"         # T006
Task: "Edit .github/templates/06-requirements.md"        # T007
Task: "Edit .github/templates/08-footer.md"              # T008
Task: "Edit .github/templates/07-conditional/architecture-api.md"  # T009
Task: "Edit .github/templates/07-conditional/routing.md"           # T010
Task: "Edit .github/templates/07-conditional/providers.md"         # T011
Task: "Edit .github/templates/07-conditional/automation.md"        # T012
Task: "Edit .github/templates/07-conditional/changelog-contributing.md"  # T013
```

---

## Implementation Strategy

### MVP First (User Stories 1-3 + 5)

1. Complete Phase 1: Setup (file rename + seed files)
2. Complete Phase 2: Foundational (template updates)
3. Complete Phase 3: US2 (file casing in workflow)
4. Complete Phase 5: US3 (diff truncation fix)
5. Complete Phase 7: US5 (reliable commit/push)
6. Complete Phase 9: US1 (end-to-end integration)
7. **STOP and VALIDATE**: Run quickstart.md checklist on a test PR
8. Deploy (merge to `master`)

### Full Delivery

1. MVP (above)
2. Add Phase 4: US6 (`.md` filtering fix)
3. Add Phase 6: US4 (prompt deduplication)
4. Add Phase 8: US7 (force regeneration fix)
5. Add Phase 10: US8 (validation step)
6. Complete Phase 11: Polish

### Single-Developer Strategy (Recommended)

All changes are to `.github/` files and `docs/`. One developer works sequentially:
1. Phases 1+2 together (Setup + Templates) — commit as 2 commits
2. Phases 3-8 together (all workflow changes) — commit as 1 commit (single file: `documentation-update.yml`)
3. Phase 9 (verify end-to-end)
4. Phase 10 (validation) — commit as addition to workflow
5. Phase 11 (polish + verify)

**Suggested commit sequence**:
1. `docs: rename architecture.md to ARCHITECTURE.md for case consistency`
2. `docs: add seed files for ROUTING, PROVIDERS, CONFIGURATION`
3. `docs: update prompt templates to match actual project structure`
4. `fix(ci): redesign documentation workflow to fix 12 structural issues`
5. Push + test PR + verify

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- This feature modifies NO `src/` code — all changes are in `.github/` and `docs/`
- The primary bottleneck is that most workflow changes are in a single file (`documentation-update.yml`), limiting parallelism
- Verification requires a real GitHub Actions run; local testing is limited to template content review
- Prerequisite: PR #47 (`003-tui-polish`) must be merged first (contains RC-1/RC-2/RC-3 fixes to `src/`)
