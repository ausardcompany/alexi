# Execution Task: Apply Update Plan to Alexi

You are an expert software developer. Your task is to execute the update plan below precisely.

## Update Plan to Execute

```markdown
# Update Plan for Alexi

Generated: 2026-06-20
Based on upstream commits: ec0dd783a, e6cdc54

## Summary
- Total changes planned: 2
- Critical: 0 | High: 2 | Medium: 0 | Low: 0

## Changes

### 1. Update version in package.json
**File**: `src/core/package.json`
**Priority**: high
**Type**: feature
**Reason**: To align with versioning and feature updates from upstream `packages/core/package.json`

**Current code**:
```json
{
  "$schema": "https://json.schemastore.org/package.json",
  "version": "7.3.49",
  "name": "@alexi/core",
  "type": "module",
  "license": "MIT",
}
```

**New code**:
```json
{
  "$schema": "https://json.schemastore.org/package.json",
  "version": "7.3.50",
  "name": "@alexi/core",
  "type": "module",
  "license": "MIT",
}
```

### 2. Adjust inherited permission rules
**File**: `src/tool/task.ts`
**Function**: `inherited`
**Priority**: high
**Type**: bugfix
**Reason**: To ensure permissions are correctly applied in multi-hop agent chains, preserving parent-agent restrictions as ceilings.

**Current code**:
```typescript
export function inherited(input: {
  caller: Agent.Info
  session: Session.Info
  rules: Permission.Rule[]
  mcp?: Record<string, any>
}): Permission.Rule[] {
  const prefixes = Object.keys(input.mcp ?? {}).map((k) => k.replace(/[^a-zA-Z0-9_-]/g, "_") + "_")
  const isMcp = (p: string) => prefixes.some((prefix) => p.startsWith(prefix))
  return rules.filter(
    (r: Permission.Rule) => r.permission === "edit" || r.permission === "bash" || isMcp(r.permission),
  )
}
```

**New code**:
```typescript
export function inherited(input: {
  caller: Agent.Info
  session: Session.Info
  rules: Permission.Rule[]
  mcp?: Record<string, any>
}): Permission.Rule[] {
  const prefixes = Object.keys(input.mcp ?? {}).map((k) => k.replace(/[^a-zA-Z0-9_-]/g, "_") + "_")
  const isMcp = (p: string) => prefixes.some((prefix) => p.startsWith(prefix))
  return rules.filter(
    (r: Permission.Rule) =>
      r.action === "deny" && (r.permission === "edit" || r.permission === "bash" || isMcp(r.permission)),
  )
}
```

## Testing Recommendations
- Verify version update doesn't affect compatibility with SAP AI Core.
- Test permission inheritance logic to ensure it correctly applies ceilings without overriding subagent policies.

## Potential Risks
- Ensure that version updates don't introduce incompatibility with dependent systems.
- Check that permission changes don't inadvertently alter expected agent behavior.
```
{"prompt_tokens":8200,"completion_tokens":669,"total_tokens":8869}

[Session: 7dfe4aed-fe20-463f-a1dd-c52c620cec9b]
[Messages: 2, Tokens: 8869]

## Execution Instructions

1. **Execute each change** in the plan above in order of priority (critical → high → medium → low)
2. **Make exact code changes** as specified in the plan
3. **Maintain SAP AI Core compatibility** - do not break existing integrations
4. **Follow existing code style** in this repository
5. **Create changes summary** at `.github/reports/changes-summary.md` with:
   - List of files modified
   - Summary of each change made
   - Any issues encountered

## Important

- Do NOT skip any items in the plan
- Do NOT add extra changes not in the plan
- Do NOT ask questions - just execute
- If a file doesn't exist, create it
- If code context is unclear, use your best judgment based on the plan

Execute the entire plan now.
