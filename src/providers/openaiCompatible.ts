import { env } from "../config/env.js"

export interface StreamChunk {
  text: string;
  finishReason?: string;
  usage?: {
    prompt_tokens?: number;
    completion_tokens?: number;
    total_tokens?: number;
  };
}

// Lightweight provider shim exposing languageModel for orchestrator
export function createSapProxyProvider(baseURL?: string, apiKey?: string) {
  const resolvedBaseURL = baseURL ?? env("SAP_PROXY_BASE_URL")
  const resolvedApiKey = apiKey ?? env("SAP_PROXY_API_KEY")
  if (!resolvedBaseURL || !resolvedApiKey) throw new Error("SAP proxy baseURL/API key missing")
  return {
    languageModel(modelId: string) {
      return async (input: { messages: { role: string; content: string }[] }) => {
        const url = resolvedBaseURL!.replace(/\/$/, "") + "/chat/completions"
        const res = await fetch(url, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resolvedApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ model: modelId, messages: input.messages }),
        })
        if (!res.ok) throw new Error(`Proxy completion failed: ${res.status} ${res.statusText}`)
        const data = await res.json()
        return { text: data?.choices?.[0]?.message?.content ?? "", usage: data?.usage }
      }
    },
  }
}

/**
 * OpenAI-compatible streaming provider for SSE responses
 */
export class OpenAIStreamingProvider {
  private baseUrl: string;
  private apiKey: string;

  constructor(baseUrl: string, apiKey: string) {
    this.baseUrl = baseUrl.replace(/\/+$/, '');
    this.apiKey = apiKey;
  }

  /**
   * Stream chat completions using SSE
   */
  async *streamComplete(
    messages: Array<{ role: string; content: string }>,
    modelId: string,
    options?: {
      temperature?: number;
      maxTokens?: number;
      signal?: AbortSignal;
    }
  ): AsyncGenerator<StreamChunk> {
    const url = `${this.baseUrl}/chat/completions`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: modelId,
        messages,
        stream: true,
        temperature: options?.temperature,
        max_tokens: options?.maxTokens,
      }),
      signal: options?.signal,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenAI API failed: ${response.status} ${response.statusText}\n${errorText}`);
    }

    if (!response.body) {
      throw new Error('Response body is null');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;
        
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          
          if (!trimmed || trimmed === ':') continue;
          if (trimmed === 'data: [DONE]') return;
          
          if (trimmed.startsWith('data: ')) {
            const jsonStr = trimmed.slice(6);
            try {
              const data = JSON.parse(jsonStr);
              const delta = data.choices?.[0]?.delta;
              const finishReason = data.choices?.[0]?.finish_reason;
              
              if (delta?.content) {
                yield {
                  text: delta.content,
                  finishReason: finishReason || undefined,
                  usage: data.usage,
                };
              } else if (finishReason) {
                yield {
                  text: '',
                  finishReason,
                  usage: data.usage,
                };
              }
            } catch {
              // Skip malformed JSON
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }

  /**
   * Non-streaming completion (for compatibility)
   */
  async complete(
    messages: Array<{ role: string; content: string }>,
    modelId: string,
    options?: {
      temperature?: number;
      maxTokens?: number;
    }
  ): Promise<{ text: string; usage?: any }> {
    const url = `${this.baseUrl}/chat/completions`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: modelId,
        messages,
        stream: false,
        temperature: options?.temperature,
        max_tokens: options?.maxTokens,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenAI API failed: ${response.status} ${response.statusText}\n${errorText}`);
    }

    const data = await response.json();
    return {
      text: data?.choices?.[0]?.message?.content ?? '',
      usage: data?.usage,
    };
  }
}
