import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock dependencies before importing the module
vi.mock('../src/providers/index.js', () => ({
  getProviderForModel: vi.fn(),
  getDefaultModel: vi.fn(),
}));

vi.mock('../src/core/router.js', () => ({
  routePrompt: vi.fn(),
}));

// Import after mocking
import { sendChat } from '../src/core/orchestrator.js';
import { getProviderForModel, getDefaultModel } from '../src/providers/index.js';
import { routePrompt } from '../src/core/router.js';
import { SessionManager } from '../src/core/sessionManager.js';

// Helper to create mock provider
function createMockProvider(response: { text: string; usage?: Record<string, number> }) {
  return {
    complete: vi.fn().mockResolvedValue(response),
  };
}

describe('Orchestrator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default mock for getDefaultModel
    vi.mocked(getDefaultModel).mockReturnValue('gpt-4o');
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('sendChat', () => {
    describe('model selection', () => {
      it('should use default model when no override provided', async () => {
        const mockProvider = createMockProvider({
          text: 'Hello!',
          usage: { prompt_tokens: 10, completion_tokens: 5 },
        });

        vi.mocked(getProviderForModel).mockReturnValue(mockProvider as any);

        const result = await sendChat('Hello');

        expect(result.text).toBe('Hello!');
        expect(result.modelUsed).toBe('gpt-4o');
        expect(getProviderForModel).toHaveBeenCalledWith('gpt-4o');
      });

      it('should use modelOverride when provided', async () => {
        const mockProvider = createMockProvider({
          text: 'Response from claude',
          usage: { prompt_tokens: 10, completion_tokens: 5 },
        });

        vi.mocked(getProviderForModel).mockReturnValue(mockProvider as any);

        const result = await sendChat('Hello', {
          modelOverride: 'anthropic--claude-4-sonnet',
        });

        expect(result.modelUsed).toBe('anthropic--claude-4-sonnet');
        expect(getProviderForModel).toHaveBeenCalledWith('anthropic--claude-4-sonnet');
      });

      it('should use auto-routing when enabled', async () => {
        const mockProvider = createMockProvider({
          text: 'Routed response',
          usage: { prompt_tokens: 10, completion_tokens: 5 },
        });

        vi.mocked(getProviderForModel).mockReturnValue(mockProvider as any);

        vi.mocked(routePrompt).mockReturnValue({
          modelId: 'anthropic--claude-4-opus',
          reason: 'Complex task detected',
          confidence: 0.9,
        });

        const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

        const result = await sendChat('Explain quantum computing step by step', {
          autoRoute: true,
        });

        expect(routePrompt).toHaveBeenCalledWith('Explain quantum computing step by step', {
          preferCheap: undefined,
        });
        expect(result.modelUsed).toBe('anthropic--claude-4-opus');
        expect(result.routingReason).toBe('Complex task detected');
        expect(consoleSpy).toHaveBeenCalled();

        consoleSpy.mockRestore();
      });

      it('should ignore auto-routing when modelOverride is provided', async () => {
        const mockProvider = createMockProvider({
          text: 'Response',
          usage: { prompt_tokens: 10, completion_tokens: 5 },
        });

        vi.mocked(getProviderForModel).mockReturnValue(mockProvider as any);

        await sendChat('Hello', {
          autoRoute: true,
          modelOverride: 'gpt-4o',
        });

        expect(routePrompt).not.toHaveBeenCalled();
        expect(getProviderForModel).toHaveBeenCalledWith('gpt-4o');
      });
    });

    describe('provider handling', () => {
      it('should call provider.complete with correct parameters', async () => {
        const mockProvider = createMockProvider({
          text: 'Provider response',
          usage: { prompt_tokens: 15, completion_tokens: 20 },
        });

        vi.mocked(getProviderForModel).mockReturnValue(mockProvider as any);

        const result = await sendChat('Test message');

        expect(mockProvider.complete).toHaveBeenCalledWith(
          [{ role: 'user', content: 'Test message' }],
          { maxTokens: 4096 }
        );
        expect(result.text).toBe('Provider response');
        expect(result.usage).toEqual({ prompt_tokens: 15, completion_tokens: 20 });
      });

      it('should handle provider without usage data', async () => {
        const mockProvider = createMockProvider({
          text: 'Response without usage',
        });

        vi.mocked(getProviderForModel).mockReturnValue(mockProvider as any);

        const result = await sendChat('Test');

        expect(result.text).toBe('Response without usage');
        expect(result.usage).toBeUndefined();
      });
    });

    describe('system prompt handling', () => {
      it('should include system prompt in messages', async () => {
        const mockProvider = createMockProvider({
          text: 'Response',
          usage: {},
        });

        vi.mocked(getProviderForModel).mockReturnValue(mockProvider as any);

        await sendChat('Hello', {
          systemPrompt: 'You are a helpful assistant',
        });

        expect(mockProvider.complete).toHaveBeenCalledWith(
          [
            { role: 'system', content: 'You are a helpful assistant' },
            { role: 'user', content: 'Hello' },
          ],
          { maxTokens: 4096 }
        );
      });
    });

    describe('session management', () => {
      it('should create session if not exists', async () => {
        const mockProvider = createMockProvider({
          text: 'Response',
          usage: { prompt_tokens: 10, completion_tokens: 5 },
        });

        vi.mocked(getProviderForModel).mockReturnValue(mockProvider as any);

        const sessionManager = new SessionManager();

        await sendChat('Hello', { sessionManager });

        expect(sessionManager.getCurrentSession()).not.toBeNull();
      });

      it('should add messages to session history', async () => {
        const mockProvider = createMockProvider({
          text: 'AI Response',
          usage: { prompt_tokens: 10, completion_tokens: 5 },
        });

        vi.mocked(getProviderForModel).mockReturnValue(mockProvider as any);

        const sessionManager = new SessionManager();

        await sendChat('User message', { sessionManager });

        const history = sessionManager.getHistory();
        expect(history).toHaveLength(2);
        expect(history[0].role).toBe('user');
        expect(history[0].content).toBe('User message');
        expect(history[1].role).toBe('assistant');
        expect(history[1].content).toBe('AI Response');
      });

      it('should include conversation history in subsequent messages', async () => {
        const mockProvider = createMockProvider({
          text: 'Response',
          usage: { prompt_tokens: 10, completion_tokens: 5 },
        });

        vi.mocked(getProviderForModel).mockReturnValue(mockProvider as any);

        const sessionManager = new SessionManager();

        // First message
        await sendChat('First message', { sessionManager });

        // Second message
        await sendChat('Second message', { sessionManager });

        // Check that second call included history
        const secondCallArgs = mockProvider.complete.mock.calls[1][0];
        expect(secondCallArgs).toHaveLength(3); // user1 + assistant1 + user2
      });
    });

    describe('response format', () => {
      it('should return correct response structure', async () => {
        const mockProvider = createMockProvider({
          text: 'Response text',
          usage: { prompt_tokens: 10, completion_tokens: 20 },
        });

        vi.mocked(getProviderForModel).mockReturnValue(mockProvider as any);

        const result = await sendChat('Test');

        expect(result).toHaveProperty('text');
        expect(result).toHaveProperty('usage');
        expect(result).toHaveProperty('modelUsed');
        expect(result.text).toBe('Response text');
        expect(result.modelUsed).toBe('gpt-4o');
      });

      it('should include routingReason when auto-routing is used', async () => {
        const mockProvider = createMockProvider({
          text: 'Response',
          usage: {},
        });

        vi.mocked(getProviderForModel).mockReturnValue(mockProvider as any);

        vi.mocked(routePrompt).mockReturnValue({
          modelId: 'routed-model',
          reason: 'Routing reason',
          confidence: 0.8,
        });

        vi.spyOn(console, 'log').mockImplementation(() => {});

        const result = await sendChat('Test', { autoRoute: true });

        expect(result.routingReason).toBe('Routing reason');
      });

      it('should not include routingReason when auto-routing is not used', async () => {
        const mockProvider = createMockProvider({
          text: 'Response',
          usage: {},
        });

        vi.mocked(getProviderForModel).mockReturnValue(mockProvider as any);

        const result = await sendChat('Test');

        expect(result.routingReason).toBeUndefined();
      });
    });
  });
});
