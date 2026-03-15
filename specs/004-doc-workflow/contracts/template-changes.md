# Contract: Template Changes Summary

This document lists the exact changes needed for each template file.

---

## `01-header.md` — FULL REWRITE

See `contracts/01-header-template.md` for the complete new content.

**Summary of changes**:
- Project description: multi-provider → SAP AI Core exclusive
- Technology stack: added Ink/React, Vitest; removed fake providers
- Project structure: 6 directories → 30 directories (matching actual `src/`)
- CLI commands: 6 → 16 (added `agent`, `interactive`, `context*`, `stages`, `dod-*`, etc.)
- Added "Read Source Code Before Writing" instruction

---

## `02-changed-files-header.md` — NO CHANGE

Current content is fine:
```markdown
## Changed Files

The following files have been modified in this PR:
```

---

## `03-commits-header.md` — NO CHANGE

Current content is fine.

---

## `04-diff-header.md` — MINOR EDIT

**Add instruction to use tools for full context**:

```markdown
## Code Diff

Summary of code changes:

> **Note**: This is a preview. If the diff is truncated, use the `read` and `grep` tools to examine actual source files for complete context.
```

---

## `05-scope-header.md` — NO CHANGE

Current content is fine.

---

## `06-requirements.md` — DEDUPLICATE

**Remove**: Nothing to remove (the Mermaid requirement stays here as the single source of truth).

**Updated content** (clarify which file gets diagrams):

```markdown
## Requirements

### General Requirements
1. Use English for all documentation
2. Follow Keep a Changelog format for CHANGELOG.md (in repository root, NOT docs/)
3. Include minimum 3 Mermaid diagrams in docs/ARCHITECTURE.md (flowcharts, sequence, class, etc.)
4. Use professional technical language — NO emojis
5. Include actual code examples from the repository (use `read` tool to get current code)
6. Reference TypeScript types and interfaces where relevant
7. Read existing documentation files before updating (use `read` tool)
8. Write files to the EXACT paths listed in the Documentation Scope section

### Specific Documentation Updates Needed
```

**Changes**: Added items 7-8 (read before write, exact paths). Clarified CHANGELOG path.

---

## `07-conditional/architecture-api.md` — MINOR UPDATE

**Change**: Use correct file casing and expand scope.

```markdown
#### docs/ARCHITECTURE.md
- Document the overall system architecture
- Include provider resolution flow diagram (Mermaid)
- Include routing decision flow diagram (Mermaid)
- Include session management / agentic chat diagram (Mermaid)
- Document the CLI command structure and entry points
- Document the tool system (`src/tool/`)
- Document the agent system (`src/agent/`)
- Explain the event bus for tool execution observability (`src/bus/`)

#### docs/API.md
- Document all CLI commands with usage examples
- Document configuration options and environment variables
- Include TypeScript type definitions for key interfaces
- Document the agent mode (`alexi agent`) with all flags
```

---

## `07-conditional/routing.md` — MINOR UPDATE

**Change**: Fix directory reference.

```markdown
#### docs/ROUTING.md
- Document the auto-routing system in `src/core/router.ts`
- Explain prompt classification (task type, complexity, reasoning needs)
- Document routing rules configuration format (`src/config/routingConfig.ts`)
- Include scoring algorithm explanation
- Provide examples of routing decisions
- Include routing flow diagram (Mermaid)
```

---

## `07-conditional/providers.md` — MINOR UPDATE

**Change**: Update to SAP AI Core only (remove multi-provider references).

```markdown
#### docs/PROVIDERS.md
- Document the SAP AI Core Orchestration provider (`src/providers/sapOrchestration.ts`)
- Explain the provider abstraction and interface
- Document supported models and deployments
- Include configuration via environment variables (`AICORE_SERVICE_KEY`, `AICORE_RESOURCE_GROUP`)
- Include provider call flow diagram (Mermaid)
```

---

## `07-conditional/configuration.md` — NO CHANGE

Current content is adequate.

---

## `07-conditional/testing.md` — NO CHANGE

Current content is adequate.

---

## `07-conditional/automation.md` — MINOR UPDATE

**Change**: Add reference to documentation workflow itself.

```markdown
#### docs/AUTOMATION.md
- Document all GitHub Actions workflows
- Explain the autonomous sync workflow (sync-upstream.yml):
  - Schedule, manual triggers, fork syncing, analysis, auto-merge
- Explain the documentation update workflow (documentation-update.yml):
  - Triggers, scope analysis, template assembly, agent invocation, validation
- Include workflow diagrams (Mermaid)
- Document required GitHub secrets
```

---

## `07-conditional/changelog-contributing.md` — MINOR EDIT

**Change**: Clarify CHANGELOG path.

```markdown
#### CHANGELOG.md (repository ROOT — not docs/)
- Use Keep a Changelog format
- Include ONLY sections with actual changes:
  - Added: new features
  - Changed: updates to existing features
  - Fixed: bug fixes
  - Removed: removed features
- Be concise but clear about what changed
- NO emojis — use professional technical language only

#### docs/CONTRIBUTING.md
- Update development workflow (branching, commits, PRs)
- Update coding standards (TypeScript strict, ESLint, Prettier)
- Update testing guidelines (Vitest, mocking, temp dirs)
- Reference the autonomous sync system
```

---

## `08-footer.md` — REMOVE DUPLICATE

**Remove**: The Mermaid diagrams line (already in `06-requirements.md`).

**Updated content**:

```markdown
### Quality Requirements
1. **Code Examples**: Use actual code from the repository (read files with tools, don't guess)
2. **Consistency**: Follow existing documentation style and formatting
3. **Completeness**: Don't leave TODO or placeholder sections
4. **Professional Style**: NO emojis in any documentation — use clear technical language
5. **Accuracy**: Verify all referenced file paths, function names, and types against actual source code

## Output Format

Update the files directly in the repository using the `write` or `edit` tools. Do NOT just describe what should be changed — make the actual changes to the files.

After updating documentation, provide a summary of:
1. Files updated (with paths)
2. Key changes made
3. Any files that could not be updated (with reason)
```

**Changes**: Removed Mermaid line. Added accuracy requirement. Clarified tool usage in output format.

---

## `README.md` — UPDATE

Update to reflect the changes made (new template content, workflow changes). Minor edit.
