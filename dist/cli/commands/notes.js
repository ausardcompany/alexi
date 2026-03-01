/**
 * Notes command - generate AI_NOTES.md for current stage
 */
import { getStageManager } from '../../core/stageManager.js';
import { AINotesGenerator } from '../../core/aiNotes.js';
export function registerNotesCommand(program) {
    program
        .command('notes-generate')
        .description('Generate AI_NOTES.md for current stage')
        .option('-o, --output <file>', 'Output filename')
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
                .addRationale('Following structured development process')
                .addVerificationStep('Review generated documentation')
                .build();
            const filePath = generator.save(notes, opts.output);
            console.log(`✅ Generated: ${filePath}`);
        }
        catch (e) {
            console.error(String(e));
            process.exit(1);
        }
    });
}
