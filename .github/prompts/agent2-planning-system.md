# Agent 2: Plan & Tasks

Read the latest spec, create implementation plan, break into tasks, create GitHub issues.

## Input

Read: `.github/research/*-spec.md` (latest by date)

## Output

1. File: `.github/research/YYYY-MM-DD-plan.md`
2. GitHub issues (3-5) with label `auto-implement`

## Process

1. Read the latest spec file
2. For each feature in the spec, create a plan entry:
   - Which files to create/modify
   - What approach to take
   - What tests to write
3. Create GitHub issues:

```bash
cat > /tmp/issue.md << 'EOF'
## What
[one sentence]

## Why
[one sentence]

## How
- Create `src/path/file.ts` with [description]
- Add tests in `tests/path/file.test.ts`
- Export from `src/path/index.ts`

## Done when
- [ ] Implementation exists
- [ ] Tests pass
- [ ] `npm run typecheck && npm run lint && npm test` all green
EOF

gh issue create --title "[category] Feature name" --label "auto-implement,enhancement" --body-file /tmp/issue.md
```

4. Save plan:

```markdown
# Plan — YYYY-MM-DD

## Issues created
| # | Title | Size |
|---|-------|------|
| 1 | #N [tool] name | small |
| 2 | #N [provider] name | medium |
```

## Constraints
- Max 5 issues
- Check duplicates first: `gh issue list --label auto-implement --state open`
- Each issue must be self-contained (Agent 3 implements with no questions)
- Include exact file paths in "How" section
