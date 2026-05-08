/**
 * Tests for the bash tool
 */

import { describe, it, expect, vi, afterEach } from 'vitest';
import { bashTool } from '../bash.js';
import type { ToolContext } from '../../index.js';

describe('bash tool', () => {
  const context: ToolContext = {
    workdir: process.cwd(),
  };

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('basic command execution', () => {
    it('should execute a simple echo command', async () => {
      const result = await bashTool.executeUnsafe({ command: 'echo "hello world"' }, context);

      expect(result.success).toBe(true);
      expect(result.data?.stdout.trim()).toBe('hello world');
      expect(result.data?.exitCode).toBe(0);
      expect(result.data?.timedOut).toBe(false);
    });

    it.skip('should capture stderr - SKIPPED (redirect operator blocked)', async () => {
      // This test uses >&2 which is now blocked for security
      // Original: { command: 'echo "error" >&2' }
      // Note: stderr can still be captured from commands that naturally write to it
    });

    it.skip('should capture both stdout and stderr - SKIPPED (operators blocked)', async () => {
      // This test uses && and >&2 which are now blocked for security
      // Original: { command: 'echo "out" && echo "err" >&2' }
    });
  });

  describe('exit code handling', () => {
    it('should report success for exit code 0', async () => {
      const result = await bashTool.executeUnsafe({ command: 'true' }, context);

      expect(result.success).toBe(true);
      expect(result.data?.exitCode).toBe(0);
    });

    it('should report failure for non-zero exit code', async () => {
      const result = await bashTool.executeUnsafe({ command: 'exit 1' }, context);

      expect(result.success).toBe(false);
      expect(result.data?.exitCode).toBe(1);
      expect(result.error).toContain('exited with code 1');
    });

    it('should report the specific exit code', async () => {
      const result = await bashTool.executeUnsafe({ command: 'exit 42' }, context);

      expect(result.data?.exitCode).toBe(42);
    });
  });

  describe('timeout behavior', () => {
    it('should timeout a long-running command', async () => {
      const result = await bashTool.executeUnsafe({ command: 'sleep 10', timeout: 200 }, context);

      expect(result.data?.timedOut).toBe(true);
    }, 10000);

    it('should use default timeout when not specified', async () => {
      // Just verify the command runs without a custom timeout
      const result = await bashTool.executeUnsafe({ command: 'echo "fast"' }, context);

      expect(result.success).toBe(true);
      expect(result.data?.timedOut).toBe(false);
    });
  });

  describe('abort signal', () => {
    it('should abort when signal is triggered', async () => {
      const controller = new AbortController();
      const abortContext: ToolContext = { ...context, signal: controller.signal };

      // Start a long command and abort it quickly
      const promise = bashTool.executeUnsafe({ command: 'sleep 10' }, abortContext);

      // Abort after a short delay
      setTimeout(() => controller.abort(), 100);

      const result = await promise;

      expect(result.success).toBe(false);
      expect(result.error).toContain('aborted');
    }, 10000);
  });

  describe('working directory', () => {
    it('should use context workdir by default', async () => {
      const result = await bashTool.executeUnsafe({ command: 'pwd' }, context);

      expect(result.success).toBe(true);
      expect(result.data?.stdout.trim()).toBe(process.cwd());
    });

    it('should use workdir param when specified (absolute path)', async () => {
      const result = await bashTool.executeUnsafe({ command: 'pwd', workdir: '/tmp' }, context);

      expect(result.success).toBe(true);
      // /tmp may resolve to /private/tmp on macOS
      expect(result.data?.stdout.trim()).toMatch(/\/(tmp|private\/tmp)$/);
    });

    it('should resolve relative workdir against context workdir', async () => {
      const result = await bashTool.executeUnsafe({ command: 'pwd', workdir: 'src' }, context);

      expect(result.success).toBe(true);
      expect(result.data?.stdout.trim()).toContain('/src');
    });
  });

  describe('multi-byte UTF-8 handling (StringDecoder)', () => {
    it('should correctly handle emoji in output', async () => {
      const result = await bashTool.executeUnsafe({ command: 'echo "Hello 🌍🎉 World"' }, context);

      expect(result.success).toBe(true);
      expect(result.data?.stdout.trim()).toBe('Hello 🌍🎉 World');
    });

    it('should correctly handle CJK characters', async () => {
      const result = await bashTool.executeUnsafe({ command: 'echo "你好世界"' }, context);

      expect(result.success).toBe(true);
      expect(result.data?.stdout.trim()).toBe('你好世界');
    });

    it('should correctly handle mixed multi-byte characters', async () => {
      const testString = 'café résumé naïve 日本語 한국어';
      const result = await bashTool.executeUnsafe({ command: `echo "${testString}"` }, context);

      expect(result.success).toBe(true);
      expect(result.data?.stdout.trim()).toBe(testString);
    });

    it('should handle large multi-byte output without corruption', async () => {
      // Generate a string with lots of multi-byte characters
      const result = await bashTool.executeUnsafe(
        { command: 'python3 -c "print(\'🎉\' * 1000)"' },
        context
      );

      expect(result.success).toBe(true);
      const output = result.data?.stdout.trim() ?? '';
      // 🎉 is a surrogate pair (2 code units in JS), so 1000 emojis = 2000 .length
      // Use spread to count actual codepoints
      expect([...output].length).toBe(1000);
      expect(output).not.toContain('�'); // No replacement characters
    });
  });

  describe('output truncation', () => {
    it('should truncate large outputs', async () => {
      // Generate more than 2000 lines of output
      const result = await bashTool.executeUnsafe({ command: 'seq 1 3000' }, context);

      expect(result.success).toBe(true);
      expect(result.truncated).toBe(true);
      expect(result.hint).toBeDefined();
    });

    it('should not truncate small outputs', async () => {
      const result = await bashTool.executeUnsafe({ command: 'echo "small"' }, context);

      expect(result.success).toBe(true);
      expect(result.truncated).toBeFalsy();
    });
  });

  describe('tool metadata', () => {
    it('should have correct name', () => {
      expect(bashTool.name).toBe('bash');
    });

    it('should have a description mentioning truncation and security', () => {
      expect(bashTool.description).toContain('truncated');
      expect(bashTool.description).toContain('blocked');
    });

    it('should generate a valid function schema', () => {
      const schema = bashTool.toFunctionSchema();
      expect(schema.name).toBe('bash');
      expect(schema.parameters).toHaveProperty('properties');
    });
  });

  describe('security - shell operator blocking', () => {
    it('should block semicolon operator', async () => {
      const result = await bashTool.executeUnsafe({ command: 'echo "a"; echo "b"' }, context);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Shell operators are not allowed');
    });

    it('should block && operator', async () => {
      const result = await bashTool.executeUnsafe({ command: 'echo "a" && echo "b"' }, context);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Shell operators are not allowed');
    });

    it('should block || operator', async () => {
      const result = await bashTool.executeUnsafe({ command: 'echo "a" || echo "b"' }, context);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Shell operators are not allowed');
    });

    it('should block pipe operator', async () => {
      const result = await bashTool.executeUnsafe({ command: 'echo "test" | grep test' }, context);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Shell operators are not allowed');
    });

    it('should block redirect operators', async () => {
      const result1 = await bashTool.executeUnsafe({ command: 'echo "test" > file.txt' }, context);
      expect(result1.success).toBe(false);
      expect(result1.error).toContain('Shell operators are not allowed');

      const result2 = await bashTool.executeUnsafe({ command: 'echo "test" >> file.txt' }, context);
      expect(result2.success).toBe(false);

      const result3 = await bashTool.executeUnsafe({ command: 'cat < file.txt' }, context);
      expect(result3.success).toBe(false);
    });

    it('should block backticks', async () => {
      const result = await bashTool.executeUnsafe({ command: 'echo `date`' }, context);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Shell operators are not allowed');
    });

    it('should block command substitution', async () => {
      const result = await bashTool.executeUnsafe({ command: 'echo $(date)' }, context);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Shell operators are not allowed');
    });

    it('should allow simple commands without operators', async () => {
      const result = await bashTool.executeUnsafe({ command: 'echo "hello world"' }, context);

      expect(result.success).toBe(true);
      expect(result.data?.stdout.trim()).toBe('hello world');
    });

    it('should allow commands with arguments and flags', async () => {
      const result = await bashTool.executeUnsafe({ command: 'ls -la' }, context);

      expect(result.success).toBe(true);
    });
  });
});
