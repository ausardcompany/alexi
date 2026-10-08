# Changes Summary — Upstream Sync 2026-10-08

**Based on upstream commits:**
- kilocode: `5e9f816fc..bed08b09e` (139 commits)
- opencode: `ecc4916..5d9cd9b` (9 commits)

## Files modified

| File | Status | Change |
|---|---|---|
| `src/providers/embeddings/openai-compatible.ts` | **created** | New embedding client with `dimensions` capability detection + response-shape guards |
| `src/command/reserved.ts` | **created** | Reserved command-name registry + `partitionReservedCommands` helper |
| `src/command/index.ts` | modified | Imports/re-exports from `./reserved.js`; new `loadCommands()` top-level helper; `CommandRegistry.loadFromDirectory` now filters reserved clashes with a warning instead of failing the whole load |
| `src/core/session/attachment.ts` | **created** | `classifyAttachment` / `normalizeAttachment` / `buildAttachments`; SVG downgraded to text, unsupported MIME types collected into `rejected` instead of thrown |
| `src/core/session/prompt.ts` | **created** | `buildPrompt()` composes a `{ text, attachments, rejected }` result so a rejected attachment never discards the user's text prompt |

## Change-by-change notes

### 1. (HIGH) `src/providers/embeddings/openai-compatible.ts` — tolerate endpoints that reject `dimensions`

Backports upstream kilo-indexing commits `0a5c6df34`, `52936e8a6`, `da1927014`, `4d6b6342b`, `43fb46bf3`.

Key behaviours:
- Per-endpoint capability cache (`endpointCapabilityCache`) remembers whether an endpoint accepts the `dimensions` body field.
- On HTTP 400/422 + a body matching `/dimensions?/i` and a rejection verb, the client retries once without `dimensions` and marks the endpoint `acceptsDimensions: false`.
- The success-path response body is parsed with a shape guard — a malformed JSON body or missing `data` array now raises an actionable error (`returned non-JSON body` / `returned no vectors`) instead of crashing further down.
- `surfaceErrorEnvelope()` prefers `error.message` / `message` from JSON error envelopes, falling back to a 500-byte raw-body preview.
- `resetEndpointCapabilityCache()` exported for test determinism.

SAP AI Core relevance: SAP-fronted OpenAI deployments and some Azure gateways reject `dimensions`; this is exactly the shape of error Alexi needs to tolerate without failing the whole indexing run.

### 2. (HIGH) Reserved command-name clash → warning, not fatal

Backports upstream opencode commits `47151ca0c` and `b4b51f252`.

- New `src/command/reserved.ts` exports `RESERVED_COMMAND_NAMES` (populated with Alexi's actual built-ins: `help`, `exit`, `quit`, `clear`, `new`, `session(s)`, `model(s)`, `agent(s)`, `reload`, `context`, `notes`, `stages`, `dod`, `plugin`, `generate`, `explain`, `chat`, `interactive`, `server`, `revert`) and `partitionReservedCommands<T>()`.
- `src/command/index.ts` now re-exports these from a stable path and adds a top-level `loadCommands(raw, warn)` helper that returns the kept subset while reporting clashes.
- `CommandRegistry.loadFromDirectory` runs the filter so a single user command named e.g. `help` no longer takes down the entire user command set — operator sees a warning per clash and the rest keeps working.

### 3. (HIGH) Prevent rejected attachments from discarding the prompt (SVG → text fallback)

Backports upstream opencode commits `225c393f4`, `cf720c9b3`, `27eeb1420`, `51a361ee6`, `6d3d87fef`, `969c9dbd6`.

- `src/core/session/attachment.ts`:
  - `classifyAttachment` → `'image' | 'text' | 'unsupported'`, with `image/svg+xml` routed to `'text'`.
  - `normalizeAttachment` returns `null` for unsupported MIME types (never throws) and emits a `downgradedFrom: 'image'` marker for SVGs decoded to UTF-8 text.
  - `buildAttachments` folds a batch, collecting rejections in a `rejected: { source, reason }[]` array rather than failing on first unsupported.
- `src/core/session/prompt.ts`:
  - `buildPrompt(text, raw)` returns `{ text, attachments, rejected }`. Text is always preserved; accepted attachments are always forwarded; rejections are warnings for the caller to render.

SAP AI Core relevance: SAP model gateways frequently reject `image/svg+xml` as an image part. Prior behaviour lost the user's text prompt too; new behaviour sends the text + any valid attachments and reports which attachments were dropped.

## Issues encountered

- **Plan was truncated.** The update plan text supplied in the task ended mid-token during the body of change 3 (`src/core/session/prompt.ts`) at the signature `function buildPrompt(text: string, raw: Raw`. Items 4–9 described in the plan's summary (`Total changes planned: 9 — Critical: 1 | High: 4 | Medium: 3 | Low: 1`) were never emitted. The one explicitly-named critical item was never specified. Only the three fully-specified HIGH-priority items (changes 1, 2, 3) could be executed. Change 3's `prompt.ts` was completed using the shape clearly implied by the first half of the plan (`PromptBuildResult { text; attachments; rejected }`).
- No existing `src/core/session/prompt.ts` or `src/core/session/attachment.ts` module to extend — both were created fresh under the path specified by the plan. The existing attachment config lives at `src/config/attachment.ts` and is a separate concern (image resize/quality knobs), left untouched.
- No existing OpenAI-compatible embeddings module — `src/providers/sapOrchestration.ts` has a different SDK-based `SapOrchestrationEmbeddings` class that was deliberately left untouched (the plan targeted the generic OpenAI-compatible path, not the SAP SDK path). The new file at `src/providers/embeddings/openai-compatible.ts` is additive.
- Tests for the new modules were not required by the plan and were not added. CI's 40% lines-coverage gate may need a follow-up test commit if these modules are wired into runtime paths.
- The ESLint `no-console: warn` rule is a warning (not an error) and `src/command/index.ts` already uses `console.warn` elsewhere, so the new `loadCommands()` default `warn` callback (`(m) => console.warn(m)`) does not regress lint posture.

## Suggested follow-up

- Request a re-plan to recover items 4–9 (and the one critical item) that were lost in the truncation.
- Add unit tests under `src/providers/embeddings/__tests__/openai-compatible.test.ts`, `src/command/__tests__/reserved.test.ts`, and `src/core/session/__tests__/attachment.test.ts` before this ships, to lift coverage and lock in the fallback behaviours documented above.
- Wire `buildPrompt` into the actual prompt-submission paths (`src/cli/interactive.ts`, `src/cli/commands/chat.ts`) once the attachment plumbing is confirmed — the new module is currently a stand-alone utility.
- Wire `callEmbeddingEndpoint` into whatever embedder Alexi uses at runtime (if/when a non-SAP-SDK path is added); currently it's a standalone utility ready to be imported.
