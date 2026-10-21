/**
 * `alexi doctor` command — comprehensive health checks and diagnostics.
 *
 * Runs the full `DoctorService` sweep over environment variables, config
 * files, the MCP tracker, SAP AI Core reachability, the tool registry,
 * and permission rules. The command is intentionally side-effect free by
 * default; `--fix` opts in to a small set of safe auto-repairs
 * (currently: create `~/.alexi/` if missing).
 *
 * Flags:
 *   --verbose   — include timing / fix hints for every check
 *   --fix       — attempt safe auto-repairs where supported
 *   --json      — emit structured JSON (stable shape for scripts/CI)
 *   --skip-network — skip the optional SAP AI Core reachability probe
 *
 * Exit code 0 when no check failed (warnings allowed); 1 when one or more
 * checks returned `fail`. This matches the convention used elsewhere in
 * the CLI (`alexi reload`, `alexi models`) so shell pipelines can gate
 * on it.
 */

import type { Command } from 'commander';
import { getDoctor } from '../../doctor/index.js';

interface DoctorCliOptions {
  verbose?: boolean;
  fix?: boolean;
  json?: boolean;
  skipNetwork?: boolean;
}

export function registerDoctorCommand(program: Command): void {
  program
    .command('doctor')
    .description('Run health checks and diagnostics')
    .option('--verbose', 'Show detailed diagnostic info including timings')
    .option('--fix', 'Attempt safe auto-repairs (e.g. create missing directories)')
    .option('--json', 'Output structured JSON for programmatic use')
    .option('--skip-network', 'Skip network reachability checks')
    .action(async (opts: DoctorCliOptions) => {
      const doctor = getDoctor();
      const results = await doctor.runAll({
        skipNetwork: opts.skipNetwork,
        fix: opts.fix,
      });

      if (opts.json) {
        process.stdout.write(doctor.formatJson(results) + '\n');
      } else {
        const report = opts.verbose
          ? doctor.formatReport(results)
          : doctor.formatReportPlain(results);
        process.stdout.write(report + '\n');
      }

      const summary = doctor.getSummary(results);
      if (summary.failed > 0) {
        process.exitCode = 1;
      }
    });
}
