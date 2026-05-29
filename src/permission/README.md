# `src/permission/` — permission gate

This directory implements the layered permission system used by every tool that
touches the user's environment (file system, shell, network, MCP). The shapes
worth knowing about are:

| File                    | Purpose                                                                |
| ----------------------- | ---------------------------------------------------------------------- |
| `index.ts`              | `PermissionManager` — last-match-wins rule evaluation + ask flow       |
| `next.ts`               | Glob-pattern matching helpers + JSON config (de)serialisation          |
| `wildcard.ts`           | Glob/wildcard primitives (`matchPattern`, `matchCommand`)              |
| `external-directory.ts` | Allowlist for read-only access outside the workspace                   |
| `shell-parser.ts`       | **POSIX shell parser used to detect directory-escape attempts**        |
| `prompt.ts` / `drain.ts`| Interactive ask flow + queued request draining                         |

## Why the shell parser exists

The shell parser was added in response to the same class of bug that
[claude-code v2.1.149][cc-fix] fixed in their PowerShell parser: command forms
that mutate `PWD` outside the parser's variable-tracking layer let an
LLM-driven session escape its sandbox. We do not run PowerShell, but the
underlying class affects every POSIX-shell wrapper.

Without an audit pass, an agent can in principle run

```bash
(cd /etc && cat passwd)
pushd /tmp && rm -rf important
PWD=/etc cat foo
cd $(echo /etc)
```

and either bypass `external-directory.ts` checks or operate on files outside
the workspace silently. `shell-parser.ts` is the chokepoint that detects all of
the above before the bash/shell tool spawns a subprocess.

[cc-fix]: https://github.com/anthropics/claude-code/releases/tag/v2.1.149

## What the parser recognises

`parseSegments(command)` walks a bash command and emits a flat list of
segments:

```ts
interface ShellSegment {
  cmd: string;                  // first word after assignments
  args: string[];               // positional args (quotes stripped)
  env: Record<string, string>;  // inline FOO=bar prefixes
  subshell: boolean;            // true when in `(…)`
  substitution: boolean;        // true when in `$(…)` or backticks
  nested: ShellSegment[];       // nested substitutions encountered
}
```

It understands:

- statement separators `;`, `&&`, `||`, `&`
- pipes `|` (treats both sides as separate segments)
- parenthesised subshells `(…)` — each member is marked `subshell: true`
- `$(…)` and backtick substitutions — each member is marked
  `substitution: true` (NB: substitutions are not executed; their literal
  contents are still walked so forbidden builtins inside them are detected)
- inline assignments `FOO=bar BAZ=qux cmd …`
- single-quoted literals, double-quoted strings, and `\` escapes

It is intentionally **not** a full bash grammar — only enough to identify
directory-mutating builtins and the cwd they would resolve against.

## What the audit denies

`auditShellCommand(command, { workspace, allowlist?, oldPwd? })` walks every
segment (including those in subshells / substitutions) and flags any of the
builtins in `BUILTINS_DIRECTORY_MUTATORS` (`cd`, `pushd`, `popd`, `chdir`)
whose resolved target is outside the workspace and not on the
`external-directory.ts` allowlist.

| Case                                | Reason                  |
| ----------------------------------- | ----------------------- |
| `cd /tmp` outside allowlist         | `cd-outside-workspace`  |
| `cd ..` from workspace into parent  | `cd-outside-workspace`  |
| `cd -` with no prior `OLDPWD`       | `cd-dash-no-oldpwd`     |
| `pushd /etc`                        | `pushd-outside-workspace` |
| `(cd /etc && cat passwd)`           | `cd-outside-workspace`  |
| `cd /tmp && cd ..` resolves to `/`  | `cd-outside-workspace`  |
| `PWD=/etc cat foo`                  | `pwd-assignment`        |
| `OLDPWD=/etc cd -`                  | `oldpwd-assignment`     |
| `cd $UNKNOWN` / `cd $(…)`           | `unknown-target`        |

Chained `cd` segments are tracked: `cd workspace-sub && cd nested` resolves
correctly against the chained cwd. Subshell `cd` does **not** bleed into the
parent shell's cwd, matching real bash semantics.

## How it's wired up

`auditCommand` is re-exported from `next.ts` and called from the bash /
shell tool wrappers (`src/tool/tools/bash.ts`, `src/tool/tools/shell.ts`)
before any subprocess is spawned. Any non-empty `denials[]` aborts the call
with a `ToolResult` whose `error` lists the offending segments.

Callers that want a binary "should this command be denied?" check can use
`isCommandDeniedByAudit(command, options)`.
