# Implementation Plan: Full TUI Clone (Kilocode-style)

**Branch**: `001-tui-clone` | **Date**: 2026-03-15 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-tui-clone/spec.md`

## Summary

Replace Alexi's readline-based interactive REPL (~1960 lines of raw
`process.stdout.write` + ANSI codes in `src/cli/interactive.ts`) with a
component-based TUI using **Ink** (React for terminals). The TUI provides a
persistent layout with scrollable message area, streaming markdown rendering,
tool-call display with collapsible output and diff views, modal dialogs for
model/agent/permission selection, and a theme system. Ink + React are already
installed as dependencies but unused — this feature activates them and
decomposes the monolithic interactive.ts into focused React components.

## Technical Context

**Language/Version**: TypeScript 5.9 / Node.js >= 22.12.0 / ES Modules  
**Primary Dependencies**: Ink v6.8.0 (already installed), React v19.2.4
(already installed), ink-text-input, ink-spinner, ink-select-input,
ink-markdown (or marked + chalk — NEEDS CLARIFICATION), cli-highlight  
**Storage**: N/A (session data handled by existing SessionManager)  
**Testing**: Vitest with ink-testing-library for component tests  
**Target Platform**: macOS, Linux terminals (iTerm2, Terminal.app, kitty,
Alacritty, Windows Terminal)  
**Project Type**: CLI application (interactive TUI mode)  
**Performance Goals**: 60fps terminal rendering for smooth streaming; <100ms
input-to-screen latency  
**Constraints**: Must work in 80×24 minimum terminal size; <150MB RSS; no
Bun/Deno — Node.js only  
**Scale/Scope**: ~15 components, ~5 context providers, ~5 dialogs; replaces 1
file with ~20 files

## Constitution Check (Pre-Phase 0)

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Verify compliance with [Alexi Constitution](../../.specify/memory/constitution.md) before proceeding.

| # | Gate | Status |
|---|------|--------|
| 1 | **SAP AI Core-First** — All LLM calls route through SAP AI Core Orchestration; no direct provider API calls outside `src/providers/`. | [x] PASS — TUI is a presentation layer; no LLM call changes. `streamChat()` remains the sole entry point, routed through SAP AI Core. |
| 2 | **CLI-First** — Feature is reachable from the CLI; `--print`/`--file` non-interactive modes unaffected; stdout/stderr contract preserved. | [x] PASS — TUI replaces the interactive mode only. Non-interactive paths (`chat.ts`, `--print`, `--file`) are untouched. Ink renders to stdout; stderr contract preserved. |
| 3 | **Provider Abstraction** — Changes confined to `src/providers/` + `src/config/` for any provider-level work; no provider SDK imports outside `src/providers/`. | [x] PASS — No provider changes. TUI consumes the existing `streamChat()` async generator interface. |
| 4 | **Agentic Architecture** — Agent specialisation declared in `src/agent/prompts/`; tool results flow through event bus; MCP hot-pluggable. | [x] PASS — TUI subscribes to event bus for tool results and permission requests. No changes to agent/prompt/bus/MCP architecture. |
| 5 | **Test Discipline (BLOCKING)** — New public functions/classes have unit tests; bug fixes have regression tests; `npm test` green; no real network/filesystem calls in tests. | [x] PASS — All new components tested with ink-testing-library; existing tests unaffected. No network/filesystem calls in TUI tests. |
| 6 | **Simplicity / YAGNI** — No unjustified abstractions; complexity violations documented in Complexity Tracking table below. | [x] PASS — Ink/React already installed. Component decomposition is justified by the 1960-line monolith. See Complexity Tracking for the new abstraction layer justification. |
| 7 | **Security & Credential Hygiene (BLOCKING)** — No credentials committed; secrets via env vars only; no `console.log` in non-CLI modules. | [x] PASS — TUI components live in `src/cli/`; no credential handling. Theme/color data is non-sensitive. |

## Project Structure

### Documentation (this feature)

```text
specs/001-tui-clone/
├── plan.md              # This file
├── spec.md              # Feature specification
├── research.md          # Phase 0: framework comparison, Ink patterns
├── data-model.md        # Phase 1: state model, component props
├── quickstart.md        # Phase 1: minimal TUI bootstrap guide
├── contracts/           # Phase 1: component interfaces
│   ├── app-layout.ts    # Root layout contract
│   ├── message-area.ts  # Message rendering contract
│   ├── input-box.ts     # Input component contract
│   └── dialog.ts        # Modal dialog contract
└── tasks.md             # Phase 2: implementation tasks
```

### Source Code (repository root)

```text
src/cli/
├── program.ts                    # CLI entry (existing — unchanged)
├── interactive.ts                # DEPRECATED — replaced by tui/
├── tui/                          # NEW: TUI root
│   ├── App.tsx                   # Root Ink component, provider tree
│   ├── index.ts                  # TUI entry: render(<App />) via Ink
│   ├── components/               # Presentational components
│   │   ├── Header.tsx            # Model, agent badge, session, tokens
│   │   ├── MessageArea.tsx       # Scrollable conversation display
│   │   ├── MessageBubble.tsx     # Single message (user/assistant/system)
│   │   ├── MarkdownRenderer.tsx  # Streaming markdown → terminal
│   │   ├── ToolCallBlock.tsx     # Collapsible tool call + output
│   │   ├── DiffView.tsx          # File edit diff (red/green)
│   │   ├── InputBox.tsx          # Multi-line text input with prompt
│   │   ├── StatusBar.tsx         # Persistent bottom bar
│   │   ├── Spinner.tsx           # Loading spinner component
│   │   └── CommandPalette.tsx    # Ctrl+K fuzzy command search
│   ├── dialogs/                  # Modal overlay components
│   │   ├── ModelPicker.tsx       # Model selection dialog
│   │   ├── AgentSelector.tsx     # Agent selection dialog
│   │   ├── PermissionDialog.tsx  # Tool permission approval
│   │   ├── SessionList.tsx       # Session list + rename
│   │   └── McpManager.tsx        # MCP server management
│   ├── context/                  # React context providers
│   │   ├── ThemeContext.tsx       # Dark/light theme
│   │   ├── KeybindContext.tsx     # Keybinding management
│   │   ├── SessionContext.tsx     # Active session state
│   │   ├── ChatContext.tsx        # Streaming chat state
│   │   └── DialogContext.tsx      # Dialog stack management
│   ├── hooks/                    # Custom React hooks
│   │   ├── useStreamChat.ts      # Wraps streamChat() async generator
│   │   ├── useKeyboard.ts        # Keyboard event handling
│   │   ├── useToolEvents.ts      # Event bus tool execution subscription
│   │   └── usePermission.ts      # Permission prompt via event bus
│   └── theme/                    # Theme definitions
│       ├── dark.ts               # Dark theme colors
│       ├── light.ts              # Light theme colors
│       └── types.ts              # Theme type definitions
├── commands/                     # Existing command handlers (unchanged)
└── utils/                        # Existing utils
    ├── colors.ts                 # Migrated to theme system (deprecated)
    ├── agentColors.ts            # Migrated to theme system (deprecated)
    ├── keybindings.ts            # Logic extracted into hooks (deprecated)
    ├── modelPicker.ts            # Replaced by ModelPicker.tsx (deprecated)
    └── validation.ts             # Unchanged

tests/
├── cli/
│   └── tui/                      # NEW: TUI component tests
│       ├── App.test.tsx
│       ├── MessageArea.test.tsx
│       ├── ToolCallBlock.test.tsx
│       ├── DiffView.test.tsx
│       ├── InputBox.test.tsx
│       ├── PermissionDialog.test.tsx
│       └── useStreamChat.test.ts
```

**Structure Decision**: Single project, existing `src/cli/` directory gains a new
`tui/` subdirectory. The old `interactive.ts` is deprecated but kept for one
version cycle. All new TUI code is under `src/cli/tui/` following
component/context/hooks/theme organization.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|--------------------------------------|
| React component tree + 5 context providers (new abstraction layer) | The current `interactive.ts` is a 1960-line monolith mixing input handling, rendering, state management, and 40+ slash commands in one function. Component decomposition is the standard solution. | Refactoring within readline/ANSI was considered but cannot achieve persistent layout, modal dialogs, or streaming markdown. Raw ANSI escape code management doesn't scale beyond the current complexity. |
| Theme system (`src/cli/tui/theme/`) | Kilocode TUI reference has theme support; hard-coded ANSI codes in `colors.ts` make dark/light switching impossible. | Keeping hard-coded ANSI was considered but prevents any color customization and makes the code harder to maintain. Theme is a thin abstraction (3 files, <100 lines total). |

## Constitution Check (Post-Phase 1 Re-evaluation)

*All 7 gates re-evaluated after design phase. No new violations found.*

| # | Gate | Post-Design Status |
|---|------|-------------------|
| 1 | SAP AI Core-First | **PASS** — No LLM call changes in design. TUI consumes `streamChat()`. |
| 2 | CLI-First | **PASS** — `startTui()` replaces only the interactive path. Non-interactive untouched. |
| 3 | Provider Abstraction | **PASS** — Zero `src/providers/` imports in contracts or data model. |
| 4 | Agentic Architecture | **PASS** — `useToolEvents`/`usePermission` hooks subscribe to event bus. Agent/MCP unchanged. |
| 5 | Test Discipline (BLOCKING) | **PASS** — Test files specified for all components/hooks. `ink-testing-library` added. |
| 6 | Simplicity / YAGNI | **PASS** — Two justified complexities documented above. No NEEDS CLARIFICATION items remain. |
| 7 | Security & Credential Hygiene (BLOCKING) | **PASS** — TUI is purely `src/cli/`. No credentials in any contract or data model. |

**All NEEDS CLARIFICATION items resolved:**
- Markdown rendering → `marked` + `marked-terminal` (see research.md §2)
