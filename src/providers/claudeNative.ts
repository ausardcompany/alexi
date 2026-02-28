/**
 * Direct SAP AI Core integration for Claude models using Bedrock Converse API
 */

interface ServiceKey {
  clientid: string;
  clientsecret: string;
  url: string;
  serviceurls: {
    AI_API_URL: string;
  };
}

interface BedrockMessage {
  role: 'user' | 'assistant';
  content: Array<{ text: string }>;
}

interface BedrockSystem {
  text: string;
}

interface BedrockRequest {
  messages: BedrockMessage[];
  system?: BedrockSystem[];
}

interface BedrockResponse {
  output: {
    message: {
      content: Array<{ text: string }>;
      role: 'assistant';
    };
  };
  usage: {
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
  };
  stopReason: string;
}

interface CompletionResult {
  text: string;
  usage?: {
    prompt_tokens?: number;
    completion_tokens?: number;
    total_tokens?: number;
  };
}

export interface StreamChunk {
  text: string;
  finishReason?: string;
  usage?: {
    prompt_tokens?: number;
    completion_tokens?: number;
    total_tokens?: number;
  };
}

export class ClaudeNativeProvider {
  private serviceKey: ServiceKey;
  private resourceGroup: string;
  private deploymentId: string;
  private tokenCache?: { token: string; expiresAt: number };

  constructor(serviceKey: ServiceKey, resourceGroup: string, deploymentId: string) {
    this.serviceKey = serviceKey;
    this.resourceGroup = resourceGroup;
    this.deploymentId = deploymentId;
  }

  private async getToken(): Promise<string> {
    // Check cache
    if (this.tokenCache && Date.now() < this.tokenCache.expiresAt) {
      return this.tokenCache.token;
    }

    // Get new token
    const authUrl = `${this.serviceKey.url}/oauth/token`;
    const auth = Buffer.from(`${this.serviceKey.clientid}:${this.serviceKey.clientsecret}`).toString('base64');
    
    const response = await fetch(authUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials'
    });

    if (!response.ok) {
      throw new Error(`OAuth failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json() as { access_token: string; expires_in: number };
    
    // Cache token (expires in 5 minutes before actual expiry)
    this.tokenCache = {
      token: data.access_token,
      expiresAt: Date.now() + (data.expires_in - 300) * 1000
    };

    return data.access_token;
  }

  async complete(
    messages: Array<{ role: string; content: string }>,
    options?: {
      temperature?: number;
      maxTokens?: number;
    }
  ): Promise<CompletionResult> {
    const token = await this.getToken();
    const apiUrl = this.serviceKey.serviceurls.AI_API_URL;
    const url = `${apiUrl}/v2/inference/deployments/${this.deploymentId}/converse`;

    // Extract system messages and convert to Bedrock format
    // Bedrock Converse API only allows 'user' | 'assistant' roles in messages
    // System prompts must be passed via separate 'system' field
    const systemMessages = messages.filter(m => m.role === 'system');
    const chatMessages = messages.filter(m => m.role !== 'system');
    
    const bedrockMessages: BedrockMessage[] = chatMessages.map(m => ({
      role: m.role as 'user' | 'assistant',
      content: [{ text: m.content }]
    }));

    const requestBody: BedrockRequest = {
      messages: bedrockMessages
    };
    
    // Add system prompt if present
    if (systemMessages.length > 0) {
      requestBody.system = systemMessages.map(m => ({ text: m.content }));
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'AI-Resource-Group': this.resourceGroup,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Claude API failed: ${response.status} ${response.statusText}\n${errorText}`);
    }

    const data = await response.json() as BedrockResponse;

    // Extract text from response
    const text = data.output.message.content
      .map(c => c.text)
      .join('\n');

    return {
      text,
      usage: {
        prompt_tokens: data.usage.inputTokens,
        completion_tokens: data.usage.outputTokens,
        total_tokens: data.usage.totalTokens
      }
    };
  }

  /**
   * Stream chat completions using Bedrock ConverseStream API
   * Returns an async generator of text chunks
   */
  async *streamComplete(
    messages: Array<{ role: string; content: string }>,
    options?: {
      temperature?: number;
      maxTokens?: number;
      signal?: AbortSignal;
    }
  ): AsyncGenerator<StreamChunk> {
    const token = await this.getToken();
    const apiUrl = this.serviceKey.serviceurls.AI_API_URL;
    const url = `${apiUrl}/v2/inference/deployments/${this.deploymentId}/converse-stream`;

    // Extract system messages and convert to Bedrock format
    // Bedrock Converse API only allows 'user' | 'assistant' roles in messages
    // System prompts must be passed via separate 'system' field
    const systemMessages = messages.filter(m => m.role === 'system');
    const chatMessages = messages.filter(m => m.role !== 'system');
    
    const bedrockMessages: BedrockMessage[] = chatMessages.map(m => ({
      role: m.role as 'user' | 'assistant',
      content: [{ text: m.content }]
    }));

    const requestBody: BedrockRequest = {
      messages: bedrockMessages
    };
    
    // Add system prompt if present
    if (systemMessages.length > 0) {
      requestBody.system = systemMessages.map(m => ({ text: m.content }));
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'AI-Resource-Group': this.resourceGroup,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody),
      signal: options?.signal,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Claude API streaming failed: ${response.status} ${response.statusText}\n${errorText}`);
    }

    if (!response.body) {
      throw new Error('Response body is null');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let inputTokens = 0;
    let outputTokens = 0;

    try {
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;
        
        buffer += decoder.decode(value, { stream: true });
        
        // Bedrock streaming format uses event stream with JSON chunks
        // Each event is separated by newlines
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed) continue;
          
          // Handle different event types based on Bedrock ConverseStream response
          try {
            const data = JSON.parse(trimmed);
            
            // Content block delta with text
            if (data.contentBlockDelta?.delta?.text) {
              yield {
                text: data.contentBlockDelta.delta.text,
              };
            }
            
            // Message start with usage info
            if (data.messageStart?.usage) {
              inputTokens = data.messageStart.usage.inputTokens || 0;
            }
            
            // Metadata with token usage
            if (data.metadata?.usage) {
              inputTokens = data.metadata.usage.inputTokens || inputTokens;
              outputTokens = data.metadata.usage.outputTokens || 0;
            }
            
            // Message stop event
            if (data.messageStop) {
              yield {
                text: '',
                finishReason: data.messageStop.stopReason,
                usage: {
                  prompt_tokens: inputTokens,
                  completion_tokens: outputTokens,
                  total_tokens: inputTokens + outputTokens,
                },
              };
              return;
            }
          } catch {
            // Not JSON or malformed, try SSE format
            if (trimmed.startsWith('data: ')) {
              try {
                const jsonStr = trimmed.slice(6);
                const data = JSON.parse(jsonStr);
                
                if (data.contentBlockDelta?.delta?.text) {
                  yield {
                    text: data.contentBlockDelta.delta.text,
                  };
                }
                
                if (data.messageStop) {
                  yield {
                    text: '',
                    finishReason: data.messageStop.stopReason,
                    usage: {
                      prompt_tokens: inputTokens,
                      completion_tokens: outputTokens,
                      total_tokens: inputTokens + outputTokens,
                    },
                  };
                  return;
                }
              } catch {
                // Skip malformed data
              }
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }
}
