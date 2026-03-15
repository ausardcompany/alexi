import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { _resetClipboardCache } from '../src/utils/clipboard.js';

// Mock child_process before imports
vi.mock('node:child_process', () => ({
  execFile: vi.fn(),
}));

// Mock node:util to provide a promisify that wraps our mock
vi.mock('node:util', async (importOriginal) => {
  const actual = await importOriginal<typeof import('node:util')>();
  return {
    ...actual,
    promisify: (fn: unknown) => {
      // Return a function that calls the mock and wraps in a promise
      return (...args: unknown[]) => {
        return new Promise((resolve, reject) => {
          (fn as (...a: unknown[]) => void)(...args, (err: Error | null, result: unknown) => {
            if (err) {
              reject(err);
            } else {
              resolve(result);
            }
          });
        });
      };
    },
  };
});

import { execFile } from 'node:child_process';

const mockExecFile = vi.mocked(execFile);

// We need to dynamically import the module after mocking
async function importClipboard() {
  // Reset module cache to pick up mocks
  const mod = await import('../src/utils/clipboard.js');
  return mod;
}

describe('clipboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    _resetClipboardCache();
  });

  afterEach(() => {
    _resetClipboardCache();
  });

  describe('detectClipboard', () => {
    it('should detect pngpaste on macOS', async () => {
      const originalPlatform = Object.getOwnPropertyDescriptor(process, 'platform');
      Object.defineProperty(process, 'platform', { value: 'darwin', configurable: true });

      // Mock `which pngpaste` succeeding
      mockExecFile.mockImplementation(
        (cmd: unknown, args: unknown, _opts: unknown, cb?: unknown) => {
          const callback = typeof _opts === 'function' ? _opts : cb;
          if (typeof callback === 'function') {
            if (cmd === 'which' && (args as string[])[0] === 'pngpaste') {
              callback(null, { stdout: '/usr/local/bin/pngpaste', stderr: '' });
            } else {
              callback(new Error('not found'), null);
            }
          }
          return undefined as never;
        }
      );

      const { detectClipboard } = await importClipboard();
      _resetClipboardCache();
      const result = await detectClipboard();

      expect(result.available).toBe(true);
      expect(result.tool).toBe('pngpaste');
      expect(result.platform).toBe('darwin');

      if (originalPlatform) {
        Object.defineProperty(process, 'platform', originalPlatform);
      }
    });

    it('should fall back to osascript when pngpaste is missing on macOS', async () => {
      const originalPlatform = Object.getOwnPropertyDescriptor(process, 'platform');
      Object.defineProperty(process, 'platform', { value: 'darwin', configurable: true });

      // pngpaste not found, but osascript is available
      mockExecFile.mockImplementation(
        (cmd: unknown, args: unknown, _opts: unknown, cb?: unknown) => {
          const callback = typeof _opts === 'function' ? _opts : cb;
          if (typeof callback === 'function') {
            if (cmd === 'which' && (args as string[])[0] === 'osascript') {
              callback(null, { stdout: '/usr/bin/osascript', stderr: '' });
            } else {
              callback(new Error('not found'), null);
            }
          }
          return undefined as never;
        }
      );

      const { detectClipboard } = await importClipboard();
      _resetClipboardCache();
      const result = await detectClipboard();

      expect(result.available).toBe(true);
      expect(result.tool).toBe('osascript');
      expect(result.platform).toBe('darwin');

      if (originalPlatform) {
        Object.defineProperty(process, 'platform', originalPlatform);
      }
    });

    it('should report unavailable when no tool found on macOS', async () => {
      const originalPlatform = Object.getOwnPropertyDescriptor(process, 'platform');
      Object.defineProperty(process, 'platform', { value: 'darwin', configurable: true });

      // Both pngpaste and osascript unavailable
      mockExecFile.mockImplementation(
        (_cmd: unknown, _args: unknown, _opts: unknown, cb?: unknown) => {
          const callback = typeof _opts === 'function' ? _opts : cb;
          if (typeof callback === 'function') {
            callback(new Error('not found'), null);
          }
          return undefined as never;
        }
      );

      const { detectClipboard } = await importClipboard();
      _resetClipboardCache();
      const result = await detectClipboard();

      expect(result.available).toBe(false);
      expect(result.installHint).toBeDefined();
      expect(result.installHint).toContain('pngpaste');

      if (originalPlatform) {
        Object.defineProperty(process, 'platform', originalPlatform);
      }
    });

    it('should report unavailable on unsupported platform', async () => {
      const originalPlatform = Object.getOwnPropertyDescriptor(process, 'platform');
      Object.defineProperty(process, 'platform', { value: 'freebsd', configurable: true });

      const { detectClipboard } = await importClipboard();
      _resetClipboardCache();
      const result = await detectClipboard();

      expect(result.available).toBe(false);
      expect(result.platform).toBe('freebsd');

      if (originalPlatform) {
        Object.defineProperty(process, 'platform', originalPlatform);
      }
    });
  });

  describe('readImageFile', () => {
    it('should read a valid PNG file', async () => {
      const fs = await import('node:fs/promises');
      const os = await import('node:os');
      const path = await import('node:path');

      // Create a temp file with PNG magic bytes
      const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'clipboard-test-'));
      const filePath = path.join(tmpDir, 'test.png');
      const pngData = Buffer.alloc(64);
      pngData[0] = 0x89;
      pngData[1] = 0x50;
      pngData[2] = 0x4e;
      pngData[3] = 0x47;
      await fs.writeFile(filePath, pngData);

      try {
        const { readImageFile } = await importClipboard();
        const result = await readImageFile(filePath);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.format).toBe('png');
          expect(result.data.length).toBe(64);
        }
      } finally {
        await fs.rm(tmpDir, { recursive: true, force: true });
      }
    });

    it('should return error for non-existent file', async () => {
      const { readImageFile } = await importClipboard();
      const result = await readImageFile('/nonexistent/path/image.png');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain('not found');
      }
    });

    it('should return error for unsupported format', async () => {
      const fs = await import('node:fs/promises');
      const os = await import('node:os');
      const path = await import('node:path');

      const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'clipboard-test-'));
      const filePath = path.join(tmpDir, 'test.txt');
      await fs.writeFile(filePath, 'not an image');

      try {
        const { readImageFile } = await importClipboard();
        const result = await readImageFile(filePath);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error).toContain('Unsupported');
        }
      } finally {
        await fs.rm(tmpDir, { recursive: true, force: true });
      }
    });

    it('should return error for empty file', async () => {
      const fs = await import('node:fs/promises');
      const os = await import('node:os');
      const path = await import('node:path');

      const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'clipboard-test-'));
      const filePath = path.join(tmpDir, 'empty.png');
      await fs.writeFile(filePath, Buffer.alloc(0));

      try {
        const { readImageFile } = await importClipboard();
        const result = await readImageFile(filePath);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error).toContain('empty');
        }
      } finally {
        await fs.rm(tmpDir, { recursive: true, force: true });
      }
    });
  });
});
