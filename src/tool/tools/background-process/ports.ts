/**
 * Background Process Port Management
 * Based on upstream kilocode port allocation (138 new lines)
 *
 * Handles port allocation and availability checking for background processes
 */

import * as net from 'net';

export namespace BackgroundProcessPorts {
  const MIN_PORT = 3000;
  const MAX_PORT = 9999;
  const allocatedPorts = new Set<number>();

  /**
   * Allocate a port, optionally trying a preferred port first
   */
  export async function allocate(preferred?: number): Promise<number> {
    // Try preferred port first
    if (preferred && !allocatedPorts.has(preferred)) {
      const available = await isAvailable(preferred);
      if (available) {
        allocatedPorts.add(preferred);
        return preferred;
      }
    }

    // Find next available port
    for (let port = MIN_PORT; port <= MAX_PORT; port++) {
      if (allocatedPorts.has(port)) {
        continue;
      }

      const available = await isAvailable(port);
      if (available) {
        allocatedPorts.add(port);
        return port;
      }
    }

    throw new Error('No available ports in range');
  }

  /**
   * Release a previously allocated port
   */
  export function release(port: number): void {
    allocatedPorts.delete(port);
  }

  /**
   * Check if a port is available
   */
  export async function isAvailable(port: number): Promise<boolean> {
    return new Promise((resolve) => {
      const server = net.createServer();

      server.once('error', () => {
        resolve(false);
      });

      server.once('listening', () => {
        server.close(() => {
          resolve(true);
        });
      });

      server.listen(port, '127.0.0.1');
    });
  }

  /**
   * Get all currently allocated ports
   */
  export function getAllocated(): number[] {
    return Array.from(allocatedPorts);
  }

  /**
   * Clear all port allocations
   */
  export function clearAll(): void {
    allocatedPorts.clear();
  }

  /**
   * Check if a port is allocated
   */
  export function isAllocated(port: number): boolean {
    return allocatedPorts.has(port);
  }

  /**
   * Find multiple available ports
   */
  export async function allocateMultiple(count: number, preferred?: number[]): Promise<number[]> {
    const ports: number[] = [];

    // Try preferred ports first
    if (preferred) {
      for (const port of preferred) {
        if (ports.length >= count) break;
        if (!allocatedPorts.has(port)) {
          const available = await isAvailable(port);
          if (available) {
            allocatedPorts.add(port);
            ports.push(port);
          }
        }
      }
    }

    // Allocate remaining ports
    while (ports.length < count) {
      const port = await allocate();
      ports.push(port);
    }

    return ports;
  }

  /**
   * Release multiple ports
   */
  export function releaseMultiple(ports: number[]): void {
    for (const port of ports) {
      release(port);
    }
  }
}
