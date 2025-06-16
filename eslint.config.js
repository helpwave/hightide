import storybook from 'eslint-plugin-storybook'
import config from '@helpwave/eslint-config'

export default [
  {
  ignores: ['dist/**'],
},
  ...config.recommended,
  ...storybook.configs['flat/recommended'],
  {
    files: ['**/*.stories.@(ts|tsx|js|jsx|mjs|cjs)'],
    rules: {
      'storybook/prefer-pascal-case': 'off',
    },
  },
]