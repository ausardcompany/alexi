/**
 * Models command - list available models from provider
 */

import type { Command } from 'commander';
import { env } from '../../config/env.js';

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
    .description('List models from provider (proxy only)')
    .action(async () => {
      try {
        await listModelsProxy();
      } catch (e) {
        console.error(String(e));
        process.exit(1);
      }
    });
}
