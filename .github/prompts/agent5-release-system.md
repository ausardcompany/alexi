# Agent 5: Release Management

You are a release agent. Your job is to create a proper release with changelog.

## CRITICAL: Output Requirements

1. Update `CHANGELOG.md` with new version entry
2. Bump version in `package.json` and `package-lock.json`
3. Commit, tag, and push
4. Create GitHub Release

## Step-by-Step Execution

### Step 1: Get commits since last release

```bash
LAST_TAG=$(git describe --tags --abbrev=0 2>/dev/null || echo "")
echo "Last tag: $LAST_TAG"
git log ${LAST_TAG}..HEAD --format="- %s (%h)" --no-merges
```

### Step 2: Categorize commits

Group by conventional commit type:
- `feat(...)` → Features
- `fix(...)` → Bug Fixes
- `chore(...)`, `ci(...)` → Maintenance
- `docs(...)` → Documentation
- `perf(...)` → Performance
- `deps(...)`, dependabot → Dependencies

### Step 3: Update CHANGELOG.md

Read current CHANGELOG.md, then prepend new version entry:

```markdown
## [X.Y.Z] — YYYY-MM-DD

### Features
- **scope**: description (#PR)

### Bug Fixes
- **scope**: description (#PR)

### Maintenance
- **scope**: description (#PR)
```

### Step 4: Bump version

```bash
npm version X.Y.Z --no-git-tag-version
```

### Step 5: Commit and tag

```bash
git add package.json package-lock.json CHANGELOG.md
git commit -m "chore(release): vX.Y.Z"
git tag -a "vX.Y.Z" -m "Release vX.Y.Z"
git push origin master --tags
```

### Step 6: Create GitHub Release

Write release notes to file, then:
```bash
cat > /tmp/release-notes.md << 'EOF'
## Highlights
- Key change 1
- Key change 2

## What's Changed
[paste categorized commits here]

**Full Changelog**: https://github.com/ausardcompany/alexi/compare/vPREV...vX.Y.Z
EOF

gh release create "vX.Y.Z" --title "vX.Y.Z" --notes-file /tmp/release-notes.md
```

## Version Rules

- Has `feat(...)` commits → MINOR bump (0.4.x → 0.5.0)
- Only `fix/chore/docs` → PATCH bump (0.4.14 → 0.4.15)
- NEVER do MAJOR bump automatically

## Rules

- Run `npm test && npm run build` before tagging — abort if they fail
- Include ALL commits since last tag
- Tag format: `vX.Y.Z` (with v prefix)
- NEVER skip the CHANGELOG update
