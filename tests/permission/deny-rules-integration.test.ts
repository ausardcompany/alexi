import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import {
  PermissionManager,
  defaultRules,
  initPermissionManagerWithDenyRules,
  setPermissionManager,
} from '../../src/permission/index.js';
import { loadProjectDenyRules } from '../../src/config/projectDenyRules.js';
import type { PermissionContext } from '../../src/permission/index.js';

describe('Deny Rules Integration with PermissionManager', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'alexi-deny-integration-'));
    // Reset the global manager for each test
    setPermissionManager(new PermissionManager(defaultRules));
  });

  afterEach(async () => {
    await fs.promises.rm(tempDir, { recursive: true, force: true });
  });

  it('should load deny rules from kilo.json and block matching operations', () => {
    const config = {
      denyRules: {
        rules: [
          {
            id: 'deny-prod-writes',
            name: 'Protect Production',
            description: 'Never auto-approve writes to production configs',
            actions: ['write'],
            paths: ['**/production/**', '**/prod.env'],
          },
        ],
      },
    };

    fs.writeFileSync(path.join(tempDir, 'kilo.json'), JSON.stringify(config), 'utf-8');

    const result = initPermissionManagerWithDenyRules(tempDir);
    expect(result.rulesLoaded).toBe(1);
    expect(result.source).toContain('kilo.json');
    expect(result.error).toBeUndefined();

    // Now the manager should deny writes to production paths
    const manager = new PermissionManager(defaultRules);
    manager.setHardDenyRules(loadProjectDenyRules(tempDir).rules);

    const ctx: PermissionContext = {
      toolName: 'write',
      action: 'write',
      resource: '/project/production/config.json',
    };

    const evalResult = manager.evaluate(ctx);
    expect(evalResult.decision).toBe('deny');
  });

  it('should deny operations even when allow rules exist with higher priority', () => {
    const config = {
      denyRules: {
        rules: [
          {
            id: 'deny-classified',
            actions: ['read', 'write'],
            paths: ['**/classified/**'],
          },
        ],
      },
    };

    fs.writeFileSync(path.join(tempDir, 'kilo.json'), JSON.stringify(config), 'utf-8');

    const manager = new PermissionManager(defaultRules);

    // Add a very high priority allow rule
    manager.addRule({
      id: 'allow-everything',
      actions: ['read', 'write', 'execute'],
      decision: 'allow',
      priority: 999,
    });

    // Load deny rules
    const loadResult = loadProjectDenyRules(tempDir);
    manager.setHardDenyRules(loadResult.rules);

    // Deny rules should still block
    const ctx: PermissionContext = {
      toolName: 'read',
      action: 'read',
      resource: '/project/classified/top-secret.md',
    };

    const evalResult = manager.evaluate(ctx);
    expect(evalResult.decision).toBe('deny');
  });

  it('should not block operations that do not match deny rules', () => {
    const config = {
      denyRules: {
        rules: [
          {
            id: 'deny-prod',
            actions: ['write'],
            paths: ['**/production/**'],
          },
        ],
      },
    };

    fs.writeFileSync(path.join(tempDir, 'kilo.json'), JSON.stringify(config), 'utf-8');

    const manager = new PermissionManager(defaultRules);
    manager.setHardDenyRules(loadProjectDenyRules(tempDir).rules);

    // Writing to development should proceed normally
    const ctx: PermissionContext = {
      toolName: 'write',
      action: 'write',
      resource: '/project/development/config.json',
    };

    const evalResult = manager.evaluate(ctx);
    // Should be 'ask' based on default rules (not denied)
    expect(evalResult.decision).not.toBe('deny');
  });

  it('should handle the initPermissionManagerWithDenyRules function', () => {
    const config = {
      denyRules: {
        rules: [
          {
            id: 'deny-deploy-commands',
            actions: ['execute'],
            commands: ['deploy*', 'kubectl*'],
          },
          {
            id: 'deny-secrets-write',
            actions: ['write'],
            paths: ['**/secrets/**'],
          },
        ],
      },
    };

    fs.writeFileSync(path.join(tempDir, 'kilo.json'), JSON.stringify(config), 'utf-8');

    const result = initPermissionManagerWithDenyRules(tempDir);
    expect(result.rulesLoaded).toBe(2);
    expect(result.source).toContain('kilo.json');
  });

  it('should return zero rules when no config exists', () => {
    const result = initPermissionManagerWithDenyRules(tempDir);
    expect(result.rulesLoaded).toBe(0);
    expect(result.source).toBeUndefined();
    expect(result.error).toBeUndefined();
  });

  it('should report errors from malformed config', () => {
    fs.writeFileSync(path.join(tempDir, 'kilo.json'), '{ bad json', 'utf-8');

    const result = initPermissionManagerWithDenyRules(tempDir);
    expect(result.rulesLoaded).toBe(0);
    expect(result.error).toBeDefined();
    expect(result.error).toContain('Failed to parse');
  });

  it('should deny via async check() method when deny rules are loaded', async () => {
    const config = {
      denyRules: {
        rules: [
          {
            id: 'deny-network',
            actions: ['network'],
            hosts: ['*.evil.com'],
          },
        ],
      },
    };

    fs.writeFileSync(path.join(tempDir, 'kilo.json'), JSON.stringify(config), 'utf-8');

    const manager = new PermissionManager(defaultRules);
    manager.setHardDenyRules(loadProjectDenyRules(tempDir).rules);

    const result = await manager.check({
      toolName: 'webfetch',
      action: 'network',
      resource: 'api.evil.com',
    });

    expect(result.granted).toBe(false);
    expect(result.decision).toBe('deny');
  });

  it('should deny session-granted operations when they match deny rules', () => {
    const config = {
      denyRules: {
        rules: [
          {
            id: 'deny-deploy',
            actions: ['execute'],
            commands: ['deploy*'],
          },
        ],
      },
    };

    fs.writeFileSync(path.join(tempDir, 'kilo.json'), JSON.stringify(config), 'utf-8');

    const manager = new PermissionManager(defaultRules);
    manager.setHardDenyRules(loadProjectDenyRules(tempDir).rules);

    const ctx: PermissionContext = {
      toolName: 'bash',
      action: 'execute',
      resource: 'deploy --production --force',
    };

    // Grant session permission
    manager.grantSession(ctx);

    // Hard deny should still block even with session grant
    const evalResult = manager.evaluate(ctx);
    expect(evalResult.decision).toBe('deny');
  });
});
