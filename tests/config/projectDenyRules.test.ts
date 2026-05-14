import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { loadProjectDenyRules, loadDenyRulesFromFile } from '../../src/config/projectDenyRules.js';

describe('Project Deny Rules Config Loader', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'alexi-deny-rules-test-'));
  });

  afterEach(async () => {
    await fs.promises.rm(tempDir, { recursive: true, force: true });
  });

  describe('loadProjectDenyRules', () => {
    it('should return empty rules when no config files exist', () => {
      const result = loadProjectDenyRules(tempDir);
      expect(result.rules).toEqual([]);
      expect(result.source).toBeUndefined();
      expect(result.error).toBeUndefined();
    });

    it('should load deny rules from kilo.json', () => {
      const config = {
        denyRules: {
          rules: [
            {
              id: 'deny-production',
              name: 'Protect Production',
              actions: ['write'],
              paths: ['**/production/**'],
            },
          ],
        },
      };

      fs.writeFileSync(path.join(tempDir, 'kilo.json'), JSON.stringify(config), 'utf-8');

      const result = loadProjectDenyRules(tempDir);
      expect(result.rules).toHaveLength(1);
      expect(result.rules[0].id).toBe('deny-production');
      expect(result.source).toBe(path.resolve(tempDir, 'kilo.json'));
    });

    it('should load deny rules from alexi.json', () => {
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

      fs.writeFileSync(path.join(tempDir, 'alexi.json'), JSON.stringify(config), 'utf-8');

      const result = loadProjectDenyRules(tempDir);
      expect(result.rules).toHaveLength(1);
      expect(result.rules[0].id).toBe('deny-deploy');
      expect(result.source).toBe(path.resolve(tempDir, 'alexi.json'));
    });

    it('should load deny rules from .kilo/kilo.json', () => {
      const config = {
        denyRules: {
          rules: [
            {
              id: 'deny-secrets',
              paths: ['**/secrets/**'],
            },
          ],
        },
      };

      fs.mkdirSync(path.join(tempDir, '.kilo'), { recursive: true });
      fs.writeFileSync(path.join(tempDir, '.kilo', 'kilo.json'), JSON.stringify(config), 'utf-8');

      const result = loadProjectDenyRules(tempDir);
      expect(result.rules).toHaveLength(1);
      expect(result.rules[0].id).toBe('deny-secrets');
      expect(result.source).toBe(path.resolve(tempDir, '.kilo', 'kilo.json'));
    });

    it('should load deny rules from .kilo/config.json', () => {
      const config = {
        denyRules: [
          {
            id: 'deny-infra',
            actions: ['write'],
            paths: ['**/infrastructure/**'],
          },
        ],
      };

      fs.mkdirSync(path.join(tempDir, '.kilo'), { recursive: true });
      fs.writeFileSync(path.join(tempDir, '.kilo', 'config.json'), JSON.stringify(config), 'utf-8');

      const result = loadProjectDenyRules(tempDir);
      expect(result.rules).toHaveLength(1);
      expect(result.rules[0].id).toBe('deny-infra');
    });

    it('should prefer higher-priority config file (.kilo/kilo.json over kilo.json)', () => {
      // kilo.json has one rule
      fs.writeFileSync(
        path.join(tempDir, 'kilo.json'),
        JSON.stringify({
          denyRules: {
            rules: [{ id: 'from-root', paths: ['**/root/**'] }],
          },
        }),
        'utf-8'
      );

      // .kilo/kilo.json has a different rule (higher priority)
      fs.mkdirSync(path.join(tempDir, '.kilo'), { recursive: true });
      fs.writeFileSync(
        path.join(tempDir, '.kilo', 'kilo.json'),
        JSON.stringify({
          denyRules: {
            rules: [{ id: 'from-dotdir', paths: ['**/dotdir/**'] }],
          },
        }),
        'utf-8'
      );

      const result = loadProjectDenyRules(tempDir);
      expect(result.rules).toHaveLength(1);
      expect(result.rules[0].id).toBe('from-dotdir');
      expect(result.source).toContain('.kilo/kilo.json');
    });

    it('should return empty rules when config file has no denyRules key', () => {
      const config = {
        version: '1.0.0',
        project: { name: 'test' },
      };

      fs.writeFileSync(path.join(tempDir, 'kilo.json'), JSON.stringify(config), 'utf-8');

      const result = loadProjectDenyRules(tempDir);
      expect(result.rules).toEqual([]);
    });

    it('should handle deny rules as direct array (shorthand format)', () => {
      const config = {
        denyRules: [
          {
            id: 'deny-all-writes',
            actions: ['write'],
            paths: ['**/protected/**'],
          },
        ],
      };

      fs.writeFileSync(path.join(tempDir, 'kilo.json'), JSON.stringify(config), 'utf-8');

      const result = loadProjectDenyRules(tempDir);
      expect(result.rules).toHaveLength(1);
      expect(result.rules[0].id).toBe('deny-all-writes');
    });

    it('should return error for malformed JSON', () => {
      fs.writeFileSync(path.join(tempDir, 'kilo.json'), '{ invalid json }', 'utf-8');

      const result = loadProjectDenyRules(tempDir);
      expect(result.rules).toEqual([]);
      expect(result.error).toBeDefined();
      expect(result.error).toContain('Failed to parse kilo.json');
    });

    it('should return empty rules for invalid deny rule schema', () => {
      const config = {
        denyRules: {
          rules: [
            { actions: ['invalid_action'] }, // Invalid action value
          ],
        },
      };

      fs.writeFileSync(path.join(tempDir, 'kilo.json'), JSON.stringify(config), 'utf-8');

      const result = loadProjectDenyRules(tempDir);
      expect(result.rules).toEqual([]);
    });

    it('should handle multiple rules in a single config', () => {
      const config = {
        denyRules: {
          rules: [
            {
              id: 'deny-prod',
              actions: ['write'],
              paths: ['**/production/**'],
            },
            {
              id: 'deny-deploy',
              actions: ['execute'],
              commands: ['deploy*', 'kubectl*'],
            },
            {
              id: 'deny-internal-api',
              actions: ['network'],
              hosts: ['*.internal.corp'],
            },
          ],
        },
      };

      fs.writeFileSync(path.join(tempDir, 'kilo.json'), JSON.stringify(config), 'utf-8');

      const result = loadProjectDenyRules(tempDir);
      expect(result.rules).toHaveLength(3);
      expect(result.rules[0].id).toBe('deny-prod');
      expect(result.rules[1].id).toBe('deny-deploy');
      expect(result.rules[2].id).toBe('deny-internal-api');
    });
  });

  describe('loadDenyRulesFromFile', () => {
    it('should return empty rules for non-existent file', () => {
      const result = loadDenyRulesFromFile('/non/existent/path.json');
      expect(result.rules).toEqual([]);
      expect(result.source).toBeUndefined();
    });

    it('should load rules from a specific file', () => {
      const config = {
        denyRules: {
          rules: [
            {
              id: 'deny-specific',
              tools: ['bash'],
              commands: ['rm -rf*'],
            },
          ],
        },
      };

      const filePath = path.join(tempDir, 'custom-config.json');
      fs.writeFileSync(filePath, JSON.stringify(config), 'utf-8');

      const result = loadDenyRulesFromFile(filePath);
      expect(result.rules).toHaveLength(1);
      expect(result.rules[0].id).toBe('deny-specific');
      expect(result.source).toBe(filePath);
    });

    it('should return error for malformed file', () => {
      const filePath = path.join(tempDir, 'bad.json');
      fs.writeFileSync(filePath, 'not valid json', 'utf-8');

      const result = loadDenyRulesFromFile(filePath);
      expect(result.rules).toEqual([]);
      expect(result.error).toBeDefined();
    });

    it('should return empty rules when file has no denyRules key', () => {
      const filePath = path.join(tempDir, 'no-deny.json');
      fs.writeFileSync(filePath, JSON.stringify({ version: '1.0' }), 'utf-8');

      const result = loadDenyRulesFromFile(filePath);
      expect(result.rules).toEqual([]);
      expect(result.source).toBeUndefined();
    });
  });
});
