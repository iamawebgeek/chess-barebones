import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  tsconfig: './tsconfig.build.json',
  dts: true,
  clean: true,
  outDir: 'dist',
  format: ['esm', 'cjs'],
});
