# Update Plan for Alexi

Generated: 2026-04-06
Based on upstream commits: kilocode (e10324aa, c0a08add), opencode (517e6c9, a4a9ea4, eaa272e, 70b636a, a8fd015, 342436d, 77a462c, 9965d38, f0f1e51, 4712c18, 9e156ea, 68f4aa2)

## Summary
- Total changes planned: 8
- Critical: 0 | High: 2 | Medium: 4 | Low: 2

## Changes

### 1. Add Cloudflare Provider with Environment Variable Validation
**File**: `src/providers/cloudflare.ts` (new file)
**Priority**: high
**Type**: feature
**Reason**: OpenCode added clear error messaging when Cloudflare provider environment variables are missing. This improves developer experience and debugging for users configuring Cloudflare AI Workers.

**New code**:
```typescript
import { ProviderError } from "./errors";

export interface CloudflareConfig {
  accountId: string;
  apiToken: string;
  gatewayId?: string;
}

const REQUIRED_ENV_VARS = {
  accountId: "CLOUDFLARE_ACCOUNT_ID",
  apiToken: "CLOUDFLARE_API_TOKEN",
} as const;

const OPTIONAL_ENV_VARS = {
  gatewayId: "CLOUDFLARE_GATEWAY_ID",
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
      `Cloudflare provider requires the following environment variables to be set: ${missingVars.join(", ")}. ` +
      `Please set these variables in your environment or .env file.`,
      "CLOUDFLARE_CONFIG_MISSING"
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
    name: "cloudflare",
    config: finalConfig,
    baseUrl: `https://api.cloudflare.com/client/v4/accounts/${finalConfig.accountId}/ai`,
  };
}
```

### 2. Update Provider Registry to Include Cloudflare
**File**: `src/providers/index.ts`
**Priority**: high
**Type**: feature
**Reason**: Register the new Cloudflare provider in the provider system.

**Current code**:
```typescript
import { createOpenAIProvider } from "./openai";
import { createAnthropicProvider } from "./anthropic";
import { createSAPAICoreProvider } from "./sap-ai-core";

export const providers = {
  openai: createOpenAIProvider,
  anthropic: createAnthropicProvider,
  "sap-ai-core": createSAPAICoreProvider,
};
```

**New code**:
```typescript
import { createOpenAIProvider } from "./openai";
import { createAnthropicProvider } from "./anthropic";
import { createSAPAICoreProvider } from "./sap-ai-core";
import { createCloudflareProvider } from "./cloudflare";

export const providers = {
  openai: createOpenAIProvider,
  anthropic: createAnthropicProvider,
  "sap-ai-core": createSAPAICoreProvider,
  cloudflare: createCloudflareProvider,
};

export { validateCloudflareEnv } from "./cloudflare";
```

### 3. Fix Azure Provider Options Passthrough
**File**: `src/providers/azure.ts`
**Priority**: medium
**Type**: bugfix
**Reason**: OpenCode fixed an issue where both 'openai' and 'azure' providerOptions keys need to be passed for @ai-sdk/azure compatibility. This ensures proper configuration inheritance.

**Current code**:
```typescript
export function createAzureProviderOptions(config: AzureConfig) {
  return {
    azure: {
      resourceName: config.resourceName,
      apiKey: config.apiKey,
      apiVersion: config.apiVersion,
    },
  };
}
```

**New code**:
```typescript
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
```

### 4. Add Mouse Disable Configuration for TUI
**File**: `src/cli/config/tui-schema.ts`
**Priority**: medium
**Type**: feature
**Reason**: OpenCode added the ability to disable mouse input in the TUI. This is useful for users who prefer keyboard-only navigation or have accessibility requirements.

**Current code**:
```typescript
export const tuiConfigSchema = z.object({
  theme: z.enum(["dark", "light", "auto"]).default("auto"),
  keybindings: z.record(z.string()).optional(),
});
```

**New code**:
```typescript
export const tuiConfigSchema = z.object({
  theme: z.enum(["dark", "light", "auto"]).default("auto"),
  keybindings: z.record(z.string()).optional(),
  mouse: z.boolean().default(true).describe("Enable or disable mouse input in TUI"),
});

export type TuiConfig = z.infer<typeof tuiConfigSchema>;
```

### 5. Update TUI App to Respect Mouse Configuration
**File**: `src/cli/cmd/tui/app.tsx`
**Priority**: medium
**Type**: feature
**Reason**: Implement the mouse disable feature in the TUI application component.

**Current code**:
```typescript
export function App({ config }: AppProps) {
  return (
    <Box flexDirection="column">
      <Header />
      <MainContent />
      <Footer />
    </Box>
  );
}
```

**New code**:
```typescript
import { useInput } from "ink";

export function App({ config }: AppProps) {
  const mouseEnabled = config.tui?.mouse ?? true;
  
  // Conditionally enable mouse handling
  useInput(
    (input, key) => {
      // Handle input
    },
    { isActive: true }
  );

  return (
    <Box 
      flexDirection="column"
      // Disable mouse events when mouse is disabled in config
      {...(!mouseEnabled && { onMouse: undefined })}
    >
      <Header />
      <MainContent mouseEnabled={mouseEnabled} />
      <Footer />
    </Box>
  );
}
```

### 6. Implement ACP Config Options Support
**File**: `src/providers/acp/agent.ts`
**Priority**: medium
**Type**: bugfix
**Reason**: OpenCode implemented proper configOptions for ACP (Agent Communication Protocol). This ensures configuration is correctly passed to ACP agents.

**New code**:
```typescript
import { z } from "zod";

export const acpConfigOptionsSchema = z.object({
  timeout: z.number().optional().default(30000),
  retryAttempts: z.number().optional().default(3),
  retryDelay: z.number().optional().default(1000),
  headers: z.record(z.string()).optional(),
  metadata: z.record(z.unknown()).optional(),
});

export type ACPConfigOptions = z.infer<typeof acpConfigOptionsSchema>;

export interface ACPAgentConfig {
  endpoint: string;
  apiKey?: string;
  configOptions?: ACPConfigOptions;
}

export function createACPAgent(config: ACPAgentConfig) {
  const options = acpConfigOptionsSchema.parse(config.configOptions ?? {});
  
  return {
    name: "acp-agent",
    endpoint: config.endpoint,
    options,
    async invoke(message: string, context?: Record<string, unknown>) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), options.timeout);
      
      try {
        const response = await fetch(config.endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(config.apiKey && { Authorization: `Bearer ${config.apiKey}` }),
            ...options.headers,
          },
          body: JSON.stringify({ message, context, metadata: options.metadata }),
          signal: controller.signal,
        });
        
        if (!response.ok) {
          throw new Error(`ACP agent request failed: ${response.statusText}`);
        }
        
        return await response.json();
      } finally {
        clearTimeout(timeoutId);
      }
    },
  };
}
```

### 7. Sanitize Plugin Cache Paths for Windows
**File**: `src/plugin/shared.ts`
**Priority**: low
**Type**: bugfix
**Reason**: OpenCode fixed plugin package specifier parsing and Windows cache path sanitization. This prevents issues with special characters in paths on Windows systems.

**Current code**:
```typescript
export function getPluginCachePath(pluginName: string): string {
  const cacheDir = process.env.ALEXI_PLUGIN_CACHE || path.join(os.homedir(), ".alexi", "plugins");
  return path.join(cacheDir, pluginName);
}
```

**New code**:
```typescript
import npa from "npm-package-arg";

export function parsePluginSpecifier(specifier: string) {
  try {
    return npa(specifier);
  } catch (error) {
    throw new Error(`Invalid plugin specifier: ${specifier}. ${error}`);
  }
}

export function sanitizeCachePath(cachePath: string): string {
  if (process.platform === "win32") {
    // Remove or replace characters that are invalid in Windows paths
    return cachePath
      .replace(/[<>:"|?*]/g, "_")
      .replace(/\\/g, "/")
      .replace(/\/+/g, "/");
  }
  return cachePath;
}

export function getPluginCachePath(pluginSpecifier: string): string {
  const parsed = parsePluginSpecifier(pluginSpecifier);
  const pluginName = parsed.name || pluginSpecifier;
  
  const cacheDir = process.env.ALEXI_PLUGIN_CACHE || path.join(os.homedir(), ".alexi", "plugins");
  const unsanitizedPath = path.join(cacheDir, pluginName);
  
  return sanitizeCachePath(unsanitizedPath);
}
```

### 8. Remove Deprecated Subscription Fields
**File**: `src/core/subscription.ts`
**Priority**: low
**Type**: refactor
**Reason**: OpenCode removed deprecated `checkHeader` and `fallbackValue` fields from the free subscription tier schema. This cleanup aligns with upstream changes.

**Current code**:
```typescript
export const freeSubscriptionSchema = z.object({
  promoTokens: z.number().int(),
  dailyRequests: z.number().int(),
  checkHeader: z.string(),
  fallbackValue: z.number().int(),
});
```

**New code**:
```typescript
export const freeSubscriptionSchema = z.object({
  promoTokens: z.number().int(),
  dailyRequests: z.number().int(),
});
```

## Testing Recommendations
- Test Cloudflare provider initialization with missing environment variables to verify error messages
- Test Azure provider with both OpenAI and Azure SDK configurations
- Test TUI with `mouse: false` configuration to ensure keyboard-only navigation works
- Test plugin installation on Windows with package names containing special characters
- Verify ACP agent configuration options are properly passed through
- Run existing SAP AI Core integration tests to ensure no regressions

## Potential Risks
- **Cloudflare Provider**: New provider may need additional testing with SAP AI Core proxy configurations
- **Azure Provider Changes**: The dual options passthrough may affect existing Azure deployments - test thoroughly
- **Subscription Schema Change**: If any code depends on `checkHeader` or `fallbackValue` fields, it will break - search codebase for usages before applying
- **Plugin Path Sanitization**: Changes to cache paths may invalidate existing plugin caches on Windows - consider migration logic or cache clearing instructions
{"prompt_tokens":4684,"completion_tokens":3332,"total_tokens":8016}

[Session: 18de4e70-01ac-4bec-b543-006859e9c873]
[Messages: 2, Tokens: 8016]
