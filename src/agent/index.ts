/**
 * Agent System
 * Defines specialized agents with different capabilities and prompts
 * Based on kilocode/opencode agent patterns with @syntax for switching
 */

import { z } from "zod"
import { AgentSwitched } from "../bus/index.js"

// Agent mode - determines when agent is available
export type AgentMode = "primary" | "subagent" | "all"

// Agent schema for validation
export const AgentSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  mode: z.enum(["primary", "subagent", "all"]).default("all"),
  systemPrompt: z.string(),
  // Tool configuration
  tools: z.array(z.string()).optional(), // Tool IDs this agent can use
  disabledTools: z.array(z.string()).optional(), // Explicitly disabled tools
  // Model preferences
  preferredModel: z.string().optional(),
  temperature: z.number().min(0).max(2).optional(),
  maxTokens: z.number().optional(),
  // Aliases for @syntax switching
  aliases: z.array(z.string()).optional(),
})

export type AgentConfig = z.infer<typeof AgentSchema>

// Agent definition with utilities
export interface Agent extends AgentConfig {
  canUseTool(toolId: string): boolean
}

// Create an agent from config
function createAgent(config: AgentConfig): Agent {
  return {
    ...config,
    canUseTool(toolId: string): boolean {
      // Check disabled first
      if (this.disabledTools?.includes(toolId)) return false
      // If tools list specified, check inclusion
      if (this.tools && this.tools.length > 0) {
        return this.tools.includes(toolId) || this.tools.includes("*")
      }
      // Default: allow all
      return true
    },
  }
}

// Built-in agent prompts
const codeAgentPrompt = `You are Kilo, a highly skilled software engineer with extensive knowledge in many programming languages, frameworks, design patterns, and best practices.

Your goal is to accomplish the user's task efficiently and effectively. You work iteratively, breaking tasks down into clear steps.

Key behaviors:
- Be direct and to the point. Don't be conversational.
- Use tools to gather information before making changes
- Always verify your work compiles/runs correctly
- Follow the project's existing patterns and conventions
- Ask for clarification only when truly necessary

When editing code:
- Read the file first to understand context
- Make minimal, focused changes
- Preserve existing code style and formatting`

const debugAgentPrompt = `You are a debugging specialist focused on finding and fixing issues in code.

Your approach:
1. Gather information about the error/issue
2. Form hypotheses about potential causes
3. Test hypotheses systematically
4. Apply minimal fixes to resolve the root cause
5. Verify the fix works

Key behaviors:
- Ask clarifying questions about error messages and reproduction steps
- Use search tools to find related code and patterns
- Consider edge cases and error handling
- Check for similar issues elsewhere in the codebase`

const planAgentPrompt = `You are a technical planning specialist who creates detailed implementation plans.

Your responsibilities:
1. Break down complex tasks into actionable steps
2. Identify dependencies and potential blockers
3. Estimate effort and complexity
4. Recommend approaches and alternatives
5. Consider testing and validation

Output format:
- Use numbered lists for sequential steps
- Include file paths when relevant
- Note any questions or assumptions
- Highlight risks and mitigation strategies`

const exploreAgentPrompt = `You are a codebase exploration specialist optimized for quickly finding and understanding code.

Your focus:
1. Use glob patterns to find files by name
2. Use grep/search to find code patterns
3. Read files to understand structure
4. Follow imports and dependencies
5. Summarize findings concisely

Keep explorations focused and efficient. Return specific file paths and line numbers.`

const orchestratorPrompt = `You are an orchestrator agent that coordinates work across multiple specialized agents.

Your role:
1. Analyze the user's request to determine required tasks
2. Delegate to appropriate specialized agents
3. Combine results into a coherent response
4. Ensure work is completed correctly

Available agents you can delegate to:
- @code - General code implementation
- @debug - Debugging and fixing issues
- @plan - Creating detailed plans
- @explore - Finding and understanding code`

// Built-in agents
export const builtInAgents: AgentConfig[] = [
  {
    id: "code",
    name: "Code Agent",
    description: "General-purpose coding agent for implementation tasks",
    mode: "all",
    systemPrompt: codeAgentPrompt,
    aliases: ["c", "default"],
  },
  {
    id: "debug",
    name: "Debug Agent",
    description: "Specialized for debugging and fixing issues",
    mode: "all",
    systemPrompt: debugAgentPrompt,
    aliases: ["d", "fix"],
  },
  {
    id: "plan",
    name: "Plan Agent",
    description: "Creates detailed implementation plans",
    mode: "all",
    systemPrompt: planAgentPrompt,
    aliases: ["p", "architect"],
    tools: ["read", "glob", "grep", "webfetch"], // Read-only tools
  },
  {
    id: "explore",
    name: "Explore Agent",
    description: "Fast codebase exploration and search",
    mode: "subagent",
    systemPrompt: exploreAgentPrompt,
    aliases: ["e", "search"],
    tools: ["read", "glob", "grep"],
    temperature: 0.2, // Lower temperature for factual responses
  },
  {
    id: "orchestrator",
    name: "Orchestrator Agent",
    description: "Coordinates work across multiple agents",
    mode: "primary",
    systemPrompt: orchestratorPrompt,
    aliases: ["o", "main"],
    tools: ["task"], // Can only delegate
  },
]

// Agent registry
class AgentRegistry {
  private agents: Map<string, Agent> = new Map()
  private aliasMap: Map<string, string> = new Map()
  private currentAgentId: string = "code"

  constructor() {
    // Register built-in agents
    for (const config of builtInAgents) {
      this.register(config)
    }
  }

  /**
   * Register an agent
   */
  register(config: AgentConfig): Agent {
    const validated = AgentSchema.parse(config)
    const agent = createAgent(validated)
    this.agents.set(agent.id, agent)

    // Register aliases
    if (agent.aliases) {
      for (const alias of agent.aliases) {
        this.aliasMap.set(alias.toLowerCase(), agent.id)
      }
    }
    // Also register id as alias
    this.aliasMap.set(agent.id.toLowerCase(), agent.id)

    return agent
  }

  /**
   * Get agent by id or alias
   */
  get(idOrAlias: string): Agent | undefined {
    const id = this.aliasMap.get(idOrAlias.toLowerCase()) ?? idOrAlias
    return this.agents.get(id)
  }

  /**
   * Get current agent
   */
  getCurrent(): Agent {
    return this.agents.get(this.currentAgentId) ?? this.agents.get("code")!
  }

  /**
   * Switch to a different agent
   */
  switchTo(idOrAlias: string, reason?: string): Agent | null {
    const agent = this.get(idOrAlias)
    if (!agent) return null

    const fromId = this.currentAgentId
    this.currentAgentId = agent.id

    // Publish event
    AgentSwitched.publish({
      from: fromId,
      to: agent.id,
      reason,
      timestamp: Date.now(),
    })

    return agent
  }

  /**
   * List all agents
   */
  list(mode?: AgentMode): Agent[] {
    const agents = Array.from(this.agents.values())
    if (mode) {
      return agents.filter((a) => a.mode === mode || a.mode === "all")
    }
    return agents
  }

  /**
   * Parse @syntax from message and switch if found
   * Returns the cleaned message
   */
  parseAndSwitch(message: string): { message: string; switched: boolean; agent?: Agent } {
    // Match @agent at start of message
    const match = message.match(/^@(\w+)\s*(.*)$/s)
    if (!match) {
      return { message, switched: false }
    }

    const [, agentRef, rest] = match
    const agent = this.get(agentRef)

    if (agent) {
      this.switchTo(agent.id, `User requested via @${agentRef}`)
      return { message: rest.trim() || message, switched: true, agent }
    }

    // Unknown agent reference, keep original message
    return { message, switched: false }
  }
}

// Global registry instance
let globalRegistry: AgentRegistry | null = null

export function getAgentRegistry(): AgentRegistry {
  if (!globalRegistry) {
    globalRegistry = new AgentRegistry()
  }
  return globalRegistry
}

export function getCurrentAgent(): Agent {
  return getAgentRegistry().getCurrent()
}

export function switchAgent(idOrAlias: string, reason?: string): Agent | null {
  return getAgentRegistry().switchTo(idOrAlias, reason)
}

export function parseAgentSwitch(message: string): {
  message: string
  switched: boolean
  agent?: Agent
} {
  return getAgentRegistry().parseAndSwitch(message)
}

/**
 * Parse @mention from message without switching
 * Returns agent ID and cleaned message
 */
export function parseAgentMention(message: string): {
  agentId: string | null
  cleanMessage: string
} {
  const match = message.match(/^@(\w+)\s*(.*)$/s)
  if (!match) {
    return { agentId: null, cleanMessage: message }
  }

  const [, agentRef, rest] = match
  const registry = getAgentRegistry()
  const agent = registry.get(agentRef)

  if (agent) {
    return { agentId: agent.id, cleanMessage: rest.trim() || message }
  }

  return { agentId: null, cleanMessage: message }
}
