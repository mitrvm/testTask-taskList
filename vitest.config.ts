import path from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '~app': path.resolve('src/app'),
      '~entities': path.resolve('src/entities'),
      '~features': path.resolve('src/features'),
      '~pages': path.resolve('src/pages'),
      '~shared': path.resolve('src/shared'),
      '~widgets': path.resolve('src/widgets'),
      '~constants': path.resolve('src/constants'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: 'setup.ts',
  },
});
