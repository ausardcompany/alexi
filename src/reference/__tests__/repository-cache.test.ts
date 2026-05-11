/**
 * Repository Cache Service Tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { RepositoryCacheService } from '../repository-cache.js';
import * as path from 'path';

describe('RepositoryCacheService', () => {
  let service: RepositoryCacheService;
  const cacheDir = '/test/cache';

  beforeEach(() => {
    service = new RepositoryCacheService(cacheDir);
  });

  describe('get and set', () => {
    it('should cache and retrieve repository', () => {
      const repo = 'https://github.com/user/repo.git';
      const localPath = '/cached/repo';

      expect(service.get(repo)).toBeUndefined();

      service.set(repo, localPath);
      const cached = service.get(repo);

      expect(cached).toBeDefined();
      expect(cached?.repository).toBe(repo);
      expect(cached?.path).toBe(localPath);
      expect(cached?.lastAccessed).toBeInstanceOf(Date);
    });

    it('should cache repository with branch', () => {
      const repo = 'https://github.com/user/repo.git';
      const branch = 'develop';
      const localPath = '/cached/repo-develop';

      service.set(repo, localPath, branch);
      const cached = service.get(repo, branch);

      expect(cached).toBeDefined();
      expect(cached?.branch).toBe(branch);
    });

    it('should differentiate repositories by branch', () => {
      const repo = 'https://github.com/user/repo.git';

      service.set(repo, '/cached/main', 'main');
      service.set(repo, '/cached/develop', 'develop');

      const mainCached = service.get(repo, 'main');
      const developCached = service.get(repo, 'develop');

      expect(mainCached?.path).toBe('/cached/main');
      expect(developCached?.path).toBe('/cached/develop');
    });

    it('should update lastAccessed on get', () => {
      const repo = 'https://github.com/user/repo.git';
      service.set(repo, '/cached/repo');

      const cached1 = service.get(repo);
      const time1 = cached1?.lastAccessed.getTime();

      // Small delay to ensure time difference
      const cached2 = service.get(repo);
      const time2 = cached2?.lastAccessed.getTime();

      expect(time2).toBeGreaterThanOrEqual(time1!);
    });
  });

  describe('getCachePath', () => {
    it('should generate consistent cache paths', () => {
      const repo = 'https://github.com/user/repo.git';
      const path1 = service.getCachePath(repo);
      const path2 = service.getCachePath(repo);

      expect(path1).toBe(path2);
      expect(path1).toContain(cacheDir);
      expect(path1).toContain('repos');
    });

    it('should generate different paths for different branches', () => {
      const repo = 'https://github.com/user/repo.git';
      const mainPath = service.getCachePath(repo, 'main');
      const devPath = service.getCachePath(repo, 'develop');

      expect(mainPath).not.toBe(devPath);
    });
  });

  describe('clear', () => {
    it('should clear all cached repositories', () => {
      service.set('https://github.com/user/repo1.git', '/cached/repo1');
      service.set('https://github.com/user/repo2.git', '/cached/repo2');

      expect(service.getAll()).toHaveLength(2);

      service.clear();

      expect(service.getAll()).toHaveLength(0);
      expect(service.get('https://github.com/user/repo1.git')).toBeUndefined();
    });
  });

  describe('getAll', () => {
    it('should return all cached repositories', () => {
      service.set('https://github.com/user/repo1.git', '/cached/repo1');
      service.set('https://github.com/user/repo2.git', '/cached/repo2', 'main');

      const all = service.getAll();

      expect(all).toHaveLength(2);
      expect(all[0].repository).toBe('https://github.com/user/repo1.git');
      expect(all[1].repository).toBe('https://github.com/user/repo2.git');
    });

    it('should return empty array when no repositories cached', () => {
      expect(service.getAll()).toHaveLength(0);
    });
  });
});
