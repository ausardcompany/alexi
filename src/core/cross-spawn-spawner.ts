import { tap as tapStdio, tapped } from './kilocode/stdio-tap';

const stdout = proc.stdout
  ? NodeStream.fromReadable({ evaluate: () => tapped(proc, 'stdout') })
  : Stream.empty;
const stderr = proc.stderr
  ? NodeStream.fromReadable({ evaluate: () => tapped(proc, 'stderr') })
  : Stream.empty;
tapStdio(proc);
