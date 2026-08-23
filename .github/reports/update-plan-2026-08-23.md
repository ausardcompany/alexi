```markdown
# Update Plan for Alexi

Generated: 2026-08-23
Based on upstream commits analyzed:
- opencode `3a31c4e` - fix(app): keep model provider headers visible (#44115)
- kilocode: no new commits (ff74e2ea3..ff74e2ea3)

## Summary
- Total changes planned: 1
- Critical: 0 | High: 0 | Medium: 1 | Low: 0

## Analysis Notes

The single upstream change is a **UI-only fix** in opencode's model selection dialog (`packages/app/src/components/dialog-select-model.tsx`, +1/-1). It affects how provider headers render in the model picker component of opencode's Tauri/desktop app.

**Applicability to Alexi**:
- Alexi is a CLI/agent framework (SAP AI Core integrated). It does **not** contain the opencode Tauri desktop app or the `dialog-select-model.tsx` component.
- No tool/agent/permission/bus/core/provider/router changes upstream.
- The kilocode repository had zero commits in this window.

**Conclusion**: No functional changes need to be ported to Alexi. However, if Alexi exposes any model-selection UI (e.g., in `src/cli/` interactive prompts or an equivalent picker), a defensive review is warranted to ensure provider group headers remain visible when scrolling/filtering.

## Changes

### 1. Defensive review of model selection UI in Alexi CLI
**File**: `src/cli/` (any model picker / interactive selection prompt, e.g., `src/cli/commands/model.ts` or similar)
**Priority**: medium
**Type**: bugfix (preventive/parity)
**Reason**: The upstream fix ensures provider headers (e.g., "OpenAI", "Anthropic", "SAP AI Core") remain visible in grouped model lists. If Alexi's CLI renders a grouped model picker (for instance when selecting between SAP AI Core deployments and other providers), verify that provider/section headers are not accidentally hidden by filter/scroll logic.

**Current code** (illustrative — locate the actual Alexi picker if present):
```typescript
// Example pattern likely used in a grouped picker
const visibleItems = items.filter((item) => {
  return item.label.toLowerCase().includes(query.toLowerCase())
})
```

**New code** (align with upstream intent — always keep group headers visible):
```typescript
// Keep provider/group headers visible regardless of filter/scroll state
const visibleItems = items.filter((item) => {
  if (item.type === "header") return true // preserve provider headers
  return item.label.toLowerCase().includes(query.toLowerCase())
})
```

**Action if no such component exists**: Document a "no-op" in the changelog and skip. Do not introduce new UI code just to mirror upstream.

## Testing Recommendations
- Grep the Alexi repo for any grouped selection UI: `rg -n "dialog-select-model|provider header|selectModel|modelPicker" src/`.
- If a picker exists, manually verify:
  - Provider headers (including "SAP AI Core") remain visible when filtering by query.
  - Headers remain visible when scrolling through long lists (e.g., many SAP deployments).
  - Keyboard navigation skips headers (headers not selectable).
- Run the existing CLI test suite: `pnpm test` (or project equivalent) to confirm no regressions.
- Smoke test: `alexi model` (or equivalent command) to interactively browse providers.

## Potential Risks
- **None expected** — the upstream change is UI-scoped to a component Alexi does not ship.
- If Alexi maintainers choose to implement the defensive fix above, ensure the `type === "header"` sentinel matches the actual data model used by the picker to avoid introducing selectable non-item entries.
- SAP AI Core integration is unaffected; no provider/router/agent code paths touched.
```
{"prompt_tokens":1451,"completion_tokens":1347,"total_tokens":2798,"cache_read_input_tokens":0,"cache_creation_input_tokens":0}

[Session: 889ca528-a18e-4152-a2a4-c2ce54860446]
[Messages: 2, Tokens: 2798]
