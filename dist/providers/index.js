import { env } from "../config/env.js";
import { createSapProxyProvider } from "./openaiCompatible.js";
import { createSapNativeProvider } from "./sapNative.js";
import { AnthropicCompatibleProvider } from "./anthropicCompatible.js";
import { ClaudeNativeProvider } from "./claudeNative.js";
import { SapOrchestrationProvider, isOrchestrationModel } from "./sapOrchestration.js";
export function resolveProvider() {
    const proxyBase = env("SAP_PROXY_BASE_URL");
    if (proxyBase)
        return { type: "proxy", sdk: createSapProxyProvider(proxyBase, env("SAP_PROXY_API_KEY")) };
    const nativeKey = env("AICORE_SERVICE_KEY");
    if (nativeKey)
        return { type: "native", sdk: createSapNativeProvider() };
    throw new Error("No provider configured. Set SAP_PROXY_BASE_URL or AICORE_SERVICE_KEY.");
}
/**
 * Check if model is Claude and should use Claude-specific API
 */
export function isClaudeModel(modelId) {
    const lower = modelId.toLowerCase();
    return lower.includes('claude') || lower.includes('sonnet') || lower.includes('haiku') || lower.includes('opus');
}
/**
 * Get Claude deployment ID for model
 */
function getClaudeDeploymentId(modelId) {
    const lower = modelId.toLowerCase();
    // Map model names to deployment IDs
    if (lower.includes('claude-4') || lower.includes('4-sonnet')) {
        return 'd3dbdb6f835cb28b'; // Claude 4 Sonnet
    }
    if (lower.includes('claude-3.5') || lower.includes('3.5-sonnet')) {
        return 'd60cb327102260ad'; // Claude 3.5 Sonnet
    }
    return null;
}
/**
 * Check if SAP AI SDK Orchestration is available and should be used
 */
export function shouldUseOrchestration() {
    // Orchestration requires AICORE_SERVICE_KEY to be set for @sap-ai-sdk authentication
    // or proper destination/VCAP_SERVICES binding
    const useOrchestration = env("USE_SAP_ORCHESTRATION");
    return useOrchestration === "true" || useOrchestration === "1";
}
/**
 * Get appropriate provider for the model
 */
export function getProviderForModel(modelId) {
    const resourceGroup = env("AICORE_RESOURCE_GROUP");
    // Check if we should use SAP AI SDK Orchestration
    if (shouldUseOrchestration() && isOrchestrationModel(modelId)) {
        return {
            type: "orchestration",
            sdk: new SapOrchestrationProvider({
                modelName: modelId,
                resourceGroup: resourceGroup || undefined,
            })
        };
    }
    // Check if this is a Claude model and we have native credentials
    const serviceKeyStr = env("AICORE_SERVICE_KEY");
    if (isClaudeModel(modelId) && serviceKeyStr && resourceGroup) {
        const deploymentId = getClaudeDeploymentId(modelId);
        if (deploymentId) {
            // Use native Claude provider (direct Bedrock Converse API)
            const serviceKey = JSON.parse(serviceKeyStr);
            return {
                type: "claude-native",
                sdk: new ClaudeNativeProvider(serviceKey, resourceGroup, deploymentId)
            };
        }
    }
    // Fall back to proxy
    const proxyBase = env("SAP_PROXY_BASE_URL");
    if (!proxyBase) {
        return resolveProvider();
    }
    // Check if this is a Claude model for proxy's Anthropic Messages API
    if (isClaudeModel(modelId)) {
        const apiKey = env("SAP_PROXY_API_KEY") ?? "";
        return {
            type: "anthropic",
            sdk: new AnthropicCompatibleProvider(proxyBase, apiKey)
        };
    }
    // Use OpenAI-compatible for other models
    return {
        type: "proxy",
        sdk: createSapProxyProvider(proxyBase, env("SAP_PROXY_API_KEY"))
    };
}
