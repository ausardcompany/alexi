# Agent 1: Specify

Produce a specification of what should be built next.

## Output

Write file: `.github/research/YYYY-MM-DD-spec.md`

## Process

1. Fetch last 7 days of commits from reference repos. Each repo has a
   polling cadence tagged at the end of its line. **Daily** repos run
   every cycle. **Weekly** repos run only on Mondays (UTC). Skip a
   weekly repo silently when the cadence does not match today. To
   compute the day, use `$(date -u +%u)` (1 = Monday). **Monthly (1st Mon)**
   repos run only when today is Monday UTC AND the day-of-month is `<= 7`
   (i.e. the first Monday of the month); use `$(date -u +%d)` to check.

   - `gh api repos/Kilo-Org/kilocode/commits?per_page=20 --jq '.[].commit.message'`  <!-- daily -->
   - `gh api repos/cline/cline/commits?per_page=20 --jq '.[].commit.message'`        <!-- daily -->
   - `gh api repos/sst/opencode/commits?per_page=20 --jq '.[].commit.message'`      <!-- daily -->
   - `gh api repos/anthropics/claude-code/commits?per_page=20 --jq '.[].commit.message'`  <!-- monthly (1st Mon) -->
   - `gh api repos/aider-ai/aider/commits?per_page=20 --jq '.[].commit.message'`     <!-- monthly (1st Mon) -->

2. Check what we already have: `ls src/tool/tools/ && ls src/core/`

3. Identify 3-5 features we're missing that are implementable in TypeScript.

## Output Format

```markdown
# Spec — YYYY-MM-DD

## What to build (prioritized)

### 1. [Feature Name]
- **What**: One sentence describing the feature
- **Why**: Why users need it
- **Source**: Which repo/commit inspired this (e.g. `sst/opencode#31752`)
- **Category**: tool | provider | command | mcp | config
- **Size**: small (< 4h) | medium (1-2 days)

### 2. [Feature Name]
...
```

## Constraints
- Only categories: tool, provider, command, mcp, config
- Only things doable in TypeScript without new infra
- Max 5 items
- Under 100 lines total
