/**
 * Tests for the `persistAuthTokens` accessor added in issue #1357.
 * Verifies the default (`true`), explicit toggle, and coercion for
 * non-boolean values (which fall back to the default).
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs';

import {
  CONFIG_FILE,
  getConfigPersistAuthTokens,
  setConfigPersistAuthTokens,
  deleteConfigValue,
  setConfigValue,
} from '../../src/config/userConfig.js';

describe('persistAuthTokens config', () => {
  let originalContent: string | null = null;

  beforeEach(() => {
    try {
      originalContent = fs.readFileSync(CONFIG_FILE, 'utf-8');
    } catch {
      originalContent = null;
    }
    deleteConfigValue('persistAuthTokens');
  });

  afterEach(() => {
    if (originalContent === null) {
      try {
        fs.unlinkSync(CONFIG_FILE);
      } catch {
        // ignore
      }
    } else {
      fs.writeFileSync(CONFIG_FILE, originalContent, 'utf-8');
    }
  });

  it('defaults to true when the key is absent', () => {
    expect(getConfigPersistAuthTokens()).toBe(true);
  });

  it('returns false when explicitly disabled', () => {
    setConfigPersistAuthTokens(false);
    expect(getConfigPersistAuthTokens()).toBe(false);
  });

  it('returns true when explicitly enabled', () => {
    setConfigPersistAuthTokens(true);
    expect(getConfigPersistAuthTokens()).toBe(true);
  });

  it('falls back to true when the stored value is non-boolean', () => {
    setConfigValue('persistAuthTokens', 'yes');
    expect(getConfigPersistAuthTokens()).toBe(true);

    setConfigValue('persistAuthTokens', 1);
    expect(getConfigPersistAuthTokens()).toBe(true);

    setConfigValue('persistAuthTokens', null);
    expect(getConfigPersistAuthTokens()).toBe(true);
  });
});
