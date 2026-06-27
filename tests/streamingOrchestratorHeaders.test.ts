import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock dependencies before importing the module
vi.mock('../src/providers/index.js', () => {
  const getProviderForModel = vi.fn();
  return {
    getProviderForModel,
    // Delegate to getProviderForModel so existing tests that mock
    // getProviderForModel continue to work without modification.
    getProviderForModelWithFallback: vi.fn((modelId: string) => ({
      provider: getProviderForModel(modelId),
      effectiveModelId: modelId,
      usedFallback: false,
    })),
    getDefaultModel: vi.fn(),
  };
});

vi.mock('../src/core/router.js', () => ({
  routePrompt: vi.fn(),
  recordRouteOutcome: vi.fn(),
  classifyRouteError: vi.fn(() => ({ kind: 'unknown' })),
}));

// Import after mocking
import { streamChat } from '../src/core/streamingOrchestrator.js';
import { getProviderForModel, getDefaultModel } from '../src/providers/index.js';
import { SessionManager } from '../src/core/sessionManager.js';

// Helper to create a mock provider that captures options passed to streamComplete
function createMockStreamProvider(chunks: Array<{ text: string; usage?: Record<string, number> }>) {
  const streamCompleteFn = vi.fn().mockImplementation(function* () {
    for (const chunk of chunks) {
      yield chunk;
    }
  });

  return {
    streamComplete: streamCompleteFn,
  };
}

describe('Streaming Orchestrator - Agent Observability Headers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getDefaultModel).mockReturnValue('gpt-4o');
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should pass x-alexi-agent-id header when agentId is provided', async () => {
    const mockProvider = createMockStreamProvider([
      { text: 'Hello', usage: { prompt_tokens: 10, completion_tokens: 5, total_tokens: 15 } },
    ]);

    vi.mocked(getProviderForModel).mockReturnValue(mockProvider as any);

    const gen = streamChat('Test message', { agentId: 'code' });

    // Drain the generator
    let next = await gen.next();
    while (!next.done) {
      next = await gen.next();
    }
    const result = next.value;

    expect(result.modelUsed).toBe('gpt-4o');

    // Verify streamComplete was called with headers containing agent ID
    const callOptions = mockProvider.streamComplete.mock.calls[0][1];
    expect(callOptions.headers).toBeDefined();
    expect(callOptions.headers['x-alexi-agent-id']).toBe('code');
  });

  it('should use session ID for x-session-affinity when sessionManager is provided', async () => {
    const mockProvider = createMockStreamProvider([
      { text: 'Response', usage: { prompt_tokens: 5, completion_tokens: 3, total_tokens: 8 } },
    ]);

    vi.mocked(getProviderForModel).mockReturnValue(mockProvider as any);

    const sessionManager = new SessionManager();
    sessionManager.createSession('gpt-4o');
    const sessionId = sessionManager.getCurrentSession()?.metadata.id;

    const gen = streamChat('Test', { sessionManager, agentId: 'debug' });

    // Drain the generator
    let next = await gen.next();
    while (!next.done) {
      next = await gen.next();
    }

    const callOptions = mockProvider.streamComplete.mock.calls[0][1];
    expect(callOptions.headers['x-session-affinity']).toBe(sessionId);
    expect(callOptions.headers['x-alexi-agent-id']).toBe('debug');
  });

  it('should use "anonymous" for session affinity when no sessionManager is provided', async () => {
    const mockProvider = createMockStreamProvider([
      { text: 'Hi', usage: { prompt_tokens: 5, completion_tokens: 2, total_tokens: 7 } },
    ]);

    vi.mocked(getProviderForModel).mockReturnValue(mockProvider as any);

    const gen = streamChat('Test', { agentId: 'explore' });

    // Drain the generator
    let next = await gen.next();
    while (!next.done) {
      next = await gen.next();
    }

    const callOptions = mockProvider.streamComplete.mock.calls[0][1];
    expect(callOptions.headers['x-session-affinity']).toBe('anonymous');
    expect(callOptions.headers['x-alexi-agent-id']).toBe('explore');
  });

  it('should omit x-alexi-agent-id when agentId is not provided', async () => {
    const mockProvider = createMockStreamProvider([
      { text: 'Response', usage: { prompt_tokens: 5, completion_tokens: 3, total_tokens: 8 } },
    ]);

    vi.mocked(getProviderForModel).mockReturnValue(mockProvider as any);

    const gen = streamChat('Test');

    // Drain the generator
    let next = await gen.next();
    while (!next.done) {
      next = await gen.next();
    }

    const callOptions = mockProvider.streamComplete.mock.calls[0][1];
    // x-session-affinity should always be present
    expect(callOptions.headers['x-session-affinity']).toBe('anonymous');
    // agent-id should NOT be present when agentId is not passed
    expect(callOptions.headers['x-alexi-agent-id']).toBeUndefined();
  });

  it('should not include x-alexi-parent-agent-id (future enhancement)', async () => {
    const mockProvider = createMockStreamProvider([
      { text: 'Hi', usage: { prompt_tokens: 5, completion_tokens: 2, total_tokens: 7 } },
    ]);

    vi.mocked(getProviderForModel).mockReturnValue(mockProvider as any);

    const gen = streamChat('Test', { agentId: 'code' });

    // Drain the generator
    let next = await gen.next();
    while (!next.done) {
      next = await gen.next();
    }

    const callOptions = mockProvider.streamComplete.mock.calls[0][1];
    expect(callOptions.headers['x-alexi-parent-agent-id']).toBeUndefined();
  });
});
