/**
 * Tests for the SAP_AI_GATEWAY_URL environment variable override.
 *
 * Covers the resolution precedence used by
 * `SapOrchestrationProvider.resolveApiBaseUrl` and the standalone
 * `resolveSapAiGatewayUrl` / `assertValidGatewayUrl` helpers:
 *
 *   1. SAP_AI_GATEWAY_URL (explicit override) wins when set.
 *   2. Falls back to `serviceurls.AI_API_URL` from AICORE_SERVICE_KEY.
 *   3. Falls back to the hardcoded default when neither is set.
 *   4. Invalid URLs (non-http(s)) are rejected with a clear error.
 *
 * The connectivity path inside the provider is also exercised to pin
 * the end-to-end precedence (proxy > gateway override > service key).
 */
import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest';

import {
  DEFAULT_SAP_AI_GATEWAY_URL,
  assertValidGatewayUrl,
  resolveSapAiGatewayUrl,
} from '../../src/providers/sapOrchestration.js';

describe('assertValidGatewayUrl', () => {
  it('accepts https:// URLs', () => {
    expect(() => assertValidGatewayUrl('https://proxy.example.com')).not.toThrow();
  });

  it('accepts http:// URLs (local dev gateways)', () => {
    expect(() => assertValidGatewayUrl('http://localhost:8080')).not.toThrow();
  });

  it('rejects ftp:// URLs with an actionable error', () => {
    expect(() => assertValidGatewayUrl('ftp://invalid.example.com')).toThrow(
      /Invalid SAP_AI_GATEWAY_URL/
    );
  });

  it('rejects file:// URLs', () => {
    expect(() => assertValidGatewayUrl('file:///etc/passwd')).toThrow(
      /must start with http:\/\/ or https:\/\//
    );
  });

  it('rejects bare host strings with no scheme', () => {
    expect(() => assertValidGatewayUrl('proxy.example.com')).toThrow(/Invalid SAP_AI_GATEWAY_URL/);
  });

  it('includes the offending value in the error message', () => {
    expect(() => assertValidGatewayUrl('ssh://host')).toThrow(/got: ssh:\/\/host/);
  });
});

describe('resolveSapAiGatewayUrl', () => {
  const originalEnv = process.env.SAP_AI_GATEWAY_URL;

  afterEach(() => {
    if (originalEnv !== undefined) {
      process.env.SAP_AI_GATEWAY_URL = originalEnv;
    } else {
      delete process.env.SAP_AI_GATEWAY_URL;
    }
  });

  it('uses SAP_AI_GATEWAY_URL when set, overriding the service key', () => {
    process.env.SAP_AI_GATEWAY_URL = 'https://proxy.example.com';
    const serviceKey = { serviceurls: { AI_API_URL: 'https://sap.example.com' } };
    expect(resolveSapAiGatewayUrl(serviceKey)).toBe('https://proxy.example.com');
  });

  it('falls back to service key AI_API_URL when SAP_AI_GATEWAY_URL is unset', () => {
    delete process.env.SAP_AI_GATEWAY_URL;
    const serviceKey = { serviceurls: { AI_API_URL: 'https://sap.example.com' } };
    expect(resolveSapAiGatewayUrl(serviceKey)).toBe('https://sap.example.com');
  });

  it('falls back to the hardcoded default when neither env var nor service key is set', () => {
    delete process.env.SAP_AI_GATEWAY_URL;
    expect(resolveSapAiGatewayUrl({})).toBe(DEFAULT_SAP_AI_GATEWAY_URL);
    expect(DEFAULT_SAP_AI_GATEWAY_URL).toBe('https://api.ai.core.cloud.sap');
  });

  it('falls back to the hardcoded default when service key has no serviceurls', () => {
    delete process.env.SAP_AI_GATEWAY_URL;
    expect(resolveSapAiGatewayUrl({ foo: 'bar' })).toBe(DEFAULT_SAP_AI_GATEWAY_URL);
  });

  it('falls back to the hardcoded default when AI_API_URL is an empty string', () => {
    delete process.env.SAP_AI_GATEWAY_URL;
    expect(resolveSapAiGatewayUrl({ serviceurls: { AI_API_URL: '' } })).toBe(
      DEFAULT_SAP_AI_GATEWAY_URL
    );
  });

  it('throws for an invalid SAP_AI_GATEWAY_URL protocol', () => {
    process.env.SAP_AI_GATEWAY_URL = 'ftp://invalid.example.com';
    expect(() => resolveSapAiGatewayUrl({})).toThrow(/Invalid SAP_AI_GATEWAY_URL/);
  });

  it('treats whitespace-only env values as unset (env() trims)', () => {
    process.env.SAP_AI_GATEWAY_URL = '   ';
    const serviceKey = { serviceurls: { AI_API_URL: 'https://sap.example.com' } };
    expect(resolveSapAiGatewayUrl(serviceKey)).toBe('https://sap.example.com');
  });

  it('handles non-object service keys defensively', () => {
    delete process.env.SAP_AI_GATEWAY_URL;
    expect(resolveSapAiGatewayUrl(null)).toBe(DEFAULT_SAP_AI_GATEWAY_URL);
    expect(resolveSapAiGatewayUrl(undefined)).toBe(DEFAULT_SAP_AI_GATEWAY_URL);
    expect(resolveSapAiGatewayUrl('string')).toBe(DEFAULT_SAP_AI_GATEWAY_URL);
  });
});

describe('provider resolveApiBaseUrl precedence (via connectivity)', () => {
  // Capture URLs the connectivity check is invoked with so we can assert
  // the exact URL the provider resolved under each env configuration.
  let checkedUrls: string[] = [];

  beforeEach(() => {
    checkedUrls = [];
    vi.resetModules();
    delete process.env.SAP_PROXY_BASE_URL;
    delete process.env.SAP_AI_GATEWAY_URL;
    delete process.env.AICORE_SERVICE_KEY;
    delete process.env.AICORE_RESOURCE_GROUP;
  });

  afterEach(() => {
    delete process.env.SAP_PROXY_BASE_URL;
    delete process.env.SAP_AI_GATEWAY_URL;
    delete process.env.AICORE_SERVICE_KEY;
    vi.resetModules();
  });

  async function callComplete(): Promise<void> {
    vi.doMock('../../src/providers/connectivity.js', () => ({
      checkConnectivity: vi.fn(async (url: string) => {
        checkedUrls.push(url);
        return { reachable: true };
      }),
    }));

    vi.doMock('@sap-ai-sdk/orchestration', () => {
      class MockOrchestrationClient {
        constructor(_moduleConfig: unknown, _deploymentConfig: unknown) {}
        async chatCompletion() {
          return {
            getContent: () => 'ok',
            getFinishReason: () => 'stop',
            getTokenUsage: () => ({
              completion_tokens: 1,
              prompt_tokens: 1,
              total_tokens: 2,
            }),
            getToolCalls: () => [],
            getAllMessages: () => [],
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

    const mod = await import('../../src/providers/sapOrchestration.js');
    const provider = new mod.SapOrchestrationProvider({ modelName: 'gpt-4o' });
    await provider.complete([{ role: 'user', content: 'hi' }]);
  }

  it('prefers SAP_PROXY_BASE_URL over SAP_AI_GATEWAY_URL and service key', async () => {
    process.env.SAP_PROXY_BASE_URL = 'http://127.0.0.1:3001/v1';
    process.env.SAP_AI_GATEWAY_URL = 'https://gateway.example.com';
    process.env.AICORE_SERVICE_KEY = JSON.stringify({
      serviceurls: { AI_API_URL: 'https://sap.example.com' },
    });
    await callComplete();
    expect(checkedUrls).toEqual(['http://127.0.0.1:3001/v1']);
  });

  it('prefers SAP_AI_GATEWAY_URL over the service key URL', async () => {
    process.env.SAP_AI_GATEWAY_URL = 'https://gateway.example.com';
    process.env.AICORE_SERVICE_KEY = JSON.stringify({
      serviceurls: { AI_API_URL: 'https://sap.example.com' },
    });
    await callComplete();
    expect(checkedUrls).toEqual(['https://gateway.example.com']);
  });

  it('falls back to AICORE_SERVICE_KEY URL when SAP_AI_GATEWAY_URL is unset', async () => {
    process.env.AICORE_SERVICE_KEY = JSON.stringify({
      serviceurls: { AI_API_URL: 'https://sap.example.com' },
    });
    await callComplete();
    expect(checkedUrls).toEqual(['https://sap.example.com']);
  });

  it('throws when SAP_AI_GATEWAY_URL has an invalid protocol', async () => {
    process.env.SAP_AI_GATEWAY_URL = 'ftp://invalid.example.com';
    process.env.AICORE_SERVICE_KEY = JSON.stringify({
      serviceurls: { AI_API_URL: 'https://sap.example.com' },
    });
    await expect(callComplete()).rejects.toThrow(/Invalid SAP_AI_GATEWAY_URL/);
    expect(checkedUrls).toEqual([]);
  });
});
