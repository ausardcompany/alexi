import { describe, it, expect } from 'vitest';
import { buildHeuristicMessage } from '../../src/git/commitMessage.js';
import type { ChangedFile } from '../../src/git/commitMessage.js';

describe('buildHeuristicMessage', () => {
  it('uses type=test for test files', () => {
    const files: ChangedFile[] = [{ filePath: 'src/foo.test.ts', toolName: 'write' }];
    const msg = buildHeuristicMessage(files, true);
    expect(msg).toMatch(/^test:/);
  });

  it('uses type=docs for markdown files', () => {
    const files: ChangedFile[] = [{ filePath: 'docs/README.md', toolName: 'write' }];
    const msg = buildHeuristicMessage(files, true);
    expect(msg).toMatch(/^docs:/);
  });

  it('uses type=chore for delete tool', () => {
    const files: ChangedFile[] = [{ filePath: 'src/old.ts', toolName: 'delete' }];
    const msg = buildHeuristicMessage(files, true);
    expect(msg).toMatch(/^chore:/);
  });

  it('uses type=feat for generic source files', () => {
    const files: ChangedFile[] = [{ filePath: 'src/feature.ts', toolName: 'write' }];
    const msg = buildHeuristicMessage(files, true);
    expect(msg).toMatch(/^feat:/);
  });

  it('includes single filename in message', () => {
    const files: ChangedFile[] = [{ filePath: 'src/foo.ts', toolName: 'edit' }];
    const msg = buildHeuristicMessage(files, true);
    expect(msg).toContain('foo.ts');
  });

  it('includes multiple filenames when <= 3', () => {
    const files: ChangedFile[] = [
      { filePath: 'src/a.ts', toolName: 'edit' },
      { filePath: 'src/b.ts', toolName: 'edit' },
    ];
    const msg = buildHeuristicMessage(files, true);
    expect(msg).toContain('a.ts');
    expect(msg).toContain('b.ts');
  });

  it('summarises when > 3 files', () => {
    const files: ChangedFile[] = [
      { filePath: 'src/a.ts', toolName: 'edit' },
      { filePath: 'src/b.ts', toolName: 'edit' },
      { filePath: 'src/c.ts', toolName: 'edit' },
      { filePath: 'src/d.ts', toolName: 'edit' },
    ];
    const msg = buildHeuristicMessage(files, true);
    // Should mention first 2 + "and 2 more"
    expect(msg).toMatch(/and \d+ more/);
  });

  it('returns plain message without type prefix when conventional=false', () => {
    const files: ChangedFile[] = [{ filePath: 'src/feature.ts', toolName: 'write' }];
    const msg = buildHeuristicMessage(files, false);
    expect(msg).not.toMatch(/^\w+:/);
    expect(msg).toMatch(/^Update /);
  });
});
