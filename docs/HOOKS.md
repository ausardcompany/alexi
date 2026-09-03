# Hooks

Alexi's hooks system lets external code intercept and react to lifecycle events
such as tool invocations and session boundaries. Hooks are declared in a JSON
config file (`.alexi/hooks.json` at the repo root, or under
`~/.alexi/hooks.json`) and are executed by the hook manager in
[`src/hooks/index.ts`](../src/hooks/index.ts).

This document covers:

- The full list of lifecycle events Alexi fires
- The three hook _transports_ (command, HTTP, script) and when to use each
- The `HookContext` and `HookResult` contract
- A reference implementation of pattern-based access control (an
  `.alexiignore` script hook, adapted from Cline PR
  [#13649](https://github.com/cline/cline/pull/13649))
- Guidance on preventing bypass attacks via path canonicalization
- Known limitations and future-work notes

Hooks are inspired by Claude Code's hook system, adapted to Alexi's
provider-agnostic orchestrator. Nothing in this document requires live SAP AI
Core credentials — hooks are pure lifecycle interceptors that run in the CLI
process.

## Lifecycle events

The manager fires a fixed set of events (see the `HookEvent` union in
[`src/hooks/index.ts`](../src/hooks/index.ts)). The events most useful for
access control are the two around tool execution.

| Event                | When it fires                                                        | Blocking? |
| -------------------- | -------------------------------------------------------------------- | --------- |
| `SessionStart`       | A session begins or is resumed from `~/.alexi/sessions/`             | No        |
| `SessionEnd`         | A session terminates cleanly                                         | No        |
| `PreToolUse`         | Before a tool executes; can allow or reject the call                 | Yes       |
| `PostToolUse`        | After a tool executes successfully                                   | No        |
| `PostToolUseFailure` | After a tool throws or returns an error result                       | No        |
| `PermissionRequest`  | Before a permission dialog is shown to the user                      | No        |
| `Stop`               | The model finishes a turn; can request one more turn (up to the cap) | Yes       |
| `Error`              | An error surfaces to the caller                                      | No        |

Only `PreToolUse` and `Stop` are semantically blocking. A `PreToolUse` hook
that returns `success: false` prevents the tool from running; a `Stop` hook
that returns `success: false` asks the agent loop to continue. Both are
capped so a runaway hook cannot loop forever — `Stop` uses the
`STOP_HOOK_BLOCK_CAP` cap (default `8`, overridable via
`ALEXI_STOP_HOOK_BLOCK_CAP`); `PreToolUse` blocks abort the current tool
call and either halt the agent loop or feed the rejection back to the
model as a synthetic tool result (see `continueOnBlock` below).

## Hook transports

Every hook declaration specifies a `type` that determines how it runs.

- **`command`** — spawns a child process via `/bin/sh -c` (Unix) or
  `cmd.exe /c` (Windows). Stdout is captured and, if it parses as JSON with a
  `hookSpecificOutput` or `contextModification` field, is threaded back into
  the hook result. Exit code `0` is success; anything else is failure. Env
  vars `ALEXI_HOOK_EVENT`, `ALEXI_HOOK_TOOL`, `ALEXI_HOOK_SESSION`, and
  `ALEXI_HOOK_TIMESTAMP` are exported for the child. This is the transport
  every event supports.
- **`http`** — `fetch()`s a URL (POST by default) with the `HookContext`
  serialised as the JSON body. Templates like `{{toolName}}` are substituted
  in the URL and in headers. HTTP `2xx` is success; anything else is failure.
  Not allowed for `SessionStart`, `SessionEnd`, or `Error` events because
  those need to fire even when the network is unreliable.
- **`script`** — dynamically imports a local `.ts` / `.js` / `.mjs` file
  via `pathToFileURL` and invokes its default export (or a named `hook`
  export) with the `HookContext`. The return value is captured; if it is an
  object with `hookSpecificOutput` / `contextModification` fields those are
  parsed into the result. This is the transport you want for anything that
  needs structured decisions like pattern matching, because you get typed
  JavaScript instead of shelling out.

All three transports honour a `timeout` (default 30 s) and an optional
`tools` allowlist that restricts the hook to specific tool names, plus a
`continueOnBlock` flag documented in the next section.

## HookContext and HookResult

Every hook is invoked with a `HookContext` and must return (or emit, for
command/http transports) a `HookResult`. The Zod schemas in
[`src/hooks/index.ts`](../src/hooks/index.ts) are authoritative; the shapes
below are the practical subset.

```ts
interface HookContext {
  event: HookEvent;
  timestamp: number;
  sessionId?: string;
  toolName?: string; // set on PreToolUse / PostToolUse / PostToolUseFailure
  toolParams?: Record<string, unknown>; // reserved; not populated by every call site
  toolResult?: unknown; // set on PostToolUse / PostToolUseFailure
  error?: string; // set on Error / PostToolUseFailure
}

interface HookResult {
  success: boolean;
  output?: string; // stdout / HTTP body / stringified script return
  error?: string; // reason if success === false
  duration: number;
  capped?: boolean; // Stop hook hit the block cap
  continueOnBlock?: boolean; // propagated from the hook definition
  hookSpecificOutput?: { reloadSkills?: boolean; sessionTitle?: string };
  contextModification?: string; // injected as a <hook_context> user message
}
```

Two knobs deserve special attention for access-control use cases:

- **`continueOnBlock` on the hook definition.** When `true`, a `success:
false` `PreToolUse` result does _not_ throw. Instead, the orchestrator
  synthesises a `tool` message with the rejection reason and hands control
  back to the model, so the assistant can apologise or try a different
  approach. When `false` (the default), the agent loop halts with an
  exception. For `.alexiignore`-style hooks, `continueOnBlock: true` is
  almost always what you want — a hard halt on every blocked read would be
  a very poor UX.
- **`contextModification` on the hook result.** A free-form string that the
  orchestrator wraps in a `<hook_context tool_name="..." tool_call_id="...">`
  user message and appends after the tool results for the current iteration.
  Capped at 50 KB (`MAX_HOOK_CONTEXT_BYTES`) so a runaway hook cannot drown
  the prompt. Useful for surfacing _why_ a call was blocked without altering
  the tool's actual response envelope.

## Reference: pattern-based access control (`.alexiignore`)

This section documents a reference implementation of Cline PR
[#13649](https://github.com/cline/cline/pull/13649), adapted to Alexi's
script-hook contract. Alexi does not currently ship an `.alexiignore` feature
— when permission hardening is prioritised, this is the pattern to copy.

### The problem

Without pattern-based access control, an agent can read credentials from
`.env`, overwrite `~/.ssh/config`, or run `rm -rf` on a protected directory.
A gitignore-style ignore file (`.alexiignore`) is a well-understood way for
users to declare "these paths are off-limits to the agent." A naïve
implementation is easy to bypass, though — an attacker can rewrite `.env` as
`./.env`, `secrets/../.env`, or `/root/./.env` and slip past a literal string
compare.

### The solution

A single `PreToolUse` script hook that:

1. Loads `.alexiignore` from the current working directory (falling back to
   allow-all when the file is absent).
2. Extracts every filesystem path that appears in the current tool call.
3. Canonicalises each path (collapses `.`, `..`, and empty segments; strips
   a leading `./`) _before_ matching.
4. Blocks the call if any canonicalised path matches an ignore pattern.
5. Explicitly protects `.alexiignore` itself from being written or deleted.

The hook returns `{ success: false, error, continueOnBlock: true }` on a
match. Alexi's orchestrator surfaces the rejection to the model as a
synthetic tool result, letting the assistant recover gracefully.

### Example `.alexiignore`

The syntax is standard gitignore. Anything the [`ignore`
package](https://www.npmjs.com/package/ignore) accepts works here.

```gitignore
# Credentials and secrets
.env
.env.*
*.key
*.pem
secrets/
credentials/

# Home-directory secrets that leak into `bash` calls
.ssh/
.aws/
.kube/config

# Build artefacts (defensive; agents rarely need these)
node_modules/
dist/
coverage/

# OS files
.DS_Store
Thumbs.db
```

### The hook script

Place this file at `.alexi/hooks/alexiignore.ts` (or any path you like — the
config below points at it explicitly). It uses the `ignore` npm package for
gitignore parsing, so add it as a dev dependency of your workspace if you
adopt the pattern (`npm install --save-dev ignore`).

```ts
// .alexi/hooks/alexiignore.ts
import { promises as fs } from 'fs';
import * as path from 'path';
import ignore from 'ignore';
import type { HookContext, HookResult } from 'alexi/dist/hooks/index.js';

const IGNORE_FILE = '.alexiignore';

// Tool names this hook applies to. The list mirrors the tools in
// `src/tool/tools/` that touch the filesystem or shell out.
const FILE_TOOLS = new Set(['read', 'write', 'edit', 'multiedit', 'apply_patch', 'delete', 'ls']);
const SHELL_TOOLS = new Set(['bash', 'background-process']);

/**
 * Canonicalise a path so that noncanonical forms cannot bypass the ignore
 * match. `./.env` becomes `.env`, `secrets/../.env` becomes `.env`,
 * `/root/./x` becomes `/root/x`, and repeated slashes collapse.
 *
 * We deliberately do NOT resolve symlinks here — that would require a stat
 * syscall per candidate path, and would still race against symlink swaps.
 * The Limitations section below covers symlink hardening.
 */
function canonicalise(filePath: string): string {
  const normalised = path.normalize(filePath);
  return normalised.startsWith('./') ? normalised.slice(2) : normalised;
}

/**
 * Extract candidate filesystem paths from a tool's arguments. Alexi's tools
 * declare their arg shapes via Zod schemas in `src/tool/tools/*.ts` — the
 * fields checked below match the common ones (`filePath`, `path`,
 * `filePaths`, `command`).
 */
function extractPaths(toolName: string, params: Record<string, unknown>): string[] {
  const paths: string[] = [];

  if (FILE_TOOLS.has(toolName)) {
    for (const key of ['filePath', 'path', 'file']) {
      const value = params[key];
      if (typeof value === 'string') {
        paths.push(value);
      }
    }
    const filePaths = params.filePaths;
    if (Array.isArray(filePaths)) {
      for (const entry of filePaths) {
        if (typeof entry === 'string') {
          paths.push(entry);
        }
      }
    }
  }

  if (SHELL_TOOLS.has(toolName) && typeof params.command === 'string') {
    // Deliberately conservative regex: match common file-touching binaries
    // followed by a path-looking argument. This is a heuristic, not a real
    // shell parser — see Limitations for the caveats.
    const commandPattern =
      /(?:^|[|;&`$(\s])(?:cat|tac|less|more|head|tail|vim|vi|emacs|nano|rm|mv|cp|chmod|chown|touch|dd|tee)\s+([^\s|;&`$()<>]+)/g;
    let match: RegExpExecArray | null;
    while ((match = commandPattern.exec(params.command)) !== null) {
      paths.push(match[1]);
    }
  }

  return paths;
}

async function loadIgnore(): Promise<ReturnType<typeof ignore> | null> {
  try {
    const content = await fs.readFile(IGNORE_FILE, 'utf-8');
    return ignore().add(content);
  } catch {
    // Absent ignore file means allow-all — this is the same posture as
    // gitignore. Users opt in by creating the file.
    return null;
  }
}

export default async function alexiIgnoreHook(context: HookContext): Promise<Partial<HookResult>> {
  const toolName = context.toolName ?? '';
  if (!FILE_TOOLS.has(toolName) && !SHELL_TOOLS.has(toolName)) {
    return { success: true };
  }

  const params = context.toolParams ?? {};
  const rawPaths = extractPaths(toolName, params);
  if (rawPaths.length === 0) {
    return { success: true };
  }

  const canonicalPaths = rawPaths.map(canonicalise);
  const canonicalIgnoreFile = canonicalise(IGNORE_FILE);

  // Self-protection: the ignore file must not be writable via the agent,
  // otherwise a compromised prompt could disable the guard by editing it.
  if (toolName === 'write' || toolName === 'edit' || toolName === 'multiedit') {
    if (canonicalPaths.includes(canonicalIgnoreFile)) {
      return {
        success: false,
        error: `Refusing to modify ${IGNORE_FILE} (self-protection)`,
      };
    }
  }
  if (toolName === 'delete' && canonicalPaths.includes(canonicalIgnoreFile)) {
    return {
      success: false,
      error: `Refusing to delete ${IGNORE_FILE} (self-protection)`,
    };
  }

  const ig = await loadIgnore();
  if (!ig) {
    return { success: true };
  }

  for (const candidate of canonicalPaths) {
    // `ignore` rejects absolute paths and leading slashes — strip both so a
    // match on `secrets/` still catches `/repo/secrets/x`.
    const relative = candidate.replace(/^\/+/, '');
    if (relative.length === 0) {
      continue;
    }
    if (ig.ignores(relative)) {
      return {
        success: false,
        error: `Path blocked by ${IGNORE_FILE}: ${candidate}`,
      };
    }
  }

  return { success: true };
}
```

### Registering the hook

Add an entry to `.alexi/hooks.json` in your project root:

```json
{
  "hooks": [
    {
      "event": "PreToolUse",
      "type": "script",
      "script": ".alexi/hooks/alexiignore.ts",
      "description": "Block filesystem tools from touching .alexiignore matches",
      "continueOnBlock": true,
      "timeout": 2000
    }
  ]
}
```

Notes on the config fields:

- `continueOnBlock: true` — a match feeds the rejection back to the model
  instead of halting the agent loop. Recommended for user-facing access
  control.
- `timeout: 2000` — the hook should decide within 2 s. Loading a small
  `.alexiignore` and running a few `path.normalize` calls is well under a
  millisecond in practice; the timeout exists so a hung filesystem read
  cannot stall the agent.
- No `tools:` filter is set, but the hook itself early-returns for tools it
  does not care about. Either strategy works; a config-level `tools:` list
  gives an extra layer of defence.

### Attack prevention

Without canonicalisation, an attacker can trivially bypass a literal match:

```
read({ filePath: "./.env" })         // slips past a literal ".env" check
read({ filePath: "secrets/../.env" }) // traversal into the same file
read({ filePath: "/root/./.env" })   // superfluous ./ in an absolute path
```

`canonicalise` collapses these to the ignore-file entry before matching:

```
canonicalise("./.env")           === ".env"     → blocked
canonicalise("secrets/../.env")  === ".env"     → blocked
canonicalise("/root/./.env")     === "/root/.env" → blocked (matches "**/.env" style rules)
```

The same canonicalisation runs against the ignore-file self-protection
check, so `edit({ filePath: "./.alexiignore" })` is caught by the
`(canonicalPaths.includes(canonicalIgnoreFile))` branch.

### Limitations

The reference implementation intentionally stays lexical and synchronous.
Anyone shipping it should be aware of the following gaps.

- **Bash command parsing is a regex, not a shell parser.** The extraction
  above catches `cat .env`, `rm secrets/x`, `chmod 0 .env`, and their
  variants, but a determined attacker can obfuscate the command:
  `c'a't .env`, `eval $(printf 'cat .env')`, `xargs -a somefile cat`,
  `python -c 'open(".env")'`. For a stronger posture, either sandbox the
  `bash` tool (chroot, seccomp, or docker exec into a restricted image), run
  bash commands through a proper shell parser (e.g. `mvdan/sh` via the
  Node bindings), or require an explicit `PermissionRequest` for every
  `bash` invocation. Do not treat this hook as sufficient defence against
  a bash-capable adversary.
- **Symlinks are not resolved.** A malicious `link` inside the workspace
  (`ln -s /secret/file allowed`) would let a `read({ filePath: "allowed" })`
  through even though the underlying inode is protected. Resolving symlinks
  requires an async `fs.realpath` per candidate and races against symlink
  swaps between the resolve and the tool's own read. If your threat model
  includes hostile symlinks, either resolve `realpath` inside the hook (at
  the cost of a syscall per call) or move the check into the tool
  implementation itself where the file handle can be inspected.
- **Case sensitivity.** The `ignore` package is case-sensitive by default,
  matching gitignore's behaviour on Linux. On macOS (case-insensitive HFS+
  by default) `.ENV` will slip past an ignore rule of `.env`. If you need
  cross-platform parity, lowercase both the pattern and the candidate before
  matching, or use case-insensitive regex patterns in `.alexiignore`.
- **`toolParams` availability.** As of writing, Alexi's agentic loop passes
  `HookContext` with `sessionId` and `toolName` set but does _not_ populate
  `toolParams` for `PreToolUse` (see
  [`src/core/agenticChat.ts`](../src/core/agenticChat.ts) around the
  `executeHooks('PreToolUse', ...)` call). The `HookContext` type reserves
  the field for exactly this use case; wiring it up is a small orchestrator
  change that must land alongside any real `.alexiignore` implementation.
  Until then, the hook has no per-call argument to inspect and the pattern
  above is aspirational — a design reference, not a drop-in enforcement.

## Future work

When Alexi picks up a user-facing ignore surface, the migration path is:

1. Populate `toolParams` on the `PreToolUse` `HookContext` in
   [`src/core/agenticChat.ts`](../src/core/agenticChat.ts) (and, if a
   parallel streaming path exists, in
   [`src/core/streamingOrchestrator.ts`](../src/core/streamingOrchestrator.ts)).
2. Add a first-class `src/hooks/alexiignore.ts` implementation mirroring the
   script above, but co-located with the manager and covered by tests
   under `src/hooks/__tests__/alexiignore.test.ts`.
3. Add the `ignore` npm package to `dependencies` and wire the hook into the
   default hook set (either auto-registered when `.alexiignore` is present,
   or opt-in via `.alexi/hooks.json`).
4. Document the CLI-facing behaviour in the user guide and in `alexi help`
   output; add a link from this file to the tests that pin the canonical
   attack cases (`./.alexiignore`, `secrets/../.env`, symlinks if resolved).
5. Consider extending the pattern to `PermissionRequest` so denials are
   surfaced through the same UI as manual permission prompts, instead of
   only appearing as a hook rejection in the tool-result envelope.

## References

- Cline PR [#13649](https://github.com/cline/cline/pull/13649) — the
  upstream `.clineignore` hook example that this document adapts.
- Research report [`.github/research/2026-09-03-research.md`](../.github/research/2026-09-03-research.md),
  item #2 — the daily scan that surfaced Cline #13649 for Alexi.
- [`ignore` npm package](https://www.npmjs.com/package/ignore) — gitignore
  parser used in the example script.
- [`src/hooks/index.ts`](../src/hooks/index.ts) — the authoritative
  `HookContext`, `HookResult`, and `HookManager` definitions.
- [`docs/permission-system.md`](./permission-system.md) — Alexi's existing
  permission surface, which a full `.alexiignore` rollout would complement
  rather than replace.
