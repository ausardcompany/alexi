/**
 * Markdown Processing Utilities
 * Supports {file:path} syntax for including external files in markdown prompts
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { logger } from '../utils/logger.js';

/**
 * Regex to match {file:path} syntax in markdown
 */
const FILE_INCLUDE_REGEX = /\{file:([^}]+)\}/g;

/**
 * Resolves file includes in markdown content
 * Supports {file:path/to/file.md} syntax for including external files
 *
 * @param content - Markdown content with potential file includes
 * @param basePath - Base path for resolving relative file paths
 * @returns Processed content with file includes resolved
 */
export async function processMarkdownPrompt(
  content: string,
  basePath: string = process.cwd()
): Promise<string> {
  const matches = content.matchAll(FILE_INCLUDE_REGEX);
  let result = content;

  for (const match of matches) {
    const [fullMatch, filePath] = match;
    const resolvedPath = path.resolve(basePath, filePath.trim());

    try {
      const fileContent = await fs.readFile(resolvedPath, 'utf-8');
      result = result.replace(fullMatch, fileContent);
    } catch (error) {
      logger.warn(`Failed to include file: ${resolvedPath}`, error);
      // Keep the original placeholder if file cannot be read
    }
  }

  return result;
}

/**
 * Synchronous version for contexts where async is not available
 */
export function processMarkdownPromptSync(
  content: string,
  basePath: string = process.cwd()
): string {
  const fsSync = require('fs');
  const matches = content.matchAll(FILE_INCLUDE_REGEX);
  let result = content;

  for (const match of matches) {
    const [fullMatch, filePath] = match;
    const resolvedPath = path.resolve(basePath, filePath.trim());

    try {
      const fileContent = fsSync.readFileSync(resolvedPath, 'utf-8');
      result = result.replace(fullMatch, fileContent);
    } catch (error) {
      logger.warn(`Failed to include file: ${resolvedPath}`, error);
      // Keep the original placeholder if file cannot be read
    }
  }

  return result;
}
