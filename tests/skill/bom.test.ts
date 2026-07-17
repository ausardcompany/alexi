import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { loadSkillFromFile, loadSkillsFromDirectory } from '../../src/skill/index.js';

const BOM_BYTES = Buffer.from([0xef, 0xbb, 0xbf]);

/**
 * Regression coverage for issue #1025: a SKILL.md saved with a UTF-8 BOM
 * (Windows Notepad's default "UTF-8 with BOM" encoding) must be loaded
 * correctly. Without the BOM strip, gray-matter silently returns empty
 * frontmatter data because the `---` marker no longer sits at byte 0.
 */
describe('skill loader: UTF-8 BOM tolerance', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'alexi-skill-bom-'));
  });

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it('parses frontmatter from a BOM-prefixed SKILL.md', () => {
    const filePath = path.join(tempDir, 'bom-skill.md');
    const body = `---
id: bom-skill
name: BOM Skill
description: A skill saved by Windows Notepad with UTF-8 BOM
category: encoding
tags:
  - regression
  - windows
---

You are a skill defined in a BOM-prefixed file.
`;
    fs.writeFileSync(filePath, Buffer.concat([BOM_BYTES, Buffer.from(body, 'utf-8')]));

    const skill = loadSkillFromFile(filePath);

    expect(skill).not.toBeNull();
    // Without the BOM strip these would fall back to filename/empty defaults.
    expect(skill?.id).toBe('bom-skill');
    expect(skill?.name).toBe('BOM Skill');
    expect(skill?.description).toBe('A skill saved by Windows Notepad with UTF-8 BOM');
    expect(skill?.category).toBe('encoding');
    expect(skill?.tags).toEqual(['regression', 'windows']);
    // Prompt content should be preserved verbatim (with the trailing newline
    // trimmed by the loader).
    expect(skill?.prompt).toBe('You are a skill defined in a BOM-prefixed file.');
  });

  it('loadSkillsFromDirectory picks up BOM-prefixed SKILL.md files', () => {
    const filePath = path.join(tempDir, 'nested-bom.md');
    const body = `---
id: nested-bom-skill
name: Nested BOM Skill
description: Loaded through the directory loader
---

Body.
`;
    fs.writeFileSync(filePath, Buffer.concat([BOM_BYTES, Buffer.from(body, 'utf-8')]));

    const skills = loadSkillsFromDirectory(tempDir);
    expect(skills).toHaveLength(1);
    expect(skills[0].id).toBe('nested-bom-skill');
    expect(skills[0].name).toBe('Nested BOM Skill');
  });

  it('non-BOM SKILL.md still loads (no regression)', () => {
    const filePath = path.join(tempDir, 'plain.md');
    const body = `---
id: plain-skill
name: Plain Skill
description: No BOM
---

Body.
`;
    fs.writeFileSync(filePath, body, 'utf-8');

    const skill = loadSkillFromFile(filePath);
    expect(skill).not.toBeNull();
    expect(skill?.id).toBe('plain-skill');
    expect(skill?.name).toBe('Plain Skill');
  });
});
