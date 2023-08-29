import { defineConfig } from 'tsup';

export default defineConfig({
  entryPoints: {
    'monthpicker-lite-js': 'src/index.ts',
  },
  format: ['cjs', 'esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  minify: true,
  
  target: 'es2018',
  tsconfig: 'tsconfig.json',
  external: ['tslib'],
});