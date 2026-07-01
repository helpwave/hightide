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
    // Keep next as a runtime dependency of the consumer app. Bundling it would embed a second
    // copy of next/link, next/image and Next's router context, so those components would read an
    // empty router context and fall back to full-page navigation instead of client-side routing.
    'next',
    /^next\//,
    'clsx',
    '@tanstack/react-table',
    '@tanstack/react-virtual',
    'lucide-react',
    'radix-ui',
    'react-custom-scrollbars-2',
    'tinycolor2',
    '@helpwave/internationalization',
  ],
  cjsInterop: true,
})
