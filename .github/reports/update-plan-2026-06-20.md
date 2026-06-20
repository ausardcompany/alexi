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
