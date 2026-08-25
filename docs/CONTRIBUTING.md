# Contributing to Alexi

This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Pull Request Process](#pull-request-process)
- [Documentation](#documentation)
- [Automation System](#automation-system)

## Getting Started

### Prerequisites

- Node.js >= 22.12.0
- npm package manager
- Git
- SAP AI Core account with valid credentials
- TypeScript knowledge

### Initial Setup

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone git@github.com:YOUR_USERNAME/alexi.git
   cd alexi
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Configure environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your SAP AI Core credentials
   ```
5. Build the project:
   ```bash
   npm run build
   ```
6. Verify the setup:
   ```bash
   node dist/cli/program.js --help
   ```

### Optional: tree-sitter grammars

The AST-based symbol extraction path used by `src/context/**` and the AST
mode of the `definitions` tool relies on native tree-sitter grammars. These
grammars are optional; the `definitions` tool falls back to a built-in
regex-based extractor when they are missing. Contributors are encouraged to
install them so the tree-sitter test files run locally:

```bash
npm install tree-sitter tree-sitter-typescript tree-sitter-javascript tree-sitter-bash
```

CI always has the grammars installed (they are currently declared as regular
`dependencies` in `package.json`, with a planned migration to optional
dependencies tracked in a follow-up issue), so `npm run test:coverage`
exercises both paths on every PR. See
[`docs/TOOLS.md`](TOOLS.md#definitions-tool) for the AST-vs-regex comparison
and the [Optional Dependencies](../README.md#optional-dependencies) section
of the README for install size and platform caveats.

### Environment Configuration

Create a `.env` file (never commit this file) with:

```bash
# SAP AI Core credentials
AICORE_SERVICE_KEY='{"clientid":"...","clientsecret":"...","url":"...","serviceurls":{"AI_API_URL":"..."}}'
AICORE_RESOURCE_GROUP=your-resource-group-id

# Optional: Proxy configuration
SAP_PROXY_BASE_URL=http://127.0.0.1:3001/v1
SAP_PROXY_API_KEY=your_secret_key
```

## Development Workflow

### Branch Strategy

- `main` / `master`: Production-ready code
- `feature/*`: New features
- `fix/*`: Bug fixes
- `auto/*`: Automated branches (CI, sync, implementation)
- `docs/*`: Documentation updates
- `refactor/*`: Code refactoring

### Development Process

```mermaid
graph LR
    A[Create Branch] --> B[Make Changes]
    B --> C[Write Tests]
    C --> D[Run Tests + Lint]
    D --> E[Commit]
    E --> F[Push]
    F --> G[Create PR]
    G --> H[CI + Auto-Docs]
    H --> I[Review]
    I --> J[Merge]
```

1. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. Make changes following coding standards
3. Write or update tests
4. Run quality checks locally:
   ```bash
   npm test
   npm run lint
   npm run typecheck
   npm run format:check
   ```
5. Commit with conventional commit format:
   ```bash
   git commit -m "feat(core): add reactive context compaction"
   ```
6. Push and create a pull request

### Build Commands

```bash
npm run build          # Compile TypeScript to dist/
npm run typecheck      # Type-check without emitting files
npm run dev            # Run in development mode with tsx
npm run lint           # Run ESLint on src/ and tests/
npm run lint:fix       # Auto-fix ESLint issues
npm run format         # Format code with Prettier
npm run format:check   # Check formatting without changes
npm test               # Run all tests once
npm run test:watch     # Run tests in watch mode
npm run test:coverage  # Run tests with coverage report
```

## Coding Standards

### TypeScript Configuration

- **Target**: ES2022
- **Module**: NodeNext
- **Strict mode**: Enabled
- **JSX**: react-jsx (for Ink components)

### Formatting (Prettier)

- 2 spaces indentation
- 100 character line width
- Single quotes
- Semicolons required
- Trailing commas (ES5 style)
- LF line endings

### Import Conventions

```typescript
// Always use .js extension for local imports (required for ES Modules)
import { routePrompt } from './router.js';
import { SessionManager } from '../core/sessionManager.js';

// External imports first, then internal imports
import { z } from 'zod';
import * as fs from 'fs/promises';

import { defineTool } from '../index.js';
import type { ToolContext } from '../tool/index.js';
```

### Naming Conventions

| Element | Convention | Example |
|---------|------------|---------|
| Files | camelCase | `orchestrator.ts`, `sessionManager.ts` |
| Functions | camelCase | `sendChat()`, `routePrompt()` |
| Classes | PascalCase | `SessionManager`, `ToolRegistry` |
| Interfaces/Types | PascalCase | `ToolContext`, `PermissionAction` |
| Constants | UPPER_SNAKE_CASE | `MAX_LINES`, `MAX_BYTES` |
| Unused params | Prefix with `_` | `_context`, `_config` |

### TypeScript Guidelines

1. **Type Safety**: Avoid `any` -- use `unknown` and narrow types
   ```typescript
   // Good
   function processMessage(message: string): Promise<ToolResult> { }
   
   // Bad
   function processMessage(message: any): any { }
   ```

2. **Interfaces over Types**: Prefer interfaces for object shapes
   ```typescript
   interface ToolContext {
     workdir: string;
     signal?: AbortSignal;
   }
   type PermissionAction = 'read' | 'write' | 'execute' | 'network' | 'admin';
   ```

3. **Async/Await**: Always use async/await over raw promises
   ```typescript
   async function fetchData(): Promise<Data> {
     const response = await fetch(url);
     return await response.json();
   }
   ```

4. **Error Handling**: Use the Result pattern or typed error classes
    ```typescript
    // Result pattern for tool returns
    try {
      const result = await riskyOperation();
      return { success: true, data: result };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return { success: false, error: message };
    }

    // Typed error hierarchy (see src/reference/repository-cache.ts)
    export class CacheError extends Error {
      readonly _tag = 'CacheError';
      constructor(message: string, options?: ErrorOptions) {
        super(message, options);
        this.name = 'CacheError';
      }
    }
    export class CacheMissError extends CacheError {
      readonly _tag = 'CacheMissError';
      constructor(public readonly key: string) {
        super(`Cache miss for key: ${key}`);
        this.name = 'CacheMissError';
      }
    }
    ```

    For network errors, use the `NetworkError` class from `src/core/network.ts`:
    ```typescript
    throw new NetworkError('Max reconnection attempts exceeded', { cause: error });
    ```

5. **Null Safety**: Use optional chaining and nullish coalescing
   ```typescript
   const value = context?.workdir ?? process.cwd();
   ```

6. **Unused Variables**: Prefix with underscore
   ```typescript
   const { action, config: _config } = params;
   ```

7. **Non-null Assertion Placement**: Assert on the correct operand
   ```typescript
   // Good
   const taskId = taskResult.data!.taskId;
   
   // Bad (confusing precedence)
   const taskId = taskResult.data?.taskId!;
   ```

8. **Explicit Type Assertions**: Use `as` when control flow cannot narrow
   ```typescript
   queueBackgroundTask(taskId as string, taskData, agent, config);
   ```

9. **Stream Options**: Use `undefined` instead of `null`
   ```typescript
   const stream = createReadStream(filePath, { encoding: undefined });
   ```

10. **Permission Actions**: Use standard taxonomy
     ```typescript
     // Standard: 'read' | 'write' | 'execute' | 'network' | 'admin'
     permission: { action: 'admin', getResource: (params) => params.action }
     ```

11. **Event Definitions**: Use Zod schemas with the event bus (see `src/bus/index.ts`)
      ```typescript
      import { defineEvent } from '../bus/index.js';
      import { z } from 'zod';

      export const ToolExecutionStarted = defineEvent(
        'tool.execution.started',
        z.object({
          toolName: z.string(),
          toolId: z.string(),
          parameters: z.record(z.string(), z.unknown()),
          timestamp: z.number(),
        })
      );
      ```

12. **Event Subscriptions**: Subscriptions are acquired eagerly; handlers are added immediately to the handler set to prevent race conditions between subscribe and first event emission.

13. **Plugin Tool Compatibility**: When creating plugin tools, ensure `ask` returns a `Promise<string>` (not an Effect). Use `createPluginToolWrapper()` from `src/tool/plugin-tools.ts` to adapt plugin interfaces.

14. **Tool Registry Resolution**: Register dynamic tool resolvers via `EnhancedToolRegistry.registerPromptResolver()` for tools that need session/agent context to resolve.

### ESLint Rules

Key rules enforced:
- `no-console: warn` -- Use logger utilities
- `eqeqeq: error` -- Always use `===` and `!==`
- `curly: error` -- Always use braces for control statements
- `prefer-const: error` -- Use `const` when not reassigned
- `@typescript-eslint/no-explicit-any: warn`
- `@typescript-eslint/no-unused-vars: error`

## Testing Guidelines

### Test Framework

Alexi uses **Vitest** with:
- Native TypeScript/ESM support
- React plugin for Ink TUI testing
- V8 coverage provider

### Test Structure

```typescript
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('Component Name', () => {
  let tempDir: string;
  let context: ToolContext;

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'test-'));
    context = { workdir: tempDir };
  });

  afterEach(async () => {
    await fs.rm(tempDir, { recursive: true, force: true });
  });

  describe('feature', () => {
    it('should do something specific', async () => {
      // Arrange, Act, Assert
    });
  });
});
```

### Mocking

```typescript
// Mock modules before importing
vi.mock('../src/providers/index.js', () => ({
  getProviderForModel: vi.fn(),
  getDefaultModel: vi.fn(),
}));

// Import after mocking
import { sendChat } from '../src/core/orchestrator.js';
```

### Test import-path depth

Test files under `tests/` walk up to the repository root before descending into `src/`. The number of `../` segments needed depends on where the test file lives, and it must always land in `src/` — never in a sibling under `tests/` itself. Concrete rules:

| Test file location                                       | Relative prefix to `src/` |
| -------------------------------------------------------- | ------------------------- |
| `tests/*.test.ts` (top-level)                            | `../src/`                 |
| `tests/<category>/*.test.ts` (one nested directory)      | `../../src/`              |
| `tests/<category>/<sub>/*.test.ts` (two nested)          | `../../../src/`           |
| `tests/<a>/<b>/<c>/*.test.ts` (three nested)             | `../../../../src/`        |

A common failure mode is to omit the final `src/` segment and target a nested `tests/<category>/<name>.js` sibling that does not exist. Vitest reports this as `Failed to resolve import "..."` at collection time and every case in the file fails at import, not at assertion. Worked example, 2026-08-21, commit `b4fcb19a` (`fix(tests): correct import path in instance-watcher test [autohealing]`): `tests/core/filesystem/instance-watcher.test.ts` imported `../../core/filesystem/watcher.js` — which resolves to a nonexistent `tests/core/filesystem/watcher.js` — and was corrected to `../../../src/core/filesystem/watcher.js` (three parent segments to escape `tests/core/filesystem/`, then `src/core/filesystem/watcher.js`). Diff statistics: `1 file changed, 1 insertion(+), 1 deletion(-)`. All ten cases in the file — the two-instance state isolation regression from kilocode `b8984e468`, the idempotent-registration case, the `stop()` scoping case, the VCS-guard skip, the experimental-flag skip, the debounce-timer replace-and-cleanup case, and the backwards-compatible `startWatcher` shim delegation case — were failing at import-time until the prefix was fixed. See `CHANGELOG.md` `[Unreleased] > Fixed` and `docs/TESTING.md#testing-instancewatcher-and-debounce-timer-cleanup` for the corrected code example.

Reminder: every local import ends in `.js` even from `.ts` files (`AGENTS.md` under **ESM + import rules**). An import without `.js` will pass `tsc --noEmit` but fail at runtime and in Vitest.

### Injectable I/O boundaries (preferred over module mocks)

When code touches platform-specific I/O — filesystem, subprocess, `https`
agent state — prefer accepting the I/O boundary as a function parameter over
mocking `node:fs` / `node:child_process` globally. This keeps tests hermetic,
parallel-safe, and reviewable. The auto-CA harvester in `src/providers/ca.ts`
is the canonical example: `harvestLinuxCAs` accepts `reader` and `exists`
callbacks, `harvestMacosCAs` accepts a `SecurityRunner`, and
`installHarvestedCAs` accepts an `agent` override. Follow the same pattern for
new providers, tools, or hooks that touch external I/O. See
`docs/TESTING.md#testing-the-auto-ca-harvester` for a fully worked example.

### Pure-function helpers (preferred over stateful services)

For helpers that transform data without I/O — e.g., prompt-shape transforms
and result-filter helpers — write them as pure functions in a dedicated
module and export a stable named surface. Two current canonical examples:

- `src/providers/openai/prompt-cache.ts` — `applyCacheBreakpoint(prompt)`,
  `supportsPromptCacheBreakpoint(opts)`, and `isChatGPTSubscription(auth)` are
  pure functions with no I/O. They compose cleanly into
  `prepareRequest(ctx)` on the SAP orchestration provider and are trivially
  unit-testable without any mocking.
- `src/tool/grep-signal-controls.ts` — `applySignalControls(matches, controls)`
  is a pure filter/sort pipeline. `src/tool/grep.ts` re-exports it as a
  plan-anchored surface so callers can wire signal filtering into ad-hoc
  grep pipelines without reaching into the primary tool implementation at
  `src/tool/tools/grep.ts`.

Follow the same shape when adding new transforms: keep the module pure,
export both the callable and its input types, and avoid globals so parallel
tests do not need setup/teardown.

### Process-local stores (require explicit teardown)

Modules that maintain process-local mutable state MUST expose an explicit
teardown/clear function and MUST be called from `afterEach` in tests and
from server-mode session teardown. The current canonical example is
`src/permission/provenance.ts`: `recordDenial(toolCallId, provenance)`
writes into an unbounded `Map<string, PermissionProvenance>`, and
`clearDenialStore()` is the paired teardown. Tests that seed the store MUST
call `clearDenialStore()` in `afterEach` to keep test suites parallel-safe
and avoid cross-test leakage.

### Environment-driven detection (snapshot-and-restore)

Some detection modules read process-level environment variables directly and
cannot practically be refactored to inject the whole `process.env` — for
example, `src/tool/tools/shell/id.ts` reads `process.env.SHELL` and
`process.env.COMSPEC` to classify the active shell. For tests against such
modules, snapshot the variable at `describe` scope, mutate it inside each
`it`, and restore it in `afterEach` (deleting it when previously unset):

```typescript
const originalShell = process.env.SHELL;

afterEach(() => {
  if (originalShell === undefined) {
    delete process.env.SHELL;
  } else {
    process.env.SHELL = originalShell;
  }
});
```

Gate the suite with `describe.skipIf(isWindows)` (or the equivalent
`describe.skipIf(isPosix)`) when the variable being mutated is
platform-specific. The bash-tool shell-type suite in
`tests/tool/tools/bash.test.ts:41` is the canonical worked example; see
`docs/TESTING.md#testing-bash-tool-shell-type-reporting`.

The notifications module extends this pattern to `HOME`, `CI`, and
`ALEXI_NO_NOTIFICATIONS` because `~/.alexi/config.json` lives under `HOME`
and the interactive-context probe reads all three. `tests/core/notifications.test.ts`
snapshots each variable in `beforeEach`, redirects `HOME` to a `fs.mkdtempSync`
temp directory, and restores every variable (deleting when previously unset)
plus `fs.rmSync(tmpHome, { recursive: true, force: true })` in `afterEach`.
This keeps parallel test workers from racing on the real user config and
guarantees a test can never accidentally dispatch a real desktop notification.

### Binary-optional native dependencies (cached dynamic import)

Modules that wrap a native-binary-backed npm package (e.g. `node-notifier`
in `src/core/notifications.ts`, or any future binding to `terminal-notifier`,
`notify-send`, `snoretoast`) SHOULD load the dependency via a cached
dynamic import rather than a top-level `import`. Two reasons:

1. **Startup cost.** A user who has denied the feature at the config layer
   must never pay the native-binary probe cost. Deferring the import to
   the first `allow` call means `alexi chat` starts in the same time on a
   Linux container without a notification daemon as it does on a macOS
   dev box.
2. **Missing-binary resilience.** A native probe that throws at import
   time will crash the CLI. A dynamic import failure inside a `try / catch`
   resolves to a cached `null` handle, and every subsequent call short-circuits
   without retrying the import — a broken feature stays disabled but the
   rest of the CLI keeps working.

Canonical pattern (from `src/core/notifications.ts`):

```typescript
// Three-state cache: undefined = never attempted, null = attempted and
// failed, NotifierLike = ready. This lets one failed probe silence every
// subsequent call without retrying the import.
let cachedNotifier: NotifierLike | null | undefined;

async function loadNotifier(): Promise<NotifierLike | null> {
  if (cachedNotifier !== undefined) return cachedNotifier;
  try {
    const mod = (await import('node-notifier')) as unknown as {
      default?: NotifierLike;
      notify?: NotifierLike['notify'];
    };
    if (mod.default && typeof mod.default.notify === 'function') {
      cachedNotifier = mod.default;
    } else if (typeof mod.notify === 'function') {
      cachedNotifier = { notify: mod.notify.bind(mod) };
    } else {
      cachedNotifier = null;
    }
  } catch (err) {
    logger.debug('node-notifier failed to load', err);
    cachedNotifier = null;
  }
  return cachedNotifier;
}

// Test-only escape hatch: expose a reset so unit tests can force a fresh
// import. NEVER call this from production code.
export function _resetNotifierCacheForTests(): void {
  cachedNotifier = undefined;
}
```

Guidelines when introducing a new module that follows this pattern:

- Define a minimum interface (`NotifierLike` above) that names ONLY the methods you call. This keeps the corresponding `@types/*` package as a devDependency rather than a hard runtime type import, and lets tests pass an inline mock object without stubbing a whole third-party API surface.
- Expose a `_resetXxxCacheForTests()` reset. Never import it from index barrels; only unit tests should call it.
- Accept a test-only override in the options bag (`__notifierOverride`, `__askOverride` in the notifications module) prefixed with `__` so it is visually flagged as non-production surface.
- Never let a load failure propagate. `logger.debug` and cache `null`.

### Testing streaming tools and bus events

Tools that consume a provider stream and publish `defineEvent`-produced bus
events (the canonical example is `image_gen` in `src/tool/tools/image-gen.ts`,
which publishes `ImageGenerationChunk` from `src/bus/index.ts`) have three
extra concerns beyond a standard tool test:

1. **Fake the provider with an async generator that can also throw.** Two
   shapes cover most cases: `makeProviderStub(chunks)` yields chunks and
   completes cleanly; `makeThrowingProviderStub(chunks, err)` yields chunks
   and then throws, which is the only way to reach the partial-success path
   where some payloads have already been persisted before the upstream stream
   fails. Cast the fake to `ReturnType<typeof getProviderForModel>` and only
   implement the `streamComplete` method the tool actually calls.
2. **Scope bus subscriptions per test.** `ImageGenerationChunk` (and any
   `defineEvent`-produced surface) is process-global; a stray subscriber will
   observe events from later tests and cause flakes under `--reporter=verbose`.
   Subscribe inside the `it` body and `unsub()` in a `try / finally` so the
   subscription is torn down even when an assertion throws.
3. **Assert on the partial-success contract explicitly.** A tool that emits
   `truncated: true` alongside `success: true` will silently regress under a
   test that only checks `success`. Assert on `truncated`, on the length of
   `data.images` (or the equivalent data field), and on the `hint` string
   both for the error classification and for the `"Partial result: N ..."`
   suffix.

The full worked example is in `docs/TESTING.md` under **Image-generation
tool tests**. New streaming tools with progress events (audio generation,
long-running search, streaming file transforms) should mirror the same three
patterns rather than reinventing bus-subscription bookkeeping.

The bash / shell tools follow the same three-part contract via
`BashOutputChunk` (`src/bus/index.ts:325`) plus a process-local command-log
registry at `src/tool/tools/bash-streaming.ts`. Tests at
`tests/tool/tools/bash-streaming.test.ts` cover:

1. **PID-reuse defence** — assert on `logId` correlation, not OS PID. Vary
   `startedAt` when writing PID-reuse tests so a matching PID alone does NOT
   surface the earlier entry.
2. **Retention window** — `cleanupCompletedLogs(now)` accepts an explicit
   timestamp so tests can be deterministic without `vi.useFakeTimers()`.
3. **Byte-cap eviction** — assert on the literal
   `[... older output evicted from streaming buffer ...]` marker; that
   string is part of the observable contract for reconnecting TUI clients.
4. **Reset between tests** — call `_resetStreamingStateForTests()` in
   `beforeEach` because the registry is process-local and survives across
   bash invocations by design.

The TUI wiring (`APPEND_TOOL_CALL_OUTPUT` reducer action in `src/cli/tui/
context/ChatContext.tsx`, `useToolEvents` subscription in `src/cli/tui/
hooks/useToolEvents.ts`) is tested at `tests/cli/tui/ChatContext.test.tsx`
and `tests/cli/tui/useToolEvents.test.tsx`. Key invariants: empty chunks
are no-ops; chunks for already-completed rows are silently dropped;
`ToolExecutionCompleted` replaces the streamed `output` with the aggregated
result payload (which may be normalised differently — carriage-return
collapsing, head-and-tail elision).

### Testing concurrent timer budgets with fake timers

Modules that expose per-entity timeout budgets (e.g. `McpClientManager.callTool`
creating one `AbortController` per server in `src/mcp/client.ts:537`) require
tests that assert two adjacent promises make independent progress on different
budgets. The canonical worked example is `tests/mcp/client-timeout.test.ts`
under the `per-server independence` describe block (issue #1532); see
`docs/TESTING.md#testing-per-server-timeout-independence-issue-1532` for the
full walkthrough. The load-bearing rules are:

1. **Fake timers only.** Use `vi.useFakeTimers()` in `beforeEach` and
   `vi.useRealTimers()` in `afterEach`. Real timers would make the 30 s / 60 s
   assertions unusably slow AND flaky under CI scheduling variability.
2. **Advance time explicitly per assertion.** Prefer
   `await vi.advanceTimersByTimeAsync(ms)` at each budget boundary so a
   regression that couples two supposedly-independent timers is detected as an
   ordering violation, not as a total-elapsed-time drift.
3. **Drain microtasks with `await Promise.resolve()` before asserting the
   pending-side of a concurrent call.** A newly-created promise is only
   observably unresolved after the current microtask queue drains; skipping
   this step is the most common source of flakes in concurrent-timer tests.
4. **Route shared mocks by request-shape, not by connection identity.** When a
   single mock handler serves two logical connections (as with the shared
   `mockClientCallTool` in the MCP test file), branch on a request field
   (`params.name` for MCP) rather than trying to stub two `Client` classes.
5. **Assert on error message shape, not just `success: false`.** The named
   source (`(request timeout for server 'X')`) and the numeric bound
   (`/^MCP callTool timed out after <ms>ms /`) are the operator-facing contract
   and must be pinned so a refactor cannot silently drop them.

### Testing Async/Background Operations

For feature-flagged functionality:
```typescript
let originalEnv: string | undefined;

beforeEach(() => {
  originalEnv = process.env.ALEXI_EXPERIMENTAL_BACKGROUND_TASKS;
});

afterEach(() => {
  if (originalEnv === undefined) {
    delete process.env.ALEXI_EXPERIMENTAL_BACKGROUND_TASKS;
  } else {
    process.env.ALEXI_EXPERIMENTAL_BACKGROUND_TASKS = originalEnv;
  }
  getTaskStore().clear();
});
```

Use generous timeouts for CI:
```typescript
// 2x expected duration for CI scheduling variability
await new Promise((resolve) => setTimeout(resolve, 2000));
```

### Running Tests

```bash
npm test                                       # All tests (single pass, not watch)
npm test -- tests/tool/tools/                  # Directory
npm test -- tests/hooks/blockCap.test.ts       # Single file
npm test -- src/tool/skill.test.ts             # Co-located test next to source
npm test -- -t "compaction"                    # Pattern match (vitest uses -t / --testNamePattern, NOT --grep)
npm run test:coverage                          # With coverage
```

### Test File Locations

Vitest is configured (`vitest.config.ts`) to pick up tests from **both**
locations:

- `tests/**/*.test.{ts,tsx}` — the conventional out-of-tree test tree
- `src/**/*.test.{ts,tsx}` — co-located tests next to the source they cover

Either layout is acceptable. Co-located tests (e.g. `src/tool/skill.test.ts`)
are appropriate for narrow guards over a single module's exported surface;
broader integration or scenario tests should live under `tests/`. When adding a
co-located test, remember the ESM `.js` import rule still applies: imports of
local TypeScript files must end in `.js` even when the file is `.ts`.

## Pull Request Process

### Before Submitting

1. All tests pass: `npm test`
2. No lint errors: `npm run lint`
3. Types check: `npm run typecheck`
4. Format is correct: `npm run format:check`
5. Build succeeds: `npm run build`

### Commit Message Format

Uses conventional commits: `type(scope): description`

**Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`, `ci`, `revert`

**Scopes**: `cli`, `core`, `providers`, `config`, `server`, `agent`, `tools`, `ci`, `deps`, `tests`

**Examples**:
```
feat(core): add reactive context compaction with overflow seeding
fix(tools): resolve type error in read tool stream options
test(hooks): add blockCap and continueOnBlock test suites
chore(deps): bump marked to ^15.0.12 for marked-terminal compatibility
ci(agent): add daily PR merge workflow with Kilo CLI automation
```

### PR Description Template

```markdown
## Summary
Brief description of changes.

## Motivation
Why this change is needed.

## Changes
- List of specific changes made

## Testing
How changes were tested.
```

### Automated Checks

Pull requests trigger:
1. **CI**: Tests, linting, build verification
2. **Documentation Update**: AI-powered docs generation from code changes
3. **CI Auto-Fix** (auto/* branches): Automatic fix for CI failures

### Code Review Expectations

Reviewers check:
- Code quality and adherence to TypeScript strict mode
- Test coverage for new code (target 80%+)
- Documentation accuracy
- Performance implications
- Security considerations (no secrets in code)

## Documentation

### Documentation Files

| File | Location | Purpose |
|------|----------|---------|
| ARCHITECTURE.md | `docs/` | System architecture with Mermaid diagrams |
| API.md | `docs/` | CLI commands and TypeScript interfaces |
| CONFIGURATION.md | `docs/` | All configuration options |
| TESTING.md | `docs/` | Testing guide and patterns |
| AUTOMATION.md | `docs/` | CI/CD workflows |
| CONTRIBUTING.md | `docs/` | This file |
| CHANGELOG.md | Root | Version history (Keep a Changelog format) |
| AGENTS.md | Root | AI agent coding guidelines |

### Documentation Standards

1. Use clear, professional technical language (no emojis)
2. Include code examples from actual codebase
3. Add Mermaid diagrams for complex flows
4. Keep examples up-to-date with code changes
5. Use proper markdown formatting

## Automation System

### Autonomous Sync

Alexi automatically syncs from upstream repositories daily. The sync applies upstream changes and then runs the CI auto-fix pipeline to ensure consistent formatting:

```mermaid
graph LR
    A[Daily 06:00 UTC] --> B[Sync Forks]
    B --> C[Analyze Changes]
    C --> D[AI Planning]
    D --> E[AI Execution]
    E --> F[Style Auto-Fix]
    F --> G[Create PR]
    G --> H[CI + Auto-Merge]
```

Sync commits follow the pattern `feat(sync): apply upstream changes (YYYY-MM-DD)` followed by a `style(ci): auto-fix lint/format issues [alexi-bot]` commit if formatting adjustments are needed. On quiet upstream days (no new commits on any tracked upstream in the 24h window since the previous sync), the sync commit may be a version-only bump paired with a timestamp-refresh in `.github/last-sync-commits.json` — no runtime, config, tool, provider, or TUI surface is modified. The 2026-08-24 sync (commit `c9e6fa10`, `1.21.6` → `1.21.7`) is the canonical example: `opencode` advanced (`3a31c4ea` → `41616958`) while `kilocode` (`ff74e2ea`) and `claude-code` (`45bdfa96`) held steady, and no `.ts` files were modified. When reviewing a sync PR, verify against `git diff --stat` — if only `package.json` (version field) and `.github/last-sync-commits.json` (timestamps + optional commit hashes) are touched, no CHANGELOG surface additions are expected beyond the paired `### Changed` sync-tracking entry.

### CI Autohealing

When CI fails on auto/* branches:
1. Failure logs collected and analyzed
2. Quick fixes applied (lint:fix, format)
3. Alexi agent applies targeted fixes
4. Fixes verified and committed
5. Rate-limited: max 2 runs/branch/day

A common autohealing pattern is removing **broken upstream-sync stub files**: the daily upstream sync occasionally produces TypeScript scaffolds at non-canonical paths (for example, single-line placeholders directly under `src/tool/` instead of registered tools under `src/tool/tools/`, or stray `package.json` fragments inside source subdirectories). These fail `npm run build` and `npm run lint` because they reference packages that are not installed or contain JavaScript-style comments inside JSON. The autohealer detects the build/lint failure and deletes the offending stubs in a `fix(ci): remove broken stub files from upstream sync [autohealing]` commit. When reviewing such commits, verify that none of the deletions touch a registered tool in `src/tool/tools/` (those are the canonical tool implementations) — only stray paths under `src/tool/` itself or non-root `package.json` files should be removed.

Recent concrete examples of this pattern (see `CHANGELOG.md` `[Unreleased]` for the current cycle):

- `src/core/config/provider.ts` (2026-07-22 sync, commit `643087a9`; **removed** by autohealing in commit `8c174021`, 2026-07-22, `fix(ci): auto-fix CI failures [alexi-bot]`): 10-line orphan scaffold declaring a `providerConfig` object with a single `chunkTimeout` field (`Schema.optional(Schema.Union([PositiveInt, Schema.Literal(false)]))`) built against a non-existent `some-schema-library` import path. The file was broken on multiple axes: (1) `some-schema-library` is not a real package in `package.json` — a fresh clone would fail with `Cannot find module 'some-schema-library'` on first import; (2) `Schema.optional`, `Schema.Union`, `PositiveInt`, and `Schema.Literal` are Effect-Schema-style validation primitives, whereas Alexi standardises on Zod (`defineTool` schemas in `src/tool/index.ts`, `defineEvent` schemas in `src/bus/index.ts`); (3) `export default providerConfig` had no runtime consumer anywhere in `src/` or `tests/` — provider configuration in Alexi comes from `src/config/routingConfig.ts` (routing rules loaded from `routing-config.json`) and environment variables (`AICORE_SERVICE_KEY`, `AICORE_RESOURCE_GROUP`, `AICORE_MODEL`) consumed by `src/providers/index.ts`, not a nested `src/core/config/provider.ts` module; (4) the `src/core/config/` directory did not exist prior to the sync and has no other members — canonical configuration modules live in `src/config/` (a sibling of `src/core/`), not underneath it. Diff statistics: `1 file changed, 10 deletions(-)`. This is the canonical worked example of the "single-file scaffold at a fresh non-canonical subdirectory that imports a non-existent package" variant of the stub pattern. The companion 5-line `src/core/package.json` stub emitted by the same 2026-07-22 sync was subsequently **removed** by autohealing in commit `c3a88212` (2026-07-22, `fix(ci): remove stray src/core/package.json breaking ESM build [autohealing]`) — same ESM-boundary rationale as the 2026-07-17 `src/core/package.json` cleanup below. That stub declared `{ "dependencies": { "@ai-sdk/xai": "3.0.102" } }` with no `"type"` field; under `NodeNext` module resolution `tsc` walked to that nested manifest instead of the root `package.json`, emitted every file under `src/core/` as CommonJS, and the resulting mixed CJS/ESM tree failed at runtime with `SyntaxError: The requested module '../../core/sessionManager.js' does not provide an export named 'SessionManager'`. The `@ai-sdk/xai` reference itself was doubly wrong for Alexi: not imported anywhere in `src/` or `tests/`, and inconsistent with the sole-provider policy (SAP AI Core Orchestration via `src/providers/sapOrchestration.ts`). See the `[Unreleased] ### Removed` entry in `CHANGELOG.md` for commit `c3a88212` for the full rationale.
- `src/core/model.ts` (2026-07-17 sync, commit `a14eeca6`): 8-line orphan Zod schema referencing `z` and `ModelCostSchema` without any `import` statements and describing a BYOK provider surface (`byokProvider: 'openai' | 'anthropic' | 'google'`) that does not exist in Alexi — the sole provider is SAP AI Core Orchestration (`src/providers/`). Not imported by any module in `src/` or `tests/`. Still present at the time of writing; candidate for the next autohealing sweep.
- `infra/nix/hashes.json` (2026-07-30, commit `e708015a`, `fix(ci): remove invalid JSON comment from infra/nix/hashes.json [alexi-bot]`; **fixed** in-place, not deleted): Canonical worked example of the "JavaScript-style comments inside JSON" variant of the invalid-JSON pattern. The file had accumulated a `// updated hashes` line-comment nested inside the top-level `"hashes"` object, which is a `SyntaxError` under strict JSON parsing (JSON does not permit `//` or `/* */` comments per RFC 8259 §2, unlike JSON5 / JSONC). The autohealer removed the comment line and collapsed the now-empty object to `{ "hashes": {} }`. Diff statistics: `1 file changed, 1 insertion(+), 3 deletions(-)`. Unlike the orphan-stub variants above, `infra/nix/hashes.json` is a legitimate live metadata file consumed by the reproducible-build tooling under `infra/nix/` — the correct autohealing disposition was to **repair** the JSON syntax in-place, not to delete the file. When reviewing similar JSON-syntax-fix commits, verify that the file has a real downstream consumer (Nix flake, `jq` script, CI JSON-lint step, or editor schema binding) before choosing between the "repair" and "delete" dispositions.
- `src/core/package.json` (2026-07-17 sync, commit `a14eeca6`; **removed** by autohealing in commit `0305e95f`, 2026-07-17, `fix(ci): remove stray src/core/package.json breaking ESM build [autohealing]`): 3-line nested `{"version": "1.18.3"}` inside the source tree that created a package boundary conflicting with the top-level `"type": "module"` declaration and broke `npm run build`. The autohealer detected the ESM-build failure and deleted the file, restoring green CI. Diff statistics: `1 file changed, 3 deletions(-)`. This is the canonical worked example of the "stray `package.json` fragments inside source subdirectories" pattern called out above.
- `src/core/pty.node.ts` and `src/core/session.ts` (2026-07-21 sync, commit `5520cd54`; **removed** by autohealing in commit `7b47d5e0`, 2026-07-21, `fix(ci): remove broken stub files from upstream sync [autohealing]`): Two orphan TypeScript scaffolds imported from `sst/opencode`'s `packages/core/` subtree that referenced non-existent Alexi modules. `pty.node.ts` (19 lines) declared a `Proc` interface and a `spawn` wrapper around `node-pty` — a package that is not in Alexi's `package.json` because Alexi has no PTY-backed terminal surface (shell execution is handled by the `bash` tool at `src/tool/bash.ts` using `child_process.spawn`, not a pseudo-terminal). `session.ts` (11 lines) declared a `SessionRevert` schema using Effect-Schema primitives (`Schema.Struct`, `Schema.Literals`, `optionalOmitUndefined`) imported from `../utils/schema` and `PartID` from `../types`, neither of which exist in the source tree — Alexi uses Zod for validation (`src/tool/index.ts` `defineTool`, `src/bus/index.ts` `defineEvent`) and its canonical session type lives in `src/core/sessionManager.ts`, with revert/undo handled by `src/undo/` and `src/core/checkpoints.ts`. Diff statistics: `2 files changed, 30 deletions(-)`. Same invariant: verify against `src/providers/` and canonical runtime surfaces before treating an upstream-imported file as a live module.
- The canonical model metadata surface in Alexi is the runtime deployment list returned by the SAP AI Core Orchestration API and surfaced via `alexi models`, not a static Zod schema under `src/core/`. When reviewing autohealing PRs against these paths, verify against `src/providers/` (the sole provider surface) and the top-level `package.json` (which owns the single `"type": "module"` declaration for the whole tree). Session revert / undo semantics live in `src/undo/` and `src/core/checkpoints.ts`, and shell execution lives in the `bash` tool at `src/tool/bash.ts` — not in any top-level `src/core/session.ts` or `src/core/pty*.ts` file. Provider-level configuration (streaming timeouts, chunk watchdogs, credentials) is expressed through routing rules in `routing-config.json` (loaded via `src/config/routingConfig.ts`) and environment variables consumed by `src/providers/index.ts` — not through a nested `src/core/config/` schema module.
- **Four new orphan stubs under `src/agent/`, `src/cli/`, and `src/context/` (2026-07-26 sync, commit `0985297e`; pending autohealing)**: The 2026-07-26 upstream sync added four brand-new orphan TypeScript files with zero consumers in `src/` or `tests/`, each broken in a slightly different way. This is the same "single-file scaffolds emitted at non-canonical paths" variant of the stub pattern documented in the earlier entries above; unlike the 2026-07-24 `530351f4` regression, none of the 2026-07-26 stubs overwrote a previously-populated file, so all four must be **deleted** (not restored) by the next autohealing sweep. Per-file rationale for reviewers: (1) `src/agent/instance-advertisement.ts` (5 lines) exports `advertiseInstance(instanceId: string): void` whose only body is `console.log(...)`, violating the project-wide `no-console` ESLint rule — the canonical `AgentRegistry` surface lives at `src/agent/index.ts` (currently in the broken state from the 2026-07-24 sync), never in per-feature files directly under `src/agent/`; (2) `src/cli/remote.ts` (5 lines) declares a non-exported `executeRemoteCommand(command: string): void` that calls an undeclared `isValidCommand` — `TS2304` at typecheck time, and there is no `alexi remote` subcommand on Alexi's Commander.js program (`src/cli/program.ts`); (3) `src/context/global-sync/bootstrap.ts` (4 lines) exports `bootstrapGlobalSync(): void` calling an undeclared `initializeContext()`, and the fresh `src/context/global-sync/` directory has no other members — the canonical upstream-sync entrypoint is `.github/workflows/sync-upstream.yml`, not a runtime module; (4) `src/context/server-session-reducer.ts` (4 lines) declares a non-exported `reduceSession(session: Session): Session` referencing undeclared `Session` and `optimizeSessionData`, and — critically — has no `return` statement despite the `: Session` return-type annotation, producing three TypeScript errors on a single 4-line file (`TS2304`, `TS2304`, `TS2355`). When reviewing the autohealing PR for the 2026-07-26 cycle, verify that all four files are deleted, plus the empty `src/context/global-sync/` directory. Cross-reference the CHANGELOG `### Added` entry for 2026-07-26 for the full recovery specification, and note that the 2026-07-24 `530351f4` regression on `src/agent/index.ts` remains pending — the 2026-07-26 autohealing pass should either combine both cleanups or explicitly leave `src/agent/index.ts` recovery for a follow-up commit, whichever the autohealer's per-run scope covers.
- **Five new orphan stubs under `src/core/` and `src/tool/` (2026-07-29 sync, commit `719046d4`; **removed** by autohealing in commit `b44ac96f`, 2026-07-29, `fix(ci): remove orphan stub files from upstream sync [autohealing]`)**: The 2026-07-29 upstream sync added five brand-new orphan TypeScript files that were single-fragment code snippets copied verbatim from upstream `sst/opencode` sources — none of them parsed as TypeScript, none had valid module structure, and none were imported by any module in `src/` or `tests/`. Aggregate diff for the autohealing removal: `5 files changed, 20 deletions(-)`. Per-file rationale for reviewers: (1) `src/core/config/plugin/provider.ts` (1 line: `const integrationTransform = yield* integrations.transform()`) — `yield*` outside a generator is a `SyntaxError`, `integrations` is undeclared, and the fresh `src/core/config/plugin/` directory has no other members; canonical provider configuration in Alexi lives in `src/providers/sapOrchestration.ts` and `src/providers/index.ts`, not a nested `src/core/config/plugin/provider.ts`. (2) `src/core/credential.ts` (1 line: `readonly get: (id: ID) => Effect.Effect<Stored | undefined>`) — a bare interface member at the top level is a `SyntaxError`, `ID`/`Effect`/`Stored` are all undeclared, and `Effect.Effect<...>` is an Effect-TS pattern Alexi does not use; SAP AI Core credentials are read from environment variables (`AICORE_SERVICE_KEY`, `AICORE_RESOURCE_GROUP`) by `src/providers/auth.ts`. (3) `src/core/integration.ts` (1 line: `export const TextPrompt = Schema.Struct({`) — unterminated object literal is a `SyntaxError`, `Schema` is undeclared, and `Schema.Struct` is an Effect-Schema primitive Alexi does not use; Alexi standardises on Zod (`defineTool`, `defineEvent`). (4) `src/tool/code-mode-integration.test.ts` (1 line: `server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOL_DEFS }))`) — `server`/`ListToolsRequestSchema`/`TOOL_DEFS` are all undeclared, no `describe`/`it` block so Vitest would not register a test suite, and Alexi's MCP integration lives in `src/mcp/server.ts` without a `code-mode` tool. (5) `src/tool/code-mode.ts` (13-line unclosed `return yield* Effect.promise(async () => { ... })` block) — `return` and `yield*` outside a function body are both `SyntaxError`, and Alexi has no `code-mode` tool (canonical built-ins are `bash`, `read`, `write`, `edit`, `glob`, `grep`, `task`, `webfetch`, `task_status` registered via `src/tool/registry.ts`). This is a fresh worked example of the **single-fragment non-parseable snippet** variant of the stub pattern — different from the earlier "single-file scaffolds referencing non-existent packages" variant (2026-07-22 `src/core/config/provider.ts`) in that these files were never valid TypeScript at all. When reviewing autohealing PRs for this pattern, verify that all deletions correspond to non-parseable fragments (a `tsc --noEmit` on the file would fail with a `SyntaxError`, not just `TS2307`/`TS2304`), and that none of the deletions touch `src/tool/tools/` (registered tools) or `src/mcp/` (canonical MCP integration). See the `[Unreleased] ### Removed` entry in `CHANGELOG.md` for commit `b44ac96f` for the full per-file recovery specification.
- **`src/agent/index.ts` + four orphan `packages/...` stubs (2026-07-24 sync, commit `530351f4`; pending autohealing)**: The 2026-07-24 upstream sync introduced a new **destructive** variant of the stub pattern that must be handled differently from previous instances. Rather than emitting brand-new orphan files, the sync **overwrote** a 554-line runtime module (`src/agent/index.ts`, which owns the entire `AgentRegistry` / `stripInternalOptions` / `INTERNAL_OPTION_KEYS` / built-in-agents surface) with a 3-line broken import stub pointing at `packages/opencode/src/agent/agent`. Seven downstream modules (`src/core/agenticChat.ts`, `src/core/streamingOrchestrator.ts`, `src/cli/commands/chat.ts`, `src/config/modes-migrator.ts`, `src/server/index.ts`, `src/tool/tools/task.ts`, plus the tests in `src/agent/index.test.ts` and `src/core/__tests__/agenticChat.test.ts`) import from this file and are all failing to type-check. The same sync also emitted four brand-new 3-line `packages/...` orphan stubs at `src/core/migration.ts`, `src/core/project.ts`, `src/core/session.ts`, and `src/providers/openai.ts` (and one legitimate documentation entry — `docs(tools): document optional tree-sitter grammar dependencies (#1091)`, commit `9f9fad90` — that autohealing must not touch). **Recovery rule for this variant**: `src/agent/index.ts` must be **reverted** to its pre-sync content at parent commit `9f9fad90` (`git checkout 9f9fad90 -- src/agent/index.ts`), because seven runtime modules depend on its exported surface — deleting the file would break the CLI. The other four files must be **deleted**, not restored, because they had no pre-sync content in this repository. When reviewing autohealing PRs for the 2026-07-24 cycle, verify that: (a) `src/agent/index.ts` is restored, not deleted, and contains the `AgentSchema`, `INTERNAL_OPTION_KEYS`, `stripInternalOptions`, `AgentRegistry`, `builtInAgents`, `getAgentRegistry`, `getCurrentAgent`, `switchAgent`, `removeAgent`, `parseAgentSwitch`, and `parseAgentMention` symbols required by the grep in the paired CHANGELOG entry; (b) the four orphan stubs are deleted; (c) `src/providers/openai.ts` is treated as sync noise and not as an OpenAI provider — the sole provider is SAP AI Core Orchestration per `docs/PROVIDERS.md`; (d) the 2026-07-24 tree-sitter documentation PR (#1091) is preserved as a legitimate doc change. This is the canonical worked example of the **destructive-replacement** variant of the sync-stub pattern: same 3-line `packages/...` shape as previous instances, but overwriting a live module rather than emerging at a fresh path.

A second, less destructive class of autohealing target is **dead assignments and tautological locals in test files**. Vitest tests that were originally structured around a "does not hang the event loop" invariant sometimes accumulate `let flag = false; ... flag = true; expect(flag).toBe(true)` scaffolding whose only surviving purpose is to make the author's intent explicit in the source. ESLint's `no-unused-vars` rule (upgraded to `error` in Alexi — see the ESLint configuration section above) flags the assignment as unused, and the CI autohealer removes the variable, its reassignment, and the tautological `expect(...)` call in a `fix(ci): remove unused assignment and apply prettier formatting [autohealing]` commit. The correct replacement is a **direct assertion on the object under test's own accessor** (e.g. `expect(w.size()).toBe(0)`) that observes a real post-condition rather than a self-referential local. Worked example, 2026-08-21, commit `e42429f4`: `tests/core/filesystem/instance-watcher.test.ts:137` (case `'setDebounceTimer clears the previous timer for the same directory'`) previously declared `let firstCleared = false`, immediately reassigned it, and asserted `expect(firstCleared).toBe(true)` — the assertion could never fail because the code path between the assignment and the assertion did not touch the variable. Autohealing deleted the three lines and inserted `expect(w.size()).toBe(0)` after `w.dispose()`, which asserts the actual observable post-condition of the `InstanceWatcher.dispose()` contract (`src/core/filesystem/watcher.ts:161` — clears every debouncer timer and the watchers map, `size()` returns `0`). Aggregate diff: `1 file changed, 3 insertions(+), 5 deletions(-)`. When reviewing similar autohealing commits, verify that (a) the replacement assertion targets a real observable property of the module under test, not just another local, and (b) the load-bearing property of the case — in this instance, that a leaked 60s `setTimeout` would keep the Vitest event loop alive past the 5s default test timeout — is preserved by the surrounding scaffolding. See `docs/TESTING.md` under **Testing InstanceWatcher and Debounce-Timer Cleanup** for the full regression contract for this suite.

### Pre-Commit Hooks

The project uses **Husky** with **lint-staged** to enforce style at commit time. On every commit, the following runs automatically against staged `.ts` files:

```json
{
  "*.ts": ["eslint --fix", "prettier --write"]
}
```

Combined with **commitlint** (conventional commits), this ensures that local commits always pass basic quality checks before reaching CI.

### Style Auto-Fix

The CI pipeline automatically applies formatting and linting corrections on eligible branches. These changes are committed with the message format:

```
style(ci): auto-fix lint/format issues [alexi-bot]
```

This ensures consistent code style (trailing whitespace removal, blank line normalization, Prettier formatting) across all modules without manual intervention. Common auto-fixed patterns include:
- Trailing whitespace in object return statements and function bodies (e.g., permission modules, tool implementations)
- Extraneous blank lines between code blocks in tool definitions and shell prompt builders
- Missing or extra trailing newlines at end of file
- Inconsistent spacing in namespace and class method definitions
- Quote-style normalization from double to single quotes per Prettier `singleQuote: true` (applied across `src/` and `tests/`)
- Multi-line-vs-single-line reflows of imports, `await expect(...)` chains, nullish-coalescing chains, `throw new Error(...)` calls with template-literal messages, `vi.importActual<T>()` generic type-argument lists, and generic type-parameter blocks to satisfy the 100-column `printWidth`. Auto-fix also strips stale `// eslint-disable-next-line no-console` pragmas above `vi.spyOn(console, ...)` calls — the `no-console` rule targets the `console.*` call surface, not `vi.spyOn(console, 'warn')` which manipulates the object via property reference, so the pragma is inert. Most recent worked example on the runtime tree: the 2026-08-20 pass in commit `cd5bc5f0` (`style(ci): auto-fix lint/format issues [alexi-bot]`) touched a single tool-implementation module, `src/tool/tools/agent-manager.ts`, collapsing two hand-authored five-line Zod field definitions on `AgentManagerParamsSchema` (`sessionId` and `worktreeId`, lines 14 and 15) onto the canonical single-line `z.string().nullable().optional().describe('...')` form. Both resulting lines fit at 89 and 87 columns respectively, well within `printWidth: 100`; Prettier prefers to keep short Zod chain expressions on a single line rather than breaking after each `.method(` call. Aggregate diff: `1 file changed, 2 insertions(+), 10 deletions(-)`. Pure formatting change with no runtime, validation, or type-safety impact — the schema still accepts `null` OR omitted values for both fields (preserving the nullable-friendly contract for strict providers), the `agent_manager` tool's permission entry (`{ action: 'admin', getResource: (params) => params.action }`) is unchanged, the enum on `action` is unchanged (`'create' | 'list' | 'stop' | 'status'`), and the `AgentManagerResult` interface is unchanged. The paired nested `config` field on the same schema is untouched because it does not fit on one line at 100 columns. Preceding worked example on the runtime tree: the 2026-08-18 pass in commit `576ea3d2` (`style(ci): auto-fix lint/format issues [alexi-bot]`) touched a single runtime module, `src/config/userConfig.ts`, collapsing a hand-authored three-line break of the `throw new Error(...)` inside `setConfigMcpToolDisplay(display: McpToolDisplay)` (line 278) onto the canonical single-line form. The template-literal error message `` `mcpToolDisplay must be 'expanded' or 'collapsed' (got '${String(display)}')` `` fits at 92 columns, well within `printWidth: 100`; Prettier prefers to keep short `throw new Error(<template>)` expressions on a single line rather than breaking after `new Error(`. Aggregate diff: `1 file changed, 1 insertion(+), 3 deletions(-)`. Pure formatting change with no runtime, validation, or type-safety impact — the runtime guard (`display !== 'expanded' && display !== 'collapsed'`) still throws for values outside the `McpToolDisplay = 'expanded' | 'collapsed'` union (defence-in-depth against callers that erase the type via `as McpToolDisplay` or dynamic import), the error message shape is preserved verbatim, and the paired reader `getConfigMcpToolDisplay()` still accepts both the camelCase `mcpToolDisplay` and the legacy snake_case `mcp_tool_display` keys and falls back to `'collapsed'` on corrupt input. Most recent worked example on the test tree: the 2026-08-13 pass in commit `2b2e5830` (`style(ci): auto-fix lint/format issues [alexi-bot]`) touched a single Vitest file, `tests/tool/tools/warpgrep.test.ts`, collapsing a hand-authored three-line break of `vi.importActual<\n  typeof import('../../../src/tool/tools/warpgrep.js')\n>('../../../src/tool/tools/warpgrep.js')` onto the canonical two-line form `vi.importActual<typeof import('../../../src/tool/tools/warpgrep.js')>(\n  '../../../src/tool/tools/warpgrep.js'\n)`. The `<...>` type-argument line fits at 96 columns, well within `printWidth: 100`; Prettier prefers to keep the generic type argument on the same line as the identifier and break only after the `(` for the runtime argument. Aggregate diff: `1 file changed, 3 insertions(+), 3 deletions(-)`. Pure formatting with no impact on assertion semantics, mock scope, coverage, or the tested surface — the `describe('WarpGrep built-in tool - removed from registry', ...)` suite still pins the same three-part contract for the retired `codebase_search` built-in tool (absent from `builtInTools` with or without `@morphllm/morphsdk`, `grep` description still surfaces the install hint). See `docs/TESTING.md` under **Test File Formatting** (pattern 3, `vi.importActual<T>()`) for the standing pattern. Prior worked example on the test tree: the 2026-08-12 pass in commit `9e2b9ca6` (`style(ci): auto-fix lint/format issues [alexi-bot]`) touched three Vitest files. `tests/config/global-invalidation.test.ts` had a stale `// eslint-disable-next-line no-console` pragma removed above a `vi.spyOn(console, 'warn').mockImplementation(() => {})` call (`+1/-1`). `tests/providers/reasoning-variants.test.ts` had a four-line named-import block for `deriveReasoningVariants` and `mergeProviderModels` from `src/providers/transform.ts` collapsed onto a single 90-column line (`+1/-4`). `tests/session/retry.test.ts` had two multi-line `await expect(withRetry(fn, ..., { maxAttempts, baseMs: 1 })).rejects.toBe(err)` chains collapsed onto single lines (`+2/-6`). Aggregate diff: `3 files changed, 4 insertions(+), 11 deletions(-)`. Pure formatting with no impact on assertion semantics, coverage, or the tested surfaces (`invalidateGlobalConfig`, `deriveReasoningVariants`, `mergeProviderModels`, `withRetry`). See `docs/TESTING.md` under **Test File Formatting** for the standing pattern. Prior worked example on the runtime source tree: the 2026-08-11 pass in commit `cf7e01de` (`style(ci): auto-fix lint/format issues [alexi-bot]`) collapsed the four-part `rule.tools?.[0] ?? rule.paths?.[0] ?? rule.commands?.[0] ?? rule.hosts?.[0]` fallback chain in `src/permission/index.ts` (the `matchedPattern` computation inside the last-match rule-provenance block) onto a single line, and expanded the `prepareRequest<T extends { prompt: LanguageModelV2Prompt }>(ctx: { providerId; modelId; auth; prompt } & T): T` signature in `src/providers/sapOrchestration.ts` from a single-line signature to a multi-line block (line 395-402). Diff statistics: `2 files changed, 9 insertions(+), 10 deletions(-)`. Both changes are pure formatting with no behavioural, API, or provider-routing impact — the fallback semantics (`??` order) and the intersection-type shape (`{ providerId; modelId; auth; prompt } & T`) are preserved verbatim. Unlike the orphan-stub pass documented above, these two files are **live runtime modules** (`PermissionManager.evaluate` and `prepareRequest<T>` respectively), so the auto-fix acts on real code rather than on autohealing-candidate scaffolds.
- Missing trailing semicolons on statements (e.g., bare `return` inside an early-exit branch, field declarations in object type literals, `const` statements) per Prettier `semi: true` -- recent examples include the semicolon added after the early `return` in `cancel(sessionID)` inside `src/session/prompt-queue.ts` (commit `8a005f03`), the bulk semicolon/quote-style/trailing-newline fixes applied to the orphan `inherited(input)` helper in `src/tool/task.ts` (commit `fe8b98c5`), the nine-file quote-style and trailing-newline pass on the 2026-06-22 upstream-sync stubs across `src/agent/index.ts`, `src/core/config.ts`, `src/core/index.ts`, `src/event/index.ts`, `src/plugin/provider.ts`, `src/session/index.ts`, `src/tool/parameters.test.ts.snap.ts`, `src/tool/task.ts`, and `src/tool/webfetch.ts` (commit `6dc4b883`), the single-line trailing-newline fix appended to the Express OpenAI-compatible route stub `src/router/openaiRoute.ts` (commit `25b45885`, 2026-07-19) immediately after the 2026-07-19 upstream sync (commit `3cca78f4`) imported it without a final LF, the four-file indent-normalisation pass (4-space → 2-space `tabWidth: 2`) on `src/agent/instance-advertisement.ts`, `src/cli/remote.ts`, `src/context/global-sync/bootstrap.ts`, and `src/context/server-session-reducer.ts` (commit `9a914b57`, 2026-07-26) immediately after the 2026-07-26 upstream sync, the three-file trailing-newline / `yield*` → `yield * ` / terminating-semicolon pass on `src/core/config/plugin/provider.ts`, `src/tool/code-mode.ts`, and `src/tool/code-mode-integration.test.ts` (commit `3a9b850b`, 2026-07-29) immediately after the 2026-07-29 upstream sync (commit `719046d4`), and the three-file quote-style-normalisation / trailing-newline pass on `src/permission/PermissionView.ts` (four double-to-single-quote conversions inside an `updatePermissionView(card, permission)` function referencing an unresolved `'utils'` bare-module import and an undeclared `syncDescription` free identifier), `src/tool/BaseSearchToolView.ts` (a trivially-infinite-recursive `bindHeader(parts)` function with an implicit-`any` parameter), and `src/tool/PatchBody.ts` (a top-level `return` statement — a `SyntaxError` in ES modules — inside an `if (diffLines.length > DIFF_MAX_LINES)` block with three undeclared identifiers and a `./DiffOverflow` import missing the mandatory `.js` extension per `NodeNext`) — commit `36ac95b2`, 2026-08-01, immediately after the 2026-08-01 upstream sync (commit `b8b9f01b`, version bump `1.18.17` → `1.18.18`) — all remain orphan stubs and are recorded in the corresponding `CHANGELOG.md` `### Fixed` entry as autohealing candidates. When writing new code, run `npm run format` locally to avoid these no-op fix-up commits from the autohealer. Note that orphan stubs emitted by the daily upstream sync (single-file scaffolds at non-canonical paths under `src/`, importing missing namespaces or referencing undeclared symbols such as `EventHandler`, `FetchOptions`, or the non-existent `'core'`, `'session'`, `'plugin'` packages, or referencing missing sibling directories such as `../handlers/openai`) routinely receive these formatting fix-ups in the commit immediately following the sync; they do not indicate that the stub is wired into the runtime. Verify the canonical implementation path before treating an auto-fixed file as a live module -- for tools, the canonical location is always `src/tool/tools/<name>.ts` registered via `src/tool/registry.ts`, never directly under `src/tool/`; for the event bus the canonical location is `src/bus/index.ts`, not `src/event/index.ts`; for sessions it is `src/core/sessionManager.ts`, not `src/session/index.ts`; for configuration it is `src/config/` (`routingConfig.ts`, `userConfig.ts`, `projectContext.ts`), not `src/core/config.ts`; and for HTTP surfaces it is `src/server/` (the documented server-mode entry point in `docs/API.md`), not `src/router/` (which currently holds orphan Express router stubs). Recall that Alexi's sole provider surface is SAP AI Core Orchestration (`src/providers/`); files under `src/router/` that appear to expose an OpenAI-compatible ingress route are upstream-sync scaffolds and are not part of Alexi's runtime.

### Daily PR Merge

At 18:00 UTC daily, Kilo CLI processes open PRs:
- Checks merge eligibility
- Resolves simple conflicts
- Reports merge results
- Supports dry-run mode

### Contributing to Automation

When modifying workflows:
1. Test with manual dispatch and dry-run first
2. Update `docs/AUTOMATION.md`
3. Document new secrets or configuration
4. Use concurrency groups to prevent parallel runs
5. Set appropriate timeouts

## Adding New Slash Commands

When adding a new interactive REPL command (like `/rewind` or `/code-review`):

1. **Add to completer registry** (`src/cli/utils/completer.ts`):
   ```typescript
   { name: 'mycommand', description: 'What it does', category: 'general' }
   ```

2. **Implement handler in the legacy REPL** (`src/cli/interactive.ts`) under the
   `handleCommand` switch. If the command runs a long-running async task, swap in a
   dedicated `AbortController` so Ctrl+C cancels only the task and not the session,
   then restore the previous controller in `finally`:
   ```typescript
   case 'mycommand': {
     const taskAbort = new AbortController();
     const prev = state.abortController;
     state.abortController = taskAbort;
     try {
       const { executeMyCommand } = await import('../command/mycommand.js');
       await executeMyCommand({ signal: taskAbort.signal });
     } finally {
       state.abortController = prev;
     }
     return true;
   }
   ```

3. **Wire the Ink TUI slash command** (`src/cli/tui/hooks/useCommands.ts`) by appending
   to the array returned from `buildCommands`. Use `addSystemMessage` to surface output:
   ```typescript
   {
     name: 'mycommand',
     description: 'What it does',
     category: 'general',
     execute: async (args, _ctx) => {
       const { executeMyCommand } = await import('../../../command/mycommand.js');
       const result = await executeMyCommand({ /* ... */ });
       deps.addSystemMessage(result.output);
       return true;
     },
   }
   ```

4. **Create the implementation module** in `src/command/mycommand.ts`. Keep it
   self-contained (no `process.exit`, no direct stdout writes) so it can be reused
   by the CLI subcommand and both interactive surfaces. Accept an `AbortSignal` and
   an `onProgress` callback when applicable.

5. **Add a non-interactive CLI subcommand** in `src/cli/commands/mycommand.ts` and
   register it in `src/cli/commands/index.ts` (`registerAllCommands`):
   ```typescript
   import { registerMyCommand } from './mycommand.js';
   // inside registerAllCommands:
   registerMyCommand(program);
   ```

6. **Write tests** in two places:
   - `tests/command/mycommand.test.ts` -- core executor (mock external deps like
     `child_process` or `sendChat`). See `tests/command/codeReview.test.ts` for a
     reference covering effort routing, cancellation, and an empty-input fast path.
   - `src/cli/commands/__tests__/mycommand.test.ts` -- Commander wiring smoke test
     using `Command.exitOverride()`. See `src/cli/commands/__tests__/codeReview.test.ts`.

7. **Update documentation**:
   - `docs/API.md` under both **CLI Commands** (subcommand) and **Interactive Mode
     Commands** (slash command)
   - `docs/ARCHITECTURE.md` if the command introduces a non-trivial flow
   - `docs/TESTING.md` if the test pattern differs from existing commands
   - `CHANGELOG.md` under `[Unreleased]`

## Getting Help

- Open an issue for bugs or feature requests
- Check existing issues before creating new ones
- Provide minimal reproducible examples for bugs
- Reference specific file paths and line numbers

## Factoring TUI Components

Effective 1.20.2, TUI components under `src/cli/tui/components/` should follow a two-layer separation:

1. **Pure string / logic helpers** live in `src/cli/tui/utils/*.ts` and never import from `ink` or `react`. Example: `formatBashCommand`, `truncateOutput`, `formatParamsPreview`, `formatDuration`, `guessLanguageFromPath` in `src/cli/tui/utils/formatToolOutput.ts`.
2. **Render-only components** live in `src/cli/tui/components/*.tsx` and consume the helpers above. Example: `ToolRow.tsx` delegates all string formatting to `formatToolOutput.ts` and focuses on layout, colors, and disclosure state.

This split lets pure helpers be unit-tested without booting an Ink render harness (see `docs/TESTING.md#pure-string-helpers-testable-without-ink`). If you find yourself writing complex string manipulation inside a component's render body, move it to `utils/` first.

When a component's public prop shape is stable and external consumers import it by name, prefer a thin backwards-compatible wrapper over a rename. `ToolCallBlock.tsx` is the reference example — it re-exports `ToolRowProps` as `ToolCallBlockProps` and delegates to `ToolRow` in ~4 lines.

## Introducing Retry-Aware Modules

Any new module that calls out to SAP AI Core (or another network dependency) should:

1. Use `withRetry` from `src/core/session/retry.ts` for retries — do not roll your own loop.
2. Supply a `shouldRetry` predicate that consults the transient-vs-permanent contract in `AGENTS.md#error-classification-retry-vs-config-fix`. The canonical implementations live in `src/core/error-backoff.ts` — prefer `isRetryableError(err)` for the coarse "is this transient?" check; use `isRateLimitError`, `isXAICapacityError`, and `isPermanentAuthFailure` directly when you need to distinguish sub-cases (e.g. render a rate-limit-specific UX).
3. Tune `RetryOptions` for the workload: interactive chat uses the defaults (8 attempts × 30s cap); background jobs may prefer a lower `maxAttempts` and a higher `maxMs`.
4. In tests, pass `jitter: false` so the exponential curve is deterministic.

Never re-add unconditional retries. Retrying an expensive model call on a permanent failure (401, 403, 400, `model_not_found`) just burns tokens.

When adding a new transient-error classifier to `src/core/error-backoff.ts` (as with `isXAICapacityError` in 1.21.4), also wire it into `isRetryableError` so higher-level drivers pick it up automatically. Extend the transient-error table in `docs/ARCHITECTURE.md#error-classification-tables` and add a coverage matrix under `src/core/__tests__/error-backoff.test.ts` — a false positive here means real config failures get retried and waste provider budget, so the test suite must cover both positive and negative cases.

## Config-Derived Caches

If your module maintains a cache derived from `~/.alexi/config.json` (routing config, provider config, permission ruleset, model list, etc.), register a disposer via `registerInstanceCache` from `src/config/invalidation.ts` at module load. `updateGlobal(updates, { dispose: true })` will then flush your cache whenever the user rewrites global config.

Do not read the config file synchronously on every operation — cache the parsed result and rely on invalidation for freshness.

## Per-Instance State

Effective 1.21.4, module-level singleton state that is unsafe to share between concurrent Alexi sessions (multiple SAP AI Core workspaces in the same process, headless `alexi agent` alongside the interactive TUI, subagents, ...) MUST be refactored into a per-instance class. `src/core/filesystem/watcher.ts` is the reference: an `InstanceWatcher` class owns the `Map<directory, disposer>` and every debounce timer, plus a module-level `defaultInstance` and `startWatcher(...)` shim to keep pre-refactor call sites compiling.

Contract for a new per-instance module:

1. Encapsulate the state on the instance. No `Map` or `Set` at module scope — those become cross-session bombs.
2. Expose `dispose()` and make it idempotent (iterate a snapshot when disposers mutate the map during iteration).
3. Provide a backwards-compatible module-level shim only if there are existing call sites that cannot be migrated in the same PR. Every new call site owns its own instance.
4. Add a `getDefault<Thing>Instance()` accessor gated on test use so tests can assert on the default instance's behaviour without touching internals.
5. Cover isolation between two instances in the tests (see `tests/core/filesystem/instance-watcher.test.ts` for the reference pattern) — this is the regression the refactor exists to prevent.

## `displayRole` for Hidden Instrumentation

Effective 1.21.4 (issue #1466), messages that must reach the model but stay out of the user-facing transcript should be persisted with `displayRole: 'system'` on the `Message` interface. The provider still receives the message with its logical `role` (`'user'`, `'assistant'`, `'system'`); `displayRole` is a UI-only filter honoured by `MessageArea`, `SessionReplay`, and any future transcript surface.

Contract for hook / instrumentation authors:

- Use `sessionManager.addMessage(role, content, tokens, { displayRole: 'system' })` when persisting a message the user should not see. Do NOT set `role: 'system'` unless the message is genuinely part of the system prompt — `role` is the model-facing dimension.
- Auto-title generation skips any message carrying `displayRole`, so a `displayRole: 'system'` hook message will not become the session title.
- If you add a new transcript view (a `sessions view` subcommand, an HTTP `/api/session/:id` endpoint, an MCP resource), you MUST honour `displayRole: 'system'` as a hard-hide. Tests should cover both the "user message is visible" and "displayRole=system is hidden even when showSystemMessages=true" cases.

## License

By contributing, you agree that your contributions will be licensed under the same license as the project (MIT).
