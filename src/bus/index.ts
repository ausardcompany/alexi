/**
 * Event Bus System
 * Type-safe event emitter pattern inspired by kilocode/opencode
 * Features: typed events, subscriptions, async handlers
 */

import { z } from 'zod';

// Event handler types
type EventHandler<T> = (payload: T) => void | Promise<void>;
type UnsubscribeFn = () => void;

// Internal event registry
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const eventHandlers = new Map<string, Set<EventHandler<any>>>();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const eventSchemas = new Map<string, z.ZodType<any>>();

/**
 * Define a typed event with Zod schema validation
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function defineEvent<T extends z.ZodType<any>>(
  name: string,
  schema: T
): BusEvent<z.infer<T>> {
  eventSchemas.set(name, schema);

  return {
    name,
    schema,

    publish(payload: z.infer<T>): void {
      // Validate payload
      const parsed = schema.parse(payload);
      const handlers = eventHandlers.get(name);

      if (handlers) {
        for (const handler of handlers) {
          try {
            handler(parsed);
          } catch (err) {
            console.error(`Error in event handler for ${name}:`, err);
          }
        }
      }
    },

    async publishAsync(payload: z.infer<T>): Promise<void> {
      const parsed = schema.parse(payload);
      const handlers = eventHandlers.get(name);

      if (handlers) {
        await Promise.all(
          Array.from(handlers).map(async (handler) => {
            try {
              await handler(parsed);
            } catch (err) {
              console.error(`Error in async event handler for ${name}:`, err);
            }
          })
        );
      }
    },

    subscribe(handler: EventHandler<z.infer<T>>): UnsubscribeFn {
      // Eagerly acquire subscription to prevent race conditions
      // where events could be missed between subscribe call and first listen
      // Based on opencode fix: acquire PubSub subscription eagerly
      if (!eventHandlers.has(name)) {
        eventHandlers.set(name, new Set());
      }

      // Immediately add handler to the set before returning
      const handlers = eventHandlers.get(name)!;
      handlers.add(handler);

      // Return unsubscribe function
      return () => {
        eventHandlers.get(name)?.delete(handler);
      };
    },

    once(handler: EventHandler<z.infer<T>>): UnsubscribeFn {
      const wrappedHandler = (payload: z.infer<T>) => {
        unsub();
        handler(payload);
      };
      const unsub = this.subscribe(wrappedHandler);
      return unsub;
    },
  };
}

export interface BusEvent<T> {
  readonly name: string;
  readonly schema: z.ZodType<T>;
  publish(payload: T): void;
  publishAsync(payload: T): Promise<void>;
  subscribe(handler: EventHandler<T>): UnsubscribeFn;
  once(handler: EventHandler<T>): UnsubscribeFn;
}

// Alexi_change start - batched publish (ported from kilocode upstream event-batch)
/**
 * A single entry in a `publishAll` batch. Each entry pairs a previously
 * registered {@link BusEvent} with a matching payload. The payload is
 * validated against the event's Zod schema before ANY handler is invoked,
 * so a validation failure in the middle of the batch fails fast without
 * a partial publish.
 */
export interface BatchEntry<T = unknown> {
  readonly event: BusEvent<T>;
  readonly payload: T;
}

/**
 * Batched publish. Validates every payload against its event schema first
 * (fail-fast, no partial publish), then invokes all handlers in publication
 * order. Mirrors the "commit all events in a single transaction before
 * notifying subscribers" semantics from the upstream kilocode
 * `event-batch.ts` module without requiring Alexi to depend on Effect-TS
 * or a durable event store — Alexi's bus is synchronous and in-memory.
 *
 * Preferred when a caller emits many related events (e.g. draining a
 * session fork) because it avoids interleaving handler side effects
 * between events and keeps subscriber observations consistent.
 *
 * Handler errors are caught per-entry and logged so a single bad
 * subscriber cannot abort the rest of the batch.
 */
export function publishAll(entries: readonly BatchEntry[]): void {
  // Phase 1: validate every entry up-front. Zod's `parse` throws on
  // invalid payloads, which we intentionally propagate so callers see the
  // failure before any handler has been invoked.
  const validated: Array<{ event: BusEvent<unknown>; payload: unknown }> = [];
  for (const entry of entries) {
    const parsed = entry.event.schema.parse(entry.payload);
    validated.push({ event: entry.event, payload: parsed });
  }

  // Phase 2: fan out to handlers. A snapshot is taken per event so a
  // handler that unsubscribes another handler during iteration cannot
  // observe a mutating set.
  for (const { event, payload } of validated) {
    const handlers = eventHandlers.get(event.name);
    if (!handlers) {
      continue;
    }
    const snapshot = Array.from(handlers);
    for (const handler of snapshot) {
      try {
        handler(payload);
      } catch (err) {
        console.error(`Error in event handler for ${event.name}:`, err);
      }
    }
  }
}

/**
 * Async variant of {@link publishAll}. Same fail-fast validation, but
 * awaits every handler so async subscribers finish before the caller
 * continues. Handlers run sequentially per entry (Promise.all across
 * subscribers) and entries are processed in publication order.
 */
export async function publishAllAsync(entries: readonly BatchEntry[]): Promise<void> {
  const validated: Array<{ event: BusEvent<unknown>; payload: unknown }> = [];
  for (const entry of entries) {
    const parsed = entry.event.schema.parse(entry.payload);
    validated.push({ event: entry.event, payload: parsed });
  }

  for (const { event, payload } of validated) {
    const handlers = eventHandlers.get(event.name);
    if (!handlers) {
      continue;
    }
    const snapshot = Array.from(handlers);
    await Promise.all(
      snapshot.map(async (handler) => {
        try {
          await handler(payload);
        } catch (err) {
          console.error(`Error in async event handler for ${event.name}:`, err);
        }
      })
    );
  }
}
// Alexi_change end

/**
 * Wait for an event with optional timeout
 */
export function waitForEvent<T>(
  event: BusEvent<T>,
  predicate?: (payload: T) => boolean,
  timeoutMs?: number
): Promise<T> {
  return new Promise((resolve, reject) => {
    let timer: ReturnType<typeof setTimeout> | undefined;

    const unsub = event.subscribe((payload) => {
      if (!predicate || predicate(payload)) {
        if (timer) clearTimeout(timer);
        unsub();
        resolve(payload);
      }
    });

    if (timeoutMs) {
      timer = setTimeout(() => {
        unsub();
        reject(new Error(`Timeout waiting for event: ${event.name}`));
      }, timeoutMs);
    }
  });
}

/**
 * Clear all event handlers (useful for testing)
 */
export function clearAllHandlers(): void {
  eventHandlers.clear();
}

// ============ Pre-defined Core Events ============

// Tool execution events
export const ToolExecutionStarted = defineEvent(
  'tool.execution.started',
  z.object({
    toolName: z.string(),
    toolId: z.string(),
    parameters: z.record(z.string(), z.unknown()),
    timestamp: z.number(),
  })
);

export const ToolExecutionCompleted = defineEvent(
  'tool.execution.completed',
  z.object({
    toolName: z.string(),
    toolId: z.string(),
    result: z.unknown(),
    duration: z.number(),
    timestamp: z.number(),
  })
);

export const ToolExecutionFailed = defineEvent(
  'tool.execution.failed',
  z.object({
    toolName: z.string(),
    toolId: z.string(),
    error: z.string(),
    duration: z.number(),
    timestamp: z.number(),
  })
);

// Permission events
export const PermissionRequested = defineEvent(
  'permission.requested',
  z.object({
    id: z.string(),
    toolName: z.string(),
    action: z.enum(['read', 'write', 'execute', 'network', 'admin']),
    resource: z.string(),
    description: z.string(),
    timestamp: z.number(),
    metadata: z.record(z.string(), z.unknown()).optional(),
  })
);

export const PermissionResponse = defineEvent(
  'permission.response',
  z.object({
    id: z.string(),
    granted: z.boolean(),
    remember: z.boolean().optional(),
    timestamp: z.number(),
  })
);

// Agent events
export const AgentSwitched = defineEvent(
  'agent.switched',
  z.object({
    from: z.string().optional(),
    to: z.string(),
    reason: z.string().optional(),
    timestamp: z.number(),
  })
);

export const AgentThinking = defineEvent(
  'agent.thinking',
  z.object({
    agentId: z.string(),
    content: z.string(),
    timestamp: z.number(),
  })
);

// Chat/Message events
export const MessageReceived = defineEvent(
  'message.received',
  z.object({
    sessionId: z.string().optional(),
    role: z.enum(['user', 'assistant', 'system']),
    content: z.string(),
    timestamp: z.number(),
  })
);

export const MessageSent = defineEvent(
  'message.sent',
  z.object({
    sessionId: z.string().optional(),
    role: z.enum(['user', 'assistant', 'system']),
    content: z.string(),
    timestamp: z.number(),
  })
);

export const StreamChunkReceived = defineEvent(
  'stream.chunk',
  z.object({
    text: z.string(),
    isFirst: z.boolean(),
    isLast: z.boolean(),
    timestamp: z.number(),
  })
);

// Session events
export const SessionCreated = defineEvent(
  'session.created',
  z.object({
    sessionId: z.string(),
    modelId: z.string().optional(),
    timestamp: z.number(),
  })
);

export const SessionLoaded = defineEvent(
  'session.loaded',
  z.object({
    sessionId: z.string(),
    messageCount: z.number(),
    timestamp: z.number(),
  })
);

export const SessionEnded = defineEvent(
  'session.ended',
  z.object({
    sessionId: z.string(),
    timestamp: z.number(),
  })
);

// Provider events
export const ProviderModelFellBack = defineEvent(
  'provider.modelFellBack',
  z.object({
    requestedModel: z.string(),
    effectiveModel: z.string(),
    timestamp: z.number(),
  })
);

/**
 * Emitted when a provider access token was refreshed successfully via
 * the OAuth refresh-token flow. Consumers use it for telemetry and to
 * log a single "token refreshed" line in the CLI. The event carries the
 * new expiry as a Unix epoch millisecond timestamp so consumers can
 * derive the token TTL without re-reading the connector store.
 */
export const TokenRefreshed = defineEvent(
  'provider.tokenRefreshed',
  z.object({
    providerId: z.string(),
    expiry: z.number(),
    timestamp: z.number(),
  })
);

// Compaction events
export const CompactionStarted = defineEvent(
  'compaction.started',
  z.object({
    sessionId: z.string().optional(),
    messageCount: z.number(),
    estimatedTokens: z.number().optional(),
    trigger: z.enum(['auto', 'manual', 'partial']).optional(),
    timestamp: z.number(),
  })
);

export const CompactionComplete = defineEvent(
  'compaction.complete',
  z.object({
    sessionId: z.string().optional(),
    originalMessages: z.number(),
    compactedMessages: z.number(),
    estimatedTokensSaved: z.number(),
    durationMs: z.number(),
    trigger: z.enum(['auto', 'manual', 'partial']).optional(),
    error: z.string().optional(),
    timestamp: z.number(),
  })
);

// Bash streaming events
/**
 * Incremental output chunk from a running bash / shell command. Emitted
 * from `src/tool/tools/bash.ts` on every stdout / stderr `data` event so
 * the TUI can render live command output before the process exits. The
 * final aggregated stdout / stderr are still returned in the normal
 * `ToolExecutionCompleted` payload; consumers who don't care about live
 * output can ignore this event entirely without changing behaviour.
 *
 * `toolId` matches the id used by `ToolExecutionStarted` / `Completed`
 * so consumers can correlate chunks to a specific in-flight tool call.
 * `logId` matches the id stored in the command-log registry (see
 * `src/tool/tools/bash-streaming.ts`) and survives PID reuse.
 */
export const BashOutputChunk = defineEvent(
  'bash.output.chunk',
  z.object({
    toolId: z.string(),
    logId: z.string(),
    stream: z.enum(['stdout', 'stderr']),
    chunk: z.string(),
    timestamp: z.number(),
  })
);

// Image generation events
export const ImageGenerationChunk = defineEvent(
  'image.generation.chunk',
  z.object({
    model: z.string(),
    /** Sequence index of the image within the current call (0-based). */
    index: z.number(),
    /** Payload discriminator: hosted URL or base64-encoded blob. */
    kind: z.enum(['url', 'base64']),
    /** Reported MIME type, when the provider surfaced one. */
    mimeType: z.string().optional(),
    /** Byte length of the decoded payload, when known (base64 only). */
    sizeBytes: z.number().optional(),
    timestamp: z.number(),
  })
);

// Error events
export const ErrorOccurred = defineEvent(
  'error.occurred',
  z.object({
    source: z.string(),
    message: z.string(),
    stack: z.string().optional(),
    timestamp: z.number(),
  })
);
