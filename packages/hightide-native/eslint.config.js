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
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/*', '@/'],
              message: 'Use relative imports within the package instead of the @/ alias.',
            },
          ],
        },
      ],
    },
  },
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
