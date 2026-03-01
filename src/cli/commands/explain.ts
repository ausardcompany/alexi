/**
 * Explain command - explain routing decision for a prompt
 */

import type { Command } from 'commander';
import { explainRouting } from '../../core/router.js';

interface ExplainOptions {
  message: string;
}

export function registerExplainCommand(program: Command): void {
  program
    .command('explain')
    .requiredOption('-m, --message <text>', 'Message to analyze')
    .description('Explain routing decision for a prompt')
    .action(async (opts: ExplainOptions) => {
      try {
        const analysis = await explainRouting(opts.message);
        console.log('\n=== Prompt Analysis ===');
        console.log(`Type: ${analysis.classification.type}`);
        console.log(`Complexity: ${analysis.classification.complexity}`);
        console.log(`Requires Reasoning: ${analysis.classification.requiresReasoning}`);
        console.log(`Estimated Tokens: ${analysis.classification.estimatedTokens}`);

        if (analysis.matchedRules && analysis.matchedRules.length > 0) {
          console.log('\n=== Matched Rules ===');
          analysis.matchedRules.forEach((rule) => {
            console.log(`• ${rule.name} (priority: ${rule.priority}): ${rule.description}`);
          });
        }

        console.log('\n=== Model Candidates (by score) ===');
        analysis.candidates.forEach((c, i) => {
          const marker = i === 0 ? '✓ ' : '  ';
          console.log(`${marker}${c.modelId.padEnd(20)} Score: ${c.score} - ${c.reason}`);
        });

        console.log('\n=== Selected Model ===');
        console.log(`Model: ${analysis.selected.modelId}`);
        console.log(`Reason: ${analysis.selected.reason}`);
        console.log(`Confidence: ${(analysis.selected.confidence * 100).toFixed(0)}%`);
        if (analysis.selected.ruleApplied) {
          console.log(`Rule Applied: ${analysis.selected.ruleApplied}`);
        }
      } catch (e) {
        console.error(String(e));
        process.exit(1);
      }
    });
}
