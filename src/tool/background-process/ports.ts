/**
 * Background Process Port Management
 * Manage ports used by background processes
 * Based on kilocode/opencode port management patterns
 */

import * as net from 'net';

export namespace Ports {
  const usedPorts = new Set<number>();

  export function isAvailable(port: number): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      const server = net.createServer();

      server.once('error', () => {
        resolve(false);
      });

      server.once('listening', () => {
        server.close();
        resolve(true);
      });

      server.listen(port, '127.0.0.1');
    });
  }

  export function reserve(port: number): void {
    usedPorts.add(port);
  }

  export function release(port: number): void {
    usedPorts.delete(port);
  }

  export async function findAvailable(startPort: number = 3000): Promise<number> {
    let port = startPort;
    while (port < 65535) {
      if (!usedPorts.has(port)) {
        const available = await isAvailable(port);
        if (available) {
          reserve(port);
          return port;
        }
      }
      port++;
    }
    throw new Error('No available ports found');
  }

  export async function waitForPort(port: number, timeout: number = 30000): Promise<void> {
    const startTime = Date.now();
    while (Date.now() - startTime < timeout) {
      const available = await isAvailable(port);
      if (!available) {
        // Port is in use, meaning the server started
        return;
      }
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
    throw new Error(`Timeout waiting for port ${port}`);
  }

  export function isReserved(port: number): boolean {
    return usedPorts.has(port);
  }

  export function getReservedPorts(): number[] {
    return Array.from(usedPorts);
  }

  export function clearReserved(): void {
    usedPorts.clear();
  }
}
