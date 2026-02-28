/**
 * Event Bus System
 * Type-safe event emitter pattern inspired by kilocode/opencode
 * Features: typed events, subscriptions, async handlers
 */
import { z } from "zod";
// Internal event registry
const eventHandlers = new Map();
const eventSchemas = new Map();
/**
 * Define a typed event with Zod schema validation
 */
export function defineEvent(name, schema) {
    eventSchemas.set(name, schema);
    return {
        name,
        schema,
        publish(payload) {
            // Validate payload
            const parsed = schema.parse(payload);
            const handlers = eventHandlers.get(name);
            if (handlers) {
                for (const handler of handlers) {
                    try {
                        handler(parsed);
                    }
                    catch (err) {
                        console.error(`Error in event handler for ${name}:`, err);
                    }
                }
            }
        },
        async publishAsync(payload) {
            const parsed = schema.parse(payload);
            const handlers = eventHandlers.get(name);
            if (handlers) {
                await Promise.all(Array.from(handlers).map(async (handler) => {
                    try {
                        await handler(parsed);
                    }
                    catch (err) {
                        console.error(`Error in async event handler for ${name}:`, err);
                    }
                }));
            }
        },
        subscribe(handler) {
            if (!eventHandlers.has(name)) {
                eventHandlers.set(name, new Set());
            }
            eventHandlers.get(name).add(handler);
            return () => {
                eventHandlers.get(name)?.delete(handler);
            };
        },
        once(handler) {
            const wrappedHandler = (payload) => {
                unsub();
                handler(payload);
            };
            const unsub = this.subscribe(wrappedHandler);
            return unsub;
        },
    };
}
/**
 * Wait for an event with optional timeout
 */
export function waitForEvent(event, predicate, timeoutMs) {
    return new Promise((resolve, reject) => {
        let timer;
        const unsub = event.subscribe((payload) => {
            if (!predicate || predicate(payload)) {
                if (timer)
                    clearTimeout(timer);
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
export function clearAllHandlers() {
    eventHandlers.clear();
}
// ============ Pre-defined Core Events ============
// Tool execution events
export const ToolExecutionStarted = defineEvent("tool.execution.started", z.object({
    toolName: z.string(),
    toolId: z.string(),
    parameters: z.record(z.string(), z.unknown()),
    timestamp: z.number(),
}));
export const ToolExecutionCompleted = defineEvent("tool.execution.completed", z.object({
    toolName: z.string(),
    toolId: z.string(),
    result: z.unknown(),
    duration: z.number(),
    timestamp: z.number(),
}));
export const ToolExecutionFailed = defineEvent("tool.execution.failed", z.object({
    toolName: z.string(),
    toolId: z.string(),
    error: z.string(),
    duration: z.number(),
    timestamp: z.number(),
}));
// Permission events
export const PermissionRequested = defineEvent("permission.requested", z.object({
    id: z.string(),
    toolName: z.string(),
    action: z.enum(["read", "write", "execute", "network", "admin"]),
    resource: z.string(),
    description: z.string(),
    timestamp: z.number(),
}));
export const PermissionResponse = defineEvent("permission.response", z.object({
    id: z.string(),
    granted: z.boolean(),
    remember: z.boolean().optional(),
    timestamp: z.number(),
}));
// Agent events
export const AgentSwitched = defineEvent("agent.switched", z.object({
    from: z.string().optional(),
    to: z.string(),
    reason: z.string().optional(),
    timestamp: z.number(),
}));
export const AgentThinking = defineEvent("agent.thinking", z.object({
    agentId: z.string(),
    content: z.string(),
    timestamp: z.number(),
}));
// Chat/Message events
export const MessageReceived = defineEvent("message.received", z.object({
    sessionId: z.string().optional(),
    role: z.enum(["user", "assistant", "system"]),
    content: z.string(),
    timestamp: z.number(),
}));
export const MessageSent = defineEvent("message.sent", z.object({
    sessionId: z.string().optional(),
    role: z.enum(["user", "assistant", "system"]),
    content: z.string(),
    timestamp: z.number(),
}));
export const StreamChunkReceived = defineEvent("stream.chunk", z.object({
    text: z.string(),
    isFirst: z.boolean(),
    isLast: z.boolean(),
    timestamp: z.number(),
}));
// Session events
export const SessionCreated = defineEvent("session.created", z.object({
    sessionId: z.string(),
    modelId: z.string().optional(),
    timestamp: z.number(),
}));
export const SessionLoaded = defineEvent("session.loaded", z.object({
    sessionId: z.string(),
    messageCount: z.number(),
    timestamp: z.number(),
}));
export const SessionEnded = defineEvent("session.ended", z.object({
    sessionId: z.string(),
    timestamp: z.number(),
}));
// Error events
export const ErrorOccurred = defineEvent("error.occurred", z.object({
    source: z.string(),
    message: z.string(),
    stack: z.string().optional(),
    timestamp: z.number(),
}));
