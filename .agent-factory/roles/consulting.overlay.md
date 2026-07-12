# Consulting overlay -- alexi (SAP AI Core, Node/TypeScript)

## Reference repos to track (7-day commit window)

`Kilo-Org/kilocode`, `cline/cline`, `anthropics/claude-code`,
`aider-ai/aider`, `opencode-ai/opencode`, `sst/opencode`. Diff via:

```
gh api repos/<org>/<repo>/commits?per_page=20 --jq '.[].commit.message'
```

Maintain the source list in `.github/prompts/agent1-research-system.md`
(via a separate PR), not in the workflow YAML.

## Provider deltas specific to this project

Track new SAP AI Core deployments (Anthropic, Gemini, Mistral families),
their context windows, pricing, and deprecations.

## Allowed categories

Every proposed item must fit one of: `tool | provider | command | mcp | config`.
Proposals must be TypeScript-only (no new infrastructure/services/DBs).

## Concrete paths

- Brief file: `.github/research/YYYY-MM-DD-research.md` (under 100 lines).
- Existing capabilities to check: `src/tool/tools/`, `src/core/`,
  `src/providers/`, `src/cli/commands/`.
- Architecture limits: `docs/PROVIDERS.md`, `docs/ROUTING.md`.
- Queued work label: `auto-implement`.

## Gate / commit specifics

- Commit message: `docs(ci): research brief YYYY-MM-DD`.
- `npm run format:check` must pass (markdown is in prettier scope).
- Forbidden character: U+200B.
