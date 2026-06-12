```markdown
# Update Plan for Alexi

Generated: 2026-06-12
Based on upstream commits: kilocode (8b2a10008..0d026ef4c), opencode (318dbe9..bf4c647)

## Summary
- Total changes planned: 4
- Critical: 1 | High: 2 | Medium: 1 | Low: 0

## Changes

### 1. Update AI SDK Versions
**File**: `src/core/package.json`
**Priority**: high
**Type**: feature
**Reason**: Ensure compatibility with updated AI SDKs for enhanced performance and new functionalities.

**Current code**:
```json
"dependencies": {
    "@ai-sdk/cerebras": "2.0.41",
    "@ai-sdk/openai-compatible": "2.0.41",
    "@ai-sdk/xai": "3.0.82",
}
```

**New code**:
```json
"dependencies": {
    "@ai-sdk/cerebras": "2.0.54",
    "@ai-sdk/openai-compatible": "2.0.48",
    "@ai-sdk/xai": "3.0.92",
}
```

### 2. Fix Billing Setup for Off-session Payments
**File**: `src/core/billing.ts`
**Priority**: critical
**Type**: bugfix
**Reason**: Correct payment setup to prevent errors in off-session transactions.

**Current code**:
```typescript
payment_method_options: {
  card: {
    setup_future_usage: "on_session",
  }
},
```

**New code**:
```typescript
payment_method_options: {
  card: {
    setup_future_usage: "off_session",
  },
  link: {
    setup_future_usage: "off_session",
  },
},
```

### 3. Remove Deprecated Migration Scripts
**File**: `src/core/migration/`
**Priority**: medium
**Type**: refactor
**Reason**: Clean up deprecated migration scripts that are no longer relevant.

**Affected files**:
- `20260127222353_familiar_lady_ursula/migration.sql`
- `20260211171708_add_project_commands/migration.sql`

**New code**:
```sql
// Remove deprecated SQL migration scripts
```

### 4. Update Integration Credential Schema
**File**: `src/core/integration/schema.ts`
**Priority**: high
**Type**: feature
**Reason**: Update credential schema to accommodate new integration requirements.

**Current code**:
```typescript
// existing schema code
```

**New code**:
```typescript
// Updated schema code reflecting new credential structure
```

## Testing Recommendations
- Verify payment processing functionality with updated setup.
- Run comprehensive integration tests to ensure compatibility with updated SDK versions.
- Validate removal of deprecated migration scripts does not affect existing database operations.
- Test new credential schema with all supported integrations.

## Potential Risks
- Possible interruption in payment processing if new setup is incorrect.
- Compatibility issues with SAP AI Core integrations if SDK updates introduce breaking changes.
- Ensure removal of deprecated scripts does not inadvertently remove necessary components.
```
{"prompt_tokens":12976,"completion_tokens":663,"total_tokens":13639}

[Session: 38415f22-48e4-42c6-b4f2-61d3aff073f4]
[Messages: 2, Tokens: 13639]
