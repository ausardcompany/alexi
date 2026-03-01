/**
 * Command Alias System
 * Allows users to define custom command shortcuts
 */

import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

// ============ Type Definitions ============

export interface CommandAlias {
  /** Short alias name (e.g., 'gpt4') */
  name: string;
  /** Full command to execute (e.g., '/model gpt-4o') */
  command: string;
  /** Description of what this alias does */
  description?: string;
  /** When the alias was created */
  created: number;
}

export interface AliasManagerOptions {
  /** Data directory */
  dataDir?: string;
}

// ============ Default Aliases ============

export const DEFAULT_ALIASES: Omit<CommandAlias, 'created'>[] = [
  { name: 'gpt4', command: '/model gpt-4o', description: 'Switch to GPT-4o' },
  { name: 'gpt4m', command: '/model gpt-4o-mini', description: 'Switch to GPT-4o Mini' },
  {
    name: 'claude',
    command: '/model anthropic--claude-4.5-sonnet',
    description: 'Switch to Claude 4.5 Sonnet',
  },
  {
    name: 'opus',
    command: '/model anthropic--claude-4.5-opus',
    description: 'Switch to Claude 4.5 Opus',
  },
  {
    name: 'haiku',
    command: '/model anthropic--claude-4.5-haiku',
    description: 'Switch to Claude 4.5 Haiku',
  },
  { name: 'new', command: '/session new', description: 'Start a new session' },
  { name: 'clr', command: '/clear', description: 'Clear screen' },
  { name: 'ctx', command: '/context', description: 'Show context usage' },
  { name: 'st', command: '/status', description: 'Show status' },
  { name: 'h', command: '/history', description: 'Show history' },
];

// ============ Alias Manager Class ============

export class AliasManager {
  private dataDir: string;
  private aliasFilePath: string;
  private aliases: Map<string, CommandAlias> = new Map();

  constructor(options: AliasManagerOptions = {}) {
    this.dataDir = options.dataDir || path.join(os.homedir(), '.alexi');
    this.aliasFilePath = path.join(this.dataDir, 'aliases.json');
    this.loadAliases();
  }

  /**
   * Set or update an alias
   */
  set(name: string, command: string, description?: string): CommandAlias {
    // Validate alias name
    if (!this.isValidAliasName(name)) {
      throw new Error(`Invalid alias name: ${name}. Must be alphanumeric with no spaces.`);
    }

    // Ensure command starts with /
    const normalizedCommand = command.startsWith('/') ? command : `/${command}`;

    const alias: CommandAlias = {
      name: name.toLowerCase(),
      command: normalizedCommand,
      description,
      created: this.aliases.get(name.toLowerCase())?.created || Date.now(),
    };

    this.aliases.set(alias.name, alias);
    this.saveAliases();
    return alias;
  }

  /**
   * Get an alias by name
   */
  get(name: string): CommandAlias | undefined {
    return this.aliases.get(name.toLowerCase());
  }

  /**
   * Delete an alias
   */
  delete(name: string): boolean {
    const existed = this.aliases.has(name.toLowerCase());
    if (existed) {
      this.aliases.delete(name.toLowerCase());
      this.saveAliases();
    }
    return existed;
  }

  /**
   * List all aliases
   */
  list(): CommandAlias[] {
    return Array.from(this.aliases.values()).sort((a, b) => a.name.localeCompare(b.name));
  }

  /**
   * Resolve an alias to its command
   * Returns the original input if not an alias
   */
  resolve(input: string): string {
    // Check if input is a slash command
    if (!input.startsWith('/')) {
      return input;
    }

    const parts = input.slice(1).split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1).join(' ');

    const alias = this.aliases.get(cmd);
    if (alias) {
      // Append any additional arguments
      return args ? `${alias.command} ${args}` : alias.command;
    }

    return input;
  }

  /**
   * Check if a name is a valid alias name
   */
  isValidAliasName(name: string): boolean {
    return /^[a-zA-Z0-9_-]+$/.test(name) && name.length <= 20;
  }

  /**
   * Reset to default aliases
   */
  resetToDefaults(): void {
    this.aliases.clear();
    for (const alias of DEFAULT_ALIASES) {
      this.aliases.set(alias.name, { ...alias, created: Date.now() });
    }
    this.saveAliases();
  }

  /**
   * Export aliases to JSON
   */
  exportToJson(): string {
    return JSON.stringify(
      {
        version: 1,
        aliases: Array.from(this.aliases.values()),
      },
      null,
      2
    );
  }

  /**
   * Import aliases from JSON
   */
  importFromJson(json: string): number {
    try {
      const data = JSON.parse(json);
      const aliases = Array.isArray(data) ? data : data.aliases || [];

      let imported = 0;
      for (const alias of aliases) {
        if (alias.name && alias.command) {
          this.set(alias.name, alias.command, alias.description);
          imported++;
        }
      }
      return imported;
    } catch {
      return 0;
    }
  }

  /**
   * Load aliases from disk
   */
  private loadAliases(): void {
    try {
      if (fs.existsSync(this.aliasFilePath)) {
        const data = fs.readFileSync(this.aliasFilePath, 'utf-8');
        const parsed = JSON.parse(data);
        const entries: CommandAlias[] = parsed.aliases || parsed || [];

        this.aliases.clear();
        for (const entry of entries) {
          if (entry.name && entry.command) {
            this.aliases.set(entry.name.toLowerCase(), entry);
          }
        }
      } else {
        // Initialize with defaults
        this.resetToDefaults();
      }
    } catch {
      this.resetToDefaults();
    }
  }

  /**
   * Save aliases to disk
   */
  private saveAliases(): void {
    try {
      if (!fs.existsSync(this.dataDir)) {
        fs.mkdirSync(this.dataDir, { recursive: true });
      }

      const data = {
        version: 1,
        updated: Date.now(),
        aliases: Array.from(this.aliases.values()),
      };

      fs.writeFileSync(this.aliasFilePath, JSON.stringify(data, null, 2));
    } catch {
      // Silently fail on save errors
    }
  }
}

// ============ Singleton Instance ============

let aliasManagerInstance: AliasManager | null = null;

export function getAliasManager(dataDir?: string): AliasManager {
  if (!aliasManagerInstance) {
    aliasManagerInstance = new AliasManager({ dataDir });
  }
  return aliasManagerInstance;
}

export function resetAliasManager(): void {
  aliasManagerInstance = null;
}
