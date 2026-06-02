# Prompt Improvement Task

## Target Prompts

Improve the agent prompt templates in `.github/prompts/`:

{{PROMPT_FILES}}

## Context

These prompts drive automated AI agents in GitHub Actions CI/CD.
Agents run via Kilo CLI (`kilo run "<prompt>" --auto`) on Claude Opus through SAP AI Core.

### Agent Ecosystem

| Agent | Role | Runs | Prompt Files |
|-------|------|------|-------------|
| Agent 1: Research | Scans competitor repos for ideas | Daily 04:00 | agent1-research-*.md |
| Agent 2: Planning | Creates issues from research | Daily 06:00 | agent2-planning-*.md |
| Agent 3: Implement | Builds features from issues | Every 30min | agent3-implement-*.md |
| Agent 4: Review | Code review & fix on PRs | On PR | agent4-review-*.md |
| Agent 5: Release | Changelog, version bump, tag | Weekly Mon | agent5-release-*.md |
| Autohealing | Fixes broken CI workflows | On failure | agent-autohealing-*.md |

### How prompts are structured

- **System prompts** (`*-system.md`): Persona/role definition. Stable, concise.
- **Task prompts** (`*-task.md`): Runtime templates with `{{VARIABLES}}`. Specific instructions.

## Instructions

1. **Read all prompt files** in `.github/prompts/`

2. **Analyze real-world performance** — check what's actually happening:
   - `gh run list --limit 30 --json name,conclusion` — failure rates
   - For agents with failures: `gh run view <id> --log-failed | tail -80` — look for signs of:
     - Agent doing wrong thing (prompt unclear)
     - Agent missing steps (instructions incomplete)
     - Agent going off-scope (constraints too weak)
     - Agent stuck/looping (no exit criteria)

3. **Apply best practices from your system prompt** — for each prompt, check:
   - Does it have clear exit criteria? (How does the agent know it's done?)
   - Does it have error recovery? (What to do when commands fail?)
   - Does it use concrete examples instead of vague descriptions?
   - Does it have proper grounding? (File paths, exact commands, expected outputs)
   - Are instructions ordered by priority? (Most important first)
   - Is there a verification step before finishing?

4. **Improve prompts** — edit files directly, focusing on:
   - Adding missing few-shot examples where agents struggle
   - Adding error recovery paths where agents get stuck
   - Strengthening scope constraints where agents drift
   - Adding exit criteria where agents don't know when to stop
   - Replacing vague verbs with specific tool/command instructions

5. **Save improvement report** to `.github/research/{{DATE}}-prompt-improvements.md`

## Improvement Priorities

1. **Critical**: Prompts where agents consistently fail or produce wrong output
2. **High**: Missing error recovery or exit criteria (agent gets stuck)
3. **Medium**: Vague instructions that could be made more specific
4. **Low**: Structural improvements (ordering, formatting, examples)

## Constraints

- Do NOT change `{{VARIABLE}}` template names — workflows depend on them
- Do NOT change the fundamental goal of any prompt
- Do NOT remove "Do NOT" sections or safety constraints
- Do NOT add instructions for tools the agent doesn't have
- Keep system prompts under 60 lines
- Keep task prompts under 90 lines
- Every change must have a clear rationale tied to a best practice

## Verification

Before finishing, validate each modified prompt:
- All `{{VARIABLE}}` placeholders still present
- Instructions are still logically ordered
- No contradictions between system and task prompts for same agent
- The prompt still clearly tells the agent: what to do, how to verify, when to stop
