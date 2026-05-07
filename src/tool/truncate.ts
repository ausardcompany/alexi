/**
 * Tool Output Truncation Module
 * Provides configurable truncation for tool outputs
 */

export interface TruncationConfig {
  maxOutputLength?: number;
  maxLineCount?: number;
  preserveEnds?: boolean;
}

export type { TruncationConfig as TruncationConfigSchema };

const DEFAULT_CONFIG: Required<TruncationConfig> = {
  maxOutputLength: 10000,
  maxLineCount: 500,
  preserveEnds: true,
};

/**
 * Truncate output with configurable limits
 * @param output - The output string to truncate
 * @param config - Truncation configuration
 * @returns The truncated output
 */
export function truncateOutput(output: string, config: TruncationConfig = {}): string {
  const { maxOutputLength, maxLineCount, preserveEnds } = {
    ...DEFAULT_CONFIG,
    ...config,
  };

  const lines = output.split('\n');

  // Truncate by line count first
  if (lines.length > maxLineCount) {
    if (preserveEnds) {
      const half = Math.floor(maxLineCount / 2);
      const head = lines.slice(0, half);
      const tail = lines.slice(-half);
      output = [
        ...head,
        `\n... (${lines.length - maxLineCount} lines omitted) ...\n`,
        ...tail,
      ].join('\n');
    } else {
      output = lines.slice(0, maxLineCount).join('\n') + '\n... (truncated)';
    }
  }

  // Then truncate by character count
  if (output.length > maxOutputLength) {
    if (preserveEnds) {
      const half = Math.floor(maxOutputLength / 2);
      output = output.slice(0, half) + '\n... (truncated) ...\n' + output.slice(-half);
    } else {
      output = output.slice(0, maxOutputLength) + '\n... (truncated)';
    }
  }

  return output;
}

/**
 * Check if output would be truncated with given config
 * @param output - The output string to check
 * @param config - Truncation configuration
 * @returns true if output would be truncated
 */
export function wouldTruncate(output: string, config: TruncationConfig = {}): boolean {
  const { maxOutputLength, maxLineCount } = {
    ...DEFAULT_CONFIG,
    ...config,
  };

  const lines = output.split('\n');
  return lines.length > maxLineCount || output.length > maxOutputLength;
}

/**
 * Get truncation statistics
 * @param output - The output string to analyze
 * @param config - Truncation configuration
 * @returns Statistics about the truncation
 */
export function getTruncationStats(
  output: string,
  config: TruncationConfig = {}
): {
  originalLength: number;
  originalLines: number;
  wouldTruncate: boolean;
  truncatedLength: number;
  truncatedLines: number;
} {
  const { maxOutputLength, maxLineCount } = {
    ...DEFAULT_CONFIG,
    ...config,
  };

  const lines = output.split('\n');
  const originalLength = output.length;
  const originalLines = lines.length;

  const truncated = truncateOutput(output, config);
  const truncatedLines = truncated.split('\n').length;

  return {
    originalLength,
    originalLines,
    wouldTruncate: wouldTruncate(output, config),
    truncatedLength: truncated.length,
    truncatedLines,
  };
}
