# Background Tasks Feature

## Overview

Alexi now supports experimental background task execution, allowing long-running subagent tasks to run asynchronously while you continue working.

## Quick Start

### Enable the Feature

```bash
export ALEXI_EXPERIMENTAL_BACKGROUND_TASKS=true
```

### Create a Background Task

In Alexi chat:
```
task({
  prompt: "Analyze the entire codebase for security vulnerabilities",
  description: "Security audit",
  subagent_type: "general",
  background: true
})
```

The task will return immediately with a task ID:
```
Task abc123 queued for background execution
Use task_status tool to check progress
```

### Check Task Status

```
task_status({ taskId: "abc123" })
```

Returns:
```json
{
  "found": true,
  "taskId": "abc123",
  "status": "running",
  "description": "Analyze the entire codebase...",
  "startedAt": "2026-05-15T10:30:00.000Z"
}
```

## Task Lifecycle

Tasks progress through these states:

1. **queued** - Task is waiting to start
2. **running** - Task is currently executing
3. **completed** - Task finished successfully (check `result` field)
4. **failed** - Task encountered an error (check `error` field)
5. **cancelled** - Task was cancelled (future feature)

## Available Tools

### `task` Tool

Enhanced with background execution support.

**Parameters**:
- `prompt` (required): The task for the agent to perform
- `description` (required): Short 3-5 word description
- `subagent_type` (optional): 'general' or 'explore' (default: 'explore')
- `task_id` (optional): Resume a previous task
- `background` (optional): Run in background (requires feature flag)

**Example**:
```javascript
task({
  prompt: "Research and document all API endpoints",
  description: "API documentation",
  subagent_type: "general",
  background: true
})
```

### `task_status` Tool

Query the status of background tasks.

**Parameters**:
- `taskId` (required): The task identifier

**Returns**:
- `found`: Whether the task exists
- `taskId`: Task identifier
- `status`: Current status
- `description`: Task description
- `result`: Result if completed
- `error`: Error message if failed
- `startedAt`: Start timestamp
- `completedAt`: Completion timestamp

**Example**:
```javascript
task_status({ taskId: "abc123" })
```

## Use Cases

### Long-Running Analysis

```javascript
// Start comprehensive codebase analysis
task({
  prompt: "Analyze all files for code quality issues, security vulnerabilities, and performance bottlenecks. Generate a detailed report.",
  description: "Full code audit",
  subagent_type: "general",
  background: true
})
// Returns: { taskId: "xyz789", status: "queued" }

// Continue working on other tasks...

// Check progress later
task_status({ taskId: "xyz789" })
// Returns: { status: "running", ... }
```

### Parallel Research

```javascript
// Start multiple research tasks in parallel
const task1 = task({
  prompt: "Research best practices for React testing",
  description: "React testing research",
  background: true
})

const task2 = task({
  prompt: "Research TypeScript performance optimization",
  description: "TS optimization research",
  background: true
})

// Check both tasks
task_status({ taskId: task1.taskId })
task_status({ taskId: task2.taskId })
```

### Code Exploration

```javascript
// Use explore agent for fast codebase navigation
task({
  prompt: "Find all database query implementations and list their locations",
  description: "Database query search",
  subagent_type: "explore",
  background: true
})
```

## Configuration

### Environment Variables

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `ALEXI_EXPERIMENTAL_BACKGROUND_TASKS` | boolean | `false` | Enable background task execution |

### Agent Types

- **general** (`code` agent): Full-featured agent for complex, multi-step tasks
- **explore** (default): Fast agent optimized for codebase exploration

## Current Limitations

> **Note**: This is an experimental feature with a stub implementation.

Current limitations:
- Tasks execute in-process (not true background workers)
- No persistent queue (tasks lost on restart)
- No task cancellation
- No concurrent task limits
- Stub implementation simulates completion after 1 second

## Future Enhancements

Planned improvements:
- ✨ True background worker processes
- ✨ Persistent task queue (Redis/SQLite)
- ✨ Task cancellation support
- ✨ Progress callbacks and streaming
- ✨ Task prioritization
- ✨ Concurrent task limits
- ✨ Task dependencies
- ✨ UI integration with task list view

## Testing

Run the test suite:
```bash
npm test -- tests/tool/tools/background-tasks.test.ts
```

Test coverage includes:
- Foreground vs background execution
- Feature flag behavior
- Task status queries
- Security (subagent nesting prevention)
- Task lifecycle and completion

## Backward Compatibility

✅ **Fully backward compatible**

- Background parameter is optional
- Task tool works exactly as before without `background: true`
- Feature is opt-in via environment variable
- No breaking changes to existing functionality

## Examples

### Basic Foreground Task (Traditional)

```javascript
// Works exactly as before
task({
  prompt: "Quick analysis of current file",
  description: "File analysis"
})
// Completes immediately
```

### Background Task with Status Polling

```javascript
// Start background task
const result = task({
  prompt: "Comprehensive security audit of entire project",
  description: "Security audit",
  background: true
})

const taskId = result.taskId

// Poll for completion
const interval = setInterval(() => {
  const status = task_status({ taskId })
  
  if (status.status === 'completed') {
    console.log('Result:', status.result)
    clearInterval(interval)
  } else if (status.status === 'failed') {
    console.error('Error:', status.error)
    clearInterval(interval)
  } else {
    console.log('Status:', status.status)
  }
}, 5000) // Check every 5 seconds
```

### Resume Task Session

```javascript
// Start task
const task1 = task({
  prompt: "First question",
  description: "Initial query"
})

// Continue conversation
task({
  prompt: "Follow-up question based on previous answer",
  description: "Follow-up",
  task_id: task1.taskId
})
```

## Troubleshooting

### Background tasks not working

**Problem**: Tasks complete immediately instead of running in background

**Solution**: Ensure feature flag is enabled:
```bash
export ALEXI_EXPERIMENTAL_BACKGROUND_TASKS=true
```

### Task not found

**Problem**: `task_status` returns `found: false`

**Possible causes**:
- Task ID is incorrect
- Task was created in a different session
- Application was restarted (tasks not persisted)

### Subagent nesting error

**Problem**: "Task tool is not available for subagent sessions"

**Solution**: This is intentional - subagents cannot spawn other subagents to prevent infinite recursion.

## API Reference

### TaskStatus Type

```typescript
type TaskStatus = 'queued' | 'running' | 'completed' | 'failed' | 'cancelled'
```

### TaskResult Interface

```typescript
interface TaskResult {
  taskId: string
  agentId: string
  response: string
  completed: boolean
  status?: TaskStatus
  background?: boolean
}
```

### TaskInfo Interface

```typescript
interface TaskInfo {
  found: boolean
  taskId?: string
  status?: TaskStatus
  description?: string
  result?: string
  error?: string
  startedAt?: Date
  completedAt?: Date
  message?: string
}
```

## Contributing

To implement full background execution:

1. **Worker Process Manager**: Spawn separate Node.js processes
2. **Task Queue**: Implement persistent queue (Redis/SQLite)
3. **LLM Integration**: Connect to orchestrator for actual execution
4. **UI**: Add task list view and status indicators

See `.github/reports/changes-summary.md` for detailed implementation notes.

## Support

For issues or questions:
- Check test suite for usage examples
- Review implementation in `src/tool/tools/task.ts`
- See detailed docs in `.github/reports/`

---

**Status**: Experimental  
**Added**: 2026-05-15  
**Requires**: Node.js >= 22.12.0  
