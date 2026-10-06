/**
 * Tests for the memory_model config accessors.
 *
 * Ports upstream kilocode commits `86fe6ef9f` / `fffcf0e2a` — adds a
 * dedicated model for automatic memory saves, with graceful fallback
 * to the session model when the configured memory model is
 * unavailable (important for SAP AI Core where model availability
 * varies by subaccount).
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import fs from 'fs';

import {
  CONFIG_FILE,
  getConfigMemoryModel,
  resolveMemoryModel,
  saveFullConfig,
  setConfigMemoryModel,
} from '../../src/config/userConfig.js';

describe('userConfig memory_model', () => {
  let originalContent: string | null = null;

  beforeEach(() => {
    try {
      originalContent = fs.readFileSync(CONFIG_FILE, 'utf-8');
    } catch {
      originalContent = null;
    }
  });

  afterEach(() => {
    try {
      if (originalContent !== null) {
        fs.writeFileSync(CONFIG_FILE, originalContent, 'utf-8');
      } else if (fs.existsSync(CONFIG_FILE)) {
        fs.unlinkSync(CONFIG_FILE);
      }
    } catch {
      // Best-effort restore.
    }
  });

  it('returns undefined when nothing is configured', () => {
    saveFullConfig({});
    expect(getConfigMemoryModel()).toBeUndefined();
  });

  it('reads `models.memory` as the preferred location', () => {
    saveFullConfig({ models: { memory: 'sap-ai-core/gpt-5-mini' } });
    expect(getConfigMemoryModel()).toBe('sap-ai-core/gpt-5-mini');
  });

  it('falls back to the legacy `memory_model` key', () => {
    saveFullConfig({ memory_model: 'sap-ai-core/haiku' });
    expect(getConfigMemoryModel()).toBe('sap-ai-core/haiku');
  });

  it('prefers `models.memory` over the legacy top-level key', () => {
    saveFullConfig({
      models: { memory: 'sap-ai-core/gpt-5-mini' },
      memory_model: 'sap-ai-core/haiku',
    });
    expect(getConfigMemoryModel()).toBe('sap-ai-core/gpt-5-mini');
  });

  it('setConfigMemoryModel writes to `models.memory` and clears the legacy key', () => {
    saveFullConfig({ memory_model: 'sap-ai-core/haiku' });
    setConfigMemoryModel('sap-ai-core/sonnet');

    const parsed = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8'));
    expect(parsed.models.memory).toBe('sap-ai-core/sonnet');
    expect(parsed.memory_model).toBeUndefined();
  });

  it('setConfigMemoryModel preserves siblings under `models`', () => {
    saveFullConfig({ models: { compaction: 'sap-ai-core/haiku' } });
    setConfigMemoryModel('sap-ai-core/sonnet');

    const parsed = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8'));
    expect(parsed.models.compaction).toBe('sap-ai-core/haiku');
    expect(parsed.models.memory).toBe('sap-ai-core/sonnet');
  });

  it('setConfigMemoryModel rejects empty strings', () => {
    expect(() => setConfigMemoryModel('   ')).toThrow();
  });

  it('resolveMemoryModel falls back to the session model when unset', async () => {
    saveFullConfig({});
    await expect(resolveMemoryModel('sap-ai-core/opus')).resolves.toBe('sap-ai-core/opus');
  });

  it('resolveMemoryModel uses the configured model when available', async () => {
    saveFullConfig({ models: { memory: 'sap-ai-core/haiku' } });
    const isAvailable = vi.fn().mockReturnValue(true);
    await expect(resolveMemoryModel('sap-ai-core/opus', isAvailable)).resolves.toBe(
      'sap-ai-core/haiku'
    );
    expect(isAvailable).toHaveBeenCalledWith('sap-ai-core/haiku');
  });

  it('resolveMemoryModel falls back when the configured model is reported unavailable', async () => {
    saveFullConfig({ models: { memory: 'sap-ai-core/missing' } });
    const isAvailable = vi.fn().mockReturnValue(false);
    await expect(resolveMemoryModel('sap-ai-core/opus', isAvailable)).resolves.toBe(
      'sap-ai-core/opus'
    );
  });

  it('resolveMemoryModel falls back when the availability check throws', async () => {
    saveFullConfig({ models: { memory: 'sap-ai-core/flaky' } });
    const isAvailable = vi.fn().mockRejectedValue(new Error('subaccount lookup failed'));
    await expect(resolveMemoryModel('sap-ai-core/opus', isAvailable)).resolves.toBe(
      'sap-ai-core/opus'
    );
  });

  it('resolveMemoryModel returns the configured model when no availability probe is supplied', async () => {
    saveFullConfig({ models: { memory: 'sap-ai-core/haiku' } });
    await expect(resolveMemoryModel('sap-ai-core/opus')).resolves.toBe('sap-ai-core/haiku');
  });
});
