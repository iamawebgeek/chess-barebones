import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Ensure DOM is cleaned up between tests to avoid element collisions
afterEach(() => {
  cleanup();
});
