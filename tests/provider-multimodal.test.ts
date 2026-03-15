/**
 * Tests for multimodal message pass-through in the SAP Orchestration provider.
 *
 * We cannot unit-test `toOrchestrationMessages` directly (it's a module-private
 * function), so we test the public `complete()` and `streamComplete()` methods
 * with mocked SDK clients to verify that multimodal UserChatMessage objects are
 * passed through correctly.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the SAP AI SDK orchestration module
vi.mock('@sap-ai-sdk/orchestration', () => {
  const mockChatCompletion = vi.fn();
  const mockStream = vi.fn();

  return {
    OrchestrationClient: vi.fn().mockImplementation(() => ({
      chatCompletion: mockChatCompletion,
      stream: mockStream,
    })),
    buildAzureContentFilter: vi.fn().mockReturnValue({}),
    // Export the mocks so tests can configure them
    __mockChatCompletion: mockChatCompletion,
    __mockStream: mockStream,
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

// Access the mock functions
const sdkMock = await import('@sap-ai-sdk/orchestration');
const mockChatCompletion = (sdkMock as Record<string, unknown>).__mockChatCompletion as ReturnType<
  typeof vi.fn
>;
const mockStream = (sdkMock as Record<string, unknown>).__mockStream as ReturnType<typeof vi.fn>;

describe('SapOrchestrationProvider multimodal support', () => {
  let provider: SapOrchestrationProvider;

  beforeEach(() => {
    vi.clearAllMocks();
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

      mockChatCompletion.mockResolvedValueOnce({
        getContent: () => 'I see a screenshot of a terminal.',
        getFinishReason: () => 'stop',
        getTokenUsage: () => ({
          completion_tokens: 10,
          prompt_tokens: 100,
          total_tokens: 110,
        }),
        data: {
          orchestration_result: {
            choices: [
              {
                message: {
                  role: 'assistant',
                  content: 'I see a screenshot of a terminal.',
                },
              },
            ],
          },
          module_results: {},
        },
      });

      const result = await provider.complete([multimodalMessage]);

      expect(result.text).toBe('I see a screenshot of a terminal.');

      // Verify the SDK received the multimodal message
      expect(mockChatCompletion).toHaveBeenCalledTimes(1);
      const callArgs = mockChatCompletion.mock.calls[0][0];
      const passedMessages = callArgs.messages;

      // Find the user message
      const userMsg = passedMessages.find((m: Record<string, unknown>) => m.role === 'user');
      expect(userMsg).toBeDefined();
      expect(Array.isArray(userMsg.content)).toBe(true);
      expect(userMsg.content).toHaveLength(2);
      expect(userMsg.content[0].type).toBe('image_url');
      expect(userMsg.content[1].type).toBe('text');
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

      mockChatCompletion.mockResolvedValueOnce({
        getContent: () => 'Description here.',
        getFinishReason: () => 'stop',
        getTokenUsage: () => ({
          completion_tokens: 5,
          prompt_tokens: 50,
          total_tokens: 55,
        }),
        data: {
          orchestration_result: {
            choices: [
              {
                message: {
                  role: 'assistant',
                  content: 'Description here.',
                },
              },
            ],
          },
          module_results: {},
        },
      });

      const result = await provider.complete(messages);
      expect(result.text).toBe('Description here.');

      const callArgs = mockChatCompletion.mock.calls[0][0];
      const passedMessages = callArgs.messages;

      // System message should be plain string
      const sysMsg = passedMessages.find((m: Record<string, unknown>) => m.role === 'system');
      expect(typeof sysMsg.content).toBe('string');

      // User message should be array
      const userMsg = passedMessages.find((m: Record<string, unknown>) => m.role === 'user');
      expect(Array.isArray(userMsg.content)).toBe(true);
    });

    it('should not affect plain text messages (backward compat)', async () => {
      const messages = [{ role: 'user', content: 'Hello, how are you?' }];

      mockChatCompletion.mockResolvedValueOnce({
        getContent: () => 'I am fine.',
        getFinishReason: () => 'stop',
        getTokenUsage: () => ({
          completion_tokens: 4,
          prompt_tokens: 10,
          total_tokens: 14,
        }),
        data: {
          orchestration_result: {
            choices: [
              {
                message: { role: 'assistant', content: 'I am fine.' },
              },
            ],
          },
          module_results: {},
        },
      });

      const result = await provider.complete(messages);
      expect(result.text).toBe('I am fine.');

      const callArgs = mockChatCompletion.mock.calls[0][0];
      const userMsg = callArgs.messages.find((m: Record<string, unknown>) => m.role === 'user');
      expect(typeof userMsg.content).toBe('string');
      expect(userMsg.content).toBe('Hello, how are you?');
    });
  });
});
