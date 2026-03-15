# Quickstart: Screenshot / Image Paste Support

## Prerequisites

- macOS: Install `pngpaste` via `brew install pngpaste`
- Linux (X11): Install `xclip` via `apt install xclip` or `dnf install xclip`
- Linux (Wayland): Install `wl-clipboard` via `apt install wl-clipboard`
- Windows: PowerShell is pre-installed (no action needed)

## Usage

### Paste from clipboard (Ctrl+V)

1. Take a screenshot or copy an image to the clipboard.
2. In the Alexi TUI input, press **Ctrl+V**.
3. An attachment indicator appears: `[image attached — 128 KB]`
4. Type your message (e.g., "What's in this screenshot?") and press Enter.
5. The image is sent alongside your text to the LLM.

### Paste via slash command

```
/image                    # Read image from clipboard
/image ./screenshot.png   # Attach image from file
```

### Remove an attachment

- Press **Escape** while the attachment indicator is shown.
- Or type `/clear-images` to remove all pending attachments.

### Multiple images

You can attach multiple images by pressing Ctrl+V or using `/image` multiple
times before submitting. All attached images are sent in a single message.

## Configuration

| Environment Variable | Default | Description |
|---------------------|---------|-------------|
| `ALEXI_MAX_IMAGE_SIZE_MB` | `20` | Maximum image size in MB |

## How it works

1. **Clipboard access**: Alexi shells out to platform-native tools (`pngpaste`,
   `xclip`, `wl-paste`, PowerShell) to read image data from the clipboard.
2. **Validation**: Image format is verified via magic bytes (PNG, JPEG, GIF,
   WebP). Size is checked against the configured limit.
3. **Attachment state**: Images are stored in memory as `Buffer` objects via a
   React context (`AttachmentContext`).
4. **Message construction**: On submit, text + images are combined into a
   multimodal `UserChatMessage` with `UserChatMessageContentItem[]` containing
   both `{ type: 'text' }` and `{ type: 'image_url' }` items.
5. **Provider layer**: The SAP Orchestration provider passes the multimodal
   message through to the SAP AI Core API without modification.

## Architecture integration

```
[Ctrl+V keypress]
    │
    ▼
useClipboardImage hook
    │ shells out to pngpaste/xclip/wl-paste
    ▼
AttachmentContext (React state)
    │ stores ImageAttachment[]
    ▼
InputBox + AttachmentBar (display indicator)
    │
    ▼ [user presses Enter]
    │
useStreamChat hook
    │ builds MultimodalUserMessage
    ▼
sapOrchestration.ts → toOrchestrationMessages()
    │ passes UserChatMessage with array content as-is
    ▼
SAP AI Core Orchestration API
    │
    ▼
LLM response (text describing the image)
```
