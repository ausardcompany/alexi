import { ProviderError } from './errors.js';

export interface CloudflareConfig {
  accountId: string;
  apiToken: string;
  gatewayId?: string;
}

const REQUIRED_ENV_VARS = {
  accountId: 'CLOUDFLARE_ACCOUNT_ID',
  apiToken: 'CLOUDFLARE_API_TOKEN',
} as const;

const OPTIONAL_ENV_VARS = {
  gatewayId: 'CLOUDFLARE_GATEWAY_ID',
} as const;

export function validateCloudflareEnv(): CloudflareConfig {
  const missingVars: string[] = [];

  const accountId = process.env[REQUIRED_ENV_VARS.accountId];
  const apiToken = process.env[REQUIRED_ENV_VARS.apiToken];
  const gatewayId = process.env[OPTIONAL_ENV_VARS.gatewayId];

  if (!accountId) {
    missingVars.push(REQUIRED_ENV_VARS.accountId);
  }
  if (!apiToken) {
    missingVars.push(REQUIRED_ENV_VARS.apiToken);
  }

  if (missingVars.length > 0) {
    throw new ProviderError(
      `Cloudflare provider requires the following environment variables to be set: ${missingVars.join(', ')}. ` +
        `Please set these variables in your environment or .env file.`,
      'CLOUDFLARE_CONFIG_MISSING'
    );
  }

  return {
    accountId: accountId!,
    apiToken: apiToken!,
    gatewayId,
  };
}

export function createCloudflareProvider(config?: Partial<CloudflareConfig>) {
  const envConfig = validateCloudflareEnv();
  const finalConfig = { ...envConfig, ...config };

  return {
    name: 'cloudflare',
    config: finalConfig,
    baseUrl: `https://api.cloudflare.com/client/v4/accounts/${finalConfig.accountId}/ai`,
  };
}
