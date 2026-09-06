# Update Plan for Alexi

Generated: 2026-09-06
Based on upstream commits analyzed:
- kilocode: `ecccd1f54..1e4693558` (40 commits, v7.5.14 → v7.5.15)
- opencode: `e289456..337fd14` (4 commits)

## Summary
- Total changes planned: 4
- Critical: 0 | High: 2 | Medium: 1 | Low: 1

## Analysis Notes

The vast majority of upstream changes are **JetBrains-plugin specific** (Kotlin UI/worktree/PR features in `packages/kilo-jetbrains/`) and do not apply to Alexi. The relevant cross-cutting changes are:

1. **opencode Codex GPT version filter fix** (major/minor comparison + integer support) — relevant if Alexi supports OpenAI Codex / GPT-5 model routing.
2. **GitLab provider reasoning variants** — relevant if Alexi supports GitLab AI provider.
3. **Version bumps** (7.5.14 → 7.5.15) — cosmetic.
4. **Kilo PermissionView styling** — JetBrains-only, no Alexi mapping.

No changes affect: `src/tool/`, `src/agent/`, `src/bus/`, `src/permission/` (Alexi's TypeScript permission system is unrelated to the Kotlin `PermissionView.kt` cosmetic tweak).

---

## Changes

### 1. Codex GPT version filter: compare by major AND minor, allow integer versions
**File**: `src/providers/openai/codex.ts` (or wherever Alexi filters Codex models)
**Priority**: high
**Type**: bugfix
**Reason**: Upstream fixed two bugs in Codex model gating:
- Previously only compared major version → excluded valid minor bumps (e.g., `gpt-5.1` was incorrectly filtered).
- Previously required a decimal (`gpt-5.0`) and dropped integer-only versions (`gpt-5`).

Combining both PRs (#47384 and #47385) into a single hardened filter.

**Current code** (typical pre-fix pattern):
```typescript
// Only matches "gpt-<major>.<minor>" and compares major only
const match = model.id.match(/^gpt-(\d+)\.(\d+)/)
if (!match) return false
const major = parseInt(match[1], 10)
return major >= MIN_MAJOR
```

**New code**:
```typescript
// Accept both "gpt-5" and "gpt-5.1"; compare (major, minor) tuples
const MIN_MAJOR = 5
const MIN_MINOR = 0

function isSupportedCodexModel(modelId: string): boolean {
  const match = modelId.match(/^gpt-(\d+)(?:\.(\d+))?/)
  if (!match) return false
  const major = parseInt(match[1], 10)
  const minor = match[2] !== undefined ? parseInt(match[2], 10) : 0
  if (major > MIN_MAJOR) return true
  if (major < MIN_MAJOR) return false
  return minor >= MIN_MINOR
}
```

**Reference**: upstream `packages/opencode/src/plugin/openai/codex.ts` and `packages/opencode/test/plugin/codex.test.ts` (+37 lines of tests).

---

### 2. Add GitLab AI provider reasoning variants
**File**: `src/providers/gitlab.ts` (create/update if Alexi exposes GitLab provider)
**Priority**: medium
**Type**: feature
**Reason**: Upstream bumped `gitlab-ai-provider` from `6.13.0` → `6.14.0` and adjusted `packages/opencode/src/provider/transform.ts` (+4, -1) to add reasoning-variant handling. If Alexi supports GitLab, its transform layer needs the same reasoning branch to avoid dropping/misrouting reasoning-capable models.

**Current code** (typical transform):
```typescript
export function transformGitlabModel(model: RawModel): Model {
  return {
    id: model.id,
    // no reasoning handling
  }
}
```

**New code**:
```typescript
export function transformGitlabModel(model: RawModel): Model {
  const isReasoning =
    model.id.includes("reasoning") ||
    model.capabilities?.includes("reasoning")

  return {
    id: model.id,
    reasoning: isReasoning ? { enabled: true } : undefined,
    // Preserve SAP AI Core routing hints if present
    ...(model.sapDeploymentId ? { sapDeploymentId: model.sapDeploymentId } : {}),
  }
}
```

Also update dependency (if vendored):
```jsonc
// package.json
"gitlab-ai-provider": "6.14.0"
```

**Test** (mirror upstream `test/provider/transform.test.ts` additions):
```typescript
test("gitlab reasoning variant is preserved", () => {
  const out = transformGitlabModel({ id: "gitlab/claude-reasoning", capabilities: ["reasoning"] })
  expect(out.reasoning?.enabled).toBe(true)
})
```

---

### 3. Version bump alignment
**File**: `package.json` (root and any `src/core/version.ts`)
**Priority**: low
**Type**: refactor
**Reason**: Track upstream `@opencode-ai/core` at `7.5.15`. Only apply if Alexi mirrors upstream version numbers; otherwise skip.

**Current code**:
```json
{ "version": "7.5.14" }
```

**New code**:
```json
{ "version": "7.5.15" }
```

---

### 4. Register Astra OAuth changeset annotation (documentation only)
**File**: `CHANGELOG.md` or `docs/upstream-sync.md`
**Priority**: low
**Type**: refactor (docs)
**Reason**: Upstream added `.changeset/bound-glob-searches.md` deletion + Astra OAuth annotation. No code impact for Alexi unless it consumes the Astra OAuth flow. Document the sync point for traceability.

**New code**:
```markdown
## Upstream sync 2026-09-06
- Synced with kilocode 1e4693558 / opencode 337fd14
- Adopted: Codex GPT version filter (major.minor, integer-safe)
- Adopted: GitLab reasoning variants
- Skipped: JetBrains plugin worktree/PR features (not applicable)
- Skipped: Kilo PermissionView.kt styling (JetBrains-only, no Alexi analog)
```

---

## Explicitly Skipped Changes (with rationale)

| Upstream change | Reason for skip |
|---|---|
| `PermissionView.kt` background color (`sessionBackground()` → `View.Dialog.bgColor()`) | JetBrains Swing UI; Alexi's `src/permission/` is TypeScript logic, not styling. |
| All `kilo-jetbrains/**` (worktree fork, PR conversations, run delegates, reaper, etc.) | JetBrains plugin only; no Alexi equivalent. |
| Console i18n refund FAQs (Go/Zen) | Console/marketing site only. |
| Chatwoot enterprise form wiring | Console only. |
| `bun.lock` churn | Regenerate via `bun install` after step 2. |

---

## Testing Recommendations

1. **Codex filter unit tests** (`src/providers/openai/codex.test.ts`):
   - `gpt-5` → included
   - `gpt-5.0`, `gpt-5.1`, `gpt-6` → included
   - `gpt-4`, `gpt-4.9` → excluded
   - Non-matching strings (`o1-preview`, `claude-3`) → excluded
2. **GitLab transform tests**: reasoning-tagged model preserves `reasoning.enabled`; non-reasoning model omits it.
3. **SAP AI Core regression**: run full provider enumeration against SAP AI Core deployment to confirm no models are dropped by the tightened Codex filter (SAP-hosted GPTs may report unusual id formats).
4. **Integration smoke**: `alexi models list` should show unchanged output except for previously-filtered `gpt-5` integer variants now appearing.

## Potential Risks

- **Codex filter tightening**: if Alexi previously relied on the buggy major-only comparison to accept forward-compatible models (e.g., a hypothetical `gpt-4.9` custom deployment), the new minor-aware compare could exclude them. Verify SAP AI Core Codex deployment IDs before merging.
- **GitLab provider bump (6.13 → 6.14)**: minor version, but check breaking changes in the `gitlab-ai-provider` changelog; if Alexi pins a fork, do not upgrade blindly.
- **No security fixes** in this sync — safe to defer if release cadence requires.
- **Version bump (step 3) is optional** — only apply if Alexi's release process is tied to upstream `@opencode-ai/core` version numbers.
{"prompt_tokens":13014,"completion_tokens":3127,"total_tokens":16141,"cache_read_input_tokens":0,"cache_creation_input_tokens":0}

[Session: ad7b4448-7c84-4aee-8f97-c39dcc4b86c9]
[Messages: 2, Tokens: 16141]
