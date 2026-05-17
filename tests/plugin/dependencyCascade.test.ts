import { describe, it, expect, beforeEach } from 'vitest';
import { PluginManager, type Plugin } from '../../src/plugin/index.js';

/**
 * Helper to create a minimal plugin with optional dependencies
 */
function createPlugin(name: string, dependencies?: string[]): Plugin {
  return {
    name,
    version: '1.0.0',
    description: `Test plugin: ${name}`,
    dependencies,
  };
}

describe('Plugin Dependency Cascade', () => {
  let manager: PluginManager;

  beforeEach(() => {
    manager = new PluginManager('/tmp/test');
  });

  describe('getDependents', () => {
    it('should return empty array when no plugins depend on target', async () => {
      await manager.load(createPlugin('alpha'));
      await manager.load(createPlugin('beta'));

      const dependents = manager.getDependents('alpha');
      expect(dependents).toEqual([]);
    });

    it('should return plugins that depend on target', async () => {
      await manager.load(createPlugin('core'));
      await manager.load(createPlugin('ui', ['core']));
      await manager.load(createPlugin('api', ['core']));

      const dependents = manager.getDependents('core');
      expect(dependents).toContain('ui');
      expect(dependents).toContain('api');
      expect(dependents).toHaveLength(2);
    });

    it('should not include disabled plugins in dependents', async () => {
      await manager.load(createPlugin('core'));
      await manager.load(createPlugin('ui', ['core']));

      // Disable ui with force so it doesn't block
      manager.disable('ui', { force: true });

      const dependents = manager.getDependents('core');
      expect(dependents).toEqual([]);
    });
  });

  describe('disable', () => {
    it('should refuse when another enabled plugin depends on target', async () => {
      await manager.load(createPlugin('core'));
      await manager.load(createPlugin('ui', ['core']));

      const result = manager.disable('core');
      expect(result.success).toBe(false);
      expect(result.error).toBe(
        "Cannot disable 'core': required by ui. Disable those plugins first."
      );
    });

    it('should succeed when no dependents exist', async () => {
      await manager.load(createPlugin('alpha'));
      await manager.load(createPlugin('beta'));

      const result = manager.disable('alpha');
      expect(result.success).toBe(true);
      expect(manager.isEnabled('alpha')).toBe(false);
    });

    it('should succeed with force: true even when dependents exist', async () => {
      await manager.load(createPlugin('core'));
      await manager.load(createPlugin('ui', ['core']));

      const result = manager.disable('core', { force: true });
      expect(result.success).toBe(true);
      expect(manager.isEnabled('core')).toBe(false);
    });

    it('should return error when plugin is not loaded', () => {
      const result = manager.disable('nonexistent');
      expect(result.success).toBe(false);
      expect(result.error).toBe("Plugin 'nonexistent' is not loaded");
    });

    it('should list multiple dependents in error message', async () => {
      await manager.load(createPlugin('core'));
      await manager.load(createPlugin('ui', ['core']));
      await manager.load(createPlugin('api', ['core']));
      await manager.load(createPlugin('cli', ['core']));

      const result = manager.disable('core');
      expect(result.success).toBe(false);
      expect(result.error).toContain('ui');
      expect(result.error).toContain('api');
      expect(result.error).toContain('cli');
    });
  });

  describe('enable', () => {
    it('should auto-enable disabled dependencies', async () => {
      await manager.load(createPlugin('core'));
      await manager.load(createPlugin('ui', ['core']));

      // Disable core first (force since ui depends on it)
      manager.disable('core', { force: true });
      // Disable ui
      manager.disable('ui', { force: true });

      expect(manager.isEnabled('core')).toBe(false);
      expect(manager.isEnabled('ui')).toBe(false);

      // Enable ui should auto-enable core
      const result = manager.enable('ui');
      expect(result.success).toBe(true);
      expect(result.enabledDependencies).toContain('core');
      expect(manager.isEnabled('core')).toBe(true);
      expect(manager.isEnabled('ui')).toBe(true);
    });

    it('should handle circular dependency gracefully', async () => {
      const mgr = new PluginManager('/tmp/test');
      // Load both without dependencies first
      await mgr.load(createPlugin('circA'));
      await mgr.load(createPlugin('circB'));

      // Now manually set dependencies to create circular reference
      // Access internal state for testing
      const stateA = (mgr as unknown as { plugins: Map<string, { plugin: Plugin }> }).plugins.get(
        'circA'
      );
      const stateB = (mgr as unknown as { plugins: Map<string, { plugin: Plugin }> }).plugins.get(
        'circB'
      );
      if (stateA) stateA.plugin.dependencies = ['circB'];
      if (stateB) stateB.plugin.dependencies = ['circA'];

      // Disable both
      mgr.disable('circA', { force: true });
      mgr.disable('circB', { force: true });

      // Enable circA — should not infinite loop thanks to visited set
      const result = mgr.enable('circA');
      expect(result.success).toBe(true);
      expect(mgr.isEnabled('circA')).toBe(true);
      expect(mgr.isEnabled('circB')).toBe(true);
    });

    it('should succeed when all dependencies already enabled', async () => {
      await manager.load(createPlugin('core'));
      await manager.load(createPlugin('ui', ['core']));

      // core is already enabled, disable only ui
      manager.disable('ui');

      const result = manager.enable('ui');
      expect(result.success).toBe(true);
      expect(result.enabledDependencies).toBeUndefined();
      expect(manager.isEnabled('ui')).toBe(true);
      expect(manager.isEnabled('core')).toBe(true);
    });

    it('should return error when plugin is not loaded', () => {
      const result = manager.enable('nonexistent');
      expect(result.success).toBe(false);
      expect(result.error).toBe("Plugin 'nonexistent' is not loaded");
    });

    it('should return error when dependency is not loaded', async () => {
      await manager.load(createPlugin('ui', ['missing-dep']));
      // The load would have failed because of missing dep check
      // Let's create a scenario where dep exists at load but is removed

      const mgr = new PluginManager('/tmp/test');
      await mgr.load(createPlugin('core'));
      await mgr.load(createPlugin('ui', ['core']));

      // Unload core to simulate missing dependency
      await mgr.unload('core');

      // Disable ui first
      mgr.disable('ui', { force: true });

      // Now enable ui — core is not loaded
      const result = mgr.enable('ui');
      expect(result.success).toBe(false);
      expect(result.error).toBe("Dependency 'core' is not loaded");
    });

    it('should enable transitive dependencies', async () => {
      await manager.load(createPlugin('base'));
      await manager.load(createPlugin('middle', ['base']));
      await manager.load(createPlugin('top', ['middle']));

      // Disable all (in reverse order with force)
      manager.disable('top', { force: true });
      manager.disable('middle', { force: true });
      manager.disable('base', { force: true });

      // Enable top — should enable base and middle too
      const result = manager.enable('top');
      expect(result.success).toBe(true);
      expect(result.enabledDependencies).toContain('base');
      expect(result.enabledDependencies).toContain('middle');
      expect(manager.isEnabled('base')).toBe(true);
      expect(manager.isEnabled('middle')).toBe(true);
      expect(manager.isEnabled('top')).toBe(true);
    });
  });
});
