/**
 * Chat command - send single message to AI
 */

import { readFileSync } from 'node:fs';
import type { Command } from 'commander';
import { sendChat } from '../../core/orchestrator.js';
import { SessionManager } from '../../core/sessionManager.js';

interface ChatOptions {
  message?: string;
  messageFile?: string;
  model?: string;
  autoRoute?: boolean;
  preferCheap?: boolean;
  session?: string;
  system?: string;
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
    .action(async (opts: ChatOptions) => {
      try {
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
        
        const res = await sendChat(message, {
          modelOverride: opts.model,
          autoRoute: opts.autoRoute,
          preferCheap: opts.preferCheap,
          sessionManager,
          systemPrompt: opts.system
        });
        
        console.log(res.text);
        if (res.usage) console.log(JSON.stringify(res.usage));
        if (res.modelUsed && opts.autoRoute) {
          console.log(`\n[Model: ${res.modelUsed}]`);
        }
        
        // Print session info
        const currentSession = sessionManager.getCurrentSession();
        if (currentSession) {
          console.log(`\n[Session: ${currentSession.metadata.id}]`);
          console.log(`[Messages: ${currentSession.metadata.messageCount}, Tokens: ${currentSession.metadata.totalTokens}]`);
        }
      } catch (e) {
        console.error(String(e));
        process.exit(1);
      }
    });
}
