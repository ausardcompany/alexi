/**
 * Models command - list available models/deployments from SAP AI Core
 */

import type { Command } from 'commander';
import { DeploymentApi } from '@sap-ai-sdk/ai-api';
import { env } from '../../config/env.js';

// Color helpers
const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
};

function c(color: keyof typeof colors, text: string): string {
  return `${colors[color]}${text}${colors.reset}`;
}

interface DeploymentInfo {
  id: string;
  configurationId: string;
  configurationName: string;
  scenarioId: string | undefined;
  status: string;
  targetStatus: string;
  statusMessage?: string;
  deploymentUrl?: string;
  createdAt: string;
  modifiedAt: string;
}

function getStatusColor(status: string): string {
  switch (status.toUpperCase()) {
    case 'RUNNING':
      return c('green', status);
    case 'PENDING':
    case 'STARTING':
      return c('yellow', status);
    case 'STOPPED':
    case 'DEAD':
    case 'UNKNOWN':
      return c('red', status);
    default:
      return c('gray', status);
  }
}

function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateStr;
  }
}

async function listDeployments(options: {
  json?: boolean;
  status?: string;
  scenario?: string;
  resourceGroup?: string;
}): Promise<void> {
  // Check for AICORE_SERVICE_KEY
  const serviceKey = env('AICORE_SERVICE_KEY');
  if (!serviceKey) {
    throw new Error(
      'AICORE_SERVICE_KEY environment variable is not set.\n' +
        'Please set it in your .env file or environment.'
    );
  }

  const resourceGroup = options.resourceGroup || 'default';

  // Fetch deployments
  const response = await DeploymentApi.deploymentQuery(
    {},
    { 'AI-Resource-Group': resourceGroup }
  ).execute();

  const deployments: DeploymentInfo[] = (response.resources || []).map((d) => ({
    id: d.id,
    configurationId: d.configurationId,
    configurationName: d.configurationName || 'N/A',
    scenarioId: d.scenarioId,
    status: d.status || 'UNKNOWN',
    targetStatus: d.targetStatus || 'UNKNOWN',
    statusMessage: d.statusMessage || undefined,
    deploymentUrl: d.deploymentUrl || undefined,
    createdAt: d.createdAt,
    modifiedAt: d.modifiedAt,
  }));

  // Filter by status if specified
  let filtered = deployments;
  if (options.status) {
    const statusFilter = options.status.toUpperCase();
    filtered = filtered.filter((d) => d.status.toUpperCase() === statusFilter);
  }

  // Filter by scenario if specified
  if (options.scenario) {
    const scenarioFilter = options.scenario.toLowerCase();
    filtered = filtered.filter((d) => d.scenarioId?.toLowerCase().includes(scenarioFilter));
  }

  // Output
  if (options.json) {
    console.log(JSON.stringify(filtered, null, 2));
    return;
  }

  if (filtered.length === 0) {
    console.log(c('yellow', '\n  No deployments found.\n'));
    return;
  }

  // Table header
  console.log();
  console.log(c('cyan', '  SAP AI Core Deployments'));
  console.log(c('dim', `  Resource Group: ${resourceGroup}`));
  console.log();

  // Calculate column widths
  const idWidth = 36;
  const configWidth = Math.min(
    30,
    Math.max(12, ...filtered.map((d) => d.configurationName.length))
  );
  const scenarioWidth = Math.min(
    20,
    Math.max(10, ...filtered.map((d) => (d.scenarioId || 'N/A').length))
  );
  const statusWidth = 10;
  const dateWidth = 20;

  // Header row
  const header = [
    c('bold', 'ID'.padEnd(idWidth)),
    c('bold', 'Configuration'.padEnd(configWidth)),
    c('bold', 'Scenario'.padEnd(scenarioWidth)),
    c('bold', 'Status'.padEnd(statusWidth)),
    c('bold', 'Created'.padEnd(dateWidth)),
  ].join('  ');
  console.log(`  ${header}`);
  console.log(
    `  ${c('dim', '─'.repeat(idWidth + configWidth + scenarioWidth + statusWidth + dateWidth + 8))}`
  );

  // Data rows
  for (const d of filtered) {
    const row = [
      c('gray', d.id.padEnd(idWidth)),
      d.configurationName.slice(0, configWidth).padEnd(configWidth),
      c('dim', (d.scenarioId || 'N/A').slice(0, scenarioWidth).padEnd(scenarioWidth)),
      getStatusColor(d.status).padEnd(statusWidth + 9), // +9 for color codes
      c('dim', formatDate(d.createdAt).padEnd(dateWidth)),
    ].join('  ');
    console.log(`  ${row}`);

    // Show URL if available and running
    if (d.deploymentUrl && d.status.toUpperCase() === 'RUNNING') {
      console.log(`    ${c('dim', '→')} ${c('cyan', d.deploymentUrl)}`);
    }
  }

  console.log();
  console.log(c('dim', `  Total: ${filtered.length} deployment(s)`));
  console.log();
}

// Fallback to proxy if no AI Core credentials
async function listModelsProxy(): Promise<void> {
  const baseURL = env('SAP_PROXY_BASE_URL');
  const apiKey = env('SAP_PROXY_API_KEY');
  if (!baseURL || !apiKey) throw new Error('SAP proxy baseURL/API key missing');
  const u = baseURL.replace(/\/$/, '') + '/models';
  const res = await fetch(u, { headers: { Authorization: `Bearer ${apiKey}` } });
  if (!res.ok) throw new Error(`Failed to fetch models: ${res.status} ${res.statusText}`);
  const text = await res.text();
  console.log(text);
}

export function registerModelsCommand(program: Command): void {
  program
    .command('models')
    .description('List available models/deployments from SAP AI Core')
    .option('-j, --json', 'Output as JSON')
    .option('-s, --status <status>', 'Filter by status (RUNNING, PENDING, STOPPED, etc.)')
    .option('--scenario <scenario>', 'Filter by scenario ID')
    .option('-g, --resource-group <group>', 'AI Core resource group (default: "default")')
    .option('--proxy', 'Use proxy endpoint instead of direct AI Core API')
    .action(async (opts) => {
      try {
        if (opts.proxy) {
          await listModelsProxy();
        } else {
          await listDeployments({
            json: opts.json,
            status: opts.status,
            scenario: opts.scenario,
            resourceGroup: opts.resourceGroup,
          });
        }
      } catch (e) {
        console.error(c('red', `\n  Error: ${e instanceof Error ? e.message : String(e)}\n`));
        process.exit(1);
      }
    });
}
