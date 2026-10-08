# Update Plan for Alexi

Generated: 2026-10-08
Based on upstream commits analyzed:
- kilocode: 5e9f816fc..bed08b09e (139 commits)
- opencode: ecc4916..5d9cd9b (9 commits)

## Summary
- Total changes planned: 9
- Critical: 1 | High: 4 | Medium: 3 | Low: 1

## Analysis Notes

The vast majority of upstream changes land in **GUI/plugin code** (kilo-vscode webview-ui, kilo-jetbrains frontend/backend) which does not map onto Alexi's CLI/orchestrator codebase. The changes relevant to Alexi are in:

1. **`packages/opencode/src/`** — core session, prompt, attachment, command, and image handling
2. **`packages/opencode/src/kilocode/`** — kilocode-specific extensions
3. **`packages/kilo-indexing/src/`** — embedder HTTP robustness (relevant if Alexi exposes embeddings for SAP AI Core)
4. **`patches/@ai-sdk/openai`** — provider patch (`ultrafast` service tier)

All of these have direct analogues under Alexi's `src/providers/`, `src/core/`, `src/cli/`, and (if present) `src/tool/`.

---

## Changes

### 1. Tolerate OpenAI-compatible embedding endpoints that reject `dimensions`

**File**: `src/providers/embeddings/openai-compatible.ts` (or equivalent embedder module)
**Priority**: high
**Type**: bugfix
**Reason**: Upstream kilo-indexing commits `0a5c6df34`, `52936e8a6`, `da1927014`, `4d6b6342b`, `43fb46bf3` harden the OpenAI-compatible embedder against endpoints (notably SAP AI Core-fronted OpenAI deployments and some Azure deployments) that reject the `dimensions` parameter or return non-standard error envelopes. This is directly relevant for Alexi's SAP AI Core integration where some proxied embedding endpoints do not accept `dimensions`.

**New code** (adapt to existing embedder shape):
```typescript
// src/providers/embeddings/openai-compatible.ts

interface EmbeddingRequestOptions {
  model: string
  input: string | string[]
  dimensions?: number
}

interface CachedEndpointCapability {
  acceptsDimensions: boolean
  // Only cache the omission after we've seen a usable response without dimensions.
  confirmedUsableFallback: boolean
}

const endpointCapabilityCache = new Map<string, CachedEndpointCapability>()

async function callEmbeddingEndpoint(
  endpoint: string,
  apiKey: string,
  opts: EmbeddingRequestOptions,
): Promise<number[][]> {
  const cached = endpointCapabilityCache.get(endpoint)
  const includeDimensions =
    opts.dimensions !== undefined &&
    (!cached || cached.acceptsDimensions)

  const body: Record<string, unknown> = {
    model: opts.model,
    input: opts.input,
  }
  if (includeDimensions && opts.dimensions !== undefined) {
    body.dimensions = opts.dimensions
  }

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  })

  // Project response text once per request so we can both surface a useful
  // error envelope and still decode embeddings if the status is 2xx.
  const rawText = await res.text()

  if (!res.ok) {
    // If dimensions was the problem, retry once without it and remember.
    if (
      includeDimensions &&
      looksLikeDimensionsRejection(res.status, rawText)
    ) {
      endpointCapabilityCache.set(endpoint, {
        acceptsDimensions: false,
        confirmedUsableFallback: false,
      })
      return callEmbeddingEndpoint(endpoint, apiKey, {
        ...opts,
        dimensions: undefined,
      })
    }
    throw new Error(
      `Embedding endpoint ${endpoint} failed: ${res.status} ${surfaceErrorEnvelope(rawText)}`,
    )
  }

  // Guard response shape before decoding.
  let parsed: unknown
  try {
    parsed = JSON.parse(rawText)
  } catch {
    throw new Error(`Embedding endpoint ${endpoint} returned non-JSON body`)
  }

  const embeddings = decodeEmbeddings(parsed)
  if (embeddings.length === 0) {
    throw new Error(`Embedding endpoint ${endpoint} returned no vectors`)
  }

  // Only confirm the dimensions omission once we have a usable response.
  if (!includeDimensions && opts.dimensions !== undefined) {
    endpointCapabilityCache.set(endpoint, {
      acceptsDimensions: false,
      confirmedUsableFallback: true,
    })
  }

  return embeddings
}

function looksLikeDimensionsRejection(status: number, body: string): boolean {
  if (status !== 400 && status !== 422) return false
  return /dimensions?/i.test(body) &&
    /(unsupported|invalid|not allowed|unknown|rejected)/i.test(body)
}

function surfaceErrorEnvelope(body: string): string {
  try {
    const j = JSON.parse(body)
    if (j?.error?.message) return String(j.error.message)
    if (j?.message) return String(j.message)
  } catch {}
  return body.slice(0, 500)
}

function decodeEmbeddings(parsed: unknown): number[][] {
  if (!parsed || typeof parsed !== "object") return []
  const data = (parsed as { data?: unknown }).data
  if (!Array.isArray(data)) return []
  const out: number[][] = []
  for (const row of data) {
    const emb = (row as { embedding?: unknown })?.embedding
    if (Array.isArray(emb) && emb.every((n) => typeof n === "number")) {
      out.push(emb as number[])
    }
  }
  return out
}
```

---

### 2. Reserved command-name clash → warning, keep slash commands

**File**: `src/cli/command/reserved.ts` (new) and `src/cli/command/index.ts`
**Priority**: high
**Type**: bugfix
**Reason**: Upstream commits `47151ca0c` and `b4b51f252` (`packages/opencode/src/kilocode/command/reserved.ts`) fix a bug where a user-defined command claiming a reserved name silently disabled all slash commands. Reserved clashes should surface as a config warning but not drop the rest of the command table.

**New code**:
```typescript
// src/cli/command/reserved.ts
export const RESERVED_COMMAND_NAMES: ReadonlySet<string> = new Set([
  "help",
  "exit",
  "quit",
  "clear",
  "new",
  "session",
  "model",
  "agent",
  // extend with Alexi's actual built-ins
])

export interface ReservedClash {
  name: string
  source: string // e.g. plugin id or config path
}

export function partitionReservedCommands<T extends { name: string; source?: string }>(
  commands: T[],
): { kept: T[]; clashes: ReservedClash[] } {
  const kept: T[] = []
  const clashes: ReservedClash[] = []
  for (const cmd of commands) {
    if (RESERVED_COMMAND_NAMES.has(cmd.name)) {
      clashes.push({ name: cmd.name, source: cmd.source ?? "unknown" })
      continue
    }
    kept.push(cmd)
  }
  return { kept, clashes }
}
```

**Modify** `src/cli/command/index.ts`:
```typescript
// Before: a reserved clash threw and discarded the whole command set.
// After:
import { partitionReservedCommands } from "./reserved"

export function loadCommands(raw: RawCommand[], warn: (msg: string) => void) {
  const { kept, clashes } = partitionReservedCommands(raw)
  for (const c of clashes) {
    warn(
      `Command "${c.name}" from ${c.source} uses a reserved name and will be ignored. ` +
      `Rename the command to re-enable it.`,
    )
  }
  return kept
}
```

---

### 3. Prevent rejected attachments from discarding the prompt (SVG → text fallback)

**File**: `src/core/session/attachment.ts` (new) and prompt submission path in `src/core/session/prompt.ts`
**Priority**: high
**Type**: bugfix
**Reason**: Upstream commits `225c393f4`, `cf720c9b3`, `27eeb1420`, `51a361ee6`, `6d3d87fef`, `969c9dbd6` in `packages/opencode/src/kilocode/session/attachment.ts` and `packages/opencode/src/image/image.ts` fix two tightly-coupled bugs:
1. A rejected attachment (e.g., SVG not accepted as an image by the model) silently discarded the whole prompt.
2. SVGs should be sent as text attachments, not as images.

For Alexi this matters because SAP AI Core model gateways frequently reject image/svg+xml.

**New file** `src/core/session/attachment.ts`:
```typescript
export type AttachmentKind = "image" | "text" | "unsupported"

export interface RawAttachment {
  path?: string
  url?: string
  mimeType?: string
  bytes?: Uint8Array
}

export interface NormalizedAttachment {
  kind: AttachmentKind
  mimeType: string
  content: Uint8Array | string
  // Set when we had to downgrade (e.g., svg → text) so the caller can note it.
  downgradedFrom?: AttachmentKind
}

const SVG_MIME = "image/svg+xml"

export function classifyAttachment(a: RawAttachment): AttachmentKind {
  const mt = (a.mimeType ?? "").toLowerCase()
  if (!mt) return "unsupported"
  if (mt === SVG_MIME) return "text" // SVGs ride as text
  if (mt.startsWith("image/")) return "image"
  if (mt.startsWith("text/")) return "text"
  return "unsupported"
}

export function normalizeAttachment(a: RawAttachment): NormalizedAttachment | null {
  const kind = classifyAttachment(a)
  if (kind === "unsupported") return null

  // SVG: treat as text, keep bytes decoded as utf-8.
  if ((a.mimeType ?? "").toLowerCase() === SVG_MIME) {
    const text = a.bytes
      ? new TextDecoder("utf-8").decode(a.bytes)
      : ""
    return {
      kind: "text",
      mimeType: SVG_MIME,
      content: text,
      downgradedFrom: "image",
    }
  }

  return {
    kind,
    mimeType: a.mimeType ?? "application/octet-stream",
    content: a.bytes ?? "",
  }
}
```

**Modify** `src/core/session/prompt.ts`:
```typescript
// Previous behavior: if any attachment failed, we threw and the user's text
// prompt was lost.
// New behavior: collect rejections, keep accepted attachments + the text,
// surface a non-fatal warning to the user.

import { normalizeAttachment, type RawAttachment } from "./attachment"

export interface PromptBuildResult {
  text: string
  attachments: NormalizedAttachment[]
  rejected: { source: string; reason: string }[]
}

export function buildPrompt(
  text: string,
  raw: Raw
{"prompt_tokens":22452,"completion_tokens":4096,"total_tokens":26548,"cache_read_input_tokens":0,"cache_creation_input_tokens":0}

[Session: 2703b574-15f1-4ba2-bb79-5fb63234edff]
[Messages: 2, Tokens: 26548]
