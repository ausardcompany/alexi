import pty, { Opts } from 'node-pty';

export interface Proc {
  pid: number;
  onData(listener: (data: string) => void): void;
}

export function spawn(file: string, args: string[], opts: Opts): Proc {
  const proc = pty.spawn(file, args, {
    ...opts,
    ...(process.platform === 'win32' ? { useConptyDll: true } : {}),
  });
  return {
    pid: proc.pid,
    onData(listener) {
      proc.on('data', listener);
    },
  };
}
