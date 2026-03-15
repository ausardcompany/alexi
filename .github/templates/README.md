# Documentation Generation Templates

This directory contains modular templates used by the `documentation-update.yml` workflow to generate prompts for automatic documentation generation via the Alexi agent.

## Template Structure

```
templates/
├── 01-header.md              # Project context, structure (30 src/ dirs), CLI commands
├── 02-changed-files-header.md # Changed files section header
├── 03-commits-header.md      # Commit history section header
├── 04-diff-header.md         # Code diff section header (with tool usage note)
├── 05-scope-header.md        # Documentation scope header
├── 06-requirements.md        # General requirements (8 items, Mermaid source of truth)
├── 07-conditional/           # Conditional documentation sections
│   ├── architecture-api.md   # Architecture and API docs (includes tool/agent/bus systems)
│   ├── automation.md         # GitHub Actions workflows (sync + doc update)
│   ├── changelog-contributing.md # CHANGELOG (root) and CONTRIBUTING
│   ├── configuration.md      # Configuration documentation
│   ├── providers.md          # SAP AI Core Orchestration provider
│   ├── routing.md            # Routing system (src/core/router.ts)
│   └── testing.md            # Testing documentation
├── 08-footer.md              # Quality requirements (accuracy check) and output format
└── README.md                 # This file
```

## How Templates Are Used

1. The workflow analyzes changed files to determine which modules were modified
2. Templates are assembled in order (01 -> 08)
3. Conditional templates (07-conditional/) are included based on what changed:
   - CLI/Core changes -> architecture-api.md
   - Routing changes -> routing.md
   - Provider changes -> providers.md
   - Config changes -> configuration.md
   - Test changes -> testing.md
   - Workflow/Script changes -> automation.md
4. CHANGELOG and CONTRIBUTING templates are always included
5. The assembled prompt is passed to the Alexi agent for documentation generation

## Key Design Decisions

- **Mermaid diagrams**: Requirement lives in `06-requirements.md` only (single source of truth)
- **File paths**: All conditional templates use `docs/` prefix (e.g., `docs/ARCHITECTURE.md`)
- **Tool usage**: Templates instruct the agent to use `read`/`grep`/`glob` tools, not rely on diffs alone
- **SAP AI Core only**: Provider template references the sole provider, not multi-provider

## Modifying Templates

When modifying templates:

1. **Keep context consistent** — The header (01-header.md) provides project context that all other templates rely on
2. **Use professional language** — No emojis, clear technical writing
3. **Include examples** — Reference actual code from the repository
4. **Avoid duplication** — Check that requirements aren't duplicated across 06-requirements.md and 08-footer.md
5. **Test changes** — Run the documentation-update workflow manually to verify

## Workflow Integration

The templates are used by `.github/workflows/documentation-update.yml`:

- Triggers on PR open/sync to main/master branches
- Can be triggered manually with PR number
- Supports force full regeneration option
- Posts comments on PR with generation status
