#!/usr/bin/env node
import { Command } from "commander"
import { sendChat } from "../core/orchestrator.js"
import { explainRouting } from "../core/router.js"
import { SessionManager } from "../core/sessionManager.js"
import { getProjectContextManager } from "../config/projectContext.js"
import { getStageManager, type ConversationStage } from "../core/stageManager.js"
import { AINotesGenerator } from "../core/aiNotes.js"
import { DoDChecker } from "../core/dodChecker.js"
import { getWorkflowManager } from "../core/workflowManager.js"
import { getMcpClientManager } from "../mcp/client.js"
import { loadMcpConfig, saveMcpConfig, addMcpServer, removeMcpServer, toggleMcpServer, getConfigPath, type McpServerConfig } from "../mcp/config.js"
import { getSkillRegistry, loadSkillFromFile, loadSkillsFromDirectory, registerSkill, type Skill } from "../skill/index.js"
import { registerBuiltInSkills } from "../skill/skills/index.js"
import { env } from "../config/env.js"
import { startInteractive } from "./interactive.js"
import { getDoctor } from "../doctor/index.js"
import { getLogger } from "../log/index.js"
import { getLogViewer } from "../log/viewer.js"
import { getProfileManager, formatProfileListForCLI, formatMaskedEnvForCLI } from "../profile/index.js"
import { getSoundManager } from "../sound/index.js"
import { checkForUpdates, performUpdate } from "../update/index.js"
import { getCIManager, formatTemplateListForCLI, formatInitResultForCLI, formatTemplatePreviewForCLI } from "../ci/index.js"

// Initialize skills on startup
registerBuiltInSkills();

function parseDuration(duration: string): Date {
  const match = duration.match(/^(\d+)([mhd])$/);
  if (!match) throw new Error(`Invalid duration: ${duration}`);
  const [, num, unit] = match;
  const ms = { m: 60000, h: 3600000, d: 86400000 }[unit] || 0;
  return new Date(Date.now() - parseInt(num) * ms);
}

async function listModelsProxy() {
  const baseURL = env("SAP_PROXY_BASE_URL")
  const apiKey = env("SAP_PROXY_API_KEY")
  if (!baseURL || !apiKey) throw new Error("SAP proxy baseURL/API key missing")
  const u = baseURL.replace(/\/$/, "") + "/models"
  const res = await fetch(u, { headers: { Authorization: `Bearer ${apiKey}` } })
  if (!res.ok) throw new Error(`Failed to fetch models: ${res.status} ${res.statusText}`)
  const text = await res.text()
  console.log(text)
}

const program = new Command()
program.name("alexi").description("Alexi - AI-powered CLI assistant")

program
  .command("chat")
  .requiredOption("-m, --message <text>", "Message to send")
  .option("--model <id>", "Model ID override")
  .option("--auto-route", "Enable automatic model routing based on prompt")
  .option("--prefer-cheap", "Prefer cheaper models when auto-routing")
  .option("--session <id>", "Continue existing session")
  .option("--system <prompt>", "System prompt for the conversation")
  .action(async (opts) => {
    try {
      const sessionManager = new SessionManager();
      
      // Load or create session
      if (opts.session) {
        const session = sessionManager.loadSession(opts.session);
        if (!session) {
          console.error(`Session ${opts.session} not found`);
          process.exit(1);
        }
        console.log(`[Continuing session: ${session.metadata.title || opts.session}]`);
      }
      
      const res = await sendChat(opts.message, {
        modelOverride: opts.model,
        autoRoute: opts.autoRoute,
        preferCheap: opts.preferCheap,
        sessionManager,
        systemPrompt: opts.system
      })
      
      console.log(res.text)
      if (res.usage) console.log(JSON.stringify(res.usage))
      if (res.modelUsed && opts.autoRoute) {
        console.log(`\n[Model: ${res.modelUsed}]`)
      }
      
      // Print session info
      const currentSession = sessionManager.getCurrentSession();
      if (currentSession) {
        console.log(`\n[Session: ${currentSession.metadata.id}]`);
        console.log(`[Messages: ${currentSession.metadata.messageCount}, Tokens: ${currentSession.metadata.totalTokens}]`);
      }
    } catch (e) {
      console.error(String(e))
      process.exit(1)
    }
  })

program
  .command("interactive")
  .alias("i")
  .description("Start interactive REPL with streaming responses")
  .option("--model <id>", "Model ID to use")
  .option("--auto-route", "Enable automatic model routing")
  .option("--prefer-cheap", "Prefer cheaper models when auto-routing")
  .option("--session <id>", "Continue existing session")
  .option("--system <prompt>", "System prompt for the conversation")
  .action(async (opts) => {
    try {
      await startInteractive({
        model: opts.model,
        autoRoute: opts.autoRoute,
        preferCheap: opts.preferCheap,
        session: opts.session,
        systemPrompt: opts.system,
      });
    } catch (e) {
      console.error(String(e));
      process.exit(1);
    }
  })

program
  .command("models")
  .description("List models from provider (proxy only)")
  .action(async () => {
    try {
      await listModelsProxy()
    } catch (e) {
      console.error(String(e))
      process.exit(1)
    }
  })

program
  .command("explain")
  .requiredOption("-m, --message <text>", "Message to analyze")
  .description("Explain routing decision for a prompt")
  .action(async (opts) => {
    try {
      const analysis = await explainRouting(opts.message)
      console.log("\n=== Prompt Analysis ===")
      console.log(`Type: ${analysis.classification.type}`)
      console.log(`Complexity: ${analysis.classification.complexity}`)
      console.log(`Requires Reasoning: ${analysis.classification.requiresReasoning}`)
      console.log(`Estimated Tokens: ${analysis.classification.estimatedTokens}`)
      
      if (analysis.matchedRules && analysis.matchedRules.length > 0) {
        console.log("\n=== Matched Rules ===")
        analysis.matchedRules.forEach(rule => {
          console.log(`• ${rule.name} (priority: ${rule.priority}): ${rule.description}`)
        })
      }
      
      console.log("\n=== Model Candidates (by score) ===")
      analysis.candidates.forEach((c, i) => {
        const marker = i === 0 ? "✓ " : "  "
        console.log(`${marker}${c.modelId.padEnd(20)} Score: ${c.score} - ${c.reason}`)
      })
      
      console.log("\n=== Selected Model ===")
      console.log(`Model: ${analysis.selected.modelId}`)
      console.log(`Reason: ${analysis.selected.reason}`)
      console.log(`Confidence: ${(analysis.selected.confidence * 100).toFixed(0)}%`)
      if (analysis.selected.ruleApplied) {
        console.log(`Rule Applied: ${analysis.selected.ruleApplied}`)
      }
    } catch (e) {
      console.error(String(e))
      process.exit(1)
    }
  })

program
  .command("sessions")
  .description("List all saved sessions")
  .action(async () => {
    try {
      const sessionManager = new SessionManager();
      const sessions = sessionManager.listSessions();
      
      if (sessions.length === 0) {
        console.log("No sessions found");
        return;
      }
      
      console.log("\n=== Saved Sessions ===\n");
      sessions.forEach(session => {
        const date = new Date(session.updated).toLocaleString();
        const title = session.title || 'Untitled';
        console.log(`ID: ${session.id}`);
        console.log(`  Title: ${title}`);
        console.log(`  Updated: ${date}`);
        console.log(`  Messages: ${session.messageCount}, Tokens: ${session.totalTokens}`);
        console.log(`  Model: ${session.modelId || 'N/A'}`);
        console.log();
      });
    } catch (e) {
      console.error(String(e));
      process.exit(1);
    }
  })

program
  .command("session-export")
  .requiredOption("-s, --session <id>", "Session ID to export")
  .option("-o, --output <file>", "Output file (defaults to stdout)")
  .description("Export session to markdown")
  .action(async (opts) => {
    try {
      const sessionManager = new SessionManager();
      const markdown = sessionManager.exportToMarkdown(opts.session);
      
      if (opts.output) {
        const fs = await import('fs');
        fs.writeFileSync(opts.output, markdown, 'utf-8');
        console.log(`Session exported to ${opts.output}`);
      } else {
        console.log(markdown);
      }
    } catch (e) {
      console.error(String(e));
      process.exit(1);
    }
  })

program
  .command("session-delete")
  .requiredOption("-s, --session <id>", "Session ID to delete")
  .description("Delete a session")
  .action(async (opts) => {
    try {
      const sessionManager = new SessionManager();
      const deleted = sessionManager.deleteSession(opts.session);
      
      if (deleted) {
        console.log(`Session ${opts.session} deleted`);
      } else {
        console.log(`Session ${opts.session} not found`);
      }
    } catch (e) {
      console.error(String(e));
      process.exit(1);
    }
  })

// ============ Project Context Commands ============

program
  .command("context")
  .description("Show current project context")
  .action(async () => {
    try {
      const manager = getProjectContextManager();
      const context = manager.load();
      
      console.log("\n=== Project Context ===\n");
      console.log(`Name: ${context.name}`);
      console.log(`Description: ${context.description || 'N/A'}`);
      console.log(`\nStack:`);
      console.log(`  Language: ${context.stack.language}`);
      if (context.stack.framework) console.log(`  Framework: ${context.stack.framework}`);
      console.log(`  Versions:`, context.stack.versions);
      console.log(`\nInfrastructure:`);
      console.log(`  Platform: ${context.infrastructure.platform}`);
      if (context.infrastructure.containerization) {
        console.log(`  Containerization: ${context.infrastructure.containerization}`);
      }
      console.log(`\nArchitecture Invariants:`);
      if (context.architectureInvariants.length === 0) {
        console.log("  None defined");
      } else {
        context.architectureInvariants.forEach(inv => console.log(`  • ${inv}`));
      }
      console.log(`\nConstraints:`);
      if (context.constraints.length === 0) {
        console.log("  None defined");
      } else {
        context.constraints.forEach(c => console.log(`  • ${c}`));
      }
    } catch (e) {
      console.error(String(e));
      process.exit(1);
    }
  })

program
  .command("context-init")
  .description("Initialize project context")
  .requiredOption("-n, --name <name>", "Project name")
  .option("-d, --description <desc>", "Project description")
  .option("--language <lang>", "Primary language", "TypeScript")
  .option("--framework <fw>", "Framework")
  .action(async (opts) => {
    try {
      const manager = getProjectContextManager();
      const context = manager.init({
        name: opts.name,
        description: opts.description,
        stack: {
          language: opts.language,
          framework: opts.framework,
          versions: { node: '22.x' }
        }
      });
      
      console.log(`\n✅ Project context initialized:`);
      console.log(`   Name: ${context.name}`);
      console.log(`   Path: ${manager.getPath()}`);
    } catch (e) {
      console.error(String(e));
      process.exit(1);
    }
  })

program
  .command("context-add-invariant")
  .description("Add architecture invariant")
  .requiredOption("-i, --invariant <text>", "Invariant description")
  .action(async (opts) => {
    try {
      const manager = getProjectContextManager();
      manager.addInvariant(opts.invariant);
      console.log(`✅ Added invariant: ${opts.invariant}`);
    } catch (e) {
      console.error(String(e));
      process.exit(1);
    }
  })

// ============ Stage Commands ============

program
  .command("stages")
  .description("List available conversation stages")
  .action(async () => {
    try {
      const manager = getStageManager();
      const stages = manager.listStages();
      
      console.log("\n=== Available Stages ===\n");
      stages.forEach(stage => {
        console.log(`${stage.name} (${stage.type})`);
        console.log(`  ${stage.description}`);
        console.log();
      });
    } catch (e) {
      console.error(String(e));
      process.exit(1);
    }
  })

program
  .command("stage-set")
  .description("Set current development stage")
  .requiredOption("-s, --stage <type>", "Stage type (architecture, planning, implementation, documentation, devops, security)")
  .option("-n, --number <num>", "Stage number", "1")
  .option("--name <name>", "Stage name")
  .action(async (opts) => {
    try {
      const manager = getStageManager();
      const validStages: ConversationStage[] = [
        'architecture', 'planning', 'implementation', 
        'documentation', 'devops', 'security'
      ];
      
      if (!validStages.includes(opts.stage)) {
        console.error(`Invalid stage: ${opts.stage}`);
        console.error(`Valid stages: ${validStages.join(', ')}`);
        process.exit(1);
      }
      
      const stage = manager.setStage(opts.stage, {
        stageNumber: parseInt(opts.number),
        name: opts.name
      });
      
      const definition = manager.getStageDefinition(opts.stage);
      console.log(`\n✅ Stage set: ${definition.name}`);
      console.log(`   Type: ${stage.stage}`);
      if (stage.stageNumber) console.log(`   Number: ${stage.stageNumber}`);
      if (stage.name) console.log(`   Name: ${stage.name}`);
      console.log(`\nExpected artifacts:`);
      definition.expectedArtifacts.forEach(a => console.log(`  • ${a}`));
      console.log(`\nDefinition of Done:`);
      definition.dod.forEach(d => console.log(`  • ${d}`));
    } catch (e) {
      console.error(String(e));
      process.exit(1);
    }
  })

// ============ AI_NOTES Commands ============

program
  .command("notes-generate")
  .description("Generate AI_NOTES.md for current stage")
  .option("-o, --output <file>", "Output filename")
  .action(async (opts) => {
    try {
      const stageManager = getStageManager();
      const currentStage = stageManager.getCurrentStage();
      
      if (!currentStage) {
        console.error("No active stage. Run 'stage-set' first.");
        process.exit(1);
      }
      
      const definition = stageManager.getStageDefinition(currentStage.stage);
      const generator = new AINotesGenerator();
      
      const notes = AINotesGenerator
        .builder(currentStage.stage, currentStage.name || definition.name)
        .stageNumber(currentStage.stageNumber || 1)
        .addChange(`Completed ${definition.name}`, currentStage.artifacts)
        .addRationale("Following structured development process")
        .addVerificationStep("Review generated documentation")
        .build();
      
      const filePath = generator.save(notes, opts.output);
      console.log(`✅ Generated: ${filePath}`);
    } catch (e) {
      console.error(String(e));
      process.exit(1);
    }
  })

// ============ DoD Commands ============

program
  .command("dod-check")
  .description("Run Definition of Done checks")
  .option("-s, --stage <type>", "Stage type (default: implementation)", "implementation")
  .option("-o, --output <file>", "Save report to file")
  .action(async (opts) => {
    try {
      const validStages: ConversationStage[] = [
        'architecture', 'planning', 'implementation', 
        'documentation', 'devops', 'security'
      ];
      
      if (!validStages.includes(opts.stage)) {
        console.error(`Invalid stage: ${opts.stage}`);
        process.exit(1);
      }
      
      const checker = new DoDChecker();
      console.log(`\nRunning DoD checks for ${opts.stage}...\n`);
      
      const report = checker.runChecks(opts.stage);
      const markdown = checker.generateReport(report);
      
      if (opts.output) {
        const fs = await import('fs');
        fs.writeFileSync(opts.output, markdown, 'utf-8');
        console.log(`Report saved to: ${opts.output}`);
      } else {
        console.log(markdown);
      }
      
      process.exit(report.failed > 0 ? 1 : 0);
    } catch (e) {
      console.error(String(e));
      process.exit(1);
    }
  })

program
  .command("dod-list")
  .description("List available DoD checks")
  .action(async () => {
    try {
      const checker = new DoDChecker();
      const checks = checker.listChecks();
      
      console.log("\n=== Available DoD Checks ===\n");
      checks.forEach(check => {
        const autoFix = check.autoFixable ? ' (auto-fixable)' : '';
        console.log(`${check.name}${autoFix}`);
        console.log(`  ID: ${check.id}`);
        console.log(`  Stage: ${check.stage}`);
        console.log();
      });
    } catch (e) {
      console.error(String(e));
      process.exit(1);
    }
  })

// ============ Workflow Commands ============

const validStages: ConversationStage[] = [
  'architecture', 'planning', 'implementation', 
  'documentation', 'devops', 'security'
];

program
  .command("workflow-start")
  .description("Start a new development workflow")
  .option("-s, --stage <type>", "Initial stage (default: architecture)", "architecture")
  .option("-n, --name <name>", "Workflow name")
  .action(async (opts) => {
    try {
      if (!validStages.includes(opts.stage)) {
        console.error(`Invalid stage: ${opts.stage}`);
        console.error(`Valid stages: ${validStages.join(', ')}`);
        process.exit(1);
      }

      const manager = getWorkflowManager();
      const state = manager.startWorkflow(opts.stage, opts.name);
      const definition = manager.getStageDefinition(opts.stage);

      console.log(`\n=== Workflow Started ===\n`);
      console.log(`Stage: ${state.stageName} (${state.currentStage})`);
      console.log(`Stage Number: ${state.stageNumber}`);
      console.log(`\nExpected Artifacts:`);
      definition.expectedArtifacts.forEach(a => console.log(`  - ${a}`));
      console.log(`\nDefinition of Done:`);
      definition.dod.forEach(d => console.log(`  - ${d}`));
      console.log(`\nSystem Prompt Preview:`);
      console.log(manager.getSystemPrompt().substring(0, 200) + '...');
    } catch (e) {
      console.error(String(e));
      process.exit(1);
    }
  })

program
  .command("workflow-status")
  .description("Show current workflow status")
  .action(async () => {
    try {
      const manager = getWorkflowManager();
      const state = manager.getState();

      if (!state) {
        console.log("\nNo active workflow. Run 'workflow-start' to begin.");
        return;
      }

      console.log(manager.getSummary());
      
      const definition = manager.getStageDefinition();
      console.log(`\n## Current Stage Details\n`);
      console.log(`**Expected Artifacts:**`);
      definition.expectedArtifacts.forEach(a => console.log(`  - ${a}`));
      console.log(`\n**Definition of Done:**`);
      definition.dod.forEach(d => console.log(`  - ${d}`));
      
      if (state.artifacts.length > 0) {
        console.log(`\n**Current Artifacts:**`);
        state.artifacts.forEach(a => console.log(`  - ${a}`));
      }
    } catch (e) {
      console.error(String(e));
      process.exit(1);
    }
  })

program
  .command("workflow-next")
  .description("Transition to next workflow stage")
  .option("-s, --stage <type>", "Target stage (default: next in sequence)")
  .option("-n, --name <name>", "Stage name")
  .option("--skip-dod", "Skip DoD checks (not recommended)")
  .action(async (opts) => {
    try {
      const manager = getWorkflowManager();
      const currentState = manager.getState();

      if (!currentState) {
        console.error("No active workflow. Run 'workflow-start' first.");
        process.exit(1);
      }

      // Run DoD checks unless skipped
      if (!opts.skipDod) {
        console.log(`\nRunning DoD checks for ${currentState.currentStage}...\n`);
        const report = manager.runDoDChecks();
        const checker = new DoDChecker();
        console.log(checker.generateReport(report));

        if (report.failed > 0) {
          console.log(`\nDoD checks failed. Fix issues or use --skip-dod to proceed anyway.`);
          process.exit(1);
        }
      }

      // Validate target stage if provided
      if (opts.stage && !validStages.includes(opts.stage)) {
        console.error(`Invalid stage: ${opts.stage}`);
        console.error(`Valid stages: ${validStages.join(', ')}`);
        process.exit(1);
      }

      const newState = manager.nextStage(opts.stage, opts.name);

      if (!newState) {
        console.log(`\n=== Workflow Complete ===\n`);
        console.log(`All stages completed successfully!`);
        console.log(manager.getSummary());
        return;
      }

      const definition = manager.getStageDefinition();
      console.log(`\n=== Stage Transition ===\n`);
      console.log(`Previous: ${currentState.stageName}`);
      console.log(`Current: ${newState.stageName} (${newState.currentStage})`);
      console.log(`Stage Number: ${newState.stageNumber}`);
      console.log(`\nExpected Artifacts:`);
      definition.expectedArtifacts.forEach(a => console.log(`  - ${a}`));
      console.log(`\nDefinition of Done:`);
      definition.dod.forEach(d => console.log(`  - ${d}`));
    } catch (e) {
      console.error(String(e));
      process.exit(1);
    }
  })

program
  .command("workflow-reset")
  .description("Reset workflow state")
  .option("--force", "Skip confirmation")
  .action(async (opts) => {
    try {
      const manager = getWorkflowManager();
      const state = manager.getState();

      if (!state) {
        console.log("No active workflow to reset.");
        return;
      }

      if (!opts.force) {
        console.log(`\nCurrent workflow:`);
        console.log(`  Stage: ${state.stageName} (${state.currentStage})`);
        console.log(`  History: ${state.history.length} completed stages`);
        console.log(`  Artifacts: ${state.artifacts.length}`);
        console.log(`\nUse --force to confirm reset.`);
        return;
      }

      manager.reset();
      console.log(`\nWorkflow reset successfully.`);
    } catch (e) {
      console.error(String(e));
      process.exit(1);
    }
  })

program
  .command("workflow-prompt")
  .description("Get the current stage system prompt")
  .option("-t, --type <type>", "Prompt type: system, review, codeReview", "system")
  .action(async (opts) => {
    try {
      const manager = getWorkflowManager();
      const state = manager.getState();

      if (!state) {
        console.error("No active workflow. Run 'workflow-start' first.");
        process.exit(1);
      }

      let prompt: string;
      switch (opts.type) {
        case 'system':
          prompt = manager.getSystemPrompt();
          break;
        case 'review':
          prompt = manager.getReviewPrompt('{YOUR_CONTENT_HERE}');
          break;
        case 'codeReview':
          prompt = manager.getCodeReviewPrompt('{YOUR_CODE_HERE}');
          break;
        default:
          console.error(`Invalid prompt type: ${opts.type}`);
          process.exit(1);
      }

      console.log(`\n=== ${opts.type} Prompt for ${state.stageName} ===\n`);
      console.log(prompt);
    } catch (e) {
      console.error(String(e));
      process.exit(1);
    }
  })

// ============ MCP Commands ============

program
  .command("mcp-servers")
  .description("List configured MCP servers")
  .action(async () => {
    try {
      const config = loadMcpConfig();
      
      console.log("\n=== MCP Servers ===\n");
      console.log(`Config: ${getConfigPath()}\n`);
      
      if (config.servers.length === 0) {
        console.log("No servers configured.");
        return;
      }
      
      config.servers.forEach(server => {
        const status = server.enabled ? '✓ enabled' : '✗ disabled';
        const auto = server.autoConnect ? ' (auto-connect)' : '';
        console.log(`${server.name} [${server.transport}] - ${status}${auto}`);
        if (server.description) {
          console.log(`  ${server.description}`);
        }
        if (server.command) {
          console.log(`  Command: ${server.command} ${(server.args || []).join(' ')}`);
        }
        if (server.url) {
          console.log(`  URL: ${server.url}`);
        }
        console.log();
      });
    } catch (e) {
      console.error(String(e));
      process.exit(1);
    }
  })

program
  .command("mcp-add")
  .description("Add a new MCP server")
  .requiredOption("-n, --name <name>", "Server name")
  .option("-d, --description <desc>", "Server description")
  .option("-t, --transport <type>", "Transport type: stdio, sse, http", "stdio")
  .option("-c, --command <cmd>", "Command to run (for stdio)")
  .option("-a, --args <args>", "Command arguments (comma-separated)")
  .option("-u, --url <url>", "Server URL (for sse/http)")
  .option("--enabled", "Enable server", false)
  .option("--auto-connect", "Auto-connect on startup", false)
  .action(async (opts) => {
    try {
      const server: McpServerConfig = {
        name: opts.name,
        description: opts.description,
        transport: opts.transport,
        command: opts.command,
        args: opts.args ? opts.args.split(',').map((s: string) => s.trim()) : undefined,
        url: opts.url,
        enabled: opts.enabled,
        autoConnect: opts.autoConnect,
      };
      
      addMcpServer(server);
      console.log(`\n✓ Added MCP server: ${server.name}`);
      console.log(`  Transport: ${server.transport}`);
      if (server.command) {
        console.log(`  Command: ${server.command} ${(server.args || []).join(' ')}`);
      }
    } catch (e) {
      console.error(String(e));
      process.exit(1);
    }
  })

program
  .command("mcp-remove")
  .description("Remove an MCP server")
  .requiredOption("-n, --name <name>", "Server name to remove")
  .action(async (opts) => {
    try {
      removeMcpServer(opts.name);
      console.log(`\n✓ Removed MCP server: ${opts.name}`);
    } catch (e) {
      console.error(String(e));
      process.exit(1);
    }
  })

program
  .command("mcp-enable")
  .description("Enable or disable an MCP server")
  .requiredOption("-n, --name <name>", "Server name")
  .option("--disable", "Disable instead of enable")
  .action(async (opts) => {
    try {
      const enabled = !opts.disable;
      toggleMcpServer(opts.name, enabled);
      console.log(`\n✓ ${opts.name}: ${enabled ? 'enabled' : 'disabled'}`);
    } catch (e) {
      console.error(String(e));
      process.exit(1);
    }
  })

program
  .command("mcp-connect")
  .description("Connect to MCP servers")
  .option("-n, --name <name>", "Specific server to connect (default: all enabled)")
  .action(async (opts) => {
    try {
      const manager = getMcpClientManager();
      const config = loadMcpConfig();
      
      if (opts.name) {
        const server = config.servers.find(s => s.name === opts.name);
        if (!server) {
          console.error(`Server not found: ${opts.name}`);
          process.exit(1);
        }
        console.log(`Connecting to ${opts.name}...`);
        const conn = await manager.connect(server);
        if (conn.status === 'connected') {
          console.log(`✓ Connected to ${opts.name} (${conn.tools.length} tools)`);
        } else {
          console.log(`✗ Failed to connect: ${conn.error}`);
        }
      } else {
        const enabled = config.servers.filter(s => s.enabled);
        if (enabled.length === 0) {
          console.log("No enabled servers. Use 'mcp-enable -n <name>' first.");
          return;
        }
        
        for (const server of enabled) {
          console.log(`Connecting to ${server.name}...`);
          const conn = await manager.connect(server);
          if (conn.status === 'connected') {
            console.log(`  ✓ Connected (${conn.tools.length} tools)`);
          } else {
            console.log(`  ✗ Failed: ${conn.error}`);
          }
        }
      }
    } catch (e) {
      console.error(String(e));
      process.exit(1);
    }
  })

program
  .command("mcp-tools")
  .description("List tools from connected MCP servers")
  .option("-n, --name <name>", "Filter by server name")
  .action(async (opts) => {
    try {
      const manager = getMcpClientManager();
      const status = manager.getStatus();
      
      if (status.length === 0) {
        console.log("\nNo connected servers. Run 'mcp-connect' first.");
        return;
      }
      
      console.log("\n=== MCP Tools ===\n");
      
      for (const conn of status) {
        if (opts.name && conn.name !== opts.name) continue;
        
        console.log(`${conn.name} [${conn.status}]`);
        
        if (conn.status === 'connected') {
          const tools = manager.getServerTools(conn.name);
          if (tools.length === 0) {
            console.log("  No tools available");
          } else {
            tools.forEach(tool => {
              console.log(`  • ${tool.name}`);
              if (tool.description) {
                console.log(`    ${tool.description.slice(0, 60)}${tool.description.length > 60 ? '...' : ''}`);
              }
            });
          }
        } else if (conn.error) {
          console.log(`  Error: ${conn.error}`);
        }
        console.log();
      }
    } catch (e) {
      console.error(String(e));
      process.exit(1);
    }
  })

program
  .command("mcp-call")
  .description("Call an MCP tool")
  .requiredOption("-n, --name <name>", "Tool name")
  .option("-s, --server <server>", "Server name (auto-detected if not specified)")
  .option("-a, --args <json>", "Tool arguments as JSON", "{}")
  .action(async (opts) => {
    try {
      const manager = getMcpClientManager();
      
      // Find server for tool
      let serverName = opts.server;
      if (!serverName) {
        serverName = manager.findToolServer(opts.name);
        if (!serverName) {
          console.error(`Tool not found: ${opts.name}`);
          console.error("Make sure the server is connected (run 'mcp-connect' first)");
          process.exit(1);
        }
      }
      
      // Parse arguments
      let args: Record<string, unknown>;
      try {
        args = JSON.parse(opts.args);
      } catch {
        console.error("Invalid JSON arguments");
        process.exit(1);
      }
      
      console.log(`Calling ${opts.name} on ${serverName}...`);
      const result = await manager.callTool(serverName, opts.name, args);
      
      if (result.success) {
        console.log("\n=== Result ===\n");
        console.log(result.result);
      } else {
        console.error(`\nError: ${result.error}`);
        process.exit(1);
      }
    } catch (e) {
      console.error(String(e));
      process.exit(1);
    }
  })

program
  .command("mcp-serve")
  .description("Start as MCP server (expose tools via stdio)")
  .action(async () => {
    try {
      const { createMcpServer } = await import("../mcp/server.js");
      console.error("Starting MCP server on stdio...");
      await createMcpServer({ autoStart: true });
      // Server runs until stdin closes
    } catch (e) {
      console.error(String(e));
      process.exit(1);
    }
  })

// ============ Skills Commands ============

program
  .command("skills")
  .description("List available skills")
  .option("-c, --category <category>", "Filter by category")
  .option("-t, --tag <tag>", "Filter by tag")
  .option("-s, --search <query>", "Search skills")
  .action(async (opts) => {
    try {
      const registry = getSkillRegistry();
      let skills: Skill[];
      
      if (opts.search) {
        skills = registry.search(opts.search);
      } else if (opts.category) {
        skills = registry.listByCategory(opts.category);
      } else if (opts.tag) {
        skills = registry.listByTag(opts.tag);
      } else {
        skills = registry.list();
      }
      
      if (skills.length === 0) {
        console.log("\nNo skills found.");
        return;
      }
      
      console.log("\n=== Available Skills ===\n");
      
      // Group by category
      const byCategory = new Map<string, Skill[]>();
      skills.forEach(s => {
        const cat = s.category || 'uncategorized';
        const list = byCategory.get(cat) || [];
        list.push(s);
        byCategory.set(cat, list);
      });
      
      byCategory.forEach((categorySkills, category) => {
        console.log(`${category.toUpperCase()}:`);
        categorySkills.forEach(skill => {
          const aliases = skill.aliases?.length ? ` (${skill.aliases.join(', ')})` : '';
          console.log(`  ${skill.id}${aliases}`);
          console.log(`    ${skill.description}`);
          if (skill.tags?.length) {
            console.log(`    Tags: ${skill.tags.join(', ')}`);
          }
        });
        console.log();
      });
      
      console.log(`Total: ${skills.length} skills`);
    } catch (e) {
      console.error(String(e));
      process.exit(1);
    }
  })

program
  .command("skill-show")
  .description("Show skill details")
  .requiredOption("-n, --name <name>", "Skill name or alias")
  .action(async (opts) => {
    try {
      const registry = getSkillRegistry();
      const skill = registry.get(opts.name);
      
      if (!skill) {
        console.error(`Skill not found: ${opts.name}`);
        process.exit(1);
      }
      
      console.log(`\n=== ${skill.name} (${skill.id}) ===\n`);
      console.log(`Description: ${skill.description}`);
      if (skill.category) console.log(`Category: ${skill.category}`);
      if (skill.tags?.length) console.log(`Tags: ${skill.tags.join(', ')}`);
      if (skill.aliases?.length) console.log(`Aliases: ${skill.aliases.join(', ')}`);
      if (skill.tools?.length) console.log(`Tools: ${skill.tools.join(', ')}`);
      if (skill.preferredModel) console.log(`Model: ${skill.preferredModel}`);
      if (skill.temperature !== undefined) console.log(`Temperature: ${skill.temperature}`);
      if (skill.source) console.log(`Source: ${skill.source}`);
      if (skill.sourcePath) console.log(`Path: ${skill.sourcePath}`);
      
      console.log(`\n--- Prompt ---\n`);
      console.log(skill.prompt);
      console.log();
    } catch (e) {
      console.error(String(e));
      process.exit(1);
    }
  })

program
  .command("skill-load")
  .description("Load skill from markdown file")
  .requiredOption("-f, --file <path>", "Path to skill file (.md)")
  .action(async (opts) => {
    try {
      const skill = loadSkillFromFile(opts.file);
      
      if (!skill) {
        console.error(`Failed to load skill from: ${opts.file}`);
        process.exit(1);
      }
      
      registerSkill(skill);
      console.log(`\n✓ Loaded skill: ${skill.name} (${skill.id})`);
      console.log(`  Category: ${skill.category || 'none'}`);
      console.log(`  Description: ${skill.description}`);
    } catch (e) {
      console.error(String(e));
      process.exit(1);
    }
  })

program
  .command("skill-load-dir")
  .description("Load skills from directory")
  .requiredOption("-d, --dir <path>", "Path to skills directory")
  .action(async (opts) => {
    try {
      const skills = loadSkillsFromDirectory(opts.dir);
      
      if (skills.length === 0) {
        console.log(`No skills found in: ${opts.dir}`);
        return;
      }
      
      skills.forEach(skill => registerSkill(skill));
      
      console.log(`\n✓ Loaded ${skills.length} skills from ${opts.dir}:`);
      skills.forEach(s => console.log(`  - ${s.id}: ${s.name}`));
    } catch (e) {
      console.error(String(e));
      process.exit(1);
    }
  })

program
  .command("skill-categories")
  .description("List skill categories")
  .action(async () => {
    try {
      const registry = getSkillRegistry();
      const categories = registry.getCategories();
      
      console.log("\n=== Skill Categories ===\n");
      
      if (categories.length === 0) {
        console.log("No categories found.");
        return;
      }
      
      categories.forEach(cat => {
        const count = registry.listByCategory(cat).length;
        console.log(`  ${cat}: ${count} skills`);
      });
      console.log();
    } catch (e) {
      console.error(String(e));
      process.exit(1);
    }
  })

// ============ Doctor Commands ============

program
  .command("doctor")
  .description("Run system health checks")
  .option("--skip-network", "Skip network connectivity checks")
  .option("--json", "Output as JSON")
  .option("-c, --check <id>", "Run specific check only")
  .action(async (opts) => {
    try {
      const doctor = getDoctor();
      let results;
      
      if (opts.check) {
        // Run specific check only
        const result = await doctor.runCheck(opts.check);
        results = [result];
      } else {
        // Run all checks
        results = await doctor.runAll({
          skipNetwork: opts.skipNetwork,
        });
      }
      
      const summary = doctor.getSummary(results);
      
      if (opts.json) {
        console.log(JSON.stringify({ checks: results, ...summary }, null, 2));
      } else {
        console.log(doctor.formatReport(results));
      }
      
      process.exit(summary.failed > 0 ? 1 : 0);
    } catch (e) {
      console.error(String(e));
      process.exit(1);
    }
  })

// ============ Log Commands ============

program
  .command("log")
  .description("View application logs")
  .option("-l, --level <level>", "Filter by level (debug, info, warn, error)")
  .option("-c, --category <category>", "Filter by category")
  .option("-s, --session <id>", "Filter by session ID")
  .option("--since <duration>", "Show logs since (e.g., '1h', '30m', '7d')")
  .option("--grep <pattern>", "Search logs with regex pattern")
  .option("-n, --limit <num>", "Limit number of entries", "100")
  .action(async (opts) => {
    try {
      const viewer = getLogViewer();
      const entries = viewer.readLogs({
        level: opts.level,
        category: opts.category,
        sessionId: opts.session,
        since: opts.since ? parseDuration(opts.since) : undefined,
        grep: opts.grep,
        limit: parseInt(opts.limit),
      });
      
      if (entries.length === 0) {
        console.log("No log entries found.");
        return;
      }
      
      entries.forEach((entry: { timestamp: string; level: string; category?: string; message: string; metadata?: Record<string, unknown> }) => {
        const time = new Date(entry.timestamp).toISOString();
        const level = entry.level.toUpperCase().padEnd(5);
        const category = entry.category ? `[${entry.category}]` : '';
        console.log(`${time} ${level} ${category} ${entry.message}`);
        if (entry.metadata) {
          console.log(`  ${JSON.stringify(entry.metadata)}`);
        }
      });
      
      console.log(`\nShowing ${entries.length} entries`);
    } catch (e) {
      console.error(String(e));
      process.exit(1);
    }
  })

program
  .command("log-follow")
  .alias("log-f")
  .description("Follow logs in real-time (like tail -f)")
  .option("-l, --level <level>", "Filter by level")
  .option("-c, --category <category>", "Filter by category")
  .action(async (opts) => {
    try {
      const viewer = getLogViewer();
      
      console.log("Following logs (Ctrl+C to stop)...\n");
      
      const stopFn = viewer.tailLogs(
        (entry: { timestamp: string; level: string; category?: string; message: string; metadata?: Record<string, unknown> }) => {
          const time = new Date(entry.timestamp).toISOString();
          const level = entry.level.toUpperCase().padEnd(5);
          const category = entry.category ? `[${entry.category}]` : '';
          console.log(`${time} ${level} ${category} ${entry.message}`);
          if (entry.metadata) {
            console.log(`  ${JSON.stringify(entry.metadata)}`);
          }
        },
        {
          level: opts.level,
          category: opts.category,
        }
      );
      
      // Handle Ctrl+C
      process.on('SIGINT', () => {
        stopFn();
        console.log("\nStopped following logs.");
        process.exit(0);
      });
      
      // Keep the process running
      await new Promise(() => {});
    } catch (e) {
      console.error(String(e));
      process.exit(1);
    }
  })

program
  .command("log-clean")
  .description("Clean old log files")
  .option("--older <duration>", "Delete logs older than (e.g., '7d', '30d')", "7d")
  .option("--dry-run", "Show what would be deleted without deleting")
  .action(async (opts) => {
    try {
      const viewer = getLogViewer();
      const cutoff = parseDuration(opts.older);
      
      if (opts.dryRun) {
        // For dry run, just show what files would be deleted
        const files = viewer.getLogFiles();
        const cutoffDate = cutoff.toISOString().split('T')[0];
        const filesToDelete = files.filter(f => f.date < cutoffDate);
        
        console.log("\n=== Dry Run (no files deleted) ===\n");
        console.log(`Files to delete: ${filesToDelete.length}`);
        console.log(`Space to free: ${filesToDelete.reduce((sum, f) => sum + f.size, 0)} bytes`);
        
        if (filesToDelete.length > 0) {
          console.log("\nFiles:");
          filesToDelete.forEach((f: { path: string }) => console.log(`  - ${f.path}`));
        }
      } else {
        const result = viewer.cleanLogs(cutoff);
        
        console.log("\n=== Log Cleanup Complete ===\n");
        console.log(`Files deleted: ${result.deleted}`);
        console.log(`Space freed: ${result.freed} bytes`);
      }
    } catch (e) {
      console.error(String(e));
      process.exit(1);
    }
  })

// ============ Profile Commands ============

program
  .command("profile")
  .alias("profiles")
  .description("List all profiles")
  .action(async () => {
    try {
      const manager = getProfileManager();
      const profiles = manager.list();
      
      if (profiles.length === 0) {
        console.log("\nNo profiles found. Create one with 'profile-create'.");
        return;
      }
      
      console.log(formatProfileListForCLI(profiles, manager.getActive()?.name));
    } catch (e) {
      console.error(String(e));
      process.exit(1);
    }
  })

program
  .command("profile-show")
  .description("Show profile details (secrets masked)")
  .requiredOption("-n, --name <name>", "Profile name")
  .action(async (opts) => {
    try {
      const manager = getProfileManager();
      const profile = manager.get(opts.name);
      
      if (!profile) {
        console.error(`Profile not found: ${opts.name}`);
        process.exit(1);
      }
      
      console.log(`\n=== Profile: ${profile.name} ===\n`);
      if (profile.description) {
        console.log(`Description: ${profile.description}`);
      }
      console.log(`Created: ${new Date(profile.createdAt).toLocaleString()}`);
      console.log(`Updated: ${new Date(profile.updatedAt).toLocaleString()}`);
      console.log("\nEnvironment Variables:");
      console.log(formatMaskedEnvForCLI(manager.showMasked(opts.name)));
    } catch (e) {
      console.error(String(e));
      process.exit(1);
    }
  })

program
  .command("profile-create")
  .description("Create profile from current environment")
  .requiredOption("-n, --name <name>", "Profile name")
  .option("-d, --description <desc>", "Profile description")
  .action(async (opts) => {
    try {
      const manager = getProfileManager();
      const profile = manager.create(opts.name, opts.description);
      
      console.log(`\n✓ Created profile: ${profile.name}`);
      console.log(`  Variables captured: ${Object.keys(profile.environment).length}`);
    } catch (e) {
      console.error(String(e));
      process.exit(1);
    }
  })

program
  .command("profile-switch")
  .description("Switch to a profile")
  .requiredOption("-n, --name <name>", "Profile name")
  .action(async (opts) => {
    try {
      const manager = getProfileManager();
      const profile = manager.get(opts.name);
      
      if (!profile) {
        console.error(`Profile not found: ${opts.name}`);
        process.exit(1);
      }
      
      manager.switch(opts.name);
      
      console.log(`\n✓ Switched to profile: ${profile.name}`);
      console.log(`  Variables loaded: ${Object.keys(profile.environment).length}`);
    } catch (e) {
      console.error(String(e));
      process.exit(1);
    }
  })

program
  .command("profile-delete")
  .description("Delete a profile")
  .requiredOption("-n, --name <name>", "Profile name")
  .action(async (opts) => {
    try {
      const manager = getProfileManager();
      const deleted = manager.delete(opts.name);
      
      if (deleted) {
        console.log(`\n✓ Deleted profile: ${opts.name}`);
      } else {
        console.error(`Profile not found: ${opts.name}`);
        process.exit(1);
      }
    } catch (e) {
      console.error(String(e));
      process.exit(1);
    }
  })

program
  .command("profile-export")
  .description("Export profile to .env file")
  .requiredOption("-n, --name <name>", "Profile name")
  .option("-o, --output <file>", "Output file", ".env.exported")
  .action(async (opts) => {
    try {
      const manager = getProfileManager();
      
      // Check if profile exists first
      const profile = manager.get(opts.name);
      if (!profile) {
        console.error(`Profile not found: ${opts.name}`);
        process.exit(1);
      }
      
      manager.exportToEnvFile(opts.name, opts.output);
      console.log(`\n✓ Exported profile '${opts.name}' to ${opts.output}`);
    } catch (e) {
      console.error(String(e));
      process.exit(1);
    }
  })

program
  .command("profile-import")
  .description("Import profile from .env file")
  .requiredOption("-n, --name <name>", "Profile name")
  .requiredOption("-f, --file <path>", "Path to .env file")
  .option("-d, --description <desc>", "Profile description")
  .action(async (opts) => {
    try {
      const manager = getProfileManager();
      const profile = manager.createFromEnvFile(opts.name, opts.file, opts.description);
      
      console.log(`\n✓ Imported profile: ${profile.name}`);
      console.log(`  Variables imported: ${Object.keys(profile.environment).length}`);
    } catch (e) {
      console.error(String(e));
      process.exit(1);
    }
  })

// ============ Sound Commands ============

program
  .command("sound")
  .description("Configure sound notifications")
  .option("--enable", "Enable sounds")
  .option("--disable", "Disable sounds")
  .option("--status", "Show current status")
  .option("--test", "Play test sound")
  .action(async (opts) => {
    try {
      const manager = getSoundManager();
      
      if (opts.enable) {
        manager.enable();
        console.log("\n✓ Sound notifications enabled");
      } else if (opts.disable) {
        manager.disable();
        console.log("\n✓ Sound notifications disabled");
      } else if (opts.test) {
        console.log("Playing test sound...");
        manager.playBell();
        console.log("✓ Test sound played");
      } else if (opts.status) {
        const config = manager.getConfig();
        console.log("\n=== Sound Status ===\n");
        console.log(`Enabled: ${config.enabled ? 'yes' : 'no'}`);
        if (config.events) {
          console.log("\nEvent Sounds:");
          Object.entries(config.events).forEach(([event, enabled]) => {
            console.log(`  ${event}: ${enabled ? 'enabled' : 'disabled'}`);
          });
        }
      } else {
        // Default: show status
        const config = manager.getConfig();
        console.log(`Sound notifications: ${config.enabled ? 'enabled' : 'disabled'}`);
        console.log("Use --enable, --disable, --test, or --status");
      }
    } catch (e) {
      console.error(String(e));
      process.exit(1);
    }
  })

program
  .command("sound-event")
  .description("Configure sound for specific event")
  .requiredOption("-e, --event <event>", "Event name")
  .option("--enable", "Enable sound for event")
  .option("--disable", "Disable sound for event")
  .action(async (opts) => {
    try {
      const manager = getSoundManager();
      const config = manager.getConfig();
      
      if (opts.enable) {
        manager.setEvent(opts.event, true);
        console.log(`\n✓ Sound enabled for event: ${opts.event}`);
      } else if (opts.disable) {
        manager.setEvent(opts.event, false);
        console.log(`\n✓ Sound disabled for event: ${opts.event}`);
      } else {
        const enabled = config.events[opts.event as keyof typeof config.events];
        console.log(`Event '${opts.event}': ${enabled ? 'enabled' : 'disabled'}`);
      }
    } catch (e) {
      console.error(String(e));
      process.exit(1);
    }
  })

// ============ Update Commands ============

program
  .command("self-update")
  .alias("update")
  .description("Check for and install updates")
  .option("--check", "Check only, don't update")
  .option("--force", "Skip rate limit check")
  .action(async (opts) => {
    try {
      console.log("Checking for updates...\n");
      
      const updateInfo = await checkForUpdates({ force: opts.force });
      
      if (!updateInfo.updateAvailable) {
        console.log(`✓ You are running the latest version (${updateInfo.currentVersion})`);
        return;
      }
      
      console.log(`Update available: ${updateInfo.currentVersion} → ${updateInfo.latestVersion}`);
      
      if (opts.check) {
        console.log("\nRun without --check to install the update.");
        return;
      }
      
      console.log("\nInstalling update...");
      const result = await performUpdate();
      
      if (result.success) {
        console.log(`\n✓ ${result.message}`);
        console.log("Restart the application to use the new version.");
      } else {
        console.error(`\n✗ ${result.message}`);
        process.exit(1);
      }
    } catch (e) {
      console.error(String(e));
      process.exit(1);
    }
  })

// ============ CI Commands ============

program
  .command("ci")
  .description("List available CI/CD workflow templates")
  .option("-p, --platform <platform>", "Filter by platform (github, gitlab)")
  .action(async (opts) => {
    try {
      const manager = getCIManager();
      const templates = manager.listTemplates(opts.platform);
      
      if (templates.length === 0) {
        console.log("\nNo templates found.");
        return;
      }
      
      console.log(formatTemplateListForCLI(templates));
    } catch (e) {
      console.error(String(e));
      process.exit(1);
    }
  })

program
  .command("ci-init")
  .description("Initialize CI/CD workflows in project")
  .option("-p, --platform <platform>", "Platform (github, gitlab)", "github")
  .option("-t, --template <type>", "Template type (pr-review, code-check, feature-implement)")
  .option("--overwrite", "Overwrite existing files")
  .action(async (opts) => {
    try {
      const manager = getCIManager();
      
      console.log(`Initializing CI/CD workflows for ${opts.platform}...\n`);
      
      const result = manager.init({
        platform: opts.platform,
        template: opts.template,
        overwrite: opts.overwrite,
      });
      
      console.log(formatInitResultForCLI(result));
      
      if (result.errors && result.errors.length > 0) {
        process.exit(1);
      }
    } catch (e) {
      console.error(String(e));
      process.exit(1);
    }
  })

program
  .command("ci-preview")
  .description("Preview a CI/CD workflow template")
  .requiredOption("-p, --platform <platform>", "Platform (github, gitlab)")
  .requiredOption("-t, --template <type>", "Template type")
  .action(async (opts) => {
    try {
      const manager = getCIManager();
      const template = manager.getTemplate(opts.platform, opts.template);
      
      if (!template) {
        console.error(`Template not found: ${opts.platform}/${opts.template}`);
        process.exit(1);
      }
      
      console.log(formatTemplatePreviewForCLI(template));
    } catch (e) {
      console.error(String(e));
      process.exit(1);
    }
  })

await program.parseAsync(process.argv)
