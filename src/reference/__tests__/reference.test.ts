/**
 * Reference Service Tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { ReferenceService, type ReferenceConfig } from '../reference.js';
import * as path from 'path';
import * as os from 'os';

describe('ReferenceService', () => {
  let config: ReferenceConfig;
  let service: ReferenceService;

  beforeEach(() => {
    config = {
      worktree: '/test/worktree',
      directory: '/test/directory',
      references: {
        local: {
          kind: 'local',
          path: '/external/repo',
        },
        git: {
          kind: 'git',
          repository: 'https://github.com/user/repo.git',
          branch: 'main',
        },
      },
    };
    service = new ReferenceService(config);
  });

  describe('resolve', () => {
    it('should resolve local reference', () => {
      const ref = service.resolve('local', config.references!.local);
      expect(ref).toEqual({
        kind: 'local',
        path: '/external/repo',
      });
    });

    it('should resolve git reference', () => {
      const ref = service.resolve('git', config.references!.git);
      expect(ref).toEqual({
        kind: 'git',
        repository: 'https://github.com/user/repo.git',
        branch: 'main',
      });
    });

    it('should resolve tilde paths', () => {
      const ref = service.resolve('tilde', { kind: 'local', path: '~/test' });
      expect(ref.kind).toBe('local');
      if (ref.kind === 'local') {
        expect(ref.path).toBe(path.join(os.homedir(), 'test'));
      }
    });

    it('should throw error for invalid reference', () => {
      expect(() => {
        service.resolve('invalid', { kind: 'local' });
      }).toThrow('Invalid reference entry');
    });
  });

  describe('ensure', () => {
    it('should mark path as resolved', async () => {
      const testPath = '/test/path';
      expect(service.contains(testPath)).toBe(false);
      await service.ensure(testPath);
      expect(service.contains(testPath)).toBe(true);
    });
  });

  describe('getPrompt', () => {
    it('should generate local reference prompt', () => {
      const ref = { kind: 'local' as const, path: '/external/repo' };
      const prompt = service.getPrompt('test', ref);
      expect(prompt).toContain('Scout reference @test');
      expect(prompt).toContain('local directory');
      expect(prompt).toContain('/external/repo');
    });

    it('should generate git reference prompt', () => {
      const ref = {
        kind: 'git' as const,
        repository: 'https://github.com/user/repo.git',
        branch: 'main',
      };
      const prompt = service.getPrompt('test', ref);
      expect(prompt).toContain('Scout reference @test');
      expect(prompt).toContain('git repository');
      expect(prompt).toContain('https://github.com/user/repo.git');
      expect(prompt).toContain('Branch: main');
    });
  });

  describe('getReferences', () => {
    it('should return all configured references', () => {
      const refs = service.getReferences();
      expect(refs).toEqual(config.references);
    });

    it('should return empty object if no references configured', () => {
      const emptyService = new ReferenceService({
        worktree: '/test',
        directory: '/test',
      });
      expect(emptyService.getReferences()).toEqual({});
    });
  });
});
