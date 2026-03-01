/**
 * HTTP Server with SSE support using Hono
 * Provides REST API for chat completions and real-time streaming
 */

import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { streamSSE } from 'hono/streaming';
import { serve } from '@hono/node-server';
import { nanoid } from 'nanoid';
import { z } from 'zod';
import { streamChat, type StreamingOptions } from '../core/streamingOrchestrator.js';
import { SessionManager } from '../core/sessionManager.js';
import { getToolRegistry, type ToolContext } from '../tool/index.js';
import { registerBuiltInTools } from '../tool/tools/index.js';
import { getAgentRegistry, switchAgent, parseAgentMention } from '../agent/index.js';
import {
  MessageReceived,
  MessageSent,
  SessionCreated,
  SessionEnded,
  ErrorOccurred,
} from '../bus/index.js';

// Request schemas
const ChatRequestSchema = z.object({
  message: z.string(),
  sessionId: z.string().optional(),
  model: z.string().optional(),
  stream: z.boolean().default(true),
  maxTokens: z.number().optional(),
  temperature: z.number().optional(),
  systemPrompt: z.string().optional(),
});

const ToolExecuteRequestSchema = z.object({
  parameters: z.record(z.string(), z.unknown()),
  sessionId: z.string().optional(),
});

// Session store
const sessions = new Map<
  string,
  {
    manager: SessionManager;
    createdAt: number;
    lastActivity: number;
  }
>();

// Server state
let serverInstance: ReturnType<typeof serve> | null = null;
let workdir = process.cwd();

/**
 * Get or create a session
 */
function getOrCreateSession(sessionId?: string): { id: string; manager: SessionManager } {
  const id = sessionId || nanoid();

  if (!sessions.has(id)) {
    const manager = new SessionManager();
    manager.createSession('default');
    sessions.set(id, {
      manager,
      createdAt: Date.now(),
      lastActivity: Date.now(),
    });

    SessionCreated.publish({
      sessionId: id,
      timestamp: Date.now(),
    });
  }

  const session = sessions.get(id)!;
  session.lastActivity = Date.now();

  return { id, manager: session.manager };
}

/**
 * Create the Hono app
 */
export function createApp() {
  const app = new Hono();

  // Middleware
  app.use('*', cors());
  app.use('*', logger());

  // Health check
  app.get('/health', (c) => {
    return c.json({
      status: 'ok',
      timestamp: Date.now(),
      sessions: sessions.size,
    });
  });

  // List available models (stub - would need provider integration)
  app.get('/models', (c) => {
    return c.json({
      models: [
        { id: 'gpt-4o', provider: 'openai' },
        { id: 'gpt-4o-mini', provider: 'openai' },
        { id: 'claude-3-5-sonnet', provider: 'anthropic' },
        { id: 'claude-3-opus', provider: 'anthropic' },
      ],
    });
  });

  // List available tools
  app.get('/tools', (c) => {
    const registry = getToolRegistry();
    const schemas = registry.getSchemas();
    return c.json({ tools: schemas });
  });

  // List available agents
  app.get('/agents', (c) => {
    const registry = getAgentRegistry();
    const agents = registry.list().map((a) => ({
      id: a.id,
      name: a.name,
      description: a.description,
      tools: a.tools,
    }));
    return c.json({ agents });
  });

  // Get session info
  app.get('/sessions/:id', (c) => {
    const id = c.req.param('id');
    const session = sessions.get(id);

    if (!session) {
      return c.json({ error: 'Session not found' }, 404);
    }

    return c.json({
      id,
      createdAt: session.createdAt,
      lastActivity: session.lastActivity,
      messageCount: session.manager.getHistory().length,
    });
  });

  // List all sessions
  app.get('/sessions', (c) => {
    const list = Array.from(sessions.entries()).map(([id, s]) => ({
      id,
      createdAt: s.createdAt,
      lastActivity: s.lastActivity,
      messageCount: s.manager.getHistory().length,
    }));
    return c.json({ sessions: list });
  });

  // Create new session
  app.post('/sessions', (c) => {
    const { id, manager: _manager } = getOrCreateSession();
    return c.json({
      id,
      createdAt: Date.now(),
    });
  });

  // Delete session
  app.delete('/sessions/:id', (c) => {
    const id = c.req.param('id');

    if (!sessions.has(id)) {
      return c.json({ error: 'Session not found' }, 404);
    }

    sessions.delete(id);

    SessionEnded.publish({
      sessionId: id,
      timestamp: Date.now(),
    });

    return c.json({ success: true });
  });

  // Chat completion (non-streaming)
  app.post('/chat', async (c) => {
    try {
      const body = await c.req.json();
      const request = ChatRequestSchema.parse(body);

      // Check for agent switch
      const { agentId, cleanMessage } = parseAgentMention(request.message);
      if (agentId) {
        switchAgent(agentId);
      }

      const { id, manager } = getOrCreateSession(request.sessionId);

      MessageReceived.publish({
        sessionId: id,
        role: 'user',
        content: cleanMessage,
        timestamp: Date.now(),
      });

      if (request.stream) {
        // Return SSE stream
        return streamSSE(c, async (stream) => {
          const options: StreamingOptions = {
            sessionManager: manager,
            modelOverride: request.model,
            systemPrompt: request.systemPrompt,
            maxTokens: request.maxTokens,
            temperature: request.temperature,
          };

          let fullText = '';

          for await (const chunk of streamChat(cleanMessage, options)) {
            fullText += chunk.text;
            await stream.writeSSE({
              event: 'chunk',
              data: JSON.stringify({
                text: chunk.text,
                usage: chunk.usage,
              }),
            });
          }

          MessageSent.publish({
            sessionId: id,
            role: 'assistant',
            content: fullText,
            timestamp: Date.now(),
          });

          await stream.writeSSE({
            event: 'done',
            data: JSON.stringify({
              sessionId: id,
              text: fullText,
            }),
          });
        });
      } else {
        // Non-streaming response
        const options: StreamingOptions = {
          sessionManager: manager,
          modelOverride: request.model,
          systemPrompt: request.systemPrompt,
          maxTokens: request.maxTokens,
          temperature: request.temperature,
        };

        const result: { text: string; usage?: any; modelUsed: string } = {
          text: '',
          modelUsed: request.model || 'default',
        };

        for await (const chunk of streamChat(cleanMessage, options)) {
          result.text += chunk.text;
          if (chunk.usage) result.usage = chunk.usage;
        }

        MessageSent.publish({
          sessionId: id,
          role: 'assistant',
          content: result.text,
          timestamp: Date.now(),
        });

        return c.json({
          sessionId: id,
          message: result.text,
          model: result.modelUsed,
          usage: result.usage,
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);

      ErrorOccurred.publish({
        message: errorMessage,
        source: 'http-server',
        timestamp: Date.now(),
      });

      return c.json({ error: errorMessage }, 400);
    }
  });

  // Execute tool directly
  app.post('/tools/:name/execute', async (c) => {
    const name = c.req.param('name');

    try {
      const body = await c.req.json();
      const request = ToolExecuteRequestSchema.parse({ name, ...body });

      const registry = getToolRegistry();
      const tool = registry.get(name);

      if (!tool) {
        return c.json({ error: `Tool not found: ${name}` }, 404);
      }

      const context: ToolContext = {
        workdir,
        sessionId: request.sessionId,
      };

      const result = await tool.execute(request.parameters, context);

      return c.json(result);
    } catch (err) {
      const error = err instanceof Error ? err.message : String(err);
      return c.json({ success: false, error }, 400);
    }
  });

  // SSE endpoint for real-time events
  app.get('/events', (c) => {
    return streamSSE(c, async (stream) => {
      // Subscribe to bus events and forward to SSE
      const events = [MessageReceived, MessageSent, SessionCreated, SessionEnded, ErrorOccurred];

      const unsubscribers: (() => void)[] = [];

      for (const event of events) {
        const unsub = event.subscribe(async (data) => {
          await stream.writeSSE({
            event: event.name,
            data: JSON.stringify(data),
          });
        });
        unsubscribers.push(unsub);
      }

      // Keep connection alive with heartbeat
      const heartbeat = setInterval(async () => {
        try {
          await stream.writeSSE({
            event: 'heartbeat',
            data: JSON.stringify({ timestamp: Date.now() }),
          });
        } catch {
          clearInterval(heartbeat);
        }
      }, 30000);

      // Cleanup on disconnect
      c.req.raw.signal.addEventListener('abort', () => {
        clearInterval(heartbeat);
        unsubscribers.forEach((unsub) => unsub());
      });

      // Initial connection message
      await stream.writeSSE({
        event: 'connected',
        data: JSON.stringify({
          timestamp: Date.now(),
          message: 'Connected to event stream',
        }),
      });

      // Keep the stream open
      await new Promise(() => {});
    });
  });

  return app;
}

/**
 * Start the HTTP server
 */
export async function startServer(
  options: {
    port?: number;
    host?: string;
    workingDir?: string;
  } = {}
): Promise<{ port: number; host: string }> {
  const port = options.port || 3000;
  const host = options.host || '127.0.0.1';

  if (options.workingDir) {
    workdir = options.workingDir;
  }

  // Register built-in tools
  registerBuiltInTools();

  const app = createApp();

  serverInstance = serve({
    fetch: app.fetch,
    port,
    hostname: host,
  });

  console.log(`Server started on http://${host}:${port}`);

  return { port, host };
}

/**
 * Stop the HTTP server
 */
export async function stopServer(): Promise<void> {
  if (serverInstance) {
    serverInstance.close();
    serverInstance = null;
    console.log('Server stopped');
  }
}

/**
 * Get server status
 */
export function getServerStatus(): {
  running: boolean;
  sessions: number;
  uptime?: number;
} {
  return {
    running: serverInstance !== null,
    sessions: sessions.size,
  };
}

// Export types for direct usage
export type ChatRequest = z.infer<typeof ChatRequestSchema>;
export type ToolExecuteRequest = z.infer<typeof ToolExecuteRequestSchema>;
