import { describe, it, expect, beforeEach } from 'vitest';
import {
  evaluateDenyRules,
  parseDenyRulesConfig,
  validateDenyRule,
  type HardDenyRule,
} from '../../src/permission/deny-rules.js';
import { PermissionManager, defaultRules } from '../../src/permission/index.js';
import type { PermissionContext } from '../../src/permission/index.js';

describe('Hard Deny Rules', () => {
  describe('evaluateDenyRules', () => {
    it('should deny matching file path operations', () => {
      const rules: HardDenyRule[] = [
        {
          id: 'deny-prod-config',
          name: 'Deny Production Config',
          description: 'Never allow writing to production config files',
          actions: ['write'],
          paths: ['**/production.config.*', '**/prod.env'],
        },
      ];

      const ctx: PermissionContext = {
        toolName: 'write',
        action: 'write',
        resource: '/project/config/production.config.json',
      };

      const result = evaluateDenyRules(rules, ctx);
      expect(result.denied).toBe(true);
      expect(result.rule).toBeDefined();
      expect(result.rule?.id).toBe('deny-prod-config');
      expect(result.reason).toContain('Deny Production Config');
    });

    it('should allow non-matching operations', () => {
      const rules: HardDenyRule[] = [
        {
          id: 'deny-prod-config',
          actions: ['write'],
          paths: ['**/production.config.*'],
        },
      ];

      const ctx: PermissionContext = {
        toolName: 'write',
        action: 'write',
        resource: '/project/config/development.config.json',
      };

      const result = evaluateDenyRules(rules, ctx);
      expect(result.denied).toBe(false);
      expect(result.rule).toBeUndefined();
    });

    it('should deny matching command operations', () => {
      const rules: HardDenyRule[] = [
        {
          id: 'deny-deploy',
          name: 'Deny Deploy Commands',
          actions: ['execute'],
          commands: ['deploy*', 'kubectl*', 'terraform*'],
        },
      ];

      const ctx: PermissionContext = {
        toolName: 'bash',
        action: 'execute',
        resource: 'deploy --production',
      };

      const result = evaluateDenyRules(rules, ctx);
      expect(result.denied).toBe(true);
    });

    it('should not deny non-matching commands', () => {
      const rules: HardDenyRule[] = [
        {
          id: 'deny-deploy',
          actions: ['execute'],
          commands: ['deploy*', 'kubectl*'],
        },
      ];

      const ctx: PermissionContext = {
        toolName: 'bash',
        action: 'execute',
        resource: 'npm test',
      };

      const result = evaluateDenyRules(rules, ctx);
      expect(result.denied).toBe(false);
    });

    it('should deny matching tool names', () => {
      const rules: HardDenyRule[] = [
        {
          id: 'deny-delete-tool',
          tools: ['delete', 'rm'],
        },
      ];

      const ctx: PermissionContext = {
        toolName: 'delete',
        action: 'write',
        resource: '/project/important-file.ts',
      };

      const result = evaluateDenyRules(rules, ctx);
      expect(result.denied).toBe(true);
    });

    it('should deny matching network hosts', () => {
      const rules: HardDenyRule[] = [
        {
          id: 'deny-external-api',
          actions: ['network'],
          hosts: ['*.internal.corp', 'admin.example.com'],
        },
      ];

      const ctx: PermissionContext = {
        toolName: 'webfetch',
        action: 'network',
        resource: 'admin.example.com',
      };

      const result = evaluateDenyRules(rules, ctx);
      expect(result.denied).toBe(true);
    });

    it('should not match when action type does not match', () => {
      const rules: HardDenyRule[] = [
        {
          id: 'deny-write-only',
          actions: ['write'],
          paths: ['**/important.ts'],
        },
      ];

      const ctx: PermissionContext = {
        toolName: 'read',
        action: 'read',
        resource: '/project/important.ts',
      };

      const result = evaluateDenyRules(rules, ctx);
      expect(result.denied).toBe(false);
    });

    it('should require ALL criteria to match (AND logic)', () => {
      const rules: HardDenyRule[] = [
        {
          id: 'deny-specific',
          actions: ['write'],
          paths: ['**/secret.ts'],
          tools: ['edit'],
        },
      ];

      // Tool does not match - should not deny
      const ctx1: PermissionContext = {
        toolName: 'write',
        action: 'write',
        resource: '/project/secret.ts',
      };

      const result1 = evaluateDenyRules(rules, ctx1);
      expect(result1.denied).toBe(false);

      // All criteria match - should deny
      const ctx2: PermissionContext = {
        toolName: 'edit',
        action: 'write',
        resource: '/project/secret.ts',
      };

      const result2 = evaluateDenyRules(rules, ctx2);
      expect(result2.denied).toBe(true);
    });

    it('should not match a rule with no criteria', () => {
      const rules: HardDenyRule[] = [
        {
          id: 'empty-rule',
          name: 'Empty Rule',
        },
      ];

      const ctx: PermissionContext = {
        toolName: 'write',
        action: 'write',
        resource: '/project/file.ts',
      };

      const result = evaluateDenyRules(rules, ctx);
      expect(result.denied).toBe(false);
    });

    it('should match first rule and stop', () => {
      const rules: HardDenyRule[] = [
        {
          id: 'first-rule',
          name: 'First Rule',
          paths: ['**/*.ts'],
        },
        {
          id: 'second-rule',
          name: 'Second Rule',
          paths: ['**/*.ts'],
        },
      ];

      const ctx: PermissionContext = {
        toolName: 'write',
        action: 'write',
        resource: '/project/file.ts',
      };

      const result = evaluateDenyRules(rules, ctx);
      expect(result.denied).toBe(true);
      expect(result.rule?.id).toBe('first-rule');
    });

    it('should include denial reason with rule name', () => {
      const rules: HardDenyRule[] = [
        {
          id: 'deny-db',
          name: 'Protect Database',
          description: 'Database migrations must be reviewed manually',
          paths: ['**/migrations/**'],
        },
      ];

      const ctx: PermissionContext = {
        toolName: 'write',
        action: 'write',
        resource: '/project/db/migrations/001_create_users.sql',
      };

      const result = evaluateDenyRules(rules, ctx);
      expect(result.denied).toBe(true);
      expect(result.reason).toContain('Protect Database');
      expect(result.reason).toContain('Database migrations must be reviewed manually');
      expect(result.reason).toContain('write');
    });

    it('should handle glob patterns for paths correctly', () => {
      const rules: HardDenyRule[] = [
        {
          id: 'deny-dotfiles',
          paths: ['**/.*', '**/.github/**'],
          actions: ['write'],
        },
      ];

      // Should match dotfiles
      const ctx1: PermissionContext = {
        toolName: 'write',
        action: 'write',
        resource: '/project/.gitignore',
      };
      expect(evaluateDenyRules(rules, ctx1).denied).toBe(true);

      // Should match files inside .github
      const ctx2: PermissionContext = {
        toolName: 'write',
        action: 'write',
        resource: '/project/.github/workflows/ci.yml',
      };
      expect(evaluateDenyRules(rules, ctx2).denied).toBe(true);

      // Should not match regular files
      const ctx3: PermissionContext = {
        toolName: 'write',
        action: 'write',
        resource: '/project/src/main.ts',
      };
      expect(evaluateDenyRules(rules, ctx3).denied).toBe(false);
    });
  });

  describe('parseDenyRulesConfig', () => {
    it('should parse an array of rules', () => {
      const config = [
        {
          id: 'rule-1',
          paths: ['**/secret.*'],
          actions: ['write'],
        },
        {
          id: 'rule-2',
          commands: ['rm -rf*'],
          actions: ['execute'],
        },
      ];

      const rules = parseDenyRulesConfig(config);
      expect(rules).toHaveLength(2);
      expect(rules[0].id).toBe('rule-1');
      expect(rules[1].id).toBe('rule-2');
    });

    it('should parse an object with rules field', () => {
      const config = {
        rules: [
          {
            id: 'rule-1',
            paths: ['**/secret.*'],
          },
        ],
      };

      const rules = parseDenyRulesConfig(config);
      expect(rules).toHaveLength(1);
      expect(rules[0].id).toBe('rule-1');
    });

    it('should return empty array for null/undefined', () => {
      expect(parseDenyRulesConfig(null)).toEqual([]);
      expect(parseDenyRulesConfig(undefined)).toEqual([]);
    });

    it('should return empty array for invalid config', () => {
      expect(parseDenyRulesConfig('invalid')).toEqual([]);
      expect(parseDenyRulesConfig(123)).toEqual([]);
    });

    it('should return empty array for invalid rule schemas', () => {
      const config = [
        { actions: ['invalid_action'] }, // Invalid action value
      ];

      const rules = parseDenyRulesConfig(config);
      expect(rules).toEqual([]);
    });

    it('should handle empty rules array', () => {
      const config = { rules: [] };
      const rules = parseDenyRulesConfig(config);
      expect(rules).toEqual([]);
    });
  });

  describe('validateDenyRule', () => {
    it('should validate a correct rule', () => {
      const rule = {
        id: 'valid-rule',
        name: 'Valid Rule',
        actions: ['write'],
        paths: ['**/secret.*'],
      };

      const result = validateDenyRule(rule);
      expect(result.valid).toBe(true);
      expect(result.rule).toBeDefined();
      expect(result.rule?.id).toBe('valid-rule');
    });

    it('should reject a rule with no criteria', () => {
      const rule = {
        id: 'empty-rule',
        name: 'Empty Rule',
      };

      const result = validateDenyRule(rule);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('at least one matching criterion');
    });

    it('should reject invalid action values', () => {
      const rule = {
        actions: ['invalid'],
        paths: ['**/*'],
      };

      const result = validateDenyRule(rule);
      expect(result.valid).toBe(false);
    });

    it('should accept a rule with only tools specified', () => {
      const rule = {
        tools: ['delete'],
      };

      const result = validateDenyRule(rule);
      expect(result.valid).toBe(true);
    });
  });

  describe('PermissionManager integration', () => {
    let manager: PermissionManager;

    beforeEach(() => {
      manager = new PermissionManager(defaultRules);
    });

    it('should deny operations blocked by hard deny rules', () => {
      manager.setHardDenyRules([
        {
          id: 'deny-secrets',
          actions: ['write'],
          paths: ['**/credentials.json', '**/secrets.yaml'],
        },
      ]);

      const result = manager.evaluate({
        toolName: 'write',
        action: 'write',
        resource: '/project/config/credentials.json',
      });

      expect(result.decision).toBe('deny');
    });

    it('should deny even when allow rules would normally permit', () => {
      // Add an allow rule for all writes
      manager.addRule({
        id: 'allow-all-writes',
        actions: ['write'],
        decision: 'allow',
        priority: 200, // Very high priority
      });

      // Add a hard deny rule
      manager.setHardDenyRules([
        {
          id: 'deny-production',
          actions: ['write'],
          paths: ['**/production/**'],
        },
      ]);

      const result = manager.evaluate({
        toolName: 'write',
        action: 'write',
        resource: '/project/production/config.json',
      });

      // Hard deny takes priority over allow rules
      expect(result.decision).toBe('deny');
    });

    it('should deny even when session grants would normally permit', () => {
      const ctx: PermissionContext = {
        toolName: 'write',
        action: 'write',
        resource: '/project/production/deploy.sh',
      };

      // Grant session permission
      manager.grantSession(ctx);

      // Add hard deny rule
      manager.setHardDenyRules([
        {
          id: 'deny-production',
          actions: ['write'],
          paths: ['**/production/**'],
        },
      ]);

      const result = manager.evaluate(ctx);

      // Hard deny takes priority over session grants
      expect(result.decision).toBe('deny');
    });

    it('should not affect operations that do not match deny rules', () => {
      manager.setHardDenyRules([
        {
          id: 'deny-production',
          actions: ['write'],
          paths: ['**/production/**'],
        },
      ]);

      const result = manager.evaluate({
        toolName: 'write',
        action: 'write',
        resource: '/project/development/config.json',
      });

      // Should proceed normally (ask, based on default rules)
      expect(result.decision).toBe('ask');
    });

    it('should work with async check method', async () => {
      manager.setHardDenyRules([
        {
          id: 'deny-deploy',
          actions: ['execute'],
          commands: ['deploy*'],
        },
      ]);

      const result = await manager.check({
        toolName: 'bash',
        action: 'execute',
        resource: 'deploy --production',
      });

      expect(result.granted).toBe(false);
      expect(result.decision).toBe('deny');
    });

    it('should load deny rules from config', () => {
      manager.loadHardDenyRulesFromConfig([
        {
          id: 'rule-1',
          paths: ['**/secret.*'],
          actions: ['write'],
        },
        {
          id: 'rule-2',
          commands: ['rm*'],
          actions: ['execute'],
        },
      ]);

      const rules = manager.getHardDenyRules();
      expect(rules).toHaveLength(2);
    });

    it('should add and remove deny rules dynamically', () => {
      manager.addHardDenyRule({
        id: 'dynamic-rule',
        paths: ['**/temp/**'],
      });

      expect(manager.getHardDenyRules()).toHaveLength(1);

      const removed = manager.removeHardDenyRule('dynamic-rule');
      expect(removed).toBe(true);
      expect(manager.getHardDenyRules()).toHaveLength(0);
    });

    it('should return false when removing non-existent rule', () => {
      const removed = manager.removeHardDenyRule('non-existent');
      expect(removed).toBe(false);
    });

    it('should create manager with deny rules using fromConfigWithDenyRules', () => {
      const mgr = PermissionManager.fromConfigWithDenyRules({
        rules: [
          {
            id: 'allow-read',
            actions: ['read'],
            decision: 'allow',
            priority: 0,
          },
        ],
        denyRules: [
          {
            id: 'deny-secrets',
            paths: ['**/secrets/**'],
            actions: ['read'],
          },
        ],
      });

      // Regular read should be allowed
      const readResult = mgr.evaluate({
        toolName: 'read',
        action: 'read',
        resource: '/project/src/main.ts',
      });
      expect(readResult.decision).toBe('allow');

      // Read in secrets dir should be denied by hard deny
      const secretResult = mgr.evaluate({
        toolName: 'read',
        action: 'read',
        resource: '/project/secrets/api-key.txt',
      });
      expect(secretResult.decision).toBe('deny');
    });

    it('should block read operations on deny-protected paths', () => {
      manager.setHardDenyRules([
        {
          id: 'deny-all-access',
          paths: ['**/classified/**'],
        },
      ]);

      const result = manager.evaluate({
        toolName: 'read',
        action: 'read',
        resource: '/project/classified/top-secret.md',
      });

      expect(result.decision).toBe('deny');
    });
  });
});
