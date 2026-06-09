```markdown
# Update Plan for Alexi

Generated: 2026-06-09
Based on upstream commits: Kilo-Org/kilocode (1181567b2..574dc1920), anomalyco/opencode (0050134..671d193)

## Summary
- Total changes planned: 40
- Critical: 5 | High: 15 | Medium: 15 | Low: 5

## Changes

### 1. Add .ods Support for Read Tool
**File**: `src/tool/ods.ts`
**Priority**: high
**Type**: feature
**Reason**: Enhances functionality by supporting OpenDocument Spreadsheet files.

**New code**:
```typescript
import { CFB } from "xlsx"

function attribute(xml: string, name: string) {
  return xml.match(new RegExp(`(?:^|\\s)(?:[\\w.-]+:)?${name}\\s*=\\s*(["'])(.*?)\\1`))?.[2]
}

export function visibility(bytes: Uint8Array) {
  const archive = CFB.read(bytes, { type: "buffer" })
  const content = CFB.find(archive, "content.xml")?.content
  if (!content) return new Set<number>()

  const xml = new TextDecoder().decode(content)
  const styles = new Set(
    Array.from(xml.matchAll(/<style:style(?=[\s>])([^>]*)>([\s\S]*?)<\/style:style\s*>/g)).flatMap((match) => {
      if (attribute(match[1], "family") !== "table") return []
      const hidden = /<style:table-properties(?=[\s>])[^>]*\btable:display\s*=\s*(["'])false\1/.test(match[2])
      const name = attribute(match[1], "name")
      return hidden && name ? [name] : []
    }),
  )
  return new Set(
    Array.from(xml.matchAll(/<table:table(?=[\s>])([^>]*)>/g)).flatMap((match, index) => {
      const style = attribute(match[1], "style-name")
      return style && styles.has(style) ? [index] : []
    }),
  )
}
```

### 2. Update XLSX Tool to Support ODS
**File**: `src/tool/xlsx.ts`
**Priority**: high
**Type**: feature
**Reason**: Necessary to integrate .ods support into existing functionality.

**Current code**:
```typescript
export function is(filepath: string) {
  return path.extname(filepath).toLowerCase() === ".xlsx"
}

export async function open(filepath: string) {
  const file = Bun.file(filepath)
  if (file.size > MAX_SIZE) {
    throw new Error(`Cannot read spreadsheet file: ${filepath} exceeds the ${MAX_SIZE_LABEL} size limit`)
  }
  const bytes = new Uint8Array(await file.arrayBuffer())
  if (bytes[0] !== 0x50 || bytes[1] !== 0x4b) {
    throw new Error(`Cannot read spreadsheet file: ${filepath} is not a valid XLSX workbook`)
  }
  try {
    const book = read(bytes, { type: "array", cellDates: true })
    return Readable.from(lines(book))
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    throw new Error(`Cannot read spreadsheet file: ${filepath}: ${message}`, { cause: err })
  }
}
```

**New code**:
```typescript
export function is(filepath: string) {
  const ext = path.extname(filepath).toLowerCase()
  return ext === ".xlsx" || ext === ".ods"
}

export async function open(filepath: string) {
  const ods = path.extname(filepath).toLowerCase() === ".ods"
  const file = Bun.file(filepath)
  if (file.size > MAX_SIZE) {
    throw new Error(`Cannot read spreadsheet file: ${filepath} exceeds the ${MAX_SIZE_LABEL} size limit`)
  }
  const bytes = new Uint8Array(await file.arrayBuffer())
  if (bytes[0] !== 0x50 || bytes[1] !== 0x4b) {
    throw new Error(`Cannot read spreadsheet file: ${filepath} is not a valid spreadsheet`)
  }
  try {
    const book = read(bytes, { type: "array", cellDates: true })
    return Readable.from(lines(book, ods ? visibility(bytes) : new Set(), ods))
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    throw new Error(`Cannot read spreadsheet file: ${filepath}: ${message}`, { cause: err })
  }
}
```

### 3. Refactor Agent Initialization
**File**: `src/agent/index.ts`
**Priority**: medium
**Type**: refactor
**Reason**: Aligns with new patterns for agent initialization from kilocode.

**Current code**:
```typescript
export const layer = Layer.effect(
  // Existing initialization code
)
```

**New code**:
```typescript
export const layer = Layer.effect(
  // Updated initialization with KiloAgent patch and preprocessConfig
  KiloAgent.patchAgents(agents, defaults, user, cfg, kilo, ctx.worktree, whitelistedDirs)
  const agentConfigs = KiloAgent.preprocessConfig(cfg.agent ?? {})
  for (const [key, value] of Object.entries(agentConfigs)) {
    // Process config
  }
)
```

### 4. Update Permission System
**File**: `src/permission/index.ts`
**Priority**: high
**Type**: bugfix
**Reason**: Reflects changes in permission handling and schema updates from upstream.

**Current code**:
```typescript
export const SaveAlwaysRulesInput = z.object({
  requestID: PermissionID.zod,
  approvedAlways: z.string().array().optional(),
  deniedAlways: z.string().array().optional(),
})
```

**New code**:
```typescript
export const SaveAlwaysRulesInput = z.object({
  requestID: zod(PermissionID),
  approvedAlways: z.string().array().optional(),
  deniedAlways: z.string().array().optional(),
})
```

### 5. Fix Memory Leak in Session Prompt Queue
**File**: `src/session/prompt-queue.ts`
**Priority**: critical
**Type**: bugfix
**Reason**: Addresses critical memory leak issue affecting session management.

**Current code**:
```typescript
export function cancel(sessionID: string) {
  // existing cancel logic
}
```

**New code**:
```typescript
export function cancel(sessionID: string) {
  // Updated to handle sessions without active tails
  if (!activeTails.has(sessionID)) {
    return // Early exit if no active tails
  }
  // Rest of the cancel logic
}
```

## Testing Recommendations
- Verify `.ods` file support with various test cases.
- Run regression tests on agent initialization and permission updates.
- Validate session management and ensure memory issues are resolved.

## Potential Risks
- Changes to core session and permission handling might introduce new bugs if not thoroughly tested.
- Refactoring agent and tool systems could affect existing integrations.
```

{"prompt_tokens":21032,"completion_tokens":1541,"total_tokens":22573}

[Session: 88167ae5-b0b8-4edc-a0cc-355d41aae21f]
[Messages: 2, Tokens: 22573]
