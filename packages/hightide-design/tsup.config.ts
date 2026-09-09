import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    'primitive-tokens/index': 'src/primitive-tokens/index.ts',
    'theme-tokens/index': 'src/theme-tokens/index.ts',
    'semantic-token-resolvers/index': 'src/semantic-token-resolvers/index.ts',
    'component-token-resolvers/index': 'src/component-token-resolvers/index.ts',
    'design-system/index': 'src/design-system/index.ts',
    'utils/index': 'src/utils/index.ts',
  },
  format: ['cjs', 'esm'],
  outDir: 'dist',
  dts: true,
  sourcemap: true,
  clean: true,
  splitting: false,
  minify: false,
  target: 'es2022',
  cjsInterop: true,
})
