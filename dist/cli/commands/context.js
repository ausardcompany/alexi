/**
 * Context commands - manage project context
 */
import { getProjectContextManager } from '../../config/projectContext.js';
export function registerContextCommands(program) {
    // Show current project context
    program
        .command('context')
        .description('Show current project context')
        .action(async () => {
        try {
            const manager = getProjectContextManager();
            const context = manager.load();
            console.log('\n=== Project Context ===\n');
            console.log(`Name: ${context.name}`);
            console.log(`Description: ${context.description || 'N/A'}`);
            console.log(`\nStack:`);
            console.log(`  Language: ${context.stack.language}`);
            if (context.stack.framework)
                console.log(`  Framework: ${context.stack.framework}`);
            console.log(`  Versions:`, context.stack.versions);
            console.log(`\nInfrastructure:`);
            console.log(`  Platform: ${context.infrastructure.platform}`);
            if (context.infrastructure.containerization) {
                console.log(`  Containerization: ${context.infrastructure.containerization}`);
            }
            console.log(`\nArchitecture Invariants:`);
            if (context.architectureInvariants.length === 0) {
                console.log('  None defined');
            }
            else {
                context.architectureInvariants.forEach(inv => console.log(`  • ${inv}`));
            }
            console.log(`\nConstraints:`);
            if (context.constraints.length === 0) {
                console.log('  None defined');
            }
            else {
                context.constraints.forEach(c => console.log(`  • ${c}`));
            }
        }
        catch (e) {
            console.error(String(e));
            process.exit(1);
        }
    });
    // Initialize project context
    program
        .command('context-init')
        .description('Initialize project context')
        .requiredOption('-n, --name <name>', 'Project name')
        .option('-d, --description <desc>', 'Project description')
        .option('--language <lang>', 'Primary language', 'TypeScript')
        .option('--framework <fw>', 'Framework')
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
        }
        catch (e) {
            console.error(String(e));
            process.exit(1);
        }
    });
    // Add architecture invariant
    program
        .command('context-add-invariant')
        .description('Add architecture invariant')
        .requiredOption('-i, --invariant <text>', 'Invariant description')
        .action(async (opts) => {
        try {
            const manager = getProjectContextManager();
            manager.addInvariant(opts.invariant);
            console.log(`✅ Added invariant: ${opts.invariant}`);
        }
        catch (e) {
            console.error(String(e));
            process.exit(1);
        }
    });
}
