/**
 * Tests for the `/plugins` and `/skills` interactive REPL slash commands.
 *
 * The interactive REPL imports plugin and skill modules dynamically inside
 * `handleCommand`, so we drive the real global managers rather than mocking
 * the dynamic-import target. Each test resets the singletons up front so
 * registrations don't leak between cases.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { handleCommand, printHelp, type ReplState } from '../interactive.js';
import {
  getPluginManager,
  loadPlugin,
  isEnabledHelper,
  type Plugin,
} from './_pluginTestHelpers.js';
import { getSkillRegistry, registerSkill, isSkillEnabled } from '../../skill/index.js';

/**
 * Build a minimal `ReplState` for tests. The `/plugins` and `/skills` paths
 * never touch `sessionManager`, so we cast a stub through `ReplState` to
 * avoid spinning up the real `SessionManager` (which would create files
 * under `~/.alexi/sessions/`).
 */
function makeState(): ReplState {
  return {
    sessionManager: {} as ReplState['sessionManager'],
    currentModel: 'test-model',
    autoRoute: false,
    preferCheap: false,
    isStreaming: false,
  };
}

function makePlugin(overrides: Partial<Plugin> = {}): Plugin {
  return {
    name: 'demo-plugin',
    version: '1.2.3',
    description: 'A test plugin',
    ...overrides,
  };
}

describe('interactive /plugins command', () => {
  let logSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(async () => {
    await getPluginManager().clear();
    logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(async () => {
    logSpy.mockRestore();
    await getPluginManager().clear();
  });

  it('lists each loaded plugin with name, version, and enabled state', async () => {
    await loadPlugin(makePlugin({ name: 'alpha', version: '0.1.0' }));
    await loadPlugin(makePlugin({ name: 'beta', version: '2.0.0' }));

    const handled = await handleCommand('/plugins', makeState());
    expect(handled).toBe(true);

    const output = logSpy.mock.calls.map((c: unknown[]) => c.join(' ')).join('\n');
    expect(output).toContain('alpha');
    expect(output).toContain('0.1.0');
    expect(output).toContain('beta');
    expect(output).toContain('2.0.0');
    expect(output).toContain('enabled');
  });

  it('prints a friendly notice when no plugins are loaded', async () => {
    const handled = await handleCommand('/plugins', makeState());
    expect(handled).toBe(true);
    const output = logSpy.mock.calls.map((c: unknown[]) => c.join(' ')).join('\n');
    expect(output).toContain('No plugins loaded');
  });

  it('toggles a plugin from enabled to disabled and back', async () => {
    await loadPlugin(makePlugin({ name: 'toggleable' }));
    expect(isEnabledHelper('toggleable')).toBe(true);

    await handleCommand('/plugins toggle toggleable', makeState());
    expect(isEnabledHelper('toggleable')).toBe(false);
    let output = logSpy.mock.calls.map((c: unknown[]) => c.join(' ')).join('\n');
    expect(output).toMatch(/toggleable/);
    expect(output).toMatch(/disabled/);

    logSpy.mockClear();
    await handleCommand('/plugins toggle toggleable', makeState());
    expect(isEnabledHelper('toggleable')).toBe(true);
    output = logSpy.mock.calls.map((c: unknown[]) => c.join(' ')).join('\n');
    expect(output).toMatch(/enabled/);
  });

  it('reports an error when toggling an unknown plugin', async () => {
    const handled = await handleCommand('/plugins toggle does-not-exist', makeState());
    expect(handled).toBe(true);
    const output = logSpy.mock.calls.map((c: unknown[]) => c.join(' ')).join('\n');
    expect(output).toMatch(/not loaded/i);
  });

  it('falls back to the list view for an unknown subcommand', async () => {
    await loadPlugin(makePlugin({ name: 'visible' }));
    const handled = await handleCommand('/plugins bogus', makeState());
    expect(handled).toBe(true);
    const output = logSpy.mock.calls.map((c: unknown[]) => c.join(' ')).join('\n');
    expect(output).toContain('visible');
    // Default branch must not have surfaced a toggle error
    expect(output).not.toMatch(/Toggle failed/);
  });
});

describe('interactive /skills command', () => {
  let logSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    getSkillRegistry().clear();
    logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    logSpy.mockRestore();
    getSkillRegistry().clear();
  });

  it('lists each registered skill with id and enabled state', async () => {
    registerSkill({
      id: 'reviewer',
      name: 'Reviewer',
      description: 'Reviews code',
      prompt: 'be thorough',
    });
    registerSkill({
      id: 'planner',
      name: 'Planner',
      description: 'Plans tasks',
      prompt: 'be deliberate',
    });

    const handled = await handleCommand('/skills', makeState());
    expect(handled).toBe(true);

    const output = logSpy.mock.calls.map((c: unknown[]) => c.join(' ')).join('\n');
    expect(output).toContain('reviewer');
    expect(output).toContain('planner');
    expect(output).toContain('enabled');
  });

  it('prints a friendly notice when no skills are loaded', async () => {
    const handled = await handleCommand('/skills', makeState());
    expect(handled).toBe(true);
    const output = logSpy.mock.calls.map((c: unknown[]) => c.join(' ')).join('\n');
    expect(output).toContain('No skills loaded');
  });

  it('toggles a skill from enabled to disabled and back', async () => {
    registerSkill({
      id: 'flippable',
      name: 'Flippable',
      description: 'A test skill',
      prompt: '...',
    });
    expect(isSkillEnabled('flippable')).toBe(true);

    await handleCommand('/skills toggle flippable', makeState());
    expect(isSkillEnabled('flippable')).toBe(false);
    let output = logSpy.mock.calls.map((c: unknown[]) => c.join(' ')).join('\n');
    expect(output).toMatch(/flippable/);
    expect(output).toMatch(/disabled/);

    logSpy.mockClear();
    await handleCommand('/skills toggle flippable', makeState());
    expect(isSkillEnabled('flippable')).toBe(true);
    output = logSpy.mock.calls.map((c: unknown[]) => c.join(' ')).join('\n');
    expect(output).toMatch(/enabled/);
  });

  it('reports an error when toggling an unknown skill', async () => {
    const handled = await handleCommand('/skills toggle missing', makeState());
    expect(handled).toBe(true);
    const output = logSpy.mock.calls.map((c: unknown[]) => c.join(' ')).join('\n');
    expect(output).toMatch(/not found/i);
  });

  it('falls back to the list view for an unknown subcommand', async () => {
    registerSkill({
      id: 'shown',
      name: 'Shown',
      description: 'A test skill',
      prompt: '...',
    });
    const handled = await handleCommand('/skills bogus', makeState());
    expect(handled).toBe(true);
    const output = logSpy.mock.calls.map((c: unknown[]) => c.join(' ')).join('\n');
    expect(output).toContain('shown');
  });
});

describe('interactive /help output', () => {
  it('lists /plugins and /skills among the available commands', () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    try {
      printHelp();
      const output = logSpy.mock.calls.map((c: unknown[]) => c.join(' ')).join('\n');
      expect(output).toContain('/plugins');
      expect(output).toContain('/skills');
    } finally {
      logSpy.mockRestore();
    }
  });
});
