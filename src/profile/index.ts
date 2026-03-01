/**
 * Profile Management System
 * Manages configuration profiles for Alexi CLI
 * Allows switching between different environments (dev, staging, prod, etc.)
 */

import fs from 'fs';
import path from 'path';
import os from 'os';
import dotenv from 'dotenv';

// ============ Type Definitions ============

export interface Profile {
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  environment: Record<string, string>; // env vars to set
}

export interface ProfileConfig {
  activeProfile?: string;
  profiles: Profile[];
}

// ============ Constants ============

/**
 * Relevant env vars to capture in profiles
 */
export const PROFILE_ENV_VARS = [
  'AICORE_SERVICE_KEY',
  'AICORE_DEPLOYMENT_ID',
  'AICORE_RESOURCE_GROUP',
  'AICORE_MODEL',
  'USE_SAP_ORCHESTRATION',
  'SAP_PROXY_BASE_URL',
  'SAP_PROXY_API_KEY',
  'SAP_PROXY_MODEL',
  'DEFAULT_MODEL',
] as const;

/**
 * Keywords that indicate a secret value
 */
const SECRET_KEYWORDS = ['SECRET', 'KEY', 'PASSWORD', 'TOKEN'];

/**
 * Config directory and file paths
 */
const CONFIG_DIR = path.join(os.homedir(), '.alexi');
const PROFILES_FILE = path.join(CONFIG_DIR, 'profiles.json');

// ============ Helper Functions ============

/**
 * Check if an env var name contains secret keywords
 */
function isSecretVar(varName: string): boolean {
  const upperName = varName.toUpperCase();
  return SECRET_KEYWORDS.some((keyword) => upperName.includes(keyword));
}

/**
 * Mask a secret value, showing first 4 and last 4 chars
 */
function maskSecret(value: string): string {
  if (!value || value.length <= 12) {
    return '****';
  }
  const first = value.slice(0, 4);
  const last = value.slice(-4);
  return `${first}...${last}`;
}

/**
 * Ensure the config directory exists
 */
function ensureConfigDir(): void {
  if (!fs.existsSync(CONFIG_DIR)) {
    fs.mkdirSync(CONFIG_DIR, { recursive: true });
  }
}

/**
 * Load profile config from disk
 */
function loadProfileConfig(): ProfileConfig {
  ensureConfigDir();

  if (!fs.existsSync(PROFILES_FILE)) {
    return { profiles: [] };
  }

  try {
    const content = fs.readFileSync(PROFILES_FILE, 'utf-8');
    const config = JSON.parse(content) as ProfileConfig;

    // Validate structure
    if (!Array.isArray(config.profiles)) {
      config.profiles = [];
    }

    return config;
  } catch (error) {
    // Return empty config on parse error
    console.error(
      `Warning: Could not parse profiles.json: ${error instanceof Error ? error.message : String(error)}`
    );
    return { profiles: [] };
  }
}

/**
 * Save profile config to disk
 */
function saveProfileConfig(config: ProfileConfig): void {
  ensureConfigDir();
  fs.writeFileSync(PROFILES_FILE, JSON.stringify(config, null, 2), 'utf-8');
}

/**
 * Parse a .env file and return key-value pairs
 */
function parseEnvFile(filePath: string): Record<string, string> {
  const absolutePath = path.resolve(filePath);

  if (!fs.existsSync(absolutePath)) {
    throw new Error(`Env file not found: ${absolutePath}`);
  }

  const content = fs.readFileSync(absolutePath, 'utf-8');
  const parsed = dotenv.parse(content);

  return parsed;
}

/**
 * Get current timestamp in ISO format
 */
function now(): string {
  return new Date().toISOString();
}

/**
 * Capture relevant env vars from current process.env
 */
function captureCurrentEnv(): Record<string, string> {
  const env: Record<string, string> = {};

  for (const varName of PROFILE_ENV_VARS) {
    const value = process.env[varName];
    if (value !== undefined && value.trim() !== '') {
      env[varName] = value;
    }
  }

  return env;
}

/**
 * Filter env vars to only include profile-relevant vars
 */
function filterProfileEnvVars(env: Record<string, string>): Record<string, string> {
  const filtered: Record<string, string> = {};

  for (const [key, value] of Object.entries(env)) {
    if (PROFILE_ENV_VARS.includes(key as (typeof PROFILE_ENV_VARS)[number])) {
      filtered[key] = value;
    }
  }

  return filtered;
}

// ============ ProfileManager Class ============

export class ProfileManager {
  private config: ProfileConfig;

  constructor() {
    this.config = loadProfileConfig();
  }

  /**
   * Reload config from disk
   */
  reload(): void {
    this.config = loadProfileConfig();
  }

  /**
   * List all profiles
   */
  list(): Profile[] {
    return [...this.config.profiles];
  }

  /**
   * Get profile by name
   */
  get(name: string): Profile | undefined {
    return this.config.profiles.find((p) => p.name === name);
  }

  /**
   * Get currently active profile
   */
  getActive(): Profile | undefined {
    if (!this.config.activeProfile) {
      return undefined;
    }
    return this.get(this.config.activeProfile);
  }

  /**
   * Get active profile name
   */
  getActiveProfileName(): string | undefined {
    return this.config.activeProfile;
  }

  /**
   * Create a new profile from current env vars
   */
  create(name: string, description?: string): Profile {
    // Validate name
    if (!name || name.trim() === '') {
      throw new Error('Profile name cannot be empty');
    }

    const trimmedName = name.trim();

    // Check for duplicates
    if (this.get(trimmedName)) {
      throw new Error(`Profile "${trimmedName}" already exists`);
    }

    // Validate name format (alphanumeric, dashes, underscores)
    if (!/^[a-zA-Z0-9_-]+$/.test(trimmedName)) {
      throw new Error('Profile name can only contain letters, numbers, dashes, and underscores');
    }

    const timestamp = now();
    const environment = captureCurrentEnv();

    const profile: Profile = {
      name: trimmedName,
      description: description?.trim(),
      createdAt: timestamp,
      updatedAt: timestamp,
      environment,
    };

    this.config.profiles.push(profile);
    saveProfileConfig(this.config);

    return profile;
  }

  /**
   * Create a new profile from a .env file
   */
  createFromEnvFile(name: string, envFilePath: string, description?: string): Profile {
    // Validate name
    if (!name || name.trim() === '') {
      throw new Error('Profile name cannot be empty');
    }

    const trimmedName = name.trim();

    // Check for duplicates
    if (this.get(trimmedName)) {
      throw new Error(`Profile "${trimmedName}" already exists`);
    }

    // Validate name format
    if (!/^[a-zA-Z0-9_-]+$/.test(trimmedName)) {
      throw new Error('Profile name can only contain letters, numbers, dashes, and underscores');
    }

    // Parse env file
    const allEnvVars = parseEnvFile(envFilePath);
    const environment = filterProfileEnvVars(allEnvVars);

    const timestamp = now();

    const profile: Profile = {
      name: trimmedName,
      description: description?.trim(),
      createdAt: timestamp,
      updatedAt: timestamp,
      environment,
    };

    this.config.profiles.push(profile);
    saveProfileConfig(this.config);

    return profile;
  }

  /**
   * Switch to a profile and load its env vars into process.env
   */
  switch(name: string): void {
    const profile = this.get(name);

    if (!profile) {
      throw new Error(`Profile "${name}" not found`);
    }

    // Set env vars from profile
    for (const [key, value] of Object.entries(profile.environment)) {
      process.env[key] = value;
    }

    // Update active profile
    this.config.activeProfile = name;
    saveProfileConfig(this.config);
  }

  /**
   * Delete a profile
   */
  delete(name: string): boolean {
    const index = this.config.profiles.findIndex((p) => p.name === name);

    if (index === -1) {
      return false;
    }

    this.config.profiles.splice(index, 1);

    // Clear active profile if deleted
    if (this.config.activeProfile === name) {
      this.config.activeProfile = undefined;
    }

    saveProfileConfig(this.config);
    return true;
  }

  /**
   * Export a profile to a .env file
   */
  exportToEnvFile(name: string, outputPath: string): void {
    const profile = this.get(name);

    if (!profile) {
      throw new Error(`Profile "${name}" not found`);
    }

    const lines: string[] = [`# Profile: ${profile.name}`, `# Exported: ${now()}`];

    if (profile.description) {
      lines.push(`# Description: ${profile.description}`);
    }

    lines.push('');

    // Add env vars
    for (const [key, value] of Object.entries(profile.environment)) {
      // Quote values that contain special characters
      const needsQuotes = value.includes(' ') || value.includes('#') || value.includes('\n');
      const formattedValue = needsQuotes ? `"${value.replace(/"/g, '\\"')}"` : value;
      lines.push(`${key}=${formattedValue}`);
    }

    lines.push('');

    const absolutePath = path.resolve(outputPath);
    fs.writeFileSync(absolutePath, lines.join('\n'), 'utf-8');
  }

  /**
   * Update a profile's description and/or environment
   */
  update(name: string, updates: Partial<Pick<Profile, 'description' | 'environment'>>): Profile {
    const profile = this.get(name);

    if (!profile) {
      throw new Error(`Profile "${name}" not found`);
    }

    // Update fields
    if (updates.description !== undefined) {
      profile.description = updates.description?.trim();
    }

    if (updates.environment !== undefined) {
      // Merge or replace environment
      profile.environment = filterProfileEnvVars(updates.environment);
    }

    profile.updatedAt = now();

    saveProfileConfig(this.config);
    return profile;
  }

  /**
   * Show env vars with secrets masked
   */
  showMasked(name: string): Record<string, string> {
    const profile = this.get(name);

    if (!profile) {
      throw new Error(`Profile "${name}" not found`);
    }

    const masked: Record<string, string> = {};

    for (const [key, value] of Object.entries(profile.environment)) {
      masked[key] = isSecretVar(key) ? maskSecret(value) : value;
    }

    return masked;
  }

  /**
   * Rename a profile
   */
  rename(oldName: string, newName: string): Profile {
    const profile = this.get(oldName);

    if (!profile) {
      throw new Error(`Profile "${oldName}" not found`);
    }

    const trimmedNewName = newName.trim();

    // Check for duplicates
    if (this.get(trimmedNewName)) {
      throw new Error(`Profile "${trimmedNewName}" already exists`);
    }

    // Validate name format
    if (!/^[a-zA-Z0-9_-]+$/.test(trimmedNewName)) {
      throw new Error('Profile name can only contain letters, numbers, dashes, and underscores');
    }

    profile.name = trimmedNewName;
    profile.updatedAt = now();

    // Update active profile reference if needed
    if (this.config.activeProfile === oldName) {
      this.config.activeProfile = trimmedNewName;
    }

    saveProfileConfig(this.config);
    return profile;
  }

  /**
   * Clone a profile
   */
  clone(sourceName: string, newName: string, description?: string): Profile {
    const source = this.get(sourceName);

    if (!source) {
      throw new Error(`Profile "${sourceName}" not found`);
    }

    const trimmedNewName = newName.trim();

    // Check for duplicates
    if (this.get(trimmedNewName)) {
      throw new Error(`Profile "${trimmedNewName}" already exists`);
    }

    // Validate name format
    if (!/^[a-zA-Z0-9_-]+$/.test(trimmedNewName)) {
      throw new Error('Profile name can only contain letters, numbers, dashes, and underscores');
    }

    const timestamp = now();

    const profile: Profile = {
      name: trimmedNewName,
      description: description?.trim() ?? source.description,
      createdAt: timestamp,
      updatedAt: timestamp,
      environment: { ...source.environment },
    };

    this.config.profiles.push(profile);
    saveProfileConfig(this.config);

    return profile;
  }

  /**
   * Clear the active profile (deactivate)
   */
  clearActive(): void {
    this.config.activeProfile = undefined;
    saveProfileConfig(this.config);
  }

  /**
   * Check if a profile exists
   */
  exists(name: string): boolean {
    return this.config.profiles.some((p) => p.name === name);
  }

  /**
   * Get profile count
   */
  count(): number {
    return this.config.profiles.length;
  }
}

// ============ Singleton ============

let profileManagerInstance: ProfileManager | null = null;

/**
 * Get the singleton ProfileManager instance
 */
export function getProfileManager(): ProfileManager {
  if (!profileManagerInstance) {
    profileManagerInstance = new ProfileManager();
  }
  return profileManagerInstance;
}

/**
 * Reset the ProfileManager singleton (mainly for testing)
 */
export function resetProfileManager(): void {
  profileManagerInstance = null;
}

// ============ Auto-load on Startup ============

/**
 * Load active profile and set env vars
 * Call this early in CLI startup
 */
export function loadActiveProfile(): void {
  try {
    const manager = getProfileManager();
    const active = manager.getActive();

    if (active) {
      // Set env vars from active profile
      for (const [key, value] of Object.entries(active.environment)) {
        // Only set if not already defined (allow explicit overrides)
        if (process.env[key] === undefined) {
          process.env[key] = value;
        }
      }
    }
  } catch (error) {
    // Silently fail during startup - profile loading is optional
    console.error(
      `Warning: Could not load active profile: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

// ============ CLI Formatting Helpers ============

/**
 * Format a profile for CLI display
 */
export function formatProfileForCLI(profile: Profile, isActive: boolean = false): string {
  const lines: string[] = [];
  const marker = isActive ? ' (active)' : '';

  lines.push(`${profile.name}${marker}`);

  if (profile.description) {
    lines.push(`  Description: ${profile.description}`);
  }

  lines.push(`  Created: ${profile.createdAt}`);
  lines.push(`  Updated: ${profile.updatedAt}`);
  lines.push(`  Variables: ${Object.keys(profile.environment).length}`);

  return lines.join('\n');
}

/**
 * Format profile list for CLI display
 */
export function formatProfileListForCLI(profiles: Profile[], activeProfileName?: string): string {
  if (profiles.length === 0) {
    return 'No profiles found. Create one with: alexi profile create <name>';
  }

  const lines: string[] = [];
  lines.push(`Found ${profiles.length} profile(s):`);
  lines.push('');

  for (const profile of profiles) {
    const isActive = profile.name === activeProfileName;
    lines.push(formatProfileForCLI(profile, isActive));
    lines.push('');
  }

  return lines.join('\n').trim();
}

/**
 * Format masked env vars for CLI display
 */
export function formatMaskedEnvForCLI(envVars: Record<string, string>): string {
  const lines: string[] = [];

  for (const [key, value] of Object.entries(envVars)) {
    lines.push(`  ${key}=${value}`);
  }

  return lines.join('\n');
}

// ============ Exports ============

export { CONFIG_DIR, PROFILES_FILE, isSecretVar, maskSecret };
