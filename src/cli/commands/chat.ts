/**
 * Chat command - send single message to AI
 */

import { readFileSync } from 'node:fs';
import { Option, type Command } from 'commander';
import { sendChat } from '../../core/orchestrator.js';
import { SessionManager } from '../../core/sessionManager.js';
import { resolveDefaultAgent } from '../../agent/defaultAgent.js';
import { getConfigDefaultAgent } from '../../config/userConfig.js';
import { getAgentRegistry } from '../../agent/index.js';
import {
  type Command as CustomCommand,
  renderSubmitPrompt,
  getCommandRegistry,
} from '../../command/index.js';
import { getPermissionManager } from '../../permission/index.js';
import { imageGenTool, type ImageGenResult } from '../../tool/tools/image-gen.js';
import type { ToolResult } from '../../tool/index.js';
import { SessionDrain } from '../../session/drain.js';

/**
 * Result of running a custom command in non-interactive (chat) mode.
 *
 * `submitPrompt`, when present, is the *resolved* follow-up prompt the
 * command would have queued in the interactive REPL. Non-interactive
 * callers MUST NOT auto-submit it — chat is one-shot — but should surface
 * `hint` so the user knows the command intended a follow-up turn and can
 * re-run with the `alexi` REPL to chain it.
 */
export interface NonInteractiveCommandResult {
  rendered: string;
  submitPrompt?: string;
  hint?: string;
}

/**
 * Hint surfaced to non-interactive chat callers when a custom command's
 * `submitPrompt` is ignored. Exported as a constant so tests and other
 * callers can match on it without re-typing the string.
 */
export const SUBMIT_PROMPT_NON_INTERACTIVE_HINT =
  'submitPrompt was ignored in non-interactive mode; use `alexi` REPL to chain commands';

/**
 * Run a custom command in non-interactive (chat) mode and surface a hint
 * when the command declares a `submitPrompt` follow-up. Does NOT
 * auto-submit — chat is one-shot.
 *
 * Exported so tests and other non-interactive entry points can assert on
 * the hint without booting the full Commander pipeline.
 */
export async function runCommandNonInteractive(
  commandName: string,
  args: string[]
): Promise<NonInteractiveCommandResult> {
  const registry = getCommandRegistry();
  const rendered = await registry.execute(commandName, args);
  const command = registry.get(commandName) as CustomCommand | undefined;
  const submitPrompt = command
    ? renderSubmitPrompt(command, args, registry.getWorkdir())
    : undefined;
  if (submitPrompt && submitPrompt.trim().length > 0) {
    return {
      rendered,
      submitPrompt,
      hint: SUBMIT_PROMPT_NON_INTERACTIVE_HINT,
    };
  }
  return { rendered };
}

interface ChatOptions {
  message?: string;
  messageFile?: string;
  model?: string;
  autoRoute?: boolean;
  preferCheap?: boolean;
  session?: string;
  system?: string;
  agent?: string;
  yolo?: boolean;
  dangerouslySkipPermissions?: boolean;
  /**
   * When set, `chat` runs in image-generation mode instead of text chat.
   * The argument is treated as a natural-language image prompt and routed
   * through the `image_gen` tool. Combines with `--model <id>` to pin an
   * image-capable model (otherwise falls back to `$ALEXI_IMAGE_MODEL`).
   */
  image?: string;
  /** Optional size hint (e.g. "1024x1024") forwarded to `image_gen`. */
  imageSize?: string;
  /**
   * Optional output directory for decoded base64 image payloads. When
   * omitted the tool writes into `$TMPDIR/alexi-images`.
   */
  imageOutputPath?: string;
}

/**
 * Rendered outcome of a chat-command run in image-generation mode. Kept
 * as a plain object so tests can assert on the shape without capturing
 * stdout.
 *
 * - `exitCode`  : 0 on success, 1 on failure. Mirrors what the Commander
 *                 action would exit with, so tests can rely on the same
 *                 semantics as a shell invocation.
 * - `lines`     : the ordered stdout lines the command would print. First
 *                 line is `[Model: <id>]`, followed by one line per image
 *                 payload (`url ...` or `file ...`).
 * - `errorLines`: the ordered stderr lines emitted on failure.
 * - `toolResult`: the raw `ToolResult<ImageGenResult>` so callers/tests can
 *                 inspect hints, truncation, and per-image metadata.
 */
export interface ChatImageResult {
  exitCode: 0 | 1;
  lines: string[];
  errorLines: string[];
  toolResult: ToolResult<ImageGenResult>;
}

/**
 * Options accepted by {@link runChatImageMode}. Mirrors the subset of
 * `ChatOptions` that governs image generation so the helper is callable
 * from tests without constructing a full Commander action closure.
 */
export interface ChatImageModeOptions {
  prompt: string;
  model?: string;
  size?: string;
  outputPath?: string;
  yolo?: boolean;
  dangerouslySkipPermissions?: boolean;
}

/**
 * Run the chat command in image-generation mode.
 *
 * The `--image` flag on `alexi chat` short-circuits the text-chat pipeline
 * (session manager, agent resolution, `sendChat`) and delegates to the
 * `image_gen` tool. The tool takes care of:
 *  - Model resolution (`--model`, then `$ALEXI_IMAGE_MODEL`).
 *  - Capability validation via `modelHasCapability(id, 'image-generation')`
 *    so unknown / non-image models are rejected up-front instead of paying
 *    for a doomed round-trip.
 *  - Streaming the response and normalising URL / base64 image payloads.
 *  - Persisting decoded base64 blobs to disk (unless `outputPath` is a
 *    session-scoped override).
 *
 * The returned {@link ChatImageResult} captures both the stdout the caller
 * would print AND the underlying tool result, so tests can assert on the
 * rendered output without shelling out.
 *
 * Exported so tests can exercise the branch directly without booting
 * Commander.
 */
export async function runChatImageMode(opts: ChatImageModeOptions): Promise<ChatImageResult> {
  const lines: string[] = [];
  const errorLines: string[] = [];

  if (!opts.prompt || opts.prompt.trim().length === 0) {
    errorLines.push('Error: --image requires a non-empty prompt');
    return {
      exitCode: 1,
      lines,
      errorLines,
      toolResult: { success: false, error: 'empty prompt' },
    };
  }

  if (opts.yolo || opts.dangerouslySkipPermissions) {
    getPermissionManager().setPermissionMode('auto');
  }

  const toolResult = await imageGenTool.executeUnsafe(
    {
      prompt: opts.prompt,
      model: opts.model,
      size: opts.size,
      outputPath: opts.outputPath,
    },
    { workdir: process.cwd() }
  );

  if (!toolResult.success || !toolResult.data) {
    errorLines.push(`Error: ${toolResult.error ?? 'image generation failed'}`);
    if (toolResult.hint) {
      errorLines.push(`Hint: ${toolResult.hint}`);
    }
    return { exitCode: 1, lines, errorLines, toolResult };
  }

  const { model, images } = toolResult.data;
  lines.push(`[Model: ${model}]`);
  for (const image of images) {
    if (image.kind === 'url') {
      lines.push(`url ${image.mimeType ?? ''} ${image.url}`.trim());
    } else if (image.path) {
      const size = image.sizeBytes !== undefined ? ` (${image.sizeBytes} bytes)` : '';
      lines.push(`file ${image.mimeType ?? ''} ${image.path}${size}`.trim());
    } else if (image.data) {
      // returnBase64 mode: image_gen returns raw base64 inline. Report the
      // size only; the raw base64 is not echoed to stdout so we do not
      // spam ~1MB of characters into a shell log.
      const size = image.sizeBytes !== undefined ? ` (${image.sizeBytes} bytes)` : '';
      lines.push(`base64 ${image.mimeType ?? ''}${size}`.trim());
    }
  }
  if (toolResult.truncated && toolResult.hint) {
    lines.push(`[Partial: ${toolResult.hint}]`);
  }

  return { exitCode: 0, lines, errorLines, toolResult };
}

export function registerChatCommand(program: Command): void {
  program
    .command('chat')
    .option('-m, --message <text>', 'Message to send')
    .option('-f, --message-file <path>', 'Read message from file')
    .option('--model <id>', 'Model ID override')
    .option('--auto-route', 'Enable automatic model routing based on prompt')
    .option('--prefer-cheap', 'Prefer cheaper models when auto-routing')
    .option('--session <id>', 'Continue existing session')
    .option('--system <prompt>', 'System prompt for the conversation')
    .option(
      '--agent <name>',
      'Agent slug whose system prompt and model become defaults (overrides `agent` field in user config). Tools are not enabled in chat mode, so agent tool restrictions are ignored.'
    )
    .option('--yolo', 'Auto-approve all permission prompts (dangerous)')
    .addOption(new Option('--dangerously-skip-permissions', 'Alias for --yolo').hideHelp())
    .option(
      '--image <prompt>',
      'Generate an image from the given prompt instead of running a text chat turn'
    )
    .option('--image-size <spec>', 'Optional size hint for --image, e.g. "1024x1024"')
    .option('--image-output-path <dir>', 'Directory to save decoded base64 images from --image')
    .action(async (opts: ChatOptions) => {
      try {
        // Image-generation short-circuit. When `--image` is provided the
        // command bypasses the text-chat pipeline entirely and delegates
        // to the `image_gen` tool via `runChatImageMode`.
        if (opts.image !== undefined) {
          const result = await runChatImageMode({
            prompt: opts.image,
            model: opts.model,
            size: opts.imageSize,
            outputPath: opts.imageOutputPath,
            yolo: opts.yolo,
            dangerouslySkipPermissions: opts.dangerouslySkipPermissions,
          });
          for (const line of result.lines) {
            console.log(line);
          }
          for (const line of result.errorLines) {
            console.error(line);
          }
          if (result.exitCode !== 0) {
            // Alexi_change: drain background work before exit (kilocode
            // fix(cli): drain background work before headless exit).
            await SessionDrain.drain({ timeoutMs: 30_000 });
            process.exit(result.exitCode);
          }
          return;
        }

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
          // Alexi_change: drain before headless exit so any partially
          // scheduled tool events / persistence writes complete.
          await SessionDrain.drain({ timeoutMs: 30_000 });
          process.exit(1);
        }

        const sessionManager = new SessionManager();

        // Load or create session
        let existingSessionAgent: string | undefined;
        if (opts.session) {
          const session = sessionManager.loadSession(opts.session);
          if (!session) {
            console.error(`Session ${opts.session} not found`);
            // Alexi_change: drain before headless exit.
            await SessionDrain.drain({ timeoutMs: 30_000 });
            process.exit(1);
          }
          console.log(`[Continuing session: ${session.metadata.title || opts.session}]`);
          // Preserve the session's previously-recorded agent so a headless
          // `--session <id>` resume without an explicit `--agent` flag does
          // not silently drop the user's selection. Upstream: kilocode
          // f4cba053a.
          existingSessionAgent = session.metadata.agent;
        }

        // Resolve agent: --agent flag > session-recorded agent > config > undefined.
        // Unknown slugs log a warning and fall back to defaults.
        const agentId = await resolveDefaultAgent({
          cliFlag: opts.agent ?? existingSessionAgent,
          configValue: getConfigDefaultAgent(),
        });

        // For chat, the agent's system prompt and model become defaults.
        // Tools are not enabled on this path, so `tools`/`disabledTools`
        // on the agent are intentionally ignored.
        let effectiveSystemPrompt = opts.system;
        let effectiveModel = opts.model;
        if (agentId) {
          const agent = getAgentRegistry().get(agentId);
          if (agent) {
            if (!effectiveSystemPrompt) {
              effectiveSystemPrompt = agent.systemPrompt;
            }
            if (!effectiveModel && agent.preferredModel) {
              effectiveModel = agent.preferredModel;
            }
          }
        }

        const res = await sendChat(message, {
          modelOverride: effectiveModel,
          autoRoute: opts.autoRoute,
          preferCheap: opts.preferCheap,
          sessionManager,
          systemPrompt: effectiveSystemPrompt,
        });

        // When the orchestrator dispatched to an image-generation model
        // (see `sendChat` image-gen short-circuit for issue #1549), `text`
        // is empty and `images` carries the structured payloads. Render
        // each entry on its own line so the output is greppable from a
        // shell pipeline. URL payloads print verbatim; base64 payloads
        // print a marker with the MIME type and decoded byte count (the
        // raw base64 is intentionally NOT echoed to avoid dumping ~1MB
        // of characters into a shell log — callers that want the bytes
        // should use the `alexi generate` / `alexi chat --image` flows
        // which persist to disk).
        if (res.images && res.images.length > 0) {
          console.log(`[Model: ${res.modelUsed}]`);
          for (const image of res.images) {
            if (image.kind === 'url') {
              console.log(`url ${image.mimeType ?? ''} ${image.url}`.trim());
            } else {
              const bytes = Math.floor((image.base64.length * 3) / 4);
              console.log(`base64 ${image.mimeType ?? ''} ${bytes} bytes`.trim());
            }
          }
        } else {
          console.log(res.text);
        }
        if (res.usage) console.log(JSON.stringify(res.usage));
        if (res.modelUsed && opts.autoRoute) {
          console.log(`\n[Model: ${res.modelUsed}]`);
        }

        // Print session info
        const currentSession = sessionManager.getCurrentSession();
        if (currentSession) {
          // Persist the resolved agent on the session metadata so a later
          // `--session <id>` resume without an explicit `--agent` continues
          // with the same agent (kilocode f4cba053a).
          if (agentId && currentSession.metadata.agent !== agentId) {
            currentSession.metadata.agent = agentId;
            try {
              sessionManager.persistActiveSession();
            } catch {
              // Non-fatal: agent preservation is best-effort.
            }
          }
          console.log(`\n[Session: ${currentSession.metadata.id}]`);
          console.log(
            `[Messages: ${currentSession.metadata.messageCount}, Tokens: ${currentSession.metadata.totalTokens}]`
          );
        }
      } catch (e) {
        console.error(String(e));
        // Alexi_change: drain background work before exit so partially
        // written session state / tool events flush cleanly (kilocode
        // fix(cli): drain background work before headless exit). A 30s
        // budget is generous enough for slow FS syncs but bounded so a
        // hung task cannot wedge the CLI forever.
        try {
          await SessionDrain.drain({ timeoutMs: 30_000 });
        } catch {
          // Drain failures are non-fatal — we're already on the error
          // path and about to exit(1).
        }
        process.exit(1);
      }
    });
}
