import storybook from 'eslint-plugin-storybook'
import config from '@helpwave/eslint-config'
import importPlugin from 'eslint-plugin-import'

export default [
  {
    plugins: {
      import: importPlugin,
    },
    rules: {
      'import/no-internal-modules': [
        'error',
        {
          forbid: ['**/index', '**/index.ts', '**/index.tsx'],
        },
      ],
    },
  },
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