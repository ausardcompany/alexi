/**
 * Stage commands - manage conversation stages
 */

import type { Command } from 'commander';
import { getStageManager } from '../../core/stageManager.js';
import { validateStageOrExit } from '../utils/validation.js';

interface StageSetOptions {
  stage: string;
  number: string;
  name?: string;
}

export function registerStageCommands(program: Command): void {
  // List available stages
  program
    .command('stages')
    .description('List available conversation stages')
    .action(async () => {
      try {
        const manager = getStageManager();
        const stages = manager.listStages();

        console.log('\n=== Available Stages ===\n');
        stages.forEach((stage) => {
          console.log(`${stage.name} (${stage.type})`);
          console.log(`  ${stage.description}`);
          console.log();
        });
      } catch (e) {
        console.error(String(e));
        process.exit(1);
      }
    });

  // Set current development stage
  program
    .command('stage-set')
    .description('Set current development stage')
    .requiredOption(
      '-s, --stage <type>',
      'Stage type (architecture, planning, implementation, documentation, devops, security)'
    )
    .option('-n, --number <num>', 'Stage number', '1')
    .option('--name <name>', 'Stage name')
    .action(async (opts: StageSetOptions) => {
      try {
        const manager = getStageManager();
        const validStage = validateStageOrExit(opts.stage);

        const stage = manager.setStage(validStage, {
          stageNumber: parseInt(opts.number),
          name: opts.name,
        });

        const definition = manager.getStageDefinition(validStage);
        console.log(`\n✅ Stage set: ${definition.name}`);
        console.log(`   Type: ${stage.stage}`);
        if (stage.stageNumber) console.log(`   Number: ${stage.stageNumber}`);
        if (stage.name) console.log(`   Name: ${stage.name}`);
        console.log(`\nExpected artifacts:`);
        definition.expectedArtifacts.forEach((a) => console.log(`  • ${a}`));
        console.log(`\nDefinition of Done:`);
        definition.dod.forEach((d) => console.log(`  • ${d}`));
      } catch (e) {
        console.error(String(e));
        process.exit(1);
      }
    });
}
