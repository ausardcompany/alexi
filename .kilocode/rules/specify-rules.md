# sap-bot-orchestrator Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-04-02

## Active Technologies
- YAML (GitHub Actions), Bash (shell scripts in composite steps) + GitHub Actions runner, Node.js 22, `actions/checkout@v4`, `actions/setup-node@v4`, `actions/upload-artifact@v4`, `actions/github-script@v7` (031-external-doc-action)
- N/A (git commits, GitHub Artifacts) (031-external-doc-action)
- TypeScript 5.9 / Node.js >= 22.12.0 / ES Modules + Ink v6.8.0, React v19.2.4, ink-text-input v6.0.0, ink-select-input v6.2.0, ink-spinner v5.0.0, marked v15.0.12, marked-terminal v7.3.0, cli-highlight v2.1.11 (032-tui-exact-clone)
- In-memory session state (no SQLite); file system for config persistence (032-tui-exact-clone)

- TypeScript 5.9 / Node.js >= 22.12.0 / ES Modules + Ink v6.8.0 (already installed), React v19.2.4 (001-tui-clone)

## Project Structure

```text
src/
tests/
```

## Commands

npm test && npm run lint

## Code Style

TypeScript 5.9 / Node.js >= 22.12.0 / ES Modules: Follow standard conventions

## Recent Changes
- 032-tui-exact-clone: Added TypeScript 5.9 / Node.js >= 22.12.0 / ES Modules + Ink v6.8.0, React v19.2.4, ink-text-input v6.0.0, ink-select-input v6.2.0, ink-spinner v5.0.0, marked v15.0.12, marked-terminal v7.3.0, cli-highlight v2.1.11
- 031-external-doc-action: Added YAML (GitHub Actions), Bash (shell scripts in composite steps) + GitHub Actions runner, Node.js 22, `actions/checkout@v4`, `actions/setup-node@v4`, `actions/upload-artifact@v4`, `actions/github-script@v7`

- 001-tui-clone: Added TypeScript 5.9 / Node.js >= 22.12.0 / ES Modules + Ink v6.8.0 (already installed), React v19.2.4

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->

<!-- SPECKIT START -->
For additional context about technologies to be used, project structure,
shell commands, and other important information, read the current plan
<!-- SPECKIT END -->
