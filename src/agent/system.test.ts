import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { fileURLToPath } from 'url';
import {
  buildAssembledSystemPrompt,
  buildAssembledSystemPromptAsync,
  getAgentPrompt,
  getModelPrompt,
  getSoulPrompt,
  getModelPromptKey,
  instructionsForPath,
} from './system.js';
import {
  clearRuleCommandCache,
  materializeCommandRule,
  type ResolvedPluginRule,
} from '../plugin/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const promptsDir = path.join(__dirname, 'prompts');

// All expected prompt files
const PROMPT_FILES = [
  'soul.txt',
  'anthropic.txt',
  'openai.txt',
  'gemini.txt',
  'default.txt',
  'code.txt',
  'debug.txt',
  'plan.txt',
  'explore.txt',
  'ask.txt',
  'orchestrator.txt',
];

const AGENT_IDS = ['code', 'debug', 'plan', 'explore', 'ask', 'orchestrator'];
const MODEL_IDS = [
  'anthropic--claude-3.5-sonnet',
  'gpt-4o',
  'gemini-1.5-pro',
  'some-unknown-model',
];

describe('Prompt System', () => {
  describe('Prompt files', () => {
    it.each(PROMPT_FILES)('%s exists and is non-empty', (filename) => {
      const filePath = path.join(promptsDir, filename);
      expect(fs.existsSync(filePath)).toBe(true);

      const content = fs.readFileSync(filePath, 'utf-8').trim();
      expect(content.length).toBeGreaterThan(0);
    });

    it.each(PROMPT_FILES)('%s does not contain credential-like patterns', (filename) => {
      const filePath = path.join(promptsDir, filename);
      const content = fs.readFileSync(filePath, 'utf-8');

      // Check for common credential patterns
      expect(content).not.toMatch(/sk-[a-zA-Z0-9]{20,}/); // OpenAI API keys
      expect(content).not.toMatch(/AKIA[A-Z0-9]{16}/); // AWS access keys
      expect(content).not.toMatch(/ghp_[a-zA-Z0-9]{36}/); // GitHub tokens
      expect(content).not.toMatch(/password\s*[:=]\s*["'][^"']+["']/i); // Passwords
    });
  });

  describe('Model prompt key mapping', () => {
    it('maps anthropic model IDs correctly', () => {
      expect(getModelPromptKey('anthropic--claude-3.5-sonnet')).toBe('anthropic');
      expect(getModelPromptKey('anthropic--claude-3-opus')).toBe('anthropic');
    });

    it('maps OpenAI model IDs correctly', () => {
      expect(getModelPromptKey('gpt-4o')).toBe('openai');
      expect(getModelPromptKey('gpt-3.5-turbo')).toBe('openai');
    });

    it('maps Gemini model IDs correctly', () => {
      expect(getModelPromptKey('gemini-1.5-pro')).toBe('gemini');
      expect(getModelPromptKey('gemini-2.0-flash')).toBe('gemini');
    });

    it('maps unknown models to default', () => {
      expect(getModelPromptKey('some-unknown-model')).toBe('default');
      expect(getModelPromptKey('llama-3.1')).toBe('default');
    });
  });

  describe('Prompt accessors', () => {
    it('getSoulPrompt returns non-empty string', () => {
      const soul = getSoulPrompt();
      expect(soul.length).toBeGreaterThan(0);
      expect(soul).toContain('Alexi');
    });

    it.each(AGENT_IDS)('getAgentPrompt("%s") returns non-empty string', (agentId) => {
      const prompt = getAgentPrompt(agentId);
      expect(prompt.length).toBeGreaterThan(0);
    });

    it('getAgentPrompt returns empty string for unknown agent', () => {
      expect(getAgentPrompt('nonexistent')).toBe('');
    });

    it.each(MODEL_IDS)('getModelPrompt("%s") returns non-empty string', (modelId) => {
      const prompt = getModelPrompt(modelId);
      expect(prompt.length).toBeGreaterThan(0);
    });
  });

  describe('buildAssembledSystemPrompt', () => {
    it('always includes soul prompt', () => {
      const prompt = buildAssembledSystemPrompt({
        skipEnv: true,
        skipAgentsMd: true,
      });
      const soul = getSoulPrompt();
      expect(prompt).toContain(soul);
    });

    it('includes agent prompt when agentId is specified', () => {
      const prompt = buildAssembledSystemPrompt({
        agentId: 'code',
        skipEnv: true,
        skipAgentsMd: true,
      });
      const agentPrompt = getAgentPrompt('code');
      expect(prompt).toContain(agentPrompt);
    });

    it('includes model prompt when modelId is specified', () => {
      const prompt = buildAssembledSystemPrompt({
        modelId: 'anthropic--claude-3.5-sonnet',
        skipEnv: true,
        skipAgentsMd: true,
      });
      const modelPrompt = getModelPrompt('anthropic--claude-3.5-sonnet');
      expect(prompt).toContain(modelPrompt);
    });

    it('includes custom rules when provided', () => {
      const customRule = 'Always use TypeScript strict mode';
      const prompt = buildAssembledSystemPrompt({
        customRules: customRule,
        skipEnv: true,
        skipAgentsMd: true,
      });
      expect(prompt).toContain(customRule);
    });

    it('includes plugin rules under per-plugin headers when provided', () => {
      const prompt = buildAssembledSystemPrompt({
        skipEnv: true,
        skipAgentsMd: true,
        pluginRules: [
          {
            pluginName: 'team-rules',
            name: 'no-stdout-in-workers',
            scope: 'always',
            source: 'inline',
            content: 'Never log to stdout in workers.',
          },
        ],
      });

      expect(prompt).toContain('## Rules from plugin "team-rules"');
      expect(prompt).toContain('Never log to stdout in workers.');
    });

    it('appends plugin rules AFTER the AGENTS.md block', () => {
      const tmpProject = fs.mkdtempSync(path.join(os.tmpdir(), 'alexi-rules-order-'));
      try {
        fs.writeFileSync(path.join(tmpProject, 'AGENTS.md'), 'AGENTS_MD_UNIQUE_TOKEN');

        const prompt = buildAssembledSystemPrompt({
          workdir: tmpProject,
          skipEnv: true,
          pluginRules: [
            {
              pluginName: 'team-rules',
              name: 'r1',
              scope: 'always',
              source: 'inline',
              content: 'PLUGIN_RULE_UNIQUE_TOKEN',
            },
          ],
        });

        const agentsIdx = prompt.indexOf('AGENTS_MD_UNIQUE_TOKEN');
        const ruleIdx = prompt.indexOf('PLUGIN_RULE_UNIQUE_TOKEN');
        expect(agentsIdx).toBeGreaterThanOrEqual(0);
        expect(ruleIdx).toBeGreaterThanOrEqual(0);
        // Plugin rules must appear AFTER AGENTS.md so AGENTS.md wins on conflicts.
        expect(ruleIdx).toBeGreaterThan(agentsIdx);
        expect(prompt).toContain('## Rules from plugin "team-rules"');
      } finally {
        fs.rmSync(tmpProject, { recursive: true, force: true });
      }
    });

    it('omits the rules block entirely when no plugin rules are provided', () => {
      const prompt = buildAssembledSystemPrompt({
        skipEnv: true,
        skipAgentsMd: true,
        pluginRules: [],
      });
      expect(prompt).not.toContain('## Rules from plugin');
    });

    it('respects skipPluginRules: true', () => {
      const prompt = buildAssembledSystemPrompt({
        skipEnv: true,
        skipAgentsMd: true,
        skipPluginRules: true,
        pluginRules: [
          {
            pluginName: 'p1',
            name: 'r1',
            scope: 'always',
            source: 'inline',
            content: 'RULE_THAT_SHOULD_BE_SKIPPED',
          },
        ],
      });
      expect(prompt).not.toContain('RULE_THAT_SHOULD_BE_SKIPPED');
      expect(prompt).not.toContain('## Rules from plugin');
    });

    it('renders multiple plugin rules in order with separate headers', () => {
      const prompt = buildAssembledSystemPrompt({
        skipEnv: true,
        skipAgentsMd: true,
        pluginRules: [
          {
            pluginName: 'a',
            name: 'r1',
            scope: 'always',
            source: 'inline',
            content: 'CONTENT_A',
          },
          {
            pluginName: 'b',
            name: 'r2',
            scope: 'always',
            source: 'inline',
            content: 'CONTENT_B',
          },
        ],
      });

      const aHeader = prompt.indexOf('## Rules from plugin "a"');
      const bHeader = prompt.indexOf('## Rules from plugin "b"');
      expect(aHeader).toBeGreaterThanOrEqual(0);
      expect(bHeader).toBeGreaterThan(aHeader);
      expect(prompt).toContain('CONTENT_A');
      expect(prompt).toContain('CONTENT_B');
    });

    it('produces valid output for all agent + model combinations', () => {
      for (const agentId of AGENT_IDS) {
        for (const modelId of MODEL_IDS) {
          const prompt = buildAssembledSystemPrompt({
            agentId,
            modelId,
            skipEnv: true,
            skipAgentsMd: true,
          });
          expect(prompt.length).toBeGreaterThan(0);
          expect(prompt).toContain(getSoulPrompt());
          expect(prompt).toContain(getAgentPrompt(agentId));
        }
      }
    });
  });

  // -------------------------------------------------------------------------
  // B006: command-sourced plugin rules.
  //
  // `system.ts` only sees a flat `Array<{ source, content, ... }>`. Materialization
  // happens upstream (in the loader / `resolvePluginRulesForPrompt`). These
  // tests assert that:
  //   1. The sync builder skips unmaterialized command rules (content === ''),
  //      so an unresolved command rule cannot leak an empty header into the
  //      prompt.
  //   2. The sync builder DOES render command rules whose content was
  //      pre-materialized by the caller — i.e. the surface area is uniform
  //      across source types.
  //   3. The async builder (`buildAssembledSystemPromptAsync`) materializes
  //      command rules and emits their stdout in the assembled prompt.
  //   4. Ordering: when a plugin declares mixed-source rules
  //      (inline + command + file), the rendered order in the prompt matches
  //      the declared order.
  // -------------------------------------------------------------------------
  describe('command-source plugin rules in system prompt (B006)', () => {
    const NODE = process.execPath;
    let tmpdir: string;

    beforeEach(() => {
      tmpdir = fs.mkdtempSync(path.join(os.tmpdir(), 'alexi-system-cmd-rules-'));
      clearRuleCommandCache();
    });

    afterEach(() => {
      clearRuleCommandCache();
      try {
        fs.rmSync(tmpdir, { recursive: true, force: true });
      } catch {
        // best-effort cleanup
      }
    });

    it('sync builder skips unmaterialized command rules (content empty)', () => {
      const rules: ResolvedPluginRule[] = [
        {
          pluginName: 'p1',
          name: 'r-cmd',
          scope: 'session',
          source: 'command',
          content: '',
          command: { pluginRoot: tmpdir, argv: [NODE, '-e', 'process.stdout.write("X")'] },
        },
      ];
      const prompt = buildAssembledSystemPrompt({
        skipEnv: true,
        skipAgentsMd: true,
        pluginRules: rules,
      });
      // Unmaterialized → no header, no body.
      expect(prompt).not.toContain('## Rules from plugin "p1"');
    });

    it('sync builder renders pre-materialized command rules verbatim', () => {
      const rules: ResolvedPluginRule[] = [
        {
          pluginName: 'p1',
          name: 'r-cmd',
          scope: 'session',
          source: 'command',
          content: 'CMD_OUTPUT_TOKEN',
          command: { pluginRoot: tmpdir, argv: [NODE, '-e', 'process.stdout.write("X")'] },
        },
      ];
      const prompt = buildAssembledSystemPrompt({
        skipEnv: true,
        skipAgentsMd: true,
        pluginRules: rules,
      });
      expect(prompt).toContain('## Rules from plugin "p1"');
      expect(prompt).toContain('CMD_OUTPUT_TOKEN');
    });

    it('async builder materializes command rules and renders their stdout', async () => {
      const rules: ResolvedPluginRule[] = [
        {
          pluginName: 'todo-plugin',
          name: 'todos',
          scope: 'always',
          source: 'command',
          content: '',
          command: {
            pluginRoot: tmpdir,
            argv: [NODE, '-e', 'process.stdout.write("# Today\\n- ship B006")'],
          },
        },
      ];

      // Pre-materialize so the async builder sees populated content via the
      // shared cache. We don't go through the global plugin manager here to
      // avoid polluting other suites.
      const materialized: ResolvedPluginRule[] = await Promise.all(
        rules.map(async (r) =>
          r.source === 'command' ? { ...r, content: await materializeCommandRule(r) } : r
        )
      );

      const prompt = await buildAssembledSystemPromptAsync({
        skipEnv: true,
        skipAgentsMd: true,
        pluginRules: materialized,
      });

      expect(prompt).toContain('## Rules from plugin "todo-plugin"');
      expect(prompt).toContain('# Today');
      expect(prompt).toContain('- ship B006');
    });

    it('preserves plugin-declared order across inline + command + file sources', async () => {
      // Single plugin contributes three rules in this exact order:
      //   1. inline  — RULE_INLINE_TOKEN
      //   2. command — RULE_COMMAND_TOKEN (via stdout)
      //   3. file    — RULE_FILE_TOKEN
      // The rendered prompt must preserve that order regardless of source type.

      // Materialize the command rule via the same loader path the async
      // builder uses, so the resulting array mirrors what
      // `resolvePluginRulesForPrompt` would produce.
      const cmdRule: ResolvedPluginRule = {
        pluginName: 'mixed',
        name: 'r-cmd',
        scope: 'always',
        source: 'command',
        content: '',
        command: {
          pluginRoot: tmpdir,
          argv: [NODE, '-e', 'process.stdout.write("RULE_COMMAND_TOKEN")'],
        },
      };
      const cmdMaterialized: ResolvedPluginRule = {
        ...cmdRule,
        content: await materializeCommandRule(cmdRule),
      };

      const rules: ResolvedPluginRule[] = [
        {
          pluginName: 'mixed',
          name: 'r-inline',
          scope: 'always',
          source: 'inline',
          content: 'RULE_INLINE_TOKEN',
        },
        cmdMaterialized,
        {
          pluginName: 'mixed',
          name: 'r-file',
          scope: 'always',
          source: 'file',
          content: 'RULE_FILE_TOKEN',
        },
      ];

      const prompt = await buildAssembledSystemPromptAsync({
        skipEnv: true,
        skipAgentsMd: true,
        pluginRules: rules,
      });

      const inlineIdx = prompt.indexOf('RULE_INLINE_TOKEN');
      const commandIdx = prompt.indexOf('RULE_COMMAND_TOKEN');
      const fileIdx = prompt.indexOf('RULE_FILE_TOKEN');
      expect(inlineIdx).toBeGreaterThanOrEqual(0);
      expect(commandIdx).toBeGreaterThan(inlineIdx);
      expect(fileIdx).toBeGreaterThan(commandIdx);
    });

    it('preserves declared order even when a command rule is sandwiched between inlines', () => {
      const rules: ResolvedPluginRule[] = [
        {
          pluginName: 'order-test',
          name: 'a',
          scope: 'always',
          source: 'inline',
          content: 'TOKEN_A',
        },
        {
          pluginName: 'order-test',
          name: 'b',
          scope: 'session',
          source: 'command',
          content: 'TOKEN_B',
          command: { pluginRoot: tmpdir, argv: [NODE, '-e', '0'] },
        },
        {
          pluginName: 'order-test',
          name: 'c',
          scope: 'always',
          source: 'inline',
          content: 'TOKEN_C',
        },
      ];

      const prompt = buildAssembledSystemPrompt({
        skipEnv: true,
        skipAgentsMd: true,
        pluginRules: rules,
      });

      const aIdx = prompt.indexOf('TOKEN_A');
      const bIdx = prompt.indexOf('TOKEN_B');
      const cIdx = prompt.indexOf('TOKEN_C');
      expect(aIdx).toBeGreaterThanOrEqual(0);
      expect(bIdx).toBeGreaterThan(aIdx);
      expect(cIdx).toBeGreaterThan(bIdx);
    });

    it('surface-area: pluginRules accepts a flat array regardless of source mix', () => {
      // Confirms the typed surface — a command rule (with an extra `command`
      // descriptor) and inline rules sit in the same `ResolvedPluginRule[]`
      // without `system.ts` needing source-specific branching.
      const rules: ResolvedPluginRule[] = [
        {
          pluginName: 'flat',
          name: 'inline-1',
          scope: 'always',
          source: 'inline',
          content: 'INLINE_FLAT',
        },
        {
          pluginName: 'flat',
          name: 'cmd-1',
          scope: 'session',
          source: 'command',
          content: 'CMD_FLAT', // pre-materialized
          command: { pluginRoot: tmpdir, argv: [NODE, '-e', '0'] },
        },
      ];

      const prompt = buildAssembledSystemPrompt({
        skipEnv: true,
        skipAgentsMd: true,
        pluginRules: rules,
      });
      expect(prompt).toContain('INLINE_FLAT');
      expect(prompt).toContain('CMD_FLAT');
    });

    it('async builder still skips command rules whose materialized content is empty', async () => {
      // A command rule whose stdout is empty (e.g. /bin/true) should NOT
      // emit an empty header — that would be visual noise in the prompt.
      const rule: ResolvedPluginRule = {
        pluginName: 'empty-cmd',
        name: 'r1',
        scope: 'always',
        source: 'command',
        content: '',
        command: {
          pluginRoot: tmpdir,
          // Writes nothing to stdout.
          argv: [NODE, '-e', '0'],
        },
      };
      const materialized: ResolvedPluginRule = {
        ...rule,
        content: await materializeCommandRule(rule),
      };
      // Sanity: the loader returned an empty (or whitespace-only) string.
      expect(materialized.content.trim()).toBe('');

      const prompt = await buildAssembledSystemPromptAsync({
        skipEnv: true,
        skipAgentsMd: true,
        pluginRules: [materialized],
      });
      expect(prompt).not.toContain('## Rules from plugin "empty-cmd"');
    });
  });

  describe('Global AGENTS.md resolution', () => {
    let tmpRoot: string;
    let tmpHome: string;
    let tmpProject: string;
    let originalHome: string | undefined;
    let originalUserProfile: string | undefined;
    let originalXdg: string | undefined;

    beforeEach(() => {
      tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'alexi-agents-test-'));
      tmpHome = path.join(tmpRoot, 'home');
      tmpProject = path.join(tmpRoot, 'project');
      fs.mkdirSync(tmpHome, { recursive: true });
      fs.mkdirSync(tmpProject, { recursive: true });

      originalHome = process.env.HOME;
      originalUserProfile = process.env.USERPROFILE;
      originalXdg = process.env.XDG_CONFIG_HOME;

      process.env.HOME = tmpHome;
      // Windows uses USERPROFILE for os.homedir()
      process.env.USERPROFILE = tmpHome;
      delete process.env.XDG_CONFIG_HOME;
    });

    afterEach(() => {
      if (originalHome === undefined) {
        delete process.env.HOME;
      } else {
        process.env.HOME = originalHome;
      }
      if (originalUserProfile === undefined) {
        delete process.env.USERPROFILE;
      } else {
        process.env.USERPROFILE = originalUserProfile;
      }
      if (originalXdg === undefined) {
        delete process.env.XDG_CONFIG_HOME;
      } else {
        process.env.XDG_CONFIG_HOME = originalXdg;
      }

      try {
        fs.rmSync(tmpRoot, { recursive: true, force: true });
      } catch {
        // best-effort cleanup
      }
    });

    it('honors $XDG_CONFIG_HOME/AGENTS.md', () => {
      const xdgDir = path.join(tmpRoot, 'xdg');
      fs.mkdirSync(xdgDir, { recursive: true });
      const xdgFile = path.join(xdgDir, 'AGENTS.md');
      fs.writeFileSync(xdgFile, 'XDG_FIXTURE_CONTENT');
      process.env.XDG_CONFIG_HOME = xdgDir;

      const prompt = buildAssembledSystemPrompt({
        workdir: tmpProject,
        skipEnv: true,
      });

      const resolved = fs.realpathSync(xdgFile);
      expect(prompt).toContain(`<global-agents-md path="${resolved}">`);
      expect(prompt).toContain('XDG_FIXTURE_CONTENT');
      expect(prompt).toContain('</global-agents-md>');
    });

    it('falls back to ~/.config/AGENTS.md when XDG_CONFIG_HOME unset', () => {
      const configDir = path.join(tmpHome, '.config');
      fs.mkdirSync(configDir, { recursive: true });
      const configFile = path.join(configDir, 'AGENTS.md');
      fs.writeFileSync(configFile, 'CONFIG_FIXTURE_CONTENT');

      const prompt = buildAssembledSystemPrompt({
        workdir: tmpProject,
        skipEnv: true,
      });

      const resolved = fs.realpathSync(configFile);
      expect(prompt).toContain(`<global-agents-md path="${resolved}">`);
      expect(prompt).toContain('CONFIG_FIXTURE_CONTENT');
    });

    it('falls back to ~/AGENTS.md last', () => {
      const homeFile = path.join(tmpHome, 'AGENTS.md');
      fs.writeFileSync(homeFile, 'HOME_FIXTURE_CONTENT');

      const prompt = buildAssembledSystemPrompt({
        workdir: tmpProject,
        skipEnv: true,
      });

      const resolved = fs.realpathSync(homeFile);
      expect(prompt).toContain(`<global-agents-md path="${resolved}">`);
      expect(prompt).toContain('HOME_FIXTURE_CONTENT');
    });

    it('first hit wins (XDG > ~/.config > ~)', () => {
      // Write all three.
      const xdgDir = path.join(tmpRoot, 'xdg');
      fs.mkdirSync(xdgDir, { recursive: true });
      fs.writeFileSync(path.join(xdgDir, 'AGENTS.md'), 'XDG_WINS');
      process.env.XDG_CONFIG_HOME = xdgDir;

      const configDir = path.join(tmpHome, '.config');
      fs.mkdirSync(configDir, { recursive: true });
      fs.writeFileSync(path.join(configDir, 'AGENTS.md'), 'CONFIG_LOSES');

      fs.writeFileSync(path.join(tmpHome, 'AGENTS.md'), 'HOME_LOSES');

      const prompt = buildAssembledSystemPrompt({
        workdir: tmpProject,
        skipEnv: true,
      });

      expect(prompt).toContain('XDG_WINS');
      expect(prompt).not.toContain('CONFIG_LOSES');
      expect(prompt).not.toContain('HOME_LOSES');
    });

    it('de-dupes when ~/AGENTS.md is a symlink to project AGENTS.md', () => {
      const projectFile = path.join(tmpProject, 'AGENTS.md');
      fs.writeFileSync(projectFile, 'PROJECT_FIXTURE_UNIQUE_TOKEN');

      const homeLink = path.join(tmpHome, 'AGENTS.md');
      fs.symlinkSync(projectFile, homeLink);

      const prompt = buildAssembledSystemPrompt({
        workdir: tmpProject,
        skipEnv: true,
      });

      // Project block present exactly once.
      expect(prompt).toContain('<agents-md>');
      const matches = prompt.match(/PROJECT_FIXTURE_UNIQUE_TOKEN/g) ?? [];
      expect(matches.length).toBe(1);
      // No global block when it would point at the same file.
      expect(prompt).not.toContain('<global-agents-md');
    });
  });

  describe('instructionsForPath', () => {
    let workdir: string;

    beforeEach(() => {
      workdir = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'agents-walk-')));
    });

    afterEach(() => {
      try {
        fs.rmSync(workdir, { recursive: true, force: true });
      } catch {
        // best-effort
      }
    });

    it('returns [] when no AGENTS.md exists between workdir and the file', () => {
      const file = path.join(workdir, 'apps', 'api', 'src', 'index.ts');
      fs.mkdirSync(path.dirname(file), { recursive: true });
      fs.writeFileSync(file, 'export {}');

      const seen = new Set<string>();
      const result = instructionsForPath(file, workdir, seen);

      expect(result).toEqual([]);
      expect(seen.size).toBe(0);
    });

    it('returns reminders for apps/api/AGENTS.md when reading apps/api/src/index.ts', () => {
      const file = path.join(workdir, 'apps', 'api', 'src', 'index.ts');
      fs.mkdirSync(path.dirname(file), { recursive: true });
      fs.writeFileSync(file, 'export {}');
      const agentsPath = path.join(workdir, 'apps', 'api', 'AGENTS.md');
      fs.writeFileSync(agentsPath, 'API_RULES_TOKEN');

      const seen = new Set<string>();
      const result = instructionsForPath(file, workdir, seen);

      expect(result).toHaveLength(1);
      expect(result[0].path).toBe(fs.realpathSync(agentsPath));
      expect(result[0].content).toBe('API_RULES_TOKEN');
      expect(seen.has(fs.realpathSync(agentsPath))).toBe(true);
    });

    it('returns nearest-first when multiple AGENTS.md exist on the path', () => {
      const file = path.join(workdir, 'apps', 'api', 'src', 'index.ts');
      fs.mkdirSync(path.dirname(file), { recursive: true });
      fs.writeFileSync(file, 'export {}');
      const apiAgents = path.join(workdir, 'apps', 'api', 'AGENTS.md');
      const srcAgents = path.join(workdir, 'apps', 'api', 'src', 'AGENTS.md');
      fs.writeFileSync(apiAgents, 'API_RULES');
      fs.writeFileSync(srcAgents, 'SRC_RULES');

      const seen = new Set<string>();
      const result = instructionsForPath(file, workdir, seen);

      expect(result).toHaveLength(2);
      // Nearest first: src/AGENTS.md before api/AGENTS.md.
      expect(result[0].content).toBe('SRC_RULES');
      expect(result[1].content).toBe('API_RULES');
    });

    it('excludes the project-root AGENTS.md', () => {
      const file = path.join(workdir, 'apps', 'api', 'index.ts');
      fs.mkdirSync(path.dirname(file), { recursive: true });
      fs.writeFileSync(file, 'export {}');
      fs.writeFileSync(path.join(workdir, 'AGENTS.md'), 'ROOT_RULES');

      const seen = new Set<string>();
      const result = instructionsForPath(file, workdir, seen);

      expect(result).toEqual([]);
    });

    it('de-dupes when the same file is read twice with a shared seen set', () => {
      const file = path.join(workdir, 'apps', 'api', 'src', 'index.ts');
      fs.mkdirSync(path.dirname(file), { recursive: true });
      fs.writeFileSync(file, 'export {}');
      fs.writeFileSync(path.join(workdir, 'apps', 'api', 'AGENTS.md'), 'API_RULES');

      const seen = new Set<string>();
      const first = instructionsForPath(file, workdir, seen);
      const second = instructionsForPath(file, workdir, seen);

      expect(first).toHaveLength(1);
      expect(second).toEqual([]);
    });

    it('refuses paths outside workdir', () => {
      const outside = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'outside-')));
      try {
        const file = path.join(outside, 'apps', 'index.ts');
        fs.mkdirSync(path.dirname(file), { recursive: true });
        fs.writeFileSync(file, 'export {}');
        fs.writeFileSync(path.join(outside, 'apps', 'AGENTS.md'), 'OUTSIDE_RULES');

        const seen = new Set<string>();
        const result = instructionsForPath(file, workdir, seen);

        expect(result).toEqual([]);
        expect(seen.size).toBe(0);
      } finally {
        fs.rmSync(outside, { recursive: true, force: true });
      }
    });

    it('symlinked AGENTS.md de-dupes via realpath', () => {
      // Two sibling subtrees whose AGENTS.md both point to the same target.
      const target = path.join(workdir, 'shared-rules.md');
      fs.writeFileSync(target, 'SHARED_RULES_TOKEN');

      const fileA = path.join(workdir, 'apps', 'a', 'index.ts');
      const fileB = path.join(workdir, 'apps', 'b', 'index.ts');
      fs.mkdirSync(path.dirname(fileA), { recursive: true });
      fs.mkdirSync(path.dirname(fileB), { recursive: true });
      fs.writeFileSync(fileA, 'export {}');
      fs.writeFileSync(fileB, 'export {}');

      const linkA = path.join(workdir, 'apps', 'a', 'AGENTS.md');
      const linkB = path.join(workdir, 'apps', 'b', 'AGENTS.md');
      fs.symlinkSync(target, linkA);
      fs.symlinkSync(target, linkB);

      const seen = new Set<string>();
      const firstResult = instructionsForPath(fileA, workdir, seen);
      const secondResult = instructionsForPath(fileB, workdir, seen);

      expect(firstResult).toHaveLength(1);
      expect(firstResult[0].content).toBe('SHARED_RULES_TOKEN');
      // Second call hits the same realpath via the symlink and is skipped.
      expect(secondResult).toEqual([]);
    });

    it('caps walk depth at 32', () => {
      // Build a deeply nested path: workdir/d1/d2/.../d40/leaf.ts
      // and place AGENTS.md at every level. The cap should keep us from
      // walking the full chain.
      let cur = workdir;
      const totalLevels = 40;
      for (let i = 0; i < totalLevels; i++) {
        cur = path.join(cur, `d${i}`);
        fs.mkdirSync(cur);
        fs.writeFileSync(path.join(cur, 'AGENTS.md'), `RULES_${i}`);
      }
      const file = path.join(cur, 'leaf.ts');
      fs.writeFileSync(file, 'export {}');

      const seen = new Set<string>();
      const result = instructionsForPath(file, workdir, seen);

      // Cap is 32; the walker may visit up to 32 directories upward,
      // never the workdir itself nor anything beyond it.
      expect(result.length).toBeLessThanOrEqual(32);
      expect(result.length).toBeGreaterThan(0);
    });
  });
});
