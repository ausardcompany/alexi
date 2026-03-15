# Implementation Plan: Screenshot / Image Paste Support

**Branch**: `002-screenshot-paste` | **Date**: 2026-03-15 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-screenshot-paste/spec.md`

## Summary

Add multimodal image support to Alexi's TUI: users paste screenshots from
the clipboard (Ctrl+V) or attach images from files (`/image path`), and
these are sent to the LLM as base64-encoded `image_url` content items via
the SAP AI Core Orchestration API. The SDK already supports
`UserChatMessageContentItem[]` with `image_url` type — implementation work
is in the TUI layer (clipboard access, attachment state, input UX) and a
small provider-layer fix to pass multimodal content through without string
coercion.

## Technical Context

**Language/Version**: TypeScript 5.9 / Node.js >= 22.12.0 (ES Modules, strict)
**Primary Dependencies**: ink 6.8.0, react 19.2.4, @sap-ai-sdk/orchestration 2.8.0, nanoid
**Storage**: N/A (images are transient, held in memory as Buffers until submitted)
**Testing**: Vitest 4.0 with @vitejs/plugin-react, ink-testing-library 4.0
**Target Platform**: macOS (primary), Linux (X11/Wayland), Windows (PowerShell)
**Project Type**: CLI (terminal TUI via Ink)
**Performance Goals**: Clipboard read < 500ms; base64 encoding < 100ms for 20 MB image
**Constraints**: Max 20 MB image size (configurable); no temp files; no new npm runtime deps
**Scale/Scope**: Single-user CLI; typically 1-3 images per message

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Verify compliance with [Alexi Constitution](.specify/memory/constitution.md) before proceeding.

| # | Gate | Status |
|---|------|--------|
| 1 | **SAP AI Core-First** — All LLM calls route through SAP AI Core Orchestration; no direct provider API calls outside `src/providers/`. Images are sent as `UserChatMessageContentItem[]` through the existing SAP Orchestration provider. | [x] |
| 2 | **CLI-First** — Feature is reachable from the CLI (Ctrl+V keybinding + `/image` slash command); `--print`/`--file` non-interactive modes unaffected (no image paste in non-interactive). | [x] |
| 3 | **Provider Abstraction** — Provider changes confined to `src/providers/sapOrchestration.ts` (widening `toOrchestrationMessages` input type). No SDK imports outside `src/providers/`. | [x] |
| 4 | **Agentic Architecture** — No changes to agent prompts or router. Tool results continue to flow through event bus. MCP unaffected. | [x] |
| 5 | **Test Discipline (BLOCKING)** — All new modules (clipboard reader, image validation, attachment hook, multimodal message builder, provider changes) will have unit tests. Clipboard access mocked in tests (no real filesystem/network). | [x] |
| 6 | **Simplicity / YAGNI** — No new npm runtime dependencies (shell out to platform tools). No image preprocessing/compression. No inline terminal image rendering (stretch goal deferred). | [x] |
| 7 | **Security & Credential Hygiene (BLOCKING)** — No credentials involved. Image data stays in memory. No `console.log` in non-CLI modules (using logger utilities). | [x] |

## Project Structure

### Documentation (this feature)

```text
specs/002-screenshot-paste/
├── plan.md              # This file
├── spec.md              # Feature requirements
├── research.md          # Phase 0: technology decisions
├── data-model.md        # Phase 1: TypeScript types
├── contracts/           # Phase 1: interface contracts
│   ├── clipboard.ts     # Clipboard reader interface
│   ├── attachments.ts   # Attachment state management
│   └── multimodal.ts    # Multimodal message types
├── quickstart.md        # Phase 1: integration guide
└── tasks.md             # Phase 2: implementation tasks
```

### Source Code (new/modified files)

```text
src/
├── cli/tui/
│   ├── components/
│   │   ├── InputBox.tsx            # MODIFY: add attachment indicator, Ctrl+V handler
│   │   ├── AttachmentBar.tsx       # NEW: displays pending image attachments
│   │   └── MessageBubble.tsx       # MODIFY: render image placeholders
│   ├── context/
│   │   └── AttachmentContext.tsx    # NEW: React context for attachment state
│   ├── hooks/
│   │   ├── useAttachments.ts       # NEW: attachment state management hook
│   │   ├── useClipboardImage.ts    # NEW: clipboard image reading hook
│   │   ├── useStreamChat.ts        # MODIFY: build multimodal messages
│   │   └── useCommands.ts          # MODIFY: add /image slash command
│   └── types/
│       └── props.ts                # MODIFY: add attachment-related prop types
├── utils/
│   ├── clipboard.ts                # NEW: platform clipboard image reader
│   └── imageValidation.ts          # NEW: format detection, size validation
└── providers/
    └── sapOrchestration.ts         # MODIFY: multimodal pass-through in toOrchestrationMessages

tests/
├── clipboard.test.ts               # NEW: clipboard reader tests (mocked)
├── imageValidation.test.ts          # NEW: format detection tests
├── attachments.test.ts              # NEW: attachment hook tests
├── multimodal.test.ts               # NEW: message builder tests
└── provider-multimodal.test.ts      # NEW: provider multimodal pass-through tests
```

## Complexity Tracking

> No constitution violations identified. All changes follow existing patterns.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|--------------------------------------|
| (none)    | —          | —                                    |
