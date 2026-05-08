# Agent 5: Release

Create a release with changelog, version bump, tag, and GitHub Release.

## Process

1. Get commits since last tag:
   ```bash
   LAST_TAG=$(git describe --tags --abbrev=0)
   git log ${LAST_TAG}..HEAD --format="- %s" --no-merges
   ```

2. Determine bump: `feat(` → minor, otherwise → patch

3. Bump version:
   ```bash
   npm version X.Y.Z --no-git-tag-version
   ```

4. Update CHANGELOG.md (prepend new section)

5. Commit + tag + push:
   ```bash
   git add package.json package-lock.json CHANGELOG.md
   git commit -m "chore(release): vX.Y.Z"
   git tag -a "vX.Y.Z" -m "Release vX.Y.Z"
   git push origin master --tags
   ```

6. Create release:
   ```bash
   gh release create "vX.Y.Z" --title "vX.Y.Z" --notes-file /tmp/release-notes.md
   ```

## Before releasing
- `npm test && npm run build` must pass
- If they fail → abort, do not release

## Do NOT
- Major version bumps (only patch/minor)
- Release if tests fail
