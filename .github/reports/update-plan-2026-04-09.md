# Update Plan for Alexi

Generated: 2026-04-09
Based on upstream commits: kilocode (1a5be52c7..1dc3c329c), opencode (ae614d9..847fc9d)

## Summary
- Total changes planned: 18
- Critical: 2 | High: 6 | Medium: 7 | Low: 3

## Changes

### 1. Add Local Recall Tool for Cross-Project Session Search
**File**: `src/tool/recall.ts` (new file)
**Priority**: high
**Type**: feature
**Reason**: New tool enabling AI to search and read transcripts from previous sessions across project worktrees. Enhances context awareness and knowledge retrieval.

**New code**:
```typescript
// kilocode_change - new file
import z from "zod"
import { Tool } from "./tool"
import { Instance } from "../project/instance"
import { Locale } from "../util/locale"
import { Filesystem } from "../util/filesystem"
import { WorktreeFamily } from "../worktree-family"
import DESCRIPTION from "./recall.txt"

export const RecallTool = Tool.define("kilo_local_recall", {
  description: DESCRIPTION,
  parameters: z.object({
    mode: z.enum(["search", "read"]).describe("'search' to find sessions by title, 'read' to get a session transcript"),
    query: z.string().optional().describe("Search query to match against session titles (required for search mode)"),
    sessionID: z.string().optional().describe("Session ID to read the transcript of (required for read mode)"),
    limit: z.number().optional().describe("Maximum number of search results to return (default: 20, max: 50)"),
  }),
  async execute(params, ctx) {
    if (params.mode === "search") {
      return search(params, ctx)
    }
    return read(params, ctx)
  },
})

async function search(params: { query?: string; limit?: number }, ctx: Tool.Context) {
  if (!params.query) {
    throw new Error("The 'query' parameter is required when mode is 'search'")
  }

  await ctx.ask({
    permission: "recall",
    patterns: ["search"],
    always: ["search"],
    metadata: {
      mode: "search",
      query: params.query,
    },
  })

  const limit = Math.min(params.limit ?? 20, 50)
  const dirs = await WorktreeFamily.list()
  const { Session } = await import("../session/index")

  const allSessions: Array<{
    id: string
    title: string
    projectPath: string
    updatedAt: Date
  }> = []

  for (const dir of dirs) {
    try {
      const sessions = await Session.list({ projectPath: dir })
      for (const session of sessions) {
        if (session.title?.toLowerCase().includes(params.query.toLowerCase())) {
          allSessions.push({
            id: session.id,
            title: session.title || "Untitled",
            projectPath: dir,
            updatedAt: new Date(session.updatedAt),
          })
        }
      }
    } catch {
      // Skip directories that fail to load
    }
  }

  // Sort by most recent first
  allSessions.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())

  const results = allSessions.slice(0, limit)

  return {
    output: JSON.stringify(results, null, 2),
    metadata: {
      mode: "search",
      query: params.query,
      resultCount: results.length,
    },
  }
}

async function read(params: { sessionID?: string }, ctx: Tool.Context) {
  if (!params.sessionID) {
    throw new Error("The 'sessionID' parameter is required when mode is 'read'")
  }

  await ctx.ask({
    permission: "recall",
    patterns: [params.sessionID],
    always: [params.sessionID],
    metadata: {
      mode: "read",
      sessionID: params.sessionID,
    },
  })

  const { Session } = await import("../session/index")
  const session = await Session.get(params.sessionID)

  if (!session) {
    throw new Error(`Session not found: ${params.sessionID}`)
  }

  const messages = await Session.messages(params.sessionID)
  const transcript = messages
    .map((m) => `[${m.role}]: ${typeof m.content === "string" ? m.content : JSON.stringify(m.content)}`)
    .join("\n\n")

  return {
    output: transcript,
    metadata: {
      mode: "read",
      sessionID: params.sessionID,
      title: session.title,
      messageCount: messages.length,
    },
  }
}
```

### 2. Add Recall Tool Description File
**File**: `src/tool/recall.txt` (new file)
**Priority**: high
**Type**: feature
**Reason**: Description file for the recall tool used in AI prompts.

**New code**:
```text
Search and read transcripts from previous sessions in this project and related worktrees.

Use 'search' mode to find sessions by title matching your query.
Use 'read' mode with a sessionID to retrieve the full transcript.

This tool helps you recall context from previous conversations and tasks.
```

### 3. Register Recall Tool in Registry
**File**: `src/tool/registry.ts`
**Priority**: high
**Type**: feature
**Reason**: The recall tool must be registered to be available to agents.

**Current code**:
```typescript
import { EditTool } from "./edit"
import { WriteTool } from "./write"
import { ReadTool } from "./read"
// ... other imports
```

**New code**:
```typescript
import { EditTool } from "./edit"
import { WriteTool } from "./write"
import { ReadTool } from "./read"
import { RecallTool } from "./recall"
// ... other imports

// In the builtin tools array or registration:
export namespace ToolRegistry {
  const log = Log.create({ service: "tool.registry" })

  type TaskDef = Tool.InferDef<typeof TaskTool>
  type ReadDef = Tool.InferDef<typeof ReadTool>

  type State = {
    custom: Tool.Def[]
    builtin: Tool.Def[]
    task: TaskDef
    read: ReadDef
  }

  export interface Interface {
    readonly ids: () => Effect.Effect<string[]>
    readonly all: () => Effect.Effect<Tool.Def[]>
    readonly named: () => Effect.Effect<{ task: TaskDef; read: ReadDef }>
    readonly tools: (model: {
      providerID: ProviderID
      modelID: ModelID
      agent: Agent.Info
    }) => Effect.Effect<Tool.Def[]>
  }

  // ... rest of implementation with RecallTool added to builtin array
}
```

### 4. Add Recall Permission to Default Agent Permissions
**File**: `src/agent/agent.ts`
**Priority**: critical
**Type**: security
**Reason**: The recall tool requires explicit permission configuration to control access to session history.

**Current code**:
```typescript
export namespace Agent {
  // ... existing permission defaults
  const defaultPermissions = {
    "*": "allow",
    bash,
    doom_loop: "ask",
    external_directory: {
      "*": "ask",
      ...Object.fromEntries(whitelistedDirs.map((dir) => [dir, "allow"])),
    },
  }
}
```

**New code**:
```typescript
export namespace Agent {
  // ... existing permission defaults
  const defaultPermissions = {
    "*": "allow",
    bash,
    doom_loop: "ask",
    recall: "ask", // kilocode_change - require permission for session recall
    external_directory: {
      "*": "ask",
      ...Object.fromEntries(whitelistedDirs.map((dir) => [dir, "allow"])),
    },
  }
}
```

### 5. Add Allow Everything Permission Route
**File**: `src/permission/routes.ts` (new file or extend existing)
**Priority**: critical
**Type**: feature
**Reason**: Enables users to temporarily allow all permissions without repeated prompts during trusted sessions.

**New code**:
```typescript
import { Hono } from "hono"
import { describeRoute, resolver, validator } from "hono-openapi"
import z from "zod"
import { Config } from "../config/config"
import { PermissionNext } from "./next"
import { Session } from "../session"
import { errors } from "../server/error"
import { lazy } from "../util/lazy"

export const PermissionRoutes = lazy(() =>
  new Hono().post(
    "/allow-everything",
    describeRoute({
      summary: "Allow everything",
      description: "Enable or disable allowing all permissions without prompts.",
      operationId: "permission.allowEverything",
      responses: {
        200: {
          description: "Success",
          content: {
            "application/json": {
              schema: resolver(z.boolean()),
            },
          },
        },
        ...errors(400, 404),
      },
    }),
    validator(
      "json",
      z.object({
        enable: z.boolean(),
        requestID: z.string().optional(),
        sessionID: z.string().optional(),
      }),
    ),
    async (c) => {
      const body = c.req.valid("json")
      const rules: PermissionNext.Ruleset = [{ permission: "*", pattern: "*", action: "allow" }]

      if (!body.enable) {
        if (body.sessionID) {
          const session = await Session.get(body.sessionID)
          await Session.setPermission({
            sessionID: body.sessionID,
            rules: [],
          })
        }
        await PermissionNext.allowEverything({ enable: false, sessionID: body.sessionID })
        return c.json(false)
      }

      await PermissionNext.allowEverything({
        enable: true,
        requestID: body.requestID,
        sessionID: body.sessionID,
      })
      return c.json(true)
    },
  ),
)
```

### 6. Extend PermissionNext with Allow Everything and Session Scoping
**File**: `src/permission/next.ts`
**Priority**: high
**Type**: feature
**Reason**: Core permission system needs session-scoped permissions and allow-everything functionality.

**Current code**:
```typescript
export namespace PermissionNext {
  // ... existing state function
  const state = async () => {
    return {
      pending,
      approved: stored,
    }
  }
}
```

**New code**:
```typescript
export namespace PermissionNext {
  // ... existing code

  const state = async () => {
    return {
      pending,
      approved: stored,
      session: {} as Record<string, Ruleset>, // kilocode_change - session-scoped rules
    }
  }

  // Update check function to include session-local rules
  export const check = fn(
    z.object({
      permission: z.string(),
      patterns: z.array(z.string()).optional(),
      sessionID: Identifier.schema("session"),
      ruleset: RulesetSchema,
    }),
    async (input) => {
      const s = await state()
      const { ruleset, ...request } = input
      const local = s.session[request.sessionID] ?? [] // kilocode_change
      const protected_ = ConfigProtection.isRequest(request)
      
      for (const pattern of request.patterns ?? []) {
        const rule = evaluate(request.permission, pattern, ruleset, s.approved, local) // kilocode_change
        log.info("evaluated", { permission: request.permission, pattern, action: rule })
        if (rule.action === "deny")
          throw new DeniedError(ruleset.filter((r) => Wildcard.match(request.permission, r.permission)))
        if (rule.action === "ask" || protected_) {
          // ... existing ask logic
        }
      }
    },
  )

  // kilocode_change start - allow everything functionality
  export const allowEverything = fn(
    z.object({
      enable: z.boolean(),
      requestID: Identifier.schema("permission").optional(),
      sessionID: Identifier.schema("session").optional(),
    }),
    async (input) => {
      const s = await state()

      if (!input.enable) {
        if (input.sessionID) {
          delete s.session[input.sessionID]
          return
        }
        const idx = s.approved.findLastIndex((r) => r.permission === "*" && r.pattern === "*" && r.action === "allow")
        if (idx >= 0) s.approved.splice(idx, 1)
        return
      }

      if (input.sessionID) {
        s.session[input.sessionID] = [{ permission: "*", pattern: "*", action: "allow" }]
      } else {
        s.approved.push({ permission: "*", pattern: "*", action: "allow" })
      }

      // If there's a pending request, resolve it
      if (input.requestID) {
        const pending = s.pending.get(input.requestID)
        if (pending) {
          pending.resolve({ action: "allow" })
          s.pending.delete(input.requestID)
        }
      }
    },
  )
  // kilocode_change end
}
```

### 7. Add File Diff Builder to Edit Tool
**File**: `src/tool/edit.ts`
**Priority**: medium
**Type**: feature
**Reason**: Improved diff generation with size limits and proper change tracking for permission displays.

**Current code**:
```typescript
import { diffLines } from "diff"
// ... existing imports

const MAX_DIAGNOSTICS_PER_FILE = 20
```

**New code**:
```typescript
import { diffLines } from "diff"
// ... existing imports

const MAX_DIAGNOSTICS_PER_FILE = 20
const MAX_DIFF_CONTENT = 500_000 // kilocode_change

// kilocode_change start
export function buildFileDiff(file: string, before: string, after: string): Snapshot.FileDiff {
  const tooLarge = before.length > MAX_DIFF_CONTENT || after.length > MAX_DIFF_CONTENT
  const fd: Snapshot.FileDiff = {
    file,
    before: tooLarge ? "" : before,
    after: tooLarge ? "" : after,
    additions: 0,
    deletions: 0,
  }
  if (!tooLarge) {
    for (const change of diffLines(before, after)) {
      if (change.added) fd.additions += change.count || 0
      if (change.removed) fd.deletions += change.count || 0
    }
  }
  return fd
}
// kilocode_change end
```

### 8. Update Edit Tool to Cache File Diffs
**File**: `src/tool/edit.ts`
**Priority**: medium
**Type**: feature
**Reason**: Cache file diffs during edit operations for permission display and review.

**Current code**:
```typescript
export const EditTool = Tool.define("edit", {
  // ... in execute function
  await FileTime.withLock(filePath, async () => {
    if (params.oldString === "") {
      const existed = await Filesystem.exists(filePath)
      contentNew = params.newString
      diff = trimDiff(createTwoFilesPatch(filePath, filePath, contentOld, contentNew))
      await ctx.ask({
        permission: "edit",
        patterns: [path.relative(Instance.worktree, filePath)],
```

**New code**:
```typescript
export const EditTool = Tool.define("edit", {
  // ... in execute function
  let cachedFilediff: Snapshot.FileDiff | undefined // kilocode_change
  await FileTime.withLock(filePath, async () => {
    if (params.oldString === "") {
      const existed = await Filesystem.exists(filePath)
      if (existed) content
{"prompt_tokens":22376,"completion_tokens":4096,"total_tokens":26472}

[Session: 63acb40b-8064-41a2-87ec-0b63e4cd9d13]
[Messages: 2, Tokens: 26472]
