import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    projects: ['./packages/*'],
    coverage: {
      provider: 'v8',
      exclude: [
        'docs',
        'example',
        'components',
        '**/coverage',
        '**/src/**/index.ts',
        'node_modules/**',
        '**/dist/**',
        'build/**',
        'tsup.config.ts',
        'vitest.config.ts',
        '**/*.d.ts',
      ],
    },
  },
});
