import type { StorybookConfig } from '@storybook/react-native-web-vite'

/**
 * Storybook for the native library renders the React Native components through
 * `react-native-web`, so they can be previewed in a browser (and in CI) – the
 * same Vite-based setup the web library uses.
 *
 * To run an actual on-device Storybook instead, swap this framework for
 * `@storybook/react-native` (Metro). The stories themselves are renderer
 * agnostic and work with either.
 */
const config: StorybookConfig = {
  stories: ['../stories/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-docs'],
  framework: {
    name: '@storybook/react-native-web-vite',
    options: {},
  },
  docs: {},
  core: {
    disableTelemetry: true,
  },
}

export default config
