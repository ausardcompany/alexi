// Updated shell logic to support nuanced signal handling

export class ToolShell {
    handleSignal(signal: string): string {
        if (signal === 'SIGTERM') {
            return 'terminated gracefully';
        }
        if (signal === 'SIGKILL') {
            return 'terminated forcefully';
        }
        return 'unknown signal';
    }
}