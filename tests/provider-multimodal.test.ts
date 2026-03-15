/**
 * Tests for multimodal message pass-through in the SAP Orchestration provider.
 *
 * We test the public `complete()` method with mocked SDK clients to verify
 * that multimodal UserChatMessage objects are passed through correctly.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Track what messages are passed to chatCompletion
let capturedMessages: unknown[] = [];

// Mock the SAP AI SDK orchestration module
vi.mock('@sap-ai-sdk/orchestration', () => {
  // Use a class so it's new-able
  class MockOrchestrationClient {
    constructor(
      public _moduleConfig: unknown,
      public _deploymentConfig: unknown
    ) {}

    async chatCompletion(params: { messages: unknown[] }) {
      capturedMessages = params.messages;
      return {
        getContent: () => 'mock response',
        getFinishReason: () => 'stop',
        getTokenUsage: () => ({
          completion_tokens: 5,
          prompt_tokens: 10,
          total_tokens: 15,
        }),
        getToolCalls: () => [],
        getAllMessages: () => [...params.messages, { role: 'assistant', content: 'mock response' }],
        data: {
          orchestration_result: {
            choices: [
              {
                message: { role: 'assistant', content: 'mock response' },
              },
            ],
          },
          module_results: {},
        },
      };
    }

    async *stream(params: { messages: unknown[] }) {
      capturedMessages = params.messages;
      yield {
        getDelta: () => ({ content: 'mock' }),
        getFinishReason: () => 'stop',
        getTokenUsage: () => ({
          completion_tokens: 5,
          prompt_tokens: 10,
          total_tokens: 15,
        }),
      };
    }
  }

  return {
    OrchestrationClient: MockOrchestrationClient,
    OrchestrationEmbeddingClient: vi.fn(),
    buildAzureContentSafetyFilter: vi.fn().mockReturnValue({}),
    buildLlamaGuard38BFilter: vi.fn().mockReturnValue({}),
    buildDpiMaskingProvider: vi.fn().mockReturnValue({}),
    buildDocumentGroundingConfig: vi.fn().mockReturnValue({}),
    buildTranslationConfig: vi.fn().mockReturnValue({}),
  };
});

// Mock env
vi.mock('../src/config/env.js', () => ({
  env: vi.fn((key: string) => {
    if (key === 'AICORE_RESOURCE_GROUP') return 'default';
    return undefined;
  }),
}));

import { SapOrchestrationProvider } from '../src/providers/sapOrchestration.js';

describe('SapOrchestrationProvider multimodal support', () => {
  let provider: SapOrchestrationProvider;

  beforeEach(() => {
    vi.clearAllMocks();
    capturedMessages = [];
    provider = new SapOrchestrationProvider({
      modelName: 'gpt-4o',
      deploymentId: 'test-deployment',
    });
  });

  describe('complete() with multimodal messages', () => {
    it('should pass through a multimodal user message with image_url content', async () => {
      const multimodalMessage = {
        role: 'user',
        content: [
          {
            type: 'image_url',
            image_url: { url: 'data:image/png;base64,iVBOR...', detail: 'auto' },
          },
          { type: 'text', text: 'What is in this image?' },
        ],
      };

      const result = await provider.complete([multimodalMessage]);
      expect(result.text).toBe('mock response');

      // Verify the SDK received the multimodal message
      const userMsg = capturedMessages.find(
        (m: unknown) => (m as Record<string, unknown>).role === 'user'
      ) as Record<string, unknown>;

      expect(userMsg).toBeDefined();
      expect(Array.isArray(userMsg.content)).toBe(true);

      const content = userMsg.content as Array<Record<string, unknown>>;
      expect(content).toHaveLength(2);
      expect(content[0].type).toBe('image_url');
      expect(content[1].type).toBe('text');
    });

    it('should handle mixed text and multimodal messages', async () => {
      const messages = [
        { role: 'system', content: 'You are a helpful assistant.' },
        {
          role: 'user',
          content: [
            { type: 'image_url', image_url: { url: 'data:image/png;base64,abc' } },
            { type: 'text', text: 'Describe this' },
          ],
        },
      ];

      const result = await provider.complete(messages);
      expect(result.text).toBe('mock response');

      // System message should be plain string
      const sysMsg = capturedMessages.find(
        (m: unknown) => (m as Record<string, unknown>).role === 'system'
      ) as Record<string, unknown>;
      expect(typeof sysMsg.content).toBe('string');

      // User message should be array
      const userMsg = capturedMessages.find(
        (m: unknown) => (m as Record<string, unknown>).role === 'user'
      ) as Record<string, unknown>;
      expect(Array.isArray(userMsg.content)).toBe(true);
    });

    it('should not affect plain text messages (backward compat)', async () => {
      const messages = [{ role: 'user', content: 'Hello, how are you?' }];

      const result = await provider.complete(messages);
      expect(result.text).toBe('mock response');

      const userMsg = capturedMessages.find(
        (m: unknown) => (m as Record<string, unknown>).role === 'user'
      ) as Record<string, unknown>;

      expect(typeof userMsg.content).toBe('string');
      expect(userMsg.content).toBe('Hello, how are you?');
    });

    it('should handle multiple images in a single message', async () => {
      const message = {
        role: 'user',
        content: [
          { type: 'image_url', image_url: { url: 'data:image/png;base64,img1' } },
          { type: 'image_url', image_url: { url: 'data:image/jpeg;base64,img2' } },
          { type: 'text', text: 'Compare these two screenshots' },
        ],
      };

      await provider.complete([message]);

      const userMsg = capturedMessages.find(
        (m: unknown) => (m as Record<string, unknown>).role === 'user'
      ) as Record<string, unknown>;

      const content = userMsg.content as Array<Record<string, unknown>>;
      expect(content).toHaveLength(3);
      expect(content[0].type).toBe('image_url');
      expect(content[1].type).toBe('image_url');
      expect(content[2].type).toBe('text');
    });
  });
});
