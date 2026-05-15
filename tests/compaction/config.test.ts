import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';

import {
  setCompactionConfig,
  getCompactionConfig,
  resetCompactionConfig,
  CompactionManager,
  estimateConversationTokens,
  type CompactionConfig,
  type Message,
} from '../../src/compaction/index.js';

import {
  validateCompactionConfig,
  loadCompactionConfigFromFile,
  initCompactionConfig,
} from '../../src/config/compactionConfig.js';

// Helper to create test messages
function createMessage(role: Message['role'], content: string): Message {
  return { role, content, timestamp: Date.now() };
}

describe('Compaction Config', () => {
  beforeEach(() => {
    resetCompactionConfig();
  });

  afterEach(() => {
    resetCompactionConfig();
  });

  describe('setCompactionConfig / getCompactionConfig', () => {
    it('should set and get config values', () => {
      const config: CompactionConfig = {
        maxTokens: 128000,
        warningThreshold: 0.75,
        strategy: 'smart',
        preserveRecent: 6,
      };

      setCompactionConfig(config);
      const result = getCompactionConfig();

      expect(result.maxTokens).toBe(128000);
      expect(result.warningThreshold).toBe(0.75);
      expect(result.strategy).toBe('smart');
      expect(result.preserveRecent).toBe(6);
    });

    it('should return empty config when nothing is set', () => {
      const config = getCompactionConfig();
      expect(config).toEqual({});
    });

    it('should return a copy (not the internal reference)', () => {
      setCompactionConfig({ maxTokens: 50000 });
      const config = getCompactionConfig();
      config.maxTokens = 999999;

      expect(getCompactionConfig().maxTokens).toBe(50000);
    });

    it('should reject warningThreshold < 0', () => {
      expect(() => setCompactionConfig({ warningThreshold: -0.1 })).toThrow(
        'warningThreshold must be between 0 and 1'
      );
    });

    it('should reject warningThreshold > 1', () => {
      expect(() => setCompactionConfig({ warningThreshold: 1.5 })).toThrow(
        'warningThreshold must be between 0 and 1'
      );
    });

    it('should reject maxTokens <= 0', () => {
      expect(() => setCompactionConfig({ maxTokens: 0 })).toThrow(
        'maxTokens must be greater than 0'
      );
      expect(() => setCompactionConfig({ maxTokens: -100 })).toThrow(
        'maxTokens must be greater than 0'
      );
    });

    it('should reject preserveRecent < 0', () => {
      expect(() => setCompactionConfig({ preserveRecent: -1 })).toThrow(
        'preserveRecent must be >= 0'
      );
    });

    it('should accept boundary values', () => {
      expect(() => setCompactionConfig({ warningThreshold: 0 })).not.toThrow();
      expect(() => setCompactionConfig({ warningThreshold: 1 })).not.toThrow();
      expect(() => setCompactionConfig({ maxTokens: 1 })).not.toThrow();
      expect(() => setCompactionConfig({ preserveRecent: 0 })).not.toThrow();
    });
  });

  describe('resetCompactionConfig', () => {
    it('should reset config to empty', () => {
      setCompactionConfig({ maxTokens: 50000, warningThreshold: 0.5 });
      resetCompactionConfig();
      expect(getCompactionConfig()).toEqual({});
    });
  });

  describe('CompactionManager uses config values', () => {
    it('should use configured maxTokens for needsCompaction', () => {
      // Create messages that total to a known token count
      const messages: Message[] = [];
      for (let i = 0; i < 10; i++) {
        messages.push(createMessage('user', 'a'.repeat(16)));
      }
      const tokens = estimateConversationTokens(messages);

      // With default maxTokens (100000) and default threshold (0.8), should NOT need compaction
      const manager1 = new CompactionManager();
      expect(manager1.needsCompaction(messages)).toBe(false);

      // Set maxTokens low enough that tokens exceed threshold (0.8 by default)
      // tokens >= maxTokens * 0.8, so maxTokens <= tokens / 0.8
      const lowMaxTokens = Math.floor(tokens / 0.8);
      setCompactionConfig({ maxTokens: lowMaxTokens });
      const manager2 = new CompactionManager();
      expect(manager2.needsCompaction(messages)).toBe(true);
    });

    it('should use configured warningThreshold for needsCompaction', () => {
      // Create messages with known token count
      const messages: Message[] = [];
      for (let i = 0; i < 20; i++) {
        messages.push(createMessage('user', 'a'.repeat(100))); // ~25 tokens + 4 overhead = 29 each
      }
      const tokens = estimateConversationTokens(messages);

      // With a threshold of 0.9 and maxTokens just above tokens/0.9, should NOT compact
      const maxTokens = Math.ceil(tokens / 0.89);
      setCompactionConfig({ maxTokens, warningThreshold: 0.9 });
      const manager1 = new CompactionManager();
      expect(manager1.needsCompaction(messages)).toBe(false);

      // With a much lower threshold, should trigger
      resetCompactionConfig();
      setCompactionConfig({ maxTokens, warningThreshold: 0.1 });
      const manager2 = new CompactionManager();
      expect(manager2.needsCompaction(messages)).toBe(true);
    });

    it('should use configured strategy in compact', async () => {
      setCompactionConfig({ strategy: 'truncate', preserveRecent: 2 });

      const messages: Message[] = [
        createMessage('user', 'Message 1'),
        createMessage('assistant', 'Response 1'),
        createMessage('user', 'Message 2'),
        createMessage('assistant', 'Response 2'),
        createMessage('user', 'Message 3'),
        createMessage('assistant', 'Response 3'),
      ];

      const manager = new CompactionManager();
      const result = await manager.compact(messages);

      expect(result.success).toBe(true);
      // Truncate removes oldest, keeping only recent 2
      expect(result.compactedMessageCount).toBeLessThan(result.originalMessageCount);
    });

    it('should use configured preserveRecent in compact', async () => {
      setCompactionConfig({ preserveRecent: 3 });

      const messages: Message[] = [
        createMessage('user', 'Message 1'),
        createMessage('assistant', 'Response 1'),
        createMessage('user', 'Message 2'),
        createMessage('assistant', 'Response 2'),
        createMessage('user', 'Message 3'),
        createMessage('assistant', 'Response 3'),
        createMessage('user', 'Message 4'),
        createMessage('assistant', 'Response 4'),
      ];

      const manager = new CompactionManager();
      const result = await manager.compact(messages, { strategy: 'truncate' });

      // With preserveRecent=3 from config, should keep 3 messages
      expect(result.success).toBe(true);
      expect(result.compactedMessageCount).toBe(3);
    });

    it('should use defaults when no config is set', () => {
      // Default: maxTokens=100000, warningThreshold=0.8
      const messages: Message[] = [createMessage('user', 'short message')];

      const manager = new CompactionManager();
      // A short message should never trigger compaction with defaults
      expect(manager.needsCompaction(messages)).toBe(false);
    });

    it('should allow options parameter to override config', () => {
      // Set config with high maxTokens (won't trigger)
      setCompactionConfig({ maxTokens: 1000000 });

      const messages: Message[] = [];
      for (let i = 0; i < 10; i++) {
        messages.push(createMessage('user', 'a'.repeat(100)));
      }

      const manager = new CompactionManager();

      // Config says won't trigger, but explicit options should override
      expect(manager.needsCompaction(messages, { maxTokens: 10 })).toBe(true);
    });
  });

  describe('validateCompactionConfig', () => {
    it('should return empty config for null/undefined', () => {
      expect(validateCompactionConfig(null)).toEqual({});
      expect(validateCompactionConfig(undefined)).toEqual({});
    });

    it('should return empty config for non-objects', () => {
      expect(validateCompactionConfig('string')).toEqual({});
      expect(validateCompactionConfig(42)).toEqual({});
    });

    it('should validate valid config', () => {
      const result = validateCompactionConfig({
        maxTokens: 128000,
        warningThreshold: 0.75,
        strategy: 'smart',
        preserveRecent: 6,
      });

      expect(result).toEqual({
        maxTokens: 128000,
        warningThreshold: 0.75,
        strategy: 'smart',
        preserveRecent: 6,
      });
    });

    it('should throw for invalid maxTokens', () => {
      expect(() => validateCompactionConfig({ maxTokens: 0 })).toThrow(
        'compaction.maxTokens must be a number greater than 0'
      );
      expect(() => validateCompactionConfig({ maxTokens: -1 })).toThrow(
        'compaction.maxTokens must be a number greater than 0'
      );
      expect(() => validateCompactionConfig({ maxTokens: 'abc' })).toThrow(
        'compaction.maxTokens must be a number greater than 0'
      );
    });

    it('should throw for invalid warningThreshold', () => {
      expect(() => validateCompactionConfig({ warningThreshold: -0.1 })).toThrow(
        'compaction.warningThreshold must be a number between 0 and 1'
      );
      expect(() => validateCompactionConfig({ warningThreshold: 1.1 })).toThrow(
        'compaction.warningThreshold must be a number between 0 and 1'
      );
      expect(() => validateCompactionConfig({ warningThreshold: 'high' })).toThrow(
        'compaction.warningThreshold must be a number between 0 and 1'
      );
    });

    it('should throw for invalid strategy', () => {
      expect(() => validateCompactionConfig({ strategy: 'invalid' })).toThrow(
        'compaction.strategy must be one of: truncate, summarize, sliding, smart'
      );
    });

    it('should throw for invalid preserveRecent', () => {
      expect(() => validateCompactionConfig({ preserveRecent: -1 })).toThrow(
        'compaction.preserveRecent must be a non-negative number'
      );
      expect(() => validateCompactionConfig({ preserveRecent: 'abc' })).toThrow(
        'compaction.preserveRecent must be a non-negative number'
      );
    });

    it('should floor preserveRecent to integer', () => {
      const result = validateCompactionConfig({ preserveRecent: 3.7 });
      expect(result.preserveRecent).toBe(3);
    });

    it('should ignore unknown keys', () => {
      const result = validateCompactionConfig({
        maxTokens: 50000,
        unknownField: 'ignored',
      });
      expect(result).toEqual({ maxTokens: 50000 });
    });
  });

  describe('loadCompactionConfigFromFile', () => {
    let tempDir: string;

    beforeEach(async () => {
      tempDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'alexi-compaction-test-'));
    });

    afterEach(async () => {
      await fs.promises.rm(tempDir, { recursive: true, force: true });
    });

    it('should load config from alexi.config.json', () => {
      const configContent = {
        compaction: {
          maxTokens: 200000,
          warningThreshold: 0.6,
          strategy: 'smart',
          preserveRecent: 8,
        },
      };
      fs.writeFileSync(
        path.join(tempDir, 'alexi.config.json'),
        JSON.stringify(configContent),
        'utf-8'
      );

      const result = loadCompactionConfigFromFile(tempDir);
      expect(result).toEqual({
        maxTokens: 200000,
        warningThreshold: 0.6,
        strategy: 'smart',
        preserveRecent: 8,
      });
    });

    it('should load config from kilo.json', () => {
      const configContent = {
        compaction: {
          maxTokens: 64000,
          warningThreshold: 0.9,
        },
      };
      fs.writeFileSync(path.join(tempDir, 'kilo.json'), JSON.stringify(configContent), 'utf-8');

      const result = loadCompactionConfigFromFile(tempDir);
      expect(result).toEqual({
        maxTokens: 64000,
        warningThreshold: 0.9,
      });
    });

    it('should prefer alexi.config.json over kilo.json', () => {
      fs.writeFileSync(
        path.join(tempDir, 'alexi.config.json'),
        JSON.stringify({ compaction: { maxTokens: 100 } }),
        'utf-8'
      );
      fs.writeFileSync(
        path.join(tempDir, 'kilo.json'),
        JSON.stringify({ compaction: { maxTokens: 200 } }),
        'utf-8'
      );

      const result = loadCompactionConfigFromFile(tempDir);
      expect(result.maxTokens).toBe(100);
    });

    it('should return empty config when no config file exists', () => {
      const result = loadCompactionConfigFromFile(tempDir);
      expect(result).toEqual({});
    });

    it('should return empty config when config file has no compaction key', () => {
      fs.writeFileSync(
        path.join(tempDir, 'alexi.config.json'),
        JSON.stringify({ hooks: [] }),
        'utf-8'
      );

      const result = loadCompactionConfigFromFile(tempDir);
      expect(result).toEqual({});
    });

    it('should throw on invalid compaction config values', () => {
      fs.writeFileSync(
        path.join(tempDir, 'alexi.config.json'),
        JSON.stringify({ compaction: { maxTokens: -5 } }),
        'utf-8'
      );

      expect(() => loadCompactionConfigFromFile(tempDir)).toThrow(
        'compaction.maxTokens must be a number greater than 0'
      );
    });

    it('should skip malformed JSON and try next file', () => {
      fs.writeFileSync(path.join(tempDir, 'alexi.config.json'), 'not valid json', 'utf-8');
      fs.writeFileSync(
        path.join(tempDir, 'kilo.json'),
        JSON.stringify({ compaction: { maxTokens: 50000 } }),
        'utf-8'
      );

      const result = loadCompactionConfigFromFile(tempDir);
      expect(result.maxTokens).toBe(50000);
    });
  });

  describe('initCompactionConfig', () => {
    let tempDir: string;

    beforeEach(async () => {
      tempDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'alexi-compaction-init-'));
    });

    afterEach(async () => {
      await fs.promises.rm(tempDir, { recursive: true, force: true });
      resetCompactionConfig();
    });

    it('should apply config globally when found', () => {
      fs.writeFileSync(
        path.join(tempDir, 'alexi.config.json'),
        JSON.stringify({
          compaction: {
            maxTokens: 150000,
            warningThreshold: 0.7,
            strategy: 'summarize',
            preserveRecent: 5,
          },
        }),
        'utf-8'
      );

      initCompactionConfig(tempDir);

      const globalConfig = getCompactionConfig();
      expect(globalConfig.maxTokens).toBe(150000);
      expect(globalConfig.warningThreshold).toBe(0.7);
      expect(globalConfig.strategy).toBe('summarize');
      expect(globalConfig.preserveRecent).toBe(5);
    });

    it('should not modify global config when no config file found', () => {
      setCompactionConfig({ maxTokens: 99999 });
      initCompactionConfig(tempDir);

      // Should still have previous config since init found nothing
      expect(getCompactionConfig().maxTokens).toBe(99999);
    });
  });
});
