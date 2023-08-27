import { defineConfig } from 'tsup';

export default defineConfig({
  entryPoints: {
    monthpicker: 'src/index.ts',
  },
  format: ['cjs', 'esm'],
  dts: true,
  sourcemap: false,
  clean: true,
  minify: true,
  target: 'es2018',
  tsconfig: 'tsconfig.json',
  external: ['tslib'],
});