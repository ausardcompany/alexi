# Changes Summary — Upstream Sync 2026-09-06

Plan source: kilocode `ecccd1f54..1e4693558` + opencode `e289456..337fd14`.

## Files modified

1. `src/providers/openai/prompt-cache.ts` — added `CODEX_MIN_MAJOR`, `CODEX_MIN_MINOR`, and `isSupportedCodexModel(modelId)` helper.
2. `src/providers/openai/__tests__/prompt-cache.test.ts` — added `isSupportedCodexModel` to imports and a 7-case `describe` block covering integer major versions, minor bumps, newer majors, older majors, non-gpt families, and case-insensitivity on the prefix.
3. `src/providers/gitlab.ts` — **new file**. GitLab AI provider reasoning-variant transform with `RawGitlabModel`, `GitlabModel`, `GitlabReasoningFlag` types and `transformGitlabModel()` function.
4. `src/providers/__tests__/gitlab.test.ts` — **new file**. 8 unit tests covering id-marker reasoning detection, capability-array reasoning detection, non-reasoning models, SAP AI Core deployment hint preservation, and combined reasoning + SAP hint scenarios.
5. `CHANGELOG.md` — added an `[Unreleased] > Added` bullet documenting both adopted helpers with full test-case enumeration and the list of skipped upstream changes.
6. `docs/upstream-sync/2026-09-06.md` — **new file**. Full sync report with adopted / skipped tables, risk register, and file-touch inventory.

## Change-by-change

### 1. Codex GPT version filter (plan step 1, high priority)

**What**: Added a general-purpose `isSupportedCodexModel(modelId: string): boolean` helper in `src/providers/openai/prompt-cache.ts` (alongside the existing `isGpt5_6OrLater` that already handled the same two bugs for the cache-breakpoint threshold of 5.6).

**Why**: Ports opencode PRs #47384 (integer-major crash on `gpt-6` because the parser required a decimal) and #47385 (major-only comparison misclassifies minor bumps). Combined into a single hardened filter as the plan directed.

**Shape**: Regex `/^gpt-(\d+)(?:\.(\d+))?/i` with the minor group defaulting to `0`, then a `(major, minor)` tuple compare against `(CODEX_MIN_MAJOR = 5, CODEX_MIN_MINOR = 0)`. Constants are exported so callers can pin against them in tests without magic numbers.

**Test cases** (7 in `describe('isSupportedCodexModel (opencode #47384, #47385 combined)')`):

- `gpt-5` → true (integer, at threshold)
- `gpt-5.0`, `gpt-5.1` → true (explicit minor at/above threshold)
- `gpt-6`, `gpt-6.3`, `gpt-7` → true (newer majors, integer + decimal shapes)
- `gpt-4`, `gpt-4.9`, `gpt-4o`, `gpt-3.5` → false (older majors regardless of minor)
- `o1-preview`, `claude-3-opus`, `anthropic--claude-3.7-sonnet`, `''`, `gpt-` → false (non-gpt or unparseable)
- `GPT-5`, `Gpt-5.1` → true (case-insensitive on the prefix)

**SAP AI Core compatibility**: Helper anchors on `^gpt-`. SAP AI Core Codex deployments returning ids in the form `gpt-4o`, `gpt-4.1`, `gpt-5`, `gpt-5-mini` (per `src/providers/sapOrchestration.ts` allow-list) will be classified correctly. The helper is **not** wired into any live enumeration path in this change — it is available for adoption by future filter code without disturbing the existing SAP model catalogue.

### 2. GitLab AI provider reasoning-variant transform (plan step 2, medium priority)

**What**: New module `src/providers/gitlab.ts` exposing `transformGitlabModel(model: RawGitlabModel): GitlabModel` plus supporting types.

**Why**: Upstream bumped `gitlab-ai-provider` 6.13.0 → 6.14.0 and added reasoning-variant handling to `packages/opencode/src/provider/transform.ts`. Alexi has no live GitLab consumer today (only GitLab CI templates in `src/ci/templates.ts`), so this ships as a forward-compatible transform helper without wiring it into `src/providers/index.ts` — matching the plan's "create/update if Alexi exposes GitLab provider" conditional while keeping the door open for future adoption.

**Shape**: Reasoning detection is OR of two signals — id substring `reasoning` OR a `"reasoning"` entry in the `capabilities` array. When detected, `reasoning: { enabled: true }` is emitted; otherwise the field is omitted. `sapDeploymentId` on the raw model passes through untouched to preserve SAP AI Core routing hints.

**Test cases** (8 in `describe('transformGitlabModel')`):

- id preserved verbatim
- reasoning detected via id substring
- reasoning detected via capabilities array
- reasoning absent when capabilities exclude it
- reasoning absent when capabilities is undefined and id has no marker
- `sapDeploymentId` preserved when present
- `sapDeploymentId` omitted when absent
- combined reasoning + `sapDeploymentId` on the same model

**SAP AI Core compatibility**: The transform is a pure function with no side effects and no wiring into `getProviderForModel`. Existing SAP AI Core / SapOrchestrationProvider dispatch is untouched. When/if GitLab is added as a routing target, the `sapDeploymentId` pass-through ensures SAP-routed GitLab-shaped ids still land on the correct deployment.

### 3. Version bump alignment (plan step 3, low priority — SKIPPED)

**Why skipped**: Plan explicitly says *"Only apply if Alexi mirrors upstream version numbers; otherwise skip."* Alexi's `package.json` is at `1.22.13` (independent versioning). No change.

### 4. Documentation / sync annotation (plan step 4, low priority)

**What**: Added `docs/upstream-sync/2026-09-06.md` with the full sync report (adopted / skipped tables, risks, file-touch inventory), plus a `[Unreleased] > Added` entry in `CHANGELOG.md` matching the existing detail-heavy style used for prior entries.

## Issues encountered

- None. Alexi already had `isGpt5_6OrLater` in `src/providers/openai/prompt-cache.ts` implementing the exact tuple-compare bug fix pattern for the cache-breakpoint threshold — I extended the module with a second constant-driven helper (`isSupportedCodexModel`, threshold 5.0) rather than refactoring the two into a shared parser, because they carry different semantic meanings (cache-breakpoint eligibility vs Codex eligibility) and future upstream drift on either threshold should be a single-file edit.
- Alexi has no live GitLab AI provider (only GitLab CI templates). The plan explicitly permitted creating the transform in that case, so the module ships without any router wiring. Adding GitLab to `src/providers/index.ts` later is a routing-only change and does not require re-touching `gitlab.ts`.
- No SAP AI Core integration was touched. All 60+ existing SAP-shaped model ids in `sapOrchestration.ts` and the SapOrchestrationProvider dispatch remain unchanged.
