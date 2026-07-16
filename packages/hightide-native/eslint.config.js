import storybook from 'eslint-plugin-storybook'
import config from '@helpwave/eslint-config'

export default [
  {
    ignores: ['node_modules/**', 'storybook-static/**'],
  },
  ...config.recommended,
  ...storybook.configs['flat/recommended'],
  {
    files: ['**/*.stories.@(ts|tsx|js|jsx|mjs|cjs)'],
    rules: {
      'storybook/prefer-pascal-case': 'off',
    },
  },
  {
    rules: {
      indent: ['warn', 2]
    }
  }
]
