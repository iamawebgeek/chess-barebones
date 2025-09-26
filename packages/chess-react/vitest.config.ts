import { defineProject } from 'vitest/config';

import rootConfig from '../../vitest.config';

export default defineProject({
  test: {
    include: ['src/**/*.test.{ts,tsx}'],
    environment: 'jsdom',
    setupFiles: ['setupTests.ts'],
    // @ts-expect-error
    coverage: {
      exclude: [
        ...(rootConfig.test?.coverage?.exclude ?? []),
        'src/**/index.{ts,tsx}',
      ],
    },
  },
});
