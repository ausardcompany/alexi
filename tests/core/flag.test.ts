import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest';

describe('core/flag KILO_DISABLE_EXTERNAL_SKILLS', () => {
  const KEY = 'KILO_DISABLE_EXTERNAL_SKILLS';
  const originalValue = process.env[KEY];

  beforeEach(() => {
    vi.resetModules();
    delete process.env[KEY];
  });

  afterEach(() => {
    if (originalValue === undefined) {
      delete process.env[KEY];
    } else {
      process.env[KEY] = originalValue;
    }
    vi.resetModules();
  });

  it('defaults to false when the env var is unset', async () => {
    const mod = await import('../../src/core/flag.js');
    expect(mod.KILO_DISABLE_EXTERNAL_SKILLS).toBe(false);
  });

  it('is true when env var is "true"', async () => {
    process.env[KEY] = 'true';
    const mod = await import('../../src/core/flag.js');
    expect(mod.KILO_DISABLE_EXTERNAL_SKILLS).toBe(true);
  });

  it('is true when env var is "TRUE" (case-insensitive)', async () => {
    process.env[KEY] = 'TRUE';
    const mod = await import('../../src/core/flag.js');
    expect(mod.KILO_DISABLE_EXTERNAL_SKILLS).toBe(true);
  });

  it('is true when env var is "1"', async () => {
    process.env[KEY] = '1';
    const mod = await import('../../src/core/flag.js');
    expect(mod.KILO_DISABLE_EXTERNAL_SKILLS).toBe(true);
  });

  it('is false for other truthy-looking values like "yes"', async () => {
    process.env[KEY] = 'yes';
    const mod = await import('../../src/core/flag.js');
    expect(mod.KILO_DISABLE_EXTERNAL_SKILLS).toBe(false);
  });

  it('is false for "0"', async () => {
    process.env[KEY] = '0';
    const mod = await import('../../src/core/flag.js');
    expect(mod.KILO_DISABLE_EXTERNAL_SKILLS).toBe(false);
  });

  it('is false for empty string', async () => {
    process.env[KEY] = '';
    const mod = await import('../../src/core/flag.js');
    expect(mod.KILO_DISABLE_EXTERNAL_SKILLS).toBe(false);
  });
});
