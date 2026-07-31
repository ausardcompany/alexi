import { describe, it, expect } from 'vitest';
import { ToolShell } from './shell';

// Expanded and updated shell signal tests

describe('ToolShell Signal Handling', () => {
    it('should handle SIGTERM gracefully', () => {
        const shell = new ToolShell();
        const result = shell.handleSignal('SIGTERM');
        expect(result).toBe('terminated gracefully');
    });

    it('should handle SIGKILL with forceful termination', () => {
        const shell = new ToolShell();
        const result = shell.handleSignal('SIGKILL');
        expect(result).toBe('terminated forcefully');
    });
});