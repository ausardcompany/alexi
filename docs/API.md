# Alexi API Documentation

This document provides comprehensive API documentation for Alexi's CLI commands, configuration options, and TypeScript interfaces.

## Table of Contents

- [CLI Commands](#cli-commands)
- [Agent Mode](#agent-mode)
- [Interactive Mode Commands](#interactive-mode-commands)
- [Environment Variables](#environment-variables)
- [TypeScript Interfaces](#typescript-interfaces)
- [Tool System](#tool-system)
- [Permission System](#permission-system)

## CLI Commands

> **Lazy-loaded command actions.** Every subcommand under `src/cli/commands/*.ts` is registered by a `register<Name>Command(program: Command): void` helper. The registration itself only records Commander metadata; the heavy runtime graph (TUI, orchestrator, agent loop, SAP AI SDK, git, repo map, permission bus) is imported dynamically inside the `.action(...)` closure so `alexi --help`, `alexi --version`, and unrelated subcommands do not pay for modules they never use. See [ARCHITECTURE.md — CLI Command Lazy-Loading (issue #1769)](ARCHITECTURE.md#cli-command-lazy-loading-issue-1769) for the per-file scope and the contract enforced by `tests/cli/lazyLoading.test.ts`.

### chat

Send messages to LLMs with optional auto-routing and session management.

```bash
alexi chat -m <message> [options]
```

#### Options

| Option | Type | Description |
|--------|------|-------------|
| `-m, --message <text>` | string | Message to send (required) |
| `--model <id>` | string | Override model selection (e.g., gpt-4o, anthropic--claude-4-sonnet) |
| `--auto-route` | boolean | Enable automatic model routing |
| `--prefer-cheap` | boolean | Prefer cheaper models when auto-routing |
| `--session <id>` | string | Continue existing session |
| `--system <prompt>` | string | System prompt for conversation |

#### Examples

```bash
# Use specific model
alexi chat -m "Hello" --model gpt-4o-mini

# Auto-route with cost optimization
alexi chat -m "What is AI?" --auto-route --prefer-cheap

# Continue conversation in session
alexi chat -m "Tell me more" --session abc-123 --auto-route
```

#### Inline model override (`@provider/model`, issue #1716)

Any user message containing a `@<provider>/<model>` mention switches the model for **that turn only** when the referenced id is present in the live-merged model catalog. This works for `chat`, `agent`, and streaming (`interactive`) alike, and is implemented in `src/core/inlineModelOverride.ts`.

```bash
# One-off switch to Claude Opus 4 for this turn only.
alexi chat -m "@anthropic/claude-opus-4 explain bubble sort"

# Session default remains unchanged. The next turn without a mention
# reverts to whatever the caller supplied (or the config default).
alexi chat -m "now write it in TypeScript" --session abc-123
```

Precedence: `--model` (explicit `modelOverride`) beats an inline `@provider/model` reference, which in turn beats `--auto-route` and the session default. When the inline candidate is unknown, a `[Inline Override] Model "<id>" not found in catalog, ignoring` warning is logged and the caller falls back to its normal model selection — a typo never silently reroutes traffic.

The pattern is case-insensitive (`@Anthropic/Claude-Opus-4` also matches) and the first mention in a message wins; subsequent mentions are ignored. Multimodal (array-payload) messages sent through `streamChat` are not parsed — a multimodal turn wanting a specific model must still use `--model`.

Programmatic API:

```typescript
import { extractInlineModelOverride, INLINE_MODEL_PATTERN } from './core/inlineModelOverride.js';

// Returns the candidate id when the message contains a match AND the id is
// present in the catalog. Returns undefined otherwise (never throws).
const model = extractInlineModelOverride('use @openai/gpt-4o please');
// -> 'openai/gpt-4o' when in catalog, undefined otherwise

// The underlying regex is exported for tooling that needs to detect
// mentions without validating them against the catalog.
INLINE_MODEL_PATTERN.test('@anthropic/claude-opus-4'); // true
```

When an inline reference is applied, `sendChat` / `streamChat` set `routingReason` on the result to `Inline override: @<model>` so telemetry, TUI status displays, and `session-export` can distinguish inline overrides from auto-router decisions and explicit `--model` flags. See [ARCHITECTURE.md — Inline Model Override](ARCHITECTURE.md#inline-model-override-providermodel) for the full precedence contract.

### agent

Run agentic chat with autonomous tool execution for automated workflows.

```bash
alexi agent -m <message> [options]
```

#### Options

| Option | Type | Description |
|--------|------|-------------|
| `-m, --message <text>` | string | Task message (required) |
| `--model <id>` | string | Override model selection |
| `--auto-route` | boolean | Enable automatic model routing |
| `--system <file>` | string | System prompt file path |
| `--max-iterations <n>` | number | Maximum tool execution iterations (default: 50) |
| `--workdir <dir>` | string | Working directory (default: cwd) |
| `--tools <list>` | string | Comma-separated list of enabled tools |
| `--effort <level>` | string | Effort level: low, medium, high, max |
| `--agent <id>` | string | Agent to use (code, debug, plan, explore) |
| `--auto` | boolean | Run in fully autonomous mode (no permission prompts) |
| `--yolo` | boolean | Grant every permission request without prompting AND auto-continue on `onConsecutiveMistakeLimitReached` (see "Headless permission handling" and "Mistake-limit user steering" below) |
| `--dangerously-skip-permissions` | boolean | Alias of `--yolo`; explicit opt-in for CI / non-interactive runs |
| `-q, --quiet` | boolean | Only output the final response; suppresses the interactive mistake-limit prompt (still writes a one-line explanation to stderr on trip) |

#### Examples

```bash
# Basic agentic task
alexi agent -m "Fix all TypeScript type errors in src/"

# With specific model and effort
alexi agent -m "Refactor the auth module" --model anthropic--claude-4-sonnet --effort high

# With limited tools
alexi agent -m "Analyze the codebase" --tools read,glob,grep

# Fully autonomous mode
alexi agent -m "Update all test files" --auto --max-iterations 30

# Using a specific agent
alexi agent -m "Debug the failing test" --agent debug
```

#### Behavior

In agent mode, Alexi:
1. Configures high-priority permission rules (priority 200) for write and execute
2. Enables external directory access
3. Loops: sends messages to LLM, executes tool calls, feeds results back
4. Detects context overflow and triggers reactive compaction
5. Executes lifecycle hooks (PreToolUse, PostToolUse, Stop)
6. Returns final response with iteration count and tool call summary

#### Headless permission handling (1.21.4)

The non-interactive `agent` command subscribes to `PermissionRequested` on the event bus and publishes a `PermissionResponse` for every request — `granted: true` when `--yolo` (or `--dangerously-skip-permissions`) was passed, `granted: false` otherwise. Without this, a `PermissionRequested` event from a subagent (spawned via the `task` tool) has no listener in headless mode and the agent loop hangs waiting for a response that never arrives. The subscription is unsubscribed on `process.exit` so it does not leak into subsequent invocations under tests. Reference: opencode `08faeb3`.

A `subagentSessionIds: Set<string>` is populated (currently empty — the `task` tool does not yet spawn distinct sessions, so the wiring is reserved for a future real-subagent implementation that will gate the auto-response on sessionId membership without a second refactor).

#### Mistake-limit user steering (issue #1692)

The `alexi agent` command wires the `agenticChat` loop's `onConsecutiveMistakeLimitReached` callback through `createMistakeLimitPrompt(...)` (`src/cli/utils/mistakeLimitPrompt.ts`). Previously, tripping the `LoopDetector` / `MistakeTracker` stopped the run with only the synthetic `[Loop Detector] Stopped ...` / `[Mistake Tracker] Stopped ...` assistant message — the user saw the agent "randomly stop" mid-task. The callback now applies this decision matrix in order:

| Mode | Trigger | Decision | stderr output |
|------|---------|----------|---------------|
| Yolo | `--yolo` or `--dangerously-skip-permissions` | `'continue'` (auto-recover) | `[mistake-limit] <explanation> Auto-continuing (--yolo).` (suppressed under `--quiet`) |
| Headless | `stdin.isTTY === false` or `stdout.isTTY === false` | `'stop'` | `[mistake-limit] <explanation> Stopping (non-interactive; re-run with --yolo to auto-continue).` |
| Quiet TTY | `--quiet` on an interactive terminal | `'stop'` | `[mistake-limit] <explanation> Stopping (quiet mode).` |
| Interactive TTY (default) | Real terminal, no `--yolo`, no `--quiet` | Prompt `Try a different approach? (y/n)` | See below |

Interactive answers:

- Any answer whose trimmed, lowercased first character is `y` (`y`, `yes`, `YES`, ` y `) → `'continue'`, stderr prints `Continuing with steering guidance.`
- Everything else including empty input (bare Enter), `n`, `quit`, or EOF → `'stop'`, stderr prints `Stopping run.`
- `AbortSignal` fires mid-prompt (Ctrl+C) → `'stop'` immediately, the `readline` handle is released.

The explanation string comes from the exported pure formatter `describeReason(reason: ConsecutiveMistakeReason): string`:

- `kind: 'loop'` → `The model has called the same tool ('<toolName>') <consecutiveCount> times in a row with identical arguments — likely stuck in a loop.`
- `kind: 'mistake'` → `<consecutiveCount> consecutive tool failures detected (last: '<toolName>') — the model may be flailing.`

Returning `'continue'` from the callback resets both detectors and injects a `<system-reminder>` preamble plus the guidance `The previous approach is stuck. Try a different method, simpler steps, or ask me for help.` as a user message before the next iteration (this injection is owned by `agenticChat`, not the CLI callback).

Programmatic use from custom CLI wrappers or third-party hosts:

```typescript
import { createMistakeLimitPrompt } from './cli/utils/mistakeLimitPrompt.js';
import type {
  MistakeLimitCallback,
  MistakeLimitPromptOptions,
} from './cli/utils/mistakeLimitPrompt.js';

const callback: MistakeLimitCallback = createMistakeLimitPrompt({
  yolo: false,
  quiet: false,
  signal: abortController.signal,
  // Optional injectable I/O — omit to use process.stdin / process.stdout / process.stderr
  // stdin, stdout, stderr, isTTY
});

await agenticChat(prompt, {
  onConsecutiveMistakeLimitReached: callback,
  // ...
});
```

`MistakeLimitPromptOptions` (`src/cli/utils/mistakeLimitPrompt.ts`):

```typescript
export interface MistakeLimitPromptOptions {
  yolo?: boolean;
  quiet?: boolean;
  signal?: AbortSignal;
  // Injectable I/O for tests / non-CLI hosts
  stdin?: NodeJS.ReadableStream & { isTTY?: boolean };
  stdout?: NodeJS.WritableStream & { isTTY?: boolean };
  stderr?: NodeJS.WritableStream;
  isTTY?: boolean;                  // overrides stdin.isTTY && stdout.isTTY
}
```

The CLI-side callback deliberately does NOT implement the steering-message injection itself — that concern stays in `agenticChat`. This keeps detection, steering-message content, and the "ask the user" surface in three separate layers so the TUI, HTTP server, and future editor hosts can each supply their own `MistakeLimitCallback` without duplicating any part of the detector or the steering payload.

### interactive / i

Start interactive REPL with streaming responses (launches the Ink-based TUI).

```bash
alexi interactive
alexi i
```

### models

List available models/deployments from SAP AI Core.

```bash
alexi models [options]
```

#### Options

| Option | Type | Description |
|--------|------|-------------|
| `-j, --json` | boolean | Output as JSON |
| `-s, --status <status>` | string | Filter by status (RUNNING, PENDING, STOPPED) |
| `--scenario <scenario>` | string | Filter by scenario ID |
| `-g, --resource-group <group>` | string | AI Core resource group |
| `--proxy` | boolean | Use proxy endpoint instead of direct API |

#### Examples

```bash
# List all deployments
alexi models

# Running models only, as JSON
alexi models --status RUNNING --json

# Specific resource group
alexi models --resource-group production
```

#### Error surfacing (issue #1824)

Since `1.22.29`, both the AI Core path and the `--proxy` path route
their fetch through `fetchWithRetry` (`src/providers/modelFetchErrors.ts`)
so operator-facing errors are classified rather than raw:

- **Permanent failures** (`400`, `401`, `403`, `404`, `422`) fail fast on
  the first attempt with an actionable reason. Example:

  ```
  Error: Failed to fetch models: unauthorized (401) — check AICORE_SERVICE_KEY / credentials
  ```

  Exit code `1`. The proxy path surfaces the same message but points at
  `SAP_PROXY_API_KEY` instead.

- **Transient failures** (`429`, `500`, `502`, `503`, `504`, network
  errors like `ECONNRESET` / `ETIMEDOUT`) are retried up to three times
  with capped exponential backoff (`1s -> 2s -> 4s`, capped at `8s`).
  Every retry logs to stderr so callers piping stdout to `jq` are
  unaffected:

  ```
  Retry 1: HTTP 503 — retrying with backoff
  Retry 2: HTTP 503 — retrying with backoff
  ```

  If the retry budget is exhausted, the last classification is
  preserved in the thrown `ModelFetchError` and rendered as the exit
  message.

Full contract (classification precedence, retry policy, reason templates)
in [`docs/PROVIDERS.md#model-fetch-error-surfacing-issue-1824`](./PROVIDERS.md#model-fetch-error-surfacing-issue-1824).

#### Dynamic model catalog

Since v1.22.4, the interactive TUI and the `/model` slash command consult a **live catalog** maintained by `src/providers/modelCatalog.ts`. The catalog is refreshed at startup and every 5 minutes; live models show a `●` prefix in the picker, static-only models show `○`. The status bar shows `● N live`, `⟳` (loading), or `○ offline` depending on the catalog state. Set `AICORE_SERVICE_KEY` and `AICORE_RESOURCE_GROUP` for the catalog to succeed; without credentials it falls back silently to the static list embedded in `ORCHESTRATION_MODELS`.

Programmatic access:

```typescript
import {
  getAvailableModels,
  getLiveModels,
  getCatalogStatus,
  isAvailableModel,
} from 'alexi/providers/modelCatalog.js';

if (getCatalogStatus() === 'ready') {
  console.log('Live deployments:', getLiveModels());
}
if (!isAvailableModel(userInput)) {
  throw new Error(`Model not available: ${userInput}`);
}
```

### explain

Analyze and explain routing decisions without executing the request.

```bash
alexi explain -m <message>
```

#### Example Output

```
=== Prompt Analysis ===
Type: deep-reasoning
Complexity: complex
Requires Reasoning: true
Estimated Tokens: 19

=== Matched Rules ===
 reasoning-for-math (priority: 80): Use reasoning models for math problems

=== Model Candidates (by score) ===
 gpt-4.1              Score: 120 - expensive tier, strong at deep-reasoning, has reasoning
  claude-4-sonnet      Score: 120 - expensive tier, strong at deep-reasoning, has reasoning

=== Selected Model ===
Model: gpt-4.1
Reason: Task type: deep-reasoning, Complexity: complex, requires reasoning
Confidence: 100%
Rule Applied: reasoning-for-math
```

### sessions

List all saved sessions.

```bash
alexi sessions
alexi sessions --json
alexi sessions --here
alexi sessions --workdir /path/to/project
alexi sessions --search "api refactor"
```

| Option | Type | Description |
|--------|------|-------------|
| `--json` | flag | Emit a stable JSON array (`{ id, title, model, updatedAt, messageCount, totalTokens, workdir }`) for scripting |
| `--here` | flag | Only list sessions created in the current working directory |
| `--workdir <dir>` | string | Only list sessions created in the specified directory |
| `--all` | flag | Default behaviour (explicit no-filter form) |
| `--search <query>` | string | FTS5-ranked search across session titles (e.g. `"api refactor"`, `"openai OR anthropic"`, `"auth*"`) |
| `--cleanup` | flag | Run the session retention sweep now (deletes sessions older than `retention.maxAgeDays`; ignores listing flags) |

`--here` and `--workdir` are mutually exclusive and the command exits with `Error: --here and --workdir are mutually exclusive` when both are supplied.

**Graceful degradation on scoping errors.** When the scoping/filter path fails — for example the SQLite FTS index is missing, or a workdir stat error is raised inside `sessionManager.listSessions(filter)` / `sessionManager.searchSessions(query, filter)` — the command no longer crashes. It logs `Warning: scoped session listing failed (<err>); falling back to all sessions` to stderr and re-issues an unfiltered `sessionManager.listSessions()` so the user still gets a usable listing across multi-project workspaces. This ports upstream opencode `627501673 fix(cli): list sessions across all projects instead of crashing`. The `--json` output shape is preserved on the fallback path.

**`--cleanup` retention sweep.** When `--cleanup` is passed, all listing flags are ignored — the command dispatches straight to `SessionManager.cleanupExpiredSessions()` (`src/core/sessionManager.ts:828`), which reads the machine-wide policy from `~/.alexi/config.json`:

```json
{
  "retention": {
    "enabled": true,
    "maxAgeDays": 30
  }
}
```

When `retention.enabled` is `false` (the default), the sweep is a no-op and prints `Deleted 0 expired sessions, skipped 0 active/recent sessions.`. When enabled, expired sessions (age > `maxAgeDays`) are deleted subject to two safety guards: a session with an active run tracked by `SessionManager.hasActiveRun` is skipped, and a session whose most recent message timestamp is within the last hour is skipped. Expired children of expired parents (matched by `metadata.parentSessionId`) cascade in the same sweep. The command exits with code `1` when per-session I/O errors are reported; otherwise `0`. Output shape:

```text
Deleted 3 expired sessions, skipped 1 active/recent sessions.
```

or with errors:

```text
Deleted 2 expired sessions, skipped 0 active/recent sessions, 1 errors.
Failed to delete session <id>: EACCES: permission denied
```

The retention scheduler in `src/core/retentionScheduler.ts:88` also runs an automatic sweep at most once every 24 hours on CLI startup (state persisted to `~/.alexi/last-retention-run`). Use `--cleanup` to force a sweep now (for example, before rebuilding the FTS index or running a diagnostic pass) — the 24h cooldown does not gate the flag.

### session-export

Export a session to markdown format.

```bash
alexi session-export -s <session-id> [-o output.md]
```

| Option | Type | Description |
|--------|------|-------------|
| `-s, --session <id>` | string | Session ID to export (required) |
| `-o, --output <file>` | string | Output file path (default: stdout) |

### session-delete

Delete a session.

```bash
alexi session-delete -s <session-id>
```

### context

Show current project context information.

```bash
alexi context
```

### context-init

Initialize project context configuration.

```bash
alexi context-init
```

### context-add-invariant

Add an architecture invariant to the project context.

```bash
alexi context-add-invariant "All LLM calls must go through SAP AI Core"
```

### stages

List available conversation stages.

```bash
alexi stages
```

### stage-set

Set the current development stage.

```bash
alexi stage-set <stage-name>
```

### notes-generate

Generate AI_NOTES.md for the current development stage.

```bash
alexi notes-generate
```

### dod-check

Run Definition of Done checks for the current project.

```bash
alexi dod-check
```

### dod-list

List all available Definition of Done checks.

```bash
alexi dod-list
```

### reload

Refresh runtime state for the current project (routing config, user config, skills, and any other subsystem registered via `registerRefresher`) without restarting the CLI. Registered by `src/cli/commands/reload.ts`.

```bash
alexi reload
```

The command has no options today — that mirrors the upstream `/reload` shape and keeps the surface area minimal. Output is rendered by `formatReloadResult`:

```text
  ✓ routing-config
  ✓ user-config
  ⏭  skills — skipped: in-flight request

Reload complete: 2 ok, 0 failed, 1 skipped (42ms).
```

Exit codes:

- `0` — all subsystems either succeeded or were skipped because they had an in-flight request.
- `1` — at least one subsystem reported a non-skip failure (its `ok` is `false` AND `skipped` is not `true`).

An in-flight skip is NOT an error — a reload attempted during an active completion is a valid outcome, and the CLI intentionally does not fail the exit code for that case.

#### Programmatic API

```typescript
import {
  registerRefresher,
  registerDefaultRefreshers,
  executeReload,
  formatReloadResult,
  IN_FLIGHT_MARKER,
  registeredSubsystems,
  type ReloadOutcome,
  type ReloadResult,
  type Refresher,
} from './cli/commands/reload.js';

// Bootstrap the built-in targets (routing-config, user-config, skills).
// Idempotent — safe to call from multiple bootstrap paths.
registerDefaultRefreshers();

// Plug an extra subsystem into the reload pass. Later calls with the
// same name overwrite the earlier function reference.
registerRefresher('my-plugin', async () => {
  // Throw with the IN_FLIGHT_MARKER prefix to signal "skip, don't fail":
  if (pluginBusy) {
    throw new Error(`${IN_FLIGHT_MARKER} one request in flight`);
  }
  await reloadMyPluginState();
});

const result: ReloadResult = await executeReload();
console.log(formatReloadResult(result));
console.log('registered:', registeredSubsystems());

interface ReloadOutcome {
  subsystem: string;
  ok: boolean;
  reason?: string;    // populated on failure or skip
  skipped?: boolean;  // true when the refresher threw an IN_FLIGHT_MARKER error
}

interface ReloadResult {
  outcomes: ReloadOutcome[];
  elapsedMs: number;
}

type Refresher = () => Promise<void>;
```

See [ARCHITECTURE.md — `/reload` Command Primitive](ARCHITECTURE.md#reload-command-primitive-srcclicommandsreloadts) for the design contract.

### code-review

Run a structured correctness-bug review over the current `git diff`. The command reuses the
`code-review` skill prompt and is implemented in `src/command/codeReview.ts` (`executeCodeReview`).
By default it reviews uncommitted changes (`git diff HEAD`); pass `--base <branch>` to compare
against a base branch instead (`git diff <base>...HEAD`).

```bash
alexi code-review [options]
```

#### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `--effort <level>` | `low` \| `medium` \| `high` | `medium` | Review effort. Controls prompt verbosity and model routing. |
| `--base <branch>` | string | _(uncommitted)_ | Compare against this base branch instead of `HEAD`. |
| `--model <id>` | string | _(routed by effort)_ | Override the model used for the review. Takes precedence over effort-based routing. |
| `--workdir <path>` | string | `process.cwd()` | Working directory for the `git diff` invocation. |
| `--fix` | boolean | `false` | Apply `MUST FIX` findings as edits via the agentic loop after the review completes. |
| `--fix-max <n>` | integer | `10` | Maximum findings to auto-apply when `--fix` is set. |
| `--comment` | boolean | `false` | Post findings to the current GitHub PR via `gh api`. **GitHub-only**: on GitLab or Bitbucket remotes the flag is skipped and a stderr warning is emitted (see [VCS-aware output](#vcs-aware-output) below). |
| `--comment-dry-run` | boolean | `false` | Print the planned `gh api` invocations without executing them. Useful for previewing PR comments before an actual post. |

#### VCS-aware output

`src/cli/commands/codeReview.ts` runs a best-effort `git remote -v` detection at the top of the command (`detectVCSProvider` from `src/git/remoteDetection.ts`) and adjusts two things when the current remote is GitLab or Bitbucket instead of GitHub:

1. **Terminology.** The final summary line uses `MR` on GitLab remotes and `PR` on GitHub / Bitbucket, so the wording matches the destination host:

   ```text
   [code-review] MR comments: 3 posted, 0 skipped     # GitLab
   [code-review] PR comments: 3 posted, 0 skipped     # GitHub / Bitbucket
   ```

2. **`--comment` gating.** `--comment` posts via `gh api`, which only speaks the GitHub REST API. On a non-GitHub remote the flag is suppressed with a stderr message and, when a CI environment variable carries the MR/PR number, the equivalent URL is printed so operators can navigate manually:

   ```text
   [code-review] --comment is GitHub-only; skipping MR comment posting for gitlab remote
   [code-review] detected MR: https://gitlab.com/<org>/<repo>/-/merge_requests/42
   ```

   MR/PR number lookup order (first match wins): `ALEXI_MR_NUMBER`, `ALEXI_PR_NUMBER`, then (per provider) `CI_MERGE_REQUEST_IID` (GitLab CI) or `BITBUCKET_PR_ID` (Bitbucket Pipelines). Non-integer or non-positive values are ignored — the skip warning still fires without a URL.

Detection is intentionally best-effort: a missing `git` binary, a non-zero `git remote -v` exit code, an unparseable output, or a remote pointing at a host other than `github.com` / `gitlab.com` / `bitbucket.org` (including self-hosted GitLab / Bitbucket) all resolve to `null`. In that case the noun defaults to `PR` and `--comment` is left untouched, preserving the pre-change GitHub-only behaviour.

The shared VCS helpers live under `src/git/` and are also usable programmatically:

```typescript
import { detectVCSProvider, type VCSRemote } from './src/git/remoteDetection.js';
import { formatMRPRUrl, requestNoun } from './src/git/urlFormatter.js';

const remote: VCSRemote | null = await detectVCSProvider(process.cwd());
if (remote) {
  const url = formatMRPRUrl({
    provider: remote.provider,   // 'github' | 'gitlab' | 'bitbucket'
    org: remote.org,
    repo: remote.repo,
    number: 42,
  });
  console.log(`${requestNoun(remote.provider)}: ${url}`);
}
```

Format shapes:

| Provider | URL template |
|----------|--------------|
| `github` | `https://github.com/<org>/<repo>/pull/<n>` |
| `gitlab` | `https://gitlab.com/<org>/<repo>/-/merge_requests/<n>` |
| `bitbucket` | `https://bitbucket.org/<org>/<repo>/pull-requests/<n>` |

`formatMRPRUrl` throws on an invalid `number` (non-integer or `<= 0`) or an empty `org` / `repo`, and uses a `never`-typed exhaustiveness guard to reject unknown providers at type-check time.

#### Examples

```bash
# Review uncommitted changes at medium effort
alexi code-review

# High-effort review (prefers a reasoning model)
alexi code-review --effort high

# Compare against main branch
alexi code-review --base main

# Override model and effort
alexi code-review --effort low --model anthropic--claude-4-sonnet

# Run against a different working directory
alexi code-review --workdir /path/to/repo
```

#### Output

The review is written to `stdout`. Progress messages and a final summary line
(`effort`, `diff` size in bytes, total tokens, elapsed seconds) are written to `stderr`,
making it safe to redirect the review to a file:

```bash
alexi code-review --effort high > review.md
```

If the diff is empty the command exits successfully with `No changes to review.` and does
not invoke the LLM.

#### Effort-based model routing

`pickModelForEffort` in `src/command/codeReview.ts` selects the model when `--model` is not set:

| Effort | Strategy |
|--------|----------|
| `high` | Prefer a model where `reasoning === true` AND `costTier === 'expensive'`; fall back to any `expensive` model; otherwise `getDefaultModel()`. |
| `medium` | Use `getDefaultModel()` directly. |
| `low` | Prefer a model where `costTier === 'cheap'`; otherwise `getDefaultModel()`. |

The candidate set is the enabled-model list from `loadRoutingConfig()`
(`src/config/routingConfig.ts`).

#### Structured output contract

`result.review` obeys the shape mandated by the `code-review` skill prompt
(`src/skill/skills/index.ts`):

- Exactly three level-3 headers, in this order, always emitted (with empty
  bodies when a category has no findings): `### MUST FIX`, `### SHOULD IMPROVE`,
  `### NICE TO HAVE`.
- Every finding starts with a backticked `path/to/file.ext:LINE` reference (or
  `path/to/file.ext` when no specific line applies), followed by an imperative
  summary. `MUST FIX` and `SHOULD IMPROVE` findings carry an indented
  `- Fix: ...` sub-bullet with a concrete remediation.
- When there are no findings anywhere, the review is a single `_No issues found._`
  line above the three empty headers.

This shape is designed for downstream parsers (PR comment renderers, DoD
checkers) — a passing review is distinguishable from a silently-failed review
by looking for the three headers, and each finding is individually
tool-friendly. Empty-diff runs bypass this contract entirely and return
`No changes to review.` verbatim (see the fast path in
`src/command/codeReview.ts`).

#### Programmatic API

`executeCodeReview` can also be called directly from TypeScript:

```typescript
import { executeCodeReview } from './src/command/codeReview.js';

const result = await executeCodeReview({
  effort: 'high',
  target: { base: 'main' },          // or 'uncommitted'
  workdir: process.cwd(),
  modelOverride: undefined,
  signal: abortController.signal,    // optional cancellation
  onProgress: (msg) => console.log(msg),
});

console.log(result.review);
console.log(`tokens=${result.totalTokens} elapsedMs=${result.elapsedMs}`);
```

The relevant TypeScript types:

```typescript
export type CodeReviewEffort = 'low' | 'medium' | 'high';
export type CodeReviewTarget = 'uncommitted' | { base: string };

export interface CodeReviewOptions {
  effort?: CodeReviewEffort;          // default: 'medium'
  target?: CodeReviewTarget;          // default: 'uncommitted'
  workdir?: string;                   // default: process.cwd()
  modelOverride?: string;
  signal?: AbortSignal;
  onProgress?: (msg: string) => void;
}

export interface CodeReviewResult {
  success: boolean;
  diffBytes: number;
  effort: CodeReviewEffort;
  review: string;                     // structured review or 'No changes to review.'
  modelUsed: string;                  // empty for the empty-diff path
  totalTokens: number;
  elapsedMs: number;
}
```

## Agent Mode

> **Build status (2026-07-24):** the `--agent <id>` option and the agent-registry surface it depends on are currently unbuildable because the 2026-07-24 upstream sync (commit `530351f4`) overwrote `src/agent/index.ts` with a 3-line broken import stub. The `alexi agent` command itself still exists in `src/cli/commands/agent.ts`, but the `agentId` option cannot be resolved to a system prompt or tool allowlist until autohealing reverts `src/agent/index.ts` to its pre-sync content (parent commit `9f9fad90`). See [CHANGELOG](../CHANGELOG.md) `### Removed` and [docs/ARCHITECTURE.md#agent-system](ARCHITECTURE.md#agent-system) for the full recovery specification.
>
> **Build status (2026-07-26 addendum):** the 2026-07-26 sync (commit `0985297e`, version bump `1.18.11` → `1.18.12`) did not touch `src/agent/index.ts` and did not add or remove any user-facing CLI subcommand. Four orphan stubs were added (`src/agent/instance-advertisement.ts`, `src/cli/remote.ts`, `src/context/global-sync/bootstrap.ts`, `src/context/server-session-reducer.ts`) and none of them appear on the [CLI Commands](#cli-commands) reference. In particular, `alexi remote` is **not** a real subcommand — the presence of `src/cli/remote.ts` on disk is upstream noise, not a hidden or experimental API. The complete, canonical CLI surface is the set of commands documented in this file plus the interactive slash commands in [Interactive Mode Commands](#interactive-mode-commands); nothing added by the 2026-07-26 sync is reachable from `alexi --help` because none of the stubs is registered with the Commander.js program in `src/cli/program.ts`.

The `alexi agent` command provides fully autonomous task execution with tool access.

### Architecture

```typescript
interface AgenticChatOptions {
  modelOverride?: string;
  autoRoute?: boolean;
  preferCheap?: boolean;
  sessionManager?: SessionManager;
  systemPrompt?: string;
  maxIterations?: number;          // Default: 50
  workdir?: string;                // Default: process.cwd()
  enabledTools?: string[];         // Default: all registered tools
  onProgress?: (event: AgenticProgressEvent) => void;
  signal?: AbortSignal;
  gitManager?: AutoCommitManager;
  repoMapManager?: RepoMapManager;
  effort?: EffortLevel;            // low | medium | high | max
  agentId?: string;                // Agent to use
  // Loop / mistake steering (issue #1692)
  onConsecutiveMistakeLimitReached?: (
    reason: ConsecutiveMistakeReason
  ) => 'continue' | 'stop' | Promise<'continue' | 'stop'>;
  loopLimit?: number;              // Default: 5 (identical tool calls)
  mistakeLimit?: number;           // Default: 6 (consecutive tool failures)
}

interface ConsecutiveMistakeReason {
  kind: 'loop' | 'mistake';
  consecutiveCount: number;
  toolName: string;                // Tripping tool (loop) or most recent failing tool (mistake)
}
```

### Loop and Mistake Steering

When the agent gets stuck (repeats the same tool call, or emits a rapid burst of failures) the loop invokes `onConsecutiveMistakeLimitReached` if supplied. The callback decides whether to stop the run or inject a steering message and continue:

```typescript
import { agenticChat } from './core/agenticChat.js';
import type { ConsecutiveMistakeReason } from './core/agenticChat.js';

const result = await agenticChat('refactor the auth module', {
  maxIterations: 50,
  loopLimit: 5,          // trip after 5 identical tool calls (default)
  mistakeLimit: 6,       // trip after 6 consecutive failures (default)
  onConsecutiveMistakeLimitReached: async (reason: ConsecutiveMistakeReason) => {
    if (reason.kind === 'loop') {
      // Same tool called with same args N times in a row.
      return 'continue'; // inject steering, let the model try a different approach
    }
    // reason.kind === 'mistake' — N consecutive tool failures.
    return 'stop';       // give up; caller should surface the failure to the user
  },
});
```

Semantics:

- Omit the callback to get the default behaviour: on trip, stop with a synthetic `[Loop Detector] Stopped after N identical calls to '<tool>'.` or `[Mistake Tracker] Stopped after N consecutive tool failures.` assistant message.
- Returning `'continue'` resets both detectors and appends a `<system-reminder>` preamble plus the guidance `The previous approach is stuck. Try a different method, simpler steps, or ask me for help.` as a user message before the next iteration.
- A throwing callback is treated as `'stop'` and logged via `logger.warn`. The run does not crash.
- `loopLimit` and `mistakeLimit` constructors reject non-integer or `< 2` values (`limit must be an integer >= 2`).
- The `question` tool is excluded from loop fingerprinting so repeated user prompts do not trip the detector.

`ConsecutiveMistakeReason` is also re-exported from `src/core/orchestrator.ts` and `src/core/streamingOrchestrator.ts` for consumers that dispatch through `sendChat` / `streamChat` and later fan out to `agenticChat`.

### Turn-Level Retry (issue #1737)

The agent loop wraps each `provider.complete` call in `retryProviderCall`
(exported from `src/agent/index.ts`) so a transient `429` / `5xx` /
network blip that lands *before any content is emitted* no longer
aborts the whole agent run. The wrapper composes with the provider-layer
`ErrorBackoff` — it does not duplicate its budget.

Defaults: 3 attempts total (initial + 2 retries), exponential backoff
`1 s → 2 s → 4 s`, capped at 15 s. A server-supplied `Retry-After` hint
takes precedence over the default schedule (still capped at 15 s).

Contract:

- **Transient only.** `isRetryableError(err)` (from
  `src/core/error-backoff.ts`) is the single classifier. HTTP `401`,
  `400`, `model_not_found`, config failures, and named auth errors
  (`NoRefreshTokenError`) throw immediately with no sleep.
- **Streaming guard.** When a `StreamingStateTracker` is passed and it
  reports `hasEmittedContent() === true`, the wrapper rethrows without
  retrying — a replayed request would produce duplicate deltas.
- **Original error preserved.** After the last attempt the underlying
  provider error is rethrown unchanged so route classification,
  compaction recovery, and the REPL auth-rewrite path still see the real
  cause.

TypeScript surface (all exported from `src/agent/index.ts`):

```typescript
interface TurnRetryConfig {
  maxRetries: number;     // default 3
  initialDelayMs: number; // default 1000
  maxDelayMs: number;     // default 15_000
  multiplier: number;     // default 2
}

interface StreamingStateTracker {
  hasEmittedContent(): boolean;
}

function computeRetryDelay(
  attemptNumber: number,
  err: unknown,
  config?: TurnRetryConfig
): number;

function setTurnRetrySleep(fn?: (ms: number) => Promise<void>): void;

function retryProviderCall<T>(
  providerCallFn: () => Promise<T>,
  streamState?: StreamingStateTracker,
  config?: Partial<TurnRetryConfig>
): Promise<T>;
```

Example — the pattern used by `agenticChat` today
(`src/core/agenticChat.ts:673`):

```typescript
import { retryProviderCall, stripInternalOptions } from '../agent/index.js';

result = await retryProviderCall(() =>
  provider.complete(messages, stripInternalOptions(merged))
);
```

The same wrapper is used for the post-compaction re-drive so a transient
outage that lands during the compaction window does not turn an
otherwise recoverable overflow into a hard failure.

`setTurnRetrySleep(fn?)` is a test hook — production code never touches
it. See [Testing → Turn-level retry](TESTING.md#testing-the-turn-level-retry-wrapper)
for the assertion pattern.

### Progress Events

The agent emits progress events during execution:

```typescript
interface AgenticProgressEvent {
  type: 'llm_call' | 'tool_start' | 'tool_end' | 'iteration' | 'complete';
  iteration?: number;
  toolName?: string;
  toolId?: string;
  result?: ToolResult;
  message?: string;
}
```

### Result

```typescript
interface AgenticChatResult {
  text: string;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  modelUsed: string;
  routingReason?: string;
  iterations: number;
  toolCallsExecuted: number;
  toolCallSummary: Array<{
    name: string;
    success: boolean;
    error?: string;
  }>;
}
```

### Effort Levels

| Level | Max Tokens | Behavior |
|-------|-----------|----------|
| `low` | Reduced | Quick responses, fewer iterations |
| `medium` | Standard | Balanced quality/speed |
| `high` | Increased | More thorough, more iterations |
| `max` | Maximum | Best quality, full iteration budget |

## Interactive Mode Commands

The Ink-based TUI provides slash commands for managing sessions, configuration, and interactions.

### General Commands

| Command | Aliases | Description |
|---------|---------|-------------|
| `/help` | `/h` | Show help message with all available commands |
| `/exit` | `/quit`, `/q` | Exit the interactive REPL |
| `/clear` | | Clear the terminal screen |
| `/agent` | | Switch to a different agent (code, debug, plan, explore) |
| `/stage` | | Switch development stage |
| `/dod` | | Run Definition of Done checks |
| `/map` | | Show repository map |
| `/map-refresh` | | Rebuild repository map from scratch |
| `/map-tokens` | | Set token budget for repository map |
| `/code-review` | | Review uncommitted changes for correctness bugs (see below) |

### Model Management

| Command | Description | Example |
|---------|-------------|---------|
| `/model <model-id>` | Switch model and save as default | `/model gpt-4o` |
| `/models` | Open interactive model picker | `/models` |
| `/autoroute` | Toggle automatic model routing | `/autoroute` |

Persistence semantics: `/model <id>` and the `/models` interactive picker record the choice through `userExplicitPreference(modelID, providerID, reasoningEffort?)` (`src/core/modelPreference.ts`) so `SessionModelPreference.source` is set to `'user-explicit'`. The `resolveSessionModelPreference` reconciler then protects the choice against any subsequent non-explicit update — a config reload, an `AICORE_MODEL` change, or an implicit routing default cannot silently overwrite the user's selection on the next turn. Only another explicit action (`/model`, `--model`, or the TUI picker) may overwrite. `/effort <level>` is intentionally the **only** non-explicit update that may modify a protected preference: it sets `reasoningEffort` without swapping the model or provider, so a user typing `/effort high` mid-session does not have to re-pick their model. See `docs/ARCHITECTURE.md` under **Session Model Preferences** for the full contract, provenance model (`'user-explicit' | 'default' | 'inherited'`), and rule table.

### Session Commands

| Command | Description |
|---------|-------------|
| `/session` | Show current session information |
| `/sessions` | List all saved sessions |
| `/history` | Show conversation history |
| `/tokens` | Show token usage statistics |
| `/compact` | Trigger manual context compaction |
| `/rewind` | Rewind conversation to a specific turn or summarize up to a point |
| `/context` | Show context usage |
| `/status` | Show current status |
| `/fork [name]` | Fork current session; the fork becomes the active session (subsequent messages land in the fork, matching `git checkout -b`). Optional `name` sets the fork title (defaults to `fork-<timestamp>`). |
| `/rename` | Rename current session |
| `/clear-history` | Clear conversation history |
| `/cost` | Show cost summary |
| `/stats` | Show usage statistics |

### Conversation Rewind

| Command | Description | Example |
|---------|-------------|---------|
| `/rewind` | List all turn boundaries | `/rewind` |
| `/rewind <N>` | Discard messages after turn N | `/rewind 3` |
| `/rewind <N> --summarize` | Summarize messages before turn N | `/rewind 3 --summarize` |

The `/rewind` command operates on conversation turns, where each turn starts at a user message. Modes:

- **List mode** (no arguments): Shows all turn boundaries with previews
- **Discard mode** (turn number only): Removes all messages after the specified turn
- **Summarize mode** (`--summarize` flag): Compresses messages before the specified turn into a summary system message while keeping recent messages intact

```typescript
interface RewindResult {
  success: boolean;
  mode: 'discard' | 'summarize' | 'list';
  messages?: Message[];
  turnBoundaries?: TurnBoundary[];
  error?: string;
  discardedCount?: number;
  summarizedCount?: number;
}
```

### Code Review

| Command | Description | Example |
|---------|-------------|---------|
| `/code-review` | Review uncommitted changes at medium effort | `/code-review` |
| `/code-review <effort>` | Review uncommitted changes at the given effort level | `/code-review high` |

The slash command is wired in two places that share the same `executeCodeReview` core:

- **Legacy interactive REPL** (`src/cli/interactive.ts`): supports cancellation via Ctrl+C through a
  dedicated `AbortController`. Progress and summary lines are printed to the terminal.
- **Ink-based TUI** (`src/cli/tui/hooks/useCommands.ts`): the review and summary are surfaced as
  system messages via `addSystemMessage`.

Both surfaces only review uncommitted changes (`git diff HEAD`). Use the non-interactive
`alexi code-review --base <branch>` form to compare against a base branch.

Unknown effort values fall back to `medium` with a warning. Effort routing matches the CLI:
`high` prefers a reasoning + expensive-tier model, `low` prefers a cheap-tier model, and
`medium` uses `getDefaultModel()`.

### Data Export/Import

| Command | Description | Example |
|---------|-------------|---------|
| `/export [file]` | Export session data to file | `/export ~/backup.json` |
| `/import <file>` | Import data from file | `/import session.json` |

The `/export` command uses the `DataExporter` service to serialize session data to JSON. If no path is provided, it defaults to `~/.alexi/export-<timestamp>.json`.

### Memory Management

| Command | Description |
|---------|-------------|
| `/memory` | List all instruction files |
| `/memory edit project` | Edit project AGENTS.md |
| `/memory edit user` | Edit user ~/.alexi/ALEXI.md |
| `/memory init` | Create AGENTS.md from template |

### Configuration Commands

| Command | Description |
|---------|-------------|
| `/config show` | Show current configuration |
| `/config set <key> <value>` | Set configuration value |
| `/config path` | Show configuration file paths |
| `/permissions` | List/reset permission rules |
| `/mcp` | Manage MCP servers |
| `/think` | Toggle extended thinking mode |
| `/effort <level>` | Set effort level (low/medium/high/max) |
| `/doctor` | Run environment health checks |
| `/theme` | Switch dark/light theme |

### Git Commands

| Command | Description |
|---------|-------------|
| `/diff` | Show files changed in current session |
| `/undo` | Undo last file change |
| `/redo` | Redo last undone change |
| `/commit` | Force commit pending changes |
| `/git <command>` | Run a git command |
| `/git-log` | Show recent AI commits |

### Autocomplete Support

The TUI provides Tab completion for:
- **Slash commands**: Type `/` and press Tab to see suggestions
- **Model names**: After `/model `, Tab completes against the **live catalog** (`src/providers/modelCatalog.ts`) when it has loaded, falling back to `ORCHESTRATION_MODELS` while the first refresh is still in flight. Autocomplete never blocks on network I/O.
- **File paths**: After `/export ` or `/import `, Tab completes paths

### File mentions (`@` references)

Since v1.22.4, `@`-file mentions in user messages, custom command templates, and any other input that flows through `parseFileMentions()` support **three forms** (`src/utils/file-mention.ts:parseFileMentions`):

| Form | Example | Notes |
|------|---------|-------|
| Bareword | `@src/foo.ts` | Terminated by whitespace; historical behaviour |
| Double-quoted | `@"My Documents/report.txt"` | Allows spaces and shell-special characters |
| Single-quoted | `@'draft (2)/notes.md'` | Same, with single quotes as the delimiter |

Escape sequences inside quoted forms: `\"`, `\'`, `\\`. Mentions preceded by another `@` (email-address heuristic — `user@host@domain`) or by a word character are NOT matched.

Custom command templates additionally support **positional file references** — `@$1`, `@$2`, ... — which resolve to the corresponding argument. If the resolved path contains whitespace or shell-special characters, the template processor now wraps it in double quotes so the subsequent mention parser treats the whole path as a single token (fixes issue #1547).

```markdown
# .kilo/command/review.md
Review the changes in @$1 and summarize.
```

```bash
# Both work, even with a path containing spaces
/review src/tool/tools/read.ts
/review "docs/user guide.md"
```

## Environment Variables

### Required

| Variable | Description |
|----------|-------------|
| `AICORE_SERVICE_KEY` | SAP AI Core service key (JSON format) |

### Optional

| Variable | Default | Description |
|----------|---------|-------------|
| `AICORE_RESOURCE_GROUP` | `"default"` | SAP AI Core resource group |
| `AICORE_MODEL` | `"gpt-4o"` | Default model when none specified |
| `ALEXI_MAX_IMAGE_SIZE_MB` | `20` | Maximum image attachment size (MB) |
| `SAP_PROXY_BASE_URL` | -- | OpenAI-compatible proxy endpoint URL |
| `SAP_PROXY_API_KEY` | -- | Proxy endpoint API key |
| `MORPH_API_KEY` | -- | WarpGrep (`@morphllm/morphsdk`) semantic search API key. Consumed by the `alexi-mcp-warpgrep` MCP server (see [`docs/mcp-servers.md`](./mcp-servers.md)); Alexi's built-in tool surface no longer reads it. |
| `ALEXI_EXPERIMENTAL_BACKGROUND_TASKS` | -- | Enable background task execution |
| `KILO_DISABLE_EXTERNAL_SKILLS` | `false` | When set to `true` or `1` (case-insensitive), disables loading of external skills. Evaluated once at module load time via `src/core/flag.ts`. |
| `ALEXI_OTEL_TRACES_EXPORTER` | -- | Enable OTLP tracing relay for provider calls. One of `grpc`, `http/json`, `http/protobuf`. Any other value keeps tracing disabled. See [`docs/PROVIDERS.md#otlp-tracing-relay-observability`](PROVIDERS.md#otlp-tracing-relay-observability). |
| `ALEXI_OTEL_EXPORTER_OTLP_ENDPOINT` | `http://localhost:4317` (grpc) / `http://localhost:4318` (http) | OTLP collector endpoint URL. |
| `ALEXI_OTEL_SERVICE_NAME` | `alexi` | `service.name` resource attribute on every emitted span. |
| `ALEXI_TRACE_SAMPLE_PERCENT` | `0` | Session-level sampling percentage `[0, 100]`. Deterministic per `sessionId` via FNV-1a. |
| `ALEXI_TRACE_RECORD_CONTENT` | -- | When exactly `true`, attach the (truncated, 8 KiB max) assistant response as `gen_ai.response.content`. Any other value keeps content off. |

### AICORE_SERVICE_KEY Format

```json
{
  "clientid": "your-client-id",
  "clientsecret": "your-client-secret",
  "url": "https://your-auth-url",
  "serviceurls": {
    "AI_API_URL": "https://your-ai-api-url"
  }
}
```

## TypeScript Interfaces

### Core Interfaces

#### CompletionResult

```typescript
interface CompletionResult {
  text: string;
  usage?: TokenUsage;
  toolCalls?: ToolCall[];
  finishReason?: string;
}
```

#### TokenUsage

```typescript
interface TokenUsage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}
```

#### ToolCall

```typescript
interface ToolCall {
  id: string;
  type: 'function';
  function: {
    name: string;
    arguments: string;  // JSON-encoded
  };
}
```

#### RoutingDecision

```typescript
interface RoutingDecision {
  modelId: string;
  reason: string;
  confidence: number;   // 0-100
  ruleApplied?: string;
}
```

#### Session

```typescript
interface Session {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  modelId: string;
  totalTokens: number;
  messageCount: number;
  messages: Message[];
}

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: number;
  tokens?: { input: number; output: number };
  /**
   * Optional metadata that overrides how the message is presented to the
   * user in transcripts (TUI rendering, `sessions export`, and session
   * replay). Does NOT change how the message is delivered to the model —
   * providers still receive the message with its logical `role`. Set
   * `displayRole: 'system'` on hook context messages or other internal
   * instrumentation that should reach the model but be hidden from
   * user-facing transcripts. Introduced in 1.21.4 (issue #1466).
   */
  displayRole?: 'system' | 'user' | 'assistant';
}
```

#### SessionRetentionPolicy

Machine-wide session retention policy persisted at `~/.alexi/config.json`. Read via `getConfigSessionRetention()` and written via `setConfigSessionRetention()` (`src/config/userConfig.ts`).

```typescript
interface SessionRetentionPolicy {
  /**
   * Whether automatic deletion is enabled. `false` (or missing) means
   * the retention runner is a no-op even if `maxAgeDays` is set.
   */
  enabled: boolean;
  /**
   * Days a session is kept before retention deletes it. Minimum 1.
   * Defaults to 30 when the on-disk value is missing / non-finite /
   * less than 1.
   */
  maxAgeDays: number;
}

function getConfigSessionRetention(): SessionRetentionPolicy;
function setConfigSessionRetention(policy: Partial<SessionRetentionPolicy>): void;
```

`setConfigSessionRetention` validates that `maxAgeDays` is a positive integer >= 1 and throws `Error('retention.maxAgeDays must be a positive integer >= 1 (got <value>)')` on non-finite or below-one inputs. `enabled` and `maxAgeDays` may be updated independently — a partial write leaves the other field untouched.

Consumed by `SessionManager.cleanupExpiredSessions` (below) and by the daily scheduler `triggerRetentionSweep` (`src/core/retentionScheduler.ts`). When `enabled` is `false` (the default), both paths short-circuit immediately without scanning the sessions directory.

#### SessionManager.cleanupExpiredSessions

Runs a one-shot sweep of `~/.alexi/sessions/` that permanently deletes sessions older than `retention.maxAgeDays`. Guarded by three safety checks (opt-in, active run, recent write) and cascades to expired children of expired parents.

```typescript
class SessionManager {
  cleanupExpiredSessions(now?: number): {
    deleted: number;
    skipped: number;
    errors: string[];
  };
}
```

- `now` (default `Date.now()`) is injected for deterministic tests.
- Returns `{ deleted: 0, skipped: 0, errors: [] }` immediately when `retention.enabled` is `false` — no directory scan is performed.
- `deleted` counts sessions actually removed by `deleteSession`.
- `skipped` counts sessions held back by the active-run guard (`hasActiveRun(id)`) or the recent-write guard (last message timestamp within the last hour).
- `errors` is a list of human-readable strings describing per-session failures (unreadable JSON, permission denied on delete, etc.). The sweep continues past errors so a single corrupted file does not block cleanup of the rest.

Called synchronously by `alexi sessions --cleanup` (bypasses the 24h cooldown) and asynchronously by `triggerRetentionSweep` (respects the cooldown).

#### retentionScheduler

Fire-and-forget scheduler that triggers `cleanupExpiredSessions` at most once per 24 hours per user. Wired into `src/cli/program.ts` startup so every CLI invocation contributes to housekeeping without cost when the cooldown is active.

```typescript
// src/core/retentionScheduler.ts
export function readLastRun(now?: number): number;
export function shouldRun(now?: number): boolean;
export function triggerRetentionSweep(now?: number): boolean;
```

- `readLastRun` returns the last-run timestamp recorded in `~/.alexi/last-retention-run`, or `0` when the file is missing / unreadable / corrupt / more than 24h in the future.
- `shouldRun` returns `true` when at least 24h have elapsed since the last recorded sweep (including "never run" — a missing state file counts as `true`).
- `triggerRetentionSweep` records the current timestamp BEFORE dispatching the sweep so an unhandled error inside `cleanupExpiredSessions` does not cause the next startup to re-run immediately. The actual sweep runs via `setImmediate` on the CLI event loop; the function returns `true` when a sweep was scheduled and `false` when the cooldown blocked it.

The CLI startup path in `src/cli/program.ts` wraps the call in a `try/catch`:

```typescript
// src/cli/program.ts
try {
  triggerRetentionSweep();
} catch {
  // Retention is a housekeeping best-effort. A scheduler failure must
  // never block CLI startup.
}
```

#### SessionManager.addMessage

`addMessage` accepts either a raw `displayRole` string or an options object as its fourth argument. Existing three-argument call sites continue to compile.

```typescript
class SessionManager {
  addMessage(
    role: Message['role'],
    content: string,
    tokens?: Message['tokens'],
    options?: { displayRole?: Message['displayRole'] } | Message['displayRole']
  ): void;
}

// Common uses
sessionManager.addMessage('user', 'hi');
sessionManager.addMessage('assistant', 'hello', { input: 5, output: 3 });

// Persist a hook contextModification message that is hidden from the
// transcript but still logged in the session file.
sessionManager.addMessage('user', hookMessage, undefined, { displayRole: 'system' });
```

Auto-title generation skips messages carrying any `displayRole` value so internal instrumentation cannot end up as the session title.

### Compaction Interfaces

```typescript
type CompactionStrategy = 'truncate' | 'summarize' | 'sliding' | 'smart';

interface CompactionOptions {
  strategy: CompactionStrategy;
  preserveRecent?: number;          // Messages to always keep
  preserveSystemPrompt?: boolean;
  customSummaryPrompt?: string;
  overflowTokens?: number;          // Tokens that triggered overflow
}

interface CompactionResult {
  success: boolean;
  originalMessageCount: number;
  compactedMessageCount: number;
  originalTokens: number;
  compactedTokens: number;
  summary?: string;
  removedMessages?: number;
  error?: string;
}

// src/core/compaction.ts — trigger evaluation
interface ShouldCompactOptions {
  /** 0-100. Percentage of max context tokens at which to fire. */
  threshold?: number;
  /** Subtracted from maxContextTokens BEFORE applying threshold. */
  reserveOutputTokens?: number;
  /**
   * Provider-reported input token usage from the previous completed turn.
   * When supplied and positive, projects next-turn cost as
   * `reportedUsage + systemPromptTokens + toolContentTokens + newContentTokens`
   * instead of re-estimating the whole transcript. MUST be cleared to
   * undefined / 0 after a cancelled response so the stale baseline does
   * not keep the projection inflated.
   */
  reportedUsage?: number;
  /**
   * Approx system-prompt tokens. Counted at most ONCE against the trigger
   * (upstream kilocode `f607bf0e0` bugfix — was previously per-turn).
   */
  systemPromptTokens?: number;
  /**
   * Approx tokens of tool result content that has landed since the last
   * reportedUsage. Added to the projection so large tool outputs cannot
   * slip past the trigger.
   */
  toolContentTokens?: number;
}

function shouldCompact(
  messages: Message[],
  maxContextTokens: number,
  thresholdOrOptions?: number | ShouldCompactOptions
): boolean;
```

`shouldCompact` accepts either the legacy positional `threshold?: number` third argument or the options bag. A positional number is normalised to `{ threshold: n }` and takes the pre-existing whole-transcript estimation path. See [ARCHITECTURE.md — Trigger Projection from Provider-Reported Usage](ARCHITECTURE.md#trigger-projection-from-provider-reported-usage) for the projection algorithm and the caller contract.

### Hook Interfaces

```typescript
type HookEvent =
  | 'SessionStart' | 'SessionEnd'
  | 'PreToolUse' | 'PostToolUse' | 'PostToolUseFailure'
  | 'PermissionRequest' | 'Stop' | 'Error';

interface HookDefinition {
  event: HookEvent;
  type: 'command' | 'http' | 'script';
  command?: string;
  url?: string;
  method?: 'GET' | 'POST';
  headers?: Record<string, string>;
  script?: string;
  timeout?: number;           // Default: 30000ms
  enabled?: boolean;          // Default: true
  description?: string;
  continueOnBlock?: boolean;  // Feed rejection to model instead of halting
}

interface HookResult {
  success: boolean;
  output?: string;
  error?: string;
  duration: number;
  capped?: boolean;           // Block cap exceeded
  continueOnBlock?: boolean;
}
```

## Tool System

### Tool Definition

Tools are defined using `defineTool` with Zod schema validation:

```typescript
import { defineTool } from '../tool/index.js';
import { z } from 'zod';

const myTool = defineTool({
  name: 'my-tool',
  description: 'Description of what the tool does',
  parameters: z.object({
    param1: z.string().describe('Parameter description'),
    param2: z.number().optional(),
  }),
  permission: {
    action: 'write',
    getResource: (params, context) => {
      return path.join(context?.workdir || process.cwd(), params.filePath);
    },
  },
  async execute(params, context) {
    return {
      success: true,
      data: { /* result */ },
    };
  },
});
```

### ToolContext

```typescript
interface ToolContext {
  workdir: string;
  signal?: AbortSignal;
  sessionId?: string;
  gitManager?: AutoCommitManager;
  /**
   * Optional session manager — injected by agenticChat / orchestrators
   * that maintain a persistent session store. Tools that spawn or
   * cancel delegated subagent sessions (currently only `task`) reach
   * through here to `beginSessionRun`, `abortSession`, and
   * `releaseSession`. When absent, delegating tools MUST fall back to
   * their existing stub behaviour rather than crash — nothing in the
   * per-tool contract requires a session manager to be present.
   */
  sessionManager?: SessionManager;
  /**
   * Per-session set of realpath()ed AGENTS.md files that have already been
   * surfaced to the agent as system-reminders.
   */
  agentsMdSeen?: Set<string>;
  /**
   * Current subagent nesting depth (0 for top-level user session).
   * The `task` tool uses this to enforce MAX_SUBAGENT_DEPTH (default 3).
   */
  subagentDepth?: number;
  /**
   * The synthetic tool-execution id assigned by `executeUnsafe` and
   * carried by ToolExecutionStarted / Completed / Failed. Threaded
   * through to `execute()` so streaming-capable tools (bash / shell)
   * can correlate incremental output chunks (`BashOutputChunk`) with
   * the row the TUI is already rendering. `undefined` when a tool is
   * invoked outside the standard registry (tests, one-shot calls).
   */
  toolId?: string;
  /**
   * Free-form per-invocation options that a caller can attach to a tool call.
   * Consumed by individual tools; unknown keys are ignored by tools that do
   * not recognize them. See tool-specific docs for supported keys.
   *
   * Currently recognized keys:
   *   - `denyDirectory` (boolean, read tool): when true, the `read` tool
   *     performs a symlink-escape check after resolving the requested path
   *     and rejects the call if the second `realPath` pass yields a
   *     different target. See "Built-in Tools" below for the exact contract.
   */
  extra?: Record<string, unknown>;
}
```

### ToolResult

```typescript
interface ToolResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  truncated?: boolean;
  hint?: string;
  metadata?: Record<string, unknown>;
}
```

### Tool Registry API

```typescript
import {
  registerTool,
  registerDynamicTool,
  unregisterDynamicTool,
  getTool,
  getAllToolSchemas,
  getToolRegistry,
} from './tool/index.js';

// Register a custom tool
registerTool(myTool);

// Register/unregister dynamic tools (e.g., from MCP)
registerDynamicTool(mcpTool);
unregisterDynamicTool('mcp-tool-name');

// Get a tool by name
const tool = getTool('read');

// Get all tool schemas for LLM function calling
const schemas = getAllToolSchemas();
```

### Output Truncation

Large tool outputs are automatically truncated:

```typescript
// Constants
const MAX_LINES = 2000;
const MAX_BYTES = 51200;

// Functions
truncateOutput(output: string): { content: string; truncated: boolean }
persistLargeOutput(output: string, toolName: string): string  // saves to temp file
cleanupToolOutputs(): void
```

### Built-in Tools

| Tool | Parameters | Description |
|------|-----------|-------------|
| `read` | `filePath`, `offset?`, `limit?` | Read file/directory contents (respects `ctx.extra.denyDirectory` — see below) |
| `write` | `filePath`, `content` | Write/create files |
| `edit` | `filePath`, `oldString`, `newString`, `replaceAll?` | Exact string replacement |
| `glob` | `pattern`, `path?` | Find files by glob pattern |
| `grep` | `pattern`, `path?`, `include?` | Search file contents by regex |
| `bash` | `command`, `description?`, `timeout?`, `workdir?` | Execute shell commands with real-time streaming (`BashOutputChunk` events) |
| `shell` | `command`, `description?`, `timeout?`, `workdir?` | Cross-platform shell tool (alias for `bash`, with sandbox git-write escalation) |
| `task` | `prompt`, `description`, `subagent_type`, `task_id?`, `background?` | Launch sub-agent |
| `task_status` | `taskId` | Query background task status |
| `webfetch` | `url`, `format?`, `timeout?` | Fetch web content |
| `question` | `question`, `options?` | Ask user a question |
| `todowrite` | `todos` | Manage task list (see [TodoWrite tool contract](#todowrite-tool-contract) below) |
| `background_process` | `command`, `name?`, `workingDirectory?`, `env?` | Spawn long-running detached process (see [background_process semantics](#background_process-tool-semantics) below) |
| `agent_manager` | `action`, `sessionId?`, `agentId?`, `answer?`, `sourceSessionId?`, `worktreeId?`, `config?` | Manage agent sessions and answer pending sub-agent questions (nullable-friendly schema — see below) |
| `open_plan` | `path`, `title?` | Signal that an agent-authored plan markdown file is ready for review; publishes `plan.opened` on the shared bus (see [open_plan tool](#open_plan-tool) below) |
| `schedule_wakeup` | `when`, `reason`, `payload?` | Schedule a future resume of the current session; `when` accepts an ISO-8601 timestamp or a relative duration (`"5m"`, `"1h"`, `"30s"`, `"2d"`). Requires an active session context. See [Wakeup tools](#wakeup-tools) below |
| `cancel_wakeup` | `wakeupID` | Cancel a previously scheduled wakeup by id. Idempotent — returns `{ cancelled: false }` for unknown, already-fired, or foreign-session ids. See [Wakeup tools](#wakeup-tools) below |
| `context_inspect` | (none) | Report current session token / message usage and distance to the compaction threshold. Gated behind `experimental.contextTools`. See [Context Self-Inspection API](#context-self-inspection-api-experimentalcontexttools) below |
| `context_summarize` | `reason?` | Request that the current session be compacted at the next safe point (between turns). Does NOT run compaction directly. Gated behind `experimental.contextTools`. See [Context Self-Inspection API](#context-self-inspection-api-experimentalcontexttools) below |

#### `todowrite` tool contract

`src/tool/tools/todowrite.ts` maintains a session-scoped task list. The parameter shape is:

```typescript
const TodoSchema = z.object({
  content: z.string(),
  status: z.enum(['pending', 'in_progress', 'completed', 'cancelled']),
  priority: z.enum(['high', 'medium', 'low']),
});

const TodoWriteParamsSchema = z.object({
  todos: z.array(TodoSchema),
});
```

The tool description explicitly enforces four incremental-update rules for callers:

1. Every call sends the **full** updated list. The tool replaces state — it does not merge.
2. Exactly **one** task must be in `in_progress` at a time. The previous task must be marked `completed` in the same call that starts the next one.
3. Completed tasks must remain in the list so the user sees the trail of finished work.
4. Newly discovered follow-up tasks are added as `pending` items rather than editing the currently-running task's `content`.

`getTodos()`, `onTodosChange(callback)`, and `clearTodos()` are exported for TUI integration.

#### `background_process` tool semantics

`src/tool/tools/background-process.ts` spawns a detached, unref'd child process and returns immediately once port detection completes. Its description explicitly documents four properties models kept getting wrong:

- **Not a sleep primitive.** The tool returns as soon as the child has spawned (typically a couple of seconds while ports are being detected). Do NOT use it to `sleep`, poll, or wait for a service to become ready — spawn the service here and poll the endpoint from a separate `bash` / `shell` call.
- **Port detection is asynchronous.** The initial result may return before ports are populated. Call `listBackgroundProcesses` a moment later to observe the resolved port set.
- **Detached and unref'd.** The process survives the tool call but WILL be terminated by `killAllTracked` on CLI shutdown. Do not rely on it outliving the parent Alexi session.
- **Permission gated.** The tool declares `permission: { action: 'execute', getResource: (params) => params.command }`, so it goes through the same permission evaluator as `bash`.

Result shape:

```typescript
export interface BackgroundProcess {
  id: string;                 // "bg_<timestamp>_<nanoid>"
  name: string;
  command: string;
  pid: number;
  startedAt: Date;
  status: 'running' | 'stopped' | 'failed';
  ports: number[];            // asynchronously populated
}
```

#### `agent_manager` tool: nullable-friendly schema

`src/tool/tools/agent-manager.ts` accepts explicit `null` in addition to `undefined` for every optional field, so tool-call payloads from strict-mode providers (OpenAI structured output, SAP AI Core in strict mode) validate without provider-specific pre-processing:

```typescript
const AgentManagerParamsSchema = z.object({
  action: z.enum(['create', 'list', 'stop', 'status', 'answer']).describe('Action to perform'),
  sessionId: z.string().nullable().optional().describe('Session ID for stop/status actions'),
  agentId: z
    .string()
    .nullable()
    .optional()
    .describe('Agent ID for answer action (the sub-agent blocked on a pending question)'),
  answer: z
    .string()
    .nullable()
    .optional()
    .describe(
      'Answer text to send to a sub-agent that is blocked on a pending question. Required when action=answer.'
    ),
  sourceSessionId: z
    .string()
    .nullable()
    .optional()
    .describe(
      "Session that originated this message; the target agent's reply routes back here. Defaults to the caller's session when omitted."
    ),
  worktreeId: z.string().nullable().optional().describe('Worktree ID for session creation'),
  config: z
    .object({
      mode: z.string().nullable().optional().describe('Agent mode'),
      model: z.string().nullable().optional().describe('Model to use'),
      excludeLocalState: z
        .boolean()
        .nullable()
        .optional()
        .describe('Exclude local state on startup for fresh session initialization'),
    })
    .nullable()
    .optional()
    .describe('Configuration for session creation'),
});
```

Both `null` and `undefined` mean "use default" — the `create` handler treats `config?.excludeLocalState ?? false` symmetrically. The `answer` action is used to unblock a sub-agent that is waiting on a permission question; it consumes the `agentId` and `answer` fields, plus the optional `sourceSessionId` for cross-session reply routing (see below). The tool declares `permission: { action: 'admin', getResource: (params) => params.action }`.

**Cross-session reply routing on `answer`.** The optional `sourceSessionId` field (ports kilocode `a1c674ada feat(agent-manager): route peer replies to source sessions` and `b1742663c feat(agent-manager): attribute cross-session messages`) tells the target sub-agent where to route its reply. When set, the sub-agent's response is delivered back to that originating session so multi-agent swarms preserve conversation locality; when omitted, the field falls back to the caller's `_context.sessionId`, preserving the previous single-session behaviour. The resolved source id is echoed back to the caller in the success message:

```typescript
{
  success: true,
  data: {
    action: 'answer',
    answered: agentId,
    // With sourceSessionId (or a resolved fallback to the caller's sessionId):
    message: `Answer delivered to agent ${agentId} (reply routes to session ${resolvedSource})`,
    // Without any resolvable source:
    // message: `Answer delivered to agent ${agentId}`
  }
}
```

At the permission layer, `answerQuestion(agentId, answer, opts?: { sourceSessionId?: string })` in `src/permission/agent-manager.ts` accepts the optional third parameter and logs the routing intent at `debug` level. Concrete routing (a bus event that hands the answer back to the source session) is a follow-up — the field is accepted today for API parity so callers can start emitting it.

**Swarm self-messaging guard on `answer`.** Ports kilocode `4e2b7a035 fix(agent-manager): prevent swarm self-messaging`. When the caller's `_context.sessionId` matches the `agentId` being answered, the tool returns `{ success: false, error: 'Agent cannot message itself' }` and short-circuits before the `getBlocker` fail-closed lookup. Without this guard the orchestrator could trap itself in a self-reply loop by calling `agent_manager` with `action: 'answer'` and `agentId` set to its own session id.

**Actions**:

- `create` — Create a new agent session with optional `config` and `worktreeId`. When `config.excludeLocalState` is truthy (either `true` or `null`/omitted defaulting to `false`), the session boots without importing local state.
- `list` — List all active agent sessions.
- `stop` — Stop a specific agent session. Requires `sessionId`.
- `status` — Get the status of a specific agent session. Requires `sessionId`.
- `answer` — **[Added in 1.22.1, ports kilocode `7baefdddf`]** Provide an answer to a sub-agent that is blocked on a pending question. Requires `agentId` and `answer`. The handler consults `getBlocker(agentId)` (fail-closed — see [Sub-agent Blocker Store](./ARCHITECTURE.md#sub-agent-blocker-store-srcpermissionagent-managerts)) and rejects when there is no pending question OR when the blocker is of `kind: 'permission'` (only `question` blockers are answerable through this action today). Success clears the blocker via `answerQuestion(agentId, answer)`.

Example invocation for the `answer` action:

```json
{
  "action": "answer",
  "agentId": "sub-agent-42",
  "answer": "Yes, proceed with the migration."
}
```

The `answer` action is the caller-side of the agent-manager blocker store (`src/permission/agent-manager.ts`). It delegates to `getBlocker(agentId)` to confirm a pending `Blocker { kind: 'question', prompt?, meta? }` exists, then calls `answerQuestion(agentId, answer)` which clears the entry from the in-memory store. When `action === 'answer'`, both `agentId` and `answer` must be non-null strings — the handler rejects the tool call otherwise so the orchestrator does not silently drop an answer meant for a waiting sub-agent. The complementary `isBlocked(agentId)` helper on the same module fails closed: a store lookup that throws is treated as "still blocked" so a caller cannot proceed on stale state (port of upstream `98559c9d6`, current strict form as of `de9d1530`, 2026-08-25: `return blocker !== null && blocker !== undefined`).

> `codebase_search` is no longer a built-in tool. It is provided by the standalone `alexi-mcp-warpgrep` MCP server (see [`docs/mcp-servers.md`](./mcp-servers.md)); once registered in `mcp-servers.json` it appears in the same tool list with the same `{ query: string }` parameter shape it had as a built-in.

#### `read` tool: `denyDirectory` symlink safeguard

The `read` tool implementation (`src/tool/read.ts`) supports an opt-in symlink-escape check. When a tool call is invoked with `ctx.extra.denyDirectory === true`, the tool re-resolves the incoming `requested` path via `fs.realPath` after the initial permission and existence checks and compares the normalized result against the pre-resolved `target`. When the two differ, the call is rejected before any file contents are streamed back to the model:

```
Directory attachments cannot be expanded: <requested>
```

Semantics:

- The check runs only when `ctx.extra.denyDirectory === true`. When the flag is `undefined`, `false`, or the `extra` bag is absent, `read` behaves exactly as before — no additional `realPath` call, no rejection.
- On Windows the second-pass path is normalized via `FSUtil.normalizePath` before comparison so drive-letter case, separator direction, and trailing-separator variance do not produce false positives. On POSIX the two `realPath` values are compared byte-for-byte.
- The failure surfaces as an `Effect.fail(new Error(...))` in the tool result — the agent loop receives it as a normal tool error, not a synchronous exception.
- The safeguard is a defence-in-depth addition on top of the rule-based permission model. Callers that expand user-supplied directory paths (`context`, `session-export`, and any programmatic consumer that walks attachments) should set `denyDirectory: true` when the underlying operation must not follow symlinks that escape the sandbox.

Programmatic example (Node/TypeScript):

```typescript
import { getTool } from './tool/index.js';

const read = getTool('read');
if (!read) {
  throw new Error('read tool not registered');
}

const result = await read.execute(
  { filePath: '/path/to/user-supplied/entry' },
  {
    workdir: process.cwd(),
    extra: { denyDirectory: true },
  }
);

if (!result.success) {
  // On symlink escape: result.error === 'Directory attachments cannot be expanded: <requested>'
  console.error(result.error);
}
```

#### Wakeup tools

`schedule_wakeup` (`src/tool/tools/schedule-wakeup.ts`) and `cancel_wakeup` (`src/tool/tools/cancel-wakeup.ts`) let an active agent schedule and cancel future resumes of its own session. Both delegate to the `Wakeup` namespace in `src/kilocode/wakeup/index.ts` (see [ARCHITECTURE.md — Wakeup Subsystem](./ARCHITECTURE.md#wakeup-subsystem-srckilocodewakeup)).

Parameter schemas:

```typescript
// src/tool/tools/schedule-wakeup.ts
const ScheduleWakeupParamsSchema = z.object({
  when: z
    .string()
    .describe(
      "ISO 8601 timestamp (e.g. '2026-09-15T12:00:00Z') or relative duration ('5m', '1h', '30s', '2d')"
    ),
  reason: z.string().describe('Why the wakeup is scheduled — surfaced back to the agent on resume'),
  payload: z
    .record(z.string(), z.unknown())
    .optional()
    .describe('Optional opaque payload delivered to the resumed session'),
});

// src/tool/tools/cancel-wakeup.ts
const CancelWakeupParamsSchema = z.object({
  wakeupID: z.string().describe('ID of the wakeup to cancel (returned by schedule_wakeup)'),
});
```

Both `payload` on `schedule_wakeup` and the persisted `WakeupSchema.Entry.payload` use Zod v4's two-argument `z.record(z.string(), z.unknown())` signature. The single-argument form `z.record(z.unknown())` is deprecated in v4; call sites and consumers should use the explicit key/value form.

Result shapes:

```typescript
// schedule_wakeup — success
{
  success: true,
  data: { wakeupID: string; at: string /* ISO-8601 */ },
  hint: `Wakeup <id> scheduled for <at>: <reason>`,
  metadata: { wakeupID, at },
}

// cancel_wakeup — success (always success unless the tool itself throws)
{
  success: true,
  data: { cancelled: boolean; wakeupID: string },
  hint: cancelled
    ? `Wakeup <id> cancelled`
    : `No pending wakeup with id <id>`,
  metadata: { cancelled },
}
```

Semantics:

- **Session-scoped.** Both tools return `{ success: false, error: '<tool> requires an active session context' }` when invoked without `context.sessionId` — a wakeup must belong to exactly one session so a driver cannot accidentally schedule a global timer.
- **Cancel is idempotent.** `cancel_wakeup` returns `{ cancelled: false }` (not an error) for unknown ids, foreign-session ids, and already-fired / already-cancelled entries so an agent can call it defensively without pre-checking. Use `Wakeup.read(id)` from the runtime API if the agent needs to inspect state before deciding.
- **Duration parsing.** `when` accepts either an ISO-8601 timestamp or a relative duration matching `/^(\d+)(ms|s|m|h|d)$/i`. Anything else that `new Date(when)` cannot parse is rejected with `Invalid wakeup 'when' value: <when>`.
- **Resume delivery.** When the fire time elapses, the wakeup entry is transitioned to `status: 'fired'` on disk and `WakeupResume.resume(entry)` returns a `ResumeInstruction` value the driver injects as a synthetic `<system-reminder source="wakeup">` user turn. The original `reason` and `payload` are preserved so the resumed agent has full context.

Example agent invocations:

```json
{ "when": "5m", "reason": "Poll SAP batch job status", "payload": { "jobId": "BATCH-4711" } }
```

```json
{ "wakeupID": "5f3b0a3e-2c4a-4d99-9e21-6b4c7f5d3a01" }
```

## Event Bus API — Batched Publish

For call sites that need to emit many related events atomically, the bus exposes `publishAll` and `publishAllAsync`. Both validate every payload before ANY handler runs (fail-fast, no partial publish), then fan out to subscribers in publication order.

```typescript
import { publishAll, publishAllAsync, type BatchEntry } from '../bus/index.js';
import { ToolExecutionStarted, ToolExecutionCompleted } from '../bus/index.js';

interface BatchEntry<T = unknown> {
  readonly event: BusEvent<T>;
  readonly payload: T;
}

// Sync — handlers run inline
publishAll([
  { event: ToolExecutionStarted, payload: { toolName: 'read', toolId: 'a', parameters: {}, timestamp: Date.now() } },
  { event: ToolExecutionCompleted, payload: { toolName: 'read', toolId: 'a', result: {}, duration: 12, timestamp: Date.now() } },
] as const);

// Async — awaits every handler per entry, entries processed in order
await publishAllAsync([/* ... */]);
```

Alternatively use the `EventBatch` namespace re-exported from `src/bus/event-batch.ts`:

```typescript
import { EventBatch } from '../bus/event-batch.js';

EventBatch.publishAll([/* ... */]);
await EventBatch.publishAllAsync([/* ... */]);
```

Guarantees:

- Zod validation runs across the whole batch first; a validation failure throws to the caller with no partial publish.
- A per-event handler snapshot is taken before iteration, so a handler that unsubscribes another handler mid-batch cannot observe a mutating set.
- Individual handler errors are caught and logged; a single bad subscriber cannot abort the rest of the batch.

## Session Manager Abort API

`SessionManager` exposes an abort-propagation surface so long-running subagent runs can be cancelled from a parent CLI signal.

```typescript
import { SessionManager } from '../core/sessionManager.js';

const mgr = new SessionManager();

// Create a session under a parent AbortSignal. When the parent aborts, this
// session's run signal aborts too. If parentSignal is already aborted, the
// returned signal is aborted synchronously.
const session = mgr.createSession(modelId, parentId, { signal: parentSignal });

// Or start a run explicitly on an existing session.
const runSignal: AbortSignal = mgr.beginSessionRun(session.metadata.id, parentSignal);

try {
  await runProviderCall({ signal: runSignal });
} finally {
  // MUST be called from finally — releases the parent-signal listener.
  // Does NOT abort the controller; normal completion is not an abort.
  mgr.endSessionRun(session.metadata.id);
}

// Manually cascade an abort to a session and all its descendants
// (BFS over persisted parentSessionId links). Idempotent; cycle-safe.
mgr.abortSession(session.metadata.id, new Error('user cancelled'));

// Inspect
mgr.getSessionSignal(session.metadata.id); // AbortSignal | undefined
mgr.hasActiveRun(session.metadata.id);     // boolean
mgr.getSessionChildren(session.metadata.id); // string[]

// end + delete (used by the `task` tool for delegated subagents)
mgr.releaseSession(session.metadata.id);
```

Contract points:

- `beginSessionRun` is idempotent: a second call tears down the previous run before starting a new one, so listeners never leak.
- `endSessionRun` MUST be called from a `finally` block so long-lived parent signals do not retain references to completed children.
- `abortSession` walks descendants breadth-first via `getSessionChildren` and uses a `visited` set so a corrupted `A -> B -> A` store cannot spin forever.

## Session Drain API

`SessionDrain` (`src/session/drain.ts`, re-exported from `src/tool/registry.ts`) is a module-level singleton that lets any subsystem register outstanding `Promise`s and wait for them to settle before `process.exit(...)`. Prevents headless CLI exits from racing pending session persistence and event fan-out.

```typescript
import { SessionDrain } from '../session/drain.js';
// or, for parity with upstream call sites:
import { SessionDrain } from '../tool/registry.js';

// Register work. The returned handle untracks; a settled promise auto-untracks
// so a forgotten handle cannot indefinitely block exit.
const unregister = SessionDrain.track(sessionId, longRunningFlush());

// Immediately before process.exit(...) in a headless entry point:
await SessionDrain.drain({ timeoutMs: 30_000 });

// One-shot per lifecycle. After the first drain resolves, further track()
// calls become no-ops so late-arriving work cannot indefinitely block exit.
```

Options:

| Field | Type | Default | Meaning |
|-------|------|---------|---------|
| `timeoutMs` | `number` | `30_000` | Upper bound on how long `drain()` will wait. `0` disables the timeout and waits indefinitely. |

`SessionDrain.size()` returns the number of currently tracked entries (test/diagnostic only). `SessionDrain.__resetForTests()` resets the drain state; production code MUST NOT call it.

## Event Bus API — Bash Streaming

The bash and shell tools publish incremental output chunks over the event bus so TUIs and other observers can render command output as it arrives.

```typescript
import { BashOutputChunk } from '../bus/index.js';

// Payload shape (Zod-validated on publish):
// {
//   toolId: string;                     // matches ToolExecutionStarted / Completed
//   logId: string;                      // matches command-log registry entry (PID-reuse safe)
//   stream: 'stdout' | 'stderr';
//   chunk: string;                      // UTF-8 decoded chunk (may span 'data' events)
//   timestamp: number;
// }

const unsubscribe = BashOutputChunk.subscribe(({ toolId, stream, chunk }) => {
  console.log(`[${stream}] ${chunk}`);
});
```

Invariants:

- `BashOutputChunk` fires strictly between `ToolExecutionStarted` and `ToolExecutionCompleted` for the same `toolId`.
- The final aggregated `stdout` / `stderr` are still returned in the normal `ToolExecutionCompleted` payload; consumers who don't care about live output can ignore this event entirely without changing behaviour.
- Empty chunks are filtered out at publish time.
- A failing subscriber cannot tear down the running command — publish is wrapped in a try/catch on the tool side.

## Command Log Registry API

`src/tool/tools/bash-streaming.ts` exposes the process-local store that backs bash / shell live chunks. Correlate by `logId` (PID-reuse safe) rather than OS PID.

```typescript
import {
  registerCommandLog,
  appendCommandLog,
  markCommandLogFinished,
  getCommandLog,
  getCommandLogByPid,
  cleanupCommandLog,
  cleanupCompletedLogs,
  listCommandLogIds,
  MAX_LOG_BYTES,               // 32 KB per-log append buffer
  COMPLETED_LOG_RETENTION_MS,  // 60_000ms retention after finish
} from '../tool/tools/bash-streaming.js';

// Register BEFORE any 'data' handler fires
const logId = registerCommandLog({
  pid: proc.pid,
  command: 'npm install',
  sessionId,
  toolId,
  startedAt: Date.now(),
});

// Append chunks from stdout / stderr
appendCommandLog(logId, chunk);

// Mark finished — entry enters retention window
markCommandLogFinished(logId);

// Later: fetch the tail
const snapshot = getCommandLog(logId); // Readonly snapshot with buffer

// PID-reuse-safe diagnostic lookup (requires BOTH pid AND startedAt)
const byPid = getCommandLogByPid(pid, startedAt);
```

`CommandLogSnapshot` shape:

```typescript
export type CommandLogSnapshot = Readonly<Omit<CommandLogEntry, 'buffer'>> & {
  buffer: string;
};

interface CommandLogEntry {
  id: string;                  // primary key (nanoid), PID-reuse-safe
  pid: number | undefined;
  startedAt: number;
  finishedAt?: number;
  command: string;
  sessionId?: string;
  toolId?: string;
  buffer: string;              // rolling append buffer, capped at MAX_LOG_BYTES
  totalBytes: number;          // total bytes ever appended
  truncated: boolean;          // true once buffer has been truncated at least once
}
```

Truncation marker inserted when `MAX_LOG_BYTES` is exceeded: `\n[... older output evicted from streaming buffer ...]\n`. Eviction snaps forward to the next `\n` within 1 KB so partial lines are not shown to the TUI.

## SQLite Connection Configuration

`src/core/database/database.ts` produces the canonical PRAGMA sequence for opening a shared SQLite database from multiple processes. Order matters: `busy_timeout` must be installed before `journal_mode = WAL` so the busy handler is armed before WAL recovery can race.

```typescript
import { CONNECTION_PRAGMAS, configureConnection } from '../core/database/database.js';

// Canonical ordered list (immutable):
CONNECTION_PRAGMAS === Object.freeze([
  'PRAGMA busy_timeout = 5000',
  'PRAGMA journal_mode = WAL',
  'PRAGMA synchronous = NORMAL',
  'PRAGMA cache_size = -64000',
  'PRAGMA foreign_keys = ON',
  'PRAGMA wal_checkpoint(PASSIVE)',
]);

// Adapter-agnostic — pass anything with a { run(sql) } method
export interface PragmaRunner {
  run(sql: string): Promise<unknown> | unknown;
}

// better-sqlite3 example
const db = new Database(filename);
await configureConnection({ run: (sql) => db.exec(sql) });

// Options
export interface ConfigureConnectionOptions {
  busyTimeoutMs?: number;   // default 5000
  ownsWalInit?: boolean;    // default true; false skips 'PRAGMA journal_mode = WAL'
}
```

## State Directory Resolution API

`src/core/global/paths.ts` transparently probes the preferred state directory and falls back to a secondary location when the primary is unwritable (containers, restricted user profiles, VS Code Server on Windows).

```typescript
import { resolveState, resolveStateDir } from '../core/global/paths.js';

// General form: preferred with optional fallback
const dir = await resolveState(preferred, fallback);

// Convenience wrapper: falls back to `<dataDir>/state` unless
// $XDG_STATE_HOME was explicitly set by the user
const stateDir = await resolveStateDir(dataDir, preferred);
```

Behaviour:

- Writability is probed via an exclusive-mode temp file (`wx`, mode `0o600`) so a stale probe file cannot mask a real permission problem.
- The fallback is **sticky**: once selected it is preferred on subsequent runs so the resolved state directory does not flap between locations across restarts.
- When `$XDG_STATE_HOME` was explicitly set by the user, no fallback is provided — any failure surfaces rather than silently redirecting.

## Snapshot Persistence API

`src/core/snapshot.ts` persists the "snapshots disabled" flag across CLI restarts and exposes the on-disk snapshot lifecycle.

```typescript
import {
  disableSnapshots,
  enableSnapshots,
  shouldSnapshot,
  SNAPSHOT_DISABLE_STATE_KEY,   // 'kilocode.snapshot.disabled'
  pruneSnapshots,
  discardSnapshotRepository,
  snapshotRepositoryExists,
} from '../core/snapshot.js';

await disableSnapshots();                 // persist disable to ~/.alexi/state/snapshot.json
await enableSnapshots();                  // re-enable
const on = await shouldSnapshot();        // true when snapshots are on

// Prune stale snapshot / truncation files by mtime, oldest first.
// Retains the newest `keep` files (default 20). No-op when the
// snapshots directory does not exist.
const deleted = await pruneSnapshots(sessionId, 20);

// Wipe every snapshot for a session. Idempotent — a missing directory
// resolves to 0 without throwing, so stale in-memory references cannot
// pin a session that no longer exists.
const removed = await discardSnapshotRepository(sessionId);

// Cheap sync check for UI paths that need to know whether a rewind
// dialog built from a stale listSnapshots() result is still valid.
if (!snapshotRepositoryExists(sessionId)) {
  // repository has been discarded — refetch or bail out
}
```

A missing or unreadable state file is treated as "not disabled" so an unwritable state directory degrades gracefully rather than silently disabling snapshots. `discardSnapshotRepository` returns the number of `.json` files actually deleted (`0` when the directory did not exist). See [ARCHITECTURE.md — Snapshot-Repository Lifecycle](ARCHITECTURE.md#snapshot-repository-lifecycle).

## Prompt Queue API

`src/core/promptQueue.ts` exposes the append-only queue used by interactive drivers to hold user prompts that arrive while an agent goal is in flight. A new inbound prompt does NOT cancel the goal — that would throw away partial work. Only an explicit `interrupt()` (Ctrl+C, `/stop`, abort) cancels.

```typescript
import { PromptQueue, type QueuedPrompt, type ActiveGoalHandle } from '../core/promptQueue.js';

interface QueuedPrompt {
  text: string;
  enqueuedAt: number;
  metadata?: Record<string, unknown>;
}

interface ActiveGoalHandle {
  id: string;
  cancel: (reason: string) => void;   // ONLY invoked by interrupt(), never by enqueue()
}

const queue = new PromptQueue({
  logger: (event, fields) => log.debug(event, fields),
  onQueuedBehindGoal: (prompt, goalId) =>
    ui.showBadge(`queued (${goalId})`),
});

queue.startGoal({ id: 'goal-1', cancel: (r) => abortController.abort(r) });
queue.enqueue({ text: 'follow up', enqueuedAt: Date.now() });   // never cancels the goal
queue.finishGoal();                                             // idempotent
const pending: QueuedPrompt[] = queue.drain();

queue.interrupt('user pressed Ctrl+C');                         // the ONLY cancel path
```

Semantics:

- `enqueue(prompt)` — appends; fires `onQueuedBehindGoal(prompt, goalId)` when a goal is active.
- `interrupt(reason)` — the only path that calls `handle.cancel(reason)`. Snapshots the handle before nulling out so a slow cancel implementation cannot race with a concurrent `finishGoal()`.
- `finishGoal()` — idempotent, safe to call in `finally` blocks even when `startGoal` was skipped.
- `drain()` — returns queued prompts in enqueue order and clears the buffer; typically called by the driver once `finishGoal()` has been invoked.
- `size()` / `hasActiveGoal()` — status accessors for prompt indicators; `size()` excludes any in-flight goal.

See [ARCHITECTURE.md — Prompt Queue](ARCHITECTURE.md#prompt-queue-srccorepromptqueuets).

## Sandbox Git-Write API

`src/kilocode/sandbox/git.ts` classifies git subcommands as write-shaped for sandbox escalation.

```typescript
import { isGitWrite, requiresSandboxEscalation } from '../kilocode/sandbox/git.js';

isGitWrite('git commit -m msg');                    // true
isGitWrite('git -C repo push origin main');         // true (walks past -C flag)
isGitWrite('git log --oneline');                    // false (read-only)

// Masked-mutation detection (2026-09-18, kilocode 32aaae25d + 2da7e2bb7):
// read-only-looking subcommands are flagged as writes when they carry
// a mutating global flag.
isGitWrite('git -c core.hooksPath=/tmp/evil log');  // true (masked mutation via -c)
isGitWrite('git --exec-path=/tmp/evil log');        // true (masked mutation via --exec-path)
isGitWrite('git --git-dir=/other/repo log');        // true (masked scope change)

const sandboxEnabled = process.env.ALEXI_SANDBOX === '1';
if (requiresSandboxEscalation(command, sandboxEnabled)) {
  // prompt the user via getPermissionManager().check(...)
}
```

`MASKED_MUTATION_FLAGS` includes `-c`, `--config`, `--exec-path`, `--upload-pack`, `--receive-pack`, `--work-tree`, and `--git-dir`. Short-flag clusters are expanded (`-abc` → `-a -b -c`) so a `-c` embedded in a cluster is detected; numeric-tail short flags (`-n1`, `-C10`) are preserved verbatim.

## Shell Permission Pattern API

`src/tool/shell-pattern.ts` (upstream kilocode range `c33d81690..a85ae672a`) renders the permission-check pattern for a shell command from its tree-sitter parse instead of from the raw text. It exists so the read-only bash rulesets — which deny shell operators with anywhere-match globs (`*|*`, `*>*`, `*;*`, `*$(*`) — do not over-deny legitimate read-only commands that carry an operator character inside a quoted string or an inert redirect.

```typescript
import { pattern, patternFor, type ShellID } from '../tool/shell-pattern.js';
import type { TreeSitterSyntaxNode } from '../context/treeSitter.js';

export type ShellID = 'bash' | 'sh' | 'zsh' | 'powershell' | 'cmd' | ...;

// The primitive: given an already-parsed tree-sitter node, render the
// masked permission pattern. Falls back to `raw` when `node` is null,
// when `kind` is not a POSIX-family shell, when the render is empty,
// or when any exception is thrown during rendering.
export function pattern(
  node: TreeSitterSyntaxNode | null,
  kind: ShellID,
  raw: string
): string;

// The runtime entry point: parse `command` via
// `parseSource(command, 'command.bash')` and delegate to `pattern`.
// Non-POSIX shells (`powershell`, `cmd`) return the raw command
// unchanged. When `tree-sitter-bash` is not installed, returns the raw
// command as well.
export function patternFor(command: string, kind: ShellID): string;
```

Usage in the shell tool (`src/tool/tools/shell.ts`):

```typescript
import { patternFor } from '../shell-pattern.js';
import { detectShell } from './shell/id.js';

const shellToolBase = defineTool({
  name: 'shell',
  parameters: ShellParamsSchema,
  permission: {
    action: 'execute',
    getResource: (params) =>
      patternFor(normalizeUrls(params.command), detectShell().type),
  },
  // ...
});
```

Masking behaviour by input:

| Input command | Masked pattern | Notes |
|---------------|----------------|-------|
| `ls -la` | `ls -la` | No operators — passthrough. |
| `grep -E "foo\|bar" file.txt` | `grep -E "foo_bar" file.txt` | `\|` inside quotes is inert. |
| `command 2>/dev/null` | `command 2__dev_null` | Redirect to `/dev/null` is inert. |
| `command 2>&1` | `command 2__1` | Fd duplication is inert. |
| `cat file \| grep foo` | `cat file \| grep foo` | Real pipe survives. |
| `echo x > file.txt` | `echo x > file.txt` | Real redirect survives. |
| `echo $(whoami)` | `echo $(whoami)` | Real command substitution survives. |
| `ls ; pwd` | `ls ; pwd` | Real statement separator survives. |
| `'a\|b;c>d'` | `'a_b_c_d'` | Everything inside single quotes is masked. |
| `Get-ChildItem \| Where-Object` (`powershell`) | `Get-ChildItem \| Where-Object` | Non-POSIX shell: raw text. |

The mask is a length-preserving byte-position-preserving transform — each masked position is replaced by a single `_`, so any position-anchored globs in the ruleset still see the same offsets they saw in the raw command.

## Sandbox `gh` (GitHub CLI) API

`src/kilocode/sandbox/gh.ts` (upstream kilocode `13e05d066`, `ecedeea49`, `700345267`, `15b6b3287`) classifies GitHub CLI subcommands so read-only calls (`gh pr list`, `gh issue view`, `gh run watch`, …) pass through the sandbox without a permission prompt, while writes and the auth-sensitive `gh auth *` subgroup still gate through the permission system.

```typescript
import { classifyGh, isGhReadOnly, type GhClassification } from '../kilocode/sandbox/gh.js';

export type GhClassification = 'readonly' | 'auth-gated' | 'write';

// Input is the argv AFTER `gh` itself.
classifyGh(['pr', 'list']);                          // 'readonly'
classifyGh(['pr', 'list', '--state', 'closed']);     // 'readonly' (flags do not change class)
classifyGh(['pr', 'create']);                        // 'write'
classifyGh(['auth', 'status']);                      // 'auth-gated'
classifyGh(['auth']);                                // 'auth-gated' (bare `gh auth`)
classifyGh([]);                                      // 'readonly' (bare `gh` prints help)

// Convenience for the shell tool given tokens starting with `gh`.
isGhReadOnly(['gh', 'pr', 'list']);                  // true
isGhReadOnly(['gh', 'pr', 'create']);                // false
isGhReadOnly(['git', 'log']);                        // false (defensive — first token must be 'gh')
```

The read-only allow-list intentionally excludes anything that creates / updates / deletes remote state, opens an editor, or takes a `--web` flag (`gh pr create --web`). The full set is `browse`, `config get`, `gist list`, `gist view`, `issue list`, `issue view`, `issue status`, `label list`, `pr list`, `pr view`, `pr status`, `pr checks`, `pr diff`, `release list`, `release view`, `repo list`, `repo view`, `run list`, `run view`, `run watch`, `search`, `workflow list`, `workflow view`, `help`, `version`, `--help`, `--version`.

## Deferred Session Title API

`src/kilocode/session/title.ts` (upstream kilocode `7e0ce5ec6`, `31bfc440c`, `4ab5fe935`) defers session title generation until after the first substantive user activity.

```typescript
import {
  ensureTitle,
  resetTitleState,
  type TitleGenerator,
} from '../kilocode/session/title.js';

export type TitleGenerator = (sessionId: string, firstMessage: string) => Promise<string>;

export async function ensureTitle(
  sessionId: string,
  message: string,
  generate: TitleGenerator,
): Promise<string | undefined>;

export function resetTitleState(sessionId?: string): void;
```

Returns the cached title on success. Returns `undefined` when gated out — the message is shorter than `TITLE_MIN_MESSAGE_LENGTH = 8` after trimming, the attempt budget (`TITLE_MAX_ATTEMPTS = 3`) is exhausted, or the per-session backoff window (`TITLE_BACKOFF_MS = 60_000` ms after a failure) has not elapsed. Failures record `state.gatedUntil` and log a warning through `src/utils/logger.ts`.

## Stalled Permission Approval Recovery API

`src/permission/recovery.ts` (upstream kilocode `d8eaefdf1`, `f6d761e65`, `fa897b854`) reconciles pending permission prompts that were disrupted by an abort, hot-reload, or provider re-init. Re-exported from `src/permission/index.ts` so consumers can import from a single entry point.

```typescript
import {
  recoverStalledPermissions,
  reconcileAbortedSave,
  trackPendingPermission,
  clearPendingPermission,
  type PermissionRecoveryResult,
} from '../permission/index.js';

export interface PermissionRecoveryResult {
  approved: boolean;                                        // Always false — recovery denies.
  reason: 'stalled_recovery' | 'save_aborted';
}

// Register a pending prompt so it can be reconciled on session resume.
// Default timeoutMs is 5 * 60 * 1000 (5 minutes).
export function trackPendingPermission(
  id: string,
  resolver: (result: PermissionRecoveryResult) => void,
  timeoutMs?: number,
): void;

// Clear an entry that resolved normally (user answered before recovery ran).
export function clearPendingPermission(id: string): void;

// Sweep pending entries and reconcile any past their deadline as denials.
// Returns the number of entries recovered.
export function recoverStalledPermissions(): number;

// Reconcile an aborted rule save. Resolves the pending entry keyed by
// ruleId as a denial with reason 'save_aborted'. Returns true if an
// entry was cleared.
export function reconcileAbortedSave(ruleId: string): boolean;
```

`SessionManager.createSession()` invokes `recoverStalledPermissions()` on every session creation via a fire-and-forget dynamic import, so callers that go through the normal session-start path get recovery for free.

## Programmatic Tool Calling API (`experimental.code_mode`)

`src/tool/code-mode.ts` (upstream kilocode `6b5e8a04e`, `e0dcb0e4e`) routes MCP tool calls through a confined JavaScript runtime with on-demand tool discovery when the `experimental.code_mode` flag is set.

```typescript
import { loadCodeMode, type CodeMode } from '../tool/code-mode.js';

export interface CodeMode {
  dispatch(toolName: string, args: unknown): Promise<unknown>;
  dispose(): Promise<void>;
}

// Returns null when experimental.code_mode is off, when the process is
// network-restricted (ALEXI_NO_NETWORK=1 / NO_PROXY=*), or when the
// runtime module fails to load. Fallback callers should use the direct
// MCP tool path.
export async function loadCodeMode(): Promise<CodeMode | null>;
```

The config flag lives at `experimental.code_mode` in `~/.alexi/config.json`. See [CONFIGURATION.md — `experimental.code_mode`](CONFIGURATION.md#experimental-code_mode) for the getter / setter surface.

## Native Notifications API

`src/core/notifications.ts` exposes the desktop-notification surface. Every function is safe to call from any context — no path throws, and non-interactive environments (`CI`, `ALEXI_NO_NOTIFICATIONS=1`, no TTY) silently resolve `false`.

```typescript
import {
  sendNotification,
  notifyInBackground,
  getNotificationDecision,
  setNotificationDecision,
  isInteractiveEnv,
  LONG_RUNNING_THRESHOLD_MS,
  type NotificationDecision,
  type SendNotificationOptions,
  type NotifierLike,
} from '../core/notifications.js';

export type NotificationDecision = 'allow' | 'deny' | 'ask';

export interface SendNotificationOptions {
  /** Absolute path to an icon image. Ignored on platforms without icon support. */
  icon?: string;
  /** Play the OS default notification sound. */
  sound?: boolean;
  /** Block until the notification is dismissed. */
  wait?: boolean;
  /** Test-only: override the node-notifier layer. */
  __notifierOverride?: NotifierLike;
  /** Test-only: override the inquirer confirm prompt. */
  __askOverride?: (title: string, message: string) => Promise<boolean>;
}

export interface NotifierLike {
  notify(
    options: Record<string, unknown>,
    callback?: (err: Error | null, response?: string, metadata?: unknown) => void
  ): unknown;
}

/** Minimum wall-clock duration (ms) before a bash/shell command is "long-running". Currently 30_000. */
export const LONG_RUNNING_THRESHOLD_MS: number;

/** Returns false when CI, ALEXI_NO_NOTIFICATIONS=1, or either stream is not a TTY. */
export function isInteractiveEnv(): boolean;

/** Reads the persisted decision from ~/.alexi/config.json; malformed values coerce to 'ask'. */
export function getNotificationDecision(): NotificationDecision;

/** Persists the decision to ~/.alexi/config.json. */
export function setNotificationDecision(decision: NotificationDecision): void;

/**
 * Dispatch a notification. Never throws — a failed dispatch resolves to `false` after
 * logger.debug. Returns `true` iff the notification was accepted by node-notifier.
 * The decision is re-read on every call, so a `deny -> allow` config edit takes
 * effect on the next invocation without any restart.
 */
export function sendNotification(
  title: string,
  message: string,
  options?: SendNotificationOptions
): Promise<boolean>;

/** Fire-and-forget wrapper. Discards the promise safely; errors are already swallowed. */
export function notifyInBackground(
  title: string,
  message: string,
  options?: SendNotificationOptions
): void;
```

**Call-site contract.** Two internal call sites currently invoke `notifyInBackground`:

- `src/core/streamingOrchestrator.ts` — fires `notifyInBackground('Alexi', 'Task completed')` when the streaming loop exits via the `completedCleanly` branch. Aborts, provider errors, context-overflow retries, and rate-limit backoffs do NOT fire.
- `src/tool/tools/bash.ts` — fires `notifyInBackground('Command finished', description ?? command)` when either the command detached before exit, OR the foreground elapsed time reached `LONG_RUNNING_THRESHOLD_MS` (30 s).

Both sites resolve the shared `notifications` config key on every call. A single user `deny` decision silences both surfaces; a single `allow` re-enables both.

**Config key.** The decision persists as a JSON string under `notifications` in `~/.alexi/config.json`:

```jsonc
{
  "notifications": "allow"  // or "deny" | "ask" (unset defaults to "ask")
}
```

See also: [Configuration -> Native Notifications](CONFIGURATION.md#native-notifications).

## Permission System

### Permission Actions

```typescript
type PermissionAction = 'read' | 'write' | 'execute' | 'network' | 'admin';
```

### Read-only mode evaluator

```typescript
import { evaluate } from '../permission/index.js';

// Under 'ask' / 'plan' modes, write-shaped tools are denied even when
// a broad wildcard rule like { '*': 'allow' } would otherwise match.
// An explicit per-tool 'allow' still wins.
evaluate({
  tool: 'write',
  mode: 'ask',
  rules: { '*': 'allow' },
}); // => 'deny'

evaluate({
  tool: 'write',
  mode: 'ask',
  rules: { '*': 'allow', write: 'allow' },
}); // => 'allow'  (explicit per-tool wins)

evaluate({
  tool: 'read',
  mode: 'ask',
  rules: { '*': 'allow' },
}); // => 'allow'  (read is not write-shaped)
```

Write-shaped tools: `write`, `edit`, `patch`, `shell`, `bash`, `kilo_edit`, `kilo_write`, `apply_patch`. Read-only modes: `ask`, `plan`.

### Permission Rule

```typescript
interface PermissionRule {
  id?: string;
  name?: string;
  description?: string;
  tools?: string[];              // Tool name patterns
  actions?: PermissionAction[];
  paths?: string[];              // File path patterns (glob)
  commands?: string[];           // Command patterns
  hosts?: string[];              // Network host patterns
  decision: PermissionDecision;  // 'allow' | 'deny' | 'ask'
  priority: number;              // Higher = evaluated later (last-match-wins)
  externalPaths?: boolean;
  homeExpansion?: boolean;
}
```

### Permission Result and Rejection Feedback

```typescript
interface PermissionResult {
  decision: PermissionDecision;
  rule?: PermissionRule;
  granted: boolean;
  provenance?: PermissionProvenance;
  /**
   * Optional natural-language reason supplied by the user when rejecting the
   * tool. Only populated when `decision === 'deny'` and the user's response
   * carried a `feedback` payload. Approvals never surface feedback.
   * Whitespace-only input is trimmed to `undefined`.
   */
  feedback?: string;
}
```

The permission-rejection feedback flow (ports of kilocode `b30b2cf0d` and follow-ups) threads a user-supplied natural-language reason from the prompt UI through `PermissionResponse` and `PermissionResult` out to the tool result, where the agent loop forwards it to the model as a follow-up user turn.

Event shape (`src/bus/index.ts`):

```typescript
export const PermissionResponse = defineEvent(
  'permission.response',
  z.object({
    id: z.string(),
    granted: z.boolean(),
    remember: z.boolean().optional(),
    timestamp: z.number(),
    /**
     * Optional natural-language reason the user supplied when rejecting
     * the tool. Absent / empty when the user did not supply a reason.
     */
    feedback: z.string().optional(),
  })
);
```

TUI dialog result shape (`src/cli/tui/dialogs/PermissionDialog.tsx`):

```typescript
export interface PermissionResult {
  granted: boolean;
  remember: boolean;
  /** Empty / omitted when the user approved or skipped the reason prompt. */
  feedback?: string;
}
```

The tool-result string is built by `buildUserRejectedToolReason(toolName, reason)` in `src/permission/index.ts` and always ends with the guidance suffix so the model does not treat the rejection as a system failure. See [ARCHITECTURE.md — Permission-Rejection Feedback Flow](ARCHITECTURE.md#permission-rejection-feedback-flow).

### Agentic Permission Configuration

In agent mode, high-priority rules are automatically added:

```typescript
// Allow writes in workdir (priority 200)
{
  id: 'agentic-allow-write',
  actions: ['write'],
  paths: [`${workdir}/**`, workdir],
  decision: 'allow',
  priority: 200,
}

// Allow execute operations (priority 200)
{
  id: 'agentic-allow-execute',
  actions: ['execute'],
  decision: 'allow',
  priority: 200,
}
```

These override the default `ask-write` rule (priority 10) and `deny-secrets` rule (priority 100).

## Usage Examples

### Programmatic Agentic Chat

```typescript
import { agenticChat } from './core/agenticChat.js';

const result = await agenticChat('Write unit tests for the auth module', {
  autoRoute: true,
  maxIterations: 20,
  workdir: '/path/to/project',
  effort: 'high',
  onProgress: (event) => {
    if (event.type === 'tool_end') {
      console.log(`Tool ${event.toolName}: ${event.result?.success}`);
    }
  },
});

console.log(`Model: ${result.modelUsed}`);
console.log(`Iterations: ${result.iterations}`);
console.log(`Tool calls: ${result.toolCallsExecuted}`);
console.log(result.text);
```

### Custom Tool Registration

```typescript
import { registerTool, defineTool } from './tool/index.js';
import { z } from 'zod';

const customTool = defineTool({
  name: 'deploy',
  description: 'Deploy the application to a target environment',
  parameters: z.object({
    environment: z.enum(['staging', 'production']).describe('Target environment'),
    version: z.string().optional().describe('Version tag to deploy'),
  }),
  permission: {
    action: 'execute',
    getResource: (params) => `deploy:${params.environment}`,
  },
  async execute(params, context) {
    // Implementation
    return { success: true, data: { deployed: true, env: params.environment } };
  },
});

registerTool(customTool);
```

## Session Replay

When resuming an interactive session, the `SessionReplay` class replays past messages so users can review context:

```typescript
import { getSessionReplay } from './cli/session-replay.js';

const replay = getSessionReplay();

const result = await replay.replay(messages, {
  maxMessages: 50,           // Maximum messages to replay
  showToolCalls: true,       // Include tool call messages
  showSystemMessages: false, // Skip system messages
  onMessage: (msg, index, total) => {
    console.log(replay.formatMessage(msg));
  },
});

// Get session summary statistics
const summary = replay.getSummary(messages);
// { totalMessages, userMessages, assistantMessages, systemMessages, toolCalls }
```

### ReplayOptions

```typescript
interface ReplayOptions {
  maxMessages?: number;               // Default: 50
  showToolCalls?: boolean;            // Default: true
  showSystemMessages?: boolean;       // Default: false
  onMessage?: (message: Message, index: number, total: number) => void;
}
```

### `displayRole: 'system'` hard-hide

Introduced in 1.21.4 (issue #1466). `SessionReplay.replay` hard-hides any message tagged with `displayRole: 'system'` regardless of `showSystemMessages`. Real `role: 'system'` messages (the actual system prompt) remain visible when `showSystemMessages: true`. These skipped messages are counted in `result.skippedMessages`.

```typescript
const messages = [
  { role: 'system', content: 'real-system-prompt', timestamp: 1 },
  { role: 'user', content: 'hidden-hook', timestamp: 2, displayRole: 'system' },
  { role: 'user', content: 'visible', timestamp: 3 },
];

const result = await replay.replay(messages, {
  showSystemMessages: true,
  onMessage: (m) => console.log(m.content),
});
// Prints: real-system-prompt, visible
// result.skippedMessages === 1
```

## MCP Apps API (experimental)

Introduced in 1.21.4 (port of kilocode `36c57c12c`, tightened by `c02134ab4` and `b7069922d`). Wraps `McpClientManager` in a thin API that presents each connected server as an "app" with `listResources` and `callTool` verbs. Gated behind `ALEXI_EXPERIMENTAL_MCP_APPS=1`; the exports are always available for feature detection.

```typescript
// src/mcp/apps.ts (re-exported via src/mcp/index.ts under prefixed names)

export const MCP_APPS_ENV_FLAG = 'ALEXI_EXPERIMENTAL_MCP_APPS';
export function isMCPAppsEnabled(): boolean;

export interface MCPResource {
  uri?: string;
  name?: string;
  mimeType?: string;
  [key: string]: unknown;
}

export function listResources(
  server: string,
  manager?: McpClientManager
): Promise<MCPResource[]>;

export function callTool(
  server: string,
  tool: string,
  args: Record<string, unknown>,
  manager?: McpClientManager
): Promise<unknown>;

export class MCPAppsError extends Error {
  readonly operation: 'listResources' | 'callTool';
  readonly server: string;
  readonly tool?: string;
  override readonly cause: unknown;
}
```

Re-exports from `src/mcp/index.ts` use prefixed names to avoid collision with the raw manager methods:

```typescript
export {
  isMCPAppsEnabled,
  listResources as mcpAppsListResources,
  callTool as mcpAppsCallTool,
  MCPAppsError,
  MCP_APPS_ENV_FLAG,
  type MCPResource,
} from './apps.js';
```

All errors are normalised to `MCPAppsError` so downstream HTTP handlers can render a stable envelope. Cross-module `instanceof` checks are avoided by matching on `name === 'MCPAppsError'`.

## Cerebras Completion-Token Cap API

Introduced in 1.21.4 (port of opencode `e49772a`). Cerebras enforces a hard cap of `32_768` on `max_completion_tokens`; higher values cause silent truncation without an error. The `CerebrasPlugin` (builtin) clamps any explicit `maxTokens` on a Cerebras-routed call to the documented ceiling.

```typescript
// src/plugin/cerebras.ts

/** Hard upper bound for max_completion_tokens on Cerebras deployments. */
export const CEREBRAS_MAX_COMPLETION_TOKENS = 32_768;

/**
 * True when the given provider/model identifier should be treated as
 * Cerebras. Both direct provider ids and prefixed model ids (e.g.
 * `cerebras/llama-3.1-70b`) are recognised.
 */
export function isCerebrasTarget(providerOrModel: string | undefined): boolean;

/**
 * Clamp a caller-supplied `maxTokens` value to the Cerebras ceiling.
 * Returns the original value unchanged for non-Cerebras targets or
 * when `maxTokens` is undefined / already within bounds.
 */
export function clampCerebrasMaxTokens(
  providerOrModel: string | undefined,
  maxTokens: number | undefined
): number | undefined;

export const CerebrasPlugin: Plugin;
```

Applicability: Alexi routes exclusively through SAP AI Core, so under normal operation there is no direct Cerebras provider. The plugin ships as a builtin because (1) SAP AI Core proxy deployments MAY expose a Cerebras-family model id (`cerebras-*`) which the guard catches, and (2) users running the fork behind a custom proxy that adds Cerebras get the cap for free. No-op for every non-Cerebras provider.

## Network Management

The `NetworkManager` provides automatic reconnection with exponential backoff:

```typescript
import { NetworkManager, NetworkError } from './core/network.js';

const manager = new NetworkManager({
  maxRetries: 5,        // Default: 5
  baseDelayMs: 1000,    // Default: 1000ms
  maxDelayMs: 30000,    // Default: 30000ms
});

manager.on('reconnect:attempt', ({ attempt, maxRetries }) => {
  console.log(`Reconnecting ${attempt}/${maxRetries}...`);
});

manager.on('reconnect:success', () => {
  console.log('Reconnected');
});

manager.on('reconnect:failed', ({ error }) => {
  console.error('Reconnection failed:', error.message);
});

// Trigger reconnection
await manager.reconnect();

// Query state
manager.isConnected();     // boolean
manager.isReconnecting();  // boolean
manager.getState();        // NetworkState
manager.cancelReconnect(); // Cancel in-progress reconnection
```

## Enhanced Tool Registry

The `EnhancedToolRegistry` supports dynamic prompt-based tool resolution:

```typescript
import { EnhancedToolRegistry } from './tool/registry.js';

const registry = new EnhancedToolRegistry();

// Register static tools
registry.register(myTool);

// Register a prompt resolver for dynamic tools
registry.registerPromptResolver('mcp', {
  resolve: async (context) => {
    // Return tools available for this session/agent context
    return await fetchMcpTools(context.sessionId);
  },
});

// Resolve all tools for a prompt context
const tools = await registry.resolveForPrompt({
  sessionId: 'session-123',
  agentId: 'code',
  permissions: ['read', 'write', 'execute'],
});
```

## Plugin Tool System

Plugin tools use a simplified interface with Promise-based `ask`:

```typescript
import { createPluginToolWrapper, type PluginToolDefinition } from './tool/plugin-tools.js';

const myPlugin: PluginToolDefinition = {
  name: 'my-plugin-tool',
  description: 'A plugin tool',
  schema: z.object({ query: z.string() }),
  execute: async (params, context) => {
    // context.ask returns a Promise (not an Effect)
    const answer = await context.ask('Confirm action?');
    return { success: true, data: { answer } };
  },
};

// Wrap for Alexi's tool system
const wrappedTool = createPluginToolWrapper(myPlugin);
```

## Error Handling

All CLI commands handle errors gracefully:

- Exit code `0`: Success
- Exit code `1`: Error (with error message)

TypeScript APIs use the `ToolResult` pattern:

```typescript
try {
  const result = await agenticChat(message, options);
  // Handle success
} catch (error) {
  if (error instanceof Error) {
    console.error(`Error: ${error.message}`);
  }
}
```

## Logging

```typescript
import { logger } from './utils/index.js';

logger.setLevel('debug');
logger.debug('Debug message', { context: 'value' });
logger.info('Info message');
logger.warn('Warning message');
logger.error('Error message', error);
logger.print('Raw output');  // Always outputs, for CLI display
```

| Level | Priority | Output |
|-------|----------|--------|
| `debug` | 0 | `[DEBUG] message` |
| `info` | 1 | `message` (no prefix) |
| `warn` | 2 | `[WARN] message` |
| `error` | 3 | `[ERROR] message` |

## TUI Tool-Call Rendering API

Introduced in 1.20.2. See `docs/ARCHITECTURE.md#tui-tool-call-disclosure` for the full flow.

### `ToolRow` component (`src/cli/tui/components/ToolRow.tsx`)

```typescript
export type ToolStatus = 'pending' | 'running' | 'completed' | 'failed';

export interface ToolRowProps {
  toolName: string;
  params: Record<string, unknown>;
  status: ToolStatus;
  output: string | null;
  error: string | null;
  isExpanded: boolean;
  onToggle: () => void;
  diff: DiffData | null;
  /** Duration in ms (set on completion) */
  duration?: number;
}

export function ToolRow(props: ToolRowProps): React.JSX.Element;
```

`ToolCallBlock` is retained as a thin wrapper — `type ToolCallBlockProps = ToolRowProps` and the component delegates to `ToolRow` — so existing callers do not need to change.

### `formatToolOutput` helpers (`src/cli/tui/utils/formatToolOutput.ts`)

Pure string helpers, unit-testable without an Ink render harness.

```typescript
export function formatBashCommand(command: string): string;

export interface TruncatedOutput {
  text: string;
  truncated: boolean;
  remaining: number;
}
export function truncateOutput(
  text: string,
  maxLines?: number, // default 20
  keepLines?: number // default 15
): TruncatedOutput;

export function formatParamsPreview(
  params: Record<string, unknown>,
  maxLen?: number // default 50
): string;

export function formatDuration(ms: number): string;

export function guessLanguageFromPath(filePath: string): string | undefined;
```

`guessLanguageFromPath` supports `ts`, `tsx`, `js`, `jsx`, `mjs`, `cjs`, `json`, `md`, `yml`, `yaml`, `sh`, `bash`, `py`, `rb`, `go`, `rs`, `java`, `css`, `scss`, `html`, `xml`, `toml`. Returns `undefined` for unknown extensions so callers can fall back to plain text.

### `linkify` helper (`src/cli/tui/utils/linkify.ts`)

Pure string transform that auto-detects URLs and `path:line` references in raw tool output and wraps every match in an OSC-8 hyperlink escape sequence via the shared `hyperlink()` helper. Applied by `ToolRow` immediately before Ink renders the tool body (both the bash-output branch and the generic-output branch).

```typescript
export function linkify(text: string, cwd?: string): string;
```

Parameters:
- `text` — raw tool output. Multiline input is supported; matches are detected line-by-line as part of the same pass.
- `cwd` — base directory for resolving relative file paths in `path:line` matches. Defaults to `process.cwd()`. Pass an explicit `cwd` from a test or from a caller running in a non-cwd context (agent worktree, `--workdir` invocation) so the generated `file://` URIs point at the intended paths.

Return value: a new string. When the terminal does not support OSC-8 hyperlinks (see `supportsHyperlinks()` below), the returned string is byte-identical to the input.

Two match categories are recognised, in the following precedence order:

1. **URL matches**: `/\b(https?:\/\/|file:\/\/)[^\s<>"']+/g`. Trailing sentence punctuation (`.,;:!?)]}>`) is stripped from the captured URL and re-appended as plain text after the OSC-8 wrap. Example: `See https://example.com.` linkifies `https://example.com` and leaves the period outside the escape.
2. **`path:line[:column]` matches**: the path segment must contain a `/` OR a `.` followed by 1-6 word characters (a file extension). This filters out timestamps, `host:port`, version strings, and `key: value` shapes. Relative paths are resolved via `path.resolve(cwd, filePath)` and rendered as `file://<absolute>#<line>` (or `#<line>:<column>`).

URL matches always win on overlap, so `https://example.com/foo/bar.ts:42` is treated as a single URL match and does not produce a nested `path:42` hyperlink.

### `createIncrementalLinkifier` helper (`src/cli/tui/utils/incrementalLinkify.ts`)

Streaming-friendly wrapper around `linkify()`. Added 2026-09-22 for issue #1807. `ToolRow` holds one instance per row so the bash-output branch amortises the URL / `path:line` regex scans over the lifetime of the tool call — only the newly-appended tail is scanned on each render instead of the entire (potentially large) buffer.

```typescript
export interface IncrementalLinkifier {
  /** Run the linkifier over `text`, reusing the cached prefix when possible. */
  (text: string): string;
  /** Discard cache — useful when the underlying tool row is reused. */
  reset(): void;
  /**
   * Introspection for tests: number of characters of `text` served from
   * cache on the most recent invocation. `0` means the whole buffer was
   * re-scanned (initial call or cache miss); a positive value proves
   * incremental behaviour.
   */
  lastCachedChars(): number;
}

export function createIncrementalLinkifier(cwd?: string): IncrementalLinkifier;
```

Correctness invariant: for any single call, the returned linkifier is a drop-in replacement for `(text) => linkify(text, cwd)` — same output for the same input. Amortised cost is O(delta) per call, where `delta` is the number of characters appended since the last call.

Cache behaviour:

1. **Cache miss** — the incoming buffer is not a strict extension of the cached prefix (buffer shrank, first call, unrelated content). The linkifier does a full `linkify(text, cwd)` and freezes the prefix up to the last `\n`. `lastCachedChars()` returns `0`.
2. **Cache hit** — the incoming buffer is a strict extension of the cached prefix. The linkifier concatenates the cached transformed prefix with `linkify(tail, cwd)` and advances the commit point to the last `\n` in the tail. `lastCachedChars()` returns the number of prefix characters served from cache.
3. **Empty input** — returns `''` and does not touch the cache.
4. **`reset()`** — clears both `committedRaw` and `committedTransformed`. Next call is a full scan.

`ToolRow` usage (both the bash-output branch and the generic-output branch, `src/cli/tui/components/ToolRow.tsx:202` / `:212`):

```tsx
const linkifierRef = useRef<IncrementalLinkifier | null>(null);
const linkifier = useMemo(() => {
  if (linkifierRef.current === null) {
    linkifierRef.current = createIncrementalLinkifier();
  }
  return linkifierRef.current;
}, []);
// ... inside render:
<Text color={colors.toolOutput}>{linkifier(truncatedText)}</Text>
```

Safety: because `linkify`'s regexes only match within a single line, splitting at the last `\n` in the cached prefix is guaranteed to produce identical output to a full scan. The linkifier deliberately never caches an open (non-newline-terminated) tail — the still-growing final line is re-linkified on each call.

### `hyperlink` helper (`src/cli/tui/utils/hyperlink.ts`)

OSC-8 escape sequence wrapper. Called by `linkify()` per match; consumers rarely need to call it directly.

```typescript
export function hyperlink(url: string, label?: string): string;
export function supportsHyperlinks(stream?: NodeJS.WriteStream): boolean;
```

`supportsHyperlinks()` returns `true` when:
- `FORCE_HYPERLINK=1` is set, OR
- `NO_HYPERLINK=1` is NOT set, `stream.isTTY` is `true`, AND one of:
  - `TERM_PROGRAM` is in the allow-list: `iTerm.app`, `WezTerm`, `ghostty`, `Apple_Terminal`, `vscode`, `cursor`, `Hyper`, `WarpTerminal`.
  - `TERM` contains `kitty`.
  - `WT_SESSION` is set (Windows Terminal).

When `supportsHyperlinks()` returns `false`, `hyperlink(url)` returns `url` and `hyperlink(url, label)` returns `label (url)` (or just `url` when `label === url`). When `true`, the return value is `ESC]8;;<url>ESC\<label>ESC]8;;ESC\` — the standard OSC-8 wrap.

## Per-Task Model Selection API

Introduced 2026-08-31 (ports upstream opencode/kilocode `ab143253a`). Shared model-resolution helpers reused by the `task` and `agent_manager` tools. Gated on `experimental.task_model_selection` in `~/.alexi/config.json` (default `false`).

```typescript
// src/tool/model-selection.ts

export type Candidate = {
  providerID: string;
  model: { id: string; name: string };
};

export type Source = { model: string; variant?: string };

export type SelectedModel = { providerID: string; modelID: string };

export type SelectModelError = { error: string };

/**
 * Enumerate every (providerID, model) pair known to Alexi.
 * Alexi ships one runtime provider (sap-ai-core), so every catalog
 * entry is emitted with providerID = 'sap-ai-core'.
 */
export function candidates(): Candidate[];

/**
 * Resolve a free-form query to matching candidates.
 * Precedence: exact providerID/modelID > exact model.name > fuzzy token match.
 * Fuzzy match splits the query on whitespace and requires every token to
 * appear in at least one haystack (order-independent, case-insensitive).
 */
export function lookup(
  all: Candidate[],
  value: string
): { pool: Candidate[]; names: string[] };

/**
 * Resolve a model source to a concrete (providerID, modelID) pair.
 * Provider preference order:
 *   1. Explicit source.variant (e.g. 'sap-ai-core')
 *   2. preferredProviderID (caller's current-turn provider)
 *   3. First candidate in the resolved pool
 *
 * Returns SelectModelError on:
 *   - empty pool: `No model matches "..."`
 *   - multiple distinct names: `Ambiguous model "..." — candidates: a, b, c`
 */
export function selectModel(
  source: Source,
  preferredProviderID?: string
): SelectedModel | SelectModelError;

/** Type guard narrowing to the error branch. */
export function isSelectModelError(
  r: SelectedModel | SelectModelError
): r is SelectModelError;
```

Config helpers in `src/config/userConfig.ts`:

```typescript
/**
 * Read the experimental.task_model_selection flag. Non-boolean or
 * missing values fall back to false.
 */
export function getConfigTaskModelSelection(): boolean;

/**
 * Persist the experimental.task_model_selection flag. Merges into
 * the existing `experimental` object without clobbering other flags.
 */
export function setConfigTaskModelSelection(enabled: boolean): void;
```

### `task` tool parameters

The `task` tool (`src/tool/tools/task.ts`) accepts three optional nullable fields alongside the existing `prompt`, `description`, `subagent_type`, `task_id`, and `background`:

| Parameter          | Type                          | Description                                                                 |
| ------------------ | ----------------------------- | --------------------------------------------------------------------------- |
| `model`            | `string \| null`              | Model name or `provider/id`. Requires `experimental.task_model_selection`.  |
| `provider`         | `string \| null`              | Provider ID to disambiguate. Requires `model` to be set.                    |
| `reasoning_effort` | `'low' \| 'medium' \| 'high'` | Reasoning-effort hint for reasoning-capable models. Requires the flag.      |

Error contract when the flag is off:

```typescript
{
  success: false,
  error: 'Per-task model selection is disabled. Set experimental.task_model_selection=true in ~/.alexi/config.json to allow subagents to override model/provider/reasoning_effort.'
}
```

Error contract when `provider` is supplied without `model`:

```typescript
{ success: false, error: 'task.provider requires task.model to be set' }
```

On success, `TaskResult` surfaces the resolved pair:

```typescript
interface TaskResult {
  taskId: string;
  agentId: string;
  response: string;
  completed: boolean;
  status?: TaskStatus;
  background?: boolean;
  usage?: TaskUsageSummary;
  /** Resolved provider-native model id when `params.model` was supplied. */
  model?: string;
  provider?: string;
  reasoning_effort?: 'low' | 'medium' | 'high';
}
```

### `agent_manager` tool `config.provider`

The `config` object in the `agent_manager` `create` action now accepts a `provider` field alongside `mode`, `model`, and `excludeLocalState`:

```typescript
{
  action: 'create',
  config: {
    mode?: string | null,
    model?: string | null,
    provider?: string | null,  // requires model when set
    excludeLocalState?: boolean | null,
  }
}
```

When `config.model` is set, resolution runs through `selectModel()` and the resolved pair is surfaced on the response:

```typescript
{
  action: 'create',
  session: {
    id: 'session-<timestamp>',
    status: 'created' | 'created-fresh',
    model?: string,     // resolved provider-native modelID
    provider?: string,  // resolved providerID
  },
  message: string,
}
```

### `open_plan` tool

`src/tool/tools/open-plan.ts` signals that an agent-authored plan file is ready for review. Ports upstream kilocode `6024a76db feat(vscode): open agent-created plans` and `325656483 fix(vscode): scope plan opens to active session`. Upstream the tool asks the VSCode host to open a plan in an editor pane; Alexi has no VSCode webview, so the port adapts the semantics to a CLI/CI-safe "notify plan-ready" signal — the tool intentionally does NOT try to spawn an editor process. Registered in `src/tool/tools/index.ts` alongside the other built-ins.

Parameter schema (Zod):

```typescript
const OpenPlanParamsSchema = z.object({
  path: z.string().describe('Absolute or workspace-relative path to the plan markdown file'),
  title: z.string().optional().describe('Optional human-readable title'),
});

export interface OpenPlanResult {
  path: string;
  title: string;
}
```

Behaviour:

1. Resolves `path` against `context.workdir` (or `process.cwd()` when the context has no workdir). Absolute paths are used as-is.
2. Validates the target with `fs.stat`. Missing file, directory, or symlink-to-nothing returns `{ success: false, error: 'Plan file not found: <resolved>' }`.
3. Enforces the `.md` extension. Non-markdown targets return `{ success: false, error: 'Plan must be a markdown file: <resolved>' }`.
4. Defaults `title` to `path.basename(resolved)` when the caller omits it.
5. Publishes a `plan.opened` event on the shared bus (see [plan.opened event](#planopened-event) below). Publish failures are swallowed with `try/catch` because the notification is not a correctness dependency of the tool.
6. Returns `{ success: true, data: { path: <resolvedAbsolute>, title } }` to the calling agent.

Example call:

```typescript
const result = await openPlanTool.executeUnsafe(
  { path: 'docs/plan.md', title: 'Refactor plan' },
  { workdir: '/repo', sessionId: 'session-123' }
);
// result.data = { path: '/repo/docs/plan.md', title: 'Refactor plan' }
```

#### `plan.opened` event

Exported as `PlanOpened` from `src/tool/tools/open-plan.ts` via `defineEvent` on the shared bus. Payload schema:

```typescript
export const PlanOpened = defineEvent(
  'plan.opened',
  z.object({
    sessionId: z.string().optional(),
    path: z.string(),        // resolved absolute path
    title: z.string().optional(),
    timestamp: z.number(),   // Date.now() at publish time
  })
);
```

Subscribers register via `PlanOpened.subscribe(handler)` and receive an `unsubscribe` function. Typical consumers: the Ink TUI to render a plan-ready banner, SAP integration hooks to attach the plan to an issue, external CI listeners to gate a stage on plan review.

### `agent_manager_models` tool

Discovery tool for enumerating models available to subagents. Registered in `src/tool/tools/index.ts` alongside `agent_manager`.

**Parameters (all optional, all nullable):**

| Parameter | Type              | Default | Description                                                                                    |
| --------- | ----------------- | ------- | ---------------------------------------------------------------------------------------------- |
| `query`   | `string \| null`  | `''`    | Case-insensitive token match against `modelName`, providers, and `provider/id` strings.        |
| `offset`  | `number \| null`  | `0`     | Pagination offset.                                                                             |
| `limit`   | `number \| null`  | `50`    | Pagination limit (max 50).                                                                     |

**Response when the flag is off:**

```typescript
{
  enabled: false,
  message: 'Model catalog listing is disabled. Set experimental.task_model_selection=true in ~/.alexi/config.json to enable per-task model selection.'
}
```

**Response when the flag is on:**

```typescript
{
  enabled: true,
  models: Array<{
    modelName: string;
    providers: string[];  // unique provider IDs offering this model
    ids: string[];        // qualified provider/id strings
  }>,
  offset: number,
  total: number,
  nextOffset?: number,   // absent on the last page
  hint: string,          // AGENT_MANAGER_MODELS_HINT
}
```

## Session Prompt Facade API

New helper module (`src/cli/session/prompt.tsx`) providing a lightweight normalization layer between the TUI and the streaming orchestrator. Introduced 2026-08-31 to match upstream opencode `packages/opencode/src/session/prompt.ts`.

```typescript
export interface SendPromptOptions {
  /** The prompt text as entered by the user (post-trim). */
  text: string;
  /**
   * Optional model override — when experimental.task_model_selection is
   * enabled, subagent prompts can pin a specific model. Ignored otherwise.
   */
  model?: string;
  /** Optional provider hint accompanying model. */
  provider?: string;
  /** Optional reasoning effort hint for reasoning-capable models. */
  reasoning_effort?: 'low' | 'medium' | 'high';
}

/**
 * Normalize a prompt payload for dispatch into the active session.
 * Currently returns options unchanged (text is trimmed); the real
 * dispatch is owned by src/core/streamingOrchestrator.ts.
 */
export function sendPrompt(options: SendPromptOptions): SendPromptOptions;
```

The facade exists so the TUI can hand off a normalized payload without importing the orchestrator directly, keeping the render layer testable in isolation.

## Agent Permission Expansion API

Introduced in 1.20.2. Path in agent config files may use `~` / `~/foo` shorthand; this module normalizes them against `$HOME` before they reach the permission matcher.

```typescript
// src/agent/permissions-expand.ts

export const PATH_ACTIONS = ['external_directory', 'read', 'edit'] as const;
export type PathAction = (typeof PATH_ACTIONS)[number];

export interface AgentPermissionEntry {
  action: string;
  path?: string;
  [key: string]: unknown;
}

export function normalizePermissionPath(p: string, home: string): string;

export function expandPermissions<T extends AgentPermissionEntry>(
  entries: ReadonlyArray<T>,
  home?: string // defaults to os.homedir()
): T[];
```

Entries whose `action` is not in `PATH_ACTIONS` pass through unchanged. Rules with an unrecognised action pass through unchanged.

## Session Retry API

Introduced in 1.20.2. Bounded exponential backoff with full jitter.

```typescript
// src/core/session/retry.ts

export interface RetryOptions {
  /** Maximum number of attempts (including the first). Default: 8. */
  maxAttempts?: number;
  /** Initial delay in ms before the first retry. Default: 500. */
  baseMs?: number;
  /** Upper bound on any single delay in ms. Default: 30 000. */
  maxMs?: number;
  /** When true (default), apply full jitter. */
  jitter?: boolean;
}

export function computeDelay(attempt: number, opts?: RetryOptions): number;

export function withRetry<T>(
  fn: (attempt: number) => Promise<T>,
  shouldRetry: (err: unknown) => boolean,
  opts?: RetryOptions
): Promise<T>;
```

The `shouldRetry` predicate is supplied by the caller. The transient-vs-permanent classifier lives in `src/core/error-backoff.ts` and is documented in `AGENTS.md#error-classification-retry-vs-config-fix`.

## Database Migration API

Introduced in 1.20.2. Serialized migration application with primary-key-safe re-check inside the transaction.

```typescript
// src/core/database/migration.ts

export interface Migration {
  id: string;
  up: (tx: MigrationTx) => Promise<void>;
}

export interface MigrationTx {
  has(id: string): Promise<boolean>;
  record(id: string): Promise<void>;
}

export interface MigrationDb {
  transactionImmediate<T>(fn: (tx: MigrationTx) => Promise<T>): Promise<T>;
  completedIds(): Promise<Set<string>>;
}

export async function applyMigrations(
  db: MigrationDb,
  migrations: readonly Migration[]
): Promise<void>;
```

Callers implement `MigrationDb`/`MigrationTx` against their SQL adapter of choice (better-sqlite3, effect-sql, raw pg). `transactionImmediate` MUST issue the equivalent of `BEGIN IMMEDIATE` (SQLite) or set the isolation level to serialize (Postgres) so the re-check inside the transaction is meaningful.

## Filesystem Watcher API

Introduced in 1.20.2. VCS-guarded and gated behind an experimental flag. Extended in 1.21.4 with the `InstanceWatcher` class for per-session scoping.

```typescript
// src/core/filesystem/watcher.ts

export interface WatchLocation {
  directory: string;
  vcs: boolean;
}

export function isExperimentalFileWatcherEnabled(): boolean;

export function maybeStartFileWatcher(
  location: WatchLocation,
  subscribe: (dir: string) => () => void
): (() => void) | null;

/**
 * Per-instance watcher registry (kilocode `b8984e468`). Prefer over the
 * module-level `startWatcher` shim for new code.
 */
export class InstanceWatcher {
  start(location: WatchLocation, subscribe: (dir: string) => () => void): (() => void) | null;
  stop(directory: string): boolean;
  has(directory: string): boolean;
  size(): number;
  setDebounceTimer(directory: string, timer: ReturnType<typeof setTimeout>): void;
  dispose(): void;
}

/** Backwards-compatible shim — delegates to the module-level default instance. */
export function startWatcher(
  location: WatchLocation,
  subscribe: (dir: string) => () => void
): (() => void) | null;

/** Test-only accessor for the default instance. */
export function getDefaultWatcherInstance(): InstanceWatcher;
```

`maybeStartFileWatcher` returns a disposer or `null` when the watcher was skipped. Enable via `ALEXI_EXPERIMENTAL_FILEWATCHER=1`; callers must have already confirmed VCS metadata is present (`location.vcs = true`) before invoking.

`InstanceWatcher.start` is idempotent per directory — a second call for the same directory returns the existing disposer without invoking `subscribe` again. `stop(directory)` only tears down the requested directory and returns `true` if a watch was disposed. `dispose()` is safe to call multiple times: it clears every debounce timer first, then iterates a snapshot of `watchers.values()` and invokes each disposer.

## Error Backoff API

`src/core/error-backoff.ts` exposes error classifiers that higher-level retry drivers use to decide whether a failure is worth another attempt. Extended in 1.21.4 with `isXAICapacityError` and `isRetryableError` (port of opencode `71d08e9`).

```typescript
// src/core/error-backoff.ts

/** True for free-tier or paid-tier rate limits, or HTTP 429. */
export function isRateLimitError(err: unknown): boolean;

/**
 * True when `err.message` matches /xai.*capacity|capacity.*exceeded/i.
 * xAI (and some SAP proxies fronting xAI-family models) occasionally
 * emits a mid-stream "capacity exceeded" error that is semantically the
 * same as a 5xx transient overload — retrying with backoff clears it.
 * Detection is structural (message regex) because the upstream API does
 * not attach a stable machine-readable code.
 */
export function isXAICapacityError(err: unknown): boolean;

/**
 * Coarse "is this transient?" check. True when `isRateLimitError(err)`
 * OR `isXAICapacityError(err)` returns true. False for `null` /
 * `undefined` and for permanent auth failures. Extend cautiously — a
 * false positive means real config failures get retried and waste
 * provider budget.
 */
export function isRetryableError(err: unknown): boolean;

/** Extract a Retry-After window and convert to milliseconds. */
export function getRetryAfterMs(err: unknown): number | undefined;

/** Extract `status: NNN` from a raw error message (4xx / 5xx only). */
export function extractStatusCode(err: unknown): number | undefined;

/** True for auth failures that will NOT recover on retry. */
export function isPermanentAuthFailure(err: unknown): boolean;
```

Example — gate a retry loop on `isRetryableError`:

```typescript
import { isRetryableError, getRetryAfterMs } from './core/error-backoff.js';

async function callWithRetry<T>(fn: () => Promise<T>, maxAttempts = 3): Promise<T> {
  let lastErr: unknown;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      if (!isRetryableError(err) || attempt === maxAttempts) {
        throw err;
      }
      const wait = getRetryAfterMs(err) ?? Math.min(1000 * 2 ** (attempt - 1), 30_000);
      await new Promise((r) => setTimeout(r, wait));
    }
  }
  throw lastErr;
}
```

## Config Instance Cache Invalidation API

Introduced in 1.20.2. Ports kilocode `19a2a3c4d`.

```typescript
// src/config/invalidation.ts

type InstanceCacheDisposer = () => void;

export function registerInstanceCache(dispose: InstanceCacheDisposer): () => void;
export function invalidateGlobalConfig(): void;
/** @internal test/debug helper */
export function _instanceCacheCount(): number;
```

`updateGlobal(updates, { dispose: true })` in `src/config/userConfig.ts` calls `invalidateGlobalConfig()` after writing the updated config to disk. Pass `dispose: false` to suppress the flush.

## Shared Agent Board API

Introduced 2026-09-03 (`1.22.10`, ports upstream kilocode `162e30d23`). Task-scoped coordination channel for multi-agent swarms.

**Config-key promotion (1.22.21, 2026-09-15 upstream sync — ports kilocode `1c33649f9`, `c63f77c2e`, `50fc57db0`, `6cfb025f9`):** the setting has moved out of `experimental.*` to the top-level `sharedAgentBoard` key and its default is now `true` (previously `false`). Legacy `experimental.sharedAgentBoard` is still accepted with a one-time deprecation warning.

### Config helpers (`src/config/userConfig.ts`)

```typescript
/**
 * Read the sharedAgentBoard flag. Resolution order:
 *   1. Top-level `sharedAgentBoard` (new preferred location).
 *   2. Legacy `experimental.sharedAgentBoard` (one-time deprecation warning).
 *   3. Default `true`.
 */
export function getConfigSharedAgentBoard(): boolean;

/**
 * Persist the shared-agent-board flag to the top-level `sharedAgentBoard`
 * key. Also removes any legacy `experimental.sharedAgentBoard` entry so
 * the config file converges on the new shape on the next write. If
 * `experimental` becomes empty after the deletion, the parent key is
 * removed as well.
 */
export function setConfigSharedAgentBoard(enabled: boolean): void;

/**
 * Test-only. Resets the once-per-process deprecation-warning latch so
 * consecutive fixtures can each observe the warning without spawning a
 * fresh process. Marked `@internal`; production code must not call it.
 */
export function _resetSharedAgentBoardDeprecationWarningLatchForTests(): void;
```

### BoardStore (`src/core/database/boardStore.ts`)

SQLite-backed persistence at `~/.alexi/board.db`. Degrades gracefully when the native `better-sqlite3` binding is unavailable (empty reads, no-op writes).

```typescript
export interface BoardMessage {
  id: string;
  boardId: string;
  sessionID: string;
  author: string;
  content: string;
  createdAt: string;
}

export interface BoardWriteInput {
  sessionID: string;
  author: string;
  content: string;
}

export interface BoardReadOptions {
  /** ISO timestamp — only return messages strictly newer than this. */
  since?: string;
  /** Maximum number of messages to return. Defaults to 50. */
  limit?: number;
}

export const BoardStore: {
  /** Idempotent board creation. Safe to call on every access. */
  ensure(boardId: string, taskId: string): Promise<void>;

  /** Append a message. Returns the fully-formed row with a randomUUID id. */
  write(boardId: string, input: BoardWriteInput): Promise<BoardMessage>;

  /** Read messages in chronological order. Optional strict-greater-than since filter. */
  read(boardId: string, opts?: BoardReadOptions): Promise<BoardMessage[]>;

  /**
   * Mark messages as read by a specific session. Ports kilocode fix
   * 162e30d23 — without this, agents keep seeing the same "new
   * messages" banner on every turn.
   */
  acknowledgeReads(
    boardId: string,
    sessionID: string,
    messageIds: readonly string[]
  ): Promise<void>;

  /** Test-only. Production code MUST NOT call. */
  __resetForTests(): void;
};
```

### BoardContext (`src/core/database/boardContext.ts`)

In-memory `Map<sessionID, boardID>` resolver. Populated by the `task` tool when spawning a swarm; consumed by the board tools to look up which board they should write to.

```typescript
export const BoardContext: {
  /** Attach a session to a board. Idempotent; overwrites existing mapping. */
  attach(sessionID: string, boardId: string): void;

  /** Resolve a session to its board id, or undefined if not in a swarm. */
  resolve(sessionID: string | undefined): Promise<string | undefined>;

  /** Detach on session close. Safe to call on unknown sessions. */
  detach(sessionID: string): void;

  /** Test-only. */
  __resetForTests(): void;
};
```

### Tools

Both tools accept a Zod-validated params schema and follow the standard `defineTool` contract. Registered by `registerBuiltInTools()` in `src/tool/tools/index.ts` only when `getConfigSharedAgentBoard()` returns `true`.

**`kilo_board_read`** — `src/tool/tools/board.ts:51`

```typescript
const BoardReadParamsSchema = z.object({
  since: z.string().datetime().optional()
    .describe('Read messages posted strictly after this ISO 8601 timestamp'),
  limit: z.number().int().positive().max(100).optional()
    .describe('Maximum number of messages to return (default 50, cap 100)'),
});

interface BoardReadResult {
  messages: BoardMessage[];
  boardId?: string;
}
```

Behaviour:

- Resolves `boardId` via `BoardContext.resolve(context.sessionId)`.
- When no board is attached, returns `{ success: true, data: { messages: [] }, hint: 'No shared board is attached to this session.' }`.
- Otherwise calls `BoardStore.read(boardId, { since, limit: params.limit ?? 50 })`, then `BoardStore.acknowledgeReads(boardId, context.sessionId, messages.map(m => m.id))` to suppress stale-banner re-surfacing.
- Returns `{ success: true, data: { messages, boardId }, metadata: { count, boardId } }`.

**`kilo_board_write`** — `src/tool/tools/board.ts:129`

```typescript
const BoardWriteParamsSchema = z.object({
  content: z.string().min(1).max(4000)
    .describe('Message body to post to the shared board (1-4000 chars)'),
  // Added 2026-09-11 (1.22.17, ports kilocode 7febec58f).
  recipient: z.string().optional()
    .describe(
      'Optional session id of a specific peer subagent this message targets. ' +
        'When set, the tool warns if that subagent is stopped or does not exist.'
    ),
});

interface BoardWriteResult {
  messageId: string;
  boardId: string;
  /** Delivery hint. `'no-recipient'` means the target subagent is stopped or missing. */
  deliveryStatus?: 'delivered' | 'no-recipient';
}
```

Behaviour:

- Resolves `boardId` the same way.
- When no board is attached, returns `{ success: false, error: 'No shared board is attached to this session — cannot post.' }`.
- When `recipient` is set, the tool scans the most recent 100 messages on the board for any activity from the target session id. If none is found, `deliveryStatus` is set to `'no-recipient'` and a `hint` is attached (`Warning: recipient subagent "<id>" is stopped or does not exist. Message posted but will not be delivered.`). The message is still written — the parent orchestrator can decide how to react.
- Otherwise calls `BoardStore.write(boardId, { sessionID: context.sessionId ?? 'unknown', author: context.agentName ?? 'agent', content })`.
- Returns `{ success: true, data: { messageId, boardId, deliveryStatus }, metadata: { messageId, boardId, deliveryStatus }, hint? }`.

### `BoardStore.reset(boardId)` (kilocode PR #13782, 1.22.17)

```typescript
/**
 * Hide every message currently on the board from future `read()` calls
 * without deleting rows. Idempotent — repeat calls push the watermark
 * forward. Stored as Unix milliseconds on `kilo_board.cleared_seq`.
 */
BoardStore.reset(boardId: string): Promise<void>;
```

`read(boardId, opts)` now consults `cleared_seq` and filters out rows whose `Date.parse(createdAt)` is `<=` the watermark. Rows with an unparseable `createdAt` are kept (fail-open) so a bad timestamp cannot permanently hide a message. When `cleared_seq <= 0` the filter path short-circuits with no per-row overhead.

### Unified enablement predicate (kilocode PR #14013, 1.22.17)

```typescript
// src/kilocode/board/enabled.ts
export function isBoardEnabled(experimentalConfigFlag?: boolean): boolean;
```

Returns `true` if ANY of:

1. `process.env.KILOCODE_EXPERIMENTAL_SWARM_BOARD` matches `1|true|yes|on` (case-insensitive).
2. The installation channel is `dev|beta|local` and the env variable is not explicitly set to a falsy value (`0|false|no|off`).
3. The caller passes the persisted `experimental.sharedAgentBoard` config flag as `true`.

An explicit falsy env value wins over the on-disk config. Callers can compose this with `getConfigSharedAgentBoard()` for a full three-signal check:

```typescript
import { isBoardEnabled } from './kilocode/board/enabled.js';
import { getConfigSharedAgentBoard } from './config/userConfig.js';

const enabled = isBoardEnabled(getConfigSharedAgentBoard());
```

### Enabling the tools

```typescript
import { setConfigSharedAgentBoard } from './config/userConfig.js';

setConfigSharedAgentBoard(true);
// Next process restart: kilo_board_read / kilo_board_write appear in the
// tool schema. Alexi does not hot-reload tools mid-turn.
```

Or edit `~/.alexi/config.json` directly (new preferred top-level shape, default is `true`):

```json
{
  "sharedAgentBoard": true
}
```

The legacy shape below is still accepted but emits a one-time deprecation warning when consulted (`[config] experimental.sharedAgentBoard is deprecated — move the setting to top-level "sharedAgentBoard" in ~/.alexi/config.json`) and is removed on the next `setConfigSharedAgentBoard()` write:

```json
{
  "experimental": {
    "sharedAgentBoard": true
  }
}
```

See [CONFIGURATION.md — Experimental Shared Agent Board](CONFIGURATION.md#experimental-shared-agent-board) for the operator guide and [ARCHITECTURE.md — Shared Agent Board](ARCHITECTURE.md#shared-agent-board-srccoredatabaseboardstorets) for the design notes and Mermaid diagram.

## Bedrock Model ID Resolution (`src/providers/bedrock-model-id.ts`)

Introduced 2026-09-11 (`1.22.17`, ports opencode `ac1758c`). Standalone Bedrock model-id classifier for future direct Bedrock integrations and SAP AI Core deployment mapping. Alexi does not ship a native Bedrock provider yet, but SAP AI Core transparently proxies Anthropic-on-Bedrock and other Bedrock-backed deployments.

```typescript
/**
 * Return the effective Bedrock model id given the caller's requested id
 * and target region. Idempotent: passing an already-resolved id yields
 * the same id back.
 *
 * @param modelID - Bedrock model id (short form, cross-region form, or ARN).
 * @param region  - AWS region (`us-east-1`, `eu-west-1`, ...). Defaults to `us-east-1`.
 */
export function resolveBedrockModelID(
  modelID: string,
  region: string | undefined
): string;
```

Resolution rules, in order:

1. ARN model IDs (`arn:aws:bedrock:...`) are pre-resolved — pass through unchanged. Injecting a `us.` / `eu.` / ... prefix in front of an ARN produces a malformed string that Bedrock rejects.
2. Explicit cross-region prefixes (`global.`, `us.`, `eu.`, `jp.`, `apac.`, `au.`) are respected — pass through unchanged.
3. In `us-*` regions (excluding `us-gov-*`), the `us.` prefix is prepended when the id contains any of `nova-micro`, `nova-lite`, `nova-pro`, `nova-premier`, `nova-2`, `claude`, `deepseek.r1`, `deepseek-r1`. `deepseek.v3.2` and newer DeepSeek variants are region-local and MUST NOT be prefixed.
4. All other regions: no automatic prefixing. Callers wanting cross-region inference must set the prefix explicitly.

## PTY Latch (`src/core/kilocode/pty/latch.ts`)

Introduced 2026-09-11 (`1.22.17`, ports kilocode `203f19f5d`). Dependency-free helper for buffering emissions from a short-lived event source until a listener attaches. See [ARCHITECTURE.md — PTY Latch](ARCHITECTURE.md#pty-latch-srccorekilocodeptylatchts) for design notes.

```typescript
export interface PtyLatch<T> {
  emit(value: T): void;
  attach(listener: (value: T) => void): () => void;
}

export function createPtyLatch<T>(): PtyLatch<T>;
```

Contract:

- `emit(value)` delivers synchronously when a listener is attached; otherwise buffers in FIFO order.
- `attach(listener)` flushes the buffer synchronously in emission order before returning. Returns a detach function.
- Detaching re-enables buffering — late reattach receives values emitted while unattached.
- The flush loop halts early if the listener re-assigns itself mid-drain; remaining buffered values stay for the next `attach()`.

## Auxiliary-Task Model Selection (`src/providers/model-selection.ts`)

Introduced 2026-09-12 (`1.22.18`, ports upstream kilocode `1e73d3862` + opencode provider.ts `+14/-3`). Decides which model to use for background tasks (title, summary, compaction, commit-message). Re-exported from `src/providers/index.ts` so callers `import { getAuxiliaryModelId, selectModelForTask } from './providers/index.js'`.

```typescript
export type TaskKind = 'primary' | 'auxiliary';

export interface ProviderContext {
  providerID: 'sap-ai-core' | 'kilo';
  defaultModel: string;
  smallModelDeployment?: string;
  hasKiloCredentials: () => boolean | Promise<boolean>;
  hasSapDeployment: (tier: 'small') => boolean | Promise<boolean>;
}

export interface ModelRef {
  providerID: 'sap-ai-core' | 'kilo';
  modelID: string;
}

export interface GetModelOptions {
  auxiliary?: boolean;
}

export function resolveSmallModelDeployment(): string | undefined;
export function buildContext(): ProviderContext;
export function selectModelForTask(
  task: TaskKind,
  context: ProviderContext
): Promise<ModelRef>;
export function getModel(
  modelID?: string,
  opts?: GetModelOptions
): Promise<ModelRef>;
export function getAuxiliaryModelId(): Promise<string>;
```

Behaviour, in order:

1. `task === 'primary'` — always returns `{ providerID, modelID: defaultModel }`.
2. `task === 'auxiliary'` AND `providerID === 'kilo'` AND `hasKiloCredentials()` truthy — returns `{ providerID: 'kilo', modelID: 'kilo-auto' }`. (Never fires in Alexi's SAP-first configuration.)
3. `task === 'auxiliary'` AND `smallModelDeployment` non-empty AND `hasSapDeployment('small')` truthy — returns `{ providerID: 'sap-ai-core', modelID: smallModelDeployment }`.
4. Otherwise — safe fallback: `{ providerID, modelID: defaultModel }`. Guarantees auxiliary calls NEVER fail with `deployment_not_found` on an unconfigured small deployment.

Convenience helpers:

- `getAuxiliaryModelId()` — returns just the string model id, ready to pass directly to `getProviderForModel` / `getProviderForModelWithFallback`.
- `getModel(modelID)` — when `modelID` is a non-empty string, returns it verbatim as a `sap-ai-core` `ModelRef` (explicit overrides always win).
- `getModel(undefined, { auxiliary: true })` — equivalent to `selectModelForTask('auxiliary', buildContext())`.

## Compaction Model Config Helpers (`src/config/userConfig.ts`)

Introduced 2026-09-12 (`1.22.18`, ports upstream kilocode `f64c6646d`). Config-file readers and writers for the auxiliary-task model id.

```typescript
export function getConfigCompactionModel(): string | undefined;
export function setConfigCompactionModel(modelId: string): void;
```

- **Read resolution order** (first non-empty wins):
  1. `models.compaction` in `~/.alexi/config.json` — canonical location.
  2. `context.compactionModel` — legacy; emits a one-shot per-process deprecation warning the first time it fires:
     `[alexi] config: \`context.compactionModel\` is deprecated; use \`models.compaction\` instead.`
- **Write behaviour:** always writes to `models.compaction`; if `context.compactionModel` is set, it is removed from the persisted file so subsequent reads never fall back to a stale value. Empty / whitespace-only ids throw `Error('compaction model id must be a non-empty string')`.
- **Test-only:** `_resetLegacyCompactionModelWarning()` — resets the one-shot warning cache so tests can re-observe the deprecation warning. Marked `@internal`; production code must not call it.

## Wakeup API

Introduced in 1.22.21 (2026-09-15 upstream sync, ports upstream kilocode commit `b7070e507`). Deferred-resume subsystem allowing an agent to schedule a future resume of its own session. See [ARCHITECTURE.md — Wakeup Subsystem](./ARCHITECTURE.md#wakeup-subsystem-srckilocodewakeup) for the storage model and lifecycle.

### `Wakeup` namespace (`src/kilocode/wakeup/index.ts`)

```typescript
export namespace Wakeup {
  export interface ScheduleOptions {
    sessionID: string;
    instanceID?: string;    // (2026-09-16) session-instance tag; matched on cancel
    when: string;           // ISO-8601 timestamp or relative duration ("5m", "1h", "30s", "2d")
    reason: string;         // Surfaced to the agent on resume
    payload?: Record<string, unknown>;
  }

  export interface CancelOptions {
    sessionID: string;
    instanceID?: string;    // (2026-09-16) stale-instance guard — cancel is a no-op if IDs mismatch
    wakeupID?: string;      // omit to bulk-sweep every pending wakeup for the session
    reason?: 'manual' | 'session-delete' | 'tool';
  }

  export function schedule(opts: ScheduleOptions): Promise<WakeupSchema.Entry>;
  export function cancel(opts: CancelOptions): Promise<{ cancelled: boolean; cancelledCount?: number }>;
  export function read(id: string): Promise<WakeupSchema.Entry | null>;
  export function list(sessionID?: string): Promise<WakeupSchema.Entry[]>;
  export function fireDue(now?: Date): Promise<WakeupSchema.Entry[]>;
}

export function normalizeWhen(when: string, now?: Date): string;
```

- `schedule` writes the entry to disk BEFORE returning (so a crash immediately after does not lose the scheduling intent) and publishes `WakeupScheduled` on the shared bus.
- `cancel` is idempotent, ownership-checked, and (since 2026-09-16) instance-scoped when `instanceID` is supplied. Cancelling an unknown, already-fired, foreign-session, foreign-instance, or already-cancelled wakeup returns `{ cancelled: false }` rather than throwing. Omitting `wakeupID` performs a bulk sweep of every pending wakeup for `sessionID` (optionally scoped to `instanceID`) and populates `cancelledCount` on the result. A single `WakeupCancelled` event is published per call.
- `fireDue` marks entries as `fired` on disk before handing them back and publishes `WakeupFired` for each. If the write fails, the entry stays `pending` and the next `fireDue` pass will retry.
- `normalizeWhen` accepts either an ISO-8601 timestamp or the relative form `<n>(ms|s|m|h|d)` (case-insensitive). Any other input throws `Error("Invalid wakeup 'when' value: …")`.

### Wakeup bus events (`src/bus/index.ts`)

Introduced in the 2026-09-16 sync. Ports upstream kilocode `packages/schema/src/kilocode/wakeup-event.ts`.

```typescript
export const WakeupScheduled: BusEvent<{
  wakeupID: string; sessionID: string; instanceID?: string;
  at: string; reason: string; timestamp: number;
}>;

export const WakeupCancelled: BusEvent<{
  wakeupID?: string;                                       // omitted for bulk sweeps
  sessionID: string; instanceID?: string;
  reason?: 'manual' | 'session-delete' | 'tool';
  cancelledCount?: number;                                 // >1 for bulk, 1 for single-id
  timestamp: number;
}>;

export const WakeupFired: BusEvent<{
  wakeupID: string; sessionID: string; instanceID?: string;
  at: string; reason: string; timestamp: number;
}>;
```

Publish errors are best-effort — every call site wraps the `.publish(...)` in `try { … } catch { logger.debug(...) }` so a broken subscriber cannot block the scheduling / cancel / fire code path.

### `WakeupSchema` (`src/kilocode/wakeup/schema.ts`)

```typescript
export namespace WakeupSchema {
  export const Status = z.enum(['pending', 'fired', 'cancelled']);
  export type Status = z.infer<typeof Status>;

  export const Entry = z.object({
    id: z.string(),
    sessionID: z.string(),
    instanceID: z.string().optional(),                     // (2026-09-16) session-instance tag
    at: z.string(),                                        // ISO-8601 fire time
    reason: z.string(),
    payload: z.record(z.string(), z.unknown()).optional(), // Zod v4 two-argument signature
    status: Status,
    createdAt: z.string(),
  });
  export type Entry = z.infer<typeof Entry>;
}
```

### `WakeupResume.resume` (`src/kilocode/wakeup/resume.ts`)

```typescript
export interface ResumeInstruction {
  sessionID: string;
  message: string;      // <system-reminder source="wakeup">…</system-reminder>
  payload?: Record<string, unknown>;
  wakeupID: string;
}

export namespace WakeupResume {
  export function resume(entry: WakeupSchema.Entry): ResumeInstruction;
}
```

Synchronous and side-effect-free so callers decide how the resume is delivered (production: SessionManager; tests: mocked bus).

### `schedule_wakeup` tool

Parameters:

| Param | Type | Description |
|-------|------|-------------|
| `when` | string | ISO-8601 timestamp (`"2026-09-15T12:00:00Z"`) or relative duration (`"5m"`, `"1h"`, `"30s"`, `"2d"`) |
| `reason` | string | Why the wakeup is scheduled — surfaced back to the agent on resume |
| `payload` | object? | Optional opaque payload delivered to the resumed session |

Requires an active `context.sessionId`; refuses with `success: false, error: 'schedule_wakeup requires an active session context'` when invoked outside a session.

Result:

```typescript
interface ScheduleWakeupResult {
  wakeupID: string;
  at: string; // normalized ISO-8601
}
```

Example:

```json
{
  "when": "1h",
  "reason": "Check status of SAP batch job Z_MASS_UPDATE_2026091501",
  "payload": { "jobId": "Z_MASS_UPDATE_2026091501" }
}
```

### `cancel_wakeup` tool

Parameters:

| Param | Type | Description |
|-------|------|-------------|
| `wakeupID` | string | ID of the wakeup to cancel (returned by `schedule_wakeup`) |

Same session gate as `schedule_wakeup`. Returns `{ cancelled, wakeupID }` — the `cancelled` flag distinguishes a real cancel from a no-op so agents can call it defensively without pre-checking the wakeup state.

Example (defensive cleanup pattern):

```json
{
  "wakeupID": "5d7ad3a4-2b96-4d09-8f8c-f8b8a9c1e2f3"
}
```

## Recall Tool API

The `recall` tool (`src/tool/tools/recall.ts`) searches through past session JSON files under `~/.alexi/sessions/` and returns the top-20 matches ranked by a weighted blend of signals. Ports upstream kilocode `02e92bcc6` (ranking rewrite) and `306b4ed6c` (fallback recovery). See [ARCHITECTURE.md — Recall Tool Ranking](./ARCHITECTURE.md#recall-tool-ranking-srctooltoolsrecallts) for the ranking formula and fast/slow-path fallback design.

### Parameters

```typescript
const RecallParamsSchema = z.object({
  query: z.string(),
  sessionLimit: z.number().optional(),          // default 10
  includeCurrentSession: z.boolean().optional(),// default false
  roles: z.array(z.enum(['user', 'assistant', 'system'])).optional(), // default ['user', 'assistant']
});
```

| Param | Default | Description |
|-------|---------|-------------|
| `query` | (required) | Search query string. Escaped via `escapeRegExp` before being compiled to a regex, so partial metacharacters cannot cause `SyntaxError` or runaway backtracking. |
| `sessionLimit` | `10` | Maximum number of sessions to search (most-recent first). |
| `includeCurrentSession` | `false` | Whether to include the current session (identified by `context.sessionId`) in results. |
| `roles` | `['user', 'assistant']` | Restrict recall to messages with these roles. |

### Result shape

```typescript
interface RecallHit {
  sessionId: string;
  messageId: string;                                      // "msg-<index>"
  role: 'user' | 'assistant' | 'system' | 'unknown';
  content: string;                                        // truncated to 500 chars
  relevance: number;                                      // 0-100
  timestamp: string;                                      // ISO-8601
}

interface RecallResult {
  results: RecallHit[];  // top 20 by relevance desc
  totalMatches: number;  // total match count across all searched sessions
}
```

- Unknown / missing roles are normalized to `'unknown'` and dropped from the default filter. A caller can opt them in by requesting `roles: ['user', 'assistant', 'system']`.
- The tool declares no permission — recall is a read-only operation on session history.
- When more than 20 matches exist, the returned `hint` reads `Found <n> matches, showing top 20 most relevant`.

### Ranking formula

```typescript
score = wbHits * 30 + Math.min(density * 10, 40) + roleBonus
// roleBonus: 'user' → +5, 'assistant' → +3, otherwise 0
// score is capped at 100
```

- **Word-boundary matches** (`\bfoo\b`) dominate — weight 30 per hit.
- **Substring density** (occurrences per 100 chars, capped at 40) is a tie-breaker.
- **Role bonus** nudges identical-content matches from user turns above system prompts.

### Example

```json
{
  "query": "SAP AI Core rate limit",
  "sessionLimit": 20,
  "roles": ["user", "assistant"]
}
```

## Kilocode-Preserved SQL Names (`src/core/database/migration.gen.ts`)

Introduced in 1.22.21 (2026-09-15 upstream sync). Exports the union of SQL identifiers introduced by `kilocode_change` migrations. Upstream sync scripts (`scripts/sync-upstream.sh`) MUST preserve any DDL that references one of these identifiers — dropping them silently on a sync would break board coordination, model-usage aggregation, or recall search performance.

```typescript
export const KILOCODE_PRESERVED_SQL_NAMES: readonly string[] = [
  'kilo_board',
  'kilo_board_message',
  'part_session_step_finish_idx',
  'recall_part_search_idx',
  'recall_message_role_idx',
];

export const KILOCODE_PRESERVED_SQL_REGEX =
  /kilo_board(?:_message)?|part_session_step_finish_idx|recall_(?:part_search|message_role)_idx/;
```

Any new SQL identifier introduced by a `kilocode_change` migration MUST be appended to `KILOCODE_PRESERVED_SQL_NAMES` and the regex must be updated in the same commit.

### `RecallMessageIndex` marker (`src/core/session/recall-message-index.ts`)

Documented shim for a future SQL-backed session store. Alexi persists sessions as JSON files today, so the covering index is not installed, but the DDL is kept verbatim so a future migration can drop it back in without hunting through history:

```typescript
export namespace RecallMessageIndex {
  export const name = 'recall_message_role_idx';
  export const createSql = `CREATE INDEX IF NOT EXISTS \`${name}\` ON \`message\` (\`id\`,json_extract("data", '$.role'),coalesce(json_extract("data", '$.parentID'), ''));`;
}
```

The index name is referenced by `KILOCODE_PRESERVED_SQL_REGEX` above so upstream syncs treat it as a kilocode change and do not drop it.

See [Configuration → Auxiliary-Task Model Selection](CONFIGURATION.md#auxiliary-task-model-selection-modelscompaction) for the operator-facing writeup and [Providers → Auxiliary-Task Model Selection](PROVIDERS.md#auxiliary-task-model-selection) for the runtime flow.

## Session Model Preference API (`src/core/modelPreference.ts`)

Introduced in the 2026-09-17 sync. Pure helpers that reconcile per-session model / effort choices with a `source` provenance field so an explicit user selection is never silently overwritten by a config default on subsequent turns. Callers wiring `/model`, `--model`, and TUI model-picker code paths MUST route through these helpers so the persistence guard engages. See [ARCHITECTURE.md — Session Model Preference Reconciliation](ARCHITECTURE.md#session-model-preference-reconciliation-srccoremodelpreferencets) for the design.

Public surface:

```typescript
import type { EffortLevel } from './effortLevel.js';

export type SessionModelPreferenceSource = 'user-explicit' | 'default' | 'inherited';

export interface SessionModelPreference {
  modelID: string;
  providerID: string;
  reasoningEffort?: EffortLevel;
  source: SessionModelPreferenceSource;
}

/**
 * Reconcile the current preference with an incoming update and a config default.
 * Pure — never mutates arguments. Safe to persist the return value directly.
 */
export function resolveSessionModelPreference(
  current: SessionModelPreference | undefined,
  incoming: Partial<SessionModelPreference> | undefined,
  configDefault: SessionModelPreference
): SessionModelPreference;

/** Attribute a preference to an explicit user selection. */
export function userExplicitPreference(
  modelID: string,
  providerID: string,
  reasoningEffort?: EffortLevel
): SessionModelPreference;

/** Attribute a preference to a config-derived default (routing-config, AICORE_MODEL, built-in). */
export function defaultPreference(
  modelID: string,
  providerID: string,
  reasoningEffort?: EffortLevel
): SessionModelPreference;

/** Migrate an on-disk record persisted before the `source` field existed. */
export function migrateLegacyPreference(
  raw: Partial<SessionModelPreference> & { modelID: string; providerID: string }
): SessionModelPreference;
```

Usage example — hydrate a session from disk, apply the CLI `--model` override, then reconcile against the config default:

```typescript
import {
  resolveSessionModelPreference,
  userExplicitPreference,
  defaultPreference,
  migrateLegacyPreference,
} from '../core/modelPreference.js';

const raw = await loadSessionPreferenceFromDisk(sessionId);
const current = raw ? migrateLegacyPreference(raw) : undefined;

// User passed --model on the CLI: attribute the update to an explicit choice.
const incoming = flags.model
  ? userExplicitPreference(flags.model, 'sap-ai-core', flags.effort)
  : undefined;

// Config-derived fallback (routing-config.json / AICORE_MODEL / built-in default).
const configDefault = defaultPreference(config.defaultModel, 'sap-ai-core', config.defaultEffort);

const resolved = resolveSessionModelPreference(current, incoming, configDefault);
await saveSessionPreferenceToDisk(sessionId, resolved);
```

Rules pinned by `src/core/__tests__/modelPreference.test.ts`:

1. Brand-new session (no `current`) → apply `configDefault` verbatim.
2. Current `'user-explicit'` + incoming `'default'` → keep the user's `modelID` / `providerID` / `source`; refresh `reasoningEffort` when the incoming payload carries one, otherwise preserve the current effort intent.
3. Current `'user-explicit'` + incoming `'user-explicit'` → incoming wins (a new explicit choice overrides an older one).
4. Fresh effort update (only `reasoningEffort` on the incoming payload) merges into an explicit choice without swapping the model.
5. `'inherited'` behaves the same as `'user-explicit'` for override protection (subagent handoff / resumed session).
6. `migrateLegacyPreference` defaults a missing `source` to `'user-explicit'`; an already-present `source` is preserved.

## Session Busy Tracker API (`src/core/sessionBusy.ts`)

Introduced in the 2026-09-17 sync. Prevents concurrent operations on a single session and now guarantees "clear-before-publish, write-after-publish" transition ordering so a failed publisher cannot wedge the session in a stale busy state. See [ARCHITECTURE.md — Session Busy Publish Ordering](ARCHITECTURE.md#session-busy-publish-ordering-srccoresessionbusyts) for the design.

Public surface:

```typescript
export class SessionBusyError extends Error {
  constructor(readonly sessionId: string, readonly operation: string);
}

export interface BusyResponse {
  status: number; // 409
  body: { error: 'SessionBusy'; message: string; sessionId: string };
}

export function toBusyResponse(error: SessionBusyError): BusyResponse;

export type SessionBusyStatus = 'busy' | 'idle';

export interface SessionBusyStatusEvent {
  sessionId: string;
  status: SessionBusyStatus;
  operation?: string;
}

export type SessionBusyPublisher = (event: SessionBusyStatusEvent) => void | Promise<void>;

export function getSessionBusyTracker(): SessionBusyTracker;

/** Test-only: reset the process-global tracker. */
export function resetSessionBusyTracker(): void;
```

`SessionBusyTracker` instance methods:

- `setPublisher(publisher: SessionBusyPublisher | undefined): void` — attach or detach the publish callback (event bus emit, WebSocket broadcast). Setting a new publisher replaces the previous one; passing `undefined` detaches. Optional: when unset, the tracker behaves as a plain in-memory Map for backwards compatibility.
- `markBusy(sessionId: string, operation: string): void` — throws `SessionBusyError` synchronously when the session is already busy. Publishes FIRST; only persists the busy entry on successful publication. A synchronous publisher throw rolls back the store and rethrows.
- `markFree(sessionId: string): void` — clears the store FIRST, then publishes. Publisher errors are logged and swallowed — freeing a session must never fail from the caller's perspective. No-op (and does NOT invoke the publisher) when the session is not busy.
- `isBusy(sessionId: string): boolean`
- `getCurrentOperation(sessionId: string): string | undefined`

Wire an event-bus publisher in bootstrap code:

```typescript
import { getSessionBusyTracker } from '../core/sessionBusy.js';
import { getEventBus } from '../bus/index.js';

const tracker = getSessionBusyTracker();
const bus = getEventBus();
tracker.setPublisher((event) => {
  bus.publish('session.busy', event);
});
```

An HTTP handler translates `SessionBusyError` to HTTP 409 with `toBusyResponse`:

```typescript
try {
  tracker.markBusy(sessionId, 'chat');
  // ... run turn ...
} catch (err) {
  if (err instanceof SessionBusyError) {
    const { status, body } = toBusyResponse(err);
    return res.status(status).json(body);
  }
  throw err;
} finally {
  tracker.markFree(sessionId);
}
```

## Draft Cache API (`src/session/draft.ts`)

Introduced in the 2026-09-17 sync. In-memory cache for in-progress prompt buffers across session reload / resume. Empty drafts are never persisted — the setter and `promote` both evict actively. See [ARCHITECTURE.md — Draft Cache](ARCHITECTURE.md#draft-cache-srcsessiondraftts) for the design.

Public surface:

```typescript
export interface DraftCacheStore {
  get(sessionID: string): string | undefined;
  set(sessionID: string, value: string): void;
  delete(sessionID: string): void;
  clear(): void;
}

export class DraftCache {
  constructor(store?: DraftCacheStore);
  /** Returns undefined when nothing is cached — never an empty string. */
  get(sessionID: string): string | undefined;
  /** Empty or whitespace-only values are actively evicted. */
  set(sessionID: string, draft: string): void;
  /** Idempotent. */
  delete(sessionID: string): void;
  /** Trims input, always evicts the cache, returns the trimmed prompt or undefined. */
  promote(sessionID: string, draft: string): string | undefined;
  /** Test / shutdown helper. */
  clear(): void;
}

/** Process-global singleton for CLI subcommand and TUI hook callers. */
export function getDraftCache(): DraftCache;

/** Test-only helper. */
export function resetDraftCache(): void;
```

TUI usage pattern — restore a draft on session mount, persist on change, promote on submit:

```typescript
import { getDraftCache } from '../session/draft.js';

const cache = getDraftCache();

// On session mount / reload:
const restored = cache.get(sessionID);
setBuffer(restored ?? '');

// On buffer change (debounce upstream):
cache.set(sessionID, buffer); // empty buffer auto-evicts, no pre-trim needed.

// On submit:
const prompt = cache.promote(sessionID, buffer);
if (prompt !== undefined) {
  await session.send(prompt);
}
```

The pluggable `DraftCacheStore` interface allows a future durable implementation without changing callers or tests. The default in-memory store is a plain `Map<string, string>`.

## Context Self-Inspection API (`experimental.contextTools`)

Introduced in 1.22.28 (2026-09-23 upstream sync, ports upstream opencode `feat(cli): add experimental self-context tools (#14268)`). See [ARCHITECTURE.md — Context Self-Inspection Tools](./ARCHITECTURE.md#context-self-inspection-tools-experimentalcontexttools) for the runtime contract and [CONFIGURATION.md — Experimental Context Self-Inspection Tools](./CONFIGURATION.md#experimental-context-self-inspection-tools-experimentalcontexttools) for the config surface.

### Config helpers (`src/config/userConfig.ts`)

```typescript
/**
 * Experimental feature flag: `contextTools` — expose `context_inspect` and
 * `context_summarize` tools so the agent can introspect its own token
 * budget and proactively request compaction before overflow.
 *
 * Stored as `experimental.contextTools` inside the top-level `experimental`
 * object of `~/.alexi/config.json`. Default `false`.
 */
export function getConfigContextTools(): boolean;

/** Persist the `experimental.contextTools` flag. Merges into the existing
 *  `experimental` object without clobbering sibling flags. */
export function setConfigContextTools(enabled: boolean): void;
```

Reader defends against corrupt configs — missing, non-object, array, or non-boolean values all resolve to `false`, so the feature is never accidentally enabled by a hand-edited config.

### `context_inspect` tool (`src/tool/tools/context.ts`)

```typescript
// Parameters
const ContextInspectParamsSchema = z.object({}).describe(
  'Report current session token usage and distance to the compaction threshold. No parameters.'
);

// Result
interface ContextInspectResult {
  messageCount: number;
  tokens: number;
  budget: number | null;
  utilization: number | null;
  /** Whether compaction is likely to fire on the next turn (utilization >= 0.9). */
  nearThreshold: boolean;
}
```

Success result:

```typescript
{
  success: true,
  data: { messageCount, tokens, budget, utilization, nearThreshold }
}
```

Failure results:

- No session manager attached to the `ToolContext`: `{ success: false, error: 'context_inspect requires an active session manager; call this tool from within an agent turn.' }`
- Manager has no current session: `{ success: false, error: 'No active session to inspect.' }`

Token count uses the shared `estimateMessagesTokens()` helper from `src/core/compaction.ts`, so recorded per-message `tokens.input` / `tokens.output` values from the provider are preferred over the `~4 chars / token` heuristic.

### `context_summarize` tool (`src/tool/tools/context.ts`)

```typescript
// Parameters
const ContextSummarizeParamsSchema = z.object({
  reason: z
    .string()
    .optional()
    .describe(
      'Optional explanation for why the summarization is requested (e.g. "before large repo scan"). ' +
        'Recorded on the session for debugging.'
    ),
});

// Result
interface ContextSummarizeResult {
  scheduled: boolean;
  reason?: string;
  messageCount: number;
  tokens: number;
}
```

The tool does NOT run compaction directly. It records intent and returns the current usage so the model can confirm the state; the actual compaction still happens between turns via the orchestrator's normal `shouldCompact()` path. Same session-required error semantics as `context_inspect`.

### Registration contract

Both tools are only registered when `getConfigContextTools()` returns `true`. When disabled, they do not appear in the tool schema and cannot be invoked:

```typescript
// src/tool/tools/index.ts
if (getConfigContextTools()) {
  registerTool(contextInspectTool as Tool<any, any>);
  registerTool(contextSummarizeTool as Tool<any, any>);
}
```

Both tools are exported by name (`contextInspectTool`, `contextSummarizeTool`) alongside the other built-ins from `src/tool/tools/index.ts` so callers that need to interrogate the surface directly (e.g. plugin authors, integration tests) can import them without going through the registry.

## Worktree Status Registry API

Introduced by commit `8b372ad7` (issue #1826). Public TypeScript surface exposed by `src/agent/worktreeStatus.ts` for publishers (orchestrator, tool layer, tests) that need to push Agent Manager worktree lifecycle events into the TUI, plus the React binding under `src/cli/tui/hooks/useWorktreeStatus.ts` used by the Sidebar. See the [Agent Manager Worktree Status Registry](ARCHITECTURE.md#agent-manager-worktree-status-registry-issue-1826) section of the architecture doc for the runtime contract and status vocabulary.

### Types

```typescript
export type WorktreeStatus = 'running' | 'idle' | 'error' | 'blocked' | 'unknown';

export interface WorktreeStatusEntry {
  readonly id: string;
  readonly label: string;
  readonly status: WorktreeStatus;
  /** Optional detail string surfaced on hover / in a status tooltip. */
  readonly detail?: string;
  /** Wall-clock ms when the status was last updated. */
  readonly updatedAt: number;
}

export type WorktreeStatusListener = (snapshot: readonly WorktreeStatusEntry[]) => void;
```

`WorktreeStatus` is a string-literal union deliberately so downstream mappings (icons, colours) can be checked for exhaustiveness at compile time. Every emitted `WorktreeStatusEntry` is `Object.freeze`d, so callers must not mutate fields in place — build a new update object and pass it back through `setWorktreeStatus` instead.

### Registry functions

```typescript
export function setWorktreeStatus(
  id: string,
  update: { label: string; status: WorktreeStatus; detail?: string }
): void;

export function removeWorktreeStatus(id: string): void;

export function getWorktreeStatuses(): readonly WorktreeStatusEntry[];

export function getWorktreeStatus(id: string): WorktreeStatusEntry | undefined;

export function subscribe(listener: WorktreeStatusListener): () => void;
```

Behaviour contract:

- `setWorktreeStatus(id, update)` — inserts a new entry or replaces an existing one. The registry stamps `updatedAt = Date.now()` for the caller. When `(label, status, detail)` all match the current entry, the call is a no-op and does NOT emit; publishers may safely fire redundant `idle` events during a quiet period without triggering re-render storms.
- `removeWorktreeStatus(id)` — removes an entry and emits once. Returns `void`; the underlying `Map.delete` return value is not exposed. This is the only path that drops an entry; every other transition — including `error` — leaves the entry visible so failures stay on-screen until the operator dismisses them.
- `getWorktreeStatuses()` — returns an immutable snapshot in `Map` insertion order. Suitable for one-shot reads (CLI subcommands, tests). React consumers should use `subscribe` or the `useWorktreeStatus` hook instead so they receive future updates.
- `getWorktreeStatus(id)` — returns a defensive copy of the single entry or `undefined` when the id has never been reported. An entry explicitly set to `status: 'unknown'` still returns a defined `WorktreeStatusEntry` — the `undefined` return distinguishes "never seen" from "known but not yet classified".
- `subscribe(listener)` — registers the listener and immediately invokes it once with the current snapshot so consumers can seed state without a separate `getSnapshot` call. Returns an unsubscribe function; call it in `componentWillUnmount` / `useEffect` cleanup to avoid leaks.

`__resetWorktreeStatusRegistry()` is exported for tests only. It clears both the entry Map and the listener Set and is NOT re-exported through any barrel — import it directly from `src/agent/worktreeStatus.ts` in test files.

### React binding: `useWorktreeStatus`

```typescript
// src/cli/tui/hooks/useWorktreeStatus.ts
import { useEffect, useState } from 'react';
import { subscribe, type WorktreeStatusEntry } from '../../../agent/worktreeStatus.js';

export function useWorktreeStatus(): readonly WorktreeStatusEntry[] {
  const [entries, setEntries] = useState<readonly WorktreeStatusEntry[]>([]);

  useEffect(() => {
    const unsub = subscribe((snapshot) => {
      setEntries(snapshot);
    });
    return unsub;
  }, []);

  return entries;
}
```

Returns the current full snapshot. Callers project it into whatever shape their component needs — typically a list rendered next to `<StatusIcon />`. Because the registry emits a synchronous initial snapshot on `subscribe`, a plain `useState` + `useEffect` binding is sufficient; `useSyncExternalStore` is not required and is harder to test under `ink-testing-library`.

### Sidebar props

`SidebarProps` (`src/cli/tui/components/Sidebar.tsx`) gains two optional fields:

```typescript
export interface SidebarProps {
  // ...existing fields (files, focusable, isCollapsed, onActivate, isFocused, usage)...

  /**
   * Optional Agent Manager worktree list. When provided (and non-empty),
   * the Sidebar renders a compact "Worktrees" section with a StatusIcon
   * next to each entry. Empty arrays and `undefined` both suppress the
   * section so tests / legacy callers see no change.
   */
  worktrees?: readonly WorktreeStatusEntry[];

  /**
   * When false, disable the animated spinner for `running` worktrees.
   * Defaults to true. Snapshot tests should pass `false` to keep the
   * rendered frame deterministic.
   */
  animateWorktrees?: boolean;
}
```

### StatusIcon component

```typescript
// src/cli/tui/components/StatusIcon.tsx
export const STATIC_STATUS_ICONS: Record<Exclude<WorktreeStatus, 'running'>, string> = {
  idle: '\u2713',    // U+2713 checkmark
  error: '\u2717',   // U+2717 cross
  blocked: '\u23F8', // U+23F8 pause
  unknown: '?',
};

export function statusColor(status: WorktreeStatus, colors: ThemeColors): string;

export interface StatusIconProps {
  status: WorktreeStatus;
  /** When true (default), `running` renders an animated ink-spinner. */
  animate?: boolean;
  /** Optional colour override; falls back to statusColor(status, colors). */
  color?: string;
}

export function StatusIcon(props: StatusIconProps): React.JSX.Element;
```

`StatusIcon` renders inline with no wrapping `<Box>` so callers compose it with a label on the same row: `<StatusIcon status={s} /><Text> {label}</Text>`. A trailing space is intentionally NOT emitted; the caller controls spacing.

### Usage example: publishing status from a background task

```typescript
import {
  setWorktreeStatus,
  removeWorktreeStatus,
} from './agent/worktreeStatus.js';

async function runWorktreeTurn(id: string, label: string): Promise<void> {
  setWorktreeStatus(id, { label, status: 'running', detail: 'agent turn' });
  try {
    const result = await agent.runTurn(id);
    if (result.blockedOnPermission) {
      setWorktreeStatus(id, { label, status: 'blocked', detail: 'awaiting user' });
      await result.userAnswered;
    }
    setWorktreeStatus(id, { label, status: 'idle' });
  } catch (err) {
    setWorktreeStatus(id, {
      label,
      status: 'error',
      detail: err instanceof Error ? err.message : String(err),
    });
    // Deliberately do NOT call removeWorktreeStatus here — leave the failure
    // visible so the operator can inspect and dismiss it explicitly.
  }
}

function tearDownWorktree(id: string): void {
  removeWorktreeStatus(id);
}
```

Publishers should not attempt to pre-compute the `updatedAt` timestamp — the registry stamps it on write. Redundant idempotent writes (same `label`, `status`, `detail`) are safe and free: they short-circuit before touching the listener set.
