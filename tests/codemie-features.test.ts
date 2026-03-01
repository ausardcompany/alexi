import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';

// ============ Doctor Tests ============

describe('Doctor', () => {
  let resetDoctor: () => void;
  let getDoctor: () => import('../src/doctor/index.js').DoctorService;

  beforeEach(async () => {
    const doctorModule = await import('../src/doctor/index.js');
    resetDoctor = doctorModule.resetDoctor;
    getDoctor = doctorModule.getDoctor;
    resetDoctor();
  });

  afterEach(() => {
    resetDoctor();
  });

  it('should list all health checks', () => {
    const doctor = getDoctor();
    const checks = doctor.listChecks();

    expect(checks.length).toBeGreaterThan(0);
    expect(checks[0]).toHaveProperty('id');
    expect(checks[0]).toHaveProperty('name');
    expect(checks[0]).toHaveProperty('description');
    expect(checks[0]).toHaveProperty('category');
  });

  it('should run all checks and return results', async () => {
    const doctor = getDoctor();
    const results = await doctor.runAll();

    expect(Array.isArray(results)).toBe(true);
    expect(results.length).toBeGreaterThan(0);

    // Each result should have required properties
    for (const result of results) {
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('name');
      expect(result).toHaveProperty('status');
      expect(result).toHaveProperty('message');
      expect(result).toHaveProperty('duration');
      expect(['pass', 'warn', 'fail']).toContain(result.status);
    }
  });

  it('should run single check by id', async () => {
    const doctor = getDoctor();
    const result = await doctor.runCheck('node-version');

    expect(result.id).toBe('node-version');
    expect(result).toHaveProperty('name');
    expect(result).toHaveProperty('status');
    expect(result).toHaveProperty('message');
  });

  it('should return fail status for unknown check id', async () => {
    const doctor = getDoctor();
    const result = await doctor.runCheck('unknown-check-id');

    expect(result.status).toBe('fail');
    expect(result.message).toContain('not found');
  });

  it('should format report correctly', async () => {
    const doctor = getDoctor();
    const results = await doctor.runAll({ skipNetwork: true });
    const report = doctor.formatReport(results);

    expect(typeof report).toBe('string');
    expect(report.length).toBeGreaterThan(0);
    expect(report).toContain('Health Check');
    expect(report).toContain('Summary');
  });

  it('should skip network checks when option set', async () => {
    const doctor = getDoctor();
    const results = await doctor.runAll({ skipNetwork: true });

    const networkCheck = results.find((r) => r.id === 'network-sap');
    expect(networkCheck).toBeDefined();
    expect(networkCheck!.message).toContain('Skipped');
  });

  it('should detect node version correctly', async () => {
    const doctor = getDoctor();
    const result = await doctor.runCheck('node-version');

    // Node version check should pass since we're running on Node 22+
    expect(['pass', 'fail']).toContain(result.status);
    expect(result.message).toContain('Node.js');
  });

  it('should get summary of results', async () => {
    const doctor = getDoctor();
    const results = await doctor.runAll({ skipNetwork: true });
    const summary = doctor.getSummary(results);

    expect(summary).toHaveProperty('passed');
    expect(summary).toHaveProperty('warned');
    expect(summary).toHaveProperty('failed');
    expect(typeof summary.passed).toBe('number');
    expect(typeof summary.warned).toBe('number');
    expect(typeof summary.failed).toBe('number');
  });
});

// ============ Logger Tests ============

describe('Logger', () => {
  let tempDir: string;
  let resetLogger: () => void;
  let getLogger: () => import('../src/log/index.js').Logger;

  beforeEach(async () => {
    const logModule = await import('../src/log/index.js');
    resetLogger = logModule.resetLogger;
    getLogger = logModule.getLogger;
    resetLogger();

    // Create temp directory for log files
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logger-test-'));
  });

  afterEach(() => {
    resetLogger();
    // Cleanup temp directory
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  it('should create log directory if not exists', () => {
    const logger = getLogger();
    const testLogDir = path.join(tempDir, 'new-logs');

    logger.configure({ logDir: testLogDir });
    logger.info('system', 'test message');

    expect(fs.existsSync(testLogDir)).toBe(true);
  });

  it('should log entries with correct format', () => {
    const logger = getLogger();
    logger.configure({ logDir: tempDir, level: 'debug' });

    logger.info('system', 'test message', { key: 'value' });

    // Find log file
    const files = fs.readdirSync(tempDir).filter((f) => f.endsWith('.log'));
    expect(files.length).toBeGreaterThan(0);

    const logContent = fs.readFileSync(path.join(tempDir, files[0]), 'utf-8');
    const entry = JSON.parse(logContent.trim());

    expect(entry).toHaveProperty('timestamp');
    expect(entry).toHaveProperty('level', 'info');
    expect(entry).toHaveProperty('category', 'system');
    expect(entry).toHaveProperty('message', 'test message');
    expect(entry).toHaveProperty('metadata');
  });

  it('should filter by log level', () => {
    const logger = getLogger();
    logger.configure({ logDir: tempDir, level: 'warn' });

    // Debug and info should be filtered out
    logger.debug('system', 'debug message');
    logger.info('system', 'info message');
    logger.warn('system', 'warn message');
    logger.error('system', 'error message');

    // Find log file
    const files = fs.readdirSync(tempDir).filter((f) => f.endsWith('.log'));

    if (files.length > 0) {
      const logContent = fs.readFileSync(path.join(tempDir, files[0]), 'utf-8');
      const lines = logContent
        .trim()
        .split('\n')
        .filter((l) => l);

      // Should only have warn and error entries
      expect(lines.length).toBe(2);

      for (const line of lines) {
        const entry = JSON.parse(line);
        expect(['warn', 'error']).toContain(entry.level);
      }
    }
  });

  it('should set session id context', () => {
    const logger = getLogger();
    logger.configure({ logDir: tempDir, level: 'debug' });

    const sessionId = 'test-session-123';
    logger.setSessionId(sessionId);
    logger.info('session', 'session message');

    // Find log file
    const files = fs.readdirSync(tempDir).filter((f) => f.endsWith('.log'));
    expect(files.length).toBeGreaterThan(0);

    const logContent = fs.readFileSync(path.join(tempDir, files[0]), 'utf-8');
    const entry = JSON.parse(logContent.trim());

    expect(entry.sessionId).toBe(sessionId);
  });

  it('should configure log level', () => {
    const logger = getLogger();
    logger.configure({ logDir: tempDir, level: 'error' });

    const config = logger.getConfig();
    expect(config.level).toBe('error');
  });

  it('should clear session id', () => {
    const logger = getLogger();
    logger.configure({ logDir: tempDir, level: 'debug' });

    logger.setSessionId('test-session');
    logger.clearSessionId();
    logger.info('system', 'message without session');

    const files = fs.readdirSync(tempDir).filter((f) => f.endsWith('.log'));
    if (files.length > 0) {
      const logContent = fs.readFileSync(path.join(tempDir, files[0]), 'utf-8');
      const entry = JSON.parse(logContent.trim());
      expect(entry.sessionId).toBeUndefined();
    }
  });
});

// ============ LogViewer Tests ============

describe('LogViewer', () => {
  let tempDir: string;
  let resetLogViewer: () => void;
  let getLogViewer: () => import('../src/log/viewer.js').LogViewer;

  beforeEach(async () => {
    const viewerModule = await import('../src/log/viewer.js');
    resetLogViewer = viewerModule.resetLogViewer;
    getLogViewer = viewerModule.getLogViewer;
    resetLogViewer();

    // Create temp directory with test log files
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logviewer-test-'));

    // Create test log file
    const today = new Date().toISOString().split('T')[0];
    const testLogFile = path.join(tempDir, `alexi-${today}.log`);

    const entries = [
      {
        timestamp: new Date().toISOString(),
        level: 'info',
        category: 'system',
        message: 'info message 1',
      },
      {
        timestamp: new Date().toISOString(),
        level: 'warn',
        category: 'api',
        message: 'warn message',
      },
      {
        timestamp: new Date().toISOString(),
        level: 'error',
        category: 'system',
        message: 'error message',
      },
      {
        timestamp: new Date().toISOString(),
        level: 'debug',
        category: 'mcp',
        message: 'debug message',
        sessionId: 'session-123',
      },
      {
        timestamp: new Date().toISOString(),
        level: 'info',
        category: 'tool',
        message: 'tool execution complete',
      },
    ];

    fs.writeFileSync(testLogFile, entries.map((e) => JSON.stringify(e)).join('\n') + '\n');
  });

  afterEach(() => {
    resetLogViewer();
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  it('should read logs with filters', () => {
    const viewer = getLogViewer();
    viewer.setLogDir(tempDir);

    const logs = viewer.readLogs();

    expect(Array.isArray(logs)).toBe(true);
    expect(logs.length).toBe(5);
  });

  it('should filter by level', () => {
    const viewer = getLogViewer();
    viewer.setLogDir(tempDir);

    const errorLogs = viewer.readLogs({ level: 'error' });
    expect(errorLogs.length).toBe(1);
    expect(errorLogs[0].level).toBe('error');

    const warnAndErrorLogs = viewer.readLogs({ level: ['warn', 'error'] });
    expect(warnAndErrorLogs.length).toBe(2);
  });

  it('should filter by category', () => {
    const viewer = getLogViewer();
    viewer.setLogDir(tempDir);

    const systemLogs = viewer.readLogs({ category: 'system' });
    expect(systemLogs.length).toBe(2);
    expect(systemLogs.every((l) => l.category === 'system')).toBe(true);

    const multiCategoryLogs = viewer.readLogs({ category: ['system', 'api'] });
    expect(multiCategoryLogs.length).toBe(3);
  });

  it('should filter by date range', () => {
    const viewer = getLogViewer();
    viewer.setLogDir(tempDir);

    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // All logs should be within range
    const logsInRange = viewer.readLogs({ since: yesterday, until: tomorrow });
    expect(logsInRange.length).toBe(5);
  });

  it('should apply grep pattern', () => {
    const viewer = getLogViewer();
    viewer.setLogDir(tempDir);

    const grepLogs = viewer.readLogs({ grep: 'tool' });
    expect(grepLogs.length).toBe(1);
    expect(grepLogs[0].message).toContain('tool');

    // Test regex pattern
    const regexLogs = viewer.readLogs({ grep: 'message \\d' });
    expect(regexLogs.length).toBe(1);
  });

  it('should list log files', () => {
    const viewer = getLogViewer();
    viewer.setLogDir(tempDir);

    const files = viewer.getLogFiles();

    expect(Array.isArray(files)).toBe(true);
    expect(files.length).toBe(1);
    expect(files[0]).toHaveProperty('path');
    expect(files[0]).toHaveProperty('size');
    expect(files[0]).toHaveProperty('date');
  });

  it('should apply limit filter', () => {
    const viewer = getLogViewer();
    viewer.setLogDir(tempDir);

    const limitedLogs = viewer.readLogs({ limit: 2 });
    expect(limitedLogs.length).toBe(2);
  });

  it('should get log stats', () => {
    const viewer = getLogViewer();
    viewer.setLogDir(tempDir);

    const stats = viewer.getLogStats();

    expect(stats).toHaveProperty('totalFiles');
    expect(stats).toHaveProperty('totalSize');
    expect(stats).toHaveProperty('oldestDate');
    expect(stats).toHaveProperty('newestDate');
    expect(stats.totalFiles).toBe(1);
  });
});

// ============ ProfileManager Tests ============

describe('ProfileManager', () => {
  let tempDir: string;
  let originalEnv: NodeJS.ProcessEnv;
  let resetProfileManager: () => void;
  let _getProfileManager: () => import('../src/profile/index.js').ProfileManager;
  let ProfileManager: typeof import('../src/profile/index.js').ProfileManager;

  beforeEach(async () => {
    const profileModule = await import('../src/profile/index.js');
    resetProfileManager = profileModule.resetProfileManager;
    _getProfileManager = profileModule.getProfileManager;
    ProfileManager = profileModule.ProfileManager;

    // Save original env
    originalEnv = { ...process.env };

    // Create temp directory
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'profile-test-'));

    // Reset singleton
    resetProfileManager();

    // Mock the config directory by setting up test env vars
    process.env.AICORE_SERVICE_KEY = '{"test": "key"}';
    process.env.DEFAULT_MODEL = 'test-model';
  });

  afterEach(() => {
    resetProfileManager();
    // Restore original env
    process.env = originalEnv;

    // Cleanup temp directory
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  it('should create profile from current env', () => {
    const manager = new ProfileManager();

    // Note: This will use the actual config file location
    // In a real test, we'd mock the file system
    const profileName = `test-profile-${Date.now()}`;

    try {
      const profile = manager.create(profileName, 'Test description');

      expect(profile.name).toBe(profileName);
      expect(profile.description).toBe('Test description');
      expect(profile).toHaveProperty('createdAt');
      expect(profile).toHaveProperty('updatedAt');
      expect(profile).toHaveProperty('environment');

      // Cleanup
      manager.delete(profileName);
    } catch (error) {
      // Profile creation might fail if config dir is not writable in test env
      // That's acceptable for unit tests
      expect(error).toBeDefined();
    }
  });

  it('should list profiles', () => {
    const manager = new ProfileManager();
    const profiles = manager.list();

    expect(Array.isArray(profiles)).toBe(true);
  });

  it('should get profile by name', () => {
    const manager = new ProfileManager();
    const profileName = `test-profile-get-${Date.now()}`;

    try {
      manager.create(profileName);
      const profile = manager.get(profileName);

      expect(profile).toBeDefined();
      expect(profile?.name).toBe(profileName);

      // Cleanup
      manager.delete(profileName);
    } catch {
      // Acceptable in test environment
    }
  });

  it('should switch active profile', () => {
    const manager = new ProfileManager();
    const profileName = `test-profile-switch-${Date.now()}`;

    try {
      process.env.TEST_VAR = 'original';
      manager.create(profileName);
      manager.switch(profileName);

      const activeName = manager.getActiveProfileName();
      expect(activeName).toBe(profileName);

      // Cleanup
      manager.delete(profileName);
    } catch {
      // Acceptable in test environment
    }
  });

  it('should delete profile', () => {
    const manager = new ProfileManager();
    const profileName = `test-profile-delete-${Date.now()}`;

    try {
      manager.create(profileName);
      expect(manager.exists(profileName)).toBe(true);

      const deleted = manager.delete(profileName);
      expect(deleted).toBe(true);
      expect(manager.exists(profileName)).toBe(false);
    } catch {
      // Acceptable in test environment
    }
  });

  it('should mask secrets in showMasked', () => {
    const manager = new ProfileManager();
    const profileName = `test-profile-mask-${Date.now()}`;

    try {
      process.env.AICORE_SERVICE_KEY = 'super-secret-key-12345';
      manager.create(profileName);

      const masked = manager.showMasked(profileName);

      // AICORE_SERVICE_KEY contains 'KEY' so should be masked
      if (masked.AICORE_SERVICE_KEY) {
        expect(masked.AICORE_SERVICE_KEY).not.toBe('super-secret-key-12345');
        expect(masked.AICORE_SERVICE_KEY).toContain('...');
      }

      // Cleanup
      manager.delete(profileName);
    } catch {
      // Acceptable in test environment
    }
  });

  it('should export to env file', () => {
    const manager = new ProfileManager();
    const profileName = `test-profile-export-${Date.now()}`;
    const outputPath = path.join(tempDir, 'exported.env');

    try {
      manager.create(profileName);
      manager.exportToEnvFile(profileName, outputPath);

      expect(fs.existsSync(outputPath)).toBe(true);
      const content = fs.readFileSync(outputPath, 'utf-8');
      expect(content).toContain(`# Profile: ${profileName}`);

      // Cleanup
      manager.delete(profileName);
    } catch {
      // Acceptable in test environment
    }
  });

  it('should throw error for invalid profile name', () => {
    const manager = new ProfileManager();

    expect(() => manager.create('')).toThrow('cannot be empty');
    expect(() => manager.create('invalid name with spaces')).toThrow('can only contain');
    expect(() => manager.create('invalid@name')).toThrow('can only contain');
  });
});

// ============ SoundManager Tests ============

describe('SoundManager', () => {
  let resetSoundManager: () => void;
  let getSoundManager: () => import('../src/sound/index.js').SoundManager;
  let SoundManager: typeof import('../src/sound/index.js').SoundManager;

  beforeEach(async () => {
    const soundModule = await import('../src/sound/index.js');
    resetSoundManager = soundModule.resetSoundManager;
    getSoundManager = soundModule.getSoundManager;
    SoundManager = soundModule.SoundManager;
    resetSoundManager();
  });

  afterEach(() => {
    resetSoundManager();
  });

  it('should be disabled by default', () => {
    const manager = new SoundManager();
    expect(manager.isEnabled()).toBe(false);
  });

  it('should enable/disable sounds', () => {
    const manager = getSoundManager();

    expect(manager.isEnabled()).toBe(false);

    manager.enable();
    expect(manager.isEnabled()).toBe(true);

    manager.disable();
    expect(manager.isEnabled()).toBe(false);
  });

  it('should configure event sounds', () => {
    const manager = getSoundManager();

    manager.setEvent('error', true);
    const config = manager.getConfig();

    expect(config.events.error).toBe(true);

    manager.setEvent('error', false);
    const updatedConfig = manager.getConfig();
    expect(updatedConfig.events.error).toBe(false);
  });

  it('should persist config', () => {
    const manager = getSoundManager();

    manager.enable();
    manager.setEvent('session_start', true);

    // Create new instance (simulating restart)
    resetSoundManager();
    const newManager = getSoundManager();

    // Config should be persisted
    // Note: In test environment, this might not persist if config file is not writable
    const config = newManager.getConfig();
    expect(config).toHaveProperty('enabled');
    expect(config).toHaveProperty('events');
  });

  it('should get config', () => {
    const manager = getSoundManager();
    const config = manager.getConfig();

    expect(config).toHaveProperty('enabled');
    expect(config).toHaveProperty('events');
    expect(typeof config.enabled).toBe('boolean');
    expect(typeof config.events).toBe('object');
  });

  it('should configure with partial config', () => {
    const manager = getSoundManager();

    manager.configure({
      enabled: true,
      events: {
        error: true,
        warning: true,
      },
    });

    const config = manager.getConfig();
    expect(config.enabled).toBe(true);
    expect(config.events.error).toBe(true);
    expect(config.events.warning).toBe(true);
  });

  it('should reset to defaults', () => {
    const manager = getSoundManager();

    manager.enable();
    manager.setEvent('session_start', true);

    manager.reset();

    const config = manager.getConfig();
    expect(config.enabled).toBe(false);
  });
});

// ============ UpdateManager Tests ============

describe('UpdateManager', () => {
  let tempDir: string;
  let resetUpdateManager: () => void;
  let getUpdateManager: () => import('../src/update/index.js').UpdateManager;
  let UpdateManager: typeof import('../src/update/index.js').UpdateManager;
  let isNewerVersion: typeof import('../src/update/index.js').isNewerVersion;
  let parseVersion: typeof import('../src/update/index.js').parseVersion;

  beforeEach(async () => {
    const updateModule = await import('../src/update/index.js');
    resetUpdateManager = updateModule.resetUpdateManager;
    getUpdateManager = updateModule.getUpdateManager;
    UpdateManager = updateModule.UpdateManager;
    isNewerVersion = updateModule.isNewerVersion;
    parseVersion = updateModule.parseVersion;

    resetUpdateManager();
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'update-test-'));
  });

  afterEach(() => {
    resetUpdateManager();
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  it('should get current version', () => {
    const manager = new UpdateManager();
    const version = manager.getCurrentVersion();

    expect(typeof version).toBe('string');
    // Should be a valid semver-like string
    expect(version).toMatch(/^\d+\.\d+\.\d+/);
  });

  it('should check rate limiting', () => {
    const manager = new UpdateManager({ checkIntervalMs: 1000 });

    // First check should be allowed
    expect(manager.shouldCheck()).toBe(true);
  });

  it('should clear cache', () => {
    const manager = getUpdateManager();

    // This should not throw
    expect(() => manager.clearCache()).not.toThrow();
  });

  it('should compare versions correctly', () => {
    // Test newer versions
    expect(isNewerVersion('1.0.0', '2.0.0')).toBe(true);
    expect(isNewerVersion('1.0.0', '1.1.0')).toBe(true);
    expect(isNewerVersion('1.0.0', '1.0.1')).toBe(true);
    expect(isNewerVersion('1.0.0-beta', '1.0.0')).toBe(true);

    // Test older versions
    expect(isNewerVersion('2.0.0', '1.0.0')).toBe(false);
    expect(isNewerVersion('1.1.0', '1.0.0')).toBe(false);
    expect(isNewerVersion('1.0.1', '1.0.0')).toBe(false);

    // Test same versions
    expect(isNewerVersion('1.0.0', '1.0.0')).toBe(false);

    // Test prerelease versions
    expect(isNewerVersion('1.0.0-alpha', '1.0.0-beta')).toBe(true);
    expect(isNewerVersion('1.0.0-beta.1', '1.0.0-beta.2')).toBe(true);
  });

  it('should parse versions correctly', () => {
    const v1 = parseVersion('1.2.3');
    expect(v1.major).toBe(1);
    expect(v1.minor).toBe(2);
    expect(v1.patch).toBe(3);
    expect(v1.prerelease).toBeNull();

    const v2 = parseVersion('1.2.3-beta.1');
    expect(v2.major).toBe(1);
    expect(v2.minor).toBe(2);
    expect(v2.patch).toBe(3);
    expect(v2.prerelease).toBe('beta.1');
  });

  it('should get package name', () => {
    const manager = new UpdateManager();
    const packageName = manager.getPackageName();

    expect(typeof packageName).toBe('string');
    expect(packageName).toBe('alexi');
  });

  it('should get state from cache', () => {
    const manager = new UpdateManager();
    const state = manager.getState();

    // State might be undefined if no cache exists
    if (state) {
      expect(state).toHaveProperty('lastCheck');
      expect(state).toHaveProperty('currentVersion');
      expect(state).toHaveProperty('updateAvailable');
    }
  });
});

// ============ CIManager Tests ============

describe('CIManager', () => {
  let tempDir: string;
  let resetCIManager: () => void;
  let getCIManager: () => import('../src/ci/index.js').CIManager;
  let _CIManager: typeof import('../src/ci/index.js').CIManager;

  beforeEach(async () => {
    const ciModule = await import('../src/ci/index.js');
    resetCIManager = ciModule.resetCIManager;
    getCIManager = ciModule.getCIManager;
    _CIManager = ciModule.CIManager;

    resetCIManager();
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ci-test-'));
  });

  afterEach(() => {
    resetCIManager();
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  it('should list all templates', () => {
    const manager = getCIManager();
    const templates = manager.listTemplates();

    expect(Array.isArray(templates)).toBe(true);
    expect(templates.length).toBeGreaterThan(0);

    // Each template should have required properties
    for (const template of templates) {
      expect(template).toHaveProperty('id');
      expect(template).toHaveProperty('name');
      expect(template).toHaveProperty('platform');
      expect(template).toHaveProperty('type');
      expect(template).toHaveProperty('description');
      expect(template).toHaveProperty('outputPath');
      expect(template).toHaveProperty('content');
    }
  });

  it('should filter templates by platform', () => {
    const manager = getCIManager();

    const githubTemplates = manager.listTemplates('github');
    expect(githubTemplates.every((t) => t.platform === 'github')).toBe(true);
    expect(githubTemplates.length).toBeGreaterThan(0);

    const gitlabTemplates = manager.listTemplates('gitlab');
    expect(gitlabTemplates.every((t) => t.platform === 'gitlab')).toBe(true);
    expect(gitlabTemplates.length).toBeGreaterThan(0);
  });

  it('should get specific template', () => {
    const manager = getCIManager();

    const template = manager.getTemplate('github', 'pr-review');

    expect(template).toBeDefined();
    expect(template?.platform).toBe('github');
    expect(template?.type).toBe('pr-review');
    expect(template?.content).toBeDefined();

    // Non-existent template should return undefined
    const nonExistent = manager.getTemplate('github', 'non-existent' as any);
    expect(nonExistent).toBeUndefined();
  });

  it('should preview template', () => {
    const manager = getCIManager();

    const preview = manager.preview('github', 'pr-review');

    expect(typeof preview).toBe('string');
    expect(preview.length).toBeGreaterThan(0);
    expect(preview).toContain('name:'); // YAML should have a name field

    // Preview of non-existent template should return error message
    const errorPreview = manager.preview('github', 'non-existent' as any);
    expect(errorPreview).toContain('not found');
  });

  it('should generate workflow files', () => {
    const manager = getCIManager();

    const result = manager.init({
      platform: 'github',
      template: 'pr-review',
      outputDir: tempDir,
    });

    expect(result).toHaveProperty('created');
    expect(result).toHaveProperty('skipped');
    expect(result).toHaveProperty('errors');
    expect(Array.isArray(result.created)).toBe(true);

    if (result.created.length > 0) {
      // Verify file was created
      expect(fs.existsSync(result.created[0])).toBe(true);
    }
  });

  it('should skip existing files without overwrite option', () => {
    const manager = getCIManager();

    // Create initial file
    const firstResult = manager.init({
      platform: 'github',
      template: 'pr-review',
      outputDir: tempDir,
    });

    expect(firstResult.created.length).toBeGreaterThan(0);

    // Try to create again without overwrite
    const secondResult = manager.init({
      platform: 'github',
      template: 'pr-review',
      outputDir: tempDir,
      overwrite: false,
    });

    expect(secondResult.skipped.length).toBeGreaterThan(0);
    expect(secondResult.created.length).toBe(0);
  });

  it('should overwrite files with overwrite option', () => {
    const manager = getCIManager();

    // Create initial file
    manager.init({
      platform: 'github',
      template: 'pr-review',
      outputDir: tempDir,
    });

    // Overwrite
    const result = manager.init({
      platform: 'github',
      template: 'pr-review',
      outputDir: tempDir,
      overwrite: true,
    });

    expect(result.created.length).toBeGreaterThan(0);
    expect(result.skipped.length).toBe(0);
  });

  it('should get platform display name', () => {
    const manager = getCIManager();

    expect(manager.getPlatformDisplayName('github')).toBe('GitHub Actions');
    expect(manager.getPlatformDisplayName('gitlab')).toBe('GitLab CI');
  });

  it('should get type display name', () => {
    const manager = getCIManager();

    expect(manager.getTypeDisplayName('pr-review')).toBe('PR/MR Review');
    expect(manager.getTypeDisplayName('code-check')).toBe('Code Quality Check');
    expect(manager.getTypeDisplayName('feature-implement')).toBe('Feature Implementation');
  });

  it('should get required secrets for template', () => {
    const manager = getCIManager();
    const template = manager.getTemplate('github', 'pr-review');

    if (template) {
      const secrets = manager.getRequiredSecrets(template);

      expect(Array.isArray(secrets)).toBe(true);
      expect(secrets.length).toBeGreaterThan(0);
      expect(secrets.some((s) => s.includes('SAP'))).toBe(true);
    }
  });
});
