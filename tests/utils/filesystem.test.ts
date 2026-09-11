/**
 * Tests for the home-directory / filesystem-root indexing guard exposed
 * from `src/utils/filesystem.ts`.
 *
 * Origin: kilocode #13960. Walking $HOME or `/` triggers catastrophic
 * memory exhaustion (10+ GB RSS reported in #13930 / #13905), so tool
 * call sites (`glob`, `codesearch`) refuse those directories via
 * {@link isUnsafeWorkspaceRoot}.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs/promises';
import * as path from 'path';
import os from 'os';

import {
  isUnsafeWorkspaceRoot,
  UNSAFE_WORKSPACE_ROOT_MESSAGE,
} from '../../src/utils/filesystem.js';

describe('isUnsafeWorkspaceRoot', () => {
  let tempDir: string;
  let fakeHome: string;
  const originalTestHome = process.env.ALEXI_TEST_HOME;

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'fs-guard-test-'));
    fakeHome = await fs.mkdtemp(path.join(os.tmpdir(), 'fs-guard-home-'));
    // Pin the home-directory anchor via ALEXI_TEST_HOME so we can test
    // the guard without mutating the real HOME (respected by the
    // underlying `allowed()` predicate in src/core/kilocode/fff.ts).
    process.env.ALEXI_TEST_HOME = fakeHome;
  });

  afterEach(async () => {
    if (originalTestHome === undefined) {
      delete process.env.ALEXI_TEST_HOME;
    } else {
      process.env.ALEXI_TEST_HOME = originalTestHome;
    }
    await fs.rm(tempDir, { recursive: true, force: true });
    await fs.rm(fakeHome, { recursive: true, force: true });
  });

  it('refuses the user home directory', () => {
    expect(isUnsafeWorkspaceRoot(fakeHome)).toBe(true);
  });

  it('refuses the POSIX filesystem root', () => {
    // The check is platform-aware; only assert on POSIX so this passes
    // in CI (Linux/macOS).
    if (process.platform !== 'win32') {
      expect(isUnsafeWorkspaceRoot('/')).toBe(true);
    }
  });

  it('allows a normal project directory outside home', () => {
    expect(isUnsafeWorkspaceRoot(tempDir)).toBe(false);
  });

  it('allows a subdirectory of the home directory', async () => {
    const projectInsideHome = path.join(fakeHome, 'my-project');
    await fs.mkdir(projectInsideHome);
    expect(isUnsafeWorkspaceRoot(projectInsideHome)).toBe(false);
  });

  it('respects the explicit home override argument', () => {
    expect(isUnsafeWorkspaceRoot(tempDir, tempDir)).toBe(true);
    expect(isUnsafeWorkspaceRoot(tempDir, fakeHome)).toBe(false);
  });

  it('exposes a canonical, user-facing error message', () => {
    expect(UNSAFE_WORKSPACE_ROOT_MESSAGE).toContain('home directory');
    expect(UNSAFE_WORKSPACE_ROOT_MESSAGE).toContain('filesystem root');
    expect(UNSAFE_WORKSPACE_ROOT_MESSAGE).toContain('OOM');
    expect(UNSAFE_WORKSPACE_ROOT_MESSAGE).toContain('cd into a project directory');
  });
});
