#!/usr/bin/env node
// resolve-config.mjs -- validate .agent-factory/factory.config.yml against the
// engine schema, apply defaults, and emit a normalized JSON to stdout (or to
// $GITHUB_OUTPUT as `config=<json>` when --github-output is passed).
//
// Zero runtime deps beyond a YAML parser and ajv, both installed by the engine
// workflow step before invoking this. Fails fast (exit 1) with an actionable
// message so a misconfigured consumer never runs with silent wrong defaults.
//
// Usage:
//   node resolve-config.mjs <path-to-config.yml> [--schema <schema.json>] [--github-output]

import { readFileSync } from 'node:fs';
import { argv, exit, env } from 'node:process';
import { appendFileSync } from 'node:fs';

function die(msg) {
  console.error(`::error::[agent-factory] ${msg}`);
  exit(1);
}

const args = argv.slice(2);
const configPath = args.find((a) => !a.startsWith('--'));
const schemaIdx = args.indexOf('--schema');
const schemaPath =
  schemaIdx >= 0 ? args[schemaIdx + 1] : new URL('../schema/factory.config.schema.json', import.meta.url).pathname;
const toGithubOutput = args.includes('--github-output');

if (!configPath) {
  die('Missing config path. Expected .agent-factory/factory.config.yml. See engine docs for the schema.');
}

let YAML, Ajv;
try {
  YAML = (await import('js-yaml')).default;
} catch {
  die('js-yaml not installed. The engine install step must add it before resolving config.');
}
try {
  Ajv = (await import('ajv')).default;
} catch {
  die('ajv not installed. The engine install step must add it before resolving config.');
}

let raw;
try {
  raw = readFileSync(configPath, 'utf8');
} catch {
  die(
    `Config not found at '${configPath}'. Create .agent-factory/factory.config.yml. ` +
      `Template: https://github.com/ausardcompany/agent-factory (schema/factory.config.example.yml).`
  );
}

let cfg;
try {
  cfg = YAML.load(raw);
} catch (e) {
  die(`Config is not valid YAML: ${e.message}`);
}
if (!cfg || typeof cfg !== 'object') {
  die('Config parsed to an empty/invalid document.');
}

let schema;
try {
  schema = JSON.parse(readFileSync(schemaPath, 'utf8'));
} catch (e) {
  die(`Could not read engine schema at '${schemaPath}': ${e.message}`);
}

const ajv = new Ajv({ allErrors: true, useDefaults: true, strict: false });
const validate = ajv.compile(schema);
if (!validate(cfg)) {
  const errs = (validate.errors || [])
    .map((e) => `  - ${e.instancePath || '(root)'} ${e.message}`)
    .join('\n');
  die(`factory.config.yml failed schema validation:\n${errs}`);
}

// -- Apply engine-level defaults not covered by JSON Schema useDefaults ------
cfg.reliability = cfg.reliability || {};
if (cfg.reliability.retries == null) cfg.reliability.retries = 2;
if (!cfg.reliability.escalation_label) cfg.reliability.escalation_label = 'factory-escalation';
if (!cfg.reliability.transient_pattern) {
  cfg.reliability.transient_pattern =
    'socket hang up|ECONNRESET|ETIMEDOUT|ENOTFOUND|fetch failed|502|503|429|rate limit';
}
if (!cfg.git.default_branch) cfg.git.default_branch = 'main';

// Normalize per-role defaults
for (const [role, r] of Object.entries(cfg.roles)) {
  if (r.enabled == null) r.enabled = true;
  if (!r.tier) r.tier = 'small';
  if (r.timeout_minutes == null) r.timeout_minutes = 15;
  // sanity: tier must exist in models map
  if (!cfg.models[r.tier]) {
    die(`Role '${role}' requests tier '${r.tier}' but models.${r.tier} is not defined.`);
  }
}

// stack:none must not declare build/test that would be run
if (cfg.stack.type === 'none' && (cfg.stack.build || cfg.stack.test)) {
  console.error(
    '::warning::[agent-factory] stack.type is "none" but build/test are set; they will be ignored.'
  );
}

const out = JSON.stringify(cfg);
if (toGithubOutput && env.GITHUB_OUTPUT) {
  appendFileSync(env.GITHUB_OUTPUT, `config<<FACTORY_CFG_EOF\n${out}\nFACTORY_CFG_EOF\n`);
  console.error('[agent-factory] config resolved and written to GITHUB_OUTPUT');
} else {
  process.stdout.write(out + '\n');
}
