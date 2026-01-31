import storybook from 'eslint-plugin-storybook'
import config from '@helpwave/eslint-config'

export default [
  {
    ignores: ['dist/**', 'security-patches/**', 'node_modules/**'],
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
    ignores: ['src/i18n/translations.ts'],
  },
  {
    // TODO add this to helpwave eslint config
    rules: {
      indent: ['warn', 2]
    }
  }
]