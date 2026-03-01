/**
 * Tests for Data Export/Import System
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { DataExporter, getDataExporter, resetDataExporter, type ExportedData } from '../dataExporter.js';
import { resetCostTracker, getCostTracker } from '../costTracker.js';
import { resetMemoryManager, getMemoryManager } from '../memory.js';

describe('DataExporter', () => {
  let testDir: string;
  let exporter: DataExporter;

  beforeEach(() => {
    // Create temp directory for tests
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'alexi-export-test-'));
    
    // Create sessions directory
    fs.mkdirSync(path.join(testDir, 'sessions'), { recursive: true });
    
    // Reset singletons
    resetDataExporter();
    resetCostTracker();
    resetMemoryManager();
    
    exporter = new DataExporter(testDir);
  });

  afterEach(() => {
    // Clean up test directory
    fs.rmSync(testDir, { recursive: true, force: true });
    resetDataExporter();
    resetCostTracker();
    resetMemoryManager();
  });

  describe('exportToJson', () => {
    it('should export empty data when no data exists', async () => {
      const data = await exporter.exportToJson();
      
      expect(data.metadata.version).toBe('1.0.0');
      expect(data.metadata.source).toBe('alexi-cli');
      expect(data.metadata.exportedAt).toBeLessThanOrEqual(Date.now());
      expect(data.sessions).toEqual([]);
    });

    it('should export sessions when they exist', async () => {
      // Create a test session
      const session = {
        metadata: {
          id: 'test-session-123',
          created: Date.now(),
          updated: Date.now(),
          modelId: 'gpt-4o',
          totalTokens: 100,
          messageCount: 2,
        },
        messages: [
          { role: 'user' as const, content: 'Hello', timestamp: Date.now() },
          { role: 'assistant' as const, content: 'Hi there!', timestamp: Date.now() },
        ],
      };
      
      fs.writeFileSync(
        path.join(testDir, 'sessions', `${session.metadata.id}.json`),
        JSON.stringify(session, null, 2)
      );
      
      const data = await exporter.exportToJson({ includeSessions: true });
      
      expect(data.sessions).toHaveLength(1);
      expect(data.sessions![0].metadata.id).toBe('test-session-123');
      expect(data.sessions![0].messages).toHaveLength(2);
    });

    it('should filter sessions by IDs when specified', async () => {
      // Create multiple sessions
      const sessions = [
        { metadata: { id: 'session-1', created: Date.now(), updated: Date.now(), totalTokens: 0, messageCount: 0 }, messages: [] },
        { metadata: { id: 'session-2', created: Date.now(), updated: Date.now(), totalTokens: 0, messageCount: 0 }, messages: [] },
        { metadata: { id: 'session-3', created: Date.now(), updated: Date.now(), totalTokens: 0, messageCount: 0 }, messages: [] },
      ];
      
      for (const s of sessions) {
        fs.writeFileSync(
          path.join(testDir, 'sessions', `${s.metadata.id}.json`),
          JSON.stringify(s, null, 2)
        );
      }
      
      const data = await exporter.exportToJson({
        includeSessions: true,
        sessionIds: ['session-1', 'session-3'],
      });
      
      expect(data.sessions).toHaveLength(2);
      const ids = data.sessions!.map(s => s.metadata.id);
      expect(ids).toContain('session-1');
      expect(ids).toContain('session-3');
      expect(ids).not.toContain('session-2');
    });

    it('should exclude data types when specified', async () => {
      const data = await exporter.exportToJson({
        includeSessions: false,
        includeMemories: false,
        includeCosts: false,
        includeConfig: false,
      });
      
      expect(data.sessions).toBeUndefined();
      expect(data.memories).toBeUndefined();
      expect(data.costs).toBeUndefined();
      expect(data.config).toBeUndefined();
    });
  });

  describe('exportToFile', () => {
    it('should export to JSON file', async () => {
      const filePath = path.join(testDir, 'export.json');
      
      await exporter.exportToFile(filePath);
      
      expect(fs.existsSync(filePath)).toBe(true);
      const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      expect(content.metadata.version).toBe('1.0.0');
    });

    it('should export to Markdown file', async () => {
      const filePath = path.join(testDir, 'export.md');
      
      await exporter.exportToFile(filePath, { format: 'markdown' });
      
      expect(fs.existsSync(filePath)).toBe(true);
      const content = fs.readFileSync(filePath, 'utf-8');
      expect(content).toContain('# Alexi Export');
    });

    it('should export to CSV file', async () => {
      const filePath = path.join(testDir, 'export.csv');
      
      await exporter.exportToFile(filePath, { format: 'csv' });
      
      expect(fs.existsSync(filePath)).toBe(true);
      const content = fs.readFileSync(filePath, 'utf-8');
      // CSV is mainly for costs, might be empty
      expect(typeof content).toBe('string');
    });

    it('should auto-detect format from extension', async () => {
      const mdPath = path.join(testDir, 'test.md');
      await exporter.exportToFile(mdPath);
      
      const content = fs.readFileSync(mdPath, 'utf-8');
      expect(content).toContain('# Alexi Export');
    });
  });

  describe('importFromJson', () => {
    it('should import sessions', async () => {
      const data: ExportedData = {
        metadata: { version: '1.0.0', exportedAt: Date.now(), source: 'test' },
        sessions: [
          {
            metadata: {
              id: 'imported-session',
              created: Date.now(),
              updated: Date.now(),
              totalTokens: 50,
              messageCount: 1,
            },
            messages: [{ role: 'user', content: 'Test', timestamp: Date.now() }],
          },
        ],
      };
      
      const result = await exporter.importFromJson(data);
      
      expect(result.success).toBe(true);
      expect(result.imported.sessions).toBe(1);
      
      // Verify session was written
      const sessionPath = path.join(testDir, 'sessions', 'imported-session.json');
      expect(fs.existsSync(sessionPath)).toBe(true);
    });

    it('should skip existing sessions when skipExisting is true', async () => {
      // Create existing session
      const existingSession = {
        metadata: { id: 'existing', created: Date.now(), updated: Date.now(), totalTokens: 0, messageCount: 0 },
        messages: [],
      };
      fs.writeFileSync(
        path.join(testDir, 'sessions', 'existing.json'),
        JSON.stringify(existingSession)
      );
      
      const data: ExportedData = {
        metadata: { version: '1.0.0', exportedAt: Date.now(), source: 'test' },
        sessions: [
          { metadata: { id: 'existing', created: Date.now(), updated: Date.now(), totalTokens: 100, messageCount: 5 }, messages: [] },
        ],
      };
      
      const result = await exporter.importFromJson(data, { skipExisting: true });
      
      expect(result.imported.sessions).toBe(0);
    });

    it('should replace existing data when mode is replace', async () => {
      // Create existing session
      fs.writeFileSync(
        path.join(testDir, 'sessions', 'old-session.json'),
        JSON.stringify({ metadata: { id: 'old-session', created: 0, updated: 0, totalTokens: 0, messageCount: 0 }, messages: [] })
      );
      
      const data: ExportedData = {
        metadata: { version: '1.0.0', exportedAt: Date.now(), source: 'test' },
        sessions: [
          { metadata: { id: 'new-session', created: Date.now(), updated: Date.now(), totalTokens: 0, messageCount: 0 }, messages: [] },
        ],
      };
      
      const result = await exporter.importFromJson(data, { mode: 'replace' });
      
      expect(result.success).toBe(true);
      // Old session should be deleted
      expect(fs.existsSync(path.join(testDir, 'sessions', 'old-session.json'))).toBe(false);
      // New session should exist
      expect(fs.existsSync(path.join(testDir, 'sessions', 'new-session.json'))).toBe(true);
    });

    it('should fail on invalid data', async () => {
      const invalidData = { } as ExportedData; // Missing metadata
      
      const result = await exporter.importFromJson(invalidData);
      
      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('importFromFile', () => {
    it('should import from JSON file', async () => {
      const data: ExportedData = {
        metadata: { version: '1.0.0', exportedAt: Date.now(), source: 'test' },
        sessions: [],
      };
      
      const filePath = path.join(testDir, 'import.json');
      fs.writeFileSync(filePath, JSON.stringify(data));
      
      const result = await exporter.importFromFile(filePath);
      
      expect(result.success).toBe(true);
    });

    it('should fail on missing file', async () => {
      const result = await exporter.importFromFile('/nonexistent/file.json');
      
      expect(result.success).toBe(false);
      expect(result.errors[0]).toContain('File not found');
    });

    it('should fail on invalid JSON', async () => {
      const filePath = path.join(testDir, 'invalid.json');
      fs.writeFileSync(filePath, 'not valid json');
      
      const result = await exporter.importFromFile(filePath);
      
      expect(result.success).toBe(false);
      expect(result.errors[0]).toContain('Failed to parse');
    });
  });

  describe('singleton', () => {
    it('should return same instance', () => {
      resetDataExporter();
      const instance1 = getDataExporter();
      const instance2 = getDataExporter();
      
      expect(instance1).toBe(instance2);
    });

    it('should reset instance', () => {
      const instance1 = getDataExporter();
      resetDataExporter();
      const instance2 = getDataExporter();
      
      expect(instance1).not.toBe(instance2);
    });
  });
});
