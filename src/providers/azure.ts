/**
 * Azure OpenAI Provider Configuration
 * Provides configuration helpers for Azure OpenAI deployments
 */

export interface AzureConfig {
  resourceName: string;
  apiKey: string;
  apiVersion?: string;
}

export function createAzureProviderOptions(config: AzureConfig) {
  const azureOptions = {
    resourceName: config.resourceName,
    apiKey: config.apiKey,
    apiVersion: config.apiVersion,
  };

  // Pass both 'openai' and 'azure' keys for @ai-sdk/azure compatibility
  return {
    azure: azureOptions,
    openai: {
      apiKey: config.apiKey,
      baseURL: `https://${config.resourceName}.openai.azure.com`,
    },
  };
}
