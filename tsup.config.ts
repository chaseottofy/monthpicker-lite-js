import { defineConfig } from 'tsup';

export default defineConfig({
  entryPoints: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  sourcemap: false,
  clean:true,
  splitting: true,
  minify: true,
  target: 'es2018',
  tsconfig: 'tsconfig.json',
  external: ['tslib'],
})