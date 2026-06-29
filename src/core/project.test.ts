import { expect } from 'vitest';
import { remoteID } from '../src/utils';

describe('Project Tests', () => {
  it('validates project ID against new repository URL', () => {
    const a = { id: remoteID('example.com/owner/repo') };
    const b = { id: a.id };
    expect(a.id).toBe(remoteID('example.com/owner/repo'));
    expect(b.id).toBe(a.id);
  });
});
