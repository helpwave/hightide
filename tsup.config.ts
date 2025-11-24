import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'], // explicit main entry
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
    'lucide-react',
    'radix-ui',
    'react-custom-scrollbars-2',
    'tinycolor2',
    '@helpwave/internationalization',
  ],
  cjsInterop: true,
})
