# Prompt Optimization Task

## Target Prompts

Optimize the agent prompt templates in `.github/prompts/`:

{​{PROMPT_FILES}}

## Context

These prompts are used by automated AI agents running in GitHub Actions CI/CD pipelines.
The agents use Kilo CLI (`kilo run "<prompt>" --auto`) with SAP AI Core (Claude Opus model).

### Agent Ecosystem

| Agent | Role | Prompt Files |
|-------|------|-------------|
| Agent 1: Research | Analyzes competitor repos for new features | agent1-research-system.md, agent1-research-task.md |
| Agent 2: Planning | Creates dev plan and GitHub issues | agent2-planning-system.md, agent2-planning-task.md |
| Agent 3: Implement | Builds features from issues | agent3-implement-system.md, agent3-implement-task.md |
| Agent 4: Review | Code review & QA on PRs | agent4-review-system.md, agent4-review-task.md |
| Agent 5: Release | Version bump, changelog, release | agent5-release-system.md, agent5-release-task.md |
| Autohealing | Fixes failed CI workflows | agent-autohealing-system.md, agent-autohealing-task.md |

### How prompts are used

- **System prompts** (`*-system.md`): Loaded as persona/role context. Should be concise and stable.
- **Task prompts** (`*-task.md`): Templates with `{​{VARIABLES}}` filled at runtime. Contain the specific task instructions.

## Instructions

1. **Read all prompt files** in `.github/prompts/`
2. **Analyze each prompt** using the scoring dimensions from your system prompt
3. **Check recent workflow runs** for patterns:
   - `gh run list --limit 20 --json name,conclusion` — which agents fail most?
   - Look at failure logs for signs of prompt misunderstanding (scope creep, wrong output, missing steps)
4. **Identify improvement opportunities** — focus on:
   - Prompts with lowest scores
   - Agents that fail most often
   - Common patterns: vague instructions, missing error handling, scope drift
5. **Apply improvements** — edit the prompt files directly using the edit tool
6. **Save optimization report** to `.github/research/{​{DATE}}-prompt-optimization.md`

## Optimization Priorities

1. **High**: Prompts causing agent failures or scope drift
2. **Medium**: Prompts that could be more token-efficient without losing info
3. **Low**: Style/formatting improvements

## Constraints

- Do NOT change template variable names (`{​{VARIABLE}}`) — workflows depend on them
- Do NOT change the fundamental task of any prompt
- Do NOT remove safety constraints or "Do NOT" sections
- Keep system prompts under 50 lines
- Keep task prompts under 80 lines
- Preserve markdown formatting (headers, lists, code blocks)
- All changes must be backward-compatible with existing workflow YAML

## Verification

After making changes, validate:
- All `{​{VARIABLE}}` placeholders are preserved
- No markdown syntax errors
- File sizes are reasonable (not bloated)
- The prompt still clearly communicates its original intent
