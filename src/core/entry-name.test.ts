import { describe, it, expect } from 'vitest';
import { resolveEntryName, resolveAgentName, resolveCommandName } from './entry-name.js';

describe('Entry Name Resolution', () => {
  describe('resolveEntryName', () => {
    it('should extract name from relative path with extension', () => {
      expect(resolveEntryName('./agents/my-agent.ts')).toBe('my-agent');
    });

    it('should extract name from absolute path', () => {
      expect(resolveEntryName('/home/user/project/agents/custom.ts')).toBe('custom');
    });

    it('should handle index files by using parent directory', () => {
      expect(resolveEntryName('./agents/my-agent/index.ts')).toBe('my-agent');
    });

    it('should handle paths without extension', () => {
      expect(resolveEntryName('./agents/simple-agent')).toBe('simple-agent');
    });

    it('should handle Windows-style paths', () => {
      expect(resolveEntryName('.\\agents\\win-agent.ts')).toBe('win-agent');
    });

    it('should handle nested paths', () => {
      expect(resolveEntryName('./agents/nested/deep/my-agent.ts')).toBe('my-agent');
    });

    it('should handle paths with multiple dots', () => {
      expect(resolveEntryName('./agents/my.special.agent.ts')).toBe('my.special.agent');
    });
  });

  describe('resolveAgentName', () => {
    it('should return direct name when no path indicators', () => {
      expect(resolveAgentName('my-agent')).toBe('my-agent');
    });

    it('should resolve from path when path-like', () => {
      expect(resolveAgentName('./custom/agent.ts')).toBe('agent');
    });

    it('should handle forward slashes', () => {
      expect(resolveAgentName('custom/agent.ts')).toBe('agent');
    });

    it('should handle file extensions as path indicator', () => {
      expect(resolveAgentName('agent.ts')).toBe('agent');
    });

    it('should handle simple names without path separators', () => {
      expect(resolveAgentName('code')).toBe('code');
      expect(resolveAgentName('debug')).toBe('debug');
    });
  });

  describe('resolveCommandName', () => {
    it('should work identically to resolveAgentName', () => {
      expect(resolveCommandName('my-command')).toBe('my-command');
      expect(resolveCommandName('./commands/test.ts')).toBe('test');
    });

    it('should handle various path formats', () => {
      expect(resolveCommandName('./cmd/build.ts')).toBe('build');
      expect(resolveCommandName('commands/test/index.ts')).toBe('test');
      expect(resolveCommandName('deploy')).toBe('deploy');
    });
  });
});
