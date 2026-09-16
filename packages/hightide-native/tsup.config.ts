import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    'components/index': 'src/components/index.ts',
    'components/pickFileInputItems': 'src/components/user-interaction/FileInput/pickFileInputItems.ts',
    'components/pickFileInputItems.web': 'src/components/user-interaction/FileInput/pickFileInputItems.web.ts',
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
    '@react-native-documents/picker',
    '@helpwave/hightide-design',
    '@helpwave/hightide-utils',
  ],
  cjsInterop: true,
  esbuildOptions: (options) => {
    options.jsx = 'automatic'
    options.plugins = [
      ...(options.plugins ?? []),
      {
        name: 'external-pick-file-input-items',
        setup(build) {
          build.onResolve({ filter: /pickFileInputItems(\.web)?(\.tsx?)?$/ }, (args) => {
            if (args.kind === 'entry-point') {
              return undefined
            }
            return {
              path: './pickFileInputItems',
              external: true,
            }
          })
        },
      },
    ]
  },
})
