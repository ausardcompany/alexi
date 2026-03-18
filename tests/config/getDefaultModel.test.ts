import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock the config modules before importing
vi.mock('../../src/config/env.js', () => ({
  env: vi.fn(),
}));

vi.mock('../../src/config/userConfig.js', () => ({
  getConfigDefaultModel: vi.fn(),
}));

import { getDefaultModel } from '../../src/providers/index.js';
import { env } from '../../src/config/env.js';
import { getConfigDefaultModel } from '../../src/config/userConfig.js';

describe('getDefaultModel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should return AICORE_MODEL env var when set (highest priority)', () => {
    vi.mocked(env).mockReturnValue('env-model');
    vi.mocked(getConfigDefaultModel).mockReturnValue('config-model');

    expect(getDefaultModel()).toBe('env-model');
  });

  it('should return config defaultModel when env var is not set', () => {
    vi.mocked(env).mockReturnValue(undefined);
    vi.mocked(getConfigDefaultModel).mockReturnValue('config-model');

    expect(getDefaultModel()).toBe('config-model');
  });

  it('should return hardcoded gpt-4o when neither env nor config is set', () => {
    vi.mocked(env).mockReturnValue(undefined);
    vi.mocked(getConfigDefaultModel).mockReturnValue(undefined);

    expect(getDefaultModel()).toBe('gpt-4o');
  });

  it('should prefer env over config (env wins)', () => {
    vi.mocked(env).mockReturnValue('from-env');
    vi.mocked(getConfigDefaultModel).mockReturnValue('from-config');

    expect(getDefaultModel()).toBe('from-env');
  });

  it('should call env with AICORE_MODEL', () => {
    vi.mocked(env).mockReturnValue('test');
    vi.mocked(getConfigDefaultModel).mockReturnValue(undefined);

    getDefaultModel();

    expect(env).toHaveBeenCalledWith('AICORE_MODEL');
  });
});
