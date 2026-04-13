# Architectural Compatibility Analysis: Alexi vs. Upstream Projects

**Date**: 2026-04-13  
**Analyst**: AI Code Assistant  
**Purpose**: Document architectural differences to guide future update planning

## Overview

This document analyzes the architectural differences between Alexi and the tracked upstream projects (kilocode, opencode, claude-code) to prevent future incompatible update plans.

## Architecture Comparison Matrix

| Aspect | Alexi | kilocode/opencode |
|--------|-------|-------------------|
| **Primary SDK** | SAP AI SDK (@sap-ai-sdk/orchestration) | Vercel AI SDK (ai, @ai-sdk/provider-utils) |
| **Framework** | Plain Node.js/TypeScript | Effect framework |
| **Async Pattern** | async/await, Promises | Effect generators (yield*) |
| **Service Layer** | Direct imports | Effect services (Service.Service) |
| **Error Handling** | try/catch with ToolResult | Effect error channels |
| **Tool System** | Custom defineTool with Zod | Provider tool factories |
| **Providers** | SAP AI Core (OpenAI proxy, Bedrock) | Direct provider APIs (OpenAI, Anthropic, etc.) |
| **CLI Framework** | Commander.js | Custom CLI with Effect |
| **UI** | Ink (React for terminal) | Terminal UI with Ink |
| **Configuration** | JSON files + environment | Effect Config service |
| **Session Management** | Custom SessionManager class | Effect-based session state |

## Dependency Analysis

### Alexi Dependencies (package.json)
```json
{
  "@sap-ai-sdk/ai-api": "^2.9.0",
  "@sap-ai-sdk/orchestration": "^2.9.0",
  "commander": "^14.0.3",
  "ink": "^6.8.0",
  "zod": "^4.3.6"
}
```

### kilocode/opencode Dependencies (estimated)
```json
{
  "ai": "^6.x",
  "@ai-sdk/provider-utils": "^x.x",
  "effect": "^3.x",
  "@effect/platform": "^x.x"
}
```

**Compatibility**: ❌ **Zero overlap** in core dependencies

## File Structure Comparison

### Alexi Structure
```
src/
├── cli/          # Commander-based CLI
├── core/         # Orchestrator, session management
├── providers/    # SAP AI Core providers
├── agent/        # Agent system (simple registry)
├── tool/         # Tool definitions with Zod
│   └── tools/    # Individual tool implementations
├── permission/   # Permission management
└── config/       # JSON-based configuration
```

### kilocode/opencode Structure (inferred from plan)
```
src/
├── tool/         # Provider tool factories
│   ├── code-interpreter.ts
│   ├── file-search.ts
│   └── image-generation.ts
├── agent/        # Effect-based agent service
├── session/      # Effect-based session state
├── snapshot/     # Git snapshot system
└── providers/    # Multi-provider support
    ├── alibaba.ts
    └── transform.ts
```

**Compatibility**: ⚠️ **Similar concepts, different implementations**

## Code Pattern Comparison

### Tool Definition

**Alexi Pattern:**
```typescript
import { defineTool } from '../index.js';
import { z } from 'zod';

export const bashTool = defineTool<typeof BashParamsSchema, BashResult>({
  name: 'bash',
  description: 'Execute bash commands',
  parameters: BashParamsSchema,
  permission: { action: 'execute', getResource: (p) => p.command },
  async execute(params, context): Promise<ToolResult<BashResult>> {
    // Implementation with try/catch
  }
});
```

**kilocode/opencode Pattern:**
```typescript
import { createProviderToolFactoryWithOutputSchema } from "@ai-sdk/provider-utils";

export const toolFactory = createProviderToolFactoryWithOutputSchema<...>({
  id: "openai.tool_name",
  inputSchema: schema,
  outputSchema: outputSchema,
});
```

### Agent System

**Alexi Pattern:**
```typescript
// Simple registry with built-in agents
class AgentRegistry {
  private agents: Map<string, Agent> = new Map();
  register(config: AgentConfig): Agent { ... }
  get(idOrAlias: string): Agent | undefined { ... }
}

export function getCurrentAgent(): Agent {
  return getAgentRegistry().getCurrent();
}
```

**kilocode/opencode Pattern:**
```typescript
// Effect service layer
export namespace Agent {
  export const layer = Layer.effect(
    Service,
    Effect.gen(function* () {
      const config = yield* Config.Service;
      const skill = yield* Skill.Service;
      // ...
    })
  );
}
```

### Session Management

**Alexi Pattern:**
```typescript
export class SessionManager {
  private activeSession: Session | null = null;
  
  addMessage(role, content, tokens?): void {
    // Direct state mutation with disk persistence
    this.activeSession!.messages.push(message);
    this.saveSession(this.activeSession!);
  }
}
```

**kilocode/opencode Pattern:**
```typescript
// Effect-based state management
export namespace Session {
  export const addMessage = Effect.fn(function* (msg) {
    const state = yield* SessionState;
    yield* state.update(/* ... */);
  });
}
```

## Compatibility Mapping

### ✅ Directly Transferable Concepts
1. **Agent switching syntax** (@agent) - Already implemented in Alexi
2. **Tool permission system** - Similar pattern exists
3. **Session persistence** - Different implementation, same concept
4. **Multi-turn conversations** - Core feature in both

### ⚠️ Requires Significant Adaptation
1. **PowerShell support** - Could adapt to Alexi's bash tool
2. **Token counting improvements** - Review Alexi's implementation
3. **Provider abstractions** - SAP AI Core has different model
4. **Caching strategies** - Different provider capabilities

### ❌ Not Compatible
1. **AI SDK v6 provider tools** - Alexi doesn't use Vercel AI SDK
2. **Effect framework patterns** - Alexi uses plain async/await
3. **Provider tool factories** - Different tool system
4. **Effect services** - No Effect dependency
5. **Alibaba provider** - SAP AI Core doesn't support
6. **Snapshot system** - Feature doesn't exist in Alexi

## Update Strategy Recommendations

### 1. Concept-Based Updates (Recommended)
Instead of code diffs, extract **high-level concepts** from upstream:

**Example:**
- ✅ "Upstream improved shell command handling for Windows"
  - → Review Alexi's bash tool for Windows compatibility
- ✅ "Upstream added token usage deduplication"
  - → Audit Alexi's SessionManager for similar issues
- ❌ "Upstream migrated to Effect services"
  - → Not applicable to Alexi's architecture

### 2. Pre-Planning Compatibility Check
Before generating update plans, run checks:

```typescript
interface CompatibilityCheck {
  fileExists: boolean;           // Does target file exist?
  dependencyMatch: boolean;      // Do dependencies align?
  patternMatch: boolean;         // Is code pattern compatible?
  architectureMatch: boolean;    // Is overall architecture compatible?
}
```

### 3. Alexi-Specific Update Sources
Consider tracking these instead:
- SAP AI SDK releases and changelogs
- SAP AI Core API updates
- Commander.js updates
- Ink framework updates
- Zod schema validation improvements

### 4. Manual Review Process
For upstream changes that seem valuable:
1. Extract the **problem being solved**
2. Check if Alexi has the **same problem**
3. Design an **Alexi-native solution**
4. Implement **without copying code**

## Conclusion

Alexi and kilocode/opencode are **architecturally incompatible** at the code level but share **conceptual similarities** at the feature level. Future update planning should focus on:

1. **Concept extraction** over code copying
2. **Problem-solution mapping** over direct translation
3. **Alexi-native implementations** over framework migration
4. **SAP AI Core alignment** over multi-provider abstractions

## Appendix: Useful Upstream Concepts

### From kilocode/opencode (Conceptual Only)

1. **PowerShell First-Class Support**
   - Problem: Windows developers need PowerShell, not bash
   - Alexi Impact: bash tool uses `shell: true` which works but could be explicit
   - Adaptation: Detect Windows + PowerShell and adjust execution

2. **Token Usage Deduplication**
   - Problem: Some providers report tokens twice (streaming + final)
   - Alexi Impact: SessionManager.addMessage accumulates tokens
   - Adaptation: Check if SAP AI Core has similar issue

3. **Agent Mode Preferences**
   - Problem: Default agent selection logic
   - Alexi Impact: Already implemented with "code" as default
   - Adaptation: None needed, already aligned

4. **Improved Tool Descriptions**
   - Problem: Generic descriptions reduce cache hit rates
   - Alexi Impact: Tool descriptions could be more specific
   - Adaptation: Review all tool description strings

5. **Gitignore Respect in File Operations**
   - Problem: Tools should respect .gitignore by default
   - Alexi Impact: glob/grep tools don't explicitly check
   - Adaptation: Add gitignore filtering to file search tools

---

**Maintainer Notes:**
- Update this document when tracking new upstream repositories
- Review compatibility matrix before generating update plans
- Document any successful concept adaptations as case studies
