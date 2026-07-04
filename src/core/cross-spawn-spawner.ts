import { tap as tapStdio, tapped } from "./kilocode/stdio-tap";

let stdout = proc.stdout ? NodeStream.fromReadable({ evaluate: () => tapped(proc, "stdout") }) : Stream.empty;
let stderr = proc.stderr ? NodeStream.fromReadable({ evaluate: () => tapped(proc, "stderr") }) : Stream.empty;
tapStdio(proc);