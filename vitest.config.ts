import { resolve } from 'node:path';
import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  // swc вместо esbuild: Nest DI требует emitDecoratorMetadata
  plugins: [swc.vite({ module: { type: 'es6' } })],
  resolve: {
    alias: [{ find: /^src\//, replacement: resolve(__dirname, 'src') + '/' }],
  },
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.spec.ts'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts'],
      reportsDirectory: './coverage',
    },
  },
});
