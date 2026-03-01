/**
 * DoD commands - Definition of Done checks
 */

import type { Command } from 'commander';
import { DoDChecker } from '../../core/dodChecker.js';
import { validateStageOrExit } from '../utils/validation.js';

interface DoDCheckOptions {
  stage: string;
  output?: string;
}

export function registerDoDCommands(program: Command): void {
  // Run DoD checks
  program
    .command('dod-check')
    .description('Run Definition of Done checks')
    .option('-s, --stage <type>', 'Stage type (default: implementation)', 'implementation')
    .option('-o, --output <file>', 'Save report to file')
    .action(async (opts: DoDCheckOptions) => {
      try {
        const validStage = validateStageOrExit(opts.stage);

        const checker = new DoDChecker();
        console.log(`\nRunning DoD checks for ${validStage}...\n`);

        const report = checker.runChecks(validStage);
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
    });

  // List available DoD checks
  program
    .command('dod-list')
    .description('List available DoD checks')
    .action(async () => {
      try {
        const checker = new DoDChecker();
        const checks = checker.listChecks();

        console.log('\n=== Available DoD Checks ===\n');
        checks.forEach((check) => {
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
    });
}
