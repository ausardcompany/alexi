import { describe, it, expect, beforeEach } from "vitest";
import { getAgentRegistry, getCurrentAgent, switchAgent } from "./index";

describe("Agent System", () => {
  beforeEach(() => {
    // Reset to default agent
    switchAgent("code");
  });

  describe("Agent registry", () => {
    it("returns built-in agents", () => {
      const registry = getAgentRegistry();
      const agents = registry.list();
      
      expect(agents.length).toBeGreaterThan(0);
      expect(agents.some(a => a.id === "code")).toBe(true);
      expect(agents.some(a => a.id === "debug")).toBe(true);
      expect(agents.some(a => a.id === "plan")).toBe(true);
    });

    it("switches agents correctly", () => {
      const codeAgent = getCurrentAgent();
      expect(codeAgent.id).toBe("code");

      const debugAgent = switchAgent("debug");
      expect(debugAgent).not.toBeNull();
      expect(getCurrentAgent().id).toBe("debug");
    });

    it("resolves aliases", () => {
      const agent = switchAgent("d"); // alias for debug
      expect(agent).not.toBeNull();
      expect(agent?.id).toBe("debug");
    });
  });

  describe("Agent tool permissions", () => {
    it("code agent can use most tools", () => {
      const agent = getCurrentAgent();
      expect(agent.id).toBe("code");
      
      expect(agent.canUseTool("read")).toBe(true);
      expect(agent.canUseTool("write")).toBe(true);
      expect(agent.canUseTool("bash")).toBe(true);
    });

    it("plan agent has limited tools", () => {
      switchAgent("plan");
      const agent = getCurrentAgent();
      
      expect(agent.canUseTool("read")).toBe(true);
      expect(agent.canUseTool("glob")).toBe(true);
      expect(agent.canUseTool("grep")).toBe(true);
      
      // Plan agent should not have write tools
      expect(agent.canUseTool("write")).toBe(false);
      expect(agent.canUseTool("edit")).toBe(false);
    });

    it("explore agent has search-only tools", () => {
      switchAgent("explore");
      const agent = getCurrentAgent();
      
      expect(agent.canUseTool("read")).toBe(true);
      expect(agent.canUseTool("glob")).toBe(true);
      expect(agent.canUseTool("grep")).toBe(true);
      
      // Explore agent should not have write or bash
      expect(agent.canUseTool("write")).toBe(false);
      expect(agent.canUseTool("bash")).toBe(false);
    });
  });

  describe("Agent mode filtering", () => {
    it("lists primary agents", () => {
      const registry = getAgentRegistry();
      const primaryAgents = registry.list("primary");
      
      expect(primaryAgents.some(a => a.id === "orchestrator")).toBe(true);
    });

    it("lists subagents", () => {
      const registry = getAgentRegistry();
      const subagents = registry.list("subagent");
      
      expect(subagents.some(a => a.id === "explore")).toBe(true);
    });

    it("lists all agents when no filter", () => {
      const registry = getAgentRegistry();
      const allAgents = registry.list();
      const filteredAgents = registry.list("all");
      
      expect(allAgents.length).toBeGreaterThanOrEqual(filteredAgents.length);
    });
  });
});
