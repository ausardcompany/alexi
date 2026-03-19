# Feature Spec: Screenshot / Image Paste Support

## Overview

Add the ability to paste images (screenshots) from the system clipboard into
Alexi's TUI input, sending them to the LLM as multimodal content alongside
text. This enables visual analysis workflows — paste a screenshot, ask the LLM
to describe it, extract text from it, critique a UI design, or debug a visual
rendering issue.

The target UX mirrors Claude Code and Codemie: press a keybinding (e.g.,
Ctrl+V) or run a slash command (`/paste-image`) while an image is in the
clipboard, and Alexi attaches it to the next message as a base64-encoded
inline image.

## User Input (verbatim)

> implement the ability to paste screenshots into the TUI input so they can be
> sent to the LLM for visual analysis/description — similar to how Claude Code
> or Codemie handle image input.

## Requirements

### R1 — Clipboard Image Capture

Read image data (PNG, JPEG) from the system clipboard using platform-native
tools:
- **macOS**: `pngpaste` (preferred, handles PNG directly) or `osascript` +
  pasteboard APIs
- **Linux (X11)**: `xclip -selection clipboard -t image/png -o`
- **Linux (Wayland)**: `wl-paste --type image/png`
- **Windows**: PowerShell `Get-Clipboard -Format Image`

The capture must be non-blocking and return raw image bytes (or base64) without
writing temp files to disk if possible.

If the required clipboard tool is not installed or not found on `$PATH`:
- Auto-run `/doctor` diagnostics to identify the missing dependency.
- Show a generic error: "Clipboard image reading not available on this
  platform" with the `/doctor` output indicating which tool to install.

### R2 — Keybinding: Ctrl+V Image Paste

When the user presses Ctrl+V (or a configurable keybinding):
1. Check if the clipboard contains image data.
2. If yes: attach the image to the current input as a pending attachment,
   display a thumbnail indicator (e.g., `[📎 image attached — 128 KB]`) in
   the input area.
3. If no image in clipboard (text only): fall through to normal text paste
   behavior (no change to current UX).

### R3 — Slash Command: `/image`

Provide a `/image` slash command that:
- With no arguments: reads the clipboard image (same as Ctrl+V).
- With a file path argument: reads the image from the local filesystem
  (`/image ./screenshot.png`).
- Displays the same attachment indicator as R2.

### R4 — Multimodal Message Construction

When the user submits a message with one or more attached images:
1. Construct a `UserChatMessage` with `content` as
   `UserChatMessageContentItem[]` containing both `{ type: 'text', text }` and
   `{ type: 'image_url', image_url: { url: 'data:image/png;base64,...' } }`
   items.
2. Pass the pre-constructed `UserChatMessage` through the provider layer
   without string coercion.
3. Support multiple images per message.

### R5 — Provider Layer: Multimodal Pass-Through

Update `toOrchestrationMessages()` in `src/providers/sapOrchestration.ts` to:
- Detect pre-constructed `UserChatMessage` objects with array content.
- Pass them through to the SAP AI Core API without string coercion.
- The SAP AI SDK already supports `UserChatMessageContentItem[]` — this
  requirement is about ensuring the application layer doesn't strip it.

### R6 — Image Preview in Message Area

When displaying a user message that contains images:
- Show a placeholder in the message bubble: `[Image: 800×600 PNG, 128 KB]`
- Optionally: if the terminal supports Sixel or iTerm2 inline images, render
  a thumbnail (stretch goal — not required for MVP).

### R7 — Image Size Limits & Validation

- Maximum image size: 20 MB (configurable via environment variable
  `ALEXI_MAX_IMAGE_SIZE_MB`).
- Supported formats: PNG, JPEG, GIF, WebP.
- Validate image data before attaching (check magic bytes / file signature).
- If the image is too large, show an error and do not attach.
- No automatic compression or resizing — images are sent at original
  resolution and quality within the size cap.

### R8 — Abort / Remove Attachment

Before submitting, the user can remove the attached image:
- Press Escape while the attachment indicator is shown.
- Or use a `/remove-image` slash command (or `/clear-images`).

## Clarifications

### Session 2025-03-19

- Q: When the required clipboard tool is not installed, what should Alexi do? → A: Auto-run `/doctor` diagnostics and show a generic error message ("Clipboard image reading not available on this platform").
- Q: Should Alexi compress or resize large images before sending to the LLM API? → A: No processing — send images as-is within the 20 MB cap.

## Non-Requirements (explicitly out of scope)

- Drag-and-drop image support (terminal limitation)
- Image generation / output from LLM (we only send images to the LLM, not
  receive them)
- Video or audio attachments
- OCR preprocessing — the LLM handles image understanding natively
- Sixel / iTerm2 inline image rendering (stretch goal, not MVP)
- Image editing / cropping before sending

## Success Criteria

1. `Ctrl+V` with an image in the clipboard attaches it to the input and shows
   an indicator
2. `/image` slash command reads clipboard image; `/image path` reads from file
3. Submitting a message with an attached image sends a multimodal
   `UserChatMessage` to SAP AI Core
4. The LLM responds with analysis/description of the image content
5. Message history shows `[Image: ...]` placeholder for image attachments
6. Images exceeding 20 MB are rejected with a clear error message
7. `npm test` passes; no regressions in text-only chat or non-interactive modes
8. Works on macOS out of the box; Linux/Windows support with appropriate
   clipboard tools installed
