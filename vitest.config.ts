import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.test.ts', 'tests/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'json-summary', 'html', 'lcov'],
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.test.ts', 'src/cli/**', 'src/**/*.d.ts'],
      thresholds: {
        statements: 15,
        branches: 15,
        functions: 20,
        lines: 15,
      },
    },
    testTimeout: 10000,
  },
});
