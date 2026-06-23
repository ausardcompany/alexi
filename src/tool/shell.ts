// Adjusted handling for PowerShell args
return ChildProcess.make(shell, Shell.args(shell, command, cwd), {
// Additional logic to handle encoding issues with PowerShell arguments
