/**
 * Chat command - send single message to AI
 */
import { sendChat } from '../../core/orchestrator.js';
import { SessionManager } from '../../core/sessionManager.js';
export function registerChatCommand(program) {
    program
        .command('chat')
        .requiredOption('-m, --message <text>', 'Message to send')
        .option('--model <id>', 'Model ID override')
        .option('--auto-route', 'Enable automatic model routing based on prompt')
        .option('--prefer-cheap', 'Prefer cheaper models when auto-routing')
        .option('--session <id>', 'Continue existing session')
        .option('--system <prompt>', 'System prompt for the conversation')
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
            });
            console.log(res.text);
            if (res.usage)
                console.log(JSON.stringify(res.usage));
            if (res.modelUsed && opts.autoRoute) {
                console.log(`\n[Model: ${res.modelUsed}]`);
            }
            // Print session info
            const currentSession = sessionManager.getCurrentSession();
            if (currentSession) {
                console.log(`\n[Session: ${currentSession.metadata.id}]`);
                console.log(`[Messages: ${currentSession.metadata.messageCount}, Tokens: ${currentSession.metadata.totalTokens}]`);
            }
        }
        catch (e) {
            console.error(String(e));
            process.exit(1);
        }
    });
}
