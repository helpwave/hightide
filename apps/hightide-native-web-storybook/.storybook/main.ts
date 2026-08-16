import type { StorybookConfig } from '@storybook/react-native-web-vite'
import { createRequire } from 'node:module'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const require = createRequire(import.meta.url)
const appRoot = path.resolve(dirname, '..')
const workspaceRoot = path.resolve(appRoot, '../..')
const storiesRoot = path.resolve(appRoot, 'src')

const resolveFromApp = (specifier: string): string =>
  path.dirname(require.resolve(`${specifier}/package.json`))

const config: StorybookConfig = {
  stories: [`${storiesRoot}/**/*.stories.@(js|jsx|ts|tsx)`],
  addons: ['@storybook/addon-links', '@storybook/addon-docs'],
  framework: {
    name: '@storybook/react-native-web-vite',
    options: {
      modulesToTranspile: [
        'react-native',
        'react-native-svg',
        'lucide-react-native',
        '@react-native-async-storage/async-storage',
        '@helpwave/hightide-native',
        '@helpwave/hightide-design',
        '@helpwave/hightide-utils',
      ],
    },
  },
  docs: {},
  typescript: {
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      tsconfigPath: path.resolve(dirname, '../tsconfig.json'),
    },
  },
  core: {
    disableTelemetry: true,
  },
  async viteFinal(config) {
    const { mergeConfig } = await import('vite')

    return mergeConfig(config, {
      resolve: {
        alias: {
          'react-native': resolveFromApp('react-native-web'),
          'react-native-web': resolveFromApp('react-native-web'),
          'react-native-svg': require.resolve('react-native-svg'),
        },
        dedupe: [
          'react',
          'react-dom',
          'react-native',
          'react-native-web',
          'react-native-svg',
        ],
      },
      server: {
        fs: {
          allow: [workspaceRoot],
        },
      },
    })
  },
}

export default config
