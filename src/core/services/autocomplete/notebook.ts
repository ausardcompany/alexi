import * as vscode from 'vscode';

export interface NotebookContext {
  contents: string;
  filepath: string;
  position: vscode.Position;
}

const resolutions = new WeakMap<vscode.Uri, NotebookResolution>();

function resolveNotebook(uri: vscode.Uri): NotebookResolution | undefined {
  const cached = resolutions.get(uri);
  // ... logic to resolve notebook
}

// ... further implementation
