import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    'context/index': 'src/context/index.ts',
    'context/localization/index': 'src/context/localization/index.ts',
    'context/translation/index': 'src/context/translation/index.ts',
    'context/theme/index': 'src/context/theme/index.ts',
    'context/debug/index': 'src/context/debug/index.ts',
    'hooks/index': 'src/hooks/index.ts',
    'i18n/index': 'src/i18n/index.ts',
    'utils/index': 'src/utils/index.ts',
  },
  format: ['cjs', 'esm'],
  outDir: 'dist',
  dts: true,
  sourcemap: true,
  clean: true,
  splitting: true,
  minify: false,
  target: 'es2022',
  external: [
    'react',
    '@helpwave/internationalization',
  ],
  cjsInterop: true,
})
