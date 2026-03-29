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
      if (!eventHandlers.has(name)) {
        eventHandlers.set(name, new Set());
      }
      eventHandlers.get(name)!.add(handler);

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
