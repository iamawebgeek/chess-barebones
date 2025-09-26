import svgrPlugin from 'esbuild-plugin-svgr';
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  tsconfig: './tsconfig.json',
  dts: true,
  clean: true,
  outDir: 'dist',
  format: ['esm', 'cjs'],
  external: ['react', 'react-dom'],
  esbuildPlugins: [svgrPlugin()],
});
