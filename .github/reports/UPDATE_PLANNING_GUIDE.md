# Quick Reference: Update Planning for Alexi

**Last Updated**: 2026-04-13  
**Purpose**: Fast compatibility check before generating update plans

## 🚨 Pre-Flight Checklist

Before generating an update plan for Alexi, verify:

- [ ] Changes target **SAP AI SDK**, not Vercel AI SDK
- [ ] Changes use **async/await**, not Effect generators
- [ ] Target files **exist** in `src/` directory
- [ ] Changes don't require **Effect framework**
- [ ] Changes align with **SAP AI Core** provider model

If any check fails → **Extract concepts instead of code**

## ✅ Alexi Architecture Quick Facts

```
SDK:        @sap-ai-sdk/orchestration (NOT Vercel AI SDK)
Framework:  Plain Node.js/TypeScript (NOT Effect)
Async:      async/await + Promises (NOT Effect generators)
CLI:        Commander.js (NOT custom Effect CLI)
UI:         Ink (React for terminal)
Tools:      Custom defineTool with Zod
Providers:  SAP AI Core only (OpenAI proxy, Bedrock)
Config:     JSON files + .env (NOT Effect Config)
```

## 🔍 Compatibility Quick Check

### ❌ Incompatible Patterns (Don't Apply)
```typescript
// Effect framework
yield* Config.Service
Effect.gen(function* () { ... })
Layer.effect(Service, ...)

// Vercel AI SDK
import { createProviderToolFactoryWithOutputSchema } from "@ai-sdk/provider-utils"
streamText({ model, ... })

// Effect services
const config = yield* Config.Service
yield* Effect.forEach(...)
```

### ✅ Compatible Patterns (Can Adapt)
```typescript
// Standard async/await
async function execute() { ... }
await someOperation()

// Zod schemas
const Schema = z.object({ ... })

// Commander CLI
program.command('name').action(async () => { ... })

// Standard Node.js
import fs from 'fs'
import path from 'path'
```

## 🎯 Useful Upstream Concepts

These concepts from kilocode/opencode can be adapted:

1. **PowerShell Support** → Adapt to `src/tool/tools/bash.ts`
2. **Token Deduplication** → Review `src/core/sessionManager.ts`
3. **Gitignore Respect** → Add to `src/tool/tools/glob.ts`, `grep.ts`
4. **Tool Descriptions** → Improve cache hit rates
5. **Agent Preferences** → Already implemented

## 📁 Alexi File Locations

```
src/
├── cli/              # Commander-based CLI commands
├── core/
│   ├── orchestrator.ts      # Main LLM orchestration
│   ├── sessionManager.ts    # Session & conversation state
│   └── router.ts            # Auto-routing logic
├── providers/
│   ├── index.ts             # Provider registry
│   └── sapOrchestration.ts  # SAP AI Core integration
├── agent/
│   ├── index.ts             # Agent registry (simple)
│   └── prompts/             # Agent prompt files
├── tool/
│   ├── index.ts             # Tool definition utilities
│   └── tools/               # Individual tool implementations
│       ├── bash.ts
│       ├── read.ts
│       ├── write.ts
│       └── ...
├── permission/       # Permission system
└── config/           # Configuration management
```

## 🔄 Concept Adaptation Process

When you find a useful upstream change:

1. **Extract the Problem**
   - What issue does it solve?
   - Does Alexi have this problem?

2. **Check Alexi's Current State**
   - How does Alexi handle this now?
   - Is there a gap?

3. **Design Alexi-Native Solution**
   - Use SAP AI SDK patterns
   - Use async/await, not Effect
   - Follow existing code style

4. **Implement & Test**
   - Write tests in `tests/` or `src/**/__tests__/`
   - Run `npm test`
   - Ensure SAP AI Core compatibility

## 🚀 Better Upstream Sources for Alexi

Instead of kilocode/opencode, consider:

1. **SAP AI SDK Updates**
   - `@sap-ai-sdk/orchestration` releases
   - SAP AI Core API changes
   - New model support

2. **Tool Ecosystem**
   - Commander.js updates
   - Ink framework improvements
   - Zod validation patterns

3. **Node.js/TypeScript**
   - Performance patterns
   - Error handling improvements
   - Type safety enhancements

## 📊 Decision Matrix

| Upstream Change Type | Apply to Alexi? | Action |
|---------------------|-----------------|---------|
| Effect framework code | ❌ Never | Skip |
| Vercel AI SDK code | ❌ Never | Skip |
| Provider tool factory | ❌ Never | Skip |
| Shell improvements | ✅ Adapt | Review bash.ts |
| Token counting | ✅ Adapt | Review sessionManager.ts |
| Agent patterns | ⚠️ Maybe | Check if already implemented |
| UI/UX improvements | ✅ Adapt | Review CLI/Ink code |
| Config patterns | ⚠️ Maybe | Must use JSON, not Effect |
| Error handling | ✅ Adapt | Use try/catch, not Effect |

## 💡 Quick Tips

### When Planning Updates
- **Start with**: Does the file exist in Alexi?
- **Check**: Do we use the same dependencies?
- **Ask**: Can this be done with async/await?

### When Adapting Concepts
- **Keep**: The problem and solution approach
- **Change**: Implementation to match Alexi's stack
- **Test**: With SAP AI Core integration

### When in Doubt
- **Don't copy code** from Effect-based projects
- **Do extract concepts** and implement natively
- **Document** why something can't be adapted

## 📝 Template: Concept Adaptation Plan

```markdown
## Concept: [Name from Upstream]

**Source**: kilocode commit abc123
**Problem Solved**: [What issue it addresses]
**Alexi Applicability**: [High/Medium/Low]

### Current Alexi State
- File: `src/...`
- Current approach: [How Alexi handles this]
- Gap: [What's missing]

### Adaptation Plan
1. [Step 1]
2. [Step 2]
3. [Step 3]

### Implementation
- Target file: `src/...`
- Pattern to use: async/await / class / function
- Tests needed: [Test scenarios]
- SAP compatibility: [Any considerations]
```

## 🔗 Related Documents

- [Architectural Compatibility Analysis](./architectural-compatibility-analysis.md)
- [Changes Summary](./changes-summary.md)
- [Execution Report](./execution-report-2026-04-13.md)

---

**Remember**: Alexi is SAP AI Core focused. If it requires Vercel AI SDK or Effect, it's not compatible.
