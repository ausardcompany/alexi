import { getProviderForModel, getDefaultModel } from "../providers/index.js"
import { routePrompt } from "./router.js"
import { SessionManager, type Message } from "./sessionManager.js"

export async function sendChat(
  message: string, 
  options?: {
    modelOverride?: string;
    autoRoute?: boolean;
    preferCheap?: boolean;
    sessionManager?: SessionManager;
    systemPrompt?: string;
  }
) {
  let modelId: string;
  let routingReason: string | undefined;

  // Auto-routing enabled?
  if (options?.autoRoute && !options?.modelOverride) {
    const decision = routePrompt(message, { preferCheap: options.preferCheap });
    modelId = decision.modelId;
    routingReason = decision.reason;
    console.log(`[Router] Selected ${modelId}: ${decision.reason} (confidence: ${(decision.confidence * 100).toFixed(0)}%)`);
  } else {
    // Use specified or default model
    modelId = (options?.modelOverride ?? getDefaultModel()).trim()
  }

  // Build messages array with history if session manager provided
  const messages: Array<{ role: string; content: string }> = [];
  
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
  } else {
    // Single message without history
    if (options?.systemPrompt) {
      messages.push({ role: 'system', content: options.systemPrompt });
    }
  }
  
  // Add current user message
  messages.push({ role: 'user', content: message });

  // Get SAP Orchestration provider for this model
  const provider = getProviderForModel(modelId)

  // Use SAP Orchestration complete() method
  const result = await provider.complete(messages, { maxTokens: 4096 })
  
  const responseText = result.text;
  const usage = result.usage;

  // Save messages to session if session manager provided
  if (options?.sessionManager) {
    options.sessionManager.addMessage('user', message, {
      input: usage?.prompt_tokens
    });
    options.sessionManager.addMessage('assistant', responseText, {
      output: usage?.completion_tokens
    });
  }

  return { 
    text: responseText, 
    usage,
    modelUsed: modelId,
    routingReason
  }
}
