import { getProviderForModel } from "../providers/index.js";
import { env } from "../config/env.js";
import { routePrompt } from "./router.js";
export async function sendChat(message, options) {
    let modelId;
    let routingReason;
    // Auto-routing enabled?
    if (options?.autoRoute && !options?.modelOverride) {
        const decision = routePrompt(message, { preferCheap: options.preferCheap });
        modelId = decision.modelId;
        routingReason = decision.reason;
        console.log(`[Router] Selected ${modelId}: ${decision.reason} (confidence: ${(decision.confidence * 100).toFixed(0)}%)`);
    }
    else {
        // Use specified or default model
        const proxyModel = env("SAP_PROXY_MODEL");
        const nativeModel = env("AICORE_MODEL");
        const defaultModel = proxyModel ?? nativeModel ?? "gpt-4o";
        modelId = (options?.modelOverride ?? defaultModel).trim();
    }
    // Build messages array with history if session manager provided
    const messages = [];
    if (options?.sessionManager) {
        const session = options.sessionManager.getCurrentSession();
        // Initialize session if needed
        if (!session) {
            options.sessionManager.createSession(modelId);
        }
        // Get conversation history
        const history = options.sessionManager.getHistory(20); // Last 20 messages
        // Add system prompt if provided and not already in history
        if (options.systemPrompt && !history.some(m => m.role === 'system')) {
            messages.push({ role: 'system', content: options.systemPrompt });
        }
        // Add conversation history
        messages.push(...history.map(m => ({ role: m.role, content: m.content })));
    }
    else {
        // Single message without history
        if (options?.systemPrompt) {
            messages.push({ role: 'system', content: options.systemPrompt });
        }
    }
    // Add current user message
    messages.push({ role: 'user', content: message });
    // Get appropriate provider for this model
    const { type, sdk } = getProviderForModel(modelId);
    let responseText;
    let usage;
    if (type === "anthropic" || type === "claude-native") {
        // Use Anthropic Messages API or Claude Native (Bedrock Converse)
        const result = await sdk.complete(messages, { maxTokens: 4096 });
        responseText = result.text;
        usage = result.usage;
    }
    else if (type === "proxy") {
        // Use OpenAI-compatible chat completions
        const baseURL = env("SAP_PROXY_BASE_URL");
        const apiKey = env("SAP_PROXY_API_KEY");
        const url = baseURL.replace(/\/$/, "") + "/chat/completions";
        const res = await fetch(url, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ model: modelId, messages })
        });
        if (!res.ok)
            throw new Error(`Proxy completion failed: ${res.status} ${res.statusText}`);
        const data = await res.json();
        responseText = (data?.choices?.[0]?.message?.content) ?? "";
        usage = data?.usage;
    }
    else {
        // Native provider
        const model = sdk.languageModel(modelId);
        const result = await model({ messages });
        responseText = result?.outputText ?? result?.text ?? "";
        usage = result?.usage;
    }
    // Save messages to session if session manager provided
    if (options?.sessionManager) {
        options.sessionManager.addMessage('user', message, {
            input: usage?.prompt_tokens || usage?.inputTokens
        });
        options.sessionManager.addMessage('assistant', responseText, {
            output: usage?.completion_tokens || usage?.outputTokens
        });
    }
    return {
        text: responseText,
        usage,
        modelUsed: modelId,
        routingReason
    };
}
