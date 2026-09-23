import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    'primitive-tokens/index': 'src/primitive-tokens/index.ts',
    'theme-tokens/index': 'src/theme-tokens/index.ts',
    'semantic-tokens/index': 'src/semantic-tokens/index.ts',
    'component-tokens/index': 'src/component-tokens/index.ts',
    'resolver/index': 'src/resolver/index.ts',
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
