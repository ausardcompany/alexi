# Update Plan for Alexi

Generated: 2026-05-11
Based on upstream commits: opencode c933504..903d818 (66 commits), kilocode 08a3e0a09..9d37a1aea (39 commits)

## Summary
- Total changes planned: 12
- Critical: 1 | High: 4 | Medium: 5 | Low: 2

## Changes

### 1. Add Reference Service for External Repository Support
**File**: `src/reference/reference.ts` (new file)
**Priority**: critical
**Type**: feature
**Reason**: OpenCode added a new Reference service that manages external repository references (both local directories and git repositories). This is essential for the Scout agent functionality and enables tools to access external codebases safely.

**New code**:
```typescript
import { Effect, Layer, Schema, Context } from "effect"
import * as path from "node:path"
import { AppFileSystem } from "../file/app-filesystem"
import { Global } from "../global"

export interface ReferenceEntry {
  kind: "git" | "local"
  repository?: string
  branch?: string
  path?: string
}

export interface ResolvedReference {
  kind: "git"
  repository: string
  branch?: string
} | {
  kind: "local"
  path: string
}

export class ReferenceService extends Context.Tag("Reference")<
  ReferenceService,
  {
    readonly ensure: (searchPath: string) => Effect.Effect<void, Error>
    readonly contains: (searchPath: string) => Effect.Effect<boolean>
    readonly resolve: (name: string, entry: ReferenceEntry) => ResolvedReference
    readonly getPrompt: (name: string, reference: ResolvedReference) => string
  }
>() {}

export const Reference = {
  Service: ReferenceService,
  
  layer: (config: { worktree: string; directory: string }) => Layer.effect(
    ReferenceService,
    Effect.gen(function* () {
      const fs = yield* AppFileSystem.Service
      const resolvedPaths = new Set<string>()

      function referencePath(value: string): string {
        if (value.startsWith("~/")) {
          return path.join(Global.Path.home, value.slice(2))
        }
        return path.isAbsolute(value)
          ? value
          : path.resolve(
              config.worktree === "/" ? config.directory : config.worktree,
              value
            )
      }

      function resolve(name: string, entry: ReferenceEntry): ResolvedReference {
        if (entry.kind === "local" && entry.path) {
          return { kind: "local", path: referencePath(entry.path) }
        }
        if (entry.kind === "git" && entry.repository) {
          return { kind: "git", repository: entry.repository, branch: entry.branch }
        }
        throw new Error(`Invalid reference entry for ${name}`)
      }

      return {
        ensure: (searchPath: string) =>
          Effect.gen(function* () {
            // Materialize git references if needed
            if (resolvedPaths.has(searchPath)) return
            resolvedPaths.add(searchPath)
          }),

        contains: (searchPath: string) =>
          Effect.succeed(resolvedPaths.has(searchPath)),

        resolve,

        getPrompt: (name: string, reference: ResolvedReference): string => {
          if (reference.kind === "local") {
            return [
              `You are Scout reference @${name}. This reference points to a local directory outside or alongside the current workspace.`,
              `Local directory: ${reference.path}`,
              `When invoked, inspect this directory as the primary reference source. Do not edit files.`,
            ].join("\n\n")
          }

          return [
            `You are Scout reference @${name}. This reference points to a git repository.`,
            `Repository: ${reference.repository}`,
            reference.branch ? `Branch: ${reference.branch}` : "",
            `When invoked, clone and inspect this repository as the primary reference source. Do not edit files.`,
          ].filter(Boolean).join("\n\n")
        },
      }
    })
  ),
}
```

### 2. Add Repository Cache for Reference Materialization
**File**: `src/reference/repository-cache.ts` (new file)
**Priority**: high
**Type**: feature
**Reason**: OpenCode added a repository cache to efficiently manage cloned reference repositories. This prevents redundant cloning operations and provides a consistent interface for accessing external code.

**New code**:
```typescript
import { Effect, Layer, Schema, Context, HashMap } from "effect"
import * as path from "node:path"
import * as fs from "node:fs/promises"
import * as crypto from "node:crypto"

export interface CachedRepository {
  path: string
  repository: string
  branch?: string
  lastAccessed: Date
}

export class RepositoryCacheService extends Context.Tag("RepositoryCache")<
  RepositoryCacheService,
  {
    readonly get: (repository: string, branch?: string) => Effect.Effect<CachedRepository | undefined>
    readonly set: (repository: string, localPath: string, branch?: string) => Effect.Effect<void>
    readonly getCachePath: (repository: string, branch?: string) => string
  }
>() {}

export const RepositoryCache = {
  Service: RepositoryCacheService,

  layer: (cacheDir: string) => Layer.effect(
    RepositoryCacheService,
    Effect.gen(function* () {
      const cache = new Map<string, CachedRepository>()

      function getCacheKey(repository: string, branch?: string): string {
        const hash = crypto.createHash("sha256")
        hash.update(repository)
        if (branch) hash.update(branch)
        return hash.digest("hex").slice(0, 12)
      }

      return {
        get: (repository: string, branch?: string) =>
          Effect.sync(() => {
            const key = getCacheKey(repository, branch)
            const entry = cache.get(key)
            if (entry) {
              entry.lastAccessed = new Date()
            }
            return entry
          }),

        set: (repository: string, localPath: string, branch?: string) =>
          Effect.sync(() => {
            const key = getCacheKey(repository, branch)
            cache.set(key, {
              path: localPath,
              repository,
              branch,
              lastAccessed: new Date(),
            })
          }),

        getCachePath: (repository: string, branch?: string): string => {
          const key = getCacheKey(repository, branch)
          return path.join(cacheDir, "repos", key)
        },
      }
    })
  ),
}
```

### 3. Update Glob Tool with Reference Support
**File**: `src/tool/glob.ts`
**Priority**: high
**Type**: feature
**Reason**: The glob tool needs to integrate with the new Reference service to allow searching in external reference directories while maintaining security through the permission system.

**Current code**:
```typescript
export const GlobTool = Tool.define(
  "glob",
  Parameters,
  Effect.gen(function* () {
    const rg = yield* Ripgrep.Service
    const fs = yield* AppFileSystem.Service

    return {
      description: DESCRIPTION,
      parameters: Parameters,
      execute: (params, ctx) =>
        Effect.gen(function* () {
          // ... existing implementation
          let search = params.path ?? ins.directory
          search = path.isAbsolute(search) ? search : path.resolve(ins.directory, search)
          const info = yield* fs.stat(search).pipe(Effect.catch(() => Effect.succeed(undefined)))
          if (info?.type === "File") {
            throw new Error(`glob path must be a directory: ${search}`)
          }
          yield* assertExternalDirectoryEffect(ctx, search, { kind: "directory" })
          // ... rest of implementation
        }),
    }
  })
)
```

**New code**:
```typescript
import { Reference } from "../reference/reference"

export const GlobTool = Tool.define(
  "glob",
  Parameters,
  Effect.gen(function* () {
    const rg = yield* Ripgrep.Service
    const fs = yield* AppFileSystem.Service
    const reference = yield* Reference.Service

    return {
      description: DESCRIPTION,
      parameters: Parameters,
      execute: (params, ctx) =>
        Effect.gen(function* () {
          const ins = yield* ctx.instance
          
          let search = params.path ?? ins.directory
          search = path.isAbsolute(search) ? search : path.resolve(ins.directory, search)
          
          // Ensure reference is materialized if this is a reference path
          yield* reference.ensure(search)
          
          const info = yield* fs.stat(search).pipe(Effect.catch(() => Effect.succeed(undefined)))
          if (info?.type === "File") {
            throw new Error(`glob path must be a directory: ${search}`)
          }
          
          // Bypass permission check if path is within a configured reference
          yield* assertExternalDirectoryEffect(ctx, search, {
            bypass: yield* reference.contains(search),
            kind: "directory",
          })
          
          // ... rest of implementation unchanged
        }),
    }
  })
)
```

### 4. Update Grep Tool with Reference Support
**File**: `src/tool/grep.ts`
**Priority**: high
**Type**: feature
**Reason**: Similar to glob, the grep tool needs Reference service integration for searching external reference directories.

**Current code**:
```typescript
export const GrepTool = Tool.define(
  "grep",
  Parameters,
  Effect.gen(function* () {
    const rg = yield* Ripgrep.Service
    // ... implementation
  })
)
```

**New code**:
```typescript
import { Reference } from "../reference/reference"

export const GrepTool = Tool.define(
  "grep",
  Parameters,
  Effect.gen(function* () {
    const rg = yield* Ripgrep.Service
    const reference = yield* Reference.Service

    return {
      description: DESCRIPTION,
      parameters: Parameters,
      execute: (params, ctx) =>
        Effect.gen(function* () {
          const ins = yield* ctx.instance
          
          let search = params.path ?? ins.directory
          search = path.isAbsolute(search) ? search : path.resolve(ins.directory, search)
          
          // Ensure reference is materialized
          yield* reference.ensure(search)
          
          // Bypass permission for configured references
          yield* assertExternalDirectoryEffect(ctx, search, {
            bypass: yield* reference.contains(search),
            kind: "directory",
          })
          
          // ... rest of implementation
        }),
    }
  })
)
```

### 5. Update Read Tool with Reference Support
**File**: `src/tool/read.ts`
**Priority**: high
**Type**: feature
**Reason**: The read tool must support reading files from reference directories for the Scout agent to function properly.

**Current code**:
```typescript
export const ReadTool = Tool.define(
  "read",
  Parameters,
  Effect.gen(function* () {
    const fs = yield* AppFileSystem.Service
    // ... implementation
  })
)
```

**New code**:
```typescript
import { Reference } from "../reference/reference"

export const ReadTool = Tool.define(
  "read",
  Parameters,
  Effect.gen(function* () {
    const fs = yield* AppFileSystem.Service
    const reference = yield* Reference.Service

    return {
      description: DESCRIPTION,
      parameters: Parameters,
      execute: (params, ctx) =>
        Effect.gen(function* () {
          const ins = yield* ctx.instance
          
          let filePath = params.path
          filePath = path.isAbsolute(filePath) 
            ? filePath 
            : path.resolve(ins.directory, filePath)
          
          // Ensure reference is materialized for reference paths
          yield* reference.ensure(path.dirname(filePath))
          
          // Check if path is within a reference (bypass permission)
          const isReference = yield* reference.contains(path.dirname(filePath))
          
          if (!isReference) {
            yield* assertExternalFileEffect(ctx, filePath, { kind: "file" })
          }
          
          // ... rest of implementation
        }),
    }
  })
)
```

### 6. Refactor repo_clone Tool to Use Repository Cache
**File**: `src/tool/repo_clone.ts`
**Priority**: medium
**Type**: refactor
**Reason**: OpenCode significantly refactored repo_clone to use the new repository cache, reducing code duplication and improving efficiency. The tool was reduced from ~165 lines to ~36 lines.

**Current code**:
```typescript
// Existing full implementation with inline caching logic
export const RepoCloneTool = Tool.define(
  "repo_clone",
  Parameters,
  Effect.gen(function* () {
    // ... 150+ lines of implementation
  })
)
```

**New code**:
```typescript
import { RepositoryCache } from "../reference/repository-cache"
import { Reference } from "../reference/reference"

export const Parameters = Schema.Struct({
  repository: Schema.String.annotate({ 
    description: "The git repository URL to clone" 
  }),
  branch: Schema.optional(Schema.String).annotate({ 
    description: "Optional branch to checkout" 
  }),
})

export const RepoCloneTool = Tool.define(
  "repo_clone",
  Parameters,
  Effect.gen(function* () {
    const cache = yield* RepositoryCache.Service
    const reference = yield* Reference.Service

    return {
      description: DESCRIPTION,
      parameters: Parameters,
      execute: (params, ctx) =>
        Effect.gen(function* () {
          const { repository, branch } = params
          
          // Check cache first
          const cached = yield* cache.get(repository, branch)
          if (cached) {
            return {
              path: cached.path,
              cached: true,
              message: `Repository already cloned at ${cached.path}`,
            }
          }
          
          // Get cache path and clone
          const clonePath = cache.getCachePath(repository, branch)
          
          yield* Effect.tryPromise({
            try: async () => {
              const args = ["clone", "--depth", "1"]
              if (branch) args.push("--branch", branch)
              args.push(repository, clonePath)
              
              const proc = Bun.spawn(["git", ...args])
              const exitCode = await proc.exited
              if (exitCode !== 0) {
                throw new Error(`git clone failed with exit code ${exitCode}`)
              }
            },
            catch: (e) => new Error(`Failed to clone repository: ${e}`),
          })
          
          // Update cache
          yield* cache.set(repository, clonePath, branch)
          
          return {
            path: clonePath,
            cached: false,
            message: `Successfully cloned ${repository} to ${clonePath}`,
          }
        }),
    }
  })
)
```

### 7. Add Reference Service to Tool Registry
**File**: `src/tool/registry.ts`
**Priority**: medium
**Type**: feature
**Reason**: The tool registry needs to provide the Reference service to all tools that require it.

**Current code**:
```typescript
export const createToolRegistry = (config: ToolRegistryConfig) =>
  Effect.gen(function* () {
    const tools = new Map<string, Tool>()
    // ... registration logic
  })
```

**New code**:
```typescript
import { Reference } from "../reference/reference"
import { RepositoryCache } from "../reference/repository-cache"

export const createToolRegistry = (config: ToolRegistryConfig) =>
  Effect.gen(function* () {
    const tools = new Map<string, Tool>()
    const reference = yield* Reference.Service
    const repoCache = yield* RepositoryCache.Service
    
    // Provide reference services to tool context
    const toolContext = {
      reference,
      repoCache,
      ...config.context,
    }
    
    // ... rest of registration logic with toolContext
  })

// Update layer to include Reference services
export
{"prompt_tokens":11834,"completion_tokens":4096,"total_tokens":15930}

[Session: fde9192c-1e1a-4d97-9832-ee821e428bbb]
[Messages: 2, Tokens: 15930]
