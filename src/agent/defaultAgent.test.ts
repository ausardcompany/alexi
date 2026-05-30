import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { pickAgentSlug, resolveDefaultAgent } from './defaultAgent.js';
import * as logger from '../utils/logger.js';

// pickAgentSlug — pure precedence logic
describe('pickAgentSlug', () => {
  it('returns CLI flag when both CLI and config are set (CLI > config)', () => {
    expect(pickAgentSlug({ cliFlag: 'debug', configValue: 'plan' })).toBe('debug');
  });

  it('returns config value when CLI flag is absent', () => {
    expect(pickAgentSlug({ configValue: 'plan' })).toBe('plan');
  });

  it('returns undefined when neither is set', () => {
    expect(pickAgentSlug({})).toBeUndefined();
  });

  it('treats empty CLI flag as absent and falls through to config', () => {
    expect(pickAgentSlug({ cliFlag: '', configValue: 'debug' })).toBe('debug');
  });

  it('treats whitespace-only CLI flag as absent and falls through to config', () => {
    expect(pickAgentSlug({ cliFlag: '   ', configValue: 'debug' })).toBe('debug');
  });

  it('treats whitespace-only config value as absent', () => {
    expect(pickAgentSlug({ configValue: '   ' })).toBeUndefined();
  });

  it('trims surrounding whitespace from the resolved slug', () => {
    expect(pickAgentSlug({ cliFlag: '  debug  ' })).toBe('debug');
    expect(pickAgentSlug({ configValue: '  plan  ' })).toBe('plan');
  });
});

// resolveDefaultAgent — registry validation
describe('resolveDefaultAgent', () => {
  let warnSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    warnSpy = vi.spyOn(logger.logger, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    warnSpy.mockRestore();
  });

  it('returns undefined when no slug is provided (no warning)', async () => {
    const result = await resolveDefaultAgent({});
    expect(result).toBeUndefined();
    expect(warnSpy).not.toHaveBeenCalled();
  });

  it('returns the canonical agent id when CLI flag matches a built-in agent', async () => {
    const result = await resolveDefaultAgent({ cliFlag: 'debug' });
    expect(result).toBe('debug');
    expect(warnSpy).not.toHaveBeenCalled();
  });

  it('resolves an alias to the canonical agent id', async () => {
    // 'fix' is an alias of the 'debug' agent
    const result = await resolveDefaultAgent({ cliFlag: 'fix' });
    expect(result).toBe('debug');
  });

  it('honors config value when CLI flag is absent', async () => {
    const result = await resolveDefaultAgent({ configValue: 'plan' });
    expect(result).toBe('plan');
    expect(warnSpy).not.toHaveBeenCalled();
  });

  it('CLI flag overrides config value', async () => {
    const result = await resolveDefaultAgent({ cliFlag: 'debug', configValue: 'plan' });
    expect(result).toBe('debug');
  });

  it('logs a warning and returns undefined for an unknown slug (no throw)', async () => {
    const result = await resolveDefaultAgent({ cliFlag: 'this-agent-does-not-exist' });
    expect(result).toBeUndefined();
    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(warnSpy.mock.calls[0]?.[0]).toContain('this-agent-does-not-exist');
  });
});
