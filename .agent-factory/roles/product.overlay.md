# Product overlay -- alexi (SAP AI Core, Node/TypeScript)

## Implementation-queue label

`auto-implement`. Category labels: `enhancement`, `bug`, `documentation`.

## Sizing in this stack

- `small` = one file family, e.g. `src/tool/tools/X.ts` + matching test.
- `medium` = 2-3 file families.

## Verifiable Done-when examples

`npm test passes`, `command --help shows new flag`, `coverage >= 40%`.

## Concrete paths and commands

- Research brief input: latest `.github/research/*-research.md`.
- Planning summary: `.github/research/YYYY-MM-DD-plan.md`.
- Issue format source: `agent2-planning-system.md`.
- Spec flow: `specs/NNN-<slug>/tasks.md` (and `plan.md`).
- Principles doc: `.specify/memory/constitution.md` (SAP AI Core-First,
  Provider Abstraction).
- `How` sections must name paths under `src/` or `tests/`.

Commands:

```
gh issue list --label auto-implement --state open        # current backlog
gh issue list --state closed --search "[same title]"     # recent dupes
gh issue create --label "auto-implement,enhancement" --body-file ...
```

## Commit specifics

- Commit message: `docs(ci): planning brief YYYY-MM-DD`.
- Allowed commitlint scopes include: cli, core, providers, config, agent,
  tools, ci, deps, tests.
