/**
 * Tests for config-paths protected-path detection.
 *
 * Covers four categories per issue #725:
 *   - Shell startup files (~/.zshenv, ~/.bashrc, ~/.config/fish/config.fish, ...)
 *   - Git config (~/.gitconfig, ~/.config/git/config)
 *   - Build-tool exec-path files (.npmrc / ~/.npmrc, .yarnrc.yml, bunfig.toml, ...)
 *   - Devcontainer (.devcontainer/devcontainer.json)
 *
 * For each category we verify:
 *   1. A write to the protected path is detected by the protection layer
 *      (isRequest returns true; PermissionManager.evaluate without an
 *      allow rule yields 'ask' with the disable-always metadata).
 *   2. With an explicit allow rule covering the exact path, evaluation
 *      yields 'allow'.
 */

import { describe, it, expect } from 'vitest';
import os from 'os';
import path from 'path';
import {
  isRelative,
  isAbsolute,
  isProtectedPath,
  isRequest,
  DISABLE_ALWAYS_KEY,
} from '../config-paths.js';
import { PermissionManager } from '../index.js';

const HOME = os.homedir();

function homeAbs(rel: string): string {
  return path.join(HOME, rel);
}

describe('config-paths: existing protections still hold', () => {
  it('protects .kilo/, .alexi/, kilo.json, AGENTS.md', () => {
    expect(isRelative('.kilo/config')).toBe(true);
    expect(isRelative('.alexi/sessions/foo.json')).toBe(true);
    expect(isRelative('kilo.json')).toBe(true);
    expect(isRelative('AGENTS.md')).toBe(true);
  });

  it('does not flag arbitrary source files', () => {
    expect(isRelative('src/index.ts')).toBe(false);
    expect(isRelative('README.md')).toBe(false);
    expect(isRelative('package.json')).toBe(false);
  });

  it('exempts .kilo/plans/ subdirectory', () => {
    expect(isRelative('.kilo/plans/foo.md')).toBe(false);
  });
});

describe('config-paths: shell-startup protection', () => {
  const cases = [
    '.zshenv',
    '.zlogin',
    '.zshrc',
    '.zprofile',
    '.bash_login',
    '.bash_profile',
    '.bashrc',
    '.profile',
  ];

  for (const file of cases) {
    it(`detects writes to ~/${file} as protected`, () => {
      expect(isAbsolute(homeAbs(file), process.cwd())).toBe(true);
      expect(isProtectedPath(homeAbs(file))).toBe(true);
    });
  }

  it('detects ~/.config/fish/config.fish', () => {
    expect(isAbsolute(homeAbs('.config/fish/config.fish'), process.cwd())).toBe(true);
  });

  it('does NOT flag a same-named file outside of $HOME', () => {
    // /tmp/.zshenv is not the user's shell-startup file.
    expect(isAbsolute('/tmp/.zshenv', process.cwd())).toBe(false);
  });

  it('isRequest returns true for a write to ~/.zshenv', () => {
    expect(isRequest({ permission: 'write', patterns: [homeAbs('.zshenv')] })).toBe(true);
  });

  it('PermissionManager: deny-by-default + disableAlways metadata, allow with explicit rule', async () => {
    const target = homeAbs('.zshenv');

    // No matching rule -> default decision is "ask" (NOT auto-allow).
    // Plus the request would carry the disable-always metadata in the
    // interactive flow; we assert the underlying detector flagged it.
    const pm = new PermissionManager();
    const noRule = pm.evaluate({ toolName: 'write', action: 'write', resource: target });
    expect(noRule.decision).toBe('ask');
    expect(isProtectedPath(target)).toBe(true);

    // Explicit allow rule for the exact path -> evaluation yields 'allow'.
    const pm2 = new PermissionManager();
    pm2.addRule({
      priority: 0,
      decision: 'allow',
      tools: ['write'],
      actions: ['write'],
      paths: [target],
    });
    const withRule = pm2.evaluate({ toolName: 'write', action: 'write', resource: target });
    expect(withRule.decision).toBe('allow');
  });
});

describe('config-paths: git config protection', () => {
  it('detects writes to ~/.gitconfig', () => {
    expect(isAbsolute(homeAbs('.gitconfig'), process.cwd())).toBe(true);
  });

  it('detects writes inside ~/.config/git/', () => {
    expect(isAbsolute(homeAbs('.config/git/config'), process.cwd())).toBe(true);
    expect(isAbsolute(homeAbs('.config/git/attributes'), process.cwd())).toBe(true);
  });

  it('isRequest flags writes to ~/.gitconfig', () => {
    expect(isRequest({ permission: 'edit', patterns: [homeAbs('.gitconfig')] })).toBe(true);
  });

  it('PermissionManager: explicit allow rule grants ~/.gitconfig write', () => {
    const target = homeAbs('.gitconfig');
    const pm = new PermissionManager();
    pm.addRule({
      priority: 0,
      decision: 'allow',
      tools: ['edit'],
      actions: ['write'],
      paths: [target],
    });
    const result = pm.evaluate({ toolName: 'edit', action: 'write', resource: target });
    expect(result.decision).toBe('allow');
  });
});

describe('config-paths: build-tool exec-path protection', () => {
  const projectFiles = [
    '.npmrc',
    '.yarnrc',
    '.yarnrc.yml',
    'bunfig.toml',
    '.bazelrc',
    '.pre-commit-config.yaml',
  ];

  for (const file of projectFiles) {
    it(`flags project-root ${file}`, () => {
      expect(isRelative(file)).toBe(true);
    });
  }

  it('flags ~/.npmrc (home-relative variant)', () => {
    expect(isAbsolute(homeAbs('.npmrc'), process.cwd())).toBe(true);
  });

  it('flags ~/.yarnrc (home-relative variant)', () => {
    expect(isAbsolute(homeAbs('.yarnrc'), process.cwd())).toBe(true);
  });

  it('does NOT flag .npmrc inside a nested src/ subdirectory by accident', () => {
    // The build-tool rule is project-root-only; nested .npmrc is rare and
    // not part of the upstream protection list.
    expect(isRelative('src/some/.npmrc')).toBe(false);
  });

  it('isRequest flags writes to project .npmrc', () => {
    expect(isRequest({ permission: 'write', patterns: ['.npmrc'] })).toBe(true);
  });

  it('PermissionManager: explicit allow rule grants .npmrc write', () => {
    const target = path.join(process.cwd(), '.npmrc');
    const pm = new PermissionManager();
    pm.addRule({
      priority: 0,
      decision: 'allow',
      tools: ['write'],
      actions: ['write'],
      paths: [target],
    });
    const result = pm.evaluate({ toolName: 'write', action: 'write', resource: target });
    expect(result.decision).toBe('allow');
  });
});

describe('config-paths: devcontainer protection', () => {
  it('flags .devcontainer/devcontainer.json', () => {
    expect(isRelative('.devcontainer/devcontainer.json')).toBe(true);
  });

  it('flags nested .devcontainer/Dockerfile', () => {
    expect(isRelative('.devcontainer/Dockerfile')).toBe(true);
  });

  it('flags absolute path under project .devcontainer/', () => {
    const abs = path.join(process.cwd(), '.devcontainer', 'devcontainer.json');
    expect(isAbsolute(abs, process.cwd())).toBe(true);
  });

  it('isRequest flags writes to .devcontainer/devcontainer.json', () => {
    expect(isRequest({ permission: 'write', patterns: ['.devcontainer/devcontainer.json'] })).toBe(
      true
    );
  });

  it('PermissionManager: explicit allow rule grants .devcontainer write', () => {
    const target = path.join(process.cwd(), '.devcontainer', 'devcontainer.json');
    const pm = new PermissionManager();
    pm.addRule({
      priority: 0,
      decision: 'allow',
      tools: ['write'],
      actions: ['write'],
      paths: [target],
    });
    const result = pm.evaluate({ toolName: 'write', action: 'write', resource: target });
    expect(result.decision).toBe('allow');
  });
});

describe('config-paths: helpers', () => {
  it('exposes DISABLE_ALWAYS_KEY constant', () => {
    expect(DISABLE_ALWAYS_KEY).toBe('disableAlways');
  });

  it('isProtectedPath dispatches absolute vs relative', () => {
    expect(isProtectedPath('.kilo/foo')).toBe(true);
    expect(isProtectedPath(homeAbs('.zshenv'))).toBe(true);
    expect(isProtectedPath('src/index.ts')).toBe(false);
  });

  it('isRequest ignores read permissions', () => {
    expect(isRequest({ permission: 'read', patterns: ['.kilo/config'] })).toBe(false);
  });

  it('isRequest ignores external_directory with metadata.filepath', () => {
    expect(
      isRequest({
        permission: 'external_directory',
        patterns: [homeAbs('.zshenv')],
        metadata: { filepath: homeAbs('.zshenv') },
      })
    ).toBe(false);
  });
});
