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
    ignores: ['node_modules/**'],
  },
  ...config.recommended,
  {
    rules: {
      indent: ['warn', 2]
    }
  }
]
