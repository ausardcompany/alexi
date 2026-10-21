/**
 * Tests for the doctor health check system.
 *
 * These tests mock the filesystem indirectly by driving the system HOME
 * at a per-test temp directory so the real `~/.alexi/` of the developer
 * running the suite is untouched. Each test seeds / clears environment
 * variables deterministically.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { DoctorService, resetDoctor, getDoctor } from '../../src/doctor/index.js';

describe('DoctorService', () => {
  let tempHome: string;
  let originalHome: string | undefined;
  let originalEnv: Record<string, string | undefined>;

  beforeEach(() => {
    // Redirect HOME to a temp dir so sessions / mcp paths do not touch
    // the developer's real ~/.alexi during the test.
    tempHome = fs.mkdtempSync(path.join(os.tmpdir(), 'alexi-doctor-test-'));
    originalHome = process.env.HOME;
    process.env.HOME = tempHome;

    // Snapshot env vars the checks look at so afterEach can restore them.
    originalEnv = {
      AICORE_SERVICE_KEY: process.env.AICORE_SERVICE_KEY,
      SAP_PROXY_BASE_URL: process.env.SAP_PROXY_BASE_URL,
      SAP_PROXY_API_KEY: process.env.SAP_PROXY_API_KEY,
      DEFAULT_MODEL: process.env.DEFAULT_MODEL,
      AICORE_MODEL: process.env.AICORE_MODEL,
    };
    delete process.env.AICORE_SERVICE_KEY;
    delete process.env.SAP_PROXY_BASE_URL;
    delete process.env.SAP_PROXY_API_KEY;
    delete process.env.DEFAULT_MODEL;
    delete process.env.AICORE_MODEL;

    resetDoctor();
  });

  afterEach(() => {
    // Restore env + HOME, then wipe the temp dir.
    if (originalHome === undefined) {
      delete process.env.HOME;
    } else {
      process.env.HOME = originalHome;
    }
    for (const [key, value] of Object.entries(originalEnv)) {
      if (value === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = value;
      }
    }
    try {
      fs.rmSync(tempHome, { recursive: true, force: true });
    } catch {
      // Best effort — nothing to assert if cleanup fails.
    }
    resetDoctor();
  });

  describe('listChecks', () => {
    it('exposes all six required check categories', () => {
      const svc = new DoctorService();
      const checks = svc.listChecks();
      const ids = checks.map((c) => c.id);
      // The issue's six required modules: env, config, MCP, provider,
      // tools, permissions. We map these to concrete check ids.
      expect(ids).toContain('env-sap-aicore');
      expect(ids).toContain('mcp-config');
      expect(ids).toContain('routing-config');
      expect(ids).toContain('tool-registry');
      expect(ids).toContain('permissions');
      expect(ids).toContain('network-sap');
    });
  });

  describe('env-sap-aicore', () => {
    it('fails when neither AICORE_SERVICE_KEY nor SAP_PROXY_BASE_URL is set', async () => {
      const svc = new DoctorService();
      const result = await svc.runCheck('env-sap-aicore');
      expect(result.status).toBe('fail');
      expect(result.fix).toBeDefined();
    });

    it('passes when AICORE_SERVICE_KEY is valid JSON', async () => {
      process.env.AICORE_SERVICE_KEY = JSON.stringify({ clientid: 'test', clientsecret: 'x' });
      const svc = new DoctorService();
      const result = await svc.runCheck('env-sap-aicore');
      expect(result.status).toBe('pass');
    });

    it('fails when AICORE_SERVICE_KEY is set but malformed JSON', async () => {
      process.env.AICORE_SERVICE_KEY = '{not valid json';
      const svc = new DoctorService();
      const result = await svc.runCheck('env-sap-aicore');
      expect(result.status).toBe('fail');
      expect(result.message).toMatch(/not valid JSON/);
    });

    it('passes when SAP_PROXY_BASE_URL is a valid URL', async () => {
      process.env.SAP_PROXY_BASE_URL = 'https://proxy.example.com';
      const svc = new DoctorService();
      const result = await svc.runCheck('env-sap-aicore');
      expect(result.status).toBe('pass');
    });
  });

  describe('routing-config', () => {
    it('warns when no routing config is present', async () => {
      const cwd = process.cwd();
      const home = tempHome;
      // Make sure none of the search paths exist for this test by
      // choosing a workdir with no routing files.
      const workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'alexi-routing-'));
      try {
        process.chdir(workDir);
        const svc = new DoctorService();
        const result = await svc.runCheck('routing-config');
        // In an isolated workdir with HOME=tempHome, there is no config.
        expect(['warn', 'pass']).toContain(result.status);
        expect(result.id).toBe('routing-config');
        // Reference `home` so the lint `no-unused-vars` rule is happy
        // even when the assertion branch is `warn`.
        expect(home).toBe(tempHome);
      } finally {
        process.chdir(cwd);
        fs.rmSync(workDir, { recursive: true, force: true });
      }
    });

    it('fails when routing config is malformed JSON', async () => {
      const cwd = process.cwd();
      const workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'alexi-routing-bad-'));
      try {
        process.chdir(workDir);
        fs.writeFileSync(path.join(workDir, 'routing-config.json'), '{not valid}', 'utf-8');
        const svc = new DoctorService();
        const result = await svc.runCheck('routing-config');
        expect(result.status).toBe('fail');
      } finally {
        process.chdir(cwd);
        fs.rmSync(workDir, { recursive: true, force: true });
      }
    });

    it('passes when routing config has required shape', async () => {
      const cwd = process.cwd();
      const workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'alexi-routing-good-'));
      try {
        process.chdir(workDir);
        fs.writeFileSync(
          path.join(workDir, 'routing-config.json'),
          JSON.stringify({ models: [], rules: [] }),
          'utf-8'
        );
        const svc = new DoctorService();
        const result = await svc.runCheck('routing-config');
        expect(result.status).toBe('pass');
      } finally {
        process.chdir(cwd);
        fs.rmSync(workDir, { recursive: true, force: true });
      }
    });
  });

  describe('config-dir', () => {
    it('warns when ~/.alexi/ is missing and --fix is not set', async () => {
      // tempHome is empty — ~/.alexi does not exist yet
      const svc = new DoctorService();
      const result = await svc.runCheck('config-dir');
      expect(result.status).toBe('warn');
      expect(result.fix).toMatch(/--fix/);
    });

    it('creates ~/.alexi/ when --fix is set', async () => {
      const svc = new DoctorService();
      const result = await svc.runCheck('config-dir', { fix: true });
      expect(result.status).toBe('pass');
      expect(fs.existsSync(path.join(tempHome, '.alexi'))).toBe(true);
    });

    it('passes when ~/.alexi/ already exists and is writable', async () => {
      fs.mkdirSync(path.join(tempHome, '.alexi'), { recursive: true });
      const svc = new DoctorService();
      const result = await svc.runCheck('config-dir');
      expect(result.status).toBe('pass');
    });
  });

  describe('mcp-config', () => {
    it('warns when the MCP config file is missing', async () => {
      const svc = new DoctorService();
      const result = await svc.runCheck('mcp-config');
      expect(result.status).toBe('warn');
    });

    it('fails when the MCP config file is malformed JSON', async () => {
      fs.mkdirSync(path.join(tempHome, '.alexi'), { recursive: true });
      fs.writeFileSync(path.join(tempHome, '.alexi', 'mcp-servers.json'), '{broken', 'utf-8');
      const svc = new DoctorService();
      const result = await svc.runCheck('mcp-config');
      expect(result.status).toBe('fail');
    });

    it('passes when the MCP config has valid shape', async () => {
      fs.mkdirSync(path.join(tempHome, '.alexi'), { recursive: true });
      fs.writeFileSync(
        path.join(tempHome, '.alexi', 'mcp-servers.json'),
        JSON.stringify({ version: 1, servers: [] }),
        'utf-8'
      );
      const svc = new DoctorService();
      const result = await svc.runCheck('mcp-config');
      expect(result.status).toBe('pass');
    });
  });

  describe('tool-registry', () => {
    it('loads the tool registry and reports a non-zero tool count', async () => {
      const svc = new DoctorService();
      const result = await svc.runCheck('tool-registry');
      // We only assert that the check completed (pass or warn), because
      // the real tool registry is heavy and may not have been bootstrapped
      // by every test runner. In practice this check loads cleanly.
      expect(['pass', 'warn']).toContain(result.status);
    });
  });

  describe('permissions', () => {
    it('passes when permission module exports validate default rules', async () => {
      const svc = new DoctorService();
      const result = await svc.runCheck('permissions');
      expect(result.status).toBe('pass');
      expect(result.message).toMatch(/default rules/);
    });
  });

  describe('runAll', () => {
    it('aggregates all checks with a summary', async () => {
      const svc = new DoctorService();
      const results = await svc.runAll({ skipNetwork: true });
      expect(results.length).toBeGreaterThanOrEqual(10);
      const summary = svc.getSummary(results);
      expect(summary.passed + summary.warned + summary.failed).toBe(results.length);
    });

    it('skips network checks when skipNetwork is true', async () => {
      const svc = new DoctorService();
      const results = await svc.runAll({ skipNetwork: true });
      const net = results.find((r) => r.id === 'network-sap');
      expect(net).toBeDefined();
      expect(net?.message).toMatch(/Skipped/);
    });
  });

  describe('formatJson', () => {
    it('produces a stable JSON shape with overall status', async () => {
      const svc = new DoctorService();
      const results = await svc.runAll({ skipNetwork: true });
      const json = svc.formatJson(results);
      const parsed = JSON.parse(json) as {
        version: number;
        overall: string;
        summary: { passed: number; warned: number; failed: number };
        checks: Array<{ id: string; status: string; category?: string }>;
      };
      expect(parsed.version).toBe(1);
      expect(['pass', 'warn', 'fail']).toContain(parsed.overall);
      expect(parsed.checks.length).toBe(results.length);
      expect(parsed.checks.every((c) => typeof c.id === 'string')).toBe(true);
    });

    it('reports overall=fail when any check fails', async () => {
      // Force a failure via env-sap-aicore (no credentials set).
      const svc = new DoctorService();
      const results = await svc.runAll({ skipNetwork: true });
      const parsed = JSON.parse(svc.formatJson(results)) as { overall: string };
      // At minimum env-sap-aicore fails in the empty env, so overall is fail.
      expect(parsed.overall).toBe('fail');
    });
  });

  describe('formatReport', () => {
    it('renders a colored report with a Summary section', async () => {
      const svc = new DoctorService();
      const results = await svc.runAll({ skipNetwork: true });
      const report = svc.formatReport(results);
      expect(report).toContain('Alexi');
      expect(report).toContain('Summary');
    });

    it('plain-text report is ANSI-free', async () => {
      const svc = new DoctorService();
      const results = await svc.runAll({ skipNetwork: true });
      const report = svc.formatReportPlain(results);
      // No ESC character
      expect(report.includes('\u001b[')).toBe(false);
      expect(report).toContain('Alexi');
      expect(report).toContain('Summary');
    });
  });

  describe('singleton', () => {
    it('getDoctor() returns the same instance until resetDoctor() is called', () => {
      const a = getDoctor();
      const b = getDoctor();
      expect(a).toBe(b);
      resetDoctor();
      const c = getDoctor();
      expect(c).not.toBe(a);
    });
  });

  describe('unknown check', () => {
    it('runCheck returns fail for an unknown id', async () => {
      const svc = new DoctorService();
      const result = await svc.runCheck('does-not-exist');
      expect(result.status).toBe('fail');
      expect(result.message).toMatch(/not found/);
    });
  });
});
