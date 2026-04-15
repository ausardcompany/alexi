/**
 * Alexi Tool Registry
 * Centralized Alexi-specific tool registration logic
 * Includes SAP AI Core specific tools and feature flags
 */

import type { defineTool } from '../../tool/index.js';

// Type for tool definitions
type ToolDef = ReturnType<typeof defineTool>;

export namespace AlexiToolRegistry {
  /** Build Alexi-specific tools */
  export async function build(): Promise<Record<string, ToolDef>> {
    // Add SAP-specific tools here in the future
    // For now, return empty object
    return {};
  }

  /** Override question-tool client gating */
  export function question(): boolean {
    const client = process.env.ALEXI_CLIENT || 'cli';
    const enableQuestionTool = process.env.ALEXI_ENABLE_QUESTION_TOOL === 'true';
    return (
      ['app', 'cli', 'desktop', 'vscode', 'sap'].includes(client) || enableQuestionTool
    );
  }

  /** Plan tool availability */
  export function plan(): boolean {
    return true;
  }

  /** Alexi-specific tools to append to the builtin list */
  export function extra(
    tools: Record<string, ToolDef>,
    cfg: { experimental?: { codebase_search?: boolean; sap_integration?: boolean } }
  ): ToolDef[] {
    const extra: ToolDef[] = [];
    // Add SAP-specific tools based on config
    if (cfg.experimental?.sap_integration) {
      // extra.push(tools.sapSearch)
    }
    return extra;
  }

  /** Check for E2E LLM URL */
  export function e2e(): boolean {
    return !!process.env.ALEXI_E2E_LLM_URL;
  }
}
