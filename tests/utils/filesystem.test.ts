import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs/promises';
import * as path from 'path';
import os from 'os';

import { resolveInside, containsPath } from '../../src/utils/filesystem.js';

describe('resolveInside', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'resolve-inside-test-'));
  });

  afterEach(async () => {
    await fs.rm(tempDir, { recursive: true, force: true });
  });

  describe('absolute paths within workspace', () => {
    it('should resolve an absolute path within workspace successfully', async () => {
      const filePath = path.join(tempDir, 'file.txt');
      await fs.writeFile(filePath, 'content');

      const result = await resolveInside(tempDir, filePath);

      expect(result.safe).toBe(true);
      if (result.safe) {
        expect(result.resolved).toContain('file.txt');
      }
    });

    it('should resolve a nested absolute path within workspace', async () => {
      const nested = path.join(tempDir, 'sub', 'dir');
      await fs.mkdir(nested, { recursive: true });
      const filePath = path.join(nested, 'file.txt');
      await fs.writeFile(filePath, 'content');

      const result = await resolveInside(tempDir, filePath);

      expect(result.safe).toBe(true);
      if (result.safe) {
        expect(result.resolved).toContain('sub/dir/file.txt');
      }
    });
  });

  describe('relative paths within workspace', () => {
    it('should resolve a relative path within workspace successfully', async () => {
      const filePath = path.join(tempDir, 'file.txt');
      await fs.writeFile(filePath, 'content');

      const result = await resolveInside(tempDir, 'file.txt');

      expect(result.safe).toBe(true);
      if (result.safe) {
        expect(result.resolved).toContain('file.txt');
      }
    });

    it('should resolve a nested relative path within workspace', async () => {
      const nested = path.join(tempDir, 'sub', 'dir');
      await fs.mkdir(nested, { recursive: true });
      await fs.writeFile(path.join(nested, 'file.txt'), 'content');

      const result = await resolveInside(tempDir, 'sub/dir/file.txt');

      expect(result.safe).toBe(true);
      if (result.safe) {
        expect(result.resolved).toContain('sub/dir/file.txt');
      }
    });
  });

  describe('symlink handling', () => {
    it('should allow symlink pointing inside workspace', async () => {
      const targetFile = path.join(tempDir, 'real-file.txt');
      await fs.writeFile(targetFile, 'content');
      const linkPath = path.join(tempDir, 'link-file.txt');
      await fs.symlink(targetFile, linkPath);

      const result = await resolveInside(tempDir, linkPath);

      expect(result.safe).toBe(true);
      if (result.safe) {
        expect(result.resolved).toContain('real-file.txt');
      }
    });

    it('should reject symlink pointing outside workspace', async () => {
      // Create a file outside the workspace
      const outsideDir = await fs.mkdtemp(path.join(os.tmpdir(), 'outside-'));
      const outsideFile = path.join(outsideDir, 'secret.txt');
      await fs.writeFile(outsideFile, 'secret data');

      // Create a symlink inside workspace pointing outside
      const linkPath = path.join(tempDir, 'evil-link.txt');
      await fs.symlink(outsideFile, linkPath);

      const result = await resolveInside(tempDir, linkPath);

      expect(result.safe).toBe(false);
      if (!result.safe) {
        expect(result.reason).toContain('Symlink target escapes workspace boundary');
      }

      // Cleanup
      await fs.rm(outsideDir, { recursive: true, force: true });
    });

    it('should reject deeply nested symlink escaping workspace', async () => {
      // Create a file outside the workspace
      const outsideDir = await fs.mkdtemp(path.join(os.tmpdir(), 'outside-'));
      const outsideFile = path.join(outsideDir, 'secret.txt');
      await fs.writeFile(outsideFile, 'secret data');

      // Create nested directory structure with symlink
      const nestedDir = path.join(tempDir, 'deep', 'nested');
      await fs.mkdir(nestedDir, { recursive: true });
      const linkPath = path.join(nestedDir, 'escape-link.txt');
      await fs.symlink(outsideFile, linkPath);

      const result = await resolveInside(tempDir, linkPath);

      expect(result.safe).toBe(false);
      if (!result.safe) {
        expect(result.reason).toContain('Symlink target escapes workspace boundary');
      }

      // Cleanup
      await fs.rm(outsideDir, { recursive: true, force: true });
    });

    it('should reject symlinked directory pointing outside workspace', async () => {
      // Create directory outside workspace
      const outsideDir = await fs.mkdtemp(path.join(os.tmpdir(), 'outside-dir-'));
      await fs.writeFile(path.join(outsideDir, 'file.txt'), 'content');

      // Create symlink to outside directory
      const linkDir = path.join(tempDir, 'linked-dir');
      await fs.symlink(outsideDir, linkDir);

      const result = await resolveInside(tempDir, linkDir);

      expect(result.safe).toBe(false);
      if (!result.safe) {
        expect(result.reason).toContain('Symlink target escapes workspace boundary');
      }

      // Cleanup
      await fs.rm(outsideDir, { recursive: true, force: true });
    });
  });

  describe('non-existent path handling', () => {
    it('should allow non-existent path within workspace', async () => {
      const result = await resolveInside(tempDir, 'nonexistent/file.txt');

      expect(result.safe).toBe(true);
      if (result.safe) {
        expect(result.resolved).toContain('nonexistent/file.txt');
      }
    });

    it('should reject non-existent path with traversal escaping workspace', async () => {
      const result = await resolveInside(tempDir, '../../../etc/passwd');

      expect(result.safe).toBe(false);
      if (!result.safe) {
        expect(result.reason).toContain('escapes workspace boundary');
      }
    });
  });

  describe('path traversal with ..', () => {
    it('should reject path with .. traversal escaping workspace', async () => {
      const result = await resolveInside(tempDir, '../escape.txt');

      expect(result.safe).toBe(false);
      if (!result.safe) {
        expect(result.reason).toContain('escapes workspace boundary');
      }
    });

    it('should allow path with .. that stays within workspace', async () => {
      const subDir = path.join(tempDir, 'sub');
      await fs.mkdir(subDir);
      await fs.writeFile(path.join(tempDir, 'file.txt'), 'content');

      // sub/../file.txt should resolve to tempDir/file.txt (still within workspace)
      const result = await resolveInside(tempDir, 'sub/../file.txt');

      expect(result.safe).toBe(true);
      if (result.safe) {
        expect(result.resolved).toContain('file.txt');
      }
    });

    it('should reject absolute path outside workspace', async () => {
      const result = await resolveInside(tempDir, '/etc/passwd');

      expect(result.safe).toBe(false);
      if (!result.safe) {
        expect(result.reason).toContain('escapes workspace boundary');
      }
    });
  });
});

describe('containsPath', () => {
  it('should return true for child within parent', () => {
    expect(containsPath('/home/user/project', '/home/user/project/src/file.ts')).toBe(true);
  });

  it('should return true for same path', () => {
    expect(containsPath('/home/user/project', '/home/user/project')).toBe(true);
  });

  it('should return false for child outside parent', () => {
    expect(containsPath('/home/user/project', '/home/user/other/file.ts')).toBe(false);
  });

  it('should not match prefix-only paths', () => {
    expect(containsPath('/home/user', '/home/user-data/file.ts')).toBe(false);
  });
});
