/**
 * Custom Commands System
 * Defines reusable command templates with variable expansion
 * Based on kilocode/opencode custom commands pattern
 */

import { z } from 'zod';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import os from 'os';
import matter from 'gray-matter';

// ============ Schema Definitions ============

export const CommandArgumentSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  required: z.boolean().optional().default(false),
  default: z.string().optional(),
});

export type CommandArgument = z.infer<typeof CommandArgumentSchema>;

export const CommandSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  arguments: z.array(CommandArgumentSchema).optional(),
  template: z.string(),
  source: z.string().optional(), // file path if loaded from file
});

export type Command = z.infer<typeof CommandSchema>;

// ============ Error Classes ============

export class CommandError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'CommandError';
  }
}

export class MissingArgumentError extends CommandError {
  constructor(commandName: string, argumentName: string) {
    super(
      `Missing required argument '${argumentName}' for command '${commandName}'`,
      'MISSING_ARGUMENT',
      { commandName, argumentName }
    );
  }
}

export class FileNotFoundError extends CommandError {
  constructor(filePath: string) {
    super(`File not found: ${filePath}`, 'FILE_NOT_FOUND', { filePath });
  }
}

export class ShellExecutionError extends CommandError {
  constructor(command: string, error: string) {
    super(`Shell command failed: ${error}`, 'SHELL_EXECUTION_ERROR', { command, error });
  }
}

// ============ Template Variable Processor ============

interface TemplateContext {
  args: string[];
  workdir: string;
}

/**
 * Process template variables and expand them
 */
async function processTemplate(template: string, context: TemplateContext): Promise<string> {
  let result = template;

  // Process $ARGUMENTS - all arguments as a string
  result = result.replace(/\$ARGUMENTS/g, context.args.join(' '));

  // Process $PWD - current working directory
  result = result.replace(/\$PWD/g, context.workdir);

  // Process $DATE - current date
  result = result.replace(/\$DATE/g, new Date().toISOString().split('T')[0]);

  // Process positional arguments $1, $2, etc.
  result = result.replace(/\$(\d+)/g, (match, index) => {
    const argIndex = parseInt(index, 10) - 1;
    return context.args[argIndex] ?? '';
  });

  // Process file references @file or @$1
  // First, expand @$N patterns to @filepath
  result = result.replace(/@\$(\d+)/g, (match, index) => {
    const argIndex = parseInt(index, 10) - 1;
    const filePath = context.args[argIndex];
    if (!filePath) return '';
    return `@${filePath}`;
  });

  // Then, expand @filepath to file contents
  const fileRefPattern = /@([^\s]+)/g;
  const fileMatches = [...result.matchAll(fileRefPattern)];

  for (const match of fileMatches) {
    const [fullMatch, filePath] = match;
    // Skip if it looks like an email or already processed
    if (filePath.includes('@') || filePath.startsWith('$')) continue;

    const resolvedPath = path.isAbsolute(filePath)
      ? filePath
      : path.resolve(context.workdir, filePath);

    try {
      if (fs.existsSync(resolvedPath)) {
        const content = fs.readFileSync(resolvedPath, 'utf-8');
        const extension = path.extname(resolvedPath).slice(1) || 'txt';
        const fileName = path.basename(resolvedPath);

        // Wrap in code block with file info
        const replacement = `\`\`\`${extension}\n// File: ${fileName}\n${content}\n\`\`\``;
        result = result.replace(fullMatch, replacement);
      } else {
        // Leave a note that file was not found
        result = result.replace(fullMatch, `[File not found: ${filePath}]`);
      }
    } catch {
      result = result.replace(fullMatch, `[Error reading file: ${filePath}]`);
    }
  }

  // Process shell injection !`command`
  const shellPattern = /!`([^`]+)`/g;
  const shellMatches = [...result.matchAll(shellPattern)];

  for (const match of shellMatches) {
    const [fullMatch, command] = match;
    try {
      const output = execSync(command, {
        cwd: context.workdir,
        encoding: 'utf-8',
        timeout: 30000, // 30 second timeout
        maxBuffer: 1024 * 1024, // 1MB max output
      }).trim();
      result = result.replace(fullMatch, output);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      result = result.replace(fullMatch, `[Shell command failed: ${errorMessage}]`);
    }
  }

  return result;
}

/**
 * Validate arguments against command definition
 */
function validateArguments(command: Command, args: string[]): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!command.arguments || command.arguments.length === 0) {
    return { valid: true, errors: [] };
  }

  for (let i = 0; i < command.arguments.length; i++) {
    const argDef = command.arguments[i];
    const argValue = args[i];

    if (argDef.required && !argValue && !argDef.default) {
      errors.push(`Missing required argument '${argDef.name}' (position ${i + 1})`);
    }
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Apply default values to arguments
 */
function applyDefaults(command: Command, args: string[]): string[] {
  if (!command.arguments) return args;

  const result = [...args];

  for (let i = 0; i < command.arguments.length; i++) {
    const argDef = command.arguments[i];
    if (!result[i] && argDef.default) {
      result[i] = argDef.default;
    }
  }

  return result;
}

// ============ Command Loader ============

/**
 * Load command from markdown file with frontmatter
 */
export function loadCommandFromFile(filePath: string): Command | null {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const { data, content: templateContent } = matter(content);

    // Parse and validate arguments if present
    let parsedArguments: CommandArgument[] | undefined;
    if (data.arguments && Array.isArray(data.arguments)) {
      parsedArguments = data.arguments.map((arg: unknown) => {
        if (typeof arg === 'string') {
          return { name: arg, required: false };
        }
        return CommandArgumentSchema.parse(arg);
      });
    }

    const command: Command = {
      name: data.name || path.basename(filePath, path.extname(filePath)),
      description: data.description,
      arguments: parsedArguments,
      template: templateContent.trim(),
      source: filePath,
    };

    // Validate the command schema
    return CommandSchema.parse(command);
  } catch (error) {
    console.warn(`Failed to load command from ${filePath}:`, error);
    return null;
  }
}

/**
 * Load all commands from a directory
 */
export function loadCommandsFromDirectory(dirPath: string): Command[] {
  const commands: Command[] = [];

  if (!fs.existsSync(dirPath)) {
    return commands;
  }

  try {
    const files = fs.readdirSync(dirPath);

    for (const file of files) {
      if (file.endsWith('.md')) {
        const command = loadCommandFromFile(path.join(dirPath, file));
        if (command) {
          commands.push(command);
        }
      }
    }
  } catch (error) {
    console.warn(`Failed to read command directory ${dirPath}:`, error);
  }

  return commands;
}

// ============ Helper Function ============

/**
 * Define a command programmatically
 */
export function defineCommand(definition: {
  name: string;
  description?: string;
  arguments?: Array<{
    name: string;
    description?: string;
    required?: boolean;
    default?: string;
  }>;
  template: string;
}): Command {
  return CommandSchema.parse({
    ...definition,
    source: undefined,
  });
}

// ============ Command Registry ============

/**
 * Command Registry - manages all available commands
 */
export class CommandRegistry {
  private commands: Map<string, Command> = new Map();
  private workdir: string;

  constructor(workdir?: string) {
    this.workdir = workdir || process.cwd();
  }

  /**
   * Set working directory for command execution
   */
  setWorkdir(workdir: string): void {
    this.workdir = workdir;
  }

  /**
   * Get current working directory
   */
  getWorkdir(): string {
    return this.workdir;
  }

  /**
   * Register a command
   */
  register(command: Command): void {
    // Validate command
    const validated = CommandSchema.parse(command);
    this.commands.set(validated.name, validated);
  }

  /**
   * Unregister a command
   */
  unregister(name: string): boolean {
    return this.commands.delete(name);
  }

  /**
   * Get command by name
   */
  get(name: string): Command | undefined {
    return this.commands.get(name);
  }

  /**
   * Check if command exists
   */
  has(name: string): boolean {
    return this.commands.has(name);
  }

  /**
   * List all commands
   */
  list(): Command[] {
    return Array.from(this.commands.values());
  }

  /**
   * Search commands by name or description
   */
  search(query: string): Command[] {
    const q = query.toLowerCase();
    return this.list().filter(
      (cmd) => cmd.name.toLowerCase().includes(q) || cmd.description?.toLowerCase().includes(q)
    );
  }

  /**
   * Execute command with arguments
   */
  async execute(name: string, args: string[]): Promise<string> {
    const command = this.get(name);
    if (!command) {
      throw new CommandError(`Command not found: ${name}`, 'COMMAND_NOT_FOUND', { name });
    }

    // Validate arguments
    const validation = validateArguments(command, args);
    if (!validation.valid) {
      throw new CommandError(
        `Invalid arguments: ${validation.errors.join(', ')}`,
        'INVALID_ARGUMENTS',
        { command: name, errors: validation.errors }
      );
    }

    // Apply defaults
    const finalArgs = applyDefaults(command, args);

    // Process template
    const result = await processTemplate(command.template, {
      args: finalArgs,
      workdir: this.workdir,
    });

    return result;
  }

  /**
   * Load commands from a directory
   * Returns the number of commands loaded
   */
  async loadFromDirectory(dir: string): Promise<number> {
    const commands = loadCommandsFromDirectory(dir);
    let count = 0;

    for (const command of commands) {
      this.register(command);
      count++;
    }

    return count;
  }

  /**
   * Load commands from all default locations
   * - Global: ~/.alexi/commands/
   * - Project: .alexi/commands/
   */
  async loadFromDefaultLocations(): Promise<{ global: number; project: number }> {
    const globalDir = path.join(os.homedir(), '.alexi', 'commands');
    const projectDir = path.join(this.workdir, '.alexi', 'commands');

    const globalCount = await this.loadFromDirectory(globalDir);
    const projectCount = await this.loadFromDirectory(projectDir);

    return { global: globalCount, project: projectCount };
  }

  /**
   * Clear all commands
   */
  clear(): void {
    this.commands.clear();
  }

  /**
   * Get command usage/help string
   */
  getUsage(name: string): string | null {
    const command = this.get(name);
    if (!command) return null;

    const lines: string[] = [];
    lines.push(`Command: ${command.name}`);

    if (command.description) {
      lines.push(`Description: ${command.description}`);
    }

    if (command.arguments && command.arguments.length > 0) {
      lines.push('');
      lines.push('Arguments:');
      for (const arg of command.arguments) {
        const required = arg.required ? ' (required)' : '';
        const defaultVal = arg.default ? ` [default: ${arg.default}]` : '';
        const desc = arg.description ? ` - ${arg.description}` : '';
        lines.push(`  ${arg.name}${required}${defaultVal}${desc}`);
      }
    }

    if (command.source) {
      lines.push('');
      lines.push(`Source: ${command.source}`);
    }

    return lines.join('\n');
  }
}

// ============ Global Registry ============

let globalRegistry: CommandRegistry | null = null;

/**
 * Get the global command registry
 */
export function getCommandRegistry(): CommandRegistry {
  if (!globalRegistry) {
    globalRegistry = new CommandRegistry();
  }
  return globalRegistry;
}

/**
 * Register a command in the global registry
 */
export function registerCommand(command: Command): void {
  getCommandRegistry().register(command);
}

/**
 * Get a command from the global registry
 */
export function getCommand(name: string): Command | undefined {
  return getCommandRegistry().get(name);
}

/**
 * List all commands from the global registry
 */
export function listCommands(): Command[] {
  return getCommandRegistry().list();
}

/**
 * Execute a command from the global registry
 */
export async function executeCommand(name: string, args: string[]): Promise<string> {
  return getCommandRegistry().execute(name, args);
}

// ============ Built-in Commands ============

/**
 * Register built-in commands
 */
export function registerBuiltInCommands(): void {
  const registry = getCommandRegistry();

  // Review command
  registry.register(
    defineCommand({
      name: 'review',
      description: 'Review code for issues',
      arguments: [{ name: 'file', description: 'File to review', required: true }],
      template: `Review the following code for issues:

@$1

Focus on:
- Security vulnerabilities
- Performance issues
- Best practices
- Code style and readability
- Potential bugs`,
    })
  );

  // Explain command
  registry.register(
    defineCommand({
      name: 'explain',
      description: 'Explain code or concept',
      arguments: [{ name: 'target', description: 'File or concept to explain', required: true }],
      template: `Please explain the following in detail:

@$1

Include:
- Overall purpose and functionality
- Key components and their roles
- How different parts interact
- Any notable patterns or techniques used`,
    })
  );

  // Refactor command
  registry.register(
    defineCommand({
      name: 'refactor',
      description: 'Suggest refactoring improvements',
      arguments: [
        { name: 'file', description: 'File to refactor', required: true },
        {
          name: 'goal',
          description: 'Refactoring goal',
          required: false,
          default: 'improve code quality',
        },
      ],
      template: `Please suggest refactoring improvements for the following code.

Goal: $2

@$1

Provide:
- Specific refactoring suggestions
- Rationale for each change
- Expected benefits
- Potential risks or trade-offs`,
    })
  );

  // Test command
  registry.register(
    defineCommand({
      name: 'test',
      description: 'Generate tests for code',
      arguments: [{ name: 'file', description: 'File to generate tests for', required: true }],
      template: `Generate comprehensive tests for the following code:

@$1

Include:
- Unit tests for individual functions
- Edge cases and error scenarios
- Mocking dependencies where appropriate
- Clear test descriptions`,
    })
  );

  // Document command
  registry.register(
    defineCommand({
      name: 'document',
      description: 'Generate documentation',
      arguments: [{ name: 'file', description: 'File to document', required: true }],
      template: `Generate documentation for the following code:

@$1

Include:
- Module/file overview
- Function/method documentation with parameters and return values
- Usage examples
- Any important notes or caveats`,
    })
  );

  // Git-status command with shell injection
  registry.register(
    defineCommand({
      name: 'git-status',
      description: 'Analyze current git status',
      arguments: [],
      template: `Analyze the current git status and provide recommendations:

Current branch and status:
\`\`\`
!\`git status\`
\`\`\`

Recent commits:
\`\`\`
!\`git log --oneline -5\`
\`\`\`

Please provide:
- Summary of current state
- Any uncommitted changes that need attention
- Recommendations for next steps`,
    })
  );

  // Diff-review command
  registry.register(
    defineCommand({
      name: 'diff-review',
      description: 'Review staged changes',
      arguments: [],
      template: `Review the staged changes and provide feedback:

\`\`\`diff
!\`git diff --cached\`
\`\`\`

Please review for:
- Correctness and completeness
- Potential issues or bugs
- Code style consistency
- Suggestions for improvement
- Whether this is ready to commit`,
    })
  );

  // Context command
  registry.register(
    defineCommand({
      name: 'context',
      description: 'Provide project context',
      arguments: [],
      template: `Here is the current project context:

Working Directory: $PWD
Date: $DATE

Directory Structure:
\`\`\`
!\`ls -la\`
\`\`\`

Package info (if exists):
\`\`\`json
!\`cat package.json 2>/dev/null || echo "No package.json found"\`
\`\`\``,
    })
  );
}

// Types are already exported above via class and type declarations
