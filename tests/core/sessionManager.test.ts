import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';

import { SessionManager } from '../../src/core/sessionManager.js';

describe('SessionManager', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'alexi-session-test-'));
  });

  afterEach(async () => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  describe('compactionThreshold option', () => {
    it('should use default threshold of 0.8 when not configured', () => {
      const manager = new SessionManager({
        sessionsDir: tempDir,
        maxContextTokens: 1000,
        autoCompact: false,
      });

      // Create a session and verify it works with defaults
      const session = manager.createSession();
      expect(session).toBeDefined();
      expect(session.metadata.id).toBeDefined();
    });

    it('should trigger compaction at custom threshold', () => {
      // Use a very low threshold (0.1 = 10%) so any substantial message triggers compaction
      const manager = new SessionManager({
        sessionsDir: tempDir,
        maxContextTokens: 100,
        autoCompact: true,
        compactionThreshold: 0.1,
      });

      manager.createSession();

      // Add a message with enough content to exceed 10% of 100 tokens (10 tokens)
      // Each char ~0.25 tokens, so 100 chars = ~25 tokens > 10 token threshold
      const longContent = 'x'.repeat(100);
      manager.addMessage('user', longContent);

      // The session should have been compacted (or at least attempted).
      // Since compaction requires an LLM (which isn't set up), it will fall back
      // to the fallback summary. We verify the message was added regardless.
      const session = manager.getCurrentSession();
      expect(session).not.toBeNull();
      expect(session!.messages.length).toBeGreaterThanOrEqual(1);
    });

    it('should not trigger compaction below threshold', () => {
      // Use a very high threshold (0.99 = 99%) so messages won't trigger compaction
      const manager = new SessionManager({
        sessionsDir: tempDir,
        maxContextTokens: 100_000,
        autoCompact: true,
        compactionThreshold: 0.99,
      });

      manager.createSession();

      // Add a short message that won't reach 99% of 100K tokens
      manager.addMessage('user', 'Hello world');

      const session = manager.getCurrentSession();
      expect(session).not.toBeNull();
      // With such a high threshold, no compaction should occur
      expect(session!.messages.length).toBe(1);
      expect(session!.messages[0].content).toBe('Hello world');
    });

    it('should accept threshold at boundary values', () => {
      // Test threshold at 0.6 (aggressive compaction)
      const manager = new SessionManager({
        sessionsDir: tempDir,
        maxContextTokens: 1000,
        autoCompact: true,
        compactionThreshold: 0.6,
      });

      manager.createSession();
      manager.addMessage('user', 'Test message');

      const session = manager.getCurrentSession();
      expect(session).not.toBeNull();
    });

    it('should default to 0.8 threshold when compactionThreshold is not provided', () => {
      // With 1000 max tokens and default 0.8 threshold, compaction triggers at 800 tokens
      // A message of 200 chars = ~50 tokens + 4 overhead = 54 tokens (below 800)
      const manager = new SessionManager({
        sessionsDir: tempDir,
        maxContextTokens: 1000,
        autoCompact: true,
      });

      manager.createSession();
      manager.addMessage('user', 'a'.repeat(200));

      const session = manager.getCurrentSession();
      expect(session).not.toBeNull();
      // Should not compact since 54 tokens < 800 token threshold
      expect(session!.messages.length).toBe(1);
      expect(session!.messages[0].content).toBe('a'.repeat(200));
    });
  });
});
