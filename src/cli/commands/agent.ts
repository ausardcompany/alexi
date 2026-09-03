/**
 * Agent command - send message with tool execution support
 *
 * Unlike the basic 'chat' command, this command enables tools and
 * runs an agent loop: the LLM can call tools, receive results, and
 * continue until it produces a final response.
 *
 * Used for automated workflows that need to modify files.
 */

import { readFileSync } from 'node:fs';
import { Option, type Command } from 'commander';
import { agenticChat, type AgenticProgressEvent } from '../../core/agenticChat.js';
import { SessionManager } from '../../core/sessionManager.js';
import { createAutoCommitManager } from '../../git/autoCommit.js';
import { loadGitConfig } from '../../git/config.js';
import { commitDirtyFiles } from '../../git/dirtyFiles.js';
import { RepoMapManager } from '../../context/repoMap.js';
import { parseEffortLevel, type EffortLevel } from '../../core/effortLevel.js';
import { createWorktree } from '../../utils/gitWorktree.js';
import { resolveDefaultAgent } from '../../agent/defaultAgent.js';
import { getConfigDefaultAgent } from '../../config/userConfig.js';
import { getPermissionManager } from '../../permission/index.js';
import { PermissionRequested, PermissionResponse } from '../../bus/index.js';
import { isAbortError } from '../../core/streamingOrchestrator.js';

interface AgentOptions {
  message?: string;
  messageFile?: string;
  model?: string;
  autoRoute?: boolean;
  preferCheap?: boolean;
  session?: string;
  system?: string;
  maxIterations?: number;
  workdir?: string;
  worktree?: boolean;
  tools?: string;
  verbose?: boolean;
  quiet?: boolean;
  // Git flags — commander's --no-<name> sets <name> to false (not no<Name> to true)
  autoCommits?: boolean;
  dirtyCommits?: boolean;
  gitCommitVerify?: boolean;
  attributeCoAuthoredBy?: boolean;
  attributeAuthor?: boolean;
  // Repo map flags
  mapTokens?: string;
  // Effort level
  effort?: string;
  // Custom agent slug (overrides config default)
  agent?: string;
  // --yolo / --dangerously-skip-permissions
  yolo?: boolean;
  dangerouslySkipPermissions?: boolean;
}

export function registerAgentCommand(program: Command): void {
  program
    .command('agent')
    .description('Run agentic chat with tool execution (for automated workflows)')
    .option('-m, --message <text>', 'Message to send')
    .option('-f, --message-file <path>', 'Read message from file')
    .option('--model <id>', 'Model ID override')
    .option('--auto-route', 'Enable automatic model routing based on prompt')
    .option('--prefer-cheap', 'Prefer cheaper models when auto-routing')
    .option('--session <id>', 'Continue existing session')
    .option('--system <prompt>', 'System prompt for the conversation')
    .option('--max-iterations <n>', 'Maximum tool execution iterations', '50')
    .option('--workdir <path>', 'Working directory for tool execution')
    .option('--worktree', 'Run in an isolated git worktree')
    .option('--tools <list>', 'Comma-separated list of tool names to enable (default: all)')
    .option('-v, --verbose', 'Show progress updates')
    .option('-q, --quiet', 'Only output the final response')
    // Git auto-commit flags
    .option('--no-auto-commits', 'Disable git auto-commits after AI file changes')
    .option('--no-dirty-commits', 'Skip committing pre-existing dirty files before AI edits')
    .option('--git-commit-verify', 'Run pre-commit hooks when auto-committing (default: skip)')
    .option('--attribute-co-authored-by', 'Add Co-authored-by trailer to AI commits (default)')
    .option('--attribute-author', 'Override git author for AI commits')
    // Repo map flags
    .option('--map-tokens <n>', 'Repo map token budget (default: 2000; set to 0 to disable)')
    // Effort level
    .option('--effort <level>', 'Effort level: low, medium, high (default: medium)')
    .option(
      '--agent <name>',
      'Custom agent slug to dispatch (overrides `agent` field in user config)'
    )
    .option('--yolo', 'Auto-approve all permission prompts (dangerous)')
    .addOption(new Option('--dangerously-skip-permissions', 'Alias for --yolo').hideHelp())
    .action(async (opts: AgentOptions) => {
      let worktreeCleanup: (() => Promise<void>) | undefined;
      // AbortController fired on first SIGINT (issue #1639) so a Ctrl+C
      // during `agenticChat` propagates through to `provider.complete()`
      // and stops the in-flight LLM request instead of waiting for the
      // model to complete naturally. Hoisted so the catch block can
      // reference it after the SIGINT handler is installed.
      const abortController = new AbortController();
      let restoreSigint: () => void = () => {};
      try {
        if (opts.yolo || opts.dangerouslySkipPermissions) {
          getPermissionManager().setPermissionMode('auto');
        }
        // Get message from either --message or --message-file
        let message: string;
        if (opts.messageFile) {
          message = readFileSync(opts.messageFile, 'utf-8');
        } else if (opts.message) {
          message = opts.message;
        } else {
          console.error('Error: Either --message or --message-file is required');
          process.exit(1);
        }

        // Validate --worktree and --workdir are not both specified
        if (opts.worktree && opts.workdir) {
          console.error('Error: --worktree and --workdir cannot be used together');
          process.exit(1);
        }

        // Wire Ctrl+C to abort the in-flight provider request (issue #1639).
        // The one-shot handler in program.ts only calls `process.exit(0)`,
        // which does not fire an AbortController and lets long provider
        // calls run to completion after cancellation. Take ownership of
        // SIGINT for the duration of this command; a second Ctrl+C
        // escalates to a hard exit(130) via the exit path below (or via
        // any worktree cleanup handler installed later in this action).
        let sigintCount = 0;
        const sigintHandler = () => {
          sigintCount++;
          if (sigintCount === 1) {
            abortController.abort();
            return;
          }
          // Second Ctrl+C: give up on graceful abort.
          process.exit(130);
        };
        const previousSigintListeners = process.listeners('SIGINT');
        process.removeAllListeners('SIGINT');
        process.on('SIGINT', sigintHandler);
        restoreSigint = () => {
          process.removeListener('SIGINT', sigintHandler);
          for (const l of previousSigintListeners) {
            process.on('SIGINT', l as (...args: unknown[]) => void);
          }
        };

        let workdir = opts.workdir ?? process.cwd();

        // Create an isolated git worktree if requested
        if (opts.worktree) {
          const result = await createWorktree(process.cwd());
          workdir = result.path;
          worktreeCleanup = result.cleanup;

          // Register cleanup handlers. On SIGINT we only run cleanup +
          // hard-exit if the user has already pressed Ctrl+C once
          // (sigintCount > 1) — the first press is owned by the
          // abort-controller path above so the in-flight provider
          // request cancels gracefully (issue #1639). SIGTERM is always
          // terminal, so cleanup + exit unconditionally.
          const doCleanup = async () => {
            if (worktreeCleanup) {
              await worktreeCleanup();
              worktreeCleanup = undefined;
            }
          };
          process.on('SIGINT', async () => {
            if (sigintCount <= 1) {
              // First press was already consumed by sigintHandler above
              // (which fired the AbortController). Leave the worktree
              // intact so the graceful abort path can persist partial
              // session state before exit.
              return;
            }
            await doCleanup();
            process.exit(130);
          });
          process.on('SIGTERM', async () => {
            await doCleanup();
            process.exit(143);
          });
        }

        const sessionManager = new SessionManager();

        // Upstream fix (opencode 08faeb3): the non-interactive `agent` command
        // must also answer permission requests raised by *subagent* sessions
        // spawned via the `task` tool. Without this, a `PermissionRequested`
        // event from a subagent has no listener in headless mode and the
        // agent loop hangs waiting for a `PermissionResponse` that never
        // arrives.
        //
        // We track subagent session ids in a local Set (populated whenever a
        // sub-session is created via the task tool — currently the task tool
        // is stub-based and does not spawn distinct sessions, so this set
        // stays empty; the wiring is here so a future real-subagent
        // implementation gets the correct headless behaviour for free) and
        // auto-answer any `PermissionRequested` event whose `id` belongs
        // to either the current session or a tracked subagent session,
        // respecting `--yolo` (grant) or the default policy (deny).
        const subagentSessionIds = new Set<string>();
        const permissionUnsub = PermissionRequested.subscribe((event) => {
          // The Alexi PermissionRequested payload does not carry a
          // sessionID today; we accept every request in headless mode
          // when --yolo is set, and deny otherwise. The subagentSessionIds
          // set is retained so a future payload extension (adding
          // `sessionId` to the schema) can gate on membership without a
          // second refactor. Reference: opencode 08faeb3.
          const grant = Boolean(opts.yolo || opts.dangerouslySkipPermissions);
          PermissionResponse.publish({
            id: event.id,
            granted: grant,
            timestamp: Date.now(),
          });
        });
        // Ensure the subscription is cleaned up on process exit so it
        // does not leak into subsequent invocations under tests.
        process.once('exit', () => permissionUnsub());
        // Suppress the "declared but never read" lint on subagentSessionIds
        // — the set is deliberately reserved for future wiring (see above).
        void subagentSessionIds;

        // Load or create session
        if (opts.session) {
          const session = sessionManager.loadSession(opts.session);
          if (!session) {
            console.error(`Session ${opts.session} not found`);
            process.exit(1);
          }
          if (!opts.quiet) {
            console.log(`[Continuing session: ${session.metadata.title || opts.session}]`);
          }
        }

        // Parse enabled tools
        const enabledTools = opts.tools ? opts.tools.split(',').map((t) => t.trim()) : undefined;

        // Parse effort level
        let effort: EffortLevel | undefined;
        if (opts.effort) {
          effort = parseEffortLevel(opts.effort);
          if (!effort) {
            console.error(`Invalid effort level: ${opts.effort} (valid: low, medium, high)`);
            process.exit(1);
          }
        }

        // Set up git auto-commits
        // Commander's --no-auto-commits sets opts.autoCommits = false (default: true)
        let gitManager: ReturnType<typeof createAutoCommitManager> | undefined;
        if (opts.autoCommits !== false) {
          const gitConfig = await loadGitConfig(workdir);

          // Apply CLI flag overrides
          // Commander's --no-dirty-commits sets opts.dirtyCommits = false
          if (opts.dirtyCommits === false) gitConfig.dirtyCommits = false;
          if (opts.gitCommitVerify) gitConfig.commitVerify = true;
          if (opts.attributeAuthor) gitConfig.attribution.style = 'author';
          else if (opts.attributeCoAuthoredBy) gitConfig.attribution.style = 'co-authored-by';

          gitManager = createAutoCommitManager(workdir, gitConfig);

          // Commit pre-existing dirty files before AI starts editing
          if (gitConfig.dirtyCommits) {
            const dirtyResult = await commitDirtyFiles(workdir, gitConfig);
            if (dirtyResult.committed && !opts.quiet) {
              console.error(
                `[Git] Committed ${dirtyResult.filesCommitted.length} pre-existing dirty file(s): ${dirtyResult.hash}`
              );
            }
          }
        }

        // Set up repo map manager (enabled by default; disable with --map-tokens 0)
        const DEFAULT_MAP_TOKENS = 2000;
        const mapTokensBudget =
          opts.mapTokens !== undefined ? parseInt(opts.mapTokens, 10) : DEFAULT_MAP_TOKENS;
        let repoMapManager: RepoMapManager | undefined;
        if (!isNaN(mapTokensBudget) && mapTokensBudget > 0) {
          repoMapManager = new RepoMapManager(workdir, { maxTokens: mapTokensBudget });
        }

        // Progress callback
        const onProgress =
          opts.verbose && !opts.quiet
            ? (event: AgenticProgressEvent) => {
                switch (event.type) {
                  case 'iteration':
                    console.error(`[Iteration ${event.iteration}]`);
                    break;
                  case 'llm_call':
                    console.error(`  → Calling LLM...`);
                    break;
                  case 'tool_start':
                    console.error(`  → Executing tool: ${event.toolName}`);
                    break;
                  case 'tool_end': {
                    const status = event.result?.success ? '✓' : '✗';
                    console.error(
                      `    ${status} ${event.toolName} ${event.result?.success ? 'succeeded' : 'failed'}`
                    );
                    if (!event.result?.success && event.result?.error) {
                      console.error(`      Error: ${event.result.error}`);
                    }
                    break;
                  }
                  case 'complete':
                    console.error(`[Complete: ${event.message}]`);
                    break;
                }
              }
            : undefined;

        // Resolve agent: --agent flag > config `agent` field > undefined.
        // Unknown slugs log a warning and fall back to the default agent.
        const agentId = await resolveDefaultAgent({
          cliFlag: opts.agent,
          configValue: getConfigDefaultAgent(),
          workdir,
        });

        const res = await agenticChat(message, {
          modelOverride: opts.model,
          autoRoute: opts.autoRoute,
          preferCheap: opts.preferCheap,
          sessionManager,
          systemPrompt: opts.system,
          maxIterations: parseInt(String(opts.maxIterations ?? '50'), 10),
          workdir,
          enabledTools,
          onProgress,
          gitManager,
          repoMapManager,
          effort,
          agentId,
          signal: abortController.signal,
        });

        // Flush any pending auto-commits
        if (gitManager) {
          try {
            const finalCommit = await gitManager.commitPendingChanges();
            if (finalCommit && !opts.quiet) {
              console.error(`[Git] Auto-committed: ${finalCommit.hash} — ${finalCommit.message}`);
            }
          } catch (commitErr) {
            console.error(
              `[Git] Warning: auto-commit failed: ${commitErr instanceof Error ? commitErr.message : String(commitErr)}`
            );
          }
          gitManager.destroy();
        }

        // Output result
        console.log(res.text);

        if (!opts.quiet) {
          // Show usage and stats
          console.error('');
          console.error(`[Model: ${res.modelUsed}]`);
          console.error(`[Iterations: ${res.iterations}, Tool calls: ${res.toolCallsExecuted}]`);
          console.error(
            `[Tokens: ${res.usage.prompt_tokens} in, ${res.usage.completion_tokens} out]`
          );

          // Show tool call summary if verbose
          if (opts.verbose && res.toolCallSummary.length > 0) {
            console.error('\n[Tool Call Summary]');
            for (const tc of res.toolCallSummary) {
              const status = tc.success ? '✓' : '✗';
              console.error(`  ${status} ${tc.name}${tc.error ? `: ${tc.error}` : ''}`);
            }
          }

          // Print session info
          const currentSession = sessionManager.getCurrentSession();
          if (currentSession) {
            console.error(`\n[Session: ${currentSession.metadata.id}]`);
          }
        }

        // Clean up worktree on normal exit
        if (worktreeCleanup) {
          await worktreeCleanup();
        }
        restoreSigint();
      } catch (e) {
        // Clean up worktree on error
        if (worktreeCleanup) {
          await worktreeCleanup();
        }
        restoreSigint();
        // User-initiated abort (Ctrl+C): surface a clear cancellation
        // message and exit with the standard SIGINT exit code (issue #1639).
        if (isAbortError(e) || (e instanceof Error && /aborted/i.test(e.message))) {
          console.error('Request cancelled by user');
          process.exit(130);
        }
        // Log full error details for debugging (especially API errors)
        if (e instanceof Error) {
          console.error(`Error: ${e.message}`);

          // Walk the full cause chain and extract Axios response data
          let current: unknown = e;
          let depth = 0;
          while (current && depth < 10) {
            const err = current as Record<string, unknown>;

            // Check for Axios response data at each level
            if (err['response'] && typeof err['response'] === 'object') {
              const resp = err['response'] as Record<string, unknown>;
              const data = resp['data'] ?? resp['body'];
              if (data) {
                console.error(
                  `API Response (depth=${depth}): status=${resp['status']}, data=${JSON.stringify(data, null, 2).slice(0, 2000)}`
                );
              }
            }

            // Check for rootCause (SAP SDK specific)
            if (err['rootCause']) {
              console.error(`Root cause (depth=${depth}): ${String(err['rootCause'])}`);
              // rootCause may itself have response data
              const rc = err['rootCause'] as Record<string, unknown>;
              if (rc['response'] && typeof rc['response'] === 'object') {
                const rcResp = rc['response'] as Record<string, unknown>;
                const rcData = rcResp['data'] ?? rcResp['body'];
                if (rcData) {
                  console.error(
                    `Root cause response: status=${rcResp['status']}, data=${JSON.stringify(rcData, null, 2).slice(0, 2000)}`
                  );
                }
              }
            }

            // Move to next level in cause chain
            current = (err['cause'] as unknown) ?? (err['rootCause'] as unknown) ?? undefined;
            depth++;
          }
        } else {
          console.error(String(e));
        }
        process.exit(1);
      }
    });
}
