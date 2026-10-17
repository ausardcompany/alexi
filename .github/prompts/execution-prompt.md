# Execution Task: Apply Update Plan to Alexi

You are an expert software developer. Your task is to execute the update plan below precisely.

## Update Plan to Execute

# Update Plan for Alexi

Generated: 2026-10-17
Based on upstream commits analyzed:
- **kilocode**: 3a3271de2..1552877e8 (62 commits)
- **opencode**: 00e7472..22e771f (29 commits)

## Summary
- Total changes planned: 11
- Critical: 1 | High: 4 | Medium: 4 | Low: 2

Focus areas identified from upstream:
1. **AI stream resilience** (Gemini MALFORMED_RESPONSE retry, unknown event tolerance, broken-pipe retry)
2. **Snapshot/Git concurrency safety** on Windows
3. **MCP OAuth token refresh**
4. **Session list pagination refactor** + cursor schema
5. **Model config enhancements** (reasoning in config, releaseDate, temperature capability)
6. **Agent usage aggregation (CLI)**
7. **TUI worker console isolation**
8. **Reasoning replay persistence (OpenRouter)**

---

## Changes

### 1. Retry broken-pipe transport failures in HTTP utility
**File**: `src/util/retry.ts` (or `src/util/http.ts`)
**Priority**: high
**Type**: bugfix
**Reason**: Upstream `opencode` #56307 adds EPIPE/broken-pipe to retry-eligible transport errors. Without this, long-running SAP AI Core calls through load balancers can fail intermittently with unhandled broken pipes.

**New code** (add to retry predicate):
```typescript
// src/util/retry.ts
const TRANSIENT_ERROR_CODES = new Set([
  "ECONNRESET",
  "ECONNREFUSED",
  "ETIMEDOUT",
  "ENOTFOUND",
  "EAI_AGAIN",
  "EPIPE",          // NEW: broken-pipe (opencode #56307)
]);

export function isRetryableTransportError(err: unknown): boolean {
  if (!err || typeof err !== "object") return false;
  const code = (err as { code?: string }).code;
  if (code && TRANSIENT_ERROR_CODES.has(code)) return true;
  const message = (err as { message?: string }).message ?? "";
  if (/broken pipe|EPIPE/i.test(message)) return true;
  return false;
}
```

---

### 2. Tolerate unknown / untyped stream events in AI protocol parsers
**File**: `src/providers/sap-ai-core/stream.ts` (or wherever stream events are decoded)
**Priority**: critical
**Type**: bugfix
**Reason**: `opencode` #56286 (`fix(ai): tolerate unknown and untyped stream events`) prevents crashes when upstream providers emit new event kinds. Critical for SAP AI Core since it proxies multiple providers (Anthropic, Gemini, OpenAI) and may forward unexpected shapes.

**Current code** (example pattern to replace):
```typescript
switch (event.type) {
  case "content_block_delta": /* ... */ break;
  case "message_stop":        /* ... */ break;
  default:
    throw new Error(`Unknown stream event: ${event.type}`);
}
```

**New code**:
```typescript
switch (event.type) {
  case "content_block_delta": /* ... */ break;
  case "message_stop":        /* ... */ break;
  default:
    // Gracefully ignore unknown/untyped events to stay forward-compatible
    // with new provider SSE formats (opencode #56286).
    logger.debug?.("stream.unknown_event", { type: event?.type ?? "<untyped>" });
    break;
}
```

Also guard untyped events:
```typescript
if (!event || typeof event !== "object" || typeof event.type !== "string") {
  logger.debug?.("stream.untyped_event", { event });
  return;
}
```

---

### 3. Retry Gemini `MALFORMED_RESPONSE` finishes
**File**: `src/providers/sap-ai-core/gemini.ts`
**Priority**: high
**Type**: bugfix
**Reason**: `opencode` #56232 — Gemini (and Vertex via SAP AI Core) occasionally completes with `finishReason: MALFORMED_RESPONSE`. Treat as transient and retry once instead of surfacing to the agent loop.

**New code**:
```typescript
// src/providers/sap-ai-core/gemini.ts

const MALFORMED_FINISH_REASONS = new Set(["MALFORMED_RESPONSE", "MALFORMED_FUNCTION_CALL"]);

export async function invokeGeminiWithRetry(req: GeminiRequest): Promise<GeminiResponse> {
  const MAX_ATTEMPTS = 2;
  let lastErr: unknown;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const res = await invokeGemini(req);
      const finish = res?.candidates?.[0]?.finishReason;
      if (finish && MALFORMED_FINISH_REASONS.has(finish) && attempt < MAX_ATTEMPTS) {
        logger.warn("gemini.malformed_finish.retrying", { finish, attempt });
        continue;
      }
      return res;
    } catch (err) {
      lastErr = err;
      if (!isRetryableTransportError(err)) throw err;
    }
  }
  throw lastErr ?? new Error("Gemini call failed after retries");
}
```

---

### 4. Retry concurrent snapshot/Git object writes (Windows safety)
**File**: `src/core/snapshot.ts` or `src/core/git.ts`
**Priority**: medium
**Type**: bugfix
**Reason**: `opencode` #56190 — on Windows, concurrent Git writes to loose objects collide. If Alexi uses Git snapshots on Windows-hosted BAS/Dev Spaces, apply retry. Otherwise, keep code path no-op on non-Windows.

**New code**:
```typescript
// src/core/git.ts
import { setTimeout as sleep } from "node:timers/promises";

async function retryConcurrentObjectWrite<T>(fn: () => Promise<T>): Promise<T> {
  if (process.platform !== "win32") return fn();
  const MAX = 3;
  for (let i = 1; i <= MAX; i++) {
    try {
      return await fn();
    } catch (err) {
      // Only retry Git exit (non-zero) errors — not spawn failures.
      const isGitExit = (err as { exitCode?: number }).exitCode !== undefined;
      if (!isGitExit || i === MAX) throw err;
      await sleep(50);
    }
  }
  throw new Error("unreachable");
}

// Wrap update-index call:
await retryConcurrentObjectWrite(() =>
  runGit(["update-index", "--add", "--remove", "--replace", "-z", "--stdin"], { stdin, cwd })
);
```

---

### 5. MCP OAuth token auto-refresh with bounded timeout
**File**: `src/tool/mcp/refresh.ts` (new) + wire into `src/tool/mcp/client.ts`
**Priority**: high
**Type**: feature + security
**Reason**: `kilocode` adds `fix(cli): refresh expired MCP OAuth tokens automatically` (f9b632fd6) and bounded single-flight refresh (fb9277937, 9204aac51). SAP integrations commonly ship short-lived tokens; without this Alexi forces users to re-auth MCP servers manually.

**New code**:
```typescript
// src/tool/mcp/refresh.ts
type RefreshFn = () => Promise<{ accessToken: string; expiresAt: number }>;

const inflight = new Map<string, Promise<string>>();

export async function ensureFreshToken(
  serverId: string,
  current: { accessToken: string; expiresAt: number } | undefined,
  refresh: RefreshFn,
  opts: { connectTimeoutMs: number; skewMs?: number } = { connectTimeoutMs: 10_000 },
): Promise<string> {
  const now = Date.now();
  const skew = opts.skewMs ?? 30_000;
  if (current && current.expiresAt - skew > now) return current.accessToken;

  const existing = inflight.get(serverId);
  if (existing) return existing;

  const p = (async () => {
    try {
      const refreshed = await withTimeout(refresh(), opts.connectTimeoutMs, "mcp.refresh.timeout");
      return refreshed.accessToken;
    } finally {
      // CRITICAL: clear the single-flight entry so later retries aren't poisoned
      inflight.delete(serverId);
    }
  })();
  inflight.set(serverId, p);
  return p;
}

async function withTimeout<T>(p: Promise<T>, ms: number, label: string): Promise<T> {
  return await Promise.race([
    p,
    new Promise<T>((_, rej) => setTimeout(() => rej(new Error(label)), ms)),
  ]);
}
```

Call site:
```typescript
// src/tool/mcp/client.ts
const token = await ensureFreshToken(server.id, server.oauth, () => oauthRefresh(server), {
  connectTimeoutMs: server.connectTimeoutMs ?? 10_000,
});
request.headers.set("Authorization", `Bearer ${token}`);
```

---

### 6. Persist late OpenRouter reasoning details for replay
**File**: `src/core/session/reasoning-replay.ts` (new)
**Priority**: medium
**Type**: bugfix
**Reason**: `kilocode` 0f4936df1 — OpenRouter sometimes emits reasoning tokens after the final content; they must be persisted so session replay matches live display. If Alexi offers transcript/replay, add equivalent.

**New code**:
```typescript
// src/core/session/reasoning-replay.ts
export interface ReasoningEvent {
  index: number;
  text: string;
  receivedAt: number;
}

export class ReasoningBuffer {
  private events: ReasoningEvent[] = [];
  private finalized = false;

  append(ev: Omit<ReasoningEvent, "receivedAt">) {
    this.events.push({ ...ev, receivedAt: Date.now() });
  }

  /** Called when the stream completes; accepts late events arriving after finalize. */
  finalize() { this.finalized = true; }

  acceptLate(ev: Omit<ReasoningEvent, "receivedAt">) {
    if (!this.finalized) return this.append(ev);
    // Still persist — ordering by `index` protects replay fidelity.
    this.events.push({ ...ev, receivedAt: Date.now() });
    this.events.sort((a, b) => a.index - b.index);
  }

  snapshot() { return [...this.events]; }
}
```

Hook into session persister so late events trigger a resave of the assistant message.

---

### 7. Project-scoped agent usage aggregation (CLI)
**File**: `src/cli/agent-usage.ts` (new) + `src/cli/commands/usage.ts`
**Priority**: medium
**Type**: feature
**Reason**: `kilocode` 88312a65b + db5fb2ae1 add project-scoped agent usage aggregation. Useful for SAP cost-tracking across customer engagements.

**New code** (shape outline):
```typescript
// src/cli/agent-usage.ts
export interface AgentUsageRecord {
  sessionId: string;
  agent: string;
  project: string;
  startedAt: number;
  endedAt?: number;
  outcome: "success" | "aborted" | "error" | "unknown";
  tokensIn: number;
  tokensOut: number;
  costUSD?: number;
}

export interface A
{"prompt_tokens":17116,"completion_tokens":4096,"total_tokens":21212,"cache_read_input_tokens":0,"cache_creation_input_tokens":0}

[Session: 293619d2-ced2-43e0-b564-2098cd9870bc]
[Messages: 2, Tokens: 21212]

## Execution Instructions

1. **Execute each change** in the plan above in order of priority (critical → high → medium → low)
2. **Make exact code changes** as specified in the plan
3. **Maintain SAP AI Core compatibility** - do not break existing integrations
4. **Follow existing code style** in this repository
5. **Create changes summary** at `.github/reports/changes-summary.md` with:
   - List of files modified
   - Summary of each change made
   - Any issues encountered

## Important

- Do NOT skip any items in the plan
- Do NOT add extra changes not in the plan
- Do NOT ask questions - just execute
- If a file doesn't exist, create it
- If code context is unclear, use your best judgment based on the plan

Execute the entire plan now.
