# Contributing to Alexi

Thank you for your interest in contributing to Alexi! This document provides guidelines and instructions for contributing.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Code Style](#code-style)
- [Testing](#testing)
- [Pull Request Process](#pull-request-process)
- [Commit Messages](#commit-messages)

## Code of Conduct

Please be respectful and professional in all interactions. We welcome contributions from everyone.

## Getting Started

### Prerequisites

- Node.js 22.x or higher
- npm 9.x or higher
- Git

### Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/alexi.git
   cd alexi
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Copy environment variables:
   ```bash
   cp .env.example .env
   ```

5. Verify setup:
   ```bash
   npm run build
   npm test
   ```

## Development Workflow

### Running in Development Mode

```bash
npm run dev
```

### Building

```bash
npm run build
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

### Linting and Formatting

```bash
# Run ESLint
npm run lint

# Fix ESLint issues
npm run lint:fix

# Check formatting
npm run format:check

# Fix formatting
npm run format

# Type check
npm run typecheck
```

## Code Style

We use ESLint and Prettier to enforce consistent code style.

### TypeScript Guidelines

- Use TypeScript strict mode
- Avoid `any` type when possible - use specific types or generics
- Use meaningful variable and function names
- Add JSDoc comments for public APIs
- Keep functions small and focused

### File Organization

```
src/
├── cli/          # CLI entry point and commands
├── core/         # Core orchestration logic
├── providers/    # LLM provider implementations
├── router/       # Auto-routing system
├── tool/         # Tool system
├── agent/        # Agent system
├── bus/          # Event bus
├── permission/   # Permission system
└── ...
```

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Variables | camelCase | `userName` |
| Functions | camelCase | `getUserName()` |
| Classes | PascalCase | `UserManager` |
| Constants | UPPER_SNAKE_CASE | `MAX_RETRIES` |
| Files | kebab-case | `user-manager.ts` |

## Testing

### Test Structure

Tests are located in the `tests/` directory:

```
tests/
├── codemie-features.test.ts
├── mcp-config.test.ts
├── skill.test.ts
├── workflow.test.ts
└── ...
```

### Writing Tests

- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)
- Mock external dependencies
- Test edge cases and error scenarios

Example:

```typescript
import { describe, it, expect, vi } from 'vitest';

describe('MyFunction', () => {
  it('should return expected result when given valid input', () => {
    // Arrange
    const input = 'test';
    
    // Act
    const result = myFunction(input);
    
    // Assert
    expect(result).toBe('expected');
  });
});
```

### Coverage Requirements

Minimum coverage thresholds:
- Statements: 30%
- Branches: 30%
- Functions: 30%
- Lines: 30%

## Pull Request Process

1. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write code
   - Add tests
   - Update documentation if needed

3. **Ensure quality**
   ```bash
   npm run lint
   npm run typecheck
   npm test
   ```

4. **Commit your changes** (see [Commit Messages](#commit-messages))

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create Pull Request**
   - Use a clear, descriptive title
   - Fill out the PR template
   - Link related issues

7. **Address review feedback**
   - Make requested changes
   - Push additional commits

## Commit Messages

We follow [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Format

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types

| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation changes |
| `style` | Code style changes (formatting, etc.) |
| `refactor` | Code refactoring |
| `test` | Adding or updating tests |
| `chore` | Maintenance tasks |
| `perf` | Performance improvements |
| `ci` | CI/CD changes |

### Examples

```bash
feat(router): add support for custom routing rules

fix(providers): handle timeout errors in bedrock provider

docs: update README with new CLI commands

test(orchestrator): add unit tests for session management
```

## Questions?

If you have questions, please:
1. Check existing issues
2. Create a new issue with the `question` label
3. Join discussions in existing PRs

Thank you for contributing!
