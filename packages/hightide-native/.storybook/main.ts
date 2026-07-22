import type { StorybookConfig } from '@storybook/react-native-web-vite'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const dirname = path.dirname(fileURLToPath(import.meta.url))

const config: StorybookConfig = {
  stories: ['../stories/**/*.stories.@(js|jsx|ts|tsx)'],
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
      tsconfigPath: path.resolve(dirname, '../tsconfig.storybook.json'),
    },
  },
  core: {
    disableTelemetry: true,
  },
  viteFinal: async (config) => {
    const { mergeConfig } = await import('vite')
    const projectRoot = path.resolve(dirname, '..')

    return mergeConfig(config, {
      resolve: {
        alias: {
          '@': projectRoot,
        },
      },
    })
  },
}

export default config
