/**
 * Commitlint configuration for sap-bot-orchestrator repository
 * @see https://commitlint.js.org/reference/configuration.html
 */

module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Allowed commit types
    'type-enum': [
      2,
      'always',
      [
        'feat', // New features
        'fix', // Bug fixes
        'docs', // Documentation changes
        'style', // Code style changes (formatting, whitespace)
        'refactor', // Code refactoring
        'perf', // Performance improvements
        'test', // Test additions or changes
        'chore', // Maintenance tasks (dependencies, config, etc.)
        'ci', // CI/CD changes
        'revert', // Revert previous commits
      ],
    ],
    // Allowed scopes for better organization (optional)
    'scope-enum': [
      2,
      'always',
      [
        'cli', // CLI commands
        'core', // Core orchestrator logic
        'providers', // Provider plugins
        'config', // Configuration management
        'server', // HTTP server
        'agent', // Agent system
        'tools', // Tool implementations
        'ci', // CI/CD pipeline
        'deps', // Dependencies
        'tests', // Test infrastructure
      ],
    ],
    // Scope is completely optional (no warning)
    'scope-empty': [0, 'never'],
    // Allow flexible subject case (lowercase or sentence-case)
    'subject-case': [0], // Disabled to allow natural capitalization
    // Subject max length
    'subject-max-length': [2, 'always', 100],
    // Body max line length
    'body-max-line-length': [2, 'always', 300],
    // Footer max line length
    'footer-max-line-length': [2, 'always', 300],
  },
};
