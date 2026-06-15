import storybook from 'eslint-plugin-storybook'
import config from '@helpwave/eslint-config'

export default [
  {
    ignores: ['dist/**', 'packages/**', 'node_modules/**'],
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
    files: ['**/*.cjs'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
  {
    // TODO add this to helpwave eslint config
    rules: {
      indent: ['warn', 2]
    }
  }
]