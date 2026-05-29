/**
 * Tests for markdown command loader frontmatter parsing,
 * specifically the disallowed-tools / disallowedTools / disabledTools
 * synonyms (Claude Code v2.1.152 parity).
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { loadCommandFromFile } from '../../src/command/index.js';

describe('loadCommandFromFile - disallowed-tools frontmatter', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'cmd-frontmatter-'));
  });

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it('should parse kebab-case "disallowed-tools" into disabledTools', () => {
    const content = `---
name: kebab-cmd
description: Uses upstream kebab-case
disallowed-tools:
  - bash
  - write
---

Template body.
`;
    const filePath = path.join(tempDir, 'kebab-cmd.md');
    fs.writeFileSync(filePath, content);

    const cmd = loadCommandFromFile(filePath);

    expect(cmd).not.toBeNull();
    expect(cmd!.disabledTools).toEqual(['bash', 'write']);
  });

  it('should parse camelCase "disallowedTools" into disabledTools', () => {
    const content = `---
name: camel-cmd
description: Uses camelCase alias
disallowedTools:
  - bash
---

Template body.
`;
    const filePath = path.join(tempDir, 'camel-cmd.md');
    fs.writeFileSync(filePath, content);

    const cmd = loadCommandFromFile(filePath);

    expect(cmd).not.toBeNull();
    expect(cmd!.disabledTools).toEqual(['bash']);
  });

  it('should parse legacy "disabledTools" frontmatter', () => {
    const content = `---
name: legacy-cmd
description: Uses legacy form
disabledTools:
  - bash
  - delete
---

Template body.
`;
    const filePath = path.join(tempDir, 'legacy-cmd.md');
    fs.writeFileSync(filePath, content);

    const cmd = loadCommandFromFile(filePath);

    expect(cmd).not.toBeNull();
    expect(cmd!.disabledTools).toEqual(['bash', 'delete']);
  });

  it('should prefer kebab-case "disallowed-tools" when multiple aliases are present', () => {
    const content = `---
name: prio-cmd
disallowed-tools:
  - bash
disallowedTools:
  - write
disabledTools:
  - read
---

Body.
`;
    const filePath = path.join(tempDir, 'prio-cmd.md');
    fs.writeFileSync(filePath, content);

    const cmd = loadCommandFromFile(filePath);

    expect(cmd).not.toBeNull();
    expect(cmd!.disabledTools).toEqual(['bash']);
  });

  it('should also parse the "tools" allowlist from frontmatter', () => {
    const content = `---
name: allow-cmd
tools:
  - read
  - grep
---

Body.
`;
    const filePath = path.join(tempDir, 'allow-cmd.md');
    fs.writeFileSync(filePath, content);

    const cmd = loadCommandFromFile(filePath);

    expect(cmd).not.toBeNull();
    expect(cmd!.tools).toEqual(['read', 'grep']);
  });

  it('should leave tool fields undefined when not provided', () => {
    const content = `---
name: bare-cmd
description: No tool fields
---

Body.
`;
    const filePath = path.join(tempDir, 'bare-cmd.md');
    fs.writeFileSync(filePath, content);

    const cmd = loadCommandFromFile(filePath);

    expect(cmd).not.toBeNull();
    expect(cmd!.disabledTools).toBeUndefined();
    expect(cmd!.tools).toBeUndefined();
  });
});
