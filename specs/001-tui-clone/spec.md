# Feature Spec: Full TUI Clone (Kilocode-style)

## Overview

Replace Alexi's current readline-based interactive REPL (`src/cli/interactive.ts`,
~1960 lines of raw `process.stdout.write` + ANSI codes) with a full component-based
Terminal User Interface (TUI) modeled after Kilocode CLI's architecture.

The target UX is feature-parity with Kilocode's TUI: a persistent layout with a
scrollable message area, fixed input box, status bar, modal dialogs for model/agent
selection, streaming markdown rendering, tool-call display with collapsible output,
diff viewer for file edits, and permission dialogs — all driven by a reactive
component model.

## User Input (verbatim)

> сделаем полный клон TUI как у kilocode cli
> https://github.com/Kilo-Org/kilocode

## Reference Architecture (Kilocode)

Kilocode uses:
- **OpenTUI** (`@opentui/core` + `@opentui/solid`) — terminal rendering framework
- **SolidJS** — reactive state/UI framework
- **Bun** runtime with worker threads for backend
- Component tree: `<App>` → route-based views (`home.tsx`, `session.tsx`) with
  context providers for theme, keybindings, SDK connection, sync, etc.
- UI primitives: `<box>` (flexbox), `<text>`, `<scrollbox>`
- Modal dialog system for agent, model, provider, session, MCP selection
- Streaming markdown in message area
- Tool call display with expandable output sections

## Requirements

### R1 — Component-Based TUI Framework
Replace raw readline + ANSI with a component-based terminal UI framework.
Alexi already has `ink` (v6.8.0) + `react` (v19.2.4) as unused dependencies;
these should be evaluated first before introducing SolidJS + OpenTUI to avoid
unnecessary complexity.

### R2 — Persistent Layout
The TUI must maintain a persistent layout:
- **Header**: model name, agent badge, session ID, token count
- **Message area**: scrollable, showing conversation history with streaming updates
- **Input area**: fixed at bottom, multi-line capable, with agent-colored prompt
- **Status bar**: persistent bottom line showing keybinding hints, cost, active agent

### R3 — Streaming Markdown Rendering
LLM output must be rendered as formatted markdown in the terminal:
- Syntax-highlighted code blocks
- Bold, italic, headers, lists
- Inline code with background
- Links (clickable if terminal supports)
- Streaming: render incrementally as chunks arrive

### R4 — Tool Call Display
When the agent executes tools (read, write, edit, bash, glob, grep, etc.):
- Show tool name + parameters in a collapsible header
- Show tool output in an expandable section
- For file edits: show a diff view (red/green)
- For bash commands: show command + output

### R5 — Modal Dialogs
Replace current inline prompts with modal dialog overlays:
- Model picker (currently `@inquirer/prompts` — replace with TUI dialog)
- Agent selector
- Session list / rename
- MCP server manager
- Permission approval dialog (currently creates a separate readline — replace)

### R6 — Permission Dialog
The permission prompt must be a first-class TUI dialog, not a separate readline.
Show the permission box as an overlay with icon, action, tool, resource, description.
Support keyboard shortcuts: A(pprove), D(eny), R(emember), N(ever).

### R7 — Keybinding System
Preserve and enhance existing keybindings:
- Tab / Shift+Tab: cycle agents
- Ctrl+X leader mode: n(ew session), m(odel), a(gents), s(tatus), h(elp)
- Ctrl+L: clear screen
- Ctrl+C: abort streaming / exit
- Add: Ctrl+K command palette (fuzzy search over all slash commands)

### R8 — Theme Support
Support at least dark and light themes. Colors should be defined in a theme
object, not hard-coded ANSI escape sequences.

### R9 — Backward Compatibility
- All existing slash commands must continue to work
- `--print` / `--file` non-interactive modes must not be affected
- JSON output mode must be preserved
- The TUI is the default interactive mode; the old readline mode may be removed

### R10 — Spinner & Progress
Replace the hand-rolled braille spinner with a proper spinner component.
Show progress for long-running operations (tool calls, context loading).

## Non-Requirements (explicitly out of scope)

- Web UI / desktop app (Kilocode has Tauri desktop + web app — not cloning those)
- Worker thread architecture (Alexi runs single-process, no backend server)
- SolidJS adoption (unless Ink/React proves insufficient)
- VS Code extension

## Success Criteria

1. `alexi` launches into a persistent TUI with header, message area, input, status bar
2. Streaming LLM output renders as formatted markdown with syntax highlighting
3. Tool calls display with collapsible output and diff views
4. Model picker, agent selector, permission prompt are modal dialogs
5. Tab/Shift-Tab agent cycling, Ctrl+X leader mode, Ctrl+K command palette work
6. `npm test` passes; no regressions in non-interactive modes
7. The ~1960-line `interactive.ts` monolith is decomposed into focused components
