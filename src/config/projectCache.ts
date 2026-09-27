/**
 * Project-Scoped Configuration Cache
 *
 * Addresses issue #1848: `userConfig`-derived getters previously cached
 * results globally (keyed by the config file path only). In multi-worktree
 * workflows (Agent Manager, parallel sessions), that leaked config across
 * projects — opening project A cached rules/routing, then switching to
 * project B kept serving A's cached values until CLI restart.
 *
 * This module wraps the raw config loaders (`discoverRules`,
 * `loadRoutingConfig`, `loadMcpConfig`, custom agent loader, skill
 * registry, hook manager) with a cache keyed by
 * `${configPath}:${normalizedWorkdir}` so each worktree has its own
 * snapshot. `onWorkdirChange` detects a workdir transition and purges
 * the previous project's caches to bound memory growth.
 *
 * Windows filesystem paths are case-insensitive; the normalizer
 * lowercases when `process.platform === 'win32'` so `/Tmp/Project`
 * and `/tmp/project` share a cache slot there but stay distinct on
 * Linux / macOS.
 */

import path from 'path';
import os from 'os';
import type { RulesDiscoveryResult } from './rulesDiscovery.js';
import { discoverRules } from './rulesDiscovery.js';
import type { RoutingConfig } from './routingConfig.js';
import { loadRoutingConfig } from './routingConfig.js';
import type { McpConfig } from '../mcp/config.js';
import { loadMcpConfig } from '../mcp/config.js';
import type { CustomAgentConfig } from '../agent/customAgentLoader.js';
import { loadAgentsFromDirectory } from '../agent/customAgentLoader.js';
import type { Skill } from '../skill/index.js';
import { skillDirectories, loadSkillsFromDirectory } from '../skill/index.js';
import type { HookDefinition } from '../hooks/index.js';
import { HookDefinitionSchema } from '../hooks/index.js';
import { z } from 'zod';
import fs from 'fs';

// ============ Workdir normalization ============

/**
 * Normalize a workdir for use as (part of) a cache key. Resolves `.`, `..`,
 * and trailing separators via `path.resolve` and lowercases on Windows
 * where filesystem paths are case-insensitive. Falls back to
 * `process.cwd()` when the caller passes `undefined`, so all cached
 * getters have a stable key even in headless contexts that have not
 * threaded a session workdir.
 */
export function normalizeWorkdirForCache(workdir?: string): string {
  const resolved = path.resolve(workdir ?? process.cwd());
  return process.platform === 'win32' ? resolved.toLowerCase() : resolved;
}

/**
 * Build a cache key from a logical config-file path and a workdir.
 * The `configPath` argument is a stable string tag; it does not need to
 * be a real file path (some caches — `rules`, `agents`, `skills`,
 * `hooks` — aggregate multiple sources).
 */
export function makeCacheKey(configPath: string, workdir?: string): string {
  return `${configPath}:${normalizeWorkdirForCache(workdir)}`;
}

// ============ Cache storage ============

/**
 * One flat map per config surface. Values are `unknown` at the storage
 * layer so a single `purgeCacheForWorkdir` helper can iterate every map
 * without generic gymnastics; typed getters below re-narrow on read.
 */
const rulesCache = new Map<string, RulesDiscoveryResult>();
const routingCache = new Map<string, RoutingConfig>();
const mcpCache = new Map<string, McpConfig>();
const agentsCache = new Map<string, CustomAgentConfig[]>();
const skillsCache = new Map<string, Skill[]>();
const hooksCache = new Map<string, HookDefinition[]>();

/**
 * Full list of caches maintained by this module. Exposed via
 * `_allProjectCaches` for the invalidation helpers below; kept as a
 * module-level constant so a new cache surface only requires appending
 * to this list.
 */
const ALL_CACHES: Array<Map<string, unknown>> = [
  rulesCache as unknown as Map<string, unknown>,
  routingCache as unknown as Map<string, unknown>,
  mcpCache as unknown as Map<string, unknown>,
  agentsCache as unknown as Map<string, unknown>,
  skillsCache as unknown as Map<string, unknown>,
  hooksCache as unknown as Map<string, unknown>,
];

/**
 * Tag constants for each cache surface. Used verbatim as the
 * `configPath` component of the cache key so `getConfigRoutingConfig`
 * and `getConfigMcpServers` cannot accidentally share a slot.
 */
const KEY_RULES = 'rules';
const KEY_ROUTING = 'routing';
const KEY_MCP = 'mcp-servers';
const KEY_AGENTS = 'agents';
const KEY_SKILLS = 'skills';
const KEY_HOOKS = 'hooks';

// ============ Workdir change detection ============

/**
 * Previous workdir observed by `onWorkdirChange`. `null` means no
 * workdir has been seen yet this process; the first call establishes
 * the baseline without purging anything.
 */
let previousWorkdir: string | null = null;

/**
 * Detect a workdir change and purge the OLD workdir's cache entries.
 * Call this from session-context boundaries (session creation, session
 * resume with a different `workdir`, or the top-level CLI entry when
 * `process.cwd()` moves).
 *
 * The NEW workdir's caches are left intact (an empty slot for the new
 * workdir is the desired starting state; entries are populated
 * on-demand by the getters below).
 *
 * Returns `true` when a purge happened (i.e. a workdir change was
 * detected), `false` otherwise (first-ever call, or same workdir).
 */
export function onWorkdirChange(newWorkdir: string): boolean {
  const normalized = normalizeWorkdirForCache(newWorkdir);
  if (previousWorkdir === null) {
    previousWorkdir = normalized;
    return false;
  }
  if (previousWorkdir === normalized) {
    return false;
  }
  const oldWorkdir = previousWorkdir;
  previousWorkdir = normalized;
  purgeCacheForWorkdir(oldWorkdir);
  return true;
}

/**
 * Test-only: reset the workdir tracker so a fresh test does not carry
 * state from a previous case. Not part of the stable public surface.
 * @internal
 */
export function _resetWorkdirTrackerForTests(): void {
  previousWorkdir = null;
}

// ============ Invalidation ============

/**
 * Purge every cache entry whose key ends with `:${normalized}`. Used by
 * `onWorkdirChange` on transition and by `invalidateProjectCache` when
 * a caller knows the on-disk config has changed under a specific
 * project root.
 */
function purgeCacheForWorkdir(normalizedWorkdir: string): void {
  const suffix = `:${normalizedWorkdir}`;
  for (const cache of ALL_CACHES) {
    for (const key of Array.from(cache.keys())) {
      if (key.endsWith(suffix)) {
        cache.delete(key);
      }
    }
  }
}

/**
 * Invalidate all cached config for a specific workdir. When
 * `workdir` is omitted, invalidates every cache entry regardless
 * of workdir (equivalent to `invalidateAllProjectCaches`).
 */
export function invalidateProjectCache(workdir?: string): void {
  if (workdir === undefined) {
    invalidateAllProjectCaches();
    return;
  }
  purgeCacheForWorkdir(normalizeWorkdirForCache(workdir));
}

/**
 * Flush every project-scoped cache. Called by
 * `invalidation.invalidateGlobalConfig` so a top-level config
 * rewrite (`updateGlobal`) invalidates project caches too.
 */
export function invalidateAllProjectCaches(): void {
  for (const cache of ALL_CACHES) {
    cache.clear();
  }
}

/**
 * Test/debug helper: return the total number of cached entries
 * across every surface. Useful in tests to assert that a purge
 * actually happened without inspecting each map individually.
 * @internal
 */
export function _projectCacheSize(): number {
  let total = 0;
  for (const cache of ALL_CACHES) {
    total += cache.size;
  }
  return total;
}

// ============ Cached getters ============

/**
 * Return the rules-discovery result for `workdir`, caching the outcome
 * so subsequent calls for the same worktree are O(1). Passing a
 * different `workdir` yields a fresh discovery pass and its own cache
 * entry, so worktrees never see each other's rules.
 */
export function getConfigRules(workdir?: string): RulesDiscoveryResult {
  const key = makeCacheKey(KEY_RULES, workdir);
  const cached = rulesCache.get(key);
  if (cached !== undefined) {
    return cached;
  }
  const result = discoverRules({
    workdir: workdir ?? process.cwd(),
    silent: true,
  });
  rulesCache.set(key, result);
  return result;
}

/**
 * Return the parsed `routing-config.json` for `workdir`. The raw
 * loader (`loadRoutingConfig`) still searches multiple default paths,
 * but the cache key is keyed on `workdir` so switching to a different
 * project reloads even when the underlying file paths are the same
 * shape (`<cwd>/routing-config.json`).
 */
export function getConfigRoutingConfig(workdir?: string): RoutingConfig {
  const key = makeCacheKey(KEY_ROUTING, workdir);
  const cached = routingCache.get(key);
  if (cached !== undefined) {
    return cached;
  }
  // `loadRoutingConfig` uses `process.cwd()` for its default search
  // paths; we temporarily swap the CWD when a caller provides an
  // explicit workdir so a subagent running in a different worktree
  // resolves that worktree's routing file, not the parent's.
  const config = withWorkdir(workdir, () => loadRoutingConfig());
  routingCache.set(key, config);
  return config;
}

/**
 * Return the parsed MCP server config. MCP servers live in the
 * user-global `~/.alexi/mcp-servers.json`, but we still key on
 * `workdir` because a project may override the MCP allowlist via
 * `.alexi/mcp-servers.json` in the future (kilocode #14557 leaves the
 * door open) and callers should not have to remember which caches are
 * project-scoped vs global. Keying every getter on workdir keeps the
 * API uniform.
 */
export function getConfigMcpServers(workdir?: string): McpConfig {
  const key = makeCacheKey(KEY_MCP, workdir);
  const cached = mcpCache.get(key);
  if (cached !== undefined) {
    return cached;
  }
  const config = withWorkdir(workdir, () => loadMcpConfig());
  mcpCache.set(key, config);
  return config;
}

/**
 * Return the effective set of custom agents for `workdir`, merging
 * user-global (`~/.alexi/agents/`) and project-local
 * (`<workdir>/.alexi/agents/`) markdown definitions.
 */
export async function getConfigAgents(workdir?: string): Promise<CustomAgentConfig[]> {
  const key = makeCacheKey(KEY_AGENTS, workdir);
  const cached = agentsCache.get(key);
  if (cached !== undefined) {
    return cached;
  }
  const resolvedWorkdir = workdir ?? process.cwd();
  const home = os.homedir();
  const userDir = path.join(home, '.alexi', 'agents');
  const projectDir = path.join(resolvedWorkdir, '.alexi', 'agents');

  // Load user-global first so project-local can override by id via
  // downstream reducers.
  const userAgents = fs.existsSync(userDir)
    ? await loadAgentsFromDirectory(userDir, 'user-global')
    : [];
  const projectAgents = fs.existsSync(projectDir)
    ? await loadAgentsFromDirectory(projectDir, 'project-local')
    : [];
  const merged = [...userAgents, ...projectAgents];
  agentsCache.set(key, merged);
  return merged;
}

/**
 * Return the effective skill list for `workdir`, aggregated across
 * `skillDirectories(workdir)` (project + global paths). Each cache
 * entry is a distinct array so a mutation in one worktree cannot
 * leak into another.
 */
export function getConfigSkills(workdir?: string): Skill[] {
  const key = makeCacheKey(KEY_SKILLS, workdir);
  const cached = skillsCache.get(key);
  if (cached !== undefined) {
    return cached;
  }
  const resolvedWorkdir = workdir ?? process.cwd();
  const dirs = skillDirectories(resolvedWorkdir);
  const skills: Skill[] = [];
  const seenIds = new Set<string>();
  for (const dir of dirs) {
    const loaded = loadSkillsFromDirectory(dir);
    for (const skill of loaded) {
      if (seenIds.has(skill.name)) {
        continue;
      }
      seenIds.add(skill.name);
      skills.push(skill);
    }
  }
  skillsCache.set(key, skills);
  return skills;
}

/**
 * Return the hook definitions applicable to `workdir`, reading from
 * `<workdir>/.alexi/hooks.json`, `<workdir>/alexi.config.json`, and
 * their `~/.alexi/*` fallbacks. Malformed hook files are logged and
 * skipped, mirroring `HookManagerImpl.loadFromConfig`.
 */
export function getConfigHooks(workdir?: string): HookDefinition[] {
  const key = makeCacheKey(KEY_HOOKS, workdir);
  const cached = hooksCache.get(key);
  if (cached !== undefined) {
    return cached;
  }

  const resolvedWorkdir = workdir ?? process.cwd();
  const home = os.homedir();
  const HOOK_CONFIG_FILES = ['.alexi/hooks.json', 'alexi.config.json'];
  const searchPaths: string[] = [];
  for (const file of HOOK_CONFIG_FILES) {
    searchPaths.push(path.join(resolvedWorkdir, file));
    searchPaths.push(path.join(home, '.alexi', file));
  }

  const hooks: HookDefinition[] = [];
  for (const filePath of searchPaths) {
    if (!fs.existsSync(filePath)) {
      continue;
    }
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const parsed = JSON.parse(content) as unknown;
      const arr = Array.isArray(parsed)
        ? parsed
        : ((parsed as { hooks?: unknown }).hooks as unknown);
      if (!Array.isArray(arr)) {
        continue;
      }
      const validated = z.array(HookDefinitionSchema).parse(arr);
      for (const hook of validated) {
        hooks.push(hook as HookDefinition);
      }
      // Stop after the first hook file with definitions, matching
      // HookManagerImpl.loadFromConfig behaviour.
      break;
    } catch {
      // Best-effort: a broken hook config never blocks session start.
      continue;
    }
  }
  hooksCache.set(key, hooks);
  return hooks;
}

// ============ Helpers ============

/**
 * Temporarily switch `process.cwd()` to `workdir` around a synchronous
 * loader that reads from the ambient CWD. Restores the original CWD
 * (and best-effort logs any restore failure) even when the loader
 * throws.
 *
 * Used by `getConfigRoutingConfig` and `getConfigMcpServers` because
 * their raw loaders were written before per-project caching existed
 * and derive their search paths from `process.cwd()`. Threading a
 * `workdir` argument through both raw loaders is out of scope for
 * this change; the temporary chdir keeps the surface area minimal and
 * fully backwards compatible.
 */
function withWorkdir<T>(workdir: string | undefined, fn: () => T): T {
  if (workdir === undefined) {
    return fn();
  }
  const target = path.resolve(workdir);
  const original = process.cwd();
  if (target === original) {
    return fn();
  }
  let didChdir = false;
  try {
    process.chdir(target);
    didChdir = true;
    return fn();
  } catch {
    // If chdir fails (e.g. target does not exist), fall back to the
    // ambient CWD; the caller still gets a valid config, just not
    // scoped to the missing directory. This mirrors the raw loader's
    // permissive default behaviour.
    return fn();
  } finally {
    if (didChdir) {
      try {
        process.chdir(original);
      } catch {
        // eslint-disable-next-line no-console
        console.warn(
          `[projectCache] failed to restore cwd to ${original} after loading config for ${target}`
        );
      }
    }
  }
}
