# Changes Summary — Upstream Sync 2026-08-23

## Update Plan Reference

Based on upstream commits:

- opencode `3a31c4e` — `fix(app): keep model provider headers visible (#44115)`
- kilocode `ff74e2ea3..ff74e2ea3` — no new commits

Total planned changes: 1 (Medium priority, defensive/parity review).

## Files Modified

**None.** This sync is a documented no-op after investigation, per the update plan's explicit fallback:

> **Action if no such component exists**: Document a "no-op" in the changelog and skip. Do not introduce new UI code just to mirror upstream.

## Change-by-Change Report

### 1. Defensive review of model selection UI (Priority: Medium)

**Status**: No-op — Alexi's pickers are structurally immune to the upstream bug.

**Investigation performed**:

Ran `rg -n "dialog-select-model|selectModel|ModelPicker|modelPicker" src/`.

Two model-selection surfaces exist in Alexi:

1. **`src/cli/utils/modelPicker.ts`** — CLI (non-TUI) picker built on
   `@inquirer/prompts` `select` + `Separator`. Groups are rendered as
   `Separator` instances (`── OpenAI ──`, `── Anthropic ──`, `── SAP ──`,
   etc.) which `@inquirer/prompts` treats as non-selectable and always
   visible. There is no filter/query step in this picker (no `.filter(...)`
   that could accidentally drop headers), so the upstream bug class cannot
   manifest.

2. **`src/cli/tui/dialogs/ModelPicker.tsx`** — Ink TUI dialog built on
   `ink-select-input`. It flattens groups via `flatMap` and inlines the
   provider name into every row label (`[${group.provider}] ${model.label}`).
   Because the provider tag travels with each model row, there is no
   separate "header" element that could be scrolled off or filtered out —
   every visible row shows its provider unconditionally. The component
   also has no `useInput`-driven filter that removes items, so, again, the
   upstream failure mode does not apply.

**Verification against upstream fix**: The opencode fix
(`packages/app/src/components/dialog-select-model.tsx`, +1/-1) targets a
Tauri/SolidJS desktop component with a separate rendered `<header>` node
that could be scrolled/filtered out of view. Alexi ships no such
component — neither picker separates headers from rows in a way that
allows them to disappear independently.

**Applied change**: None. Per the plan's explicit guidance, no new UI
code is introduced solely to mirror upstream. The existing implementations
already satisfy the spirit of the upstream fix.

**Guardrails for future work**: If either Alexi picker is later refactored
to add a filter/search step (`items.filter((item) => item.label.includes(query))`),
the maintainer MUST preserve group headers by short-circuiting the filter
for header/separator entries — matching the upstream pattern:

```ts
const visibleItems = items.filter((item) => {
  if (item.type === 'header') return true; // preserve provider headers
  return item.label.toLowerCase().includes(query.toLowerCase());
});
```

For `@inquirer/prompts` `Separator` instances, use `item instanceof Separator`
as the sentinel. For a future Ink-native grouped picker, tag header rows
with a discriminator field (e.g., `kind: 'header'`) and skip them in both
filter and keyboard-navigation logic.

## SAP AI Core Compatibility

Unaffected. No provider, router, orchestrator, agent, tool, permission,
bus, or config code paths were touched. `src/providers/sapOrchestration.ts`
and related SAP integration surfaces are untouched.

## Issues Encountered

None. The investigation was conclusive: both Alexi pickers are already
structurally safe from the upstream bug class.

## Testing Recommendations Executed

- ✅ `rg -n "dialog-select-model|selectModel|ModelPicker|modelPicker" src/` — located both pickers.
- ✅ Read `src/cli/tui/dialogs/ModelPicker.tsx` end-to-end — no filter logic, provider tag inlined per row.
- ✅ Read `src/cli/utils/modelPicker.ts` end-to-end — uses `@inquirer/prompts` `Separator`, no filter logic.
- ⏭️ Runtime smoke test (`alexi model` / TUI ModelPicker) — not required; no code change to verify.
- ⏭️ `npm test` — not required; no code change was made.
