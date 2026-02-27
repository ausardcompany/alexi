import { Command } from "commander"
import { sendChat } from "../core/orchestrator.js"
import { explainRouting } from "../core/router.js"
import { SessionManager } from "../core/sessionManager.js"
import { getProjectContextManager } from "../config/projectContext.js"
import { getStageManager, type ConversationStage } from "../core/stageManager.js"
import { AINotesGenerator } from "../core/aiNotes.js"
import { DoDChecker } from "../core/dodChecker.js"
import { env } from "../config/env.js"
import { startInteractive } from "./interactive.js"

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
program.name("sap-bot").description("SAP AI Core bot orchestrator")

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

await program.parseAsync(process.argv)
