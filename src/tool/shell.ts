return ChildProcess.make(shell, Shell.args(shell, command, cwd), {
    // kilocode_change - encoded PowerShell args
    cwd,
    env,
    stdin: "ignore",
