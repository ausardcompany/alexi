# Agent Factory (Reusable Engine)

A stack-agnostic, config-driven fleet of autonomous AI agents for GitHub
Actions: research -> planning -> implementation -> review -> release. One engine,
many consuming projects. Improve the engine once, every consumer benefits.

> This directory is the staging copy of the engine that will live in
> `ausardcompany/agent-factory`. Consumers reference it as
> `uses: ausardcompany/agent-factory/.github/workflows/agent-factory.yml@v1`.

## How it works

```
consumer repo                                  engine repo (this)
.github/workflows/agent-*.yml   --uses @v1-->  .github/workflows/agent-factory.yml
.agent-factory/factory.config.yml   <--reads-- (models, stack, git, roles)
.agent-factory/project-facts.md     <--reads-- (composed into every prompt)
.agent-factory/roles/*.overlay.md   <--reads-- (optional per-role additions)
.agent-factory/tasks/*.md           <--reads-- (the concrete task)
                                               prompts/baseline-system.md (generic)
                                               prompts/roles/role-*.md   (generic)
```

At runtime the engine composes:

```
baseline + project-facts + role-scaffold + role-overlay + task
```

## Quickstart for a new consumer project

1. Add `.agent-factory/factory.config.yml` (see `schema/factory.config.example.yml`).
   Declare your `models`, `stack` (or `type: none` for docs/research projects),
   `git` author, `secrets` names, and per-role `tier`/`timeout`.
2. Add `.agent-factory/project-facts.md` describing your stack, gates, and
   conventions (this is injected into every agent prompt).
3. (Optional) Add `.agent-factory/roles/<role>.overlay.md` for project-specific
   role guidance (paths, tools).
4. Add `.agent-factory/tasks/<role>.md` task prompts.
5. Copy `callers/agent-role.template.yml` into `.github/workflows/` per role,
   set `role`, `title`, and trigger.
6. Add repo/org secrets matching the names in your config
   (e.g. `LLM_SERVICE_KEY`).

That is all -- no engine code is copied into your repo.

## Reliability contract (engine-side, applies to every consumer)

- **Model tiering**: per-role `tier` (nano/small/big) maps to `models.*` in your
  config. Cheap models for mechanical roles, expensive only for hard reasoning.
- **Bounded retry**: retries are spent ONLY on transient failures (network/API,
  matched by a configurable regex). Genuine failures are not retried.
- **Escalation**: on ultimate failure the engine opens a deduplicated
  `factory-escalation` issue with the last log lines + run URL. Requires the
  caller to grant `issues: write`.
- **Watchdog**: every role has a `timeout_minutes` cap; no run can hang for the
  GitHub 6h default.
- **Rebase-retry push**: agent commits survive a fast-moving default branch.

## Versioning

Consumers pin `@v1`. Backward-compatible improvements ship as `v1.x.y`; breaking
changes only in `@v2`. `baseline-system.md` changes affect ALL consumers -- treat
them as a cross-org constitution amendment.

## Files

| Path | Purpose |
|------|---------|
| `.github/workflows/agent-factory.yml` | the reusable engine (workflow_call) |
| `.github/workflows/engine-ci.yml` | guards against consumer-specific leakage |
| `prompts/baseline-system.md` | generic horizontal baseline |
| `prompts/roles/role-*.md` | 10 generic role scaffolds |
| `schema/factory.config.schema.json` | JSON Schema for consumer config |
| `schema/factory.config.example.yml` | worked example (Node/SAP consumer) |
| `scripts/resolve-config.mjs` | validate + normalize consumer config |
| `callers/agent-role.template.yml` | thin caller template for consumers |
