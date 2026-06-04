# ADR 001: Establish ADR Process and Layering Rules

- Status: accepted
- Date: 2026-06-04
- Deciders: Architecture vertical (alexi-bot)

## Context

The Alexi codebase has grown from the ~10 top-level `src/` modules described
in `docs/ARCHITECTURE.md` to ~32 top-level modules without a single
Architecture Decision Record on file. New verticals (`command/`,
`compaction/`, `context/`, `doctor/`, `flag/`, `git/`, `i18n/`, `init/`,
`log/`, `plan/`, `profile/`, `reference/`, `share/`, `sound/`, `sync/`,
`undo/`, `update/`) were merged without explicit layering decisions, and
the `role-architecture.md` module map no longer matches the on-disk tree.

`AGENTS.md` and `.specify/memory/constitution.md` reference ADRs as the
mechanism for non-trivial structural decisions, but `docs/adr/` did not
exist until this commit. The Architecture vertical role explicitly owns
"ADRs under `docs/adr/NNN-<slug>.md` (introduce the directory if it does
not exist yet)" — this ADR introduces the directory and codifies the rules.

## Decision

1. **All ADRs live under `docs/adr/NNN-<slug>.md`** with monotonically
   increasing zero-padded numbers starting at `001`.
2. **Required sections**: `Status`, `Context`, `Decision`, `Consequences`.
   Statuses use one of `proposed | accepted | superseded | deprecated`.
3. **Triggers requiring an ADR before merge**:
   - Adding a new top-level directory under `src/`.
   - Changing the schema of `routing-config.json`.
   - Changing the provider abstraction surface in `src/providers/index.ts`.
   - Moving more than one file across top-level `src/` directories in a
     single change.
   - Introducing a new extension surface (e.g. peer to MCP / plugins /
     skills / hooks).
4. **Layering rules** (lower layers must NOT import upward):

   ```text
   src/cli/  -> may import from anything below
   src/core/ -> may import from agent, providers (via index only),
                tool, bus, permission, mcp, hooks, plugin, skill,
                config, utils. NOT from cli.
   src/agent/ src/providers/ -> may import from tool, bus, permission,
                mcp, hooks, plugin, skill, config, utils.
   src/tool/ -> may import from bus, permission, config, utils. NOT
                from cli, core, agent, providers.
   src/bus/ src/permission/ src/mcp/ src/hooks/ src/plugin/ src/skill/
            -> may import from config, utils only.
   src/config/ src/utils/ -> standalone, no internal deps except each
                other.
   ```

5. **Provider surface (constitution III)**: Code outside `src/providers/`
   imports only `src/providers/index.ts`. Direct imports of
   `@sap-ai-sdk/*` or of concrete files like
   `src/providers/sapOrchestration.ts` are forbidden outside the providers
   package.
6. **`docs/ARCHITECTURE.md`** is the canonical view of the current
   layering. ADRs are the audit trail explaining how it got there. When
   they drift, ARCHITECTURE.md is updated in the same PR as the structural
   change.

## Consequences

Positive:
- New PRs that introduce structural change can be reviewed against an
  explicit, versioned set of layering rules instead of folklore.
- The Architecture vertical can flag PRs as "needs ADR" with a concrete
  template to point at.
- Future agents (auto-implement, agent-architecture) can detect missing
  ADRs by checking `docs/adr/` membership against the trigger list above.

Negative / costs:
- Existing structural decisions (the 17 already-merged top-level
  directories) are now retroactively undocumented. Follow-up ADRs
  002..N will need to be backfilled, or a single ADR 002 may consolidate
  the existing tree as the accepted baseline.
- Some cycle-risk imports already exist (notably
  `src/tool/tools/*` -> `src/agent/agentsMdReminders.ts`); these will be
  flagged in subsequent reviews and either grandfathered with an
  exception ADR or refactored.

## Follow-ups

- ADR 002 — Backfill: document the current `src/` top-level layout as the
  accepted baseline, listing each directory's responsibility in one line.
- ADR 003 — Resolve `src/tool/` -> `src/agent/agentsMdReminders.ts`
  cycle risk: either move `agentsMdReminders.ts` to a shared lower layer
  (e.g. `src/agent-md/` or `src/utils/`) or formally exempt it.
- ADR 004 — Decide whether `src/core/migration/*.sql` is a real planned
  feature (then add SQLite dep + loader) or dead code (then delete).
- ADR 005 — Either move `src/cli/commands/models.ts`'s direct
  `@sap-ai-sdk/ai-api` call into `src/providers/`, or formally carve out
  a "diagnostics" exception for the `models` command.
