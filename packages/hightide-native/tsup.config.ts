import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  outDir: 'dist',
  dts: true,
  sourcemap: true,
  clean: true,
  splitting: false,
  minify: false,
  target: 'es2020',
  external: [
    'react',
    'react-native',
    'nativewind',
    'react/jsx-runtime',
  ],
})
