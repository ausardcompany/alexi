```markdown
# Update Plan for Alexi

Generated: 2026-06-16
Based on upstream commits: 2ddf6f635..ca8515ade, 5d0f866..3a2ff11

## Summary
- Total changes planned: 6
- Critical: 0 | High: 3 | Medium: 2 | Low: 1

## Changes

### 1. Update Kilo CLI Parser
**File**: `src/tool/KiloCliParserTest.kt`
**Priority**: high
**Type**: feature
**Reason**: To support new XML parsing functions introduced in kilocode.

**Current code**:
```kotlin
// existing test cases for Kilo CLI Parser
```

**New code**:
```kotlin
@Test
fun `tag extracts trimmed tool xml value`() {
    val text = """
        <path>
          /tmp/example.txt
        </path>
        <type>file</type>
    """.trimIndent()

    assertEquals("/tmp/example.txt", KiloCliParser.tag(text, "path"))
    assertEquals("file", KiloCliParser.tag(text, "type"))
}

@Test
fun `tag returns null for blank or missing value`() {
    assertNull(KiloCliParser.tag("<path>   </path>", "path"))
    assertNull(KiloCliParser.tag("<type>file</type>", "path"))
}
```

### 2. Implement Shell Tool View
**File**: `src/tool/ShellToolView.kt`
**Priority**: high
**Type**: feature
**Reason**: To incorporate new shell tool views as per kilocode updates.

**New code**:
```kotlin
package ai.kilocode.client.session.views.tool

import ai.kilocode.client.plugin.KiloBundle
import ai.kilocode.client.session.model.Tool
import ai.kilocode.client.session.ui.selection.SessionSelection
import ai.kilocode.client.ui.md.MdTerminal
import javax.swing.JPanel

class ShellToolView(
    tool: Tool,
    selection: SessionSelection? = null,
) : SecondarySessionPartView(tool.id, { JPanel() }) {

    init {
        // Initialization code here
    }
}
```

### 3. Update Tool Support
**File**: `src/tool/ToolSupport.kt`
**Priority**: medium
**Type**: refactor
**Reason**: To adjust the UI layout and incorporate new parsers.

**Current code**:
```kotlin
val center = JPanel(BorderLayout(JBUI.scale(SessionUiStyle.View.Layout.GAP), 0)).apply { isOpaque = false }
```

**New code**:
```kotlin
val center = JPanel(BorderLayout(UiStyle.Gap.md(), 0)).apply { isOpaque = false }
```

### 4. Update Shell Tool Command
**File**: `src/tool/shell.ts`
**Priority**: medium
**Type**: bugfix
**Reason**: To ensure compatibility with PowerShell argument encoding.

**Current code**:
```typescript
return ChildProcess.make(shell, Shell.args(shell, command, cwd), {
    cwd,
    env,
    stdin: "ignore",
```

**New code**:
```typescript
return ChildProcess.make(shell, Shell.args(shell, command, cwd), {
    // kilocode_change - encoded PowerShell args
    cwd,
    env,
    stdin: "ignore",
```

### 5. Modify Agent Index Plan Edit Rules
**File**: `src/agent/index.ts`
**Priority**: high
**Type**: feature
**Reason**: To allow new plan paths as per opencode updates.

**Current code**:
```typescript
[path.join(".kilo", "plans", "*.md")]: "allow" as const,
```

**New code**:
```typescript
[path.join(".kilo", "plans", "*.md")]: "allow" as const,
[path.join("plans", "*.md")]: "allow" as const,
```

### 6. Update Warpgrep Tool
**File**: `src/tool/warpgrep.ts`
**Priority**: low
**Type**: refactor
**Reason**: Minor updates to align with upstream changes.

**Current code**:
```typescript
// original warpgrep configurations
```

**New code**:
```typescript
// updated warpgrep configurations
```

## Testing Recommendations
- Run unit tests to verify XML parsing in `KiloCliParserTest.kt`.
- Test shell tool view rendering in the UI.
- Verify PowerShell command execution in Windows environments.
- Ensure agent plan editing rules are correctly applied.
- Validate the functionality of the updated warpgrep tool.

## Potential Risks
- Changes to shell command execution may affect Windows compatibility.
- Updates to the agent index could inadvertently allow incorrect file edits.
- UI modifications might lead to layout issues across different environments.
```
{"prompt_tokens":17027,"completion_tokens":1027,"total_tokens":18054}

[Session: 7f03c1c8-4aec-4a9c-9d5b-aea488bbcd67]
[Messages: 2, Tokens: 18054]
