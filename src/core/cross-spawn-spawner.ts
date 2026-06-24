const target = yield* prepareSandbox(command, dir, env(command.options));
const sin = stdin(target.options);
const sout = stdio(target.options, "stdout");
const serr = stdio(target.options, "stderr");