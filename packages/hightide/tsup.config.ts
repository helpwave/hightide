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
  target: 'es2022',
  external: [
    'react',
    'react-dom',
    'clsx',
    '@tanstack/react-table',
    '@tanstack/react-virtual',
    'lucide-react',
    '@helpwave/internationalization',
    '@helpwave/hightide-utils',
  ],
  cjsInterop: true,
})
