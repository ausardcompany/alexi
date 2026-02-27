/**
 * Direct SAP AI Core integration for Claude models using Bedrock Converse API
 */
export class ClaudeNativeProvider {
    serviceKey;
    resourceGroup;
    deploymentId;
    tokenCache;
    constructor(serviceKey, resourceGroup, deploymentId) {
        this.serviceKey = serviceKey;
        this.resourceGroup = resourceGroup;
        this.deploymentId = deploymentId;
    }
    async getToken() {
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
        const data = await response.json();
        // Cache token (expires in 5 minutes before actual expiry)
        this.tokenCache = {
            token: data.access_token,
            expiresAt: Date.now() + (data.expires_in - 300) * 1000
        };
        return data.access_token;
    }
    async complete(messages, options) {
        const token = await this.getToken();
        const apiUrl = this.serviceKey.serviceurls.AI_API_URL;
        const url = `${apiUrl}/v2/inference/deployments/${this.deploymentId}/converse`;
        // Convert to Bedrock format
        const bedrockMessages = messages.map(m => ({
            role: m.role,
            content: [{ text: m.content }]
        }));
        const requestBody = {
            messages: bedrockMessages
        };
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
        const data = await response.json();
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
    async *streamComplete(messages, options) {
        const token = await this.getToken();
        const apiUrl = this.serviceKey.serviceurls.AI_API_URL;
        const url = `${apiUrl}/v2/inference/deployments/${this.deploymentId}/converse-stream`;
        // Convert to Bedrock format
        const bedrockMessages = messages.map(m => ({
            role: m.role,
            content: [{ text: m.content }]
        }));
        const requestBody = {
            messages: bedrockMessages
        };
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
                if (done)
                    break;
                buffer += decoder.decode(value, { stream: true });
                // Bedrock streaming format uses event stream with JSON chunks
                // Each event is separated by newlines
                const lines = buffer.split('\n');
                buffer = lines.pop() || '';
                for (const line of lines) {
                    const trimmed = line.trim();
                    if (!trimmed)
                        continue;
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
                    }
                    catch {
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
                            }
                            catch {
                                // Skip malformed data
                            }
                        }
                    }
                }
            }
        }
        finally {
            reader.releaseLock();
        }
    }
}
