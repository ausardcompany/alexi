# Feature Specification: Agent Factory Unification (Reusable Multi-Project Engine)

**Feature Branch**: `034-agent-factory-unification`
**Created**: 2026-07-13
**Status**: Draft
**Input**: User request: "Unify our set of agents so it can be reused for other applications."

## Decisions (locked)

- **Distribution model**: Reusable GitHub Actions workflows, consumed via
  `uses: ausardcompany/agent-factory/.github/workflows/agent-factory.yml@v1`.
  Versioned with git tags (`@v1`, `@v1.2.0`).
- **Engine home**: a dedicated repository `ausardcompany/agent-factory`.
  `alexi` (this repo) becomes the reference implementation + first consumer.
- **Scope**: stack-agnostic (Node / Python / Go / Rust / …) AND applicable to
  non-engineering projects (research / planning / design roles that operate on
  documents, not code). The engine MUST NOT hardcode `npm`, `src/`, TypeScript,
  or any build step.

## The core idea: engine vs project-config split

Today the factory is ~90% generic. Coupling to SAP/alexi lives in exactly three
places, which this feature extracts into a per-project configuration surface:

```
ENGINE (identical for every project — lives in ausardcompany/agent-factory)
  .github/workflows/agent-factory.yml   orchestrator: retry, escalation,
                                        model tiering, watchdog, artefacts
  prompts/baseline-system.md            generic baseline (tone, safety, git,
                                        escalation contract) — NO repo facts
  prompts/roles/role-*.md               generic role scaffolds (identity /
                                        owns / must-NOT / inputs / outputs / DoD)
  callers/*.template.yml                thin caller-workflow templates

PROJECT CONFIG (unique per consuming repo — lives in the consumer)
  .agent-factory/factory.config.yml     stack, models, commands, git author
  .agent-factory/project-facts.md       replaces "Repository facts" section
  .agent-factory/roles/*.overlay.md     project-specific role additions
  .agent-factory/tasks/*.md             concrete tasks for this project
  .github/workflows/agent-*.yml         thin callers → uses: …@v1
```

The engine reads project config at runtime and composes:
`baseline + project-facts + role-scaffold + role-overlay + task` → one prompt.

## User Scenarios & Testing *(mandatory)*

### User Story 1 — New project adopts the factory in under an hour (Priority: P1)

A developer with an arbitrary repository (any language) wants an autonomous
agent fleet (research → planning → implementation → review → release) without
copy-pasting hundreds of lines of workflow YAML and prompts.

**Why this priority**: Adoption friction is the whole point of unification. If
onboarding a new repo is not trivial, teams will keep forking and drifting.

**Independent Test**: Starting from a repo with no factory, add
`.agent-factory/factory.config.yml` + the caller workflows, push, and confirm at
least one role agent (e.g. research or review) runs successfully against the
consuming repo without any change to the engine repo.

**Acceptance Scenarios**:

1. **Given** a fresh consumer repo, **When** the maintainer adds
   `factory.config.yml` declaring `stack: python` with `install/build/test`
   commands, **Then** the factory install step uses those commands (not `npm ci`).
2. **Given** a consumer with no build step (docs-only project), **When**
   `stack: none` is set, **Then** engineering/CI stages are skipped and
   research/planning/design roles still run.
3. **Given** a consumer sets `models.small: <provider/model>`, **When** a
   small-tier role runs, **Then** the resolved model matches the consumer's
   config, not alexi's default.

### User Story 2 — Engine improvement propagates to all consumers (Priority: P1)

A maintainer improves the factory (e.g. a better escalation policy) once in
`ausardcompany/agent-factory`, tags `v1.3.0`, and every consuming repo pinned to
`@v1` receives the fix on its next run.

**Why this priority**: The current model (copy-paste per repo) means fixes like
today's watchdog/escalation work would have to be redone N times. Central
versioning is the main value of the reusable-workflow approach.

**Independent Test**: Tag a no-op engine change, confirm a consumer repo pinned
to `@v1` picks it up without any commit in the consumer.

**Acceptance Scenarios**:

1. **Given** consumers pin `@v1`, **When** the engine publishes `v1.x.y`,
   **Then** consumers use the new engine on next run with no consumer change.
2. **Given** a breaking engine change, **When** it is released as `v2`,
   **Then** `@v1` consumers are unaffected until they opt in to `@v2`.

### User Story 3 — Project keeps its own facts, roles stay generic (Priority: P2)

A consumer needs the engineering role to know its architecture (paths, tools,
conventions) without editing the shared engine role file.

**Why this priority**: Role scaffolds must stay generic to be reusable; project
knowledge must be injectable without forking the engine.

**Independent Test**: Add `.agent-factory/roles/engineering.overlay.md` with
project paths; confirm the engineering agent's composed prompt contains both the
generic scaffold and the overlay, and no SAP/alexi strings leak from the engine.

**Acceptance Scenarios**:

1. **Given** an overlay file exists, **When** a role runs, **Then** the composed
   prompt = engine baseline + project-facts + engine role scaffold + overlay.
2. **Given** no overlay file exists, **When** a role runs, **Then** the role runs
   with baseline + project-facts + scaffold only (overlay is optional).

### Edge cases

- Consumer omits `factory.config.yml` → engine fails fast with a clear error
  pointing to the config schema (do not run with SAP defaults).
- Consumer requests a `model_tier` its `models:` map doesn't define → engine
  falls back to a documented default and warns.
- Non-engineering project (`stack: none`) → build/test/lint gates are skipped;
  the "verification-before-completion" gate degrades to "artifact produced".
- Secret names differ per provider (SAP vs OpenAI vs Anthropic) → engine takes
  secret *names* from config, callers pass them via `secrets:`.

## Requirements *(mandatory)*

### Functional

- **FR-001**: The engine MUST live in `ausardcompany/agent-factory` and expose
  `agent-factory.yml` as a `workflow_call` reusable workflow, versioned by tag.
- **FR-002**: The engine MUST read a `factory.config.yml` from the consumer repo
  and MUST NOT contain any consumer-specific facts (models, stack, paths, author).
- **FR-003**: `factory.config.yml` MUST support at minimum:
  - `models: { nano, small, big }` (provider/model ids)
  - `stack: { type, install, build, test, lint }` (any commands; `type: none`
    disables build-oriented gates)
  - `git: { author_name, author_email, commit_scopes }`
  - `secrets: { … }` (names of secrets the runtime needs)
  - `roles: { <role>: { tier, timeout_minutes, enabled } }`
  - optional `sync: { sources: [...] }` for the upstream-sync role
- **FR-004**: The engine MUST compose prompts as
  `baseline + project-facts + role-scaffold + role-overlay + task`, where
  project-facts and overlay come from the consumer and the rest from the engine.
- **FR-005**: All existing autonomy hardening MUST be preserved and stay engine-
  side: watchdog (`timeout-minutes`), bounded transient-only retry, deduplicated
  `factory-escalation` issue, model tiering, rebase-and-retry push.
- **FR-006**: The engine MUST NOT assume Node/npm. The install/build/test steps
  MUST come from `stack:` commands; a `type: none` project MUST run role agents
  that need no build.
- **FR-007**: A consumer MUST be able to enable/disable individual roles and set
  per-role tier + timeout via config, without editing engine files.
- **FR-008**: The engine MUST fail fast with an actionable error if
  `factory.config.yml` is missing or invalid (schema-validated).
- **FR-009**: `alexi` MUST be migrated to consume the engine via `@v1`, proving
  the extraction end-to-end (dogfooding). Its SAP facts move to its own
  `.agent-factory/` config.
- **FR-010**: The engine repo MUST document the config schema, a quickstart, and
  a compatibility/versioning policy (`@v1` stable contract).

### Non-goals (this feature)

- A `npx create-agent-factory` CLI installer (a later feature; the config-driven
  reusable-workflow contract is the prerequisite for it).
- Migrating other repositories beyond alexi (proved by alexi; others adopt later).
- Changing the agent LLM behavior/quality — this is packaging/portability only.

### Key entities

- **Engine repo** (`ausardcompany/agent-factory`): reusable workflows + generic
  prompts + caller templates + config schema + docs.
- **factory.config.yml**: the single per-project contract file. Schema-validated.
- **project-facts.md**: per-project replacement for the baseline "Repository
  facts" / "Quality gates" / "Commit conventions" sections.
- **role overlay**: optional per-project, per-role prompt addendum.
- **Consumer caller workflows**: thin `uses: …@v1` wrappers with a `prepare` job
  that builds the task prompt and passes config + secrets.

## Migration plan (alexi → first consumer)

1. Extract engine files into `ausardcompany/agent-factory`, tag `v1.0.0`.
2. Split `baseline-system.md`: generic part → engine; SAP facts → alexi
   `.agent-factory/project-facts.md`.
3. Split each `role-*.md`: generic scaffold → engine; alexi paths/tools →
   `.agent-factory/roles/*.overlay.md`.
4. Move models, `npm` commands, `alexi-bot` author, commitlint scopes, sync
   sources → alexi `.agent-factory/factory.config.yml`.
5. Replace alexi's caller workflows with thin `uses: …@v1` callers.
6. Run the full fleet on alexi via the engine; confirm parity with today.
7. Tag engine `v1.0.0` as stable; document the contract.

## Success criteria

- **SC-001**: A brand-new repo (any stack) runs ≥1 role agent end-to-end using
  only `.agent-factory/` config + thin callers, zero engine edits.
- **SC-002**: alexi runs its full 10-role fleet via `@v1` with behavior parity
  to the pre-extraction baseline (same PRs/issues/commits produced).
- **SC-003**: A tagged engine change reaches alexi with no alexi commit.
- **SC-004**: No SAP/alexi/Node string remains in any engine file
  (grep-verifiable in CI of the engine repo).
- **SC-005**: A `stack: none` docs project can run research+planning+design
  roles with build/test gates correctly skipped.
