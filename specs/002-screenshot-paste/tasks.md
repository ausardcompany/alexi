# Tasks: Screenshot / Image Paste Support

**Input documents**:
- [spec.md](./spec.md) — Requirements R1–R8
- [research.md](./research.md) — Technology decisions
- [data-model.md](./data-model.md) — TypeScript types
- [contracts/](./contracts/) — Interface contracts
- [plan.md](./plan.md) — Implementation plan with constitution check

**Prerequisites**:
- [x] Constitution check passed (all 7 gates)
- [x] Research complete (clipboard tools, SAP SDK types, Ink integration)
- [x] Data model defined
- [x] Contracts defined

## User Stories

| ID | Spec Req | User Story | Priority | Category |
|----|----------|-----------|----------|----------|
| US1 | R1, R2 | As a user, I can paste a clipboard image into the TUI input via Ctrl+V | P1 | MVP |
| US2 | R3 | As a user, I can attach an image via `/image` slash command | P1 | MVP |
| US3 | R4, R5 | As a user, my images are sent to the LLM as multimodal content | P1 | MVP |
| US4 | R6 | As a user, I see image placeholders in the message history | P2 | Full |
| US5 | R7 | As a user, oversized or invalid images are rejected with clear errors | P2 | Full |
| US6 | R8 | As a user, I can remove attached images before submitting | P2 | Full |

---

## Phase 1: Foundation — Image Utilities (no UI changes)

- [ ] **T001** [US5] `src/utils/imageValidation.ts` — Create image format
  detection utility. Detect PNG/JPEG/GIF/WebP from magic bytes. Export
  `detectImageFormat(data: Buffer): ImageFormat | null` and
  `validateImage(data: Buffer, maxSizeBytes: number): ValidationResult`.

- [ ] **T002** [P] [US5] `tests/imageValidation.test.ts` — Unit tests for
  image validation: valid PNG, valid JPEG, valid GIF, valid WebP, invalid
  data, oversized image, empty buffer, buffer too short for signature check.

- [ ] **T003** [US1] `src/utils/clipboard.ts` — Create platform clipboard
  image reader. Implement `ClipboardImageReader` interface from contracts.
  Detect platform and available tool on first call (cached). Shell out to
  `pngpaste`/`xclip`/`wl-paste`/PowerShell. Return `ClipboardImageResult`.

- [ ] **T004** [P] [US1] `tests/clipboard.test.ts` — Unit tests for clipboard
  reader: mock `child_process.execFile` for each platform. Test success
  (returns Buffer + format), test tool-not-found error, test empty clipboard
  error, test platform detection.

**Checkpoint**: Image utilities work independently, fully tested. No UI or
provider changes yet.

---

## Phase 2: Provider Layer — Multimodal Pass-Through

- [ ] **T005** [US3] `src/providers/sapOrchestration.ts` — Update
  `toOrchestrationMessages()` to detect and pass through `UserChatMessage`
  objects with array content. Add a branch: if `m.role === 'user'` and
  `Array.isArray(m.content)`, return `m as ChatMessage` directly.

- [ ] **T006** [P] [US3] `tests/provider-multimodal.test.ts` — Unit tests for
  multimodal pass-through: text-only message (backward compat), multimodal
  message with text + image_url items, mixed array of text and multimodal
  messages, existing ChatMessage/ToolChatMessage pass-through unaffected.

- [ ] **T007** [US3] `src/utils/multimodal.ts` — Create `buildMultimodalMessage()`
  utility. Given text + `ImageAttachment[]`, produce either a plain
  `{ role: 'user', content: text }` (no images) or a `MultimodalUserMessage`
  with `UserChatMessageContentItem[]`. Handle base64 data URI construction.

- [ ] **T008** [P] [US3] `tests/multimodal.test.ts` — Unit tests for message
  builder: text-only returns plain message, single image, multiple images,
  text + images combined, correct data URI format, detail parameter.

**Checkpoint**: Provider layer accepts and passes multimodal messages. Message
builder converts attachments to SDK-compatible format. All tested.

---

## Phase 3: Attachment State Management (React)

- [ ] **T009** [US1] `src/cli/tui/context/AttachmentContext.tsx` — Create
  `AttachmentContext` and `AttachmentProvider`. Stores `AttachmentsState`
  (pending images, reading flag, error). Provides `AttachmentsActions`.

- [ ] **T010** [US1] `src/cli/tui/hooks/useAttachments.ts` — Create
  `useAttachments` hook. Wraps `useContext(AttachmentContext)`. Implements
  `pasteFromClipboard()`, `addFromFile()`, `remove()`, `clearAll()`,
  `consumeAll()`. Uses `clipboard.ts` and `imageValidation.ts` utilities.

- [ ] **T011** [P] [US1] `tests/attachments.test.ts` — Unit tests for
  attachment hook: add from clipboard (mocked), add from file, remove by ID,
  clear all, consume all (returns and clears), error on invalid image, error
  on oversized image, reading flag toggling.

- [ ] **T012** [US1] `src/cli/tui/App.tsx` — Wrap the component tree with
  `AttachmentProvider` (inside existing providers).

**Checkpoint**: Attachment state management works. React context provides
pending images to all TUI components. Tested.

---

## Phase 4: TUI Integration — Input & Display

- [ ] **T013** [US1] `src/cli/tui/hooks/useClipboardImage.ts` — Create
  `useClipboardImage` hook that wraps `useAttachments().pasteFromClipboard()`
  and integrates with `useInput` from ink to intercept Ctrl+V (`\x16`).

- [ ] **T014** [US1] `src/cli/tui/components/AttachmentBar.tsx` — Create
  `AttachmentBar` component. Renders below the input box when pending
  attachments exist. Shows format, size, count. Shows "Press Esc to remove"
  hint.

- [ ] **T015** [US1] `src/cli/tui/components/InputBox.tsx` — Integrate
  `useClipboardImage` hook. Add `AttachmentBar` below the text input.
  Pass attachment indicator visibility to layout.

- [ ] **T016** [US6] `src/cli/tui/components/InputBox.tsx` — Handle Escape
  key to clear attachments when attachment indicator is visible (only when
  attachments exist; otherwise Escape retains default behavior).

- [ ] **T017** [US3] `src/cli/tui/hooks/useStreamChat.ts` — Modify
  `sendMessage` to check for pending attachments via `useAttachments()`.
  If attachments exist, use `buildMultimodalMessage()` instead of plain
  text. Call `consumeAll()` to clear attachments after building.

- [ ] **T018** [US4] `src/cli/tui/components/MessageBubble.tsx` — Modify
  to detect and render image placeholders. If a user message has `images`
  metadata, display `[Image: 800x600 PNG, 128 KB]` before the text content.

- [ ] **T019** [US4] `src/cli/tui/context/ChatContext.tsx` — Extend message
  state to store `ImageAttachmentPreview[]` alongside message content for
  display purposes.

**Checkpoint**: Ctrl+V pastes an image, indicator shows, submitting sends
multimodal message, message history shows image placeholders.

---

## Phase 5: Slash Commands

- [ ] **T020** [US2] `src/cli/tui/hooks/useCommands.ts` — Add `/image`
  slash command. No args → paste from clipboard. With file path arg →
  read from file via `useAttachments().addFromFile()`. Show success/error
  feedback.

- [ ] **T021** [US6] `src/cli/tui/hooks/useCommands.ts` — Add
  `/clear-images` slash command. Calls `useAttachments().clearAll()`.

- [ ] **T022** [P] [US2] `tests/commands-image.test.ts` — Unit tests for
  `/image` and `/clear-images` commands.

**Checkpoint**: Slash commands work. `/image` reads clipboard or file.
`/clear-images` removes pending attachments.

---

## Phase 6: Polish & Error Handling

- [ ] **T023** [US5] `src/utils/clipboard.ts` — Add diagnostic message when
  clipboard tool is not available. Include install instructions per platform.
  Only show once per session.

- [ ] **T024** [US5] Error UX: Show inline error messages for common failures:
  - "No image found in clipboard" (clipboard has text, not image)
  - "Image too large (15 MB > 20 MB limit)" 
  - "Unsupported image format"
  - "pngpaste not found — install with: brew install pngpaste"

- [ ] **T025** [US5] `src/config/env.ts` — Add `ALEXI_MAX_IMAGE_SIZE_MB`
  environment variable support (if env config pattern exists there).

- [ ] **T026** Integration test: end-to-end flow with mocked clipboard
  returning a real PNG buffer → attachment state → multimodal message
  construction → provider receives correct `UserChatMessageContentItem[]`.

**Checkpoint**: All error cases handled gracefully. Configuration works.
Integration tested.

---

## Phase 7: CI & Documentation

- [ ] **T027** Run `npm run typecheck` — zero errors.
- [ ] **T028** Run `npm run lint` — zero errors.
- [ ] **T029** Run `npm test` — all tests pass, no regressions.
- [ ] **T030** Run `npm run build` — dist/ output correct.

**Checkpoint**: CI gates pass. Feature complete and ready for review.
