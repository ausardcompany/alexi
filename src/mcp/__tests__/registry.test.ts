/**
 * Tests for the scoped MCP runtime-status registry.
 *
 * Ports upstream kilocode commits `c58468b1c` ("clear cached MCP
 * status when a server is uninstalled") and `d395d0314` ("scoped
 * purge — only clear status entries owned by the uninstalling scope").
 */

import { beforeEach, describe, expect, it } from 'vitest';
import {
  _clearStatusCacheForTests,
  getStatus,
  listStatuses,
  setStatus,
  uninstallServer,
} from '../registry.js';

describe('mcp registry', () => {
  beforeEach(() => {
    _clearStatusCacheForTests();
  });

  it('records and reads a status entry', () => {
    setStatus({ serverId: 'srv', ownerScope: 'user', state: 'connected' });

    const entry = getStatus('srv', 'user');
    expect(entry?.state).toBe('connected');
    expect(entry?.ownerScope).toBe('user');
    expect(entry?.updatedAt).toBeGreaterThan(0);
  });

  it('scopes keys so the same server id can live in both scopes', () => {
    setStatus({ serverId: 'srv', ownerScope: 'user', state: 'connected' });
    setStatus({ serverId: 'srv', ownerScope: 'project', state: 'disconnected' });

    expect(getStatus('srv', 'user')?.state).toBe('connected');
    expect(getStatus('srv', 'project')?.state).toBe('disconnected');
    expect(listStatuses()).toHaveLength(2);
  });

  it('clears cached status when a server is uninstalled from its scope', () => {
    setStatus({ serverId: 'srv', ownerScope: 'user', state: 'connected' });
    setStatus({ serverId: 'srv', ownerScope: 'user', state: 'signed-in' });

    const removed = uninstallServer('srv', 'user');
    expect(removed).toBe(1);
    expect(getStatus('srv', 'user')).toBeUndefined();
  });

  it('does NOT purge same-id entries that belong to another scope', () => {
    setStatus({ serverId: 'srv', ownerScope: 'user', state: 'connected' });
    setStatus({ serverId: 'srv', ownerScope: 'project', state: 'connected' });

    const removed = uninstallServer('srv', 'user');
    expect(removed).toBe(1);
    expect(getStatus('srv', 'user')).toBeUndefined();
    expect(getStatus('srv', 'project')?.state).toBe('connected');
  });

  it('returns 0 and is a no-op when the server is not registered', () => {
    const removed = uninstallServer('ghost', 'user');
    expect(removed).toBe(0);
  });

  it('updates `updatedAt` on every setStatus call', async () => {
    setStatus({ serverId: 'srv', ownerScope: 'user', state: 'connecting' });
    const first = getStatus('srv', 'user')!.updatedAt;
    await new Promise((r) => setTimeout(r, 2));
    setStatus({ serverId: 'srv', ownerScope: 'user', state: 'connected' });
    const second = getStatus('srv', 'user')!.updatedAt;
    expect(second).toBeGreaterThanOrEqual(first);
  });
});
