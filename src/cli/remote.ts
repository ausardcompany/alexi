function executeRemoteCommand(command: string): void {
    if (!isValidCommand(command)) return;
    // New streamlined logic
    console.log(`Executing: ${command}`);
}
