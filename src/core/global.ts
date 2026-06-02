export interface Interface {
  readonly tmp: string;
  readonly bin: string;
  readonly log: string;
  readonly repos: string; // Added repos handling
}

export function make(input: Partial<Interface> = {}): Interface {
  return {
    tmp: Path.tmp,
    bin: Path.bin,
    log: Path.log,
    repos: Path.repos, // Ensure repos directory is initialized
    ...input,
  };
}