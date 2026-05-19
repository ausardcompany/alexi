# Release Task — v{{NEW_VERSION}}

## Context

- Last tag: {{LAST_TAG}}
- New version: {{NEW_VERSION}}
- Version bump: {{BUMP_TYPE}}
- Dry run: {{DRY_RUN}}

## Commits to include

```
{{COMMIT_LOG}}
```

## Instructions

1. Generate CHANGELOG entry for v{{NEW_VERSION}}
   - Categorize commits (Features, Bug Fixes, Maintenance, Dependencies)
   - Prepend to CHANGELOG.md

{{#DRY_RUN}}
2. **DRY RUN** — only write the CHANGELOG. Do NOT bump version or create tags.
   Save proposed release notes to /tmp/release-notes.md
{{/DRY_RUN}}

{{^DRY_RUN}}
2. Update version:
   - Run: `npm version {{NEW_VERSION}} --no-git-tag-version`

3. Commit and tag:
   ```bash
   git add package.json package-lock.json CHANGELOG.md
   git commit -m "chore(release): v{{NEW_VERSION}}"
   git tag -a "v{{NEW_VERSION}}" -m "Release v{{NEW_VERSION}}"
   git push origin master --tags
   ```

4. Create GitHub release:
   - Write release notes to /tmp/release-notes.md
   - Run: `gh release create "v{{NEW_VERSION}}" --title "v{{NEW_VERSION}}" --notes-file /tmp/release-notes.md`
{{/DRY_RUN}}
