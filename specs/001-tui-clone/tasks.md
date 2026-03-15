# Tasks: Full TUI Clone (Kilocode-style)

**Input**: Design documents from `/specs/001-tui-clone/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅, quickstart.md ✅

**Tests**: Included per spec.md Success Criterion #6 ("npm test passes; no regressions").

**User Stories** (from spec.md R1–R10):

| ID | Requirement | Priority | Story |
|----|------------|----------|-------|
| US1 | Component-Based TUI Framework (R1) | P1 | Foundational |
| US2 | Persistent Layout (R2) | P1 | MVP |
| US3 | Streaming Markdown Rendering (R3) | P1 | MVP |
| US4 | Tool Call Display (R4) | P2 | Full |
| US5 | Modal Dialogs (R5) | P2 | Full |
| US6 | Permission Dialog (R6) | P2 | Full |
| US7 | Keybinding System (R7) | P2 | Full |
| US8 | Theme Support (R8) | P3 | Polish |
| US9 | Backward Compatibility (R9) | P1 | MVP |
| US10 | Spinner & Progress (R10) | P3 | Polish |

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Install dependencies, create directory structure, configure TSX compilation.

- [x] T001 [P] Install runtime dependencies: `npm install marked marked-terminal cli-highlight ink-text-input ink-select-input ink-spinner diff terminal-link`
- [x] T002 [P] Install dev dependencies: `npm install -D ink-testing-library @types/diff`
- [x] T003 Create TUI directory structure: `mkdir -p src/cli/tui/{components,dialogs,context,hooks,theme}` and `mkdir -p tests/cli/tui`
- [x] T004 [P] Verify TSX compilation works with existing `tsconfig.json` (jsx: "react-jsx" must be set); update if needed
- [x] T005 [P] Add type declarations for `marked-terminal` if not available (create `src/cli/tui/types/marked-terminal.d.ts`)

**Checkpoint**: Dependencies installed, directories exist, TSX compiles.

---

## Phase 2: Foundational (Blocking Prerequisites) — US1

**Purpose**: Core infrastructure (theme types, context providers, TUI entry point) that MUST be complete before ANY user story can be implemented.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

### Theme Types & Definitions (no dependencies between files)

- [x] T006 [P] [US1] Create theme type definitions in `src/cli/tui/theme/types.ts` — ThemeColors, ThemeState interfaces per data-model.md
- [x] T007 [P] [US1] Create dark theme preset in `src/cli/tui/theme/dark.ts` — implement ThemeColors for dark terminals
- [x] T008 [P] [US1] Create light theme preset in `src/cli/tui/theme/light.ts` — implement ThemeColors for light terminals

### Context Providers (each is an independent file; depend on theme types)

- [x] T009 [P] [US1] Create ThemeContext in `src/cli/tui/context/ThemeContext.tsx` — provider + useTheme hook; wraps ThemeState per data-model.md
- [x] T010 [P] [US1] Create SessionContext in `src/cli/tui/context/SessionContext.tsx` — provider + useSession hook; wraps SessionState, bridges to existing SessionManager
- [x] T011 [P] [US1] Create ChatContext in `src/cli/tui/context/ChatContext.tsx` — provider + useChat hook; wraps ChatState per data-model.md
- [x] T012 [P] [US1] Create KeybindContext in `src/cli/tui/context/KeybindContext.tsx` — provider + useKeybind hook; wraps KeybindState per data-model.md
- [x] T013 [P] [US1] Create DialogContext in `src/cli/tui/context/DialogContext.tsx` — provider + useDialog hook; wraps DialogState, dialog stack per contracts/dialog.ts

### TUI Entry Point & App Shell (depends on all context providers)

- [x] T014 [US1] Create TUI entry point in `src/cli/tui/index.ts` — `startTui()` function that calls `render(<App />)` per quickstart.md
- [x] T015 [US1] Create root App component in `src/cli/tui/App.tsx` — provider tree (Theme→Session→Chat→Keybind→Dialog→AppLayout) per contracts/app-layout.ts

### Tests

- [x] T016 [P] [US1] Test ThemeContext in `tests/cli/tui/ThemeContext.test.tsx` — dark/light switching, useTheme returns correct colors
- [x] T017 [P] [US1] Test DialogContext in `tests/cli/tui/DialogContext.test.tsx` — open/close/cancel, stack management
- [x] T018 [P] [US1] Test App shell renders in `tests/cli/tui/App.test.tsx` — renders without crash, contains all layout regions

**Checkpoint**: Foundation ready — all context providers exist, App.tsx renders, startTui() callable. User story implementation can now begin in parallel.

---

## Phase 3: User Story 2 — Persistent Layout (Priority: P1) 🎯 MVP

**Goal**: Header, MessageArea (static messages only, no markdown), InputBox (single-line), StatusBar form the persistent full-screen layout.

**Independent Test**: `npm run dev -- interactive` shows header with model name, message area, input prompt, status bar.

### Implementation

- [x] T019 [P] [US2] Create Header component in `src/cli/tui/components/Header.tsx` — per contracts/app-layout.ts HeaderProps: model, agent badge, session ID, token count
- [x] T020 [P] [US2] Create StatusBar component in `src/cli/tui/components/StatusBar.tsx` — per contracts/app-layout.ts StatusBarProps: keybinding hints, cost, streaming indicator
- [x] T021 [P] [US2] Create InputBox component in `src/cli/tui/components/InputBox.tsx` — per contracts/input-box.ts: agent-colored prompt, ink-text-input, onSubmit, input history
- [x] T022 [P] [US2] Create MessageBubble component in `src/cli/tui/components/MessageBubble.tsx` — per contracts/message-area.ts: user/assistant/system styling, plain text for now
- [x] T023 [US2] Create MessageArea component in `src/cli/tui/components/MessageArea.tsx` — per contracts/message-area.ts: scrollable container, scrollOffset state, auto-scroll, uses MessageBubble
- [x] T024 [US2] Wire layout regions into App.tsx — Header + MessageArea + InputBox + StatusBar with flexbox layout per contracts/app-layout.ts diagram

### Tests

- [x] T025 [P] [US2] Test Header renders model and agent in `tests/cli/tui/Header.test.tsx`
- [x] T026 [P] [US2] Test InputBox submits text and clears in `tests/cli/tui/InputBox.test.tsx`
- [x] T027 [P] [US2] Test MessageArea renders messages and scrolls in `tests/cli/tui/MessageArea.test.tsx`

**Checkpoint**: Full-screen persistent layout renders. User can type and see messages. No streaming/markdown yet.

---

## Phase 4: User Story 3 — Streaming Markdown Rendering (Priority: P1) 🎯 MVP

**Goal**: LLM output renders as formatted markdown with syntax-highlighted code blocks, streaming incrementally.

**Independent Test**: Send a prompt, see markdown-formatted response stream in real time.

### Implementation

- [x] T028 [P] [US3] Create MarkdownRenderer component in `src/cli/tui/components/MarkdownRenderer.tsx` — uses `marked` + `marked-terminal` + `cli-highlight`; handles partial fences per research.md §2
- [x] T029 [P] [US3] Create useStreamChat hook in `src/cli/tui/hooks/useStreamChat.ts` — wraps `streamChat()` async generator, updates ChatContext state (streamingText, isStreaming, abortController)
- [x] T030 [US3] Integrate MarkdownRenderer into MessageBubble — assistant messages render through MarkdownRenderer; user messages stay plain text
- [x] T031 [US3] Wire useStreamChat into App/ChatContext — InputBox submit triggers stream, MessageArea shows streaming text, Ctrl+C aborts

### Tests

- [x] T032 [P] [US3] Test MarkdownRenderer renders code blocks with highlighting in `tests/cli/tui/MarkdownRenderer.test.tsx`
- [x] T033 [P] [US3] Test useStreamChat hook state transitions in `tests/cli/tui/useStreamChat.test.ts` — idle→streaming→complete, abort

**Checkpoint**: Streaming markdown works. This + Phase 3 = MVP.

---

## Phase 5: User Story 9 — Backward Compatibility (Priority: P1) 🎯 MVP

**Goal**: Non-interactive modes (`--print`, `--file`, JSON output) unaffected. TUI is default interactive mode.

**Independent Test**: `alexi --print "hello"` and `alexi --file input.txt` work as before.

### Implementation

- [x] T034 [US9] Modify `src/cli/commands/interactive.ts` to call `startTui()` instead of old `startInteractive()` — preserve all option passing
- [x] T035 [US9] Verify non-interactive paths in `src/cli/commands/chat.ts` are untouched — `--print`/`--file` modes bypass TUI entirely
- [x] T036 [US9] Extract command registry from `handleCommand()` switch in `src/cli/interactive.ts` into `src/cli/tui/hooks/useCommands.ts` — reusable map of slash commands for both old and new paths

### Tests

- [x] T037 [P] [US9] Test that `startTui` is called for interactive mode in `tests/cli/tui/integration.test.ts`
- [x] T038 [P] [US9] Test that non-interactive modes do not import TUI in `tests/cli/commands/chat.test.ts` (or verify existing tests pass)

**Checkpoint**: MVP complete — persistent layout + streaming markdown + backward compatibility. All P1 stories done.

---

## Phase 6: User Story 4 — Tool Call Display (Priority: P2)

**Goal**: Tool calls show collapsible headers with parameters, expandable output, diff view for file edits.

**Independent Test**: Run a prompt that triggers tool calls; see collapsible tool blocks with output.

### Implementation

- [x] T039 [P] [US4] Create useToolEvents hook in `src/cli/tui/hooks/useToolEvents.ts` — subscribes to event bus ToolExecution events, updates ChatContext.activeToolCalls/completedToolCalls
- [x] T040 [P] [US4] Create DiffView component in `src/cli/tui/components/DiffView.tsx` — per contracts/message-area.ts: file path header, hunk display, red/green coloring using `diff` package
- [x] T041 [US4] Create ToolCallBlock component in `src/cli/tui/components/ToolCallBlock.tsx` — per contracts/message-area.ts: header with status icon/spinner, collapsible output, DiffView for file ops
- [x] T042 [US4] Integrate ToolCallBlock into MessageArea — render active/completed tool calls inline with assistant messages

### Tests

- [x] T043 [P] [US4] Test DiffView renders added/removed lines in `tests/cli/tui/DiffView.test.tsx`
- [x] T044 [P] [US4] Test ToolCallBlock renders header, toggles expansion in `tests/cli/tui/ToolCallBlock.test.tsx`
- [x] T045 [P] [US4] Test useToolEvents subscribes and updates state in `tests/cli/tui/useToolEvents.test.ts`

**Checkpoint**: Tool calls display with collapsible output and diff views.

---

## Phase 7: User Story 6 — Permission Dialog (Priority: P2)

**Goal**: Permission prompts render as TUI modal overlays instead of separate readline.

**Independent Test**: Trigger a tool needing permission; see modal with A/D/R/N shortcuts.

### Implementation

- [x] T046 [P] [US6] Create usePermission hook in `src/cli/tui/hooks/usePermission.ts` — subscribes to event bus PermissionRequested events, opens dialog via DialogContext, sends PermissionResponse
- [x] T047 [US6] Create PermissionDialog component in `src/cli/tui/dialogs/PermissionDialog.tsx` — per contracts/dialog.ts: centered modal, icon + action, tool + resource, A/D/R/N keyboard shortcuts
- [x] T048 [US6] Wire usePermission into App — auto-opens PermissionDialog when permission event arrives, resolves/rejects based on user choice

### Tests

- [x] T049 [P] [US6] Test PermissionDialog renders and responds to keyboard in `tests/cli/tui/PermissionDialog.test.tsx`
- [x] T050 [P] [US6] Test usePermission opens dialog on event in `tests/cli/tui/usePermission.test.ts`

**Checkpoint**: Permission prompts are first-class TUI dialogs. No more readline contention.

---

## Phase 8: User Story 5 — Modal Dialogs (Priority: P2)

**Goal**: Model picker, agent selector, session list, MCP manager as modal overlays.

**Independent Test**: Press Ctrl+X then 'm' to open model picker; select a model.

### Implementation (all dialogs are independent files)

- [x] T051 [P] [US5] Create ModelPicker dialog in `src/cli/tui/dialogs/ModelPicker.tsx` — per contracts/dialog.ts: grouped model list via ink-select-input, resolves with model ID
- [x] T052 [P] [US5] Create AgentSelector dialog in `src/cli/tui/dialogs/AgentSelector.tsx` — per contracts/dialog.ts: agent list with colors, resolves with agent name
- [x] T053 [P] [US5] Create SessionList dialog in `src/cli/tui/dialogs/SessionList.tsx` — per contracts/dialog.ts: session summaries, select/create new
- [x] T054 [P] [US5] Create McpManager dialog in `src/cli/tui/dialogs/McpManager.tsx` — per contracts/dialog.ts: server list with status, connect/disconnect actions
- [x] T055 [US5] Wire dialogs to command dispatch — `/model` opens ModelPicker, `/agent` opens AgentSelector, `/sessions` opens SessionList, `/mcp` opens McpManager

### Tests

- [x] T056 [P] [US5] Test ModelPicker renders models and resolves selection in `tests/cli/tui/ModelPicker.test.tsx`
- [x] T057 [P] [US5] Test AgentSelector renders agents in `tests/cli/tui/AgentSelector.test.tsx`

**Checkpoint**: All modal dialogs functional. Replaces @inquirer/prompts and inline prompts.

---

## Phase 9: User Story 7 — Keybinding System (Priority: P2)

**Goal**: Tab/Shift+Tab agent cycling, Ctrl+X leader mode, Ctrl+K command palette, Ctrl+L clear, Ctrl+C abort.

**Independent Test**: Press Tab to cycle agents; Ctrl+X then 'n' for new session; Ctrl+K opens palette.

### Implementation

- [x] T058 [US7] Create useKeyboard hook in `src/cli/tui/hooks/useKeyboard.ts` — unified keyboard handler using Ink's useInput; dispatches to agent cycling, leader mode, command palette, abort
- [x] T059 [US7] Create CommandPalette component in `src/cli/tui/components/CommandPalette.tsx` — per contracts/dialog.ts: fuzzy search over commands, Up/Down/Enter/Escape
- [x] T060 [US7] Wire useKeyboard into App — replace KeybindContext state transitions with useKeyboard dispatches; Tab/Shift+Tab update SessionContext.agent

### Tests

- [x] T061 [P] [US7] Test CommandPalette filters and selects in `tests/cli/tui/CommandPalette.test.tsx`
- [x] T062 [P] [US7] Test useKeyboard Tab cycles agents in `tests/cli/tui/useKeyboard.test.ts`

**Checkpoint**: Full keybinding system operational. Leader mode + command palette + agent cycling.

---

## Phase 10: User Story 10 — Spinner & Progress (Priority: P3)

**Goal**: Proper spinner component replaces hand-rolled braille spinner. Shows during streaming and tool calls.

**Independent Test**: Send a prompt; see spinner while waiting for first token.

### Implementation

- [x] T063 [P] [US10] Create Spinner component in `src/cli/tui/components/Spinner.tsx` — wraps ink-spinner with theme colors, configurable label
- [x] T064 [US10] Integrate Spinner into MessageArea (streaming wait) and ToolCallBlock (running status)

### Tests

- [x] T065 [US10] Test Spinner renders animation frame in `tests/cli/tui/Spinner.test.tsx`

**Checkpoint**: Spinner replaces hand-rolled animation.

---

## Phase 11: User Story 8 — Theme Support (Priority: P3)

**Goal**: Dark/light theme switching via `/theme` command. All colors read from theme context.

**Independent Test**: Run `/theme light` and see colors change; `/theme dark` reverts.

### Implementation

- [x] T066 [US8] Add `/theme` slash command to command registry — toggles ThemeContext between dark and light
- [x] T067 [US8] Audit all components for hard-coded colors — replace with `useTheme()` reads; ensure every color reference uses theme

### Tests

- [x] T068 [US8] Test theme toggle changes colors in `tests/cli/tui/theme.test.tsx`

**Checkpoint**: Theme system fully wired. Dark/light switching works.

---

## Phase 12: Polish & Cross-Cutting Concerns

**Purpose**: Performance, cleanup, deprecation of old code.

- [x] T069 [P] Performance: implement `<Static>` for completed messages in MessageArea — only streaming message in dynamic render area
- [x] T070 [P] Terminal resize handling: subscribe to `useWindowSize()` changes, re-layout gracefully
- [x] T071 [P] Deprecation markers: add `@deprecated` JSDoc to `src/cli/interactive.ts`, `src/cli/utils/colors.ts`, `src/cli/utils/agentColors.ts`, `src/cli/utils/keybindings.ts`, `src/cli/utils/modelPicker.ts`
- [x] T072 Run full test suite: `npm test` — verify zero regressions
- [x] T073 Run typecheck: `npm run typecheck` — verify zero type errors
- [x] T074 Run lint: `npm run lint` — verify zero lint errors
- [x] T075 Run quickstart.md validation: manually verify bootstrap steps still work

**Checkpoint**: All polish complete. Feature ready for merge.

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (Setup) ──────────────────────────────────────────────► Phase 2 (Foundational/US1)
                                                                        │
                                                                        ▼
                                              ┌─────────────────────────┼─────────────────────────┐
                                              │                         │                         │
                                              ▼                         ▼                         ▼
                                    Phase 3 (US2: Layout)    Phase 4 (US3: Markdown)    Phase 5 (US9: Compat)
                                              │                         │                         │
                                              └─────────────┬───────────┘                         │
                                                            │                                     │
                                              ┌─────────────┼─────────────────┐                   │
                                              ▼             ▼                 ▼                   │
                                    Phase 6 (US4: Tools)  Phase 7 (US6: Perm)  Phase 8 (US5: Dialogs)
                                              │             │                 │                   │
                                              └─────────────┼─────────────────┘                   │
                                                            ▼                                     │
                                                  Phase 9 (US7: Keybinds)                         │
                                                            │                                     │
                                              ┌─────────────┼─────────────────┐                   │
                                              ▼                               ▼                   │
                                    Phase 10 (US10: Spinner)      Phase 11 (US8: Theme)           │
                                              │                               │                   │
                                              └───────────────┬───────────────┘───────────────────┘
                                                              ▼
                                                    Phase 12 (Polish)
```

### Within-Phase Parallel Opportunities

| Phase | Parallel Tasks | Sequential Tasks |
|-------|---------------|-----------------|
| 1 (Setup) | T001, T002, T004, T005 | T003 (dirs first) |
| 2 (Foundation) | T006–T008 (themes), T009–T013 (contexts), T016–T018 (tests) | T014→T015 (entry→app) |
| 3 (Layout) | T019–T022 (components), T025–T027 (tests) | T023→T024 (area→wire) |
| 4 (Markdown) | T028–T029 (renderer+hook), T032–T033 (tests) | T030→T031 (integrate→wire) |
| 5 (Compat) | T037–T038 (tests) | T034→T035→T036 |
| 6 (Tools) | T039–T040 (hook+diff), T043–T045 (tests) | T041→T042 (block→integrate) |
| 7 (Permission) | T046 (hook), T049–T050 (tests) | T047→T048 (dialog→wire) |
| 8 (Dialogs) | T051–T054 (all 4 dialogs), T056–T057 (tests) | T055 (wire) |
| 9 (Keybinds) | T061–T062 (tests) | T058→T059→T060 |
| 10 (Spinner) | T063 | T064→T065 |
| 11 (Theme) | — | T066→T067→T068 |
| 12 (Polish) | T069–T071 | T072→T073→T074→T075 |

### Cross-Phase Parallelism (Subagent Strategy)

Once Phase 2 completes, launch up to **3 parallel subagents**:

```
Subagent A: Phase 3 (Layout)     → Phase 6 (Tools)     → Phase 10 (Spinner)
Subagent B: Phase 4 (Markdown)   → Phase 7 (Permission) → Phase 11 (Theme)
Subagent C: Phase 5 (Compat)     → Phase 8 (Dialogs)    → Phase 9 (Keybinds)
```

After all three complete → Phase 12 (Polish) as single agent.

---

## Parallel Example: Phase 2 (Foundation)

```bash
# Wave 1: All theme files + all context providers (8 tasks in parallel)
Task T006: "Create theme types in src/cli/tui/theme/types.ts"
Task T007: "Create dark theme in src/cli/tui/theme/dark.ts"
Task T008: "Create light theme in src/cli/tui/theme/light.ts"
Task T009: "Create ThemeContext in src/cli/tui/context/ThemeContext.tsx"
Task T010: "Create SessionContext in src/cli/tui/context/SessionContext.tsx"
Task T011: "Create ChatContext in src/cli/tui/context/ChatContext.tsx"
Task T012: "Create KeybindContext in src/cli/tui/context/KeybindContext.tsx"
Task T013: "Create DialogContext in src/cli/tui/context/DialogContext.tsx"

# Wave 2: Entry point + App shell (sequential, depends on Wave 1)
Task T014: "Create TUI entry point in src/cli/tui/index.ts"
Task T015: "Create App component in src/cli/tui/App.tsx"

# Wave 3: Tests (parallel, after Wave 2)
Task T016: "Test ThemeContext"
Task T017: "Test DialogContext"
Task T018: "Test App shell"
```

---

## Parallel Example: Post-Foundation (3 Subagents)

```bash
# All three launch simultaneously after Phase 2 checkpoint:

Subagent A (Layout → Tools → Spinner):
  T019, T020, T021, T022 (parallel) → T023 → T024 → T025, T026, T027 (parallel)
  → T039, T040 (parallel) → T041 → T042 → T043, T044, T045 (parallel)
  → T063 → T064 → T065

Subagent B (Markdown → Permission → Theme):
  T028, T029 (parallel) → T030 → T031 → T032, T033 (parallel)
  → T046, T049, T050 (parallel) → T047 → T048
  → T066 → T067 → T068

Subagent C (Compat → Dialogs → Keybinds):
  T034 → T035 → T036 → T037, T038 (parallel)
  → T051, T052, T053, T054 (parallel) → T055 → T056, T057 (parallel)
  → T058 → T059 → T060 → T061, T062 (parallel)
```

---

## Implementation Strategy

### MVP First (Phases 1–5)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL — blocks all stories)
3. Complete Phases 3 + 4 + 5 in parallel (3 subagents)
4. **STOP and VALIDATE**: `npm test`, `npm run typecheck`, manual TUI test
5. Merge to `master` as v0.2.0-alpha

### Full Feature (Phases 6–11)

6. Complete Phases 6 + 7 + 8 in parallel (3 subagents)
7. Complete Phase 9: Keybindings
8. Complete Phases 10 + 11 in parallel (2 subagents)
9. **STOP and VALIDATE**: Full regression test

### Final (Phase 12)

10. Complete Phase 12: Polish
11. Final validation: all tests, typecheck, lint, manual QA
12. Merge as v0.2.0

---

## Notes

- [P] tasks = different files, no dependencies — safe for parallel subagent execution
- [US#] label maps task to specific user story for traceability
- Each user story is independently completable and testable after its phase
- Commit after each task or logical group
- Stop at any checkpoint to validate independently
- Total: **75 tasks**, 10 user stories, 12 phases
- Parallel tasks: **42 of 75** (56%) marked [P]
- Max parallelism: 8 simultaneous tasks (Phase 2, Wave 1)
