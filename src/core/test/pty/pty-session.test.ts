import { describe, it, expect } from 'vitest';
import { PTYSession } from '../pty/termination';

// Expanded pty session tests to cover termination logic

describe('PTYSession Termination Handling', () => {
  it('should terminate PTY gracefully', async () => {
    const session = new PTYSession();
    const result = await session.terminate('SIGTERM');
    expect(result).toBe('terminated gracefully');
  });

  it('should forcefully terminate PTY', async () => {
    const session = new PTYSession();
    const result = await session.terminate('SIGKILL');
    expect(result).toBe('terminated forcefully');
  });
});
