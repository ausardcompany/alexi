```markdown
# Update Plan for Alexi

Generated: 2026-07-23
Based on upstream commits: kilocode (3cab1bd2d..2d16c00dd), opencode (0a601cf..347510a)

## Summary
- Total changes planned: 5
- Critical: 1 | High: 2 | Medium: 2 | Low: 0

## Changes

### 1. Implement Notify User Tool
**File**: `src/tool/notify-user.ts`
**Priority**: high
**Type**: feature
**Reason**: To support user notifications in remote sessions, enhancing user engagement and communication.

**New code**:
```typescript
export function notifyUser(message: string): void {
    // Logic for sending notifications
    console.log(`Notification: ${message}`);
}
```

### 2. Update Tool Registry
**File**: `src/tool/registry.ts`
**Priority**: medium
**Type**: refactor
**Reason**: To incorporate the notifyUser tool into the tool registry, ensuring it is accessible throughout the application.

**Current code**:
```typescript
const tools = {
    existingTool1: function() { /* ... */ },
    existingTool2: function() { /* ... */ },
};
```

**New code**:
```typescript
const tools = {
    existingTool1: function() { /* ... */ },
    existingTool2: function() { /* ... */ },
    notifyUser: notifyUser,
};
```

### 3. Enhance Remote Session Recovery
**File**: `src/core/session.ts`
**Priority**: critical
**Type**: bugfix
**Reason**: To fix silent session disconnections by implementing a recovery mechanism, improving session reliability.

**Current code**:
```typescript
function handleSessionDisconnection() {
    // Current handling logic
}
```

**New code**:
```typescript
function handleSessionDisconnection() {
    tryReconnect(); // Attempt to reconnect
    notifyUser('Session reconnected'); // Notify the user
}

function tryReconnect() {
    // Logic to reconnect the session
}
```

### 4. Support Dual-Server Compatibility
**File**: `src/core/server.ts`
**Priority**: high
**Type**: feature
**Reason**: To accommodate dual-server setups, expanding deployment options and improving scalability.

**New code**:
```typescript
function initializeServers(serverConfigs: ServerConfig[]) {
    serverConfigs.forEach(config => {
        startServer(config);
    });
}

function startServer(config: ServerConfig) {
    // Server initialization logic
}
```

### 5. Refactor Mistral Prompt Cache Key
**File**: `src/providers/mistral.ts`
**Priority**: medium
**Type**: refactor
**Reason**: To align with upstream changes for prompt cache key serialization, ensuring compatibility with the latest provider SDK.

**Current code**:
```typescript
function generatePrompt(options) {
    // Existing prompt generation logic
}
```

**New code**:
```typescript
function generatePrompt(options) {
    options.promptCacheKey = options.providerOptions.mistral.promptCacheKey;
    // Updated prompt generation logic
}
```

## Testing Recommendations
- Test notification delivery in remote sessions.
- Validate session recovery logic under disconnection scenarios.
- Verify dual-server initialization and operation.
- Ensure Mistral provider integrations are functioning with updated cache key handling.

## Potential Risks
- Notification system may introduce user distractions if overused.
- Session recovery logic may inadvertently cause reconnection loops if not properly handled.
- Dual-server setups may require additional configuration for seamless operation.
```
{"prompt_tokens":16379,"completion_tokens":762,"total_tokens":17141,"cache_read_input_tokens":0}

[Session: 360991d7-a2f8-4783-a663-d097bc9f78ae]
[Messages: 2, Tokens: 17141]
