# Onboarding a new repository to the Agent Factory

This guide walks you through attaching the reusable agent factory
(`ausardcompany/agent-factory@v1`) to ANY repository -- Node, Python, Go, Rust,
or even a docs-only project. You never copy engine code; you add a small
`.agent-factory/` config directory and thin caller workflows.

Estimated time: ~20-30 minutes for the first role.

---

## Prerequisites

1. The consuming repo is on GitHub and you can add workflows + secrets to it.
2. You have an LLM provider the agent CLI can use. The engine passes credentials
   through as secrets (names are configurable); the reference setup uses SAP AI
   Core (`AICORE_SERVICE_KEY` + `AICORE_RESOURCE_GROUP`).
3. If the engine repo is private, the consumer must be in the same org (or the
   engine must be public). The reference engine is public.

---

## Step 1 - Create the config directory

In the consumer repo, create:

```
.agent-factory/
  factory.config.yml        # the contract: models, stack, git, roles
  project-facts.md          # your stack/conventions, injected into every prompt
  roles/                    # OPTIONAL per-role project overlays
  tasks/                    # task prompts, one per role you enable
```

### 1a. `.agent-factory/factory.config.yml`

Minimal example for a **Node/TypeScript** project:

```yaml
version: 1
engine: ausardcompany/agent-factory@v1

models:
  nano:  sap-ai-core/anthropic--claude-4.5-haiku    # cheap/mechanical
  small: sap-ai-core/anthropic--claude-4.5-sonnet   # reasoning (default)
  big:   sap-ai-core/anthropic--claude-4.7-opus     # hard reasoning

stack:
  type: node            # node | python | go | rust | custom | none
  install: npm ci
  build:   npm run build
  test:    npm test
  lint:    npm run lint

git:
  author_name:  "myrepo-bot"
  author_email: "myrepo-bot@users.noreply.github.com"
  default_branch: main

secrets:
  llm_service_key:    AICORE_SERVICE_KEY
  llm_resource_group: AICORE_RESOURCE_GROUP

roles:
  consulting:  { enabled: true, tier: small, timeout_minutes: 20 }  # research
  product:     { enabled: true, tier: small, timeout_minutes: 18 }  # planning
  engineering: { enabled: true, tier: big,   timeout_minutes: 45 }  # implement
  quality:     { enabled: true, tier: small, timeout_minutes: 15 }  # review

blast_radius:
  max_diff_lines: 2000
  path_denylist:
    - "^\\.github/workflows/"
    - "^\\.agent-factory/"
    - "package-lock\\.json$"
```

For a **Python** project, change `stack:`:

```yaml
stack:
  type: python
  install: pip install -e ".[dev]"
  test:    pytest
  lint:    ruff check .
```

For a **docs-only / research** project (no build/test):

```yaml
stack:
  type: none
```

With `type: none`, the engine skips install and the verify gate; role agents
that produce documents still run.

Valid roles (map to the 10 generic scaffolds): `consulting` (research),
`product` (planning), `engineering` (implementation), `quality` (review),
`architecture`, `security`, `infrastructure` (release), `management`
(prompt-optimization), `data`, `design`.

### 1b. `.agent-factory/project-facts.md`

Everything stack-specific about YOUR repo. This is injected into every agent
prompt as the authoritative "how this project works" section. Cover:

- Stack, versions, package manager.
- Where source/tests live; how to build/test/lint.
- Commit conventions (allowed types/scopes, bot suffix).
- Anything an agent must NOT do (protected files, credentials in tests, etc.).

Keep it factual and concise (~1 page). See this engine repo's
`README.md` for how it composes with the baseline.

### 1c. `.agent-factory/tasks/<role>.md`

One task prompt per role you enable. Example
`.agent-factory/tasks/quality.md`:

```markdown
# Task: Review the current pull request

Review the changed files for correctness, tests, and adherence to the
project conventions in the project-facts. Emit findings grouped by severity
(critical / major / minor). Do not modify code; comment only.
```

### 1d. (optional) `.agent-factory/roles/<role>.overlay.md`

Project-specific additions to a generic role scaffold (paths, tools, patterns).
Omit if the generic scaffold + project-facts is enough.

---

## Step 2 - Add repository secrets

In the consumer repo: Settings -> Secrets and variables -> Actions -> add the
secrets referenced by your config's `secrets:` block, e.g.:

- `AICORE_SERVICE_KEY` (the full provider service key JSON)
- `AICORE_RESOURCE_GROUP`
- `GH_PAT` (optional; a PAT with `repo` scope for cross-repo ops / pushing to
  protected branches. If omitted, the built-in `GITHUB_TOKEN` is used.)

---

## Step 3 - Add caller workflows

For each role, add a thin caller to `.github/workflows/`. Copy
`callers/agent-role.template.yml` from this engine repo and adapt. Example
`.github/workflows/agent-review.yml` (a review-only role on PRs):

```yaml
name: "Agent: Review"

on:
  pull_request: {}
  workflow_dispatch: {}

permissions:
  contents: write
  pull-requests: write
  issues: write          # REQUIRED: engine opens a factory-escalation issue on failure

jobs:
  review:
    uses: ausardcompany/agent-factory/.github/workflows/agent-factory.yml@v1
    secrets:
      LLM_SERVICE_KEY: ${{ secrets.AICORE_SERVICE_KEY }}
      LLM_RESOURCE_GROUP: ${{ secrets.AICORE_RESOURCE_GROUP }}
      GH_PAT: ${{ secrets.GH_PAT }}
    with:
      role: quality
      title: "Agent: Review"
      task_prompt: "file:.agent-factory/tasks/quality.md"
      engine_ref: v1
      commit_changes: false     # review-only: do not push
      branch: main
```

An implementation role that ships code:

```yaml
name: "Agent: Implement"

on:
  workflow_dispatch: {}
  schedule:
    - cron: "*/30 * * * *"

permissions:
  contents: write
  pull-requests: write
  issues: write

jobs:
  implement:
    uses: ausardcompany/agent-factory/.github/workflows/agent-factory.yml@v1
    secrets:
      LLM_SERVICE_KEY: ${{ secrets.AICORE_SERVICE_KEY }}
      LLM_RESOURCE_GROUP: ${{ secrets.AICORE_RESOURCE_GROUP }}
      GH_PAT: ${{ secrets.GH_PAT }}
    with:
      role: engineering
      title: "Agent: Implement"
      task_prompt: "file:.agent-factory/tasks/engineering.md"
      engine_ref: v1
      commit_changes: true
      branch: main
```

### Caller `with:` inputs

| input | required | default | notes |
|-------|----------|---------|-------|
| `role` | yes | - | one of the 10 valid roles |
| `task_prompt` | yes | - | inline string OR `file:<path>` in the consumer repo |
| `title` | yes | - | human-readable run title |
| `config_path` | no | `.agent-factory/factory.config.yml` | override config location |
| `engine_ref` | no | `v1` | pin the engine version (match the `@ref` in `uses:`) |
| `commit_changes` | no | `true` | `false` for review-only roles |
| `branch` | no | config `default_branch` | branch to checkout/push |
| `model_tier_override` | no | `""` | force `nano`/`small`/`big` for one run |

---

## Step 4 - (recommended) Add the eval regression gate

To protect prompt changes (baseline/roles/overlays) from silent quality
regressions, add `.github/workflows/agent-eval.yml`:

```yaml
name: "Agent Factory Eval"

on:
  pull_request:
    paths:
      - ".agent-factory/**"

permissions:
  contents: read
  pull-requests: write

jobs:
  eval:
    uses: ausardcompany/agent-factory/.github/workflows/agent-eval.yml@v1
    secrets:
      LLM_SERVICE_KEY: ${{ secrets.AICORE_SERVICE_KEY }}
      LLM_RESOURCE_GROUP: ${{ secrets.AICORE_RESOURCE_GROUP }}
    with:
      roles: "consulting,quality"
      # I6: judges MUST be a different model than the candidate
      candidate_model: "sap-ai-core/anthropic--claude-4.5-sonnet"
      judges: "sap-ai-core/anthropic--claude-4.5-haiku,sap-ai-core/anthropic--claude-4.7-opus"
      engine_ref: v1
      max_drop: "0.05"
```

Provide golden cases for the roles you list (the engine ships seed goldens for
`consulting`; add your own under the engine's `evals/goldens/` or via a PR).

---

## Step 5 - Add `.gitignore` entries

The engine checks itself out into `.engine/` and writes a log; belt-and-braces,
add:

```
/.engine/
/kilo-output.log
```

(The engine also excludes these itself before committing.)

---

## Step 6 - Run it

- Trigger any caller manually: Actions -> pick the workflow -> Run workflow.
- Watch the run. On the first run the engine will:
  1. Checkout your repo + the engine.
  2. Resolve + validate `factory.config.yml` (fails fast with a clear error if
     invalid).
  3. Run `stack.install` (skipped for `type: none`).
  4. Compose `baseline + your project-facts + role scaffold + your overlay +
     task`.
  5. Run the agent with the tier's model, bounded retry, and a watchdog.
  6. Run the verify gate (your lint/test); overturn a false success.
  7. Enforce blast-radius, then commit/push (unless `commit_changes: false`).
  8. On failure: open a deduplicated `factory-escalation` issue.

---

## Troubleshooting

- **`startup_failure`, zero jobs**: the caller lacks a permission the engine
  needs. Ensure `permissions:` includes `issues: write` (for escalation),
  `contents: write`, `pull-requests: write`.
- **`factory.config.yml failed schema validation`**: the error lists the exact
  fields. Compare against `schema/factory.config.example.yml`.
- **`Missing engine prompt`**: your `role` value is not one of the 10 valid
  roles, or `engine_ref` points at a ref without that scaffold.
- **Reusable workflow not found / parse error**: a public repo cannot consume a
  private engine. Make the engine public or keep both in the same org.
- **Agent commits `.engine/` or logs**: you are on an old engine tag; bump to
  `@v1` (>= v1.0.1).
- **Verify gate fails but code looks fine**: the gate runs YOUR
  `stack.lint/test`; the failure is real project output -- read the step log.

---

## What you get

A per-role autonomous agent fleet with: model tiering (cost control),
transient-only bounded retry, watchdog timeouts, rebase-retry push,
deterministic verify gate, blast-radius guardrails, failure escalation to
issues, and (optionally) a cross-family judge eval gate protecting your prompts
from regressions. Improve the engine once; every consumer benefits on next run.
