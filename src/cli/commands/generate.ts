/**
 * Generate command — one-shot image generation via the `image_gen` tool.
 *
 * Wraps the tool with a Commander subcommand so users can trigger image
 * generation from the shell without launching the interactive REPL:
 *
 *   alexi generate -p "draw a cat" --model gemini-imagen-3
 *
 * The command validates the target model via `modelHasCapability` before
 * making the request (inherited from the underlying tool) and prints the
 * resulting image references — hosted URLs or on-disk paths — one per
 * line. Non-zero exit code on failure so shell pipelines can detect
 * errors.
 */

import { type Command } from 'commander';
import { imageGenTool } from '../../tool/tools/image-gen.js';
import { getPermissionManager } from '../../permission/index.js';

interface GenerateOptions {
  prompt?: string;
  model?: string;
  size?: string;
  outputPath?: string;
  yolo?: boolean;
}

export function registerGenerateCommand(program: Command): void {
  program
    .command('generate')
    .description('Generate an image from a text prompt via an image-capable model')
    .option('-p, --prompt <text>', 'Text prompt describing the image')
    .option(
      '--model <id>',
      'Model id (must advertise image-generation capability). Falls back to $ALEXI_IMAGE_MODEL.'
    )
    .option('--size <spec>', 'Optional size hint, e.g. "1024x1024"')
    .option('--output-path <dir>', 'Directory to save decoded base64 images')
    .option('--yolo', 'Auto-approve all permission prompts (dangerous)')
    .action(async (opts: GenerateOptions) => {
      if (!opts.prompt || opts.prompt.trim().length === 0) {
        console.error('Error: --prompt is required');
        process.exit(1);
      }

      if (opts.yolo) {
        getPermissionManager().setPermissionMode('auto');
      }

      const result = await imageGenTool.executeUnsafe(
        {
          prompt: opts.prompt,
          model: opts.model,
          size: opts.size,
          outputPath: opts.outputPath,
        },
        { workdir: process.cwd() }
      );

      if (!result.success || !result.data) {
        console.error(`Error: ${result.error ?? 'image generation failed'}`);
        process.exit(1);
      }

      const { model, images } = result.data;
      console.log(`[Model: ${model}]`);
      for (const image of images) {
        if (image.kind === 'url') {
          console.log(`url ${image.mimeType ?? ''} ${image.url}`.trim());
        } else {
          const size = image.sizeBytes !== undefined ? ` (${image.sizeBytes} bytes)` : '';
          console.log(`file ${image.mimeType ?? ''} ${image.path}${size}`.trim());
        }
      }
    });
}
