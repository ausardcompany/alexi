```markdown
# Update Plan for Alexi

Generated: 2026-07-04
Based on upstream commits: [4c07a1db5, 38488b729, ef76d67f8, 574da7c93, 9424b51d2, a9144ec, 458ec7b, d46c02b]

## Summary
- Total changes planned: 4
- Critical: 1 | High: 2 | Medium: 1 | Low: 0

## Changes

### 1. Refactor Agent Index
**File**: `src/agent/index.ts`
**Priority**: high
**Type**: refactor
**Reason**: To incorporate new agent patterns and enhance defense-in-depth for bash command execution.

**Current code**:
```typescript
export const readOnlyBash: Record<string, "allow" | "ask" | "deny"> = {
  "git branch -r *": "allow",
  "git remote -v *": "allow",
  "gh *": "ask",
  "*\n*": "deny",
  "*<(*": "deny",
  "*|*": "deny",
  "*;*": "deny",
  "*&&*": "deny",
  "*&*": "deny",
  "*$(*": "deny",
  "*`*": "deny",
  "*>*": "deny",
  "sort -o *": "deny",
  "sort * -o *": "deny",
  "sort --output*": "deny",
  "sort * --output*": "deny",
  // Additional rules...
};
```

**New code**:
```typescript
export const readOnlyBash: Record<string, "allow" | "ask" | "deny"> = {
  "git branch -r *": "allow",
  "git remote -v *": "allow",
  "gh *": "ask",
  "*\n*": "deny",
  "*<(*": "deny",
  "*|*": "deny",
  "*;*": "deny",
  "*&*": "deny",
  "*$(*": "deny",
  "*`*": "deny",
  "*>*": "deny",
  "sort -o *": "deny",
  "sort *--output*": "deny",
  "sort *--compress-program*": "deny",
  "sort *--files0-from*": "deny",
  "rg *--pre *": "deny",
  "rg *--pre=*": "deny",
  // Revised blocklist for command execution...
};
```

### 2. Update ReadToolView
**File**: `src/tool/ReadToolView.kt`
**Priority**: medium
**Type**: feature
**Reason**: To improve file opening capabilities within read tool views.

**Current code**:
```kotlin
class ReadToolView(
    tool: Tool,
    openFile: (String) -> Unit = {},
    private val selection: SessionSelection? = null,
    private val parts: ToolParts = toolParts(tool, openFile),
) : SecondarySessionPartView(parts.header, parts.scroll(tool), expandable = false) {
```

**New code**:
```kotlin
class ReadToolView(
    tool: Tool,
    openFile: SessionFileOpener = { _, _ -> },
    private val selection: SessionSelection? = null,
    private val parts: ToolParts = toolParts(tool, openFile),
) : SecondarySessionPartView(parts.header, parts.scroll(tool), expandable = false) {
```

### 3. Update ShellToolView
**File**: `src/tool/ShellToolView.kt`
**Priority**: high
**Type**: feature
**Reason**: To add telemetry and header popup functionality for better user interaction tracking.

**Current code**:
```kotlin
class ShellToolView(
    // existing properties and methods...
) {
    // existing methods...
}
```

**New code**:
```kotlin
class ShellToolView(
    // existing properties and methods...
) {
    @RequiresEdt
    override fun headerPopup(): HeaderPopupRequest? {
        if (isExpanded()) return null
        val cmd = command(item).takeIf { it.isNotBlank() } ?: return null
        return HeaderPopupRequest(row, build = { buildPopupBody(cmd) }) {
            Telemetry.send("Header Popup Shown", mapOf("surface" to "session", "tool" to "bash"))
        }
    }
    // other methods...
}
```

### 4. Update ToolSupport
**File**: `src/tool/ToolSupport.kt`
**Priority**: critical
**Type**: bugfix
**Reason**: Fixes issue with link opening that could lead to incorrect anchor point handling.

**Current code**:
```kotlin
fun openLink() {
    val value = href ?: return
    open?.invoke(value)
}
```

**New code**:
```kotlin
fun openLink(anchor: RelativePoint? = null) {
    val value = href ?: return
    open?.invoke(value, anchor)
}
```

## Testing Recommendations
- Verify that the read-only bash execution restrictions are correctly applied and no unauthorized commands are executed.
- Ensure that file links open correctly in the ReadToolView with the proper anchor points.
- Test header popup functionality in ShellToolView for correct telemetry data collection.
- Validate that all tool support features work correctly and links open as expected.

## Potential Risks
- Changes to bash execution rules could inadvertently block valid commands if not tested thoroughly.
- File opening modifications may cause issues if anchor points are incorrectly handled.
- New telemetry features could affect performance if not optimized properly.
```
{"prompt_tokens":16618,"completion_tokens":1207,"total_tokens":17825,"cache_read_input_tokens":0}

[Session: 72235389-e424-4030-b46d-1f56cb426c67]
[Messages: 2, Tokens: 17825]
