/**
 * Structured error types for grep/glob search diagnostics.
 * Surfaces spawn, permission, regex, and walk errors instead of silently
 * returning empty results.
 */

export interface SearchError {
  type: 'regex_invalid' | 'path_not_found' | 'permission_denied' | 'walk_error' | 'aborted';
  message: string;
  path?: string;
  details?: string;
}

const MAX_DIAGNOSTICS = 5;

export class SearchDiagnostics {
  readonly errors: SearchError[] = [];

  addError(error: SearchError): void {
    if (this.errors.length < MAX_DIAGNOSTICS) {
      this.errors.push(error);
    }
  }

  hasErrors(): boolean {
    return this.errors.length > 0;
  }

  getSummary(): string {
    if (this.errors.length === 0) {
      return '';
    }
    return this.errors
      .map((e) => `[${e.type}] ${e.message}${e.path ? ` (${e.path})` : ''}`)
      .join('\n');
  }
}
