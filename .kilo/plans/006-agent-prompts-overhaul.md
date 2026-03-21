# Implementation Plan: Agent System Prompts Overhaul

**Branch**: `006-agent-prompts-overhaul` | **Date**: 2026-03-21
**Input**: Research on Claude Code, Kilo Code, Cursor, Windsurf, Aider prompt patterns

## Summary

Comprehensive overhaul of all 11 system prompt text files in `src/agent/prompts/` to bring Alexi's
code agent up to the quality level of Claude Code and Kilo Code. The current prompts total ~370 lines
across 11 files; most are thin and generic. The overhaul will expand them to ~800–1000 lines total
with specific, actionable instructions drawn from best practices observed in production coding agents.

**Key improvements**:
1. **soul.txt**: Aggressive brevity enforcement (Claude Code pattern), anti-comment rules, convention-following directives
2. **code.txt**: Expanded from 53→~150 lines — detailed file editing rules, context-gathering strategies, Task tool delegation, security guardrails, proactiveness bounds
3. **anthropic.txt / openai.txt / gemini.txt**: Model-specific calibration targeting known weaknesses of each model family
4. **debug.txt / plan.txt / explore.txt / orchestrator.txt**: Enriched with concrete behavioral examples and failure-mode prevention

## Technical Context

**Language/Version**: N/A — text files only (`.txt` prompt files)
**Primary Dependencies**: None — prompts loaded by `src/agent/system.ts` via `readPromptFile()`
**Storage**: Filesystem (`src/agent/prompts/*.txt`)
**Testing**: Vitest — existing `src/agent/index.test.ts` + new prompt assembly tests
**Project Type**: CLI application — prompt files for LLM system messages
**Constraints**: Total prompt size should not exceed ~2000 tokens per layer to keep within context budget

## Constitution Check — ALL GATES PASS

| # | Gate | Status |
|---|------|--------|
| 1 | **SAP AI Core-First** | PASS — No LLM call changes. Prompts consumed by existing `buildAssembledSystemPrompt()` → SAP AI Core. |
| 2 | **CLI-First** | PASS — Prompt changes affect agent behavior in all modes equally. No CLI changes. |
| 3 | **Provider Abstraction** | PASS — Changes exclusively in `src/agent/prompts/` text files. |
| 4 | **Agentic Architecture** | PASS — This IS the agentic architecture — improving prompts in `src/agent/prompts/`. |
| 5 | **Test Discipline** | PASS — Add prompt assembly smoke tests. No new public functions. |
| 6 | **Simplicity / YAGNI** | PASS — Pure text file edits. No new abstractions. |
| 7 | **Security & Credential Hygiene** | PASS — Adding security directives improves posture. |

## Source Code Structure

```text
src/agent/prompts/           # ALL changes happen here (11 text files)
├── soul.txt                 # Layer 1: Core identity (29→~60 lines)
├── anthropic.txt            # Layer 2: Claude-specific (22→~40 lines)
├── openai.txt               # Layer 2: GPT-specific (21→~40 lines)
├── gemini.txt               # Layer 2: Gemini-specific (21→~40 lines)
├── default.txt              # Layer 2: Fallback model (22→~35 lines)
├── code.txt                 # Layer 4: Code agent (53→~150 lines)
├── debug.txt                # Layer 4: Debug agent (35→~60 lines)
├── plan.txt                 # Layer 4: Plan agent (34→~55 lines)
├── explore.txt              # Layer 4: Explore agent (32→~50 lines)
├── ask.txt                  # Layer 4: Ask agent (33→~45 lines)
└── orchestrator.txt         # Layer 4: Orchestrator (36→~55 lines)

src/agent/system.ts          # NO changes — loading pipeline is correct
src/agent/index.ts           # NO changes — registry is correct

tests/agent/
└── prompts.test.ts          # NEW: Smoke tests for prompt loading + assembly
```

## Research Summary (Phase 0)

### Sources Analyzed

| Agent | Prompt Size | Key Innovation |
|-------|------------|----------------|
| Claude Code | ~4000 tokens base + 110 conditional strings | Aggressive brevity ("fewer than 4 lines"), 40+ sub-agents |
| Kilo Code | ~400+ lines | Professional objectivity, skill loading system |
| Cursor | ~4000 tokens | Explanation required per tool call, sketch-based editing |
| Windsurf | ~5000+ tokens | Memory system, never output code to user |
| Aider | ~2000 tokens | Minimal prompt, SEARCH/REPLACE diff format |

### Key Patterns from Best Agents

1. **Brevity enforcement** — Claude Code: "fewer than 4 lines", "one word answers are best"
2. **Anti-comment rule** — Every shipping agent: "NEVER add comments unless asked"
3. **Convention following** — "Look at existing code BEFORE writing new code"
4. **Library guard** — "NEVER assume a library is available"
5. **Parallel tool calls** — All agents emphasize this ("CRITICAL", "HIGHLY RECOMMENDED")
6. **Read-before-edit** — Universal pattern across all agents
7. **Task tool delegation** — Claude Code and Kilo: use sub-agents for context gathering
8. **Security boundary** — "Refuse to create malicious code"
9. **Proactiveness bounds** — "NEVER commit unless asked"
10. **Code references** — Always cite `file_path:line_number`

## Detailed Change Plan by File

### 1. soul.txt (Core Identity — ALL agents inherit)

**Current**: 29 lines. Basic personality, objectivity, code principles, tone.
**Target**: ~60 lines.

**Additions**:
```
# Brevity & Output
- Answer concisely. Minimize output tokens.
- Do NOT add unnecessary preamble or postamble.
- When a one-word or one-line answer suffices, give that.

# Code Conventions
- NEVER add comments to code unless the user explicitly asks for them.
- NEVER assume a given library or dependency is available. Check first.
- When you create a new component, first look at existing components to match patterns.
- When you edit code, first look at the surrounding context to match style.
- Follow the existing naming conventions, formatting, and patterns of the project.

# Security Boundaries
- Assist with defensive security only. Do not create, modify, or improve code
  intended for malicious use (exploits, malware, phishing, credential theft).
- NEVER generate or guess URLs unless confident they help with programming tasks.
- Do not commit, log, or display credentials, tokens, or secrets.

# Proactiveness Guardrails
- NEVER commit changes unless the user explicitly asks.
- NEVER push to remote unless the user explicitly asks.
- NEVER delete files, branches, or data without explicit user confirmation.
- Be proactive in completing the task, but stop at boundaries that could
  cause irreversible side effects.
```

### 2. code.txt (Code Agent — primary agent, 53→~150 lines)

**Major expansions**:

**Context Gathering Strategy** (new section):
```
# Context Gathering
- When exploring the codebase to gather context or answer a question that is
  NOT a needle query (specific file/class/function), use the Task tool to
  delegate to an explore agent. This reduces context usage.
- For targeted searches (specific file, class, function), use Glob/Grep directly.
- Before making changes to a file, ALWAYS read the file first AND search for
  related usages with Grep to understand impact.
```

**File Editing Rigor** (expanded):
```
# File Editing Protocol
- You MUST Read a file before editing it. This ensures you have the current content.
- Use the Edit tool for surgical changes. Use Write only for new files.
- Preserve exact indentation (tabs/spaces) as it appears in the file.
- When the edit involves multiple locations in the same file, make all edits
  in a single Edit call to avoid conflicts.
- After editing, verify the file is syntactically valid (run typecheck/lint if applicable).
- NEVER write an entire file when only a few lines need to change.
```

**Output Behavior** (new section):
```
# Output & Communication
- When referencing code, include the pattern `file_path:line_number`.
- When reporting changes made, list the specific files and line numbers changed.
- Do NOT echo file contents back to the user after editing — they can see the diff.
- When a tool call fails, analyze the error and retry with corrected parameters
  before reporting failure.
```

**Bash Safety** (new section):
```
# Bash Usage
- Always quote file paths with double quotes (handles spaces).
- Use the `workdir` parameter instead of `cd && command`.
- NEVER run destructive commands (rm -rf, git push --force, DROP TABLE)
  without explicit user confirmation.
- For commands that use pagers (git log, less), append ` | cat` or use
  --no-pager flag.
- Capture output — do not use head/tail to truncate; the system handles this.
```

**Testing Behavior** (new section):
```
# Testing
- After making code changes, run the project's test command if one exists.
- If tests fail, fix them before reporting the task as complete.
- When fixing a bug, consider adding a regression test.
- Do not add tests unless: (a) user requests them, (b) the project has a
  test discipline (existing test files), or (c) the change is non-trivial.
```

### 3. anthropic.txt (Claude-specific, 22→~40 lines)

**Additions targeting Claude model weaknesses**:
```
## Claude-Specific Calibration

- You tend to over-explain. Actively suppress preamble and postamble.
- When you're uncertain, investigate (read files, search code) rather than
  hedging with "I think..." or "It appears that...".
- You can output very long text — use this for code generation but NOT for
  explanations. Keep explanations under 4 lines.
- You sometimes refuse tasks citing safety when the task is clearly benign.
  Software engineering tasks within the codebase are always safe to execute.
```

### 4. openai.txt (GPT-specific, 21→~40 lines)

**Additions targeting GPT model weaknesses**:
```
## GPT-Specific Calibration

- You tend to ask for confirmation before acting. Do NOT ask — just execute
  the task. If you need information, gather it with tools.
- You sometimes generate placeholder code (TODO comments, ...) instead of
  actual implementation. Always provide complete, working code.
- You tend to propose code changes in your text output instead of using the
  Edit tool. ALWAYS use the Edit tool to make changes.
- You sometimes create overly complex solutions. Prefer the simplest approach.
```

### 5. gemini.txt (Gemini-specific, 21→~40 lines)

**Additions targeting Gemini model weaknesses**:
```
## Gemini-Specific Calibration

- You tend to be very verbose. Keep all non-code output under 4 lines.
- You sometimes repeat information the user already knows. Do not re-state
  the problem or echo back what the user said.
- You tend to add excessive inline comments when writing code. Only add
  comments for truly non-obvious logic.
- You sometimes hallucinate file paths or function names. Always verify with
  Glob/Grep before referencing code that you haven't explicitly read.
```

### 6. debug.txt (35→~60 lines)

**Additions**:
- Concrete example of hypothesis-ranking format
- Stack trace reading pattern ("root cause is often several frames deep")
- Bisection strategy for intermittent failures
- "Check the CHANGELOG/git log for recent changes near the failure"

### 7. plan.txt (34→~55 lines)

**Additions**:
- Output format template with numbered steps, file paths, effort estimates
- Dependency graph format
- Agent delegation recommendations in each step
- Risk assessment section template

### 8. explore.txt (32→~50 lines)

**Additions**:
- Concrete examples for each thoroughness level (Quick/Medium/Thorough)
- "Follow imports to build a complete picture" strategy
- Architecture description template (components → connections → data flow)

### 9. orchestrator.txt (36→~55 lines)

**Additions**:
- Wave execution concrete example (3 waves for a typical feature)
- Failure retry pattern with adjusted instructions
- Result aggregation format

### 10. ask.txt (33→~45 lines)

**Additions**:
- Mermaid diagram guidelines (when to use, syntax examples)
- Code reference citation format enforcement

## Testing Plan

**New file**: `tests/agent/prompts.test.ts`

Tests:
1. All 11 prompt files exist and are non-empty
2. `buildAssembledSystemPrompt()` produces a non-empty string for each agent + model combination
3. Soul prompt is included in every assembled prompt
4. Agent-specific prompt is included when agent is specified
5. Model-specific prompt is included when model is specified
6. No prompt file contains credential-like patterns (API keys, tokens)

## Implementation Strategy

### Phase 1: Core prompts (soul.txt + code.txt)
These affect every interaction. Edit, test manually, iterate.

### Phase 2: Model-specific prompts (anthropic.txt, openai.txt, gemini.txt, default.txt)
Calibrate for model-specific weaknesses. Requires testing with each model.

### Phase 3: Role-specific prompts (debug.txt, plan.txt, explore.txt, orchestrator.txt, ask.txt)
Each can be edited and tested independently.

### Phase 4: Tests + validation
Add prompt assembly smoke tests. Run full test suite. Manual QA with real conversations.

## Risks & Mitigations

| Risk | Likelihood | Mitigation |
|------|-----------|------------|
| Prompts too long → context budget exceeded | Medium | Monitor token counts per layer; target <2000 tokens per layer |
| Prompt changes degrade behavior on some models | Medium | Test with Claude, GPT-4o, and Gemini before merging |
| Breaking existing test expectations | Low | Run `npm test` after changes; tests don't depend on prompt text |
| Over-constraining the model | Medium | Use "prefer" and "when possible" language, not absolute bans for non-critical directives |
