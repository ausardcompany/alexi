/**
 * Focused tests for the bash / shell branch of the definitions tool:
 *   - `.zsh` extension is treated as bash
 *   - shebang-only shell scripts (no `.sh` extension) are detected
 *   - top-level constant assignments (UPPER_SNAKE) are extracted
 *   - `export FOO=bar` is flagged as exported, `readonly` / plain are not
 *   - `types: ['function']` filter excludes constants
 *   - real-world sample script exercises functions + constants together
 *
 * Existing POSIX / bash-keyword function coverage stays in
 * `src/tool/tools/__tests__/definitions.test.ts`. This file only covers
 * the incremental behaviour added for shell-script support.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { definitionsTool } from '../../../src/tool/tools/definitions.js';
import type { ToolContext } from '../../../src/tool/index.js';

describe('Definitions Tool - Bash (extended)', () => {
  let tempDir: string;
  let context: ToolContext;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'definitions-bash-'));
    context = { workdir: tempDir };
  });

  afterEach(() => {
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  describe('extension detection', () => {
    it('classifies .zsh files as bash', async () => {
      const filePath = path.join(tempDir, 'setup.zsh');
      fs.writeFileSync(
        filePath,
        `#!/bin/zsh
init_env() {
  echo "zsh"
}`
      );

      const result = await definitionsTool.executeUnsafe({ filePath }, context);

      expect(result.success).toBe(true);
      expect(result.data?.language).toBe('bash');
      const names = result.data?.definitions.map((d) => d.name) ?? [];
      expect(names).toContain('init_env');
    });
  });

  describe('shebang detection (no shell extension)', () => {
    it('detects bash shebang on an extensionless script', async () => {
      const filePath = path.join(tempDir, 'deploy');
      fs.writeFileSync(
        filePath,
        `#!/bin/bash
release() {
  echo "release"
}`
      );

      const result = await definitionsTool.executeUnsafe({ filePath }, context);

      expect(result.success).toBe(true);
      expect(result.data?.language).toBe('bash');
      const release = result.data?.definitions.find((d) => d.name === 'release');
      expect(release?.type).toBe('function');
    });

    it('detects `#!/usr/bin/env bash` shebang', async () => {
      const filePath = path.join(tempDir, 'run');
      fs.writeFileSync(
        filePath,
        `#!/usr/bin/env bash
do_work() {
  :
}`
      );

      const result = await definitionsTool.executeUnsafe({ filePath }, context);

      expect(result.success).toBe(true);
      expect(result.data?.language).toBe('bash');
      expect(result.data?.definitions.find((d) => d.name === 'do_work')).toBeDefined();
    });

    it('detects `#!/bin/sh` shebang', async () => {
      const filePath = path.join(tempDir, 'posix-script');
      fs.writeFileSync(
        filePath,
        `#!/bin/sh
main() {
  echo hi
}`
      );

      const result = await definitionsTool.executeUnsafe({ filePath }, context);

      expect(result.success).toBe(true);
      expect(result.data?.language).toBe('bash');
    });

    it('rejects extensionless files without a shell shebang', async () => {
      const filePath = path.join(tempDir, 'notes');
      fs.writeFileSync(filePath, `just plain text, not a shell script\n`);

      const result = await definitionsTool.executeUnsafe({ filePath }, context);

      expect(result.success).toBe(false);
      expect(result.error).toMatch(/Unsupported file type/);
    });

    it('rejects extensionless files with a non-shell shebang', async () => {
      const filePath = path.join(tempDir, 'run.py-like');
      fs.writeFileSync(
        filePath,
        `#!/usr/bin/env python
def foo():
    pass
`
      );

      const result = await definitionsTool.executeUnsafe({ filePath }, context);

      // No matching extension (empty ext) and shebang is python, not shell.
      expect(result.success).toBe(false);
    });
  });

  describe('variable / constant assignments', () => {
    it('extracts top-level UPPER_SNAKE constant assignments', async () => {
      const filePath = path.join(tempDir, 'config.sh');
      fs.writeFileSync(
        filePath,
        `#!/bin/bash
API_URL="https://example.com"
MAX_RETRIES=5
LOG_LEVEL=debug
`
      );

      const result = await definitionsTool.executeUnsafe({ filePath }, context);

      expect(result.success).toBe(true);
      const constants = result.data?.definitions.filter((d) => d.type === 'const') ?? [];
      const names = constants.map((c) => c.name).sort();
      expect(names).toEqual(['API_URL', 'LOG_LEVEL', 'MAX_RETRIES']);
      for (const c of constants) {
        expect(c.exported).toBe(false);
      }
    });

    it('flags `export FOO=bar` as exported but not `readonly` / plain', async () => {
      const filePath = path.join(tempDir, 'flags.sh');
      fs.writeFileSync(
        filePath,
        `#!/bin/bash
export PUBLIC_TOKEN="abc"
readonly INTERNAL_TOKEN="xyz"
PLAIN_VAR="123"
`
      );

      const result = await definitionsTool.executeUnsafe({ filePath }, context);

      expect(result.success).toBe(true);
      const byName = new Map((result.data?.definitions ?? []).map((d) => [d.name, d] as const));
      expect(byName.get('PUBLIC_TOKEN')?.exported).toBe(true);
      expect(byName.get('PUBLIC_TOKEN')?.signature).toBe('export PUBLIC_TOKEN');
      expect(byName.get('INTERNAL_TOKEN')?.exported).toBe(false);
      expect(byName.get('INTERNAL_TOKEN')?.signature).toBe('readonly INTERNAL_TOKEN');
      expect(byName.get('PLAIN_VAR')?.exported).toBe(false);
      expect(byName.get('PLAIN_VAR')?.signature).toBe('PLAIN_VAR');
    });

    it('ignores lowercase / mixed-case assignments to avoid noisy in-function locals', async () => {
      const filePath = path.join(tempDir, 'noisy.sh');
      fs.writeFileSync(
        filePath,
        `#!/bin/bash
build() {
  tmp="/tmp/x"
  outFile="$tmp/out"
  echo "$outFile"
}

REAL_CONST="keep-me"
`
      );

      const result = await definitionsTool.executeUnsafe({ filePath }, context);

      expect(result.success).toBe(true);
      const constants = result.data?.definitions.filter((d) => d.type === 'const') ?? [];
      const names = constants.map((c) => c.name);
      expect(names).toEqual(['REAL_CONST']);
    });

    it('does not treat `==` comparisons as assignments', async () => {
      const filePath = path.join(tempDir, 'compare.sh');
      fs.writeFileSync(
        filePath,
        `#!/bin/bash
if [ "$FOO" == "bar" ]; then
  echo yes
fi
`
      );

      const result = await definitionsTool.executeUnsafe({ filePath }, context);

      expect(result.success).toBe(true);
      const constants = result.data?.definitions.filter((d) => d.type === 'const') ?? [];
      expect(constants).toHaveLength(0);
    });
  });

  describe('type filter interaction', () => {
    it('respects `types: ["function"]` and excludes constants', async () => {
      const filePath = path.join(tempDir, 'both.sh');
      fs.writeFileSync(
        filePath,
        `#!/bin/bash
API_URL="https://example.com"
do_thing() {
  echo "$API_URL"
}
`
      );

      const result = await definitionsTool.executeUnsafe(
        { filePath, types: ['function'] },
        context
      );

      expect(result.success).toBe(true);
      const defs = result.data?.definitions ?? [];
      expect(defs.map((d) => d.name)).toEqual(['do_thing']);
    });

    it('respects `types: ["const"]` and excludes functions', async () => {
      const filePath = path.join(tempDir, 'both.sh');
      fs.writeFileSync(
        filePath,
        `#!/bin/bash
API_URL="https://example.com"
do_thing() {
  echo "$API_URL"
}
`
      );

      const result = await definitionsTool.executeUnsafe({ filePath, types: ['const'] }, context);

      expect(result.success).toBe(true);
      const defs = result.data?.definitions ?? [];
      expect(defs.map((d) => d.name)).toEqual(['API_URL']);
    });
  });

  describe('real-world script', () => {
    it('extracts functions and constants together, sorted by line', async () => {
      const filePath = path.join(tempDir, 'deploy.sh');
      fs.writeFileSync(
        filePath,
        `#!/usr/bin/env bash
# Deploy script for the app.
set -euo pipefail

export APP_NAME="alexi"
readonly BUILD_DIR="/tmp/build"
MAX_ATTEMPTS=3

build() {
  echo "building $APP_NAME"
}

function deploy {
  echo "deploying"
}

cleanup() {
  rm -rf "$BUILD_DIR"
}
`
      );

      const result = await definitionsTool.executeUnsafe({ filePath }, context);

      expect(result.success).toBe(true);
      expect(result.data?.language).toBe('bash');

      const defs = result.data?.definitions ?? [];
      // Sorted by line.
      const lines = defs.map((d) => d.line);
      const sorted = [...lines].sort((a, b) => a - b);
      expect(lines).toEqual(sorted);

      const byName = new Map(defs.map((d) => [d.name, d] as const));
      expect(byName.get('APP_NAME')?.type).toBe('const');
      expect(byName.get('APP_NAME')?.exported).toBe(true);
      expect(byName.get('BUILD_DIR')?.type).toBe('const');
      expect(byName.get('MAX_ATTEMPTS')?.type).toBe('const');
      expect(byName.get('build')?.type).toBe('function');
      expect(byName.get('deploy')?.type).toBe('function');
      expect(byName.get('cleanup')?.type).toBe('function');
    });
  });
});
