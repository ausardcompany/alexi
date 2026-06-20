```markdown
# Update Plan for Alexi

Generated: 2026-06-18
Based on upstream commits: e9894141c..7606ee893 (kilocode), 85a7929..ec50db3 (opencode)

## Summary
- Total changes planned: 4
- Critical: 1 | High: 2 | Medium: 1 | Low: 0

## Changes

### 1. Add description field to Provider schema
**File**: `src/core/models.ts`
**Priority**: high
**Type**: feature
**Reason**: To accommodate the new `description` field in the Provider schema, which is essential for enhanced metadata handling.

**Current code**:
```typescript
export const Provider = Schema.Struct({
  api: Schema.optional(Schema.String),
  name: Schema.String,
  env: Schema.Array(Schema.String),
  id: Schema.String,
  npm: Schema.optional(Schema.String),
});
```

**New code**:
```typescript
export const Provider = Schema.Struct({
  api: Schema.optional(Schema.String),
  name: Schema.String,
  description: Schema.optional(Schema.String), // kilocode_change
  env: Schema.Array(Schema.String),
  id: Schema.String,
  npm: Schema.optional(Schema.String),
});
```

### 2. Update ShellToolView for new UiDataProvider implementation
**File**: `src/tool/ShellToolView.kt`
**Priority**: critical
**Type**: bugfix
**Reason**: To integrate UiDataProvider for better data handling and synchronization, ensuring compatibility with the latest kilocode changes.

**Current code**:
```kotlin
class ShellToolView(
    tool: Tool,
    selection: SessionSelection? = null,
    private val parts: ToolParts = toolParts(tool),
    private val holder: ShellHolder = ShellHolder(tool, selection)
) : SecondarySessionPartView(parts.header, { holder.body().panel }) {
```

**New code**:
```kotlin
class ShellToolView(
    tool: Tool,
    private val selection: SessionSelection? = null,
    private val parts: ToolParts = toolParts(tool),
    private val holder: ShellHolder = ShellHolder(tool, selection)
) : SecondarySessionPartView(parts.header, { holder.body().panel }), UiDataProvider {

    override fun uiDataSnapshot(sink: DataSink) {
        selection?.provideCopy(sink) { holder.shell?.markdown() ?: fallbackText() }
    }

    private fun fallbackText() = ShellContent(item).body
}
```

### 3. Modify ToolSupport for enhanced session selection
**File**: `src/tool/ToolSupport.kt`
**Priority**: medium
**Type**: refactor
**Reason**: To improve session selection registration and handling in tool views, aligning with new kilocode practices.

**Current code**:
```kotlin
fun register(selection: SessionSelection, parent: Disposable) {
    area?.let { selection.register(it, parent) }
}
```

**New code**:
```kotlin
fun register(selection: SessionSelection, parent: Disposable) {
    area?.let {
        (it as? ToolArea)?.selection = selection
        selection.register(it, parent)
    }
}
```

### 4. Update ToolView with UiDataProvider implementation
**File**: `src/tool/ToolView.kt`
**Priority**: high
**Type**: feature
**Reason**: To integrate UiDataProvider for better data synchronization and expandability in the tool view.

**Current code**:
```kotlin
class ToolView(
    tool: Tool,
    selection: SessionSelection? = null,
    private val parts: ToolParts = toolParts(tool, mode = ToolBodyMode.EDITOR)
) : SecondarySessionPartView(parts.header, { parts.scroll(tool) }) {
```

**New code**:
```kotlin
class ToolView(
    tool: Tool,
    private val selection: SessionSelection? = null,
    private val parts: ToolParts = toolParts(tool, mode = ToolBodyMode.EDITOR)
) : SecondarySessionPartView(parts.header, { parts.scroll(tool) }), UiDataProvider {

    override fun uiDataSnapshot(sink: DataSink) {
        selection?.provideCopy(sink) { parts.content?.text ?: fallbackText() }
    }

    private fun fallbackText() = listOf(commandText(), outputText()).filter { it.isNotBlank() }.joinToString("\n\n")
}
```

## Testing Recommendations
- Test the integration and functionality of the `description` field in various scenarios.
- Verify the new UiDataProvider implementations in ShellToolView and ToolView for data synchronization and correctness.
- Ensure session selection registration works seamlessly with ToolSupport changes.

## Potential Risks
- Introducing the `description` field may require updates in related components and database schema.
- UiDataProvider changes might affect existing data synchronization methods; thorough testing is required to avoid regressions.
```
{"prompt_tokens":19881,"completion_tokens":1036,"total_tokens":20917}

[Session: 01e746cf-5df1-4a48-9bb4-9ab678bbd6cc]
[Messages: 2, Tokens: 20917]
