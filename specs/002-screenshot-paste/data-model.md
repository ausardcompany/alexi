# Data Model: Screenshot / Image Paste Support

## 1. Core Types

### ImageFormat

```typescript
/** Supported image formats for clipboard/file paste. */
type ImageFormat = 'png' | 'jpeg' | 'gif' | 'webp';
```

### ImageAttachment

```typescript
/** A pending image attachment before message submission. */
interface ImageAttachment {
  /** Unique identifier for this attachment (nanoid). */
  id: string;
  /** Raw image data as a Buffer. */
  data: Buffer;
  /** Detected image format from magic bytes. */
  format: ImageFormat;
  /** Image dimensions if detectable (from header parsing). */
  dimensions?: { width: number; height: number };
  /** Size in bytes of the raw data. */
  sizeBytes: number;
  /** Source of the image. */
  source: 'clipboard' | 'file';
  /** Original file path if source is 'file'. */
  filePath?: string;
  /** Timestamp when the attachment was created. */
  createdAt: number;
}
```

### ImageAttachmentPreview

```typescript
/** Lightweight version of ImageAttachment for display purposes (no raw data). */
interface ImageAttachmentPreview {
  id: string;
  format: ImageFormat;
  dimensions?: { width: number; height: number };
  sizeBytes: number;
  source: 'clipboard' | 'file';
  filePath?: string;
}
```

## 2. Multimodal Message Types

### MultimodalContent

```typescript
/** Content item in a multimodal user message. */
type MultimodalContentItem =
  | { type: 'text'; text: string }
  | { type: 'image_url'; image_url: { url: string; detail?: string } };

/**
 * A user message with multimodal content.
 * Compatible with SAP AI SDK's UserChatMessageContentItem[].
 */
interface MultimodalUserMessage {
  role: 'user';
  content: MultimodalContentItem[];
}
```

### Message Extension

The existing message type used in `ChatContext` needs to be extended to
optionally carry image metadata for display purposes:

```typescript
/** Extended message type with optional image attachment metadata. */
interface ChatMessageDisplay {
  role: 'user' | 'assistant' | 'system' | 'tool';
  content: string;
  /** Image attachments metadata (for rendering placeholders in MessageArea). */
  images?: ImageAttachmentPreview[];
}
```

## 3. Clipboard State

### ClipboardCapability

```typescript
/** Detected clipboard tool availability. */
interface ClipboardCapability {
  /** Whether image clipboard reading is available. */
  available: boolean;
  /** The platform-specific tool that will be used. */
  tool?: 'pngpaste' | 'xclip' | 'wl-paste' | 'powershell';
  /** Platform identifier. */
  platform: 'darwin' | 'linux' | 'win32';
  /** Human-readable install instructions if not available. */
  installHint?: string;
}
```

### ClipboardImageResult

```typescript
/** Result of reading an image from the clipboard. */
type ClipboardImageResult =
  | { success: true; data: Buffer; format: ImageFormat }
  | { success: false; error: string };
```

## 4. Attachment State (React Context)

### AttachmentsState

```typescript
/** State managed by useAttachments hook / AttachmentContext. */
interface AttachmentsState {
  /** Currently pending image attachments (not yet submitted). */
  pending: ImageAttachment[];
  /** Whether a clipboard read is in progress. */
  reading: boolean;
  /** Last error from clipboard read or file read. */
  error?: string;
}
```

### AttachmentsActions

```typescript
/** Actions available from the useAttachments hook. */
interface AttachmentsActions {
  /** Read image from clipboard and add as attachment. */
  pasteFromClipboard(): Promise<void>;
  /** Read image from file path and add as attachment. */
  addFromFile(filePath: string): Promise<void>;
  /** Remove a specific attachment by ID. */
  remove(id: string): void;
  /** Clear all pending attachments. */
  clearAll(): void;
  /** Consume all pending attachments (called on message submit). Returns
   *  the attachments and clears the pending list. */
  consumeAll(): ImageAttachment[];
}
```

## 5. Configuration

### ImageConfig

```typescript
/** Configuration for image handling. */
interface ImageConfig {
  /** Maximum image size in bytes. Default: 20 * 1024 * 1024 (20 MB). */
  maxSizeBytes: number;
  /** Supported image formats. */
  supportedFormats: ImageFormat[];
  /** Detail level for image_url content. Default: 'auto'. */
  defaultDetail: 'auto' | 'low' | 'high';
}
```

Read from environment:
- `ALEXI_MAX_IMAGE_SIZE_MB` → `maxSizeBytes` (converted to bytes)

## 6. Provider Layer Type Changes

### toOrchestrationMessages Input Type

```typescript
// Current:
function toOrchestrationMessages(
  messages: Array<{ role: string; content: string } | ChatMessage | ToolChatMessage>
): ChatMessage[];

// Updated:
function toOrchestrationMessages(
  messages: Array<
    | { role: string; content: string }
    | ChatMessage
    | ToolChatMessage
    | MultimodalUserMessage
  >
): ChatMessage[];
```

The function gains a new detection branch: if a message has
`role === 'user'` and `Array.isArray(content)`, cast it as `UserChatMessage`
and return directly.

## 7. Event Bus Events (Optional)

If observability is needed for image operations:

```typescript
interface ImageEvents {
  'image:paste:start': { source: 'clipboard' | 'file' };
  'image:paste:success': { id: string; format: ImageFormat; sizeBytes: number };
  'image:paste:error': { error: string; source: 'clipboard' | 'file' };
  'image:removed': { id: string };
}
```
