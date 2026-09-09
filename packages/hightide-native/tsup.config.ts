import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    'components/index': 'src/components/index.ts',
    'global-contexts/index': 'src/global-contexts/index.ts',
    'hooks/index': 'src/hooks/index.ts',
    'icons/index': 'src/icons/index.ts',
    'theme/index': 'src/theme/index.ts',
    'types/index': 'src/types/index.ts',
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
    'react-native',
    'react-native-svg',
    'lucide-react-native',
    '@react-native-async-storage/async-storage',
    '@helpwave/hightide-design',
    '@helpwave/hightide-utils',
  ],
  cjsInterop: true,
  esbuildOptions: (options) => {
    options.jsx = 'automatic'
  },
})
