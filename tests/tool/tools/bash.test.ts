import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs/promises';
import * as path from 'path';
import os from 'os';

// Mock the tool index module
vi.mock('../../../src/tool/index.js', async () => {
  const actual = await vi.importActual('../../../src/tool/index.js');
  return {
    ...actual,
    // Override defineTool to bypass permission checks
    defineTool: (def: any) => ({
      ...def,
      execute: def.execute,
      executeUnsafe: def.execute,
      toFunctionSchema: () => ({
        name: def.name,
        description: def.description,
        parameters: {},
      }),
    }),
  };
});

import { bashTool } from '../../../src/tool/tools/bash.js';
import type { ToolContext } from '../../../src/tool/index.js';

describe('Bash Tool', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'bash-tool-test-'));
  });

  afterEach(async () => {
    await fs.rm(tempDir, { recursive: true, force: true });
  });

  describe('ALEXI_SESSION_ID environment variable', () => {
    it('should expose ALEXI_SESSION_ID matching context.sessionId', async () => {
      const sessionId = 'test-session-abc-123';
      const contextWithSession: ToolContext = { workdir: tempDir, sessionId };

      const result = await bashTool.execute(
        { command: 'echo "$ALEXI_SESSION_ID"' },
        contextWithSession
      );

      expect(result.success).toBe(true);
      expect(result.data?.stdout.trim()).toBe(sessionId);
    });

    it('should set ALEXI_SESSION_ID to empty string when sessionId is undefined', async () => {
      const contextWithoutSession: ToolContext = { workdir: tempDir };

      const result = await bashTool.execute(
        { command: 'echo "[$ALEXI_SESSION_ID]"' },
        contextWithoutSession
      );

      expect(result.success).toBe(true);
      expect(result.data?.stdout.trim()).toBe('[]');
    });
  });
});
