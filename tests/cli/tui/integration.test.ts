import * as fs from 'node:fs';
import * as path from 'node:path';
import { describe, it, expect, vi } from 'vitest';

// Mock the TUI module
vi.mock('../../../src/cli/tui/index.js', () => ({
  startTui: vi.fn(async () => {}),
}));

// Mock other heavy dependencies so the import doesn't fail
vi.mock('../../../src/git/autoCommit.js', () => ({
  createAutoCommitManager: vi.fn(),
}));
vi.mock('../../../src/git/config.js', () => ({
  loadGitConfig: vi.fn(async () => ({
    dirtyCommits: false,
    commitVerify: false,
    attribution: { style: 'co-authored-by' },
  })),
}));
vi.mock('../../../src/git/dirtyFiles.js', () => ({
  commitDirtyFiles: vi.fn(async () => ({ committed: false, filesCommitted: [] })),
}));
vi.mock('../../../src/context/repoMap.js', () => ({
  RepoMapManager: vi.fn(),
}));
vi.mock('../../../src/providers/index.js', () => ({
  getDefaultModel: vi.fn(() => 'default-model'),
}));

describe('T037: interactive command uses startTui', () => {
  it('interactive.ts imports startTui from the tui package', async () => {
    const content = fs.readFileSync(
      path.resolve(process.cwd(), 'src/cli/commands/interactive.ts'),
      'utf-8'
    );
    expect(content).toContain("import { startTui } from '../tui/index.js'");
  });

  it('interactive.ts does not actively import startInteractive', async () => {
    const content = fs.readFileSync(
      path.resolve(process.cwd(), 'src/cli/commands/interactive.ts'),
      'utf-8'
    );
    // The old import should be commented out, not active
    const lines = content.split('\n');
    const activeStartInteractiveImports = lines.filter(
      (line) =>
        line.includes('startInteractive') &&
        !line.trimStart().startsWith('//') &&
        !line.trimStart().startsWith('*') &&
        !line.trimStart().startsWith('/*')
    );
    expect(activeStartInteractiveImports).toHaveLength(0);
  });

  it('interactive.ts calls startTui in its action handler', () => {
    const content = fs.readFileSync(
      path.resolve(process.cwd(), 'src/cli/commands/interactive.ts'),
      'utf-8'
    );
    // Verify startTui is invoked (not just imported)
    expect(content).toMatch(/await\s+startTui\s*\(/);
  });

  it('startTui mock is importable from tui/index', async () => {
    const { startTui } = await import('../../../src/cli/tui/index.js');
    expect(startTui).toBeDefined();
    expect(vi.isMockFunction(startTui)).toBe(true);
  });
});

describe('T038: non-interactive commands do not import TUI', () => {
  it('chat.ts does not import from tui', () => {
    const content = fs.readFileSync(
      path.resolve(process.cwd(), 'src/cli/commands/chat.ts'),
      'utf-8'
    );
    expect(content).not.toContain("from '../tui/");
    expect(content).not.toContain('from "../tui/');
    expect(content).not.toContain("from '../../cli/tui/");
    expect(content).not.toContain('from "../../cli/tui/');
  });

  it('chat.ts does not reference startTui', () => {
    const content = fs.readFileSync(
      path.resolve(process.cwd(), 'src/cli/commands/chat.ts'),
      'utf-8'
    );
    expect(content).not.toContain('startTui');
  });
});
