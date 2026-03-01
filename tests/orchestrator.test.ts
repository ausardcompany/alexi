import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock dependencies before importing the module
vi.mock('../src/providers/index.js', () => ({
  getProviderForModel: vi.fn(),
}));

vi.mock('../src/config/env.js', () => ({
  env: vi.fn(),
}));

vi.mock('../src/core/router.js', () => ({
  routePrompt: vi.fn(),
}));

// Import after mocking
import { sendChat } from '../src/core/orchestrator.js';
import { getProviderForModel } from '../src/providers/index.js';
import { env } from '../src/config/env.js';
import { routePrompt } from '../src/core/router.js';
import { SessionManager } from '../src/core/sessionManager.js';

describe('Orchestrator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('sendChat', () => {
    describe('model selection', () => {
      it('should use default model when no override provided', async () => {
        const mockSdk = {
          complete: vi.fn().mockResolvedValue({
            text: 'Hello!',
            usage: { inputTokens: 10, outputTokens: 5 },
          }),
        };

        vi.mocked(getProviderForModel).mockReturnValue({
          type: 'anthropic',
          sdk: mockSdk,
        });

        vi.mocked(env).mockImplementation((key: string) => {
          if (key === 'SAP_PROXY_MODEL') return 'gpt-4o';
          return undefined;
        });

        const result = await sendChat('Hello');

        expect(result.text).toBe('Hello!');
        expect(result.modelUsed).toBe('gpt-4o');
        expect(getProviderForModel).toHaveBeenCalledWith('gpt-4o');
      });

      it('should use modelOverride when provided', async () => {
        const mockSdk = {
          complete: vi.fn().mockResolvedValue({
            text: 'Response from claude',
            usage: { inputTokens: 10, outputTokens: 5 },
          }),
        };

        vi.mocked(getProviderForModel).mockReturnValue({
          type: 'anthropic',
          sdk: mockSdk,
        });

        vi.mocked(env).mockReturnValue(undefined);

        const result = await sendChat('Hello', {
          modelOverride: 'anthropic--claude-4-sonnet',
        });

        expect(result.modelUsed).toBe('anthropic--claude-4-sonnet');
        expect(getProviderForModel).toHaveBeenCalledWith('anthropic--claude-4-sonnet');
      });

      it('should use auto-routing when enabled', async () => {
        const mockSdk = {
          complete: vi.fn().mockResolvedValue({
            text: 'Routed response',
            usage: { inputTokens: 10, outputTokens: 5 },
          }),
        };

        vi.mocked(getProviderForModel).mockReturnValue({
          type: 'anthropic',
          sdk: mockSdk,
        });

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
        const mockSdk = {
          complete: vi.fn().mockResolvedValue({
            text: 'Response',
            usage: { inputTokens: 10, outputTokens: 5 },
          }),
        };

        vi.mocked(getProviderForModel).mockReturnValue({
          type: 'anthropic',
          sdk: mockSdk,
        });

        await sendChat('Hello', {
          autoRoute: true,
          modelOverride: 'gpt-4o',
        });

        expect(routePrompt).not.toHaveBeenCalled();
        expect(getProviderForModel).toHaveBeenCalledWith('gpt-4o');
      });
    });

    describe('provider handling', () => {
      it('should handle anthropic provider correctly', async () => {
        const mockSdk = {
          complete: vi.fn().mockResolvedValue({
            text: 'Anthropic response',
            usage: { inputTokens: 15, outputTokens: 20 },
          }),
        };

        vi.mocked(getProviderForModel).mockReturnValue({
          type: 'anthropic',
          sdk: mockSdk,
        });

        vi.mocked(env).mockReturnValue('test-model');

        const result = await sendChat('Test message');

        expect(mockSdk.complete).toHaveBeenCalledWith(
          [{ role: 'user', content: 'Test message' }],
          { maxTokens: 4096 }
        );
        expect(result.text).toBe('Anthropic response');
        expect(result.usage).toEqual({ inputTokens: 15, outputTokens: 20 });
      });

      it('should handle claude-native provider correctly', async () => {
        const mockSdk = {
          complete: vi.fn().mockResolvedValue({
            text: 'Claude native response',
            usage: { inputTokens: 10, outputTokens: 15 },
          }),
        };

        vi.mocked(getProviderForModel).mockReturnValue({
          type: 'claude-native',
          sdk: mockSdk,
        });

        vi.mocked(env).mockReturnValue('claude-model');

        const result = await sendChat('Test');

        expect(result.text).toBe('Claude native response');
      });

      it('should handle proxy provider with fetch', async () => {
        const mockFetch = vi.fn().mockResolvedValue({
          ok: true,
          json: () =>
            Promise.resolve({
              choices: [{ message: { content: 'Proxy response' } }],
              usage: { prompt_tokens: 10, completion_tokens: 20 },
            }),
        });

        global.fetch = mockFetch;

        vi.mocked(getProviderForModel).mockReturnValue({
          type: 'proxy',
          sdk: null,
        });

        vi.mocked(env).mockImplementation((key: string) => {
          if (key === 'SAP_PROXY_BASE_URL') return 'https://api.example.com/';
          if (key === 'SAP_PROXY_API_KEY') return 'test-api-key';
          if (key === 'SAP_PROXY_MODEL') return 'gpt-4o';
          return undefined;
        });

        const result = await sendChat('Test proxy');

        expect(mockFetch).toHaveBeenCalledWith(
          'https://api.example.com/chat/completions',
          expect.objectContaining({
            method: 'POST',
            headers: {
              Authorization: 'Bearer test-api-key',
              'Content-Type': 'application/json',
            },
          })
        );
        expect(result.text).toBe('Proxy response');
      });

      it('should throw error when proxy request fails', async () => {
        const mockFetch = vi.fn().mockResolvedValue({
          ok: false,
          status: 500,
          statusText: 'Internal Server Error',
        });

        global.fetch = mockFetch;

        vi.mocked(getProviderForModel).mockReturnValue({
          type: 'proxy',
          sdk: null,
        });

        vi.mocked(env).mockImplementation((key: string) => {
          if (key === 'SAP_PROXY_BASE_URL') return 'https://api.example.com/';
          if (key === 'SAP_PROXY_API_KEY') return 'test-api-key';
          if (key === 'SAP_PROXY_MODEL') return 'gpt-4o';
          return undefined;
        });

        await expect(sendChat('Test')).rejects.toThrow(
          'Proxy completion failed: 500 Internal Server Error'
        );
      });
    });

    describe('system prompt handling', () => {
      it('should include system prompt in messages', async () => {
        const mockSdk = {
          complete: vi.fn().mockResolvedValue({
            text: 'Response',
            usage: {},
          }),
        };

        vi.mocked(getProviderForModel).mockReturnValue({
          type: 'anthropic',
          sdk: mockSdk,
        });

        vi.mocked(env).mockReturnValue('model');

        await sendChat('Hello', {
          systemPrompt: 'You are a helpful assistant',
        });

        expect(mockSdk.complete).toHaveBeenCalledWith(
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
        const mockSdk = {
          complete: vi.fn().mockResolvedValue({
            text: 'Response',
            usage: { inputTokens: 10, outputTokens: 5 },
          }),
        };

        vi.mocked(getProviderForModel).mockReturnValue({
          type: 'anthropic',
          sdk: mockSdk,
        });

        vi.mocked(env).mockReturnValue('test-model');

        const sessionManager = new SessionManager();

        await sendChat('Hello', { sessionManager });

        expect(sessionManager.getCurrentSession()).not.toBeNull();
      });

      it('should add messages to session history', async () => {
        const mockSdk = {
          complete: vi.fn().mockResolvedValue({
            text: 'AI Response',
            usage: { inputTokens: 10, outputTokens: 5 },
          }),
        };

        vi.mocked(getProviderForModel).mockReturnValue({
          type: 'anthropic',
          sdk: mockSdk,
        });

        vi.mocked(env).mockReturnValue('test-model');

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
        const mockSdk = {
          complete: vi.fn().mockResolvedValue({
            text: 'Response',
            usage: { inputTokens: 10, outputTokens: 5 },
          }),
        };

        vi.mocked(getProviderForModel).mockReturnValue({
          type: 'anthropic',
          sdk: mockSdk,
        });

        vi.mocked(env).mockReturnValue('test-model');

        const sessionManager = new SessionManager();

        // First message
        await sendChat('First message', { sessionManager });

        // Second message
        await sendChat('Second message', { sessionManager });

        // Check that second call included history
        const secondCallArgs = mockSdk.complete.mock.calls[1][0];
        expect(secondCallArgs).toHaveLength(3); // user1 + assistant1 + user2
      });
    });

    describe('response format', () => {
      it('should return correct response structure', async () => {
        const mockSdk = {
          complete: vi.fn().mockResolvedValue({
            text: 'Response text',
            usage: { inputTokens: 10, outputTokens: 20 },
          }),
        };

        vi.mocked(getProviderForModel).mockReturnValue({
          type: 'anthropic',
          sdk: mockSdk,
        });

        vi.mocked(env).mockReturnValue('my-model');

        const result = await sendChat('Test');

        expect(result).toHaveProperty('text');
        expect(result).toHaveProperty('usage');
        expect(result).toHaveProperty('modelUsed');
        expect(result.text).toBe('Response text');
        expect(result.modelUsed).toBe('my-model');
      });

      it('should include routingReason when auto-routing is used', async () => {
        const mockSdk = {
          complete: vi.fn().mockResolvedValue({
            text: 'Response',
            usage: {},
          }),
        };

        vi.mocked(getProviderForModel).mockReturnValue({
          type: 'anthropic',
          sdk: mockSdk,
        });

        vi.mocked(routePrompt).mockReturnValue({
          modelId: 'routed-model',
          reason: 'Routing reason',
          confidence: 0.8,
        });

        vi.spyOn(console, 'log').mockImplementation(() => {});

        const result = await sendChat('Test', { autoRoute: true });

        expect(result.routingReason).toBe('Routing reason');
      });
    });
  });
});
