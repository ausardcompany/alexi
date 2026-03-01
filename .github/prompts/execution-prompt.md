# Execution Task: Apply Update Plan to SAP Bot Orchestrator

You are an expert software developer. Your task is to execute the update plan below precisely.

## Update Plan to Execute

[dotenv@17.3.1] injecting env (3) from .env -- tip: ⚙️  write to custom object with { processEnv: myObject }
# Update Plan for SAP Bot Orchestrator

Generated: 2026-02-28 19:50:34
Based on upstream commits: kilocode 84978099, opencode c12ce2f, a94f564, dfa0281, a325c9a, 1f108bc, 7e6a007

## Summary
- Total changes planned: 8
- Critical: 1 | High: 3 | Medium: 3 | Low: 1

## Changes

### 1. Fix notification filtering for CLI-only notifications
**File**: `src/core/notifications.ts`
**Priority**: critical
**Type**: bugfix
**Reason**: Prevents CLI-only notifications from appearing in wrong clients, matching kilocode fix 84978099

**Current code**:
```typescript
export function getNotifications(clientType?: string): Notification[] {
  return notifications.filter(n => n.active);
}
```

**New code**:
```typescript
export function getNotifications(clientType?: string): Notification[] {
  return notifications.filter(n => {
    if (!n.active) return false;
    if (!clientType || !n.showIn) return true;
    return n.showIn.includes(clientType);
  });
}
```

### 2. Add permission auto-accept functionality
**File**: `src/permission/auto-accept.ts`
**Priority**: high
**Type**: feature
**Reason**: Enables automated permission handling for streamlined SAP workflows, from opencode 7e6a007

**New code**:
```typescript
export interface AutoAcceptConfig {
  enabled: boolean;
  allowedPermissions: string[];
  excludePatterns?: string[];
}

export class PermissionAutoAcceptor {
  private config: AutoAcceptConfig;

  constructor(config: AutoAcceptConfig) {
    this.config = config;
  }

  shouldAutoAccept(permission: PermissionRequest): boolean {
    if (!this.config.enabled) return false;
    
    if (this.config.excludePatterns?.some(pattern => 
      permission.resource.match(new RegExp(pattern)))) {
      return false;
    }
    
    return this.config.allowedPermissions.includes(permission.type);
  }

  async processPermission(permission: PermissionRequest): Promise<boolean> {
    if (this.shouldAutoAccept(permission)) {
      await this.acceptPermission(permission);
      return true;
    }
    return false;
  }

  private async acceptPermission(permission: PermissionRequest): Promise<void> {
    // Auto-accept logic for SAP-specific permissions
    permission.status = 'accepted';
    permission.acceptedAt = new Date();
  }
}
```

### 3. Enhance remote workspace support
**File**: `src/core/workspace-manager.ts`
**Priority**: high
**Type**: feature
**Reason**: Adds remote workspace capabilities for SAP cloud environments, from opencode c12ce2f

**Current code**:
```typescript
export class WorkspaceManager {
  async loadWorkspace(path: string): Promise<Workspace> {
    return new LocalWorkspace(path);
  }
}
```

**New code**:
```typescript
export interface RemoteWorkspaceConfig {
  host: string;
  port: number;
  username?: string;
  password?: string;
  keyPath?: string;
}

export class WorkspaceManager {
  async loadWorkspace(path: string, remote?: RemoteWorkspaceConfig): Promise<Workspace> {
    if (remote) {
      return new RemoteWorkspace(path, remote);
    }
    return new LocalWorkspace(path);
  }

  async connectRemoteWorkspace(config: RemoteWorkspaceConfig): Promise<RemoteWorkspace> {
    const connection = await this.establishConnection(config);
    return new RemoteWorkspace(config.host, config, connection);
  }

  private async establishConnection(config: RemoteWorkspaceConfig): Promise<Connection> {
    // SAP-specific remote connection logic
    const auth = config.password 
      ? { username: config.username, password: config.password }
      : { username: config.username, privateKey: await readFile(config.keyPath!) };
    
    return new SSHConnection(config.host, config.port, auth);
  }
}
```

### 4. Add skill name display in tool calls
**File**: `src/tool/skill-display.ts`
**Priority**: medium
**Type**: feature
**Reason**: Improves debugging and monitoring of SAP skill execution, from opencode 2a20822

**New code**:
```typescript
export interface SkillToolCall {
  id: string;
  skillName: string;
  toolName: string;
  parameters: Record<string, any>;
  timestamp: Date;
}

export function formatSkillToolCall(call: SkillToolCall): string {
  return `[${call.skillName}] ${call.toolName}(${Object.keys(call.parameters).join(', ')})`;
}

export function logSkillToolCall(call: SkillToolCall): void {
  const formatted = formatSkillToolCall(call);
  console.log(`Tool Call: ${formatted} at ${call.timestamp.toISOString()}`);
}
```

### 5. Enhance comment and annotation system
**File**: `src/core/comments.ts`
**Priority**: medium
**Type**: feature
**Reason**: Adds code comment functionality for SAP code review workflows, adapted from opencode comment system

**New code**:
```typescript
export interface CodeComment {
  id: string;
  lineNumber: number;
  content: string;
  author: string;
  timestamp: Date;
  resolved: boolean;
  filePath: string;
}

export interface CommentAnnotation {
  range: { start: number; end: number };
  type: 'info' | 'warning' | 'error' | 'suggestion';
  message: string;
}

export class CommentManager {
  private comments: Map<string, CodeComment[]> = new Map();

  addComment(filePath: string, comment: Omit<CodeComment, 'id' | 'timestamp'>): string {
    const fullComment: CodeComment = {
      ...comment,
      id: crypto.randomUUID(),
      timestamp: new Date()
    };

    const fileComments = this.comments.get(filePath) || [];
    fileComments.push(fullComment);
    this.comments.set(filePath, fileComments);

    return fullComment.id;
  }

  getCommentsForFile(filePath: string): CodeComment[] {
    return this.comments.get(filePath) || [];
  }

  resolveComment(commentId: string): boolean {
    for (const [filePath, comments] of this.comments.entries()) {
      const comment = comments.find(c => c.id === commentId);
      if (comment) {
        comment.resolved = true;
        return true;
      }
    }
    return false;
  }
}
```

### 6. Update agent translator configuration
**File**: `src/agent/translator.ts`
**Priority**: medium
**Type**: bugfix
**Reason**: Updates model reference to match upstream change in opencode translator agent

**Current code**:
```typescript
export const translatorConfig = {
  model: 'opencode/gemini-3.1-pro',
  mode: 'subagent'
};
```

**New code**:
```typescript
export const translatorConfig = {
  model: 'opencode/gemini-3-pro',
  mode: 'subagent'
};
```

### 7. Add bash output selectability
**File**: `src/cli/output-handler.ts`
**Priority**: low
**Type**: feature
**Reason**: Improves CLI user experience for SAP command outputs, from opencode 1f2348c

**Current code**:
```typescript
export function renderBashOutput(output: string): void {
  console.log(output);
}
```

**New code**:
```typescript
export function renderBashOutput(output: string, selectable: boolean = true): void {
  if (selectable && process.stdout.isTTY) {
    // Enable text selection in terminal output
    process.stdout.write('\x1b[?25h'); // Show cursor
    console.log(output);
  } else {
    console.log(output);
  }
}
```

### 8. Add recent projects to command palette
**File**: `src/cli/command-palette.ts`
**Priority**: high
**Type**: feature
**Reason**: Enhances SAP project navigation, adapted from opencode 1f108bc

**New code**:
```typescript
export interface RecentProject {
  path: string;
  name: string;
  lastAccessed: Date;
  sapSystem?: string;
}

export class CommandPalette {
  private recentProjects: RecentProject[] = [];

  addRecentProject(project: Omit<RecentProject, 'lastAccessed'>): void {
    const existing = this.recentProjects.findIndex(p => p.path === project.path);
    const recentProject: RecentProject = {
      ...project,
      lastAccessed: new Date()
    };

    if (existing >= 0) {
      this.recentProjects[existing] = recentProject;
    } else {
      this.recentProjects.unshift(recentProject);
    }

    // Keep only last 10 projects
    this.recentProjects = this.recentProjects.slice(0, 10);
  }

  getRecentProjects(): RecentProject[] {
    return this.recentProjects.sort((a, b) => 
      b.lastAccessed.getTime() - a.lastAccessed.getTime()
    );
  }

  searchProjects(query: string): RecentProject[] {
    const lowercaseQuery = query.toLowerCase();
    return this.recentProjects.filter(p => 
      p.name.toLowerCase().includes(lowercaseQuery) ||
      p.path.toLowerCase().includes(lowercaseQuery) ||
      p.sapSystem?.toLowerCase().includes(lowercaseQuery)
    );
  }
}
```

## Testing Recommendations
- Test notification filtering with different client types (CLI, extension, web)
- Verify permission auto-accept functionality with SAP-specific permissions
- Test remote workspace connections with SAP cloud environments
- Validate skill tool call logging and display formatting
- Test comment system with SAP code review workflows
- Verify recent projects functionality with SAP project structures

## Potential Risks
- Remote workspace feature may require additional security considerations for SAP environments
- Permission auto-accept could bypass required security checks if misconfigured
- Model change in translator may affect existing SAP-specific translations
- New comment system may conflict with existing SAP code review tools
{"prompt_tokens":10756,"completion_tokens":2676,"total_tokens":13432}

[Session: 14e5b46e-eb34-45a5-9431-39c10b9930ec]
[Messages: 2, Tokens: 13432]

## Execution Instructions

1. **Execute each change** in the plan above in order of priority (critical → high → medium → low)
2. **Make exact code changes** as specified in the plan
3. **Maintain SAP AI Core compatibility** - do not break existing integrations
4. **Follow existing code style** in this repository
5. **Create changes summary** at `.github/reports/changes-summary.md` with:
   - List of files modified
   - Summary of each change made
   - Any issues encountered

## Important

- Do NOT skip any items in the plan
- Do NOT add extra changes not in the plan
- Do NOT ask questions - just execute
- If a file doesn't exist, create it
- If code context is unclear, use your best judgment based on the plan

Execute the entire plan now.
