/**
 * Tests for the token-cache integration in the SAP Orchestration
 * provider (issue #1357). Exercises the priming path in
 * `SapOrchestrationProvider` and the persist-on-refresh path in
 * `refreshAccessToken`.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';

// The SDK is heavy and does live HTTP if not mocked. Stub the
// OrchestrationClient so we can exercise the priming step without
// requiring live SAP credentials.
vi.mock('@sap-ai-sdk/orchestration', () => {
  class MockOrchestrationClient {
    constructor(
      public _moduleConfig: Record<string, unknown>,
      public _deploymentConfig: unknown
    ) {}
    async chatCompletion(_params: { messages: unknown[] }) {
      return {
        getContent: () => 'ok',
        getFinishReason: () => 'stop',
        getTokenUsage: () => ({}),
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

// Bypass the environment-driven connectivity check.
vi.mock('../../src/config/env.js', () => ({
  env: vi.fn((_key: string) => undefined),
}));

// Force `getConfigPersistAuthTokens` to be controllable per-test.
const persistAuthTokensMock = vi.fn(() => true);
vi.mock('../../src/config/userConfig.js', async () => {
  const actual = await vi.importActual<typeof import('../../src/config/userConfig.js')>(
    '../../src/config/userConfig.js'
  );
  return {
    ...actual,
    getConfigPersistAuthTokens: () => persistAuthTokensMock(),
  };
});

import { SapOrchestrationProvider } from '../../src/providers/sapOrchestration.js';
import {
  saveToken,
  setTokenStoragePath,
  resetTokenStoragePath,
  loadToken,
} from '../../src/utils/tokenStorage.js';
import {
  getConnectorStore,
  setConnectorStore,
  createInMemoryConnectorStore,
  setConnectorStatePath,
  resetConnectorStatePath,
} from '../../src/providers/connectorStore.js';

describe('SapOrchestrationProvider token cache priming', () => {
  let tmpDir: string;

  beforeEach(async () => {
    tmpDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'alexi-sap-token-'));
    setTokenStoragePath(path.join(tmpDir, 'tokens.json'));
    setConnectorStatePath(path.join(tmpDir, 'connectors.json'));
    setConnectorStore(createInMemoryConnectorStore());
    persistAuthTokensMock.mockReturnValue(true);
  });

  afterEach(async () => {
    resetTokenStoragePath();
    resetConnectorStatePath();
    setConnectorStore(createInMemoryConnectorStore());
    await fs.promises.rm(tmpDir, { recursive: true, force: true });
  });

  it('primes the connector store from a valid cached token', async () => {
    const expiresAt = Date.now() + 3_600_000;
    await saveToken('sap-ai-core', 'cached-bearer', expiresAt);

    const provider = new SapOrchestrationProvider({
      modelName: 'anthropic--claude-4.7-opus',
      deploymentId: 'test-deployment',
    });
    await provider.complete([{ role: 'user', content: 'hi' }]);

    const state = await getConnectorStore().get('sap-ai-core');
    expect(state?.accessToken).toBe('cached-bearer');
    expect(state?.expiry).toBe(expiresAt);
  });

  it('does not prime the connector store when the cache is empty', async () => {
    const provider = new SapOrchestrationProvider({
      modelName: 'anthropic--claude-4.7-opus',
      deploymentId: 'test-deployment',
    });
    await provider.complete([{ role: 'user', content: 'hi' }]);

    const state = await getConnectorStore().get('sap-ai-core');
    expect(state).toBeUndefined();
  });

  it('skips priming when persistAuthTokens is false', async () => {
    persistAuthTokensMock.mockReturnValue(false);

    const expiresAt = Date.now() + 3_600_000;
    await saveToken('sap-ai-core', 'cached-bearer', expiresAt);

    const provider = new SapOrchestrationProvider({
      modelName: 'anthropic--claude-4.7-opus',
      deploymentId: 'test-deployment',
    });
    await provider.complete([{ role: 'user', content: 'hi' }]);

    const state = await getConnectorStore().get('sap-ai-core');
    expect(state).toBeUndefined();

    // The on-disk cache entry is NOT touched -- callers may have
    // saved it before opting out.
    expect(await loadToken('sap-ai-core')).not.toBeNull();
  });

  it('discards expired cached tokens and does not prime the store', async () => {
    // Expiry in the past.
    await saveToken('sap-ai-core', 'stale-bearer', Date.now() - 60_000);

    const provider = new SapOrchestrationProvider({
      modelName: 'anthropic--claude-4.7-opus',
      deploymentId: 'test-deployment',
    });
    await provider.complete([{ role: 'user', content: 'hi' }]);

    const state = await getConnectorStore().get('sap-ai-core');
    expect(state).toBeUndefined();

    // Stale entry is proactively cleared.
    expect(await loadToken('sap-ai-core')).toBeNull();
  });

  it('discards tokens within the expiry skew window', async () => {
    // 5 seconds in the future -- well inside the 30s skew.
    await saveToken('sap-ai-core', 'almost-expired', Date.now() + 5_000);

    const provider = new SapOrchestrationProvider({
      modelName: 'anthropic--claude-4.7-opus',
      deploymentId: 'test-deployment',
    });
    await provider.complete([{ role: 'user', content: 'hi' }]);

    const state = await getConnectorStore().get('sap-ai-core');
    expect(state).toBeUndefined();
  });

  it('primes only once per provider instance', async () => {
    const expiresAt = Date.now() + 3_600_000;
    await saveToken('sap-ai-core', 'cached-bearer', expiresAt);

    const provider = new SapOrchestrationProvider({
      modelName: 'anthropic--claude-4.7-opus',
      deploymentId: 'test-deployment',
    });

    await provider.complete([{ role: 'user', content: 'hi' }]);

    // Update the on-disk entry between calls. The provider must NOT
    // pick up the new entry because priming already ran once.
    await saveToken('sap-ai-core', 'newer-bearer', expiresAt);

    await provider.complete([{ role: 'user', content: 'hi again' }]);

    const state = await getConnectorStore().get('sap-ai-core');
    expect(state?.accessToken).toBe('cached-bearer');
  });

  it('preserves existing connector-store fields (e.g. refreshToken) while priming', async () => {
    const store = getConnectorStore();
    await store.set('sap-ai-core', {
      refreshToken: 'preserve-me',
      tokenEndpoint: 'https://oauth.example/token',
    });

    const expiresAt = Date.now() + 3_600_000;
    await saveToken('sap-ai-core', 'cached-bearer', expiresAt);

    const provider = new SapOrchestrationProvider({
      modelName: 'anthropic--claude-4.7-opus',
      deploymentId: 'test-deployment',
    });
    await provider.complete([{ role: 'user', content: 'hi' }]);

    const state = await getConnectorStore().get('sap-ai-core');
    expect(state?.accessToken).toBe('cached-bearer');
    expect(state?.expiry).toBe(expiresAt);
    expect(state?.refreshToken).toBe('preserve-me');
    expect(state?.tokenEndpoint).toBe('https://oauth.example/token');
  });

  it('gracefully degrades when the token file is corrupt', async () => {
    // Write malformed JSON directly.
    fs.writeFileSync(path.join(tmpDir, 'tokens.json'), '{not-valid');

    const provider = new SapOrchestrationProvider({
      modelName: 'anthropic--claude-4.7-opus',
      deploymentId: 'test-deployment',
    });
    // Should complete without throwing.
    const result = await provider.complete([{ role: 'user', content: 'hi' }]);
    expect(result.text).toBe('ok');

    const state = await getConnectorStore().get('sap-ai-core');
    expect(state).toBeUndefined();
  });
});
