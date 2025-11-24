import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/**/*.{ts,tsx}'],
  format: ['cjs', 'esm'],
  dts: true,
  sourcemap: true,
  outDir: 'dist',
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
})
