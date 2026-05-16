import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { resolveFileInclusions, loadAgentFromFile } from '../../src/agent/customAgentLoader.js';

describe('File Inclusion ({file:...} syntax)', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'file-inclusion-'));
  });

  afterEach(async () => {
    await fs.promises.rm(tempDir, { recursive: true, force: true });
  });

  describe('resolveFileInclusions', () => {
    it('should replace {file:...} with referenced file content', async () => {
      fs.writeFileSync(path.join(tempDir, 'shared-context.md'), 'Shared context content here.');

      const content = 'Before {file:shared-context.md} After';
      const result = await resolveFileInclusions(content, tempDir);

      expect(result).toBe('Before Shared context content here. After');
    });

    it('should resolve relative paths correctly', async () => {
      const commonDir = path.join(tempDir, 'common');
      fs.mkdirSync(commonDir, { recursive: true });
      fs.writeFileSync(path.join(commonDir, 'rules.md'), 'Common rules content.');

      const subDir = path.join(tempDir, 'agents');
      fs.mkdirSync(subDir, { recursive: true });

      const content = 'Rules: {file:../common/rules.md}';
      const result = await resolveFileInclusions(content, subDir);

      expect(result).toBe('Rules: Common rules content.');
    });

    it('should produce comment marker for missing files', async () => {
      const content = 'Before {file:nonexistent.md} After';
      const result = await resolveFileInclusions(content, tempDir);

      expect(result).toBe('Before <!-- {file:nonexistent.md} not found --> After');
    });

    it('should handle recursive inclusions (depth 1)', async () => {
      fs.writeFileSync(path.join(tempDir, 'inner.md'), 'Inner content');
      fs.writeFileSync(path.join(tempDir, 'outer.md'), 'Outer [{file:inner.md}] end');

      const content = 'Start {file:outer.md} finish';
      const result = await resolveFileInclusions(content, tempDir);

      expect(result).toBe('Start Outer [Inner content] end finish');
    });

    it('should stop expanding at depth 3', async () => {
      // Create a chain: level0 -> level1 -> level2 -> level3
      fs.writeFileSync(path.join(tempDir, 'level3.md'), 'level3 content');
      fs.writeFileSync(path.join(tempDir, 'level2.md'), 'level2 {file:level3.md}');
      fs.writeFileSync(path.join(tempDir, 'level1.md'), 'level1 {file:level2.md}');
      fs.writeFileSync(path.join(tempDir, 'level0.md'), 'level0 {file:level1.md}');

      // Start at depth 0: resolves level0 (depth 0) -> level1 (depth 1) -> level2 (depth 2)
      // At depth 3, level3.md should NOT be expanded
      const content = '{file:level0.md}';
      const result = await resolveFileInclusions(content, tempDir);

      expect(result).toBe(
        'level0 level1 level2 <!-- {file:level3.md} max inclusion depth reached -->'
      );
    });

    it('should handle multiple inclusions in same content', async () => {
      fs.writeFileSync(path.join(tempDir, 'file-a.md'), 'Content A');
      fs.writeFileSync(path.join(tempDir, 'file-b.md'), 'Content B');

      const content = 'First: {file:file-a.md}, Second: {file:file-b.md}';
      const result = await resolveFileInclusions(content, tempDir);

      expect(result).toBe('First: Content A, Second: Content B');
    });

    it('should leave non-matching braces alone', async () => {
      const content = 'This is {notfile:something} and {other:stuff} unchanged';
      const result = await resolveFileInclusions(content, tempDir);

      expect(result).toBe('This is {notfile:something} and {other:stuff} unchanged');
    });

    it('should return content unchanged when no inclusions present', async () => {
      const content = 'Plain content with no inclusions.';
      const result = await resolveFileInclusions(content, tempDir);

      expect(result).toBe('Plain content with no inclusions.');
    });

    it('should handle empty file content', async () => {
      fs.writeFileSync(path.join(tempDir, 'empty.md'), '');

      const content = 'Before {file:empty.md} After';
      const result = await resolveFileInclusions(content, tempDir);

      expect(result).toBe('Before  After');
    });
  });

  describe('loadAgentFromFile with file inclusions', () => {
    it('should resolve file inclusions in agent system prompt', async () => {
      fs.writeFileSync(path.join(tempDir, 'shared-rules.md'), 'Always follow these rules.');

      const agentFile = path.join(tempDir, 'my-agent.md');
      fs.writeFileSync(
        agentFile,
        `---
name: "Test Agent"
description: "Agent with file inclusion"
---

You are an agent.

{file:shared-rules.md}

Do your best.
`
      );

      const agent = await loadAgentFromFile(agentFile, 'project-local');

      expect(agent).not.toBeNull();
      expect(agent!.systemPrompt).toContain('Always follow these rules.');
      expect(agent!.systemPrompt).toContain('You are an agent.');
      expect(agent!.systemPrompt).toContain('Do your best.');
      expect(agent!.systemPrompt).not.toContain('{file:');
    });

    it('should handle missing referenced file gracefully', async () => {
      const agentFile = path.join(tempDir, 'agent-missing-ref.md');
      fs.writeFileSync(
        agentFile,
        `---
name: "Missing Ref Agent"
description: "Agent with missing file ref"
---

You are an agent.

{file:does-not-exist.md}

Continue working.
`
      );

      const agent = await loadAgentFromFile(agentFile, 'project-local');

      expect(agent).not.toBeNull();
      expect(agent!.systemPrompt).toContain('<!-- {file:does-not-exist.md} not found -->');
      expect(agent!.systemPrompt).toContain('You are an agent.');
    });
  });
});
