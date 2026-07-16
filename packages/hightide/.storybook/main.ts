import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { StorybookConfig } from '@storybook/nextjs-vite'

const dirname = path.dirname(fileURLToPath(import.meta.url))

const config: StorybookConfig = {
  stories: ['../stories/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-docs'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
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
      css: {
        postcss: path.resolve(projectRoot, 'postcss.config.mjs'),
      },
      resolve: {
        alias: {
          '@': projectRoot,
        },
      },
    })
  },
}

export default config
