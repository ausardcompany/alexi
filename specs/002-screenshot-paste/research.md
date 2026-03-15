# Research: Screenshot / Image Paste Support

## 1. Clipboard Image Access

### Decision: Platform-native CLI tools (no npm dependency)

**Rationale**: Node.js has no built-in clipboard API. The npm ecosystem offers
libraries like `clipboardy` (text-only) and `clipboard-image` (unmaintained).
Rather than adding a dependency, we shell out to platform-native tools that are
either pre-installed or trivially installable. This aligns with Constitution
Principle VI (Simplicity / YAGNI).

| Platform | Tool | Command | Notes |
|----------|------|---------|-------|
| macOS | `pngpaste` | `pngpaste -` (stdout) | Homebrew: `brew install pngpaste`. Handles PNG clipboard natively. |
| macOS fallback | `osascript` | AppleScript + pasteboard | Pre-installed but slower, more complex. |
| Linux (X11) | `xclip` | `xclip -selection clipboard -t image/png -o` | Common on X11 desktops. |
| Linux (Wayland) | `wl-paste` | `wl-paste --type image/png` | Part of `wl-clipboard` package. |
| Windows | PowerShell | `powershell -command "..."` | Pre-installed. Uses `System.Windows.Forms.Clipboard`. |

### Alternatives Considered

| Alternative | Why rejected |
|-------------|-------------|
| `clipboardy` npm package | Text-only — does not support image data |
| `clipboard-image` npm package | Unmaintained (last publish 2020), writes temp files |
| `electron` clipboard API | Massive dependency; Alexi is a CLI tool |
| Node.js native addon (N-API) | Too complex; platform compilation required |

### Detection Strategy

1. On startup (or first paste attempt), detect the platform via `process.platform`.
2. Probe for available clipboard tools using `which` / `where`.
3. Cache the detected tool for the session lifetime.
4. If no tool is available, show a one-time diagnostic message with install
   instructions.

## 2. Image Encoding & Transport

### Decision: Base64 data URI inline encoding

**Rationale**: The SAP AI SDK's `ImageContentUrl.url` field accepts both HTTP
URLs and `data:` URIs. Since clipboard images are local binary data, we encode
them as `data:image/png;base64,<base64data>` and embed them directly in the
message. This avoids temp files and external hosting.

### Size Considerations

| Image type | Typical size | Base64 overhead | Wire size |
|------------|-------------|-----------------|-----------|
| Screenshot (1080p) | 200-800 KB | ~33% | 270 KB - 1.1 MB |
| Screenshot (4K) | 1-4 MB | ~33% | 1.3 - 5.3 MB |
| Photo (JPEG) | 2-10 MB | ~33% | 2.7 - 13.3 MB |

Base64 encoding adds ~33% overhead. A 20 MB limit (configurable) covers
virtually all screenshot use cases.

### Format Detection

Check the first bytes (magic numbers) to determine format:
- PNG: `89 50 4E 47` (`\x89PNG`)
- JPEG: `FF D8 FF`
- GIF: `47 49 46 38` (`GIF8`)
- WebP: bytes 8-11 = `57 45 42 50` (`WEBP`)

## 3. SAP AI Core Multimodal API Support

### Decision: Use existing `UserChatMessageContentItem[]` type

The `@sap-ai-sdk/orchestration` SDK (v2.8.0) already defines the full type
hierarchy for multimodal user messages:

```typescript
type UserChatMessageContent = string | UserChatMessageContentItem[];

type UserChatMessageContentItem = {
  type: 'text' | 'image_url';
  text?: string;
  image_url?: ImageContentUrl;
};

type ImageContentUrl = {
  url: string;       // HTTP URL or data:image/...;base64,...
  detail?: string;   // "auto" | "low" | "high"
};
```

**Key insight**: Only `UserChatMessage` supports `image_url` content items.
System, assistant, tool, and developer messages are text-only
(`ChatMessageContent = string | TextContent[]`).

### Provider Layer Gap

The current `toOrchestrationMessages()` function in
`src/providers/sapOrchestration.ts` accepts messages typed as
`{ role: string; content: string } | ChatMessage | ToolChatMessage`.

For multimodal support, we need to:
1. Widen the input type to accept `UserChatMessage` with array content.
2. Add a detection branch: if a message already has `role: 'user'` and `content`
   is an array, pass it through as-is (it's already a `UserChatMessage`).
3. This is a minimal, backward-compatible change.

## 4. Ink / React Input Integration

### Decision: Custom `useClipboardImage` hook + `useInput` keybinding

**Rationale**: `ink-text-input` handles text paste natively (multi-character
input strings). For image paste, we need to intercept Ctrl+V _before_ the text
input processes it, check for clipboard images, and conditionally consume the
event.

#### Approach

1. Register a `useInput` handler in `InputBox.tsx` that intercepts Ctrl+V.
2. On Ctrl+V:
   - Call `clipboardImage.read()` (async, shells out to platform tool).
   - If image data returned → add to attachments state, show indicator.
   - If no image → let the event propagate (ink-text-input handles text paste).
3. The `useInput` hook in ink fires handlers in registration order. By
   registering the image handler first (or using the `isActive` guard), we can
   conditionally consume the event.

#### Challenge: Ctrl+V in raw mode

In raw terminal mode, `Ctrl+V` sends `\x16` (SYN). Ink's `parseKeypress`
interprets this as a control character. We can detect it in `useInput` via the
`key` object — but ink does not expose `key.ctrl` + `key.name === 'v'` for
this specific combination. Instead, we detect the raw `input === '\x16'`.

### Alternatives Considered

| Alternative | Why rejected |
|-------------|-------------|
| Bracketed paste mode interception | Ink doesn't support it; would need raw stdin override |
| `useStdin()` raw stream listener | Bypasses ink's input pipeline; fragile |
| Separate keybinding (Ctrl+Shift+V) | Not standard; terminals often don't distinguish Shift |

## 5. Attachment State Management

### Decision: `useAttachments` hook + `AttachmentContext`

Rather than threading attachment state through props, create a lightweight
context/hook that:
- Stores pending image attachments as `ImageAttachment[]`.
- Provides `addImage(data: Buffer, format: ImageFormat): void`.
- Provides `removeImage(id: string): void`.
- Provides `clearImages(): void`.
- On message submit, the chat hook merges text + attachments into a multimodal
  `UserChatMessage`.

This aligns with the existing TUI architecture (ChatContext, SessionContext)
and Constitution Principle IV (Agentic Architecture — event bus for
observability).

## 6. Terminal Image Preview (Stretch Goal)

Not required for MVP. For future consideration:

| Protocol | Support | Notes |
|----------|---------|-------|
| iTerm2 inline images | iTerm2, WezTerm, Mintty | OSC 1337 escape sequence |
| Sixel | xterm, mlterm, foot, WezTerm | Older protocol, widely supported on Linux |
| Kitty graphics | Kitty terminal | Proprietary protocol |

All three require terminal detection and graceful fallback to text placeholder.
