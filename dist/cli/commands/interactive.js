/**
 * Interactive command - start REPL with streaming responses
 */
import { startInteractive } from '../interactive.js';
export function registerInteractiveCommand(program) {
    program
        .command('interactive')
        .alias('i')
        .description('Start interactive REPL with streaming responses')
        .option('--model <id>', 'Model ID to use')
        .option('--auto-route', 'Enable automatic model routing')
        .option('--prefer-cheap', 'Prefer cheaper models when auto-routing')
        .option('--session <id>', 'Continue existing session')
        .option('--system <prompt>', 'System prompt for the conversation')
        .action(async (opts) => {
        try {
            await startInteractive({
                model: opts.model,
                autoRoute: opts.autoRoute,
                preferCheap: opts.preferCheap,
                session: opts.session,
                systemPrompt: opts.system,
            });
        }
        catch (e) {
            console.error(String(e));
            process.exit(1);
        }
    });
}
