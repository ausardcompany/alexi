function isValidCommand(command: string): boolean {
  return typeof command === 'string' && command.trim().length > 0;
}

export function executeRemoteCommand(command: string): void {
  if (!isValidCommand(command)) {
    return;
  }
  // New streamlined logic
  // eslint-disable-next-line no-console
  console.log(`Executing: ${command}`);
}
