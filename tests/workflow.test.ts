import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';
import {
  WorkflowManager,
  STAGE_PROMPTS,
  type WorkflowState,
} from '../src/core/workflowManager.js';
import type { ConversationStage } from '../src/core/stageManager.js';

describe('WorkflowManager', () => {
  let tempDir: string;
  let workflowManager: WorkflowManager;
  
  beforeEach(() => {
    // Create temp directory for workflow state files
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'workflow-test-'));
    workflowManager = new WorkflowManager(tempDir);
  });
  
  afterEach(() => {
    // Cleanup
    workflowManager.reset();
    fs.rmSync(tempDir, { recursive: true, force: true });
  });
  
  describe('startWorkflow', () => {
    it('should start workflow with default architecture stage', () => {
      const state = workflowManager.startWorkflow();
      
      expect(state.currentStage).toBe('architecture');
      expect(state.stageNumber).toBe(1);
      expect(state.artifacts).toEqual([]);
      expect(state.dodPassed).toBe(false);
      expect(state.history).toEqual([]);
    });
    
    it('should start workflow with specified stage', () => {
      const state = workflowManager.startWorkflow('implementation');
      
      expect(state.currentStage).toBe('implementation');
      expect(state.stageNumber).toBe(1);
    });
    
    it('should start workflow with custom name', () => {
      const state = workflowManager.startWorkflow('architecture', 'API Design Phase');
      
      expect(state.stageName).toBe('API Design Phase');
    });
    
    it('should persist workflow state', () => {
      workflowManager.startWorkflow();
      
      // Create new manager to read from file
      const newManager = new WorkflowManager(tempDir);
      const state = newManager.getState();
      
      expect(state).not.toBeNull();
      expect(state!.currentStage).toBe('architecture');
    });
  });
  
  describe('nextStage', () => {
    it('should transition to next stage in order', () => {
      workflowManager.startWorkflow('architecture');
      
      const state = workflowManager.nextStage();
      
      expect(state).not.toBeNull();
      expect(state!.currentStage).toBe('planning');
      expect(state!.stageNumber).toBe(2);
    });
    
    it('should add completed stage to history', () => {
      workflowManager.startWorkflow('architecture');
      workflowManager.nextStage();
      
      const state = workflowManager.getState();
      
      expect(state!.history).toHaveLength(1);
      expect(state!.history[0].stage).toBe('architecture');
      expect(state!.history[0].completedAt).toBeDefined();
    });
    
    it('should allow explicit stage transition', () => {
      workflowManager.startWorkflow('architecture');
      
      const state = workflowManager.nextStage('security');
      
      expect(state!.currentStage).toBe('security');
    });
    
    it('should return null when workflow is complete', () => {
      workflowManager.startWorkflow('security');
      
      const state = workflowManager.nextStage();
      
      expect(state).toBeNull();
    });
    
    it('should throw error if no active workflow', () => {
      expect(() => workflowManager.nextStage()).toThrow('No active workflow');
    });
    
    it('should reset artifacts on stage transition', () => {
      workflowManager.startWorkflow('architecture');
      workflowManager.addArtifact('test-artifact.md');
      
      const state = workflowManager.nextStage();
      
      expect(state!.artifacts).toEqual([]);
    });
  });
  
  describe('addArtifact', () => {
    it('should add artifact to current stage', () => {
      workflowManager.startWorkflow();
      
      workflowManager.addArtifact('architecture-doc.md');
      workflowManager.addArtifact('diagram.png');
      
      const state = workflowManager.getState();
      expect(state!.artifacts).toEqual(['architecture-doc.md', 'diagram.png']);
    });
    
    it('should persist artifacts', () => {
      workflowManager.startWorkflow();
      workflowManager.addArtifact('test.md');
      
      const newManager = new WorkflowManager(tempDir);
      const state = newManager.getState();
      
      expect(state!.artifacts).toContain('test.md');
    });
  });
  
  describe('getSystemPrompt', () => {
    it('should return system prompt for current stage', () => {
      workflowManager.startWorkflow('architecture');
      
      const prompt = workflowManager.getSystemPrompt();
      
      expect(prompt).toContain('software architect');
      expect(prompt).toContain('AI_NOTES.md');
    });
    
    it('should throw error if no active workflow', () => {
      expect(() => workflowManager.getSystemPrompt()).toThrow('No active workflow');
    });
  });
  
  describe('getSummary', () => {
    it('should return summary for active workflow', () => {
      workflowManager.startWorkflow('architecture', 'Test Workflow');
      
      const summary = workflowManager.getSummary();
      
      expect(summary).toContain('Test Workflow');
      expect(summary).toContain('architecture');
      expect(summary).toContain('**Stage Number:** 1');
    });
    
    it('should return message when no workflow active', () => {
      const summary = workflowManager.getSummary();
      
      expect(summary).toBe('No active workflow');
    });
    
    it('should include completed stages in summary', () => {
      workflowManager.startWorkflow('architecture', 'Phase 1');
      workflowManager.nextStage('planning', 'Phase 2');
      
      const summary = workflowManager.getSummary();
      
      expect(summary).toContain('Completed Stages');
      expect(summary).toContain('Phase 1');
    });
  });
  
  describe('reset', () => {
    it('should clear workflow state', () => {
      workflowManager.startWorkflow();
      workflowManager.reset();
      
      expect(workflowManager.getState()).toBeNull();
    });
    
    it('should remove state file', () => {
      workflowManager.startWorkflow();
      const statePath = path.join(tempDir, '.workflow-state.json');
      expect(fs.existsSync(statePath)).toBe(true);
      
      workflowManager.reset();
      
      expect(fs.existsSync(statePath)).toBe(false);
    });
  });
});

describe('STAGE_PROMPTS', () => {
  const stages: ConversationStage[] = [
    'architecture',
    'planning',
    'implementation',
    'documentation',
    'devops',
    'security',
  ];
  
  stages.forEach(stage => {
    describe(`${stage} prompts`, () => {
      it('should have system prompt', () => {
        expect(STAGE_PROMPTS[stage].system).toBeDefined();
        expect(STAGE_PROMPTS[stage].system.length).toBeGreaterThan(50);
      });
      
      it('should have review prompt', () => {
        expect(STAGE_PROMPTS[stage].review).toBeDefined();
      });
      
      it('should have planning prompt', () => {
        expect(STAGE_PROMPTS[stage].planning).toBeDefined();
      });
      
      it('should have code review prompt', () => {
        expect(STAGE_PROMPTS[stage].codeReview).toBeDefined();
      });
      
      it('should have AI notes template', () => {
        expect(STAGE_PROMPTS[stage].aiNotesTemplate).toBeDefined();
        expect(STAGE_PROMPTS[stage].aiNotesTemplate).toContain('{STAGE_NUMBER}');
        expect(STAGE_PROMPTS[stage].aiNotesTemplate).toContain('{STAGE_NAME}');
      });
    });
  });
  
  it('should have prompts for all stages', () => {
    expect(Object.keys(STAGE_PROMPTS)).toHaveLength(stages.length);
  });
});
