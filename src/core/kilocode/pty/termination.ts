import { spawn } from 'child_process';
import { setTimeout as sleep } from 'node:timers/promises';

export type Process = Pick<Proc, 'pid' | 'onExit' | 'kill'>;
export type Runtime = {
    readonly platform: NodeJS.Platform;
    readonly taskkill: (file: string, args: string[], opts: { stdio: 'ignore'; windowsHide: true; timeout: number }) => Promise<boolean>;
    readonly tree: () => Promise<Array<{ pid: number; parent: number }>>;
    readonly alive: (pid: number) => boolean;
    readonly signal: (pid: number, signal: 'SIGTERM' | 'SIGKILL') => void;
    readonly sleep: (ms: number) => Promise<void>;
}