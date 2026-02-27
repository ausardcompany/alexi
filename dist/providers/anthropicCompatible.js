/**
 * Anthropic Messages API compatible provider for SAP AI Core
 * Used for Claude models via proxy server
 */
export class AnthropicCompatibleProvider {
    baseUrl;
    apiKey;
    constructor(baseUrl, apiKey) {
        this.baseUrl = baseUrl.replace(/\/+$/, ''); // Remove trailing slashes
        this.apiKey = apiKey;
    }
    async complete(messages, modelId, options) {
        const url = `${this.baseUrl}/messages`;
        const requestBody = {
            model: modelId,
            messages: messages.map(m => ({
                role: m.role,
                content: m.content
            })),
            max_tokens: options?.maxTokens || 1024,
            temperature: options?.temperature,
            stream: false
        };
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify(requestBody)
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Anthropic API failed: ${response.status} ${response.statusText}\n${errorText}`);
        }
        const data = await response.json();
        // Extract text from content array
        const text = data.content
            .filter(c => c.type === 'text')
            .map(c => c.text)
            .join('\n');
        return {
            text,
            usage: {
                prompt_tokens: data.usage.input_tokens,
                completion_tokens: data.usage.output_tokens,
                total_tokens: data.usage.input_tokens + data.usage.output_tokens
            }
        };
    }
    async listModels() {
        // Anthropic API doesn't have a models endpoint in the same way
        // Return empty for now
        throw new Error('listModels not supported for Anthropic provider');
    }
    /**
     * Stream chat completions using Anthropic SSE format
     * Anthropic uses: event: <type>\ndata: <json>\n\n
     */
    async *streamComplete(messages, modelId, options) {
        const url = `${this.baseUrl}/messages`;
        const requestBody = {
            model: modelId,
            messages: messages.map(m => ({
                role: m.role,
                content: m.content
            })),
            max_tokens: options?.maxTokens || 4096,
            temperature: options?.temperature,
            stream: true
        };
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify(requestBody),
            signal: options?.signal,
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Anthropic API failed: ${response.status} ${response.statusText}\n${errorText}`);
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
                // Anthropic SSE format: event: <type>\ndata: <json>\n\n
                const events = buffer.split('\n\n');
                buffer = events.pop() || '';
                for (const event of events) {
                    if (!event.trim())
                        continue;
                    const lines = event.split('\n');
                    let eventType = '';
                    let dataStr = '';
                    for (const line of lines) {
                        if (line.startsWith('event: ')) {
                            eventType = line.slice(7).trim();
                        }
                        else if (line.startsWith('data: ')) {
                            dataStr = line.slice(6);
                        }
                    }
                    if (!dataStr)
                        continue;
                    try {
                        const data = JSON.parse(dataStr);
                        switch (eventType) {
                            case 'message_start':
                                // Initial message with usage info
                                if (data.message?.usage?.input_tokens) {
                                    inputTokens = data.message.usage.input_tokens;
                                }
                                break;
                            case 'content_block_delta':
                                // Text delta
                                if (data.delta?.type === 'text_delta' && data.delta?.text) {
                                    yield {
                                        text: data.delta.text,
                                    };
                                }
                                break;
                            case 'message_delta':
                                // Final message with stop reason and output tokens
                                if (data.usage?.output_tokens) {
                                    outputTokens = data.usage.output_tokens;
                                }
                                if (data.delta?.stop_reason) {
                                    yield {
                                        text: '',
                                        finishReason: data.delta.stop_reason,
                                        usage: {
                                            prompt_tokens: inputTokens,
                                            completion_tokens: outputTokens,
                                            total_tokens: inputTokens + outputTokens,
                                        },
                                    };
                                }
                                break;
                            case 'message_stop':
                                // Stream complete
                                return;
                        }
                    }
                    catch {
                        // Skip malformed JSON
                    }
                }
            }
        }
        finally {
            reader.releaseLock();
        }
    }
}
