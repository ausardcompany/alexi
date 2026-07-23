# Tools

This document covers cross-cutting behaviour of Alexi's built-in tool set that
is easier to explain once than to repeat in every tool's inline docstring.
For the full catalogue of tools and their parameters see
[`src/tool/tools/definitions.ts`](../src/tool/tools/definitions.ts) and the
individual implementations under `src/tool/tools/`.

## Definitions Tool

The `definitions` tool extracts code definitions (classes, functions,
interfaces, types, constants, enums, methods) from a single source file. It
supports TypeScript, JavaScript, Python, and Bash out of the box and is
implemented in
[`src/tool/tools/definitions.ts`](../src/tool/tools/definitions.ts).

### Two extraction modes

Alexi supports two symbol extraction strategies. Which one runs depends on
whether the optional tree-sitter grammars (`tree-sitter`,
`tree-sitter-typescript`, `tree-sitter-javascript`, `tree-sitter-bash`) are
installed in the current `node_modules`.

- **Regex-based extraction (always available).** The default path. A curated
  set of regular expressions matches top-level and class-scoped declarations
  in the source text. Zero native dependencies, zero build toolchain, works
  on every platform. Implemented directly inside
  [`src/tool/tools/definitions.ts`](../src/tool/tools/definitions.ts).
- **AST-based extraction (requires tree-sitter grammars).** The upgraded
  path used by the repo-map and code-context features under
  [`src/context/`](../src/context/). Each source file is parsed into a real
  syntax tree via `tree-sitter` and the corresponding grammar package, then
  symbols are walked with proper scoping rules. Implemented in
  [`src/context/treeSitter.ts`](../src/context/treeSitter.ts) and
  [`src/context/symbols.ts`](../src/context/symbols.ts).

When the tree-sitter grammars are missing, the tool automatically falls back
to the regex path — there is no configuration flag, no error message to the
user, and no need to gate calls in a client.

### Side-by-side comparison

| Aspect                       | Regex-based (default)                    | AST-based (tree-sitter)                        |
| ---------------------------- | ---------------------------------------- | ---------------------------------------------- |
| Requires native deps         | No                                       | Yes (`tree-sitter*` packages, ~67 MB)          |
| Requires C++ toolchain       | No                                       | Yes on platforms without prebuilt binaries     |
| Startup cost                 | Negligible                               | Small (lazy per-language parser initialisation) |
| Handles nested classes       | Partial (class bodies scanned linearly)  | Full (real scope tree)                         |
| Handles complex generics     | Best-effort                              | Accurate                                       |
| Handles computed names       | No                                       | Yes                                            |
| Handles TSX/JSX              | Yes (regex covers `.tsx`/`.jsx`)         | Yes (dedicated TSX parser)                     |
| Bash function extraction     | POSIX + `function` keyword               | AST-driven, matches Aider's tag query          |
| Python support               | Yes (class/def)                          | Not currently wired                            |
| Failure mode when unsupported| Returns `Unsupported file type` error    | Falls back to regex path                       |

For most day-to-day usage the regex path is sufficient and its output is
identical to the AST path on well-formatted, idiomatic source files. Prefer
AST-based extraction when working with large or unusually structured
codebases where symbol names must be resolved exactly (for example, repo-map
generation for a monorepo with heavy use of decorators, mixins, or
metaprogramming).

### Installing the grammars

To enable AST-based extraction, install the optional grammar packages:

```bash
npm install tree-sitter tree-sitter-typescript tree-sitter-javascript tree-sitter-bash
```

See the [Optional Dependencies](../README.md#optional-dependencies) section of
the README for the rationale, install size (~67 MB), and platform caveats.

### Parameters

```ts
{
  filePath: string;                // absolute path or path relative to workdir
  types?: Array<
    | 'class'
    | 'function'
    | 'interface'
    | 'type'
    | 'const'
    | 'enum'
    | 'method'
  >;                               // optional filter; defaults to all
}
```

The tool returns `{ filePath, definitions, language }` where each definition
carries `name`, `type`, `line`, `signature`, and `exported`. Results are
sorted by line number.

## Subagent Nesting Depth

Alexi's `task` tool spawns a subagent to handle a self-contained piece of
work (research, exploration, focused implementation). Subagents are
themselves given the `task` tool, which means they can spawn further
subagents. Left unbounded, a buggy or recursive prompt can chain agents
into agents into agents until the process exhausts memory, file
descriptors, or the provider's rate limit and cost budget.

To prevent this, `task` enforces a hard cap on how deeply subagents may
nest.

### The 3-level default cap

A top-level user session runs at **depth 0**. Every `task` invocation
spawns a subagent one level deeper. With the default limit of 3, the
allowed chain is:

```
user session         depth 0
  -> task -> subagent            depth 1  (allowed)
       -> task -> subagent       depth 2  (allowed)
            -> task -> subagent  depth 3  (allowed)
                 -> task         depth 4  (REJECTED)
```

A `task` call that would produce depth 4 (or deeper) fails immediately
with a structured error, before any provider request is made:

```
Maximum subagent nesting depth (3) exceeded. Cannot spawn subagent at depth 4.
```

The tool result is:

```json
{
  "success": false,
  "error": "Maximum subagent nesting depth (3) exceeded. Cannot spawn subagent at depth 4."
}
```

The parent agent sees the failure like any other tool error and can
adjust its plan (for example by inlining the work instead of delegating).

### Configuring the cap: `MAX_SUBAGENT_DEPTH`

The cap is configurable through the `MAX_SUBAGENT_DEPTH` environment
variable:

```bash
# .env or shell
MAX_SUBAGENT_DEPTH=5
```

Rules:

- Value must be a **positive integer** (>= 1).
- Empty, unset, non-numeric, zero, and negative values all fall back to
  the built-in default of **3**.
- There is no hard upper bound in the code, but pushing this above ~10
  is not recommended. Deep chains multiply latency and cost quickly and
  make failures difficult to diagnose.

The default of 3 matches the value used by [OpenCode PR
#37124](https://github.com/sst/opencode/pull/37124), which introduced
the same guard upstream.

### Rationale

The cap exists to protect the process (and your provider bill) from
three failure modes:

1. **Runaway recursion.** An agent whose prompt tells it to "delegate
   everything to a subagent" can loop forever if there is no cap. Each
   subagent inherits the same instructions and delegates again. The
   depth guard turns that infinite loop into a bounded error.

2. **Resource exhaustion.** Each subagent holds its own message
   history, tool state, and network connections. Nested subagents grow
   linearly in RAM and file descriptors. On a small runner (2 GB, 1024
   FDs) a chain of 20+ subagents can push the process to OOM before
   any user-visible output.

3. **Cost blowup.** Every subagent invocation costs at least one
   provider round-trip, often several. A recursive prompt at
   `sap-ai-core/anthropic--claude-4.7-opus` rates can burn hundreds of
   USD in minutes. Depth 3 keeps the worst case bounded to a small
   multiple of the top-level cost.

### Where this is enforced

The cap is implemented in [`src/tool/tools/task.ts`](../src/tool/tools/task.ts):

- `DEFAULT_MAX_SUBAGENT_DEPTH` — the compiled-in default (3).
- `getMaxSubagentDepth()` — reads `MAX_SUBAGENT_DEPTH`, validates it,
  and falls back to the default on any parse failure.
- The `execute` handler of the `task` tool reads
  `context.subagentDepth` (populated by `SessionManager`, which walks
  the parent-session chain), computes `spawnDepth = currentDepth + 1`,
  and returns a `success: false` result when `spawnDepth > maxDepth`.

The corresponding tests live in
[`tests/tool/tools/task-depth-limit.test.ts`](../tests/tool/tools/task-depth-limit.test.ts)
and cover the default, the env-var override, invalid overrides, and the
error message shape at the boundary. Background-task interaction is
covered in
[`tests/tool/tools/background-tasks.test.ts`](../tests/tool/tools/background-tasks.test.ts).

### FAQ

**Does the cap count the top-level user session?**
No. The user's own session is depth 0 and is never rejected. The cap
only applies to `task` invocations, which always try to spawn a
subagent at least one level below the caller.

**What if `MAX_SUBAGENT_DEPTH=0` is set?**
It falls back to the default (3). Zero is not a valid subagent depth
(the smallest sensible cap is 1: allow the user to spawn one subagent,
but that subagent cannot spawn further).

**Can I disable the cap entirely?**
Not directly. Setting an extremely high value (e.g. `1000`) is the
closest you can get, but that opts you out of the protection the cap
provides. Do this only in short-lived debug sessions.

**Does this affect background tasks?**
Yes. Background tasks queued via `task(..., background: true)` are
subject to the same depth check at queue time. See
[background-tasks.md](./background-tasks.md) for background-specific
behaviour.
