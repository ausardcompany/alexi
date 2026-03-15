# Contract: Workflow Step Pseudocode

This document defines the behavior of each step in the rewritten `documentation-update.yml` workflow.

---

## Step 1: Determine Force Regeneration (MOVED BEFORE check_needed)

```yaml
id: force_flag
```

**Behavior**: Check if this is a manual dispatch with `force_full_regeneration: true`.

```
IF event == workflow_dispatch AND inputs.force_full_regeneration == true:
  output: force=true
ELSE:
  output: force=false
```

**Change from current**: Moved BEFORE `check_needed` step (was after, causing the force flag to always be empty).

---

## Step 2: Analyze Changed Files

```yaml
id: analyze
```

**Behavior**: Determine which source files changed and set boolean flags.

```
1. Determine BASE_BRANCH (main or master)
2. Find LAST_DOC_COMMIT by grepping for "[alexi-bot]" tag (not full message)
3. Get CHANGED_FILES since last doc commit (or since base branch)
4. Filter: exclude ONLY docs/**/*.md and CHANGELOG.md
   CHANGED_FILES = filter(files, NOT match "^docs/" AND NOT match "^CHANGELOG.md$")
   // NOTE: AGENTS.md, .github/templates/*.md, README.md are NOT filtered
5. Set has_code_changes flag
6. Set module flags:
   cli_changed     = any file matches "src/cli/"
   core_changed    = any file matches "src/core/"
   routing_changed = any file matches "src/core/router" OR "src/config/routing"
   providers_changed = any file matches "src/providers/"
   config_changed  = any file matches "package.json|tsconfig.json|.env|src/config/"
   tests_changed   = any file matches "tests/|*.test.ts|*.spec.ts"
   workflows_changed = any file matches ".github/workflows/"
   scripts_changed = any file matches "scripts/"
```

**Key change**: `.md` filter is `^docs/` and `^CHANGELOG.md$` only (not all `.md` files).

---

## Step 3: Check If Documentation Update Needed

```yaml
id: check_needed
```

```
IF has_code_changes == false AND force_flag == false:
  output: skip=true
ELSE:
  output: skip=false
```

**Change**: Now correctly references `force_flag` (which runs first).

---

## Step 4: Determine Documentation Scope

```yaml
id: scope
```

**Behavior**: Build `DOCS_TO_UPDATE` list based on flags.

```
DOCS_TO_UPDATE = ""

IF cli_changed OR core_changed OR force:
  DOCS_TO_UPDATE += "docs/ARCHITECTURE.md docs/API.md"

IF routing_changed OR force:
  DOCS_TO_UPDATE += "docs/ROUTING.md"

IF providers_changed OR force:
  DOCS_TO_UPDATE += "docs/PROVIDERS.md"

IF config_changed OR force:
  DOCS_TO_UPDATE += "docs/CONFIGURATION.md"

IF tests_changed OR force:
  DOCS_TO_UPDATE += "docs/TESTING.md"

IF workflows_changed OR scripts_changed OR force:
  DOCS_TO_UPDATE += "docs/AUTOMATION.md"

# Always:
DOCS_TO_UPDATE += "CHANGELOG.md docs/CONTRIBUTING.md"

output: docs_to_update=$DOCS_TO_UPDATE
```

**Change**: File paths use canonical casing (`ARCHITECTURE.md` not `architecture.md`).

---

## Step 5: Generate Code Diff Summary

```yaml
id: diff
```

**Behavior**: Generate diff summary without aggressive truncation.

```
1. Include full `git diff --stat` (compact, no truncation needed)
2. For detailed diff per file type:
   DIFF_CONTENT = git diff ... -- '*.ts' '*.tsx'
   IF lines(DIFF_CONTENT) > 500:
     output first 500 lines
     append: "... [truncated, ${TOTAL} lines total] Use read/grep tools for full context."
   ELSE:
     output DIFF_CONTENT
```

**Key change**: `head -500` instead of `head -100`. Overflow note tells agent to use tools.

---

## Step 6: Build Prompt from Templates

```yaml
id: prompt
```

**Behavior**: Assemble templates in order. Same as current, no changes needed.

---

## Step 7: Run Agent

```yaml
id: bot
```

```bash
node dist/cli/program.js agent \
  --message-file kilo-prompt.md \
  --auto-route \
  --effort high \
  --max-iterations 30 \
  --tools "read,write,edit,glob,grep" \
  --workdir "$(pwd)" \
  --no-auto-commits \
  --verbose \
  --system "$SYSTEM_PROMPT" \
  > bot-output.log 2>&1
```

**Changes from current**:
1. Added `--effort high` (ensures maxTokens >= 32768)
2. Added `--no-auto-commits`
3. Simplified `$SYSTEM_PROMPT` to role-only (no duplicate instructions)

**System prompt** (role-only):
```
You are a technical documentation writer for the Alexi project.
Read source code files using the provided tools before writing documentation.
Write to the exact file paths specified in the Documentation Scope section.
```

---

## Step 8: Validate Generated Docs (NEW)

```yaml
id: validate
continue-on-error: true
```

```bash
# Lightweight markdown lint
VALIDATION_REPORT=""
if command -v npx &>/dev/null; then
  npx --yes markdownlint-cli2 $DOCS_TO_UPDATE 2>&1 | tee validation.log || true
  if [ -s validation.log ]; then
    VALIDATION_REPORT="### Validation Warnings\n$(cat validation.log)"
  fi
fi
echo "report=$VALIDATION_REPORT" >> $GITHUB_OUTPUT
```

**New step**: Runs after agent, before commit. Failures are warnings, not blockers.

---

## Step 9: Commit and Push

```yaml
# No id needed
```

**Behavior**: Three-case handling:

```
# Case A: Stage and commit unstaged changes
for f in $DOCS_TO_UPDATE; do
  [ -f "$f" ] && git add "$f"
done

if ! git diff --cached --quiet; then
  git commit -m "docs: auto-generate documentation [skip ci] [alexi-bot]"
  echo "[OK] Created documentation commit"
else
  echo "[INFO] No unstaged documentation changes to commit"
fi

# Case B: Push any local commits (including pre-committed by agent)
BRANCH="${{ steps.pr_data.outputs.branch }}"
LOCAL_HEAD=$(git rev-parse HEAD)
REMOTE_HEAD=$(git rev-parse "origin/$BRANCH" 2>/dev/null || echo "")

if [ "$LOCAL_HEAD" != "$REMOTE_HEAD" ]; then
  git push origin "$BRANCH"
  echo "[OK] Documentation changes pushed to $BRANCH"
else
  echo "[INFO] No new commits to push"
fi
```

**Key changes**:
1. Explicit file staging (not `git add docs/`) — resolves Issue 3 & 12
2. Machine-identifiable commit message with `[alexi-bot]` tag — resolves Issue 11
3. Three-case handling (unstaged, pre-committed, no-changes) — resolves RC-2
