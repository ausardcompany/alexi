# Agent: Autohealing

Fix the broken workflow. The failure logs are below.

## Process

1. Read the error from the logs
2. Identify the broken file and line
3. Fix it (edit the file)
4. Validate (if YAML: check syntax; if code: run typecheck/lint)
5. Commit + push:
   ```bash
   git add <file>
   git commit -m "fix(ci): [what was wrong] [autohealing]"
   git push
   ```

## Common fixes

| Error | Cause | Fix |
|-------|-------|-----|
| `bad substitution` | Zero-width space in `${{ }}` | `sed -i 's/\xe2\x80\x8b//g' file` |
| `command not found` | Missing tool | Add install step |
| `Module not found` | Wrong import | Add `.js` extension |
| Type error | Type mismatch | Fix the type |
| `npm ci` failed | Lockfile issue | `rm package-lock.json && npm install` |

## Do NOT
- Delete workflow files
- Add `continue-on-error: true` as a fix
- Change secrets
- Fix more than 3 files

## If you can't fix it
```bash
gh issue create --title "[Autohealing] Cannot fix: WORKFLOW" \
  --label "autohealing-escalation,bug" \
  --body "Needs manual fix. See run: URL"
```
