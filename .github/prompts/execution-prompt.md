# Execution Task: Apply Update Plan to Alexi

You are an expert software developer. Your task is to execute the update plan below precisely.

## Update Plan to Execute

```markdown
# Update Plan for Alexi

Generated: 2026-10-12
Based on upstream commits analyzed:
- opencode: `0cb43477` fix(core): preserve mixed line endings in edit tool (#53166)
- opencode: `4fbdea2d` fix(core): throw error on codemode fetch using file:// (#54510)
- opencode: `e5f4bf4c` test(core): match codemode file fetch error message (#54699)
- opencode: `e41e7e90` refactor(ai): rename OpenCodeZen provider to OpenCode (#54767)
- opencode: `35ef2294` feat(core): raise ChatGPT OAuth context for gpt-6.1-sol to 500k (#54668)
- opencode: `707de583` fix(cli): prioritize path-matched package manager and extend probe timeout (#54622)
- opencode: `47e5e715` fix(cli): resolve symlinked home path when detecting curl installs (#54609)
- opencode: `e5a557ef` fix(cli): return unavailable in updater.check when install method is unknown (#54672)
- opencode: `38454c6e` feat(cli): ask before pair --remote first exposes the server (#54561)
- opencode: `3e78cd58` fix(app): ignore collapsed side-panel tabs when closing a tab (#54695)
- opencode: `d306a15c` fix(app): show submitted prompt in frame composer clears (#54047)
- kilocode: `5d61e1ed9` fix(vscode): render synthetic wakeup prompts as scheduled notes
- kilocode: `1ecce5a79` fix(vscode): label scheduled cron and wakeup prompts
- kilocode: `ff1cc7a4c` fix: remove community labels from maintainer PRs in the sweep

## Summary
- Total changes planned: 8
- Critical: 1 | High: 3 | Medium: 3 | Low: 1

## Changes

### 1. Preserve mixed line endings in edit tool
**File**: `src/tool/edit.ts`
**Priority**: critical
**Type**: bugfix
**Reason**: Upstream `packages/core/src/tool/plugin/edit.ts` received a +113/-11 change ensuring that files with mixed CRLF/LF line endings are not silently normalized when edits are applied. This is a data-integrity issue — Windows-authored files that mix line endings (common in SAP enterprise codebases via Git `autocrlf`) would otherwise be mangled, producing noisy diffs and breaking downstream build/sign pipelines. Alexi inherits the same edit replacement path.

**Current code** (expected shape):
```typescript
// Normalizes to \n for replacement, then writes with os.EOL
const normalizedContent = content.replace(/\r\n/g, "\n");
const result = normalizedContent.replace(oldString, newString);
await fs.writeFile(filePath, result);
```

**New code**:
```typescript
// Detect dominant line ending of the ORIGINAL file and the ORIGINAL match region.
// Preserve mixed endings by only normalizing for comparison, not for writing.
function detectLineEnding(text: string): "\r\n" | "\n" | "mixed" {
  const crlf = (text.match(/\r\n/g) ?? []).length;
  const lf = (text.match(/(?<!\r)\n/g) ?? []).length;
  if (crlf > 0 && lf > 0) return "mixed";
  if (crlf > 0) return "\r\n";
  return "\n";
}

export async function applyEdit(filePath: string, oldString: string, newString: string) {
  const original = await fs.readFile(filePath, "utf8");
  const originalEol = detectLineEnding(original);

  // Try exact match first (preserves whatever line endings exist in `oldString`)
  if (original.includes(oldString)) {
    const updated = original.replace(oldString, newString);
    await fs.writeFile(filePath, updated);
    return updated;
  }

  // Fallback: normalize both sides for matching, then re-apply using the file's
  // dominant line ending — but only for the replacement region.
  const normalizedOriginal = original.replace(/\r\n/g, "\n");
  const normalizedOld = oldString.replace(/\r\n/g, "\n");
  const normalizedNew = newString.replace(/\r\n/g, "\n");

  if (!normalizedOriginal.includes(normalizedOld)) {
    throw new Error(`edit: oldString not found in ${filePath}`);
  }

  const targetEol = originalEol === "\r\n" ? "\r\n" : "\n";
  const replacedNormalized = normalizedOriginal.replace(
    normalizedOld,
    normalizedNew.replace(/\n/g, targetEol),
  );

  // If the file was "mixed", restore original CRLF positions outside the edit
  // region by splicing: find the pre/post boundaries in the ORIGINAL.
  if (originalEol === "mixed") {
    const idx = normalizedOriginal.indexOf(normalizedOld);
    const pre = sliceOriginalByNormalizedIndex(original, 0, idx);
    const post = sliceOriginalByNormalizedIndex(original, idx + normalizedOld.length, normalizedOriginal.length);
    const final = pre + normalizedNew.replace(/\n/g, targetEol) + post;
    await fs.writeFile(filePath, final);
    return final;
  }

  await fs.writeFile(filePath, replacedNormalized);
  return replacedNormalized;
}

// Maps an index in the LF-normalized string back to the index in the original string
function sliceOriginalByNormalizedIndex(original: string, normStart: number, normEnd: number): string {
  let origIdx = 0;
  let normIdx = 0;
  let startOrig = 0;
  let endOrig = original.length;
  while (origIdx < original.length && normIdx <= normEnd) {
    if (normIdx === normStart) startOrig = origIdx;
    if (normIdx === normEnd) { endOrig = origIdx; break; }
    if (original[origIdx] === "\r" && original[origIdx + 1] === "\n") {
      origIdx += 2;
    } else {
      origIdx += 1;
    }
    normIdx += 1;
  }
  return original.slice(startOrig, endOrig);
}
```

Also add tests mirroring `packages/core/test/tool-edit.test.ts` (+157 lines) covering: pure LF, pure CRLF, mixed, and edit spanning both.

---

### 2. Reject `file://` URIs in codemode web fetch
**File**: `src/core/codemode/web.ts` (create if absent)
**Priority**: critical
**Type**: security
**Reason**: Upstream `packages/core/src/codemode/web.ts` (+2 lines) and the test file (`test/tool-execute.test.ts` +9) explicitly reject `file://` schemes. Without this guard, codemode-synthesized fetch calls can exfiltrate local secrets (SAP service keys, `~/.aicore/credentials`, destination configs) via SSRF. This is a direct security hardening we must mirror.

**New code** (add at the top of the fetch helper):
```typescript
export async function codemodeFetch(url: string, init?: RequestInit): Promise<Response> {
  const parsed = new URL(url);
  if (parsed.protocol === "file:") {
    throw new Error(`codemode: refusing to fetch file:// URL (${url})`);
  }
  // existing fetch logic...
  return fetch(url, init);
}
```

**Test** (match upstream error wording for parity):
```typescript
it("rejects file:// urls", async () => {
  await expect(codemodeFetch("file:///etc/passwd")).rejects.toThrow(
    /refusing to fetch file:\/\//,
  );
});
```

---

### 3. Rename `opencode-zen` provider → `opencode`
**File**: `src/providers/opencode.ts` (rename from `src/providers/opencode-zen.ts` if present) and `src/providers/index.ts`
**Priority**: medium
**Type**: refactor
**Reason**: Upstream `packages/ai/src/providers/{opencode-zen.ts => opencode.ts}` renamed the provider identity. If Alexi re-exports or references this provider id (for routing fallbacks), the id string must be updated or users relying on `opencode-zen` in config will silently miss provider resolution. Because Alexi's primary provider is SAP AI Core, this is medium — only impacts users with mixed configs.

**Current code** (`src/providers/index.ts`):
```typescript
export { opencodeZen } from "./opencode-zen";
```

**New code**:
```typescript
export { opencode } from "./opencode";
// Back-compat alias (keep for 1 release cycle, log deprecation):
export { opencode as opencodeZen } from "./opencode";
```

In `src/providers/opencode.ts`:
```typescript
export const opencode = {
  id: "opencode",
  // emit a one-time warning if user configured "opencode-zen"
  legacyIds: ["opencode-zen"],
  // ...rest unchanged
};
```

Update provider resolver to accept `legacyIds` and warn once per session.

---

### 4. Fix OpenAI-compatible provider edge case
**File**: `src/providers/openai.ts` (or wherever the OpenAI-compatible shim lives)
**Priority**: high
**Type**: bugfix
**Reason**: Upstream `packages/core/src/plugin/provider/openai.ts` has a +4/-1 fix with a matching recorded test (`test/plugin/provider-openai.test.ts` +17). The small size suggests a header/param handling fix (likely around `Authorization` or `baseURL` normalization). Review the exact upstream diff and port — this is the shim Alexi uses for ChatGPT OAuth and SAP's OpenAI-compatible endpoints.

**Action**: Pull the actual diff from upstream commit; apply conservatively. Likely shape:
```typescript
// Before
headers: { Authorization: `Bearer ${apiKey}` }

// After — handle missing apiKey when using OAuth session token
headers: apiKey
  ? { Authorization: `Bearer ${apiKey}` }
  : session?.accessToken
    ? { Authorization: `Bearer ${session.accessToken}` }
    : {}
```

Port the recorded test fixture as well.

---

### 5. Raise ChatGPT OAuth context window for `gpt-6.1-sol` to 500k
**File**: `src/providers/chatgpt-oauth.ts` (or model-config constants)
**Priority**: medium
**Type**: feature
**Reason**: Upstream `35ef2294` raises context to 500k for `gpt-6.1-sol`. If Alexi's ChatGPT OAuth path hard-codes model→context limits for request budgeting / truncation, update to match or users will hit premature truncation.

**Current code**:
```typescript
const MODEL_CONTEXT: Record<string, number> = {
  "gpt-6.1-sol": 200_000,
  // ...
};
```

**New code**:
```typescript
const MODEL_CONTEXT: Record<string, number> = {
  "gpt-6.1-sol": 500_000,
  // ...
};
```

Note: Does NOT apply to SAP AI Core-hosted GPT models (those keep SAP-advertised limits).

---

### 6. CLI updater robustness improvements
**File**: `src/cli/updater.ts`
**Priority**: medium
**Type**: bugfix
**Reason**: Three upstream fixes converge on the updater:
- `707de583`: prioritize path-matched package manager + extend probe timeout
- `47e5e715`: resolve symlinked `$HOME` when detecting curl installs
- `e5a557ef`
{"prompt_tokens":26897,"completion_tokens":4096,"total_tokens":30993,"cache_read_input_tokens":0,"cache_creation_input_tokens":0}

[Session: 118ec9ff-04de-4e74-a413-9068eaf30cf4]
[Messages: 2, Tokens: 30993]

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
