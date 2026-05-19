# Update Plan for Alexi

Generated: 2026-05-19
Based on upstream commits: kilocode (a23fe160d..4c0e6987b - 51 commits), opencode (53e89f9..2339aac - 91 commits)

## Summary
- Total changes planned: 18
- Critical: 2 | High: 6 | Medium: 7 | Low: 3

## Changes

### 1. Fix Event Bus Race Condition - Acquire PubSub Subscription Eagerly
**File**: `src/bus/index.ts`
**Priority**: critical
**Type**: bugfix
**Reason**: The opencode changes fix a race condition in the `/event` endpoint where subscriptions weren't acquired eagerly, causing missed events. This is critical for reliable event streaming.

**Current code** (if modifying):
```typescript
// Typical pattern where subscription happens lazily
export class EventBus {
  subscribe(topic: string, handler: EventHandler) {
    // subscription created when handler is called
    return this.pubsub.subscribe(topic, handler)
  }
}
```

**New code**:
```typescript
import { Effect, Stream, PubSub, Queue } from "effect"

export class EventBus {
  /**
   * Acquire subscription eagerly to prevent race conditions
   * where events could be missed between subscribe call and first listen
   */
  subscribe(topic: string, handler: EventHandler) {
    return Effect.gen(function* () {
      // Eagerly acquire the subscription before returning
      const subscription = yield* PubSub.subscribe(this.pubsub)
      
      // Create a dequeue that's immediately ready to receive
      const dequeue = yield* Queue.bounded<Event>(256)
      
      // Fork the subscription listener immediately
      yield* Effect.fork(
        Stream.fromQueue(subscription).pipe(
          Stream.filter((event) => event.topic === topic),
          Stream.runForEach((event) => Effect.sync(() => handler(event)))
        )
      )
      
      return {
        unsubscribe: () => Queue.shutdown(dequeue)
      }
    })
  }
}
```

### 2. Auto-Resume Network Reconnects
**File**: `src/core/network.ts`
**Priority**: critical
**Type**: bugfix
**Reason**: The kilocode changes add automatic network reconnection with resume capability, preventing session loss during network interruptions.

**New code**:
```typescript
import { Effect, Schedule, Duration } from "effect"

interface NetworkState {
  connected: boolean
  reconnecting: boolean
  lastError?: Error
  retryCount: number
}

export class NetworkManager {
  private state: NetworkState = {
    connected: true,
    reconnecting: false,
    retryCount: 0
  }

  private readonly maxRetries = 5
  private readonly baseDelay = Duration.seconds(1)

  /**
   * Auto-resume network reconnects with exponential backoff
   * Ported from kilocode fix(cli): auto-resume network reconnects
   */
  async reconnect(): Promise<void> {
    if (this.state.reconnecting) return
    
    this.state.reconnecting = true
    this.state.connected = false

    const reconnectEffect = Effect.retry(
      this.attemptConnection(),
      Schedule.exponential(this.baseDelay).pipe(
        Schedule.compose(Schedule.recurs(this.maxRetries)),
        Schedule.tapOutput((attempt) => 
          Effect.sync(() => {
            this.state.retryCount = attempt
            this.emitReconnectAttempt(attempt)
          })
        )
      )
    )

    try {
      await Effect.runPromise(reconnectEffect)
      this.state.connected = true
      this.state.reconnecting = false
      this.state.retryCount = 0
      this.emitReconnected()
    } catch (error) {
      this.state.lastError = error as Error
      this.state.reconnecting = false
      this.emitReconnectFailed(error as Error)
    }
  }

  private attemptConnection() {
    return Effect.tryPromise({
      try: () => this.doConnect(),
      catch: (error) => new NetworkError("Connection failed", { cause: error })
    })
  }

  private emitReconnectAttempt(attempt: number) {
    this.emit("reconnect:attempt", { attempt, maxRetries: this.maxRetries })
  }

  private emitReconnected() {
    this.emit("reconnect:success", {})
  }

  private emitReconnectFailed(error: Error) {
    this.emit("reconnect:failed", { error })
  }
}

export class NetworkError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options)
    this.name = "NetworkError"
  }
}
```

### 3. Update Tool Registry with Enhanced Tool Resolution
**File**: `src/tool/registry.ts`
**Priority**: high
**Type**: feature
**Reason**: The opencode changes improve tool registry with better prompt tool resolution, extracted into a dedicated module.

**Current code** (if modifying):
```typescript
export class ToolRegistry {
  private tools: Map<string, Tool> = new Map()

  register(tool: Tool) {
    this.tools.set(tool.name, tool)
  }

  get(name: string): Tool | undefined {
    return this.tools.get(name)
  }
}
```

**New code**:
```typescript
import { Effect, Option } from "effect"

export interface ToolResolutionContext {
  sessionId: string
  agentId?: string
  permissions: string[]
}

export class ToolRegistry {
  private tools: Map<string, Tool> = new Map()
  private promptTools: Map<string, PromptToolResolver> = new Map()

  register(tool: Tool) {
    this.tools.set(tool.name, tool)
  }

  /**
   * Register a prompt tool resolver for dynamic tool resolution
   * Based on opencode refactor(session): extract prompt tool resolution
   */
  registerPromptResolver(name: string, resolver: PromptToolResolver) {
    this.promptTools.set(name, resolver)
  }

  get(name: string): Tool | undefined {
    return this.tools.get(name)
  }

  /**
   * Resolve tools for a given prompt context
   * Handles both static and dynamic tool resolution
   */
  resolveForPrompt(
    context: ToolResolutionContext
  ): Effect.Effect<Tool[], ToolResolutionError> {
    return Effect.gen(function* (this: ToolRegistry) {
      const resolvedTools: Tool[] = []

      // Add static tools that match permissions
      for (const [name, tool] of this.tools) {
        if (this.hasPermission(tool, context.permissions)) {
          resolvedTools.push(tool)
        }
      }

      // Resolve dynamic prompt tools
      for (const [name, resolver] of this.promptTools) {
        const dynamicTools = yield* resolver.resolve(context)
        resolvedTools.push(...dynamicTools)
      }

      return resolvedTools
    }.bind(this))
  }

  private hasPermission(tool: Tool, permissions: string[]): boolean {
    if (!tool.requiredPermissions) return true
    return tool.requiredPermissions.every((p) => permissions.includes(p))
  }
}

export interface PromptToolResolver {
  resolve(context: ToolResolutionContext): Effect.Effect<Tool[], ToolResolutionError>
}

export class ToolResolutionError extends Error {
  constructor(message: string, public readonly toolName?: string) {
    super(message)
    this.name = "ToolResolutionError"
  }
}
```

### 4. Fix Plugin Tool Ask Returns Promise Instead of Effect
**File**: `src/tool/plugin-tools.ts`
**Priority**: high
**Type**: bugfix
**Reason**: The opencode fix ensures that `ask` in tools from plugins returns a promise instead of an Effect, fixing plugin compatibility issues.

**Current code** (if modifying):
```typescript
export function createPluginToolWrapper(pluginTool: PluginTool): Tool {
  return {
    name: pluginTool.name,
    execute: async (params, context) => {
      return pluginTool.execute(params, {
        ...context,
        ask: (question) => Effect.runPromise(context.ask(question))
      })
    }
  }
}
```

**New code**:
```typescript
import { Effect } from "effect"

export function createPluginToolWrapper(pluginTool: PluginTool): Tool {
  return {
    name: pluginTool.name,
    description: pluginTool.description,
    schema: pluginTool.schema,
    execute: async (params, context) => {
      // Wrap the ask function to return a Promise instead of Effect
      // This ensures plugin tools receive the expected Promise-based API
      // Fix from opencode: fix(plugin): `ask` in tools from plugins returns promise instead of effect
      const wrappedContext = {
        ...context,
        ask: async (question: string): Promise<string> => {
          const effect = context.ask(question)
          // Handle both Effect and Promise returns for backwards compatibility
          if (Effect.isEffect(effect)) {
            return Effect.runPromise(effect)
          }
          return effect as Promise<string>
        }
      }
      
      return pluginTool.execute(params, wrappedContext)
    }
  }
}
```

### 5. Add Repository Cache Service with Typed Failures
**File**: `src/reference/repository-cache.ts`
**Priority**: high
**Type**: feature
**Reason**: The opencode changes add a dedicated cache service for repository references with properly typed cache failures.

**New code**:
```typescript
import { Effect, Context, Layer, Duration, Cache } from "effect"

// Typed cache failures based on opencode refactor(repository): type cache failures
export class CacheError extends Error {
  readonly _tag = "CacheError"
}

export class CacheMissError extends CacheError {
  readonly _tag = "CacheMissError"
  constructor(public readonly key: string) {
    super(`Cache miss for key: ${key}`)
  }
}

export class CacheStaleError extends CacheError {
  readonly _tag = "CacheStaleError"
  constructor(public readonly key: string, public readonly age: Duration.Duration) {
    super(`Cache entry stale for key: ${key}`)
  }
}

export class CacheCapacityError extends CacheError {
  readonly _tag = "CacheCapacityError"
  constructor(public readonly currentSize: number, public readonly maxSize: number) {
    super(`Cache at capacity: ${currentSize}/${maxSize}`)
  }
}

export interface RepositoryCacheEntry {
  content: string
  hash: string
  fetchedAt: Date
  expiresAt: Date
}

export interface RepositoryCache {
  readonly get: (
    key: string
  ) => Effect.Effect<RepositoryCacheEntry, CacheMissError | CacheStaleError>
  readonly set: (
    key: string,
    entry: RepositoryCacheEntry
  ) => Effect.Effect<void, CacheCapacityError>
  readonly invalidate: (key: string) => Effect.Effect<void>
  readonly clear: () => Effect.Effect<void>
}

export const RepositoryCache = Context.GenericTag<RepositoryCache>("RepositoryCache")

export const RepositoryCacheLive = Layer.effect(
  RepositoryCache,
  Effect.gen(function* () {
    const cache = yield* Cache.make({
      capacity: 1000,
      timeToLive: Duration.hours(1),
      lookup: (key: string) =>
        Effect.fail(new CacheMissError(key))
    })

    return {
      get: (key: string) =>
        Effect.gen(function* () {
          const entry = yield* cache.get(key)
          
          // Check if entry is stale
          const now = new Date()
          if (entry.expiresAt < now) {
            const age = Duration.millis(now.getTime() - entry.fetchedAt.getTime())
            yield* Effect.fail(new CacheStaleError(key, age))
          }
          
          return entry
        }),

      set: (key: string, entry: RepositoryCacheEntry) =>
        Effect.gen(function* () {
          const size = yield* cache.size
          if (size >= 1000) {
            yield* Effect.fail(new CacheCapacityError(size, 1000))
          }
          yield* cache.set(key, entry)
        }),

      invalidate: (key: string) => cache.invalidate(key),

      clear: () => cache.invalidateAll
    }
  })
)
```

### 6. Normalize Reference Config Entries
**File**: `src/reference/reference.ts`
**Priority**: high
**Type**: refactor
**Reason**: The opencode changes normalize config entries for references, improving consistency in how references are handled.

**New code**:
```typescript
import { Effect } from "effect"

export interface ReferenceConfig {
  type: "file" | "url" | "repository"
  path: string
  alias?: string
  description?: string
}

export interface NormalizedReference {
  id: string
  type: ReferenceConfig["type"]
  resolvedPath: string
  alias: string
  description: string
  metadata: Record<string, unknown>
}

/**
 * Normalize reference config entries for consistent handling
 * Based on opencode refactor(reference): normalize config entries
 */
export function normalizeReferenceConfig(
  config: ReferenceConfig,
  baseDir: string
): Effect.Effect<NormalizedReference, ReferenceNormalizationError> {
  return Effect.gen(function* () {
    const id = generateReferenceId(config)
    
    // Resolve path based on type
    const resolvedPath = yield* resolvePath(config.type, config.path, baseDir)
    
    // Generate alias if not provided
    const alias = config.alias ?? deriveAlias(config.path)
    
    // Generate description if not provided
    const description = config.description ?? `Reference to ${config.path}`
    
    return {
      id,
      type: config.type,
      resolvedPath,
      alias,
      description,
      metadata: {}
    }
  })
}

function generateReferenceId(config: ReferenceConfig): string {
  const hash = createHash("sha256")
  hash.update(`${config.type}:${config.path}`)
  return hash.digest("hex").slice(0, 12)
}

function deriveAlias(path: string): string {
  // Extract filename or last path segment as alias
  const segments = path.split(/[\/\\]/)
  const lastSegment = segments[segments.length - 1] || path
  return lastSegment.replace(/\.[^.]+$/, "") // Remove extension
}

function resolvePath(
  type: ReferenceConfig["type"],
  path: string,
  baseDir: string
): Effect.Effect<string, ReferenceNormalizationError> {
  return Effect.try({
    try: () => {
      switch (type) {
        case "file":
          return resolve(baseDir, path)
        case "url":
          // Validate URL format
          new URL(path)
          return path
        case "repository":
          // Repository paths are kept as-is
          return path
        default:
          throw new Error(`Unknown reference type: ${type}`)
      }
    },
    catch: (error) => new ReferenceNormalizationError(
      `Failed to resolve path: ${path}`,
      { cause: error }
    )
  })
}

export class ReferenceNormalizationError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options)
    this.name = "ReferenceNormalizationError"
  }
}
```

### 7. Add Session Replay for Interactive Resume
**File**: `src/cli/cmd/run/session-replay.ts`
**Priority**: high
**Type**: feature
**Reason**: The opencode changes add session history replay on
{"prompt_tokens":16271,"completion_tokens":4096,"total_tokens":20367}

[Session: d8c13513-4582-4acb-89c9-06a4c66d5aaf]
[Messages: 2, Tokens: 20367]
