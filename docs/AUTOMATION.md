# Automation and CI/CD

This document describes the GitHub Actions workflows and automation systems in the Alexi project.

## Overview

Alexi uses 19 GitHub Actions workflows for continuous integration, automated documentation, autonomous upstream synchronization, AI-powered autohealing, and daily PR management. The automation system leverages Kilo CLI and Alexi's agentic capabilities.

## Workflow Architecture

```mermaid
graph TB
    subgraph Triggers["Workflow Triggers"]
        PR[Pull Request]
        Push[Push to main]
        Schedule[Daily/Weekly Schedule]
        Manual[Manual Dispatch]
        Failure[Workflow Failure]
    end
    
    subgraph Workflows["GitHub Actions Workflows"]
        CI[CI]
        DocUpdate[Documentation Update]
        Sync[Upstream Sync]
        DailyMerge[Daily PR Merge]
        CIFix[CI Auto-Fix]
        Autohealing[Autohealing]
        Release[Release]
    end
    
    subgraph Tools["Automation Tools"]
        Kilo[Kilo CLI]
        Alexi[Alexi CLI]
        GH[GitHub CLI]
    end
    
    PR --> CI
    PR --> DocUpdate
    Schedule --> Sync
    Schedule --> DailyMerge
    Manual --> Sync
    Manual --> DailyMerge
    Push --> Release
    Failure --> CIFix
    Failure --> Autohealing
    
    DocUpdate --> Alexi
    Sync --> Alexi
    DailyMerge --> Kilo
    CIFix --> Alexi
    Autohealing --> Alexi
```

## Workflows

### 1. Continuous Integration (CI)

**File**: `.github/workflows/ci.yml`

**Triggers**: Push/PR to main/master

**Steps**:
1. Checkout code
2. Set up Node.js 22
3. Install dependencies (`npm ci`)
4. Run TypeScript compiler (`npm run build`)
5. Run linting (`npm run lint`)
6. Run tests (`npm test`)

### 2. Daily PR Merge

**File**: `.github/workflows/daily-merge-prs.yml`

**Triggers**:
- Daily schedule at 18:00 UTC (21:00 Minsk time)
- Manual workflow dispatch with optional `dry_run` flag

**Purpose**: Automatically processes and merges open pull requests using Kilo CLI with AI-powered conflict resolution.

#### Workflow Steps

```mermaid
sequenceDiagram
    participant GH as GitHub Actions
    participant API as GitHub API
    participant Kilo as Kilo CLI
    participant Repo as Repository
    
    GH->>API: Check for open PRs
    alt No PRs found
        GH->>GH: Exit early
    end
    GH->>Repo: Checkout with full history
    GH->>GH: Install Kilo CLI + npm ci
    GH->>GH: Configure git (kilo-bot)
    GH->>Kilo: Run /merge-prs command
    Kilo->>Repo: Merge eligible PRs
    GH->>API: Report results (merged/remaining)
    GH->>GH: Upload logs artifact
```

#### Configuration

```yaml
concurrency:
  group: daily-merge-prs
  cancel-in-progress: false

permissions:
  contents: write
  pull-requests: write
  issues: write
```

#### Kilo CLI Invocation

```bash
kilo run "/merge-prs" --title "Daily PR Merge" \
  --auto \
  -m "sap-ai-core/anthropic--claude-4.7-opus" \
  --variant max
```

#### Dry Run Mode

Manual trigger with `dry_run: true` reports PR status without merging:

```
=== Open PRs Status ===
#123 | CLEAN | feat: add new feature
#456 | BLOCKED | fix: resolve conflict
```

### 3. Documentation Update

**File**: `.github/workflows/documentation-update.yml`

**Triggers**:
- Pull request events (opened, synchronize, reopened)
- Manual workflow dispatch with PR number and optional force regeneration

**Purpose**: AI-powered documentation generation based on code changes.

#### Workflow Steps

```mermaid
sequenceDiagram
    participant GH as GitHub Actions
    participant Repo as Repository
    participant Alexi as Alexi CLI
    participant AI as SAP AI Core
    participant Docs as Documentation
    
    GH->>Repo: Checkout PR branch
    GH->>Repo: Analyze changed files
    GH->>GH: Determine documentation scope
    GH->>Repo: Generate diff + commit history
    GH->>Alexi: Build CLI from source
    Alexi->>AI: Send documentation prompt
    AI->>Docs: Generate/update docs
    GH->>Repo: Commit + push docs to PR
```

#### Scope Detection

| File Pattern | Documentation Updated |
|-------------|----------------------|
| `src/cli/**`, `src/core/**` | ARCHITECTURE.md, API.md |
| `src/providers/**` | PROVIDERS.md |
| `*.json`, `.env*` | CONFIGURATION.md |
| `*.test.ts`, `*.spec.ts` | TESTING.md |
| `.github/workflows/**` | AUTOMATION.md |
| All changes | CHANGELOG.md, CONTRIBUTING.md |

### 4. Upstream Sync

**File**: `.github/workflows/sync-upstream.yml`

**Triggers**:
- Daily at 06:00 UTC
- Manual dispatch with `dry_run` and `force_sync` options

**Purpose**: Synchronize changes from upstream repositories (kilocode, opencode, claude-code) and apply relevant updates.

#### Upstream Repositories

| Repository | Upstream | Purpose |
|------------|----------|---------|
| kilocode | Kilo-Org/kilocode | AI coding assistant patterns |
| opencode | anomalyco/opencode | Open source coding patterns |
| claude-code | anthropics/claude-code | Anthropic Claude patterns |

#### Sync Architecture

```mermaid
graph LR
    subgraph Upstream["Upstream Repositories"]
        Kilo[kilocode]
        Open[opencode]
        Claude[claude-code]
    end
    
    subgraph Sync["Two-Stage AI Process"]
        Plan[Stage 1: Planning<br/>Claude 4.5 Opus]
        Execute[Stage 2: Execution<br/>Claude 4.5 Sonnet + Tools]
    end
    
    subgraph Output["Repository Updates"]
        Code[Source Code Changes]
        State[Update Sync State]
        PR[Create Pull Request]
    end
    
    Kilo --> Plan
    Open --> Plan
    Claude --> Plan
    Plan --> Execute
    Execute --> Code
    Code --> State
    State --> PR
```

#### Sync State

Maintained in `.github/last-sync-commits.json`:

```json
{
  "kilocode": {
    "last_synced_commit": "a23fe160d66d7e95d8d7f38a45afe228736652bb",
    "last_synced_at": "2026-05-17T08:27:24Z",
    "upstream": "Kilo-Org/kilocode",
    "fork": "ausard/kilocode"
  },
  "opencode": {
    "last_synced_commit": "53e89f9d5242e95c2b03a732e8bec69e6b8ba470",
    "last_synced_at": "2026-05-17T08:27:24Z",
    "upstream": "anomalyco/opencode",
    "fork": "ausard/opencode"
  },
  "claude-code": {
    "last_synced_commit": "8bdbb7296d3fa2217283d3ef94452dd64097393b",
    "last_synced_at": "2026-05-17T08:27:24Z",
    "upstream": "anthropics/claude-code",
    "fork": "direct-clone"
  }
}
```

### 5. CI Auto-Fix

**File**: `.github/workflows/ci-auto-fix.yml`

**Triggers**:
- Workflow run completion (when CI/docs/security fails on auto/* branches)
- Manual dispatch with run ID and branch name

**Purpose**: Automatically diagnose and fix CI failures on auto/* branches.

#### Fix Process

```mermaid
graph TB
    subgraph Trigger["Trigger"]
        CIFail[CI Failure on auto/*]
    end
    
    subgraph Analysis["Failure Analysis"]
        Collect[Collect Failed Job Logs]
        Parse[Parse Error Messages]
        Build[Build Fix Prompt]
    end
    
    subgraph Fixing["Two-Stage Fix"]
        Quick[Quick Fixes<br/>lint:fix + format]
        Agent[Alexi Agent<br/>read, write, edit, bash]
        Verify[Verify Fixes]
    end
    
    subgraph Output["Commit"]
        Commit[Commit Changes]
        Push[Push to Branch]
    end
    
    CIFail --> Collect
    Collect --> Parse
    Parse --> Build
    Build --> Quick
    Quick --> Agent
    Agent --> Verify
    Verify --> Commit
    Commit --> Push
```

#### Key Features

1. **Intelligent Failure Detection**: Collects logs from all failed jobs with file paths and line numbers
2. **Two-Stage Fix**: Quick deterministic fixes (lint, format) then AI agent for remaining issues
3. **Rate Limiting**: Maximum 2 auto-fix runs per branch per day
4. **Branch Filtering**: Only processes `auto/*` branches
5. **Targeted Verification**: Re-runs only the checks that originally failed

#### Alexi Agent Invocation

```bash
alexi agent \
  --system .github/prompts/ci-fix-system.md \
  -m "$(cat ci-fix-prompt.md)" \
  --tools read,write,edit,glob,grep,bash \
  --max-iterations 20 \
  --effort high \
  --auto-route
```

### 6. Autohealing

**File**: `.github/workflows/agent-autohealing.yml`

**Triggers**: After any workflow failure

**Purpose**: AI-powered automatic recovery from workflow failures.

### 7. Agent Workflows

| Workflow | File | Schedule | Purpose |
|----------|------|----------|---------|
| Agent 1: Research | `agent1-research.yml` | Daily 04:00 UTC | Research tasks and issue analysis |
| Agent 2: Planning | `agent2-planning.yml` | Daily 06:00 UTC + after Agent 1 | Development planning |
| Agent 4: Review | `agent4-review.yml` | PR events (src/tests) | Automated code review |
| Agent 5: Release | `agent5-release.yml` | Weekly Monday 10:00 UTC | Release management |
| Auto-Implement | `auto-implement.yml` | Every 30 minutes | Implement issues from backlog |

### 8. Release Workflows

| Workflow | File | Trigger | Purpose |
|----------|------|---------|---------|
| Release | `release.yml` | Tag push (v*) + manual | Publish release |
| Tag Release | `tag-release.yml` | Manual dispatch | Create version tag |
| On Release Merge | `on-release-merge.yml` | PR closed (release/*) | Post-release tasks |

### 9. Support Workflows

| Workflow | File | Purpose |
|----------|------|---------|
| Repository Sync | `repo-sync.yml` | Fork synchronization |
| Sync to Issues | `sync-to-issues.yml` | Convert sync results to issues |
| Auto Merge | `auto-merge.yml` | Auto-merge approved PRs |
| Security | `security.yml` | Security scanning |
| Update Homebrew | `update-homebrew.yml` | Update Homebrew formula |

## GitHub Secrets Required

| Secret | Purpose | Required For |
|--------|---------|--------------|
| `AICORE_SERVICE_KEY` | SAP AI Core authentication | Docs, Sync, CI Fix, Autohealing, Daily Merge |
| `AICORE_RESOURCE_GROUP` | SAP AI Core resource group | Docs, Sync, CI Fix, Autohealing, Daily Merge |
| `GH_PAT` | GitHub Personal Access Token | Sync (cross-repo), Daily Merge |
| `GITHUB_TOKEN` | Default GitHub token | All workflows (automatic) |

### Secret Configuration

#### AICORE_SERVICE_KEY

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

#### GH_PAT Permissions

- `repo` (full control of private repositories)
- `workflow` (update GitHub Actions workflows)

## Agentic File Operations

Automation workflows leverage Alexi's agentic capabilities with automatic permission management.

### Permission Configuration in CI

```typescript
// Automatic high-priority rules in agentic mode
{
  id: 'agentic-allow-write',
  priority: 200,
  actions: ['write'],
  paths: ['<workdir>/**'],
  decision: 'allow'
}

{
  id: 'agentic-allow-execute',
  priority: 200,
  actions: ['execute'],
  decision: 'allow'
}
```

### Tool Context Resolution

Tools resolve relative paths using the workdir context:

```typescript
permission: {
  action: 'write',
  getResource: (params, context) => {
    if (path.isAbsolute(params.filePath)) {
      return params.filePath;
    }
    return path.join(context?.workdir || process.cwd(), params.filePath);
  }
}
```

## Workflow Maintenance

### Updating Workflows

1. Edit workflow YAML files in `.github/workflows/`
2. Test changes using manual workflow dispatch with dry-run
3. Commit and push changes
4. Changes to workflows automatically trigger `AUTOMATION.md` update

### Debugging Workflows

1. Check workflow run logs in GitHub Actions tab
2. Use dry-run mode for sync and merge workflows
3. Review generated artifacts (kilo-output.log, ci-failures.md)
4. Check sync state in `.github/last-sync-commits.json`

### Common Issues

| Issue | Solution |
|-------|----------|
| Documentation update fails | Verify `AICORE_SERVICE_KEY` and `AICORE_RESOURCE_GROUP` secrets |
| Upstream sync creates no PR | Check if upstreams have new commits since last sync |
| Daily merge skips PRs | Check PR merge state (CLEAN vs BLOCKED) |
| CI auto-fix loops | Rate limit (2/day) should prevent; check branch patterns |
| Autohealing not triggering | Verify workflow failure event propagation |

## Best Practices

1. **Test workflow changes with dry-run** before allowing actual execution
2. **Review AI-generated changes** in PR diffs before merging
3. **Keep secrets updated** and rotate credentials regularly
4. **Monitor API usage** via SAP AI Core cost tracking
5. **Document workflow modifications** by updating this file
6. **Use concurrency groups** to prevent parallel runs of the same workflow
7. **Set appropriate timeouts** (daily merge: 30min, sync: 45min, CI fix: 20min)
