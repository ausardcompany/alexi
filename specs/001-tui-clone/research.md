# Phase 0 Research: Full TUI Clone (Kilocode-style)

## 1. TUI Framework Decision

### Decision: **Ink v6 + React 19**

### Rationale
- Already installed as dependencies in `package.json` (v6.8.0, v19.2.4) but
  currently unused — zero new runtime dependencies needed for the core framework.
- Node.js-native (no Bun required). Works with Node >= 20, we require >= 22.12.0.
- Battle-tested in production CLI tools: Claude Code (Anthropic), Gemini CLI
  (Google), GitHub Copilot CLI, Cloudflare Wrangler, Prisma, Shopify CLI.
- 2.1M weekly downloads. Actively maintained (latest release 6.8.0).
- React 19 compatible (Ink 6 requires `react >=19.0.0`).
- Flexbox layout via Yoga engine — enables persistent header/footer/scrollable
  content regions.
- Built-in focus management, keyboard input hooks, window size tracking.

### Alternatives Considered

| Framework | Verdict | Why Rejected |
|-----------|---------|--------------|
| **SolidJS + OpenTUI** (Kilocode's choice) | Rejected | Requires Bun runtime; we're Node.js-only. OpenTUI is not on npm (internal Kilocode dependency). Would require SolidJS as a new dependency, JSX compilation changes, and a completely different reactive model. Not worth the complexity given Ink/React is already installed. |
| **blessed / blessed-contrib** | Rejected | Unmaintained since 2017. Complex ncurses-style API, not component-based. Large dependency footprint. |
| **terminal-kit** | Rejected | Imperative API, not component-based. Would require building our own component/state layer. |
| **Raw readline + ANSI** (current approach) | Rejected | This is what we're replacing. Cannot achieve persistent layouts, modal overlays, or streaming markdown rendering. The 1960-line monolith proves this approach doesn't scale. |

---

## 2. Markdown Rendering

### Decision: **`marked` + `marked-terminal` → `<Text>` component**

### Rationale
- `marked-terminal` v7.3.0 (4.2M downloads/week) converts markdown to ANSI-
  styled terminal strings. Handles headings, bold/italic, code blocks (with
  syntax highlighting via `cli-highlight`), tables, lists, links, blockquotes.
- Rendered ANSI string is placed inside Ink's `<Text>` component — no special
  integration needed.
- Streaming works naturally: accumulate chunks in React state, re-parse on each
  update. Ink's reconciler diffs the output and efficiently re-renders.
- `cli-highlight` v2.1.11 (6M downloads/week) provides syntax highlighting for
  code blocks using highlight.js. Themeable.

### Alternatives Considered

| Approach | Verdict | Why Rejected |
|----------|---------|--------------|
| `ink-markdown` v1.0.4 | Rejected | Built for Ink 2; wraps `marked-terminal` anyway; no added value over direct usage. |
| Custom markdown-to-JSX parser | Rejected | Huge engineering effort for marginal benefit. `marked-terminal` output in `<Text>` is sufficient for v1. |
| Raw markdown output (current) | Rejected | This is the gap we're filling. |

### Gotcha: Partial Markdown During Streaming
Incomplete markdown (e.g., unclosed code block) may render oddly. Mitigation:
close any open fences at render time before passing to `marked`. Example:
```ts
function closePartialFences(md: string): string {
  const openFences = (md.match(/```/g) || []).length;
  return openFences % 2 === 1 ? md + '\n```' : md;
}
```

---

## 3. Layout Architecture

### Decision: **Full-screen flexbox with manual scroll**

### Rationale
Ink provides Yoga-based flexbox layout. The full-screen TUI layout:

```
┌──────────────────────────────────────────┐
│ Header (height: 3)                       │  ← Fixed
│ model | agent badge | session | tokens   │
├──────────────────────────────────────────┤
│ Message Area (flexGrow: 1)               │  ← Scrollable
│ overflow: hidden + manual scroll offset  │
│ Contains: MessageBubble[], ToolCallBlock │
│                                          │
├──────────────────────────────────────────┤
│ Input Box (height: auto, min 1)          │  ← Fixed
│ agent-colored prompt + text input        │
├──────────────────────────────────────────┤
│ Status Bar (height: 1)                   │  ← Fixed
│ keybindings | cost | agent | model       │
└──────────────────────────────────────────┘
```

- `useWindowSize()` → set root `<Box>` to terminal height.
- Header + Status Bar have fixed heights.
- Input Box has `minHeight={1}` and grows for multi-line.
- Message Area gets `flexGrow={1}` + `overflow="hidden"`.
- Scroll offset managed in state, controlled by keyboard/auto-scroll on new content.
- `<Static>` can be used for performance: completed messages move to `<Static>`
  (written once, never re-rendered) while only the latest streaming message is
  in the dynamic area.

### Gotcha: No Native Scroll
Ink has no `overflow: scroll`. We implement scrolling by:
1. Tracking `scrollOffset` state
2. Slicing the rendered content array by viewport height
3. Handling Up/Down/PageUp/PageDown via `useInput`
4. Auto-scrolling to bottom on new content arrival

---

## 4. Modal Dialog System

### Decision: **Absolute-positioned `<Box>` with focus trapping**

### Rationale
Ink supports `position="absolute"` on `<Box>`, enabling overlays:

```tsx
{showDialog && (
  <Box
    position="absolute"
    top={centerY} left={centerX}
    width={dialogWidth} height={dialogHeight}
    borderStyle="round" borderColor="yellow"
  >
    <DialogContent />
  </Box>
)}
```

Focus is trapped inside the modal using `useFocusManager().focus(dialogId)`.
Background content renders with dimmed colors when a modal is active.

Dialogs needed:
1. **ModelPicker** — replaces `@inquirer/prompts` `select()` in `modelPicker.ts`
2. **AgentSelector** — replaces inline agent switching
3. **PermissionDialog** — replaces the separate `readline.createInterface` in
   `src/permission/prompt.ts` (eliminates the readline contention bug)
4. **SessionList** — replaces inline session display
5. **McpManager** — replaces inline MCP status/connect/disconnect

---

## 5. Input Handling

### Decision: **`ink-text-input` for single-line, custom multi-line component**

### Rationale
- `ink-text-input` v6.0.0 (802K downloads/week) provides a ready-made single-
  line input with cursor, placeholder, focus. Compatible with Ink >= 4.
- Multi-line input (Shift+Enter for new line) requires a custom component built
  with `useInput` + cursor state management. No off-the-shelf solution exists.
- Phase 1 ships with single-line input; multi-line is a Phase 2 enhancement.

### Keyboard Handling
Ink's `useInput(input, key)` provides:
- `key.tab`, `key.shift` — for agent cycling
- `key.ctrl` + character — for Ctrl+X leader mode
- `key.escape`, `key.return`, arrows, etc.

Leader mode state machine:
```ts
const [leaderActive, setLeaderActive] = useState(false);
useInput((input, key) => {
  if (key.ctrl && input === 'x') { setLeaderActive(true); return; }
  if (leaderActive) { dispatch(input); setLeaderActive(false); }
});
```

---

## 6. Tool Call Display

### Decision: **Collapsible `ToolCallBlock` component with diff rendering**

### Rationale
Each tool call renders as a `ToolCallBlock`:
- Header: tool icon + name + parameters (always visible)
- Body: tool output (collapsible, starts collapsed for completed calls)
- For file edits: use `diff` package (74.7M downloads/week) to compute line
  diffs, render with red/green coloring
- For bash commands: show `$ command` header + output

Subscribe to the event bus (`src/bus/`) for `ToolExecution` events to get
real-time tool call data.

---

## 7. Theme System

### Decision: **Theme context provider with dark/light presets**

### Rationale
Replace hard-coded ANSI escape codes in `colors.ts` (39 lines) and
`agentColors.ts` (67 lines) with a theme object:

```ts
interface Theme {
  name: 'dark' | 'light';
  colors: {
    primary: string;      // Main accent
    secondary: string;    // Secondary accent
    text: string;         // Default text
    dimText: string;      // Muted text
    error: string;        // Error messages
    success: string;      // Success messages
    warning: string;      // Warnings
    border: string;       // Box borders
    agents: Record<AgentName, string>;  // Agent-specific colors
  };
  borders: {
    style: 'single' | 'round' | 'double' | 'bold';
  };
}
```

Provided via `ThemeContext`. Components read theme from context, never
hard-code color values.

---

## 8. Spinner & Progress

### Decision: **`ink-spinner` v5.0.0**

### Rationale
- 1.6M downloads/week, compatible with Ink >= 4.
- Uses `cli-spinners` for various animation styles (dots, line, arrow, etc.).
- Replaces the hand-rolled `setInterval` braille spinner in `interactive.ts`.
- Show during: LLM streaming wait, tool execution, context loading.

---

## 9. Testing Strategy

### Decision: **`ink-testing-library` v4.0.0 + Vitest**

### Rationale
- `ink-testing-library` provides `render()`, `lastFrame()`, `stdin.write()` for
  snapshot-based component testing.
- Each component gets a `.test.tsx` file.
- Hooks get standalone `.test.ts` files (can test with `renderHook` or
  by wrapping in a minimal component).
- No network/filesystem calls in tests (mock `streamChat()`, event bus, etc.).
- Existing Vitest infrastructure unchanged.

---

## 10. New Dependencies Summary

| Package | Version | Purpose | Type |
|---------|---------|---------|------|
| `marked` | ^15.0.0 | Markdown parsing | runtime |
| `marked-terminal` | ^7.3.0 | Markdown → ANSI terminal strings | runtime |
| `cli-highlight` | ^2.1.11 | Syntax highlighting in code blocks | runtime |
| `ink-text-input` | ^6.0.0 | Single-line text input component | runtime |
| `ink-select-input` | ^6.2.0 | List selection component (for dialogs) | runtime |
| `ink-spinner` | ^5.0.0 | Loading spinner | runtime |
| `diff` | ^8.0.3 | Text diffing for file edit display | runtime |
| `terminal-link` | ^5.0.0 | Clickable hyperlinks in terminal | runtime |
| `ink-testing-library` | ^4.0.0 | Component testing utilities | devDependency |

**Justification** (per Constitution VI — Dependency Policy): All 8 runtime
dependencies are thin, widely-used packages (all > 500K downloads/week except
`ink-spinner` at 1.6M). Each fills a gap that would require significant
reimplementation. No alternative bundle of fewer packages achieves equivalent
functionality.

---

## 11. Migration Strategy

### Phase 1 (MVP)
1. Create `src/cli/tui/` directory structure
2. Implement `App.tsx` with provider tree
3. Implement `Header.tsx`, `StatusBar.tsx`, `InputBox.tsx` (single-line)
4. Implement `MessageArea.tsx` + `MessageBubble.tsx` with markdown rendering
5. Implement `Spinner.tsx`
6. Wire `useStreamChat` hook to existing `streamChat()` async generator
7. Wire slash command dispatch to existing `handleCommand()` (extract from
   switch statement into a command registry)
8. Switch `src/cli/commands/interactive.ts` to launch TUI instead of old REPL

### Phase 2 (Full Feature Parity)
1. Implement all modal dialogs (ModelPicker, AgentSelector, PermissionDialog,
   SessionList, McpManager)
2. Implement `ToolCallBlock.tsx` + `DiffView.tsx`
3. Implement `CommandPalette.tsx` (Ctrl+K fuzzy search)
4. Implement multi-line input
5. Implement theme switching
6. Remove old `interactive.ts`

### Phase 3 (Polish)
1. Performance optimization (virtualized scrolling, `<Static>` for old messages)
2. Terminal resize handling
3. Mouse scroll support (if terminal supports)
4. Accessibility improvements
