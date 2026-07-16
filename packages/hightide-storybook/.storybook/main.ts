import path from 'node:path'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import type { StorybookConfig } from '@storybook/nextjs-vite'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const hightideRoot = path.resolve(dirname, '../../hightide')
const require = createRequire(import.meta.url)
const reactNativeWebRoot = path.dirname(require.resolve('react-native-web/package.json'))

const config: StorybookConfig = {
  stories: ['../src/stories/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-docs'],
  framework: {
    name: '@storybook/nextjs-vite',
    options: {},
  },
  docs: {},
  typescript: {
    reactDocgen: 'react-docgen-typescript'
  },
  core: {
    disableTelemetry: true,
  },
  viteFinal: async (config) => {
    const { mergeConfig } = await import('vite')
    const projectRoot = path.resolve(dirname, '..')

    return mergeConfig(config, {
      define: {
        __DEV__: JSON.stringify(true),
      },
      css: {
        postcss: path.resolve(projectRoot, 'postcss.config.mjs'),
      },
      resolve: {
        alias: {
          '@': hightideRoot,
          '@storybook-helpers': path.resolve(dirname, '../src/storybook'),
          'react-native': reactNativeWebRoot,
        },
        extensions: [
          '.web.tsx',
          '.web.ts',
          '.web.jsx',
          '.web.js',
          '.tsx',
          '.ts',
          '.jsx',
          '.js',
        ],
      },
    })
  },
}

export default config
