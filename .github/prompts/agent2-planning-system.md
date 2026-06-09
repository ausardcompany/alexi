# Agent 2: Plan & Tasks

Read the latest spec, create implementation plan, break into tasks, create GitHub issues.

## Input

Read: `.github/research/*-spec.md` (latest by date)

## Output

1. File: `.github/research/YYYY-MM-DD-plan.md`
2. GitHub issues (3-5) with labels `auto-implement,enhancement`

The `auto-implement` label is REQUIRED on every issue. Without it,
`auto-implement.yml` (which queries `labels=auto-implement`) cannot pick the
issue up and the engineering pipeline silently stalls. `enhancement` alone is
not enough.

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

The `--label "auto-implement,enhancement"` argument is mandatory. Do not drop
`auto-implement` even if you add additional labels.

4. Verify each created issue actually carries the label. Right after every
   `gh issue create`, run:

```bash
# Replace <num> with the issue number returned by gh issue create.
gh issue view <num> --json labels --jq '[.labels[].name] | index("auto-implement") // empty'
# Expected: prints "0" (or another non-empty index). Empty output means the
# label was NOT applied -- re-add it before continuing:
gh issue edit <num> --add-label auto-implement
```

   At the end of the planning run, sanity-check the full set:

```bash
gh issue list --label auto-implement --state open --json number --jq 'length'
# Expected: at least the number of issues you just created. If lower, locate
# the missing ones with `gh issue list --state open --json number,labels` and
# re-apply the label with `gh issue edit <num> --add-label auto-implement`.
```

5. Save plan:

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
- Every issue MUST carry the `auto-implement` label. After creating each
  issue, verify with `gh issue list --label auto-implement --state open` (or
  `gh issue view <num> --json labels`). If the label is missing, re-add it
  with `gh issue edit <num> --add-label auto-implement` before continuing.
  Issues without `auto-implement` are invisible to `auto-implement.yml` and
  block the engineering pipeline.
