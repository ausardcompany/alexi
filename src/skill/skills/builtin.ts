import { Skill } from '../index.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const kiloConfigPath = path.join(__dirname, 'kilo-config.md');
const kiloConfigContent = fs.readFileSync(kiloConfigPath, 'utf-8');

export namespace BuiltinSkills {
  /** IDs of built-in skills that cannot be removed */
  export const BUILTIN_IDS = new Set(['alexi-config', 'kilo-config']);

  /** Check if a skill ID is a built-in skill */
  export function isBuiltin(skillId: string): boolean {
    return BUILTIN_IDS.has(skillId);
  }

  /** Get all built-in skill definitions */
  export function getBuiltinSkills(): Skill[] {
    return [
      {
        id: 'alexi-config',
        name: 'Alexi Configuration Reference',
        description: 'Reference documentation for Alexi configuration options',
        prompt: kiloConfigContent,
        source: 'builtin',
      },
    ];
  }

  /** Reject removal of built-in skills */
  export function guardRemoval(skillId: string): void {
    if (isBuiltin(skillId)) {
      throw new Error(`Cannot remove built-in skill: ${skillId}`);
    }
  }
}
